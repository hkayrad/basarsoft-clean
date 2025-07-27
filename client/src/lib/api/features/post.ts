import type { WktFeature } from "../../../types";
import agent from "../agent";

const addFeature = async (featureData: WktFeature) => {
    try {
        const response = await agent.post("/features", featureData);
        return response.data;
    } catch (error) {
        console.error("Error adding feature:", error);
        throw error;
    }
}

export { addFeature }