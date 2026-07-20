"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type MutableRefObject,
} from "react";

const NEON = "#b7ff2a";
const PAPER = "#f3f5ed";
const INK = "#050705";

type Scene = {
  width: number;
  height: number;
  time: number;
  reducedMotion: boolean;
};

type DrawScene = (context: CanvasRenderingContext2D, scene: Scene) => void;

type IllustrationProps = {
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

export type SignalVariant =
  | "conversation"
  | "conversations"
  | "audience"
  | "momentum"
  | "moment"
  | "attention"
  | "targeting"
  | "growth"
  | "business";

type SignalIconProps = IllustrationProps & {
  variant: SignalVariant | number;
};

function useIllustrationCanvas(draw: DrawScene) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latestDraw = useRef(draw);

  useEffect(() => {
    latestDraw.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let isIntersecting = true;
    let animationFrame = 0;
    let animationRunning = false;
    let disposed = false;

    const paint = (timestamp = performance.now()) => {
      if (disposed) return;

      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
      const bitmapWidth = Math.max(1, Math.round(width * pixelRatio));
      const bitmapHeight = Math.max(1, Math.round(height * pixelRatio));

      if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
        canvas.width = bitmapWidth;
        canvas.height = bitmapHeight;
      }

      const context = canvas.getContext("2d");
      if (!context) return;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      latestDraw.current(context, {
        width,
        height,
        time: timestamp / 1000,
        reducedMotion,
      });
    };

    const startAnimation = () => {
      if (
        disposed ||
        animationRunning ||
        reducedMotion ||
        !isIntersecting ||
        document.hidden
      ) {
        return;
      }

      animationRunning = true;
      animationFrame = window.requestAnimationFrame(tick);
    };

    const tick = (timestamp: number) => {
      animationRunning = false;
      if (disposed) return;
      paint(timestamp);
      startAnimation();
    };

    const stopAnimation = () => {
      if (animationRunning) {
        window.cancelAnimationFrame(animationFrame);
        animationRunning = false;
      }
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      stopAnimation();
      paint();
      startAnimation();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        paint();
        startAnimation();
      }
    };

    const resizeObserver = new ResizeObserver(() => paint());
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? true;
        if (isIntersecting) {
          paint();
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(canvas);

    motionQuery.addEventListener("change", onMotionPreferenceChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    paint();
    startAnimation();

    return () => {
      disposed = true;
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return canvasRef;
}

function CanvasScene({
  canvasRef,
  className,
  style,
  aspectRatio,
  variantClass,
  ariaLabel,
}: IllustrationProps & {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  aspectRatio: string;
  variantClass: string;
  ariaLabel: string;
}) {
  return (
    <canvas
      ref={canvasRef}
      className={["weave-canvas", variantClass, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={ariaLabel}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        aspectRatio,
        ...style,
      }}
    >
      {ariaLabel}
    </canvas>
  );
}

function line(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = "rgba(243, 245, 237, 0.34)",
  width = 1,
) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
}

function circle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  stroke = "rgba(243, 245, 237, 0.62)",
  fill?: string,
  width = 1,
) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  context.strokeStyle = stroke;
  context.lineWidth = width;
  context.stroke();
}

function square(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  stroke = "rgba(243, 245, 237, 0.62)",
  fill?: string,
) {
  const half = size / 2;
  if (fill) {
    context.fillStyle = fill;
    context.fillRect(x - half, y - half, size, size);
  }
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.strokeRect(x - half, y - half, size, size);
}

function diamond(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  stroke = "rgba(243, 245, 237, 0.62)",
  fill?: string,
) {
  context.beginPath();
  context.moveTo(x, y - size);
  context.lineTo(x + size, y);
  context.lineTo(x, y + size);
  context.lineTo(x - size, y);
  context.closePath();
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.stroke();
}

