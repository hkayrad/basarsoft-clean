import type Map from "ol/Map";
import { useEffect } from "react";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import { WKT } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import type { WktFeature } from "../../../../types";

type Props = {
    map: Map | null;
    drawSourceRef: React.RefObject<VectorSource>;
    isDrawMode: boolean;
    drawType: "Polygon" | "LineString" | "Point";
    isFreehand: boolean;
    newFeatures?: WktFeature[];
    setNewFeatures?: (newFeature: WktFeature[]) => void;
    drawRef: React.RefObject<Draw>;
    drawLayerRef: React.RefObject<VectorLayer>;
    children?: React.ReactNode;
};

export default function DrawLayer(props: Props) {
    const {
        map,
        isDrawMode,
        drawSourceRef,
        drawType,
        isFreehand,
        newFeatures,
        setNewFeatures,
        drawRef,
        children,
        drawLayerRef,
    } = props;

    const generateFeatureId = () => {
        return Math.floor(Math.random() * 1000000);
    };

    useEffect(() => {
        if (!map) return;

        const drawSource = new VectorSource({
            wrapX: false,
        });
        drawSourceRef.current = drawSource;

        const drawLayer = new VectorLayer({
            source: drawSourceRef.current,
        });
        drawLayerRef.current = drawLayer;

        map.addLayer(drawLayer);

        return () => {
            const layers = map.getLayers().getArray();
            const drawLayer = layers.find(
                (layer) =>
                    layer instanceof VectorLayer &&
                    layer.getSource() === drawSourceRef.current
            );
            if (drawLayer) {
                map.removeLayer(drawLayer);
            }
        };
    }, [drawLayerRef, drawSourceRef, map]);

    useEffect(() => {
        if (!map || !drawSourceRef.current) return;

        const drawInteraction = new Draw({
            source: drawSourceRef.current,
            type: drawType,
            freehand: isFreehand,
        });

        drawRef.current = drawInteraction;

        if (isDrawMode) map.addInteraction(drawInteraction);

        drawInteraction.on("drawend", (event) => {
            const feature = event.feature;
            const geometry = feature.getGeometry()!;
            const wkt = new WKT().writeGeometry(geometry);

            const featureId = generateFeatureId();
            feature.setId(featureId);

            if (setNewFeatures && newFeatures) {
                const createdFeature: WktFeature = {
                    id: featureId,
                    wkt: wkt,
                };
                setNewFeatures([...newFeatures, createdFeature]);
            }
        });

        return () => {
            map.removeInteraction(drawInteraction);
        };
    }, [
        map,
        isDrawMode,
        drawSourceRef,
        drawType,
        isFreehand,
        setNewFeatures,
        newFeatures,
        drawRef,
    ]);

    return children ? children : null;
}
