"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizeHandleProps {
  /** Called continuously while the user drags. Receives the delta-x in px. */
  onResize: (deltaX: number) => void;
  /** Called once when the drag ends. */
  onResizeEnd?: () => void;
  /** Which side of the panel does this handle sit on? Controls cursor direction. */
  side?: "left" | "right";
}

/**
 * A thin vertical drag-handle that sits between two flex panels.
 * Drag it left / right to resize the adjacent panels.
 *
 * Renders a 4 px visible bar with a wider invisible hit area (12 px).
 */
export default function ResizeHandle({
  onResize,
  onResizeEnd,
  side = "right",
}: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      startXRef.current = e.clientX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setDragging(false);
      onResizeEnd?.();
    };

    // Attach to window so the drag continues even if the cursor leaves the handle
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Prevent text selection while dragging
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [dragging, onResize, onResizeEnd]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`
        relative z-10 hidden md:flex items-center justify-center
        shrink-0 cursor-col-resize select-none group w-[1px]
      `}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
    >
      {/* Wider invisible hit target */}
      <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
      {/* Visible bar acting exactly as a border */}
      <div
        className={`
          h-full w-full transition-colors duration-150
          ${dragging ? "bg-primary" : "bg-outline-variant group-hover:bg-primary/50"}
        `}
      />
    </div>
  );
}
