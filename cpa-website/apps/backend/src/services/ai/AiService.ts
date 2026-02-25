import type { AiChatRequest, AiChatResponse } from './aiSchemas';
import { knowledgeBase, type KnowledgeItem } from './knowledgeBase';
import { containsSensitiveInfo } from '@utils/pii';

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const scoreItem = (item: KnowledgeItem, message: string): number => {
  const messageTokens = new Set(normalize(message).split(' ').filter((token) => token.length > 2));
  const itemTokens = new Set(
    normalize(`${item.question} ${item.answer} ${(item.tags ?? []).join(' ')}`)
      .split(' ')
      .filter((token) => token.length > 2),
  );

  let score = 0;
  messageTokens.forEach((token) => {
    if (itemTokens.has(token)) {
      score += 1;
    }
  });

  return score;
};

const findBestMatch = (message: string): KnowledgeItem | null => {
  let best: KnowledgeItem | null = null;
  let bestScore = 0;

  knowledgeBase.forEach((item) => {
    const score = scoreItem(item, message);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  });

  if (bestScore < 2) {
    return null;
  }

  return best;
};

const buildKnowledgeBase = (): string =>
  knowledgeBase
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join('\n\n');

const buildSystemPrompt = (): string => {
  return [
    'You are the VH Tax + Accounting virtual assistant.',
    'Answer with general guidance only; do not provide personalized tax advice.',
    'Do not ask for or accept sensitive personal information.',
    'If you cannot answer from the knowledge base, suggest contacting the team.',
    '',
    'Knowledge base:',
    buildKnowledgeBase(),
  ].join('\n');
};

const callOpenAi = async (message: string): Promise<string | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.AI_MODEL ?? 'gpt-4o-mini';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: message },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export interface AiService {
  respond(request: AiChatRequest): Promise<AiChatResponse>;
}

class DefaultAiService implements AiService {
  async respond(request: AiChatRequest): Promise<AiChatResponse> {
    const message = request.message.trim();

    if (containsSensitiveInfo(message)) {
      return {
        reply:
          'Please avoid sharing sensitive personal or account information here. For account-specific questions, use the secure portal or call the office, and I can pass your request to the team.',
        source: 'pii',
        needsEscalation: true,
      };
    }

    const match = findBestMatch(message);
    if (match) {
      return {
        reply: `${match.answer} If you need account-specific help, I can connect you to the team.`,
        source: 'faq',
        needsEscalation: false,
      };
    }

    const provider = (process.env.AI_PROVIDER ?? 'faq').toLowerCase();
    if (provider === 'openai') {
      const reply = await callOpenAi(message);
      if (reply) {
        return {
          reply,
          source: 'ai',
          needsEscalation: false,
        };
      }
    }

    return {
      reply:
        'I can help with scheduling, documents, portal access, and general questions. For anything account-specific, I can send your request to the team.',
      source: 'fallback',
      needsEscalation: true,
    };
  }
}

export const createAiService = (): AiService => new DefaultAiService();
