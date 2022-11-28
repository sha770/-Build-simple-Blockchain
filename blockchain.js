const SHA256= require('crypto-js/sha256');
const EC=require('elliptic').ec;
const ec=new EC('secp256k1');
class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransaction(signingKey){
        if(signingKey.getPublic('hex')!==this.fromAddress){
            throw new Error('you cannot sign transaction for other wallets!');
        }
        const hashTx=this.calculateHash();
        const sig=signingKey.sign(hashTx,'base64');
        this.signature=sig.toDER('hex');
    }
    isValid(){
        if(this.fromAddress===null)
        return true;
        if(!this.signature||this.signature.length===0){
            throw new Error('no signature in this transaction');
        }
        const publicKey=ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}
class block extends Transaction{
    constructor(timestamp,transaction,previoushash =' '){
        super();
        this.timestamp=timestamp;
        this.transaction=transaction;
        this.previoushash=previoushash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }
    calculateHash(){
        return SHA256(this.index+this.previoushash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash=this.calculateHash();
        }

        console.log("BLOCK MINED NOW->\n HASH OF BLOCK MINED IS:" +this.hash);
    }
    hasValidTransactions(){
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}
class blockchain extends Transaction{
    constructor(){
        super();
        this.chain=[this.createGenesisBlock()];
        this.difficulty=2;
        this.pendingTransaction=[];
        this.miningReward=100;
    }
    createGenesisBlock(){
        return new block("30/03/2002","shambhavi","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransaction(miningRewardAddress){
        const rewardTx=new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransaction.push(rewardTx);
        let Block = new block(Date.now(), this.pendingTransaction,this.getLatestBlock().hash);
        Block.mineBlock(this.difficulty);

        console.log(' PENDING BLOCK MINED SUCCESFULLY');
        this.chain.push(Block);
        this.pendingTransaction=[];
        
    }
    addTransaction(transaction){
        if(!transaction.fromAddress||!transaction.toAddress){
            throw new Error('transaction must include from and to address');
        }
        if(!transaction.isValid()){
            throw new Error('cannot add invalid transaction in chain');
        }
        this.pendingTransaction.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance=0;
        for(const Block of this.chain){
            for(const trans of Block.transaction){
                if(trans.fromAddress===address){
                    balance-= trans.amount;
                }
                if(trans.toAddress===address){
                    balance+= trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i=0;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            if(currentBlock.hash!== currentBlock.calculateHash()){
                return false;
            }
            if(previousBlock!==undefined){
            if(currentBlock.previoushash!== previousBlock.hash){
                return false;
            }
        }
        }
        return true;
    }
}
module.exports.blockchain=blockchain;
module.exports.Transaction=Transaction;