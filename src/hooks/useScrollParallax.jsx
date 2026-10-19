import { useEffect } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function useScrollParallax() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;
    let target = window.scrollY;
    let current = target;

    const render = () => {
      current += (target - current) * 0.075;
      if (Math.abs(target - current) < 0.1) current = target;

      const viewport = Math.max(window.innerHeight, 1);
      const progress = clamp(current / viewport, 0, 3);
      const depth = clamp(
        current / Math.max(document.body.scrollHeight, 1),
        0,
        1,
      );

      root.style.setProperty("--rc-parallax-scroll", `${current}px`);
      root.style.setProperty("--rc-parallax-progress", progress.toFixed(4));
      root.style.setProperty("--rc-parallax-depth", depth.toFixed(4));
      root.style.setProperty(
        "--rc-parallax-reveal",
        reducedMotion?.matches ? "0" : "1",
      );

      frame =
        Math.abs(target - current) < 0.1 ? 0 : requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const updateTarget = () => {
      target = window.scrollY;
      schedule();
    };
    const handleMotionChange = () => updateTarget();

    updateTarget();
    reducedMotion?.addEventListener?.("change", handleMotionChange);
    window.addEventListener("scroll", updateTarget, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(frame);
      reducedMotion?.removeEventListener?.("change", handleMotionChange);
      window.removeEventListener("scroll", updateTarget);
    };
  }, []);
}
