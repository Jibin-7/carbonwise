import React, { useEffect, useState } from 'react';
import API_BASE_URL from './config';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler 
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';

// Register complete enterprise chart configurations
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler
);

function Dashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [committedTasks, setCommittedTasks] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('carbonData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        
        // If an active session token exists, fetch historical data trends
        if (parsed?.user_token) {
          fetchHistoricalTrends(parsed.user_token);
        }
      } catch (e) {
        console.error("Error reading localized session data instance:", e);
      }
    }
  }, []);

  const fetchHistoricalTrends = async (token) => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history/${token}`);
      if (response.data?.status === 'success') {
        setHistory(response.data.history);
      }
    } catch (err) {
      console.error("Unable to populate trend vector matrix:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleExportData = () => {
    if (!data?.user_token) return;
    // Direct endpoint trigger to pipe down generated CSV stream natively
    window.location.href = `http://localhost:5000/api/export/${data.user_token}`;
  };

  const toggleTaskCommitment = (index) => {
    setCommittedTasks(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-900">Analytical Context Missing</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">No localized environmental record data is present in the current session pipeline.</p>
        <button 
          onClick={() => window.location.href = '/calculator'}
          className="px-5 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-slate-800 transition-colors"
        >
          Initialize Analysis
        </button>
      </div>
    );
  }

  // Chart Configuration 1: Categorical Distribution
  const breakdownChartData = {
    labels: ['Ground Mobility', 'Aviation', 'Infrastructure Energy', 'Dietary Intake'],
    datasets: [{
      data: [
        data.metrics.breakdown.transport,
        data.metrics.breakdown.aviation,
        data.metrics.breakdown.electricity,
        data.metrics.breakdown.diet
      ],
      backgroundColor: ['#64748B', '#0EA5E9', '#F59E0B', '#10B981'],
      hoverOffset: 4,
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  // Chart Configuration 2: Historical Timeline Velocity
  const historyChartData = {
    labels: history.map((_, index) => `Instance ${index + 1}`),
    datasets: [{
      fill: true,
      label: 'Gross Emissions (kg CO₂)',
      data: history.map(item => item.total),
      borderColor: '#059669',
      backgroundColor: 'rgba(16, 185, 129, 0.04)',
      tension: 0.2,
      pointBackgroundColor: '#059669',
      pointRadius: 4
    }]
  };

  const optimizationRate = data.intelligence.action_items.length > 0
    ? Math.round((committedTasks.length / data.intelligence.action_items.length) * 100)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      
      {/* Upper Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytical Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time telemetry and resource optimization framework.</p>
        </div>
        <button 
          onClick={handleExportData}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg shadow-sm transition-all"
        >
          Export Compliance Ledger (CSV)
        </button>
      </div>

      {/* Topline Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Periodic Footprint</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{data.metrics.total_co2_kg}</span>
            <span className="text-xs font-bold text-slate-500 uppercase ml-2">kg CO₂</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Arbitrated Offset Index</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{data.intelligence.equivalencies.trees_to_plant}</span>
            <span className="text-xs font-bold text-slate-500 uppercase ml-2">Arboreal Units / Year</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Energy Equivalency</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{data.intelligence.equivalencies.smartphone_charges.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500 uppercase ml-2">Mobile Device Cycles</span>
          </div>
        </div>
      </div>

      {/* Data Visualization Complex */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Breakdown Module */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Categorical Distribution Matrix</h3>
          <div className="w-full max-w-[210px] mx-auto relative my-4">
            <Doughnut data={breakdownChartData} options={{ plugins: { legend: { display: false } } }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-4px]">
              <span className="text-xl font-black text-slate-800 tracking-tighter">{Math.round(data.metrics.total_co2_kg)}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Net kg</span>
            </div>
          </div>
          {/* Custom High-Contrast Legend */}
          <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
            <div className="flex justify-between items-center"><div className="flex items-center"><span className="w-2h h-2 w-2 rounded-full bg-slate-500 mr-2"></span>Mobility</div><span>{data.metrics.breakdown.transport} kg</span></div>
            <div className="flex justify-between items-center"><div className="flex items-center"><span className="w-2h h-2 w-2 rounded-full bg-sky-500 mr-2"></span>Aviation</div><span>{data.metrics.breakdown.aviation} kg</span></div>
            <div className="flex justify-between items-center"><div className="flex items-center"><span className="w-2h h-2 w-2 rounded-full bg-amber-500 mr-2"></span>Energy</div><span>{data.metrics.breakdown.electricity} kg</span></div>
            <div className="flex justify-between items-center"><div className="flex items-center"><span className="w-2h h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>Dietary</div><span>{data.metrics.breakdown.diet} kg</span></div>
          </div>
        </section>

        {/* Timeline Vector Module */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Historical Emission Velocity</h3>
          <div className="w-full h-full min-h-[220px] flex items-center justify-center">
            {isLoadingHistory ? (
              <span className="text-xs font-semibold text-slate-400">Loading historical array data...</span>
            ) : history.length > 1 ? (
              <Line data={historyChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            ) : (
              <span className="text-xs font-medium text-slate-400 text-center px-4">Historical trends require multiple calculations. Run the Analysis Tool across varying intervals to populate velocity curves.</span>
            )}
          </div>
        </section>
      </div>

      {/* Mitigation Strategy Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Intelligence Insights */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Diagnostic Synthesis</h3>
          <div className="space-y-4">
            {data.intelligence.text_insights.map((insight, index) => (
              <div key={index} className="p-4 bg-slate-50 border-l-2 border-slate-400 rounded-r-lg">
                <p className="text-xs font-medium text-slate-700 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Strategy Optimization Checklist */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Algorithmic Mitigation Protocol</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-full">
                Optimization Rate: {optimizationRate}%
              </span>
            </div>
            
            {/* Semantic Progress Tracking */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)" 
                style={{ width: `${optimizationRate}%` }}
                role="progressbar"
                aria-valuenow={optimizationRate}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            <ul className="space-y-3" role="list">
              {data.intelligence.action_items.map((action, index) => {
                const isCommitted = committedTasks.includes(index);
                return (
                  <li 
                    key={index}
                    onClick={() => toggleTaskCommitment(index)}
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all duration-150 select-none
                      ${isCommitted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150
                        ${isCommitted ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400 bg-white'}
                      `}>
                        {isCommitted && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-xs font-medium transition-colors ${isCommitted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {action.task}
                      </span>
                    </div>
                    {action.co2_saved > 0 && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors
                        ${isCommitted ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-600 border-slate-200'}
                      `}>
                        Target mitigation: {action.co2_saved} kg
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

    </div>
  );
}

export default Dashboard;