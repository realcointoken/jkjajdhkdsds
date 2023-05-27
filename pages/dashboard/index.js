import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
const web3 = new Web3(Web3.givenProvider);

function Dashboard() {
  const { isAuthenticated, logout, user } = useMoralis();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // save image to IPFS
      const file1 = new Moralis.File(file.name, file);
      await file1.saveIPFS();
      const file1url = file1.ipfs();

      // generate metadata and save to ipfs
      const metadata = {
        name,
        description,
        image: file1url,
      };
      const file2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await file2.saveIPFS();
      const metadataurl = file2.ipfs();
      console.log(metadataurl);
    
    
      // interact with smart contract
      // const contract = new web3.eth.Contract(contractABI, contractAddress);
      // const response = await contract.methods
      //   .mint(metadataurl)
      //   .send({ from: user.get("ethAddress") });
      // const tokenId = response.events.Transfer.returnValues.tokenId;
      const web3 = await Moralis.enableWeb3()

      const numb = "3" ;
    
      let depositoptions = {
  
        contractAddress: "0x128D4c0d4bDD50d3613D341bbD96062659d1De64",
    
        functionName: "mintToken",
    
        abi: contractABI,
        //msgValue: Moralis.Units.ETH(0.001),
    
        params: {
    
          // _mintAmount: numb,
          tokenURI:metadataurl
        }
    
      };
     Moralis.executeFunction(depositoptions);
      // alert(
      //   `NFT successfully minted. Contract address - and Token ID `
      // );
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    
  };

  return (
    <div className="home2">
      <div className="flex header">
        <div className="logo">
          <img
            src="https://nftify-platform.s3.ap-southeast-1.amazonaws.com/logo/62d170f22994a0bed7213b80-1658926016888.png"
            alt=""
          />
        </div>
        <div className="links">

          <div className="link">
          <a href="https://sheratokens.com/">Home</a>

          <a href="https://shera-market-nft.com/">Marketplace</a>
          </div>
        </div>
      </div>

      <div className="flex w-screen h-screen items-center justify-center home2">
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              className="border-[1px] p-2 text-lg  w-full"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <input
              type="text"
              className="border-[1px] p-2 text-lg  w-full"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <input
              type="file"
              className="border-[1px] p-2 text-lg  w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl animate-pulse"
          >
            Mint now!
          </button>
          <button
            onClick={logout}
            className="mt-5 w-full p-5 bg-red-700 text-white text-lg rounded-xl"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
