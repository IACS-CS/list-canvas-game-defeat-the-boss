/* Main game file: main.js */
/* Game: You vs the boss */
/* Authors: Jaydrien and Robby*/
/* Description: Survive the boss's wrath. But you'll fail eventually... */
/* Citations: Copilot - distance formula, key tracking, basic drawing */
/* Note: If you use significant AI help you should cite that here as well */
// Copilot was used to finish the gameOver function, distance formulas, dashing function, invulnerability timer, and enemyAttackTimer function
/* including summaries of prompts and/or interactions you had with the AI */
/* In addition, of course, any AI-generated code should be clearly maked */
/* in comments throughout the code, though of course when using e.g. CoPilot */
/* auto-complete it maye be impractical to mark every line, which is why you */
/* should also include a summary here */

import "./style.css";

import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

/* Constants: Named constants to avoid magic numbers */
const mediumModeStart = 30; // seconds when medium difficulty begins
const hardModeStart = 60; // seconds when hard difficulty begins
const maxHearts = 5; // maximum health
const easyGreenCount = 3; // health pickups in easy mode
const mediumGreenCount = 1; // health pickups in medium mode
const hardGreenCount = 1; // health pickups in hard mode
const easyRedCount = 0; // traps in easy mode
const mediumRedCount = 1; // traps in medium mode
const hardRedCount = 4; // traps in hard mode
const collectibleRadius = 8; // size of collectible circles

/* Variables: Top-Level variables defined here are used to hold game state */
//hp amount and invulnerability timer
let iframe = 0;
let hearts = 3;
//player movement shenanigans
let px = 100;
let py = 300;
let ps = 12;
//enemy x and y positions
let bx = 750;
let by = 300;
let blipy = 0;
let mbx1 = 0;
let mbx2 = 0;
let mby1 = 0;
let mby2 = 0;
let timeSurvived = 0;
//enemy attack list and timer
let enemyAttackTimer = 0;
let attack4Unlocked = false; // track if hard mode attack is unlocked
// Begin generated code (AI-assisted): collectible arrays
let greenCircles = []; // health pickups
let redCircles = []; // trap circles
// End generated code
// Begin generated code (AI-assisted): enemy attack list with iteration
const enemyAttacks = [
  { id: 1, active: false },
  { id: 2, active: false },
  { id: 3, active: false },
];

function resetEnemyAttacks() {
  for (let i = 0; i < enemyAttacks.length; i++) {
    enemyAttacks[i].active = false;
  }
}

function chooseAttack() {
  resetEnemyAttacks();
  const pick = Math.floor(Math.random() * enemyAttacks.length);
  enemyAttacks[pick].active = true;
}

function isActive(id) {
  for (let i = 0; i < enemyAttacks.length; i++) {
    if (enemyAttacks[i].id === id) {
      return enemyAttacks[i].active;
    }
  }
  return false;
}

// Begin generated code (AI-assisted): spawn collectibles based on difficulty
function spawnCollectibles(width, height) {
  greenCircles = [];
  redCircles = [];

  // Determine difficulty based on time survived
  let greenCount = easyGreenCount; // default easy
  let redCount = easyRedCount;

  if (timeSurvived > hardModeStart) {
    // Hard mode
    greenCount = hardGreenCount;
    redCount = hardRedCount;
  } else if (timeSurvived > mediumModeStart) {
    // Medium mode
    greenCount = mediumGreenCount;
    redCount = mediumRedCount;
  }

  // Spawn green circles
  for (let i = 0; i < greenCount; i++) {
    greenCircles.push({
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      radius: collectibleRadius,
    });
  }

  // Spawn red circles
  for (let i = 0; i < redCount; i++) {
    redCircles.push({
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      radius: collectibleRadius,
    });
  }
}
// End generated code
/* Drawing Functions */
/* Example drawing function: you can add multiple drawing functions
that will be called in sequence each frame. It's a good idea to do 
one function per each object you are putting on screen, and you
may then want to break your drawing function down into sub-functions
to make it easier to read/follow */
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fill();
});

/* Input Handlers */

/* Example: Mouse click handler (you can change to handle 
any type of event -- keydown, mousemove, etc) */

/* Mr. Hinkle showed how to use a keysDown object to track
which keys are currently down with separate keydown and keyup
handlers and then an addDrawing for smooth updates :)
Comment also by Mr. Hinkle because he tries to model
best practices */
let keysDown = {
  // an object to keep track of what keys are currently pressed...
  w: false,
  a: false,
  s: false,
  d: false,
  // fill in...
};
gi.addHandler("keydown", function ({ event, x, y }) {
  keysDown[event.key] = true;
  console.log("keysDown:", keysDown);
});
gi.addHandler("keyup", function ({ event, x, y }) {
  keysDown[event.key] = false;
  console.log("keysDown:", keysDown);
});
// heart and time display function
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText(`Health - ${hearts}`, 20, 20);
  ctx.fillText(`Time Survived - ${timeSurvived.toFixed(2)}`, width / 2, 20);
  if (timeSurvived <= mediumModeStart) {
    ctx.fillText(`Easy`, 20, 40);
  } else if (timeSurvived >= mediumModeStart && timeSurvived <= hardModeStart) {
    ctx.fillStyle = "orange";
    ctx.fillText(`Medium`, 20, 40);
    ctx.fillText(`Don't collect the red circles!`, 20, 60);
  } else {
    ctx.fillStyle = "red";
    ctx.fillText(`Hard`, 20, 40);
  }
});

