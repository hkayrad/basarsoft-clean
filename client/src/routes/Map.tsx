import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { OSM } from "ol/source";
import { useEffect, useState } from "react";

export default function MapPage() {
    const [features, setFeatures] = useState<Feature[]>([]);

    useEffect(() => {
        const map = new Map({
            /*  */ target: "map",
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
        });

        return () => {
            map.setTarget(undefined);
        };
    }, []);

    return <div id="map" style={{ width: "100vw", height: "100vh" }}></div>;
}
