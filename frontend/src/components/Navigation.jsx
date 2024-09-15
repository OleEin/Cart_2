import React from 'react';
import { Link } from 'react-router-dom'; // Import for routing
import { FaHome, FaInfoCircle, FaUser, FaBuilding, FaListAlt, FaFileAlt } from 'react-icons/fa';

const steps = [
    { name: 'Konzept', path: '/concept/:id', icon: <FaHome /> },
    { name: 'Detailkonzept', path: '/step4', icon: <FaInfoCircle /> },
    { name: 'Personal', path: '/step2', icon: <FaUser /> },
    { name: 'Firma', path: '/step3', icon: <FaBuilding /> },
    { name: 'Übersicht', path: '/products', icon: <FaListAlt /> },
    { name: 'Angebot', path: '/step5', icon: <FaFileAlt /> }
  ];

const NavigationBar = ({ currentStep }) => {
  return (
    <div className="flex flex-col bg-gray-100 p-4 w-64 min-h-screen border-r border-gray-300">
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => (
          <Link
            key={index}
            to={step.path}
            className={`flex items-center p-2 rounded-lg ${
              currentStep === index
                ? 'bg-red-500 text-white'
                : 'text-gray-700'
            }`}
          >
            <span className={`mr-3 text-xl ${currentStep === index ? 'text-white' : 'text-gray-500'}`}>
              {step.icon}
            </span>
            <span className={`text-lg ${currentStep === index ? 'font-bold' : ''}`}>
              {step.name}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-auto">
        <input
          type="text"
          placeholder="Offer ID"
          className="p-2 w-full border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default NavigationBar;
