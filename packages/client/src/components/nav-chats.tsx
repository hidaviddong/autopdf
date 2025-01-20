import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChatList, useDeleteChatMutation } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

export function NavChats({ chats }: { chats: Array<ChatList> }) {
  const { isMobile } = useSidebar();
  const chatNavigate = useNavigate({ from: "/chat/$chatid" });
  const { chatid } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const deleteChatMutation = useDeleteChatMutation();
  function handleDeleteClick(chat: ChatList) {
    deleteChatMutation.mutate(chat.id, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["chatList"] });
        chatNavigate({
          to: "/",
        });
      },
    });
  }
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((chat) => (
          <SidebarMenuItem
            key={chat.id}
            className={`rounded-lg ${
              chatid === chat.id ? "bg-neutral-200" : "hover:bg-neutral-200"
            }`}
          >
            <SidebarMenuButton asChild>
              <Link to={`/chat/${chat.id}`}>
                <span>{chat.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                {isMobile ? (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="text-muted-foreground text-red-600 " />
                        <span className="text-red-600">Delete</span>
                      </DropdownMenuItem>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Delete</DrawerTitle>
                        <DrawerDescription>
                          Are you sure you want to delete: {chat.title} ?
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button
                          type="submit"
                          onClick={() => handleDeleteClick(chat)}
                        >
                          Submit
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="text-muted-foreground text-red-600 " />
                        <span className="text-red-600">Delete</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Delete</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete: {chat.title} ?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={() => handleDeleteClick(chat)}
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
