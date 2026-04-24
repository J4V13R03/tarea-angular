var express = require('express');
var mysql = require('mysql'); 
const bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

var app = express();

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acme'
});

conn.connect();

app.get('/productos', (req, res, next) => {
    const sql = 'SELECT * FROM productos';
    conn.query(sql, (err, results) => {
        if (err) throw err; 
        res.status(200).json({
            ok: true,
            productos: results
        });
    });
});

app.get('/', (req, res, next) => {
   res.status(200).json({
    ok: true,
    mensaje: 'Petición realizada correctamente'
   });
});

app.post('/productos', (req, res) => {
    const { productName, productCode, releaseDate, price, description, starRating, image } = req.body;
    const finalPrice = parseInt(price) || 0;
    const finalRate = parseFloat(starRating) || 0;

    const sql = 'INSERT INTO productos (productName, productCode, releaseDate, price, description, starRating, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    conn.query(sql, [productName, productCode, releaseDate, finalPrice, description, finalRate, image], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ ok: false, mensaje: 'Error al insertar' });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Producto creado correctamente',
        });
    });
});

app.delete('/productos/:id', (req, res) => {
    const { id } = req.params; 
    const sql = 'DELETE FROM productos WHERE productId = ?';
    conn.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.status(200).json({
            ok: true,
            mensaje: 'Producto eliminado correctamente'
        });
    });
});

app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { productName, productCode, releaseDate, price, description, starRating, image } = req.body;
    const finalPrice = parseInt(price) || 0;
    const finalRate = parseFloat(starRating) || 0;

    const sql = 'UPDATE productos SET productName = ?, productCode = ?, releaseDate = ?, price = ?, description = ?, starRating = ?, image = ? WHERE productId = ?';
    
    conn.query(sql, [productName, productCode, releaseDate, finalPrice, description, finalRate, image, id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ ok: false, mensaje: 'Error al actualizar' });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Producto actualizado correctamente'
        });
    });
});

app.put('/upload/producto/:id', (req, res) => {
    const { id } = req.params;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado ningún archivo'
        });
    }

    const file = req.files.image;
    const fileExtemsion = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if(!allowedExtensions.includes(fileExtemsion)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Archivo no permitido, solo se permiten imágenes'
        });
    }

    const productId = req.params.id;
    const fileName = `${productId}-${new Date().getMilliseconds()}.${fileExtemsion}`;
    const uploadPath = __dirname + '/uploads/' + fileName;

    console.log(uploadPath);

    file.mv(uploadPath , (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al subir el archivo'
            });
        }
        
        const sql = 'UPDATE productos SET image = ? WHERE productId = ?';
        
        conn.query(sql, [fileName, productId], (err, results) => {
            if (err) throw err;
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo subido y producto actualizado correctamente',
                fileName
            });
        });
    });
}); 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});