import Anthropic from 'npm:@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { company, role, jobDescription, resumeText, tone = 'professional' } = await req.json();
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are an expert cover letter writer. Be concise and impactful. Write in a ${tone} tone.`,
      messages: [{ role: 'user', content: `Write a cover letter for:
Company: ${company}\nRole: ${role}\n\nJob Description:\n${jobDescription}\n\n${resumeText ? `Candidate Background:\n${resumeText}` : ''}

Rules: 3-4 paragraphs, no "I am writing to apply" opener, 2 relevant accomplishments, clear CTA. Letter body only.` }],
    });
    const letter = message.content[0].type === 'text' ? message.content[0].text : '';
    return new Response(JSON.stringify({ letter }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
