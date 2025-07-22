let client;
let ticketNumber;

init();

async function init() {
  client = await app.initialized();
  client.events.on("app.activated", onAppActiveHandler);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");

  app.initialized().then(function () {
    document.getElementById("open-page").addEventListener("click", async function () {
      try {
        // Make sure ticketNumber is retrieved freshly on button click
        const data = await client.data.get("ticket");
        const ticketId = data.ticket.id;
        console.log("Ticket ID in click:", ticketId);

        let freshdeskURL = "https://realityinteractive.freshdesk.com/a/apps/ri-freshdesk-internal-fast-help";
        const currentUrl = "https://realityinteractive.freshdesk.com/a/tickets/" + ticketId;
        freshdeskURL = freshdeskURL + "?key=" + currentUrl;
        /* Store the freshdeskURL in sessionStorage */  
        localStorage.setItem('grabbedURL', currentUrl); 
        window.open(freshdeskURL, "_blank");
      } catch (err) {
        console.error("Failed to retrieve ticket ID on button click:", err);
      }
    });
  }).catch(function (err) {
    console.error("Oh no! App initialization failed:", err);
  });

  console.log("and exiting addEventListener for DOMContentLoaded");
});
