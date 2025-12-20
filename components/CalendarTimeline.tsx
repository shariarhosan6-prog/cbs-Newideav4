
import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, 
  Clock, AlertCircle, DollarSign, Stethoscope, Fingerprint, 
  Search, Filter, ExternalLink, Bell, MoreHorizontal, User
} from 'lucide-react';
import { Conversation, JourneyMilestone } from '../types';

interface Props {
  conversations: Conversation[];
  onSelectStudent: (id: string) => void;
}

const CalendarTimeline: React.FC<Props> = ({ conversations, onSelectStudent }) => {
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Derive milestones from conversations for global tracking
  const allMilestones = useMemo(() => {
    const milestones: JourneyMilestone[] = [];
    
    conversations.forEach(conv => {
      // 1. Payment Deadlines
      if (conv.paymentPaid < conv.paymentTotal) {
        milestones.push({
          id: `pay-${conv.id}`,
          serviceType: 'admission',
          type: 'payment',
          title: 'Tuition Payment Due',
          description: `$${(conv.paymentTotal - conv.paymentPaid).toLocaleString()} Balance Remaining`,
          status: 'active',
          date: new Date(Date.now() + 86400000 * 5), // Mock: due in 5 days
          studentName: conv.client.name,
          studentId: conv.id
        });
      }

      // 2. Document Deadlines
      conv.documents.forEach(doc => {
        if (doc.deadline) {
          milestones.push({
            id: `doc-${doc.id}`,
            serviceType: 'admission',
            type: 'deadline',
            title: `Document Due: ${doc.name}`,
            description: `Required for ${conv.currentStage.replace(/_/g, ' ')}`,
            status: 'active',
            date: doc.deadline,
            studentName: conv.client.name,
            studentId: conv.id
          });
        }
      });

      // 3. Medical/Biometrics (If booked/pending)
      if (conv.medicalStatus === 'booked' || (conv.currentStage === 'visa_lodged' && conv.medicalStatus === 'pending')) {
        milestones.push({
          id: `med-${conv.id}`,
          serviceType: 'visa',
          type: 'appointment',
          title: 'Medical Examination',
          description: 'HAP ID Verification Required',
          status: 'active',
          date: new Date(Date.now() + 86400000 * 2), // Mock: 2 days
          studentName: conv.client.name,
          studentId: conv.id
        });
      }
    });

    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [conversations]);

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getMilestonesForDay = (day: number) => {
    return allMilestones.filter(m => 
      m.date.getDate() === day && 
      m.date.getMonth() === currentDate.getMonth() && 
      m.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getDayColor = (type: JourneyMilestone['type']) => {
    switch (type) {
      case 'deadline': return 'bg-red-500';
      case 'payment': return 'bg-emerald-500';
      case 'appointment': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Intelligence</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global Milestone & Deadline Tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200">
                <button 
                  onClick={() => setView('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" /> Calendar
                </button>
                <button 
                  onClick={() => setView('timeline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'timeline' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-3.5 h-3.5" /> Timeline
                </button>
             </div>
             <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <Bell className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {view === 'calendar' ? (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Today</button>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {paddingDays.map(d => <div key={`pad-${d}`} className="h-40 border-r border-b border-slate-50 bg-slate-50/20"></div>)}
                {calendarDays.map(day => {
                  const dayMilestones = getMilestonesForDay(day);
                  const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                  
                  return (
                    <div key={day} className={`h-40 border-r border-b border-slate-100 p-3 group hover:bg-slate-50/50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-black ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-xl shadow-lg shadow-blue-500/30' : 'text-slate-400'}`}>
                          {day}
                        </span>
                        {dayMilestones.length > 0 && <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{dayMilestones.length} Events</span>}
                      </div>
                      <div className="space-y-1.5 overflow-y-auto max-h-[100px] no-scrollbar">
                        {dayMilestones.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => onSelectStudent(m.studentId)}
                            className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group/item"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDayColor(m.type)}`}></div>
                            <div className="truncate">
                              <p className="text-[9px] font-black text-slate-900 truncate leading-none mb-0.5">{m.studentName}</p>
                              <p className="text-[8px] font-bold text-slate-400 truncate">{m.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 py-4">
               {[
                 { label: 'Critical Deadlines', color: 'bg-red-500' },
                 { label: 'Upcoming Appointments', color: 'bg-blue-500' },
                 { label: 'Pending Payments', color: 'bg-emerald-500' },
                 { label: 'System Milestones', color: 'bg-slate-500' }
               ].map(l => (
                 <div key={l.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${l.color}`}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{l.label}</span>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-8 duration-500">
            {/* Timeline View */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200"></div>
              
              <div className="space-y-12">
                {/* Categorized Milestone Groups */}
                {[
                  { label: 'Overdue & Immediate', icon: AlertCircle, color: 'text-red-500', items: allMilestones.filter(m => m.date < new Date()) },
                  { label: 'Scheduled for Today', icon: Clock, color: 'text-blue-500', items: allMilestones.filter(m => m.date.toDateString() === new Date().toDateString()) },
                  { label: 'Upcoming 7 Days', icon: CalendarIcon, color: 'text-indigo-500', items: allMilestones.filter(m => m.date > new Date() && m.date.getTime() < Date.now() + 86400000 * 7) }
                ].map((group, idx) => group.items.length > 0 && (
                  <div key={idx} className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 bg-slate-50 py-2">
                      <div className={`p-2 rounded-xl bg-white border border-slate-200 shadow-sm ${group.color}`}>
                        <group.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{group.label}</h3>
                    </div>

                    <div className="ml-6 space-y-4">
                      {group.items.map(m => (
                        <div 
                          key={m.id}
                          className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-6">
                             <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
                                {m.type === 'payment' && <DollarSign className="w-5 h-5" />}
                                {m.type === 'appointment' && <Stethoscope className="w-5 h-5" />}
                                {m.type === 'deadline' && <AlertCircle className="w-5 h-5" />}
                             </div>
                             <div>
                                <h4 className="font-black text-slate-900 text-base">{m.title}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><User className="w-3 h-3" /> {m.studentName}</span>
                                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">{m.description}</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{m.date.toLocaleDateString('default', { day: 'numeric', month: 'short' })}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{m.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             </div>
                             <button 
                                onClick={() => onSelectStudent(m.studentId)}
                                className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
                             >
                                <ExternalLink className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTimeline;
