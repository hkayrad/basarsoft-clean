import { View, Map, Feature, Overlay } from "ol";
import "./map.css";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useContext, useEffect, useRef, useState } from "react";
import Projection from "ol/proj/Projection";
import FeaturesContext from "../../../lib/context/featureContext";

import WKT from "ol/format/WKT";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import type { Units } from "ol/proj/Units";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import { defaults as defaultControls } from "ol/control";
import Draw from "ol/interaction/Draw";
import type { Type } from "ol/geom/Geometry";
import type Geometry from "ol/geom/Geometry";
import { saveFeature } from "../../../lib/api/agent";

export default function MapComponent() {
    const { features } = useContext(FeaturesContext);

    const featuresLayerRef = useRef<VectorLayer | null>(null);
    const drawSourceRef = useRef<VectorSource | null>(null);
    const mapDivRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const [map, setMap] = useState<Map | null>(null);
    const [drawType, setDrawType] = useState<string>("Point");
    const [newFeatureName, setNewFeatureName] = useState<string>("");
    const [newWkt, setNewWkt] = useState<string[]>([]);

    const [isFeatureLayerOpen, setIsFeatureLayerOpen] = useState(true);
    const [isDrawMode, setIsDrawMode] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const format = new WKT();

    useEffect(() => {
        const MAP_CONFIG = {
            center: [35.25, 39],
            zoom: 7,
            projection: {
                code: "EPSG:4326",
                units: "degrees" as Units,
            },
        };

        const mousePosControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: MAP_CONFIG.projection.code,
            className: "mouse-position",
            target: document.getElementById("mouse-pos") as HTMLElement,
        });

        const view = new View({
            center: MAP_CONFIG.center,
            projection: new Projection(MAP_CONFIG.projection),
            zoom: MAP_CONFIG.zoom,
        });

        const tileLayer = new TileLayer({
            source: new OSM(),
        });

        const drawSource = new VectorSource({
            wrapX: false,
        });
        drawSourceRef.current = drawSource;

        const drawLayer = new VectorLayer({
            source: drawSourceRef.current,
        });

        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [tileLayer, drawLayer],
            view: view,
            controls: defaultControls().extend([mousePosControl]),
        });

        const tooltip = new Overlay({
            element: tooltipRef.current as HTMLDivElement,
            offset: [15, 0],
            positioning: "center-left",
        });

        map.addOverlay(tooltip);

        map.on("pointermove", (event) => {
            const hoveredFeature = map.forEachFeatureAtPixel(
                event.pixel,
                (feature) => feature
            );

            if (hoveredFeature && featuresLayerRef.current) {
                const featureName =
                    hoveredFeature.get("name") || "Unknown Feature";
                const featureId = hoveredFeature.get("id") || "";

                if (tooltipRef.current) {
                    tooltipRef.current.style.display = "flex";
                    tooltipRef.current.innerHTML = `
                        <p><strong>${featureName}</strong></p><br />
                        ID: ${featureId}
                    `;
                }
                tooltip.setPosition(event.coordinate);
            } else {
                if (tooltipRef.current) {
                    tooltipRef.current.style.display = "none";
                }
                tooltip.setPosition(undefined);
            }
        });

        setMap(map);

        return () => {
            if (map) {
                map.setTarget(undefined);
            }
        };
    }, []);

    useEffect(() => {
        if (map && features.length > 0) {
            if (featuresLayerRef.current)
                map.removeLayer(featuresLayerRef.current);

            const featuresSource = new VectorSource({
                features: features.map((feature) => {
                    return new Feature({
                        geometry: format.readGeometry(feature.wkt),
                        id: feature.id,
                        name: feature.name,
                    });
                }),
            });

            const featuresLayer = new VectorLayer({
                source: featuresSource,
            });
            featuresLayerRef.current = featuresLayer;

            if (isFeatureLayerOpen) {
                map.addLayer(featuresLayer);
            }
        }
    }, [features, map, isFeatureLayerOpen, format]);

    useEffect(() => {
        const draw = new Draw({
            source: drawSourceRef.current as VectorSource,
            type: drawType as Type,
        });

        if (map) {
            if (isDrawMode) {
                map.addInteraction(draw);
            } else {
                map.removeInteraction(draw);
            }
        }

        draw.on("drawend", (event) => {
            const feature = event.feature;
            const geometry = feature.getGeometry();
            const wkt: string = format.writeGeometry(geometry as Geometry);
            setNewWkt((prev) => [...prev, wkt]);
        });

        return () => {
            if (map && isDrawMode) {
                map.removeInteraction(draw);
            }
        };
    }, [map, isDrawMode, drawType, format]);

    const startDrawing = () => {
        setIsDrawMode(true);
    };

    const stopDrawing = () => {
        setIsDrawMode(false);
        toggleSaveDialog();
    };

    const toggleFeatureLayer = () => setIsFeatureLayerOpen(!isFeatureLayerOpen);

    const toggleSaveDialog = () => setIsSaveDialogOpen(!isSaveDialogOpen);

    const handleDrawTypeChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        setDrawType(event.target.value);
    };

    const handleSaveFeature = async () => {
        const newFeature: FeatureDto = {
            name: newFeatureName,
            wkt:
                newWkt.length > 0
                    ? newWkt.length == 1
                        ? newWkt[0]
                        : `GEOMETRYCOLLECTION(${newWkt.join(", ")})`
                    : "",
        };
        if (newFeature.wkt) {
            await saveFeature(newFeature);
            console.log("Feature saved:", newFeature);
        } else {
            console.error("No valid geometry to save.");
        }

        setNewFeatureName("");
        setNewWkt([]);
        toggleSaveDialog();
    };

    return (
        <>
            <div id="controls" className="overlay">
                <button onClick={toggleFeatureLayer}>
                    {isFeatureLayerOpen ? "Hide" : "Show"} Features
                </button>
                <div id="draw-select">
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="drawType"
                                value="Point"
                                checked={drawType === "Point"}
                                onChange={handleDrawTypeChange}
                            />
                            Point
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="drawType"
                                value="LineString"
                                checked={drawType === "LineString"}
                                onChange={handleDrawTypeChange}
                            />
                            LineString
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="drawType"
                                value="Polygon"
                                checked={drawType === "Polygon"}
                                onChange={handleDrawTypeChange}
                            />
                            Polygon
                        </label>
                    </div>
                    <button
                        id="draw"
                        onClick={isDrawMode ? stopDrawing : startDrawing}
                    >
                        {isDrawMode ? "Finish Drawing" : "Start Drawing"}
                    </button>
                </div>
            </div>
            {isSaveDialogOpen && (
                <div id="saveDialog" className="overlay">
                    <input
                        type="text"
                        placeholder="Feature Name"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                    />
                    <button onClick={handleSaveFeature}>Save Feature</button>
                    <button onClick={toggleSaveDialog}>Cancel</button>
                </div>
            )}
            <div id="mouse-pos" className="overlay"></div>
            <div id="tooltip" ref={tooltipRef} className="overlay"></div>{" "}
            {/* NIYE GOZUKMUYO MK */}
            <div id="map-extent" className="overlay"></div>
            <div id="map" ref={mapDivRef}></div>
        </>
    );
}
