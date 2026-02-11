import React, { useState, useEffect } from 'react';
import { TerminalOutput } from '../components/TerminalOutput';
import { PuzzleProps } from '../types';
import { playSound } from '../utils/sound';
import { HintButton } from '../components/HintButton';
import { RoomLoader } from '../components/RoomLoader';

// Helper hook for simulation loading
const useRoomLoader = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  return loading;
};

// --- Room 1: Async Handler ---
export const Room1: React.FC<PuzzleProps> = ({ onSolve, isSolved, onBack, hint, onPenalty }) => {
  const loading = useRoomLoader();
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showFix, setShowFix] = useState(false);
  const [errorLog, setErrorLog] = useState<string[]>([
    "> RUNNING: bootSequence()",
    "> CHECKING SYSTEM...",
    "> ERROR: Condition 'check === true' is always false.",
    "> REASON: 'check' is [object Promise], not boolean."
  ]);

  const lines = [
    "async function bootSequence() {",
    "  let status = 'OFFLINE';",
    "  // CRITICAL: Check temperature async",
    "  const check = systemCheck(); // <-- BUG",
    "  if (check === true) {",
    "    status = 'ONLINE';",
    "  }",
    "  return status;",
    "}"
  ];

  const handleLineClick = (idx: number) => {
    if (isSolved) return;
    playSound('type');
    setSelectedLine(idx);
    
    // Index 3 is the missing await
    if (idx === 3) {
      setShowFix(true);
    } else {
      setShowFix(false);
    }
  };

  const handleFix = () => {
    playSound('click');
    playSound('success');
    setErrorLog(prev => [...prev, "> APPLYING: await keyword...", "> RE-RUNNING...", "> SUCCESS: Status is ONLINE."]);
    setShowFix(false);
    setTimeout(onSolve, 1500);
  };

  if (loading) return <RoomLoader />;

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto w-full gap-6 relative">
       <HintButton hint={hint} onPenalty={onPenalty} />
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display text-white">ASYNC_HANDLER</h2>
         <button onClick={() => { playSound('click'); onBack(); }} className="text-xs border border-gray-600 px-3 py-1 hover:bg-gray-800 transition-colors">BACK_TO_HUB</button>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow h-full">
         <div className="bg-[#1e1e1e] border border-gray-700 rounded p-4 font-mono text-sm relative overflow-hidden flex flex-col">
            <div className="bg-gray-800 text-xs px-4 py-1 flex justify-between mb-4">
               <span>boot_loader.js</span>
               <span>READ-WRITE</span>
            </div>
            <div className="space-y-1 flex-grow">
              {lines.map((line, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => handleLineClick(idx)}
                  className={`cursor-pointer px-2 py-0.5 hover:bg-gray-700 transition-colors flex ${selectedLine === idx ? 'bg-blue-900/50 border-l-2 border-blue-500' : ''}`}
                >
                  <span className="text-gray-600 w-8 text-right mr-4 select-none shrink-0">{idx + 1}</span>
                  <span className={`text-gray-300 ${idx === 3 ? 'text-yellow-500' : ''}`}>{line}</span>
                </div>
              ))}
            </div>
            {showFix && !isSolved && (
               <div className="mt-4 bg-gray-900 border border-primary p-4 rounded shadow-lg animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-xs text-primary mb-2">SUGGESTED FIX:</p>
                  <code className="text-xs block bg-black p-2 rounded mb-2 text-green-400">const check = await systemCheck();</code>
                  <button onClick={handleFix} className="w-full bg-primary text-black font-bold text-xs py-2 hover:bg-green-400 transition-colors">APPLY FIX</button>
               </div>
            )}
         </div>
         <TerminalOutput logs={errorLog} status={isSolved ? 'success' : 'error'} />
       </div>
    </div>
  );
};

