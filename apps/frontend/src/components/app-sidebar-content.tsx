import { cn } from "@/lib/utils";
import { SiteHeader } from "./site-header";
import { Separator } from "./ui/separator";
import { SidebarInset } from "./ui/sidebar";

type AppSidebarContentProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
};

export function AppSidebarContent(props: AppSidebarContentProps) {
  return (
    <SidebarInset className="h-screen max-h-screen md:max-h-[calc(100vh---spacing(5))] m-0! p-0 md:rounded-xl! overflow-hidden!">
      <SiteHeader title={props.title} actions={props.headerActions} />
      <div className="flex flex-1 flex-col overflow-scroll scrollbar-hidden">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className={cn("min-h-full", props.className)}>{props.children}</div>
          <div className="w-full flex flex-col mt-px">
            <Separator />
            <div className="w-full grid place-items-center py-4">
              <p className="text-xs text-muted-foreground">Desenvolvido por Hugo Cardoso</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
