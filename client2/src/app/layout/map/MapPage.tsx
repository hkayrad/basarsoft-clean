import { useRef, useState } from "react";
import { Map } from "ol";
import "./style/map.css";
import "ol/ol.css";
import MapComponent from "./MapComponent";
import DrawComponent from "./DrawComponent";
import type VectorSource from "ol/source/Vector";
import ControlComponent from "./ControlComponent";
import DataComponent from "./DataComponent";

export default function MapPage() {
    const mapRef = useRef<HTMLDivElement>(null!);
    const drawSourceRef = useRef<VectorSource>(null!);

    const [map, setMap] = useState<Map | null>(null);
    const [drawType, setDrawType] = useState<
        "Point" | "LineString" | "Polygon"
    >("Point");
    const [newFeatureWkt, setNewFeatureWkt] = useState<string[]>([]);

    const [isDrawMode, setIsDrawMode] = useState(false);
    const [isFreehand, setIsFreehand] = useState(false);
    const [isFeatureLayerVisible, setIsFeatureLayerVisible] = useState(true);

    return (
        <>
            <div id="mouse-position" className="mouse-position"></div>
            <MapComponent
                mapRef={mapRef}
                drawSourceRef={drawSourceRef}
                setMap={setMap}
            >
                <DataComponent map={map} />
                <ControlComponent
                    map={map}
                    isDrawMode={isDrawMode}
                    setIsDrawMode={setIsDrawMode}
                    drawType={drawType}
                    setDrawType={setDrawType}
                    isFreehand={isFreehand}
                    setIsFreehand={setIsFreehand}
                    newFeatureWkt={newFeatureWkt}
                    setNewFeatureWkt={setNewFeatureWkt}
                    drawSourceRef={drawSourceRef}
                    isFeatureLayerVisible={isFeatureLayerVisible}
                    setIsFeatureLayerVisible={setIsFeatureLayerVisible}
                />
                <DrawComponent
                    map={map}
                    drawSourceRef={drawSourceRef}
                    isDrawMode={isDrawMode}
                    drawType={drawType}
                    isFreehand={isFreehand}
                    newFeatureWkt={newFeatureWkt}
                    setNewFeatureWkt={setNewFeatureWkt}
                />
            </MapComponent>
        </>
    );
}
