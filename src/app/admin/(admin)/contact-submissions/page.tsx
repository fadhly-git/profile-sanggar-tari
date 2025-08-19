// app/admin/contacts/page.tsx
import { Metadata } from "next";
import { ContactList } from "@/components/admin/contact/contact-list";
import { checkAuthSession } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Contact Management - Admin",
    description: "Manage contact messages and customer inquiries",
};

export default async function AdminContactsPage() {
    const session = await checkAuthSession();

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Contact Management</h1>
                    <p className="mt-2">
                        Manage customer inquiries and contact messages
                    </p>
                </div>

                <ContactList />
            </div>
        </div>
    );
}