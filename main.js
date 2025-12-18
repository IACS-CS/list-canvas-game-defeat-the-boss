/* Main game file: main.js */
/* Game: You vs the boss */
/* Authors: Jaydrien and Robby*/
/* Description: Survive the boss's wrath. But you'll fail eventually... */
/* Citations: Copilot - distance formula, key tracking, basic drawing */
/* Note: If you use significant AI help you should cite that here as well */
/* including summaries of prompts and/or interactions you had with the AI */
/* In addition, of course, any AI-generated code should be clearly maked */
/* in comments throughout the code, though of course when using e.g. CoPilot */
/* auto-complete it maye be impractical to mark every line, which is why you */
/* should also include a summary here */

import "./style.css";

import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

/* Variables: Top-Level variables defined here are used to hold game state */
//bullets x and y
//bullet amount

//hp amount
let iframe = 0;
let hearts = 3;
//player movement shenanigans
let px = 100;
let py = 300;
let ps = 12;
let dashCD = 99;
//boss x and y
let bx = 750;
let by = 300;
let blipy = 0;
//enemy attack list
let enemyAttackTimer = 0;
let enemyAttack = {
  1: true,
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
// heart display function
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(`Health - ${hearts}`, 20, 20);
});
// update invulnerability timer
function iframeTimer() {
  if (iframe > 0) {
    iframe -= stepTime / 10;
    if (iframe < 0) iframe = 0;
  }
}
// execute the game over. Game over!
gi.addDrawing(function ({ stepTime }) {
  if (hearts <= 0) {
    gameOver();
  }
});
// game over function
function gameOver() {
  ctx.fillStyle = "grey";
  ctx.font = "50px Arial";
  ctx.fillText(`Game Over...`, width / 2, height / 2);
}

// attacks' data to default to
function updateEnemyAttacks(stepTime, width, height) {
  iframe = 50;
  iframeTimer();
  if (!enemyAttack[2]) {
    blipy = 0;
  }
  if (!enemyAttack[1]) {
    bx = width / 2;
    by = height / 2;
  }
}
// attack timer
function updateEnemyAttackTimer(stepTime, width, height) {
  if (enemyAttackTimer > 0) {
    enemyAttackTimer -= stepTime / 10;
  }
  if (enemyAttackTimer <= 0) {
    enemyAttackTimer = 0;
    //reset attacks
    /*enemyAttack[1] = false;
    enemyAttack[2] = false;
    updateEnemyAttacks(stepTime, width, height);
    //choose new attack
    let attackChoice = Math.floor(Math.random() * 2) + 1;
    enemyAttack[attackChoice] = true;
    enemyAttackTimer = 200; */
  }
}
// handle motion in animation code

gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.w) {
    // is the w key still down?
    py -= (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.s) {
    // is the s key still down?
    py += (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.d) {
    // is the d key still down?
    px += (ps * 10) / stepTime;
  }
});
gi.addDrawing(function ({ stepTime }) {
  // runs 60 times a second...
  if (keysDown.a) {
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
gi.addDrawing(function ({ stepTime }) {
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
  if (px >= 1450) {
    px = 1450;
  }
  if (px <= 0) {
    px = 0;
  }
  if (py >= 750) {
    py = 750;
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
//attack 1
gi.addDrawing(function ({ stepTime }) {
  if (enemyAttack[1]) {
    updateEnemyAttackTimer();
    // move boss toward player on x axis
    if (px > bx) {
      bx += stepTime / 3;
    } else if (px < bx) {
      bx -= stepTime / 3;
    }
    // move boss toward player on y axis
    if (py > by) {
      by += stepTime / 3;
    } else if (py < by) {
      by -= stepTime / 3;
    }
  }
});
//attack 2
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  if (enemyAttack[2]) {
    updateEnemyAttackTimer();
    // Your attack 2 code here...
    ctx.fillStyle = "orange";
    let blipx = 0;

    blipy += stepTime / 5;
    // draw blips across the screen horizontally
    for (let radius = 50; radius < Math.max(width) / 2; radius += width / 100) {
      ctx.beginPath();
      ctx.arc(blipx, blipy, 5, 0, Math.PI * 2);
      ctx.fill();
      blipx += 50;
    }
  }
});
/* Run the game */
gi.run();

