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
      currentFVersion: call(contracts.RightsDao.methods.currentFVersion),
      currentIVersion: call(contracts.RightsDao.methods.currentIVersion),
      freeze: send(contracts.RightsDao.methods.freeze),
      issueI: send(contracts.RightsDao.methods.issueI),
      revokeI: send(contracts.RightsDao.methods.revokeI),
      unfreeze: send(contracts.RightsDao.methods.unfreeze),
    },
    addresses: {
      getName: (addr: string) =>
        Object.keys(addresses).find(
          k => addresses[k].toLowerCase() === addr.toLowerCase()
        )
    }
  };

  const { request, axios } = api(options.apiKey, options.apiURL);
  const apis = requests(request);

  return {
    addresses,
    apis,
    axios,
    contracts,
    methods,
    web3: instance
  };
};
