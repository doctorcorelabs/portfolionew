import { useEffect } from "react";

/**
 * Set document.title and the meta description for the current route.
 * On unmount, the previous title and description are restored.
 */
export function usePageTitle(title: string, description?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const previousDescription = meta?.getAttribute("content") ?? null;
    const createdMeta = !meta;
    const target = meta ?? document.createElement("meta");
    if (createdMeta) {
      target.setAttribute("name", "description");
      document.head.appendChild(target);
    }

    document.title = title;
    if (description !== undefined) {
      target.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (previousDescription === null) {
        target.remove();
      } else {
        target.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}

export default usePageTitle;
