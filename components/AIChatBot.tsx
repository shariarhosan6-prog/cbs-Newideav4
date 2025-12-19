
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Loader2, User } from 'lucide-react';
import { askGeminiAssistant } from '../services/geminiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello Agent! I am your Gemini-powered CRM assistant. Ask me anything about Australian migration or RPL rules.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askGeminiAssistant(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:bg-indigo-600 group ring-4 ring-indigo-500/20"
        >
          <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
        </button>
      ) : (
        <div className="w-96 bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col h-[500px] animate-in slide-in-from-bottom-10">
          <div className="p-4 bg-slate-900 text-white rounded-t-[32px] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm tracking-tight">Gemini Strategy Hub</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gemini is thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about PR pathways..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button onClick={handleSend} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
