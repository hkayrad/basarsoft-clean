import "ol/ol.css";

import MapLayer from "./layers/MapLayer";
import DrawLayer from "./layers/DrawLayer";
import ControlLayer from "./layers/ControlLayer";

import { useRef, useState } from "react";
import { Feature, Map } from "ol";
import type VectorSource from "ol/source/Vector";
import DataLayer from "./layers/DataLayer";
import type { WktFeature } from "../../../types";
import type Draw from "ol/interaction/Draw";
import ModifyDrawingComponent from "./components/ModifyDrawingComponent";
import type VectorLayer from "ol/layer/Vector";
import TooltipLayer from "./layers/TooltipLayer";
import SelectLayer from "./layers/SelectLayer";
import EditLayer from "./layers/EditLayer";
import TranslateLayer from "./layers/TranslateLayer";
import ContextMenuLayer from "./layers/ContextMenuLayer";
import type WebGLVectorLayer from "ol/layer/WebGLVector";

export default function MapPage() {
    const mapRef = useRef<HTMLDivElement>(null!);
    const drawSourceRef = useRef<VectorSource>(null!);
    const drawRef = useRef<Draw>(null!);
    const drawLayerRef = useRef<VectorLayer>(null!);
    const dataLayerRef = useRef<VectorLayer>(null!);
    const roadLayerRef = useRef<WebGLVectorLayer>(null!);

    const [map, setMap] = useState<Map | null>(null);
    const [drawType, setDrawType] = useState<
        "Point" | "LineString" | "Polygon"
    >("Point");
    const [editType, setEditType] = useState<"Edit" | "Translate">("Edit");
    const [newFeatures, setNewFeatures] = useState<WktFeature[]>([]);
    const [wktFeatures, setWktFeatures] = useState<WktFeature[]>([]);
    const [wktRoads, setWktRoads] = useState<WktFeature[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

    const [isDrawMode, setIsDrawMode] = useState(false);
    const [isFreehand, setIsFreehand] = useState(false);
    const [isFeatureLayerVisible, setIsFeatureLayerVisible] = useState(true);
    const [isRoadLayerVisible, setIsRoadLayerVisible] = useState(true);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

    return (
        <>
            <MapLayer
                map={map}
                mapRef={mapRef}
                setMap={setMap}
                setWktFeatures={setWktFeatures}
                setRoadFeatures={setWktRoads}
            >
                <ContextMenuLayer
                    map={map}
                    mapRef={mapRef}
                    selectedFeatures={selectedFeatures}
                    isContextMenuOpen={isContextMenuOpen}
                    setIsContextMenuOpen={setIsContextMenuOpen}
                    setWktFeatures={setWktFeatures}
                    setSelectedFeatures={setSelectedFeatures}
                />
                <DataLayer
                    map={map}
                    wktFeatures={wktFeatures}
                    wktRoads={wktRoads}
                    isFeatureLayerVisible={isFeatureLayerVisible}
                    isRoadLayerVisible={isRoadLayerVisible}
                    dataLayerRef={dataLayerRef}
                    roadLayerRef={roadLayerRef}
                />
                <ControlLayer
                    map={map}
                    isDrawMode={isDrawMode}
                    setIsDrawMode={setIsDrawMode}
                    drawType={drawType}
                    setDrawType={setDrawType}
                    editType={editType}
                    setEditType={setEditType}
                    isFreehand={isFreehand}
                    setIsFreehand={setIsFreehand}
                    newFeatures={newFeatures}
                    setNewFeatures={setNewFeatures}
                    drawSourceRef={drawSourceRef}
                    isFeatureLayerVisible={isFeatureLayerVisible}
                    setIsFeatureLayerVisible={setIsFeatureLayerVisible}
                    isRoadLayerVisible={isRoadLayerVisible}
                    setIsRoadLayerVisible={setIsRoadLayerVisible}
                    drawRef={drawRef}
                    setWktFeatures={setWktFeatures}
                />
                <DrawLayer
                    map={map}
                    drawSourceRef={drawSourceRef}
                    isDrawMode={isDrawMode}
                    drawType={drawType}
                    isFreehand={isFreehand}
                    newFeatures={newFeatures}
                    setNewFeatures={setNewFeatures}
                    drawRef={drawRef}
                    drawLayerRef={drawLayerRef}
                >
                    <ModifyDrawingComponent
                        map={map}
                        drawSourceRef={drawSourceRef}
                        isDrawMode={isDrawMode}
                        isFreehand={isFreehand}
                        newFeatures={newFeatures}
                        setNewFeatures={setNewFeatures}
                    />
                </DrawLayer>
                <TooltipLayer
                    map={map}
                    isContextMenuOpen={isContextMenuOpen}
                    dataLayerRef={dataLayerRef}
                    isDrawMode={isDrawMode}
                    selectedFeatures={selectedFeatures}
                />
                <SelectLayer
                    map={map}
                    isDrawMode={isDrawMode}
                    setSelectedFeatures={setSelectedFeatures}
                    dataLayerRef={dataLayerRef}
                />
                {!isContextMenuOpen &&
                    (editType === "Edit" ? (
                        <EditLayer
                            map={map}
                            selectedFeatures={selectedFeatures}
                        />
                    ) : (
                        <TranslateLayer
                            map={map}
                            selectedFeatures={selectedFeatures}
                        />
                    ))}
            </MapLayer>
        </>
    );
}
