import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { CreateWordsListDto } from 'src/word/dtos/create-words-list.dto';

@Injectable()
export class FastApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000'; // FastAPI 서버 주소

  async generateWordsList(wordCount: number = 1000): Promise<CreateWordsListDto> {
    try {
      const response = await axios.post(`${this.baseUrl}/get-word-and-similarities`, {
        word_count: wordCount, // 요청 데이터
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching selected word:', error);
      throw new HttpException('Failed to fetch selected word from FastAPI', 500);
    }
  }
}
