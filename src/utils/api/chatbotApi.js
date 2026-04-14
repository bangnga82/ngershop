import axiosClient from "./axiosClient";

const chatbotApi = {
    chat: (message) =>
        axiosClient.post("/api/v1/chatbot", {
            message,
        }),
};

export default chatbotApi;
