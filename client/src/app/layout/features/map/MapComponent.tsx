import { View, Map, Feature, Overlay } from "ol";
import "./map.css";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useContext, useEffect, useRef, useState } from "react";
import Projection from "ol/proj/Projection";
import FeaturesContext from "../../../lib/context/featureContext";
import {
    Eye,
    EyeOff,
    MapPin,
    Minus,
    Square,
    Edit3,
    Check,
    Undo2,
    Save,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import WKT from "ol/format/WKT";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import type { Units } from "ol/proj/Units";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import { defaults as defaultControls } from "ol/control";
import Draw from "ol/interaction/Draw";
import type { Type } from "ol/geom/Geometry";
import Geometry from "ol/geom/Geometry";
import { saveFeature } from "../../../lib/api/agent";

export default function MapComponent() {
    const { features, getFeatures } = useContext(FeaturesContext);

    const featuresLayerRef = useRef<VectorLayer | null>(null);
    const drawSourceRef = useRef<VectorSource | null>(null);
    const mapDivRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const undoButtonRef = useRef<HTMLButtonElement | null>(null);

    const [map, setMap] = useState<Map | null>(null);
    const [drawType, setDrawType] = useState<string>("Point");
    const [newFeatureName, setNewFeatureName] = useState<string>("");
    const [newWkt, setNewWkt] = useState<string[]>([]);

    const [isFeatureLayerOpen, setIsFeatureLayerOpen] = useState(true);
    const [isDrawMode, setIsDrawMode] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);
    const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
    const [isFreehandMode, setIsFreehandMode] = useState(false);

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
            freehand: isFreehandMode,
        });

        if (map) {
            if (isDrawMode) {
                map.addInteraction(draw);
            } else {
                map.removeInteraction(draw);
            }
        }

        undoButtonRef.current?.addEventListener("click", () => {
            draw.removeLastPoint();
        });

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
    }, [map, isDrawMode, drawType, isFreehandMode, format]);

    const startDrawing = () => {
        setIsDrawMode(true);
        setIsTooltipVisible(false);
    };

    const stopDrawing = () => {
        setIsDrawMode(false);

        if (newWkt.length > 0) {
            setIsSaveDialogOpen(true);
        }
    };

    const toggleFeatureLayer = () => setIsFeatureLayerOpen(!isFeatureLayerOpen);

    const toggleControlsCollapse = () =>
        setIsControlsCollapsed(!isControlsCollapsed);

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
        drawSourceRef.current?.clear();
        toggleSaveDialog();
        setIsTooltipVisible(true);
        await getFeatures(); // Refresh features after saving
    };

    const handleCancelSaveFeature = () => {
        setNewFeatureName("");
        setNewWkt([]);
        drawSourceRef.current?.clear();
        toggleSaveDialog();
        setIsTooltipVisible(true);
    };

    return (
        <div id="map-container">
            <div
                id="collapse-button"
                className="overlay"
                onClick={toggleControlsCollapse}
                style={{
                    top: "10px",
                    right: isControlsCollapsed ? "10px" : "230px",
                    transition: "right 0.3s ease",
                    cursor: "pointer",
                    backgroundColor: "#343434",
                    padding: "8px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    zIndex: 1001,
                }}
            >
                {isControlsCollapsed ? (
                    <ChevronLeft size={16} color="white" />
                ) : (
                    <ChevronRight size={16} color="white" />
                )}
            </div>
            <div
                id="controls"
                className="overlay"
                style={{
                    transform: isControlsCollapsed
                        ? "translateX(100%)"
                        : "translateX(0)",
                    transition: "transform 0.3s ease",
                }}
            >
                <button onClick={toggleFeatureLayer}>
                    {isFeatureLayerOpen ? (
                        <>
                            <Eye size={16} /> Hide
                        </>
                    ) : (
                        <>
                            <EyeOff size={16} /> Show
                        </>
                    )}
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
                            <MapPin size={16} />
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="drawType"
                                value="LineString"
                                checked={drawType === "LineString"}
                                onChange={handleDrawTypeChange}
                            />
                            <Minus size={16} />
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="drawType"
                                value="Polygon"
                                checked={drawType === "Polygon"}
                                onChange={handleDrawTypeChange}
                            />
                            <Square size={16} />
                        </label>
                    </div>
                </div>
                <div id="freehand-option">
                    <label>
                        <input
                            type="checkbox"
                            checked={isFreehandMode}
                            onChange={(e) =>
                                setIsFreehandMode(e.target.checked)
                            }
                        />
                        Freehand
                    </label>
                </div>
                <div id="draw-buttons">
                    <button
                        id="draw"
                        onClick={isDrawMode ? stopDrawing : startDrawing}
                        style={{
                            backgroundColor: isDrawMode
                                ? "#83c54dff"
                                : "#6a6a6a",
                        }}
                    >
                        {isDrawMode ? (
                            <>
                                <Check size={16} /> Finish
                            </>
                        ) : (
                            <>
                                <Edit3 size={16} /> Draw
                            </>
                        )}
                    </button>
                    <button
                        id="undo"
                        ref={undoButtonRef}
                        style={{ display: isDrawMode ? "flex" : "none" }}
                    >
                        <Undo2 size={16} />
                    </button>
                </div>
            </div>
            {isSaveDialogOpen && (
                <div id="saveDialog" className="overlay">
                    <h3>Save Feature</h3>
                    <input
                        type="text"
                        placeholder="Feature Name"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                    />
                    <div className="button-group">
                        <button onClick={handleSaveFeature}>
                            <Save size={16} /> Save
                        </button>
                        <button onClick={handleCancelSaveFeature}>
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </div>
            )}
            <div id="mouse-pos" className="overlay"></div>
            {/* NIYE GOZUKMUYO MK */}
            <div
                id="tooltip"
                ref={tooltipRef}
                className="overlay"
                style={{ opacity: isTooltipVisible ? 1 : 0 }}
            ></div>
            <div id="map-extent" className="overlay"></div>
            <div id="map" ref={mapDivRef}></div>
        </div>
    );
}
