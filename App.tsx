
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import AIAssistant from './components/AIAssistant';
import Dashboard from './components/Dashboard';
import DomainManager from './components/DomainManager';
import { Nexus, Synapse, NexusType, NexusSubtype, ExecutionLog, Blueprint, AppTheme, UserPlan, UsageStats } from './types';
import { INITIAL_STREAM } from './constants';
import { Play, Activity, Sparkles, Settings, Menu, AlertTriangle, Globe } from 'lucide-react';
import { runAgentWithTools } from './services/geminiService';
import { AuthProvider } from './context/AuthContext';
import PricingModal from './components/PricingModal';

const AppContent: React.FC = () => {
  const [nexuses, setNexuses] = useState<Nexus[]>(INITIAL_STREAM.nexuses);
  const [synapses, setSynapses] = useState<Synapse[]>(INITIAL_STREAM.synapses);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<AppTheme>('cyber');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDomainManagerOpen, setIsDomainManagerOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  // SAAS LOGIC: Usage Tracking
  const [plan, setPlan] = useState<UserPlan>({
    tier: 'FREE',
    region: 'IN',
    status: 'active',
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  });

  const [usage, setUsage] = useState<UsageStats>({
    executionsThisMonth: 128,
    maxExecutions: 2000,
    workflowsUsed: 2,
    maxWorkflows: 5,
    agentsUsed: 1,
    maxAgents: 2
  });

  const executeStream = async () => {
    if (isRunning) return;
    if (usage.executionsThisMonth >= usage.maxExecutions) {
        setIsPricingOpen(true);
        alert("⚠️ Monthly Execution Limit Reached! Upgrade to continue.");
        return;
    }
    setIsRunning(true);
    const apiKey = process.env.API_KEY || ""; 
    let flowData: Record<string, any> = {}; 
    try {
        const triggers = nexuses.filter(n => n.type === NexusType.TRIGGER);
        for (const trigger of triggers) {
            setNexuses(prev => prev.map(n => n.id === trigger.id ? { ...n, status: 'running' } : n));
            const triggerResult = { source: trigger.subtype, timestamp: Date.now(), data: "Incoming Trigger Data" };
            flowData[trigger.id] = triggerResult;
            setNexuses(prev => prev.map(n => n.id === trigger.id ? { ...n, status: 'success', lastOutput: triggerResult } : n));
            let queue = synapses.filter(s => s.sourceId === trigger.id).map(s => s.targetId);
            let visited = new Set<string>();
            while (queue.length > 0) {
                const currentId = queue.shift()!;
                if (visited.has(currentId)) continue;
                visited.add(currentId);
                const node = nexuses.find(n => n.id === currentId);
                if (!node) continue;
                setUsage(prev => ({ ...prev, executionsThisMonth: prev.executionsThisMonth + 1 }));
                setNexuses(prev => prev.map(n => n.id === node.id ? { ...n, status: 'running' } : n));
                let output: any = null;
                const startTime = Date.now();
                try {
                    if (node.subtype === NexusSubtype.AGENT) {
                        const combinedContext = Object.values(flowData);
                        const res = await runAgentWithTools(node.config, node.config.prompt || "", apiKey, combinedContext);
                        output = { text: res.text, toolsCalled: res.functionCalls?.length || 0 };
                    } else if (node.subtype === NexusSubtype.SHEETS_READ) {
                        output = { rows: [["ID", "Name"], ["1", "Nexus Lead"]] }; 
                    } else if (node.subtype === NexusSubtype.LOGGER) {
                        output = flowData;
                    }
                    flowData[node.id] = output;
                    const log: ExecutionLog = {
                        id: `log-${Date.now()}`,
                        timestamp: Date.now(),
                        nexusId: node.id,
                        status: 'success',
                        message: `Executed ${node.label}`,
                        duration: Date.now() - startTime,
                        outputData: output
                    };
                    setLogs(prev => [...prev, log]);
                    setNexuses(prev => prev.map(n => n.id === node.id ? { ...n, status: 'success', lastOutput: output } : n));
                    const nextTargets = synapses.filter(s => s.sourceId === node.id).map(s => s.targetId);
                    queue.push(...nextTargets);
                } catch (nodeError: any) {
                    setNexuses(prev => prev.map(n => n.id === node.id ? { ...n, status: 'error', lastOutput: nodeError.message } : n));
                    break; 
                }
            }
        }
    } catch (e) {
        console.error("Critical Stream Failure", e);
    } finally {
        setIsRunning(false);
    }
  };

  return (
    <div className={`flex h-screen bg-[#050505] text-white font-sans overflow-hidden theme-${theme}`}>
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <DomainManager isOpen={isDomainManagerOpen} onClose={() => setIsDomainManagerOpen(false)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onAddNexus={(t, st) => {
            const newId = `n-${Date.now()}`;
            setNexuses([...nexuses, { 
                id: newId, 
                type: t, 
                subtype: st, 
                label: `New ${st}`, 
                position: { x: 400, y: 300 }, 
                config: {}, 
                status: 'idle', 
                outputs: ['default'] 
            }]);
            setSelectedId(newId);
            setIsPropertiesPanelOpen(true);
        }} 
        onLoadBlueprint={(bp) => { setNexuses(bp.nexuses); setSynapses(bp.synapses); }} 
        onClear={() => { setNexuses([]); setSynapses([]); }} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentStream={{ nexuses, synapses }}
      />
      
      <div className="flex-1 flex flex-col relative">
        <header className="h-14 border-b border-nexus-800 bg-nexus-900/90 flex items-center justify-between px-4 z-30">
           <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2"><Menu size={20}/></button>
               <h1 className="font-bold text-sm tracking-widest text-white uppercase flex items-center gap-2">
                   <div className="w-2 h-2 bg-nexus-accent rounded-full animate-pulse shadow-[0_0_8px_#00ff9d]" />
                   <span className="text-nexus-accent">Nexus</span>Stream
               </h1>
               
               <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-nexus-800/50 rounded-full border border-nexus-700/50">
                   <button 
                     onClick={() => setIsDomainManagerOpen(true)}
                     className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-nexus-wire transition-colors"
                   >
                     <Globe size={12} className="text-nexus-wire" /> Domain Status: <span className="text-nexus-warning">Pending</span>
                   </button>
               </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAIAssistantOpen(true)} 
                className="p-2 bg-nexus-800 hover:bg-nexus-700 rounded-lg transition-all flex items-center gap-2 border border-nexus-700 group"
              >
                  <Sparkles size={16} className="text-nexus-accent group-hover:rotate-12 transition-transform"/>
                  <span className="text-[10px] font-bold uppercase hidden sm:inline">Ask Architect</span>
              </button>
              <div className="h-6 w-px bg-nexus-800 mx-1" />
              <button 
                onClick={executeStream} 
                disabled={isRunning} 
                className="bg-nexus-accent text-black px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)] disabled:opacity-50"
              >
                {isRunning ? <Activity size={14} className="animate-spin" /> : <Play size={14} fill="black"/>} 
                {isRunning ? 'Executing...' : 'Run Stream'}
              </button>
           </div>
        </header>

        <Canvas 
            nexuses={nexuses} 
            synapses={synapses} 
            selectedId={selectedId} 
            onSelectNexus={setSelectedId} 
            onUpdateNexusPosition={(id, x, y) => setNexuses(prev => prev.map(n => n.id === id ? { ...n, position: { x, y } } : n))} 
            onAddSynapse={(s, t, h) => setSynapses([...synapses, { id: `syn-${Date.now()}`, sourceId: s, targetId: t, sourceHandle: h }])} 
            onDeleteSynapse={(id) => setSynapses(prev => prev.filter(s => s.id !== id))} 
            onOpenProperties={(id) => { setSelectedId(id); setIsPropertiesPanelOpen(true); }} 
        />
        
        {isPropertiesPanelOpen && selectedId && (
            <PropertiesPanel 
                nexus={nexuses.find(n => n.id === selectedId) || null} 
                onClose={() => setIsPropertiesPanelOpen(false)} 
                onUpdate={(id, up) => setNexuses(prev => prev.map(n => n.id === id ? { ...n, ...up } : n))} 
                onDelete={(id) => { setNexuses(prev => prev.filter(n => n.id !== id)); setSynapses(prev => prev.filter(s => s.sourceId !== id && s.targetId !== id)); setIsPropertiesPanelOpen(false); }} 
            />
        )}

        <AIAssistant 
            isOpen={isAIAssistantOpen} 
            onClose={() => setIsAIAssistantOpen(false)} 
            onApplyStream={(n, s) => { setNexuses(n); setSynapses(s); }} 
            onOpenSettings={() => setIsSettingsOpen(true)} 
            currentNexuses={nexuses} 
            currentSynapses={synapses} 
        />
      </div>
    </div>
  );
};

const App: React.FC = () => <AuthProvider><AppContent /></AuthProvider>;
export default App;
