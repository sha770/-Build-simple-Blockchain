const SHA256= require('crypto-js/sha256');
class block{
    constructor(index,timestamp,data,previoushash =''){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
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
        console.log("block mined:" +this.hash);
    }
}
class blockchain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty=4;
    }
    createGenesisBlock(){
        return new block(0,"30/03/2002","shambhavi","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previoushash=this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
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
console.log('mining block 1....');
shcoin.addBlock(new block(1,"15/02/2022",{amount: 4}));
console.log('mining block 2....');
shcoin.addBlock(new block(2,"16/02/2022",{amount: 10}));
