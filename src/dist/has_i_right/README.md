# hasIRight

Javascript library

## Import web3

```html
<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.2.6/dist/web3.min.js"></script>
```

## Import dist or cdn

```html
<script src="./has_i_right.min.js"></script>
```

## How to use?

| Params    | Description          |
| --------- | -------------------- |
| `address` | NFT contract address |
| `tokenId` | NFT token ID         |

## Example

```javascript
hasIRight('0xe15e9c0bf6b6b29d3b9e1c921ab2cb09c2194463', 1).then(
  ([has, expiry]) => {
    // Do sth with `has` and `expiry`
  }
);
```
