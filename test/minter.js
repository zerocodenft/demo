const { expect } = require("chai");
const { name, mintPrice, collectionSize } = require('@/siteConfig.json').smartContract

describe(name, function () {

    let Token;
    let smartContract;
    let owner;

    beforeEach(async function () {
        Token = await ethers.getContractFactory(smartContract.name);
        
        smartContract = await Token.deploy();

        [owner] = await ethers.getSigners();
    })

    describe("Deployment", function () {
        it("Deployment should set default values", async function () {
        
            const TOKEN_PRICE = await smartContract.MINT_PRICE();
            const COLLECTION_SIZE = await smartContract.COLLECTION_SIZE();
            const isSaleActive = await smartContract.isPublicSaleActive();

            console.log(ethers.utils.formatUnits(TOKEN_PRICE), +COLLECTION_SIZE, isSaleActive);
        
            expect(ethers.utils.formatUnits(TOKEN_PRICE)).to.equal(mintPrice);
            expect(+COLLECTION_SIZE).to.equal(collectionSize);
            // expect(isSaleActive).to.equal(false);
        })
    })

    describe("Functions", function () {
        it("Flips the sale status", async function () {
        
            let isSaleActive = await smartContract.isPublicSaleActive();
        
            expect(isSaleActive).to.equal(false);

            await smartContract.flipSaleState();

            isSaleActive = await smartContract.isPublicSaleActive();
        
            expect(isSaleActive).to.equal(true);
        })
    })
    
});