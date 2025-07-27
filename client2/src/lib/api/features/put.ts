import type { WktFeature } from "../../../types";
import agent from "../agent";

const updateFeature = async (id: number, featureData: WktFeature) => {
    try {
        const response = await agent.put(`/features/${id}`, featureData);
        return response.data.data;
    }
    catch (error) {
        console.error("Error updating feature:", error);
        throw error;
    }
};

export { updateFeature };