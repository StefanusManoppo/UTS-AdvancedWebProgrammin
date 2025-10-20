require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Membuat koneksi ke database
const db = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT
});

// Cek koneksi
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  createTables();
});

// Fungsi membuat tabel
function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'lecturer', 'student') DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createStokTable = `
    CREATE TABLE IF NOT EXISTS stok_barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama_barang VARCHAR(100) NOT NULL,
      jumlah INT NOT NULL,
      harga DECIMAL(10,2) NOT NULL,
      kategori VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createPemasukanTable = `
    CREATE TABLE IF NOT EXISTS pemasukan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tanggal DATE NOT NULL,
      deskripsi VARCHAR(255) NOT NULL,
      nominal DECIMAL(12,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createPengeluaranTable = `
    CREATE TABLE IF NOT EXISTS pengeluaran (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tanggal DATE NOT NULL,
      deskripsi VARCHAR(255) NOT NULL,
      nominal DECIMAL(12,2) NOT NULL,
      kategori VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Jalankan semua query
  db.query(createUsersTable, (err) => {
    if (err) console.error('Error creating users table:', err);
  });
  db.query(createStokTable, (err) => {
    if (err) console.error('Error creating stok_barang table:', err);
  });
  db.query(createPemasukanTable, (err) => {
    if (err) console.error('Error creating pemasukan table:', err);
  });
  db.query(createPengeluaranTable, (err) => {
    if (err) console.error('Error creating pengeluaran table:', err);
  });

  // Tambahkan admin default
  const defaultPassword = bcrypt.hashSync('12345', 10);
  const insertAdmin = `
    INSERT IGNORE INTO users (username, password, role)
    VALUES ('admin', ?, 'admin')
  `;
  db.query(insertAdmin, [defaultPassword], (err) => {
    if (err) console.error('Error inserting admin user:', err);
    else console.log('Default admin user created');
  });
}

module.exports = db;