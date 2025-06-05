import React from 'react';
import { BarChart3, Users, Video, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onUploadClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onUploadClick }) => {
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <button 
            className={currentPage === 'prospects' ? 'active' : ''}
            onClick={() => onPageChange('prospects')}
          >
            <Users size={16} />
            {t('sidebar.prospects')}
          </button>
        </li>
        <li>
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => onPageChange('dashboard')}
          >
            <BarChart3 size={16} />
            {t('sidebar.dashboard')}
          </button>
        </li>
        <li>
          <button onClick={() => onPageChange('video')}>
            <Video size={16} />
            {t('sidebar.video')}
          </button>
        </li>
        <li>
          <button onClick={onUploadClick}>
            <Upload size={16} />
            {t('sidebar.upload')}
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar; 