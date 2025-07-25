import Map from "ol/Map";
import { useEffect } from "react";

type Props = {
    map: Map | null;
};

export default function DataComponent(props: Props) {
    const { map } = props;

    useEffect(() => {
        console.log(map);
    }, [map]);

    return null;
}
