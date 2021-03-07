## Optimism FE PoC

1) `yarn install`
2) [Clone and run optimism-integration](https://github.com/ethereum-optimism/optimism-integration) in a separate terminal
3) ~~run `yarn deploy` (this won't actually deploy)~~ somehow this broke in the last few hours...
   When it works, add `src/contracts` to `frontend/.gitignore` and remove from git
4) run `pip3 install web3`
5) run `python3 scripts/deploy.py` (this will update the address in `frontend/contracts/contract-address.json automatically`)
6) run `yarn fe:start`
7) set up metamask to access L2 (not sure if this is necessary as the optimism provider skips this? Not 100% sure...)
   `endpoint: http://localhost:8545`
   `chain_id: 420`
8) ???
9) Profit
