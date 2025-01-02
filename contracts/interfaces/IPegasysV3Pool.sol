// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IPegasysV3PoolImmutables.sol';
import './pool/IPegasysV3PoolState.sol';
import './pool/IPegasysV3PoolDerivedState.sol';
import './pool/IPegasysV3PoolActions.sol';
import './pool/IPegasysV3PoolOwnerActions.sol';
import './pool/IPegasysV3PoolEvents.sol';

/// @title The interface for a Pegasys V3 Pool
/// @notice A Pegasys pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IPegasysV3Pool is
    IPegasysV3PoolImmutables,
    IPegasysV3PoolState,
    IPegasysV3PoolDerivedState,
    IPegasysV3PoolActions,
    IPegasysV3PoolOwnerActions,
    IPegasysV3PoolEvents
{

}
