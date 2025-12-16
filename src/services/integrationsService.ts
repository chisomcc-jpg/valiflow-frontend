import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getAuthUrl = async (service: 'fortnox' | 'visma' | 'microsoft') => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
        `${API}/api/integrations/${service}/auth-url`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
