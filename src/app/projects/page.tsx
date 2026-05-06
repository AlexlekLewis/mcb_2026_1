import type { Metadata } from "next";
import { FinalCTA } from "@/components/CROSections";
import ProjectGallery from "@/components/ProjectGallery";
import { fetchProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Project Gallery | Curtains, Blinds, Shutters & Security Screens",
  description:
    "Real Modern Curtains and Blinds installations across Melbourne — curtains, blinds, shutters, security screens and outdoor shading.",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <main className="bg-mcb-paper pt-36">
      <section className="container mx-auto px-4 py-16 text-center md:py-20">
        <span className="mb-4 block text-sm font-bold uppercase tracking-[0.22em] text-mcb-terracotta">
          Project gallery
        </span>
        <h1 className="mx-auto mb-6 max-w-4xl font-serif text-4xl leading-[1.1] text-mcb-charcoal md:text-6xl">
          Real Melbourne Homes, Finished by Our Team
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-stone-500 normal-case">
          Curtains, blinds, shutters, security screens and outdoor shading — measured, made and
          installed by Modern Curtains and Blinds. Filter by product to see what suits your space.
        </p>
      </section>

      {projects.length === 0 ? (
        <section className="container mx-auto px-4 pb-20">
          <div className="mx-auto max-w-xl rounded-sm border border-stone-200 bg-white p-8 text-center">
            <h2 className="mb-3 font-serif text-2xl text-mcb-charcoal">Gallery Loading Soon</h2>
            <p className="text-sm text-stone-500 normal-case">
              Our latest project photos are being prepared. Please check back shortly.
            </p>
          </div>
        </section>
      ) : (
        <ProjectGallery projects={projects} />
      )}

      <FinalCTA />
    </main>
  );
}
