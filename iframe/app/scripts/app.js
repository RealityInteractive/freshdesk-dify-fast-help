document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired in iframe/app/scripts/app.js");
  app.initialized().then(function (_client) {
    console.log("App initialized successfully.");
    
    // Validate client instance
    if (!_client) {
      console.error("Client instance is null or undefined");
      return;
    }
    
    const client = _client;

    // Optional: resize the sidebar height
    console.log("Resizing sidebar to 400px height.");
    client.instance.resize({ height: "400px" });

    // Button click to open full-page app with proper error handling
    const button = document.getElementById("launch-full-page");
    if (button) {
      console.log("Found #launch-full-page button, adding click listener.");
      button.addEventListener("click", function () {
        try {
          console.log("Launch full-page button clicked. Navigating to full_page_app.");
          if (client.interface && typeof client.interface.navigateTo === 'function') {
            client.interface.navigateTo("full_page_app");
          } else {
            console.error("Client interface navigateTo method not available");
          }
        } catch (error) {
          console.error("Error navigating to full page app:", error);
        }
      });
    } else {
      console.warn("No #launch-full-page button found in DOM.");
    }

    // You can also add logic to populate the requester name here if needed
    console.log("DOMContentLoaded handler setup complete.");
  }).catch(function (err) {
    console.error("App initialization failed:", err);
  });
});
