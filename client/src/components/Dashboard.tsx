import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  stats: {
    total: number;
    nouveau: number;
    aTraiter: number;
    rendezVousPris: number;
    conversionRate: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const { t } = useLanguage();

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '2rem', color: '#1e293b' }}>{t('sidebar.dashboard')}</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>{t('stats.totalProspects')}</p>
        </div>
        <div className="stat-card">
          <h3>{stats.nouveau}</h3>
          <p>{t('stats.newProspects')}</p>
        </div>
        <div className="stat-card">
          <h3>{stats.aTraiter}</h3>
          <p>{t('stats.toProcess')}</p>
        </div>
        <div className="stat-card">
          <h3>{stats.rendezVousPris}</h3>
          <p>{t('stats.appointments')}</p>
        </div>
        <div className="stat-card">
          <h3>{stats.conversionRate}%</h3>
          <p>{t('stats.conversionRate')}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 