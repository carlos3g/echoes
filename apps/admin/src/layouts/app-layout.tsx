import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  PenTool,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Citacoes', href: '/quotes', icon: BookOpen },
  { name: 'Autores', href: '/authors', icon: PenTool },
  { name: 'Pastas', href: '/folders', icon: FolderOpen },
];

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <div className="flex h-14 items-center gap-2 px-6">
        <BookOpen className="h-6 w-6 text-sidebar-primary" aria-hidden="true" />
        <span className="text-lg font-bold text-sidebar-foreground">Echoes Admin</span>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-3" aria-label="Menu principal">
        {navigation.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </Button>
      </div>
    </>
  );
}

export function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <a href="#main-content" className="skip-link">
        Pular para o conteudo
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar-background lg:flex">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar-background shadow-lg">
            <SidebarContent pathname={location.pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-lg font-bold">Echoes Admin</span>
        </header>

        <main id="main-content" className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
