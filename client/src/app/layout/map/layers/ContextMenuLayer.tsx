import { Pencil, Trash } from "lucide-react";
import "../style/contextMenu/contextMenu.css";
import type Feature from "ol/Feature";
import Map from "ol/Map";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WktFeature } from "../../../../types";
import { deleteFeature } from "../../../../lib/api/features/delete";
import { getAllFeatures } from "../../../../lib/api/features/get";
import EditFeatureModal from "../../../shared/EditFeatureModal";
import { WKT } from "ol/format";
import { updateFeature } from "../../../../lib/api/features/put";

type Props = {
    map: Map | null;
    mapRef: React.RefObject<HTMLDivElement>;
    selectedFeatures: Feature[];
    isContextMenuOpen: boolean;
    setIsContextMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
    setSelectedFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
};

export default function ContextMenuLayer(props: Props) {
    const {
        map,
        mapRef,
        selectedFeatures,
        isContextMenuOpen,
        setIsContextMenuOpen,
        setSelectedFeatures,
        setWktFeatures,
    } = props;

    const contextMenuRef = useRef<HTMLDivElement>(null);

    const [editingFeature, setEditingFeature] = useState<WktFeature | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!map || !mapRef.current) return;

        const contextMenu = contextMenuRef.current;
        if (!contextMenu) return;

        mapRef.current.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            if (selectedFeatures.length === 0) {
                setIsContextMenuOpen(false);
                return;
            }

            setIsContextMenuOpen(true);
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.top = `${event.clientY}px`;
        });

        mapRef.current.addEventListener("click", () => {
            setIsContextMenuOpen(false);
        });

        return () => {
            mapRef.current?.removeEventListener("contextmenu", () => {});
            // eslint-disable-next-line react-hooks/exhaustive-deps
            mapRef.current?.removeEventListener("click", () => {});
        };
    }, [map, selectedFeatures, mapRef, setIsContextMenuOpen]);

    useEffect(() => {
        const contextMenu = contextMenuRef.current;
        if (!contextMenu) return;

        contextMenu.style.display = isContextMenuOpen ? "flex" : "none";
    }, [isContextMenuOpen]);

    const handleDeleteFeature = useCallback(async () => {
        if (selectedFeatures.length === 0) return;

        try {
            const deletePromises = selectedFeatures.map(async (feature) => {
                const featureId = feature.get("id");
                if (featureId) await deleteFeature(featureId);
            });

            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Error deleting features:", error);
        } finally {
            getAllFeatures(setWktFeatures);
            setSelectedFeatures([]);
            setIsContextMenuOpen(false);
        }
    }, [
        selectedFeatures,
        setIsContextMenuOpen,
        setSelectedFeatures,
        setWktFeatures,
    ]);

    const handleEditFeature = () => {
        if (selectedFeatures.length === 0) return;

        if (selectedFeatures.length > 1) {
            alert("Please select only one feature to edit.");
            return;
        }

        const feature: WktFeature = {
            id: selectedFeatures[0].get("id"),
            name: selectedFeatures[0].get("name") || "",
            wkt: new WKT().writeFeature(selectedFeatures[0]) || "",
        };

        setEditingFeature(feature);
        setIsModalOpen(true);
        setIsContextMenuOpen(false);
        setSelectedFeatures([]);

        // Implement feature editing logic here
        // For example, open a modal to edit feature properties
    };

    const handleSaveFeature = async (id: number, name: string, wkt: string) => {
        const feature: WktFeature = {
            name: name,
            wkt: wkt,
        };

        console.log("Saving feature:", id, feature);

        await updateFeature(id, feature);
        await getAllFeatures(setWktFeatures);
        setIsModalOpen(false);
        setEditingFeature(null);
        setSelectedFeatures([]);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFeature(null);
    };

    // useEffect(() => {
    //     if (selectedFeatures.length === 0) return;

    //     window.addEventListener("keydown", (event) => {
    //         if (event.key === "Delete") {
    //             handleDeleteFeature();
    //         }
    //     });
    // }, [
    //     handleDeleteFeature,
    //     selectedFeatures,
    //     setIsContextMenuOpen,
    //     setSelectedFeatures,
    // ]);

    return (
        <>
            <div
                id="context-menu"
                className="context-menu"
                ref={contextMenuRef}
            >
                {
                    <button
                        className="context-button"
                        onClick={handleEditFeature}
                    >
                        <Pencil size={16} /> Edit Feature
                    </button>
                }
                <button
                    className="context-button danger"
                    onClick={handleDeleteFeature}
                >
                    <Trash size={16} /> Delete Feature
                </button>
            </div>
            <EditFeatureModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                feature={editingFeature}
                onSave={handleSaveFeature}
            />
        </>
    );
}
