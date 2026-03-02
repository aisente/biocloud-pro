
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Settings2, 
  RefreshCw, 
  Activity, 
  Layers, 
  ScatterChart as ScatterIcon, 
  BarChart4, 
  FileSpreadsheet, 
  Info,
  Download,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, Cell
} from 'recharts';

interface ToolboxProps {
  initialTool?: string | null;
  onBack: () => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ initialTool, onBack }) => {
  const [activeTool, setActiveTool] = useState(initialTool || 'volcano');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // 火山图控制状态
  const [vParams, setVParams] = useState({ fc: 2.0, p: 1.3 });

  // 模拟数据生成
  const chartData = useMemo(() => {
    if (activeTool === 'volcano') {
      return Array.from({ length: 300 }, (_, i) => ({
        gene: `Gene_${i}`,
        log2FC: (Math.random() - 0.5) * 8,
        pVal: Math.random() * 5,
      })).map(d => ({
        ...d,
        color: d.log2FC >= vParams.fc && d.pVal >= vParams.p ? '#ef4444' : 
               (d.log2FC <= -vParams.fc && d.pVal >= vParams.p ? '#3b82f6' : '#cbd5e1')
      }));
    }
    return [];
  }, [activeTool, vParams, showChart]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);
      // 模拟文件解析
      setTimeout(() => {
        setIsProcessing(false);
        setShowChart(true);
      }, 1500);
    }
  };

  const tools = [
    { id: 'volcano', name: '交互式火山图', icon: Activity, color: 'rose' },
    { id: 'enrichment', name: '富集气泡图', icon: Layers, color: 'blue' },
    { id: 'pca', name: '样本 PCA 聚类', icon: ScatterIcon, color: 'emerald' },
    { id: 'heatmap', name: '表达量热图', icon: BarChart4, color: 'amber' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">生信分析小工具箱</h1>
          <p className="text-slate-500 text-sm">上传您的矩阵文件，即刻生成交互式学术图表。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧工具选择 */}
        <div className="lg:col-span-1 space-y-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id); setShowChart(false); setUploadedFile(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTool === tool.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <tool.icon className="w-5 h-5" />
              <span className="font-bold text-sm">{tool.name}</span>
            </button>
          ))}
        </div>

        {/* 右侧主工作区 */}
        <div className="lg:col-span-3 space-y-6">
          {!showChart ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-[500px] flex flex-col items-center justify-center transition-all">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                {isProcessing ? (
                  <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isProcessing ? '正在解析您的矩阵数据...' : `上传您的 ${tools.find(t => t.id === activeTool)?.name} 数据`}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">
                支持上传 .csv, .tsv 或 .xlsx 格式。文件需包含 Gene ID、FoldChange 及 P-value 等核心字段。
              </p>
              
              {!isProcessing && (
                <div className="flex flex-col items-center gap-4">
                  <input type="file" id="tool-upload" className="hidden" onChange={handleFileUpload} />
                  <label 
                    htmlFor="tool-upload" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer"
                  >
                    选择文件并绘图
                  </label>
                  <button className="text-xs text-blue-600 font-bold hover:underline">下载示例模板矩阵</button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
              {/* 控制台 */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-sm">参数调节</h4>
                    <Settings2 className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  {activeTool === 'volcano' && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Log2FC 阈值</label>
                          <span className="text-xs font-mono font-bold text-blue-600">{vParams.fc}</span>
                        </div>
                        <input 
                          type="range" min="0" max="5" step="0.1" 
                          value={vParams.fc}
                          onChange={e => setVParams({...vParams, fc: parseFloat(e.target.value)})}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none accent-blue-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">-Log10(P) 阈值</label>
                          <span className="text-xs font-mono font-bold text-blue-600">{vParams.p}</span>
                        </div>
                        <input 
                          type="range" min="0" max="5" step="0.1" 
                          value={vParams.p}
                          onChange={e => setVParams({...vParams, p: parseFloat(e.target.value)})}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none accent-blue-600"
                        />
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> 导出出版级图表
                  </button>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">数据解析成功</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">检测到 {chartData.length} 个特征点。已自动适配坐标轴量程。</p>
                  </div>
                </div>
              </div>

              {/* 图表展示 */}
              <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">可视化画布</h3>
                  <div className="flex gap-1">
                    {['SVG', 'PDF', 'PNG'].map(fmt => (
                      <button key={fmt} className="px-2 py-1 text-[10px] bg-slate-50 text-slate-500 rounded border border-slate-200 hover:bg-slate-100 font-bold uppercase">{fmt}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-6">
                  {activeTool === 'volcano' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" dataKey="log2FC" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis type="number" dataKey="pVal" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload?.[0]) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-white p-2 rounded shadow-lg border border-slate-100 text-[10px]">
                                <p className="font-bold">{d.gene}</p>
                                <p>Log2FC: {d.log2FC.toFixed(2)}</p>
                                <p>P-val: {d.pVal.toFixed(2)}</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Scatter data={chartData}>
                          {chartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  )}
                  {activeTool !== 'volcano' && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                       <BarChart4 className="w-12 h-12 opacity-20" />
                       <p className="text-sm">该小工具的绘图逻辑正在适配上传的矩阵格式...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
