import { useContext } from "react";
import FeaturesContext from "../../../lib/context/featureContext";

export default function ListPage() {
    const { features } = useContext(FeaturesContext);

    return (
        <>
            {features.length > 0 ? (
                <ul>
                    {features.map((feature) => (
                        <li key={feature.id}>
                            {feature.name} - {feature.wkt}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No features available.</p>
            )}
        </>
    );
}
