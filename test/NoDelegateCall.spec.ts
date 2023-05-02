import { NoDelegateCallTest } from '../typechain/NoDelegateCallTest'
import { deployContract, getWallets, loadArtifact } from './shared/zkSyncUtils'
import { expect } from './shared/expect'
import snapshotGasCost from './shared/snapshotGasCost'
import { Wallet } from 'zksync-web3'
import { Contract } from 'ethers'
import { ZkSyncArtifact } from '@matterlabs/hardhat-zksync-deploy/dist/types'

describe('NoDelegateCall', () => {
    let wallet: Wallet;

    before('create fixture loader', async () => {
        ;[wallet] = getWallets()
      })

  const noDelegateCallFixture = async () => {    
    const noDelegateCallTestContract = (await deployContract('NoDelegateCallTest'))
    const noDelegateCallTestArtifact = await loadArtifact('NoDelegateCallTest')
    const noDelegateCallTest = new Contract(noDelegateCallTestContract.address, noDelegateCallTestArtifact.abi, wallet)

    const proxyTestContract = (await deployContract('ProxyTest', [noDelegateCallTest.address]))
    const proxy = new Contract(proxyTestContract.address, noDelegateCallTestArtifact.abi, wallet)
    return { noDelegateCallTest, proxy }
  }

  let base: NoDelegateCallTest
  let proxy: NoDelegateCallTest

  beforeEach('deploy test contracts', async () => {
    ;({ noDelegateCallTest: base, proxy } = await noDelegateCallFixture())
  })

  it('runtime overhead', async () => {
    await snapshotGasCost(
      (await base.getGasCostOfCannotBeDelegateCalled()).sub(await base.getGasCostOfCanBeDelegateCalled())
    )
  })

  it('proxy can call the method without the modifier', async () => {
    await proxy.canBeDelegateCalled()
  })
  it('proxy cannot call the method with the modifier', async () => {
    await expect(proxy.cannotBeDelegateCalled()).to.be.reverted
  })

  it('can call the method that calls into a private method with the modifier', async () => {
    await base.callsIntoNoDelegateCallFunction()
  })
  it('proxy cannot call the method that calls a private method with the modifier', async () => {
    await expect(proxy.callsIntoNoDelegateCallFunction()).to.be.reverted
  })
})
