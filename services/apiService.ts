import apiClient from "../lib/axios";

export const apiService = {
  // Query regulations through the engine
  queryRegulation: async (params: { query: string }) => {
    const response = await apiClient.post("/ask", params);
    return response.data;
  },

  // Upload an internal document to the parser
  uploadDocument: async (formData: FormData) => {
    // When sending FormData, Axios will automatically set the correct Content-Type (multipart/form-data)
    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get the conflict map showing policy discrepancies
  getConflictMap: async () => {
    const response = await apiClient.get("/conflict-map");
    return response.data;
  },

  // Trigger data ingestion cycle
  triggerIngestion: async () => {
    const response = await apiClient.post("/ingest");
    return response.data;
  },
};
