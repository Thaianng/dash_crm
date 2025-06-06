const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'campaigns.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      product TEXT NOT NULL,
      provenance TEXT NOT NULL,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT NOT NULL,
      cp TEXT NOT NULL,
      statut TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        reject(err);
      } else {
        console.log('Campaigns table created or already exists');
        resolve();
      }
    });
  });
};

const getAllCampaigns = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM campaigns ORDER BY id DESC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getCampaignById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM campaigns WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const createCampaign = (campaign) => {
  return new Promise((resolve, reject) => {
    const { date, product, provenance, nom, email, telephone, cp, statut, notes } = campaign;
    db.run(
      `INSERT INTO campaigns (date, product, provenance, nom, email, telephone, cp, statut, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [date, product, provenance, nom, email, telephone, cp, statut, notes || ''],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...campaign });
        }
      }
    );
  });
};

const updateCampaign = (id, updates) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    db.run(
      `UPDATE campaigns SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
};

const deleteCampaign = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM campaigns WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

const getStats = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'Nouveau' THEN 1 ELSE 0 END) as nouveau,
        SUM(CASE WHEN statut = 'À traiter' THEN 1 ELSE 0 END) as aTraiter,
        SUM(CASE WHEN statut IN ('Rendez-vous pris', 'Vendu') THEN 1 ELSE 0 END) as rendezVousPris
      FROM campaigns
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const stats = rows[0];
        const conversionRate = stats.total > 0 ? Math.round((stats.rendezVousPris / stats.total) * 100) : 0;
        resolve({
          ...stats,
          conversionRate
        });
      }
    });
  });
};

const insertSampleData = (sampleData) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM campaigns', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Inserting sample data...');
        const stmt = db.prepare(`
          INSERT INTO campaigns (date, product, provenance, nom, email, telephone, cp, statut, notes) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        sampleData.forEach(campaign => {
          stmt.run([
            campaign.date, 
            campaign.product, 
            campaign.provenance, 
            campaign.nom, 
            campaign.email, 
            campaign.telephone, 
            campaign.cp, 
            campaign.statut, 
            campaign.notes || ''
          ]);
        });
        
        stmt.finalize((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Sample data inserted successfully');
            resolve();
          }
        });
      } else {
        console.log('Database already has data, skipping sample data insertion');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  initDatabase,
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getStats,
  insertSampleData
}; 