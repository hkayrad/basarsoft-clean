import type { WktFeature } from "../../../types";
import agent from "../agent"

const getAllFeatures = async (setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>, pageSize: number = 5000, pageNumber: number = 1, query?: string, sortBy?: string, sortOrder?: string) => {
    try {
        const response = await agent.get("/features", {
            params: {
                pageSize,
                pageNumber,
                query,
                sortBy,
                sortOrder
            },
        });
        setWktFeatures(response.data.data);
    } catch (error) {
        console.error("Error fetching features:", error);
        throw error;
    }
}

const getFeatureByBoundingBox = async (setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>, minX: number, minY: number, maxX: number, maxY: number) => {
    try {
        const response = await agent.get("/features/getByBoundingBox", {
            params: {
                minX,
                minY,
                maxX,
                maxY
            },
        });
        setWktFeatures(response.data.data);
    } catch (error) {
        console.error("Error fetching features by bounding box:", error);
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