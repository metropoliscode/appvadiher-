import { usePage, Link } from '@inertiajs/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { type NavItem } from '@/types';
import {
  BoxIcon,
  Database,
  FileClock,
  LayoutGrid,
  PlayIcon,
  Settings,
  ShoppingBasket,
} from 'lucide-react';
import AppLogo from './app-logo';

const iconMap: Record<string, any> = {
    LayoutGrid: LayoutGrid,
    ShoppingBasket: ShoppingBasket,
    BoxIcon: BoxIcon,
    Database: Database,
    Settings: Settings,
    FileClock: FileClock,
    PlayIcon: PlayIcon,
};


export function AppSidebar() {
  const { props } = usePage();
  const userRoles = (props.auth?.user?.roles || []).map((r: any) => r.name.toLowerCase());
  const modulosPermitidos = props.modulosPermitidos || [];

  const isAdminOrSupervisor = userRoles.includes('administrador') || userRoles.includes('supervisor');

  const dynamicNavItems: NavItem[] = [
    ...(isAdminOrSupervisor
      ? [{
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutGrid,
        }]
      : []),
    ...modulosPermitidos.map((mod: any) => {
        const key = mod.MOD_ICONO?.trim();
        return {
            title: mod.MOD_NOMBRE,
            href: mod.MOD_URL,
            icon: iconMap[key] || LayoutGrid, // fallback si no encuentra
        };
    }),
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dynamicNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

