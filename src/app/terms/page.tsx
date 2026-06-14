import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms and Conditions, Warranty & Customer Policies",
  description: "Modern Curtains and Blinds Terms and Conditions, warranty policy, returns, installation policy, payment policy, product-specific terms and online roller blind order conditions.",
};

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: (string | { heading: string; text: string })[];
  subsections?: { title: string; paragraphs?: string[]; bullets?: (string | { heading: string; text: string })[] }[];
};

const generalTerms: Section[] = [
  {
    title: "Modern Curtains and Blinds Terms and Conditions",
    paragraphs: [
      "By accessing or using our website, you agree to adhere to these Terms and Conditions. Please review them carefully.",
    ],
  },
  {
    title: "Acceptance",
    paragraphs: ["Your use of our website signifies your acceptance of these terms."],
  },
  {
    title: "Orders",
    paragraphs: [
      "All orders are contingent upon acceptance and availability. We reserve the right to reject or cancel any order at our discretion. Once products are manufactured, custom-made items cannot be returned or refunded.",
    ],
  },
  {
    title: "Pricing",
    paragraphs: [
      "Prices are subject to change without notice. All prices listed on the website are in AUD and include GST. Promotions and discounts are subject to availability and specific terms. Finance options do not apply to discounted prices, promotions, or price matching.",
    ],
  },
  {
    title: "Liability",
    paragraphs: [
      "Modern Curtains and Blinds disclaims liability for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our products or services.",
    ],
  },
  {
    title: "Delivery",
    paragraphs: [
      "Deliveries are made within metropolitan Melbourne. Delivery times are estimates and may be affected by factors beyond our control. The risk of loss or damage passes to the customer upon dispatch from our facility. Storage and administration fees may be charged if delivery is delayed due to client-related reasons.",
      "In the event of delays on our end, we hold no liability for any inconvenience or financial loss, and no refunds will be provided. Our administration team will make every effort to notify the customer promptly regarding the timeframe of any delays.",
      "We may charge reasonable storage and administration fees and/or require an additional deposit if the full price has not been paid if installation is delayed due to the client's actions. This includes situations where the client requests installation more than 2 weeks after the goods are ready for delivery or fails to book an installation within 4 weeks of the goods being ready.",
      "Other reasons clients may incur storage and administration fees include:",
    ],
    bullets: [
      { heading: "Rescheduling Appointments", text: "If the client repeatedly reschedules installation or delivery appointments, additional fees may apply to cover the administrative costs." },
      { heading: "Inaccessible Premises", text: "If our delivery and/or installation team is unable to access the premises due to client restrictions or lack of preparation, resulting in delays." },
      { heading: "Incomplete Payment", text: "If the client has not completed the necessary payments required for delivery or installation within the agreed timeframe." },
      { heading: "Changes in Installation Requirements", text: "If the client changes the installation requirements or site conditions after the goods are ready, causing delays." },
      { heading: "Failure to Respond", text: "If the client fails to respond to our attempts to schedule delivery or installation within a reasonable period." },
      { heading: "Incorrect Information Provided", text: "If the client provides incorrect delivery or contact information leading to failed delivery and/or installation attempts." },
    ],
  },
  {
    title: "Transfer of Ownership",
    paragraphs: [
      "Ownership of the goods transfers to the customer only after full payment has been received by Modern Curtains and Blinds. Until payment is made in full, Modern Curtains and Blinds retains legal title to the goods. This means that the customer does not own the goods until the complete payment amount has cleared. It is important for customers to ensure that all payments are completed promptly to secure ownership of their purchased goods.",
    ],
  },
  {
    title: "Transfer of Risk",
    paragraphs: [
      "The risk of loss or damage to the goods passes to the customer at the moment the goods leave our facility. This means that once the goods are dispatched for delivery, any risk associated with loss, theft, or damage becomes the responsibility of the customer. Modern Curtains and Blinds takes every precaution to ensure that goods are packed securely and dispatched safely. However, it is advisable for customers to consider appropriate insurance coverage for the goods during transit. This coverage can provide peace of mind and protection against any unforeseen incidents that may occur after the goods have left our facility.",
      "In summary, while Modern Curtains and Blinds retains ownership of the goods until full payment is received, the responsibility for the goods' safety shifts to the customer upon dispatch. Ensuring timely payment and considering insurance for transit are essential steps to safeguard your purchase.",
    ],
  },
  {
    title: "Applicable Law and Jurisdiction",
    subsections: [
      {
        title: "Governing Law",
        paragraphs: [
          "These terms and conditions are governed by and interpreted in accordance with the laws of Victoria, Australia. This means that any disputes or legal issues arising from or related to these terms will be subject to the legal statutes and regulations of Victoria. Customers agree that the laws of Victoria will exclusively apply to any legal matters pertaining to their transactions with Modern Curtains and Blinds.",
        ],
      },
      {
        title: "Jurisdiction",
        paragraphs: [
          "By agreeing to these terms, customers also consent to the exclusive jurisdiction of the courts located in Victoria, Australia. This means that any legal proceedings or disputes must be brought before a court in Victoria. Customers acknowledge that these courts have the authority to resolve any issues related to the terms and conditions, and they agree to submit to the jurisdiction of these courts.",
          "In summary, all transactions and interactions with Modern Curtains and Blinds are governed by Victorian law, and any legal disputes will be resolved within the courts of Victoria, Australia. This ensures a consistent and fair legal framework for both the company and its customers.",
        ],
      },
    ],
  },
];

