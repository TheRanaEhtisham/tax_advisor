import { simulateAI } from "@/lib/aiAssistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body as { question: string };

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return Response.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    if (question.trim().length > 1000) {
      return Response.json(
        { error: "Question is too long. Please keep it under 1000 characters." },
        { status: 400 }
      );
    }

    const response = simulateAI(question.trim());
    return Response.json(response);
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
}
