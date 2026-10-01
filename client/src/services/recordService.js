import api from "./api.js";

/**
 * Record service handling API communications with backend /api/records
 */
export const recordService = {
  /**
   * Fetch MongoDB-generated summary statistics
   */
  getSummary: async () => {
    return await api.get("/records/summary");
  },

  /**
   * Fetch paginated records with optional filters, search, and sorting
   */
  getRecords: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search && params.search.trim()) queryParams.append("search", params.search.trim());
    if (params.type && params.type.trim()) queryParams.append("type", params.type.trim());
    if (params.linkStatus && params.linkStatus.trim()) queryParams.append("linkStatus", params.linkStatus.trim());
    if (params.downloadStatus && params.downloadStatus.trim()) queryParams.append("downloadStatus", params.downloadStatus.trim());
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/records?${queryString}` : "/records";

    return await api.get(endpoint);
  },

  /**
   * Fetch single record by ID
   */
  getRecordById: async (id) => {
    return await api.get(`/records/${id}`);
  },

  /**
   * Create a new record
   */
  createRecord: async (recordData) => {
    return await api.post("/records", recordData);
  },

  /**
   * Update an existing record
   */
  updateRecord: async (id, updateData) => {
    return await api.put(`/records/${id}`, updateData);
  },

  /**
   * Delete a record by ID
   */
  deleteRecord: async (id) => {
    return await api.delete(`/records/${id}`);
  },

  /**
   * Import bulk records parsed from Excel / CSV
   */
  importRecords: async (records) => {
    return await api.post("/records/import", { records });
  },

  /**
   * Bulk delete selected records by array of IDs
   */
  bulkDelete: async (ids) => {
    return await api.post("/records/bulk-delete", { ids });
  }
};
