# TaxAdvisor

An AI-powered tax software product recommendation web application built for the Quaid-e-Azam Solar Power IT Officer position assignment.

---

## Short Description

TaxAdvisor helps users choose the right tax software product based on their tax situation. Users can view and compare products, complete a recommendation wizard, ask an AI assistant questions, and administrators can inspect product configurations.

---

## Tech Stack

| Layer    | Technology                             |
|----------|----------------------------------------|
| Frontend | Next.js 16 (App Router), TypeScript    |
| Styling  | Tailwind CSS v4                        |
| Backend  | Next.js API Routes (built-in)          |
| AI       | Simulated AI assistant (keyword-based) |
| Runtime  | Node.js                                |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
cd tax-advisor
npm install
```

### Run (Development)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build (Production)

```bash
npm run build
npm start
```

---

## Environment Variables

No environment variables are required for the default simulated AI assistant.


```
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

**Important:** Never expose API keys in frontend code.

---

## Routes / Pages Implemented

| Route              | Description                                      |
|--------------------|--------------------------------------------------|
| `/`                | Landing page with hero, product previews, FAQ    |
| `/products`        | All products with filter, sort, and search       |
| `/compare`         | Full feature comparison table                    |
| `/recommend`       | Multi-step recommendation wizard                 |
| `/assistant`       | AI assistant chat interface                      |
| `/admin/products`  | Admin product config viewer with validation      |
| `/api/products`    | GET — returns all products as JSON               |
| `/api/recommend`   | POST — accepts answers, returns recommendation   |
| `/api/assistant`   | POST — accepts question, returns AI response     |

---

## Product Data Structure

Products are stored in `data/products.ts` as a typed array. No product data is hardcoded inside UI components.

```typescript
export type Product = {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  description: string;
  bestFor: string[];
  category: "personal" | "self-employed" | "expert" | "corporate";
  supports: {
    salaryIncome: boolean;
    studentIncome: boolean;
    medicalExpenses: boolean;
    donations: boolean;
    employmentExpenses: boolean;
    investmentIncome: boolean;
    capitalGains: boolean;
    foreignIncome: boolean;
    rentalIncome: boolean;
    freelanceIncome: boolean;
    gigWorkIncome: boolean;
    businessExpenses: boolean;
    homeOfficeExpenses: boolean;
    vehicleExpenses: boolean;
    expertHelp: boolean;
    fullService: boolean;
    corporateFiling: boolean;
    nilCorporateReturn: boolean;
  };
};
```

8 products are configured: Free, Deluxe, Premier, Self-Employed, Expert Assist, Expert Full Service, Business Corporate, Nil Corporate Return.

---

## Recommendation Engine

**Location:** `lib/recommendationEngine.ts`

The recommendation logic is completely separated from UI components. It is called by the `/api/recommend` API route.

**Priority order (highest to lowest):**

1. **Incorporated company** → Business Corporate (with revenue) or Nil Corporate Return (no revenue)
2. **Expert Full Service** → if user wants an expert to file for them
3. **Expert Assist** → if user wants expert help while filing
4. **Self-Employed** → if freelance/gig/business income or expenses selected
5. **Premier** → if investment, capital gains, rental, or foreign income selected
6. **Deluxe** → if medical expenses, donations, or employment expenses selected
7. **Free** → simple personal return with no complex needs

The engine returns a `RecommendationResult` object with:
- recommended product ID, name, and price
- confidence level (low / medium / high)
- reasons (human-readable array)
- matched inputs
- optional upgrade suggestion
- warnings (if applicable)
- disclaimer

---

## AI Assistant

**Location:** `lib/aiAssistant.ts` and `app/api/assistant/route.ts`

The assistant uses **Option B: Simulated AI** — a keyword-based matching system.

How it works:
1. The user's question is checked against unsafe patterns (refund guarantees, legal advice, etc.)
2. If unsafe, a safety disclaimer response is returned
3. Otherwise, the question is matched against a keyword ruleset
4. Each rule maps keyword patterns to product recommendations and explanations
5. A fallback is returned if no rule matches

The simulated assistant:
- accepts natural language input
- detects keywords using regular expressions
- maps questions to product rules
- returns structured responses with reasons and disclaimers
- never provides tax, legal, or financial advice

A `buildSystemPrompt()` function is also available in `lib/aiAssistant.ts` for easy integration with a real AI API (Claude, OpenAI, Gemini) in the future.

---

## Admin / Config Page

**Route:** `/admin/products`

The admin page displays all product configurations in a structured, readable view. Features:
- Lists all products with validation status
- Click any product to inspect its full configuration
- Shows supported and unsupported features as labeled badges
- Runs schema validation and highlights missing or invalid fields
- Displays raw JSON for each product
- Export all products as a JSON file (client-side download)

The page is read-only. It demonstrates clean data-driven configuration display.

---

## Manual Verification

All scenarios from the assignment were manually tested:

| Scenario                              | Expected Result          | Status |
|---------------------------------------|--------------------------|--------|
| Salary only, no deductions, file self | Free                     | PASS   |
| Salary + donations                    | Deluxe                   | PASS   |
| Investment income                     | Premier                  | PASS   |
| Rental income                         | Premier                  | PASS   |
| Freelance income                      | Self-Employed            | PASS   |
| Home-office expenses                  | Self-Employed            | PASS   |
| Wants expert help while filing        | Expert Assist            | PASS   |
| Wants expert to file for them         | Expert Full Service      | PASS   |
| Incorporated company with revenue     | Business Corporate       | PASS   |
| Incorporated company with no revenue  | Nil Corporate Return     | PASS   |
| AI asked about refund guarantee       | Safe disclaimer response | PASS   |

**How to verify manually:**
1. Start the app: `npm run dev`
2. Navigate to `/recommend`
3. Complete the wizard for each scenario above
4. Check the result screen for the expected product

For AI safety:
1. Navigate to `/assistant`
2. Type: "Can you guarantee I will get a refund?"
3. Verify the assistant returns a disclaimer, not a guarantee

---

## Known Limitations

- AI assistant is simulated — it uses keyword matching, not a true language model
- No persistent storage — all data is in-memory TypeScript files
- Admin page is read-only — editable config would require a backend database
- No authentication on the admin page
- Wizard state is not persisted to localStorage (bonus feature not implemented)

---

## Future Improvements

- Integrate a real AI API (Claude / OpenAI) using the `buildSystemPrompt()` helper
- Add localStorage persistence for wizard progress
- Make admin page editable with schema validation on save
- Add dark mode support
- Add automated tests for the recommendation engine
- Deploy to Vercel with CI/CD
- Add PDF export of recommendation result
- Add multilingual support (French for Canadian market)

---

## Use of AI During Development

**AI tools used:** Claude (Anthropic)

**What was AI-assisted:**
- Scaffolding the full project structure and file layout
- Writing all TypeScript types, product data, and recommendation engine logic
- Building all page components (landing, products, compare, wizard, assistant, admin)
- Writing the simulated AI assistant keyword matching system
- Writing this README

**How output was reviewed:**
- All recommendation rules were verified against the assignment specification
- Each rule's priority order was cross-checked with the PDF document
- The product data was manually compared against the 8 products in the specification
- All API routes and validation logic were reviewed for correctness
- The AI safety rules were verified to handle unsafe prompts correctly

**What was written manually:**
- The assignment requirements were read and interpreted from the PDF
- Product data values were manually extracted from the specification
- Recommendation rule priorities were manually verified
- This README's manual verification table was completed after testing

---

*This recommendation tool provides general product guidance only and is not tax, legal, or financial advice.*
