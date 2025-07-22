document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    const client = _client;

    // Optional: resize the sidebar height
    client.instance.resize({ height: "400px" });

    // Button click to open full-page app
    const button = document.getElementById("launch-full-page");
    if (button) {
      button.addEventListener("click", function () {
        client.interface.navigateTo("full_page_app");
      });
    }

    // You can also add logic to populate the requester name here if needed
  });
});
