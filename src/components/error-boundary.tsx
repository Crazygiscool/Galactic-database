import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: 20,
              background: "#1a1a2e", // Visible dark blue, not pure black
              color: "#e0e0ff",
              fontFamily: "'Share Tech Mono', monospace",
              minHeight: "100vh",
              border: "2px solid #ff0000", // Red border to make it visible
            }}
          >
            <h2 style={{ color: "#ff6b6b" }}>⚠️ ERROR CAUGHT BY BOUNDARY</h2>
            <p style={{ color: "#ffa500", marginBottom: 10 }}>
              If you see this, it means a rendering error occurred.
            </p>
            <details style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>
              <summary style={{ cursor: "pointer", color: "#00d4ff" }}>Error details</summary>
              <p style={{ color: "#ff6b6b" }}>{this.state.error?.toString()}</p>
              <p style={{ fontSize: 12, opacity: 0.7, color: "#aaa" }}>
                {this.state.errorInfo?.componentStack}
              </p>
            </details>
            <button
              onClick={() => {
                console.log("[ErrorBoundary] Retrying after error...");
                this.setState({ hasError: false, error: null, errorInfo: null });
              }}
              style={{
                marginTop: 20,
                padding: "8px 16px",
                background: "#00d4ff",
                color: "#000",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
