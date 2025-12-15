import { IconDashboard, IconTransactionDollar, type TablerIcon } from "@tabler/icons-react";
import { Link, type LinkOptions } from "@tanstack/react-router";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type NavMenuItem = {
  label: string;
  icon: TablerIcon;
  link: LinkOptions;
};

const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    label: "Dashboard",
    icon: IconDashboard,
    link: { to: "/dashboard" },
  },
  {
    label: "Transações",
    icon: IconTransactionDollar,
    link: { to: "/dashboard/transacoes" },
  },
];

export function NavMenu() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {NAV_MENU_ITEMS.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              render={({ className, ...props }) => (
                <Link className={cn(className)} {...props} {...item.link} onClick={() => setOpenMobile(false)}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              )}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
