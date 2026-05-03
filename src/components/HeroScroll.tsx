"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroScrollProps {
  children: React.ReactNode;
  className?: string;
  extension?: string;
  frameCount?: number;
  initialPreload?: number;
  posterAlt?: string;
  posterSrc?: string;
  sequencePath?: string;
}

function frameName(index: number, extension: string) {
  return `${(index + 1).toString().padStart(4, "0")}.${extension}`;
}

function findNearestLoadedFrame(
  images: Array<HTMLImageElement | undefined>,
  targetFrame: number
) {
  if (images[targetFrame]) return images[targetFrame];

  for (let offset = 1; offset < images.length; offset++) {
    const previous = targetFrame - offset;
    const next = targetFrame + offset;

    if (previous >= 0 && images[previous]) return images[previous];
    if (next < images.length && images[next]) return images[next];
  }

  return images[0];
}

export function HeroScroll({
  children,
  className = "",
  extension = "jpg",
  frameCount = 48,
  initialPreload = 8,
  posterAlt = "Custom curtains, blinds, shutters and security screens installed in a Melbourne home",
  posterSrc = "/images/hero-sequence-optimized/0001.jpg",
  sequencePath = "/images/hero-sequence-optimized",
}: HeroScrollProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const lastRenderedFrameRef = useRef(-1);
  const pendingFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -28]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 480px)");

    const updateAnimationMode = () => {
      setCanAnimate(!reducedMotion.matches && !compactViewport.matches);
    };

    updateAnimationMode();
    reducedMotion.addEventListener("change", updateAnimationMode);
    compactViewport.addEventListener("change", updateAnimationMode);

    return () => {
      reducedMotion.removeEventListener("change", updateAnimationMode);
      compactViewport.removeEventListener("change", updateAnimationMode);
    };
  }, []);

  useEffect(() => {
    if (!canAnimate) {
      return;
    }

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    imagesRef.current = new Array(frameCount);
    lastRenderedFrameRef.current = -1;

    const frameSrc = (index: number) =>
      `${sequencePath}/${frameName(index, extension)}`;

    const loadFrame = async (index: number) => {
      if (cancelled) return undefined;
      if (imagesRef.current[index]) return imagesRef.current[index];

      const img = new window.Image();
      img.decoding = "async";
      img.src = frameSrc(index);

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      try {
        await img.decode();
      } catch {
        // The load event above is enough for drawing; decode can reject on some browsers.
      }

      if (!cancelled) {
        imagesRef.current[index] = img;
      }

      return img;
    };

    const drawFrame = (rawFrame: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const frame = Math.max(0, Math.min(frameCount - 1, Math.round(rawFrame)));
      if (frame === lastRenderedFrameRef.current) return;

      const image = findNearestLoadedFrame(imagesRef.current, frame);
      if (!image || !image.complete) return;

      const bounds = canvas.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.round(bounds.width * dpr);
      const pixelHeight = Math.round(bounds.height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, bounds.width, bounds.height);

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = bounds.width / bounds.height;
      let drawWidth = bounds.width;
      let drawHeight = bounds.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imageRatio) {
        drawHeight = bounds.width / imageRatio;
        offsetY = (bounds.height - drawHeight) / 2;
      } else {
        drawWidth = bounds.height * imageRatio;
        offsetX = (bounds.width - drawWidth) / 2;
      }

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      lastRenderedFrameRef.current = frame;
    };

    const queueDraw = (frame: number) => {
      pendingFrameRef.current = frame;
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        drawFrame(pendingFrameRef.current);
      });
    };

    const loadRest = async () => {
      for (let i = initialPreload; i < frameCount; i++) {
        if (cancelled) return;
        await loadFrame(i);
        await new Promise((resolve) => window.setTimeout(resolve, 30));
      }
    };

    const loadInitialFrames = async () => {
      await loadFrame(0);
      if (cancelled) return;

      setIsCanvasReady(true);
      queueDraw(frameIndex.get());

      const firstBatch = Math.min(initialPreload, frameCount);
      for (let i = 1; i < firstBatch; i++) {
        void loadFrame(i);
      }

      const browserWindow = window as Window & {
        requestIdleCallback?: (
          callback: () => void,
          options?: { timeout: number }
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };

      if (browserWindow.requestIdleCallback) {
        idleId = browserWindow.requestIdleCallback(() => {
          void loadRest();
        }, { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(() => {
          void loadRest();
        }, 700);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      lastRenderedFrameRef.current = -1;
      queueDraw(frameIndex.get());
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    void loadInitialFrames();
    const unsubscribe = frameIndex.on("change", queueDraw);

    return () => {
      cancelled = true;
      unsubscribe();
      resizeObserver?.disconnect();

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (idleId !== undefined) {
        (window as Window & { cancelIdleCallback?: (handle: number) => void })
          .cancelIdleCallback?.(idleId);
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    canAnimate,
    extension,
    frameCount,
    frameIndex,
    initialPreload,
    sequencePath,
  ]);

  return (
    <section
      ref={containerRef}
      className={`relative h-[150vh] min-h-screen bg-mcb-charcoal text-white md:h-[165vh] lg:h-[175vh] ${className}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Image
          src={posterSrc}
          alt={posterAlt}
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${
            canAnimate && isCanvasReady ? "opacity-0" : "opacity-55"
          }`}
        />

        {canAnimate && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
              isCanvasReady ? "opacity-55" : "opacity-0"
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-mcb-charcoal" />
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 flex h-full items-start md:items-center"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