// --- Room 2: Circuit Logic ---
export const Room2: React.FC<PuzzleProps> = ({ onSolve, isSolved, onBack, hint, onPenalty }) => {
  const loading = useRoomLoader();
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'XOR' | null>(null);
  
  // Scenario: 
  // Input A (TEMP_CRITICAL): TRUE
  // Input B (MANUAL_OVERRIDE): FALSE
  // Desired Output (SCRAM): TRUE
  // Current Gate: AND (True && False = False) -> FAIL
  // Correct Gate: OR (True || False = True) -> SUCCESS

  const handleGateSelect = (gate: 'AND' | 'OR' | 'XOR') => {
    playSound('click');
    setSelectedGate(gate);
    
    if (gate === 'OR') {
        playSound('success');
        setTimeout(onSolve, 1000);
    } else {
        playSound('error');
        onPenalty(10);
    }
  };

  if (loading) return <RoomLoader />;

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto w-full gap-6 relative">
       <HintButton hint={hint} onPenalty={onPenalty} />
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display text-white">CIRCUIT_LOGIC</h2>
         <button onClick={() => { playSound('click'); onBack(); }} className="text-xs border border-gray-600 px-3 py-1 hover:bg-gray-800 transition-colors">BACK_TO_HUB</button>
       </div>
       
       <div className="flex-grow flex items-center justify-center bg-surface-dark border border-gray-800 relative p-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="flex items-center gap-8 z-10 w-full max-w-4xl justify-between">
                {/* Inputs */}
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-900/30 border border-green-500 text-green-500 px-4 py-2 rounded font-mono text-xs">
                            TEMP_CRITICAL
                            <div className="text-xl font-bold">TRUE (1)</div>
                        </div>
                        <div className="h-0.5 w-16 bg-green-500"></div>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="bg-red-900/30 border border-red-500 text-red-500 px-4 py-2 rounded font-mono text-xs opacity-50">
                            MANUAL_OVERRIDE
                            <div className="text-xl font-bold">FALSE (0)</div>
                        </div>
                        <div className="h-0.5 w-16 bg-gray-700"></div>
                    </div>
                </div>

                {/* Gate Selection */}
                <div className="flex flex-col gap-4">
                    <div className="text-center text-xs text-gray-400 mb-2">SELECT LOGIC GATE</div>
                    <div className="flex flex-col gap-2">
                        {['AND', 'OR', 'XOR'].map((g) => (
                            <button 
                                key={g}
                                onClick={() => !isSolved && handleGateSelect(g as any)}
                                className={`w-32 h-24 border-2 flex items-center justify-center font-bold text-xl rounded transition-all
                                    ${selectedGate === g 
                                        ? g === 'OR' ? 'border-primary bg-primary/20 text-primary' : 'border-red-500 bg-red-500/20 text-red-500'
                                        : 'border-gray-600 bg-gray-900 hover:border-gray-400'
                                    }
                                `}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Output */}
                <div className="flex items-center gap-4">
                    <div className={`h-0.5 w-16 transition-colors ${selectedGate === 'OR' ? 'bg-primary' : 'bg-gray-700'}`}></div>
                    <div className={`border px-6 py-4 rounded font-mono text-center transition-all ${selectedGate === 'OR' ? 'border-primary text-primary bg-primary/10 shadow-[0_0_20px_rgba(0,255,65,0.3)]' : 'border-gray-600 text-gray-600 bg-black'}`}>
                        <div className="text-xs mb-1">SYSTEM_SCRAM</div>
                        <div className="text-3xl font-bold">{selectedGate === 'OR' ? 'TRUE' : 'FALSE'}</div>
                    </div>
                </div>
            </div>
       </div>
       <div className="p-4 bg-black border border-gray-800 text-gray-400 text-xs font-mono">
            MISSION: The SCRAM (Emergency Shutdown) must trigger if EITHER the Temperature is Critical OR the Manual Override is active.
       </div>
    </div>
  );
};

// --- Room 3: Bitwise Operations ---
export const Room3: React.FC<PuzzleProps> = ({ onSolve, isSolved, onBack, hint, onPenalty }) => {
  const loading = useRoomLoader();
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState(["> CALCULATING PERMISSION FLAGS...", "> SOLVE FOR 'final_permissions'"]);

  // Puzzle:
  // READ = 4 (100)
  // WRITE = 2 (010)
  // EXEC = 1 (001)
  // current = READ | WRITE = 6 (110)
  // op = current ^ WRITE (XOR) -> 110 ^ 010 = 100 (4)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    const cleanedInput = inputVal.trim().toLowerCase();

    if (cleanedInput === '4') {
        playSound('success');
        setLogs(prev => [...prev, `> INPUT: ${inputVal}`, "> VERIFYING BITMASK...", "> ACCESS GRANTED."]);
        onSolve();
    } 
    // Easter Eggs
    else if (cleanedInput === 'coffee') {
        playSound('success');
        setLogs(prev => [...prev, `> INPUT: ${inputVal}`, "> CAFFEINE DETECTED. EFFICIENCY +100%.", "> (No actual effect, but tasty.)"]);
    }
    else if (cleanedInput === 'sudo') {
        playSound('error');
        setLogs(prev => [...prev, `> INPUT: ${inputVal}`, "> ADMIN PRIVILEGES: RESTRICTED.", "> NICE TRY."]);
    }
    else if (cleanedInput === '42') {
        playSound('success');
        setLogs(prev => [...prev, `> INPUT: ${inputVal}`, "> MEANING OF LIFE DETECTED.", "> CALCULATING DEEP THOUGHT..."]);
    }
    else {
        playSound('error');
        onPenalty(15);
        setLogs(prev => [...prev, `> INPUT: ${inputVal}`, "> VERIFYING BITMASK...", "> ACCESS DENIED. CHECK BINARY LOGIC."]);
    }
  };

  if (loading) return <RoomLoader />;

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto w-full gap-6 relative">
       <HintButton hint={hint} onPenalty={onPenalty} />
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display text-white">BITWISE_OPERATIONS</h2>
         <button onClick={() => { playSound('click'); onBack(); }} className="text-xs border border-gray-600 px-3 py-1 hover:bg-gray-800 transition-colors">BACK_TO_HUB</button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="bg-[#0f172a] p-6 rounded border border-gray-700 font-mono text-sm leading-relaxed text-gray-300 overflow-auto">
<pre>{`const FLAGS = {
  READ:  4, // Binary: 0100
  WRITE: 2, // Binary: 0010
  EXEC:  1  // Binary: 0001
};

// Initial State: Read and Write access
let permissions = FLAGS.READ | FLAGS.WRITE; 
// Binary: 0100 | 0010 = 0110 (6)

// Toggle Write access off using XOR
permissions = permissions ^ FLAGS.WRITE;

// What is the integer value of 'permissions'?
console.log(permissions); // ?`}</pre>
            </div>
            
            <div className="flex flex-col gap-4">
                <TerminalOutput logs={logs} />
                {!isSolved && (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input 
                            type="text" 
                            className="bg-black border border-gray-700 text-white flex-grow p-2 font-mono focus:border-primary outline-none focus:bg-gray-900 transition-colors"
                            placeholder="Enter integer result..."
                            value={inputVal}
                            onChange={(e) => {
                                playSound('type');
                                setInputVal(e.target.value);
                            }}
                        />
                        <button type="submit" className="bg-primary text-black font-bold px-6 hover:bg-green-400 transition-colors">EXECUTE</button>
                    </form>
                )}
            </div>
       </div>
    </div>
  );
};

