// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');

// Conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'skatepark',
  password: '1234',
  port: 5432,
});

const secretKey = "Shhhh";

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El tamaño de la imagen supera el límite permitido",
  })
);
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/mainLayout`,
  })
);
app.set("view engine", "handlebars");

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

// Servidor
app.listen(3000, () => console.log("Servidor encendido en el PORT 3000!"));

// Rutas
app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skaters');
    const skaters = result.rows;
    res.render("Home", { skaters });
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.get("/registro", (req, res) => {
  res.render("Registro");
});

app.post("/registro", async (req, res) => {
  const { email, nombre, password, anos_experiencia, especialidad } = req.body;
  const estado = req.body.estado !== undefined ? req.body.estado : false;
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No se encontró ningún archivo en la consulta");
  }
  const { foto } = req.files;
  const { name } = foto;
  const pathPhoto = `/uploads/${name}`;

  try {
    foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
      if (err) throw err;
      await pool.query(
        'INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [email, nombre, password, anos_experiencia, especialidad, pathPhoto, estado]
      );
      res.status(201).send("Skater registrado con éxito");
    });
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.get("/perfil", verifyToken, async (req, res) => {
  console.log("Token decodificado en /perfil:", req.user);
  try {
    const result = await pool.query('SELECT * FROM skaters WHERE id = $1', [req.user.id]);
    if (result.rows.length > 0) {
      const skater = result.rows[0];
      res.render("Perfil", { skater });
    } else {
      res.status(404).send({
        error: "Skater no encontrado",
        code: 404
      });
    }
  } catch (e) {
    console.error("Error al consultar la base de datos:", e);
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM skaters WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      const skater = result.rows[0];
      const token = jwt.sign({ id: skater.id, email: skater.email }, secretKey, { expiresIn: '1h' });
      console.log("Token generado en /login:", token);
      res.send({ token });
    } else {
      res.status(401).send("Correo o contraseña incorrectos");
    }
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.get("/Admin", verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skaters');
    const skaters = result.rows;
    res.render("Admin", { skaters });
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

// API REST Skaters
app.get("/skaters", verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skaters');
    res.status(200).send(result.rows);
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.post("/skaters", async (req, res) => {
  const skater = req.body;
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No se encontró ningún archivo en la consulta");
  }
  const { files } = req;
  const { foto } = files;
  const { name } = foto;
  const pathPhoto = `/uploads/${name}`;
  const estado = skater.estado !== undefined ? skater.estado : false;

  console.log("Valor del req.body: ", skater);
  console.log("Nombre de imagen: ", name);
  console.log("Ruta donde subir la imagen: ", pathPhoto);

  foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
    try {
      if (err) throw err;
      skater.foto = pathPhoto;
      await pool.query(
        'INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [skater.email, skater.nombre, skater.password, skater.anos_experiencia, skater.especialidad, skater.foto, estado]
      );
      res.status(201).redirect("/");
    } catch (e) {
      console.log(e);
      res.status(500).send({
        error: `Algo salió mal... ${e}`,
        code: 500
      });
    }
  });
});

app.put("/skaters", verifyToken, async (req, res) => {
  const { id, nombre, anos_experiencia, especialidad } = req.body;
  console.log("Valor del body: ", id, nombre, anos_experiencia, especialidad);
  try {
    await pool.query(
      'UPDATE skaters SET nombre = $1, anos_experiencia = $2, especialidad = $3 WHERE id = $4',
      [nombre, anos_experiencia, especialidad, id]
    );
    res.status(200).send("Datos actualizados con éxito");
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.put("/skaters/status/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  console.log("Valor de estado recibido por body: ", estado);
  try {
    await pool.query(
      'UPDATE skaters SET estado = $1 WHERE id = $2',
      [estado, id]
    );
    res.status(200).send("Estado actualizado con éxito");
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});

app.delete("/skaters/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM skaters WHERE id = $1',
      [id]
    );
    res.status(200).send("Skater eliminado con éxito");
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500
    });
  }
});
