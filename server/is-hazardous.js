/**
 * @param {NapkinRequest} req
 * @param {NapkinResponse} res
 */
const axios = require("axios");

export default async (req, res) => {
  try {
    // Retrieve the hazardous list from your existing service
    const response = await axios.get(
      "https://silver-box.npkn.net/hazardous-list"
    );
    const knownProblematicIngredients = response.data; // Adjust according to the actual response structure
    // Get the list of items to check from the request body
    const itemsToCheck = req.body?.items;
    console.log(knownProblematicIngredients);

    if (itemsToCheck) {
      // Check each item and filter out hazardous ones
      const hazardousItems = itemsToCheck.filter((itemToCheck) =>
        knownProblematicIngredients.some(
          (knownItem) => knownItem.toLowerCase() === itemToCheck.toLowerCase()
        )
      );

      res.headers["my-header"] = "hello";
      res.headers["Access-Control-Allow-Origin"] = "*";
      res.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
      res.headers["Access-Control-Allow-Headers"] = "Content-Type";

      // Send the result back
      res.json({ hazardousItems });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
