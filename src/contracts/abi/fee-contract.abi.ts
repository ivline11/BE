export const feeContractAbi = [
  {
    inputs: [],
    name: 'gameEnded',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'guessedWord', type: 'string' }],
    name: 'guessWord',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'newAnswer', type: 'string' }],
    name: 'setAnswer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
