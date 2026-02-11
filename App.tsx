import React, { useState, useEffect, useCallback } from 'react';
import { GameLayout } from './components/GameLayout';
import { INITIAL_TIME, ROOMS } from './constants';
import { ViewState } from './types';
import { Room1, Room2, Room3, Room4, Room5, Room6 } from './features/Rooms';
import { initAudio, playSound } from './utils/sound';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isActive, setIsActive] = useState(false);
  
  // Easter Egg State
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [hackerMode, setHackerMode] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 10 && prev > 0) {
             playSound('alarm');
          }
          if (prev <= 1) {
            setView('failure');
            playSound('error');
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Konami Code Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          // Activate Easter Egg
          setHackerMode(true);
          playSound('success');
          setTimeLeft(prev => prev + 300); // Bonus time
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Game Handlers
  const startGame = () => {
    initAudio(); // Initialize audio context on first interaction
    playSound('click');
    setView('rules');
  };

  const enterHub = () => {
    playSound('open');
    setView('hub');
    setIsActive(true);
  };

  const resetGame = () => {
    setIsActive(false);
    setTimeLeft(INITIAL_TIME);
    setSolvedPuzzles([]);
    setHackerMode(false);
    setKonamiIndex(0);
    setView('landing');
    playSound('click');
  };

  const handleRoomSolve = (roomId: string) => {
    if (!solvedPuzzles.includes(roomId)) {
      setSolvedPuzzles(prev => [...prev, roomId]);
    }
    
    if (roomId === 'room6') {
      setView('success');
      playSound('success');
      setIsActive(false);
    } else {
      playSound('open');
      setView('hub');
    }
  };

  const handlePenalty = (amount: number) => {
    // In hacker mode, penalties are ignored or reduced
    if (!hackerMode) {
      setTimeLeft(prev => Math.max(0, prev - amount));
    }
  };

  const navigateToRoom = (roomView: ViewState) => {
    playSound('open');
    setView(roomView);
  };

  const getHint = (view: ViewState): string => {
    const room = ROOMS.find(r => r.view === view);
    return room ? room.hint : "";
  };

  // Render Logic
  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 overflow-hidden">
             <div className="mb-8 relative group animate-zoom-in">
                <span className="material-symbols-outlined text-9xl text-danger animate-pulse mb-4">warning</span>
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
             </div>
             <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 tracking-tighter" style={{ textShadow: '4px 4px 0px #ff003c' }}>
                    SYSTEM LOCKDOWN
                </h1>
             </div>
             <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
                <p className="text-red-400 font-mono max-w-md mb-12 mx-auto">
                    CRITICAL FAILURE DETECTED. NUCLEAR CORE TEMPERATURE RISING. MANUAL OVERRIDE REQUIRED.
                </p>
             </div>
             <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.9s' }}>
                <button 
                    onClick={startGame}
                    onMouseEnter={() => playSound('hover')}
                    className="bg-primary text-black font-bold text-xl px-10 py-4 rounded hover:bg-green-400 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                    INITIATE PROTOCOL
                </button>
             </div>
          </div>
        );

      case 'rules':
        return (
          <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-display text-white mb-8 border-b border-gray-700 pb-4 w-full text-center animate-slide-up">
              MISSION BRIEFING
            </h2>
            <div className="space-y-6 font-mono text-gray-300 bg-surface-dark p-8 border-l-4 border-primary shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="flex items-start gap-3 animate-slide-in-right opacity-0" style={{ animationDelay: '0.4s' }}>
                <span className="text-primary font-bold">01.</span>
                Navigate through the server hub to identify corrupted nodes.
              </p>
              <p className="flex items-start gap-3 animate-slide-in-right opacity-0" style={{ animationDelay: '0.6s' }}>
                <span className="text-primary font-bold">02.</span>
                Solve coding and logic puzzles to restore system functionality.
              </p>
              <p className="flex items-start gap-3 animate-slide-in-right opacity-0" style={{ animationDelay: '0.8s' }}>
                <span className="text-primary font-bold">03.</span>
                Complete the sequence before the meltdown timer reaches zero.
              </p>
            </div>
            <div className="animate-fade-in opacity-0" style={{ animationDelay: '1.2s' }}>
                <button 
                    onClick={enterHub}
                    onMouseEnter={() => playSound('hover')}
                    className="mt-12 border border-primary text-primary hover:bg-primary hover:text-black px-8 py-3 transition-colors font-bold tracking-widest uppercase"
                >
                    Access Mainframe
                </button>
             </div>
          </div>
        );

      case 'hub':
        return (
          <div className="flex flex-col h-full p-4 md:p-8 overflow-y-auto animate-fade-in">
            <h2 className="text-2xl font-display text-white mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined">hub</span> SERVER_HUB // LEVEL_5
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROOMS.map((room) => {
                const isSolved = solvedPuzzles.includes(room.id);
                // Simple logic: Room is unlocked if it's first OR previous room is solved
                const index = ROOMS.findIndex(r => r.id === room.id);
                const isUnlocked = index === 0 || solvedPuzzles.includes(ROOMS[index - 1].id);
                
                return (
                  <button
                    key={room.id}
                    disabled={!isUnlocked}
                    onMouseEnter={() => isUnlocked && playSound('hover')}
                    onClick={() => isUnlocked && navigateToRoom(room.view as ViewState)}
                    className={`
                      relative p-6 border rounded-sm text-left transition-all duration-300 group overflow-hidden h-48 flex flex-col justify-between
                      ${isSolved 
                        ? 'border-primary bg-primary/5' 
                        : isUnlocked 
                          ? 'border-secondary bg-surface-lighter hover:border-white hover:bg-white/5' 
                          : 'border-gray-800 bg-black opacity-60 cursor-not-allowed grayscale'}
                    `}
                  >
                    {isUnlocked && <div className={`absolute top-0 left-0 w-full h-1 ${isSolved ? 'bg-primary' : 'bg-secondary'}`}></div>}
                    
                    <div className="flex justify-between items-start">
                      <span className={`material-symbols-outlined text-3xl ${isSolved ? 'text-primary' : isUnlocked ? 'text-secondary' : 'text-gray-600'}`}>
                        {isSolved ? 'check_circle' : room.locked && !isUnlocked ? 'lock' : room.icon}
                      </span>
                      <span className="text-[10px] uppercase border border-gray-700 px-2 py-0.5 rounded text-gray-500">
                        {isSolved ? 'RESTORED' : isUnlocked ? 'ACTIVE' : 'LOCKED'}
                      </span>
                    </div>

                    <div>
                      <h3 className={`font-display text-xl font-bold mb-1 ${isSolved ? 'text-primary' : isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {room.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono line-clamp-2">{room.description}</p>
                    </div>

                    {isUnlocked && !isSolved && (
                       <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'room1':
        return <Room1 onSolve={() => handleRoomSolve('room1')} isSolved={solvedPuzzles.includes('room1')} onBack={() => setView('hub')} hint={getHint('room1')} onPenalty={handlePenalty} />;
      case 'room2':
        return <Room2 onSolve={() => handleRoomSolve('room2')} isSolved={solvedPuzzles.includes('room2')} onBack={() => setView('hub')} hint={getHint('room2')} onPenalty={handlePenalty} />;
      case 'room3':
        return <Room3 onSolve={() => handleRoomSolve('room3')} isSolved={solvedPuzzles.includes('room3')} onBack={() => setView('hub')} hint={getHint('room3')} onPenalty={handlePenalty} />;
      case 'room4':
        return <Room4 onSolve={() => handleRoomSolve('room4')} isSolved={solvedPuzzles.includes('room4')} onBack={() => setView('hub')} hint={getHint('room4')} onPenalty={handlePenalty} />;
      case 'room5':
        return <Room5 onSolve={() => handleRoomSolve('room5')} isSolved={solvedPuzzles.includes('room5')} onBack={() => setView('hub')} hint={getHint('room5')} onPenalty={handlePenalty} />;
      case 'room6':
        return <Room6 onSolve={() => handleRoomSolve('room6')} isSolved={solvedPuzzles.includes('room6')} onBack={() => setView('hub')} hint={getHint('room6')} onPenalty={handlePenalty} />;

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 bg-primary/5 animate-fade-in">
             <span className="material-symbols-outlined text-8xl text-primary mb-6 animate-bounce">verified</span>
             <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 animate-slide-up">
                SYSTEM RESTORED
             </h1>
             <p className="text-primary font-mono text-xl mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                CORE STABILIZED. MELTDOWN AVERTED.
             </p>
             <div className="bg-black/50 p-6 rounded border border-primary/30 animate-zoom-in mb-8" style={{ animationDelay: '0.4s' }}>
                <p className="text-gray-400 text-sm mb-2">TIME REMAINING</p>
                <p className="text-4xl font-display font-bold text-white">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
             </div>
             
             <button 
               onClick={resetGame}
               onMouseEnter={() => playSound('hover')}
               className="animate-slide-up opacity-0 border border-primary text-primary hover:bg-primary hover:text-black px-8 py-3 transition-colors uppercase tracking-widest font-bold"
               style={{ animationDelay: '0.6s' }}
             >
                Return to System Root
             </button>
          </div>
        );

      case 'failure':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 bg-red-950/30 animate-fade-in">
             <span className="material-symbols-outlined text-8xl text-danger mb-6 animate-pulse">skull</span>
             <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 glitch">
                CRITICAL FAILURE
             </h1>
             <p className="text-danger font-mono text-xl mb-12">
                CONNECTION LOST. FACILITY COMPROMISED.
             </p>
             <button 
               onClick={resetGame}
               onMouseEnter={() => playSound('hover')}
               className="border border-danger text-danger hover:bg-danger hover:text-white px-8 py-3 transition-colors uppercase tracking-widest font-bold animate-pulse"
             >
                Re-Initialize
             </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <GameLayout timeLeft={timeLeft} view={view} hackerMode={hackerMode}>
      {renderView()}
    </GameLayout>
  );
};

export default App;