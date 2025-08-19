// app/contact/page.tsx
import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    Headphones
} from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us - Your Company",
    description: "Get in touch with us. We're here to help and answer any questions you might have.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-6">
                                    Contact Information
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Address</h3>
                                            <p className="text-gray-600">
                                                123 Business Street<br />
                                                Suite 100<br />
                                                City, State 12345
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium ">Phone</h3>
                                            <a
                                                href="tel:+1234567890"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                +1 (234) 567-8900
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium ">Email</h3>
                                            <a
                                                href="mailto:info@yourcompany.com"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                info@yourcompany.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium ">Business Hours</h3>
                                            <p className="text-gray-600">
                                                Monday - Friday: 9:00 AM - 6:00 PM<br />
                                                Saturday: 10:00 AM - 4:00 PM<br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Contact Options */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 ">
                                    Quick Contact
                                </h3>

                                <div className="space-y-3">
                                    <a
                                        href="tel:+1234567890"
                                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                    >
                                        <Phone className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Call Now</span>
                                    </a>

                                    <a
                                        href="mailto:info@yourcompany.com"
                                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                    >
                                        <Mail className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Send Email</span>
                                    </a>

                                    <button className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors w-full text-left">
                                        <MessageCircle className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Live Chat</span>
                                    </button>

                                    <button className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors w-full text-left">
                                        <Headphones className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Support Center</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mt-16">
                    <Card>
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-semibold mb-6 text-center">
                                Frequently Asked Questions
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium  mb-2">
                                        How quickly do you respond?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        We typically respond within 24 hours during business days.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium  mb-2">
                                        Do you offer phone support?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Yes, phone support is available during business hours.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium  mb-2">
                                        Can I schedule a meeting?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Absolutely! Mention your preferred time in the message.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium  mb-2">
                                        Do you provide emergency support?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Emergency support is available for existing clients 24/7.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}