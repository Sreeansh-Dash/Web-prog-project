import React, { useEffect, useState } from 'react';
import { playSound } from '../utils/sound';

export const RoomLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('ESTABLISHING UPLINK...');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    playSound('type');
    const texts = [
      'HANDSHAKE_INITIATED...', 
      'BYPASSING_FIREWALL...', 
      'DECRYPTING_NODE_ASSETS...', 
      'RENDERING_INTERFACE...'
    ];
    let txtIdx = 0;
    
    // Progress Bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        // Randomize speed for "network" feel
        return p + Math.random() * 5; 
      });
    }, 50);

    // Text updates
    const txtInterval = setInterval(() => {
      txtIdx++;
      if (txtIdx < texts.length) {
        setText(texts[txtIdx]);
        setLogs(prev => [...prev, `> ${texts[txtIdx]}`]);
        playSound('type');
      }
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(txtInterval);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-primary font-mono gap-6 p-8 relative overflow-hidden bg-black z-50">
       <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
       
       <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs font-bold tracking-widest text-primary">
              <span>{text}</span>
              <span>{Math.min(100, Math.floor(progress))}%</span>
          </div>
          <div className="h-1 bg-gray-900 w-full overflow-hidden">
             <div className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all duration-75" style={{ width: `${Math.min(100, progress)}%` }}></div>
          </div>
       </div>

       <div className="h-32 w-full max-w-md overflow-hidden text-[10px] text-gray-500 font-tech leading-tight opacity-50">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
          <div className="animate-pulse">_</div>
       </div>
    </div>
  );
};