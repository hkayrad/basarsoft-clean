import { Feature, Map, MapBrowserEvent } from "ol";
import { useEffect } from "react";
import { Overlay } from "ol";
import type VectorLayer from "ol/layer/Vector";

type Props = {
    map: Map | null;
    dataLayerRef: React.RefObject<VectorLayer>;
    isDrawMode: boolean;
    isContextMenuOpen: boolean;
    selectedFeatures: Feature[];
};

export default function TooltipLayer(props: Props) {
    const {
        map,
        dataLayerRef,
        isDrawMode,
        isContextMenuOpen,
        selectedFeatures,
    } = props;

    useEffect(() => {
        if (!map) return;

        const tooltipElement = document.createElement("div");
        tooltipElement.className = "ol-tooltip";

        const tooltip = new Overlay({
            element: tooltipElement,
            offset: [15, 0],
            positioning: "center-left",
        });

        if (
            !isDrawMode &&
            selectedFeatures.length === 0 &&
            !isContextMenuOpen
        ) {
            map.addOverlay(tooltip);
        }

        const handlePointerMove = (event: MapBrowserEvent) => {
            const hoveredFeature = map.forEachFeatureAtPixel(
                event.pixel,
                (feature) => feature
            );

            if (hoveredFeature && dataLayerRef.current) {
                if (!dataLayerRef.current.getSource()!.getFeatures().includes(hoveredFeature)) 
                    return;

                const featureName =
                    hoveredFeature.get("name") || "Unknown Feature";
                const featureId = hoveredFeature.get("id") || "";

                tooltipElement.style.display = "flex";
                tooltipElement.innerHTML = `
                        <p><strong>${featureName}</strong></p><br />
                        ID: ${featureId}
                    `;
                tooltip.setPosition(event.coordinate);
            } else {
                tooltipElement.style.display = "none";
                tooltip.setPosition(undefined);
            }
        };

        map.on("pointermove", handlePointerMove);

        return () => {
            map.un("pointermove", handlePointerMove);
            map.removeOverlay(tooltip);
        };
    }, [dataLayerRef, map, isDrawMode, selectedFeatures, isContextMenuOpen]);

    return null;
}
