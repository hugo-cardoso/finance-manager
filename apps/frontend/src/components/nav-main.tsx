import { type Icon, IconCalendarDollar, IconDashboard } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

type NavItem = {
  title: string;
  url?: string;
  baseUrl?: string;
  icon: Icon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Transações",
    icon: IconCalendarDollar,
    baseUrl: "/dashboard/transactions",
    items: [
      {
        title: "Listagem",
        url: "/dashboard/transactions",
      },
    ],
  },
];

export function NavMain() {
  const { pathname } = useLocation();
  const { setOpenMobile: setOpenSidebar } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {NAV_ITEMS.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {item.url ? (
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <Link to={item.url} onClick={() => setOpenSidebar(false)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.baseUrl ?? "")}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              )}
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                            <Link to={subItem.url} onClick={() => setOpenSidebar(false)}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
