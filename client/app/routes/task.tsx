import { NavLink, Outlet } from 'react-router';

import NavigationSuspense from '@client/components/navigation/navigationSuspense';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from '@client/components/ui/sidebar';

export default function Task() {
	return (
		<SidebarProvider className="flex-1">
			<Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Úloha</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<NavLink to={''}>Edit</NavLink>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<NavLink to={'metadata'}>
											Metadata
										</NavLink>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<NavLink to={'work'}>Korektury</NavLink>
									</SidebarMenuButton>
									<SidebarMenuButton asChild>
										<NavLink to={'files'}>Soubory</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<main className="w-full">
				<SidebarTrigger className="absolute top-0 left-0" />
				<NavigationSuspense>
					<Outlet />
				</NavigationSuspense>
			</main>
		</SidebarProvider>
	);
}