// --- Room 4: Algorithm Optimizer ---
export const Room4: React.FC<PuzzleProps> = ({ onSolve, isSolved, onBack, hint, onPenalty }) => {
  const loading = useRoomLoader();
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const options = [
    { id: 1, label: "Nested Loop Search", complexity: "O(N²)", code: "for(let log of logs) {\n  for(let err of errors) {\n    if(log.id == err.id) ...\n  }\n}" },
    { id: 2, label: "Hash Map Lookup", complexity: "O(N)", code: "const errMap = new Set(errors.map(e => e.id));\nfor(let log of logs) {\n  if(errMap.has(log.id)) ...\n}" },
    { id: 3, label: "Recursive Search", complexity: "O(N!)", code: "function find(idx) {\n  if(idx > len) return;\n  find(idx+1)...\n}" }
  ];

  const handleSelect = (id: number) => {
    playSound('click');
    setSelectedOpt(id);
    if(id === 2) {
        playSound('success');
        setFeedback("OPTIMIZATION ACCEPTED. COMPLEXITY REDUCED TO LINEAR O(N).");
        setTimeout(onSolve, 1000);
    } else {
        playSound('error');
        onPenalty(20);
        setFeedback("TIMEOUT WARNING: ALGORITHM TOO SLOW. TRY REDUCING COMPLEXITY.");
    }
  };

  if (loading) return <RoomLoader />;

  return (
    <div className="flex flex-col h-full p-6 max-w-5xl mx-auto w-full gap-6 relative">
       <HintButton hint={hint} onPenalty={onPenalty} />
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display text-white">ALGORITHM_OPTIMIZER</h2>
         <button onClick={() => { playSound('click'); onBack(); }} className="text-xs border border-gray-600 px-3 py-1 hover:bg-gray-800 transition-colors">BACK_TO_HUB</button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
         <div className="bg-gray-900 border border-red-500/30 p-4 rounded relative flex flex-col">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">HEAP OVERFLOW</div>
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <div className="space-y-4">
                    <p className="text-gray-400 text-sm">Processing 1,000,000 sensor logs...</p>
                    <div className="w-full bg-gray-800 h-4 rounded overflow-hidden">
                        <div className="h-full bg-red-500 w-[10%] animate-[pulse_2s_infinite]"></div>
                    </div>
                    <p className="text-red-400 font-mono text-xs">CURRENT METHOD IS O(N²). ESTIMATED TIME: 4 HOURS.</p>
                </div>
            </div>
         </div>

         <div className="flex flex-col gap-4">
            <h3 className="text-primary font-mono text-sm uppercase">Select Optimization Strategy:</h3>
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => !isSolved && handleSelect(opt.id)}
                    onMouseEnter={() => playSound('hover')}
                    className={`p-4 border text-left font-mono text-sm rounded transition-all group ${
                        selectedOpt === opt.id 
                            ? opt.id === 2 ? 'border-primary bg-primary/10' : 'border-red-500 bg-red-500/10'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                    }`}
                >
                    <div className="font-bold mb-2 text-white flex justify-between items-center">
                        <span>{opt.label}</span>
                        <span className="text-[10px] bg-gray-700 px-2 py-1 rounded text-gray-300">{opt.complexity}</span>
                    </div>
                    <pre className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors whitespace-pre-wrap">{opt.code}</pre>
                </button>
            ))}
            {feedback && (
                <div className={`text-xs p-2 border ${feedback.includes('ACCEPTED') ? 'border-primary text-primary' : 'border-red-500 text-red-500'}`}>
                    {feedback}
                </div>
            )}
         </div>
       </div>
    </div>
  );
};

