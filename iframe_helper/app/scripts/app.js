// Declare global variables for the Freshdesk client and ticket number
let client;
let ticketNumber;

// Function to refresh the iframe or reload the window if iframe is not found
function refreshIframe() {
  const iframe = document.getElementById('iframe');
  if (iframe) {
    // Reload the iframe content
    iframe.contentWindow.location.reload(true);
  } else {
    // Fallback: reload the entire window if iframe is missing
    window.location.reload();
  }
}

// Function to store a URL in localStorage with error handling and verification
function storeURL(url) {
  try {
    // Store the URL under the key 'grabbedURL'
    localStorage.setItem('grabbedURL', url);
    console.log("Successfully stored URL in localStorage:", url);
    
    // Verify that the URL was stored correctly
    const stored = localStorage.getItem('grabbedURL');
    if (stored === url) {
      console.log("Verified: URL stored correctly in localStorage");
      return true;
    } else {
      console.error("Storage verification failed. Expected:", url, "Got:", stored);
      return false;
    }
  } catch (error) {
    // Log any errors that occur during storage
    console.error("Failed to store URL in localStorage:", error);
    return false;
  }
}

// UI helper function to show a message in the message container
function showMessage(message, type = 'error') {
  const container = document.getElementById('message-container');
  if (container) {
    // Display the message with the appropriate type (error/success)
    container.innerHTML = `<div class="${type}-message">${message}</div>`;
  }
}

// UI helper function to clear any messages from the message container
function clearMessage() {
  const container = document.getElementById('message-container');
  if (container) {
    container.innerHTML = '';
  }
}

// UI helper function to show or hide a loading indicator and disable/enable the button
function setLoading(loading) {
  const loadingEl = document.getElementById('loading');
  const button = document.getElementById('open-page');
  
  if (loadingEl) {
    loadingEl.textContent = loading ? 'Initializing...' : '';
    loadingEl.style.display = loading ? 'block' : 'none';
  }
  
  if (button) {
    button.disabled = loading;
  }
}

// UI helper function to set the button text
function setButtonText(text) {
  const button = document.getElementById('open-page');
  if (button) {
    button.textContent = text;
  }
}

// Handler for the main button click event
function handleButtonClick() {
  setButtonText("Loading...");
  clearMessage();
  
  // Ensure the client is initialized and has the data property
  if (!client || !client.data) {
    console.error("Client or client.data is not available");
    showMessage("Application data not available. Refreshing iframe...", 'error');
    setButtonText("Get Dify Assistance");
    setTimeout(() => {
      refreshIframe();
    }, 1000);
    return;
  }

  // Retrieve the current ticket data from the Freshdesk client
  client.data.get("ticket")
    .then(data => {
      // Check that the ticket data and ticket ID are present
      if (!data || !data.ticket || !data.ticket.id) {
        console.error("Invalid ticket data received:", data);
        showMessage("Unable to retrieve ticket information. Refreshing iframe...", 'error');
        setButtonText("Get Dify Assistance");
        setTimeout(() => {
          refreshIframe();
        }, 1000);
        return;
      }
      
      // Extract the ticket ID
      const ticketId = data.ticket.id;
      console.log("Ticket ID in click:", ticketId);

      // Validate the ticket ID type
      if (!ticketId || typeof ticketId !== 'number' && typeof ticketId !== 'string') {
        console.error("Invalid ticket ID:", ticketId);
        showMessage("Invalid ticket ID received. Refreshing iframe...", 'error');
        setButtonText("Get Dify Assistance");
        setTimeout(() => {
          refreshIframe();
        }, 1000);
        return;
      }

      // Define the URLs for the Freshdesk app and the current ticket
      const freshdeskURL = "https://realityinteractive.freshdesk.com/a/apps/ri-freshdesk-internal-fast-help";
      const currentUrl = "https://realityinteractive.freshdesk.com/a/tickets/" + ticketId;
      
      // Validate the generated ticket URL before storing
      if (currentUrl && typeof currentUrl === 'string') {
        // Store the ticket URL in localStorage
        const storageSuccess = storeURL(currentUrl);
        
        if (storageSuccess) {
          console.log("URL stored successfully, opening Dify assistance...");
          showMessage("Opening Dify assistance...", 'success');
          
          // Wait a short time to ensure localStorage is updated before opening the new page
          setTimeout(() => {
            try {
              client.db.set("grabbedURL", { value: currentUrl }).then(() => {
                // Now open full-page app in new tab
                window.open(freshdeskURL, "_blank");
              });
              client.interface.trigger("navigate", { route: "fullpage" });
              setButtonText("Get Dify Assistance");
            } catch (openError) {
              // Handle errors opening the new page
              console.error("Failed to open URL:", openError);
              showMessage("Failed to open assistance page. Refreshing iframe...", 'error');
              setButtonText("Get Dify Assistance");
              setTimeout(() => {
                refreshIframe();
              }, 1000);
            }
          }, 500);
        } else {
          // Handle failure to store the URL
          console.error("Failed to store URL in localStorage");
          showMessage("Failed to prepare the assistance link. Refreshing iframe...", 'error');
          setButtonText("Get Dify Assistance");
          setTimeout(() => {
            refreshIframe();
          }, 1000);
        }
      } else {
        // Handle invalid ticket URL
        console.error("Invalid URL generated:", currentUrl);
        showMessage("Failed to generate assistance link. Refreshing iframe...", 'error');
        setButtonText("Get Dify Assistance");
        setTimeout(() => {
          refreshIframe();
        }, 1000);
      }
    })
    .catch(err => {
      // Handle errors retrieving the ticket data
      console.error("Failed to retrieve ticket ID on button click:", err);
      showMessage("An error occurred while processing your request. Refreshing iframe...", 'error');
      setButtonText("Get Dify Assistance");
      setTimeout(() => {
        refreshIframe();
      }, 1000);
    });
}

