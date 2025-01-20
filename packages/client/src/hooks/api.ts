import ky from "ky";
import { AUTO_PDF_OPENAI_API_KEY } from "@/lib/utils";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
interface Message {
  role: string;
  content: string;
}

interface ChatV1Request {
  chatListId?: string;
  messages: Message[];
}
interface ChatV1Response {
  data: {
    chatListId: string;
  };
}

type DocumentType = "resume" | "letter";

export interface ChatList {
  id: string;
  title: string;
  type: DocumentType;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  chatListId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  svg?: string;
  summary?: string;
}

interface Download {
  mainFileContent: string;
}

// API Client
const createAPI = () => {
  const apiKey = localStorage.getItem(AUTO_PDF_OPENAI_API_KEY)?.slice(1, -1);

  const api = ky.create({
    prefixUrl: "/api",
    credentials: "include",
    timeout: 30000,
    retry: 0,
    hooks: {
      beforeRequest: [
        (request) => {
          const url = new URL(request.url);

          if (url.pathname === "/api/chat/v1" && apiKey) {
            request.headers.set("x-auto-pdf-key", `Bearer ${apiKey}`);
          }
        },
      ],
      afterResponse: [
        async (request, options, response) => {
          if (!response.ok) {
            const res = (await response.json()) as { message: string };
            toast.error(res.message);
          }
        },
      ],
    },
  });

  return {
    chat: {
      v1: (data: ChatV1Request) =>
        api
          .post("chat/v1", {
            json: data,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .json<ChatV1Response>(),
    },
    chatList: {
      getAll: () =>
        api
          .get("chatlist")
          .json<{ data: ChatList[] }>()
          .then((res) => res.data),
      getMessages: (id: string) =>
        api
          .get(`chatlist/${id}/messages`)
          .json<{ data: ChatMessage[] }>()
          .then((res) => res.data),
      delete: (id: string) =>
        api.delete(`chatlist/${id}`).json<{ data: { id: string } }>(),
    },
    download: {
      pdf: async (data: Download) => {
        const response = await api
          .post("download", {
            headers: {
              Accept: "application/pdf",
            },
            json: data,
          })
          .arrayBuffer();

        const blob = new Blob([response], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "result.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
    },
  };
};

export function useChatMutation() {
  return useMutation({
    mutationFn: (data: ChatV1Request) => createAPI().chat.v1(data),
    onError(error, variables, context) {
      console.log(error);
    },
  });
}

// Query Options
export const chatListQueryOptions = queryOptions({
  queryKey: ["chatList"],
  queryFn: () => createAPI().chatList.getAll(),
});

export const chatMessagesQueryOptions = (chatListId: string) =>
  queryOptions({
    queryKey: ["chatMessages", chatListId],
    queryFn: () => createAPI().chatList.getMessages(chatListId),
    enabled: !!chatListId,
  });

export function useDownloadPDFMutation() {
  return useMutation({
    mutationFn: (data: Download) => createAPI().download.pdf(data),
    onError: (error) => {
      console.error("下载失败:", error);
    },
  });
}

export function useDeleteChatMutation() {
  return useMutation({
    mutationFn: (chatId: string) => createAPI().chatList.delete(chatId),
  });
}
