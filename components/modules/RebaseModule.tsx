
import React, { useState } from 'react';
import { GitBranch, ArrowUpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const RebaseModule: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // 0: Initial State (Diverged)
  // 1: Detach (Feature branch transparent/lifted)
  // 2: Replay (Feature branch moved to top of Main)

  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center min-h-[400px]">
      
      {/* Graph Area */}
      <div className="relative w-[600px] h-[300px] glass-panel rounded-xl bg-slate-900/50 overflow-hidden">
        
        {/* Main Branch Line */}
        <div className="absolute top-[60%] left-[10%] w-[80%] h-1 bg-blue-900/50 rounded z-0"></div>
        
        {/* Commits on Main: C1, C2, M1 */}
        <div className="absolute top-[60%] left-[10%] w-8 h-8 rounded-full bg-blue-600 -translate-y-1/2 flex items-center justify-center text-xs font-mono z-10 border-2 border-slate-900">C1</div>
        <div className="absolute top-[60%] left-[30%] w-8 h-8 rounded-full bg-blue-600 -translate-y-1/2 flex items-center justify-center text-xs font-mono z-10 border-2 border-slate-900">C2</div>
        <div className="absolute top-[60%] left-[50%] w-8 h-8 rounded-full bg-blue-600 -translate-y-1/2 flex items-center justify-center text-xs font-mono z-10 border-2 border-slate-900">M1</div>
        
        {/* Feature Branch Group */}
        <div className={`absolute transition-all duration-1000 ease-in-out
            ${step === 0 ? 'top-[30%] left-[30%]' : ''} 
            ${step === 1 ? 'top-[10%] left-[30%] opacity-50 scale-90' : ''}
            ${step === 2 ? 'top-[60%] left-[50%]' : ''}
        `}>
            
            {/* The "Stick" connecting to base */}
            <div className={`absolute h-20 w-1 bg-purple-500/50 origin-bottom transition-all duration-1000 
                ${step === 0 ? 'top-[30px] left-0 rotate-[35deg]' : ''}
                ${step >= 1 ? 'opacity-0' : ''}
            `}></div>

            {/* Feature Commits: F1, F2 */}
            <div className={`flex gap-[80px] transition-all duration-1000 ${step === 2 ? 'pl-[100px]' : 'pl-[60px]'}`}>
                {/* F1 */}
                <div className={`w-8 h-8 rounded-full -translate-y-1/2 flex items-center justify-center text-xs font-mono border-2 border-slate-900 z-20
                    ${step === 2 ? 'bg-purple-500 shadow-[0_0_15px_#a855f7] border-white' : 'bg-purple-700 text-purple-200'}
                `}>
                    {step === 2 ? "F1'" : "F1"}
                </div>
                {/* F2 */}
                <div className={`w-8 h-8 rounded-full -translate-y-1/2 flex items-center justify-center text-xs font-mono border-2 border-slate-900 z-20
                    ${step === 2 ? 'bg-purple-500 shadow-[0_0_15px_#a855f7] border-white' : 'bg-purple-700 text-purple-200'}
                `}>
                    {step === 2 ? "F2'" : "F2"}
                </div>
            </div>

            {/* Connector Line for Feature Branch itself */}
            <div className={`absolute top-0 h-1 bg-purple-500/50 transition-all duration-1000 -z-10
                 ${step === 2 ? 'left-[100px] w-[100px]' : 'left-[60px] w-[80px]'}
            `}></div>

        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-[50%] -translate-x-1/2 text-blue-400 font-mono text-xs flex gap-2">
            <GitBranch className="w-3 h-3" /> main
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Button onClick={() => setStep(0)} disabled={step === 0} variant="secondary">复位 (Reset)</Button>
            <Button onClick={() => setStep(1)} disabled={step !== 0}>1. 剪切 (Detach)</Button>
            <Button onClick={() => setStep(2)} disabled={step !== 1} variant="primary">2. 变基 (Replant)</Button>
          </div>
          
          <div className="h-16 flex items-center justify-center text-sm text-slate-400 max-w-lg text-center animate-fade-in">
              {step === 0 && "初始状态：Feature 分支基于 C2 创建，但现在 Main 已经前进了到了 M1。"}
              {step === 1 && "第一步：Git 先把 Feature 分支上的修改（F1, F2）临时保存到临时区域，这一步就像把树枝剪下来。"}
              {step === 2 && "第二步：Git 把刚才保存的修改，逐个在 M1 后面重新播放（Replay）。注意：虽然内容一样，但因为父节点变了，所以生成了全新的 Hash (F1', F2')。"}
          </div>
      </div>

    </div>
  );
};
