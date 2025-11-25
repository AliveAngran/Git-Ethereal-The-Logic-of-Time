
import React, { useState } from 'react';
import { HashingModule } from './components/modules/HashingModule';
import { ThreeStatesModule } from './components/modules/ThreeStatesModule';
import { BranchingModule } from './components/modules/BranchingModule';
import { CommitLogModule } from './components/modules/CommitLogModule';
import { MergingModule } from './components/modules/MergingModule';
import { TimeTravelModule } from './components/modules/TimeTravelModule';
import { CherryPickModule } from './components/modules/CherryPickModule';
import { RebaseModule } from './components/modules/RebaseModule';
import { ResetRevertModule } from './components/modules/ResetRevertModule';
import { TagsModule } from './components/modules/TagsModule';
import { StashModule } from './components/modules/StashModule';
import { GitFlowModule } from './components/modules/GitFlowModule';
import { PlaygroundModule } from './components/modules/PlaygroundModule';
import { ViewMode } from './types';
import { LESSONS } from './constants';
import { 
  GitGraph, Database, Network, Clock, PlayCircle, Menu, X, 
  GitMerge, History, Layers, Copy, ArrowUpCircle, AlertOctagon,
  Tag, Archive, Container, Home, ChevronRight, Fingerprint, Swords
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderModule = () => {
    switch (currentView) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in py-20">
            <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center ethereal-glow mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 animate-spin-slow"></div>
              <GitGraph className="w-16 h-16 text-slate-200" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tight">Git Ethereal</h1>
              <p className="text-slate-400 max-w-md mx-auto text-lg font-light">
                以太之境 · 交互式 Git 逻辑解析引擎
              </p>
            </div>
            
            <button 
              onClick={() => setCurrentView('hashing')}
              className="group relative px-8 py-4 bg-white text-black font-mono rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-2 font-bold">
                START JOURNEY <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-xs font-mono text-slate-600 uppercase tracking-widest">
              <div>Post-Material Design</div>
              <div>Visual Logic Engine</div>
              <div>Interactive Learning</div>
              <div>Computational Art</div>
            </div>
          </div>
        );
      case 'hashing': return <HashingModule />;
      case 'areas': return <ThreeStatesModule />;
      case 'commits': return <CommitLogModule />;
      case 'branches': return <BranchingModule />;
      case 'merging': return <MergingModule />;
      case 'timetravel': return <TimeTravelModule />;
      case 'cherrypick': return <CherryPickModule />;
      case 'rebase': return <RebaseModule />;
      case 'reset': return <ResetRevertModule />;
      case 'tags': return <TagsModule />;
      case 'stash': return <StashModule />;
      case 'flow': return <GitFlowModule />;
      case 'playground': return <PlaygroundModule />;
      default: return null;
    }
  };

  const menuItems: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'intro', icon: <Home className="w-4 h-4" />, label: '0. 序章 (Intro)' },
    { id: 'hashing', icon: <Fingerprint className="w-4 h-4" />, label: '1. 哈希 (Hash)' },
    { id: 'areas', icon: <Layers className="w-4 h-4" />, label: '2. 三区 (Areas)' },
    { id: 'commits', icon: <Database className="w-4 h-4" />, label: '3. 快照 (Commits)' },
    { id: 'branches', icon: <Network className="w-4 h-4" />, label: '4. 分支 (Branches)' },
    { id: 'merging', icon: <GitMerge className="w-4 h-4" />, label: '5. 合并 (Merging)' },
    { id: 'timetravel', icon: <Clock className="w-4 h-4" />, label: '6. 穿越 (Checkout)' },
    { id: 'cherrypick', icon: <Copy className="w-4 h-4" />, label: '7. 摘取 (Pick)' },
    { id: 'rebase', icon: <ArrowUpCircle className="w-4 h-4" />, label: '8. 变基 (Rebase)' },
    { id: 'reset', icon: <AlertOctagon className="w-4 h-4" />, label: '9. 后悔 (Reset)' },
    { id: 'tags', icon: <Tag className="w-4 h-4" />, label: '10. 标签 (Tags)' },
    { id: 'stash', icon: <Archive className="w-4 h-4" />, label: '11. 暂存 (Stash)' },
    { id: 'flow', icon: <Container className="w-4 h-4" />, label: '12. 流 (Git Flow)' },
    { id: 'playground', icon: <Swords className="w-4 h-4" />, label: '13. 试炼 (Trials)' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <span className="font-serif font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">Git Ethereal</span>
          <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group
                ${currentView === item.id 
                  ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <span className={`transition-colors ${currentView === item.id ? 'text-purple-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="font-mono">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative flex flex-col h-screen overflow-hidden">
        {/* Top Mobile Bar */}
        <header className="md:hidden h-16 flex items-center px-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
          <button onClick={() => setIsMenuOpen(true)} className="text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-serif font-bold">Git Ethereal</span>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
            {currentView !== 'intro' && (
              <header className="mb-12 text-center space-y-4 animate-fade-in-down w-full max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-slate-400 mb-2">
                   {menuItems.find(i => i.id === currentView)?.icon}
                   <span>MODULE {menuItems.findIndex(i => i.id === currentView)}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-white">{LESSONS[currentView].title}</h2>
                <p className="text-slate-400 text-lg leading-relaxed">{LESSONS[currentView].description}</p>
                <div className="pt-4 flex justify-center">
                  <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-300 text-sm font-mono animate-pulse">
                     <PlayCircle className="w-3 h-3 inline mr-2" />
                     {LESSONS[currentView].interactionPrompt}
                  </div>
                </div>
              </header>
            )}

            <div className="w-full animate-fade-in-up delay-100">
              {renderModule()}
            </div>
            
            {/* Navigation Footer */}
            {currentView !== 'intro' && (
               <div className="w-full max-w-2xl mt-20 pt-10 border-t border-slate-800 flex justify-between text-sm font-mono text-slate-500">
                  <button 
                    onClick={() => {
                       const idx = menuItems.findIndex(i => i.id === currentView);
                       if(idx > 0) setCurrentView(menuItems[idx-1].id);
                    }}
                    className="hover:text-white transition-colors disabled:opacity-30 flex items-center gap-2"
                    disabled={menuItems.findIndex(i => i.id === currentView) <= 0}
                  >
                     ← PREV
                  </button>
                  <button 
                    onClick={() => {
                       const idx = menuItems.findIndex(i => i.id === currentView);
                       if(idx < menuItems.length - 1) setCurrentView(menuItems[idx+1].id);
                    }}
                    className="hover:text-white transition-colors disabled:opacity-30 flex items-center gap-2"
                    disabled={menuItems.findIndex(i => i.id === currentView) >= menuItems.length - 1}
                  >
                     NEXT →
                  </button>
               </div>
            )}
          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
