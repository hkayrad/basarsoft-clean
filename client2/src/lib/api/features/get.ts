import type { WktFeature } from "../../../types";
import agent from "../agent"

const getAllFeatures = async (setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>, pageSize?: number, pageNumber?: number) => {
    try {
        const response = await agent.get("/features", {
            params: {
                pageSize,
                pageNumber,
            },
        });
        setWktFeatures(response.data.data);
    } catch (error) {
        console.error("Error fetching features:", error);
        throw error;
    }
}

export {
    getAllFeatures
}