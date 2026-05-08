import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PersonIcon } from './Icons';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/profile', icon: PersonIcon, label: 'Profil' },
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-16 flex flex-col items-center py-6 gap-6 z-40 bg-white shadow-[1px_0_5px_rgba(0,0,0,0.05)]">
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            title={label}
            className={`w-11 h-11 flex items-center justify-center rounded-lg transition-all
              ${isActive
                ? 'bg-[#4A8394] text-white shadow-md shadow-[#4A8394]/30'
                : 'text-[#4A8394] hover:bg-gray-50'
              }`}
          >
            <Icon className="w-5 h-5" />
          </Link>
        );
      })}
    </aside>
  );
}
