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
    const itemsToCheck = req.body.items;

    // Check each item and filter out hazardous ones
    const hazardousItems = itemsToCheck.filter((item) =>
      knownProblematicIngredients.includes(item)
    );

    // Send the result back
    res.json({ hazardousItems });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