const changesSections: Section[] = [
  {
    title: "Order Modifications and Cancellations",
    paragraphs: [
      "Orders, excluding Express Orders, can be changed or cancelled within specific timeframes. If an order is placed in the morning (AM) of a working day, changes or cancellations must be made by the end of that same working day. For orders placed in the afternoon (PM), changes or cancellations must be made within 12 hours. It is essential to notify us immediately within these timeframes to prevent any administrative issues.",
      "After the initial cancellation window, or once payment is made, orders cannot be changed or cancelled unless explicitly agreed upon by Modern Curtains and Blinds. This policy ensures efficient and uninterrupted production and scheduling processes. Any agreed-upon changes or cancellations after this period may incur administrative fees to cover any costs or disruptions caused.",
      "Administrative fees may apply for any changes or cancellations requested after the initial cancellation window. These fees help cover the administrative efforts and potential material costs already incurred by the company. It is advisable to finalize decisions promptly to avoid such fees.",
    ],
  },
  {
    title: "Returns Policy",
    paragraphs: [
      "Our return policy is designed to address issues where Modern Curtains and Blinds is at fault. This includes cases of manufacturing defects or errors in the order attributable to us. Generally, returns are not accepted unless the product is defective or there is an error on our part. Below are the details of our policy:",
    ],
    subsections: [
      {
        title: "Eligibility for Returns",
        bullets: [
          { heading: "Defective Products", text: "If you receive a product that is defective or has been damaged during shipping, please contact our customer service team immediately. We will require photographic evidence of the defect or damage to process your claim." },
          { heading: "Errors Attributable to Modern Curtains and Blinds", text: "If an error occurs in your order due to our mistake (e.g., incorrect measurements, wrong product delivered), please notify us as soon as possible. We will arrange for the correct product to be delivered and the incorrect product to be returned at no additional cost to you." },
        ],
      },
      {
        title: "Non-Eligible Returns",
        bullets: [
          "Custom-made items and standard products are not eligible for returns unless there is a defect or error attributable to Modern Curtains and Blinds.",
          "Products that have been installed or used, except in cases of defects or errors.",
          "Items not in their original condition, damaged, or missing parts for reasons not due to our error.",
        ],
      },
      {
        title: "Return Process",
        bullets: [
          { heading: "Contact Customer Service", text: "Reach out to our customer service team via phone or email to initiate a return. Provide your order number, a description of the issue, and any relevant photos." },
          { heading: "Return Authorisation", text: "Our customer service team will assess your request and, if approved, provide you with a return authorisation number and instructions on how to return the item." },
          { heading: "Shipping", text: "For approved returns, ship the item back to us using the provided instructions. Ensure the item is securely packaged to prevent damage during transit." },
          { heading: "Inspection and Processing", text: "Once we receive the returned item, our team will inspect it to confirm the defect or error. If the return is approved, we will process your replacement or repair within 7-10 business days." },
        ],
      },
    ],
  },
  {
    title: "Disputes",
    paragraphs: [
      "In the event of any disputes regarding orders, products, or services, we encourage customers to reach out to our customer service team to seek a resolution. Our goal is to address and resolve any issues promptly and satisfactorily. If a resolution cannot be reached through our customer service team, the matter may be escalated according to the laws and regulations governing our operations.",
      "Our customer service team is dedicated to ensuring your satisfaction. If you have any questions or need assistance with your return, please do not hesitate to contact us. We are here to help and ensure that any valid concerns are addressed promptly and fairly.",
      "In summary, timely communication regarding order changes or cancellations is crucial to avoid fees and ensure smooth processing. For returns and disputes, our customer service team is committed to providing assistance and finding appropriate resolutions.",
    ],
  },
];

