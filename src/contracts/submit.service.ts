import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as abi from './abi/guess-contract.abi.json';
import { SubmitWordBodyDto } from 'src/guess/dtos/submit-word-body.dto';
@Injectable()
export class SubmitService{
    private readonly provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    private readonly contractAddress = process.env.CONTRACT_ADDRESS;
    private readonly privateKey = process.env.PRIVATE_KEY;

    private readonly signer = new ethers.Wallet(this.privateKey, this.provider);
    private readonly contract = new ethers.Contract(this.contractAddress, abi, this.signer);

    async submitWord(submitWordBodyDto:SubmitWordBodyDto) : Promise<void> {
    
        const tx = await this.contract.submitWord(submitWordBodyDto.word, {
          value: ethers.utils.parseEther(submitWordBodyDto.fee), // 전송 비용
        });
    
        await tx.wait(); 
    }
}   
