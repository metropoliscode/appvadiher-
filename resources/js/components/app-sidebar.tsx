import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BoxIcon, Database, FileClock, LayoutGrid, PlayIcon, Settings, ShoppingBasket } from 'lucide-react';
import AppLogo from './app-logo';



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Comercial',
        href: '/comercial',
        icon: ShoppingBasket,
    },
    {
        title: 'Contabilidad',
        href: '/contabilidad',
        icon: PlayIcon,
    },
    {
         title: 'Inventarios',
         href: '/inventarios',
         icon: BoxIcon,
     },
    //{
    //     title: 'Sistemas',
    //     href: '/sistemas',
    //     icon: Database,
    // },
    // {
    //     title: 'Configuraciones',
    //     href: '/configuracion',
    //     icon: Settings,
    // },
    // {
    //     title: 'Bitacora',
    //     href: '/bitacora',
    //     icon: FileClock,
    // }
];

export function AppSidebar() {
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
            { route }
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
