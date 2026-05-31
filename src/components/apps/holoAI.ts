// Holo-AI brain — a portfolio concierge that can ALSO drive the OS.
//
// `interpret(input)` runs locally and returns a structured `AIResponse`:
//   - `message`: human text to display in chat
//   - `actions`: an optional list of OS actions (open window, close, etc.)
//
// If VITE_AI_ENDPOINT is configured, the same shape is expected from the
// remote endpoint — Claude tool-use payloads can be mapped 1:1 to `actions`.
//
// Without the endpoint, we still ship a working agent: intent matching
// for action commands, plus a static FAQ for factual questions.

import { projects } from '@/data/portfolioData';

export type HoloAction =
    | { type: 'open_window'; id: string }
    | { type: 'close_window'; id: string }
    | { type: 'focus_window'; id: string }
    | { type: 'minimize_all' }
    | { type: 'close_all' }
    | { type: 'open_project'; id: string };

export interface AIResponse {
    message: string;
    actions?: HoloAction[];
}

const APP_VOCAB: Array<{ id: string; aliases: string[] }> = [
    { id: 'bio', aliases: ['bio', 'about', 'about you', 'about yourself', 'who are you', 'identity'] },
    { id: 'projects', aliases: ['projects', 'project', 'work', 'portfolio', 'database', 'builds'] },
    { id: 'experience', aliases: ['experience', 'timeline', 'career', 'history', 'job', 'jobs'] },
    { id: 'contact', aliases: ['contact', 'message', 'email', 'reach', 'reach you', 'reach out', 'connect', 'hire'] },
    { id: 'terminal', aliases: ['terminal', 'shell', 'cli', 'command line', 'console'] },
    { id: 'settings', aliases: ['settings', 'config', 'configuration', 'preferences', 'theme'] },
    { id: 'retro', aliases: ['arcade', 'game', 'snake', 'play'] },
    { id: 'neural', aliases: ['holo-ai', 'holo ai', 'ai', 'neural', 'yourself the ai'] },
];

const OPEN_VERBS = ['open', 'launch', 'show', 'show me', 'take me to', 'go to', 'navigate to', 'switch to', 'jump to', 'pull up', 'fire up', 'start'];
const CLOSE_VERBS = ['close', 'dismiss', 'hide', 'kill', 'shut'];
const MINIMIZE_PHRASES = ['minimize all', 'minimize everything', 'show desktop', 'go home', 'back to desktop', 'hide everything', 'clear desktop'];
const CLOSE_ALL_PHRASES = ['close all', 'close everything', 'kill all', 'shut everything', 'clear all'];

interface FaqEntry {
    keywords: string[];
    answer: string;
}

const FAQ: FaqEntry[] = [
    {
        keywords: ['who', 'about', 'yourself', 'bio', 'identity', 'tell me about'],
        answer:
            "AlBaraa AlOlabi — AI Researcher and Computer Vision Engineer, interning at Cellula Technologies on production CV pipelines. Winner of the Anthropic MCP 1st Birthday Hackathon with CleanCity Agent. Published author at IEEE SNAMS 2025 on AI in education. Based in the UAE, open to opportunities.",
    },
    {
        keywords: ['skill', 'tech', 'stack', 'language', 'tool', 'framework'],
        answer:
            "Core stack: Python, PyTorch, OpenCV, YOLOv8, FAISS, TensorFlow, Claude API, Gradio, Streamlit, FastAPI, MCP (Model Context Protocol). Web: TypeScript, React, React Native. ML/NLP: HuggingFace BART, MediaPipe, scikit-learn.",
    },
    {
        keywords: ['experience', 'job', 'intern', 'cellula', 'career'],
        answer:
            "Computer Vision Engineer Intern at Cellula Technologies since January 2026 — building production CV models with PyTorch, OpenCV, and YOLOv8. Won the Anthropic MCP 1st Birthday Hackathon (CleanCity Agent, Consumer Track). Previously selected for Samsung Innovation Campus AI & ML program (Sep–Dec 2025) and presented a paper at IEEE SNAMS 2025.",
    },
    {
        keywords: ['research', 'paper', 'ieee', 'snams', 'publication'],
        answer:
            "Published author at IEEE SNAMS 2025 — 'The Impact of Artificial Intelligence in Education on Student Learning Outcomes and Teaching Methods.'",
    },
    {
        keywords: ['certif', 'cs50', 'samsung', 'harvard'],
        answer:
            "CS50x and CS50P completed at Harvard (online). CS50AI in progress. Selected participant in Samsung Innovation Campus AI & ML program. IEEE SNAMS 2025 published author.",
    },
    {
        keywords: ['hackathon', 'mcp', 'cleancity', 'anthropic', 'won', 'win', 'competition'],
        answer:
            "Won the Anthropic MCP 1st Birthday Hackathon — Consumer Track — with CleanCity Agent, an agentic AI that turns trash photos into full cleanup campaigns using YOLOv8, MCP, and Gemini Vision. Also submitted Mission Control MCP, an enterprise automation server with 8 tools.",
    },
];

const FALLBACK =
    "I can answer questions about AlBaraa's role, skills, projects, contact info, experience, research, certifications — and I can drive the OS for you. Try: \"open projects\", \"show me your CV\", or \"close everything\".";

