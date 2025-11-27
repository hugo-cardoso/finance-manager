import { cn } from "@/lib/utils";
import { SiteHeader } from "./site-header";
import { SidebarInset } from "./ui/sidebar";

type AppSidebarContentProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
};

export function AppSidebarContent(props: AppSidebarContentProps) {
  return (
    <SidebarInset className="h-screen max-h-screen md:max-h-[calc(100vh---spacing(5))] m-0! p-0 rounded-xl! overflow-hidden!">
      <SiteHeader title={props.title} actions={props.headerActions} />
      <div className="flex flex-1 flex-col overflow-scroll scrollbar-hidden">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className={cn("min-h-full", props.className)}>{props.children}</div>
        </div>
      </div>
    </SidebarInset>
  );
}
