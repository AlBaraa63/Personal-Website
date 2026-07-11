// Vercel Edge Function — Holo-AI backend.
//
// Wraps Google Gemini with a grounded system prompt + tool
// definitions so the AI can drive HOLO-OS via tool calls. Returns
// { message: string, actions?: HoloAction[] } to the frontend.
//
// Environment: set GOOGLE_GENERATIVE_AI_API_KEY in the Vercel project's env vars.
// Runtime: Edge

import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const config = { runtime: 'edge' };

// Stable IDs for HOLO-OS windows — must match the launcher in src/components/os/Desktop.tsx.
const APP_IDS = ['bio', 'projects', 'experience', 'contact', 'terminal', 'settings', 'retro', 'neural'] as const;

// Compact profile + project context. Slim enough to stay cacheable, rich enough
// for the model to answer factual questions without paraphrasing.
const PROFILE = `
NAME       : AlBaraa AlOlabi
ROLE       : AI Engineer & Computer Vision Specialist
POSITION   : AI & Data Science Intern @ Abu Dhabi Social Support Authority (Jun 2026 – present)
             Research Assistant @ Al Ain University (Feb 2025 – present)
EDUCATION  : B.Sc. Computer Science — Al Ain University (expected Aug 2026)
             42 Abu Dhabi Piscine — completed (Jun–Jul 2026)
LOCATION   : Abu Dhabi, United Arab Emirates
STATUS     : Open to opportunities
GITHUB     : github.com/AlBaraa63
LINKEDIN   : linkedin.com/in/albaraa-alolabi
HUGGINGFACE: huggingface.co/AlBaraa63
EMAIL      : 666645@gmail.com

CORE STACK : Python, PyTorch, TensorFlow/Keras, OpenCV, YOLOv8, MediaPipe,
             TFLite (INT8 Quantization), ONNX, FAISS, RAG, MCP (Model Context Protocol)
LANGUAGES  : Python, C++, C, Kotlin
WEB/DEPLOY : FastAPI, Flask, Streamlit, Gradio, Docker, React, React Native,
             Android (Kotlin/Jetpack Compose), GitHub Actions CI/CD

CERTIFICATIONS:
- CS50x (2024), CS50P (2025), CS50AI (2026) — Harvard University
- Samsung Innovation Campus — AI & ML (2025)
- Introduction to Computer Vision and Image Processing — IBM / edX (2024)

PUBLICATIONS:
- IEEE SNAMS 2025 (published, sole author): "The Impact of Artificial Intelligence
  in Education on Student Learning Outcomes and Teaching Methods"
- IEEE JBHI (under review, first author): "F-UNet: A Modular Encoder-Decoder
  Framework for Parameter-Efficient Medical Image Segmentation"
- SRC'26 (poster, presented Jun 2026): "Novel Parameter-Efficient Encoder–Decoder
  Architecture for Multi-Modal Medical Image Segmentation"

EXPERIENCE:
- AI & Data Science Intern @ Abu Dhabi Social Support Authority (Jun 2026 – present)
  Survey-data QA with clustering-based anomaly detection, causal inference research,
  SHAP-explained ML pipeline for beneficiary outcomes, web-based QA tooling.
- Research Assistant @ Al Ain University (Feb 2025 – present)
  F-UNet medical segmentation (82% fewer parameters, 5.39M) + AIED research.
- Computer Vision Intern @ Cellula Technologies (Jan – Apr 2026)
  97.67% 7-class dental CNN (2.7M params), satellite flood segmentation (0.854 IoU),
  retail action-recognition model evaluation (MoViNet, VideoMAE, TimeSformer).
- Selected Participant — Samsung Innovation Campus AI & ML (Sep 2025 – Dec 2025)
  MobileNetV2 hazard detection for assistive navigation. 3,000+ images, 85% accuracy.

PROJECTS (id — title — one-line summary):
- cleancity-agent — CleanCity Agent — agentic trash-photo→cleanup-campaign system (YOLOv8 + MCP), built for Anthropic's MCP 1st Birthday Hackathon; 89% trash reduction in pilot
- f-unet — F-UNet — modular medical segmentation framework, 82% smaller than U-Net baselines
- tomato-care — TomatoCare — fully offline bilingual Android disease-diagnosis app, 3-stage TFLite cascade, 12–20 ms on-device inference
- mafqood — Mafqood — AI lost & found platform for Dubai (YOLOv8 + ResNet50 + FAISS, <10ms vector search)
- water-body-segmentation — Satellite Water Body Segmentation — MiT-B2 on Sentinel-2 imagery, 0.854 IoU
- microscope-copilot — Microscope Copilot — educational microscopy AI lab assistant (Gemini Vision)
- (Tell the user to open the Projects window — \`open_window\` with id "projects" — for the full catalog. There are roughly 21 projects across AI/CV, Web, and Robotics.)
`.trim();

