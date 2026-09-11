import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Tag,
  Layers,
  CreditCard,
  Receipt,
  Image,
  Ticket,
  Users,
  Newspaper,
  Zap,
  Star,
  Sparkles,
  MessageCircle,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: ShoppingCart },
  { to: '/category', label: 'Category', icon: Tag },
  { to: '/collections', label: 'Collections', icon: Layers },
  { to: '/orders', label: 'Orders', icon: CreditCard },
  { to: '/invoices', label: 'Invoices', icon: Receipt },
  { to: '/banners', label: 'Banners', icon: Image },
  { to: '/promo-codes', label: 'Promo Codes', icon: Ticket },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/updates', label: 'Updates', icon: Newspaper },
  { to: '/flash-sales', label: 'Flash Sales', icon: Zap },
  { to: '/best-sellers', label: 'Best Sellers', icon: Star },
  { to: '/featured', label: 'Featured', icon: Sparkles },
  { to: '/support', label: 'Support', icon: MessageCircle },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`shrink-0 overflow-y-auto border-r border-black/5 bg-white/70 backdrop-blur-xl transition-all duration-200 ${
        collapsed ? 'w-[76px]' : 'w-[280px]'
      }`}
    >
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
