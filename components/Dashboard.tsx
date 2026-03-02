
import React from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Database, 
  Wand2, 
  Activity, 
  Layers, 
  BarChart4, 
  ScatterChart as ScatterIcon 
} from 'lucide-react';
import { Project, PipelineStatus } from '../types';

interface DashboardProps {
  onNewProject: () => void;
  onViewResults: (id: string) => void;
  onOpenTool: (toolId: string) => void;
}

const mockProjects: Project[] = [
  { id: '1', name: '肺癌 RNA-seq 研究', description: '非小细胞肺癌 (NSCLC) 样本的差异表达分析。', createdAt: '2024-05-12', status: PipelineStatus.COMPLETED, progress: 100 },
  { id: '2', name: 'WES 队列 A', description: '用于罕见病识别的全外显子组测序。', createdAt: '2024-05-14', status: PipelineStatus.RUNNING, progress: 65 },
  { id: '3', name: '单细胞图谱', description: '肝脏 scRNA-seq 数据整合。', createdAt: '2024-05-15', status: PipelineStatus.PENDING, progress: 0 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNewProject, onViewResults, onOpenTool }) => {
  const tools = [
    { id: 'volcano', name: '交互式火山图', icon: Activity, desc: '快速绘制差异表达基因分布', color: 'rose' },
    { id: 'enrichment', name: '富集气泡图', icon: Layers, desc: 'GO/KEGG 功能分析可视化', color: 'blue' },
    { id: 'pca', name: '样本 PCA 聚类', icon: ScatterIcon, desc: '多样本降维与质控分析', color: 'emerald' },
    { id: 'heatmap', name: '表达量热图', icon: BarChart4, desc: '基因集表达模式聚类展示', color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">科研项目管理</h1>
          <p className="text-slate-500 mt-1">监控和管理您的生物信息学分析流程。</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          启动新分析
        </button>
      </div>

      {/* 小工具箱展示区 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">生信分析小工具箱</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">免安装 / 在线即用</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onOpenTool(tool.id)}
              className="group text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`bg-${tool.color}-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <tool.icon className={`w-6 h-6 text-${tool.color}-600`} />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{tool.name}</h3>
              <p className="text-xs text-slate-500">{tool.desc}</p>
              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '项目总数', value: '24', icon: FileText, color: 'blue' },
          { label: '正在运行', value: '3', icon: Clock, color: 'amber' },
          { label: '已完成', value: '18', icon: CheckCircle2, color: 'emerald' },
          { label: '已用存储', value: '1.2 TB', icon: Database, color: 'slate' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`bg-${stat.color}-50 p-3 rounded-xl`}>
              {React.createElement(stat.icon as any, { className: `w-6 h-6 text-${stat.color}-600` })}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">最近项目</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索项目..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">项目名称</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">进度</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    <p className="text-sm text-slate-500 truncate max-w-xs">{project.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            project.status === PipelineStatus.COMPLETED ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {project.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewResults(project.id)}
                      disabled={project.status !== PipelineStatus.COMPLETED}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        project.status === PipelineStatus.COMPLETED 
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                          : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      查看报告
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: PipelineStatus }> = ({ status }) => {
  const configs = {
    [PipelineStatus.COMPLETED]: { label: '已完成', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
    [PipelineStatus.RUNNING]: { label: '运行中', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock },
    [PipelineStatus.PENDING]: { label: '待处理', color: 'bg-slate-50 text-slate-700 border-slate-100', icon: AlertCircle },
    [PipelineStatus.FAILED]: { label: '已失败', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: AlertCircle },
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${config.color}`}>
      <config.icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
