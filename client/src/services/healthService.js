import api from "./api.js";

/**
 * Health check API service
 */
export const healthService = {
  checkHealth: async () => {
    return await api.get("/health");
  }
};
