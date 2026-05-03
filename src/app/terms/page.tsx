import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for Modern Curtains and Blinds custom-made products, quotes, delivery, installation and warranties.",
};

const generalTerms = [
  {
    title: "Acceptance",
    body: "By accessing this website, requesting a quote or placing an order with Modern Curtains and Blinds, you agree to the relevant terms, policies and order conditions that apply to your enquiry or purchase.",
  },
  {
    title: "Quotes And Orders",
    body: "All products are subject to acceptance, availability, final measure requirements and supplier lead times. Custom-made products are manufactured to order and generally cannot be returned, exchanged or refunded for change of mind once production has commenced.",
  },
  {
    title: "Pricing",
    body: "Website content is for general guidance only. Final pricing depends on product type, measurements, fabric or finish, hardware, operation, motorisation and installation requirements. Promotions, discounts, finance and price matching may be subject to separate conditions.",
  },
  {
    title: "Payment And Deposits",
    body: "Orders generally require written confirmation and a deposit unless otherwise agreed. Ownership of goods transfers only after full payment has been received and cleared.",
  },
  {
    title: "Changes And Cancellations",
    body: "Order changes or cancellations must be requested as early as possible. Once payment is made, production is scheduled or goods are manufactured, changes may not be possible or may incur administration, material or supplier fees.",
  },
  {
    title: "Returns And Disputes",
    body: "Returns are generally considered only where Modern Curtains and Blinds is at fault, such as a manufacturing defect or an error attributable to us. Customers should contact the team promptly with order details, photos and a clear description of the issue.",
  },
  {
    title: "Delivery And Storage",
    body: "Delivery and installation timeframes are estimates and may be affected by supplier, freight, access, payment, approval or site-readiness delays. Storage and administration fees may apply if installation or delivery is delayed due to customer-related reasons.",
  },
  {
    title: "Installation Access",
    body: "Customers must ensure installation areas are accessible, safe and clear of furniture, personal belongings and obstacles. Additional appointments or charges may apply where access, preparation or site conditions prevent installation from proceeding.",
  },
  {
    title: "Existing Window Coverings",
    body: "Existing window coverings should be removed before installation unless removal has been agreed. Removal and disposal fees may apply where Modern Curtains and Blinds is asked to remove or dispose of existing products.",
  },
  {
    title: "Repairs, Parts And Re-Measures",
    body: "Modern Curtains and Blinds primarily supplies and installs new custom products. Repairs are generally limited to products originally supplied and installed by MCB. Replacement parts are not offered as a general service, and re-measures are generally for existing customers.",
  },
  {
    title: "Colour And Product Variation",
    body: "Colours, patterns, textures and finishes shown online are indicative only. Product components, timber, aluminium, PVC, powder-coated finishes and fabrics may vary slightly between samples, batches, product ranges or orders placed at different times.",
  },
  {
    title: "Liability",
    body: "Modern Curtains and Blinds takes care during measuring, supply and installation. We are not liable for indirect, incidental or consequential losses, or for damage caused by pre-existing site conditions, unsafe structures, lack of access, misuse, third-party work or circumstances outside our reasonable control.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of Victoria, Australia. Any dispute that cannot be resolved through customer service will be handled under the applicable Victorian legal framework.",
  },
];

const warrantyItems = [
  "Most Modern Curtains and Blinds products carry a 5-year warranty against manufacturing defects in materials and workmanship.",
  "Motorisation is listed with a 3-year warranty on motors and components.",
  "Product categories listed under the original policy include curtains, roller blinds, plantation shutters, Venetian blinds, Roman blinds, vertical blinds, honeycell blinds, zipscreens, awnings, roller shutters and security doors.",
  "Warranty exclusions include misuse, alterations, normal wear and tear, environmental fading, peeling, warping, bowing, twisting, damage after installation and imperfections not visible from normal viewing distance in natural light.",
  "Warranty claims require proof of purchase and may require photos, inspection, manufacturer review and a service or administration fee depending on timing and claim type.",
];

const installationItems = [
  "Installation appointments can be arranged once an order is confirmed or once goods are ready.",
  "The team works with customers to find a practical installation date and time.",
  "The installation area must be clear and accessible before the installer arrives.",
  "Reasonable unavoidable site issues may include insecure frames, deteriorated walls, hidden pre-existing conditions, pipes or surfaces that cannot safely support the required fixing.",
  "If MCB installers are at fault, the business will work with the customer to address the issue promptly and professionally.",
];

const onlineOrderItems = [
  "Where online self-measured orders are offered, products are manufactured from the measurements and selections entered by the customer.",
  "Customers are responsible for fit type, width, drop, control side, fabric, colour and other selections unless an on-site check measure has been booked.",
  "Self-measured custom orders cannot usually be refunded, credited or replaced because of incorrect measurements, incorrect fit type or misunderstanding of the product.",
  "Customers are encouraged to contact MCB before ordering if they are unsure about measuring, fit, product type or installation requirements.",
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mcb-paper px-4 py-28">
      <div className="container mx-auto max-w-5xl">
        <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Customer policy</span>
        <h1 className="mb-5 font-serif text-4xl text-mcb-charcoal md:text-5xl">Terms, Warranty And Service Policy</h1>
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-stone-600">
          These terms summarise the key policies for custom curtains, blinds, shutters, awnings, security screens, motorisation, installation and customer enquiries with Modern Curtains and Blinds.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {generalTerms.map((term) => (
            <section key={term.title} className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl text-mcb-charcoal">{term.title}</h2>
              <p className="leading-relaxed text-stone-600">{term.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-5 rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-2xl text-mcb-charcoal">Warranty Policy</h2>
          <PolicyList items={warrantyItems} />
        </section>

        <section className="mt-5 rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-2xl text-mcb-charcoal">Installation Policy</h2>
          <PolicyList items={installationItems} />
        </section>

        <section className="mt-5 rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-2xl text-mcb-charcoal">Online Or Self-Measured Orders</h2>
          <PolicyList items={onlineOrderItems} />
        </section>

        <section className="mt-5 rounded-sm bg-mcb-charcoal p-6 text-white shadow-sm">
          <h2 className="mb-3 font-serif text-2xl">Customer Service</h2>
          <p className="leading-relaxed text-stone-200">
            Modern Curtains and Blinds aims to respond to enquiries within 24 business hours. For questions about an order, warranty claim, installation, quote or policy, contact {SITE.email} or call {SITE.phoneDisplay}.
          </p>
        </section>
      </div>
    </div>
  );
}

function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-stone-600">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mcb-terracotta" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