function glowingPoint(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  intensity = 0.28,
) {
  context.save();
  context.shadowBlur = radius * 4;
  context.shadowColor = `rgba(183, 255, 42, ${intensity})`;
  circle(context, x, y, radius, NEON, NEON, 1);
  context.restore();
}

function label(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  align: CanvasTextAlign = "left",
  color = PAPER,
  size = 11,
) {
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = "middle";
  context.font = `500 ${size}px xVF, Arial, sans-serif`;
  context.fillText(text, x, y);
}

function drawHeroNetwork(
  context: CanvasRenderingContext2D,
  { width, height, time, reducedMotion }: Scene,
) {
  const compact = width < 560;
  const cx = width / 2;
  const cy = height * 0.52;
  const unit = Math.min(width, height);
  const phase = reducedMotion ? 0 : time * 0.34;
  const pulse = reducedMotion ? 0.5 : (Math.sin(time * 1.4) + 1) / 2;

  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#080a08");
  background.addColorStop(0.55, "#050705");
  background.addColorStop(1, "#090b08");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const wash = context.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.68);
  wash.addColorStop(0, "rgba(183, 255, 42, 0.055)");
  wash.addColorStop(1, "rgba(183, 255, 42, 0)");
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(243, 245, 237, 0.08)";
  context.lineWidth = 1;
  context.strokeRect(0.5, 0.5, width - 1, height - 1);

  context.save();
  context.setLineDash([4, 7]);
  line(context, width * 0.045, cy, width * 0.955, cy, "rgba(243, 245, 237, 0.30)");
  context.restore();

  line(context, cx, height * 0.11, cx, height * 0.89, "rgba(243, 245, 237, 0.2)");
  for (let tick = -2; tick <= 2; tick += 1) {
    if (tick === 0) continue;
    const tickY = cy + tick * height * 0.17;
    line(context, cx - 4, tickY, cx + 4, tickY, "rgba(183, 255, 42, 0.55)");
  }

  const orbitData = compact
    ? [
        { x: 0.25, rx: 0.16, ry: 0.28 },
        { x: 0.39, rx: 0.11, ry: 0.2 },
        { x: 0.61, rx: 0.11, ry: 0.2 },
        { x: 0.75, rx: 0.16, ry: 0.28 },
      ]
    : [
        { x: 0.26, rx: 0.13, ry: 0.3 },
        { x: 0.39, rx: 0.09, ry: 0.21 },
        { x: 0.47, rx: 0.045, ry: 0.115 },
        { x: 0.53, rx: 0.045, ry: 0.115 },
        { x: 0.61, rx: 0.09, ry: 0.21 },
        { x: 0.74, rx: 0.13, ry: 0.3 },
      ];

  orbitData.forEach((orbit, index) => {
    const x = width * orbit.x;
    context.beginPath();
    context.ellipse(x, cy, width * orbit.rx, height * orbit.ry, 0, 0, Math.PI * 2);
    context.strokeStyle =
      index === 0 || index === orbitData.length - 1
        ? "rgba(243, 245, 237, 0.7)"
        : "rgba(243, 245, 237, 0.48)";
    context.lineWidth = 1;
    context.stroke();

    const angle = phase * (index % 2 ? -1 : 1) + index * 0.83;
    const nodeX = x + Math.cos(angle) * width * orbit.rx;
    const nodeY = cy + Math.sin(angle) * height * orbit.ry;
    glowingPoint(context, nodeX, nodeY, compact ? 1.6 : 2, 0.22);
  });

  context.save();
  context.beginPath();
  context.moveTo(width * 0.09, cy);
  context.bezierCurveTo(width * 0.29, cy - height * 0.37, width * 0.38, cy + height * 0.36, cx, cy);
  context.bezierCurveTo(width * 0.62, cy - height * 0.36, width * 0.71, cy + height * 0.37, width * 0.91, cy);
  context.strokeStyle = "rgba(183, 255, 42, 0.23)";
  context.lineWidth = 1;
  context.setLineDash([2, 7]);
  context.stroke();
  context.restore();

  const travelX = width * (0.08 + 0.84 * ((phase * 0.3) % 1));
  glowingPoint(context, travelX, cy, 1.5 + pulse, 0.42);

  context.save();
  context.shadowColor = "rgba(183, 255, 42, 0.42)";
  context.shadowBlur = 22 + pulse * 8;
  circle(context, cx, cy, compact ? 11 : 14, NEON, NEON, 1.2);
  context.restore();
  label(context, "W", cx, cy + 0.5, "center", INK, compact ? 9 : 11);

  const satellitePoints = [
    [0.12, 0.3, "square"],
    [0.19, 0.76, "circle"],
    [0.81, 0.22, "circle"],
    [0.89, 0.73, "square"],
  ] as const;
  satellitePoints.forEach(([x, y, shape], index) => {
    const px = width * x;
    const py = height * y;
    line(
      context,
      px,
      py,
      cx + (x < 0.5 ? -1 : 1) * unit * 0.075,
      cy,
      "rgba(243, 245, 237, 0.13)",
    );
    if (shape === "square") square(context, px, py, 5, index === 0 ? NEON : undefined);
    else circle(context, px, py, 2.8, index === 2 ? NEON : undefined, INK);
  });

  if (!compact) {
    const cardWidth = Math.min(175, width * 0.19);
    const cardHeight = 31;
    context.fillStyle = "rgba(5, 7, 5, 0.9)";
    context.strokeStyle = "rgba(243, 245, 237, 0.45)";
    context.lineWidth = 1;
    context.fillRect(width * 0.095, height * 0.22, cardWidth, cardHeight);
    context.strokeRect(width * 0.095 + 0.5, height * 0.22 + 0.5, cardWidth - 1, cardHeight - 1);
    label(context, "REPOSITORIES, IN MOTION.", width * 0.095 + 12, height * 0.22 + 16, "left", PAPER, 10);

    context.fillStyle = "rgba(5, 7, 5, 0.9)";
    context.fillRect(width * 0.71, height * 0.7, cardWidth, cardHeight);
    context.strokeRect(width * 0.71 + 0.5, height * 0.7 + 0.5, cardWidth - 1, cardHeight - 1);
    label(context, "PEOPLE, CONNECTED.", width * 0.71 + 12, height * 0.7 + 16, "left", NEON, 10);
  }

  label(context, "01 / DISCOVER", width * 0.04, height * 0.09, "left", "rgba(243, 245, 237, 0.48)", compact ? 8 : 9);
  label(context, "THE SOCIAL LAYER FOR CODE", width * 0.96, height * 0.91, "right", "rgba(243, 245, 237, 0.48)", compact ? 8 : 9);
}

