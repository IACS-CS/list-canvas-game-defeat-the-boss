/* Main game file: main.js */
/* Game: [Your Game Name Here] */
/* Authors: [Your Name(s) Here] */
/* Description: [Short description of your game here] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] 
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

//ax speed
//damage
//hp amount
let hp = 3;
let iframe = 0;
let playState = true;
//player movement shenanigans
let px = 100;
let py = 300;
let ps = 12;
let dashCD = 99;
//boss x and y
let bx = 750;
let by = 300;
let ax = 0;
let ay = 0;
// debug helpers for axe collision visualization
let lastAxeClosestX = 0;
let lastAxeClosestY = 0;
let showAxeDebug = true;

// Code generated with the help of GitHub Copilot
// Begin generated code
/**
 * Compute the shortest distance from point (px,py) to the line segment (x1,y1)-(x2,y2).
 * Returns an object with the distance and the closest point coordinates.
 * @param {number} px
 * @param {number} py
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {{dist:number, cx:number, cy:number}}
 */
function pointSegmentDistance(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;
  const vv = vx * vx + vy * vy;
  // handle degenerate segment
  if (vv === 0) {
    const dx = px - x1;
    const dy = py - y1;
    return { dist: Math.sqrt(dx * dx + dy * dy), cx: x1, cy: y1 };
  }
  // projection factor t of point onto the line
  let t = (wx * vx + wy * vy) / vv;
  if (t < 0) t = 0;
  if (t > 1) t = 1;
  const cx = x1 + vx * t;
  const cy = y1 + vy * t;
  const dx = px - cx;
  const dy = py - cy;
  return { dist: Math.sqrt(dx * dx + dy * dy), cx, cy };
}

/**
 * Check whether the player intersects the axe line (boss center to axe tip). If hit, apply damage and set iframe.
 * @param {number} px - player x
 * @param {number} py - player y
 * @param {number} ax - axe tip x
 * @param {number} ay - axe tip y
 * @param {number} bx - boss center x
 * @param {number} by - boss center y
 * @param {object} [options]
 * @param {number} [options.playerRadius=10]
 * @param {number} [options.axeRadius=6]
 * @param {number} [options.iframeTime=100]
 * @returns {boolean} true if a hit occurred
 */
function checkAxeCollision(px, py, ax, ay, bx, by, options = {}) {
  const playerRadius = options.playerRadius ?? 10;
  const axeRadius = options.axeRadius ?? 6;
  const iframeTime = options.iframeTime ?? 100;
  const { dist, cx, cy } = pointSegmentDistance(px, py, bx, by, ax, ay);
  // store closest point for debug drawing
  lastAxeClosestX = cx;
  lastAxeClosestY = cy;
  if (dist < playerRadius + axeRadius) {
    hp -= 1;
    iframe = iframeTime;
    return true;
  }
  return false;
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
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(`health ${hp}`, 20, 20);
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fill();
  if (hp <=0 ){
    hp = 0
  }
});

/* Input Handlers */

/* Example: Mouse click handler (you can change to handle 
any type of event -- keydown, mousemove, etc) */

let enemyAttack = {
  1: false,
  2: false,
  3: false,
};
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
//Ax
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.beginPath();
  ctx.strokeStyle = "orange";
  ctx.moveTo(bx, by);
  // compute rotating endpoint so the orange line orbits the red circle
  const radius = 120; // distance from boss center to axe end
  const angle = elapsed / 300; // rotation speed (ms -> radians)
  // write to top-level axe coordinates so other code can use them
  ax = bx + Math.cos(angle) * radius;
  ay = by + Math.sin(angle) * radius;
  ctx.lineTo(ax, ay);
  ctx.stroke();
});

// small debug marker to show the closest point from player to the axe line
/*gi.addDrawing(function ({ ctx }) {
  if (!showAxeDebug) return;
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,0,0,0.85)";
  ctx.arc(lastAxeClosestX, lastAxeClosestY, 6, 0, Math.PI * 2);
  ctx.fill();
});*/
//attack 1
//pulls ax back until click and then boss dashes while spinning ax
gi.addDrawing(function ({ stepTime }) {
  if (enemyAttack[1]) {
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
gi.addDrawing(function ({ stepTime }) {});
//damage 
gi.addDrawing(function ({ stepTime }) {
  // damage: use checkAxeCollision for axe hits and distance check for boss body
  if (iframe <= 0) {
    // try axe collision first; the function applies damage and sets iframe when hit
    const hitAxe = checkAxeCollision(px, py, ax, ay, bx, by, { playerRadius: 10, axeRadius: 6, iframeTime: 100 });
    if (!hitAxe) {
      // check boss collision
      const dxB = px - bx;
      const dyB = py - by;
      const distB = Math.sqrt(dxB * dxB + dyB * dyB);
      const playerRadius = 10; // same as drawing radius for player
      const bossRadius = 50; // boss drawing radius
      if (distB < playerRadius + bossRadius) {
        hp -= 1;
        iframe = 100;
      }
    }
  }

  // update invulnerability timer
  if (iframe > 0) {
    iframe -= stepTime / 10;
    if (iframe < 0) iframe = 0;
  }
  // check for game over
  if (hp <= 0) {
    playState = false;
  }
});

if (playState == false){
// Game Over Screen
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.fillStyle = "grey";
  ctx.font = "50px Arial";
  ctx.fillText(`Game Over`, width / 2 - 100, height / 2);
});
/* Run the game */
gi.run();