const warrantySections: Section[] = [
  {
    title: "Modern Curtains and Blinds Warranty Policy",
    paragraphs: ["We offer a 5-year warranty on all our products against manufacturing defects."],
  },
  {
    title: "Coverage",
    paragraphs: ["This warranty covers defects in materials and workmanship."],
  },
  {
    title: "Exclusions",
    paragraphs: ["This warranty does not cover damage caused by misuse, alterations, or normal wear and tear. Specific exclusions include:"],
    bullets: [
      "Inconsistent fading or peeling",
      "Warping, bowing, or twisting due to environmental conditions or misuse",
      "Imperfections not visible from 1.5 meters away in natural light conditions.",
      "Damage occurring more than 7 days after installation",
    ],
  },
  {
    title: "Claims",
    paragraphs: [
      `To report or file a warranty claim, please contact our customer service team with proof of purchase at ${SITE.email}. A $150.00 service fee may apply for all claims within 12 months. $150.00 service fee will apply for claims processed after 12 months from the installation date.`,
    ],
  },
];

const installationSections: Section[] = [
  {
    title: "Modern Curtains and Blinds Installation Policy",
    paragraphs: [
      "We provide professional installation services to ensure that our products are installed correctly and to the highest standards.",
    ],
  },
  {
    title: "Scheduling",
    bullets: [
      "Installation appointments can be arranged either at the time of product order confirmation or product arrival.",
      "Our team will work with you to find a convenient date and time for the installation.",
    ],
  },
  {
    title: "Preparation",
    bullets: [
      "Customers must ensure the installation area is accessible and free of obstacles, structures, and personal belongings.",
      "Please clear the space around windows, doors, or other areas where the installation will take place to facilitate a smooth process.",
    ],
  },
  {
    title: "Liability",
    bullets: [
      "We take great care during the installation process, but in the event of reasonable and unavoidable damage, we will work with you to address and resolve the issue promptly.",
      "Examples of reasonable damage may include: the structure requires additional work to fix the fixture to the wall securely and safely; the structure is not secure, such as only having window or door architraves to fix into that are old, rotted or poorly attached to the wall or structure; wall or structural surfaces that crumble or deteriorate when drilled into; pre-existing conditions of walls or surfaces that cannot be seen until installation begins; necessary adjustments or modifications to accommodate unique architectural features; pipes.",
      "We are not liable for any damage caused during installation unless it is due to our installers' negligence.",
      "If our installers are found to be at fault, we will take responsibility and address any damages promptly and professionally.",
      "Additional charges may apply for installations delayed due to customer unavailability or other customer-related issues.",
      "These additional charges cover the cost of rescheduling and any extra time spent by our installation team due to the delay.",
    ],
    paragraphs: [
      "At Modern Curtains and Blinds, we understand that your home is important to you. Our goal is to provide a seamless and efficient installation experience, and we are committed to handling any issues with care and empathy. If you have any questions or need further assistance, please do not hesitate to contact our customer service team. We are here to help ensure that your installation goes smoothly and meets your satisfaction.",
    ],
  },
];

