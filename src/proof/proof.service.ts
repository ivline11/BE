import { Injectable } from '@nestjs/common';

@Injectable()
export class ProofService {
  /**
   * Proof 생성
   */
  async generateProof(word: string): Promise<string> {
    // 여기에서 circuit를 호출하여 Proof를 생성
    const proof = `proof_for_${word}`; // 예시
    return proof;
  }

  /**
   * Proof 검증
   */
  async verifyProof(proof: string, verificationKey: string): Promise<boolean> {
    // 여기에서 verificationKey와 비교하여 Proof를 검증
    return proof.startsWith('proof_'); // 예시
  }
}