function drawConversation(
  context: CanvasRenderingContext2D,
  scene: Scene,
) {
  const { width, height, time, reducedMotion } = scene;
  const phase = reducedMotion ? 0.45 : (time * 0.18) % 1;
  const ys = [0.27, 0.5, 0.73];
  ys.forEach((yRatio, index) => {
    const y = height * yRatio;
    const start = width * 0.17;
    const end = width * 0.83;
    context.save();
    context.setLineDash([3, 5]);
    line(context, start, y, end, y, "rgba(243, 245, 237, 0.38)");
    context.restore();
    square(context, start, y, 5, index === 1 ? NEON : undefined);
    square(context, end, y, 5);
    const nodeX = start + (end - start) * ((phase + index * 0.31) % 1);
    circle(context, nodeX, y, height * 0.105, "rgba(243, 245, 237, 0.6)", INK);
    glowingPoint(context, nodeX, y, 2.2, 0.32);
  });
}

function drawAudience(context: CanvasRenderingContext2D, scene: Scene) {
  const { width, height, time, reducedMotion } = scene;
  const targetX = width * 0.69;
  const targetY = height * 0.68;
  const sources = [
    [0.16, 0.16, "circle"],
    [0.42, 0.16, "square"],
    [0.68, 0.16, "square"],
    [0.16, 0.44, "square"],
    [0.42, 0.44, "diamond"],
  ] as const;

  sources.forEach(([xRatio, yRatio, shape], index) => {
    const x = width * xRatio;
    const y = height * yRatio;
    context.save();
    context.setLineDash(index % 2 ? [4, 5] : [2, 6]);
    line(context, x, y, targetX, targetY, "rgba(243, 245, 237, 0.35)");
    context.restore();
    if (shape === "circle") circle(context, x, y, 3, "rgba(243, 245, 237, 0.75)", INK);
    if (shape === "square") square(context, x, y, 5, index === 2 ? NEON : undefined, index === 2 ? NEON : INK);
    if (shape === "diamond") diamond(context, x, y, 4, "rgba(243, 245, 237, 0.75)", INK);
  });

  circle(context, targetX, targetY, height * 0.12, "rgba(243, 245, 237, 0.68)", INK);
  const pulse = reducedMotion ? 0 : Math.sin(time * 1.6) * 1.2;
  circle(context, targetX, targetY, height * 0.07 + pulse, "rgba(183, 255, 42, 0.7)");
  square(context, targetX, targetY, 6, NEON, NEON);
}

