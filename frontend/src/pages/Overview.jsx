import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Overview() {
  const [positions, setPositions] = useState([]);
  const [offer, setOffer] = useState([]);
  const [conceptInfo, setConceptInfo] = useState([]);

  const formatNumber = (zahl) => {
    if (isNaN(zahl)) return "Ungültige Zahl"; // Fehlerhandling
    return Number(zahl).toLocaleString("de-DE");
  };
  
  const [products, setProducts] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // Für das Modal
  const { id } = useParams();
  const concept = localStorage.getItem("concept");

  const labels = { 2: "Läuft bestens", 1: "Optimierungsbedarf", 0: "Entwicklungsbedarf" };
  

  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [description3, setDescription3] = useState("");

  useEffect(() => {
    // Fetch offer positions
    fetch(`https://db.xocore.de/cart/2/offer/positions/${id}`)
      .then(response => response.json())
      .then(data => {
        // Sortieren nach positions_product_id
        const sortedData = data.sort((a, b) => a.positions_product_id - b.positions_product_id);
  
        setPositions(sortedData);
  
        // Convert product_price_sum to numbers and calculate the total sum
        const sum = sortedData.reduce((acc, position) => {
          const priceSum = parseFloat(position.product_price_sum) || 0; // Convert to number, default to 0 if NaN
          return acc + priceSum;
        }, 0);
  
        setTotalSum(sum);
      })
      .catch(error => console.error('Error fetching positions:', error));
  }, [id]);
  

  useEffect(() => {
    // Fetch offer positions
    fetch(`https://db.xocore.de/cart/2/offer/${id}`)
      .then(response => response.json())
      .then(data => {
        setOffer(data);


 

      })
      .catch(error => console.error('Error fetching positions:', error));
  }, []);
  const questionLabel1 = labels[offer.offer_question_a] || "Unbekannt";
  const questionLabel2 = labels[offer.offer_question_b] || "Unbekannt";
  const questionLabel3 = labels[offer.offer_question_c] || "Unbekannt";

  useEffect(() => {
    fetch(`https://db.xocore.de/cart/2/questions/offer/${id}`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          switch (item.type) {
            case 1:
              setDescription1(item.description);
              break;
              case 2:
              setDescription2(item.description);
              break;
              case 3:
                setDescription3(item.description);
              break;
            default:
              break;
          }
          console.log(data)
        });
      })
      .catch((error) => console.error("Error fetching concept info:", error));
  }, [id]);


  useEffect(() => {
    // Fetch the product data for each position's product ID
    positions.forEach(position => {
      fetch(`https://db.xocore.de/cart/2/product/${position.positions_id}`)
        .then(response => response.json())
        .then(productData => {
          setProducts(prevProducts => ({
            ...prevProducts,
            [position.positions_product_id]: productData,
          }));
        })
        .catch(error => console.error('Error fetching product data:', error));
    });
  }, [positions]);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handlePrint = () => {
    window.print();
  };
  async function downloadPdf() {
    try {
      const endpoint = `https://db.xocore.de/offer/pdf/${offer.offer_id}`;
  
      const response = await fetch(endpoint, {
        method: 'POST'
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Angebot_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Speicher freigeben
      } else {
        console.error('Fehler beim Abrufen des PDFs. Status:', response.status);
      }
    } catch (error) {
      console.error('Fehler beim Herunterladen des PDFs:', error);
    }
  }



  // Helper function to convert minutes to whole days
  const convertMinutesToDays = (minutes) => Math.floor(minutes / 360*100)/100;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">Deine Bildungsreise</h1>
        {/* <button
          onClick={handlePrint}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
        >
          Angebot drucken
        </button> */}
        <button
          onClick={downloadPdf}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
        >
          Angebot  drucken 
        </button>
        
        
      </div>

      <div className="grid grid-cols-1 gap-4">

<div    
        className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col relative"
      >
    <div className="flex justify-between items-start">

    <h2 className="text-xl font-semibold text-gray-900">Deine Angaben </h2>
    </div>
    <p className="text-gray-700 mt-2">Dein Team "{offer.offer_teamname}" besteht aus {offer.offer_teilnehmer} Teilnehmer.</p>
    <p className="text-gray-700 font-semibold mt-2">Entsprechend der angegebenen digitalen Arbeitsquote des Teams werden Trainings und Coachings zu ca. {offer.offer_teamdigital}% digital und Reviews generell digital durchgeführt.</p>
    {/* <p className="text-gray-700 font-semibold mt-2">Es sollen {offer.offer_internetrainer} Führungskräfte als Trainer ausgebildet werden.</p> */}

    <p className="text-gray-700 font-semibold mt-2"> Daneben verfügt Dein Team über folgende Stärkenausprägung:</p>

<p className="text-gray-700 mt-2">{description1} - {questionLabel1} </p>
<p className="text-gray-700 mt-2">{description2} - {questionLabel2}</p>
<p className="text-gray-700 mt-2">{description3} - {questionLabel3}</p>
<p className="text-gray-700 mt-2"></p>
<p className="text-gray-700 font-semibold mt-2">Deine Ausgangssituation:</p>
<p className="text-gray-700 mt-2">{offer.offer_teamnotice}</p>
<p className="text-gray-700 font-semibold mt-2">Ziel der Bildungsreise:</p>
<p className="text-gray-700 mt-2">{offer.offer_teamgoal}</p>



    </div>


</div>
<div className="flex justify-between items-center mt-6"></div>


      <div className="grid grid-cols-1 gap-4">
        {positions.map(position => {
          const product = products[position.positions_product_id];
          return product ? (
            <div
              key={position.positions_id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col relative"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{position.positions_product_name} </h2>
                <span className="text-lg font-bold text-gray-600">{`${formatNumber(position.product_price_sum)} EUR`}</span>
              </div>
              {position.positions_product_attribut === 4
                  ? `${position.positions_product_quantity} Stücke je ${formatNumber(position.positions_product_price)} EUR`
                  : `Geplante Tag/e: ${position.positions_product_quantity} Tag/e je Tagessatz ${formatNumber(position.positions_product_price)} EUR`}


              <div className="flex justify-end mt-auto">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Mehr erfahren
                </button>
              </div>
            </div>
          ) : null;
        })}
      </div>

      {/* Gesamtsumme */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-2xl font-bold">Gesamtpreis des Angebots:</h2>
        <span className="text-xl font-bold text-gray-900">{`${formatNumber(totalSum.toFixed(2))} EUR`}</span>
      </div>

      {/* Hinweistext */}
      <p className="text-sm text-gray-600 mt-2">Angebot versteht sich -netto- zzgl. der geltenden Umsatzsteuer</p>
      <p className="text-sm text-gray-600 mt-2">zzgl. Fahrtkosten von 0,45 EUR je Kilometer und Übernachtung mit Frühstück zur Vortagesanreise</p>

      {/* Modal */}
      {selectedProduct && 
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{selectedProduct.positions_product_name}</h2>
            </div>
            <p className="text-gray-700 mb-4">
              {selectedProduct.positions_product_product_description || 'Keine lange Beschreibung verfügbar.'}
            </p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Ziel der Maßnahme</h3>
            <p className="text-gray-700 mb-4">
              {selectedProduct.positions_product_goal || 'Keine lange Beschreibung verfügbar.'}
            </p>

            <div className="flex flex-col md:flex-row justify-between mt-4">
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Umfang und Methode</h3>
                <p className="text-gray-500">
                  Seminartag/e je Gruppe: {convertMinutesToDays(selectedProduct.positions_product_duration_seminar)} Tage
                </p>
                <p className="text-gray-500">
                  Coachingtag/e je Teilnehmer: {convertMinutesToDays(selectedProduct.positions_product_duration_coaching)} Tage
                </p>
                <p className="text-gray-500">
                  Trainingstag/e je Teilnehmer: {convertMinutesToDays(selectedProduct.positions_product_duration_training)} Tage
                </p>
              </div>
              <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-4">
                <h3 className="text-xl font-semibold mb-2">Seminar & Coachinginhalt</h3>
                <ul className="list-disc list-inside text-gray-700">
       {/* Dynamisches Rendern der Inhalte */}
       {selectedProduct.positions_product_inhalt?.split(';').map((inhalt, index) => (
              <li key={index}>{inhalt.trim()}</li>
            ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Overview;
