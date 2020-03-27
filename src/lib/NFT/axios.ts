import axios from 'axios';

export default function(apiKey: string, baseURL: string): any {
  /* tslint:disable */
  axios.defaults.baseURL = baseURL;
  axios.defaults.timeout = 30 * 1000; // Max time limit: 30s
  axios.defaults.method = 'GET';
  axios.defaults.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey
  };
  /* tslint:enable */

  function request(config: any): Promise<any> {
    return axios.request(config);
  }

  return {
    axios,
    request
  };
}
