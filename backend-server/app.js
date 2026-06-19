var express = require('express');
var mysql = require('mysql'); 
const bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let SEED = "esta-es-una-semilla-para-generar-el-token";
const e = require('express');

var app = express();

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'acme'
});

conn.connect();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x.client-key, x-client-token, x-client-secret, Authorization');
    next();
});



app.post('/usuarios', (req, res) => {
    const { name, email, img, role } = req.body;
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const sql = 'INSERT INTO usuarios (userName, userEmail, userPassword, userImg, userRole) VALUES (?, ?, ?, ?, ?)';
    conn.query(sql, [name, email, hashedPassword, img, role], (err, results) => {
        if (err) throw err;
        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado correctamente',
        });
    });
});

app.post('/login', (req, res) => {
    const {email} = req.body;
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const sql = 'SELECT * FROM usuarios WHERE userEmail = ?';
    conn.query(sql, [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        } else {
            const user = results[0];
            const passwordMatch = bcrypt.compareSync(req.body.password, user.userPassword);
            if (!passwordMatch) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Contraseña incorrecta'
                });
            }
            const token = jwt.sign({ usuario: user }, SEED, { expiresIn: 14400 });
            res.status(200).json({
                ok: true,
                mensaje: 'Login exitoso',
                usuario: user,
                token: token
            });
        }  
    });
});

app.use(function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no proporcionado'
        });
    }else {
        jwt.verify(token, SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token no válido'
                });
            }
            req.usuario = decoded.usuario;
            next();
        });
    }
    
});

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

app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM productos WHERE productId = ?';
    conn.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.status(200).json({
            ok: true,
            producto: results[0]
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