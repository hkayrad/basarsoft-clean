import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { agent } from "../lib/api/agent";
import FeaturesContext from "../lib/context/featureContext";
import Header from "./shared/Header";

export default function App() {
    const [features, setFeatures] = useState<FeatureDto[]>([]);

    const fetchFeatures = async () => {
        try {
            const response = await agent.get("/features");
            setFeatures(response.data.data);
            console.log("Fetched features:");
            console.table(response.data.data);
        } catch (error) {
            console.error("Failed to fetch features:", error);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    return (
        <FeaturesContext.Provider
            value={{ features, setFeatures, getFeatures: fetchFeatures }}
        >
            <div style={{ width: "100vw", height: "100vh"}}>
                <Header />
                <Outlet />
            </div>
        </FeaturesContext.Provider>
    );
}
