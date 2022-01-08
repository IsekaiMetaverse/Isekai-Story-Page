import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--accent);
  background-color: var(--accent);
  border-radius: 5%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [tokenId, setTokenId] = useState(1)
  const [_newStory, writeNewStory] = useState(2)
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const writeStory = () => {
    
    let gasLimit = CONFIG.GAS_LIMIT;
    
    let totalGasLimit = String(gasLimit);
    
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .writeStory(tokenId,_newStory)
      .send({
       // gasLimit: String(totalGasLimit),
      //  to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      //  value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };
  
  //const tokenId = () =>{
 //     };
 // const decrementMintAmount = () => {
  //  let newMintAmount = mintAmount - 1;
  //  if (newMintAmount < 1) {
  //    newMintAmount = 1;
  //  }
  //  setMintAmount(newMintAmount);
  //};

 // const incrementMintAmount = () => {
  //  let newMintAmount = mintAmount + 1;
  //  if (newMintAmount > 10) {
  //    newMintAmount = 10;
  //  }
  //  setMintAmount(newMintAmount);
 // };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
       // image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <s.TextTitle style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}>Isekai Character</s.TextTitle>
        <s.SpacerXSmall/>
        <s.Container1>        
        <s.TextTitleButton >
         <a  href="https://opensea.io/collection/isekaicharacter" class="link_button">OpenSea</a>
        </s.TextTitleButton>
        <s.SpacerSmall/>  
        <s.TextTitleButton>
         <a href="https://medium.com/@isekaimetaverse/create-an-isekai-metaverse-with-isekai-character-5574984bfa53" class="link_button" >Medium</a>
        </s.TextTitleButton>  
        <s.SpacerSmall/>
        <s.TextTitleButton>
         <a href="https://twitter.com/IsekaiMetaverse" class="link_button" >Twitter</a>
         </s.TextTitleButton>  
         <s.SpacerSmall/>
        <s.TextTitleButton>
         <a href="https://discord.com/invite/xrxkhfjAZu" class="link_button" >Discord</a>
         </s.TextTitleButton>  
         <s.SpacerSmall/>
        <s.TextTitleButton>
         <a href="https://polygonscan.com/address/0x44bBB1D7ccf8CB457C6e541E38ea91A4F1b30e71" class="link_button" >Contract</a>
         </s.TextTitleButton> 
        </s.Container1> 
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/1.png"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--accent)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} 
               <s.SpacerXSmall />
              / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                       <s.form>        
                     <s.TextDescription
                     style={{ textAlign: "center", color: "var(--accent-text)" }}>TokenId</s.TextDescription>
                     <s.TextDescription>You can only write story on your own NFT pages</s.TextDescription>
                     <input
                       type="uint256"
                        placeholder="Choose from 1 to 99888"
                         onChange={(event) => setTokenId(event.target.value)}
                     />              
                   </s.form> </s.Container>
                   <s.SpacerMedium />

                   <s.TextDescription //Story
                     style={{ textAlign: "center", color: "var(--accent-text)" }}>Write Your Story</s.TextDescription>
                     <s.SpacerXSmall />
                     <s.TextDescription> 
                       <input class="input"
                       type="string"
                       placeholder="Write your story"
                       onChange={(event) => writeNewStory(event.target.value)}
                     /> </s.TextDescription> 

                   <s.Container ai={"center"} jc={"center"} fd={"row"}>
                   <StyledButton                        
                        disabled={claimingNft ? 1 : 0}                        
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/2.png"}
              style={{ transform: "scaleX(1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"left"} ai={"left"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{ textAlign: "left", color: "var(--accent-text)" }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{ textAlign: "left", color: "var(--accent-text)" }}
          >
            We have launched “Isekai Character”, it is the very first step to start an experimental bottom-up ACGN metaverse project. Everyone in the community can get together to create an “Isekai Metaverse”. You can claim your own characters to use them either as your avatar in “Isekai Metaverse” or references for your ACGN creation.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{ textAlign: "left", color: "var(--accent-text)" }}
          >
          <s.TextTitle style={{ textAlign: "left", color: "var(--accent-text)" }} >
              What is Isekai Character？
          </s.TextTitle>
          <s.SpacerSmall /> 
          Isekai Character is randomized anime characters generated and stored on chain. Stories, images, and other functionality can be created based on the characters. It is inspired by Loot Project, users are free to build their own Isekai Metaverse with Isekai Character.
          <s.SpacerSmall />
          Each character is unique and randomly picked from more than 4 trillion combinations. The following eight categories will be randomly determined for the characters when the NFTs are generated.
          <s.SpacerSmall />
          1. Gender <s.SpacerXSmall />  
          2. Origin (How characters come to Isekai)
          <s.SpacerXSmall />  
          3. Race
          <s.SpacerXSmall />  
          4. Occupation
          <s.SpacerXSmall />  
          5. Ability
          <s.SpacerXSmall />  
          6. Talent
          <s.SpacerXSmall />  
          7. Personality
          <s.SpacerXSmall />  
          8. Title
          <s.SpacerSmall />
          All characters are equally rare when they are minted. The value of each character doesn’t determined by the team which starts this project but by the network it belongs to. The value of each character lies on the derivative works created upon it.
          <s.SpacerSmall />
           <s.TextTitle style={{ textAlign: "left", color: "var(--accent-text)" }} >
              What is Isekai Metaverse?
          </s.TextTitle>
          <s.SpacerSmall />
          Isekai Metaverse is a decentralized ACGN creator ecosystem led by community that enables members to create anime, comics, games and novels. Isekai Character is not just a collectable, but also the primitive to create an Isekai metaverse. Users can make derivative creation attributed to the original Character, such as stories, illustrations, worldviews, music, Live 2D, 3D models, voices and more options which can be used as “cultural Lego bricks” in the ecosystem.
          
          <s.SpacerSmall />
           <s.TextTitle style={{ textAlign: "left", color: "var(--accent-text)" }} >
              Why Isekai?
          </s.TextTitle>
          <s.SpacerSmall />
          
           Contemporary Isekai are more likely to be categorized based upon the elements they have rather than any singular driving ideology. These stories are written and understood not based upon the entirety of its message, but rather how its constituent parts interact with other constituent parts. We relate and understand specific elements differently, thus creating a sort of unique cluster of interpretation that varies from person to person. And it’s with this in mind that isekai is more valuable to be understand as a collection of components rather than in any holistic fashion. Isekai works are often created in a more decentralized way than other fictions. Isekai fits the essence of blockchain perfectly, which can be best demonstrated in Loot project in which there are smart-contract readable parameters for each of the slots to allow games and experiences built on top.
        </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
