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
    ChevronRight,
    Undo,
} from "lucide-react";
import type VectorSource from "ol/source/Vector";
import { useState } from "react";
import type Draw from "ol/interaction/Draw";
import type { WktFeature } from "../../../types";
import { getAllFeatures } from "../../../lib/api/features/get";
import { addFeature } from "../../../lib/api/features/post";

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
    drawRef: React.RefObject<Draw>;
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
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
        drawRef,
        setWktFeatures,
    } = props;

    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

    const [featureName, setFeatureName] = useState("");

    const handleStartDrawing = () => {
        if (map) if (!isDrawMode) setIsDrawMode(true);
    };

    const handleSaveDrawing = () => {
        if (map) setIsDrawMode(false);
        setIsSaveDialogOpen(true);
    };

    const handleCancelDrawing = () => {
        if (map) setIsDrawMode(false);
        console.log("Drawing cancelled");
        drawSourceRef.current.clear();
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

    const handleUndoDrawing = () => {
        drawRef.current?.removeLastPoint();
    };

    const handleSaveFeature = async () => {
        if (newFeatureWkt && newFeatureWkt.length > 0) {
            const newFeatureWktString =
                newFeatureWkt.length > 1
                    ? `GEOMETRYCOLLECTION(${newFeatureWkt.join(",")})`
                    : newFeatureWkt[0];

            const featureData: WktFeature = {
                name: featureName,
                wkt: newFeatureWktString,
            };

            try {
                addFeature(featureData).then(() => {
                    getAllFeatures(setWktFeatures);
                });
            } catch (error) {
                console.error("Error saving feature:", error);
            }

            setIsSaveDialogOpen(false);
            setFeatureName("");
            setNewFeatureWkt([]);

            drawSourceRef.current.clear();
        } else {
            console.error("No feature data to save");
        }
    };

    const handleCancelSave = () => {
        setIsSaveDialogOpen(false);
        setIsDrawMode(true);
    };

    const toggleControlsVisibility = () => {
        setIsControlsVisible(!isControlsVisible);
    };

    return (
        <>
            {isSaveDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <div className="dialog-header">
                            <h3>Save Feature</h3>
                        </div>
                        <div className="dialog-content">
                            <label htmlFor="feature-name">Feature Name:</label>
                            <input
                                id="feature-name"
                                type="text"
                                value={featureName}
                                onChange={(e) => setFeatureName(e.target.value)}
                                placeholder="Enter feature name"
                                autoFocus
                            />
                        </div>
                        <div className="dialog-actions">
                            <button
                                className="dialog-button primary"
                                onClick={handleSaveFeature}
                                disabled={!featureName.trim()}
                            >
                                <Check size={16} /> Save
                            </button>
                            <button
                                className="dialog-button secondary"
                                onClick={handleCancelSave}
                            >
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                    <ChevronRight size={20} />
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
                        <button
                            id="save-draw"
                            onClick={handleSaveDrawing}
                            disabled={
                                !newFeatureWkt || newFeatureWkt.length === 0
                            }
                        >
                            <Check size={16} />
                        </button>
                        <button id="undo-draw" onClick={handleUndoDrawing}>
                            <Undo size={16} />
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
