const canvas = document.querySelector(".really-canvas");

const slider = document.querySelector("#range-slider");
const sliderLabel = document.querySelector("#slider-label");
sliderLabel.textContent = `${slider.value} by ${slider.value}`;
generateGrid(slider.value);

let gridToggle = 1;
const toggleGridButton = document.querySelector("#grid-toggle");
const toggleGridText = document.querySelector("#grid-text");
toggleGridButton.classList.add("toggle-grid-on");

const colorSlider = document.querySelector("#color-picker");
let penColor = "#000000";

let modeChange = new Event("modeChange");

let isDrawing = false;
let drawMode = "pen-btn";

colorSlider.addEventListener("input", () => {
  if (drawMode == "pen-btn") {
    penColor = colorSlider.value;
  }
});

canvas.addEventListener("mousedown", () => {
  isDrawing = true;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

slider.addEventListener("input", () => {
  generateGrid(slider.value);
});

const leftMenuItems = document.querySelectorAll(".pen-btn.left");

leftMenuItems.forEach((button) => {
  button.addEventListener("click", () => {
    leftMenuItems.forEach((btn) => btn.classList.remove("toggle-grid-on"));
    button.classList.add("toggle-grid-on");
    drawMode = button.id;
    button.dispatchEvent(new Event("modeChange"));
  });

  button.addEventListener("modeChange", () => {
    switch (drawMode) {
      case "pen-btn":
        penColor = colorSlider.value;
        break;
      case "eraser-btn":
        penColor = "white";
        break;
      case "rainbow":
        penColor = generateRandomColor();
        break;
      case "lighten":
        penColor = lightenColor(penColor);
        break;
      case "darken":
        penColor = darkenColor(penColor);
        break;
    }
  });
});

document.getElementById("pen-btn").click();

toggleGridButton.addEventListener("click", () => {
  gridToggle = gridToggle === 1 ? 0 : 1;
  if (gridToggle == 0) {
    toggleGridButton.classList.remove("toggle-grid-on");
    toggleGridText.textContent = "off";
  } else {
    toggleGridButton.classList.add("toggle-grid-on");
    toggleGridText.textContent = "on";
  }
});

function generateGrid(num) {
  canvas.innerHTML = "";
  sliderLabel.textContent = `${num} by ${num}`;
  for (let i = 0; i < num; i++) {
    let row = document.createElement("div");
    row.id = i;
    row.className = "row";
    canvas.appendChild(row);
    for (let j = 0; j < num; j++) {
      let cell = document.createElement("div");
      cell.id = String(i) + "_" + String(j);
      cell.className = "cell";
      row.appendChild(cell);
    }
  }
}

canvas.addEventListener("mouseover", (event) => {
  if (isDrawing && event.target.classList.contains("cell")) {
    let currentColor = window.getComputedStyle(event.target).backgroundColor;

    switch (drawMode) {
      case "pen-btn":
        event.target.style.backgroundColor = penColor;
        break;
      case "eraser-btn":
        event.target.style.backgroundColor = "white";
        break;
      case "rainbow":
        event.target.style.backgroundColor = generateRandomColor();
        break;
      case "lighten":
        event.target.style.backgroundColor = lightenColor(currentColor);
        break;
      case "darken":
        event.target.style.backgroundColor = darkenColor(currentColor);
        break;
    }
  }
});

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function parseRGB(color) {
  const rgbValues = color.match(/\d+/g).map(Number);
  return {
    r: rgbValues[0],
    g: rgbValues[1],
    b: rgbValues[2],
  };
}

function generateRandomColor() {
  const randomValue = () => Math.floor(Math.random() * 256);
  const r = randomValue();
  const g = randomValue();
  const b = randomValue();
  return `rgb(${r}, ${g}, ${b})`;
}

// Lightens a color by increasing its brightness
function lightenColor(color) {
  const colorObj = parseRGB(color);
  const r = Math.min(colorObj.r + 30, 255);
  const g = Math.min(colorObj.g + 30, 255);
  const b = Math.min(colorObj.b + 30, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// Darkens a color by decreasing its brightness
function darkenColor(color) {
  const colorObj = parseRGB(color);
  const r = Math.max(colorObj.r - 30, 0);
  const g = Math.max(colorObj.g - 30, 0);
  const b = Math.max(colorObj.b - 30, 0);
  return `rgb(${r}, ${g}, ${b})`;
}

function lightenColor(color, percent = 10) {
  const num = parseInt(color.slice(1), 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = r > 255 ? 255 : r;
  g = g > 255 ? 255 : g;
  b = b > 255 ? 255 : b;

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darkenColor(color, percent = 10) {
  const num = parseInt(color.slice(1), 16);
  let r = (num >> 16) - Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) - Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) - Math.round(255 * (percent / 100));

  r = r < 0 ? 0 : r;
  g = g < 0 ? 0 : g;
  b = b < 0 ? 0 : b;

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
