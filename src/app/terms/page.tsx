
export default function TermsPage() {
    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="font-serif text-4xl text-mcb-charcoal mb-8">Terms and Conditions</h1>
                <div className="prose prose-stone max-w-none space-y-8">
                    <section>
                        <h3 className="font-serif text-2xl mb-4">General Terms</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Acceptance:</strong> Use of website signifies acceptance of terms.</li>
                            <li><strong>Orders:</strong> All orders contingent upon acceptance and availability. Right to reject or cancel any order at discretion. Once manufactured, custom-made items cannot be returned or refunded.</li>
                            <li><strong>Pricing:</strong> Prices subject to change without notice. All prices in AUD and include GST. Promotions and discounts subject to availability and specific terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-serif text-2xl mb-4">Delivery & Service Area</h3>
                        <p><strong>Service Area:</strong> Metropolitan Melbourne</p>
                        <p><strong>Delivery Terms:</strong> Delivery times are estimates. Risk of loss/damage passes to customer upon dispatch.</p>
                        <p><strong>Storage Fees:</strong> May apply if installation is delayed due to client actions (more than 2 weeks after goods ready).</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-2xl mb-4">Warranties</h3>
                        <p><strong>Standard Warranty:</strong> 5-Year Warranty on all products against manufacturing defects.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Curtains, Blinds, Shutters, Awnings, Security Doors: 5 Years</li>
                            <li>Invisi-Gard Security Doors: Lifetime Warranty</li>
                            <li>Motorisation: 3 Years on motor and components</li>
                        </ul>
                        <p className="mt-4 text-sm text-stone-500">Excludes damage from misuse, normal wear and tear, or environmental damage.</p>
                    </section>

                    <section>
                        <h3 className="font-serif text-2xl mb-4">Cancellations & Returns</h3>
                        <p>Custom-made items are not eligible for returns unless defective. Cancellations must be made within the cooling-off period specified for your order type (usually same day for standard orders).</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
