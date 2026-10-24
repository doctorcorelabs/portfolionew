/**
 * Halaman canvas DEV-only, dibuka lewat hash #canvas.
 *
 * Halaman ini HANYA dirender dari cabang import.meta.env.DEV di App.tsx
 * dan tidak masuk navigasi, sitemap, atau menu mana pun. Di build
 * produksi, cabang itu gugur sehingga halaman ini tidak ikut terbit.
 *
 * Isi canvas datang dari registry.tsx di folder yang sama. File ini hanya
 * mengurus kamera, penempatan, dan panel DialKit, bukan isi varian.
 * Yang disimpan ke localStorage hanya layout (kamera dan posisi keyed by
 * id registry), bukan keanggotaan, nama, dimensi, atau isi data.
 *
 * DialRoot dipasang di sini tanpa prop productionEnabled, supaya panel
 * DialKit hanya muncul di mode dev.
 */

import { useEffect, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { canvasItems } from "./registry";

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

type Positions = Record<string, { x: number; y: number }>;

interface SavedLayout {
  camera: Camera;
  positions: Positions;
}

const STORAGE_KEY = "daivanlabs-rebuild-canvas:v1";
const LABEL_HEIGHT = 32;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.5;
const DEFAULT_CAMERA: Camera = { x: 0, y: 0, zoom: 1 };

function isFinitePoint(value: unknown): value is { x: number; y: number } {
  if (typeof value !== "object" || value === null) return false;
  const point = value as { x?: unknown; y?: unknown };
  return (
    typeof point.x === "number" &&
    Number.isFinite(point.x) &&
    typeof point.y === "number" &&
    Number.isFinite(point.y)
  );
}

function initialPositions(): Positions {
  const positions: Positions = {};
  for (const item of canvasItems) {
    positions[item.id] = { ...item.initialPosition };
  }
  return positions;
}

function loadLayout(): SavedLayout {
  const fallback: SavedLayout = {
    camera: DEFAULT_CAMERA,
    positions: initialPositions(),
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SavedLayout> & { version?: number };
    if (parsed.version !== 1) return fallback;
    const positions = initialPositions();
    if (parsed.positions && typeof parsed.positions === "object") {
      for (const item of canvasItems) {
        const saved = parsed.positions[item.id];
        if (isFinitePoint(saved)) positions[item.id] = { x: saved.x, y: saved.y };
      }
    }
    let camera = DEFAULT_CAMERA;
    const savedCamera = parsed.camera as (Camera & { zoom?: unknown }) | undefined;
    if (
      savedCamera &&
      isFinitePoint(savedCamera) &&
      typeof savedCamera.zoom === "number" &&
      Number.isFinite(savedCamera.zoom)
    ) {
      camera = {
        x: savedCamera.x,
        y: savedCamera.y,
        zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, savedCamera.zoom)),
      };
    }
    return { camera, positions };
  } catch {
    return fallback;
  }
}

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function CanvasPage() {
  const [layout, setLayout] = useState<SavedLayout>(loadLayout);
  const [toast, setToast] = useState<string | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const panRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    camX: number;
    camY: number;
  } | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    id: string;
    startX: number;
    startY: number;
    posX: number;
    posY: number;
  } | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const { camera, positions } = layout;

  useEffect(() => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ version: 1, camera, positions }),
        );
      } catch {
        // Storage tidak tersedia: canvas tetap jalan tanpa simpan.
      }
    }, 200);
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [camera, positions]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = shell.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      setLayout((prev) => {
        const factor = Math.exp(-event.deltaY * 0.0015);
        const zoom = clampZoom(prev.camera.zoom * factor);
        const ratio = zoom / prev.camera.zoom;
        return {
          ...prev,
          camera: {
            zoom,
            x: pointerX - (pointerX - prev.camera.x) * ratio,
            y: pointerY - (pointerY - prev.camera.y) * ratio,
          },
        };
      });
    };
    shell.addEventListener("wheel", onWheel, { passive: false });
    return () => shell.removeEventListener("wheel", onWheel);
  }, []);

  function zoomAroundCenter(factor: number) {
    const shell = shellRef.current;
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setLayout((prev) => {
      const zoom = clampZoom(prev.camera.zoom * factor);
      const ratio = zoom / prev.camera.zoom;
      return {
        ...prev,
        camera: {
          zoom,
          x: centerX - (centerX - prev.camera.x) * ratio,
          y: centerY - (centerY - prev.camera.y) * ratio,
        },
      };
    });
  }

  function fitAll() {
    const shell = shellRef.current;
    if (!shell || canvasItems.length === 0) return;
    const rect = shell.getBoundingClientRect();
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const item of canvasItems) {
      const pos = positions[item.id] ?? item.initialPosition;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + item.width);
      maxY = Math.max(maxY, pos.y + LABEL_HEIGHT + item.height);
    }
    const boundsWidth = maxX - minX;
    const boundsHeight = maxY - minY;
    const zoom = clampZoom(
      Math.min(rect.width / boundsWidth, rect.height / boundsHeight, 1) * 0.96,
    );
    setLayout((prev) => ({
      ...prev,
      camera: {
        zoom,
        x: rect.width / 2 - (minX + boundsWidth / 2) * zoom,
        y: rect.height / 2 - (minY + boundsHeight / 2) * zoom,
      },
    }));
  }

  function resetCamera() {
    setLayout((prev) => ({ ...prev, camera: DEFAULT_CAMERA }));
  }

  function goBack() {
    window.location.hash = "";
  }

  function onShellPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest(".canvas-item") || target.closest(".canvas-controls")) {
      return;
    }
    if (event.button !== 0) return;
    panRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      camX: camera.x,
      camY: camera.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onShellPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = panRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    setLayout((prev) => ({
      ...prev,
      camera: { ...prev.camera, x: current.camX + dx, y: current.camY + dy },
    }));
  }

  function endPan(event: ReactPointerEvent<HTMLDivElement>) {
    if (panRef.current?.pointerId === event.pointerId) {
      panRef.current = null;
    }
  }

  function onHandlePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    id: string,
  ) {
    event.stopPropagation();
    if (event.button !== 0) return;
    const pos = positions[id];
    if (!pos) return;
    dragRef.current = {
      pointerId: event.pointerId,
      id,
      startX: event.clientX,
      startY: event.clientY,
      posX: pos.x,
      posY: pos.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onHandlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = (event.clientX - drag.startX) / camera.zoom;
    const dy = (event.clientY - drag.startY) / camera.zoom;
    setLayout((prev) => ({
      ...prev,
      positions: {
        ...prev.positions,
        [drag.id]: { x: drag.posX + dx, y: drag.posY + dy },
      },
    }));
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function onHandleKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    id: string,
  ) {
    const step = event.shiftKey ? 16 : 4;
    const deltas: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    setLayout((prev) => {
      const pos = prev.positions[id];
      if (!pos) return prev;
      return {
        ...prev,
        positions: {
          ...prev.positions,
          [id]: { x: pos.x + delta.x, y: pos.y + delta.y },
        },
      };
    });
  }

  async function copyName(name: string) {
    let message: string;
    try {
      await navigator.clipboard.writeText(name);
      message = `Nama disalin: ${name}`;
    } catch {
      message = `Clipboard tidak tersedia. Salin manual: ${name}`;
    }
    setToast(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="dev-canvas-page">
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #D8D8D0",
          display: "flex",
          gap: 16,
          alignItems: "baseline",
          flexWrap: "wrap",
          fontFamily: "Archivo, system-ui, sans-serif",
        }}
      >
        <button type="button" onClick={goBack}>
          Kembali ke situs
        </button>
        <strong>Canvas DEV-only - rebuild portfolio riset</strong>
        <span style={{ color: "#6F6F68" }}>
          Semua data di canvas ini 100 persen sintetis. Seret ruang kosong
          buat pan, Ctrl + scroll buat zoom, seret handle Geser buat memindah
          kartu. Panel DialKit ada di pojok kanan bawah.
        </span>
      </div>
      <div
        ref={shellRef}
        className="canvas-shell"
        onPointerDown={onShellPointerDown}
        onPointerMove={onShellPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        style={{ height: "calc(100vh - 65px)", overflow: "hidden", position: "relative" }}
      >
        <div className="canvas-controls">
          <button type="button" onClick={() => zoomAroundCenter(1 / 1.2)} aria-label="Zoom out">
            -
          </button>
          <span className="canvas-zoom-readout">{Math.round(camera.zoom * 100)}%</span>
          <button type="button" onClick={() => zoomAroundCenter(1.2)} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={fitAll}>
            Fit all
          </button>
          <button type="button" onClick={resetCamera}>
            Reset kamera
          </button>
        </div>
        <div
          className="canvas-world"
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          }}
        >
          {canvasItems.map((item) => {
            const pos = positions[item.id] ?? item.initialPosition;
            const ItemComponent = item.component;
            return (
              <div
                key={item.id}
                className="canvas-item"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  width: item.width,
                }}
              >
                <div className="canvas-item-label-row">
                  <button
                    type="button"
                    className="canvas-item-label"
                    title="Klik buat menyalin nama"
                    onClick={() => void copyName(item.name)}
                  >
                    {item.name}
                  </button>
                  <button
                    type="button"
                    className="canvas-item-handle"
                    aria-label={`Geser ${item.name}. Pakai tombol panah setelah fokus buat memindah dengan keyboard.`}
                    onPointerDown={(event) => onHandlePointerDown(event, item.id)}
                    onPointerMove={onHandlePointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onKeyDown={(event) => onHandleKeyDown(event, item.id)}
                  >
                    Geser
                  </button>
                </div>
                <div
                  className="canvas-item-preview"
                  style={{ width: item.width, height: item.height, overflow: "hidden" }}
                >
                  <ItemComponent />
                </div>
              </div>
            );
          })}
        </div>
        {toast ? <div className="canvas-copied-toast">{toast}</div> : null}
      </div>
      <DialRoot position="bottom-right" />
    </div>
  );
}
