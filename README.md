## Optimism FE PoC

1) yarn install
2) Clone and run optimism-integration in a separate window
3) ~~run `yarn deploy` (this won't actually deploy)~~ somehow this broke in the last few hours...
   When it works, add `src/contracts` to `frontend/.gitignore`
4) run `pip3 install web3`
5) run `python3 scripts/deploy.py`
6) copy address from python3 deploy into `./frontend/src/contracts/contract-address.json`
7) run `yarn fe:start`
8) set up metamask to access L2
   `endpoint: http://localhost:8454`
   `chain_id: 420`
9) ???
10) Profit
