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
            "You are a helpful travel assistant for India. Always answer based on conversation context."
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
