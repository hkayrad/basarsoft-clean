import axios from "axios";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

const saveFeature = async (feature: FeatureDto) => {
    try {
        const response = await agent.post("/features", feature);
        console.log("Feature saved:", response.data);
    } catch (error) {
        console.error("Failed to save feature:", error);
    }
};

const deleteFeature = async (id: number) => {
    try {
        const response = await agent.delete(`/features/${id}`);
        console.log("Feature deleted:", response.data);
    } catch (error) {
        console.error("Failed to delete feature:", error);
    }
}

export { agent, saveFeature, deleteFeature };