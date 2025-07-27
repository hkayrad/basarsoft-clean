import { Modify } from "ol/interaction";
import { useEffect } from "react";
import type VectorSource from "ol/source/Vector";
import type Map from "ol/Map";
import type { WktFeature } from "../../../../types";
import { WKT } from "ol/format";

type Props = {
    map: Map | null;
    drawSourceRef: React.RefObject<VectorSource>;
    isDrawMode: boolean;
    isFreehand: boolean;
    newFeatures: WktFeature[];
    setNewFeatures: (newFeature: WktFeature[]) => void;
};

export default function ModifyDrawingComponent(props: Props) {
    const {
        map,
        drawSourceRef,
        isDrawMode,
        isFreehand,
        newFeatures,
        setNewFeatures,
    } = props;

    useEffect(() => {
        if (!map || !drawSourceRef.current || !isDrawMode) return;

        const modifyInteraction = new Modify({
            source: drawSourceRef.current,
        });

        if (isDrawMode && !isFreehand) {
            map.addInteraction(modifyInteraction);
        }

        modifyInteraction.on("modifyend", (event) => {
            const updatedFeature = event.features.getArray()[0];
            const featureId = updatedFeature.getId();
            const updatedWkt = new WKT().writeFeature(updatedFeature);

            const updatedFeatures = newFeatures.map((feature) =>
                feature.id === featureId
                    ? { ...feature, wkt: updatedWkt }
                    : feature
            );

            setNewFeatures(updatedFeatures);
        });

        return () => {
            map.removeInteraction(modifyInteraction);
        };
    }, [map, drawSourceRef, isDrawMode, isFreehand, setNewFeatures, newFeatures]);

    return null;
}
