import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
    title: "Pet Mesh Melbourne | Stronger Fly Screen Mesh",
    description: "Custom pet mesh screens in Melbourne for busy homes, pets, airflow and insect control. Free in-home measure and quote.",
    image: "/images/product-unique/mcb-pet-mesh-installed-hero.webp",
    path: "/security/pet-mesh",
});

export default function PetMeshPage() {
    return (
        <ProductTemplate
            title="Pet Mesh"
            subtitle="Stronger mesh for busy homes with pets."
            heroImage="/images/product-unique/mcb-pet-mesh-installed-hero.webp"
            description="Pet mesh is a stronger screen mesh option for doors and windows that get more everyday wear. It helps protect against claws, knocks and busy household traffic while still allowing fresh air through."
            intentLabel="Pet-friendly airflow and insect control"
            features={[
                {
                    title: "Stronger Mesh",
                    description: "A heavier-duty mesh option designed for higher traffic doors and homes with pets."
                },
                {
                    title: "Airflow Without Insects",
                    description: "Keeps ventilation easy while helping keep flies and insects outside."
                },
                {
                    title: "Custom Measured",
                    description: "Measured to suit suitable doors and window openings during the in-home visit."
                }
            ]}
            decisionGuide={[
                { title: "Choose pet mesh for busy doors", description: "Best where pets, children or everyday use put extra strain on standard mesh." },
                { title: "Compare with fly screens", description: "Fly screens are ideal for insect control; pet mesh adds extra durability." },
                { title: "Ask about frame suitability", description: "We confirm the right mesh and frame approach based on the opening and use." },
            ]}
            comparisonRows={[
                { label: "Standard fly screen", bestFor: "Insects and airflow", notes: "Light everyday insect protection." },
                { label: "Pet mesh", bestFor: "Pets and high traffic", notes: "Stronger mesh for claws, knocks and busy doors." },
                { label: "Security mesh", bestFor: "Entry protection", notes: "A stronger security-focused system with suitable frames and locks." },
            ]}
            types={[
                {
                    title: "Pet Mesh Door Screens",
                    description: "A stronger mesh option for sliding doors, hinged doors and busy access points.",
                    image: "/assets/security_window_screen.png"
                },
                {
                    title: "Pet Mesh Detail",
                    description: "A heavier-duty mesh upgrade for claws, knocks and everyday traffic.",
                    image: "/images/pet-mesh.webp"
                }
            ]}
            faq={[
                { question: "Is pet mesh the same as a security screen?", answer: "No. Pet mesh is a durability upgrade for mesh. Security screens use stronger security-focused mesh, frames and hardware." },
                { question: "Can pet mesh keep insects out?", answer: "Yes. It is designed to allow airflow while helping keep insects outside, with extra durability for homes with pets." },
                { question: "Can you quote pet mesh with fly screens?", answer: "Yes. We can compare standard fly screens, pet mesh and security screen options during the same visit." },
            ]}
        />
    );
}
