
import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  FileCode, 
  FileDigit, 
  FileText, 
  Download, 
  Trash2, 
  MoreVertical, 
  HardDrive, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { Sample } from '../types';

const mockSamples: Sample[] = [
  { id: 'S1', name: 'Patient_01_R1.fastq.gz', size: '4.2 GB', type: 'FASTQ', uploadDate: '2024-05-10' },
  { id: 'S2', name: 'Patient_01_R2.fastq.gz', size: '4.3 GB', type: 'FASTQ', uploadDate: '2024-05-10' },
  { id: 'S3', name: 'Tumor_Sample_Aligned.bam', size: '12.8 GB', type: 'BAM', uploadDate: '2024-05-12' },
  { id: 'S4', name: 'Somatic_Variants.vcf', size: '150 MB', type: 'VCF', uploadDate: '2024-05-14' },
  { id: 'S5', name: 'Ref_Genome_Chr1.fasta', size: '240 MB', type: 'FASTQ', uploadDate: '2024-05-01' },
];

export const DataCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSamples = mockSamples.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">数据管理中心</h1>
          <p className="text-slate-500 mt-1">集中管理所有已上传的原始测序数据及中间文件。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-slate-600 shadow-sm">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span className="font-bold">1.2 TB</span> / 5.0 TB
          </div>
        </div>
      </div>

      {/* 存储容量卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">测序数据 (FASTQ)</p>
            <p className="text-3xl font-bold">856 GB</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" /> 本周新增 12%
            </div>
          </div>
          <FileDigit className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-5 group-hover:scale-110 transition-transform" />
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">分析结果 (BAM/VCF)</p>
          <p className="text-3xl font-bold text-slate-900">342 GB</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-blue-600 h-1.5 rounded-full w-[40%]"></div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">临时文件</p>
          <p className="text-3xl font-bold text-slate-900">45 GB</p>
          <button className="mt-4 text-xs font-bold text-rose-600 hover:underline">一键清理临时数据</button>
        </div>
      </div>

      {/* 文件列表区域 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            文件库
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索文件名..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">文件名</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">类型</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">大小</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">上传时间</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        sample.type === 'FASTQ' ? 'bg-rose-50 text-rose-600' :
                        sample.type === 'BAM' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {sample.type === 'FASTQ' ? <FileCode className="w-4 h-4" /> : 
                         sample.type === 'BAM' ? <FileDigit className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{sample.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{sample.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                      {sample.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {sample.size}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {sample.uploadDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="下载">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSamples.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Database className="w-12 h-12 opacity-10 mb-4" />
                      <p className="text-sm">未找到匹配的文件</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
