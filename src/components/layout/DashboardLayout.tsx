import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Box, PlusSquare, Users,
  LogOut, Menu, Bell, Search, Moon, Sun, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Box },
    { name: 'Add Product', href: '/products/new', icon: PlusSquare },
    ...(user?.role === 'ADMIN' ? [{ name: 'Users', href: '/users', icon: Users }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/products' && location.pathname.startsWith('/products') && location.pathname !== '/products/new') return true;
    return location.pathname === path;
  };

  const currentNav = navigation.find(n => isActive(n.href));

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#0B1120] flex transition-colors duration-300">

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? '80px' : '260px' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transform lg:translate-x-0 lg:static lg:inset-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col transition-transform duration-300 lg:transition-none`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/60 relative">
          <Link to="/" className="flex items-center overflow-hidden whitespace-nowrap">
            {isSidebarCollapsed ? (
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl ml-1">
                Z
              </div>
            ) : (
              <div className="ml-2 flex items-center justify-center">
                <img src="/ZuppaLogo.png" alt="Zuppa" className="h-25 w-auto object-contain" />
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-colors z-10 shadow-sm"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                {active && (
                  <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'} ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors'}`} />

                {!isSidebarCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Area at Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-2'} py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!isSidebarCollapsed && (
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate w-28">{user?.role}</span>
                    </div>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align={isSidebarCollapsed ? "start" : "end"} side="right" sideOffset={12}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Floating Top Navbar */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2 sticky top-0 z-30">
          <header className="h-14 flex items-center justify-between px-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-sm">

            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </Button>
              <nav className="hidden sm:flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <li>
                    <span className="text-slate-400 dark:text-slate-500">Workspace</span>
                  </li>
                  <li><ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" /></li>
                  <li>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{currentNav?.name || 'Dashboard'}</span>
                  </li>
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              {/* Global Search */}
              <div className="hidden md:flex relative group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search anything..."
                  className="w-64 pl-9 h-9 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/20 rounded-full transition-all"
                />
              </div>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="icon" className="relative rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </Button>
            </div>
          </header>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1440px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
