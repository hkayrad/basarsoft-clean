import Map from "ol/Map";
import {
    MapPin,
    Minus,
    Square,
    Edit3,
    Check,
    X,
    Eye,
    EyeClosed,
    Layers2,
} from "lucide-react";
import type VectorSource from "ol/source/Vector";
import { useState } from "react";

type Props = {
    map: Map | null;
    isDrawMode: boolean;
    setIsDrawMode: (isDrawMode: boolean) => void;
    drawType: "Point" | "LineString" | "Polygon";
    setDrawType: (drawType: "Point" | "LineString" | "Polygon") => void;
    isFreehand: boolean;
    setIsFreehand: (isFreehand: boolean) => void;
    newFeatureWkt?: string[];
    setNewFeatureWkt: (wkt: string[]) => void;
    drawSourceRef: React.RefObject<VectorSource>;
    isFeatureLayerVisible: boolean;
    setIsFeatureLayerVisible: (isVisible: boolean) => void;
};

export default function ControlComponent(props: Props) {
    const {
        map,
        isDrawMode,
        setIsDrawMode,
        drawType,
        setDrawType,
        isFreehand,
        setIsFreehand,
        newFeatureWkt,
        setNewFeatureWkt,
        drawSourceRef,
        isFeatureLayerVisible,
        setIsFeatureLayerVisible,
    } = props;

    const [isControlsVisible, setIsControlsVisible] = useState(true);

    const handleStartDrawing = () => {
        if (map) if (!isDrawMode) setIsDrawMode(true);
    };

    const handleSaveDrawing = () => {
        if (map) setIsDrawMode(false);
        console.log("New Feature Saved: ", newFeatureWkt);
        setNewFeatureWkt([]);
    };

    const handleCancelDrawing = () => {
        if (map) setIsDrawMode(false);
        console.log("Drawing cancelled");
        drawSourceRef?.current.clear();
        setNewFeatureWkt([]);
    };

    const handleDrawTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDrawType(event.target.value as "Point" | "LineString" | "Polygon");
    };

    const handleFreehandToggle = () => {
        setIsFreehand(!isFreehand);
    };

    const handleFeatureLayerToggle = () => {
        setIsFeatureLayerVisible(!isFeatureLayerVisible);
    };

    const toggleControlsVisibility = () => {
        setIsControlsVisible(!isControlsVisible);
    };

    return (
        <>
            <div
                id="collapse-button"
                onClick={toggleControlsVisibility}
                style={{
                    transform: isControlsVisible
                        ? "translateX(-220px)"
                        : "translateX(0)",
                }}
            >
                {isControlsVisible ? (
                    <Layers2 size={16} />
                ) : (
                    <Layers2 size={16} />
                )}
            </div>
            <div
                id="controls"
                style={{
                    transform: isControlsVisible
                        ? "translateX(0)"
                        : "translateX(100%)",
                }}
            >
                <button onClick={handleFeatureLayerToggle}>
                    {isFeatureLayerVisible ? (
                        <>
                            <Eye size={16} /> Hide Data
                        </>
                    ) : (
                        <>
                            <EyeClosed size={16} /> Show Data
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
                            checked={isFreehand}
                            onChange={handleFreehandToggle}
                        />
                        Freehand
                    </label>
                </div>
                {!isDrawMode ? (
                    <button id="toggle-draw" onClick={handleStartDrawing}>
                        <Edit3 size={16} /> Start Drawing
                    </button>
                ) : (
                    <div id="drawing-controls">
                        <button id="save-draw" onClick={handleSaveDrawing}>
                            <Check size={16} />
                        </button>
                        <button id="cancel-draw" onClick={handleCancelDrawing}>
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
