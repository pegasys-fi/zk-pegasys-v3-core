import { Provider, Contract, Wallet } from 'zksync-web3'
import { Deployer } from '@matterlabs/hardhat-zksync-deploy'
import * as hre from 'hardhat'

const RICH_WALLETS = [
  {
    address: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
    privateKey: '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110',
  },
  {
    address: '0xa61464658AfeAf65CccaaFD3a512b69A83B77618',
    privateKey: '0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3',
  },
  {
    address: '0x0D43eB5B8a47bA8900d84AA36656c92024e9772e',
    privateKey: '0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e',
  },
  {
    address: '0xA13c10C0D5bd6f79041B9835c63f91de35A15883',
    privateKey: '0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8',
  },
]

export const provider = new Provider((hre.network.config as any).url)

const wallet = new Wallet(RICH_WALLETS[0].privateKey, provider)
const deployer = new Deployer(hre, wallet)

export function getWallets(): Wallet[] {
  let wallets = []
  for (let i = 0; i < RICH_WALLETS.length; i++) {
    wallets[i] = new Wallet(RICH_WALLETS[i].privateKey, provider)
  }
  return wallets
}

export async function loadArtifact(name: string) {
  return await deployer.loadArtifact(name)
}

export async function deployContract(name: string, constructorArguments?: any[] | undefined): Promise<Contract> {
  const artifact = await loadArtifact(name)
  return await deployer.deploy(artifact, constructorArguments)
}
