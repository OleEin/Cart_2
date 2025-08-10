import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CompanyAndQuestionsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [questionsData, setQuestionsData] = useState({
    question1: 1,
    question2: 1,
    question3: 1,
  });

  const [questionLabels, setQuestionLabels] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`https://db.xocore.de/cart/questions/offer/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuestionLabels(data.map((q) => q.description));
        } else {
          setStatusMessage('Fehler beim Abrufen der Fragen.');
        }
      } catch (error) {
        console.error('Fehler:', error);
        setStatusMessage('Fehler beim Abrufen der Fragen.');
      }
    };
    fetchQuestions();
  }, [id]);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setQuestionsData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allData = { ...companyData, ...questionsData };

    try {
      const response = await fetch(`https://db.xocore.de/cart/anfrage/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allData),
      });

      if (response.ok) {
        setStatusMessage('Daten erfolgreich gesendet.');
        const data = await response.json();
        const projektId = data.projektId;
        window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
        navigate(`/offers/${id}`);
      } else {
        setStatusMessage('Fehler beim Senden der Daten.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      setStatusMessage('Fehler beim Senden der Daten.');
    }
  };

  useEffect(() => {
    const allFieldsFilled =
      Object.values(companyData).every((value) => value !== '') &&
      Object.values(questionsData).every((value) => value !== null);
    setIsSubmitDisabled(!allFieldsFilled);
  }, [companyData, questionsData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 space-y-8">
        <h2 className="text-3xl font-bold text-center">Firmendaten</h2>
        <h5 className="text-3xl font-bold text-center">
          Schätze bitte im Folgenden kurz die Teilnehmerkompetenz für dein Team ein
        </h5>

        {/* Questions Section */}
        <div className="flex flex-col items-center space-y-6">
          {questionLabels.length > 0 ? (
            questionLabels.map((label, index) => (
              <div key={index} className="w-full space-y-2">
                <h3 className="text-xl font-semibold text-gray-700">{label}</h3>
                <input
                  type="range"
                  name={`question${index + 1}`}
                  min="0"
                  max="2"
                  value={questionsData[`question${index + 1}`]}
                  onChange={handleSliderChange}
                  className="w-full accent-red-600"
                />
                <div className="flex justify-between w-full text-xs text-gray-500">
                  <span>Entwicklungsbedarf</span>
                  <span>Optimierungsbedarf</span>
                  <span>Läuft Bestens</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Lade Fragen...</p>
          )}
        </div>

        {/* Company Data Section */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-gray-700">Firmenangaben</h3>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Firmenname*</label>
            <input
              type="text"
              name="firmenname"
              value={companyData.firmenname}
              onChange={handleCompanyChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Straße*</label>
              <input
                type="text"
                name="strasse"
                value={companyData.strasse}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hausnummer*</label>
              <input
                type="text"
                name="hausnummer"
                value={companyData.hausnummer}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ansprechpartner*</label>
            <input
              type="text"
              name="ansprechpartner"
              value={companyData.ansprechpartner}
              onChange={handleCompanyChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">PLZ*</label>
              <input
                type="text"
                name="plz"
                value={companyData.plz}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ort*</label>
              <input
                type="text"
                name="ort"
                value={companyData.ort}
                onChange={handleCompanyChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon*</label>
            <input
              type="text"
              name="telefon"
              value={companyData.telefon}
              onChange={handleCompanyChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mailadresse*</label>
            <input
              type="email"
              name="mailadresse"
              value={companyData.mailadresse}
              onChange={handleCompanyChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <p className="mt-4 text-sm text-gray-700"> <input type="checkbox" required /> Ich habe die Datenschutzerklärung zur Kenntnis genommen und stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen dauerhaft gespeichert werden. </p>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            disabled={isSubmitDisabled}
          >
            Speichern
          </button>

          {statusMessage && (
            <p className="mt-4 text-sm text-gray-700">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CompanyAndQuestionsForm;
