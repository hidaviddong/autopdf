import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUp, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ApiKeyAlert from "@/components/api-alert";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useAtomValue } from "jotai";
import { showApiKeyAlertAtom } from "@/lib/store";
import { useState } from "react";
import { useChatMutation } from "@/hooks/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  component: Page,
});

export default function Page() {
  const chatNavigate = useNavigate({ from: "/chat/$chatlistid" });
  const showApiKeyAlert = useAtomValue(showApiKeyAlertAtom);
  const [content, setContent] = useState("");
  const chatMutation = useChatMutation();
  const queryClient = useQueryClient();

  function handleChatSubmit() {
    if (content.length > 0) {
      chatMutation.mutate(
        { messages: [{ role: "user", content }] },
        {
          onSuccess: async (data) => {
            const chatListId = data.data.chatListId;
            await queryClient.invalidateQueries({
              queryKey: ["chatList"],
            });
            await chatNavigate({
              to: `/chat/${chatListId}`,
              params: { chatlistid: chatListId },
            });
          },
        }
      );
    }
  }
  return (
    <div className="md:p-48 h-full flex flex-col justify-center items-center space-y-8 relative">
      <ApiKeyAlert />
      <p className="text-4xl font-bold">Chat, Generate PDF</p>
      <div className="flex flex-col w-full rounded-md space-y-4">
        <div className="relative w-full rounded-lg border bg-background shadow-sm">
          <AutosizeTextarea
            minHeight={100}
            maxHeight={400}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none border-0 bg-transparent px-5 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="How can I help with your PDF?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  return;
                } else {
                  e.preventDefault();
                  handleChatSubmit();
                }
              }
            }}
          />

          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={
                chatMutation.isPending ||
                content.length === 0 ||
                showApiKeyAlert
              }
              onClick={handleChatSubmit}
            >
              {chatMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <ArrowUp className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
