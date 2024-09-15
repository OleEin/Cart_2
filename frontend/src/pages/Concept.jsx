import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

function Concept() {
  const { id } = useParams();
  const [concept, setConcept] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`https://db.xocore.de/cart/product/${id}`)
      .then(response => response.json())
      .then(data => setConcept(data))
      .catch(error => console.error('Error fetching concept:', error));
  }, [id]);

  if (!concept) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">{concept.name}</h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            className={classNames('p-4 text-lg font-medium', {
              'text-red-500 border-b-2 border-red-500': activeTab === 'overview',
              'text-gray-500': activeTab !== 'overview'
            })}
            onClick={() => setActiveTab('overview')}
          >
            Übersicht
          </button>
          <button
            className={classNames('p-4 text-lg font-medium', {
              'text-red-500 border-b-2 border-red-500': activeTab === 'details',
              'text-gray-500': activeTab !== 'details'
            })}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={classNames('p-4 text-lg font-medium', {
              'text-red-500 border-b-2 border-red-500': activeTab === 'additional',
              'text-gray-500': activeTab !== 'additional'
            })}
            onClick={() => setActiveTab('additional')}
          >
            Weitere Informationen
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Übersicht</h2>
              <p>{concept.overview || 'Keine Übersicht verfügbar.'}</p>
            </div>
          )}
          {activeTab === 'details' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <p>{concept.details || 'Keine Details verfügbar.'}</p>
            </div>
          )}
          {activeTab === 'additional' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Weitere Informationen</h2>
              <p>{concept.additional || 'Keine weiteren Informationen verfügbar.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Concept;
