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
let ps = 10
let dashCD = 0
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

gi.addHandler(
  "keydown",
  function ({ event, x, y }) {
    if (event.key === "s") {
    py += ps;
  } else if (event.key === "w") {
    py -= ps;
  } else if (event.key === "a") {
    px -= ps;
  } else if (event.key === "d") {
    px += ps;
  } else if (event.key === "f") {
    ps += 10
    dashCD += 1
    if (ps >= 20) {ps = 20}
    if (dashCD >= 1) {ps = 10, dashCD = 0}
  }
    // Your click handling code here...
  }
)


/* Run the game */
gi.run();


