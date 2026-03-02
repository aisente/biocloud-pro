
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, BrainCircuit, X, MessageSquare, ListFilter } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "您好！我是您的 BioCloud AI 助手。我可以帮您解读分析结果、建议探索的信号通路，或协助配置分析流程。今天有什么我可以帮您的吗？" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `你是一位顶级的生物信息学助手。请协助用户：
          1. 解读基因列表 (GO/KEGG 富集结果)。
          2. 解释 NGS 流程步骤 (比对、质控、定量)。
          3. 为论文结果部分编写学术描述。
          4. 根据当前结果推荐下游分析方案。
          回答需专业、基于证据且简洁。使用 Markdown 格式输出表格或列表。请始终使用中文回答。`
        }
      });
      
      const aiText = response.text || "抱歉，我暂时无法处理您的请求。";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "连接错误。请检查您的网络配置。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50 flex items-center gap-2 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap px-2">咨询 AI 助手</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col h-[calc(100vh-120px)] sticky top-8 animate-in slide-in-from-right-4">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/50 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">BioCloud AI 助手</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-500 font-medium">Gemini 3 Flash 已连接</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto">
        {['总结结果', '识别异常值', '通路解读帮助'].map(s => (
          <button 
            key={s} 
            onClick={() => { setInput(s); }}
            className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white rounded-b-3xl">
        <div className="relative">
          <textarea 
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="询问有关您的生物学数据的问题..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
