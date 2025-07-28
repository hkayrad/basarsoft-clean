import "./style/map/map.css"

import { useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import type { Units } from "ol/proj/Units";
import { Projection } from "ol/proj";
import { createStringXY } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition";
import { defaults as defaultControls, ZoomSlider } from "ol/control";
import type { WktFeature as WktFeature } from "../../../types";
import { getAllFeatures, getFeatureById } from "../../../lib/api/features/get";
import { useSearchParams } from "react-router";
import { WKT } from "ol/format";



type Props = {
    map: Map | null;
    mapRef: React.RefObject<HTMLDivElement>;
    setMap: (map: Map | null) => void;
    children?: React.ReactNode;
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
};

export default function MapComponent(props: Props) {
    const { map, mapRef, setMap, children, setWktFeatures } = props;

    const [gotoFeature, setGotoFeature] = useState<WktFeature | null>(null);

    const [searchParams] = useSearchParams();
    const gotoFeatureId = searchParams.get("gotoId");

    const mousePositionElement = document.getElementById(
        "mouse-position"
    ) as HTMLElement;

    const handleGotoFeature = async (id: number | null) => {
        if (!id) return null;

        const feature = await getFeatureById(id);
        setGotoFeature(feature);
        return null;
    };

    useEffect(() => {
        const MAP_CONFIG = {
            center: [35.25, 39],
            zoom: 7,
            projection: {
                code: "EPSG:4326",
                units: "degrees" as Units,
            },
        };

        if (mousePositionElement) mousePositionElement.innerHTML = ""; // Clear previous content
        const mousePosControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: MAP_CONFIG.projection.code,
            className: "mouse-position",
            target: mousePositionElement,
        });

        const zoomSlider = new ZoomSlider();

        const view = new View({
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
            projection: new Projection(MAP_CONFIG.projection),
            extent: [-180, -90, 180, 90],
            showFullExtent: true,
        });

        const tileLayer = new TileLayer({
            source: new OSM(),
        });

        const map = new Map({
            target: mapRef.current,
            view: view,
            layers: [tileLayer],
            controls: defaultControls().extend([mousePosControl, zoomSlider]),
        });

        getAllFeatures(setWktFeatures);

        setMap(map);

        handleGotoFeature(gotoFeatureId ? parseInt(gotoFeatureId) : null);

        return () => {
            map.setTarget(undefined);
            setMap(null);
            setGotoFeature(null);
        };
    }, [mapRef, setMap, setWktFeatures, gotoFeatureId, mousePositionElement]);

    useEffect(() => {
        if (gotoFeature && map) {
            const view = map.getView();
            if (view) {
                const geometry = new WKT().readGeometry(gotoFeature.wkt);
                const extent = geometry.getExtent();
                view.fit(extent, {
                    duration: 1000,
                    maxZoom: 15,
                    padding: [100, 100, 100, 100],
                });
            }
        }
    }, [map, gotoFeature]);

    return (
        <>
            <div id="map" ref={mapRef}></div>
            {children}
        </>
    );
}
