import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import type { WktFeature } from "../../types";
import "../shared/styles/editFeatureModal/editFeatureModal.css";

type Props = {
    feature: WktFeature | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, name: string, wkt: string) => Promise<void>;
};

export default function EditFeatureModal({
    feature,
    isOpen,
    onClose,
    onSave,
}: Props) {
    const [name, setName] = useState("");
    const [wkt, setWkt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (feature) {
            setName(feature.name || "");
            setWkt(feature.wkt || "");
        }
    }, [feature]);

    const handleSave = async () => {
        if (!feature?.id) return;

        setIsLoading(true);
        try {
            await onSave(feature.id, name, wkt);
            onClose();
        } catch (error) {
            console.error("Error saving feature:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen || !feature) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Feature</h2>
                    <button
                        className="btn btn-close"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="feature-name">Name:</label>
                        <input
                            id="feature-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter feature name"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="feature-wkt">WKT:</label>
                        <textarea
                            id="feature-wkt"
                            value={wkt}
                            onChange={(e) => setWkt(e.target.value)}
                            placeholder="Enter WKT geometry"
                            rows={6}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        <Save size={16} />
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
