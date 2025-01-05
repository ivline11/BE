import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FastApiService {
  private readonly baseUrl = 'http://localhost:5000'; // FastAPI 서버 주소

  async selectWord(): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/select-word`);
      return response.data.selected_word;
    } catch (error) {
      console.error('Error fetching selected word:', error);
      throw new HttpException('Failed to fetch selected word from FastAPI', 500);
    }
  }

  async getSimilarWords(inputWord: string): Promise<{ word: string; similarity: number }[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/similar-words`, {
        input_word: inputWord,
      });
      return response.data.similar_words;
    } catch (error) {
      console.error('Error fetching similar words:', error);
      throw new HttpException('Failed to fetch similar words from FastAPI', 500);
    }
  }
}
