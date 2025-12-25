
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, MessageSquare, Kanban, Users, CreditCard, Settings, LogOut, Hexagon, UserCircle, ChevronLeft, Calendar, ChevronRight, Hash, Menu } from 'lucide-react';

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

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  return (
    <div className={`h-full premium-gradient text-white flex flex-col shadow-[25px_0_60px_-15px_rgba(0,26,20,0.6)] sidebar-transition ${sidebarWidth} relative z-50`}>
      
      {/* 🚀 SMART ACTION TAB - PERSISTENT & BUG-FREE */}
      <div className="action-handle">
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
            }}
            className="group flex flex-col items-center justify-center w-8 h-12 bg-pine-950 text-emerald-400 rounded-r-xl border-y border-r border-white/5 shadow-handle hover:w-10 transition-all active:scale-90"
            title={isCollapsed ? "Expand Console" : "Collapse Console"}
          >
            {isCollapsed ? 
                <ChevronRight className="w-4 h-4 animate-pulse" /> : 
                <ChevronLeft className="w-4 h-4" />
            }
            <div className="h-4 w-[2px] bg-emerald-500/20 rounded-full mt-1 group-hover:bg-emerald-400/50 transition-colors"></div>
          </button>
      </div>

      {/* HEADER */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} border-b border-white/5 h-24 overflow-hidden`}>
        <div className={`flex items-center gap-4 transition-all duration-700 ${isCollapsed ? 'scale-110' : 'scale-100'}`}>
          <div className="bg-emerald-600 p-2.5 rounded-[18px] shrink-0 shadow-2xl shadow-black/60 animate-float border border-white/10">
             <Hexagon className="w-6 h-6 text-white fill-current" />
          </div>
          {!isCollapsed && (
            <div className="truncate animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-xl font-black tracking-tight whitespace-nowrap text-white">Stitch <span className="text-emerald-400">OS</span></h1>
                <p className="text-[9px] text-emerald-200/20 font-black uppercase tracking-[0.2em] whitespace-nowrap leading-none mt-1">Midnight Console</p>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-8 space-y-1.5 overflow-y-auto no-scrollbar`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                    ? 'bg-emerald-600/90 text-white shadow-xl shadow-black/20 ring-1 ring-white/10' 
                    : 'text-emerald-100/30 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`relative transition-transform duration-300 ${isCollapsed && 'group-hover:scale-110'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-100/10 group-hover:text-emerald-400'} transition-colors`} />
                    {isCollapsed && item.badge ? (
                        <span className="absolute -top-2 -right-2 bg-rose-600 text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-pine-950 shadow-lg">{item.badge}</span>
                    ) : null}
                </div>
                {!isCollapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap">{item.label}</span>}
              </div>
              
              {!isCollapsed && item.badge ? (
                <span className={`bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full transition-all ${isActive ? 'scale-105 shadow-glow' : 'opacity-40'}`}>
                    {item.badge}
                </span>
              ) : null}

              {/* TOOLTIP FOR COLLAPSED STATE */}
              {isCollapsed && (
                  <div className="fixed left-24 bg-pine-950 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 shadow-2xl z-[200] border border-white/5 whitespace-nowrap ring-1 ring-white/5">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-pine-950"></div>
                  </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className={`p-4 border-t border-white/5 bg-black/30`}>
        <div className={`flex items-center gap-3 py-4 transition-all duration-700 ${isCollapsed ? 'flex-col' : 'flex-row px-2 bg-white/5 rounded-2xl border border-white/5 shadow-inner'}`}>
            <div className="relative shrink-0 group cursor-pointer">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=059669&color=fff" className="w-10 h-10 rounded-xl ring-2 ring-emerald-400/10 object-cover transition-transform group-hover:scale-105" alt="Admin" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-pine-950 rounded-full"></div>
            </div>
            {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                    <p className="text-[12px] font-black truncate text-white tracking-tight leading-none">Alex Sterling</p>
                    <p className="text-[8px] text-emerald-400/40 font-black uppercase tracking-widest leading-none mt-1.5">Lead Architect</p>
                </div>
            )}
            <button className={`p-2 rounded-lg hover:bg-rose-500/20 text-white/10 hover:text-rose-400 transition-all ${isCollapsed ? 'mt-2' : ''}`}>
                <LogOut className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
