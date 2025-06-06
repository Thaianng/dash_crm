import React, { useState, useEffect, useRef } from 'react';
import { Campaign } from '../App';
import { ChevronDown, Phone, Mail, MessageSquare, Edit3, Check, X, Search, Calendar, ArrowUpDown, Filter, ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface CampaignTableProps {
  campaigns: Campaign[];
  onFilterChange: (filters: any) => void;
  onUpdateCampaign: (id: number, updates: Partial<Campaign>) => void;
  onDeleteCampaign: (id: number) => void;
  filters: {
    produit: string;
    provenance: string;
    statut: string;
    dateRange: string;
    searchQuery: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

interface ActionDropdownProps {
  campaign: Campaign;
  onUpdate: (updates: Partial<Campaign>) => void;
}

interface EditableNotesProps {
  campaign: Campaign;
  onUpdate: (updates: Partial<Campaign>) => void;
}

const EditableNotes: React.FC<EditableNotesProps> = ({ campaign, onUpdate }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(campaign.notes);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate({ notes: editValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(campaign.notes);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const displayText = campaign.notes || t('notes.clickToAdd');

  if (isEditing) {
    return (
      <div className="notes-edit-container">
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="notes-textarea"
          rows={3}
          placeholder={t('notes.placeholder')}
        />
        <div className="notes-edit-actions">
          <button onClick={handleSave} className="notes-save-btn" title={t('notes.saveShortcut')}>
            <Check size={14} />
          </button>
          <button onClick={handleCancel} className="notes-cancel-btn" title={t('notes.cancelShortcut')}>
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="notes-display-box"
      onClick={() => setIsEditing(true)}
      title={t('notes.clickToEdit')}
    >
      <div className="notes-content">
        {displayText}
      </div>
      <Edit3 size={12} className="notes-edit-icon" />
    </div>
  );
};

const ActionDropdown: React.FC<ActionDropdownProps> = ({ campaign, onUpdate }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownId = `dropdown-${campaign.id}`;

  // Helper function to get translated status
  const getTranslatedStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'nouveau': 'status.nouveau',
      'à traiter': 'status.aTraiter',
      'en attente': 'status.enAttente',
      'appel en absence': 'status.appelEnAbsence',
      'rendu': 'status.rendu',
      'vendu': 'status.vendu',
      'à la concurrence': 'status.alaConccurrence',
      'injoignable': 'status.injoignable',
      'pas intéressé': 'status.pasInteresse',
      'trop cher': 'status.tropCher',
      'à relancer': 'status.aRelancer',
      'rendez-vous pris': 'status.rendezVousPris'
    };
    
    const key = statusMap[status.toLowerCase()];
    return key ? t(key) : status;
  };

  const actionOptions = [
    { id: 'nouveau', labelKey: 'status.nouveau', color: '#1d4ed8', bgColor: '#dbeafe' },
    { id: 'a-traiter', labelKey: 'status.aTraiter', color: '#d97706', bgColor: '#fef3c7' },
    { id: 'en-attente', labelKey: 'status.enAttente', color: '#64748b', bgColor: '#f1f5f9' },
    { id: 'appel-en-absence', labelKey: 'status.appelEnAbsence', color: '#ea580c', bgColor: '#fed7aa' },
    { id: 'rendu', labelKey: 'status.rendu', color: '#059669', bgColor: '#d1fae5' },
    { id: 'vendu', labelKey: 'status.vendu', color: '#047857', bgColor: '#a7f3d0' },
    { id: 'a-la-concurrence', labelKey: 'status.alaConccurrence', color: '#dc2626', bgColor: '#fee2e2' },
    { id: 'injoignable', labelKey: 'status.injoignable', color: '#64748b', bgColor: '#f1f5f9' },
    { id: 'pas-interesse', labelKey: 'status.pasInteresse', color: '#6b7280', bgColor: '#f3f4f6' },
    { id: 'trop-cher', labelKey: 'status.tropCher', color: '#92400e', bgColor: '#fef3c7' },
    { id: 'a-relancer', labelKey: 'status.aRelancer', color: '#3730a3', bgColor: '#e0e7ff' },
    { id: 'rendez-vous-pris', labelKey: 'status.rendezVousPris', color: '#059669', bgColor: '#d1fae5' }
  ];

  const communicationActions = [
    { id: 'sms', labelKey: 'dropdown.smsEnvoye', icon: MessageSquare },
    { id: 'email', labelKey: 'dropdown.emailEnvoye', icon: Mail },
    { id: 'appel', labelKey: 'dropdown.appelEffectue', icon: Phone }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside this specific dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target) &&
          buttonRef.current && !buttonRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Close other dropdowns when this one opens
      const otherDropdowns = document.querySelectorAll('.action-dropdown.open');
      otherDropdowns.forEach(dropdown => {
        if (dropdown.id !== dropdownId) {
          const button = dropdown.querySelector('.status-dropdown-btn') as HTMLElement;
          if (button) {
            button.click();
          }
        }
      });

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, dropdownId]);

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 400;
    const dropdownWidth = 600;

    // For absolute positioning, we use relative coordinates
    let top = buttonRect.height + 8; // Position below the button
    let left = 0; // Align with button left edge

    // Check if dropdown would go below viewport
    if (buttonRect.bottom + dropdownHeight > viewportHeight) {
      top = -dropdownHeight - 8; // Position above the button
    }

    // Check if dropdown would go beyond right edge
    if (buttonRect.left + dropdownWidth > viewportWidth) {
      left = buttonRect.width - dropdownWidth; // Align with button right edge
    }

    // Ensure dropdown doesn't go beyond left edge
    if (buttonRect.left + left < 16) {
      left = -buttonRect.left + 16;
    }

    // For mobile or small screens, adjust positioning
    if (dropdownWidth > viewportWidth - 32) {
      left = -buttonRect.left + 16;
    }

    setDropdownPosition({ top, left });
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        calculateDropdownPosition();
      }, 10);
    }
    setIsOpen(!isOpen);
  };

  // Recalculate position on resize only (not scroll since we use absolute positioning)
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      calculateDropdownPosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleStatusChange = (statusKey: string) => {
    // Map translation keys back to French status names for database storage
    const keyToFrenchStatus: { [key: string]: string } = {
      'status.nouveau': 'nouveau',
      'status.aTraiter': 'à traiter',
      'status.enAttente': 'en attente',
      'status.appelEnAbsence': 'appel en absence',
      'status.rendu': 'rendu',
      'status.vendu': 'vendu',
      'status.alaConccurrence': 'à la concurrence',
      'status.injoignable': 'injoignable',
      'status.pasInteresse': 'pas intéressé',
      'status.tropCher': 'trop cher',
      'status.aRelancer': 'à relancer',
      'status.rendezVousPris': 'rendez-vous pris'
    };
    
    const frenchStatus = keyToFrenchStatus[statusKey] || statusKey;
    const translatedStatus = t(statusKey);
    
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR');
    
    onUpdate({
      statut: frenchStatus,
      notes: `${campaign.notes}\n${timestamp}: Statut changé vers "${translatedStatus}"`
    });
    setIsOpen(false);
  };

  const handleCommunicationAction = (actionKey: string) => {
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR');
    const actionText = t(actionKey);
    
    onUpdate({
      notes: `${campaign.notes}\n${timestamp}: ${actionText}`
    });
    setIsOpen(false);
  };

  const getStatusStyle = (status: string) => {
    // Map French status names to option IDs
    const statusToId: { [key: string]: string } = {
      'nouveau': 'nouveau',
      'à traiter': 'a-traiter',
      'en attente': 'en-attente',
      'appel en absence': 'appel-en-absence',
      'rendu': 'rendu',
      'vendu': 'vendu',
      'à la concurrence': 'a-la-concurrence',
      'injoignable': 'injoignable',
      'pas intéressé': 'pas-interesse',
      'trop cher': 'trop-cher',
      'à relancer': 'a-relancer',
      'rendez-vous pris': 'rendez-vous-pris'
    };
    
    const optionId = statusToId[status.toLowerCase()] || status.toLowerCase().replace(/\s+/g, '-');
    const option = actionOptions.find(opt => opt.id === optionId);
    return {
      color: option?.color || '#64748b',
      backgroundColor: option?.bgColor || '#f1f5f9'
    };
  };

  return (
    <div id={dropdownId} className={`action-dropdown ${isOpen ? 'open' : ''}`}>
      <button 
        ref={buttonRef}
        className="status-dropdown-btn status-badge"
        onClick={handleToggleDropdown}
        style={getStatusStyle(campaign.statut)}
      >
        {getTranslatedStatus(campaign.statut)}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="dropdown-menu dropdown-menu-large"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="dropdown-content-wrapper">
            <div className="dropdown-left-panel">
              <div className="dropdown-section">
                <div className="dropdown-header">{t('dropdown.changeStatus')}</div>
                {actionOptions.map(option => (
                  <button
                    key={option.id}
                    className="dropdown-item"
                    onClick={() => handleStatusChange(option.labelKey)}
                  >
                    <span 
                      className="status-badge" 
                      style={{ 
                        color: option.color, 
                        backgroundColor: option.bgColor,
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        marginRight: '0.5rem'
                      }}
                    >
                      {t(option.labelKey)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-section">
                <div className="dropdown-header">{t('dropdown.communicationActions')}</div>
                {communicationActions.map(action => (
                  <button
                    key={action.id}
                    className="dropdown-item communication-item"
                    onClick={() => handleCommunicationAction(action.labelKey)}
                  >
                    <action.icon size={14} />
                    {t(action.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="dropdown-right-panel">
              <div className="dropdown-header">{t('dropdown.history')}</div>
              <div className="history-list-inline">
                {campaign.notes.split('\n').filter(note => note.trim()).map((note, index) => (
                  <div key={index} className="history-item-inline">
                    {note}
                  </div>
                ))}
                {(!campaign.notes || campaign.notes.trim() === '') && (
                  <div className="no-history">{t('dropdown.noHistory')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, onFilterChange, onUpdateCampaign, onDeleteCampaign, filters }) => {
  const { t } = useLanguage();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  const handleFilterChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleWhatsAppClick = async (campaign: Campaign) => {
    setSendingWhatsApp(campaign.id);
    
    try {
      // Format phone number for WhatsApp (remove spaces and special characters)
      let phoneNumber = campaign.telephone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // Ensure French phone number format for WhatsApp
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+33' + phoneNumber.slice(1);
      } else if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+33' + phoneNumber;
      }
      
      // Get product-specific message
      const getProductMessage = (product: string) => {
        switch (product.toLowerCase()) {
          case 'pressothérapie':
            return t('whatsapp.pressotherapy');
          case 'cryolipolyse':
            return t('whatsapp.cryolipolysis');
          case 'electrostimulation':
            return t('whatsapp.electrostimulation');
          default:
            return t('whatsapp.general');
        }
      };

      // Create personalized WhatsApp message
      const productMessage = getProductMessage(campaign.product);
      const message = encodeURIComponent(
        `${t('whatsapp.greeting')} ${campaign.nom},\n\n` +
        `${productMessage}\n\n` +
        `${t('whatsapp.availability')}\n\n` +
        `${t('whatsapp.signature')}\n` +
        `ALMANA - Centre Esthétique Étoile ✨`
      );

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Add small delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log the action
      const now = new Date();
      const timestamp = now.toLocaleString('fr-FR');
      onUpdateCampaign(campaign.id, {
        notes: `${campaign.notes}\n${timestamp}: ${t('phone.whatsappSent')} - ${campaign.product}`
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    } finally {
      setSendingWhatsApp(null);
    }
  };

  const handleSortChange = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange({
      ...filters,
      sortBy,
      sortOrder: newSortOrder
    });
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Calculate pagination
  const totalItems = campaigns.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.produit, filters.provenance, filters.statut, filters.dateRange, filters.searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when changing pages
    const tableElement = document.querySelector('.campaign-table-container');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm(t('delete.confirm'))) {
      return;
    }

    try {
      await onDeleteCampaign(id);
    } catch (error) {
      alert(t('delete.error'));
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    
    try {
      // Prepare data for export (use all campaigns, not just current page)
      const exportData = campaigns.map(campaign => ({
        [t('table.date')]: campaign.date,
        [t('table.product')]: campaign.product,
        [t('table.source')]: campaign.provenance,
        [t('table.name')]: campaign.nom,
        [t('table.email')]: campaign.email,
        [t('table.phone')]: campaign.telephone,
        [t('table.postalCode')]: campaign.cp,
        [t('table.status')]: campaign.statut,
        [t('table.notes')]: campaign.notes.replace(/\n/g, ' | ') // Replace line breaks with separator
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 12 }, // Date
        { wch: 20 }, // Product
        { wch: 18 }, // Source
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 8 },  // Postal Code
        { wch: 18 }, // Status
        { wch: 40 }  // Notes
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, t('sidebar.prospects'));

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create blob and save file
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `${t('export.filename')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      saveAs(blob, fileName);
      
      // Show success message (you could add a toast notification here)
      console.log(t('export.success'));
      
    } catch (error) {
      console.error('Export error:', error);
      // Show error message (you could add a toast notification here)
      alert(t('export.error'));
    } finally {
      setIsExporting(false);
    }
  };



  return (
    <div className="campaign-table-container">
      <div className="table-header">
        <div className="table-title-section">
          <h2 className="table-title">{t('sidebar.prospects')}</h2>
          <div className="table-actions">
            <button 
              className="export-btn"
              onClick={handleExportExcel}
              disabled={isExporting || campaigns.length === 0}
            >
              <Download size={16} />
              {isExporting ? t('export.exporting') : t('export.button')}
            </button>
            <button 
              className={`filter-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter size={16} />
              {t('filters.advanced')}
            </button>
          </div>
        </div>

        <div className="table-filters">
          <div className="filter-row">
            <div className="filter-group search-group">
              <label>{t('filter.search')}</label>
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('filter.searchPlaceholder')}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>{t('filter.dateRange')}</label>
              <select 
                value={filters.dateRange} 
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="date-filter"
              >
                <option value="all">{t('dateRange.all')}</option>
                <option value="today">{t('dateRange.today')}</option>
                <option value="yesterday">{t('dateRange.yesterday')}</option>
                <option value="last7days">{t('dateRange.last7days')}</option>
                <option value="last30days">{t('dateRange.last30days')}</option>
                <option value="thisMonth">{t('dateRange.thisMonth')}</option>
                <option value="lastMonth">{t('dateRange.lastMonth')}</option>
              </select>
            </div>

            <div className="filter-group">
              <label>{t('filter.product')}</label>
              <select 
                value={filters.produit} 
                onChange={(e) => handleFilterChange('produit', e.target.value)}
              >
                <option value="all">{t('filter.all')}</option>
                <option value="pressothérapie">{t('product.pressotherapy')}</option>
                <option value="cryolipolyse">{t('product.cryolipolysis')}</option>
                <option value="electrostimulation">{t('product.electrostimulation')}</option>
              </select>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="filter-row advanced-filters">
              <div className="filter-group">
                <label>{t('filter.source')}</label>
                <select 
                  value={filters.provenance} 
                  onChange={(e) => handleFilterChange('provenance', e.target.value)}
                >
                  <option value="all">{t('filter.allSources')}</option>
                  <option value="display">{t('source.display')}</option>
                  <option value="réseaux sociaux">{t('source.socialMedia')}</option>
                  <option value="recherche google">{t('source.googleSearch')}</option>
                  <option value="emailing">{t('source.emailing')}</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>{t('filter.status')}</label>
                <select 
                  value={filters.statut} 
                  onChange={(e) => handleFilterChange('statut', e.target.value)}
                >
                  <option value="all">{t('filter.allStatuses')}</option>
                  <option value="nouveau">{t('status.nouveau')}</option>
                  <option value="à traiter">{t('status.aTraiter')}</option>
                  <option value="en attente">{t('status.enAttente')}</option>
                  <option value="rendez-vous pris">{t('status.rendezVousPris')}</option>
                  <option value="vendu">{t('status.vendu')}</option>
                  <option value="appel en absence">{t('status.appelEnAbsence')}</option>
                </select>
              </div>

              <div className="filter-group">
                <label>{t('filter.sortBy')}</label>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="date">{t('sort.date')}</option>
                  <option value="nom">{t('sort.name')}</option>
                  <option value="statut">{t('sort.status')}</option>
                  <option value="product">{t('sort.product')}</option>
                </select>
              </div>

              <div className="filter-group">
                <label>{t('filter.sortOrder')}</label>
                <button 
                  className="sort-order-btn"
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown size={14} />
                  {filters.sortOrder === 'asc' ? t('sort.ascending') : t('sort.descending')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="campaign-table">
          <thead>
            <tr>
              <th 
                className={`sortable ${filters.sortBy === 'date' ? 'sorted' : ''}`}
                onClick={() => handleSortChange('date')}
              >
                <div className="th-content">
                  <Calendar size={14} />
                  {t('table.date')}
                  {filters.sortBy === 'date' && (
                    <ArrowUpDown 
                      size={12} 
                      className={`sort-indicator ${filters.sortOrder}`}
                    />
                  )}
                </div>
              </th>
              <th 
                className={`sortable ${filters.sortBy === 'product' ? 'sorted' : ''}`}
                onClick={() => handleSortChange('product')}
              >
                <div className="th-content">
                  {t('table.product')}
                  {filters.sortBy === 'product' && (
                    <ArrowUpDown 
                      size={12} 
                      className={`sort-indicator ${filters.sortOrder}`}
                    />
                  )}
                </div>
              </th>
              <th>{t('table.source')}</th>
              <th 
                className={`sortable ${filters.sortBy === 'nom' ? 'sorted' : ''}`}
                onClick={() => handleSortChange('nom')}
              >
                <div className="th-content">
                  {t('table.name')}
                  {filters.sortBy === 'nom' && (
                    <ArrowUpDown 
                      size={12} 
                      className={`sort-indicator ${filters.sortOrder}`}
                    />
                  )}
                </div>
              </th>
              <th>{t('table.email')}</th>
              <th>{t('table.phone')}</th>
              <th>{t('table.postalCode')}</th>
              <th 
                className={`sortable ${filters.sortBy === 'statut' ? 'sorted' : ''}`}
                onClick={() => handleSortChange('statut')}
              >
                <div className="th-content">
                  {t('table.status')}
                  {filters.sortBy === 'statut' && (
                    <ArrowUpDown 
                      size={12} 
                      className={`sort-indicator ${filters.sortOrder}`}
                    />
                  )}
                </div>
              </th>
              <th>{t('table.notes')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {currentCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.date}</td>
                <td>{campaign.product}</td>
                <td>
                  <span style={{ 
                    color: campaign.provenance === 'Display' ? '#1d4ed8' : 
                           campaign.provenance === 'Réseaux Sociaux' ? '#059669' : 
                           campaign.provenance === 'Recherche Google' ? '#d97706' : 
                           campaign.provenance === 'Emailing' ? '#7c3aed' : '#64748b',
                    fontWeight: '500'
                  }}>
                    {campaign.provenance}
                  </span>
                </td>
                <td>{campaign.nom}</td>
                <td title={campaign.email} className="email-cell">{campaign.email}</td>
                <td>
                  <div className="phone-actions">
                    <a href={`tel:${campaign.telephone}`} className="phone-link" title={t('phone.call')}>
                      <Phone size={14} />
                      {campaign.telephone}
                    </a>
                    <button 
                      className={`whatsapp-btn ${sendingWhatsApp === campaign.id ? 'sending' : ''}`}
                      onClick={() => handleWhatsAppClick(campaign)}
                      title={t('phone.whatsapp')}
                      disabled={sendingWhatsApp === campaign.id}
                    >
                      {sendingWhatsApp === campaign.id ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <MessageSquare size={14} />
                      )}
                    </button>
                  </div>
                </td>
                <td>{campaign.cp}</td>
                <td>
                  <ActionDropdown 
                    campaign={campaign}
                    onUpdate={(updates) => onUpdateCampaign(campaign.id, updates)}
                  />
                </td>
                <td className="notes-cell">
                  <EditableNotes 
                    campaign={campaign}
                    onUpdate={(updates) => onUpdateCampaign(campaign.id, updates)}
                  />
                </td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClick(campaign.id)}
                    title={t('table.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            {t('pagination.showing')} <strong>{startIndex + 1}</strong> {t('pagination.to')} <strong>{Math.min(endIndex, totalItems)}</strong> {t('pagination.of')} <strong>{totalItems}</strong> {t('pagination.results')}
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              {t('pagination.previous')}
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const showPage = page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!showPage) {
                  // Show ellipsis for gaps
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                }
                
                return (
                  <button
                    key={page}
                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t('pagination.next')}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div style={{ 
        padding: '1.25rem 2rem', 
        borderTop: '1px solid #e2e8f0', 
        fontSize: '0.9rem', 
        color: '#64748b',
        backgroundColor: '#f8fafc',
        fontWeight: '500'
      }}>
{t('footer.yourRate')} <strong style={{ color: '#1e293b' }}>22%</strong> | {t('footer.average')} <strong style={{ color: '#1e293b' }}>40%</strong>
      </div>
    </div>
  );
};

export default CampaignTable; 