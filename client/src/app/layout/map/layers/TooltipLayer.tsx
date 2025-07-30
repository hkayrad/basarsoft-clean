import { Feature, Map, MapBrowserEvent } from "ol";
import { useEffect } from "react";
import { Overlay } from "ol";
import type VectorLayer from "ol/layer/Vector";
import type WebGLVectorLayer from "ol/layer/WebGLVector";
import { getArea } from "ol/sphere";
import type { Polygon } from "ol/geom";

type Props = {
    map: Map | null;
    dataLayerRef: React.RefObject<VectorLayer>;
    roadLayerRef: React.RefObject<WebGLVectorLayer>;
    isDrawMode: boolean;
    isContextMenuOpen: boolean;
    selectedFeatures: Feature[];
};

export default function TooltipLayer(props: Props) {
    const {
        map,
        dataLayerRef,
        roadLayerRef,
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

            if (
                hoveredFeature &&
                dataLayerRef.current &&
                roadLayerRef.current
            ) {
                if (
                    !dataLayerRef.current
                        .getSource()!
                        .getFeatures()
                        .includes(hoveredFeature) &&
                    !roadLayerRef.current
                        .getSource()!
                        .getFeatures()
                        .includes(hoveredFeature)
                )
                    return;

                const featureName =
                    hoveredFeature.get("name") || "Unknown Feature";
                const featureId = hoveredFeature.get("id") || "";

                tooltipElement.style.display = "flex";
                tooltipElement.innerHTML = `
                        <p><strong>${featureName}</strong></p><br />
                        ID: ${featureId}
                    `;

                if (hoveredFeature.getGeometry()?.getType() === "Polygon") {
                    const area = getArea(
                        hoveredFeature.getGeometry() as Polygon,
                        { projection: "EPSG:4326" }
                    );

                    if (area > 10000) {
                        tooltipElement.innerHTML += `<br /><br /><p>Area: ${
                            Math.round((area / 1000000) * 100) / 100
                        } km²</p>`;
                    } else {
                        tooltipElement.innerHTML += `<br /><br /><p>Area: ${
                            Math.round(area * 100) / 100
                        } m²</p>`;
                    }
                }

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
