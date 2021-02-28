import { expect } from './setup'

import { l2ethers as ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'

describe('Counter', () => {
  let account1: Signer
  let account2: Signer
  let account3: Signer
  before(async () => {
    ;[account1, account2, account3] = await ethers.getSigners()
  })

  let counter: Contract
  beforeEach(async () => {
    counter = await (await ethers.getContractFactory('Counter'))
      .connect(account1)
      .deploy()
  })

  describe('the basics', () => {
    it('should have a count of 0', async () => {
      expect(await counter.count()).to.equal(0)
    })
  })

  describe('transfer', () => {
    it('should count up and down', async () => {
      await counter.connect(account1).countUp()
      expect(await counter.count()).to.equal(1)
      await counter.connect(account1).countUp()
      expect(await counter.count()).to.equal(2)
      await counter.connect(account1).countUp()
      expect(await counter.count()).to.equal(3)
      await counter.connect(account1).countDown()
      expect(await counter.count()).to.equal(2)
      await counter.connect(account1).countDown()
      expect(await counter.count()).to.equal(1)
      await counter.connect(account1).countDown()
      expect(await counter.count()).to.equal(0)

      await expect(counter.connect(account1).countDown()).to.be.revertedWith("count too low!");
    })

    it('should change the count', async () => {
      await counter.connect(account1).setCount(1000)

      expect(await counter.count()).to.equal(1000)
    })
  })
})
