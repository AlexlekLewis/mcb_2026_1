import type { Metadata } from "next";
import Image from "next/image";
import { FinalCTA } from "@/components/CROSections";

export const metadata: Metadata = {
  title: "Project Gallery | Curtains, Blinds, Shutters & Security Screens",
  description: "Browse product inspiration for custom curtains, blinds, shutters, security screens, outdoor products and motorisation by Modern Curtains and Blinds.",
};

const projects = [
  { title: "Soft light living room", product: "Wavefold sheer curtains", image: "/images/product-unique/mcb-project-soft-light-living-room.webp" },
  { title: "Bedroom privacy", product: "Double curtains and blockout", image: "/images/product-unique/mcb-project-bedroom-privacy.webp" },
  { title: "Energy-conscious windows", product: "Honeycomb blinds", image: "/images/product-unique/mcb-project-energy-conscious-windows.webp" },
  { title: "Alfresco comfort", product: "Zipscreens and outdoor shade", image: "/images/product-unique/mcb-project-alfresco-comfort.webp" },
  { title: "Timeless shutters", product: "Plantation shutters", image: "/images/product-unique/mcb-project-timeless-shutters.webp" },
  { title: "Airflow and security", product: "Security doors and fly screens", image: "/images/product-unique/mcb-project-airflow-security.webp" },
];

export default function ProjectsPage() {
  return (
    <main className="bg-white pt-36">
      <section className="container mx-auto px-4 py-20 text-center">
        <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Project inspiration</span>
        <h1 className="mx-auto mb-6 max-w-4xl font-serif text-4xl text-mcb-charcoal md:text-6xl">Ideas for every room, window and doorway</h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-stone-500">
          This preview gallery uses existing product imagery. Real before-and-after project photography should be added as it becomes available.
        </p>
      </section>
      <section className="container mx-auto grid gap-5 px-4 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="overflow-hidden rounded-sm bg-mcb-paper shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src={project.image}
                alt={`${project.product} inspiration`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-2 font-serif text-2xl text-mcb-charcoal">{project.title}</h2>
              <p className="text-stone-500">{project.product}</p>
            </div>
          </article>
        ))}
      </section>
      <FinalCTA />
    </main>
  );
}
