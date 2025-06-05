import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Header
    'header.title': 'ALMANA - CENTRE ESTHÉTIQUE - ÉTOILE',
    'header.contact': 'Contacter-nous',
    'header.account': 'Mon compte',
    'header.impression': 'Impression',
    'header.disconnect': 'Déconnexion',
    'header.dashboard': 'Tableau de bord',
    'header.prospects': 'Prospects',
    'header.video': 'Vidéo',
    'header.upload': 'Importer Excel',

    // Sidebar
    'sidebar.dashboard': 'Tableau de bord',
    'sidebar.prospects': 'Prospects',
    'sidebar.video': 'Vidéo',
    'sidebar.upload': 'Importer Excel',

    // Dashboard Stats
    'stats.totalProspects': 'Total Prospects',
    'stats.newProspects': 'Nouveaux',
    'stats.toProcess': 'À traiter',
    'stats.appointments': 'Rendez-vous',
    'stats.conversionRate': 'Taux de conversion',

    // Table Headers
    'table.date': 'Date',
    'table.product': 'Produit',
    'table.source': 'Provenance',
    'table.name': 'Nom',
    'table.email': 'Adresse e-mail',
    'table.phone': 'Téléphone',
    'table.postalCode': 'CP',
    'table.status': 'Statut',
    'table.notes': 'Notes',

    // Filters
    'filter.product': 'Produit',
    'filter.source': 'Provenance',
    'filter.status': 'Statut',
    'filter.all': 'Tous',
    'filter.allSources': 'Toutes',
    'filter.allStatuses': 'Tous',
    'filter.search': 'Rechercher',
    'filter.searchPlaceholder': 'Rechercher par nom, email, téléphone...',
    'filter.dateRange': 'Période',
    'filter.sortBy': 'Trier par',
    'filter.sortOrder': 'Ordre',
    'filters.advanced': 'Filtres avancés',

    // Date Ranges
    'dateRange.all': 'Toutes les dates',
    'dateRange.today': 'Aujourd\'hui',
    'dateRange.yesterday': 'Hier',
    'dateRange.last7days': '7 derniers jours',
    'dateRange.last30days': '30 derniers jours',
    'dateRange.thisMonth': 'Ce mois',
    'dateRange.lastMonth': 'Mois dernier',

    // Sorting
    'sort.date': 'Date',
    'sort.name': 'Nom',
    'sort.status': 'Statut',
    'sort.product': 'Produit',
    'sort.ascending': 'Croissant',
    'sort.descending': 'Décroissant',

    // Products
    'product.pressotherapy': 'Pressothérapie',
    'product.cryolipolysis': 'Cryolipolyse',
    'product.electrostimulation': 'Électrostimulation',

    // Sources
    'source.display': 'Display',
    'source.socialMedia': 'Réseaux Sociaux',
    'source.googleSearch': 'Recherche Google',
    'source.emailing': 'Emailing',

    // Status Options
    'status.nouveau': 'Nouveau',
    'status.aTraiter': 'À traiter',
    'status.enAttente': 'En attente',
    'status.appelEnAbsence': 'Appel en absence',
    'status.rendu': 'Rendu',
    'status.vendu': 'Vendu',
    'status.alaConccurrence': 'À la concurrence',
    'status.injoignable': 'Injoignable',
    'status.pasInteresse': 'Pas intéressé',
    'status.tropCher': 'Trop cher',
    'status.aRelancer': 'À relancer',
    'status.rendezVousPris': 'Rendez-vous pris',

    // Dropdown
    'dropdown.changeStatus': 'Changer le statut',
    'dropdown.communicationActions': 'Actions de communication',
    'dropdown.smsEnvoye': 'SMS envoyé',
    'dropdown.emailEnvoye': 'Email envoyé',
    'dropdown.appelEffectue': 'Appel effectué',
    'dropdown.history': 'Historique des actions',
    'dropdown.noHistory': 'Aucun historique disponible',

    // Notes
    'notes.clickToAdd': 'Cliquez pour ajouter une note...',
    'notes.clickToEdit': 'Cliquez pour éditer',
    'notes.placeholder': 'Ajoutez vos notes ici...',
    'notes.saveShortcut': 'Sauvegarder (Ctrl+Enter)',
    'notes.cancelShortcut': 'Annuler (Escape)',

    // Upload Modal
    'upload.title': 'Importer un fichier Excel',
    'upload.dragDrop': 'Glissez-déposez votre fichier Excel ici ou',
    'upload.button': 'Sélectionner un fichier',
    'upload.uploading': 'Téléchargement...',
    'upload.success': 'Fichier téléchargé avec succès!',
    'upload.error': 'Erreur lors du téléchargement du fichier.',
    'upload.close': 'Fermer',
    'upload.fileSelected': 'Fichier sélectionné:',
    'upload.formatExpected': 'Format attendu:',
    'upload.formatDescription': 'Le fichier Excel doit contenir les colonnes suivantes:',
    'upload.cancel': 'Annuler',

    // Phone Actions
    'phone.call': 'Appeler ce numéro',
    'phone.whatsapp': 'Envoyer un message WhatsApp',
    'phone.whatsappSent': 'Message WhatsApp envoyé',

    // WhatsApp Messages
    'whatsapp.greeting': 'Bonjour',
    'whatsapp.general': 'Je vous contacte concernant votre intérêt pour nos services esthétiques. Nous proposons des soins personnalisés dans un cadre moderne et relaxant.',
    'whatsapp.pressotherapy': 'Concernant la pressothérapie : ce soin révolutionnaire stimule la circulation sanguine et lymphatique pour un effet drainant immédiat. Idéal pour réduire la cellulite et affiner la silhouette.',
    'whatsapp.cryolipolysis': 'Concernant la cryolipolyse : cette technique non-invasive élimine définitivement les cellules graisseuses par le froid. Résultats visibles dès la première séance pour sculpter votre silhouette.',
    'whatsapp.electrostimulation': 'Concernant l\'électrostimulation : cette méthode tonifie et raffermit les muscles en profondeur. Parfait pour retrouver une silhouette tonique et sculptée.',
    'whatsapp.availability': 'Je suis disponible pour répondre à toutes vos questions et vous proposer un rendez-vous de consultation gratuite.',
    'whatsapp.signature': 'Cordialement,',

    // Footer
    'footer.yourRate': 'Votre %RDV:',
    'footer.average': 'Moyenne:',

    // Pagination
    'pagination.showing': 'Affichage de',
    'pagination.to': 'à',
    'pagination.of': 'sur',
    'pagination.results': 'résultats',
    'pagination.previous': 'Précédent',
    'pagination.next': 'Suivant',
    'pagination.page': 'Page',

    // Export
    'export.button': 'Exporter Excel',
    'export.exporting': 'Export en cours...',
    'export.success': 'Fichier exporté avec succès!',
    'export.error': 'Erreur lors de l\'export',
    'export.filename': 'prospects_export',

    // Language
    'language.french': 'Français',
    'language.english': 'English'
  },
  en: {
    // Header
    'header.title': 'ALMANA - AESTHETIC CENTER - ÉTOILE',
    'header.contact': 'Contact Us',
    'header.account': 'My Account',
    'header.impression': 'Print',
    'header.disconnect': 'Logout',
    'header.dashboard': 'Dashboard',
    'header.prospects': 'Prospects',
    'header.video': 'Video',
    'header.upload': 'Upload Excel',

    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.prospects': 'Prospects',
    'sidebar.video': 'Video',
    'sidebar.upload': 'Upload Excel',

    // Dashboard Stats
    'stats.totalProspects': 'Total Prospects',
    'stats.newProspects': 'New',
    'stats.toProcess': 'To Process',
    'stats.appointments': 'Appointments',
    'stats.conversionRate': 'Conversion Rate',

    // Table Headers
    'table.date': 'Date',
    'table.product': 'Product',
    'table.source': 'Source',
    'table.name': 'Name',
    'table.email': 'Email Address',
    'table.phone': 'Phone',
    'table.postalCode': 'Postal Code',
    'table.status': 'Status',
    'table.notes': 'Notes',

    // Filters
    'filter.product': 'Product',
    'filter.source': 'Source',
    'filter.status': 'Status',
    'filter.all': 'All',
    'filter.allSources': 'All',
    'filter.allStatuses': 'All',
    'filter.search': 'Search',
    'filter.searchPlaceholder': 'Search by name, email, phone...',
    'filter.dateRange': 'Date Range',
    'filter.sortBy': 'Sort By',
    'filter.sortOrder': 'Order',
    'filters.advanced': 'Advanced Filters',

    // Date Ranges
    'dateRange.all': 'All Dates',
    'dateRange.today': 'Today',
    'dateRange.yesterday': 'Yesterday',
    'dateRange.last7days': 'Last 7 Days',
    'dateRange.last30days': 'Last 30 Days',
    'dateRange.thisMonth': 'This Month',
    'dateRange.lastMonth': 'Last Month',

    // Sorting
    'sort.date': 'Date',
    'sort.name': 'Name',
    'sort.status': 'Status',
    'sort.product': 'Product',
    'sort.ascending': 'Ascending',
    'sort.descending': 'Descending',

    // Products
    'product.pressotherapy': 'Pressotherapy',
    'product.cryolipolysis': 'Cryolipolysis',
    'product.electrostimulation': 'Electrostimulation',

    // Sources
    'source.display': 'Display',
    'source.socialMedia': 'Social Media',
    'source.googleSearch': 'Google Search',
    'source.emailing': 'Emailing',

    // Status Options
    'status.nouveau': 'New',
    'status.aTraiter': 'To Process',
    'status.enAttente': 'Waiting',
    'status.appelEnAbsence': 'Missed Call',
    'status.rendu': 'Delivered',
    'status.vendu': 'Sold',
    'status.alaConccurrence': 'To Competition',
    'status.injoignable': 'Unreachable',
    'status.pasInteresse': 'Not Interested',
    'status.tropCher': 'Too Expensive',
    'status.aRelancer': 'To Follow Up',
    'status.rendezVousPris': 'Appointment Booked',

    // Dropdown
    'dropdown.changeStatus': 'Change Status',
    'dropdown.communicationActions': 'Communication Actions',
    'dropdown.smsEnvoye': 'SMS Sent',
    'dropdown.emailEnvoye': 'Email Sent',
    'dropdown.appelEffectue': 'Call Made',
    'dropdown.history': 'Action History',
    'dropdown.noHistory': 'No history available',

    // Notes
    'notes.clickToAdd': 'Click to add a note...',
    'notes.clickToEdit': 'Click to edit',
    'notes.placeholder': 'Add your notes here...',
    'notes.saveShortcut': 'Save (Ctrl+Enter)',
    'notes.cancelShortcut': 'Cancel (Escape)',

    // Upload Modal
    'upload.title': 'Upload Excel File',
    'upload.dragDrop': 'Drag and drop your Excel file here or',
    'upload.button': 'Select File',
    'upload.uploading': 'Uploading...',
    'upload.success': 'File uploaded successfully!',
    'upload.error': 'Error uploading file.',
    'upload.close': 'Close',
    'upload.fileSelected': 'File selected:',
    'upload.formatExpected': 'Expected format:',
    'upload.formatDescription': 'The Excel file must contain the following columns:',
    'upload.cancel': 'Cancel',

    // Phone Actions
    'phone.call': 'Call this number',
    'phone.whatsapp': 'Send WhatsApp message',
    'phone.whatsappSent': 'WhatsApp message sent',

    // WhatsApp Messages
    'whatsapp.greeting': 'Hello',
    'whatsapp.general': 'I\'m contacting you regarding your interest in our aesthetic services. We offer personalized treatments in a modern and relaxing environment.',
    'whatsapp.pressotherapy': 'Regarding pressotherapy: this revolutionary treatment stimulates blood and lymphatic circulation for immediate draining effect. Ideal for reducing cellulite and refining your silhouette.',
    'whatsapp.cryolipolysis': 'Regarding cryolipolysis: this non-invasive technique permanently eliminates fat cells through cold. Visible results from the first session to sculpt your figure.',
    'whatsapp.electrostimulation': 'Regarding electrostimulation: this method tones and firms muscles deeply. Perfect for regaining a toned and sculpted silhouette.',
    'whatsapp.availability': 'I\'m available to answer all your questions and offer you a free consultation appointment.',
    'whatsapp.signature': 'Best regards,',

    // Footer
    'footer.yourRate': 'Your Appointment Rate:',
    'footer.average': 'Average:',

    // Pagination
    'pagination.showing': 'Showing',
    'pagination.to': 'to',
    'pagination.of': 'of',
    'pagination.results': 'results',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.page': 'Page',

    // Export
    'export.button': 'Export Excel',
    'export.exporting': 'Exporting...',
    'export.success': 'File exported successfully!',
    'export.error': 'Error during export',
    'export.filename': 'prospects_export',

    // Language
    'language.french': 'Français',
    'language.english': 'English'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 