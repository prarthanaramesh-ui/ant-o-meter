const simulation = document.getElementById("simulation");
const antCount = document.getElementById("antCount");
const crossedCount = document.getElementById("crossedCount");
const status = document.getElementById("status");
const sideAnts = document.getElementById("sideAnts");
const sideCrossed = document.getElementById("sideCrossed");
const sideSpeed = document.getElementById("sideSpeed");
const antList = document.getElementById("antList");
const slider = document.getElementById("speedSlider");
const sliderValue = document.getElementById("sliderValue");
const environment = document.getElementById("environment");

let ants = [];
let crossed = 0;
let running = false;
let animationFrame;
let globalSpeed = 1;
let night = false;

// CHANGE THIS NUMBER TO INCREASE OR DECREASE ANTS
let NUMBER_OF_ANTS = 20;

/* Function to change ant count dynamically */
function setAntCount(newCount) {
    NUMBER_OF_ANTS = parseInt(newCount, 10);
    resetSimulation();
}

/* Create cartoon ant element */
function createAntElement() {
    const ant = document.createElement("div");
    ant.className = "ant walk";

    ant.innerHTML = `
        <div class="antBody"></div>
        <div class="antHead"></div>
        <div class="eye eye1"></div>
        <div class="eye eye2"></div>
        <div class="leg leg1"></div>
        <div class="leg leg2"></div>
        <div class="leg leg3"></div>
        <div class="leg leg4"></div>
        <div class="leg leg5"></div>
        <div class="leg leg6"></div>
        <div class="antenna ant1"></div>
        <div class="antenna ant2"></div>
    `;

    simulation.appendChild(ant);
    return ant;
}

/* Create ants with dynamic screen boundaries */
function createAnts() {
    ants.forEach(ant => ant.element.remove());

    ants = [];
    crossed = 0;

    const width = simulation.clientWidth || 800;
    const height = simulation.clientHeight || 450;

    for (let i = 0; i < NUMBER_OF_ANTS; i++) {
        const element = createAntElement();

        const ant = {
            id: i + 1,
            element: element,
            x: 30 + Math.random() * (width - 60),
            y: 30 + Math.random() * (height - 60),
            speed: 0.5 + Math.random() * 1.5,
            angle: Math.random() * Math.PI * 2,
            counted: false,
            targetX: Math.random() * width,
            targetY: Math.random() * height
        };

        ants.push(ant);
    }

    updateDashboard();
    updateAntList();
}

/* Move ant toward dynamic target */
function moveTowardTarget(ant) {
    const width = simulation.clientWidth || 800;
    const height = simulation.clientHeight || 450;

    const dx = ant.targetX - ant.x;
    const dy = ant.targetY - ant.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
        ant.targetX = 30 + Math.random() * (width - 60);
        ant.targetY = 30 + Math.random() * (height - 60);
        return;
    }

    const direction = Math.atan2(dy, dx);
    ant.angle += (direction - ant.angle) * 0.04;

    ant.x += Math.cos(ant.angle) * ant.speed * globalSpeed;
    ant.y += Math.sin(ant.angle) * ant.speed * globalSpeed;

    const degrees = ant.angle * 180 / Math.PI;
    ant.element.style.transform = `rotate(${degrees}deg)`;
}

/* Keep ants inside boundaries */
function keepInside(ant) {
    const width = simulation.clientWidth || 800;
    const height = simulation.clientHeight || 450;

    if (ant.x < 5) {
        ant.x = 5;
        ant.angle = 0;
    }

    if (ant.x > width - 35) {
        ant.x = width - 35;
        ant.angle = Math.PI;
    }

    if (ant.y < 5) {
        ant.y = 5;
        ant.angle = Math.PI / 2;
    }

    if (ant.y > height - 25) {
        ant.y = height - 25;
        ant.angle = -Math.PI / 2;
    }
}

/* Detection logic */
function checkDetection(ant) {
    const detectionX = simulation.clientWidth / 2;

    if (ant.x >= detectionX && !ant.counted) {
        ant.counted = true;
        crossed++;
        updateDashboard();
    }

    if (ant.x < detectionX - 80) {
        ant.counted = false;
    }
}

/* Main Animation Loop */
function animate() {
    if (!running) return;

    ants.forEach(ant => {
        moveTowardTarget(ant);
        keepInside(ant);
        checkDetection(ant);

        ant.element.style.left = ant.x + "px";
        ant.element.style.top = ant.y + "px";
    });

    animationFrame = requestAnimationFrame(animate);
}

/* Dashboard update */
function updateDashboard() {
    if (antCount) antCount.innerText = ants.length;
    if (crossedCount) crossedCount.innerText = crossed;
    if (sideAnts) sideAnts.innerText = ants.length;
    if (sideCrossed) sideCrossed.innerText = crossed;
    if (sideSpeed) sideSpeed.innerText = globalSpeed.toFixed(1);
}

/* Sidebar List Update */
function updateAntList() {
    if (!antList) return;
    antList.innerHTML = "";

    ants.forEach(ant => {
        const item = document.createElement("div");
        item.className = "antInfo";
        item.innerText = `🐜 ANT #${String(ant.id).padStart(2, "0")}`;
        antList.appendChild(item);
    });
}

/* Controls */
function startSimulation() {
    if (running) return;
    running = true;
    if (status) status.innerText = "TRACKING";

    ants.forEach(ant => {
        ant.element.classList.add("walk");
    });

    animate();
}

function pauseSimulation() {
    running = false;
    if (status) status.innerText = "PAUSED";
    cancelAnimationFrame(animationFrame);
}

function resetSimulation() {
    running = false;
    cancelAnimationFrame(animationFrame);
    if (status) status.innerText = "READY";
    createAnts();
}

function changeSpeed() {
    if (slider) {
        globalSpeed = parseFloat(slider.value);
        if (sliderValue) sliderValue.innerText = globalSpeed.toFixed(1);
        updateDashboard();
    }
}

function toggleDayNight() {
    night = !night;

    if (night) {
        document.body.classList.add("night");
        if (environment) environment.innerText = "NIGHT 🌙";
    } else {
        document.body.classList.remove("night");
        if (environment) environment.innerText = "DAY ☀️";
    }
}

/* Initial setup */
createAnts();