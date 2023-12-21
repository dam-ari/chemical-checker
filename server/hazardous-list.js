import fs from "fs";

const hList = "/opt/files/p65chemicalslist.csv";
let knownProblematicIngredients = [];

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

  let chemicals = lines
    .map((line) => {
      let [chemical] = line.split(",");
      if (chemical) {
        chemical = chemical.replace(/\\/g, "").replace(/"/g, "").trim();
        return chemical;
      }
      return "";
    })
    .filter((chemical) => chemical);

  // Remove duplicates
  chemicals = [...new Set(chemicals)];
  knownProblematicIngredients = chemicals;
}

// CSS styles
const styledBlock = `
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 2rem; background-color: #f4f4f4; color: #333; }
  h1 { color: #333; }
  #search { margin-bottom: 1rem; padding: 0.5rem; width: 300px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc; }
  .chemical-list { max-height: 70vh; overflow: auto; border: 1px solid #ccc; padding: 0; margin-top: 1rem; border-radius: 5px; background-color: #fff; }
  .chemical-list li { padding: 0.5rem 1rem; border-bottom: 1px solid #eee; }
  .chemical-list li:last-child { border-bottom: none; }
  .highlight { background-color: #fff3cd; } /* Pastel yellow highlight */
  .chemical-list a { text-decoration: none; color: inherit; cursor: pointer; }
  .chemical-list a:hover { text-decoration: underline; }
  ::-webkit-scrollbar-track {
    background: rgb(0,0,0);
    border: 4px solid transparent;
    background-clip: content-box; /* THIS IS IMPORTANT */
  }
  ::-webkit-scrollbar-thumb {
    radius: 4px
    background-color: 'green'
    background-clip: content-box; /* THIS IS IMPORTANT */
  }
  </style>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('search').addEventListener('input', function(e) {
            var value = e.target.value;
            var items = document.querySelectorAll('.chemical-list li');
            items.forEach(function(item) {
                if (value && item.textContent.toLowerCase().includes(value.toLowerCase())) {
                    item.classList.add('highlight');
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    item.classList.remove('highlight');
                }
            });
        });
    });
</script>`;

// API route handler
export default async (req, res) => {
  try {
    await loadChemicalList();
    console.log("Chemical list loaded successfully");

    const isStyled = req.params.styled;
    let content = "";

    if (isStyled) {
      // Building the HTML response
      let htmlResponse =
        "<html><head><title>Chemical List</title>" +
        styledBlock +
        "</head><body>";
      htmlResponse += "<h1>Chemical List</h1>";
      htmlResponse +=
        '<input type="text" id="search" placeholder="Search chemicals..." list="chemicalsDatalist">';
      htmlResponse += '<datalist id="chemicalsDatalist">';

      for (const chemical of knownProblematicIngredients) {
        htmlResponse += `<option value="${chemical}">`;
      }

      htmlResponse += "</datalist>";
      htmlResponse += '<ul class="chemical-list">';

      for (const chemical of knownProblematicIngredients) {
        const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
          chemical
        )}`;
        htmlResponse += `<li><a href="${wikiUrl}" target="_blank">${chemical}</a></li>`;
      }

      htmlResponse += "</ul></body></html>";
      content = htmlResponse;
    } else {
      // Sending JSON response
      content = { data: knownProblematicIngredients };
    }

    // Send the appropriate response
    if (typeof content === "string") {
      res.send(content); // Send as HTML
    } else {
      res.json(content); // Send as JSON
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("<h1>Internal Server Error</h1>");
  }
};
 