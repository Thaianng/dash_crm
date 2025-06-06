import React from 'react';
import { BarChart3, Users, Video, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onUploadClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onPageChange, 
  onUploadClick, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const { t } = useLanguage();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle">
        <button 
          className="toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <ul className="sidebar-menu">
        <li>
          <button 
            className={currentPage === 'prospects' ? 'active' : ''}
            onClick={() => onPageChange('prospects')}
            title={isCollapsed ? t('sidebar.prospects') : ''}
          >
            <Users size={16} />
            {!isCollapsed && <span>{t('sidebar.prospects')}</span>}
          </button>
        </li>
        <li>
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => onPageChange('dashboard')}
            title={isCollapsed ? t('sidebar.dashboard') : ''}
          >
            <BarChart3 size={16} />
            {!isCollapsed && <span>{t('sidebar.dashboard')}</span>}
          </button>
        </li>
        <li>
          <button 
            onClick={() => onPageChange('video')}
            title={isCollapsed ? t('sidebar.video') : ''}
          >
            <Video size={16} />
            {!isCollapsed && <span>{t('sidebar.video')}</span>}
          </button>
        </li>
        <li>
          <button 
            onClick={onUploadClick}
            title={isCollapsed ? t('sidebar.upload') : ''}
          >
            <Upload size={16} />
            {!isCollapsed && <span>{t('sidebar.upload')}</span>}
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar; 