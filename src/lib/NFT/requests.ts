export default function(
  request: (config: any) => Promise<any>
): { readonly [key: string]: any } {
  return {
    getMyAssets(params: any): Promise<any> {
      return request({
        params: {
          format: 'json',
          ...params
        },
        url: '/assets'
      });
    }
  };
}
