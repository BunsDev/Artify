const ethers = require("ethers");
const ABI = require("../config/abi.json");
const fs = require("fs-extra");
require("dotenv").config();

exports.mintNft = async (data) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const encryptedJsonKey = fs.readFileSync(
      "./config/.encryptedKey.json",
      "utf8"
    );
    let wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = wallet.connect(provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      wallet
    );

    const tx = await contract.mintNft(data);
    const receipt = await tx.wait();

    if (receipt.status) {
      return { success: true, tx, message: "Transaction successful" };
    } else {
      return { success: false, tx, message: "Transaction failed" };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      tx: {},
      message: "Transaction faileddddd",
    };
  }
};