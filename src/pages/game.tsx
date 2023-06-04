import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import { handleKey, mouseOverHandler } from "../functions/gameTSX";
import type {
  MoveState,
  BulletsState,
  EnemiesState,
  PlayersState,
} from "../constants/schemas";
import { moveStateInitValues } from "../constants/schemas";
import React from "react";
import { bulletImgURL, enemyImgURL } from "../constants/gameConstants";

const Game: NextPage = () => {
  const clientName = trpc.auth.getClientName.useQuery();
  const playgroundData = trpc.gameMovement.getPlaygroundData.useQuery();
  const [minimapSize, setMinimapSize] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>();
  const [enemyCounter, setEnemyCounter] = useState<string>();
  //Client movement, data sent to backend
  const [moveState, setMoveState] = useState<MoveState>(moveStateInitValues);
  const [clientMoveDirection, setClientMoveDirection] =
    useState<MoveState>(moveStateInitValues);
  const [autoShootingEnabled, setAutoShootingEnabled] =
    useState<boolean>(false);
  const [autoShooting, setAutoShooting] = useState<boolean>(false);
  const moveController = trpc.gameMovement.clientMovementData.useMutation();
  const pauseSignal = trpc.gameMovement.pauseTheGame.useMutation();
  const restartSignal = trpc.gameMovement.restartTheGame.useMutation();
  const holyHailSignal = trpc.gameMovement.holyHailGrenade.useMutation();
  const rotationController = trpc.gameMovement.clientRotationData.useMutation();
  const bulletController = trpc.gameMovement.clientFire.useMutation();
  const autoShootingController = trpc.gameMovement.autoFireToggle.useMutation();
  const pause = () => {
    pauseSignal.mutate();
  };
  const restart = () => {
    restartSignal.mutate();
  };
  const holyHail = () => {
    holyHailSignal.mutate();
  };
  const handleKeyParams = {
    moveState,
    setMoveState,
    clientMoveDirection,
    setClientMoveDirection,
    setAutoShootingEnabled,
    autoShootingEnabled,
    pause,
    restart,
    holyHail,
  };

  const [debug, setDebug] = useState<string>("Debug");
  const [rotationState, setRotationState] = useState<number>(0);
  const main = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);

  trpc.gameMovement.moveAll.useSubscription(undefined, {
    onData(stateData) {
      setIsPaused(stateData.pause);
      setEnemyCounter(stateData.enemiesToKill);
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
  const [allPlayersRotations, setAllPlayersRotations] = useState<{
    [k: string]: number;
  }>();

  const [allPlayersPositions, setAllPlayersPositions] =
    useState<PlayersState>();
  const [allBulletsPositions, setAllBulletsPositions] =
    useState<BulletsState>();
  const [allEnemiesPositions, setAllEnemiesPositions] =
    useState<EnemiesState>();

  useEffect(() => {
    if (document.activeElement === main.current) {
      moveController.mutate(moveState);
      rotationController.mutate(rotationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveState, rotationState]);
  useEffect(() => {
    if (document.activeElement === main.current) {
      autoShootingController.mutate(autoShooting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoShooting]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMinimapSize(window.innerWidth / 10);
    }
  }, [minimapSize]);

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
      rotationState + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 5
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
        <div className="relative flex w-full justify-center">
          <div
            onMouseMove={handleMouseOver}
            className="relative  box-border h-screen w-screen overflow-hidden bg-black"
          >
           
            {allPlayersPositions &&
            allEnemiesPositions &&
            clientName.data &&
            playgroundData.data ? (
              <div
                ref={map}
                className="duration-10 absolute flex"
                onClick={() => {
                  if (!autoShootingEnabled) {
                    fire();
                  }
                }}
                onMouseDown={() => {
                  if (autoShootingEnabled) {
                    fire();
                    setAutoShooting(true);
                  }
                }}
                onMouseUp={() => {
                  setAutoShooting(false);
                }}
                style={{
                  width: `${playgroundData.data.mapSize?.x}px`,
                  height: `${playgroundData.data.mapSize?.y}px`,
                  top:
                    -(allPlayersPositions[clientName.data]?.y || 0) +
                    window.innerHeight / 2 -
                    (playgroundData.data.imgSize?.get("player") || 0) / 2,

                  left:
                    -(allPlayersPositions[clientName.data]?.x || 0) +
                    window.innerWidth / 2 -
                    (playgroundData.data.imgSize?.get("player") || 0) / 2,
                  /* top:
                    -(allEnemiesPositions[0]?.y || 0) +
                    window.innerHeight / 2 -
                    (playgroundData.data.imgSize.get("player") || 0) / 2,

                  left:
                    -(allEnemiesPositions[0]?.x || 0) +
                    window.innerWidth / 2 -
                    (playgroundData.data.imgSize.get("player") || 0) / 2, */
                }}
              >
                <div className="flex h-full w-full flex-wrap bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat">
                  {/* Renders other Players */}
                  {allPlayersPositions &&
                    allPlayersRotations &&
                    Object.keys(allPlayersPositions).map((player, index) => {
                      return (
                        <div
                          key={index}
                          className="absolute bg-[url('/jinx.png')] bg-cover bg-center bg-no-repeat"
                          style={{
                            height:
                              playgroundData.data?.imgSize?.get("player") || 0,
                            width:
                              playgroundData.data?.imgSize?.get("player") || 0,
                            top: allPlayersPositions[player]?.y,
                            left: allPlayersPositions[player]?.x,
                            transform:
                              player == clientName.data
                                ? `rotate(${rotationState}deg)`
                                : `rotate(${allPlayersRotations[player]}deg)`,
                          }}
                        ></div>
                      );
                    })}
                  {/* Renders Bullets */}
                  {allBulletsPositions &&
                    allBulletsPositions.map((bullet, index) => {
                      return (
                        <div
                          key={index}
                          className="absolute bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: bulletImgURL,
                            height:
                              playgroundData.data?.imgSize?.get("bullet") || 0,
                            width:
                              playgroundData.data?.imgSize?.get("bullet") || 0,
                            top: bullet.y,
                            left: bullet.x,
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
                          className="pointer-events-none absolute select-none bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: enemyImgURL,
                            height:
                              playgroundData.data?.imgSize?.get("enemy") || 0,
                            width:
                              playgroundData.data?.imgSize?.get("enemy") || 0,
                            top: allEnemiesPositions[Number(enemy)]?.y,
                            left: allEnemiesPositions[Number(enemy)]?.x,
                            transform: `rotate(${
                              -(
                                allEnemiesPositions[Number(enemy)]?.rotation ||
                                0
                              ) +
                              Math.PI / 2
                            }rad)`,
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
          {/*Display data */}
          <div className="absolute left-0 top-0 w-[10%] bg-black text-white">
          Paused(p): {isPaused ? "ON" : "OFF"}
            <br></br>
            Automat(q): {autoShootingEnabled ? "ON" : "OFF"}
            <br></br>
            HP:{" "}
            {allPlayersPositions && clientName.data ? (
              Math.ceil(allPlayersPositions[clientName.data]?.hp || 0)
            ) : (
              <></>
            )}
            <br></br>
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
                })} <br></br>
                Enemies to kill: {enemyCounter}
           
          </div>
          {/*Minimap*/}
          <div
            className="absolute box-border aspect-square w-[10%] border border-2 border-black bg-white"
            style={{
              right: 10,
              bottom: 10,
            }}
          >
            <div
              className="relative h-full w-full bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat"
              style={
                {
                  //height: minimapSize*1.04,
                  // width: minimapSize*1.04,
                }
              }
            >
              {allPlayersPositions &&
                Object.keys(allPlayersPositions).map((player, index) => {
                  return (
                    <div
                      key={index}
                      className="absolute h-[3%] w-[3%] bg-green-500"
                      style={{
                        top:
                          (minimapSize /
                            (playgroundData.data?.mapSize?.y || 0)) *
                          (allPlayersPositions[player]?.y || 0),
                        left:
                          (minimapSize /
                            (playgroundData.data?.mapSize?.x || 0)) *
                          (allPlayersPositions[player]?.x || 0),
                      }}
                    ></div>
                  );
                })}
              {allEnemiesPositions &&
                Object.keys(allEnemiesPositions).map((enemy, index) => {
                  return (
                    <div
                      key={index}
                      className="absolute h-[2%] w-[2%] bg-red-500"
                      style={{
                        top:
                          (minimapSize /
                            (playgroundData.data?.mapSize?.y || 0)) *
                          (allEnemiesPositions[Number(enemy)]?.y || 0),
                        left:
                          (minimapSize /
                            (playgroundData.data?.mapSize?.x || 0)) *
                          (allEnemiesPositions[Number(enemy)]?.x || 0),
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
