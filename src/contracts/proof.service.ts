import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import * as snarkjs from 'snarkjs';
import * as fs from 'fs/promises';
import * as abi from './abi/proof-contract.abi.json';

@Injectable()
export class ProofService {
  private readonly provider: JsonRpcProvider;
  private readonly contractAddress: string;
  private readonly signer: Wallet;
  private readonly contract: Contract;

  private readonly circuitWasmPath = './zk/circuit.wasm';
  private readonly zkeyPath = './zk/circuit_final.zkey';

  constructor() {
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || '');
    this.contractAddress = process.env.CONTRACT_ADDRESS || '';
    const privateKey = process.env.PRIVATE_KEY || '';

    if (!privateKey) {
      throw new Error('Private key is not defined in environment variables');
    }

    this.signer = new Wallet(privateKey, this.provider);
    this.contract = new Contract(this.contractAddress, abi, this.signer);
  }

  // Proof 생성
  async generateProof(word: string): Promise<{ proof: any; publicSignals: any }> {
    try {
      // Circom Input
      const input = { word: this.wordToCircuitInput(word) };

      // Load Circuit and zKey
      const wasm = await fs.readFile(this.circuitWasmPath);
      const zkey = await fs.readFile(this.zkeyPath);

      // Proof 생성
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm, zkey);

      return { proof, publicSignals };
    } catch (error) {
      console.error('Error generating proof:', error);
      throw new Error('Failed to generate ZKP proof');
    }
  }

  // Proof 제출
  async submitProof(proof: any, publicSignals: any): Promise<boolean> {
    try {
      const tx = await this.contract.submitProof(proof, publicSignals);
      await tx.wait(); // 트랜잭션 완료 대기
      return true;
    } catch (error) {
      console.error('Error submitting proof:', error);
      throw new Error('Failed to submit proof');
    }
  }

  // 단어를 Circuit Input으로 변환
  private wordToCircuitInput(word: string): number[] {
    return word.split('').map((char) => char.charCodeAt(0)); // 단어를 ASCII 값 배열로 변환
  }
}
