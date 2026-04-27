import adminUserApi from "./api/adminUserApi";

const ADMIN_CACHE_KEY = "isAdmin";
const ADMIN_CACHE_USER_KEY = "isAdminUserId";

export const getAccessToken = () => localStorage.getItem("accessToken");

export const isAuthenticated = () => Boolean(getAccessToken());

export const buildAuthRedirectPath = (redirectTo, mode = "login") => {
  const params = new URLSearchParams();
  params.set("mode", mode);
  if (redirectTo) {
    params.set("redirect", redirectTo);
  }
  return `/auth?${params.toString()}`;
};

export const decodeJwtPayload = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payload = parts[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  try {
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  const sub = payload?.sub;
  if (sub === undefined || sub === null) return null;
  const parsed = Number(sub);
  return Number.isNaN(parsed) ? sub : parsed;
};

export const getCachedAdminFlag = () => localStorage.getItem(ADMIN_CACHE_KEY);

export const setCachedAdminFlag = (value) => {
  localStorage.setItem(ADMIN_CACHE_KEY, value ? "true" : "false");
};

export const clearAdminFlag = () => {
  localStorage.removeItem(ADMIN_CACHE_KEY);
  localStorage.removeItem(ADMIN_CACHE_USER_KEY);
};

export const ensureAdminStatus = async () => {
  const token = getAccessToken();
  if (!token) return false;

  const userId = getUserIdFromToken(token);
  if (!userId) return false;

  const cached = getCachedAdminFlag();
  const cachedUserId = localStorage.getItem(ADMIN_CACHE_USER_KEY);
  if (cachedUserId && String(cachedUserId) === String(userId)) {
    if (cached === "true") return true;
    if (cached === "false") return false;
  }

  try {
    await adminUserApi.getById(userId);
    setCachedAdminFlag(true);
    localStorage.setItem(ADMIN_CACHE_USER_KEY, String(userId));
    return true;
  } catch {
    setCachedAdminFlag(false);
    localStorage.setItem(ADMIN_CACHE_USER_KEY, String(userId));
    return false;
  }
};
