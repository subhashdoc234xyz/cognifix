<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0fde7722-148d-4684-b2e4-6141cbb5b1a4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env`, then set the required values. `GEMINI_API_KEY` remains an optional fallback when Groq is configured.
3. Run the app:
   `npm run dev`

## Wrong-answer uploads

Students can upload a PDF, Word document (`.doc` or `.docx`), or JPG, PNG, and WEBP image from their dashboard. Each upload is capped at 30 MB and stored in the student's private Supabase folder.

Before using uploads, run the complete [Supabase schema](./supabase-schema.sql) in the Supabase SQL Editor. It creates the private `wrong-answer-uploads` storage bucket, the `wrong_answer_uploads` metadata table, and row-level-security policies that restrict every file and record to its owner.

Set these server-side values in `.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or any Groq key in client-side code.

## Dedicated Groq keys by agent

Each AI endpoint uses its dedicated key first and falls back to `GROQ_API_KEY` if that dedicated key is empty:

```env
GROQ_API_KEY=optional_shared_fallback
GROQ_DIAGNOSER_API_KEY=...
GROQ_GENERATOR_API_KEY=...
GROQ_EXPLAINER_API_KEY=...
GROQ_ROADMAP_API_KEY=...
GROQ_DOCUMENT_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile
```

The diagnoser, remediation generator, explainer, and roadmap endpoints are routed independently, so their requests can use separate Groq rate limits concurrently. `GROQ_DOCUMENT_API_KEY` is reserved for the document-review agent as that workflow is expanded.
