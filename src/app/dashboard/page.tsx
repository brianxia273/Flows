import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Dashboard } from "@/components/dashboard";
import { AuthUserProvider } from "@/components/auth-provider";

export default function Home() {
  return (
    <AuthUserProvider>
      <div className="h-screen w-screen flex items-center justify-center px-3 gap-3 bg-[#0e1111]">
        <AppSidebar />
        <div className="w-[90%] flex justify-center items-center">
          <Dashboard />
        </div>
      </div>
    </AuthUserProvider>
  );
}
