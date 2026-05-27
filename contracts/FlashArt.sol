// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FlashArtCelo {
    address public owner;
    uint256 public pricePerImage = 0.001 ether;

    event ImageGenerated(address indexed user, uint256 amount, string prompt);

    constructor() {
        owner = msg.sender;
    }

    function payForImage(string calldata prompt) external payable {
        require(msg.value >= pricePerImage, "Insufficient payment");
        payable(owner).transfer(msg.value);
        emit ImageGenerated(msg.sender, msg.value, prompt);
    }

    function updatePrice(uint256 _newPrice) external {
        require(msg.sender == owner, "Not owner");
        pricePerImage = _newPrice;
    }

    receive() external payable {}
}