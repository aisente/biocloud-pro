
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, Dna, Settings2, Play, Info } from 'lucide-react';
import { Species } from '../types';

interface WizardProps {
  onCancel: () => void;
  onStart: () => void;
}

export const PipelineWizard: React.FC<WizardProps> = ({ onCancel, onStart }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'RNA-seq',
    species: 'Homo sapiens' as Species,
    refGenome: 'GRCh38',
    samples: [] as File[],
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">项目标识</label>
              <input 
                type="text" 
                placeholder="例如：乳腺癌细胞系 RNA-seq 分析"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">分析流程类型</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['RNA-seq', '全外显子 (WES)', '单细胞 (scRNA)', 'ChIP-seq'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, type})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.type === type ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <p className="font-bold text-slate-900">{type}</p>
                    <p className="text-xs text-slate-500 mt-1">标准化科研分析流程</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/50">
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">上传 FASTQ 数据</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
                拖拽您的原始测序文件到此处。支持 .fastq, .fq.gz, .bam。
              </p>
              <input type="file" multiple className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="mt-6 inline-block bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                选择文件
              </label>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4" />
                支持最高 500GB 的多部分断点续传
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">物种选择</label>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.species}
                    onChange={e => setFormData({...formData, species: e.target.value as Species})}
                  >
                    <option value="Homo sapiens">智人 (Homo sapiens)</option>
                    <option value="Mus musculus">小鼠 (Mus musculus)</option>
                    <option value="Rattus norvegicus">大鼠 (Rattus norvegicus)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">参考基因组版本</label>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.refGenome}
                    onChange={e => setFormData({...formData, refGenome: e.target.value})}
                  >
                    <option>GRCh38 (最新)</option>
                    <option>h19 / GRCh37</option>
                    <option>T2T-CHM13</option>
                  </select>
                </div>
             </div>
             <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
               <Settings2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-sm text-amber-800">
                 <strong>高级提示：</strong> 我们已根据您的物种选择预配置了比对 (STAR) 和定量 (RSEM) 参数。这些参数是学术发表的推荐设置。
               </p>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">准备就绪</h3>
                <p className="text-slate-400">启动云端计算集群前，请检查您的配置。</p>
                
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">流程类型</p>
                    <p className="text-lg font-semibold">{formData.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">目标物种</p>
                    <p className="text-lg font-semibold">{formData.species}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">计算资源</p>
                    <p className="text-lg font-semibold">16 CPU / 64GB RAM</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">预估耗时</p>
                    <p className="text-lg font-semibold">约 4.5 小时</p>
                  </div>
                </div>
              </div>
              <Dna className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-800 opacity-20" />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Wizard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">启动分析</h1>
          <p className="text-slate-500">配置您的自动化生物信息学分析流。</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-medium">取消</button>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8 min-h-[450px] flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {step}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === 1 && "项目基本信息"}
              {step === 2 && "数据管理"}
              {step === 3 && "参数配置"}
              {step === 4 && "最终确认"}
            </h2>
          </div>

          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
              step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一步
          </button>
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
              下一步
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={onStart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 animate-pulse"
            >
              <Play className="w-5 h-5 fill-current" />
              立即启动
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
