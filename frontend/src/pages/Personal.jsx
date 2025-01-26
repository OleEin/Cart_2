import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CompanyPeople() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Daten aus dem API-Endpunkt abrufen
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`https://db.xocore.de/cart/questions/people/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);

          const initialData = data.reduce((acc, question) => {
            acc[question.key] = '';
            return acc;
          }, {});
          setCompanyData(initialData);
        } else {
          console.error('Fehler beim Abrufen der Fragen.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Fragen:', error);
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

  const validateFields = () => {
    const errors = questions.filter(
      (question) => !companyData[question.key]?.trim()
    );

    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors([]);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFields()) {
      setStatusMessage('Bitte alle Fragen beantworten.');
      return;
    }
  
    // Daten als Array formatieren
    const formattedData = questions.map((question) => ({
      prio: question.prio,
      key: question.key,
      value: companyData[question.key] || '',
    }));
  
    try {
      const response = await fetch(`https://db.xocore.de/cart/anfrage/people/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      console.log(formattedData); // Logs die gesendeten Daten
      if (response.ok) {
        const responseData = await response.json(); // Erwartet eine `offer_id` in der Antwort
        const offerId = responseData.offer_id;
  
        if (offerId) {
          setStatusMessage('Daten erfolgreich gesendet.');
          setCompanyData(
            questions.reduce((acc, question) => {
              acc[question.key] = '';
              return acc;
            }, {})
          );
          navigate(`/firma/${offerId}`);
        } else {
          setStatusMessage('Fehler: Keine offer_id zurückgegeben.');
        }
      } else {
        setStatusMessage('Fehler beim Senden der Daten.');
      }
    } catch (error) {
      console.error('Fehler beim Senden der Daten:', error);
      setStatusMessage('Fehler beim Senden der Daten.');
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 space-y-8">
        <h2 className="text-3xl font-bold text-center">Dein Team</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-gray-700">Teamdaten (People)</h3>

          {questions.map((question) => (
            <div key={question.key}>
              <label className="block text-sm font-medium text-gray-700">{question.label}</label>
              {question.type === 'textarea' ? (
                <textarea
                  name={question.key}
                  value={companyData[question.key] || ''}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              ) : (
                <input
                  type={question.type}
                  name={question.key}
                  value={companyData[question.key] || ''}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              )}
            </div>
          ))}

          {validationErrors.length > 0 && (
            <div className="text-red-600 text-sm">
              <p>Bitte die folgenden Fragen beantworten:</p>
              <ul className="list-disc ml-6">
                {validationErrors.map((error) => (
                  <li key={error.key}>{error.label}</li>
                ))}
              </ul>
            </div>
          )}

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
