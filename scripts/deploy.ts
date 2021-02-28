import { l2ethers, artifacts, network } from "hardhat";

async function main() {

    const [deployer] = await l2ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    const factory = await l2ethers.getContractFactory("Counter", deployer);

    // TODO: issue is here - deploys to same address every time - is it deploying to the right chain??
    let contract = await factory.deploy();
    console.log(contract.address);
    console.log(contract.deployTransaction.hash);
    contract = await factory.deploy();
    console.log(contract.address);
    console.log(contract.deployTransaction.hash);
    await contract.deployed();

    saveFrontendFiles(contract);
}

function saveFrontendFiles(counter) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ Counter: counter.address }, undefined, 2)
    );

    const CounterArtifact = artifacts.readArtifactSync("Counter");

    fs.writeFileSync(
        contractsDir + "/Counter.json",
        JSON.stringify(CounterArtifact, null, 2)
    );
}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
