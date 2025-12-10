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

import { GameInterface } from 'simple-canvas-library';

let gi = new GameInterface();

/* Variables: Top-Level variables defined here are used to hold game state */
//bullets x and y
//bullet amount
//boss x and y
//ax
//ax speed
//damage
//hp amount
let hearts = 0
//player movement shenanigans
let px = 100
let py = 100
let ps = 12
let dashCD = 1
/* Drawing Functions */

/* Example drawing function: you can add multiple drawing functions
that will be called in sequence each frame. It's a good idea to do 
one function per each object you are putting on screen, and you
may then want to break your drawing function down into sub-functions
to make it easier to read/follow */
gi.addDrawing(
  function ({ ctx, width, height, elapsed, stepTime }) {
    // Your drawing code here...  
    ctx.beginPath(); 
    ctx.fillStyle = "blue";
    ctx.arc(px,py,10,0,Math.PI*2);
    ctx.fill(); 
  }
)

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

gi.addHandler(
  'keydown',
  function ({ event, x, y }) {    
    keysDown[event.key] = true;
    console.log("keysDown:",keysDown)    
  }
);
gi.addHandler(
  'keyup',
  function ({event, x, y }) {
    keysDown[event.key] = false;
    console.log("keysDown:",keysDown)    
  }
)
// handle motion in animation code
gi.addDrawing(
  function ({stepTime}) {
    // runs 60 times a second...
    if (keysDown.w) {
      // is the w key still down?
      py -= ps * 10 / stepTime;
    }
   }
  )
gi.addDrawing(
  function ({stepTime}) {
    // runs 60 times a second...
    if (keysDown.s) {
      // is the s key still down?
      py += ps * 10 / stepTime;
    }
  }
)
gi.addDrawing(
  function ({stepTime}) {
    // runs 60 times a second...
    if (keysDown.d) {
      // is the d key still down?
      px += ps * 10 / stepTime;
    }
  }
)
gi.addDrawing(
  function ({stepTime}) {
    // runs 60 times a second...
    if (keysDown.a) {
      // is the a key still down?
      px -= ps * 10 / stepTime;
    }
  }
)
gi.addDrawing(
  function ({stepTime}) {
    // runs 60 times a second...
    if (keysDown.f && dashCD > 0) {
      dashCD - stepTime;
      // is the s key still down?
      ps += 100 / stepTime;
    }   
  }
)

if (ps >= 20){
  ps === 12
}
if (px >= 1000){
  px === 10
}
/* Run the game */
gi.run();


