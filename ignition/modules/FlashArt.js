const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FlashArtCeloModule", (m) => {
  const flashArt = m.contract("FlashArtCelo", []);
  return { flashArt };
});