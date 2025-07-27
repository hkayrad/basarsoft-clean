import agent from "../agent";

const deleteFeature = async (id: number) => {
    try {
        const response = await agent.delete(`/features/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting feature:", error);
        throw error;
    }
}
export { deleteFeature }