const paymentSections: Section[] = [
  {
    title: "Order Placement and Deposit",
    bullets: [
      "All orders must be submitted in writing and include a 50% deposit of the total price, unless otherwise agreed.",
      "We reserve the right to accept or decline any orders at our discretion.",
    ],
  },
  {
    title: "Colour Variations",
    bullets: [
      "Products, particularly those made from timber, aluminium, or PVC, may exhibit slight colour variations.",
      "Different orders or products purchased at different times may show some variation in colour.",
      "Please note that colours, patterns, and textures displayed on our website are indicative only and may vary slightly from the actual product.",
    ],
  },
  {
    title: "Colour Availability",
    paragraphs: [
      "There may be instances when the selected colour is not available. If we are unable to supply the chosen colour, we will inform you promptly. You may then choose to:",
    ],
    bullets: [
      "(a) Select an alternative colour.",
      "(b) Wait for the desired colour to become available.",
      "(c) Opt for a different fabric range and pay any additional cost if the alternative is of higher quality.",
    ],
  },
  {
    title: "Removal of Existing Window Coverings",
    bullets: [
      "Customers must ensure that existing window coverings are removed before our installation team arrives.",
      "A fee of $20 per item will be charged if we need to remove the existing coverings.",
      "Disposal of the product will be $40 per item.",
    ],
  },
  {
    title: "Installation Area Access",
    bullets: [
      "Ensure that the installation area is clear of furniture and other items within a 3 meter radius around the windows or installation area.",
      "We are not responsible for any damage to items left within this area.",
      "If the installation area is not cleared, the installation may be postponed, and an additional appointment will be required.",
    ],
  },
  {
    title: "Check Measure Unavailability",
    bullets: [
      "If the customer is not present during the check measure, we will proceed with the order based on previous confirmations and commitments.",
    ],
    paragraphs: [
      "At Modern Curtains and Blinds, we aim to make the ordering and installation process as smooth as possible. If you have any questions or require further assistance, please contact our customer service team. We are here to ensure you are satisfied with our products and services.",
    ],
  },
];

