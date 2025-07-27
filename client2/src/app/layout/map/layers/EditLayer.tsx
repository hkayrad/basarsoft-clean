import Map from "ol/Map";
import { useEffect } from "react";
import { Collection } from "ol";
import { Modify } from "ol/interaction";
import WKT from "ol/format/WKT";
import type { Feature } from "ol";
import type { WktFeature } from "../../../../types";
import { updateFeature } from "../../../../lib/api/features/put";

type Props = {
    map: Map | null;
    selectedFeatures: Feature[];
};

export default function EditLayer(props: Props) {
    const { map, selectedFeatures } = props;

    useEffect(() => {
        if (!map || selectedFeatures.length === 0) return;

        const featureCollection = new Collection(selectedFeatures);

        const editInteraction = new Modify({
            features: featureCollection,
        });

        editInteraction.on("modifyend", (event) => {
            const modifiedFeature = event.features.getArray()[0];            

            const updatedFeature: WktFeature = {
                name: modifiedFeature.get("name"),
                wkt: new WKT().writeFeature(modifiedFeature),
            };

            updateFeature(modifiedFeature.get("id") as number, updatedFeature);


        });

        map.addInteraction(editInteraction);

        return () => {
            map.removeInteraction(editInteraction);
        };
    }, [map, selectedFeatures]);

    return null;
}
