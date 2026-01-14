true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

const style = '';

class p {
  /**
   * Creates a new GameCanvas instance.
   *
   * @param id - The Canvas Element OR the ID of the canvas element we will render the game in.
   * @param config - Optional configuration object
   * @param config.size - Optional size for canvas. Otherwise size is taken from explicitly set width/height OR from the element's size on the page.
   * @param config.autoresize - Whether to resize the game canvas to the DOM canvas automatically (defaults to true)
   */
  constructor(t, e = {}) {
    if (this.isRunning = !1, this.tick = (i) => {
      this.doDrawing(i ?? performance.now()), this.isRunning && (this.animationFrameId = window.requestAnimationFrame(this.tick));
    }, !t)
      throw new Error(
        `GameCanvas must be called with the ID of a canvas, like this

const game=new GameCanvas("mycanvasid")`
      );
    if (this.canvas = typeof t == "string" ? document.getElementById(t) : t, !this.canvas)
      throw new Error("No canvas element found at ID=" + t);
    this.ctx = this.canvas.getContext("2d"), this.drawings = [], this.drawingMetadata = [], this.handlers = { resize: [] }, this.autoresize = e.autoresize ?? !e.size, this.setInitialCanvasSize(e.size), this.setupHandlers();
  }
  setInitialCanvasSize(t) {
    t != null && t.width ? (this.canvas.width = t.width, this.width = t.width) : this.canvas.getAttribute("width") ? this.width = this.canvas.width : (this.width = this.canvas.clientWidth, this.canvas.width = this.width), t != null && t.height ? (this.canvas.height = t.height, this.height = t.height) : this.canvas.getAttribute("height") ? this.height = this.canvas.height : (this.height = this.canvas.clientHeight, this.canvas.height = this.height);
  }
  setupHandlers() {
    const t = [
      "click",
      "dblclick",
      "mousedown",
      "mousemove",
      "mouseup",
      "keyup",
      "keydown",
      "keypress"
    ];
    for (const e of t)
      this.handlers[e] = [], this.canvas.tabIndex = 1e3, this.canvas.addEventListener(e, (i) => {
        const s = i.offsetX, n = i.offsetY;
        for (const r of this.handlers[e])
          if (r({ x: s, y: n, type: e, event: i })) return;
      });
  }
  observeCanvasResize() {
    new window.ResizeObserver((e) => {
      for (let i of e) {
        this.autoresize && this.setCanvasSize(i.contentRect.width, i.contentRect.height);
        for (const s of this.handlers.resize)
          if (s({
            width: i.contentRect.width,
            height: i.contentRect.height,
            canvas: this.canvas,
            setCanvasSize: this.setCanvasSize.bind(this),
            ctx: this.ctx
          })) return;
      }
    }).observe(this.canvas);
  }
  setCanvasSize(t, e) {
    this.width = t, this.height = e, this.canvas.width = t, this.canvas.height = e;
  }
  doDrawing(t) {
    this.ctx.clearRect(0, 0, this.width, this.height), this.drawings.forEach((e, i) => {
      const s = () => {
        this.drawingMetadata[i].off = !0;
      }, n = this.drawingMetadata[i];
      if (n.off) return;
      let r, a = n.__lastTime ? t - n.__lastTime : 0;
      n.__lastTime = t, n.__startTime ? r = t - n.__startTime : (r = 0, n.__startTime = t), e.draw ? e.draw({
        ctx: this.ctx,
        width: this.width,
        height: this.height,
        remove: s,
        timestamp: t,
        elapsed: r,
        stepTime: a
      }) : e({
        ctx: this.ctx,
        width: this.width,
        height: this.height,
        remove: s,
        timestamp: t,
        elapsed: r,
        stepTime: a
      });
    });
  }
  /**
   * run the game (start animations, listen for events).
   * @method
   */
  run() {
    this.autoresize && (this.observeCanvasResize(), this.setCanvasSize(this.canvas.clientWidth, this.canvas.clientHeight)), this.isRunning = !0, this.tick();
  }
  /**
   * Stop the game animation loop.
   * @method
   */
  stop() {
    this.isRunning = !1, this.animationFrameId && (window.cancelAnimationFrame(this.animationFrameId), this.animationFrameId = void 0);
  }
  /**
   * Check if the game is currently running.
   * @returns Whether the game is running
   */
  getIsRunning() {
    return this.isRunning;
  }
  /**
   * Add a drawing to our drawing queue (it will remain until we remove it).
   *
   * @param d - draw function OR an object with a draw callback method
   * @returns ID that can be used in removeDrawing callback to remove drawing.
   *
   * @example <caption>Passing a draw function</caption>
   * ```typescript
   * game.addDrawing(
   *     function ({ctx,elapsed}) {
   *         ctx.beginPath();
   *         ctx.moveTo(200,200);
   *         ctx.lineTo(100,200+Math.sin(elapsed/10)*200);
   *         ctx.stroke();
   *     }
   * );
   * ```
   *
   * @example <caption>Passing an object with a draw method</caption>
   * ```typescript
   * game.addDrawing(
   *      { x : 0,
   *        y : 0,
   *        w : 100,
   *        h : 100,
   *        draw ({ctx,stepTime,width,height}) {
   *           this.x += stepTime/20;
   *           this.y += stepTime/20;
   *           if (this.x > width) { this.x = 0 }
   *           if (this.y > height) { this.y = 0 }
   *           ctx.fillRect(this.x,this.y,this.w,this.h)
   *        },
   *      }
   * );
   * ```
   *
   * @example <caption>A drawing that will remove itself when it leaves the screen</caption>
   * ```typescript
   * game.addDrawing(
   *     function ({ctx,elapsed,width,remove}) {
   *         const x = elapsed / 20
   *         ctx.fillRect(x,20,20,20);
   *         if (x > width) { remove() }
   *     }
   * );
   * ```
   */
  addDrawing(t) {
    return this.drawings.push(t), this.drawingMetadata.push({}), this.drawings.length - 1;
  }
  /**
   * Remove a drawing by its ID.
   *
   * @param idx - drawing ID to remove (return value from addDrawing).
   */
  removeDrawing(t) {
    if (typeof t != "number")
      throw new Error(
        `removeDrawing must have a numeric ID as an argument. Received ${typeof t} ${t}`
      );
    this.drawingMetadata[t] ? this.drawingMetadata[t].off = !0 : console.log("WARNING: Attempt to remove non-existent drawing: %s", t);
  }
  /**
   * Restore a previously removed drawing (start drawing again).
   *
   * @param idx - drawing ID to restore (start drawing again).
   */
  restoreDrawing(t) {
    if (typeof t != "number")
      throw new Error(
        `restoreDrawing must have a numeric ID as an argument. Received ${typeof t} ${t}`
      );
    this.drawingMetadata[t].off = !1;
  }
  /**
   * Replace a drawing by id
   */
  replaceDrawing(t, e) {
    return this.drawings[t] = e, t;
  }
  addHandler(t, e) {
    if (!this.handlers[t])
      throw new Error(
        `No eventType ${t}: SimpleCanvasLibrary only supports events of type: ${Object.keys(
          this.handlers
        ).join(",")}`
      );
    if (typeof e != "function")
      throw new Error(
        `addHandler requires a function as second argument. ${e} is a ${typeof e}, not a function.`
      );
    return this.handlers[t].push(e), this.handlers[t].length - 1;
  }
  /**
   * Remove handler for eventType.
   */
  removeHandler(t, e) {
    if (!this.handlers[t])
      throw new Error(
        `No eventType ${t}: SimpleCanvasLibrary only supports events of type: ${Object.keys(
          this.handlers
        ).join(",")}`
      );
    this.handlers[t][e] = () => {
    };
  }
  /**
   * Syntactic sugar for addHandler('click',h).
   *
   * @param h - A function to handle click events
   * @returns ID that can be used to remove handler with removeClickHandler
   *
   * @example <caption>Make a drawing move whenever there is a click</caption>
   * ```typescript
   * let xpos = 100;
   * let ypos = 100;
   * // Register a handler to update our variable each time
   * // there is a click.
   * game.addClickHandler(
   *     function ({x,y}) {
   *       // set variables...
   *       xpos = x;
   *       ypos = y;
   *     }
   * )
   * // Now create a drawing that uses the variable we set.
   * game.addDrawing(
   *     function ({ctx}) {ctx.fillRect(xpos,ypos,30,30)}
   * )
   * ```
   */
  addClickHandler(t) {
    if (typeof t != "function")
      throw new Error(
        `addClickHandler requires a function as an argument. ${t} is a ${typeof t}, not a function.`
      );
    return this.handlers.click.push(t), this.handlers.click.length - 1;
  }
  /**
   * Syntactic sugar for removeHandler('click',h)
   */
  removeClickHandler(t) {
    this.handlers.click[t] = () => {
    };
  }
  /**
   * Register a handler h for resize
   */
  addResizeHandler(t) {
    return this.addHandler("resize", t);
  }
  /**
   * Syntactic sugar for removeHandler('resize',h)
   */
  removeResizeHandler(t) {
    return this.removeHandler("resize", t);
  }
  /**
   * Get current canvas size
   */
  getSize() {
    return { width: this.width, height: this.height };
  }
}
console.log("Importing Sprite.ts");
class d {
  constructor(t) {
    this.isVisible = !0, this.isEnabled = !0, this.element = t;
  }
  /**
   * Show the component
   */
  show() {
    return this.isVisible = !0, this.element.style.display = "", this;
  }
  /**
   * Hide the component
   */
  hide() {
    return this.isVisible = !1, this.element.style.display = "none", this;
  }
  /**
   * Enable the component
   */
  enable() {
    return this.isEnabled = !0, this.element.style.opacity = "1", this.element.style.pointerEvents = "auto", (this.element instanceof HTMLInputElement || this.element instanceof HTMLButtonElement) && (this.element.disabled = !1), this;
  }
  /**
   * Disable the component
   */
  disable() {
    return this.isEnabled = !1, this.element.style.opacity = "0.5", this.element.style.pointerEvents = "none", (this.element instanceof HTMLInputElement || this.element instanceof HTMLButtonElement) && (this.element.disabled = !0), this;
  }
  /**
   * Get the underlying DOM element
   */
  getElement() {
    return this.element;
  }
  /**
   * Check if the component is visible
   */
  getIsVisible() {
    return this.isVisible;
  }
  /**
   * Check if the component is enabled
   */
  getIsEnabled() {
    return this.isEnabled;
  }
}
class f extends d {
  constructor(t) {
    const e = document.createElement("button");
    if (e.textContent = t.text, e.addEventListener("click", t.onclick), super(e), this.config = t, t.class)
      e.className = t.class;
    else {
      if (e.style.cssText = `
        padding: 8px 16px;
        margin: 4px;
        border: 1px solid var(--button-border-color, #ccc);
        border-radius: 4px;
        background: var(--button-background, #f0f0f0);
        color: var(--button-text-color, #222);
        cursor: pointer;
        font-size: var(--button-font-size, 14px);
        font-family: var(--button-font-family, inherit);
        transition: background 0.15s;
      `, t.style) {
        const i = {
          color: "--button-background",
          textColor: "--button-text-color",
          fontSize: "--button-font-size",
          fontFamily: "--button-font-family",
          borderColor: "--button-border-color",
          hoverColor: "--button-hover-background"
        };
        for (const [s, n] of Object.entries(t.style))
          i[s] && e.style.setProperty(i[s], n);
      }
      if (t.cssVars)
        for (const [i, s] of Object.entries(t.cssVars))
          e.style.setProperty(i, s);
      e.addEventListener("mouseenter", () => {
        this.isEnabled && (e.style.background = getComputedStyle(e).getPropertyValue(
          "--button-hover-background"
        ) || "#e0e0e0");
      }), e.addEventListener("mouseleave", () => {
        this.isEnabled && (e.style.background = getComputedStyle(e).getPropertyValue("--button-background") || "#f0f0f0");
      });
    }
  }
  /**
   * Update the button text
   */
  setText(t) {
    return this.config.text = t, this.element.textContent = t, this;
  }
  /**
   * Get the current button text
   */
  getText() {
    return this.config.text;
  }
}
class g extends d {
  constructor(t) {
    const e = document.createElement("div");
    t.class ? e.className = t.class : e.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin: 4px;
        gap: 8px;
        background: var(--input-container-background, transparent);
      `;
    let i;
    t.label && (i = document.createElement("label"), i.textContent = t.label + ":", i.style.cssText = `
        font-size: 14px;
        font-weight: bold;
        color: var(--label-color, #222);
      `, e.appendChild(i));
    const s = document.createElement("input");
    s.type = "number", t.min !== void 0 && (s.min = t.min.toString()), t.max !== void 0 && (s.max = t.max.toString()), t.step !== void 0 && (s.step = t.step.toString()), t.value !== void 0 && (s.value = t.value.toString()), t.class || (s.style.cssText = `
        padding: 4px 8px;
        border: 1px solid var(--input-border-color, #ccc);
        border-radius: 4px;
        font-size: 14px;
        width: 80px;
        background: var(--input-background, #fff);
        color: var(--input-text-color, #222);
      `), s.addEventListener("input", () => {
      const n = parseFloat(s.value);
      isNaN(n) || t.oninput(n);
    }), e.appendChild(s), super(e), this.config = t, this.input = s, this.label = i;
  }
  /**
   * Get the current value
   */
  getValue() {
    return parseFloat(this.input.value) || 0;
  }
  /**
   * Set the value
   */
  setValue(t) {
    return this.input.value = t.toString(), this.config.oninput(t), this;
  }
  /**
   * Update the label text
   */
  setLabel(t) {
    return this.label && (this.label.textContent = t + ":"), this;
  }
  /**
   * Enable the input
   */
  enable() {
    return super.enable(), this.input.disabled = !1, this;
  }
  /**
   * Disable the input
   */
  disable() {
    return super.disable(), this.input.disabled = !0, this;
  }
}
class b extends d {
  constructor(t = {}) {
    const e = document.createElement("div");
    if (e.style.cssText = `
      display: flex;
      align-items: center;
      margin: 5px 10px;
      gap: 8px;
      /* host CSS variables (overridable) */
      font-family: var(--scl-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial);
      color: var(--scl-color-text, #e6e6e6);
      background: var(--scl-input-bg, transparent);
    `, super(e), this.config = t, z(this.element, this.config.theme), this.config.cssVars)
      for (const [i, s] of Object.entries(this.config.cssVars))
        this.element.style.setProperty(i, s);
    this.createSlider();
  }
  createSlider() {
    if (this.config.label) {
      const t = document.createElement("label");
      t.textContent = this.config.label + ":", t.style.cssText = `
        font-size: var(--scl-font-size, 14px);
        font-weight: 500;
        color: var(--scl-color-text, #e6e6e6);
        margin-right: 8px;
        white-space: nowrap;
      `, this.element.appendChild(t);
    }
    this.input = document.createElement("input"), this.input.type = "range", this.input.min = String(this.config.min ?? 0), this.input.max = String(this.config.max ?? 100), this.input.value = String(this.config.value ?? 50), this.input.step = String(this.config.step ?? 1), this.input.disabled = this.config.disabled ?? !1, this.input.style.cssText = `
      flex: 1;
      min-width: 100px;
      height: 20px;
      background: var(--scl-color, #5a5a5a);      
      color: var(--scl-color-text, #777777ff);
    `, this.valueDisplay = document.createElement("span"), this.valueDisplay.textContent = this.input.value, this.valueDisplay.style.cssText = `
      font-size: var(--scl-font-size, 14px);
      color: var(--scl-color-muted, #9ca3af);
      min-width: 30px;
      text-align: right;
      font-family: var(--scl-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial);
    `, this.input.addEventListener("input", () => {
      const t = parseFloat(this.input.value);
      this.valueDisplay.textContent = String(t), this.config.oninput && this.config.oninput(t);
    }), this.element.appendChild(this.input), this.element.appendChild(this.valueDisplay);
  }
  /**
   * Get the current value
   */
  getValue() {
    return parseFloat(this.input.value);
  }
  /**
   * Set the value
   */
  setValue(t) {
    return this.input.value = String(t), this.valueDisplay.textContent = String(t), this;
  }
  /**
   * Get whether the slider is enabled
   */
  getIsEnabled() {
    return !this.input.disabled;
  }
  /**
   * Enable the slider
   */
  enable() {
    return this.input.disabled = !1, this;
  }
  /**
   * Disable the slider
   */
  disable() {
    return this.input.disabled = !0, this;
  }
  /**
   * Set the min value
   */
  setMin(t) {
    return this.input.min = String(t), this;
  }
  /**
   * Set the max value
   */
  setMax(t) {
    return this.input.max = String(t), this;
  }
  /**
   * Set the step value
   */
  setStep(t) {
    return this.input.step = String(t), this;
  }
}
function z(o, t) {
  if (!t) return;
  const e = {
    "--scl-font-family": t.fontFamily,
    "--scl-color-text": t.color,
    "--scl-color-muted": t.mutedColor,
    "--scl-color-accent": t.accentColor,
    "--scl-input-bg": t.inputBackground,
    "--scl-input-track-bg": t.trackBackground,
    "--scl-input-thumb-bg": t.thumbBackground,
    "--scl-input-thumb-border": t.thumbBorder
  };
  for (const [i, s] of Object.entries(e))
    s != null && o.style.setProperty(i, s);
}
class v extends d {
  constructor(t) {
    super(t), this.components = [];
  }
  /**
   * Set foreground and background colors for the bar using CSS variables.
   * @param foreground - Text color
   * @param background - Background color
   */
  setColor(t, e) {
    return this.element.style.setProperty("--bar-background", e), this.element.style.setProperty("--bar-text-color", t), this;
  }
  /**
   * Set alignment of items within the bar.
   * @param justifyContent - Justify content value (CSS flexbox)
   */
  setAlignment(t) {
    return this.element.style.setProperty("--bar-justify-content", t), this;
  }
  /**
   * Add a title (non-interactive text) to the bar.
   * Inherits bar foreground/background colors.
   * @param text - Title text
   * @param options - Optional style overrides
   */
  addTitle(t, e) {
    const i = document.createElement("span");
    return i.textContent = t, i.style.cssText = `
      color: var(--bar-text-color, inherit);
      background: var(--bar-background, inherit);      
      font-weight: bold;
      font-size: 1.1em;
      margin-right: 16px;
      padding: 2px 8px;
      border-radius: 4px;
      user-select: none;
      pointer-events: none;
      display: inline-block;
    `, e && Object.assign(i.style, e), this.element.appendChild(i), i;
  }
  /**
   * Add arbitrary HTML or an HTMLElement to the bar.
   * @param html - HTML string or HTMLElement
   */
  addHTML(t) {
    let e;
    if (typeof t == "string") {
      const i = document.createElement("span");
      i.innerHTML = t, e = i;
    } else
      e = t;
    return this.element.appendChild(e), e;
  }
  /**
   * Add a button to the bar
   */
  addButton(t) {
    const e = new f(t);
    return this.components.push(e), this.element.appendChild(e.getElement()), e;
  }
  /**
   * Add a number input to the bar
   */
  addNumberInput(t) {
    const e = new g(t);
    return this.components.push(e), this.element.appendChild(e.getElement()), e;
  }
  /**
   * Add a slider to the bar
   */
  addSlider(t) {
    const e = new b(t);
    return this.components.push(e), this.element.appendChild(e.getElement()), e;
  }
  /**
   * Remove all components from the bar
   */
  clear() {
    return this.components.forEach((t) => {
      const e = t.getElement();
      e.parentNode && e.parentNode.removeChild(e);
    }), this.components = [], this;
  }
  /**
   * Get all components in the bar
   */
  getComponents() {
    return [...this.components];
  }
}
class x extends v {
  constructor() {
    const t = document.createElement("div");
    t.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      background: var(--bar-background, #f8f8f8);
      border-bottom: 1px solid var(--bar-border-color, #ddd);
      min-height: 40px;
      flex-wrap: wrap;
      justify-content: var(--bar-justify-content, start);
    `, super(t);
  }
}
class y extends v {
  constructor() {
    const t = document.createElement("div");
    t.style.cssText = `
      display: flex;
      align-items: center;      
      padding: 8px;
      background: var(--bar-background, #f8f8f8);
      border-top: 1px solid var(--bar-border-color, #ddd);
      min-height: 40px;
      flex-wrap: wrap;
      justify-content: var(--bar-justify-content, start);
    `, super(t);
  }
}
class T extends p {
  constructor(t = {}) {
    const e = document.createElement("canvas"), i = !!t.canvasSize, s = t.autoresize !== void 0, n = !!(t.scaleToFit && i);
    i && s && t.autoresize && console.warn(
      "GameInterface: Both canvasSize and autoresize:true were specified. This is contradictory - autoresize will be ignored and canvas will use the specified size. Did you mean to use scaleToFit:true instead?"
    ), t.scaleToFit && !i && console.warn(
      "GameInterface: scaleToFit requires canvasSize to be specified. Falling back to autoresize mode."
    );
    const r = n || i ? !1 : t.autoresize ?? !0;
    i && (e.width = t.canvasSize.width, e.height = t.canvasSize.height), super(e, {
      size: t.canvasSize,
      autoresize: r
    }), this.gameState = "stopped", this.config = t, this.setupContainer(
      e,
      i,
      r,
      n
    );
  }
  setupContainer(t, e, i, s) {
    this.container = document.createElement("div");
    const n = `
      --container-background: #18181b;
      --container-border-color: #222;
      --canvas-container-background: #232326;
      --canvas-background: #18181b;
      --bar-background: #232326;
      --bar-text-color: #e6e6e6;
      --bar-border-color: #333;
      --button-background: #232326;
      --button-hover-background: #333;
      --button-border-color: #333;
      --button-text-color: #e6e6e6;
      --input-background: #232326;
      --input-border-color: #333;
      --input-text-color: #e6e6e6;
      --input-container-background: transparent;
      --label-color: #e6e6e6;
      --dialog-background: #232326;
      --dialog-title-color: #e6e6e6;
      --dialog-message-color: #b3b3b3;
      --close-button-background: #22c55e;
      --close-button-color: #18181b;
      --scl-font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      --scl-font-size: 14px;
      --scl-color-text: #e6e6e6;
      --scl-color-muted: #9ca3af;
      --scl-color-accent: #22c55e;
      --scl-input-bg: transparent;
      --scl-input-track-bg: #444;
      --scl-input-thumb-bg: #22c55e;
      --scl-input-thumb-border: #18181b;
    `;
    if (this.config.containerClass)
      this.container.className = this.config.containerClass;
    else if (this.config.fullscreen)
      this.container.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        border: none;
        border-radius: 0;
        overflow: hidden;
        background: var(--container-background);
        width: 100vw;
        height: 100vh;
        margin: 0;
        ${n}
      `, document.body.style.overflow = "hidden";
    else {
      const c = !e && i;
      this.container.style.cssText = `
        display: ${c ? "flex" : "inline-flex"};
        flex-direction: column;
        border: 1px solid var(--container-border-color);
        border-radius: 4px;
        overflow: hidden;
        background: var(--container-background);
        margin: 0 auto;
        box-sizing: border-box;
        ${c ? "width: 100%; height: 100%;" : ""}
        ${n}
      `;
    }
    if (this.config.cssVars)
      for (const [c, u] of Object.entries(this.config.cssVars))
        this.container.style.setProperty(c, u);
    this.canvasContainer = document.createElement("div");
    const r = this.config.fullscreen;
    let a = "", l = "";
    s ? (a = `
        flex: 1;
        min-height: 0;
        container-type: size;
        aspect-ratio: ${this.config.canvasSize.width / this.config.canvasSize.height};
        max-width: ${this.config.canvasSize.width}px;
        max-height: ${this.config.canvasSize.height}px;
        height: min(calc(100vh - 128px), ${this.config.canvasSize.height}px);
      `, l = `
        width: 100cqw;
        height: 100cqh;
      `) : (r || i) && (a = "flex: 1; min-height: 0;", l = `
        width: 100%;
        height: 100%;
        ${r ? "max-width: 100vw; max-height: 100vh;" : ""}
      `), this.canvasContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--canvas-container-background);
      padding: ${r ? "0" : "10px"};
      box-sizing: border-box;
      ${a}
    `, t.style.cssText = `
      border: ${r ? "none" : "1px solid #ddd"};
      border-radius: ${r ? "0" : "4px"};
      background: var(--canvas-background);
      display: block;
      ${l}
    `, this.canvasContainer.appendChild(t), this.container.appendChild(this.canvasContainer), (this.config.parent || document.body).appendChild(this.container);
  }
  /**
   * Add and return a top bar for UI components.
   * If a top bar already exists, returns the existing one.
   */
  addTopBar() {
    return this.topBar || (this.topBar = new x(), this.container.insertBefore(
      this.topBar.getElement(),
      this.container.firstChild
    )), this.topBar;
  }
  /**
   * Add and return a bottom bar for UI components.
   * If a bottom bar already exists, returns the existing one.
   */
  addBottomBar() {
    return this.bottomBar || (this.bottomBar = new y(), this.container.appendChild(this.bottomBar.getElement())), this.bottomBar;
  }
  /**
   * Get the top bar if it exists
   */
  getTopBar() {
    return this.topBar;
  }
  /**
   * Get the bottom bar if it exists
   */
  getBottomBar() {
    return this.bottomBar;
  }
  /**
   * Remove the top bar
   */
  removeTopBar() {
    if (this.topBar) {
      const t = this.topBar.getElement();
      t.parentNode && t.parentNode.removeChild(t), this.topBar = void 0;
    }
    return this;
  }
  /**
   * Remove the bottom bar
   */
  removeBottomBar() {
    if (this.bottomBar) {
      const t = this.bottomBar.getElement();
      t.parentNode && t.parentNode.removeChild(t), this.bottomBar = void 0;
    }
    return this;
  }
  /**
   * Show a simple dialog with a message
   */
  dialog(t, e, i) {
    const s = document.createElement("dialog");
    s.style.cssText = `
      border: none;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      background: var(--dialog-background, #fff);
    `;
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px;
      text-align: center;
    `;
    const r = document.createElement("h3");
    if (r.textContent = t, r.style.cssText = `
      margin: 0 0 10px 0;
      color: var(--dialog-title-color, #333);
    `, n.appendChild(r), e) {
      const l = document.createElement("p");
      l.textContent = e, l.style.cssText = `
        margin: 0 0 20px 0;
        color: var(--dialog-message-color, #666);
        line-height: 1.4;
      `, n.appendChild(l);
    }
    const a = document.createElement("button");
    return a.textContent = "OK", a.style.cssText = `
      padding: 8px 20px;
      background: var(--close-button-background, #007cba);
      color: var(--close-button-color, #fff);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `, a.addEventListener("click", () => {
      s.close(), i && i();
    }), n.appendChild(a), s.appendChild(n), s.addEventListener("click", (l) => {
      l.target === s && (s.close(), i && i());
    }), document.body.appendChild(s), s.showModal(), s.addEventListener("close", () => {
      document.body.removeChild(s);
    }), s;
  }
  /**
   * Get the main container element
   */
  getContainer() {
    return this.container;
  }
  /**
   * Get the current game state
   */
  getGameState() {
    return this.gameState;
  }
  /**
   * Start the game (override parent to track state)
   */
  run() {
    super.run(), this.gameState = "running";
  }
  /**
   * Pause the game
   */
  pause() {
    super.stop(), this.gameState = "paused";
  }
  /**
   * Resume the game
   */
  resume() {
    super.run(), this.gameState = "running";
  }
  /**
   * Stop the game completely
   */
  stop() {
    super.stop(), this.gameState = "stopped";
  }
  /**
   * Reset the game (alias for stop)
   */
  reset() {
    this.stop();
  }
  /**
   * Destroy the interface and clean up DOM elements
   */
  destroy() {
    this.container.parentNode && this.container.parentNode.removeChild(this.container);
  }
}

/* Main game file: main.js */

let gi = new T();

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
  if (timeSurvived <= 10) {
    ctx.fillStyle = "blue";
    ctx.fillText(`Use WASD or Arrow keys to move!`, width / 2 - 100, height - 20);
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
//# sourceMappingURL=index-1b404a58.js.map