function drawMomentum(context: CanvasRenderingContext2D, scene: Scene) {
  const { width, height, time, reducedMotion } = scene;
  const cx = width * 0.53;
  const cy = height * 0.54;
  const radius = Math.min(width, height) * 0.34;
  const rotation = reducedMotion ? 0 : Math.sin(time * 0.55) * 0.08;

  context.save();
  context.translate(cx, cy);
  context.rotate(rotation);
  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12;
    const inner = radius * (index % 3 === 0 ? 0.26 : 0.18);
    const outer = radius * (index % 2 === 0 ? 1 : 0.76);
    line(
      context,
      Math.cos(angle) * inner,
      Math.sin(angle) * inner,
      Math.cos(angle) * outer,
      Math.sin(angle) * outer,
      index === 1 || index === 8 ? "rgba(183, 255, 42, 0.7)" : "rgba(243, 245, 237, 0.36)",
    );
    if (index % 3 === 0) {
      circle(context, Math.cos(angle) * outer, Math.sin(angle) * outer, 2.5, "rgba(243, 245, 237, 0.7)", INK);
    }
  }
  context.restore();
  square(context, cx, cy, Math.min(width, height) * 0.22, "rgba(243, 245, 237, 0.72)", INK);
  glowingPoint(context, cx, cy, 3, 0.4);
}

function drawAttention(context: CanvasRenderingContext2D, scene: Scene) {
  const { width, height, time, reducedMotion } = scene;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.27;
  const phase = reducedMotion ? 0.7 : time * 0.4;

  context.save();
  context.setLineDash([3, 5]);
  circle(context, cx, cy, radius * 1.28, "rgba(243, 245, 237, 0.3)");
  context.restore();
  diamond(context, cx, cy, radius, "rgba(243, 245, 237, 0.65)", INK);
  circle(context, cx, cy, radius * 0.52, "rgba(183, 255, 42, 0.58)");
  glowingPoint(context, cx, cy, 2.6, 0.4);

  for (let index = 0; index < 4; index += 1) {
    const angle = phase + (Math.PI / 2) * index;
    const x = cx + Math.cos(angle) * radius * 1.28;
    const y = cy + Math.sin(angle) * radius * 1.28;
    if (index % 2) square(context, x, y, 5, index === 1 ? NEON : undefined, INK);
    else circle(context, x, y, 2.8, "rgba(243, 245, 237, 0.7)", INK);
  }
}

