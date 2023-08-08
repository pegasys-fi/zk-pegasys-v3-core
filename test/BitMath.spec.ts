import { expect } from './shared/expect'
import { BitMathTest } from '../typechain/BitMathTest'
import { ethers } from 'hardhat'
import snapshotGasCost from './shared/snapshotGasCost'
import { deployContract } from './shared/zkSyncUtils'

const { BigNumber } = ethers

describe('BitMath', () => {
  let bitMath: BitMathTest
  const fixture = async () => {
    return (await deployContract('BitMathTest')) as BitMathTest
  }
  beforeEach('deploy BitMathTest', async () => {
    bitMath = await fixture()
  })

  describe('#mostSignificantBit', () => {
    it('0', async () => {
      await expect(bitMath.mostSignificantBit(0)).to.be.reverted
    })
    it('1', async () => {
      expect(await bitMath.mostSignificantBit(1)).to.eq(0)
    })
    it('2', async () => {
      expect(await bitMath.mostSignificantBit(2)).to.eq(1)
    })
    it('all powers of 2', async () => {
      let results = []
      for (let i = 0; i < 255; i++) {
        results.push(await bitMath.mostSignificantBit(BigNumber.from(2).pow(i)))
      }
      expect(results).to.deep.eq([...Array(255)].map((_, i) => i))
    })
    it('uint256(-1)', async () => {
      expect(await bitMath.mostSignificantBit(BigNumber.from(2).pow(256).sub(1))).to.eq(255)
    })

    it('gas cost of smaller number', async () => {
      await snapshotGasCost(bitMath.getGasCostOfMostSignificantBit(BigNumber.from(3568)))
    })
    it('gas cost of max uint128', async () => {
      await snapshotGasCost(bitMath.getGasCostOfMostSignificantBit(BigNumber.from(2).pow(128).sub(1)))
    })
    it('gas cost of max uint256', async () => {
      await snapshotGasCost(bitMath.getGasCostOfMostSignificantBit(BigNumber.from(2).pow(256).sub(1)))
    })
  })

  describe('#leastSignificantBit', () => {
    it('0', async () => {
      await expect(bitMath.leastSignificantBit(0)).to.be.reverted
    })
    it('1', async () => {
      expect(await bitMath.leastSignificantBit(1)).to.eq(0)
    })
    it('2', async () => {
      expect(await bitMath.leastSignificantBit(2)).to.eq(1)
    })
    it('all powers of 2', async () => {
      let results = []
      for (let i = 0; i < 255; i++) {
        results.push(await bitMath.leastSignificantBit(BigNumber.from(2).pow(i)))
      }
      expect(results).to.deep.eq([...Array(255)].map((_, i) => i))
    })
    it('uint256(-1)', async () => {
      expect(await bitMath.leastSignificantBit(BigNumber.from(2).pow(256).sub(1))).to.eq(0)
    })

    it('gas cost of smaller number', async () => {
      await snapshotGasCost(bitMath.getGasCostOfLeastSignificantBit(BigNumber.from(3568)))
    })
    it('gas cost of max uint128', async () => {
      await snapshotGasCost(bitMath.getGasCostOfLeastSignificantBit(BigNumber.from(2).pow(128).sub(1)))
    })
    it('gas cost of max uint256', async () => {
      await snapshotGasCost(bitMath.getGasCostOfLeastSignificantBit(BigNumber.from(2).pow(256).sub(1)))
    })
  })
})
