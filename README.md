[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bAJranOU)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21951635)
# Simple Canvas Game with Lists

## About this Project

In this project, your goal is to create a simple game that demonstrates your understanding of **lists (arrays)** and **functions** in JavaScript. That means you'll need:

1. **User interaction** – ways for the player to control or influence the game
2. **A "goal"** – something the user is trying to do
3. **Feedback** – something that tells the user how they're doing

## Project Requirements

Your game **must** include the following:

1. **Use at least one list (array) for data in the game** – For example, you might have a list of falling objects, a list of enemies, a list of collectible items, or a list of obstacles. The list should be central to your game logic.

2. **Define a named function** – You must create at least one named function (not just anonymous arrow functions). This function should perform a meaningful task in your game.

3. **Call your named function** – Your named function must be called somewhere in your program, and should take parameters and/or return a value.

4. **Optional: Use objects in your list** – For extra challenge, consider storing objects in your list (e.g., a list of objects where each object has properties like `x`, `y`, `speed`, etc.).

Your goal should be to come up with a _new_ game: please don't simply reimplement Pong or a well known existing game.

### Sample Game Ideas Using Lists

Here are some ideas that naturally use lists:

1. **Falling objects game** – Maintain a list of falling objects (raindrops, stars, enemies, etc.) that the player must catch or dodge. Each frame, you loop through the list to update positions and check for collisions.

2. **Bubble shooter / Asteroid field** – Keep a list of bubbles or asteroids on screen. The player shoots or avoids them. When one is hit or leaves the screen, remove it from the list.

3. **Trail or path drawing** – Store a list of points representing where the player has been, then draw a trail connecting them.

4. **Pattern or Fractal generator** – Use a list to store shapes or segments that make up a pattern, and draw them each frame. A user could add to the pattern interactively by clicking. (For example: you could "mirror" the mouse position across the canvas center to create symmetric patterns or snowflakes).

## Planning and Requirements

You should have done pen-and-paper planning _before_ you start this project. The key concepts you need to think through ahead of time are:

### 1. Variables and Lists

What variables will you need to track the game state? For example, you might need variables for:

- Player position
- Score
- Number of lives

**For this project, you must use at least one list (array).** Think about what data makes sense to store in a list:

- A list of falling objects (each with x, y, speed, etc.)
- A list of collectible items
- A list of enemies or obstacles
- A list of particles for visual effects
- A list of points for a path or trail

You should try to design your game to be simple enough that the "state" of the game can be tracked with a small number of variables plus your list(s).

### 2. Drawing Functions

You can add as many drawing functions as you need to your game. It's usually simplest to think of each object as a drawing. Think about what variables you need to draw each object. For example, to draw a player character, you might need:

- x position
- y position
- size

When you have a list of objects, you'll need to **loop through the list** to draw each one.

### 3. User Interaction (event handlers)

What user interactions will you need to handle? For example, you might need:

- Key presses (e.g. left/right arrows to move a character)
- Mouse clicks (e.g. to start the game or interact with objects)
- Mouse movement (e.g. to move a character with the mouse)

You can add as many event handlers as you need. The typical pattern is that you will _update a variable_ in the event handler, and then use that variable in your drawing functions to change what is drawn.

### 4. Named Functions

**For this project, you must define and call at least one named function.** A named function looks like this:

```javascript
function checkCollision(object1, object2) {
  // Check if two objects are colliding
  // Return true or false
}
```

Named functions are different from the anonymous functions you pass to `addDrawing` or event handlers. They have a name that you define, and you call them by that name.

Good candidates for named functions include:

- A function to check for collisions between objects
- A function to spawn a new object and add it to your list
- A function to remove an object from your list
- A function to update the score or reset the game
- A function to draw a specific shape you use multiple times

#### Getting Type Hints in Named Functions

When you create a named function that uses `ctx` (the canvas context), you can add a **JSDoc comment** to get type hints and autocomplete. Add a comment above your function like this:

```javascript
/**
 * Draw a square on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas drawing context
 * @param {number} x - The x position
 * @param {number} y - The y position
 * @param {number} size - The size of the square
 */
function drawSquare(ctx, x, y, size) {
  ctx.fillRect(x, y, size, size); // Now you get autocomplete for ctx!
}
```

