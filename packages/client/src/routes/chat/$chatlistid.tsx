import {
  ChatMessage,
  chatMessagesQueryOptions,
  useChatMutation,
  useDownloadPDFMutation,
} from "@/hooks/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import NotFoundComponent from "@/notfound";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient, useSession } from "@/lib/auth-client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import Loading from "@/components/loading";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useAtomValue } from "jotai";
import { showApiKeyAlertAtom } from "@/lib/store";

export const Route = createFileRoute("/chat/$chatlistid")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  const { chatlistid } = Route.useParams();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const session = useSession();
  const { data: messages, isLoading: isMessageLoading } = useQuery(
    chatMessagesQueryOptions(chatlistid)
  );
  const showApiKeyAlert = useAtomValue(showApiKeyAlertAtom);

  const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(0);
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([]);
  const isMobile = useIsMobile();

  const chatMutation = useChatMutation();

  useEffect(() => {
    if (messages) {
      const newAssistantMessages = messages.filter(
        (message) => message.role === "assistant"
      );
      setAssistantMessages(newAssistantMessages);
      setCurrentVersionIndex(newAssistantMessages.length - 1);
    }
  }, [messages]);

  const downloadPDFMutation = useDownloadPDFMutation();

  const viewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const currentVersion = assistantMessages[currentVersionIndex];
  const isFirstVersion = currentVersionIndex === 0;
  const isLatestVersion = currentVersionIndex === assistantMessages.length - 1;
  const hasMultipleVersions = assistantMessages.length > 1;

  function handlePreviousVersionClick() {
    if (!isFirstVersion) {
      setCurrentVersionIndex(currentVersionIndex - 1);
    }
  }

  function handleNextVersionClick() {
    if (!isLatestVersion) {
      setCurrentVersionIndex(currentVersionIndex + 1);
    }
  }

  function PDFTooltip() {
    return (
      <div className="flex w-full space-x-2 justify-between items-center py-2 px-10">
        <div className="flex justify-center items-center space-x-1">
          <Badge
            variant="default"
            className={isLatestVersion ? "bg-blue-500 text-white" : ""}
          >
            {isLatestVersion ? "Latest" : `Version ${currentVersionIndex + 1}`}
          </Badge>

          {/* 只在有多个版本时显示导航按钮 */}
          {hasMultipleVersions && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-none shadow-none"
                      onClick={handlePreviousVersionClick}
                      disabled={isFirstVersion}
                    >
                      <CornerUpLeft />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View previous version</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-none shadow-none"
                      onClick={handleNextVersionClick}
                      disabled={isLatestVersion}
                    >
                      <CornerUpRight />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View next version</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-none shadow-none"
          onClick={() => {
            downloadPDFMutation.mutate({
              mainFileContent: currentVersion.content || "",
            });
          }}
        >
          {downloadPDFMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Download />
          )}
        </Button>
      </div>
    );
  }

  function PDF() {
    return (
      <ScrollArea className="h-[90vh] relative">
        <PDFTooltip />
        <div
          key={currentVersion.id}
          className="px-6 py-4"
          dangerouslySetInnerHTML={{
            __html: currentVersion.svg || "",
          }}
        />
      </ScrollArea>
    );
  }

  function handleChatSubmit() {
    if (content.length > 0 && !showApiKeyAlert) {
      chatMutation.mutate(
        {
          chatListId: chatlistid,
          messages: [{ role: "user", content }],
        },

        {
          onSuccess() {
            setContent("");
            queryClient.invalidateQueries({
              queryKey: ["chatMessages", chatlistid],
            });
          },
        }
      );
    }
  }

  if (isMessageLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex">
      <div className="md:w-3/4 flex flex-col pt-4">
        <ScrollArea
          className="flex-1 overflow-hidden"
          viewportRef={viewportRef}
        >
          {messages?.map((message) => (
            <div
              key={message.id}
              className="flex justify-start items-start min-h-12 gap-1 mb-4 max-w-full" // 添加 max-w-full
            >
              <div className="flex shrink-0">
                <Avatar>
                  {message.role === "user" ? (
                    <>
                      <AvatarImage
                        src={session.data?.user.image || ""}
                        alt={session.data?.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session.data?.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      <FileText
                        size={16}
                        strokeWidth={2}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-1 overflow-hidden max-w-full mt-1 ml-1">
                {isMobile ? (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <p className="whitespace-pre-wrap text-neutral-900 text-sm pr-2 leading-relaxed break-words overflow-wrap-anywhere">
                        {message.role === "user"
                          ? message.content
                          : message.summary}
                      </p>
                    </DrawerTrigger>
                    <DrawerContent>{currentVersion && <PDF />}</DrawerContent>
                  </Drawer>
                ) : (
                  <p className="whitespace-pre-wrap text-neutral-900 text-sm pr-2 leading-relaxed break-words overflow-wrap-anywhere">
                    {message.role === "user"
                      ? message.content
                      : message.summary}
                  </p>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        {messages && (
          <div className="mt-auto pt-4">
            <div className=" rounded-lg border bg-background shadow-sm relative">
              <AutosizeTextarea
                maxHeight={200}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-[100px] w-full resize-none border-0 bg-transparent px-5 focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <div className="absolute bottom-2 right-4 flex items-center gap-2">
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
        )}
      </div>
      {currentVersion && !isMobile && <PDF />}
    </div>
  );
}
