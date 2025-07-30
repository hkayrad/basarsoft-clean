import Map from "ol/Map";
import { useEffect } from "react";
import type { WktFeature } from "../../../../types";
import VectorSource from "ol/source/Vector";
import { WKT } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import { Feature } from "ol";

type Props = {
    map: Map | null;
    wktFeatures: WktFeature[];
    wktRoads: WktFeature[];
    isFeatureLayerVisible: boolean;
    isRoadLayerVisible: boolean;
    dataLayerRef: React.RefObject<VectorLayer>;
    roadLayerRef: React.RefObject<WebGLVectorLayer>;
};

export default function DataLayer(props: Props) {
    const {
        map,
        wktFeatures,
        wktRoads,
        isFeatureLayerVisible,
        isRoadLayerVisible,
        dataLayerRef,
        roadLayerRef,
    } = props;

    useEffect(() => {
        if (!map || !isFeatureLayerVisible) return;
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
            style: {
                "circle-radius": 4,
                "circle-fill-color": "#ffffff80",
                "circle-stroke-color": "#3388ff",
                "circle-stroke-width": 2,
            },
            zIndex: 1,
        });

        dataLayerRef.current = vectorLayer;

        map.addLayer(vectorLayer);

        return () => {
            map.removeLayer(vectorLayer);
        };
    }, [map, isFeatureLayerVisible, wktFeatures, dataLayerRef]);

    useEffect(() => {
        if (!map || !isRoadLayerVisible) return;

        const vectorSource = new VectorSource({
            features: wktRoads.map((road) => {
                return new Feature({
                    geometry: new WKT().readGeometry(road.wkt),
                    name: road.name,
                    id: road.id,
                });
            }),
        });

        const vectorLayer = new WebGLVectorLayer({
            source: vectorSource,
            style: {
                "stroke-color": "orange",
                "stroke-width": 2,
            },
        });

        roadLayerRef.current = vectorLayer;

        map.addLayer(vectorLayer);

        return () => {
            map.removeLayer(vectorLayer);
        };
    }, [map, isRoadLayerVisible, wktRoads, roadLayerRef]);

    return null;
}
