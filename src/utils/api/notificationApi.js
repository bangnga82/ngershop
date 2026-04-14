import axiosClient from "./axiosClient";

const getNotificationStreamUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return `${normalizedBase}/api/v1/notifications/stream`;
};

const parseSseChunk = (buffer, onMessage) => {
  const events = buffer.split("\n\n");
  const incomplete = events.pop() || "";

  events.forEach((eventBlock) => {
    const lines = eventBlock.split("\n");
    const eventName = lines
      .filter((line) => line.startsWith("event:"))
      .map((line) => line.slice(6).trim())[0];
    const data = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");

    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      onMessage?.({
        event: eventName || "message",
        data: parsed,
      });
    } catch {
      onMessage?.({
        event: eventName || "message",
        data,
      });
    }
  });

  return incomplete;
};

const notificationApi = {
  getAll: (params) => axiosClient.get("/api/v1/notifications", { params }),
  getUnreadCount: () => axiosClient.get("/api/v1/notifications/unread-count"),
  markRead: (id) => axiosClient.put(`/api/v1/notifications/${id}/read`),
  markAllRead: () => axiosClient.put("/api/v1/notifications/read-all"),
  subscribe: async ({
    token = localStorage.getItem("accessToken"),
    signal,
    onMessage,
    onError,
  } = {}) => {
    if (!token) {
      throw new Error("Missing access token for notification stream.");
    }

    const controller = new AbortController();
    const combinedSignal = signal || controller.signal;

    try {
      const response = await fetch(getNotificationStreamUrl(), {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        signal: combinedSignal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to connect notification stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          buffer = parseSseChunk(buffer, onMessage);
        }
      };

      pump().catch((error) => {
        if (combinedSignal.aborted) return;
        onError?.(error);
      });

      return {
        close: () => controller.abort(),
      };
    } catch (error) {
      if (!combinedSignal.aborted) {
        onError?.(error);
      }
      throw error;
    }
  },
};

export default notificationApi;
