const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bengkel_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    createTables();
});

function createTables() {
    // Users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin') DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Stok barang table
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
    
    // Pemasukan table
    const createPemasukanTable = `
        CREATE TABLE IF NOT EXISTS pemasukan (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tanggal DATE NOT NULL,
            deskripsi VARCHAR(255) NOT NULL,
            nominal DECIMAL(12,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Pengeluaran table
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
    
    // Execute table creation
    connection.query(createUsersTable, (err) => {
        if (err) console.error('Error creating users table:', err);
    });
    
    connection.query(createStokTable, (err) => {
        if (err) console.error('Error creating stok_barang table:', err);
    });
    
    connection.query(createPemasukanTable, (err) => {
        if (err) console.error('Error creating pemasukan table:', err);
    });
    
    connection.query(createPengeluaranTable, (err) => {
        if (err) console.error('Error creating pengeluaran table:', err);
    });
    
    // Insert default admin user
    const defaultPassword = bcrypt.hashSync('12345', 10);
    const insertAdmin = `
        INSERT IGNORE INTO users (username, password, role) 
        VALUES ('admin', ?, 'admin')
    `;
    
    connection.query(insertAdmin, [defaultPassword], (err) => {
        if (err) console.error('Error inserting admin user:', err);
        else console.log('Default admin user created');
    });
}

module.exports = connection;