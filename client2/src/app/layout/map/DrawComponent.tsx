import type Map from "ol/Map";
import { useEffect } from "react";
import Draw from "ol/interaction/Draw";
import type VectorSource from "ol/source/Vector";
import { WKT } from "ol/format";

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

    const format = new WKT();

    useEffect(() => {
        if (map) {
            const drawSource = drawSourceRef.current;

            const draw = new Draw({
                source: drawSource,
                type: drawType,
                freehand: isFreehand,
            });

            if (isDrawMode) map.addInteraction(draw);

            draw.on("drawend", (event) => {
                const feature = event.feature;
                const geometry = feature.getGeometry()!;
                const wkt = format.writeGeometry(geometry);

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
        format,
        setNewFeatureWkt,
        newFeatureWkt,
    ]);

    // Log the newFeatureWkt to console for debugging
    useEffect(() => console.log(newFeatureWkt), [newFeatureWkt]);

    return null;
}
