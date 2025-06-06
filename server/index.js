const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { 
  initDatabase, 
  getAllCampaigns, 
  getCampaignById, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign, 
  getStats,
  insertSampleData 
} = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const sampleCampaignData = [
  {
    id: 1,
    date: '09/03/2024 18:12',
    product: 'Pressothérapie',
    provenance: 'Display',
    nom: 'Marcel Bousquet',
    email: 'marcel.bousquet@example.com',
    telephone: '06 68 71 72 20',
    cp: '49250',
    statut: 'Nouveau',
    notes: 'Appeler de préf. après 17h'
  },
  {
    id: 2,
    date: '09/03/2024 13:35',
    product: 'Cryolipolyse',
    provenance: 'Réseaux Sociaux',
    nom: 'Camille Verdier',
    email: 'camille.verdier@example.com',
    telephone: '01 86 79 86 46',
    cp: '49100',
    statut: 'Nouveau',
    notes: 'Appeler de préf. 14h-17h'
  },
  {
    id: 3,
    date: '08/03/2024 14:29',
    product: 'Cryolipolyse',
    provenance: 'Recherche Google',
    nom: 'Mathilde Lemonnier',
    email: 'mathilde.lemonnier@example.com',
    telephone: '09 48 98 17 95',
    cp: '49480',
    statut: 'À traiter',
    notes: 'Appeler de préf. avant 10h, sms envoyé le 9/03'
  },
  {
    id: 101,
    date: '22/01/2024',
    product: 'Cryolipolyse',
    provenance: 'Recherche Google',
    nom: 'Nicole Richard',
    email: 'nicole.richard@example.com',
    telephone: '05 81 41 37 12',
    cp: '92200',
    statut: 'À traiter',
    notes: 'A déjà testé la concurrence, compare les offres'
  },
  {
    id: 102,
    date: '16/05/2024',
    product: 'Cryolipolyse',
    provenance: 'Réseaux Sociaux',
    nom: 'Jacqueline Richard',
    email: 'jacqueline.richard@example.com',
    telephone: '07 10 68 62 82',
    cp: '92200',
    statut: 'En attente',
    notes: 'Très motivée, prête à commencer immédiatement'
  },
  {
    id: 103,
    date: '28/03/2024',
    product: 'Electrostimulation',
    provenance: 'Recherche Google',
    nom: 'Henri Michel',
    email: 'henri.michel@example.com',
    telephone: '05 09 34 32 20',
    cp: '75002',
    statut: 'En attente',
    notes: 'Questions sur la durée du traitement'
  },
  {
    id: 104,
    date: '26/02/2024',
    product: 'Pressothérapie',
    provenance: 'Réseaux Sociaux',
    nom: 'Nicole Bertrand',
    email: 'nicole.bertrand@example.com',
    telephone: '02 36 62 40 87',
    cp: '95100',
    statut: 'Rendez-vous pris',
    notes: 'Préfère être contactée en fin d\'après-midi'
  },
  {
    id: 105,
    date: '23/09/2024',
    product: 'Pressothérapie',
    provenance: 'Display',
    nom: 'Brigitte Mercier',
    email: 'brigitte.mercier@example.com',
    telephone: '07 28 58 22 20',
    cp: '75006',
    statut: 'Rendez-vous pris',
    notes: 'A déjà testé la concurrence, compare les offres'
  },
  {
    id: 106,
    date: '23/08/2024',
    product: 'Cryolipolyse',
    provenance: 'Display',
    nom: 'Henri Lefebvre',
    email: 'henri.lefebvre@example.com',
    telephone: '07 52 81 07 19',
    cp: '75007',
    statut: 'Appel en absence',
    notes: 'Questions sur la durée du traitement'
  },
  {
    id: 107,
    date: '26/07/2024',
    product: 'Cryolipolyse',
    provenance: 'Display',
    nom: 'Chantal Bonnet',
    email: 'chantal.bonnet@example.com',
    telephone: '05 96 32 92 91',
    cp: '75017',
    statut: 'Rendez-vous pris',
    notes: 'Cliente potentielle de qualité, budget confirmé'
  },
  {
    id: 108,
    date: '24/05/2024',
    product: 'Pressothérapie',
    provenance: 'Réseaux Sociaux',
    nom: 'Daniel Richard',
    email: 'daniel.richard@example.com',
    telephone: '02 34 82 44 11',
    cp: '75015',
    statut: 'Vendu',
    notes: 'Hésitante, nécessite plus d\'explications'
  },
  {
    id: 109,
    date: '10/03/2024',
    product: 'Pressothérapie',
    provenance: 'Display',
    nom: 'Michel Girard',
    email: 'michel.girard@example.com',
    telephone: '09 20 58 66 14',
    cp: '75001',
    statut: 'Nouveau',
    notes: 'Très intéressée par le traitement, souhaite un rendez-vous rapidement'
  },
  {
    id: 110,
    date: '20/05/2024',
    product: 'Electrostimulation',
    provenance: 'Réseaux Sociaux',
    nom: 'Nathalie Michel',
    email: 'nathalie.michel@example.com',
    telephone: '09 79 57 28 63',
    cp: '75016',
    statut: 'Vendu',
    notes: 'Disponible uniquement le weekend'
  },
  {
    id: 111,
    date: '19/06/2024',
    product: 'Electrostimulation',
    provenance: 'Emailing',
    nom: 'Marie Morel',
    email: 'marie.morel@example.com',
    telephone: '04 95 80 47 87',
    cp: '75014',
    statut: 'Vendu',
    notes: 'Intéressée par un package complet'
  },
  {
    id: 112,
    date: '29/04/2024',
    product: 'Pressothérapie',
    provenance: 'Réseaux Sociaux',
    nom: 'Alain Michel',
    email: 'alain.michel@example.com',
    telephone: '05 56 47 86 23',
    cp: '75003',
    statut: 'En attente',
    notes: 'Souhaite venir avec une amie pour le traitement'
  },
  {
    id: 113,
    date: '29/07/2024',
    product: 'Electrostimulation',
    provenance: 'Réseaux Sociaux',
    nom: 'Gérard Morel',
    email: 'gérard.morel@example.com',
    telephone: '09 23 20 53 99',
    cp: '75019',
    statut: 'À traiter',
    notes: 'A déjà testé la concurrence, compare les offres'
  },
  {
    id: 114,
    date: '21/06/2024',
    product: 'Pressothérapie',
    provenance: 'Réseaux Sociaux',
    nom: 'Bernard Moreau',
    email: 'bernard.moreau@example.com',
    telephone: '02 49 95 69 60',
    cp: '94200',
    statut: 'Appel en absence',
    notes: 'A demandé plus d\'informations sur les tarifs'
  },
  {
    id: 115,
    date: '21/03/2024',
    product: 'Cryolipolyse',
    provenance: 'Display',
    nom: 'Sylvie Simon',
    email: 'sylvie.simon@example.com',
    telephone: '05 11 27 26 69',
    cp: '75009',
    statut: 'À traiter',
    notes: 'A demandé plus d\'informations sur les tarifs'
  },
  {
    id: 116,
    date: '17/04/2024',
    product: 'Pressothérapie',
    provenance: 'Recherche Google',
    nom: 'Sophie Simon',
    email: 'sophie.simon@example.com',
    telephone: '08 95 35 09 77',
    cp: '75010',
    statut: 'Nouveau',
    notes: 'Très motivée, prête à commencer immédiatement'
  },
  {
    id: 117,
    date: '15/07/2024',
    product: 'Pressothérapie',
    provenance: 'Emailing',
    nom: 'Catherine Thomas',
    email: 'catherine.thomas@example.com',
    telephone: '07 14 86 72 25',
    cp: '75014',
    statut: 'Rendez-vous pris',
    notes: 'Préfère être contactée en fin d\'après-midi'
  },
  {
    id: 118,
    date: '26/05/2024',
    product: 'Electrostimulation',
    provenance: 'Emailing',
    nom: 'Michel Michel',
    email: 'michel.michel@example.com',
    telephone: '02 26 17 83 50',
    cp: '75002',
    statut: 'Vendu',
    notes: 'Très motivée, prête à commencer immédiatement'
  },
  {
    id: 119,
    date: '22/01/2024',
    product: 'Electrostimulation',
    provenance: 'Emailing',
    nom: 'Henri Fournier',
    email: 'henri.fournier@example.com',
    telephone: '04 26 43 34 70',
    cp: '75001',
    statut: 'En attente',
    notes: 'Intéressée par un package complet'
  },
  {
    id: 120,
    date: '18/09/2024',
    product: 'Cryolipolyse',
    provenance: 'Display',
    nom: 'Françoise André',
    email: 'françoise.andré@example.com',
    telephone: '06 78 91 45 32',
    cp: '75008',
    statut: 'Nouveau',
    notes: 'Souhaite un devis personnalisé'
  }
];

