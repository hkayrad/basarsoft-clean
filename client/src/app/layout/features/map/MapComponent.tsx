import { View, Map, Feature } from "ol";
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

export default function MapComponent() {
    const { features } = useContext(FeaturesContext);
    const [map, setMap] = useState<Map | null>(null);
    const featuresLayerRef = useRef<VectorLayer | null>(null);
    const [isFeatureLayerOpen, setIsFeatureLayerOpen] = useState(true);

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

        const map = new Map({
            target: "map",
            layers: [tileLayer],
            view: view,
            controls: defaultControls().extend([mousePosControl]),
        });

        setMap(map);

        return () => {
            if (map) {
                map.setTarget(undefined);
            }
        };
    }, []);

    useEffect(() => {
        const format = new WKT();

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
    }, [features, map, isFeatureLayerOpen]);

    const toggleFeatureLayer = () => {
        setIsFeatureLayerOpen(!isFeatureLayerOpen);
    };

    return (
        <>
            <div id="controls" className="overlay">
                <button onClick={toggleFeatureLayer}>
                    {isFeatureLayerOpen ? "Hide" : "Show"} Features
                </button>
                <div id="draw-select">
                    <select id="draw-type">
                        <option value="point">Point</option>
                        <option value="line">Line</option>
                        <option value="polygon">Polygon</option>
                    </select>
                    <button id="draw">Draw</button>
                </div>
            </div>
            <div id="mouse-pos" className="overlay"></div>
            <div id="map"></div>
        </>
    );
}
