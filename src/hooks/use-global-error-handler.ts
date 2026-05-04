import { useEffect } from "react";

export function useGlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalError] Caught unhandled error:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("[GlobalError] Caught unhandled promise rejection:", {
        reason: event.reason,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
}
