import "../style/controls/controls.css";

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
    Move,
    Pencil,
    Save,
} from "lucide-react";
import type VectorSource from "ol/source/Vector";
import { useState } from "react";
import type Draw from "ol/interaction/Draw";
import type { WktFeature } from "../../../../types";
import { getAllFeatures } from "../../../../lib/api/features/get";
import { addFeature } from "../../../../lib/api/features/post";

type Props = {
    map: Map | null;
    isDrawMode: boolean;
    setIsDrawMode: (isDrawMode: boolean) => void;
    drawType: "Point" | "LineString" | "Polygon";
    setDrawType: (drawType: "Point" | "LineString" | "Polygon") => void;
    editType: "Edit" | "Translate";
    setEditType: (editType: "Edit" | "Translate") => void;
    isFreehand: boolean;
    setIsFreehand: (isFreehand: boolean) => void;
    newFeatures?: WktFeature[];
    setNewFeatures: (newFeature: WktFeature[]) => void;
    drawSourceRef: React.RefObject<VectorSource>;
    isFeatureLayerVisible: boolean;
    setIsFeatureLayerVisible: (isVisible: boolean) => void;
    drawRef: React.RefObject<Draw>;
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
};

export default function ControlLayer(props: Props) {
    const {
        map,
        isDrawMode,
        setIsDrawMode,
        drawType,
        setDrawType,
        editType,
        setEditType,
        isFreehand,
        setIsFreehand,
        newFeatures,
        setNewFeatures,
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
        if (!map) return;
        setIsDrawMode(false);
        setIsSaveDialogOpen(true);
    };

    const handleCancelDrawing = () => {
        if (!map) return;
        setIsDrawMode(false);
        console.log("Drawing cancelled");
        drawSourceRef.current.clear();
        setNewFeatures([]);
    };

    const handleDrawTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDrawType(event.target.value as "Point" | "LineString" | "Polygon");
    };

    const handleEditTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditType(event.target.value as "Edit" | "Translate");
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
        if (newFeatures && newFeatures.length > 0) {
            const newFeatureWktString =
                newFeatures.length > 1
                    ? `GEOMETRYCOLLECTION(${newFeatures
                          .map((f) => f.wkt)
                          .join(",")})`
                    : newFeatures[0].wkt;

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
            setNewFeatures([]);

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

    const renderDataControls = () => (
        <div className="control-category">
            <span className="category-label">Data</span>
            <button
                id="toggle-feature-layer"
                onClick={handleFeatureLayerToggle}
            >
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
        </div>
    );

    const renderDrawTypeOptions = () => (
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
    );

    const renderDrawingControls = () => (
        <div id="drawing-controls">
            <button
                id="save-draw"
                onClick={handleSaveDrawing}
                disabled={!newFeatures || newFeatures.length === 0}
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
    );

    const renderDrawControls = () => (
        <div className="control-category">
            <span className="category-label">Draw</span>
            {renderDrawTypeOptions()}
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
                renderDrawingControls()
            )}
        </div>
    );

    const renderEditControls = () => (
        <div className="control-category">
            <span className="category-label">Edit</span>
            <div id="edit-type-select">
                <div>
                    <label>
                        <input
                            type="radio"
                            name="editType"
                            value="Edit"
                            checked={editType === "Edit"}
                            onChange={handleEditTypeChange}
                        />
                        <Pencil size={16} />
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="editType"
                            value="Translate"
                            checked={editType === "Translate"}
                            onChange={handleEditTypeChange}
                        />
                        <Move size={16} />
                    </label>
                </div>
            </div>
        </div>
    );

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
                                <Save size={16} /> Save
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
                id="controls"
                style={{
                    transform: isControlsVisible
                        ? "translateX(0)"
                        : "translateX(100%)",
                }}
            >
                {renderDataControls()}
                {renderDrawControls()}
                {renderEditControls()}
            </div>
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
        </>
    );
}
