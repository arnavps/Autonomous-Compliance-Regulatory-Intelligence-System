import apiClient from "../lib/axios";

interface TaskResponse {
  task_id: string;
  status: string;
  message: string;
}

interface TaskResult {
  task_id: string;
  status: string;
  documents_processed?: number;
  new_regulations?: number;
  updated_policies?: number;
  report_path?: string;
  model_used?: string;
  confidence_score?: number;
  fallback_triggered?: boolean;
  processing_time?: number;
  [key: string]: unknown;
}

interface TaskStatus {
  task_id: string;
  state: "PENDING" | "PROGRESS" | "SUCCESS" | "FAILURE" | "RETRY" | "UNKNOWN";
  result?: TaskResult | null;
  error?: string;
  progress?: number;
  status?: string;
}

interface DecisionLog {
  id: number;
  timestamp: string;
  agent_name: string;
  input_data: string;
  agent_output: string;
  confidence_score: number;
  model_used?: string;
  fallback_triggered: string;
  processing_time?: number;
}

export const apiService = {
  // Query regulations through the engine with model routing
  queryRegulation: async (params: { query: string }) => {
    const response = await apiClient.post("/api/ask", params);
    return response.data;
  },

  // Upload an internal document to the parser
  uploadDocument: async (formData: FormData) => {
    const response = await apiClient.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get the conflict map showing policy discrepancies
  getConflictMap: async () => {
    const response = await apiClient.get("/api/conflict-map");
    return response.data;
  },

  // Trigger async data ingestion cycle
  triggerIngestion: async (dataSources?: string[]) => {
    const response = await apiClient.post("/api/ingest", { data_sources: dataSources || [] });
    return response.data as TaskResponse;
  },

  // Trigger async impact report generation
  triggerImpactReport: async (regulationData: any) => {
    const response = await apiClient.post("/api/impact-report", { regulation_data: regulationData });
    return response.data as TaskResponse;
  },

  // Get task status by ID
  getTaskStatus: async (taskId: string) => {
    const response = await apiClient.get(`/api/task/${taskId}`);
    return response.data as TaskStatus;
  },

  // Poll task status until completion
  pollTaskStatus: async (
    taskId: string,
    onProgress?: (status: TaskStatus) => void,
    pollInterval: number = 2000
  ): Promise<TaskStatus> => {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await apiService.getTaskStatus(taskId);

          // Call progress callback if provided
          if (onProgress) {
            onProgress(status);
          }

          // Check if task is complete
          if (status.state === "SUCCESS") {
            resolve(status);
          } else if (status.state === "FAILURE") {
            reject(new Error(status.error || "Task failed"));
          } else {
            // Continue polling
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      // Start polling
      poll();
    });
  },

  // Get recent decision logs
  getRecentDecisions: async (limit: number = 100, agentName?: string) => {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    if (agentName) {
      params.append("agent_name", agentName);
    }

    const response = await apiClient.get(`/api/decisions?${params.toString()}`);
    return response.data as { decisions: DecisionLog[]; total: number };
  },

  // Get decision statistics
  getDecisionStats: async (agentName?: string) => {
    const params = agentName ? `?agent_name=${agentName}` : "";
    const response = await apiClient.get(`/api/stats${params}`);
    return response.data;
  },

  // Helper method to create a pollable task runner
  createTaskRunner: (taskId: string) => ({
    taskId,

    // Get current status
    getStatus: () => apiService.getTaskStatus(taskId),

    // Poll until complete with optional progress callback
    wait: (onProgress?: (status: TaskStatus) => void) =>
      apiService.pollTaskStatus(taskId, onProgress),

    // Check if task is complete
    isComplete: async () => {
      const status = await apiService.getTaskStatus(taskId);
      return status.state === "SUCCESS" || status.state === "FAILURE";
    }
  })
};
