import { HardhatUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@eth-optimism/plugins/hardhat/compiler'
import '@eth-optimism/plugins/hardhat/ethers'


const config: HardhatUserConfig = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      chainId: 1337
    },
    optimism: {
      url: 'http://localhost:8545',
      accounts: ["0x754fde3f5e60ef2c7649061e06957c29017fe21032a8017132c0078e37f6193a"],
      gasPrice: 0,
      gas: 9000000
    },
  },
};

export default config
