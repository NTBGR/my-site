"use client";

import { useEffect, type RefObject } from "react";

// მაუსით „ჩაჭერა და გადაწევა“ ჰორიზონტალურ ზოლზე (კომპიუტერზე). ტელეფონზე შეხების სქროლი ისედაც მუშაობს, ამიტომ მხოლოდ მაუსს ვუსმენთ.
// გადაწევისას scroll-snap დროებით გამორთულია, რომ ზოლი ხელს არ ეწინააღმდეგებოდეს; გადაწევის შემდეგ ბმულზე შემთხვევითი დაჭერა იგნორირდება.
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let suppressClick = false;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      down = true;
      moved = false;
      suppressClick = false;
      startX = event.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (event: PointerEvent) => {
      if (!down) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
        el.style.userSelect = "none";
        el.setPointerCapture(event.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onEnd = () => {
      if (!down) return;
      down = false;
      if (moved) {
        suppressClick = true;
        el.style.scrollSnapType = "";
        el.style.cursor = "";
        el.style.userSelect = "";
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    // ბმულები და სურათები თავისით არ უნდა „მიიზიდონ“ (ბრაუზერის drag-and-drop)
    const onDragStart = (event: DragEvent) => event.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointercancel", onEnd);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [ref]);
}
