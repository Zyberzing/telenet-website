"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket, TicketConversationMessage } from "@/lib/types";
import {
  getTicketConversationList,
  sendTicketConversationMessage,
} from "@/services/ticketConversation";
import { format, isToday, isYesterday } from "date-fns";
import { Loader, RefreshCw, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface TicketConversationModalProps {
  open: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

const getMessageText = (message: TicketConversationMessage) =>
  message.message || message.text || message.content || "";

const isAdminMessage = (message: TicketConversationMessage) => {
  if (message.isAdmin === true) return true;

  const sender = (
    message.senderType ||
    message.senderRole ||
    message.role ||
    ""
  ).toLowerCase();

  return sender.includes("admin") || sender.includes("support");
};

export default function TicketConversationModal({
  open,
  ticket,
  onClose,
}: TicketConversationModalProps) {
  const [messages, setMessages] = useState<TicketConversationMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const ticketObjectId = useMemo(
    () => ticket?._id || ticket?.id || "",
    [ticket?._id, ticket?.id],
  );
  const conversationItems = useMemo(() => {
    const sorted = [...messages].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });

    const items: Array<
      | { type: "date"; key: string; label: string }
      | { type: "message"; key: string; data: TicketConversationMessage }
    > = [];

    let lastDateKey = "";

    for (const item of sorted) {
      const createdAt = item.createdAt ? new Date(item.createdAt) : null;
      const dateKey = createdAt ? format(createdAt, "yyyy-MM-dd") : "unknown";

      if (dateKey !== lastDateKey) {
        let label = "Unknown Date";
        if (createdAt) {
          if (isToday(createdAt)) label = "Today";
          else if (isYesterday(createdAt)) label = "Yesterday";
          else label = format(createdAt, "dd MMM yyyy");
        }

        items.push({
          type: "date",
          key: `date-${dateKey}`,
          label,
        });
        lastDateKey = dateKey;
      }

      items.push({
        type: "message",
        key: item._id || item.id || `${getMessageText(item)}-${dateKey}`,
        data: item,
      });
    }

    return items;
  }, [messages]);

  const loadConversation = async (options?: { silent?: boolean }) => {
    if (!ticketObjectId) return;

    try {
      if (options?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const result = await getTicketConversationList(ticketObjectId);
      setMessages(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load messages.";
      toast.error(errorMessage);
    } finally {
      if (options?.silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!open || !ticketObjectId) return;
    void loadConversation({ silent: false });
  }, [open, ticketObjectId]);

  useEffect(() => {
    if (!open) {
      setMessages((prev) => (prev.length ? [] : prev));
      setMessage((prev) => (prev ? "" : prev));
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !ticketObjectId || sending) return;
    try {
      setSending(true);
      const response = await sendTicketConversationMessage(
        ticketObjectId,
        trimmedMessage,
      );
      setMessage("");

      const sentMessage = response?.data;
      const localMessage: TicketConversationMessage = {
        _id:
          sentMessage?._id ||
          sentMessage?.id ||
          `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...sentMessage,
        message:
          sentMessage?.message ||
          sentMessage?.text ||
          sentMessage?.content ||
          trimmedMessage,
        createdAt: sentMessage?.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, localMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message.";
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  // const handleDelete = async (messageId: string) => {
  //   try {
  //     await deleteTicketConversationMessage(messageId);
  //     setMessages((prev) =>
  //       prev.filter((item) => (item._id || item.id) !== messageId),
  //     );
  //     toast.success("Message deleted.");
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "Failed to delete message.";
  //     toast.error(errorMessage);
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : null)}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] sm:w-full sm:max-w-2xl h-[82vh] max-h-[82vh] flex flex-col p-0 overflow-hidden"
      >
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between">
          <div>
            <DialogTitle>Ticket Conversation</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {ticket?.ticketId ? `#${ticket.ticketId}` : ""}
              {ticket?.subject ? ` - ${ticket.subject}` : ""}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => void loadConversation({ silent: true })}
              disabled={loading || refreshing}
              aria-label="Refresh chat"
              className={`inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading || refreshing ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5 cursor-pointer" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-3xl font-[400px] cursor-pointer self-start"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {loading && messages.length === 0 ? (
            <p className="text-sm text-gray-500 w-full h-full flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin" /> Loading messages...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-500 w-full h-full flex items-center justify-center">
              No messages yet.
            </p>
          ) : (
            conversationItems.map((entry) => {
              if (entry.type === "date") {
                return (
                  <div key={entry.key} className="flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-200">
                      {entry.label}
                    </span>
                  </div>
                );
              }

              const item = entry.data;
              const text = getMessageText(item);
              const isAdmin = isAdminMessage(item);
              const createdAt = item.createdAt
                ? format(new Date(item.createdAt), "hh:mm a")
                : "";
              // const messageId = item._id || item.id || "";

              return (
                <div
                  key={entry.key}
                  className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      isAdmin
                        ? "bg-white border border-gray-200 text-gray-900"
                        : "bg-primary text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="whitespace-pre-wrap break-words">{text}</p>
                      {/* {!isAdmin && messageId && (
                        <button
                          type="button"
                          onClick={() => handleDelete(messageId)}
                          className="inline-flex items-center gap-1 hover:opacity-80 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )} */}
                    </div>
                    <div
                      className={`mt-1 flex items-center gap-2 text-[11px] ${
                        isAdmin ? "text-gray-500" : "text-white/80"
                      }`}
                    >
                      {createdAt && <span>{createdAt}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <DialogFooter className="px-4 py-3 border-t flex-row gap-2 sm:justify-start">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleSend();
              }
            }}
          />
          <Button
            type="button"
            className="bg-primary text-white self-center"
            onClick={handleSend}
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
