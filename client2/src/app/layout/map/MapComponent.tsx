import { useEffect } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import type { Units } from "ol/proj/Units";
import { Projection } from "ol/proj";
import { createStringXY } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition";
import { defaults as defaultControls } from "ol/control";
import type { WktFeature as WktFeature } from "../../../types";
import loadFeatureData from "../../../lib/helpers/loadFeatureData";

type Props = {
    mapRef: React.RefObject<HTMLDivElement>;
    setMap: (map: Map | null) => void;
    children?: React.ReactNode;
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
};

export default function MapComponent(props: Props) {
    const { mapRef, setMap, children, setWktFeatures } = props;

    useEffect(() => {
        const MAP_CONFIG = {
            center: [35.25, 39],
            zoom: 7,
            projection: {
                code: "EPSG:4326",
                units: "degrees" as Units,
            },
        };

        const mousePosControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: MAP_CONFIG.projection.code,
            className: "mouse-position",
            target: document.getElementById("mouse-position") as HTMLElement,
        });

        const view = new View({
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            projection: new Projection(MAP_CONFIG.projection),
        });

        const tileLayer = new TileLayer({
            source: new OSM(),
        });

        const map = new Map({
            target: mapRef.current,
            view: view,
            layers: [tileLayer],
            controls: defaultControls().extend([mousePosControl]),
        });

        loadFeatureData(setWktFeatures);

        setMap(map);
    }, [mapRef, setMap, setWktFeatures]);

    return (
        <>
            <div id="map" ref={mapRef}></div>
            {children}
        </>
    );
}
