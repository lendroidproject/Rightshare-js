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
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'baseAsset',
    outputs: [
      {
        internalType: 'address',
        name: '_baseAssetAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_baseAssetId',
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
  FRight: '0xD923152e96B0f8eDb28a8feC8765D9F8D81a6920',
  IRight: '0xcD8bF9Dd771E93B17e2164698dcB30Cb87D51057'
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
    window.IRightContract = new web3.eth.Contract(IRight, addresses.FRight);
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
                    _baseAssetId: assetId,
                    _baseAssetAddress: baseAssetAddress
                  } = await IRightContract.methods.baseAsset(i).call();
                  if (
                    baseAssetAddress.toLowerCase() === addr.toLowerCase() &&
                    Number(assetId) === Number(id)
                  ) {
                    ret[0] = true;
                    ret[1].push(i);
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
