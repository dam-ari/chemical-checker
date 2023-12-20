import fs from "fs";

const hList = "/opt/files/p65chemicalslist.csv";
const knownProblematicIngredients = [];

// API route handler
export default async (req, res) => {
  try {
    await loadChemicalList();
    console.log("Chemical list loaded successfully");

    const isStyled = req.params["styled"];

    console.log(isStyled);
    let content = "";
    if (isStyled) {
      let htmlResponse = "<html><head><title>Chemical List</title>";

      // Add CSS styles if 'styled' parameter is true
      htmlResponse += styledBlock;

      htmlResponse += "</head><body>";
      htmlResponse += "<h1>Chemical List</h1>";

      // Add search field and datalist
      htmlResponse += `<input type="text" id="search" placeholder="Search chemicals..." list="chemicalsDatalist">`;
      htmlResponse += `<datalist id="chemicalsDatalist">`;

      for (const chemical of knownProblematicIngredients) {
        htmlResponse += `<option value="${chemical}">`;
      }

      htmlResponse += `</datalist>`;

      // Display the full list of chemicals
      htmlResponse += `<ul class="chemical-list">`;
      for (const chemical of knownProblematicIngredients) {
        htmlResponse += `<li>`;

        const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
          chemical
        )}`;
        htmlResponse += `<a href="${wikiUrl}" target="_blank">${chemical}</a>`;
        htmlResponse += `</li>`;

        // htmlResponse += `<li>${chemical}</li>`;
      }
      htmlResponse += `</ul>`;

      htmlResponse += "</body></html>";
      content = htmlResponse;
    } else {
      content = knownProblematicIngredients;
    }
    res.send(content);
  } catch (error) {
    console.error("Error loading chemical list:", error);
    res.status(500).send("<h1>Internal Server Error</h1>");
  }
};

// Function to read the CSV file
function fetchFile(url) {
  try {
    const data = fs.readFileSync(url, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

// Function to load and parse the CSV file
async function loadChemicalList() {
  const text = fetchFile(hList);
  const lines = text.split("\n");
  knownProblematicIngredients.length = 0; // Clear the existing array

  let chemicals = lines
    .map((line) => {
      let [chemical] = line.split(",");
      if (chemical) {
        // Remove backslashes, double quotes, and trim
        chemical = chemical.replace(/\\/g, "").replace(/"/g, "").trim();
        return chemical;
      }
      return "";
    })
    .filter((chemical) => chemical); // Filter out empty or invalid entries

  // Remove duplicates
  chemicals = [...new Set(chemicals)];
  knownProblematicIngredients.push(chemical);
}

const styledBlock = `
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 2rem; background-color: #f4f4f4; color: #333; }
                h1 { color: #333; }
                #search { margin-bottom: 1rem; padding: 0.5rem; width: 300px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc; }
                .chemical-list { max-height: 400px; overflow: auto; border: 1px solid #ccc; padding: 0; margin-top: 1rem; border-radius: 5px; background-color: #fff; }
                .chemical-list li { padding: 0.5rem 1rem; border-bottom: 1px solid #eee; }
                .chemical-list li:last-child { border-bottom: none; }
                .highlight { background-color: #fff3cd; }
                .chemical-list a { text-decoration: none; color: inherit; cursor: pointer; }
                .chemical-list a:hover { text-decoration: underline; 
            </style>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    document.getElementById('search').addEventListener('input', function(e) {
                        var value = e.target.value;
                        var items = document.querySelectorAll('.chemical-list li');
                        items.forEach(function(item) {
                            if (item.textContent.toLowerCase().includes(value.toLowerCase())) {
                                item.classList.add('highlight');
                                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            } else {
                                item.classList.remove('highlight');
                            }
                        });
                    });
                });
            </script>`;
