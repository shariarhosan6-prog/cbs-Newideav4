
import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, GraduationCap, ShieldCheck } from 'lucide-react';
import { ClientProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Partial<ClientProfile>) => void;
}

const NewLeadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<ClientProfile>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    qualificationTarget: '',
    visaStatus: 'Visitor 600'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create New Lead</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Start a new application file</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <User className="w-3 h-3" /> Full Name
              </label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="John Citizen"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Phone Number
              </label>
              <input 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+61 400 000 000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Location
              </label>
              <input 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder="City, Country"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" /> Target Qualification
            </label>
            <input 
              required
              value={formData.qualificationTarget}
              onChange={e => setFormData({...formData, qualificationTarget: e.target.value})}
              placeholder="e.g., Cert IV in Kitchen Management"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Current Visa Status
            </label>
            <select 
              value={formData.visaStatus}
              onChange={e => setFormData({...formData, visaStatus: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none"
            >
              <option>Visitor 600</option>
              <option>Student 500</option>
              <option>Graduate 485</option>
              <option>Work 482</option>
              <option>Citizen / PR</option>
              <option>Other</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Confirm & Start Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;
