const SIZE = 9;

const grids = [
  document.getElementById("grid1"),
  document.getElementById("grid2"),
  document.getElementById("grid3")
];

const interactiveGrid = document.getElementById("interactiveGrid");
const clueTrack = document.getElementById("clueTrack");
const clueButtons = [...document.querySelectorAll(".clue-button")];

const cluePatterns = [
  [
    "000000000",
    "000111000",
    "001111100",
    "111111111",
    "001000100",
    "001000100",
    "001010100",
    "011111110",
    "110111011"
  ],
  [
    "000010000",
    "000101000",
    "001000100",
    "010000010",
    "010111010",
    "001010100",
    "000010000",
    "000010000",
    "001111100"
  ],
  [
    "000000000",
    "000000000",
    "000000000",
    "010000010",
    "000000000",
    "000101000",
    "000111000",
    "000000000",
    "000000000"
  ]
];

const buttons = {
  fill: document.getElementById("fillBtn"),
  x: document.getElementById("xBtn")
};

let mode = "fill";
let drawing = false;
let action;
let currentClue = 0;

function createGrid(grid) {
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }
}

grids.forEach(createGrid);
createGrid(interactiveGrid);

grids.forEach((grid, gridIndex) => {
  [...grid.children].forEach((cell, cellIndex) => {
    cell.classList.toggle(
      "filled",
      cluePatterns[gridIndex][Math.floor(cellIndex / SIZE)][cellIndex % SIZE] === "1"
    );
  });
});

function showClue(index) {
  currentClue = (index + grids.length) % grids.length;
  clueTrack.style.transform = `translateX(-${currentClue * 100}%)`;
  clueButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === currentClue;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

clueButtons.forEach(button => {
  button.onclick = () => showClue(Number(button.dataset.clue));
});
showClue(0);

// 모드 변경
for (const [name, button] of Object.entries(buttons)) {
  button.onclick = () => {
    mode = name;
    Object.values(buttons).forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  };
}

function draw(cell) {
  if (mode === "fill") {
    cell.classList.remove("x-mark");
    cell.classList.toggle("filled", action);
  } else {
    cell.classList.remove("filled");
    cell.classList.toggle("x-mark", action);
  }
}

interactiveGrid.onpointerdown = e => {
  const cell = e.target.closest(".cell");
  if (!cell) return;

  drawing = true;

  action = mode === "fill"
    ? !cell.classList.contains("filled")
    : !cell.classList.contains("x-mark");

  draw(cell);
};

interactiveGrid.onpointermove = e => {
  if (!drawing) return;

  const cell = document
    .elementFromPoint(e.clientX, e.clientY)
    ?.closest(".cell");

  if (cell && interactiveGrid.contains(cell)) {
    draw(cell);
  }
};

document.onpointerup = () => drawing = false;
