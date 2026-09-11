import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, ChevronRight, ChevronDown, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ collapsed, onToggleCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-black/5 bg-white/70 px-4 py-3.5 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold text-white">
          A
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight text-neutral-900">AdminPanel</span>}
        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
        >
          <Bell size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-neutral-100"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
              <User size={16} />
              <span className="absolute -right-0.5 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <ChevronDown size={14} className="text-neutral-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-black/5 bg-white py-1.5 shadow-lg">
                <div className="border-b border-neutral-100 px-3.5 py-2">
                  <p className="truncate text-sm font-semibold text-neutral-900">{user?.name}</p>
                  <p className="truncate text-xs text-neutral-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
