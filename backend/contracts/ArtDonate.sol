// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtDonate is ERC1155URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    uint256 public constant ITEMTYPE_COIN = 0;

    mapping(uint256 => address) private _itemOwners;

    event Donate(address indexed donator, uint256 indexed itemId, uint256 amount);

    constructor() ERC1155("") {
        _setBaseURI("https://ipfs.io/ipfs/");
    }

    function decimals() public pure returns(uint8){
        return 14;
    }

    function mintCoins() public payable {
        _mint(msg.sender, ITEMTYPE_COIN, msg.value, "");
    }

    function sellCoins(uint256 amount) public {
        _burn(msg.sender, ITEMTYPE_COIN, amount);
        payable(msg.sender).transfer(amount);
    }

    function coinBalance(address account) public view returns(uint256) {
        return balanceOf(account, ITEMTYPE_COIN);
    }

    function mintItem(string memory itemURI) public returns (uint256) {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        _mint(msg.sender, itemId, 1, "");
        _setURI(itemId, itemURI);
        
        _itemOwners[itemId] = msg.sender;

        return itemId;
    }

    function transferCoins(address to, uint256 amount) public {
        safeTransferFrom(msg.sender, to, ITEMTYPE_COIN, amount, "");
    }

    function transferItem(address to, uint256 itemId) public {
        safeTransferFrom(msg.sender, to, itemId, 1, "");

        _itemOwners[itemId] = to;
    }

    function ownerOf(uint256 itemId) public view returns(address){
        require(itemId!=ITEMTYPE_COIN, "Item with this id is fungible");

        return _itemOwners[itemId];
    }

    function donate(uint256 itemId, uint256 amount) public {
        transferCoins(ownerOf(itemId), amount);
        emit Donate(msg.sender, itemId, amount);
    }
}