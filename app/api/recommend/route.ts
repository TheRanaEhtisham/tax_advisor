import { getRecommendation } from "@/lib/recommendationEngine";
import { QuestionnaireAnswers } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers = body as QuestionnaireAnswers;

    if (!answers.filingType) {
      return Response.json(
        { error: "Filing type is required." },
        { status: 400 }
      );
    }
    if (!answers.incomeSources || answers.incomeSources.length === 0) {
      return Response.json(
        { error: "At least one income source is required." },
        { status: 400 }
      );
    }
    if (!answers.helpPreference) {
      return Response.json(
        { error: "Help preference is required." },
        { status: 400 }
      );
    }
    if (answers.filingType === "incorporated" && answers.hasRevenue === null) {
      return Response.json(
        { error: "Company revenue answer is required for incorporated companies." },
        { status: 400 }
      );
    }

    const result = getRecommendation(answers);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
}
