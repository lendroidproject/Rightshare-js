const FRight = [
  {
    constant: true,
    inputs: [],
    name: 'currentTokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
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
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
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
        name: 'version',
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
        name: 'circulatingISupply',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
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
  FRight: '0x9D53045Dd70FD31381A4934baF5502a1B50F2D23',
  IRight: '0x235be84dB0AF8DDeDB759ad48663623A71575022'
  // RinkyBy
  // FRight: '0xefC727FE2Ba2157820990f66955019A62Fa3Cc6d',
  // IRight: '0xf73B07252629fb493F721AA7A28945334fea62C7',
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

function hasRight(addr, id, ethAddress, moderatorContract, tokenContract) {
  return new Promise(resolve => {
    moderatorContract.methods
      .isFrozen(addr, id)
      .call()
      .then(isFrozen => {
        if (isFrozen) {
          tokenContract.methods
            .currentTokenId()
            .call()
            .then(async tokenId => {
              if (tokenId !== 0) {
                for (let i = 1; i <= tokenId; i++) {
                  const owner = await tokenContract.methods.ownerOf(i).call();
                  if (owner.toLowerCase() === ethAddress.toLowerCase()) {
                    const {
                      baseAssetAddress,
                      baseAssetId,
                      endTime
                    } = await tokenContract.methods.metadata(i).call();
                    if (
                      baseAssetAddress.toLowerCase() === addr.toLowerCase() &&
                      baseAssetId === id &&
                      endTime > Date.now() / 1000
                    ) {
                      resolve(true);
                      break;
                    }
                  }
                }
              } else {
                resolve(false);
              }
            });
        } else {
          resolve(false);
        }
      });
  });
}

window.hasIRight = (...args) =>
  hasRight(...args, FRightContract, IRightContract);
window.hasFRight = (...args) =>
  hasRight(...args, FRightContract, FRightContract);
