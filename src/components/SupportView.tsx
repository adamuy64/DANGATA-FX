/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  FileCheck, 
  Layers, 
  AlertTriangle,
  Send,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { FAQ_ENTRIES } from '../data';

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  time: string;
}

export default function SupportView() {
  
  // States of FAQs toggles
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // States of Tickets list
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-4890',
      category: 'Billing query',
      subject: 'Pro licensing charge verification',
      description: 'Verifying automatic card processing on analytical node trial',
      priority: 'Low',
      status: 'Open - Assigned to billing specialist',
      time: 'Yesterday'
    }
  ]);

  // Form states
  const [category, setCategory] = useState('Technical issue');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [showSubSuccess, setShowSubSuccess] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subject,
      description,
      priority,
      status: 'Open - Awaiting Senior Analyst Review',
      time: 'Just now'
    };

    setTickets([newTicket, ...tickets]);
    
    // reset inputs
    setSubject('');
    setDescription('');
    setShowSubSuccess(true);
    setTimeout(() => {
      setShowSubSuccess(false);
    }, 4000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* View Header */}
      <div>
        <h3 className="font-sans text-2xl font-extrabold text-[#191c1d] tracking-tight">Support Desk</h3>
        <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
          Find instant answers to general questions or file custom analytical support tickets.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side: Interative FAQs accordions */}
        <div className="col-span-12 xl:col-span-7 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-5 text-[#00288e] dark:text-[#b8c4ff] border-b border-[#e5e7eb] dark:border-[#2e3132] pb-3">
            <HelpCircle className="w-5 h-5" />
            <h4 className="font-bold text-sm tracking-tight uppercase text-[#191c1d] dark:text-white">Knowledge Base & FAQ</h4>
          </div>

          <div className="space-y-2 text-xs">
            {FAQ_ENTRIES.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx}
                  className="border border-[#e5e7eb] dark:border-[#2c2837] rounded-md overflow-hidden transition-all duration-200"
                >
                  {/* Click header FAQ toggler */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left py-3.5 px-4 bg-[#f8f9fa] dark:bg-[#191520] hover:bg-[#edeef0] flex justify-between items-center outline-none font-bold text-[#191c1d] dark:text-white transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#757684]" /> : <ChevronDown className="w-4 h-4 text-[#757684]" />}
                  </button>

                  {/* Body text answer */}
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-[#201c2a] text-[#444653] dark:text-[#c4c5d5] leading-relaxed border-t border-[#e5e7eb] dark:border-[#2c2837] font-medium font-sans">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Ticket Submission Form & Active logs */}
        <div className="col-span-12 xl:col-span-5 space-y-6">
          
          {/* Create new ticket */}
          <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
            <h4 className="font-extrabold text-[#191c1d] dark:text-white text-xs uppercase tracking-wider mb-4 border-b border-[#e5e7eb] dark:border-[#2e3132] pb-3 flex items-center gap-1">
              <Mail className="w-4 h-4 text-[#00288e]" /> Submit Support Ticket
            </h4>

            <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                {/* Category select */}
                <div>
                  <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Issue Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-[#201c2a] border border-[#c4c5d5] rounded py-1.5 px-2 outline-none font-semibold focus:border-[#00288e]"
                  >
                    <option value="Technical issue">Technical glitch</option>
                    <option value="Trading query">Trading execution Error</option>
                    <option value="Billing query">Billing audit query</option>
                    <option value="General check">General Inquiry</option>
                  </select>
                </div>

                {/* Priority pick */}
                <div>
                  <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Priority Weight</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#201c2a] border border-[#c4c5d5] rounded py-1.5 px-2 outline-none font-semibold focus:border-[#00288e]"
                  >
                    <option value="Low">Low - General advice</option>
                    <option value="Medium">Medium - Standard ticket</option>
                    <option value="High">High - Trade blockage</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Issue Subject line</label>
                <input 
                  type="text"
                  placeholder="Summarize the core query in a brief line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-transparent border border-[#c4c5d5] rounded py-2 px-3 outline-none font-semibold focus:border-[#00288e]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Full Description details</label>
                <textarea 
                  rows={3}
                  placeholder="Be specific. Detail exchange symbols, transaction IDs, timestamps, or system actions if applicable."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent border border-[#c4c5d5] rounded py-2 px-3 outline-none font-semibold focus:border-[#00288e]"
                />
              </div>

              <button
                type="submit"
                id="submit-ticket-btn"
                className="w-full py-2.5 bg-[#00288e] hover:bg-[#173bab] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Send className="w-3.5 h-3.5" /> Submit Audit Request
              </button>

              {showSubSuccess && (
                <div className="p-3 bg-[#92f5a4]/10 border border-[#006d30]/20 text-[#006d30] hover:text-[#005323] rounded font-semibold text-center mt-1 animate-fade-in flex items-center justify-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-[#006d30]" /> Issued ticket filed successfully with support!
                </div>
              )}
            </form>
          </div>

          {/* Active open support tickets display list */}
          <div className="bg-[#edeef0]/60 dark:bg-[#1c1927] border border-[#c4c5d5]/60 dark:border-[#2e3132] rounded-lg p-5">
            <h5 className="text-[11px] font-extrabold text-[#757684] uppercase tracking-wider mb-3">Your Open Tickets ({tickets.length})</h5>
            
            <div className="space-y-3.5 text-xs">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-md shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded-bl uppercase">
                    Awaiting Action
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <span className="font-mono font-bold text-[#00288e] dark:text-[#b8c4ff]">{t.id}</span>
                    <span className="text-[10px] text-[#757684] font-semibold">({t.category})</span>
                    <span className="text-[10px] text-[#757684]">•</span>
                    <span className="text-[10px] text-[#757684]">{t.time}</span>
                  </div>

                  <h6 className="font-extrabold text-[#191c1d] dark:text-white mt-1.5 truncate pr-20">{t.subject}</h6>
                  
                  <p className="text-[11px] text-[#444653] dark:text-[#c4c5d5] leading-relaxed mt-1 line-clamp-2 pr-1">
                    {t.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-dashed border-[#e5e7eb]/60 dark:border-[#2e3132]/60 flex items-center justify-between text-[10px] font-bold text-[#757684]">
                    <span>Status: <span className="text-[#00288e] font-extrabold">{t.status}</span></span>
                    <span className={`px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      t.priority === 'High' ? 'bg-[#ffdad6] text-[#ba1a1a]' : t.priority === 'Medium' ? 'bg-[#b8c4ff]/10 text-[#00288e]' : 'bg-[#f3f4f5] text-[#757684]'
                    }`}>
                      {t.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
