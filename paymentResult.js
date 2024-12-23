/********************************
 * paymentResult.js
 ********************************/
let checkoutId;
let totPerson;

async function initialization() {
  const urlParams = new URLSearchParams(window.location.search);
  checkoutId = urlParams.get('session_id'); // Stripe session ID if needed
  totPerson = localStorage.getItem("totPerson");
  
  // We PATCH each person's row to mark them as PAID
  await patchPaidRows();

  // Now it’s safe to clear localStorage
  localStorage.clear();
}

/**
 * PATCH each row in SheetDB using the previously-stored UID.
 */
async function patchPaidRows() {
  for (let i = 0; i < totPerson; i++) {
    const uid = localStorage.getItem(`UID${i}`); 
    const paidVal = localStorage.getItem(`Valore${i}`) || "20";
    console.log(`Patching UID ${uid} to set valore_in_euro=${paidVal}`);

     // Prepare data to PATCH or POST to SheetDB
     const data = {
      valore_in_euro : paidVal, 
      Metodo di Pagamento : "stripe",
      capodanno : "TRUE", // or your logic
      registration_time : localStorage.getItem("Date")
      }
    };

    const endpointUrl =`https://sheetdb.io/api/v1/w9iqfm0vgapyk/UID/${uid}`;

    const response = await fetch(endpointUrl, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const data = await response.json();
    console.log("PATCH response for UID:", uid, data);
  }