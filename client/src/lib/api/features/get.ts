import type { WktFeature } from "../../../types";
import agent from "../agent"

const getAllFeatures = async (setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>, pageSize?: number, pageNumber?: number, query?: string) => {
    try {
        const response = await agent.get("/features", {
            params: {
                pageSize,
                pageNumber,
                query
            },
        });
        setWktFeatures(response.data.data);
    } catch (error) {
        console.error("Error fetching features:", error);
        throw error;
    }
}

const getFeatureCount = async (query?: string) => {
    try {
        const response = await agent.get("/features/count", {
            params: {
                query
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feature count:", error);
        throw error;
    }
}

const getFeatureById = async (id: number) => {
    try {
        const response = await agent.get(`/features/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching feature by ID:", error);
        throw error;
    }
}

export {
    getAllFeatures,
    getFeatureCount,
    getFeatureById
}