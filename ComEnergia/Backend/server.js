import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "./db/data.json";

// === Utilidades ===
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// === Registro de usuarios ===
app.post("/api/register", (req, res) => {
  const { name, email, password, empresa, role, celular } = req.body;
  const db = readDB();

  if (db.users.find((u) => u.email === email))
    return res.status(400).json({ error: "Correo ya registrado" });

  const newUser = { id: uuidv4(), name, email, password, empresa, role, celular };
  db.users.push(newUser);
  saveDB(db);
  res.json({ name, email, empresa, role, celular });
});

// === Login ===
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ error: "Credenciales inválidas" });
  res.json(user);
});

// === Solicitudes ===
app.post("/api/solicitudes", (req, res) => {
  const { servicio, empresa, mensaje, user } = req.body;
  const db = readDB();

  const empresaUsers = db.users.filter(
    (u) => u.role === "empresa" && u.empresa === empresa
  );

  const nueva = {
    id: uuidv4(),
    servicio,
    empresa,
    mensaje,
    user,
    destinatarios: empresaUsers.map((u) => u.email),
    estado: "En revisión",
    fecha: new Date().toLocaleDateString(),
  };

  db.solicitudes.push(nueva);
  saveDB(db);
  res.json(nueva);
});

// === Consultar solicitudes por usuario ===
app.get("/api/solicitudes/:email", (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.email === req.params.email);
  if (!user) return res.json([]);

  if (user.role === "usuario")
    return res.json(db.solicitudes.filter((s) => s.user === user.email));

  if (user.role === "empresa")
    return res.json(
      db.solicitudes.filter(
        (s) => s.empresa === user.empresa || (s.destinatarios || []).includes(user.email)
      )
    );

  res.json([]);
});

// === Actualizar estado o respuesta de una solicitud ===
app.post("/api/solicitudes/update", (req, res) => {
  const { id, estado, respuesta } = req.body;
  const db = readDB();

  const index = db.solicitudes.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Solicitud no encontrada" });

  if (estado) db.solicitudes[index].estado = estado;
  if (respuesta) db.solicitudes[index].respuesta = respuesta;
  db.solicitudes[index].fechaRespuesta = new Date().toLocaleString();

  saveDB(db);
  res.json(db.solicitudes[index]);
});

// === Servicios ===
app.get("/api/services", (req, res) => {
  const db = readDB();
  res.json(db.services);
});

app.post("/api/services", (req, res) => {
  const { title, resumen, empresa, user } = req.body;
  const db = readDB();

  const nuevo = {
    id: uuidv4(),
    title,
    resumen,
    empresa,
    user,
    fecha: new Date().toLocaleDateString(),
  };

  db.services.push(nuevo);
  saveDB(db);
  res.json(nuevo);
});

// === Empresas ===
app.get("/api/empresas", (req, res) => {
  const db = readDB();
  const empresas = db.users
    .filter((u) => u.role === "empresa" && u.empresa)
    .map((u) => ({ empresa: u.empresa, email: u.email }));
  res.json(empresas);
});

// === nueva empresa asociada ===
app.post("/api/empresas/add", (req, res) => {
  const { empresa, descripcion, servicios, email, rating } = req.body;
  const db = readDB();

  const exists = db.users.find(
    (u) => u.empresa && u.empresa.toLowerCase() === empresa.toLowerCase()
  );
  if (exists) return res.status(400).json({ error: "La empresa ya existe" });

  //usuario tipo empresa
  db.users.push({
    id: uuidv4(),
    name: empresa,
    email,
    password: "N/A",
    empresa,
    role: "empresa",
  });

  // Registrar servicios asociados
  servicios.forEach((s) => {
    const existing = db.services.find((x) => x.title === s && x.empresa === empresa);
    if (!existing) {
      db.services.push({
        id: uuidv4(),
        title: s,
        resumen: descripcion,
        empresa,
        user: email,
        fecha: new Date().toLocaleDateString(),
      });
    }
  });

  saveDB(db);
  res.json({ ok: true, empresa, servicios, rating });
});

app.listen(4000, () =>
  console.log("Servidor ComEnergia corriendo en http://localhost:4000")
);
