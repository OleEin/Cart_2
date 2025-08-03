import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const allFeatures = [
  'Ziel der Bildungsmaßnahme',
  'Bildungsbedarfsanalyse',
  'Haltung und Einbindung des Personalrates',
  'Konkrete Auftragsklärung',
  'Definition der Inhalte je Baustein',
  'Problemdefinition',
  'Prozesse und Arbeitsabläufe',
  'Ihr Vertriebsprozess',
  'Der gelebte Führungsprozess',
  'Ihre Vision und Werte',
  'Vorhandene Kommunikations-/Verkaufs-/Führungstools',
  'Technische Rahmenbedingungen und Voraussetzungen',
  'Mitarbeiterauswahlprozess',
  'Konkretes Angebot zur Entscheidungsvorlage',
  'Analyse der internen und externen Marketingstrategie',
  'Ausarbeitung einer Optimierungsstrategie',
  'Klare Handlungsempfehlung',
];

// Definieren, welche Leistungen in welchem Paket enthalten sind
const offers = [
  {
    id: 1,
    name: 'Basis',
    price: 1000,
    description: 'Dies ist das Basisangebot, ideal für den Einstieg.',
    includedFeatures: [
      'Ziel der Bildungsmaßnahme',
      'Bildungsbedarfsanalyse',
      'Konkrete Auftragsklärung',
      'Problemdefinition',
      'Technische Rahmenbedingungen und Voraussetzungen',
    ],
  },
  {
    id: 2,
    name: 'Standard',
    price: 2000,
    description: 'Das Standardangebot für fortgeschrittene Bedürfnisse.',
    includedFeatures: [
      'Ziel der Bildungsmaßnahme',
      'Bildungsbedarfsanalyse',
      'Konkrete Auftragsklärung',
      'Problemdefinition',
      'Prozesse und Arbeitsabläufe',
      'Ihr Vertriebsprozess',
      'Vorhandene Kommunikations-/Verkaufs-/Führungstools',
      'Technische Rahmenbedingungen und Voraussetzungen',
      'Mitarbeiterauswahlprozess',
    ],
  },
  {
    id: 3,
    name: 'Premium',
    price: 3000,
    description: 'Unser Premiumangebot mit allen Funktionen und mehr.',
    includedFeatures: [...allFeatures],
  },
];

function OfferPage() {
  const { offerid } = useParams();
  const navigate = useNavigate();

  const handleOfferClick = async (id) => {
    try {
      const response = await fetch(`https://db.xocore.de/cart/offer/way/${offerid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wayid: id }),
      });
      if (!response.ok) throw new Error('Fehler beim Senden der Anfrage');
      navigate(`/loading/${offerid}`);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl text-center font-extrabold mb-10">Wähle deinen Weg aus</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer"
            onClick={() => handleOfferClick(offer.id)}
          >
            <h2 className="text-2xl font-bold text-red-600">{offer.name}</h2>
            <p className="text-gray-600 mt-2 mb-4">{offer.description}</p>
            <ul className="space-y-2 text-sm">
              {allFeatures.map((feature) => {
                const included = offer.includedFeatures.includes(feature);
                return (
                  <li key={feature} className={`flex items-start gap-2 ${included ? 'text-black' : 'text-gray-400'}`}>
                    {included ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300 mt-0.5" />
                    )}
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferPage;
