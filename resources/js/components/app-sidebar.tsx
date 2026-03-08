import { Link } from '@inertiajs/react';
import { BookOpen,CalendarCog, ClipboardMinus } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [

    {
        title: 'Schedules',
        href: '/view-schedules',
        icon: CalendarCog,
    },
    {
        title: 'Reports',
        href: '/view-reports',
        icon: ClipboardMinus,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Home Page',
        href: '/',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className='py-8'>
                <AppLogo />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
