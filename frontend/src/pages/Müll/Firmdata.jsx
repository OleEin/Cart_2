import React, { useState } from 'react';

function CompanyDetails() {
  const [companyData, setCompanyData] = useState({
    firmenname: '',
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
    ansprechpartner: '',
    telefon: '',
    mailadresse: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/cart/firmdata/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (response.ok) {
        setStatusMessage('Firmendaten erfolgreich gesendet.');
        setCompanyData({
          firmenname: '',
          strasse: '',
          hausnummer: '',
          plz: '',
          ort: '',
          ansprechpartner: '',
          telefon: '',
          mailadresse: '',
        });
      } else {
        setStatusMessage('Fehler beim Senden der Firmendaten.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      setStatusMessage('Fehler beim Senden der Daten.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Firmeninformationen</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Firmenname</label>
          <input
            type="text"
            name="firmenname"
            value={companyData.firmenname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ansprechpartner/Abteilung</label>
          <input
            type="text"
            name="ansprechpartner"
            value={companyData.ansprechpartner}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Straße</label>
          <input
            type="text"
            name="strasse"
            value={companyData.strasse}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hausnummer</label>
          <input
            type="text"
            name="hausnummer"
            value={companyData.hausnummer}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">PLZ</label>
          <input
            type="text"
            name="plz"
            value={companyData.plz}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ort</label>
          <input
            type="text"
            name="ort"
            value={companyData.ort}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            type="text"
            name="telefon"
            value={companyData.telefon}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mailadresse</label>
          <input
            type="email"
            name="mailadresse"
            value={companyData.mailadresse}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Weiter
        </button>

        {statusMessage && (
          <p className="mt-4 text-sm text-gray-700">{statusMessage}</p>
        )}
      </form>
    </div>
  );
}

export default CompanyDetails;
