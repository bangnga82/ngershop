export const CHATBOT_MESSAGES_KEY = "ngershop_chatbot_messages";
export const CHATBOT_OPEN_KEY = "ngershop_chatbot_open";
export const CHATBOT_SESSION_KEY = "ngershop_chatbot_session";
export const CHATBOT_RESET_EVENT = "ngershop-chatbot-reset";

export const resetChatbotStorage = () => {
  try {
    localStorage.removeItem(CHATBOT_MESSAGES_KEY);
    localStorage.removeItem(CHATBOT_OPEN_KEY);
    localStorage.removeItem(CHATBOT_SESSION_KEY);
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new Event(CHATBOT_RESET_EVENT));
  } catch {
    // ignore
  }
};

