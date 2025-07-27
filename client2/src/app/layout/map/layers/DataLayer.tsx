import Map from "ol/Map";
import { useEffect } from "react";
import type { WktFeature } from "../../../../types";
import VectorSource from "ol/source/Vector";
import { WKT } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";

type Props = {
    map: Map | null;
    wktFeatures: WktFeature[];
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
    isFeatureLayerVisible: boolean;
    dataLayerRef: React.RefObject<VectorLayer>;
};

export default function DataLayer(props: Props) {
    const {
        map,
        wktFeatures,
        setWktFeatures,
        isFeatureLayerVisible,
        dataLayerRef,
    } = props;

    useEffect(() => {
        if (map && isFeatureLayerVisible) {
            const vectorSource = new VectorSource({
                features: wktFeatures.map((feature) => {
                    return new Feature({
                        geometry: new WKT().readGeometry(feature.wkt),
                        name: feature.name,
                        id: feature.id,
                    });
                }),
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            dataLayerRef.current = vectorLayer;

            map.addLayer(vectorLayer);

            return () => {
                map.removeLayer(vectorLayer);
            };
        }
    }, [map, isFeatureLayerVisible, setWktFeatures, wktFeatures, dataLayerRef]);

    return null;
}
