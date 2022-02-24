require('dotenv').config();
const updateEnv = require('./updateEnv.js');
const updateSiteConfig = require('./updateSiteConfig');

async function main() {
  const contractFactory = await ethers.getContractFactory("YourContractName")

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const { HIDDEN_METADATA_CID, VOUCHER_SIGNER_PUBLIC_KEY } = process.env;
  
  const placeholderURI = `ipfs://${HIDDEN_METADATA_CID}`

  const contract = await contractFactory.deploy(placeholderURI, VOUCHER_SIGNER_PUBLIC_KEY)

  const envUpdate = {
    'CONTRACT_ADDRESS': contract.address
  }

  updateEnv(envUpdate)
  updateSiteConfig(contract.address)
      
  console.log("Contract deployed to address:", contract.address)
}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  