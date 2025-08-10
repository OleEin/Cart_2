import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function AllOffers() {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const conceptLabels = {
  1: "Führung im Vertrieb",
  2: "Stationärer Vertrieb",
  3: "Medialer Vertrieb",
  4: "Medialer Service",
  5: "Seiteneinsteiger",
  6: "Stationärer Service",
  7: "Führung im Betrieb",
  8: "Führung auf Distanz",
  9: "RUDI",
  99: "Nicht benutzen",

};


  useEffect(() => {
    fetch('https://db.xocore.de/cart/offers')
      .then(response => response.json())
      .then(data => setOffers(data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  useEffect(() => {
    let results = offers;

    if (searchTerm) {
      results = results.filter(
        offer => offer.offer_partner?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedConcept) {
      results = results.filter(
        offer => String(offer.offer_concept) === String(selectedConcept)
      );
    }

    if (selectedStatus) {
      results = results.filter(
        offer => String(offer.offer_status) === String(selectedStatus)
      );
    }

    setFilteredOffers(results);
  }, [offers, searchTerm, selectedConcept, selectedStatus]);

  const openDeleteModal = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
    console.log('Selected offer for deletion:', offer);
  };

  const handleDelete = () => {
    if (!selectedOffer) return;
    fetch(`https://db.xocore.de/cart/offer/del/${selectedOffer.offer_id}`, {
      method: 'POST',
    })
      .then(() => {
        setOffers(offers.filter(offer => offer.id !== selectedOffer.id));
        setIsModalOpen(false);
        setSelectedOffer(null);
      })
      .catch(error => console.error('Error deleting offer:', error));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Angebote</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Nach Partner suchen..."
          className="p-2 border rounded-md w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-2 border rounded-md"
          value={selectedConcept}
          onChange={(e) => setSelectedConcept(e.target.value)}
        >
          <option value="">Konzept filtern</option>
          {[...new Set(offers.map(offer => offer.offer_concept).filter(Boolean))].map((concept) => (
            <option key={concept} value={concept}>
              {concept} {conceptLabels[concept] || ""}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-md"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Status filtern</option>
          {[...new Set(offers.map(offer => offer.offer_status).filter(Boolean))].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Partner</th>
              <th className="p-2 text-left">Angebotssumme</th>
              <th className="p-2 text-left">Teilnehmer</th>
              <th className="p-2 text-left">Konzept</th>
              <th className="p-2 text-left">Manager</th>

              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.length > 0 ? (
              filteredOffers.map(offer => (
                <tr key={offer.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{offer.offer_partner}({offer.offer_id})</td>
                  <td className="p-2">  {Number(offer.offer_sum).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="p-2">{offer.offer_teilnehmer}</td>
                  <td className="p-2">{conceptLabels[offer.offer_concept]}</td>
                  <td className="p-2">{conceptLabels[offer.offer_internal_manager]}</td>

                  <td className="p-2">{offer.offer_status}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => window.location.href = `/admin/offer/edit/${offer.offer_id}`}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(offer)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600">
                  Keine Angebote gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Wirklich löschen?</h2>
            <p className="text-gray-600 mb-6">
              Möchten Sie das Angebot von "{selectedOffer?.offer_partner}" wirklich löschen?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllOffers;
