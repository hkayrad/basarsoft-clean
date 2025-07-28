import axios from "axios";

const agent = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

agent.interceptors.response.use((response) => {
    if (!response.data.isSuccess) {
        console.error("API Error:", response.data.message || "Unknown error");
        return Promise.reject(new Error(response.data.message || "API Error"));
    }
    return response;
}, (error) => {
    // Handle errors
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
});

export default agent;