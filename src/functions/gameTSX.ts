import type { Dispatch, SetStateAction } from "react";
import type { HandleKeyMovement } from "../constants/schemas";
import { numberOfGuns } from "../constants/objectProperties/gunProperties";


export const handleKey = (
  e: React.KeyboardEvent<HTMLElement>,
  action: boolean,
  params: HandleKeyMovement
) => {
  if (e.repeat) {
    return;
  } else {
    switch (e.nativeEvent.key) {
      case "w":
        if (action) {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            up: true,
          });
          params.setMoveState({
            ...params.moveState,
            up: true,
          });
        } else {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            up: false,
          });
          if (
            params.clientMoveDirection.left ||
            params.clientMoveDirection.right
          ) {
            params.setMoveState({
              ...params.moveState,
              up: false,
            });
          } else {
            params.setMoveState({
              ...params.moveState,
              up: false,
            });
          }
        }
        break;
      case "a":
        if (action) {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            left: true,
          });
          params.setMoveState({ ...params.moveState, left: true });
        } else {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            left: false,
          });
          if (
            params.clientMoveDirection.up ||
            params.clientMoveDirection.down
          ) {
            params.setMoveState({ ...params.moveState, left: false });
          } else {
            params.setMoveState({ ...params.moveState, left: false });
          }
        }
        break;
      case "s":
        if (action) {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            down: true,
          });
          params.setMoveState({
            ...params.moveState,
            down: true,
          });
        } else {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            down: false,
          });
          if (
            params.clientMoveDirection.left ||
            params.clientMoveDirection.right
          ) {
            params.setMoveState({
              ...params.moveState,
              down: false,
            });
          } else {
            params.setMoveState({
              ...params.moveState,
              down: false,
            });
          }
        }
        break;
      case "d":
        if (action) {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            right: true,
          });
          params.setMoveState({ ...params.moveState, right: true });
        } else {
          params.setClientMoveDirection({
            ...params.clientMoveDirection,
            right: false,
          });
          if (
            params.clientMoveDirection.up ||
            params.clientMoveDirection.down
          ) {
            params.setMoveState({ ...params.moveState, right: false });
          } else {
            params.setMoveState({ ...params.moveState, right: false });
          }
        }
        break;
      case "e":
        if (action) {
          params.setGun(Math.min(numberOfGuns - 1, params.gun + 1));
        }
        break;
      case "q":
        if (action) {
          params.setGun(Math.max(0, params.gun - 1));
        }
        break;
      case "b":
        if (action) {
          if (!params.availableGuns[params.gun]) {
            params.unlockGun(params.gun);
          }
        }
        break;

      case "p":
        if (action) {
          params.pause();
        }
        break;
      case "r":
        if (action) {
          params.setTurret();
        }
        break;

      default:
        break;
    }
  }
};

export const mouseOverHandler = (
  e: React.MouseEvent<HTMLInputElement>,
  setRotation: Dispatch<SetStateAction<number>>
) => {
  const div = e.currentTarget as HTMLDivElement;
  const x = e.clientX - div.offsetLeft - window.innerWidth / 2;
  const y = e.clientY - div.offsetTop - window.innerHeight / 2;
  if (y < 0) {
    let angle = Math.atan(x / y) * (180 / Math.PI) * -1;
    if (angle < 0) {
      angle = 360 - Math.abs(angle);
    }
    setRotation(angle);
  } else {
    const angle = 180 + Math.atan(x / y) * (180 / Math.PI) * -1;
    setRotation(angle);
  }
};
