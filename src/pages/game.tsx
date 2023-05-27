import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import { handleKey, mouseOverHandler } from "../functions/gameTSX";
import { IMoveState, moveStateInitValues } from "../constants/schemas";
import React from "react";

const Game: NextPage = () => {
  const clientName = trpc.auth.getClientName.useQuery();
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
      if(allBulletsPositions){
        setDebug(`${Object.keys(allBulletsPositions).length}`)
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

  useEffect(() => {
    if (document.activeElement === main.current) {
      moveController.mutate(moveState);
      rotationController.mutate(rotationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveState, rotationState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, true, handleKeyParams);
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, false, handleKeyParams);
  };
  const handleMouseOver = (e: React.MouseEvent<HTMLInputElement>) => {
    mouseOverHandler(e, setRotationState);
  };
  const fire = () => {
    bulletController.mutate(rotationState);
  };

  return (
    <>
      <Head>
        <title>Zombie Assault</title>
        <meta name="description" content="Zombie appocalypse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="m-2 flex w-screen justify-center"
        ref={main}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div
          onMouseMove={handleMouseOver}
          className="relative  h-[600px] w-[1200px] overflow-hidden border-8 border-black bg-white"
        >
          {allPlayersPositions && clientName.data ? (
            <div
              ref={map}
              className="duration-10 absolute flex h-[10000px] w-[10000px]"
              onClick={fire}
              style={{
                top: -(allPlayersPositions[clientName.data]?.y || 0) + 250,
                left: -(allPlayersPositions[clientName.data]?.x || 0) + 550,
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
                        className="absolute h-[100px] w-[100px] bg-[url('/jinx.png')] bg-cover"
                        style={{
                          top: allPlayersPositions[player]?.y,
                          left: allPlayersPositions[player]?.x,
                          transform: `rotate(${allPlayersRotations[player]}deg)`,
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
                        className="absolute h-[5px] w-[5px] bg-white"
                        style={{
                          top:  allBulletsPositions[bullet]?.y,
                          left: allBulletsPositions[bullet]?.x,
                                                 }}
                      ></div>
                    );
                  })}
              </div>
              
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="w-[200px]">
          X:{" "}
          {allPlayersPositions && clientName.data ? (
            Math.ceil(allPlayersPositions[clientName.data]?.x || 0)
          ) : (
            <></>
          )}
          <br></br>
          Y:{" "}
          {allPlayersPositions && clientName.data ? (
            Math.ceil(allPlayersPositions[clientName.data]?.y || 0)
          ) : (
            <></>
          )}
          <br></br>
          Client: {clientName.data}
          {allPlayersPositions &&
            Object.keys(allPlayersPositions).map((player, index) => {
              return (
                <p
                  key={index}
                  style={{
                    color: "red",
                  }}
                >
                  {player}
                  {allPlayersPositions[player]?.x}
                </p>
              );
            })}
          <div className="relative h-[100px] w-[100px] bg-red-500">
            {allPlayersPositions &&
              Object.keys(allPlayersPositions).map((player, index) => {
                return (
                  <div
                    key={index}
                    className="absolute h-[2px] w-[2px] bg-black"
                    style={{
                      top: (100 / 10000) * allPlayersPositions[player]!.y,
                      left: (100 / 10000) * allPlayersPositions[player]!.x,
                    }}
                  ></div>
                );
              })}
          </div>
          {debug}
        </div>
      </main>
    </>
  );
};

export default Game;
