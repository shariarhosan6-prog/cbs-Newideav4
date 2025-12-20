
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, MessageSquare, Kanban, Users, CreditCard, Settings, LogOut, Hexagon, UserCircle, ChevronLeft, Calendar, ChevronRight, Hash } from 'lucide-react';

interface Props {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  unreadCount: number;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<Props> = ({ currentView, onChangeView, unreadCount, onToggleCollapse, isCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare, badge: unreadCount },
    { id: 'workspace', label: 'Team Workspace', icon: Hash },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'partners', label: 'Partners & RTOs', icon: Users },
    { id: 'finance', label: 'Commissions', icon: CreditCard },
    { id: 'team', label: 'Team Management', icon: UserCircle },
  ];

  const drawerClass = isCollapsed ? 'is-drawer-close w-20' : 'is-drawer-open w-72';

  return (
    <div className={`h-full bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${drawerClass} relative z-50`}>
      {/* HEADER AREA */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-white/5`}>
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ${isCollapsed ? 'scale-110' : 'scale-100'}`}>
          <div className="bg-messenger-blue p-2.5 rounded-xl shrink-0 shadow-lg shadow-blue-900/40">
             <Hexagon className="w-6 h-6 text-white fill-current" />
          </div>
          {!isCollapsed && (
            <div className="truncate animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-xl font-black tracking-tight whitespace-nowrap">Stitch OS</h1>
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase whitespace-nowrap leading-none mt-1">Enterprise</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
            <button 
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all animate-in fade-in"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
        )}
      </div>

      {isCollapsed && (
          <button 
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 w-6 h-10 bg-slate-800 border border-white/10 rounded-r-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-messenger-blue transition-all z-[100] shadow-xl"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
      )}

      {/* NAVIGATION */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-8 space-y-2 overflow-y-auto no-scrollbar`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3.5 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive ? 'bg-messenger-blue text-white shadow-xl shadow-blue-900/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`relative transition-transform duration-300 ${isCollapsed && 'group-hover:scale-110'}`}>
                    <Icon className={`w-5.5 h-5.5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
                    {isCollapsed && item.badge ? (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full ring-2 ring-slate-900 border border-white/20">{item.badge}</span>
                    ) : null}
                </div>
                {!isCollapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2">{item.label}</span>}
              </div>
              
              {!isCollapsed && item.badge ? (
                <span className={`bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full transition-all ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                    {item.badge}
                </span>
              ) : null}

              {/* TOOLTIP FOR COLLAPSED STATE */}
              {isCollapsed && (
                  <div className="fixed left-20 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-2xl z-[200] border border-white/5 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-slate-800"></div>
                  </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER AREA */}
      <div className={`p-4 border-t border-white/5 transition-all ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center gap-3 py-4 transition-all duration-500 ${isCollapsed ? 'flex-col' : 'flex-row px-2'}`}>
            <div className="relative shrink-0 group cursor-pointer">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff" className="w-10 h-10 rounded-[14px] ring-2 ring-slate-800 object-cover shadow-lg transition-transform group-hover:scale-110" alt="Admin" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm"></div>
                {isCollapsed && (
                    <div className="fixed left-20 bg-slate-800 text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-2xl z-[200] border border-white/5 whitespace-nowrap">
                        Alex (Admin)
                    </div>
                )}
            </div>
            {!isCollapsed && (
                <div className="flex-1 overflow-hidden animate-in fade-in duration-500">
                    <p className="text-sm font-bold truncate text-white">Alex (Admin)</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mt-1">Lead Agent</p>
                </div>
            )}
            <button className={`p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all ${isCollapsed ? 'mt-2' : ''}`} title="Logout">
                <LogOut className="w-4.5 h-4.5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
