import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // `useNavigate` hinzufügen

function OfferEditDetails() {
  const { id } = useParams(); // Angebot ID aus den Parametern
  const navigate = useNavigate(); // `useNavigate`-Hook zum Navigieren verwenden
  const [offer, setOffer] = useState(null);
  const [positions, setPositions] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [conceptName, setConceptName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPosition, setEditPosition] = useState(null);
  const [successButton, setSuccessButton] = useState("bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded");

  
  // Helper function to get category color
  const getCategoryColor = (group) => {
    switch (group) {
      case 0:
        return 'bg-blue-500'; // Wissen (Knowledge)
      case 1:
        return 'bg-green-500'; // Menschlichkeit (Humanity)
      case 2:
        return 'bg-yellow-500'; // Geschick (Skill)
      case 3:
        return 'bg-red-500'; // Mut (Courage)
      default:
        return 'bg-gray-500'; // Default color
    }
  };

  // Helper function to get category name
  const getCategoryName = (group) => {
    switch (group) {
      case 0:
        return 'Wissen';
      case 1:
        return 'Menschlichkeit';
      case 2:
        return 'Geschick';
      case 3:
        return 'Mut';
      default:
        return 'Unbekannt';
    }
  };


  // Hilfsfunktion für Farbtags (Konzeptfarben für Gruppen 1-10)
const getGroupColor = (group) => {
  const colorMap = {
    1: 'bg-blue-500',
    2: 'bg-green-500',
    3: 'bg-yellow-500',
    4: 'bg-red-500',
    5: 'bg-purple-500',
    6: 'bg-pink-500',
    7: 'bg-indigo-500',
    8: 'bg-teal-500',
    9: 'bg-orange-500',
    10: 'bg-cyan-500',
  };
  return colorMap[group] || 'bg-gray-400';
};


const getGroupConcept = (group) => {
  const colorMap = {
    1: 'Führung im Vertrieb',
    2: 'Stationärer Vertrieb',
    3: 'Medialer Vertrieb',
    4: 'Medialer Service',
    5: 'Seiteneinsteiger',
    6: 'Stationärer Service',
    7: 'Führung im Betrieb',
    8: 'Führung auf Distanz',
    9: 'RUDI',
    10: 'Nächstes Konzept',
  };
  return colorMap[group] || 'Übergreifend';
};

const getGroupLabel = (group) => `Konzept ${group}`;
const [teamNotice, setTeamNotice] = useState("");
const [teamGoal, setTeamGoal] = useState("");



  useEffect(() => {
    // Angebotsdetails laden
    fetch(`https://db.xocore.de/cart/offer/${id}`)
      .then((response) => response.json())
        .then((data) => {
          setOffer(data);
          setTeamNotice(data.offer_teamnotice || "");
          setTeamGoal(data.offer_teamgoal || "");
          })
      .catch((error) => console.error("Fehler beim Laden des Angebots:", error));


    // Positionsdaten laden
    fetch(`https://db.xocore.de/cart/offer/positions/${id}`)
      .then((response) => response.json())
      .then((data) => setPositions(data))
      .catch((error) => console.error("Fehler beim Laden der Positionen:", error));

    // Produkte laden
    fetch(`https://db.xocore.de/cart/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Fehler beim Laden der Produkte:", error));



  }, [id]);


  useEffect(() => {
    try {
    // Konzept laden
    fetch(`https://db.xocore.de/cart/concept/${offer.offer_concept}`)
      .then((response) => response.json())
      .then((data) => setConceptName(data))
      .catch((error) => console.error("Fehler beim Laden der Produkte:", error));
    }catch(error){console.error};
  }, [offer]);

  // Handle Löschung einer Position
  const handleDeletePosition = (positionId) => {
    fetch(`https://db.xocore.de/cart/offer/positions/del/${positionId}`, {
      method: "POST",
    })
      .then(() => {
        setPositions(positions.filter((pos) => pos.positions_id !== positionId));
      })
      .catch((error) => console.error("Fehler beim Löschen:", error));
  };

  // Handle Updates von Positionseigenschaften
  const handleUpdatePosition = (positionId, updatedField) => {
    console.log(updatedField);
    fetch(`https://db.xocore.de/cart/offer/positions/update/${positionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedField),
    })
      .catch((error) => console.error("Fehler beim Update:", error));
  };

  const handleInputChange = (positionId, field, value) => {
    const updatedPositions = positions.map((pos) => {
      if (pos.positions_id === positionId) {
        const updatedPriceSum = field === "positions_product_price" || field === "positions_product_quantity" 
          ? (parseFloat(pos.positions_product_price) || 0) * (parseFloat(value) || 0)
          : pos.product_price_sum;

        return { ...pos, [field]: value, product_price_sum: updatedPriceSum };
      }
      return pos;
    });
    setPositions(updatedPositions);
  };

  const handleAddPosition = () => {
    if (!selectedProduct) return;
  
    const newPosition = {
      positions_product_id: selectedProduct.product_id,
      positions_product_group: selectedProduct.product_group,
      positions_product_name: selectedProduct.product_name,
      positions_product_quantity: 1,
      positions_product_price: selectedProduct.product_price,
      product_price_sum: selectedProduct.product_price,
      product_product_description: selectedProduct.product_description, // Hier Prüfen 
      product_goal: selectedProduct.product_goal, // Hier Prüfen 
      product_inhalt: selectedProduct.product_inhalt,// Hier Prüfen 
      offer_id: id,  // Angebot ID hinzufügen
    };
    console.log("Neue Position:", newPosition);
  
    fetch(`https://db.xocore.de/cart/offer/positions/add/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPosition),
    })
      .then(() => {
        setPositions([...positions, newPosition]);
        setSelectedProduct(null);
        setSearchTerm("");
      })
      .catch((error) => console.error("Fehler beim Hinzufügen der Position:", error));
  };

    const resendmail = () => {
  
    fetch(`https://db.xocore.de/cart/resendmail/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offer_id: id }),
    })
      .then(() => {
        console.log("Mail erfolgreich erneut zugestellt");
        setSuccessButton("bg-green-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded");
      })
      .catch((error) => console.error("Fehler beim Hinzufügen der Position:", error));
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Berechnung der Gesamtsumme
  const totalPrice = positions.reduce((acc, pos) => acc + (parseFloat(pos.product_price_sum) || 0), 0);
  const totalDays = positions.reduce((acc, pos) => acc + (parseFloat(pos.positions_product_quantity) || 0), 0);

  const totalDays2 = positions
  .filter(pos => !["4", "5", 4, 5].includes(pos.positions_product_attribut))
  .reduce((acc, pos) => acc + (parseFloat(pos.positions_product_quantity) || 0), 0);

      const sendLiveUpdate = (updatedPosition) => {
        fetch(`https://db.xocore.de/cart/offer/positions/edit/${updatedPosition.positions_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            positions_product_product_description: updatedPosition.positions_product_product_description,
            positions_product_goal: updatedPosition.positions_product_goal,
            positions_product_inhalt: updatedPosition.positions_product_inhalt, // ✅ NEU
            positions_product_name: updatedPosition.positions_product_name      // ✅ NEU
          })
        })
        .then((res) => {
          if (!res.ok) throw new Error("Update fehlgeschlagen");
        })
        .catch((error) => console.error("Fehler beim Live-Update:", error));
      };


  const updateTeamFields = (field, value) => {
    fetch(`https://db.xocore.de/cart/offer/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update fehlgeschlagen");
      })
      .catch((error) => console.error("Fehler beim Aktualisieren des Angebots:", error));
  };




  return (
    <div className="p-8 space-y-6">
      {/* Zurück Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)} // Navigiert zur vorherigen Seite
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          <span>Zurück</span>
        </button>
      </div>

      {/* Angebotsdetails */}
      {offer && (
        <div className="flex space-x-6">
  {/* Linker Container mit Angebotsdetails */}
  <div className="bg-white border border-gray-200 rounded-lg shadow p-6 w-2/3">
    <h2 className="text-2xl font-bold mb-4">Angebot: {offer.offer_partner} - {conceptName.concept_name}</h2>
    <p>Status: <strong>{offer.offer_status}</strong></p>      
    <p>Kontaktperson: {offer.offer_partner_contactperson}</p>
    <p>Teamname: {offer.offer_teamname}</p>
    <p>Adresse: {offer.offer_partner_street}, {offer.offer_partner_city}</p>
    <p>E-Mail: {offer.offer_partner_mail}</p>
    <p>Telefon: {offer.offer_partner_phone}</p>
  </div>

  {/* Rechter Container mit den Teamfragen */}
  <div className="bg-white border border-gray-200 rounded-lg shadow p-6 w-1/3">
    <h3 className="text-xl font-semibold mb-4">Teamfragen</h3>
    <p><strong>Frage 1:</strong> {offer.offer_question_a}</p>
    <p><strong>Frage 2:</strong> {offer.offer_question_b}</p>
    <p><strong>Frage 3:</strong> {offer.offer_question_c}</p>
    <p><strong>Digitalisierung:</strong> {offer.offer_teamdigital}%</p>
    <br></br>
  
    <a href={`https://angebot.afpuk.de/overview/{offer.offer_webcode}`} target="_blank" rel="n"><strong>Link:</strong> https://angebot.afpuk.de/overview/{offer.offer_webcode}</a>
    <p>
            <button
          onClick={() => resendmail()}
          className={successButton}
        >
          Mail erneut zustellen
        </button>
     </p>
  </div>
</div>


      )}

    {/* Gesamtsumme und Teilnehmeranzahl */}
    <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex justify-between items-center">
      <h3 className="text-xl font-semibold">Gesamtsumme</h3>
      <p className="text-lg font-medium">{positions.reduce((total, pos) => total + (parseFloat(pos.product_price_sum) || 0), 0).toFixed(2)} €</p>
      <p>Teilnehmeranzahl: <strong>{offer ? offer.offer_teilnehmer : "Lädt..."}</strong></p>
 {/* Hier wird die Teilnehmeranzahl angezeigt */}
      <p>Projektumfang: <strong> {totalDays2}Tage  - {totalDays}  Pos.   </strong></p> {/* Hier wird die Teilnehmeranzahl angezeigt */}

    </div>
        {/* Team-Kommentar und Zielsetzung */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ausgangssituation</label>
            <textarea
              value={teamNotice}
              onChange={(e) => {
                setTeamNotice(e.target.value);
                updateTeamFields("offer_teamnotice", e.target.value);
              }}
              rows={4}
              className="w-full border px-3 py-2 rounded"
              placeholder="Interne Hinweise oder Kommentare des Teams..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Zielsetzung</label>
            <textarea
              value={teamGoal}
              onChange={(e) => {
                setTeamGoal(e.target.value);
                updateTeamFields("offer_teamgoal", e.target.value);
              }}
              rows={4}
              className="w-full border px-3 py-2 rounded"
              placeholder="Was ist das Ziel des Angebots?"
            />
          </div>
        </div>

      {/* Positionsliste */}
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Positionen</h3>
        <ul className="space-y-4">
          {positions.map((pos) => (
            <li key={pos.positions_id} className="flex justify-between items-center border-b py-2">
              <div className="w-1/3">
                <p>{pos.positions_product_name}</p>
              </div>
              <div className="flex space-x-4 items-center">
                {/* Bearbeitbare Felder */}
                {["positions_product_quantity", "positions_product_price"].map((field) => (
                  <input
                    key={field}
                    type="number"
                    value={pos[field]}
                    className="w-24 border px-2 py-1 rounded"
                    onChange={(e) => handleInputChange(pos.positions_id, field, e.target.value)}
                    onBlur={() =>
                      handleUpdatePosition(pos.positions_id, {
                        [field]: pos[field],
                        product_price_sum: pos.product_price_sum,
                      })
                    }
                  />
                ))}
                {/* Preis Summe anzeigen */}
                <span className="w-24 text-right font-medium">
                  {parseFloat(pos.product_price_sum).toFixed(2)} €
                </span>
                                {/* Stift-Symbol */}
                <button
                  onClick={() => {
                    setEditPosition(pos);
                    setEditModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏️
                </button>

                {/* Löschen */}
                <button
                  onClick={() => handleDeletePosition(pos.positions_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Neue Position hinzufügen */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Neue Position hinzufügen</h4>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Produkt suchen..."
            className="w-full border px-4 py-2 rounded mb-4"
          />
       <ul className="max-h-40 overflow-y-auto border rounded">
                {filteredProducts.map((product) => (
                  <li
                    key={product.product_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <span>{product.product_name} </span>
                    <span
                      className={`text-white text-xs font-semibold px-2 py-1 rounded ${getGroupColor(product.product_concept)}`}
                    >
                      {getGroupConcept(product.product_concept)}
                    </span>
                  </li>
                ))}
              </ul>

          {selectedProduct && (
            <div className="mt-4">
              <p className="text-gray-700">Ausgewähltes Produkt: {selectedProduct.product_name}</p>
              <button
                onClick={handleAddPosition}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Position hinzufügen
              </button>
            </div>
          )}
        </div>
      </div>
      {editModalOpen && editPosition && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">Position bearbeiten</h2>
            <label className="block mb-2 font-medium">Beschreibung</label>
      <input
      type="text"
        className="w-full border rounded p-2 mb-4"
        rows={4}
        value={editPosition.positions_product_name || ''}
        onChange={(e) => {
          const updated = { ...editPosition, positions_product_name: e.target.value };
          setEditPosition(updated);
          sendLiveUpdate(updated);
        }}
      />
      
      <label className="block mb-2 font-medium">Beschreibung</label>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        value={editPosition.positions_product_product_description || ''}
        onChange={(e) => {
          const updated = { ...editPosition, positions_product_product_description: e.target.value };
          setEditPosition(updated);
          sendLiveUpdate(updated);
        }}
      />

      <label className="block mb-2 font-medium">Ziel</label>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        value={editPosition.positions_product_goal || ''}
        onChange={(e) => {
          const updated = { ...editPosition, positions_product_goal: e.target.value };
          setEditPosition(updated);
          sendLiveUpdate(updated);
        }}
      />
      <label className="block mb-2 font-medium">Inhalt</label>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        value={editPosition.positions_product_inhalt || ''}
        onChange={(e) => {
          const updated = { ...editPosition, positions_product_inhalt: e.target.value };
          setEditPosition(updated);
          sendLiveUpdate(updated);
        }}
      />




      <div className="flex justify-end">
        <button
          onClick={() => setEditModalOpen(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Schließen
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default OfferEditDetails;