// --- Room 5: Visual Override ---
export const Room5: React.FC<PuzzleProps> = ({ onSolve, isSolved, onBack, hint, onPenalty }) => {
  const loading = useRoomLoader();
  const [fixed, setFixed] = useState(false);

  const handleOverride = () => {
    playSound('click');
    setFixed(true);
    playSound('success');
    setTimeout(onSolve, 1000);
  };

  if (loading) return <RoomLoader />;

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto w-full gap-6 relative">
       <HintButton hint={hint} onPenalty={onPenalty} />
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-display text-white">VISUAL_OVERRIDE</h2>
         <button onClick={() => { playSound('click'); onBack(); }} className="text-xs border border-gray-600 px-3 py-1 hover:bg-gray-800 transition-colors">BACK_TO_HUB</button>
       </div>

       <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Code Editor */}
          <div className="w-full lg:w-1/3 bg-[#1e1e1e] border border-gray-700 p-4 font-mono text-sm flex flex-col">
             <div className="text-gray-500 mb-2">// style.css</div>
             <div className="flex-grow space-y-2">
                <div>.invisible-overlay {'{'}</div>
                <div className="pl-4">position: absolute;</div>
                <div className="pl-4">z-index: 9999;</div>
                <div className="pl-4">width: 100%; height: 100%;</div>
                
                {fixed ? (
                    <div className="pl-4 text-primary animate-pulse">pointer-events: none;</div>
                ) : (
                    <div className="pl-4 text-gray-500 italic">// Missing pointer-events</div>
                )}
                
                <div>{'}'}</div>
             </div>
             {!isSolved && (
                <button onClick={handleOverride} className="bg-secondary text-black font-bold py-3 mt-4 hover:bg-cyan-300 transition-colors">
                    INJECT CSS PROPERTY
                </button>
             )}
          </div>

          {/* Visual Output */}
          <div className="w-full lg:w-2/3 bg-black relative border border-gray-800 overflow-hidden flex items-center justify-center p-8">
             <div className="absolute inset-0 bg-green-900/10 z-0"></div>
             
             {/* The "Broken" UI */}
             <div className="relative z-10 p-12 rounded border border-gray-700 bg-gray-900 shadow-2xl">
                <div className="text-center space-y-4">
                    <h3 className="text-white font-bold tracking-widest">EMERGENCY SHUTOFF</h3>
                    
                    <button 
                        className={`bg-red-600 text-white font-bold py-4 px-8 rounded shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-transform active:scale-95 hover:bg-red-500
                        ${fixed ? 'cursor-pointer' : 'hover:cursor-default'}
                        `}
                        // If not fixed, the click is intercepted by the overlay below
                    >
                        DISENGAGE CORE
                    </button>
                </div>

                {/* The Overlay that blocks clicks if not fixed */}
                <div 
                    className={`absolute inset-0 bg-transparent z-50 ${fixed ? 'pointer-events-none' : 'cursor-not-allowed'}`}
                    onClick={() => {
                        if (!fixed) {
                            playSound('error');
                            // Visual feedback for the click being blocked
                        }
                    }}
                >
                     {!fixed && (
                         <div className="absolute top-2 right-2 text-[10px] text-gray-600 border border-gray-800 p-1 opacity-50">
                             z-index: 9999
                         </div>
                     )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Room 6: Deadlock Resolution ---
export const Room6: React.FC<PuzzleProps> = ({ onSolve, isSolved, hint, onPenalty }) => {
  const loading = useRoomLoader();
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);
  
  // Logic: Deadlock. Process A holds Res 1, wants Res 2. Process B holds Res 2, wants Res 1.
  // We must terminate one to free resources.
  // Sequence:
  // 1. TERMINATE PROCESS A (Releases Res 1)
  // 2. FLUSH RESOURCE 1
  // 3. RESTART PROCESS B (Claims Res 1, finishes)

  const handleStep = (idx: number) => {
    playSound('click');
    if (idx === step) {
        setStep(step + 1);
        if (idx === 2) {
            playSound('success');
            setTimeout(onSolve, 1000);
        } else {
            playSound('type');
        }
    } else {
        playSound('error');
        onPenalty(10);
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }
  };

  if (loading) return <RoomLoader />;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 max-w-4xl mx-auto w-full gap-8 relative">
       <HintButton hint={hint} onPenalty={onPenalty} />
       
       <h2 className="text-3xl font-display text-danger uppercase tracking-[0.2em] animate-pulse">DEADLOCK RESOLUTION</h2>
       <p className="text-gray-400 font-mono text-center max-w-lg mb-4">
            System is gridlocked. Resource 1 and 2 are mutually locked.
            <br/>
            <span className="text-primary">PROTOCOL: Terminate A &gt; Flush &gt; Restart B</span>
       </p>
       
       <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 w-full ${shake ? 'animate-[glitch_0.2s_ease-in-out_infinite]' : ''}`}>
            <button 
                onClick={() => handleStep(0)}
                disabled={step !== 0}
                className={`h-40 border-2 rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                    step > 0 ? 'border-gray-700 bg-gray-900/50 text-gray-500' : 
                    step === 0 ? 'border-danger bg-danger/10 text-danger hover:bg-danger/20 animate-pulse cursor-pointer' : 
                    'border-gray-800 text-gray-700 opacity-30 cursor-not-allowed'
                }`}
            >
                <span className="material-symbols-outlined text-4xl">cancel_presentation</span>
                <span className="font-bold tracking-widest text-center">TERMINATE<br/>PROCESS A</span>
            </button>

            <button 
                onClick={() => handleStep(1)}
                disabled={step !== 1}
                className={`h-40 border-2 rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                    step > 1 ? 'border-gray-700 bg-gray-900/50 text-gray-500' : 
                    step === 1 ? 'border-warning bg-warning/10 text-warning hover:bg-warning/20 animate-pulse cursor-pointer' : 
                    'border-gray-800 text-gray-700 opacity-30 cursor-not-allowed'
                }`}
            >
                <span className="material-symbols-outlined text-4xl">cleaning_services</span>
                <span className="font-bold tracking-widest text-center">FLUSH<br/>RESOURCE 1</span>
            </button>

            <button 
                onClick={() => handleStep(2)}
                disabled={step !== 2}
                className={`h-40 border-2 rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                    step > 2 ? 'border-primary bg-primary/10 text-primary' : 
                    step === 2 ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 animate-pulse cursor-pointer' : 
                    'border-gray-800 text-gray-700 opacity-30 cursor-not-allowed'
                }`}
            >
                <span className="material-symbols-outlined text-4xl">restart_alt</span>
                <span className="font-bold tracking-widest text-center">RESTART<br/>PROCESS B</span>
            </button>
       </div>

       <div className="w-full bg-gray-900 h-4 rounded-full overflow-hidden border border-gray-700">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%`}}
          ></div>
       </div>
    </div>
  );
};