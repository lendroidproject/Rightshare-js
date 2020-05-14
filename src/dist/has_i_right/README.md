# hasIRight

Javascript library

## Import web3

```html
<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.2.6/dist/web3.min.js"></script>
```

## Import dist or cdn

```html
<script src="./has_right.min.js"></script>
```

## How to use?

| Params    | Description          |
| --------- | -------------------- |
| `address` | NFT contract address |
| `tokenId` | NFT token ID         |
| `owner`   | ETH address          |

## Example

```javascript
hasIRight(
  '0x79986aF15539de2db9A5086382daEdA917A9CF0C',
  1341,
  '0x8bB37fb0F0462bB3FC8995cf17721f8e4a399629'
).then(([has, ids]) => {
  // Do sth with `has` and `expiry`
});
```
