import type { Metadata } from "next";
import ConversationsWorkspace from "@/components/chat/ConversationsWorkspace";

export const metadata: Metadata = {
  title: "CareLink Connect | Conversations",
  description:
    "Messenger-style workspace for CareLink Connect conversations and real-time messaging.",
};

export default function ConversationsPage() {
  return <ConversationsWorkspace />;
}

