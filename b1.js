const SHA256= require('crypto-js/sha256');
class block{
    constructor(index,timestamp,data,previoushash =''){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.privioushash=previoushash;
        this.hash=this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index+this.previoushash+this.timestamp+JSON.stringify(this.data)).toString();
    }
}
class blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new block(0,"30/03/2002","shambhavi","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previoushash=this.getLatestBlock().hash;
        newBlock.hash=newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i=0;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
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
let shcoin =new blockchain();
shcoin.addBlock(new block(1,"15/02/2022",{amount: 4}));
shcoin.addBlock(new block(2,"16/02/2022",{amount: 10}));
console.log(JSON.stringify(shcoin,null,1));
console.log('is blockchain valid?' + shcoin.isChainValid());