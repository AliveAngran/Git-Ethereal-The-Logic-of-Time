import React, { useState, useEffect } from 'react';
import { simpleHash } from '../../services/hashUtils';
import { Fingerprint, ArrowRight } from 'lucide-react';

export const HashingModule: React.FC = () => {
  const [input, setInput] = useState("Git is beautiful");
  const [hash, setHash] = useState("");
  const [prevHash, setPrevHash] = useState("");

  useEffect(() => {
    const newHash = simpleHash(input);
    setPrevHash(hash);
    setHash(newHash);
  }, [input]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl">
      <div className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="relative w-full h-32 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none font-mono text-lg resize-none shadow-xl transition-colors"
          placeholder="在此输入任何内容..."
        />
        <div className="absolute top-4 right-4 text-xs text-slate-500 font-mono">BLOB CONTENT</div>
      </div>

      <div className="flex flex-col items-center">
        <ArrowRight className="text-slate-500 animate-pulse mb-2 rotate-90" />
        <span className="text-xs text-slate-500 mb-6 font-mono">SHA-1 ALGORITHM</span>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 animate-pulse"></div>
        <div className="relative bg-slate-950 p-6 rounded-xl border border-slate-800 flex items-center justify-between gap-4 overflow-hidden">
          <Fingerprint className="text-purple-400 w-8 h-8 flex-shrink-0" />
          <div className="font-mono text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 break-all text-center">
            {hash}
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-400 max-w-lg text-center leading-relaxed">
        <strong className="text-purple-300">交互解析：</strong> 
        观察上方。哪怕你只改变了一个标点符号，下方的哈希值也会发生翻天覆地的变化。这就是 Git 的「完整性保证」。
        在 Git 内部，文件不叫文件，叫 <span className="font-mono bg-slate-800 px-1 rounded">Blob</span> 对象，
        而这个哈希值就是它的唯一身份证。
      </div>
    </div>
  );
};