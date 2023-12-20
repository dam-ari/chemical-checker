chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "checkIngredients",
    title: "Check Ingredients",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === "checkIngredients" && info.selectionText) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showIngredientsInfo,
        args: [info.selectionText],
      });
    } catch (error) {
      console.error("Error injecting script: ", error);
    }
  }
});

function showIngredientsInfo(selectedText) {
  chrome.runtime.sendMessage({ text: selectedText });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        showIngredientsInfo('your message');
    }
});