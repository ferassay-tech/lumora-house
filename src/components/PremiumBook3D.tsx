import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface PremiumBook3DProps {
  cover: string;
  alt: string;
}

const WIDTH = 380;
const HEIGHT = 535;
const THICKNESS = 32;
const CONTAINER_WIDTH = WIDTH + THICKNESS + 60;
const CONTAINER_HEIGHT = HEIGHT + 80;
const SHADOW_WIDTH = WIDTH * 0.72;
const SHADOW_HEIGHT = HEIGHT * 0.14;
const SHADOW_LEFT = (CONTAINER_WIDTH - SHADOW_WIDTH) / 2;

const COVER_ANGLE = -19;
const PAGE1_ANGLE = COVER_ANGLE * 0.7;
const PAGE2_ANGLE = COVER_ANGLE * 0.35;

const STACK_PAGES = [
  "#fbf7ee",
  "#f7f1e2",
  "#f4ecd8",
  "#f1e9d6",
  "#ede4cc",
  "#e9dfc4",
  "#e5dabc",
  "#e0d4b2",
];

// Small fixed per-sheet jitter — deterministic, not random — so the fixed
// paper stack reads as naturally uneven compressed paper instead of a
// perfectly uniform mathematical progression.
const PAGE_JITTER = [0.35, -0.2, 0.45, -0.3, 0.2, -0.4, 0.3, -0.15];

