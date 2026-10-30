import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

/*
 * SectionErrorBoundary: per-section React error boundary for the
 * homepage. It must be a class component (function components cannot
 * be error boundaries). Each lazy section gets its own instance in
 * App.tsx so a runtime error inside one section renders a quiet
 * fallback for that section only, instead of unmounting the whole
 * page into a blank white screen.
 *
 * The boundary itself renders no wrapper DOM: when there is no
 * error it returns this.props.children directly, so the App
 * section-sweep selector (main > section) keeps working. When a
 * section fails, the fallback is a <section> element, so the sweep
 * indexing stays stable even in the failed state.
 *
 * The fallback shows the captured error in a <details> block so a
 * failure on a device without devtools can still be diagnosed by
 * reading the message back.
 */

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
}

interface SectionErrorBoundaryState {
  error: Error | null;
  componentStack: string | null;
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { error: null, componentStack: null };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<SectionErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const lines = (info.componentStack || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 5);
    this.setState({ componentStack: lines.join("\n") || null });
    try {
      window.__lastPageError =
        "[" + this.props.sectionName + "] " + String(error);
    } catch {
      /* The safety net must never throw itself. */
    }
  }

  render(): ReactNode {
    const { error, componentStack } = this.state;
    if (!error) {
      return this.props.children;
    }
    const message = String(
      (error && (error as Error).message) || error,
    );
    return (
      <section
        aria-label="Section failed to load"
        style={{
          background: "#111111",
          color: "#98989C",
          padding: "48px 24px",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: "0 0 8px", fontSize: "15px", color: "#F5F5F7" }}>
          This section could not be displayed.
        </p>
        <p style={{ margin: "0 0 16px" }}>
          Please reload the page. If the problem persists, the error
          details below were captured.
        </p>
        <details>
          <summary style={{ cursor: "pointer", color: "#F5F5F7" }}>
            Error details
          </summary>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#98989C",
              margin: "8px 0 0",
            }}
          >
            {message}
            {componentStack ? "\n" + componentStack : ""}
          </pre>
        </details>
      </section>
    );
  }
}

/*
 * installPageErrorCapture: tiny global safety net. Records the latest
 * page-level error or unhandled rejection on window.__lastPageError
 * for future diagnosis. It renders nothing and is wrapped so it can
 * never throw itself. Idempotent: safe to call more than once.
 */
declare global {
  interface Window {
    __lastPageError?: string;
  }
}

let pageErrorCaptureInstalled = false;

export function installPageErrorCapture(): void {
  if (pageErrorCaptureInstalled) return;
  pageErrorCaptureInstalled = true;
  try {
    const record = (value: unknown) => {
      try {
        window.__lastPageError = String(value);
      } catch {
        /* Never throw from the safety net. */
      }
    };
    window.addEventListener("error", (event) => {
      record(
        (event && (event as ErrorEvent).message) || event,
      );
    });
    window.addEventListener("unhandledrejection", (event) => {
      record((event && (event as PromiseRejectionEvent).reason) || event);
    });
  } catch {
    /* Never throw from the safety net. */
  }
}