// Start the initialization process
init();

// Async initialization function for the Freshdesk app
async function init() {
  try {
    setLoading(true);
    // Initialize the Freshdesk client
    client = await app.initialized();
    // Listen for the app activation event
    client.events.on("app.activated", onAppActiveHandler);
    console.log("App initialized successfully");
    setLoading(false);
    setButtonText("Get Dify Assistance");
  } catch (error) {
    // Handle errors during initialization
    console.error("Failed to initialize app:", error);
    setLoading(false);
    showMessage("Failed to initialize the application. Refreshing iframe...", 'error');
    setTimeout(() => {
      refreshIframe();
    }, 1000);
  }
}

// Handler for the app activation event
function onAppActiveHandler() {
  try {
    console.log("App activated");
    // Ensure the client is initialized before proceeding
    if (!client) {
      console.error("Client not initialized");
      showMessage("Application not properly initialized. Refreshing iframe...", 'error');
      setTimeout(() => {
        refreshIframe();
      }, 1000);
      return;
    }
    // Clear any previous messages
    clearMessage();
  } catch (error) {
    // Handle errors in the activation handler
    console.error("Error in app activation handler:", error);
    showMessage("Error activating the application. Refreshing iframe...", 'error');
    setTimeout(() => {
      refreshIframe();
    }, 1000);
  }
}

// Wait for the DOM to be fully loaded before initializing UI and event listeners
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");

  // Initialize the Freshdesk app client
  app.initialized().then(function (clientInstance) {
    // Ensure the client instance is valid
    if (!clientInstance) {
      console.error("Client instance is null or undefined");
      showMessage("Failed to initialize client. Refreshing iframe...", 'error');
      setTimeout(() => {
        refreshIframe();
      }, 1000);
      return;
    }
    
    // Set the global client variable
    client = clientInstance;
    setLoading(false);
    setButtonText("Get Dify Assistance");
    
    // Get the main button and attach the click handler
    const button = document.getElementById("open-page");
    if (!button) {
      console.error("Button element not found");
      showMessage("Interface elements not found. Refreshing iframe...", 'error');
      setTimeout(() => {
        refreshIframe();
      }, 1000);
      return;
    }

    button.addEventListener("click", handleButtonClick);
  }).catch(function (err) {
    // Handle errors during app initialization
    console.error("Oh no! App initialization failed:", err);
    setLoading(false);
    showMessage("Failed to initialize the application. Refreshing iframe...", 'error');
    setTimeout(() => {
      refreshIframe();
    }, 1000);
  });

  console.log("and exiting addEventListener for DOMContentLoaded");
});
