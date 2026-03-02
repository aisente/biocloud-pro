
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Maximize2, 
  Table as TableIcon, 
  FileJson,
  Filter,
  Wand2,
  Settings2,
  RefreshCw,
  Layers,
  Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, Cell, ScatterProps
} from 'recharts';

interface ResultsProps {
  projectId: string;
  onBack: () => void;
}

// 模拟火山图原始数据
const initialVolcanoData = Array.from({ length: 400 }, (_, i) => ({
  id: i,
  gene: `Gene_${i}`,
  log2FC: (Math.random() - 0.5) * 10,
  pVal: Math.random() * 6,
}));

// 模拟富集数据
const initialEnrichmentData = [
  { name: '细胞周期', count: 45, pVal: 0.0001, category: 'BP' },
  { name: 'DNA 修复', count: 38, pVal: 0.0004, category: 'BP' },
  { name: '糖酵解', count: 32, pVal: 0.0012, category: 'MF' },
  { name: '细胞凋亡', count: 28, pVal: 0.0045, category: 'CC' },
  { name: 'Wnt 信号通路', count: 24, pVal: 0.0120, category: 'BP' },
  { name: '蛋白质折叠', count: 18, pVal: 0.0450, category: 'CC' },
  { name: '脂质代谢', count: 12, pVal: 0.0820, category: 'MF' },
];

// 模拟 PCA 数据
const pcaData = [
  { x: -12.4, y: 5.2, group: 'Control', name: 'Ctrl_1' },
  { x: -11.8, y: 4.8, group: 'Control', name: 'Ctrl_2' },
  { x: -13.1, y: 6.1, group: 'Control', name: 'Ctrl_3' },
  { x: 10.2, y: -2.1, group: 'Treat', name: 'Treat_1' },
  { x: 9.8, y: -1.8, group: 'Treat', name: 'Treat_2' },
  { x: 11.5, y: -2.5, group: 'Treat', name: 'Treat_3' },
];

export const ResultsDashboard: React.FC<ResultsProps> = ({ projectId, onBack }) => {
  const [activeTab, setActiveTab] = useState('二次分析工具箱');
  
  // 工具箱状态
  const [volcanoThreshold, setVolcanoThreshold] = useState({ fc: 2.0, p: 1.3 }); // 1.3 is -log10(0.05)
  const [enrichmentMinCount, setEnrichmentMinCount] = useState(15);

  // 计算过滤后的火山图数据
  const filteredVolcano = useMemo(() => {
    return initialVolcanoData.map(d => {
      const isUp = d.log2FC >= volcanoThreshold.fc && d.pVal >= volcanoThreshold.p;
      const isDown = d.log2FC <= -volcanoThreshold.fc && d.pVal >= volcanoThreshold.p;
      return {
        ...d,
        color: isUp ? '#ef4444' : (isDown ? '#3b82f6' : '#cbd5e1'),
        status: isUp ? 'Up' : (isDown ? 'Down' : 'NS')
      };
    });
  }, [volcanoThreshold]);

  // 计算过滤后的富集数据
  const filteredEnrichment = useMemo(() => {
    return initialEnrichmentData.filter(d => d.count >= enrichmentMinCount);
  }, [enrichmentMinCount]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* 顶部操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">分析报告：肺癌 RNA-seq</h1>
            <p className="text-slate-500 text-sm">流程：RNA-seq 标准版 v2.1 • 生成日期：2024年5月20日</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            <Download className="w-4 h-4" /> 导出结果
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">
            <Share2 className="w-4 h-4" /> 分享项目
          </button>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="bg-white border-b border-slate-200 -mx-8 px-8 sticky top-0 z-10 py-1 flex items-center justify-between">
        <div className="flex gap-8">
          {['报告摘要', '差异分析', '通路富集', '二次分析工具箱'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === '二次分析工具箱' ? (
                <span className="flex items-center gap-1.5"><Wand2 className="w-4 h-4" />{tab}</span>
              ) : tab}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 font-medium">数据最后更新: 10分钟前</div>
      </div>

      {activeTab === '二次分析工具箱' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 工具箱 1: 火山图交互调优 */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" /> 火山图交互中心</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 上调: {filteredVolcano.filter(d => d.status === 'Up').length}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 下调: {filteredVolcano.filter(d => d.status === 'Down').length}</span>
              </div>
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="log2FC" name="Log2FC" axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="pVal" name="-Log10(P)" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-xl border border-slate-100 border-l-4 border-l-blue-500">
                          <p className="font-bold text-slate-900">{data.gene}</p>
                          <p className="text-xs text-slate-500">Log2FC: {data.log2FC.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">-Log10P: {data.pVal.toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Scatter name="Genes" data={filteredVolcano}>
                    {filteredVolcano.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 工具控制面板 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4" /> 阈值精调</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Log2 Fold Change (|x| ≥)</label>
                    <span className="text-sm font-mono font-bold text-blue-600">{volcanoThreshold.fc}</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.1" 
                    value={volcanoThreshold.fc}
                    onChange={(e) => setVolcanoThreshold({...volcanoThreshold, fc: parseFloat(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">显著性 -Log10(P) (y ≥)</label>
                    <span className="text-sm font-mono font-bold text-blue-600">{volcanoThreshold.p}</span>
                  </div>
                  <input 
                    type="range" min="0" max="6" step="0.1" 
                    value={volcanoThreshold.p}
                    onChange={(e) => setVolcanoThreshold({...volcanoThreshold, p: parseFloat(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">注: 1.3 对应 P=0.05, 2.0 对应 P=0.01</p>
                </div>
                <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" /> 重置为建议值
                </button>
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-bold mb-1">AI 深度洞察</h4>
                <p className="text-xs text-blue-100 opacity-90 leading-relaxed">
                  当前筛选条件下，检测到有 12 个基因与“细胞周期阻滞”通路高度相关，建议在报告中增加对应的富集描述。
                </p>
                <button className="mt-4 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all">
                  查看详细 AI 建议
                </button>
              </div>
              <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
            </div>
          </div>

          {/* 工具箱 2: 富集气泡图筛选 */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" /> 通路筛选器</h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">最小基因数:</label>
                  <input 
                    type="number" 
                    className="w-12 text-xs border border-slate-200 rounded p-0.5 text-center" 
                    value={enrichmentMinCount}
                    onChange={(e) => setEnrichmentMinCount(parseInt(e.target.value) || 0)}
                  />
                </div>
             </div>
             <div className="flex-1 p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={filteredEnrichment} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                      {filteredEnrichment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fillOpacity={1 - entry.pVal * 10} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* 工具箱 3: 样本 PCA 浏览器 */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> 样本 PCA 聚类</h3>
                <button className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">标准化方式: TMM</button>
             </div>
             <div className="flex-1 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="x" name="PC1 (64.2%)" axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="y" name="PC2 (18.1%)" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Samples" data={pcaData}>
                      {pcaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.group === 'Control' ? '#64748b' : '#3b82f6'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs mt-2">
                   <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Control</span>
                   <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Treatment</span>
                </div>
             </div>
          </div>

        </div>
      ) : (
        /* 原有的标准结果展示 (简略版) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
            <p className="text-slate-400">请选择“二次分析工具箱”查看交互式图表</p>
          </div>
        </div>
      )}
    </div>
  );
};
