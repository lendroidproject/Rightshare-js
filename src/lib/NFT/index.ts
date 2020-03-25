import Web3 from 'web3';

import FRight from './ABIs/FRightABI.json';
import IRight from './ABIs/IRightABI.json';
import NFT from './ABIs/NFTABI.json';
import RightsDao from './ABIs/RightsDaoABI.json';

const addresses: any = {
  FRight: '0xFc248D053E8E5F71542c0F4956f0292453393A87',
  IRight: '0xdb210A5da035d160c7528BeCc349d58156818E7C',
  RightsDao: '0xa43F7069C723587dedaC7c3c82C2f913a1806ff2'
};

const call = (method: (...args: any) => any) => (...args: any) =>
  method(...args).call() as Promise<any>;
const send = (method: (...args: any) => any) => (...args: any) => {
  const option = args.pop();
  return method(...args).send(option) as Promise<any>;
};

export default (provider: any) => {
  const instance = new Web3(provider);
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

  return {
    addresses,
    contracts,
    methods,
    web3: instance
  };
};