function drawTargeting(context: CanvasRenderingContext2D, scene: Scene) {
  const { width, height, time, reducedMotion } = scene;
  const cx = width * 0.47;
  const cy = height * 0.49;
  const radius = Math.min(width, height) * 0.31;
  const rings = [1, 0.7, 0.38];

  rings.forEach((multiplier, index) => {
    context.save();
    if (index === 0) context.setLineDash([4, 5]);
    circle(
      context,
      cx,
      cy,
      radius * multiplier,
      index === 2 ? "rgba(183, 255, 42, 0.72)" : "rgba(243, 245, 237, 0.38)",
    );
    context.restore();
  });

  const angle = -0.56 + (reducedMotion ? 0 : Math.sin(time * 0.65) * 0.09);
  const endX = cx + Math.cos(angle) * radius * 1.38;
  const endY = cy + Math.sin(angle) * radius * 1.38;
  line(context, cx, cy, endX, endY, "rgba(243, 245, 237, 0.72)");
  circle(context, endX, endY, 3, NEON, INK);
  glowingPoint(context, cx, cy, 3, 0.42);
}

function drawGrowth(context: CanvasRenderingContext2D, scene: Scene) {
  const { width, height, time, reducedMotion } = scene;
  const topY = height * 0.2;
  const middleY = height * 0.53;
  const bottomY = height * 0.8;
  const cx = width / 2;
  const points = [width * 0.23, width * 0.39, width * 0.61, width * 0.77];

  context.save();
  context.setLineDash([3, 5]);
  points.forEach((x) => line(context, x, topY, cx, middleY, "rgba(243, 245, 237, 0.34)"));
  context.restore();
  line(context, cx, middleY, cx - width * 0.13, bottomY, "rgba(243, 245, 237, 0.54)");
  line(context, cx, middleY, cx + width * 0.13, bottomY, "rgba(243, 245, 237, 0.54)");

  points.forEach((x, index) => diamond(context, x, topY, 3.5, index === 2 ? NEON : undefined, INK));
  diamond(context, cx, middleY, 4.5, "rgba(243, 245, 237, 0.72)", INK);
  const pulse = reducedMotion ? 0 : (Math.sin(time * 1.5) + 1) * 0.8;
  square(context, cx - width * 0.13, bottomY, 7, "rgba(243, 245, 237, 0.6)", INK);
  square(context, cx + width * 0.13, bottomY, 12 + pulse, NEON, INK);
  glowingPoint(context, cx + width * 0.13, bottomY, 2.4, 0.38);
}

function normalizeVariant(variant: SignalVariant | number) {
  if (typeof variant === "number") {
    return ["conversation", "audience", "momentum", "attention", "targeting", "growth"][
      Math.abs(Math.round(variant)) % 6
    ];
  }

  const aliases: Record<SignalVariant, string> = {
    conversation: "conversation",
    conversations: "conversation",
    audience: "audience",
    momentum: "momentum",
    moment: "momentum",
    attention: "attention",
    targeting: "targeting",
    growth: "growth",
    business: "growth",
  };
  return aliases[variant];
}

