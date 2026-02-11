import React, { useState } from 'react';
import { toggleMute, getMuteState, playSound } from '../utils/sound';

interface GameLayoutProps {
  children: React.ReactNode;
  timeLeft: number;
  view: string;
  hackerMode?: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, timeLeft, view, hackerMode }) => {
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [titleClicks, setTitleClicks] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCritical = timeLeft < 60;

  const handleMuteToggle = () => {
    const newState = toggleMute();
    setIsMuted(newState);
    if (!newState) playSound('click');
  };

  const handleTitleClick = () => {
    if (view === 'landing') return;
    playSound('hover');
    if (titleClicks + 1 >= 7) {
      playSound('success');
      setShowSecretModal(true);
      setTitleClicks(0);
    } else {
      setTitleClicks(prev => prev + 1);
    }
  };

  return (
    <div className={`min-h-screen bg-dark font-mono flex flex-col relative overflow-hidden ${hackerMode ? 'hacker-theme' : 'text-gray-300'}`}>
      <style>{`
        .hacker-theme {
          filter: hue-rotate(280deg) contrast(1.2);
        }
        .hacker-theme .text-primary {
          text-shadow: 0 0 5px currentColor;
        }
      `}</style>

      {/* Visual Effects */}
      <div className="scanlines"></div>
      <div className="crt-overlay"></div>
      {isCritical && isActiveView(view) && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none z-30"></div>
      )}

      {/* Header */}
      {view !== 'landing' && view !== 'success' && view !== 'failure' && (
        <header className="h-16 border-b border-gray-800 bg-surface-dark/90 backdrop-blur-sm flex items-center justify-between px-6 z-40 shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 text-primary animate-pulse cursor-pointer select-none"
              onClick={handleTitleClick}
              title="PROTOCOL: MELTDOWN"
            >
              <span className="material-symbols-outlined text-2xl">terminal</span>
              <span className="font-display font-bold tracking-wider text-lg hidden md:block">
                PROTOCOL:<span className="text-danger">MELTDOWN</span>
              </span>
            </div>
            <div className="h-6 w-px bg-gray-700 mx-2 hidden md:block"></div>
            <span className="text-xs text-gray-500 font-tech tracking-widest uppercase">
              SECURE CONNECTION // {view.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleMuteToggle}
              className="text-gray-500 hover:text-primary transition-colors"
              title="Toggle Audio"
            >
              <span className="material-symbols-outlined">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Time Remaining
              </span>
              <div className={`font-display text-2xl font-bold tracking-widest ${isCritical ? 'text-danger animate-pulse' : 'text-primary'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow relative z-10 overflow-hidden flex flex-col">
        {children}
      </main>

      {/* Secret Modal */}
      {showSecretModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-secondary p-8 rounded max-w-lg w-full relative shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            <button
              onClick={() => setShowSecretModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-display text-secondary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">folder_open</span>
              DEV_LOG_ENCRYPTED
            </h2>
            <div className="font-mono text-sm text-gray-300 space-y-4 max-h-60 overflow-y-auto">
              <p>Log Entry #0042:</p>
              <p>"The core instability wasn't an accident. It was a feature request that went wrong. We tried to patch the logic gates, but the spaghetti code in the Async Handler kept creating race conditions."</p>
              <p className="text-xs text-gray-500">
                Dev Note: If you found this, you really like clicking things.
              </p>
              <p className="text-secondary animate-pulse">
                &gt; SECRET UNLOCKED: Knowledge is power.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status */}
      {view !== 'landing' && (
        <footer className="h-8 bg-black border-t border-gray-900 flex items-center justify-between px-4 text-[10px] text-gray-600 font-tech z-40 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full bg-primary animate-pulse ${hackerMode ? 'bg-pink-500' : ''}`}></span>
              {hackerMode ? 'HACKER_MODE_ACTIVE' : 'SYS_ONLINE'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              ENCRYPTION: {hackerMode ? 'BROKEN' : 'AES-256'}
            </span>
          </div>
          <div>V.4.0.2 // BUILD_9921</div>
        </footer>
      )}
    </div>
  );
};

function isActiveView(view: string) {
  return view !== 'landing' && view !== 'success' && view !== 'failure';
}