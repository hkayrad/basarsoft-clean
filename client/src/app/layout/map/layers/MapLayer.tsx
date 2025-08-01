import "../style/map/map.css";
import { useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, XYZ } from "ol/source";
import type { Units } from "ol/proj/Units";
import { Projection } from "ol/proj";
import { createStringXY } from "ol/coordinate";
import MousePosition from "ol/control/MousePosition";
import { defaults as defaultControls, ZoomSlider } from "ol/control";
import type { WktFeature as WktFeature } from "../../../../types";
import {
    getFeatureByBoundingBox,
    getFeatureById,
} from "../../../../lib/api/features/get";
import { useSearchParams } from "react-router";
import { WKT } from "ol/format";
import { getRoadsByBoundingBox } from "../../../../lib/api/roads/get";

type Props = {
    map: Map | null;
    mapRef: React.RefObject<HTMLDivElement>;
    setMap: (map: Map | null) => void;
    children?: React.ReactNode;
    setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
    setRoadFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>;
};

export default function MapLayer(props: Props) {
    const { map, mapRef, setMap, children, setWktFeatures, setRoadFeatures } =
        props;

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
            source: new OSM({
                wrapX: true,
            }),
            zIndex: -2,
        });

        const turkeyLayer = new TileLayer({
            source: new XYZ({
                url: "/turkey-tiles/{z}/{x}/{y}.png",
            }),
            zIndex: -1,
            maxZoom: 11,
        });

        const eskisehirLayer = new TileLayer({
            source: new XYZ({
                url: "/eskisehir-tiles/{z}/{x}/{y}.png",
            }),
            zIndex: 0,
            maxZoom: 13,
        });

        const map = new Map({
            target: mapRef.current,
            view: view,
            layers: [eskisehirLayer, turkeyLayer, tileLayer],
            controls: defaultControls().extend([mousePosControl, zoomSlider]),
        });

        map.on("moveend", () => {
            const extent = map.getView().calculateExtent(map.getSize());
            const roundedExtent = extent.map(
                (coord) => Math.round(coord * 10000) / 10000
            );

            getFeatureByBoundingBox(
                setWktFeatures,
                roundedExtent[0],
                roundedExtent[1],
                roundedExtent[2],
                roundedExtent[3]
            );

            getRoadsByBoundingBox(
                setRoadFeatures,
                roundedExtent[0],
                roundedExtent[1],
                roundedExtent[2],
                roundedExtent[3]
            );
        });

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
                console.log("Goto feature extent:", extent);
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
            <div id="mouse-position" className="mouse-position"></div>
            <div id="map" ref={mapRef}></div>
            {children}
        </>
    );
}
