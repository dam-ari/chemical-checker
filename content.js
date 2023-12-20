// Function to load and parse the CSV file
function loadChemicalList() {
  return fetch(chrome.runtime.getURL("p65chemicalslist.csv"))
    .then((response) => response.text())
    .then((text) => {
      const lines = text.split("\n");
      return lines
        .map((line) => {
          const [chemical] = line.split(",");
          return chemical ? chemical.trim() : "";
        })
        .filter((chemical) => chemical); // Filter out empty strings
    })
    .catch((error) => console.error("Error loading chemical list:", error));
}

// Load the chemical list and then initialize the extension functionalities
loadChemicalList().then((chemicals) => {
  // Append the loaded chemicals to the knownProblematicIngredients array
  knownProblematicIngredients.push(...chemicals);

  // Initialize the extension functionalities
  initializeExtension();
});

// Predefined list of problematic ingredients
const knownProblematicIngredients = [
  "Sodium Laureth Sulfate",
  "Parabens",
  "Phthalates",
  "Formaldehyde",
  "Triclosan",
  "Oxybenzone",
];

function initializeExtension() {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    analyzeText(request.text);
  });
}

function analyzeText(text) {
  // Ensure the chemical list is loaded
  if (!window.knownProblematicIngredients) {
    console.error("Chemical list not loaded yet");
    return;
  }
  // Split the text by common delimiters like commas, new lines, semicolons, etc.
  const ingredients = text
    .split(/,|\n|;/)
    .map((ingredient) => ingredient.trim());

  // Arrays to hold the results
  let riskyIngredients = [];
  let problematicIngredients = [];

  // Check each ingredient against the list of known problematic ingredients
  ingredients.forEach((ingredient) => {
    if (knownProblematicIngredients.includes(ingredient)) {
      problematicIngredients.push(ingredient);
    }
    // Assuming there is another list or condition for risky ingredients
    // You would add an else if condition here to check for risky ingredients
  });

  // Format the answer
  let message = "";
  if (problematicIngredients.length > 0) {
    message +=
      "Problematic ingredients found: " +
      problematicIngredients.join(", ") +
      ".";
  } else {
    message = "So far so good";
  }

  // If there were risky ingredients found, add them to the message
  if (riskyIngredients.length > 0) {
    message += " Risky ingredients found: " + riskyIngredients.join(", ") + ".";
  }

  // Display the message
  alert(message);
  showBubble(message);
}

function showBubble(message) {
  var bubble = document.createElement("div");
  bubble.setAttribute("class", "ingredient-bubble");
  bubble.textContent = message;
  document.body.appendChild(bubble);

  // Position the bubble on the screen
  bubble.style.position = "fixed";
  bubble.style.bottom = "20px";
  bubble.style.right = "20px";
  bubble.style.backgroundColor = "white";
  bubble.style.border = "1px solid black";
  bubble.style.padding = "10px";
  bubble.style.zIndex = 1000;

  // Remove the bubble after some time
  setTimeout(function () {
    bubble.remove();
  }, 5000);
}
