import { Provider, Contract, Wallet } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy'
import * as hre from 'hardhat'

const RICH_WALLET_PK = '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110';

const provider = Provider.getDefaultProvider();

const wallet = new Wallet(RICH_WALLET_PK, provider);
const deployer = new Deployer(hre, wallet);

export async function deployContract(name: string): Promise<Contract> {
    const artifact = await deployer.loadArtifact(name);
    return await deployer.deploy(artifact);
}