const matchFaq = (q: string): string | null => {
    const lower = q.toLowerCase();
    let best: { entry: FaqEntry; score: number } | null = null;
    for (const entry of FAQ) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (lower.includes(kw)) score++;
        }
        if (score > 0 && (!best || score > best.score)) {
            best = { entry, score };
        }
    }
    return best ? best.entry.answer : null;
};

// Try to match a query against the app vocabulary. Returns the app id of the
// longest alias match, or null. Longest-match prevents "about" → bio from
// stealing "about the projects" → projects.
const matchAppId = (q: string): string | null => {
    const lower = q.toLowerCase();
    let best: { id: string; len: number } | null = null;
    for (const { id, aliases } of APP_VOCAB) {
        for (const alias of aliases) {
            if (lower.includes(alias) && (!best || alias.length > best.len)) {
                best = { id, len: alias.length };
            }
        }
    }
    return best?.id ?? null;
};

const matchProject = (q: string): { id: string; title: string } | null => {
    const lower = q.toLowerCase();
    let best: { id: string; title: string; len: number } | null = null;
    for (const p of projects) {
        const id = p.id.toLowerCase();
        const titleLower = p.title.toLowerCase();
        if (lower.includes(id) && (!best || id.length > best.len)) {
            best = { id: p.id, title: p.title, len: id.length };
            continue;
        }
        // Match against the title's longest meaningful token sequence
        const titleSlug = titleLower.split(/[\s\-—]+/).filter(s => s.length > 4).join(' ');
        if (titleSlug && lower.includes(titleSlug.slice(0, 12)) && (!best || titleSlug.length > best.len)) {
            best = { id: p.id, title: p.title, len: titleSlug.length };
        }
    }
    return best ? { id: best.id, title: best.title } : null;
};

const startsWithAny = (s: string, prefixes: string[]): boolean =>
    prefixes.some(p => s === p || s.startsWith(p + ' ') || s.includes(' ' + p + ' ') || s.startsWith(p + ','));

const includesAny = (s: string, phrases: string[]): boolean =>
    phrases.some(p => s.includes(p));

/**
 * Pure local intent + FAQ interpretation. No network, no API key needed.
 */
export const interpret = (input: string): AIResponse => {
    const q = input.trim();
    if (!q) return { message: FALLBACK };
    const lower = q.toLowerCase();

    // Whole-phrase actions first
    if (includesAny(lower, CLOSE_ALL_PHRASES)) {
        return { message: 'Clearing the desktop.', actions: [{ type: 'close_all' }] };
    }
    if (includesAny(lower, MINIMIZE_PHRASES)) {
        return { message: 'Minimizing everything.', actions: [{ type: 'minimize_all' }] };
    }

    // Project-specific deep-link: "show me X project" / "open X"
    const project = matchProject(lower);
    if (project && startsWithAny(lower, OPEN_VERBS.concat(['tell me about', 'what is', "what's"]))) {
        return {
            message: `Opening "${project.title}".`,
            actions: [{ type: 'open_project', id: project.id }],
        };
    }

    // App-level open: "open projects", "show me your bio"
    const appId = matchAppId(lower);
    if (appId && startsWithAny(lower, OPEN_VERBS)) {
        return {
            message: `Opening ${appLabel(appId)}.`,
            actions: [{ type: 'open_window', id: appId }],
        };
    }

    // App-level close
    if (appId && startsWithAny(lower, CLOSE_VERBS)) {
        return {
            message: `Closing ${appLabel(appId)}.`,
            actions: [{ type: 'close_window', id: appId }],
        };
    }

    // FAQ matching for factual questions
    const fact = matchFaq(lower);
    if (fact) return { message: fact };

    // If an app/project was mentioned but no verb matched, gently offer to act.
    if (project) {
        return {
            message: `I can show you "${project.title}". Try: "open ${project.id}".`,
        };
    }
    if (appId) {
        return {
            message: `Sounds like you mean ${appLabel(appId)}. Try: "open ${appId}".`,
        };
    }

    return { message: FALLBACK };
};

const appLabel = (id: string): string => {
    const map: Record<string, string> = {
        bio: 'Bio',
        projects: 'Projects',
        experience: 'Timeline',
        contact: 'Contact',
        terminal: 'Terminal',
        settings: 'Config',
        retro: 'Arcade',
        neural: 'Holo-AI',
    };
    return map[id] ?? id;
};

/**
 * Hit a remote endpoint (e.g. Vercel Edge with Claude tool-use). Endpoint
 * must accept `{ message }` and respond either:
 *   - `{ reply: string, actions?: HoloAction[] }`
 *   - `{ message: string, actions?: HoloAction[] }` (preferred)
 * Falls back to local interpret() on any error.
 */
export const queryRemote = async (input: string, endpoint: string): Promise<AIResponse> => {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { reply?: string; message?: string; actions?: HoloAction[] } = await res.json();
        const message = (data.message ?? data.reply ?? '').trim();
        if (!message && !data.actions?.length) throw new Error('empty response');
        return { message: message || 'Done.', actions: data.actions };
    } catch (err) {
        console.warn('[Holo-AI] remote endpoint failed, falling back to local:', err);
        return interpret(input);
    }
};