function damage() {
  if (iframe <= 0) {
    hearts -= 1;
    iframe = 100;
  }
}
// AI generated code for boss collision detection
gi.addDrawing(function ({ stepTime }) {
  const dxB = px - bx;
  const dyB = py - by;
  const distB = Math.sqrt(dxB * dxB + dyB * dyB);
  const playerRadius = 10; // same as drawing radius for player
  const bossRadius = 50; // boss drawing radius
  if (distB < playerRadius + bossRadius) {
    damage();
  }
});
// update invulnerability timer
function iframeTimer(stepTime) {
  if (iframe > 0) {
    iframe -= stepTime / 10;
    if (iframe < 0) iframe = 0;
  }
}
// call iframeTimer every frame to decrease iframe
gi.addDrawing(function ({ stepTime }) {
  iframeTimer(stepTime);
});
// execute the game over. Game over!

// game over function
function gameOver(ctx, width, height) {
  ctx.fillStyle = "grey";
  ctx.font = "50px Arial";
  ctx.fillText(`Game Over...`, width / 5, height / 2);
  gi.stop();
}
// update timeSurvived
gi.addDrawing(function ({ stepTime }) {
  timeSurvived += stepTime / 1000;

  // Begin generated code (AI-assisted): unlock attack 4 after 10 seconds
  // Add a 4th attack to the array when player survives to medium mode
  if (timeSurvived > mediumModeStart && !attack4Unlocked) {
    enemyAttacks.push({ id: 4, active: false });
    attack4Unlocked = true;
    console.log("Medium mode unlocked! Attack 4 added to pool.");
  }
  // End generated code
});
// enemyAttacks' data to default positions
function updateEnemyenemyAttacks(width, height, stepTime) {
  iframe = 50;
  iframeTimer(stepTime);
  if (!isActive(2)) {
    blipy = -10;
  }
  if (!isActive(1)) {
    bx = width / 2;
    by = height / 2;
  }
  if (!isActive(3)) {
    mbx1 = width / 4;
    mby1 = -20;
    mbx2 = width / 1.25;
    mby2 = -20;
  }
}
// attack timer - update the enemy attack timer and select new enemyAttacks
gi.addDrawing(function ({ stepTime, width, height }) {
  updateEnemyAttackTimer(stepTime, width, height);
});
function updateEnemyAttackTimer(stepTime, width, height) {
  if (enemyAttackTimer > 0) {
    enemyAttackTimer -= stepTime / 10;
  }
  if (enemyAttackTimer <= 0) {
    resetEnemyAttacks();
    updateEnemyenemyAttacks(width, height, stepTime);
    chooseAttack();
    spawnCollectibles(width, height); // spawn collectibles with each attack
    enemyAttackTimer = 500;
  }
}
// handle motion in animation code

gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.w || keysDown.ArrowUp) {
    // is the w key still down?
    py -= (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.s || keysDown.ArrowDown) {
    // is the s key still down?
    py += (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.d || keysDown.ArrowRight) {
    // is the d key still down?
    px += (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.a || keysDown.ArrowLeft) {
    // is the a key still down?
    px -= (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime, width, height }) {
  //speed reset
  if (ps > 12) {
    ps -= stepTime / 10;
    if (ps < 12) {
      ps = 12;
    }
    //boundarys
  }
  if (px >= width) {
    px = width;
}
  if (px <= 0) {
    px = 0;
  }
  if (py >= height) {
    py = height;
  }
  if (py <= 0) {
    py = 0;
  }
});
//Boss
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(bx, by, 50, 0, Math.PI * 2);
  ctx.fill();
});
gi.addDrawing(function ({ ctx, width, height, stepTime }) {
  if (hearts <= 0) {
    gameOver(ctx, width, height);
  }
});
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(mbx1, mby1, 10, 0, Math.PI * 2);
  ctx.fill();
});
// collision detection for first yellow circle
// AI generated code
gi.addDrawing(function ({ stepTime }) {
  const dx1 = px - mbx1;
  const dy1 = py - mby1;
  const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const playerRadius = 10;
  const yellowRadius = 10;
  if (dist1 < playerRadius + yellowRadius) {
    damage();
  }
});
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(mbx2, mby2, 10, 0, Math.PI * 2);
  ctx.fill();
});
// collision detection for second yellow circle
// AI generated code
gi.addDrawing(function ({ stepTime }) {
  const dx2 = px - mbx2;
  const dy2 = py - mby2;
  const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  const playerRadius = 10;
  const yellowRadius = 10;
  if (dist2 < playerRadius + yellowRadius) {
    damage();
  }
});
//attack 1
gi.addDrawing(function ({ stepTime }) {
  if (isActive(1)) {
    // move boss toward player on x axis
    if (px > bx) {
      bx += stepTime / 5;
    } else if (px < bx) {
      bx -= stepTime / 5;
    }
    // move boss toward player on y axis
    if (py > by) {
      by += stepTime / 5;
    } else if (py < by) {
      by -= stepTime / 5;
    }
  }
});
//attack 2
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  if (isActive(2)) {
    // Your attack 2 code here...
    ctx.fillStyle = "orange";
    let blipx = 0;

    blipy += stepTime / 5;
    // draw blips across the screen horizontally
    for (let radius = 50; radius < Math.max(width) / 2; radius += width / 100) {
      ctx.beginPath();
      ctx.arc(blipx, blipy, 5, 0, Math.PI * 2);
      ctx.fill();

      // collision detection for each orange circle
      const dxOrange = px - blipx;
      const dyOrange = py - blipy;
      const distOrange = Math.sqrt(dxOrange * dxOrange + dyOrange * dyOrange);
      const playerRadius = 10;
      const orangeRadius = 5;
      if (distOrange < playerRadius + orangeRadius) {
        damage();
      }

      blipx += 50;
    }
  }
});
// attack 3
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  if (isActive(3)) {
    // Your attack 3 code here...
    //first circle
    if (px > mbx1 && px < width / 2) {
      mbx1 += stepTime / 3.5;
    } else if (px < mbx1 && px < width / 2) {
      mbx1 -= stepTime / 3.5;
    }
    if (py > mby1 && px < width / 2) {
      mby1 += stepTime / 3.5;
    } else if (py < mby1 && px < width / 2) {
      mby1 -= stepTime / 3.5;
      //second circle
    }
    if (px > mbx2 && px > width / 2) {
      mbx2 += stepTime / 3.5;
    } else if (px < mbx2 && px > width / 2) {
      mbx2 -= stepTime / 3.5;
    }
    if (py > mby2 && px > width / 2) {
      mby2 += stepTime / 3.5;
    } else if (py < mby2 && px > width / 2) {
      mby2 -= stepTime / 3.5;
    }
  }
});
// attack 4 - horizontal projectiles (hard mode)
// Begin generated code (AI-assisted): attack 4 implementation
let purpleX1 = 0; // left to right
let purpleX2 = 0; // right to left

gi.addDrawing(function ({ ctx, width, height, stepTime }) {
  if (isActive(4)) {
    ctx.fillStyle = "purple";

    // First projectile moves left to right (50 above center)
    purpleX1 += stepTime / 3;
    if (purpleX1 > width) purpleX1 = 0;

    // Second projectile moves right to left (50 below center)
    purpleX2 -= stepTime / 3;
    if (purpleX2 < 0) purpleX2 = width;

    // Draw first projectile (50 above center)
    ctx.beginPath();
    ctx.arc(purpleX1, height / 2 - 50, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw second projectile (50 below center)
    ctx.beginPath();
    ctx.arc(purpleX2, height / 2 + 50, 10, 0, Math.PI * 2);
    ctx.fill();

    // Collision detection
    const dist1 = Math.sqrt(
      (px - purpleX1) ** 2 + (py - (height / 2 - 50)) ** 2
    );
    const dist2 = Math.sqrt(
      (px - purpleX2) ** 2 + (py - (height / 2 + 50)) ** 2
    );
    if (dist1 < 20 || dist2 < 20) damage();
  }
});
// End generated code

// Begin generated code (AI-assisted): draw and handle collectibles
// Draw and handle green circles (health)
gi.addDrawing(function ({ ctx }) {
  ctx.fillStyle = "green";
  for (let i = greenCircles.length - 1; i >= 0; i--) {
    const circle = greenCircles[i];
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();

    // Check collision with player
    const dist = Math.sqrt((px - circle.x) ** 2 + (py - circle.y) ** 2);
    if (dist < 10 + circle.radius) {
      if (hearts < maxHearts) hearts += 1; // add health up to maximum
      greenCircles.splice(i, 1); // remove from array
    }
  }
});

// Draw and handle red circles (traps)
gi.addDrawing(function ({ ctx }) {
  ctx.fillStyle = "red";
  for (let i = redCircles.length - 1; i >= 0; i--) {
    const circle = redCircles[i];
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();

    // Check collision with player
    const dist = Math.sqrt((px - circle.x) ** 2 + (py - circle.y) ** 2);
    if (dist < 10 + circle.radius) {
      damage(); // subtract health
      redCircles.splice(i, 1); // remove from array
    }
  }
});
// End generated code

/* Run the game */
gi.run();
