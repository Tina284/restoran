const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Spajanje na MongoDB bazu
mongoose.connect('mongodb://localhost:27017/restorani'
).then(() => {
  console.log('Uspješno povezan s bazom podataka');
}).catch((err) => {
  console.error('Greška prilikom povezivanja s bazom podataka', err);
});

// Definiranje modela Restoran
const Restoran = mongoose.model('Restoran', new mongoose.Schema({
  naziv: String,
  adresa: String,
  telefon: String,
  vrsta: String
}, { collection: 'restorani' }));

// GET ruta za dohvaćanje svih restorana
app.get('/restorani', async (req, res) => {
  try {
    const restorani = await Restoran.find();
    res.json(restorani);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST ruta za dodavanje novog restorana
app.post('/restorani', async (req, res) => {
  try {
    const { adresa, naziv, broj_telefona, vrsta } = req.body;
    const noviRestoran = new Restoran({ adresa, naziv, broj_telefona, vrsta });
    const spremljeniRestoran = await noviRestoran.save();
    res.status(201).json(spremljeniRestoran);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT ruta za ažuriranje restorana
app.put('/restorani/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { adresa, naziv, broj_telefona, vrsta } = req.body;
    const azuriraniRestoran = await Restoran.findByIdAndUpdate(id, { adresa, naziv, broj_telefona, vrsta }, { new: true });
    res.json(azuriraniRestoran);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE ruta za brisanje restorana
app.delete('/restorani/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Restoran.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});
