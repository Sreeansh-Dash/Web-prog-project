import React, { useState } from 'react';
import { playSound } from '../utils/sound';

interface HintButtonProps {
  hint: string;
  onPenalty: (amount: number) => void;
  cost?: number;
}

export const HintButton: React.FC<HintButtonProps> = ({ hint, onPenalty, cost = 30 }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReveal = () => {
    playSound('error'); // Alarm sound for penalty
    onPenalty(cost);
    setIsRevealed(true);
    setShowConfirm(false);
  };

  const handleClick = () => {
    if (!isRevealed && !showConfirm) {
      playSound('click');
      setShowConfirm(true);
    }
  };

  return (
    <div className="absolute top-24 right-6 z-50">
      {!isRevealed ? (
        <div className="relative">
            {showConfirm ? (
                <div className="flex gap-2 animate-in fade-in slide-in-from-right">
                    <button 
                        onClick={() => setShowConfirm(false)}
                        className="bg-gray-800 text-white text-xs px-3 py-1 border border-gray-600 hover:bg-gray-700 font-tech"
                    >
                        CANCEL
                    </button>
                    <button 
                        onClick={handleReveal}
                        className="bg-danger text-white text-xs px-3 py-1 border border-danger hover:bg-red-600 font-bold tracking-wider font-tech animate-pulse"
                    >
                        CONFIRM (-{cost}s)
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleClick}
                    onMouseEnter={() => playSound('hover')}
                    className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 px-4 py-2 hover:bg-yellow-500/20 transition-colors group"
                >
                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                    <span className="text-xs font-bold tracking-widest font-tech">HINT_PROTOCOL</span>
                </button>
            )}
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 max-w-xs backdrop-blur-md animate-in fade-in zoom-in-95 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <div className="flex items-center gap-2 text-yellow-500 mb-2 border-b border-yellow-500/20 pb-1">
                <span className="material-symbols-outlined text-sm">lock_open</span>
                <span className="text-xs font-bold tracking-widest">DECRYPTED_DATA</span>
            </div>
            <p className="text-xs text-yellow-100 font-mono leading-relaxed">{hint}</p>
        </div>
      )}
    </div>
  );
};