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

/* Variables: Top-Level variables defined here are used to hold game state */
//hp amount and invulnerability timer
let iframe = 0;
let hearts = 3;
//player movement shenanigans
let px = 100;
let py = 300;
let ps = 12;
let dashCD = 99;
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
let enemyAttack = {
  1: false,
  2: false,
  3: false,
};
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
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(`Health - ${hearts}`, 20, 20);
  ctx.fillText(`Time Survived - ${timeSurvived.toFixed(2)}`, width / 2, 20);
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
gi.addDrawing(function ({ ctx, width, height, stepTime }) {
  if (hearts <= 0) {
    gameOver(ctx, width, height);
  }
});
// game over function
function gameOver(ctx, width, height) {
  ctx.fillStyle = "grey";
  ctx.font = "50px Arial";
  ctx.fillText(`Game Over...`, width / 2, height / 2);
  gi.stop();
}
// update timeSurvived
gi.addDrawing(function ({ stepTime }) {
  timeSurvived += stepTime / 1000;
});
// attacks' data to default positions
function updateEnemyAttacks(width, height, stepTime) {
  iframe = 50;
  iframeTimer(stepTime);
  if (!enemyAttack[2]) {
    blipy = 0;
  }
  if (!enemyAttack[1]) {
    bx = width / 2 
    by = height / 2 
  }
  if (!enemyAttack[3]) {
    mbx1 = width / 4;
    mby1 = -100;
    mbx2 = width / 1.25;
    mby2 = -100;
  }
}
// attack timer - update the enemy attack timer and select new attacks
gi.addDrawing(function ({ stepTime, width, height }) {
  updateEnemyAttackTimer(stepTime, width, height);
});
function updateEnemyAttackTimer(stepTime, width, height) {
  if (enemyAttackTimer > 0) {
    enemyAttackTimer -= stepTime / 10;
  }
  if (enemyAttackTimer <= 0) {
    enemyAttackTimer = 0;
    //reset attacks
    enemyAttack[1] = false;
    enemyAttack[2] = false;
    enemyAttack[3] = false;
    updateEnemyAttacks(width, height, stepTime);
    //choose new attack
    let attackChoice = Math.floor(Math.random() * 3) + 1;
    enemyAttack[attackChoice] = true;
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
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.f && dashCD > 0) {
    dashCD -= stepTime;
    // is the s key still down?
    ps += 100 / stepTime;
  }
});
//dash cooldown
gi.addDrawing(function ({ stepTime, width, height }) {
  if (dashCD < 99) {
    dashCD += stepTime / 20;
  }
  if (dashCD > 99) {
    dashCD = 99;
  }
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
  if (enemyAttack[1]) {
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
  if (enemyAttack[2]) {
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
  if (enemyAttack[3]) {
    // Your attack 3 code here...
    //first circle
    if (px > mbx1 && px < width / 2) {
      mbx1 += stepTime / 3.5;
    } else if (px < mbx1 && px < width / 2) {
      mbx1 -= stepTime / 3.5;
    } else {
      mbx1 = width / 4;
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
    } else {
      mbx2 = width / 1.25;
    }
    if (py > mby2 && px > width / 2) {
      mby2 += stepTime / 3.5;
    } else if (py < mby2 && px > width / 2) {
      mby2 -= stepTime / 3.5;
    }
  }
});
/* Run the game */
gi.run();