app.get('/api/campaigns', async (req, res) => {
  try {
    const { produit, provenance, statut, dateRange, searchQuery, sortBy, sortOrder } = req.query;
    
    let filteredData = await getAllCampaigns();
  
  // Product filter
  if (produit && produit !== 'all') {
    filteredData = filteredData.filter(item => 
      item.product.toLowerCase().includes(produit.toLowerCase())
    );
  }
  
  // Source filter
  if (provenance && provenance !== 'all') {
    filteredData = filteredData.filter(item => 
      item.provenance.toLowerCase().includes(provenance.toLowerCase())
    );
  }
  
  // Status filter
  if (statut && statut !== 'all') {
    filteredData = filteredData.filter(item => 
      item.statut.toLowerCase().includes(statut.toLowerCase())
    );
  }
  
  // Date range filter
  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filteredData = filteredData.filter(item => {
      const itemDate = parseDate(item.date);
      if (!itemDate) return false;
      
      switch (dateRange) {
        case 'today':
          return itemDate >= today && itemDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        case 'yesterday':
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          return itemDate >= yesterday && itemDate < today;
        case 'last7days':
          const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= last7Days;
        case 'last30days':
          const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= last30Days;
        case 'thisMonth':
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return itemDate >= thisMonthStart;
        case 'lastMonth':
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          return itemDate >= lastMonthStart && itemDate <= lastMonthEnd;
        default:
          return true;
      }
    });
  }
  
  // Search filter
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    filteredData = filteredData.filter(item => 
      item.nom.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.telephone.includes(query) ||
      item.cp.includes(query) ||
      item.notes.toLowerCase().includes(query)
    );
  }
  
  // Sorting
  if (sortBy) {
    filteredData.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = parseDate(a.date);
          bValue = parseDate(b.date);
          break;
        case 'nom':
          aValue = a.nom.toLowerCase();
          bValue = b.nom.toLowerCase();
          break;
        case 'statut':
          aValue = a.statut.toLowerCase();
          bValue = b.statut.toLowerCase();
          break;
        case 'product':
          aValue = a.product.toLowerCase();
          bValue = b.product.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  res.json(filteredData);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Error fetching campaigns' });
  }
});

