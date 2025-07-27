import { click } from "ol/events/condition";
import Select from "ol/interaction/Select";
import Map from "ol/Map";
import { useEffect, type Dispatch } from "react";
import type { Feature } from "ol";

type Props = {
    map: Map | null;
    isDrawMode: boolean;
    setSelectedFeatures: Dispatch<React.SetStateAction<Feature[]>>;
};

export default function SelectLayer(props: Props) {
    const { map, isDrawMode, setSelectedFeatures } = props;

    useEffect(() => {
        if (!map || isDrawMode) return;

        const clickSelect = new Select({
            condition: click,
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
    }, [map, isDrawMode, setSelectedFeatures]);

    return null;
}
