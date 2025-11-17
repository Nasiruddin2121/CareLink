"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ChatWindow from "./ChatWindow";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import { usePrescription } from "@/hooks/usePrescription";
import PrescriptionModal from "@/components/prescriptions/PrescriptionModal";
import type { UserType } from "@/config/constants";
import type { PrescriptionFormData } from "@/types/prescription.types";

type ConversationDetailWorkspaceProps = {
  conversationId: string;
};

export default function ConversationDetailWorkspace({
  conversationId,
}: ConversationDetailWorkspaceProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Fetch conversation details
  const {
    conversation: activeConversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversation(conversationId);

  // Fetch messages
  const {
    messages,
    isLoading: isMessagesLoading,
    isLoadingMore: isMessagesLoadingMore,
    hasMore: hasMoreMessages,
    sendMessage,
    sendPrescription,
    loadMore: loadMoreMessages,
  } = useMessages(conversationId, user?.type as UserType | undefined, user?.id);

  // Prescription hook
  const {
    prescription,
    isModalOpen: isPrescriptionModalOpen,
    openModal: openPrescriptionModal,
    closeModal: closePrescriptionModal,
  } = usePrescription(user?.type as UserType | string | undefined);

  /**
   * 👉 Memoized conversation header info
   *    (Prevents hydration mismatch + unnecessary re-renders)
   */
  const conversationDisplay = useMemo(() => {
    if (!user || !activeConversation) return null;

    const otherPerson =
      activeConversation.creator_id === user.id
        ? activeConversation.participant
        : activeConversation.creator;

    const getRoleLabel = (userType: string) => {
      const roleMap: Record<string, string> = {
        patient: "Patient",
        doctor: "Doctor",
        medicine_supplier: "Shop Owner",
        shop_owner: "Shop Owner",
        admin: "Admin",
      };
      return roleMap[userType] || "User";
    };

    const lastMsg =
      activeConversation.messages?.[activeConversation.messages.length - 1];

    const timeAgo = lastMsg
      ? formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: true })
      : formatDistanceToNow(new Date(activeConversation.created_at), {
          addSuffix: true,
        });

    const preview = lastMsg?.message
      ? lastMsg.message.length > 50
        ? lastMsg.message.substring(0, 50) + "..."
        : lastMsg.message
      : "No messages yet";

    return {
      id: activeConversation.id,
      name: otherPerson.name,
      role: getRoleLabel(otherPerson.type),
      status: "Active now",
      preview,
      timeAgo,
      avatar:
        otherPerson.avatar_url ||
        otherPerson.avatar ||
        "/images/user/user-01.jpg",
      online: false,
    };
  }, [activeConversation, user]);

  /**
   * Redirect if not logged in
   */
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/signin");
    }
  }, [user, isAuthLoading, router]);

  const handleBack = () => router.push("/conversations");

  /**
   * Send message handlers
   */
  const receiverId =
    activeConversation?.creator_id === user?.id
      ? activeConversation?.participant_id
      : activeConversation?.creator_id;

  const handleSendTextMessage = async (message: string) => {
    if (!conversationId || !receiverId) return;

    await sendMessage({
      conversation_id: conversationId,
      receiver_id: receiverId,
      message,
      message_type: "text",
    });
  };

  const handleSendPrescriptionMessage = async (data: PrescriptionFormData) => {
    if (!conversationId || !receiverId) return;

    await sendPrescription({
      conversation_id: conversationId,
      receiver_id: receiverId,
      message: data.message || "Prescription",
      medicine_details: data.medicine_details,
      patient_name: data.patient_name,
    });
  };

  const handleViewPrescription = async (prescriptionId: string) => {
    await openPrescriptionModal(prescriptionId);
  };

  /**
   * ✔ Loading UI
   */
  if (isAuthLoading || isConversationLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  /**
   * ❌ Error UI
   */
  if (conversationError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-red-500">{conversationError.message}</p>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /**
   * ❌ Not Found
   */
  if (!activeConversation || !conversationDisplay || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Conversation not found.
          </p>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /**
   * ✅ MAIN UI
   */
  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-4 px-4 py-4 mx-auto">
        <ChatWindow
          conversation={conversationDisplay}
          conversationData={activeConversation}
          currentUser={user}
          messages={messages}
          isLoading={isMessagesLoading}
          isLoadingMore={isMessagesLoadingMore}
          hasMore={hasMoreMessages}
          onBack={handleBack}
          onSendMessage={handleSendTextMessage}
          onSendPrescription={handleSendPrescriptionMessage}
          onLoadMoreMessages={loadMoreMessages}
          onViewPrescription={handleViewPrescription}
        />
      </div>

      {prescription && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={closePrescriptionModal}
          prescription={prescription}
          isLoading={false}
          error={null}
        />
      )}
    </div>
  );
}
