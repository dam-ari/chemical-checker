// window.onload = function () {
//   chrome.storage.local.get(["marks"], function (result) {
//     var marksDiv = document.getElementById("marks");

//     // If no marks are present, display a message
//     if (!result.marks || result.marks.length === 0) {
//       marksDiv.textContent =
//         "No saved stickies. To save a stickie, use Ctrl+I or right-click and choose the 'Add Sticky Mark' option.";
//       return;
//     }

//     // Sort the marks alphabetically by title
//     result.marks.sort((a, b) => a.title.localeCompare(b.title));

//     for (let mark of result.marks) {
//       let newMarkDiv = document.createElement("div");
//       newMarkDiv.textContent = mark.title + " - " + mark.url;
//       newMarkDiv.onclick = function () {
//         chrome.tabs.create({ url: mark.url + "#" + mark.id });
//       };

//       marksDiv.appendChild(newMarkDiv);
//     }
//   });
// };
