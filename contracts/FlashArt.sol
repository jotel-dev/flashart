// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract FlashArt {
    address public owner;
    IERC20 public cUSD;
    uint256 public pricePerImage = 0.05 ether;

    event ImageGenerated(address indexed user, uint256 amount, string prompt);

    constructor(address _cUSD) {
        owner = msg.sender;
        cUSD = IERC20(_cUSD);
    }

    function payForImage(string calldata prompt) external {
        require(
            cUSD.transferFrom(msg.sender, owner, pricePerImage),
            "Payment failed"
        );
        emit ImageGenerated(msg.sender, pricePerImage, prompt);
    }

    function updatePrice(uint256 _newPrice) external {
        require(msg.sender == owner, "Not owner");
        pricePerImage = _newPrice;
    }
}