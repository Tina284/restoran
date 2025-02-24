import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [restorani, setRestorani] = useState([]);
  const [naziv, setNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [telefon, setTelefon] = useState('');
  const [vrsta, setVrsta] = useState('');

  useEffect(() => {
    const dohvatiRestorane = async () => {
      try {
        const response = await fetch('http://localhost:3000/restorani');
        const data = await response.json();
        setRestorani(data);
      } catch (error) {
        console.error('Greška prilikom dohvaćanja restorana:', error);
      }
    };

    dohvatiRestorane();
  }, []);

  const dodajRestoran = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/restorani', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naziv, adresa, telefon, vrsta })
      });

      if (response.ok) {
        const noviRestoran = await response.json();
        setRestorani([...restorani, noviRestoran]);
        setNaziv('');
        setAdresa('');
        setTelefon('');
        setVrsta('');
      }
    } catch (error) {
      console.error('Greška prilikom dodavanja restorana:', error);
    }
  };

  const azurirajRestoran = async (id) => {
    const noviNaziv = prompt('Unesite novi naziv:');
    const novaAdresa = prompt('Unesite novu adresu:');
    const noviTelefon = prompt('Unesite novi telefon:');
    const novaVrsta = prompt('Unesite novu vrstu restorana:');

    try {
      const response = await fetch(`http://localhost:3000/restorani/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naziv: noviNaziv, adresa: novaAdresa, telefon: noviTelefon, vrsta: novaVrsta })
      });

      if (response.ok) {
        const azuriraniRestoran = await response.json();
        setRestorani(restorani.map(r => (r._id === azuriraniRestoran._id ? azuriraniRestoran : r)));
      }
    } catch (error) {
      console.error('Greška prilikom ažuriranja restorana:', error);
    }
  };

  const obrisiRestoran = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/restorani/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRestorani(restorani.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error('Greška prilikom brisanja restorana:', error);
    }
  };

  return (
    <div className="App">
      <h1>Moji Restorani</h1>
      <div className="restorani">
        {restorani.map(restoran => (
          <div key={restoran._id} className='restoran'>
            <strong>{restoran.naziv}</strong> - {restoran.adresa}, {restoran.broj_telefona} ({restoran.vrsta})
            <button onClick={() => azurirajRestoran(restoran._id)}>Ažuriraj</button>
            <button onClick={() => obrisiRestoran(restoran._id)}>Obriši</button>
          </div>
        ))}
      </div>
      <form onSubmit={dodajRestoran}>
        <h2>Dodaj novi restoran</h2>
        <label htmlFor="naziv">Naziv:</label>
        <input type="text" id="naziv" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
        <label htmlFor="adresa">Adresa:</label>
        <input type="text" id="adresa" value={adresa} onChange={(e) => setAdresa(e.target.value)} required />
        <label htmlFor="telefon">Telefon:</label>
        <input type="text" id="telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} required />
        <label htmlFor="vrsta">Vrsta:</label>
        <input type="text" id="vrsta" value={vrsta} onChange={(e) => setVrsta(e.target.value)} required />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}

export default App;