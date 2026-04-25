import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateProductDescription = action({
    args: {
        name: v.string(),
        brand: v.optional(v.string()),
        gender: v.optional(v.string()),
        categoryName: v.optional(v.string()),
    },
    handler: async (_ctx, args): Promise<string> => {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not set");

        const { name, brand, gender, categoryName } = args;

        const prompt = `You are a luxury perfume copywriter for Ummie's Essence, a premium fragrance boutique in Kenya.

Write a compelling product description for the following perfume:
- Product name: ${name}
- Brand: ${brand || "Unknown"}
- Target: ${gender || "unisex"}
- Category: ${categoryName || "Perfume"}

Rules:
- 2–3 sentences maximum
- Evocative and luxurious language — paint a sensory picture
- Mention likely scent notes or character based on the name/brand if recognisable (e.g. Lattafa tends toward oud/oriental, Rave is fresh/sporty)
- Do NOT mention price or availability
- Do NOT use generic filler like "A great product for everyone"
- Output ONLY the description text, no quotes, no prefixes`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 150,
                    },
                }),
            }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini error: ${err}`);
        }

        const data = await response.json();
        const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return text.trim();
    },
});
