import os

from web3 import Web3
from web3.middleware import geth_poa_middleware

bytecode = '0x60806040523480156100195760008061001661002f565b50505b50600080819061002761009d565b505050610102565b632a2a7' \
           'adb598160e01b8152600481016020815285602082015260005b8681101561006a5780860151816040840101526020810190506100' \
           '4c565b506020828760640184336000905af158600e01573d6000803e3d6000fd5b3d6001141558600a015760016000f35b5050505' \
           '65b6322bd64c0598160e01b8152836004820152846024820152600081604483336000905af158600e01573d6000803e3d6000fd5b' \
           '3d6001141558600a015760016000f35b60005b60408110156100fd576000818301526020810190506100e3565b505050565b61054' \
           'd806101116000396000f3fe6080604052348015610019576000806100166103ba565b50505b50600436106100555760003560e01c' \
           '806306661abd146100635780630bd8599e146100815780635fcbd5b6146100a1578063d14e62b8146100c1575b600080610060610' \
           '3ba565b50505b61006b61010e565b6040518082815260200191505060405180910390f35b61008961011e565b6040518082151581' \
           '5260200191505060405180910390f35b6100a961022f565b60405180821515815260200191505060405180910390f35b6100f6600' \
           '480360360208110156100e0576000806100dd6103ba565b50505b8101908080359060200190929190505050610340565b60405180' \
           '821515815260200191505060405180910390f35b600080610119610428565b905090565b60008060008161012c610428565b80929' \
           '19060010191905061013e61048b565b50505060008061014c610428565b14156101c9576040517f08c379a0000000000000000000' \
           '00000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f636f756e7420746f6f2' \
           '068696768210000000000000000000000000000000000815250602001915050604051809103906101c66103ba565b50505b5a6101' \
           'd26104f0565b73ffffffffffffffffffffffffffffffffffffffff167f0c6d57b2fe49e083a8ee35f4b7f612ae3ccd7a11b796295' \
           'c7ee4fa376d166fef6000610213610428565b6040518082815260200191505060405180910390a26001905090565b600080600061' \
           '023c610428565b116102b8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040' \
           '180806020018281038252600e8152602001807f636f756e7420746f6f206c6f772100000000000000000000000000000000000081' \
           '5250602001915050604051809103906102b56103ba565b50505b600080816102c4610428565b80929190600190039190506102d76' \
           '1048b565b5050505a6102e36104f0565b73ffffffffffffffffffffffffffffffffffffffff167f0c6d57b2fe49e083a8ee35f4b7' \
           'f612ae3ccd7a11b796295c7ee4fa376d166fef6000610324610428565b6040518082815260200191505060405180910390a260019' \
           '05090565b6000816000819061034f61048b565b5050505a61035b6104f0565b73ffffffffffffffffffffffffffffffffffffffff' \
           '167f0c6d57b2fe49e083a8ee35f4b7f612ae3ccd7a11b796295c7ee4fa376d166fef600061039c610428565b60405180828152602' \
           '00191505060405180910390a260019050919050565b632a2a7adb598160e01b8152600481016020815285602082015260005b8681' \
           '10156103f55780860151816040840101526020810190506103d7565b506020828760640184336000905af158600e01573d6000803' \
           'e3d6000fd5b3d6001141558600a015760016000f35b505050565b6303daa959598160e01b81528360048201526020816024833360' \
           '00905af158600e01573d6000803e3d6000fd5b3d6001141558600a015760016000f35b8051935060005b604081101561048657600' \
           '08183015260208101905061046c565b505050565b6322bd64c0598160e01b81528360048201528460248201526000816044833360' \
           '00905af158600e01573d6000803e3d6000fd5b3d6001141558600a015760016000f35b60005b60408110156104eb5760008183015' \
           '26020810190506104d1565b505050565b6373509064598160e01b8152602081600483336000905af158600e01573d6000803e3d60' \
           '00fd5b3d6001141558600a015760016000f35b8051935060005b60408110156105485760008183015260208101905061052e565b5' \
           '0505056'
abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "caller",
                "type": "address"
            },
            {
                "indexed": True,
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "name": "CountChanged",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "count",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "countDown",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "countUp",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newCount",
                "type": "uint256"
            }
        ],
        "name": "setCount",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
# Some error is fixed with this, I guess they use poa and this is necessary as a result
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

print("Calling account:", w3.eth.accounts[0])
w3.eth.default_account = w3.eth.accounts[0]

Counter = w3.eth.contract(abi=abi, bytecode=bytecode)
tx_hash = Counter.constructor().transact()
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)

print("Contract address:", tx_receipt.contractAddress)

address = tx_receipt.contractAddress
counter = w3.eth.contract(
    address=address,
    abi=abi)

print("Count:", counter.functions.count().call())
# For some reason if gas isn't set like this, it will default to 9000000 which causes an error
for i in range(10):
    print("Calling countUp()")
    tx_hash = counter.functions.countUp().transact({'gas': counter.functions.countUp().estimateGas()})
    tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    print("Count:", counter.functions.count().call())

with open(os.path.join(os.path.dirname(__file__), '../frontend/src/contracts/contract-address.json'), "w") as f:
    f.write(f"""{{
  "Counter": "{address}"
}}""")