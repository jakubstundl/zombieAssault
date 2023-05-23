import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

const Game: NextPage = () => {
  const [moveMatrix, setMoveMatrix] = useState({
    up: false,
    left: false,
    down: false,
    right: false,
  });
  const [sub, setSub] = useState<{[k: string]: {x: number;y: number}}>({})
  const main = useRef<HTMLDivElement>(null);

  const [w, setW] = useState<boolean>(false);
  const [s, setS] = useState<boolean>(false);
  const [a, setA] = useState<boolean>(false);
  const [d, setD] = useState<boolean>(false);
  const controller = trpc.gameMovement.clientMovementData.useMutation();


  trpc.gameMovement.onMovement.useSubscription(undefined, {
    onData(stateData) {
        setSub(stateData)
        
    }
})

  useEffect(() => {
    if (document.activeElement === main.current) {
      controller.mutate(moveMatrix);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveMatrix]);

  const handleKey = (e: React.KeyboardEvent<HTMLElement>, action: boolean) => {
    if (e.repeat) {
      return;
    } else {
      switch (e.nativeEvent.key) {
        case "w":
          if (action) {
            setW(true);
            setMoveMatrix({
              ...moveMatrix,
              up: true,
            });
          } else {
            setW(false);
            if (a || d) {
              setMoveMatrix({
                ...moveMatrix,
                up: false,
              });
            } else {
              setMoveMatrix({
                ...moveMatrix,
                up: false,
              });
            }
          }
          break;
        case "a":
          if (action) {
            setA(true);
            setMoveMatrix({ ...moveMatrix, left: true });
          } else {
            setA(false);
            if (w || s) {
              setMoveMatrix({ ...moveMatrix, left: false });
            } else {
              setMoveMatrix({ ...moveMatrix, left: false });
            }
          }
          break;
        case "s":
          if (action) {
            setS(true);
            setMoveMatrix({
              ...moveMatrix,
              down: true,
            });
          } else {
            setS(false);
            if (a || d) {
              setMoveMatrix({
                ...moveMatrix,
                down: false,
              });
            } else {
              setMoveMatrix({
                ...moveMatrix,
                down: false,
              });
            }
          }
          break;
        case "d":
          if (action) {
            setD(true);
            setMoveMatrix({ ...moveMatrix, right: true });
          } else {
            setD(false);
            if (w || s) {
              setMoveMatrix({ ...moveMatrix, right: false });
            } else {
              setMoveMatrix({ ...moveMatrix, right: false });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, true);
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, false);
  };

  const fields = [...new Array(10001)];

  return (
    <>
      <Head>
        <title>Zombie Assault</title>
        <meta name="description" content="Zombie appocalypse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        ref={main}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className="relative  h-[600px] w-[600px] overflow-hidden border-8 border-black bg-white">
          <div
            className="absolute flex h-[10000px] w-[10000px]"
            /*   style={{ top: mapPosition.top, left: mapPosition.left }} */
          >
            <div className="flex h-full w-full flex-wrap bg-red-600">
              {fields.map((field, index) => (
                <div
                  className={`flex h-[1%] w-[1%] items-center justify-center  ${
                    Math.floor(index / 100) % 2 == 0
                      ? index % 2 == 0
                        ? "bg-white"
                        : ""
                      : (index + 1) % 2 == 0
                      ? "bg-white"
                      : ""
                  }`}
                  key={index}
                >
                  {index}
                </div>
              ))}
              <div
                className="absolute h-[1%] w-[1%] bg-black"
                  style={{ top: sub["jakub.stundl@seznam.cz"]?.y, left: sub["jakub.stundl@seznam.cz"]?.x }} 
              >

{/* { Object.keys(sub).map((player, index)=>(<div key={index}>{player}{sub[player]?.x}{sub[player]?.y}</div>)) }
 */}              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            console.log("Hello");
          }}
        >
          Button
        </button>
        {/* <div>{`Map X:${mapPosition.left}, Y:${mapPosition.top}`}</div>
        <div>{`Char X:${charPosition.left}, Y:${charPosition.top}`}</div> */}
        <div> 
          {sub["jakub.stundl@seznam.cz"]?.x}{sub["jakub.stundl@seznam.cz"]?.y}
        </div>
      </main>
    </>
  );
};

export default Game;
