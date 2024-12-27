/************************************************************
 * pay.js
 ************************************************************/
const stripe = Stripe('pk_live_51QAv6nBlOJumB3TbwzRFO14tmTkgA5QUj0FWnxCbF78IVvfg2LoPlH3yxvQmKn0ofSlocgjTrmHspbKKrxMC9Awq00VKm3xvdu');

async function initialization() {
  // 1) Get the 'uid' from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('uid'); // e.g., "AB123"

  if (!uid) {
    document.getElementById('error-message').textContent = 
      "Manca il parametro UID. Non posso completare il pagamento.";
    document.getElementById('error-message').style.display = "block";
    return;
  }

  try {
    // 2) Request clientSecret from your server
    const clientSecret = await createCheckoutSession(uid);

    // 3) Mount Stripe Embedded Checkout
    if (clientSecret) {
      await mountStripeCheckout(clientSecret);
    } else {
      throw new Error("clientSecret not provided by server");
    }

  } catch (error) {
    console.error("Initialization error:", error);
    document.getElementById('error-message').textContent = 
      "Si è verificato un errore durante la preparazione del pagamento.";
    document.getElementById('error-message').style.display = "block";
  }
}

/**
 * Creates a Stripe Checkout Session on your server,
 * passing 'uid' so that you know which row in the sheet to patch after payment.
 */
async function createCheckoutSession(uid) {
  // Replace with your actual server URL
  const response = await fetch("https://circolo-server-private.onrender.com/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: uid, 
      // or any other data needed (e.g. totPerson, price, etc.)
    })
  });

  if (!response.ok) {
    throw new Error("Server returned an error: " + response.statusText);
  }

  const data = await response.json();
  // Expect { clientSecret: "..." } from your server
  return data.clientSecret;
}

/**
 * Mount the Stripe Embedded Checkout using the fetched clientSecret.
 */
async function mountStripeCheckout(clientSecret) {
  // Initialize the embedded checkout
  const checkout = await stripe.initEmbeddedCheckout({
    clientSecret,
    appearance: {
      theme: 'stripe' 
      // or 'night', 'flat', etc.
    }
    // Additional config if needed
  });

  // Mount the checkout inside the #checkout div
  checkout.mount('#checkout');
}