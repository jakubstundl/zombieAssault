import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import { handleKey, mouseOverHandler } from "../functions/gameTSX";
import type { IMoveState } from "../constants/schemas";
import { moveStateInitValues } from "../constants/schemas";
import React from "react";

const Game: NextPage = () => {
  const clientName = trpc.auth.getClientName.useQuery();
  const imgSize = trpc.gameMovement.getImgSize.useQuery();

  //Client movement, data sent to backend
  const [moveState, setMoveState] = useState<IMoveState>(moveStateInitValues);
  const [clientMoveDirection, setClientMoveDirection] =
    useState<IMoveState>(moveStateInitValues);
  const moveController = trpc.gameMovement.clientMovementData.useMutation();
  const rotationController = trpc.gameMovement.clientRotationData.useMutation();
  const bulletController = trpc.gameMovement.clientFire.useMutation();
  const handleKeyParams = {
    moveState,
    setMoveState,
    clientMoveDirection,
    setClientMoveDirection,
  };
  const [debug, setDebug] = useState<string>("Debug");

  const [rotationState, setRotationState] = useState<number>(0);
  const main = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);

  trpc.gameMovement.moveAll.useSubscription(undefined, {
    onData(stateData) {
      setAllPlayersPositions(stateData.players);
      setAllBulletsPositions(stateData.bullets);
      setAllEnemiesPositions(stateData.enemies);
      if (allBulletsPositions) {
        setDebug(`${Object.keys(allBulletsPositions).length}`);
      }
    },
  });
  trpc.gameMovement.rotateAll.useSubscription(undefined, {
    onData(rotationData) {
      if (rotationData.name && rotationData.rotation) {
        setAllPlayersRotations({
          ...allPlayersRotations,
          [rotationData.name]: rotationData.rotation,
        });
      }
    },
  });

  const [allPlayersPositions, setAllPlayersPositions] = useState<{
    [k: string]: {
      x: number;
      y: number;
    };
  }>();
  const [allPlayersRotations, setAllPlayersRotations] = useState<{
    [k: string]: number;
  }>();
  const [allBulletsPositions, setAllBulletsPositions] = useState<{
    [k: string]: {
      x: number;
      y: number;
    };
  }>();
  const [allEnemiesPositions, setAllEnemiesPositions] = useState<{
    [k: string]: {
      x: number;
      y: number;
      hp: number;
    };
  }>();

  useEffect(() => {
    if (document.activeElement === main.current) {
      moveController.mutate(moveState);
      rotationController.mutate(rotationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveState, rotationState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, true, handleKeyParams);
    //  setAnimation(true);
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, false, handleKeyParams);
    // setAnimation(false);
  };
  const handleMouseOver = (e: React.MouseEvent<HTMLInputElement>) => {
    mouseOverHandler(e, setRotationState);
  };
  const fire = () => {
    bulletController.mutate(
      rotationState + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10
    );
    console.warn();
  };

  return (
    <>
      <Head>
        <title>Zombie Assault</title>
        <meta name="description" content="Zombie appocalypse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="h-screen w-screen bg-[#171717]"
        ref={main}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className="flex w-full justify-center relative">
          <div
            onMouseMove={handleMouseOver}
            className="relative  box-border aspect-square h-screen overflow-hidden bg-black"
          >
            {allPlayersPositions && clientName.data && imgSize.data ? (
              <div
                ref={map}
                className="duration-10 absolute flex h-[10000px] w-[10000px]"
                onClick={fire}
                style={{
                  top:
                    -(allPlayersPositions[clientName.data]?.y || 0) +
                    window.innerHeight / 2 - (imgSize.data.get("player")||0)/2,
                    
                  left:
                    -(allPlayersPositions[clientName.data]?.x || 0) +
                    window.innerHeight / 2  - (imgSize.data.get("player")||0)/2
                }}
              >
                <div className="flex h-full w-full flex-wrap bg-[url('/f.jpg')]">
                  {/* Renders other Players */}
                  {allPlayersPositions &&
                    allPlayersRotations &&
                    Object.keys(allPlayersPositions).map((player, index) => {
                      return (
                        <div
                          key={index}
                          className="absolute bg-[url('/jinx.png')] bg-cover bg-center bg-no-repeat"
                          // className="absolute h-[100px] w-[100px] bg-no-repeat bg-center"

                          style={{
                            height: imgSize.data?.get("player") || 0,
                            width: imgSize.data?.get("player") || 0,
                            top: allPlayersPositions[player]?.y,
                            left: allPlayersPositions[player]?.x,
                            transform: `rotate(${allPlayersRotations[player]}deg)`,
                            /* backgroundImage: animation?"url('/1g.gif')":"url('/9.png')" */
                          }}
                        ></div>
                      );
                    })}
                  {/* Renders Bullets */}
                  {allBulletsPositions &&
                    Object.keys(allBulletsPositions).map((bullet, index) => {
                      return (
                        <div
                          key={index}
                          className="absolute bg-[url('/bullet.jpg')] bg-cover bg-center bg-no-repeat"
                          style={{
                            height: imgSize.data?.get("bullet") || 0,
                            width: imgSize.data?.get("bullet") || 0,
                            top: allBulletsPositions[bullet]?.y,
                            left: allBulletsPositions[bullet]?.x,
                          }}
                        ></div>
                      );
                    })}
                  {/* Renders Enemies */}
                  {allEnemiesPositions &&
                    Object.keys(allEnemiesPositions).map((enemy, index) => {
                      return (
                        <div
                       
                          key={index}
                          className="absolute select-none pointer-events-none bg-red-500 "
                          style={{
                            height: imgSize.data?.get("enemy") || 0,
                            width: imgSize.data?.get("enemy") || 0,
                            top: allEnemiesPositions[enemy]?.y,
                            left: allEnemiesPositions[enemy]?.x,
                          }}
                        >
                          {allEnemiesPositions[enemy]?.hp}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/*Display data */}
          <div className="absolute left-0 top-0 text-white">
          
            Total bullets on the map: {debug} <br></br>
            Me: {clientName.data}
            <br></br>
            X:{" "}
            {allPlayersPositions && clientName.data ? (
              Math.ceil(allPlayersPositions[clientName.data]?.x || 0)
            ) : (
              <></>
            )}{" "}
            Y:{" "}
            {allPlayersPositions && clientName.data ? (
              Math.floor(allPlayersPositions[clientName.data]?.y || 0)
            ) : (
              <></>
            )}
            <br></br>
            Others:
            {allPlayersPositions &&
              Object.keys(allPlayersPositions)
                .filter((player) => player != clientName.data)
                .map((player, index) => {
                  return (
                    <p
                      key={index}
                      /* style={{
                        color: "black",
                      }} */
                    >
                      {`${player} X:${Math.floor(
                        allPlayersPositions[player]?.x || 0
                      )} Y:${Math.floor(allPlayersPositions[player]?.y || 0)}`}
                    </p>
                  );
                })}
                 
        </div>
            {/*Minimap*/}
        <div className="absolute right-[10px] bottom-[100px]">
            <div className="relative h-[200px] w-[200px] border bg-black">
              {allPlayersPositions &&
                Object.keys(allPlayersPositions).map((player, index) => {
                  return (
                    <div
                      key={index}
                      className="absolute h-[5px] w-[5px] bg-green-500"
                      style={{
                        top: (200 / 10000) * allPlayersPositions[player]!.y,
                        left: (200 / 10000) * allPlayersPositions[player]!.x,
                      }}
                    ></div>
                  );
                })}
              {allEnemiesPositions &&
                Object.keys(allEnemiesPositions).map((enemy, index) => {
                  return (
                    <div
                      key={index}
                      className="absolute h-[5px] w-[5px] bg-red-500"
                      style={{
                        top: (200 / 10000) * allEnemiesPositions[enemy]!.y,
                        left: (200 / 10000) * allEnemiesPositions[enemy]!.x,
                      }}
                    ></div>
                  );
                })}
            </div>
            </div>
        </div>
      
        

      
        
      </main>
    </>
  );
};

export default Game;
