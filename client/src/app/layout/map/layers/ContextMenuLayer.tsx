import { Pencil, Trash } from "lucide-react";
import "../style/contextMenu/contextMenu.css";
import type Feature from "ol/Feature";
import Map from "ol/Map";
import { useEffect, useRef } from "react";
import type { WktFeature } from "../../../../types";
import { deleteFeature } from "../../../../lib/api/features/delete";
import { getAllFeatures } from "../../../../lib/api/features/get";

type Props = {
    map: Map | null;
    mapRef: React.RefObject<HTMLDivElement>;
    selectedFeatures: Feature[];
    isContextMenuOpen: boolean;
    setIsContextMenuOpen: (isOpen: boolean) => void;
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

    const handleDeleteFeature = async () => {
        if (selectedFeatures.length === 0) return;

        console.log("Deleting features:", selectedFeatures);

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
    };

    const handleEditFeature = () => {
        if (selectedFeatures.length === 0) return;

        console.log("Editing features:", selectedFeatures);
        setIsContextMenuOpen(false);

        // Implement feature editing logic here
        // For example, open a modal to edit feature properties
    };

    return (
        <div id="context-menu" className="context-menu" ref={contextMenuRef}>
            <button className="context-button" onClick={handleEditFeature}>
                <Pencil size={16} /> Edit Name
            </button>
            <button
                className="context-button danger"
                onClick={handleDeleteFeature}
            >
                <Trash size={16} /> Delete Feature
            </button>
        </div>
    );
}
