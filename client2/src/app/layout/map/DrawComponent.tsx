import type Map from "ol/Map";
import { useEffect } from "react";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import { WKT } from "ol/format";
import VectorLayer from "ol/layer/Vector";

type Props = {
    map: Map | null;
    drawSourceRef: React.RefObject<VectorSource>;
    isDrawMode: boolean;
    drawType: "Polygon" | "LineString" | "Point";
    isFreehand: boolean;
    newFeatureWkt?: string[];
    setNewFeatureWkt?: (wkt: string[]) => void;
};

export default function DrawComponent(props: Props) {
    const {
        map,
        isDrawMode,
        drawSourceRef,
        drawType,
        isFreehand,
        newFeatureWkt,
        setNewFeatureWkt,
    } = props;

    useEffect(() => {
        if (map) {
            const drawSource = new VectorSource({
                wrapX: false,
            });
            drawSourceRef.current = drawSource;

            const drawLayer = new VectorLayer({
                source: drawSourceRef.current,
            });

            map.addLayer(drawLayer);
        }

        return () => {
            if (map) {
                const layers = map.getLayers().getArray();
                const drawLayer = layers.find(
                    (layer) =>
                        layer instanceof VectorLayer &&
                        layer.getSource() === drawSourceRef.current
                );
                if (drawLayer) {
                    map.removeLayer(drawLayer);
                }
            }
        };
    }, [drawSourceRef, map]);

    useEffect(() => {
        if (map) {
            const draw = new Draw({
                source: drawSourceRef.current,
                type: drawType,
                freehand: isFreehand,
            });

            if (isDrawMode) map.addInteraction(draw);

            draw.on("drawend", (event) => {
                const feature = event.feature;
                const geometry = feature.getGeometry()!;
                const wkt = new WKT().writeGeometry(geometry);

                if (setNewFeatureWkt && newFeatureWkt) {
                    setNewFeatureWkt([...newFeatureWkt, wkt]);
                }
            });

            return () => {
                map.removeInteraction(draw);
            };
        }
    }, [
        map,
        isDrawMode,
        drawSourceRef,
        drawType,
        isFreehand,
        setNewFeatureWkt,
        newFeatureWkt,
    ]);

    return null;
}
