import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    // Convert history into OpenAI message format
    const formattedHistory = history.map(m => ({
      role: m.role,
      content: m.content
    }));

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful travel assistant for India. When the user asks about trips or destinations, give sightseeing, itineraries, and travel tips. When relevant, suggest hotels or accommodations, including location, price range, amenities, and whether they are suitable for families, couples, or solo travelers.Always base your answers on the conversation context."

        },
        ...formattedHistory,
        { role: "user", content: message }
      ]
    });

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
