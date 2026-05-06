"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";

const CATEGORY_ORDER = ["All", "Curtains", "Blinds", "Shutters", "Security", "Outdoor"] as const;

type Props = {
  projects: Project[];
};

export default function ProjectGallery({ projects }: Props) {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return CATEGORY_ORDER.filter((c) => c === "All" || present.has(c));
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  return (
    <>
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 px-4 pb-10 md:gap-3">
        {categories.map((cat) => {
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-colors ${
                isActive
                  ? "border-mcb-terracotta bg-mcb-terracotta text-white"
                  : "border-stone-300 bg-white text-mcb-charcoal hover:border-mcb-terracotta hover:text-mcb-terracotta"
              }`}
              aria-pressed={isActive}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="container mx-auto px-4 pb-20">
        <motion.div
          layout
          className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]"
        >
          <AnimatePresence>
            {filtered.map((project, idx) => (
              <motion.button
                key={project.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => setActive(project)}
                className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-sm bg-white text-left shadow-sm ring-1 ring-stone-200/70 transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-mcb-terracotta"
                aria-label={`Open ${project.title} — ${project.product}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <Image
                    src={project.imageUrl}
                    alt={`${project.product} — ${project.title}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-90" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                      {project.category}
                    </span>
                    <h3 className="mt-2 font-serif text-xl leading-tight md:text-2xl">{project.title}</h3>
                    <p className="mt-1 text-sm font-medium text-white/85">{project.product}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-sm bg-mcb-paper md:flex-row"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-mcb-charcoal shadow hover:bg-white"
                aria-label="Close project"
              >
                Close
              </button>
              <div className="relative aspect-[4/3] w-full bg-stone-100 md:aspect-auto md:w-[60%]">
                <Image
                  src={active.imageUrl}
                  alt={`${active.product} — ${active.title}`}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex w-full flex-col justify-center gap-4 overflow-y-auto p-8 md:w-[40%] md:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-mcb-terracotta">
                  {active.category}
                </span>
                <h2 className="font-serif text-3xl leading-tight text-mcb-charcoal md:text-4xl">
                  {active.title}
                </h2>
                <p className="text-base font-medium text-mcb-charcoal">{active.product}</p>
                <p className="text-sm leading-relaxed text-stone-600 normal-case">{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
