import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

type PrivateLayoutContentProps = {
  title: string;
  children: React.ReactNode;
};

export function PrivateLayoutContent(props: PrivateLayoutContentProps) {
  return (
    <SidebarInset>
      <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b pr-4">
        <div className="h-16 aspect-square flex items-center justify-center border-r border-border">
          <SidebarTrigger size="icon-lg" />
        </div>
        <h1 className="text-sm font-bold pl-4">{props.title}</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">{props.children}</main>
    </SidebarInset>
  );
}
