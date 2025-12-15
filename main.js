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

//ax speed
//damage
//hp amount
let hearts = 0
//player movement shenanigans
let px = 100
let py = 300
let ps = 12
let dashCD = 99
//boss x and y
let bx=750;
let by=300;
//ax
let axx = bx+100;
let axy = by+100;
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

let enemyAttack = {
  1: false,
  2: false,
  3: false,
}
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
      dashCD -= stepTime;
      // is the s key still down?
      ps += 100 / stepTime;
    }   
  }
)
//dash cooldown
gi.addDrawing(
  function ({stepTime}) {
     if (dashCD < 99){
      
      dashCD += stepTime/20;}
      if (dashCD > 99){
       dashCD = 99;}
//speed reset
if (ps > 12){
  ps -= stepTime/10;
if (ps < 12){
  ps = 12;
};
//boundarys
}
if (px >= 1450){
  px = 1450;
} 
if (px <= 0){
 px = 0;
}
if (py >= 750){
 py = 750;
}
if (py <= 0){
 py = 0;
}}
)
//Boss
gi.addDrawing(
  function ({ ctx, width, height, elapsed, stepTime }) {
    // Your drawing code here...  
    ctx.beginPath(); 
    ctx.fillStyle = "red";
    ctx.arc(bx,by,50,0,Math.PI*2);
    ctx.fill(); 
  })
//Ax
gi.addDrawing(
  function ({ ctx, width, height, elapsed, stepTime }) {
    // Your drawing code here...  
    ctx.beginPath(); 
    ctx.strokeStyle = "orange";
    ctx.moveTo(bx,by);
    ctx.lineTo(axx,axy);
    ctx.stroke(); 
  })
  //attack 1
  //pulls ax back until click and then boss dashes while spinning ax
  gi.addDrawing(
    function ({ stepTime }) {
      if (enemyAttack[1]) {
        // move boss toward player on x axis
        if (px > bx) { bx += stepTime/2; }
        else if (px < bx) { bx -= stepTime/2; }
        // move boss toward player on y axis
        if (py > by) { by += stepTime/2; }
        else if (py < by) { by -= stepTime/2; }
      }
    }
  )
/* Run the game */
gi.run();


