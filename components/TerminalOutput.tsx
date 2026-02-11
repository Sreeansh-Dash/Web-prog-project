import React from 'react';

interface TerminalOutputProps {
  logs: string[];
  title?: string;
  status?: 'active' | 'error' | 'success';
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs, title = "SYSTEM_LOG", status = 'active' }) => {
  return (
    <div className="bg-surface-dark border border-gray-800 rounded-sm shadow-lg flex flex-col h-full font-mono text-xs md:text-sm overflow-hidden relative group">
      <div className={`bg-gray-900 border-b border-gray-800 p-2 flex items-center justify-between shrink-0 ${status === 'error' ? 'border-danger/30' : ''}`}>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="material-symbols-outlined text-sm">terminal</span>
          <span className="font-bold uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      <div className="flex-grow p-4 bg-[#0a0a0a] overflow-y-auto font-tech space-y-2 text-gray-300 relative">
         <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
        {logs.map((log, idx) => (
          <div key={idx} className={`${log.includes('ERROR') || log.includes('FAIL') ? 'text-danger' : log.includes('SUCCESS') ? 'text-primary' : 'text-gray-400'}`}>
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
            {log}
          </div>
        ))}
        <div className="animate-pulse text-primary">_</div>
      </div>
    </div>
  );
};