const PremiumBook3D: React.FC<PremiumBook3DProps> = ({ cover, alt }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const isMobile =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const reducedMotion = useReducedMotion();
  const openTimer = useRef<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Heavier mass with stiffness/damping scaled to preserve the same ~0.83
  // damping ratio (so the settle stays just as restrained, non-bouncy) while
  // dropping the natural frequency ~30% — the book now visibly lags behind
  // the cursor and takes longer to stop, like an object with real mass
  // rather than a UI layer tracking a pointer.
  const TILT_SPRING = { stiffness: 110, damping: 22, mass: 1.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), TILT_SPRING);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), TILT_SPRING);

  const shadowX = useTransform(rotateY, [-14, 14], [18, -18]);
  const shadowY = useTransform(rotateX, [-10, 10], [-14, 14]);

  // Shadow softens, grows and lightens with tilt magnitude — approximates
  // the book lifting slightly at its tilted edge instead of a shadow that
  // only slides beneath a perfectly flat surface.
  const tiltMagnitude = useTransform(
    [rotateX, rotateY],
    ([rx, ry]: number[]) => Math.min(1, (Math.abs(rx) + Math.abs(ry)) / 24)
  );
  const shadowScale = useTransform(tiltMagnitude, [0, 1], [1, 1.15]);
  const shadowOpacity = useTransform(tiltMagnitude, [0, 1], [1, 0.7]);
  const shadowBlurPx = useTransform(tiltMagnitude, [0, 1], [16, 26]);
  const shadowBlur = useMotionTemplate`blur(${shadowBlurPx}px)`;

  const lightXRaw = useTransform(mouseX, [-0.5, 0.5], [25, 75]);
  const lightYRaw = useTransform(mouseY, [-0.5, 0.5], [20, 80]);
  const REFLECTION_SPRING = { stiffness: 100, damping: 22, mass: 0.8 };
  const lightX = useSpring(lightXRaw, REFLECTION_SPRING);
  const lightY = useSpring(lightYRaw, REFLECTION_SPRING);
  const reflectionPosition = useMotionTemplate`${lightX}% ${lightY}%`;
  // Specular glint reads brighter at a sharper viewing angle, like a real gloss laminate.
  const reflectionIntensity = useTransform(tiltMagnitude, [0, 1], [0.5, 1]);

  // Second, broader sheen — tied to tilt (not raw cursor) so it sweeps the
  // cover more slowly than the glint above, like light rolling across a
  // laminated hardcover as it turns.
  const sheenX = useTransform(rotateY, [-14, 14], [30, 70]);
  const sheenY = useTransform(rotateX, [-10, 10], [70, 30]);
  const sheenPosition = useMotionTemplate`${sheenX}% ${sheenY}%`;

  // Fore-edge highlight — directional (not just magnitude), like light
  // catching the laminated edge opposite the spine as the book turns one way.
  const edgeHighlightOpacity = useTransform(rotateY, [-14, 14], [0.1, 0.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handleMouseLeave = () => {
  if (openTimer.current) {
    clearTimeout(openTimer.current);
  }

  mouseX.set(0);
  mouseY.set(0);

  setIsHovered(false);
  setIsBookOpen(false);
};

  return (
    <div
      ref={containerRef}
      onMouseMove={isMobile || reducedMotion ? undefined : handleMouseMove}

onMouseEnter={
  isMobile || reducedMotion
    ? undefined
    : () => {
        setIsHovered(true);

        if (openTimer.current) {
          clearTimeout(openTimer.current);
        }

        openTimer.current = window.setTimeout(() => {
          setIsBookOpen(true);
        }, 250);
      }
}
      onMouseLeave={isMobile || reducedMotion ? undefined : handleMouseLeave}
      style={{
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1800px",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Floating drop shadow */}
      <motion.div
        style={{
          position: "absolute",
          width: SHADOW_WIDTH,
          height: SHADOW_HEIGHT,
          left: SHADOW_LEFT,
          bottom: 8,
          x: shadowX,
          y: shadowY,
          scale: shadowScale,
          opacity: shadowOpacity,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 75%)",
          filter: shadowBlur,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      <motion.div
        style={{
          width: WIDTH,
          height: HEIGHT,
          position: "relative",
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          zIndex: 1,
        }}
        transition={{ default: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
        whileHover={
          reducedMotion
            ? undefined
            : { scale: 1.03, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
        }
      >
        {/* Back cover / fixed book body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateZ(-${THICKNESS / 2}px)`,
            borderRadius: "3px 8px 8px 3px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.32) 6px, rgba(0,0,0,0.42) 8px, rgba(255,255,255,0.08) 10px, transparent 14px, transparent 100%), linear-gradient(135deg, #2a1c12 0%, #1b120b 50%, #2a1c12 100%)",
            boxShadow:
              "inset 0 0 34px rgba(0,0,0,0.6), inset -3px -3px 4px rgba(0,0,0,0.25), inset 0 3px 4px rgba(0,0,0,0.25)",
          }}
        />

        {/* Spine */}
        <div
          style={{
            position: "absolute",
            left: -THICKNESS / 2,
            top: 0,
            width: THICKNESS,
            height: HEIGHT,
            transformOrigin: "right center",
            transform: "rotateY(-90deg)",
            background:
              "linear-gradient(90deg, #0d0805 0%, #1b120b 12%, #2e1e12 30%, #43301c 48%, #3a2718 62%, #1f140c 85%, #0d0805 100%)",
            boxShadow:
              "inset -4px 0 12px rgba(0,0,0,0.5), inset 4px 0 12px rgba(0,0,0,0.5)",
            borderRadius: "3px 0 0 3px",
          }}
        />

        {/* Right page-edge stack */}
        <div
          style={{
            position: "absolute",
            right: -THICKNESS / 2,
            top: 3,
            width: THICKNESS,
            height: HEIGHT - 6,
            transformOrigin: "left center",
            transform: "rotateY(90deg)",
            // Irregular, low-alpha tonal drift layered over the fine sheet
            // repeat below — breaks the perfectly periodic look so the
            // fore-edge reads as compressed paper fiber, not a printed strip.
            background:
              "linear-gradient(178deg, rgba(0,0,0,0.035) 0%, rgba(255,255,255,0.025) 9%, rgba(0,0,0,0.02) 17%, rgba(255,255,255,0.03) 26%, rgba(0,0,0,0.025) 38%, rgba(255,255,255,0.02) 51%, rgba(0,0,0,0.03) 64%, rgba(255,255,255,0.025) 76%, rgba(0,0,0,0.02) 88%, rgba(255,255,255,0.03) 100%), repeating-linear-gradient(180deg, #f7f1e3 0px, #f2ead9 1.2px, #ede3cf 2.1px, #f2ead9 3px, #f7f1e3 4.4px)",
            boxShadow: "inset 0 0 9px rgba(0,0,0,0.25)",
          }}
        />

        {/* Bottom page-edge stack */}
        <div
          style={{
            position: "absolute",
            left: 3,
            bottom: -THICKNESS / 2,
            width: WIDTH - 6,
            height: THICKNESS,
            transformOrigin: "top center",
            transform: "rotateX(-90deg)",
            background:
              "repeating-linear-gradient(90deg, #f7f1e3 0px, #f2ead9 1.2px, #ede3cf 2.1px, #f2ead9 3px, #f7f1e3 4.4px)",
            boxShadow: "inset 0 0 9px rgba(0,0,0,0.25)",
          }}
        />

        {/* Fixed interior paper stack */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
          }}
        >
          {STACK_PAGES.map((color, i) => {
            const depthStep = (THICKNESS - 8) / (STACK_PAGES.length + 2);
            // Starts one page-step below the innermost moving sheet (at
            // THICKNESS/2 - 7) so the fixed stack picks up where it leaves
            // off, instead of leaving a hollow gap in the page block.
            const zPos = THICKNESS / 2 - 7 - (i + 1) * depthStep;
            const insetBase = 2.5 + i * 0.5;
            const jitter = PAGE_JITTER[i % PAGE_JITTER.length];
            const shadowStrength = (0.14 + Math.abs(jitter) * 0.06).toFixed(2);
            // Ambient-occlusion-style darkening that ramps smoothly with
            // depth (shallow near the moving sheets, deepest near the back
            // cover) instead of identical flat shading on every layer — so
            // the stack reads as one continuously shaded mass rather than a
            // handful of equally-lit, individually visible sheets.
            const occlusion = i / (STACK_PAGES.length - 1);
            const occlusionAlpha = (0.04 + occlusion * 0.18).toFixed(2);
            const occlusionBlur = (6 + occlusion * 6).toFixed(1);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: insetBase + jitter,
                  // Spine side (left): heavily damped — pages read as pressed
                  // tight and bound. Fore-edge (right): amplified — the same
                  // jitter values now read as the freer, unbound edge.
                  left: insetBase - jitter * 0.15,
                  right: insetBase + jitter * 0.9,
                  bottom: insetBase - jitter,
                  transform: `translateZ(${zPos}px)`,
                  background: `linear-gradient(135deg, ${color} 0%, ${color} 60%, #e0d4b2 100%)`,
                  borderRadius: "1px 6px 6px 1px",
                  boxShadow: `0 1px 2px rgba(0,0,0,${shadowStrength}), inset 0 0 ${occlusionBlur}px rgba(0,0,0,${occlusionAlpha})`,
                }}
              />
            );
          })}
        </div>

        {/* Second moving sheet — subtle motion, mostly fixed */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            z: THICKNESS / 2 - 5,
            background:
              "linear-gradient(135deg, #fdfaf1 0%, #f8f2df 55%, #efe6cc 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
          animate={{
            rotateY: isBookOpen ? PAGE2_ANGLE : 0,
            borderRadius: isBookOpen
              ? "2px 18px 18px 2px"
              : "2px 6px 6px 2px",
          }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 25%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* First moving sheet — closest to the cover */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            transformOrigin: "left center",
            z: THICKNESS / 2 - 7,
           background:
           "linear-gradient(135deg, #fffdf7 0%, #fbf6e8 55%, #f2ead3 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
          animate={{
            rotateY: isBookOpen ? PAGE1_ANGLE : 0,
            borderRadius: isBookOpen
              ? "2px 26px 26px 2px"
              : "2px 7px 7px 2px",
          }}
          transition={{ type: "spring", stiffness: 130, damping: 17 }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: WIDTH - 2,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 30%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
               "linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 12%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* Front cover */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            z: THICKNESS / 2,
            overflow: "hidden",
            boxShadow:
            "0 8px 18px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.04), inset -3px -3px 4px rgba(0,0,0,0.22), inset 0 3px 4px rgba(0,0,0,0.22)",

          }}
          animate={{
            rotateY: isBookOpen ? COVER_ANGLE : 0,
            borderRadius: isBookOpen
              ? "3px 36px 36px 3px"
              : "3px 8px 8px 3px",
          }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          role="img"
          aria-label={alt}
        >
          {/* Reactive glossy reflection */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0) 60%)",
              backgroundSize: "200% 200%",
              backgroundPosition: reflectionPosition,
              opacity: reflectionIntensity,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
          <img
  src={cover}
  alt={alt}
  draggable={false}
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
    userSelect: "none",
  }}
/>
          {/* Moving diagonal sheen — tied to tilt, sweeps slower than the glint above */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
             "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.07) 85%, rgba(255,255,255,0.07) 100%)",
              backgroundSize: "220% 220%",
              backgroundPosition: sheenPosition,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
          {/* Spine-side hinge groove — the crease where a case-bound board meets the spine */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 12,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.30) 5px, rgba(0,0,0,0.40) 7px, rgba(255,255,255,0.10) 9px, rgba(0,0,0,0) 12px)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PremiumBook3D;