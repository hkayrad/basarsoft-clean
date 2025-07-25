import Map from "ol/Map";
import { useEffect } from "react";
import type { WktFeature } from "../../../types";
import VectorSource from "ol/source/Vector";
import { WKT } from "ol/format";
import VectorLayer from "ol/layer/Vector";

type Props = {
    map: Map | null;
    wktFeatures: WktFeature[];
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
    isFeatureLayerVisible: boolean;
};

export default function DataComponent(props: Props) {
    const {
        map,
        wktFeatures,
        setWktFeatures,
        isFeatureLayerVisible: isFeatureLayerVisible,
    } = props;

    useEffect(() => {
        if (map && isFeatureLayerVisible) {
            const vectorSource = new VectorSource({
                features: wktFeatures.map((wktFeature) => {
                    const wktFormat = new WKT();
                    return wktFormat.readFeature(wktFeature.wkt, {
                        dataProjection: "EPSG:4326",
                        featureProjection: map.getView().getProjection(),
                    });
                }),
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            map.addLayer(vectorLayer);

            return () => {
                map.removeLayer(vectorLayer);
            };
        }
    }, [map, isFeatureLayerVisible, setWktFeatures, wktFeatures]);

    return null;
}
