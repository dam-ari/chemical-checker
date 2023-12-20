
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.text) {
        analyzeText(request.text);
    }
});

function analyzeText(text) {
    // Here you will analyze the text for problematic ingredients
    // This is a placeholder for your ingredient analysis logic
    var isProblematic = false; // Set to true if problematic ingredients are found

    // For now, let's just show a message in a bubble
    showBubble(isProblematic ? 'Problematic ingredients found!' : 'So far so good');
}

function showBubble(message) {
    var bubble = document.createElement('div');
    bubble.setAttribute('class', 'ingredient-bubble');
    bubble.textContent = message;
    document.body.appendChild(bubble);

    // Position the bubble on the screen
    bubble.style.position = 'fixed';
    bubble.style.bottom = '20px';
    bubble.style.right = '20px';
    bubble.style.backgroundColor = 'white';
    bubble.style.border = '1px solid black';
    bubble.style.padding = '10px';
    bubble.style.zIndex = 1000;

    // Remove the bubble after some time
    setTimeout(function() {
        bubble.remove();
    }, 5000);
}
