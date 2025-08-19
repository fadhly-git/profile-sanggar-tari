// components/admin/contact-detail-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Mail,
  User
} from "lucide-react";
import { sendReplyEmail } from "@/lib/actions/email-actions";
import type { ContactSubmission } from "@prisma/client";
import { format } from "date-fns";

interface ContactDetailModalProps {
  contact: ContactSubmission;
  isOpen: boolean;
  onClose: () => void;
  onContactUpdated: (contact: ContactSubmission) => void;
}

export function ContactDetailModal({ 
  contact, 
  isOpen, 
  onClose, 
  onContactUpdated 
}: ContactDetailModalProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      setError("Please enter a reply message");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const result = await sendReplyEmail(
        contact.id,
        contact.email,
        contact.name,
        contact.subject,
        replyMessage,
        contact.message
      );

      if (result.success) {
        setSuccess(true);
        const updatedContact = {
          ...contact,
          status: "REPLIED" as const,
          repliedAt: new Date(),
          replyMessage,
        };
        onContactUpdated(updatedContact);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || "Failed to send reply");
      }
    } catch  {
      setError("An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Reply
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
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Contact Details</DialogTitle>
            {getStatusBadge(contact.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Name</span>
              </div>
              <p className="font-semibold">{contact.name}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Email</span>
              </div>
              <p className="font-semibold">{contact.email}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Received</span>
              </div>
              <p className="font-semibold">
                {format(new Date(contact.createdAt), "PPP 'at' p")}
              </p>
            </div>
            
            {contact.repliedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Replied</span>
                </div>
                <p className="font-semibold">
                  {format(new Date(contact.repliedAt), "PPP 'at' p")}
                </p>
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Subject</Label>
            <p className="text-lg">{contact.subject}</p>
          </div>

          {/* Original Message */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Original Message</Label>
            <div className="p-4 border-l-4 border-blue-400 rounded-r-lg">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Previous Reply (if exists) */}
          {contact.replyMessage && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Previous Reply</Label>
              <div className="p-4 border-l-4 border-green-400 rounded-r-lg">
                <p className="whitespace-pre-wrap">{contact.replyMessage}</p>
              </div>
            </div>
          )}

          {/* Reply Section (only for pending messages) */}
          {contact.status === "PENDING" && !success && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Your Reply</Label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="min-h-[120px]"
                disabled={isSending}
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose} disabled={isSending}>
                  Cancel
                </Button>
                <Button onClick={handleSendReply} disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Reply sent successfully! The contact has been notified via email.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}