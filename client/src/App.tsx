import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CampaignTable from './components/CampaignTable';
import UploadModal from './components/UploadModal';
import { LanguageProvider } from './contexts/LanguageContext';
import axios from 'axios';

export interface Campaign {
  id: number;
  date: string;
  product: string;
  provenance: string;
  nom: string;
  email: string;
  telephone: string;
  cp: string;
  statut: string;
  notes: string;
}

function App() {
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [filters, setFilters] = useState({
    produit: 'all',
    provenance: 'all',
    statut: 'all',
    dateRange: 'all',
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    aTraiter: 0,
    rendezVousPris: 0,
    conversionRate: 0
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('prospects');

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/campaigns', {
        params: filters
      });
      setFilteredCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const updateCampaign = async (id: number, updates: Partial<Campaign>) => {
    try {
      await axios.put(`http://localhost:5000/api/campaigns/${id}`, updates);
      
      setFilteredCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        )
      );

      fetchStats();
    } catch (error) {
      console.error('Error updating campaign:', error);
      
      setFilteredCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        )
      );
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, [fetchCampaigns, fetchStats]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleUploadSuccess = () => {
    fetchCampaigns();
    fetchStats();
    setShowUploadModal(false);
  };

  return (
    <LanguageProvider>
      <div className="app">
        <Header />
        <div className="app-content">
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={setCurrentPage}
            onUploadClick={() => setShowUploadModal(true)}
          />
          <main className="main-content">
            {currentPage === 'dashboard' && (
              <Dashboard stats={stats} />
            )}
            {currentPage === 'prospects' && (
              <CampaignTable 
                campaigns={filteredCampaigns}
                onFilterChange={handleFilterChange}
                onUpdateCampaign={updateCampaign}
                filters={filters}
              />
            )}
          </main>
        </div>
        {showUploadModal && (
          <UploadModal 
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
    </div>
    </LanguageProvider>
  );
}

export default App;