// Helper function to parse different date formats
function parseDate(dateString) {
  if (!dateString) return null;
  
  // Handle DD/MM/YYYY format
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // JS months are 0-based
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
  }
  
  // Handle other formats
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const updates = req.body;
    
    const campaign = await getCampaignById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    await updateCampaign(campaignId, updates);
    const updatedCampaign = await getCampaignById(campaignId);
    
    res.json({ 
      message: 'Campaign updated successfully', 
      campaign: updatedCampaign 
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Error updating campaign' });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    const campaign = await getCampaignById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    await deleteCampaign(campaignId);
    
    res.json({ 
      message: 'Campaign deleted successfully', 
      campaign: campaign 
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Error deleting campaign' });
  }
});

app.post('/api/upload-excel', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log('Excel data sample:', data[0]); // Debug: log first row
    console.log('Available columns:', Object.keys(data[0] || {})); // Debug: log column names

    // Helper function to find value from multiple possible column names
    const findValue = (row, possibleNames, defaultValue = '') => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
          return String(row[name]).trim();
        }
      }
      return defaultValue;
    };

    const processedData = data.map((row, index) => {
      const processedRow = {
        date: findValue(row, ['Date', 'date', 'DATE', 'Ngày', 'ngày'], new Date().toLocaleDateString()),
        product: findValue(row, ['Product', 'product', 'PRODUCT', 'Produit', 'produit', 'Sản phẩm', 'sản phẩm']),
        provenance: findValue(row, ['Source', 'source', 'SOURCE', 'Provenance', 'provenance', 'Nguồn', 'nguồn']),
        nom: findValue(row, ['Name', 'name', 'NAME', 'Nom', 'nom', 'Tên', 'tên', 'Họ tên', 'họ tên']),
        email: findValue(row, [
          'Email', 'email', 'EMAIL', 'E-mail', 'e-mail', 'E-Mail', 
          'Adresse e-mail', 'adresse e-mail', 'Email Address', 'email address',
          'Địa chỉ email', 'địa chỉ email'
        ]),
        telephone: findValue(row, [
          'Phone', 'phone', 'PHONE', 'Telephone', 'telephone', 'TELEPHONE',
          'Téléphone', 'téléphone', 'Phone Number', 'phone number',
          'Số điện thoại', 'số điện thoại', 'Mobile', 'mobile'
        ]),
        cp: findValue(row, [
          'PostalCode', 'postalCode', 'postal code', 'POSTAL CODE',
          'CP', 'cp', 'Code postal', 'code postal', 'Postal Code',
          'Zip', 'zip', 'ZIP', 'Mã bưu điện', 'mã bưu điện'
        ]),
        statut: findValue(row, [
          'Status', 'status', 'STATUS', 'Statut', 'statut', 'STATUT',
          'Trạng thái', 'trạng thái', 'State', 'state'
        ], 'Nouveau'),
        notes: findValue(row, [
          'Notes', 'notes', 'NOTES', 'Note', 'note', 'NOTE',
          'Ghi chú', 'ghi chú', 'Comments', 'comments', 'Remarks', 'remarks'
        ])
      };

      console.log(`Row ${index + 1} processed:`, {
        email: processedRow.email,
        cp: processedRow.cp,
        originalRow: {
          email: row.Email || row.email || 'NOT FOUND',
          cp: row.PostalCode || row.postalCode || row.CP || 'NOT FOUND'
        }
      });

      return processedRow;
    });

    // Insert processed data into database
    const insertedCampaigns = [];
    for (const campaign of processedData) {
      const inserted = await createCampaign(campaign);
      insertedCampaigns.push(inserted);
    }

    fs.unlinkSync(req.file.path);

    res.json({ 
      message: 'File uploaded and processed successfully', 
      count: insertedCampaigns.length,
      data: insertedCampaigns 
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ error: 'Error processing Excel file' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    await insertSampleData(sampleCampaignData);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Database initialized successfully');
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer(); 