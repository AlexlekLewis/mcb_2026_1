import QuoteForm from "@/components/QuoteForm";
import { Metadata } from "next";
import { ContactPageSchema, QuoteServiceSchema } from "@/components/RichSchema";

export const metadata: Metadata = {
  title: "Book a Free In-Home Measure & Quote",
  description:
    "Book a free in-home measure and quote for custom curtains, blinds, shutters, security doors, fly screens, awnings and motorisation in Melbourne.",
  alternates: { canonical: "/quote" },
};

type SearchParams = { product?: string | string[] };

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const productParam =
    typeof params.product === "string"
      ? params.product
      : Array.isArray(params.product)
      ? params.product[0]
      : undefined;

  return (
    <div className="pt-28">
      <ContactPageSchema />
      <QuoteServiceSchema />
      <QuoteForm initialProductParam={productParam} />
    </div>
  );
}
