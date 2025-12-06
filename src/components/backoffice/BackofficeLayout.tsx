import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBackofficeAuth } from '@/context/BackofficeAuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Package,
  LogOut,
  User,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackofficeLayoutProps {
  children: ReactNode;
}

const BackofficeLayout = ({ children }: BackofficeLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useBackofficeAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/backoffice/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/backoffice/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'RFQs',
      href: '/backoffice/rfqs',
      icon: FileText,
    },
    {
      name: 'Products',
      href: '/backoffice/products',
      icon: Package,
    },
    {
      name: 'Categories',
      href: '/backoffice/categories',
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">MetalPro</h1>
          <p className="text-sm text-gray-500">Back-Office</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default BackofficeLayout;
