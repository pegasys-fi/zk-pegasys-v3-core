# Pegasys V3

This repository contains the core smart contracts for the Pegasys V3 Protocol forked for zkSync Era.
For higher level contracts, see the [zk-v3-periphery](https://github.com/pegasys-fi/zk-pegasys-v3-periphery)
repository.

## Licensing

The primary license for zkSync Pegasys V3 Core is the GNU GPL v3 or later (`GPL-3.0-or-later`), see [`LICENSE`](./LICENSE).

### Exceptions

- All files in `contracts/interfaces/` are licensed under `GPL-2.0-or-later` (as indicated in their SPDX headers), see [`contracts/interfaces/LICENSE`](./contracts/interfaces/LICENSE)
- Several files in `contracts/libraries/` are licensed under `GPL-2.0-or-later` (as indicated in their SPDX headers), see [`contracts/libraries/LICENSE_GPL`](contracts/libraries/LICENSE_GPL)
- `contracts/libraries/FullMath.sol` is licensed under `MIT` (as indicated in its SPDX header), see [`contracts/libraries/LICENSE_MIT`](contracts/libraries/LICENSE_MIT)
- All files in `contracts/test` remain unlicensed.

## Testing

In order to run tests you'll need to setup [anvil-zksync](https://docs.zksync.io/zksync-era/tooling/local-setup/anvil-zksync-node#install-and-set-up-anvil-zksync)