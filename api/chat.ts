// Vercel Edge Function — Holo-AI backend.
//
// Wraps Anthropic's /v1/messages with a grounded system prompt + tool
// definitions so the AI can drive HOLO-OS via tool calls. Returns
// { message: string, actions?: HoloAction[] } to the frontend, which
// matches the shape `interpret()` returns from src/components/apps/holoAI.ts.
//
// Environment: set ANTHROPIC_API_KEY in the Vercel project's env vars.
// Runtime: Edge (no Node SDK; raw fetch only).

export const config = { runtime: 'edge' };

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5'; // fast + cheap, perfect for a concierge

// Stable IDs for HOLO-OS windows — must match the launcher in src/components/os/Desktop.tsx.
const APP_IDS = ['bio', 'projects', 'experience', 'contact', 'terminal', 'settings', 'retro', 'neural'] as const;

// Compact profile + project context. Slim enough to stay cacheable, rich enough
// for the model to answer factual questions without paraphrasing.
const PROFILE = `
NAME       : AlBaraa AlOlabi
ROLE       : AI Researcher & Computer Vision Engineer
POSITION   : Intern at Cellula Technologies (Jan 2026 – present)
EDUCATION  : Al Ain University
LOCATION   : United Arab Emirates
STATUS     : Open to opportunities
GITHUB     : github.com/AlBaraa63
LINKEDIN   : linkedin.com/in/albaraa-alolabi
EMAIL      : 666645@gmail.com

CORE STACK : Python, PyTorch, OpenCV, YOLOv8, MediaPipe, TensorFlow,
             HuggingFace BART, scikit-learn, NumPy, Pandas
LANGUAGES  : Python, C++, C, Java, TypeScript, JavaScript
WEB        : React, Node.js, FastAPI, Gradio, Streamlit, React Native, SQLite
PROTOCOLS  : MCP (Model Context Protocol)

CERTIFICATIONS:
- CS50x — Harvard University
- CS50P — Harvard University
- CS50AI — Harvard (in progress)
- Samsung Innovation Campus — AI & ML
- IEEE SNAMS 2025 — Published Author

PUBLICATIONS:
- IEEE SNAMS 2025: "The Impact of Artificial Intelligence in Education on
  Student Learning Outcomes and Teaching Methods"

EXPERIENCE:
- Computer Vision Engineer Intern @ Cellula Technologies (Jan 2026 – present)
  Building production CV pipelines with PyTorch, OpenCV, YOLOv8.
  Data preprocessing → training → evaluation → deployment.
- Selected Participant — Samsung Innovation Campus AI & ML (Sep 2025 – Dec 2025)
  Co-developed AI hazard awareness system for visually impaired using
  MobileNetV2 + transfer learning. 3,000+ images, 85% accuracy.

PROJECTS (id — title — one-line summary — top skills):
- microscope-copilot — Microscope Copilot · AI Lab Assistant — Educational AI for microscopy imaging via Gemini 3 Pro Vision; cell culture QA, contamination detection — React, TypeScript, Gemini API, Computer Vision
- (Tell the user to open the Projects window — \`open_window\` with id "projects" — for the full catalog. There are roughly 19 projects across AI/CV, Web, and Robotics.)
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

// Tool definitions. The schema mirrors the HoloAction union in src/components/apps/holoAI.ts
// so the frontend can map tool_use blocks 1:1 without translation.
const TOOLS = [
    {
        name: 'open_window',
        description: 'Open an HOLO-OS app window. Use when the user asks to see, launch, or open something.',
        input_schema: {
            type: 'object',
            properties: { id: { type: 'string', enum: APP_IDS, description: 'Window id to open' } },
            required: ['id'],
        },
    },
    {
        name: 'close_window',
        description: 'Close a specific app window the user named.',
        input_schema: {
            type: 'object',
            properties: { id: { type: 'string', enum: APP_IDS } },
            required: ['id'],
        },
    },
    {
        name: 'focus_window',
        description: 'Bring an already-open window to the front and focus it.',
        input_schema: {
            type: 'object',
            properties: { id: { type: 'string', enum: APP_IDS } },
            required: ['id'],
        },
    },
    {
        name: 'minimize_all',
        description: 'Minimize every open window — equivalent to "show desktop".',
        input_schema: { type: 'object', properties: {} },
    },
    {
        name: 'close_all',
        description: 'Close every open window — clears the desktop. Use when the user says "close everything" or similar.',
        input_schema: { type: 'object', properties: {} },
    },
    {
        name: 'open_project',
        description: 'Deep-link to a specific project. Opens the Projects window and selects that project. Use the project id (not the title).',
        input_schema: {
            type: 'object',
            properties: { id: { type: 'string', description: 'Project id (kebab-case, e.g. "microscope-copilot")' } },
            required: ['id'],
        },
    },
];

// Mark the last tool with cache_control so Anthropic caches the entire
// tool list (render order: tools → system → messages). The system prompt
// gets its own cache_control. Both are stable across requests.
const TOOLS_WITH_CACHE = TOOLS.map((t, i) =>
    i === TOOLS.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t,
);

// Frontend mirror of HoloAction — kept in sync with src/components/apps/holoAI.ts
type HoloAction =
    | { type: 'open_window'; id: string }
    | { type: 'close_window'; id: string }
    | { type: 'focus_window'; id: string }
    | { type: 'minimize_all' }
    | { type: 'close_all' }
    | { type: 'open_project'; id: string };

interface AnthropicContentBlock {
    type: string;
    text?: string;
    name?: string;
    input?: Record<string, unknown>;
}

interface AnthropicResponse {
    content?: AnthropicContentBlock[];
    stop_reason?: string;
    usage?: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
}

const mapToolToAction = (name: string, input: Record<string, unknown> = {}): HoloAction | null => {
    const id = typeof input.id === 'string' ? input.id : undefined;
    switch (name) {
        case 'open_window': return id ? { type: 'open_window', id } : null;
        case 'close_window': return id ? { type: 'close_window', id } : null;
        case 'focus_window': return id ? { type: 'focus_window', id } : null;
        case 'minimize_all': return { type: 'minimize_all' };
        case 'close_all': return { type: 'close_all' };
        case 'open_project': return id ? { type: 'open_project', id } : null;
        default: return null;
    }
};

const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            'content-type': 'application/json',
            // Lock origin if you want — for now allow same-origin only by default.
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        // Frontend gracefully falls back to the local agent on any error.
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

    let upstream: Response;
    try {
        upstream = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 512,
                // `low` effort — this is concierge Q&A, not heavy reasoning.
                // Keeps latency snappy and cost minimal.
                output_config: { effort: 'low' },
                system: [
                    {
                        type: 'text',
                        text: SYSTEM_PROMPT,
                        cache_control: { type: 'ephemeral' },
                    },
                ],
                tools: TOOLS_WITH_CACHE,
                tool_choice: { type: 'auto' },
                messages: [{ role: 'user', content: message }],
            }),
        });
    } catch (err) {
        console.error('[chat] upstream fetch failed:', err);
        return jsonResponse({ error: 'upstream_unreachable' }, 502);
    }

    if (!upstream.ok) {
        const errText = await upstream.text().catch(() => '');
        console.error('[chat] anthropic error', upstream.status, errText);
        return jsonResponse({ error: 'upstream_error', status: upstream.status }, 502);
    }

    const data = (await upstream.json()) as AnthropicResponse;

    const textParts: string[] = [];
    const actions: HoloAction[] = [];
    for (const block of data.content ?? []) {
        if (block.type === 'text' && typeof block.text === 'string') {
            textParts.push(block.text);
        } else if (block.type === 'tool_use' && typeof block.name === 'string') {
            const action = mapToolToAction(block.name, block.input ?? {});
            if (action) actions.push(action);
        }
    }

    const out: { message: string; actions?: HoloAction[] } = {
        message: textParts.join('\n').trim() || 'Done.',
    };
    if (actions.length > 0) out.actions = actions;

    return jsonResponse(out);
}
