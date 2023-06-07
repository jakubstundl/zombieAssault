import type { TurretProperties } from "../schemas";

export const turrets:TurretProperties[] = [
    {
      type:"Big turret",
      turretIndex:0,
      cashToBuild:1000,
      damage: 100,
      piercing: 1,
      cadence: 20,
      bulletSpeed: 50,
      bulletRange: 60,
      turretRange:500,
    },  
    
  ];

  export const numberOfturrets = Object.keys(turrets).length;