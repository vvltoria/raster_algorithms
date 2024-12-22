const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const algorithmInfo = document.getElementById("algorithm-info");
const executionTime = document.getElementById("execution-time");
const stepsOutput = document.getElementById("steps");

const x1Input = document.getElementById("x1");
const y1Input = document.getElementById("y1");
const x2Input = document.getElementById("x2");
const y2Input = document.getElementById("y2");

const circleForm = document.getElementById("circle-form");
const xcInput = document.getElementById("xc");
const ycInput = document.getElementById("yc");
const rInput = document.getElementById("r");

const ddaBtn = document.getElementById("dda");
const bresenhamLineBtn = document.getElementById("bresenham-line");
const bresenhamCircleBtn = document.getElementById("bresenham-circle");
const resetCanvasBtn = document.getElementById("reset-canvas");



const scaleSlider = document.getElementById("scale-slider");
const scaleValueDisplay = document.getElementById("scale-value");

let scalePercentage = parseInt(scaleSlider.value);
let scale = (scalePercentage / 100) * 20;

const algorithmColors = {
  dda: "red",
  bresenhamLine: "blue",
  bresenhamCircle: "green",
};

function resizeCanvas() {
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  drawAxes();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  clearSteps();
}

function drawAxes() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.strokeStyle = "#d3d3d3";
  ctx.lineWidth = 1;

  const maxUnitsX = Math.floor(canvas.width / (2 * scale));
  const maxUnitsY = Math.floor(canvas.height / (2 * scale));

  for (let i = 1; i <= maxUnitsX; i++) {
    const x = canvas.width / 2 + i * scale;
    const negX = canvas.width / 2 - i * scale;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(negX, 0);
    ctx.lineTo(negX, canvas.height);
    ctx.stroke();
  }

  for (let i = 1; i <= maxUnitsY; i++) {
    const y = canvas.height / 2 - i * scale;
    const negY = canvas.height / 2 + i * scale;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, negY);
    ctx.lineTo(canvas.width, negY);
    ctx.stroke();
  }

  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = -maxUnitsX; i <= maxUnitsX; i++) {
    if (i === 0) continue;
    const x = canvas.width / 2 + i * scale;
    const y = canvas.height / 2;
    ctx.fillText(i, x, y + 15);
  }

  for (let i = -maxUnitsY; i <= maxUnitsY; i++) {
    if (i === 0) continue;
    const x = canvas.width / 2;
    const y = canvas.height / 2 - i * scale;
    ctx.fillText(i, x + 15, y);
  }
}

function toCanvasCoords(x, y) {
  const canvasX = canvas.width / 2 + x * scale;
  const canvasY = canvas.height / 2 - y * scale;
  return { canvasX, canvasY };
}

