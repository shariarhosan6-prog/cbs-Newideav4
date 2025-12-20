
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, MessageSquare, Kanban, Users, CreditCard, Settings, LogOut, Hexagon, UserCircle, ChevronLeft, Calendar } from 'lucide-react';

interface Props {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  unreadCount: number;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<Props> = ({ currentView, onChangeView, unreadCount, onToggleCollapse }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare, badge: unreadCount },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'partners', label: 'Partners & RTOs', icon: Users },
    { id: 'finance', label: 'Commissions', icon: CreditCard },
    { id: 'team', label: 'Team Management', icon: UserCircle },
  ];

  return (
    <div className="h-full w-64 bg-slate-900 text-white flex flex-col shadow-xl">
      {/* HEADER WITH CLOSE BUTTON */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-messenger-blue p-2 rounded-lg shrink-0">
             <Hexagon className="w-6 h-6 text-white fill-current" />
          </div>
          <div className="truncate">
              <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">Stitch OS</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase whitespace-nowrap">Enterprise v4.0</p>
          </div>
        </div>
        <button 
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-messenger-blue text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge ? ( <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span> ) : null}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" className="w-9 h-9 rounded-full ring-2 ring-slate-700" alt="Admin" />
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">Alex (Admin)</p>
                <p className="text-xs text-slate-500 truncate">Dhaka Hub</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
