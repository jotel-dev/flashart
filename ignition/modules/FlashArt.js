const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CUSD_MAINNET = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

module.exports = buildModule("FlashArtModule", (m) => {
    const flashArt = m.contract("FlashArt", [CUSD_MAINNET]);
    return { flashArt };
});