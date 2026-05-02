"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";
import { SITE } from "@/lib/site";

export function Breadcrumbs() {
    const pathname = usePathname();

    // Remove query parameters and trailing slashes
    const cleanPath = pathname?.split("?")[0].replace(/\/$/, "") || "";
    const pathSegments = cleanPath.split("/").filter((segment) => segment);

    if (pathSegments.length === 0) return null;

    // Generate Schema.org JSON-LD
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": process.env.NEXT_PUBLIC_BASE_URL || SITE.url
            },
            ...pathSegments.map((segment, index) => {
                const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
                return {
                    "@type": "ListItem",
                    "position": index + 2,
                    "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
                    "item": (process.env.NEXT_PUBLIC_BASE_URL || SITE.url) + url
                };
            })
        ]
    };

    return (
        <nav aria-label="Breadcrumb" className="py-4 container mx-auto px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ol className="flex items-center space-x-2 text-sm text-stone-500">
                <li>
                    <Link href="/" className="hover:text-mcb-terracotta transition-colors flex items-center">
                        <Home size={16} />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    const label = segment.replace(/-/g, " ");

                    return (
                        <Fragment key={href}>
                            <li>
                                <ChevronRight size={14} className="text-stone-300" />
                            </li>
                            <li>
                                {isLast ? (
                                    <span className="text-mcb-charcoal font-medium capitalize" aria-current="page">
                                        {label}
                                    </span>
                                ) : (
                                    <Link href={href} className="hover:text-mcb-terracotta transition-colors capitalize">
                                        {label}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
