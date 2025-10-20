const express = require('express');
const router = express.Router();
const StokBarang = require('../models/stokModel');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Stok barang page
router.get('/barang', requireAuth, (req, res) => {
    StokBarang.getAll((err, results) => {
        if (err) {
            console.error(err);
            return res.render('stok-barang', {
                title: 'Data Stok Barang',
                user: req.session.user,
                stok: [],
                error: 'Gagal memuat data stok',
                success: null
            });
        }
        
        // Get success/error from query parameters
        const success = req.query.success || null;
        const error = req.query.error || null;
        
        res.render('stok-barang', {
            title: 'Data Stok Barang',
            user: req.session.user,
            stok: results,
            success: success,
            error: error
        });
    });
});

// Add stok barang
router.post('/barang', requireAuth, (req, res) => {
    const { nama_barang, jumlah, harga, kategori } = req.body;
    
    // Validation
    if (!nama_barang || !jumlah || !harga || !kategori) {
        return res.redirect('/stok/barang?error=Semua field wajib diisi');
    }
    
    StokBarang.create({ nama_barang, jumlah, harga, kategori }, (err) => {
        if (err) {
            console.error(err);
            return res.redirect('/stok/barang?error=Gagal menambah data');
        }
        res.redirect('/stok/barang?success=Data berhasil ditambahkan');
    });
});

// Edit stok barang page
router.get('/barang/edit/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    
    StokBarang.getById(id, (err, barang) => {
        if (err || !barang) {
            console.error(err);
            return res.redirect('/stok/barang?error=Data tidak ditemukan');
        }
        
        res.render('edit-barang', {
            title: 'Edit Stok Barang',
            user: req.session.user,
            barang: barang,
            error: null
        });
    });
});

// Update stok barang
router.post('/barang/edit/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    const { nama_barang, jumlah, harga, kategori } = req.body;
    
    // Validation
    if (!nama_barang || !jumlah || !harga || !kategori) {
        return res.redirect(`/stok/barang/edit/${id}?error=Semua field wajib diisi`);
    }
    
    StokBarang.update(id, { nama_barang, jumlah, harga, kategori }, (err) => {
        if (err) {
            console.error(err);
            return res.redirect(`/stok/barang/edit/${id}?error=Gagal mengupdate data`);
        }
        res.redirect('/stok/barang?success=Data berhasil diupdate');
    });
});

// Delete stok barang
router.post('/barang/delete/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    
    StokBarang.delete(id, (err) => {
        if (err) {
            console.error(err);
            return res.redirect('/stok/barang?error=Gagal menghapus data');
        }
        res.redirect('/stok/barang?success=Data berhasil dihapus');
    });
});

module.exports = router;