import { useState, useEffect } from "react";
import { healthService } from "../services/healthService.js";

/**
 * Custom hook to monitor API connection health status
 */
export function useHealthCheck() {
  const [status, setStatus] = useState({
    isLoading: true,
    isConnected: false,
    message: "",
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        const res = await healthService.checkHealth();
        if (isMounted) {
          setStatus({
            isLoading: false,
            isConnected: res.success === true,
            message: res.message || "Connected",
            error: null
          });
        }
      } catch (err) {
        if (isMounted) {
          setStatus({
            isLoading: false,
            isConnected: false,
            message: "Disconnected",
            error: err.message
          });
        }
      }
    };

    check();
    return () => {
      isMounted = false;
    };
  }, []);

  return status;
}