function drawSignalVariant(
  variant: SignalVariant | number,
  context: CanvasRenderingContext2D,
  scene: Scene,
) {
  const normalized = normalizeVariant(variant);
  context.clearRect(0, 0, scene.width, scene.height);
  const glow = context.createRadialGradient(
    scene.width / 2,
    scene.height / 2,
    0,
    scene.width / 2,
    scene.height / 2,
    Math.min(scene.width, scene.height) * 0.55,
  );
  glow.addColorStop(0, "rgba(183, 255, 42, 0.035)");
  glow.addColorStop(1, "rgba(183, 255, 42, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, scene.width, scene.height);

  if (normalized === "conversation") drawConversation(context, scene);
  if (normalized === "audience") drawAudience(context, scene);
  if (normalized === "momentum") drawMomentum(context, scene);
  if (normalized === "attention") drawAttention(context, scene);
  if (normalized === "targeting") drawTargeting(context, scene);
  if (normalized === "growth") drawGrowth(context, scene);
}

function drawOrbitCTA(
  context: CanvasRenderingContext2D,
  { width, height, time, reducedMotion }: Scene,
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const unit = Math.min(width, height);
  const compact = width < 540;
  const phase = reducedMotion ? 0.4 : time * 0.24;

  context.fillStyle = "#050705";
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.72);
  glow.addColorStop(0, "rgba(183, 255, 42, 0.07)");
  glow.addColorStop(1, "rgba(183, 255, 42, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.setLineDash([9, 10]);
  line(context, width * 0.01, cy, width * 0.99, cy, "rgba(243, 245, 237, 0.5)");
  context.restore();
  square(context, width * 0.01, cy, 8, "rgba(243, 245, 237, 0.75)", INK);
  square(context, width * 0.99, cy, 8, "rgba(243, 245, 237, 0.75)", INK);

  const ringRadius = unit * (compact ? 0.33 : 0.36);
  context.save();
  context.setLineDash([10, 11]);
  circle(context, cx, cy, ringRadius, "rgba(243, 245, 237, 0.62)");
  context.restore();

  context.save();
  context.translate(cx, cy);
  context.rotate(-0.64);
  context.beginPath();
  context.ellipse(0, 0, ringRadius * 1.45, ringRadius * 0.72, 0, 0, Math.PI * 2);
  context.strokeStyle = "rgba(243, 245, 237, 0.78)";
  context.lineWidth = 1;
  context.stroke();

  const orbitX = Math.cos(phase) * ringRadius * 1.45;
  const orbitY = Math.sin(phase) * ringRadius * 0.72;
  glowingPoint(context, orbitX, orbitY, 3, 0.42);
  context.restore();

  const dashedX = cx + Math.cos(-phase * 0.82 + 0.5) * ringRadius;
  const dashedY = cy + Math.sin(-phase * 0.82 + 0.5) * ringRadius;
  circle(context, dashedX, dashedY, 4, "rgba(243, 245, 237, 0.74)", INK);

  context.save();
  context.shadowColor = "rgba(183, 255, 42, 0.35)";
  context.shadowBlur = 24;
  circle(context, cx, cy, compact ? 31 : 38, NEON, "rgba(5, 7, 5, 0.94)", 1.2);
  context.restore();
  label(context, "OPEN SOURCE / OPEN CONNECTIONS", width * 0.055, height * 0.12, "left", "rgba(243, 245, 237, 0.42)", compact ? 7 : 9);
  label(context, "03 / BELONG", width * 0.945, height * 0.88, "right", "rgba(243, 245, 237, 0.42)", compact ? 7 : 9);
}

export function HeroNetwork({ className, style, ariaLabel }: IllustrationProps) {
  const canvasRef = useIllustrationCanvas(drawHeroNetwork);
  return (
    <CanvasScene
      canvasRef={canvasRef}
      className={className}
      style={style}
      aspectRatio="16 / 7"
      variantClass="weave-canvas--hero"
      ariaLabel={
        ariaLabel ??
        "An animated constellation of repositories and people connected through Weave"
      }
    />
  );
}

export function SignalIcon({
  variant,
  className,
  style,
  ariaLabel,
}: SignalIconProps) {
  const draw = (context: CanvasRenderingContext2D, scene: Scene) =>
    drawSignalVariant(variant, context, scene);
  const canvasRef = useIllustrationCanvas(draw);
  const normalized = normalizeVariant(variant);

  return (
    <CanvasScene
      canvasRef={canvasRef}
      className={className}
      style={style}
      aspectRatio="8 / 5"
      variantClass="weave-canvas--signal"
      ariaLabel={ariaLabel ?? `${normalized} signal diagram`}
    />
  );
}

export function OrbitCTA({ className, style, ariaLabel }: IllustrationProps) {
  const canvasRef = useIllustrationCanvas(drawOrbitCTA);
  return (
    <CanvasScene
      canvasRef={canvasRef}
      className={className}
      style={style}
      aspectRatio="16 / 7"
      variantClass="weave-canvas--orbit"
      ariaLabel={ariaLabel ?? "Repositories orbiting the Weave community"}
    />
  );
}
