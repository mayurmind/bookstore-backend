import Book from "../model/bookmodel.js";
import dotenv from "dotenv";

dotenv.config();

export const getBookInsights = async (req, res) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    return res
      .status(400)
      .json({ success: false, message: "Book ID is required" });
  }

  try {
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Construct prompt
    const prompt = `
You are an expert literary assistant.
Given the book data: ${JSON.stringify(book)}

Return a JSON object with only the following keys:
{
  "summary": "A 2–4 sentence concise summary of the book",
  "themes": ["Theme1", "Theme2", "Theme3"],
  "similarBooks": [
    { "title": "Similar Book Title 1", "author": "Author 1" },
    { "title": "Similar Book Title 2", "author": "Author 2" },
    { "title": "Similar Book Title 3", "author": "Author 3" }
  ]
}

Output must be valid JSON. No commentary, no markdown, no extra text.
`;

    // Gemini API request
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCgFZLmDn_WgcBbHGMD2B-6nd-5x-OBS7g",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract text output
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(rawText);
    } catch {
      parsedOutput = { raw: rawText }; // fallback if parsing fails
    }

    return res.status(200).json({ success: true, data: parsedOutput });
  } catch (err) {
    console.error("Gemini Insights Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate book insights",
      error: err.message,
    });
  }
};