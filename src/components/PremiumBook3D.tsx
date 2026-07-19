import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
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

const PremiumBook3D: React.FC<PremiumBook3DProps> = ({ cover, alt }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const openTimer = useRef<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 20,
    mass: 0.6,
  });

  const shadowX = useTransform(rotateY, [-14, 14], [18, -18]);
  const shadowY = useTransform(rotateX, [-10, 10], [-14, 14]);

  const lightXRaw = useTransform(mouseX, [-0.5, 0.5], [25, 75]);
  const lightYRaw = useTransform(mouseY, [-0.5, 0.5], [20, 80]);
  const lightX = useSpring(lightXRaw, { stiffness: 120, damping: 24 });
  const lightY = useSpring(lightYRaw, { stiffness: 120, damping: 24 });
  const reflectionPosition = useMotionTemplate`${lightX}% ${lightY}%`;

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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
  setIsHovered(true);

  if (openTimer.current) {
    clearTimeout(openTimer.current);
  }

  openTimer.current = window.setTimeout(() => {
    setIsBookOpen(true);
  }, 250);
}}
      onMouseLeave={handleMouseLeave}
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
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 75%)",
          filter: "blur(16px)",
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
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.03 }}
      >
        {/* Back cover / fixed book body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateZ(-${THICKNESS / 2}px)`,
            borderRadius: "3px 8px 8px 3px",
            background:
              "linear-gradient(135deg, #2a1c12 0%, #1b120b 50%, #2a1c12 100%)",
            boxShadow: "inset 0 0 34px rgba(0,0,0,0.6)",
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
              "linear-gradient(90deg, #120b06 0%, #3a2718 45%, #1b120b 100%)",
            boxShadow: "inset -4px 0 12px rgba(0,0,0,0.5)",
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
            background:
              "repeating-linear-gradient(180deg, #f4ecd8 0px, #f4ecd8 2px, #e2d7bd 2px, #e2d7bd 3px)",
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
              "repeating-linear-gradient(90deg, #f4ecd8 0px, #f4ecd8 2px, #e2d7bd 2px, #e2d7bd 3px)",
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
            const zPos = THICKNESS / 2 - 10 - (i + 1) * depthStep;
            const inset = 2.5 + i * 0.5;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: inset,
                  left: inset,
                  right: inset,
                  bottom: inset,
                  transform: `translateZ(${zPos}px)`,
                  background: `linear-gradient(135deg, ${color} 0%, ${color} 60%, #e0d4b2 100%)`,
                  borderRadius: "1px 6px 6px 1px",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.18), inset 0 0 6px rgba(0,0,0,0.04)",
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
            "0 8px 18px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.04)",
           
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
          {/* Static diagonal sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
             "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.07) 85%, rgba(255,255,255,0.07) 100%)",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
          {/* Spine-side edge shading */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 12,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.38), rgba(0,0,0,0))",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PremiumBook3D;