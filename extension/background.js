chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "checkIngredients",
    title: "Check Ingredients",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "checkIngredients" && info.selectionText) {
    if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["content.js"],
        },
        () => {
          chrome.tabs.sendMessage(tab.id, { text: info.selectionText });
        }
      );
    } else {
      console.log(`Cannot execute scripts on ${tab.url}`);
    }
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: "window.getSelection().toString();" },
        function (selectionText) {
          executeScript(tabs[0], selectionText[0]);
        }
      );
    });
  }
});
