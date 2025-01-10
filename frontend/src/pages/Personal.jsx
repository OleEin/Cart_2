import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CompanyPeople() {

  const { id } = useParams();
  const navigate = useNavigate(); // Zum Navigieren auf eine andere Seite



  const [companyData, setCompanyData] = useState({
    teamname: '',
    teamnotice: '',
    teilnehmer: '',
    internetrainer: '',
  });


  const [statusMessage, setStatusMessage] = useState('');

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    const allData = { ...companyData, };
    console.log(allData);

    try {
      const response = await fetch(`https://db.xocore.de/cart/anfrage/people/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allData),
      });

      if (response.ok) {
        setStatusMessage('Daten erfolgreich gesendet.');
        setCompanyData({
          teamname: '',
          teamnotice: '',
          teilnehmer: '',
          internetrainer: '',
        });
        navigate(`/loading/1`); // Weiterleitung nach der Ladezeit

      } else {
        setStatusMessage('Fehler beim Senden der Daten.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      setStatusMessage('Fehler beim Senden der Daten.');
    }
  };






  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 space-y-8">
        <h2 className="text-3xl font-bold text-center">Firmendaten {id}</h2>



        {/* Company Data Section */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-gray-700">Personaldaten (People)</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name des Teams</label>
            <input
              type="text"
              name="teamname"
              value={companyData.teamname}
              onChange={handleCompanyChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Anzahl der Teilnehmer</label>
              <input
                type="number"
                name="teilnehmer"
                value={companyData.teilnehmer}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Anzahl der internen Trainer</label>
              <input
                type="number"
                name="internetrainer"
                value={companyData.internetrainer}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Was ist sonst noch wichtig?</label>
            <textarea
              type="text"
              name="teamnotice"
              value={companyData.teamnotice}
              onChange={handleCompanyChange}
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
    </div>
  );
}

export default CompanyPeople;
