
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MOCK_DATASETS, MOCK_ALGORITHMS } from './constants';
import { Dataset, Algorithm, Run, JobStatus, RunMetrics } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
// Added missing icons: Github, RefreshCw, BarChart3, Settings
import { Plus, Play, ExternalLink, ChevronRight, CheckCircle2, AlertCircle, Info, Github, RefreshCw, BarChart3, Settings } from 'lucide-react';
import { NetworkGraph } from './components/NetworkGraph';
import { getAlgorithmComparisonSummary } from './services/geminiService';

const Dashboard = () => {
  const stats = [
    { label: 'Total Datasets', value: MOCK_DATASETS.length, change: '+2 from BEELINE sync' },
    { label: 'Active Algorithms', value: MOCK_ALGORITHMS.length, change: 'Mirroring GitHub' },
    { label: 'Completed Runs', value: 12, change: '142 total edges predicted' },
    { label: 'Avg AUROC', value: '0.78', change: '+0.02 improvement' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500 font-medium mb-1">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{s.value}</h2>
              <span className="text-xs text-green-600 font-medium">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Benchmark Performance Overview</h3>
            <button className="text-sm text-indigo-600 font-semibold hover:underline">View All Metrics</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Run 1', auroc: 0.65, auprc: 0.45 },
                { name: 'Run 2', auroc: 0.72, auprc: 0.52 },
                { name: 'Run 3', auroc: 0.78, auprc: 0.61 },
                { name: 'Run 4', auroc: 0.82, auprc: 0.65 },
                { name: 'Run 5', auroc: 0.81, auprc: 0.63 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="auroc" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} />
                <Area type="monotone" dataKey="auprc" stroke="#f43f5e" fill="#ffe4e6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'sync', msg: 'BEELINE GitHub Sync successful', time: '2m ago' },
              { type: 'run', msg: 'GRNBoost2 finished on DREAM5', time: '1h ago' },
              { type: 'upload', msg: 'Custom dataset "Lung_Cancer" uploaded', time: '3h ago' },
              { type: 'err', msg: 'Failed job: SCODE on Human_Heart', time: '5h ago' },
            ].map((act, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${act.type === 'sync' ? 'bg-green-500' : act.type === 'run' ? 'bg-indigo-500' : act.type === 'err' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                <div>
                  <p className="text-sm text-slate-700 font-medium">{act.msg}</p>
                  <p className="text-xs text-slate-400">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DatasetsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Datasets Explorer</h2>
        <p className="text-slate-500">Manage curated BEELINE resources and user uploads.</p>
      </div>
      <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-all">
        <Plus size={18} /> Upload Dataset
      </button>
    </div>
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Dataset Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Organism</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Genes</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Source</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_DATASETS.map(ds => (
            <tr key={ds.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-800">{ds.name}</td>
              <td className="px-6 py-4 text-slate-600">{ds.organism}</td>
              <td className="px-6 py-4 text-slate-600 font-mono">{ds.geneCount}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${ds.type === 'InSilico' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {ds.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1 text-sm ${ds.source === 'beeline' ? 'text-indigo-600' : 'text-slate-600'}`}>
                   {ds.source === 'beeline' && <Github size={12} />} {ds.source}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <ExternalLink size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RunsView = () => {
  const [runs, setRuns] = useState<Run[]>([
    { id: 'run-001', datasetId: 'ds-001', algorithmId: 'alg-001', status: JobStatus.COMPLETED, metrics: { auroc: 0.82, auprc: 0.65, precision: 0.45, recall: 0.32, f1: 0.37, runtimeSeconds: 145 }, createdAt: '2024-03-01 10:00', completedAt: '2024-03-01 10:05' },
    { id: 'run-002', datasetId: 'ds-002', algorithmId: 'alg-002', status: JobStatus.RUNNING, createdAt: '2024-03-02 11:30' },
  ]);

  const startNewRun = () => {
    alert("Algorithm runner service initiated for PIDC on Mouse_mESC dataset.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Execution Runs</h2>
        <button 
          onClick={startNewRun}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-lg transition-all transform hover:-translate-y-1"
        >
          <Play size={18} /> New Benchmark Run
        </button>
      </div>

      <div className="space-y-4">
        {runs.map(run => (
          <div key={run.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${run.status === JobStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {run.status === JobStatus.COMPLETED ? <CheckCircle2 size={20} /> : <RefreshCw size={20} className="animate-spin" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Run #{run.id.slice(-3)}</h4>
                  <p className="text-xs text-slate-500">{run.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                {run.metrics && (
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-bold uppercase">AUROC</p>
                      <p className="text-sm font-bold text-slate-700">{run.metrics.auroc}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-bold uppercase">AUPRC</p>
                      <p className="text-sm font-bold text-slate-700">{run.metrics.auprc}</p>
                    </div>
                  </div>
                )}
                <ChevronRight className="text-slate-300" />
              </div>
            </div>
            {run.metrics && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                     <BarChart3 size={14} className="text-indigo-500" /> Metrics Distribution
                   </h5>
                   <div className="space-y-3">
                      {['Precision', 'Recall', 'F1-Score'].map((m, i) => (
                        <div key={m}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-500">{m}</span>
                            <span className="text-slate-800">{i === 0 ? run.metrics?.precision : i === 1 ? run.metrics?.recall : run.metrics?.f1}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full" 
                              style={{ width: `${((i === 0 ? run.metrics?.precision : i === 1 ? run.metrics?.recall : run.metrics?.f1) || 0) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
                <NetworkGraph 
                  nodes={[
                    { id: '1', label: 'TF1', type: 'TF' },
                    { id: '2', label: 'TF2', type: 'TF' },
                    { id: '3', label: 'G1', type: 'Gene' },
                    { id: '4', label: 'G2', type: 'Gene' },
                    { id: '5', label: 'G3', type: 'Gene' },
                  ]}
                  edges={[
                    { source: '1', target: '3', weight: 0.9 },
                    { source: '1', target: '4', weight: 0.7 },
                    { source: '2', target: '4', weight: 0.8 },
                    { source: '2', target: '5', weight: 0.5 },
                  ]}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CompareView = () => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const mockCompareData = [
    { name: 'GRNBoost2', auroc: 0.82, auprc: 0.65 },
    { name: 'PIDC', auroc: 0.78, auprc: 0.61 },
    { name: 'SCODE', auroc: 0.65, auprc: 0.42 },
    { name: 'PPCOR', auroc: 0.71, auprc: 0.55 },
  ];

  const requestAiAnalysis = async () => {
    setLoadingAi(true);
    const summary = await getAlgorithmComparisonSummary(mockCompareData);
    setAiAnalysis(summary || "Analysis unavailable.");
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Comparison</h2>
          <p className="text-slate-500">Side-by-side benchmarking analysis.</p>
        </div>
        <button 
          onClick={requestAiAnalysis}
          disabled={loadingAi}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all font-semibold"
        >
          {loadingAi ? <RefreshCw className="animate-spin" size={16} /> : <Info size={16} />}
          AI Insights
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-6">Comparative ROC/PR Performance</h3>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCompareData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                   <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="auroc" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} />
                   <Line type="monotone" dataKey="auprc" stroke="#f43f5e" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 text-indigo-100 p-6 rounded-xl shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500 rounded-lg text-white">
                  <Info size={20} />
                </div>
                <h3 className="font-bold text-lg">AI Evaluation</h3>
             </div>
             <div className="prose prose-invert text-sm max-w-none opacity-90 leading-relaxed">
               {aiAnalysis ? (
                 <div className="whitespace-pre-wrap">{aiAnalysis}</div>
               ) : (
                 <p>Click "AI Insights" to generate an automatic interpretation of these benchmark results using Gemini 3. It will analyze trade-offs between precision and recall for your specific dataset.</p>
               )}
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">Metric Leaderboard</h3>
             <div className="space-y-4">
               {mockCompareData.sort((a,b) => b.auroc - a.auroc).map((item, idx) => (
                 <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                   <div className="flex items-center gap-3">
                     <span className="w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-600 rounded-full text-xs font-bold">{idx + 1}</span>
                     <span className="font-bold text-slate-700">{item.name}</span>
                   </div>
                   <div className="flex gap-4">
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 font-bold">AUROC</span>
                        <span className="text-sm font-bold text-indigo-600">{item.auroc}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 font-bold">AUPRC</span>
                        <span className="text-sm font-bold text-rose-600">{item.auprc}</span>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlgorithmsView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Algorithms Registry</h2>
        <p className="text-slate-500">Integrated GRN inference methods from BEELINE.</p>
      </div>
      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100 text-sm font-semibold">
        <CheckCircle2 size={16} /> GitHub Synced
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {MOCK_ALGORITHMS.map(alg => (
        <div key={alg.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-800">{alg.name}</h3>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">v{alg.version}</span>
          </div>
          <p className="text-sm text-slate-600 mb-6 h-12 line-clamp-2">{alg.description}</p>
          <div className="space-y-4">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Parameters</div>
             <div className="flex flex-wrap gap-2">
                {alg.parameters.map(p => (
                  <span key={p} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 text-xs font-medium">{p}</span>
                ))}
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
             <button className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
               <Settings size={14} /> Config
             </button>
             <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
               Run <ChevronRight size={14} />
             </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/datasets" element={<DatasetsView />} />
          <Route path="/algorithms" element={<AlgorithmsView />} />
          <Route path="/runs" element={<RunsView />} />
          <Route path="/compare" element={<CompareView />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
