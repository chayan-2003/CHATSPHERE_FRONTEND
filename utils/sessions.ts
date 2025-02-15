import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;  

export const fetchSessions = async () => {
    try {
        const response = await axios.get(`${API_URL}/sessions`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return [];
    }
};

export const fetchSession = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/sessions/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching session:", error);
        return null;
    }
};

export const createSession = async (name: string, description: string, token: string) => {
    try {
        const newSession = {
            data: {
                name,
                description,
            },
        };

        const response = await axios.post(
            `${API_URL}/sessions`,
            newSession,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        return response.data;
    } catch (error) {
        console.error("Error creating session:", error);
        throw new Error("Failed to create session.");
    }
};