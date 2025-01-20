import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SignIn from "@/components/sign-in";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const session = useSession();
  return (
    <main className="w-full h-screen bg-neutral-50 selection:text-blue-500 selection:bg-blue-100">
      <SidebarProvider>
        {session.data && <AppSidebar />}
        <SidebarInset>
          <header className="p-2 shrink-0  gap-2 w-full">
            <div className="flex items-center gap-2 px-2 py-0">
              {session.data ? <SidebarTrigger className="-ml-1" /> : <SignIn />}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-h-[90vh] overflow-y-auto">
            <Outlet />
          </div>
          <footer className="text-sm bottom-2 absolute text-neutral-500 w-full flex justify-center items-center gap-2 hover:cursor-pointer">
            Made by
            <span
              className="hover:underline hover:underline-offset-1"
              onClick={() =>
                window.open("https://github.com/hidaviddong", "_blank")
              }
            >
              hidaviddong
            </span>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors />
    </main>
  );
}