const SYSTEM_PROMPT = `You are Holo-AI — the concierge AI embedded in AlBaraa AlOlabi's portfolio operating system (HOLO-OS).

Your job:
1. Answer questions about AlBaraa (role, skills, experience, projects, contact) accurately and concisely.
2. DRIVE THE OS when the user asks to see something. Call the right tool — don't just describe what you would do.
3. Keep replies to 1–3 short sentences. The user is reading them in a chat bubble inside a portfolio site, not a chatbot console.

When choosing between text and a tool:
- "open my projects", "show me your CV", "take me to contact" → call open_window with the matching id.
- "close everything", "clear the desktop" → call close_all or minimize_all.
- "tell me about X project" → if you know the project ID, call open_project AND give a short text intro.
- Pure factual Q&A → reply with text only, no tool call.

Be honest. If you don't know something, say so — don't invent.

=== PROFILE & CONTEXT ===
${PROFILE}

=== AVAILABLE WINDOWS ===
bio          — Identity / profile.json + résumé download
projects     — Project Database (filterable, deep-linkable)
experience   — Career & education timeline
contact      — Comm Link · sends a real email via EmailJS
terminal     — SysAdmin shell (commands drive the OS)
settings     — System Config (theme, accent, audio)
retro        — // easter_egg.exe (Neon Snake)
neural       — That's you (the Holo-AI window itself)
`;

// Frontend mirror of HoloAction — kept in sync with src/components/apps/holoAI.ts
type HoloAction =
    | { type: 'open_window'; id: string }
    | { type: 'close_window'; id: string }
    | { type: 'focus_window'; id: string }
    | { type: 'minimize_all' }
    | { type: 'close_all' }
    | { type: 'open_project'; id: string };

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            'content-type': 'application/json',
            'cache-control': 'no-store',
        },
    });

export default async function handler(req: Request): Promise<Response> {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'access-control-allow-origin': '*',
                'access-control-allow-methods': 'POST, OPTIONS',
                'access-control-allow-headers': 'content-type',
            },
        });
    }
    if (req.method !== 'POST') {
        return jsonResponse({ error: 'method_not_allowed' }, 405);
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        return jsonResponse({ error: 'server_not_configured' }, 500);
    }

    let body: { message?: unknown };
    try {
        body = await req.json();
    } catch {
        return jsonResponse({ error: 'invalid_json' }, 400);
    }

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) return jsonResponse({ error: 'missing_message' }, 400);
    if (message.length > 2000) return jsonResponse({ error: 'message_too_long' }, 413);

    try {
        const { text, toolCalls } = await generateText({
            model: google('gemini-1.5-flash'),
            system: SYSTEM_PROMPT,
            prompt: message,
            maxTokens: 512,
            tools: {
                open_window: tool({
                    description: 'Open an HOLO-OS app window. Use when the user asks to see, launch, or open something.',
                    parameters: z.object({ id: z.enum(APP_IDS).describe('Window id to open') }),
                }),
                close_window: tool({
                    description: 'Close a specific app window the user named.',
                    parameters: z.object({ id: z.enum(APP_IDS) }),
                }),
                focus_window: tool({
                    description: 'Bring an already-open window to the front and focus it.',
                    parameters: z.object({ id: z.enum(APP_IDS) }),
                }),
                minimize_all: tool({
                    description: 'Minimize every open window — equivalent to "show desktop".',
                    parameters: z.object({}),
                }),
                close_all: tool({
                    description: 'Close every open window — clears the desktop. Use when the user says "close everything" or similar.',
                    parameters: z.object({}),
                }),
                open_project: tool({
                    description: 'Deep-link to a specific project. Opens the Projects window and selects that project. Use the project id (not the title).',
                    parameters: z.object({ id: z.string().describe('Project id (kebab-case, e.g. "microscope-copilot")') }),
                }),
            },
        });

        const actions: HoloAction[] = [];
        for (const call of toolCalls) {
            const name = call.toolName;
            const input = call.args as any;
            
            if (name === 'open_window') actions.push({ type: 'open_window', id: input.id });
            if (name === 'close_window') actions.push({ type: 'close_window', id: input.id });
            if (name === 'focus_window') actions.push({ type: 'focus_window', id: input.id });
            if (name === 'minimize_all') actions.push({ type: 'minimize_all' });
            if (name === 'close_all') actions.push({ type: 'close_all' });
            if (name === 'open_project') actions.push({ type: 'open_project', id: input.id });
        }

        const out: { message: string; actions?: HoloAction[] } = {
            message: text.trim() || 'Done.',
        };
        if (actions.length > 0) out.actions = actions;

        return jsonResponse(out);
    } catch (err: any) {
        console.error('[chat] upstream fetch failed:', err);
        return jsonResponse({ error: 'upstream_error', message: err?.message || 'Unknown error' }, 502);
    }
}
