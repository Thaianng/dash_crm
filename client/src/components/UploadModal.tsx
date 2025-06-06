import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        },
      });

      setMessage(`Fichier téléchargé avec succès! ${response.data.count} prospects ajoutés.`);
      setTimeout(() => {
        onUploadSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Erreur lors du téléchargement du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          droppedFile.type === 'application/vnd.ms-excel') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('upload.title')}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div 
          className="upload-area" 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
          <p>{t('upload.dragDrop')}</p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{ cursor: 'pointer', color: '#1e293b', textDecoration: 'underline' }}>
            {t('upload.button')}
          </label>
        </div>

        {file && (
          <div style={{ margin: '1rem 0', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>{t('upload.fileSelected')}</strong> {file.name}
          </div>
        )}

        {uploading && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {message && (
          <div className="success-message">{message}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            className="upload-button" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
{uploading ? t('upload.uploading') : t('upload.button')}
          </button>
          <button 
            onClick={onClose}
            style={{ 
              padding: '0.75rem 1.5rem', 
              border: '1px solid #ddd', 
              background: 'white', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
{t('upload.close')}
          </button>
        </div>

        <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
          <div style={{ marginBottom: '0.5rem' }}><strong>{t('upload.formatExpected')}</strong></div>
          <div style={{ color: '#666', marginBottom: '0.75rem' }}>{t('upload.formatDescription')}</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div>
              <strong>Date:</strong> Date, date, Ngày
            </div>
            <div>
              <strong>Product:</strong> Product, Produit, Sản phẩm
            </div>
            <div>
              <strong>Source:</strong> Source, Provenance, Nguồn
            </div>
            <div>
              <strong>Name:</strong> Name, Nom, Tên, Họ tên
            </div>
            <div>
              <strong>Email:</strong> Email, E-mail, Email Address, Địa chỉ email
            </div>
            <div>
              <strong>Phone:</strong> Phone, Telephone, Téléphone, Số điện thoại
            </div>
            <div>
              <strong>Postal Code:</strong> PostalCode, CP, Postal Code, Mã bưu điện
            </div>
            <div>
              <strong>Status:</strong> Status, Statut, Trạng thái
            </div>
            <div>
              <strong>Notes:</strong> Notes, Note, Ghi chú
            </div>
          </div>
          
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px', fontSize: '0.8rem', color: '#1565c0' }}>
            💡 <strong>Tip:</strong> The system automatically recognizes many different column names (Vietnamese, French, English)
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 