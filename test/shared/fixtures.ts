import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimePegasysV3Pool } from '../../typechain/MockTimePegasysV3Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { PegasysV3Factory } from '../../typechain/PegasysV3Factory'
import { TestPegasysV3Callee } from '../../typechain/TestPegasysV3Callee'
import { TestPegasysV3Router } from '../../typechain/TestPegasysV3Router'
import { MockTimePegasysV3PoolDeployer } from '../../typechain/MockTimePegasysV3PoolDeployer'
import { deployContract, getWallets, loadArtifact } from './zkSyncUtils'

interface FactoryFixture {
  factory: PegasysV3Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factory = (await deployContract('PegasysV3Factory')) as PegasysV3Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenA = (await deployContract('TestERC20', [BigNumber.from(2).pow(255)])) as TestERC20
  const tokenB = (await deployContract('TestERC20', [BigNumber.from(2).pow(255)])) as TestERC20
  const tokenC = (await deployContract('TestERC20', [BigNumber.from(2).pow(255)])) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestPegasysV3Callee
  swapTargetRouter: TestPegasysV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimePegasysV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimePegasysV3PoolArtifact = await loadArtifact('MockTimePegasysV3Pool')

  const swapTargetCallee = (await deployContract('TestPegasysV3Callee')) as TestPegasysV3Callee
  const swapTargetRouter = (await deployContract('TestPegasysV3Router')) as TestPegasysV3Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await deployContract(
        'MockTimePegasysV3PoolDeployer'
      )) as MockTimePegasysV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[2].args?.pool as string
      return new ethers.Contract(
        poolAddress,
        MockTimePegasysV3PoolArtifact.abi,
        getWallets()[0]
      ) as MockTimePegasysV3Pool
    },
  }
}
