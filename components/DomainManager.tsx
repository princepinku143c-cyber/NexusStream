
import React, { useState } from 'react';
import { Globe, ShieldCheck, X, Plus, Trash2, RefreshCw, AlertCircle, Copy, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';
import { DomainInfo, DNSRecord } from '../types';

interface DomainManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DomainManager: React.FC<DomainManagerProps> = ({ isOpen, onClose }) => {
  const [domainName, setDomainName] = useState('nexusstream.app');
  const [isVerifying, setIsVerifying] = useState(false);

  const mockRecords: DNSRecord[] = [
    { id: '1', type: 'A', host: '@', value: '151.101.1.195', ttl: 'Automatic', status: 'active' },
    { id: '2', type: 'A', host: 'www', value: '151.101.65.195', ttl: 'Automatic', status: 'active' },
    { id: '3', type: 'TXT', host: '@', value: 'firebase-nexusstream-verify=xyz789...', ttl: 'Automatic', status: 'pending' },
  ];

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-nexus-950 border border-nexus-800 rounded-2xl shadow-3xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-nexus-800 flex justify-between items-center bg-nexus-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-nexus-wire/10 rounded-lg border border-nexus-wire/30">
                <Globe className="text-nexus-wire" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Domain Synapse</h2>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Connect your custom identity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 bg-[#050505]">
          
          {/* Status Banner */}
          <div className="p-4 rounded-xl border bg-nexus-800/50 border-nexus-wire/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-nexus-900 rounded-full flex items-center justify-center border border-nexus-800">
                  <RefreshCw className={`text-nexus-wire ${isVerifying ? 'animate-spin' : ''}`} size={20} />
               </div>
               <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {domainName} <span className="px-2 py-0.5 bg-nexus-wire/20 text-nexus-wire text-[8px] rounded uppercase font-black">Connection Pending</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Updates can take up to 24-48 hours depending on your registrar (Namecheap).</p>
               </div>
            </div>
            <button 
              onClick={() => { setIsVerifying(true); setTimeout(() => setIsVerifying(false), 2000); }}
              className="px-4 py-2 bg-nexus-wire text-black text-[10px] font-black rounded-lg hover:scale-105 transition-all"
            >
              REFRESH STATUS
            </button>
          </div>

          {/* DNS Records Table - Mimicking Namecheap Screenshot */}
          <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-nexus-accent" /> Host Records
                </h3>
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-nexus-800 border border-nexus-700 rounded-lg text-[9px] font-bold text-gray-400 hover:text-white">
                      Actions <ArrowRight size={10}/>
                   </button>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-nexus-800 border border-nexus-700 rounded-lg text-[9px] font-bold text-gray-400 hover:text-white">
                      Filters
                   </button>
                </div>
            </div>

            <div className="border border-nexus-800 rounded-xl overflow-hidden bg-nexus-900/20">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-nexus-900/50 border-b border-nexus-800">
                  <tr className="text-gray-500 font-bold uppercase">
                    <th className="p-4 w-12"><input type="checkbox" className="rounded border-nexus-700 bg-black" disabled /></th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">TTL</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nexus-800/50">
                  {mockRecords.map(record => (
                    <tr key={record.id} className="group hover:bg-nexus-800/30 transition-colors">
                      <td className="p-4"><input type="checkbox" className="rounded border-nexus-700 bg-black" /></td>
                      <td className="p-4 font-bold text-nexus-port">{record.type} Record</td>
                      <td className="p-4 text-gray-400">{record.host}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-200">
                            <span className="truncate max-w-[200px]">{record.value}</span>
                            <button onClick={() => copyToClipboard(record.value)} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-nexus-700 rounded transition-all">
                                <Copy size={10} />
                            </button>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 italic">{record.ttl}</td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="p-4">
                        <button className="flex items-center gap-2 text-nexus-accent hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                            <div className="p-1 bg-nexus-accent/20 rounded-full"><Plus size={10}/></div> Add New Record
                        </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-5 rounded-2xl bg-nexus-900/30 border border-nexus-800 space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <HelpCircle size={14} className="text-nexus-wire"/> Setup Guide: Namecheap
                </h4>
                <ul className="space-y-2">
                   {[
                       "Open Namecheap Dashboard",
                       "Go to 'Advanced DNS' tab",
                       "Replace default Parking IPs with Nexus IPs",
                       "Add the TXT verification record"
                   ].map((step, i) => (
                       <li key={i} className="flex items-start gap-3 text-[10px] text-gray-500">
                          <span className="font-black text-nexus-wire">{i+1}.</span>
                          {step}
                       </li>
                   ))}
                </ul>
                <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-record-for-my-domain/" target="_blank" className="inline-flex items-center gap-2 text-[9px] text-nexus-accent font-bold hover:underline mt-2">
                    Open Namecheap Help <ExternalLink size={10}/>
                </a>
             </div>

             <div className="p-5 rounded-2xl bg-nexus-wire/5 border border-nexus-wire/20 space-y-3">
                <h4 className="text-[10px] font-black text-nexus-wire uppercase tracking-[0.2em]">Synapse Protection</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                   Connecting your domain activates **Edge Protection** and **Global Load Balancing**. Your agents will run behind a secure firewall with automatic SSL termination.
                </p>
                <div className="flex items-center gap-2 text-[9px] text-nexus-success font-black uppercase">
                    <ShieldCheck size={12}/> SSL Certificate: AUTO-RENEWING
                </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-nexus-800 bg-nexus-900 flex justify-between items-center">
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.3em]">Synapse Engine v2.04</span>
            <button onClick={onClose} className="px-8 py-2.5 bg-nexus-800 hover:bg-white hover:text-black text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest">
                Exit Console
            </button>
        </div>
      </div>
    </div>
  );
};

export default DomainManager;
