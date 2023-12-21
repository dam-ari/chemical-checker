// content.js
// import { isHazardousUrl } from "./config.js";
var isHazardousUrl = "https://silver-box.npkn.net/is-hazardous/";

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  analyzeText(request.text);
});

// Function to send POST request and analyze text
async function analyzeText(text) {
  // Split the text by common delimiters like commas, new lines, semicolons, etc.
  const ingredients = text
    .split(/,|\n|;/)
    .map((ingredient) => ingredient.trim());

  try {
    const response = await fetch(isHazardousUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: ingredients }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const hazardousIngredients = await response
      .json()
      .then((data) => data.hazardousItems);

    // Check if the response array is empty
    if (hazardousIngredients.length === 0) {
      showToast("So far so good", "success");
    } else {
      const problematicList = hazardousIngredients.join(", ");
      showToast(`Problematic ingredients found: ${problematicList}`, "warning");
    }
  } catch (error) {
    console.error("Error analyzing ingredients:", error);
    showToast("An error occurred while analyzing ingredients.", "error");
  }
}

function showToast(message, type) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  // Style the toast message
  const messageText = document.createElement("span");
  messageText.textContent = message;
  messageText.style.flex = "1";
  messageText.style.marginRight = "10px"; // Space between message and button
  toast.appendChild(messageText);

  // Add a close button for warning and error toasts
  if (type === "warning" || type === "error") {
    const closeButton = document.createElement("button");
    closeButton.textContent = "×"; // Use a times character for the button
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.color = "#333";
    closeButton.style.fontSize = "16px";
    closeButton.style.lineHeight = "1";
    closeButton.style.padding = "0 12px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontWeight = "bold";
    closeButton.onclick = function () {
      toastContainer.removeChild(toast);
    };
    toast.appendChild(closeButton);
  }

  // Apply styling to the toast container and toast
  applyToastStyling(toastContainer, toast, type);

  // Automatically dismiss success toasts after 5 seconds
  if (type === "success" || type === "error") {
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 5000);
  }

  toastContainer.appendChild(toast);
}

function applyToastStyling(toastContainer, toast, type) {
  // Styles for toast container
  toastContainer.style.position = "fixed";
  toastContainer.style.bottom = "20px";
  toastContainer.style.right = "20px";
  toastContainer.style.zIndex = "10000";
  toastContainer.style.fontFamily = "'Open Sans', sans-serif"; // Use Google Font

  // Styles for individual toast
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.justifyContent = "space-between";
  toast.style.minWidth = "250px";
  toast.style.marginBottom = "5px";
  toast.style.padding = "12px";
  toast.style.border = "1px solid #d3d3d3";
  toast.style.backgroundColor =
    type === "success" ? "#dff0d8" : type === "warning" ? "#fcf8e3" : "#f2dede";
  toast.style.color = "#333";
  toast.style.cursor = "pointer";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
}
