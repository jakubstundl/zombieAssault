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
  const [animation, setAnimation] = useState(false);
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
    setAnimation(true);
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, false, handleKeyParams);
    setAnimation(false);
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
        className="h-screen w-screen bg-[#171717]"
        ref={main}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className="flex w-full justify-center">
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
                          className="absolute h-[100px] w-[100px] bg-[url('/jinx.png')] bg-cover bg-center bg-no-repeat"
                          // className="absolute h-[100px] w-[100px] bg-no-repeat bg-center"

                          style={{
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
                          className="absolute h-[5px] w-[5px] bg-white"
                          style={{
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
                          className="absolute h-[50px] w-[50px] bg-red-500"
                          style={{
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
        </div>

        <div className="flex w-full justify-around text-white">
          <div className="">
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
</div><div>
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
