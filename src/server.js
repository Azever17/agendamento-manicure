require("dotenv").config()
const express = require("express")
const cors = require("cors")
const pool = require("./config/db")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'));

app.get("/services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services")
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar serviços" })
  }
})

app.get("/appointments", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM appointments ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
});

app.post("/appointments", async (req, res) => {
  const { client_name, client_phone, service_id, appointment_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO appointments (client_name, client_phone, service_id, appointment_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [client_name, client_phone, service_id, appointment_date]
    );
    res.json(result.rows[0]); // devolve o agendamento criado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})