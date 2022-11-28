const {blockchain,Transaction}=require('./blockchain');
const EC=require('elliptic').ec;
const ec=new EC('secp256k1');
const myKey=ec.keyFromPrivate('bbe4ed1dc18ad710fdfa15eddbe468004ddef3c348f3125c053dd8019d299da0');
const myWalletAddress=myKey.getPublic('hex');
let shcoin =new blockchain();

const Tx1= new Transaction(myWalletAddress,'public key goes here',90);
Tx1.signTransaction(myKey);
shcoin.addTransaction(Tx1);

console.log('\n MINING START...\n');

shcoin.minePendingTransaction(myWalletAddress);
console.log('\n REWARD OF NAINA FOR MINING IS:',shcoin.getBalanceOfAddress(myWalletAddress));