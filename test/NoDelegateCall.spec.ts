import { ethers } from 'hardhat'
import { NoDelegateCallTest } from '../typechain/NoDelegateCallTest'
import { expect } from './shared/expect'
import snapshotGasCost from './shared/snapshotGasCost'
import { deployContract, getWallets, loadArtifact } from './shared/zkSyncUtils'

describe('NoDelegateCall', () => {
  const [wallet, other] = getWallets()

  const noDelegateCallFixture = async () => {
    const noDelegateCallTestArtifact = await loadArtifact('NoDelegateCallTest')
    const noDelegateCallTest = (await deployContract('NoDelegateCallTest')) as NoDelegateCallTest
    const proxyTest = (await deployContract('ProxyTest', [noDelegateCallTest.address]))
    const proxy = (new ethers.Contract(proxyTest.address, noDelegateCallTestArtifact.abi, wallet)) as NoDelegateCallTest
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
