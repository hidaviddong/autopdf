import { PDFIcon } from "./ui/icons";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavChats } from "./nav-chats";
import { useQuery } from "@tanstack/react-query";
import { chatListQueryOptions } from "@/hooks/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import Loading from "./loading";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: chatLists, isLoading: isChatListLoading } =
    useQuery(chatListQueryOptions);
  const sidebar = useSidebar();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <PDFIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Auto PDF</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Button
          asChild
          variant="outline"
          className="m-4"
          onClick={() => {
            sidebar.toggleSidebar();
          }}
        >
          <Link to="/">New Chat</Link>
        </Button>
        {isChatListLoading ? <Loading /> : <NavChats chats={chatLists!} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
