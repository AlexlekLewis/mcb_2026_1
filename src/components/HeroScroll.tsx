
"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface HeroScrollProps {
    frameCount?: number; // Total number of frames generated
}

export function HeroScroll({ frameCount = 96 }: HeroScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Scroll progress (0 to 1) relative to the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Map scroll progress to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    useEffect(() => {
        // Preload images
        const loadImages = async () => {
            const promises: Promise<HTMLImageElement>[] = [];

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                // Format index to 4 digits (e.g., 0001.jpg)
                const filename = `/images/hero-sequence/${i.toString().padStart(4, "0")}.jpg`;
                img.src = filename;

                const promise = new Promise<HTMLImageElement>((resolve) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(img); // Resolve anyway to avoid breaking Promise.all
                });
                promises.push(promise);
            }

            // Wait for all images to load (in parallel)
            const loadedImages = await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, [frameCount]);

    useEffect(() => {
        // Render loop triggered by scroll change
        const render = (index: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx || images.length === 0) return;

            const img = images[Math.round(index)];
            if (!img) return;

            // Handle resize / fit (cover)
            const { width, height } = canvas.getBoundingClientRect();

            // Update canvas resolution to match display size
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            // Draw image "cover" style
            const imgRatio = 1920 / 1080; // Assuming 16:9
            const canvasRatio = width / height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                drawWidth = width;
                drawHeight = width / imgRatio;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            } else {
                drawWidth = height * imgRatio;
                drawHeight = height;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            }

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            // Overlay gradient (optional, matches existing hero style)
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, width, height);
        };

        // Subscribe to scroll changes to update canvas
        const unsubscribe = frameIndex.on("change", (latest) => {
            if (isLoaded) {
                render(latest);
            }
        });

        // Initial render
        if (isLoaded) {
            render(frameIndex.get());
        }

        return () => unsubscribe();
    }, [frameIndex, images, isLoaded]);

    return (
        <div ref={containerRef} className="relative h-[350vh] bg-mcb-charcoal">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Loading State - REMOVED blocking overlay
                    The site should be usable immediately.
                    We could add a small subtle indicator if really needed, 
                    but for now let's just show the first frame or black bg.
                 */}

                {/* Content Overlay - Fades out as you scroll? Or stays fixed? 
            Let's keep the Hero text fixed or animating in/out 
        */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="container mx-auto px-6 text-center text-white">
                        <motion.h1
                            style={{ opacity: useTransform(scrollYProgress, [0.3, 0.6], [1, 0]) }}
                            className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            Soft. Sustainable. Stylish.
                        </motion.h1>
                        <motion.p
                            style={{ opacity: useTransform(scrollYProgress, [0.3, 0.6], [1, 0]) }}
                            className="text-lg md:text-2xl text-stone-200 mb-10 max-w-2xl mx-auto"
                        >
                            Premium Australian Made Curtains, Custom Crafted for Your Home.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
}
