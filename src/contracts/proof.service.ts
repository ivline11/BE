import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as snarkjs from 'snarkjs';
import * as fs from 'fs/promises';
import * as abi from './abi/proof-contract.abi.json';

@Injectable()
export class ProofService {
  private readonly provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  private readonly contractAddress = process.env.CONTRACT_ADDRESS;
  private readonly privateKey = process.env.PRIVATE_KEY;

  private readonly signer = new ethers.Wallet(this.privateKey, this.provider);
  private readonly contract = new ethers.Contract(this.contractAddress, abi, this.signer);

  private readonly circuitWasmPath = './zk/circuit.wasm';
  private readonly zkeyPath = './zk/circuit_final.zkey';


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

  async submitProof(proof: string, publicSignals: number[]): Promise<boolean> {
    const tx = await this.contract.submitProof(proof, publicSignals);
    const receipt = await tx.wait();
    return true; 
  }

  private wordToCircuitInput(word: string): number[] {
    return word.split('').map((char) => char.charCodeAt(0)); // 단어를 ASCII 값 배열로 변환
  }
}