The `@param {CanvasRenderingContext2D} ctx` line tells the editor that `ctx` is a canvas context, so you'll get helpful suggestions when you type `ctx.`

### About Functions

A good rule of thumb is a function should "fit" on a screen. If you find yourself scrolling a lot to read a function, it's probably too big and should be broken up into smaller functions that each do one specific thing. For example, you might have a single function in charge of drawing a bouncing ball that grows too long. You could break that function up into smaller parts like:

1. A function to update the ball's position based on velocity.
2. A function to check for collisions with walls and reverse velocity.
3. A function to draw the ball at its current position.

This makes your code easier to read, easier to debug, and easier to reuse.

## Assessment Criteria

Your project will be assessed based on the following criteria:

### 1. Do you use a list (array) effectively in your game?

- **Proficient (3):** A list is used to store multiple items of game data (e.g., falling objects, collectibles). The list is iterated over using a loop.
- **Mastery (4):** The list stores objects with multiple properties. Items are added to and/or removed from the list during gameplay. The code demonstrates understanding of array methods (e.g., `push`, `pop`, `shift`).

### 2. Do you define and use named functions?

- **Proficient (3):** At least one named function is defined and called in the program. The function performs a clear, useful task.
- **Mastery (4):** Multiple named functions are used to organize code. Functions have descriptive names using verbs (e.g., `checkCollision`, `spawnEnemy`). Functions use parameters and/or return values appropriately.

### 3. Do you use variables effectively to track game state?

- **Proficient (3):** Variables are used to track key game state (e.g., player position, score).
- **Mastery (4):** Variables have descriptive names that clearly indicate their purpose. Constants are used to avoid "magic numbers" in code (e.g., using `const GRAVITY = 0.5` instead of just `0.5`). Variable names help make the code "self documenting."

### 4. Do you implement user interaction effectively?

- **Proficient (3):** User interaction is implemented using appropriate event handlers (e.g., keydown, click).
- **Mastery (4):** Student has thought through details of interaction such as edge cases (e.g., what happens if multiple keys are pressed at once). Student also includes a clear way to start/restart the game.

### 5. Is your game fun and engaging to play?

- **Proficient (3):** The game has a clear goal and provides feedback to the player (e.g., score, lives).
- **Mastery (4):** The game includes additional features that enhance engagement (e.g., levels, increasing difficulty, sound effects, visual polish).

### 6. Is your code well organized and easy to read?

- **Proficient (3):** Code is organized into functions and uses consistent indentation and spacing.
- **Mastery (4):** Code includes comments that show understanding of code and suggest student followed a "comment first" approach to writing.

## A Note on AI

Note: I have provided Copilot with instructions for helping you on this project. Because Copilot here knows all about the project and library we are using, I recommend using Copilot _within your editor_ and _NOT_ using outside tools like ChatGPT to help you with this project. Using ChatGPT or similar tools may lead to confusion because they don't have the context of our specific library and project setup.

Whenever you use AI, you need to cite your sources. If you use Copilot to help you write code, please add a comment in your code like this:

```javascript
// Code generated with the help of GitHub Copilot
// in response to prompt: "...summary of prompt..."
// Begin generated code

// End generated code
```

When you use Copilot auto-complete, it is less obvious that you are using AI assistance, so please make sure to
add a general note at the top of your `main.js` file where you acknowledge how you used Copilot in the project.

I _recommend_ that you follow a "comment first" approach to writing your code. If before each line of code you
write a comment describing what you want to do, then you can use Copilot to help you fill in the code for each comment. This way, you are in control of the logic and structure of the code, and Copilot can help you with fussy
details like how you draw a circle on the canvas or other API details.

## Running project

To run project, use

```sh
npm run dev
```

### Your Code

Your code should live in `main.js`

### Demos

See demo.js for some sample code.

Simple Canvas Library home page here: https://thinkle.github.io/simple-canvas-library/
Source code of simple canvas library here: https://github.com/thinkle/simple-canvas-library/
