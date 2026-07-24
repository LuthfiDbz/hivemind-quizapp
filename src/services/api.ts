export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  explanation: string;
  category: string;
  tags: string[];
  answers: QuizAnswer[];
}

export interface QuizResponse {
  success: boolean;
  data: QuizQuestion[];
}

const API_KEY = import.meta.env.VITE_QUIZAPI_KEY;
const BASE_URL = 'https://quizapi.io/api/v1';

export async function fetchQuestions(limit = 10, category = 'Random'): Promise<QuizQuestion[]> {
  if (!API_KEY) {
    throw new Error('QuizAPI key is missing in .env');
  }

  let url = `${BASE_URL}/questions?limit=${limit}`;
  if (category && category !== 'Random') {
    url += `&category=${category}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = await response.json();
  
  if (data.success && Array.isArray(data.data)) {
    return data.data as QuizQuestion[];
  }
  
  if (Array.isArray(data)) {
    return data as QuizQuestion[];
  }
  
  return (data.data || []) as QuizQuestion[];
}