const productSpecificTerms: { product: string; bullets: { heading: string; text: string }[] }[] = [
  {
    product: "Curtains",
    bullets: [
      { heading: "Material", text: "High-quality fabrics designed for durability and elegance." },
      { heading: "Usage", text: "Follow care instructions to maintain appearance and longevity." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects and workmanship." },
    ],
  },
  {
    product: "Roller Blinds",
    bullets: [
      { heading: "Material", text: "Durable materials suitable for various environments." },
      { heading: "Usage", text: "Suitable for indoor use with regular maintenance." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects and workmanship." },
    ],
  },
  {
    product: "Plantation Shutters",
    bullets: [
      { heading: "Material", text: "High-quality wood or synthetic materials for durability." },
      { heading: "Custom Orders", text: "Custom sizes available; lead times apply." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects and workmanship." },
    ],
  },
  {
    product: "Motorisation",
    bullets: [
      { heading: "Compatibility", text: "Ensure compatibility with existing home automation systems." },
      { heading: "Installation", text: "Professional installation recommended for optimal performance." },
      { heading: "Warranty", text: "3-year warranty on motor and components." },
    ],
  },
  {
    product: "Venetian Blinds",
    bullets: [
      { heading: "Material", text: "Available in wood, aluminium, and PVC." },
      { heading: "Usage", text: "Regular cleaning with recommended products is required to prevent dust buildup." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Roman Blinds",
    bullets: [
      { heading: "Material", text: "Luxurious fabrics for a refined look." },
      { heading: "Usage", text: "Indoor use only; follow care guidelines." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Vertical Blinds",
    bullets: [
      { heading: "Material", text: "Durable and easy-to-clean fabrics." },
      { heading: "Usage", text: "Suitable for large windows and sliding doors." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Honeycell Blinds",
    bullets: [
      { heading: "Material", text: "Energy-efficient honeycomb structure." },
      { heading: "Usage", text: "Provides insulation and light control." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Zipscreens",
    bullets: [
      { heading: "Material", text: "Robust and weather-resistant materials for outdoor use." },
      { heading: "Usage", text: "Suitable for patios and outdoor areas." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Awnings",
    bullets: [
      { heading: "Material", text: "UV-resistant fabrics for outdoor durability." },
      { heading: "Usage", text: "Suitable for shading outdoor areas." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Roller Shutters",
    bullets: [
      { heading: "Material", text: "High-strength materials for security and insulation." },
      { heading: "Usage", text: "Suitable for windows and doors." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
  {
    product: "Security Doors",
    bullets: [
      { heading: "Material", text: "Reinforced materials for enhanced security." },
      { heading: "Usage", text: "Suitable for residential and commercial properties." },
      { heading: "Warranty", text: "5-year warranty on manufacturing defects, mechanisms and workmanship." },
    ],
  },
];

const onlineRollerBlindSections: Section[] = [
  {
    title: "1. Customer-Provided Measurements",
    paragraphs: [
      "All online orders are manufactured based solely on the measurements you provide.",
    ],
    bullets: [
      "We do not verify or validate these measurements unless you book an on-site check measure service.",
      "If you choose not to engage our check measure service, you accept full responsibility for the accuracy of all dimensions entered.",
      "We will not accept responsibility or issue refunds, replacements, or credit for blinds that do not fit due to incorrect measurements provided by the customer.",
    ],
  },
  {
    title: "2. Fit Type Selection",
    paragraphs: [
      "You are responsible for selecting the correct fit type (Inside/Recess Fit or Outside/Face Fit) on the order form.",
    ],
    bullets: [
      "Please refer to our guides for how to measure for each type.",
      "If the incorrect fit type is selected or misinterpreted, we cannot be held liable.",
      "We strongly recommend a check measure for anyone unsure of fit type or terminology.",
    ],
  },
  {
    title: "3. Product Understanding",
    paragraphs: [
      "This ordering system is specifically for roller blinds. By proceeding, you acknowledge that:",
    ],
    bullets: [
      "You understand what a roller blind is: a single piece of fabric that rolls around a tube and is operated via chain or motor.",
      "You are not ordering curtains, venetians, verticals, shutters, or any other window treatment.",
      "If uncertain, please contact us prior to placing your order.",
    ],
  },
  {
    title: "4. Colour and Component Variations",
    paragraphs: [
      "We strive for consistency, but due to standard industry practices:",
    ],
    bullets: [
      "Colour variation may occur between fabric, chains, brackets, and baserails.",
      "Slight differences in tone or finish between metal, plastic, and powder-coated components are considered normal and do not constitute a fault.",
      "Please consult product samples or contact us before ordering if exact colour matching is critical.",
    ],
  },
  {
    title: "5. Quotation Based on Customer Input",
    paragraphs: [
      "Quotes generated through our online tool are based on the details you provide, including width, drop, fit type, fabric and colour selection, and control side and drop.",
      "If you do not request an on-site check measure, the final blinds will be manufactured as per your submitted information, and we are not responsible for incorrect selections, misunderstandings, or fit issues.",
    ],
  },
  {
    title: "6. Installation Responsibility",
    paragraphs: [
      "If you are arranging your own installation:",
    ],
    bullets: [
      "It is your responsibility to install the product safely and correctly.",
      "We accept no liability for damage caused during or after installation by the customer or any third party.",
      "We recommend using a qualified installer where possible.",
    ],
  },
  {
    title: "7. Order Amendments and Cancellations",
    paragraphs: [
      "As all blinds are custom-made to order, once your order is confirmed and payment is processed:",
    ],
    bullets: [
      "It cannot be amended.",
      "It cannot be cancelled.",
      "No refunds or exchanges are available for change of mind or incorrect selections.",
      "Please review your order carefully before submitting.",
    ],
  },
  {
    title: "8. Returns and Refunds Policy",
    paragraphs: [
      "Due to the made-to-measure nature of our products:",
    ],
    bullets: [
      "No returns or exchanges are accepted for change of mind or customer error.",
      "No refunds will be provided for blinds that do not fit due to incorrect measurements or misinterpretation of product type.",
      "Only items damaged in transit (see section 10) or defective in manufacturing will be considered for review.",
    ],
  },
  {
    title: "9. On-Site Check Measure (Optional)",
    paragraphs: [
      "We highly recommend booking our professional check measure service, which includes:",
    ],
    bullets: [
      "Measuring windows accurately for fit and size.",
      "Advice on the best mounting style for your space.",
      "Confirmation of any obstacles (tiles, handles, trims, etc.).",
      "If you decline this service, you accept all responsibility for accuracy of dimensions, chosen fit type, and any resulting performance or installation issues.",
    ],
  },
  {
    title: "10. Damage Claims and Product Condition on Delivery",
    paragraphs: [
      "All blinds are manufactured and dispatched directly from our supplier, who performs quality control checks before packaging.",
    ],
    subsections: [
      {
        title: "a. Damage Claim Procedure",
        paragraphs: [
          `Claims must be submitted within 48 hours of receiving the goods. To lodge a claim, email ${SITE.email} and include:`,
        ],
        bullets: [
          "At least 3 time-stamped photos: a close-up of the damage, a full view of the product, and the condition of packaging.",
          "1 clear video showing the product before installation.",
          "A written explanation of the issue and when it was discovered.",
          "Claims that do not include all of the above will not be reviewed.",
        ],
      },
      {
        title: "b. Inspection Before Installation",
        paragraphs: [
          "Products must be inspected before installation begins. We will not accept responsibility for damage occurring during or after installation, or for misuse, improper handling, or alterations made post-delivery. Once installation has commenced, the product is considered accepted in good condition.",
        ],
      },
      {
        title: "c. Fraud Prevention and Manufacturer Review",
        paragraphs: [
          "We reserve the right to deny claims if evidence suggests damage occurred after delivery, reject claims lacking sufficient documentation, or refer cases for internal review where claim authenticity is in question. Our manufacturer maintains strict quality standards and product batch records which we may reference during any investigation.",
        ],
      },
    ],
  },
  {
    title: "11. Contact",
    paragraphs: [
      `If you are unsure about any aspect of the product, fit type, measuring process, or installation requirements, we encourage you to reach out before placing your order. Email ${SITE.email} or call ${SITE.phoneDisplay}. We are here to assist you in making confident, informed decisions.`,
    ],
  },
  {
    title: "12. Acceptance of Terms",
    paragraphs: ["By submitting your order, you acknowledge that:"],
    bullets: [
      "You have read and understood these Terms and Conditions.",
      "You accept full responsibility for all information entered into the order form.",
      "You waive the right to claim refunds or replacements arising from incorrect measurements, misinterpretation, or failure to inspect prior to installation.",
    ],
  },
];

const customerServiceSections: Section[] = [
  {
    title: "Modern Curtains and Blinds Customer Service Policy",
    paragraphs: ["Our mission is to provide outstanding customer service."],
  },
  {
    title: "Support Channels",
    paragraphs: ["We offer support through phone, email, and live chat."],
  },
  {
    title: "Response Time",
    paragraphs: ["We strive to respond to all inquiries within 24 business hours."],
  },
  {
    title: "Feedback",
    paragraphs: ["We value customer feedback and use it to improve our products and services continuously."],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mcb-paper px-4 py-28">
      <div className="container mx-auto max-w-5xl">
        <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Customer policy</span>
        <h1 className="mb-5 font-serif text-4xl text-mcb-charcoal md:text-5xl">Terms &amp; Conditions, Warranty &amp; Privacy Policy</h1>
        <p className="mb-12 max-w-3xl text-lg leading-relaxed text-stone-600">
          The following terms summarise the policies for custom curtains, blinds, shutters, awnings, security screens, motorisation, installation and customer enquiries with Modern Curtains and Blinds.
        </p>

        <PolicyGroup heading="Terms and Conditions" sections={generalTerms} />

        <PolicyGroup heading="Changes, Cancellations, Returns, and Disputes" sections={changesSections} />

        <PolicyGroup heading="Warranty Policy" sections={warrantySections} />

        <PolicyGroup heading="Installation Policy" sections={installationSections} />

        <PolicyGroup heading="Payment and Order Policies" sections={paymentSections} />

        <section className="mt-12">
          <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal">Product-Specific Terms and Conditions</h2>
          <p className="mb-5 max-w-3xl leading-relaxed text-stone-600">
            Each product category has specific terms and conditions to ensure transparency.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {productSpecificTerms.map((item) => (
              <section key={item.product} className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 font-serif text-xl text-mcb-charcoal">{item.product}</h3>
                <ul className="space-y-2">
                  {item.bullets.map((bullet) => (
                    <li key={bullet.heading} className="flex gap-3 leading-relaxed text-stone-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mcb-terracotta" />
                      <span>
                        <strong className="text-mcb-charcoal">{bullet.heading}:</strong> {bullet.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <PolicyGroup heading="Terms and Conditions – Online Roller Blind Orders" sections={onlineRollerBlindSections} />

        <PolicyGroup heading="Customer Service Policy" sections={customerServiceSections} />

        <section className="mt-12 rounded-sm bg-mcb-charcoal p-8 text-white shadow-sm">
          <h2 className="mb-3 font-serif text-2xl">Contact Customer Service</h2>
          <p className="leading-relaxed text-stone-200">
            For questions about an order, warranty claim, installation, quote or policy, contact {SITE.email} or call {SITE.phoneDisplay}. We aim to respond to enquiries within 24 business hours.
          </p>
        </section>
      </div>
    </div>
  );
}

function PolicyGroup({ heading, sections }: { heading: string; sections: Section[] }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal">{heading}</h2>
      <div className="space-y-5">
        {sections.map((section) => (
          <article key={section.title} className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 font-serif text-xl text-mcb-charcoal">{section.title}</h3>
            <SectionBody section={section} />
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionBody({ section }: { section: Section }) {
  return (
    <div className="space-y-4">
      {section.paragraphs?.map((p) => (
        <p key={p} className="leading-relaxed text-stone-600">{p}</p>
      ))}
      {section.bullets && <BulletList bullets={section.bullets} />}
      {section.subsections?.map((sub) => (
        <div key={sub.title} className="border-l-2 border-mcb-terracotta/40 pl-4">
          <h4 className="mb-2 font-serif text-lg text-mcb-charcoal">{sub.title}</h4>
          {sub.paragraphs?.map((p) => (
            <p key={p} className="mb-2 leading-relaxed text-stone-600">{p}</p>
          ))}
          {sub.bullets && <BulletList bullets={sub.bullets} />}
        </div>
      ))}
    </div>
  );
}

function BulletList({ bullets }: { bullets: (string | { heading: string; text: string })[] }) {
  return (
    <ul className="space-y-2">
      {bullets.map((bullet) => {
        const key = typeof bullet === "string" ? bullet : bullet.heading;
        return (
          <li key={key} className="flex gap-3 leading-relaxed text-stone-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mcb-terracotta" />
            <span>
              {typeof bullet === "string" ? bullet : (
                <>
                  <strong className="text-mcb-charcoal">{bullet.heading}:</strong> {bullet.text}
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
