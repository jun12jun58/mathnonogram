const SIZE = 9;

const grids = [
  document.getElementById("grid1"),
  document.getElementById("grid2"),
  document.getElementById("grid3")
];

const resultGrid = document.getElementById("resultGrid");

const buttons = {
  fill: document.getElementById("fillBtn"),
  x: document.getElementById("xBtn")
};

let mode = "fill";
let drawing = false;
let action;

// 4개의 그리드 생성
[...grids, resultGrid].forEach(grid => {
  for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }
});

// 모드 변경
for (const [name, button] of Object.entries(buttons)) {
  button.onclick = () => {
    mode = name;
    Object.values(buttons).forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  };
}

// XOR 결과 업데이트
function updateResult() {
  const resultCells = resultGrid.children;

  for (let i = 0; i < SIZE * SIZE; i++) {
    let xor = false;

    grids.forEach(grid => {
      if (grid.children[i].classList.contains("filled")) {
        xor = !xor;
      }
    });

    resultCells[i].classList.toggle("filled", xor);
  }
}

// 칸 상태 변경
function draw(cell) {
  if (mode === "fill") {
    cell.classList.remove("x-mark");
    cell.classList.toggle("filled", action);
  } else {
    cell.classList.remove("filled");
    cell.classList.toggle("x-mark", action);
  }

  updateResult();
}

// 각 단서 그리드에 드래그 기능 추가
grids.forEach(grid => {
  grid.onpointerdown = e => {
    const cell = e.target.closest(".cell");
    if (!cell) return;

    drawing = true;

    action = mode === "fill"
      ? !cell.classList.contains("filled")
      : !cell.classList.contains("x-mark");

    draw(cell);
  };

  grid.onpointermove = e => {
    if (!drawing) return;

    const cell = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".cell");

    if (cell && grid.contains(cell)) {
      draw(cell);
    }
  };
});

document.onpointerup = () => drawing = false;