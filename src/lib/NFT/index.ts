// tslint:disable no-if-statement
import Web3 from 'web3';

import FRight from './ABIs/FRightABI.json';
import IRight from './ABIs/IRightABI.json';
import NFT from './ABIs/NFTABI.json';
import RightsDao from './ABIs/RightsDaoABI.json';

import api from './axios';
import requests from './requests';

const call = (method: (...args: any) => any) => (...args: any) =>
  method(...args).call() as Promise<any>;
const send = (method: (...args: any) => any) => (...args: any) => {
  const option = args.pop();
  return method(...args).send(option) as Promise<any>;
};

interface Options {
  readonly apiURL: string;
  readonly apiKey: string;
  readonly onEvent?: (type: string, payload: any, error: any) => void;
  readonly addresses: any;
}

export default (provider: any, options: Options) => {
  const instance = new Web3(provider);
  const { addresses } = options;
  const contracts = {
    FRight: new instance.eth.Contract(FRight as any, addresses.FRight),
    IRight: new instance.eth.Contract(IRight as any, addresses.IRight),
    RightsDao: new instance.eth.Contract(RightsDao as any, addresses.RightsDao)
  };

  const methods = {
    FRight: {
      isFrozen: call(contracts.FRight.methods.isFrozen),
      isIMintAble: call(contracts.FRight.methods.isIMintAble),
      isUnfreezable: call(contracts.FRight.methods.isUnfreezable),
      metadata: call(contracts.FRight.methods.metadata),
      tokenURI: call(contracts.FRight.methods.tokenURI)
    },
    IRight: {
      metadata: call(contracts.IRight.methods.metadata),
      tokenURI: call(contracts.IRight.methods.tokenURI),
      transfer: send(contracts.IRight.methods.transferFrom)
    },
    NFT: {
      approve: (addr: string) => {
        const contract = new instance.eth.Contract(NFT as any, addr);
        return send(contract.methods.approve);
      }
    },
    RightsDao: {
      freeze: send(contracts.RightsDao.methods.freeze),
      issueI: send(contracts.RightsDao.methods.issue_i),
      revokeI: send(contracts.RightsDao.methods.revoke_i),
      unfreeze: send(contracts.RightsDao.methods.unfreeze)
    },
    addresses: {
      getName: (addr: string) =>
        Object.keys(addresses).find(
          k => addresses[k].toLowerCase() === addr.toLowerCase()
        )
    }
  };

  const hasIRight = (addr: string, id: number): Promise<any> => {
    // tslint:disable-next-line: readonly-array
    const ret: any[] = [false, 0];
    // const contract = new instance.eth.Contract(NFT as any, addr);

    return new Promise(resolve => {
      // tslint:disable-next-line: no-expression-statement
      contracts.FRight.methods
        .isFrozen(addr, id)
        .call()
        .then((isFrozen: boolean) => {
          if (!isFrozen) {
            return resolve(ret);
          }
          if (isFrozen) {
            // tslint:disable-next-line: no-expression-statement
            contracts.IRight.methods
              .currentTokenId()
              .call()
              .then(async (tokenId: number) => {
                if (tokenId === 0) {
                  return resolve(ret);
                }
                // tslint:disable-next-line: no-let
                for (let i = 1; i < tokenId; i++) {
                  const metadata = await contracts.IRight.methods.metadata(i);
                  if (
                    metadata.baseAssetAddress === addr &&
                    metadata.baseAssetId === id
                  ) {
                    // tslint:disable-next-line
                    ret[0] = true;
                    // tslint:disable-next-line
                    ret[1] = Math.max(ret[1], metadata.endTime);
                  }
                  if (metadata.isExclusive) {
                    break;
                  }
                }
                return resolve(ret);
              });
          }
          return resolve(ret);
        });
    });
  };

  const { request, axios } = api(options.apiKey, options.apiURL);
  const apis = requests(request);

  return {
    addresses,
    apis,
    axios,
    contracts,
    methods: {
      ...methods,
      hasIRight
    },
    web3: instance
  };
};
