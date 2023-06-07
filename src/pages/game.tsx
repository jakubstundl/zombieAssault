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
  TurretsState,
} from "../constants/schemas";
import { moveStateInitValues } from "../constants/schemas";
import React from "react";
import { bulletImgURL, turretImgURL } from "../constants/gameConstants";
import router from "next/router";
import { guns } from "../constants/objectProperties/gunProperties";
import { monsters } from "../constants/objectProperties/monsterProperties";

const Game: NextPage = () => {
  const clientName = trpc.auth.getClientName.useQuery();
  const playgroundData = trpc.gameManagement.getPlaygroundData.useQuery();
  const getAvailableGuns = trpc.gameManagement.getAvailableGuns.useMutation();
  const buyGun = trpc.gameManagement.buyGun.useMutation();

  const [minimapSize, setMinimapSize] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>();
  const [gun, setGun] = useState<number>(0);
  const [availableGuns, setAvailableGuns] = useState<boolean[]>(
    getAvailableGuns.data || []
  );
  const [centerPanel, setCenterPanel] = useState<string | undefined>("Level 1");
  const [enemyCounter, setEnemyCounter] = useState<string>();
  const [moveState, setMoveState] = useState<MoveState>(moveStateInitValues);
  const [clientMoveDirection, setClientMoveDirection] =
    useState<MoveState>(moveStateInitValues);
  const [autoShooting, setAutoShooting] = useState<boolean>(false);
  const moveController = trpc.gameMovement.clientMovementData.useMutation();
  const turretController = trpc.gameManagement.setTurret.useMutation();
  const pauseSignal = trpc.gameManagement.pauseTheGame.useMutation();
  const restartSignal = trpc.gameManagement.restartTheGame.useMutation();
  const rotationController = trpc.gameMovement.clientRotationData.useMutation();
  const bulletController = trpc.shootingRouter.clientFire.useMutation();
  const autoShootingController =
    trpc.shootingRouter.autoFireToggle.useMutation();
  const pause = () => {
    pauseSignal.mutate();
  };
  const restart = () => {
    restartSignal.mutate();
  };
  const setTurret = () => {
    turretController.mutate();
  };

  const unlockGun = (n: number) => {
    buyGun.mutate(n);
  };

  const handleKeyParams = {
    moveState,
    setMoveState,
    clientMoveDirection,
    setClientMoveDirection,
    pause,
    restart,
    gun,
    setGun,
    setTurret,
    availableGuns,
    unlockGun,
  };

  const [debug, setDebug] = useState<string>("Debug");
  const [rotationState, setRotationState] = useState<number>(0);
  const main = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);

  trpc.gameMovement.moveAll.useSubscription(undefined, {
    onData(stateData) {
      setEnemyCounter(stateData.enemiesToSpawn);
      setAllPlayersPositions(stateData.players);
      setAllBulletsPositions(stateData.bullets);
      setAllEnemiesPositions(stateData.enemies);
      setAllTurretsPositions(stateData.turrets);
      if (allBulletsPositions) {
        setDebug(`${allBulletsPositions.length}`);
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
  trpc.gameManagement.centerPanel.useSubscription(undefined, {
    onData(data) {
      setCenterPanel(data);
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
  const [allTurretsPositions, setAllTurretsPositions] =
    useState<TurretsState>();

  useEffect(() => {
    if (main.current) {
      main.current.focus();
    }
    getAvailableGuns.mutate();
  }, []);

  useEffect(() => {
    if (getAvailableGuns.data) {
      setAvailableGuns(getAvailableGuns.data);
    }
  }, [getAvailableGuns.data]);

  useEffect(() => {
    if (buyGun.data) {
      setAvailableGuns(buyGun.data);
    }
  }, [buyGun.data]);

  useEffect(() => {
    if (allPlayersPositions && Object.keys(allPlayersPositions).length == 0) {
      router.push("/");
    }
  }, [allPlayersPositions]);

  useEffect(() => {
    if (document.activeElement === main.current) {
      moveController.mutate(moveState);
      rotationController.mutate(rotationState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveState, rotationState]);
  useEffect(() => {
    if (
      document.activeElement === main.current &&
      availableGuns &&
      availableGuns[gun]
    ) {
      autoShootingController.mutate({ autoShooting, gun });
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
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, false, handleKeyParams);
  };
  const handleMouseOver = (e: React.MouseEvent<HTMLInputElement>) => {
    mouseOverHandler(e, setRotationState);
  };

  const fire = () => {
    if (availableGuns && availableGuns[gun]) {
      bulletController.mutate(gun);
    }
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
        autoFocus
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
                  if (guns[gun]?.auto == false) {
                    fire();
                  }
                }}
                onMouseDown={() => {
                  if (guns[gun]?.auto) {
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
                    clientName.data &&
                    allEnemiesPositions.map((enemy, index) => {
                      return (
                        <div
                          key={index}
                          className="pointer-events-none absolute select-none bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: monsters[enemy.monster || 0]?.url,
                            height: monsters[enemy.monster || 0]?.imgSize || 0,
                            width: monsters[enemy.monster || 0]?.imgSize || 0,
                            top: enemy.y,
                            left: enemy.x,
                            transform: `rotate(${
                              -(enemy.rotation || 0) + Math.PI / 2
                            }rad)`,
                          }}
                        ></div>
                      );
                    })}
                  {/* Renders Turrets */}
                  {allTurretsPositions &&
                    allTurretsPositions.map((turret, index) => {
                      return (
                        <div
                          key={index}
                          className="absolute bg-cover bg-center bg-no-repeat duration-100"
                          style={{
                            backgroundImage: turretImgURL,
                            height:
                              playgroundData.data?.imgSize?.get("turret") || 0,
                            width:
                              playgroundData.data?.imgSize?.get("turret") || 0,
                            top: turret.y,
                            left: turret.x,
                            transform: `rotate(${
                              -(turret.rotation || 0) + Math.PI / 2
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
            HP:{" "}
            {allPlayersPositions && clientName.data ? (
              allPlayersPositions[clientName.data]?.hp
            ) : (
              <></>
            )}
            <br></br>
            Cash:{" "}
            {allPlayersPositions && clientName.data ? (
              Math.ceil(allPlayersPositions[clientName.data]?.cash || 0)
            ) : (
              <></>
            )}
            <br></br>
            {/*  autoSHooting: {} <br></br> */}
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
                    <p key={index}>
                      {`${player} X:${Math.floor(
                        allPlayersPositions[player]?.x || 0
                      )} Y:${Math.floor(allPlayersPositions[player]?.y || 0)}`}
                    </p>
                  );
                })}{" "}
            <br></br>
            Enemies to spawn: {enemyCounter} <br></br>
          </div>
          {/*Minimap*/}
          <div className="absolute bottom-[10px] right-[10px] box-border aspect-square w-[10%] border border-2 border-black bg-white">
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
                allEnemiesPositions.map((enemy, index) => {
                  return (
                    <div
                      key={index}
                      className="absolute h-[2%] w-[2%] bg-red-500"
                      style={{
                        top:
                          (minimapSize /
                            (playgroundData.data?.mapSize?.y || 0)) *
                          (enemy.y || 0),
                        left:
                          (minimapSize /
                            (playgroundData.data?.mapSize?.x || 0)) *
                          (enemy.x || 0),
                      }}
                    ></div>
                  );
                })}
            </div>
          </div>
          {/*Gun display*/}
          <div className="absolute bottom-[10px] left-[10px]  box-border aspect-square w-[10%]  border border-2  border-black bg-white text-center text-[80%]">
            {`${guns[gun]?.type} (${guns[gun]?.auto ? "automat" : "manual"})`}
            <br />
            {availableGuns[gun] ? (
              <br />
            ) : (
              `
            Press b to unlock for ${guns[gun]?.cashToUnlock}$
            `
            )}
            <div className="box-border h-[80%] w-full px-[20px]">
              <div
                className="box-border h-full h-full bg-contain bg-center bg-no-repeat"
                style={{
                  opacity: availableGuns[gun] ? 1 : 0.4,
                  backgroundImage: guns[gun]?.url,
                }}
              ></div>{" "}
            </div>
            ◄ q ◄ ► e ►
          </div>
          {/*Center screen info*/}
          <div
            className="absolute flex h-screen w-screen items-center justify-center"
            style={{ display: (centerPanel?.length || 0) > 0 ? "" : "none" }}
          >
            <div className="pointer-events-none box-border  flex h-[50%] w-[50%] items-center justify-center bg-[#171717]">
              <p className="text-[100px] text-red-700">{centerPanel}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Game;
