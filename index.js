import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  uintCV,
  tupleCV,
  listCV,
  bufferCVFromString,
  bufferCV,
} from '@stacks/transactions';
import { hexToBytes } from '@stacks/common';
import { StacksTestnet } from '@stacks/network';
import redstone from 'redstone-api';

const price = await redstone.getPrice("BTC");
console.log(price);

const network = new StacksTestnet();

const txOptions = {
  contractAddress: 'ST1DSH0G45GZGGDJP3YVDEXTY4X2ZA89CKB5CZ6PK',
  contractName: 'hermetica-sbtc-erko-comptroller-v0-1',
  functionName: 'settle',
  functionArgs: [
    uintCV(price.timestamp), 
    listCV([tupleCV({symbol: bufferCVFromString(price.symbol), value: uintCV(Math.floor(price.value * (10**8)))})]),
    bufferCV(hexToBytes(price.liteEvmSignature.substr(2)))
  ],
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
  validateWithAbi: true,
  network,
  anchorMode: AnchorMode.Any,
};

const transaction = await makeContractCall(txOptions);

const broadcastResponse = await broadcastTransaction(transaction, network);
const txId = broadcastResponse.txid;
console.log(txId);
