
import React, { useState, useEffect } from 'react';
import { GitBranch, GitMerge, CheckCircle, Truck, ShoppingBag, Server } from 'lucide-react';
import { Button } from '../ui/Button';

type FlowState = 'start' | 'dev' | 'release' | 'prod';

export const GitFlowModule: React.FC = () => {
  const [featurePos, setFeaturePos] = useState<number>(0);
  const [state, setState] = useState<FlowState>('start');

  // Animation logic to move the "Feature Ball"
  const advance = () => {
    if (state === 'start') {
      setFeaturePos(1); // Move to Dev
      setState('dev');
    } else if (state === 'dev') {
      setFeaturePos(2); // Move to Release
      setState('release');
    } else if (state === 'release') {
      setFeaturePos(3); // Move to Main
      setState('prod');
    } else {
      setFeaturePos(0);
      setState('start');
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      
      {/* Swimlanes Diagram */}
      <div className="relative w-full max-w-4xl h-[300px] bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
        
        {/* Lanes */}
        <div className="flex-1 grid grid-rows-4 relative">
            
            {/* Lane 1: Main (Production) */}
            <div className="border-b border-slate-800/50 relative flex items-center px-4 bg-red-900/5">
                <div className="w-24 font-mono text-xs font-bold text-red-400 flex items-center gap-2">
                    <Server className="w-3 h-3" /> main
                </div>
                <div className="flex-1 h-1 bg-red-500/20 rounded relative">
                    {state === 'prod' && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444] animate-pulse"></div>
                    )}
                </div>
            </div>

            {/* Lane 2: Release (Staging) */}
            <div className="border-b border-slate-800/50 relative flex items-center px-4 bg-orange-900/5">
                <div className="w-24 font-mono text-xs font-bold text-orange-400 flex items-center gap-2">
                    <Truck className="w-3 h-3" /> release
                </div>
                <div className="flex-1 h-1 bg-orange-500/20 rounded relative"></div>
            </div>

            {/* Lane 3: Develop (Integration) */}
            <div className="border-b border-slate-800/50 relative flex items-center px-4 bg-blue-900/5">
                <div className="w-24 font-mono text-xs font-bold text-blue-400 flex items-center gap-2">
                    <GitMerge className="w-3 h-3" /> develop
                </div>
                <div className="flex-1 h-1 bg-blue-500/20 rounded relative"></div>
            </div>

            {/* Lane 4: Feature (Work) */}
            <div className="relative flex items-center px-4 bg-green-900/5">
                <div className="w-24 font-mono text-xs font-bold text-green-400 flex items-center gap-2">
                    <GitBranch className="w-3 h-3" /> feature
                </div>
                <div className="flex-1 h-1 bg-green-500/20 rounded relative"></div>
            </div>

            {/* The Feature Package (Moving Element) */}
            <div 
                className="absolute w-32 h-12 bg-slate-800 border border-white/20 rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-1000 ease-in-out z-20"
                style={{
                    top: state === 'start' ? '78%' : state === 'dev' ? '53%' : state === 'release' ? '28%' : '3%',
                    left: state === 'start' ? '15%' : state === 'dev' ? '40%' : state === 'release' ? '65%' : '90%',
                    transform: 'translateY(-50%)'
                }}
            >
                <ShoppingBag className={`w-4 h-4 ${state === 'prod' ? 'text-red-400' : 'text-green-400'}`} />
                <span className="text-xs font-mono text-white">New Feature</span>
            </div>

            {/* Connection Lines (Simulated Merge Flow) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                 <path d="M 18% 87% C 25% 87%, 25% 62%, 40% 62%" stroke="#4ade80" strokeWidth="2" fill="none" strokeDasharray="4" />
                 <path d="M 46% 62% C 55% 62%, 55% 37%, 65% 37%" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4" />
                 <path d="M 72% 37% C 80% 37%, 80% 12%, 90% 12%" stroke="#fb923c" strokeWidth="2" fill="none" strokeDasharray="4" />
            </svg>

        </div>
      </div>

      {/* Controls & Status */}
      <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-sm font-mono bg-slate-900 px-6 py-3 rounded-full border border-slate-700">
             <span className="text-slate-500">Current Status:</span>
             {state === 'start' && <span className="text-green-400">Coding in Feature Branch</span>}
             {state === 'dev' && <span className="text-blue-400">Merged to Develop (Nightly Build)</span>}
             {state === 'release' && <span className="text-orange-400">Release Candidate (QA Testing)</span>}
             {state === 'prod' && <span className="text-red-400 font-bold">DEPLOYED TO PRODUCTION v1.0</span>}
          </div>

          <Button onClick={advance} icon={state === 'prod' ? <CheckCircle className="w-4 h-4"/> : <GitMerge className="w-4 h-4"/>}>
              {state === 'start' && "完成开发 -> 合并到 Develop"}
              {state === 'dev' && "提测 -> 建立 Release 分支"}
              {state === 'release' && "验收通过 -> 合并到 Main"}
              {state === 'prod' && "开始下一个功能 (Reset)"}
          </Button>
      </div>

      <div className="text-center text-sm text-slate-400 max-w-2xl leading-relaxed">
          <strong>为什么这么麻烦？</strong><br/>
          因为生产环境（Main）必须是极其稳定的。
          Git Flow 这种工作流确保了代码在到达用户面前时，经过了层层过滤和测试。
          Feature 是你的「草稿纸」，Develop 是「组装车间」，Release 是「质检台」，Main 才是「商品展柜」。
      </div>

    </div>
  );
};