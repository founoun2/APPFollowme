
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Earn from './components/Earn';
import Campaigns from './components/Campaigns';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import { Campaign, Task, Transaction, User, Platform, TaskType, CampaignStatus, Notification } from './types';
import { I18nProvider, useLanguage } from './services/i18n';

// --- MOCK DATA INIT ---
const INITIAL_USER: User = {
  id: 'u1',
  username: 'social_guru',
  email: 'guru@example.com',
  credits: 125,
  reputation: 95,
  avatarUrl: 'https://picsum.photos/200',
  streak: 3,
  country: 'Worldwide',
  language: 'EN'
};

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    platform: Platform.Instagram,
    type: TaskType.Like,
    reward: 1,
    description: 'Amazing sunset view!',
    targetUrl: 'https://instagram.com',
    thumbnailUrl: 'https://picsum.photos/300/300?random=1',
    country: 'USA'
  },
  {
    id: 't2',
    platform: Platform.Twitter,
    type: TaskType.Follow,
    reward: 3,
    description: 'TechNewsDaily',
    targetUrl: 'https://twitter.com',
    thumbnailUrl: 'https://picsum.photos/300/300?random=2',
    country: 'Worldwide'
  },
  {
    id: 't3',
    platform: Platform.TikTok,
    type: TaskType.View,
    reward: 1,
    description: 'Funny cat reaction',
    targetUrl: 'https://tiktok.com',
    thumbnailUrl: 'https://picsum.photos/300/300?random=3',
    country: 'Brazil'
  },
  {
    id: 't4',
    platform: Platform.YouTube,
    type: TaskType.Like,
    reward: 2,
    description: 'New Vlog 2024',
    targetUrl: 'https://youtube.com',
    thumbnailUrl: 'https://picsum.photos/300/300?random=4',
    country: 'India'
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    platform: Platform.Instagram,
    type: TaskType.Follow,
    targetUrl: 'https://instagram.com/me',
    description: 'Grow my brand',
    totalRequested: 50,
    completedCount: 12,
    costPerAction: 3,
    status: CampaignStatus.Active,
    targeting: { country: 'Worldwide' }
  }
];

const INITIAL_TXS: Transaction[] = [
  { id: 'tx1', type: 'purchase', amount: 100, date: new Date().toISOString(), description: 'Purchased Coins' },
  { id: 'tx2', type: 'earn', amount: 5, date: new Date().toISOString(), description: 'Completed tasks' },
];

const AppContent: React.FC = () => {
  const { lang, setLang, dir, t } = useLanguage();
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // App State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TXS);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Sync language with User object if it exists
    if (user.language && ['EN', 'FR', 'AR'].includes(user.language)) {
        setLang(user.language as any);
    }
  }, []);

  // Helper for notifications
  const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ id: Date.now().toString(), message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard'); 
  };

  const handleOnboardingComplete = (data: { country: string; language: string }) => {
    setUser(prev => ({ ...prev, country: data.country, language: data.language }));
    setLang(data.language as any);
    setHasOnboarded(true);
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setUser(prev => ({ ...prev, credits: prev.credits + task.reward }));
    setTasks(prev => prev.filter(t => t.id !== taskId));

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'earn',
      amount: task.reward,
      date: new Date().toISOString(),
      description: `Task: ${task.platform} ${task.type}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showNotify(`+${task.reward} Coins Earned!`);
  };

  const handleSkipTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showNotify('Task skipped', 'info');
  }

  const handleCreateCampaign = (campaignData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
    } as Campaign;

    const cost = newCampaign.totalRequested * newCampaign.costPerAction;
    
    setUser(prev => ({ ...prev, credits: prev.credits - cost }));
    setCampaigns(prev => [newCampaign, ...prev]);

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'spend',
      amount: cost,
      date: new Date().toISOString(),
      description: `Campaign: ${newCampaign.platform} ${newCampaign.type}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showNotify('Campaign launched successfully!');
  };

  // Campaign Management Handlers
  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
        if (c.id === id) {
            const newStatus = c.status === CampaignStatus.Active ? CampaignStatus.Paused : CampaignStatus.Active;
            return { ...c, status: newStatus };
        }
        return c;
    }));
    showNotify(t('camp.updated'), 'info');
  };

  const handleDeleteCampaign = (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;

    // Refund Logic: Refund credits for uncompleted actions
    const remaining = campaign.totalRequested - campaign.completedCount;
    if (remaining > 0) {
        const refundAmount = remaining * campaign.costPerAction;
        setUser(prev => ({ ...prev, credits: prev.credits + refundAmount }));
        setTransactions(prev => [{
            id: Date.now().toString(),
            type: 'bonus',
            amount: refundAmount,
            date: new Date().toISOString(),
            description: `Refund: ${campaign.platform} Campaign`
        }, ...prev]);
    }

    setCampaigns(prev => prev.filter(c => c.id !== id));
    showNotify(t('camp.refunded'), 'success');
  };

  const handleUpdateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showNotify(t('camp.updated'));
  };

  const handleAddCredits = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
     const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'purchase',
      amount: amount,
      date: new Date().toISOString(),
      description: 'Coin Purchase'
    };
    setTransactions(prev => [newTx, ...prev]);
    showNotify(`+${amount} Coins added to wallet`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userCampaigns={campaigns} onNavigate={setActiveTab} />;
      case 'earn':
        return <Earn tasks={tasks} onCompleteTask={handleCompleteTask} onSkipTask={handleSkipTask} streak={user.streak} />;
      case 'create':
        return <Campaigns 
                    campaigns={campaigns} 
                    onCreateCampaign={handleCreateCampaign} 
                    onDeleteCampaign={handleDeleteCampaign}
                    onUpdateCampaign={handleUpdateCampaign}
                    onToggleStatus={handleToggleCampaignStatus}
                    userCredits={user.credits} 
                />;
      case 'wallet':
        return <Wallet credits={user.credits} transactions={transactions} onAddCredits={handleAddCredits} userSettings={user} />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} />;
      default:
        return <Dashboard userCampaigns={campaigns} onNavigate={setActiveTab} />;
    }
  };

  // Wrapper for RTL direction
  return (
    <div dir={dir} className={lang === 'AR' ? 'font-arabic' : ''}>
        {!isLoggedIn ? (
            <Login onLogin={handleLogin} />
        ) : !hasOnboarded ? (
            <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
            <Layout 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                userCredits={user.credits}
                notification={notification}
                onCloseNotification={() => setNotification(null)}
            >
            {renderContent()}
            </Layout>
        )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
        <AppContent />
    </I18nProvider>
  );
};

export default App;
