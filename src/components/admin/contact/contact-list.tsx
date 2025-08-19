// components/admin/contact-list.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Eye,
    Mail,
    Trash2,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getContacts, deleteContact } from "@/lib/actions/contact-actions";
import type { ContactSubmission } from "@prisma/client";
import { ContactDetailModal } from "./contact-detail-modal";
import { formatDistanceToNow } from "date-fns";

export function ContactList() {
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    useEffect(() => {
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [contacts, searchTerm]);

    const loadContacts = async () => {
        setLoading(true);
        const result = await getContacts();
        if (result.success) {
            setContacts(result.data ?? []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;

        const result = await deleteContact(id);
        if (result.success) {
            setContacts(prev => prev.filter(c => c.id !== id));
        } else {
            alert(result.error);
        }
    };

    const handleViewDetails = (contact: ContactSubmission) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleContactUpdated = (updatedContact: ContactSubmission) => {
        setContacts(prev =>
            prev.map(c => c.id === updatedContact.id ? updatedContact : c)
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            case "REPLIED":
                return (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                        <CheckCircle2 className="h-3 w-3" />
                        Replied
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Unknown
                    </Badge>
                );
        }
    };

    const pendingCount = contacts.filter(c => c.status === "PENDING").length;
    const repliedCount = contacts.filter(c => c.status === "REPLIED").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Total Contacts</p>
                                <p className="text-2xl font-bold">{contacts.length}</p>
                            </div>
                            <Mail className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Replied</p>
                                <p className="text-2xl font-bold text-green-600">{repliedCount}</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search contacts by name, email, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Contact List */}
                    <div className="space-y-4">
                        {filteredContacts.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                {searchTerm ? "No contacts found matching your search." : "No contacts yet."}
                            </p>
                        ) : (
                            filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold">{contact.name}</h3>
                                                {getStatusBadge(contact.status)}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                                            <p className="font-medium mb-2">{contact.subject}</p>
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {contact.message}
                                            </p>

                                            <div className="flex items-center justify-between mt-3">
                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(contact.createdAt))} ago
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(contact)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    {contact.status === "REPLIED" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(contact.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <ContactDetailModal
                    contact={selectedContact}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedContact(null);
                    }}
                    onContactUpdated={handleContactUpdated}
                />
            )}
        </div>
    );
}