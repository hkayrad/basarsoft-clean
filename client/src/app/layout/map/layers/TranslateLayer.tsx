import { Collection, type Feature } from "ol";
import { Translate } from "ol/interaction";
import Map from "ol/Map";
import type { WktFeature } from "../../../../types";
import { WKT } from "ol/format";
import { updateFeature } from "../../../../lib/api/features/put";
import { useEffect } from "react";

type Props = {
    map: Map | null;
    selectedFeatures: Feature[];
};

export default function TranslateLayer(props: Props) {
    const { map, selectedFeatures } = props;

    useEffect(() => {
        if (!map || selectedFeatures.length === 0) return;

        const featureCollection = new Collection(selectedFeatures);

        const translateInteraction = new Translate({
            features: featureCollection,
        });

        translateInteraction.on("translateend", (event) => {
            const modifiedFeature = event.features.getArray()[0];

            const updatedFeature: WktFeature = {
                name: modifiedFeature.get("name"),
                wkt: new WKT().writeFeature(modifiedFeature),
            };

            updateFeature(modifiedFeature.get("id") as number, updatedFeature);
        });

        map.addInteraction(translateInteraction);

        return () => {
            map.removeInteraction(translateInteraction);
        };
    }, [map, selectedFeatures]);

    return null;
}