function drawPixel(x, y, color = "black") {
  const { canvasX, canvasY } = toCanvasCoords(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, scale / 8, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, color) {
  const { canvasX: cx1, canvasY: cy1 } = toCanvasCoords(x1, y1);
  const { canvasX: cx2, canvasY: cy2 } = toCanvasCoords(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx1, cy1);
  ctx.lineTo(cx2, cy2);
  ctx.stroke();
}

function displayInfo(info) {
  algorithmInfo.textContent = info;
}

resetCanvasBtn.addEventListener("click", () => {
  clearCanvas();
  displayInfo("Canvas сброшен. Выберите алгоритм для визуализации.");
  executionTime.textContent = "Время выполнения: N/A";
  clearSteps();
});

function addMarkers(x1, y1, x2, y2, isCircle = false) {
  drawMarker(x1, y1, isCircle ? "C" : "A", isCircle ? "yellow" : "orange");

  if (!isCircle) {
    drawMarker(x2, y2, "B", "purple");
  }
}

function drawMarker(x, y, label, color) {
  const { canvasX, canvasY } = toCanvasCoords(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, scale / 4, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.font = `${scale / 2}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, canvasX, canvasY - scale / 2);
}

function appendStep(text) {
  stepsOutput.textContent += text + "\n";
}

function clearSteps() {
  stepsOutput.textContent =
    "Выберите алгоритм и выполните его, чтобы увидеть шаги решения.";
}

scaleSlider.addEventListener("input", () => {
  scalePercentage = parseInt(scaleSlider.value);
  scale = (scalePercentage / 100) * 20;
  scaleValueDisplay.textContent = `${scalePercentage}%`;
  clearCanvas();
  displayInfo(
    "Масштаб изменен. Перерисуйте фигуры для отображения с новым масштабом."
  );
});

function ddaAlgorithm(x1, y1, x2, y2) {
  const color = algorithmColors.dda;
  displayInfo("Алгоритм ЦДА (Цифровой Дифференциальный Анализатор).");
  clearSteps();
  appendStep(
    `Начало алгоритма DDA для отрезка от A(${x1}, ${y1}) до B(${x2}, ${y2})`
  );

  const startTime = performance.now();

  addMarkers(x1, y1, x2, y2);

  let dx = x2 - x1;
  let dy = y2 - y1;
  let steps = Math.max(Math.abs(dx), Math.abs(dy));
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;

  let x = x1;
  let y = y1;

  let prevX = null;
  let prevY = null;

  for (let i = 0; i <= steps; i++) {
    let currentX = Math.round(x);
    let currentY = Math.round(y);
    appendStep(`Шаг ${i + 1}: Определяем точку (${currentX}, ${currentY})`);
    drawPixel(currentX, currentY, color);
    if (prevX !== null && prevY !== null) {
      appendStep(
        `Переходим от точки (${prevX}, ${prevY}) к точке (${currentX}, ${currentY})`
      );
      drawLine(prevX, prevY, currentX, currentY, color);
    }
    prevX = currentX;
    prevY = currentY;
    x += xIncrement;
    y += yIncrement;
  }

  const endTime = performance.now();
  const timeTaken = endTime - startTime;
  executionTime.textContent = `Время выполнения: ${timeTaken.toFixed(2)} мс`;
}

function bresenhamLineAlgorithm(x1, y1, x2, y2) {
  const color = algorithmColors.bresenhamLine;
  displayInfo("Алгоритм Брезенхема для отрезков.");
  clearSteps();
  appendStep(
    `Начало алгоритма Брезенхема для отрезка от A(${x1}, ${y1}) до B(${x2}, ${y2})`
  );

  const startTime = performance.now();

  addMarkers(x1, y1, x2, y2);

  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let currentX = x1;
  let currentY = y1;

  let prevX = null;
  let prevY = null;
  let stepCount = 0;

  while (true) {
    appendStep(
      `Шаг ${stepCount + 1}: Определяем точку (${currentX}, ${currentY})`
    );
    drawPixel(currentX, currentY, color);
    if (prevX !== null && prevY !== null) {
      appendStep(
        `Переходим от точки (${prevX}, ${prevY}) к точке (${currentX}, ${currentY})`
      );
      drawLine(prevX, prevY, currentX, currentY, color);
    }
    prevX = currentX;
    prevY = currentY;
    if (currentX === x2 && currentY === y2) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      currentX += sx;
      appendStep(`Увеличиваем X на ${sx}, новая X = ${currentX}`);
    }
    if (e2 < dx) {
      err += dx;
      currentY += sy;
      appendStep(`Увеличиваем Y на ${sy}, новая Y = ${currentY}`);
    }
    stepCount++;
  }

  const endTime = performance.now();
  const timeTaken = endTime - startTime;
  executionTime.textContent = `Время выполнения: ${timeTaken.toFixed(2)} мс`;
}

function bresenhamCircleAlgorithm(xc, yc, r) {
  const color = algorithmColors.bresenhamCircle;
  displayInfo("Алгоритм Брезенхема для окружностей.");
  clearSteps();
  appendStep(
    `Начало алгоритма Брезенхема для окружности с центром C(${xc}, ${yc}) и радиусом r=${r}`
  );

  const startTime = performance.now();

  addMarkers(xc, yc, xc, yc, true);

  let x = 0;
  let y = r;
  let d = 3 - 2 * r;

  while (y >= x) {
    appendStep(`Шаг ${x + 1}: Определяем точки симметрии для (x=${x}, y=${y})`);
    plotCirclePoints(xc, yc, x, y, color);
    x++;
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
      appendStep(`Условие d > 0 выполнено: уменьшаем Y на 1, новая Y = ${y}`);
    } else {
      d = d + 4 * x + 6;
      appendStep(`Условие d <= 0 выполнено: оставляем Y неизменным, Y = ${y}`);
    }
  }

  const endTime = performance.now();
  const timeTaken = endTime - startTime;
  executionTime.textContent = `Время выполнения: ${timeTaken.toFixed(2)} мс`;
}

function plotCirclePoints(xc, yc, x, y, color) {
  const points = [
    { x: xc + x, y: yc + y },
    { x: xc - x, y: yc + y },
    { x: xc + x, y: yc - y },
    { x: xc - x, y: yc - y },
    { x: xc + y, y: yc + x },
    { x: xc - y, y: yc + x },
    { x: xc + y, y: yc - x },
    { x: xc - y, y: yc - x },
  ];

  points.forEach((point) => {
    appendStep(`Определяем точку (${point.x}, ${point.y}) на окружности`);
    drawPixel(point.x, point.y, color);
  });
}

function initializeCanvas() {
  resizeCanvas();
  displayInfo("Выберите алгоритм для визуализации.");
  clearSteps();
}

window.addEventListener("resize", () => {
  resizeCanvas();
  displayInfo(
    "Canvas изменил размер. Перерисуйте фигуры для отображения с новым размером."
  );
});

window.addEventListener("load", initializeCanvas);

ddaBtn.addEventListener("click", () => {
  const x1 = parseInt(x1Input.value);
  const y1 = parseInt(y1Input.value);
  const x2 = parseInt(x2Input.value);
  const y2 = parseInt(y2Input.value);
  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
    alert("Пожалуйста, введите корректные координаты для отрезка.");
    return;
  }
  clearCanvas();
  ddaAlgorithm(x1, y1, x2, y2);
});

bresenhamLineBtn.addEventListener("click", () => {
  const x1 = parseInt(x1Input.value);
  const y1 = parseInt(y1Input.value);
  const x2 = parseInt(x2Input.value);
  const y2 = parseInt(y2Input.value);
  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
    alert("Пожалуйста, введите корректные координаты для отрезка.");
    return;
  }
  clearCanvas();
  bresenhamLineAlgorithm(x1, y1, x2, y2);
});

bresenhamCircleBtn.addEventListener("click", () => {
  const xc = parseInt(xcInput.value);
  const yc = parseInt(ycInput.value);
  const r = parseInt(rInput.value);
  if (isNaN(xc) || isNaN(yc) || isNaN(r)) {
    alert("Пожалуйста, введите корректные параметры для окружности.");
    return;
  }
  if (r < 0) {
    alert("Радиус должен быть положительным числом.");
    return;
  }
  clearCanvas();
  bresenhamCircleAlgorithm(xc, yc, r);
});

const theoryBtn = document.getElementById("theory-btn");

theoryBtn.addEventListener("click", () => {
  window.location.href = "theory.html"; 
});


function generateStepLineEquation(x0, y0, x1, y1, scale) {
  console.log("Генерация StepLine с использованием y = ax + b");

  const dx = x1 - x0;
  const dy = y1 - y0;

  if (dx === 0) {
    let stepCount = Math.abs(dy) + 1;
    let calculationSteps = `Пошаговый алгоритм (вертикальная линия):\n`;
    calculationSteps += `dx = ${dx}\n`;
    calculationSteps += `dy = ${dy}\n`;
    calculationSteps += `Линия вертикальная (dx = 0).\n`;
    calculationSteps += `Итерации:\n`;

    let pixels = [];
    const stepDirection = dy > 0 ? 1 : -1;
    for (let y = y0; y !== y1 + stepDirection; y += stepDirection) {
      pixels.push({ x: x0, y: y, color: "#ff1493" });
      calculationSteps += `Шаг ${pixels.length - 1}: x = ${x0}, y = ${y}\n`;
      drawPixel(x0, y, "#ff1493");  // Рисуем пиксель
    }

    return { steps: pixels.length - 1, calculationSteps, pixels };
  }

  const a = dy / dx;
  const b = y0 - a * x0;

  console.log(`Вычисленные коэффициенты: a = ${a}, b = ${b}`);

  const stepDirection = dx > 0 ? 1 : -1;
  const steps = Math.abs(dx) + 1;

  let calculationSteps = `Пошаговый алгоритм (используя y = ax + b):\n`;
  calculationSteps += `dx = ${dx}\n`;
  calculationSteps += `dy = ${dy}\n`;
  calculationSteps += `a = dy / dx = ${a}\n`;
  calculationSteps += `b = y0 - a * x0 = ${b}\n`;
  calculationSteps += `steps = |dx| + 1 = ${steps}\n\n`;
  calculationSteps += `Итерации:\n`;

  let pixels = [];
  let stepCount = 0;

  for (let i = 0; i < steps; i++) {
    const currentX = x0 + i * stepDirection;
    const currentY = a * currentX + b;
    const roundedY = Math.round(currentY);

    pixels.push({ x: currentX, y: roundedY, color: "#ff1493" });
    calculationSteps += `Шаг ${stepCount}: x = ${currentX}, y = a * x + b = ${a} * ${currentX} + ${b} = ${currentY} → округлено до y = ${roundedY}\n`;

    // Рисуем пиксель для каждого шага
    drawPixel(currentX, roundedY, "#ff1493");

    stepCount++;
  }

  return { steps: stepCount, calculationSteps, pixels };
}


const generateStepLineBtn = document.getElementById("generate-step-line");

generateStepLineBtn.addEventListener("click", () => {
  const x1 = parseInt(x1Input.value);
  const y1 = parseInt(y1Input.value);
  const x2 = parseInt(x2Input.value);
  const y2 = parseInt(y2Input.value);
  
  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
    alert("Пожалуйста, введите корректные координаты для отрезка.");
    return;
  }


  clearCanvas();


  generateStepLineEquation(x1, y1, x2, y2, scale);
});
