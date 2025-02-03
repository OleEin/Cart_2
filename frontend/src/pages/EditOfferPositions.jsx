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

  useEffect(() => {
    // Angebotsdetails laden
    fetch(`https://db.xocore.de/cart/offer/${id}`)
      .then((response) => response.json())
      .then((data) => setOffer(data))
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
      offer_id: id,  // Angebot ID hinzufügen
    };
  
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

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Berechnung der Gesamtsumme
  const totalPrice = positions.reduce((acc, pos) => acc + (parseFloat(pos.product_price_sum) || 0), 0);
  const totalDays = positions.reduce((acc, pos) => acc + (parseFloat(pos.positions_product_quantity) || 0), 0);


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
    <h2 className="text-2xl font-bold mb-4">Angebot: {offer.offer_partner}</h2>
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

  </div>
</div>


      )}

    {/* Gesamtsumme und Teilnehmeranzahl */}
    <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex justify-between items-center">
      <h3 className="text-xl font-semibold">Gesamtsumme</h3>
      <p className="text-lg font-medium">{positions.reduce((total, pos) => total + (parseFloat(pos.product_price_sum) || 0), 0).toFixed(2)} €</p>
      <p>Teilnehmeranzahl: <strong>{offer.offer_teilnehmer}</strong></p> {/* Hier wird die Teilnehmeranzahl angezeigt */}
      <p>Projektumfang: <strong>{totalDays} Tage </strong></p> {/* Hier wird die Teilnehmeranzahl angezeigt */}

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
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {product.product_name}
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
    </div>
  );
}

export default OfferEditDetails;
