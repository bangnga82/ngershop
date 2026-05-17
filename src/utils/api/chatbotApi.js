import axiosClient from "./axiosClient";

const chatbotApi = {
    chat: (payload) => {
        // Backward compatible: allow passing a plain string message.
        if (typeof payload === "string") {
            return axiosClient.post("/api/v1/chatbot", { message: payload });
        }
        return axiosClient.post("/api/v1/chatbot", payload);
    },
};

export default chatbotApi;
