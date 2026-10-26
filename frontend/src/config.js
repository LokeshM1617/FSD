// Dynamic API base URL: Reads VITE_API_URL when deployed to Vercel, defaults to localhost:5000 in dev
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
