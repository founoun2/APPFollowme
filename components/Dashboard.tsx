
import React from 'react';
import { Campaign } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ArrowUpRight, Users, Zap, Coins } from 'lucide-react';
import { useLanguage } from '../services/i18n';

interface DashboardProps {
  userCampaigns: Campaign[];
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userCampaigns, onNavigate }) => {
  const { t } = useLanguage();
  
  const data = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 32 },
    { name: 'Sat', value: 28 },
    { name: 'Sun', value: 40 },
  ];

  const activeCampaigns = userCampaigns.filter(c => c.status === 'Active').length;
  const totalInteractions = userCampaigns.reduce((acc, c) => acc + c.completedCount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('dash.overview')}</h1>
        <p className="text-slate-500">{t('dash.welcome')}</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 ltr:mr-1 rtl:ml-1" /> +12%
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{activeCampaigns}</div>
          <div className="text-sm text-slate-500 font-medium">{t('dash.active_campaigns')}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
             <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 ltr:mr-1 rtl:ml-1" /> +5.4%
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalInteractions}</div>
          <div className="text-sm text-slate-500 font-medium">{t('dash.total_interactions')}</div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-5 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('earn')}>
           <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold">{t('dash.earn_card_title')}</div>
          <div className="text-sm text-indigo-100 font-medium">{t('dash.earn_card_desc')}</div>
        </div>
      </div>

      {/* Chart Section - Updated Style */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
                <h2 className="text-lg font-bold text-slate-900">{t('dash.chart_title')}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('dash.chart_subtitle')}</p>
            </div>
        </div>
        
        <div className="h-72 w-full ltr:ml-[-20px] rtl:mr-[-20px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', padding: '8px 12px' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">{t('dash.recent_activity')}</h2>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">{t('dash.view_all')}</button>
        </div>
        <div className="divide-y divide-slate-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New follower on Instagram</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
              <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100 flex items-center gap-1">
                -2 <Coins className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
