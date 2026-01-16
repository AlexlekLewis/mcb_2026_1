import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-mcb-charcoal text-white pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            <Image
                                src="/assets/logo.png"
                                alt="Modern Curtains and Blinds"
                                width={600}
                                height={210}
                                className="h-36 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-stone-400 leading-relaxed max-w-xs">
                            Elevating Australian homes with premium, custom-made window furnishings and security solutions. Locally manufactured, professionally installed.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Facebook size={18} />} />
                            <SocialIcon icon={<Instagram size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-mcb-clay-light">Products</h4>
                        <ul className="space-y-4 text-stone-300">
                            <li><Link href="/curtains" className="hover:text-white transition-colors">S-Fold Curtains</Link></li>
                            <li><Link href="/blinds" className="hover:text-white transition-colors">Roller Blinds</Link></li>
                            <li><Link href="/shutters" className="hover:text-white transition-colors">Plantation Shutters</Link></li>
                            <li><Link href="/security" className="hover:text-white transition-colors">Security Doors</Link></li>
                            <li><Link href="/awnings" className="hover:text-white transition-colors">Outdoor Awnings</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-mcb-clay-light">Company</h4>
                        <ul className="space-y-4 text-stone-300">
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/projects" className="hover:text-white transition-colors">Project Gallery</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/consultation" className="hover:text-white transition-colors">Book Consultation</Link></li>
                            <li><Link href="/locations" className="hover:text-white transition-colors">Service Areas</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-mcb-clay-light">Get in Touch</h4>
                        <ul className="space-y-4 text-stone-300">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-mcb-terracotta mt-1 shrink-0" size={18} />
                                <span>Melbourne, Victoria, Australia <br />(We come to you)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-mcb-terracotta" size={18} />
                                <a href="tel:1300732319" className="hover:text-white transition-colors">1300 732 319</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-mcb-terracotta" size={18} />
                                <a href="mailto:admin@moderncurtainsandblinds.com.au" className="hover:text-white transition-colors">admin@moderncurtainsandblinds.com.au</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
                    <p>© {new Date().getFullYear()} Modern Curtains and Blinds. Australian Made & Owned.</p>
                    <div className="flex gap-6">
                        <a href="https://facebook.com/moderncurtains" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <Facebook size={20} />
                        </a>
                        <a href="https://instagram.com/moderncurtains" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-mcb-terracotta hover:text-white transition-all">
            {icon}
        </a>
    )
}
