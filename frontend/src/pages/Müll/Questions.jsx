import React, { useState } from 'react';

function Detailkonzept() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ 0: 100, 1: 100, 2: 100 });
  const [isModalOpen, setIsModalOpen] = useState(true);

  const questions = [
    'Wie ist die technische Ausstattung?',
    'Wie ist die fachliche Ausstattung?',
    'Wie ist die systemische Ausstattung?',
  ];

  const handleSliderChange = (event) => {
    const value = Number(event.target.value);
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < 2) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      fetch('https://db.xocore.de/cart/offer/init/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      })
        .then((response) => response.json())
        .then((data) => console.log('Submitted answers:', data))
        .catch((error) => console.error('Error:', error));
      setIsModalOpen(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };



  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <button
        onClick={openModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Fragen starten
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 max-w-lg w-full relative">


            <h1 className="text-xl font-bold mb-4 text-center">{questions[currentQuestion]}</h1>

            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={answers[currentQuestion]}
              onChange={handleSliderChange}
              className="w-full mb-6 appearance-none h-2 bg-gray-200 rounded-lg outline-none slider-red-thumb"
            />

            <div className="flex justify-between text-gray-600">
             
              <span>Entwicklungsbedarf</span>
              <span>Optimierungsbedarf</span>
              <span>Läuft Bestens</span>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                disabled={currentQuestion === 0}
              >
                Zurück
              </button>

              <button
                onClick={handleNext}
                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
              >
                {currentQuestion < 2 ? 'Weiter' : 'Fertig'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Detailkonzept;
