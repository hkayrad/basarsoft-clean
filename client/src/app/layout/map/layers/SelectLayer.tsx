import { click } from "ol/events/condition";
import Select from "ol/interaction/Select";
import Map from "ol/Map";
import { useEffect, type Dispatch } from "react";
import { type Feature } from "ol";
import type VectorLayer from "ol/layer/Vector";

type Props = {
    map: Map | null;
    isDrawMode: boolean;
    setSelectedFeatures: Dispatch<React.SetStateAction<Feature[]>>;
    dataLayerRef: React.RefObject<VectorLayer>;
};

export default function SelectLayer(props: Props) {
    const { map, isDrawMode, setSelectedFeatures, dataLayerRef } = props;

    useEffect(() => {
        if (!map || isDrawMode || !dataLayerRef.current) return;

        const clickSelect = new Select({
            condition: click,
            multi: true,
            filter: (feature, layer) => {
                return layer === dataLayerRef.current;
            },
        });

        clickSelect.on("select", (event) => {
            const features = event.target.getFeatures().getArray();

            if (features.length === 0) {
                setSelectedFeatures([]);
                return;
            }

            setSelectedFeatures([...features]);
        });

        map.addInteraction(clickSelect);

        return () => {
            map.removeInteraction(clickSelect);
        };
    }, [map, isDrawMode, setSelectedFeatures, dataLayerRef]);

    return null;
}
