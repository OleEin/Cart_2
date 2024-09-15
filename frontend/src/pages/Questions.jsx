import React, { useState } from 'react';

function Detailkonzept() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ 0: 100, 1: 100, 2: 100 });

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
      // Send POST request with answers
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
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          disabled={currentQuestion === 0}
        >
          Zurück
        </button>

        <h1 className="text-xl font-bold text-center w-full">{questions[currentQuestion]}</h1>

        <button
          onClick={handleNext}
          className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 ml-auto"
        >
          {currentQuestion < 2 ? 'Weiter' : 'Fertig'}
        </button>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="125"
        step="25"
        value={answers[currentQuestion]}
        onChange={handleSliderChange}
        className="w-full mb-4 appearance-none h-2 bg-gray-200 rounded-lg outline-none slider-red-thumb"
      />
      <div className="flex justify-between text-gray-600">
        <span>Entwicklungsbedarf</span>
        <span>Optimierungsbedarf</span>
        <span>Läuft Bestens</span>
      </div>

      {/* Custom slider styling */}
      <style>
        {`
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ef4444; /* Tailwind red-500 */
            border-radius: 50%;
            cursor: pointer;
          }

          input[type='range']::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ef4444; /* Tailwind red-500 */
            border-radius: 50%;
            cursor: pointer;
          }

          input[type='range']::-ms-thumb {
            width: 20px;
            height: 20px;
            background: #ef4444; /* Tailwind red-500 */
            border-radius: 50%;
            cursor: pointer;
          }

          input[type='range'] {
            accent-color: #ef4444; /* Tailwind red-500 */
          }
        `}
      </style>
    </div>
  );
}

export default Detailkonzept;
