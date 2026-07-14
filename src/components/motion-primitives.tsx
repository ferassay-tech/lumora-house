import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Screenshot-safe reveal: animates transform + opacity FROM a visible-ish
 * state ON MOUNT (never gated behind IntersectionObserver / whileInView), so
 * a full-page headless screenshot always shows every section already
 * resolved-ish. Adds a small scroll-linked stagger via CSS transition-delay
 * keyed off an index, not off visibility.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag];

  if (reduced) {
    return (
      <Tag className={className} style={{ opacity: 1 }}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0.001, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Parallax layer driven by scroll position — transform only, always painted. */
export function ParallaxLayer({
  children,
  speed = 0.15,
  className = "",
  style,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = (rect.top - vh / 2) / vh;
        setOffset(progress * speed * 100);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: reduced ? undefined : `translate3d(0, ${offset}px, 0)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/** Cursor-follow drift for the hero book cutout — small, calm, transform-only. */
export function CursorDrift({
  children,
  strength = 10,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current?.parentElement ?? document.body;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setPos({ x: x * strength, y: y * strength });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [strength, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: reduced ? undefined : `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

