import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server returned an error status code
      if (error.response.status === 429) {
        toast.error("Rate Limit Exceeded. Please try again later.");
      } else if (error.response.status >= 500) {
        toast.error("System Offline: Our intelligence engine is currently unreachable.");
      } else {
        toast.error(`Error ${error.response.status}: ${error.response.data?.detail || error.message}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("System Offline: No response from server.");
    } else {
      // Something happened in setting up the request
      toast.error(`Request Error: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
