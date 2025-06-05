import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="header">
      <h1>{t('header.title')}</h1>
      <div className="header-right">
        <nav className="header-nav">
          <a href="#contact">{t('header.contact')}</a>
          <a href="#account">{t('header.account')}</a>
          <a href="#impression">{t('header.impression')}</a>
          <a href="#disconnect">{t('header.disconnect')}</a>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header; 