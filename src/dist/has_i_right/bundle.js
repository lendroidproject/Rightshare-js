const FRight = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'isFrozen',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const IRight = [
  {
    inputs: [],
    name: 'currentTokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'metadata',
    outputs: [
      {
        internalType: 'uint256',
        name: 'parentId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endTime',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'baseAssetAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'baseAssetId',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'isExclusive',
        type: 'bool'
      },
      {
        internalType: 'uint256',
        name: 'maxISupply',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'serialNumber',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const addresses = {
  // MainNet
  FRight: '0xD923152e96B0f8eDb28a8feC8765D9F8D81a6920',
  IRight: '0xcD8bF9Dd771E93B17e2164698dcB30Cb87D51057'
  // RinkyBy
  // FRight: '0xFc248D053E8E5F71542c0F4956f0292453393A87',
  // IRight: '0xdb210A5da035d160c7528BeCc349d58156818E7C',
};

window.addEventListener('load', async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    console.log(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    );
  }

  if (window.web3) {
    window.FRightContract = new web3.eth.Contract(FRight, addresses.FRight);
    window.IRightContract = new web3.eth.Contract(IRight, addresses.IRight);
  }
});

window.hasIRight = (addr, id, ethAddress) => {
  const ret = [false, []];

  return new Promise(resolve => {
    FRightContract.methods
      .isFrozen(addr, id)
      .call()
      .then(isFrozen => {
        if (!isFrozen) return resolve(ret);
        if (isFrozen) {
          return IRightContract.methods
            .currentTokenId()
            .call()
            .then(async tokenId => {
              if (tokenId === 0) return resolve(ret);
              for (let i = 1; i <= tokenId; i++) {
                const owner = await IRightContract.methods.ownerOf(i).call();
                if (owner.toLowerCase() === ethAddress.toLowerCase()) {
                  const {
                    isExclusive,
                    baseAssetAddress
                  } = await IRightContract.methods.metadata(i).call();
                  if (baseAssetAddress.toLowerCase() === addr.toLowerCase()) {
                    ret[0] = true;
                    ret[1].push(i);
                    if (isExclusive) break;
                  }
                }
              }
              return resolve(ret);
            });
        }
        return resolve(ret);
      });
  });
};
