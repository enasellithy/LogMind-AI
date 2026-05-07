import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private groq: OpenAI;

  constructor() {
    this.groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async analyzeError(errorMessage: string): Promise<string> {
    const response = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert DevOps. Provide a 1-sentence fix for the log.' },
        { role: 'user', content: errorMessage },
      ],
    });
    return response.choices[0]?.message?.content || 'No suggestion available.';
  }
}