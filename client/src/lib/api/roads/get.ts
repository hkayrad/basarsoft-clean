import type { WktFeature } from "../../../types";
import agent from "../agent";

const getRoadsByBoundingBox = async (setWktFeatures: React.Dispatch<React.SetStateAction<WktFeature[]>>, minX: number, minY: number, maxX: number, maxY: number) => {
    try {
        const response = await agent.get("/roads", {
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
export { getRoadsByBoundingBox }