import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useReveal: scroll reveal for a section root.
 *
 * Returns [refCallback, visible]. Attach the ref callback to the section
 * root element; visible flips to true the first time at least 15 percent
 * of the element is in view, and stays true afterwards. Safe when
 * IntersectionObserver is unavailable: visible becomes true immediately.
 *
 * Pair with .mv-reveal in src/styles/motion.css:
 *   const [ref, visible] = useReveal<HTMLElement>();
 *   <section ref={ref} className={`mv-reveal ${visible ? "is-visible" : ""}`}>
 */
export function useReveal<T extends HTMLElement>() {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observerRef.current?.disconnect();
          observerRef.current = null;
        }
      },
      { threshold: 0.15 },
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return [ref, visible] as const;
}

export default useReveal;
