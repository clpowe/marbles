<script setup lang="ts">
const { id, marbles } = defineProps<{
  marbles: Number;
  name: String;
  id: String;
}>();

import Matter from "matter-js";
import confetti from "canvas-confetti";

const canvasWrapper = useTemplateRef("canvasWrapper");
const targetIsVisible = useElementVisibility(canvasWrapper);

const { width, height } = useElementBounding(canvasWrapper);
const THICCNESS = 60;

const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

let engine, render, runner, leftWall;
let rightWall;
let ground;
const balls = ref([]);

onMounted(() => {
  engine = Engine.create();
  render = Render.create({
    element: canvasWrapper.value,
    engine: engine,
    options: {
      width: width.value,
      height: height.value,
      wireframes: false,
      background: "transparent",
    },
  });

  for (let i = 0; i < marbles; i++) {
    let circle = Bodies.circle(i, 10, 50, {
      friction: 0.3,
      frictionAir: 0.00001,
      restitution: 0.8,
    });

    balls.value.push(circle);
  }
  Composite.add(engine.world, balls.value);

  ground = Bodies.rectangle(
    width.value / 2,
    height.value + THICCNESS / 2,
    27184,
    THICCNESS,
    { isStatic: true },
  );

  leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    height.value / 2,
    THICCNESS,
    height.value * 5,
    {
      isStatic: true,
    },
  );

  rightWall = Bodies.rectangle(
    width.value + THICCNESS / 2,
    height.value / 2,
    THICCNESS,
    height.value * 5,
    { isStatic: true },
  );

  Composite.add(engine.world, [ground, leftWall, rightWall]);

  let mouse = Matter.Mouse.create(render.canvas);
  let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(engine.world, mouseConstraint);

  Render.run(render);
  runner = Runner.create();
  Runner.run(runner, engine);
});

watch([width, height], () => {
  render.canvas.width = width.value;
  render.canvas.height = height.value;

  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(width.value / 2, height.value + THICCNESS / 2),
  );

  // reposition right wall
  Matter.Body.setPosition(
    rightWall,
    Matter.Vector.create(width.value + THICCNESS / 2, height.value / 2),
  );
});

watch(
  () => marbles.value,
  (newId, oldId, onCleanup) => {
    console.log(newId.value);
    onCleanup(() => {
      // cleanup logic
    });
  },
);

async function add() {
  const res = await $fetch("/api/updateMarbles", {
    method: "POST",
    body: JSON.stringify({
      childId: id,
      amount: 1,
      reason: "Marble transaction",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let circle = Bodies.circle(25, 10, 50, {
    friction: 0.3,
    frictionAir: 0.00001,
    restitution: 0.8,
  });

  balls.value.push(circle);
  Composite.add(engine.world, balls.value[balls.value.length - 1]);
}

async function subtract() {
  try {
    const res = await $fetch("/api/updateMarbles", {
      method: "POST",
      body: JSON.stringify({
        childId: id,
        amount: -1,
        reason: "Marble transaction",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ball = balls.value.pop();
    const { position } = ball;
    createConfettiExplosion(position.x, position.y);
    Composite.remove(engine.world, ball);
  } catch (e) {
    console.log(e);
  }
}

// Function to create confetti explosion using Confetti.js
const createConfettiExplosion = (x, y) => {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { x: x / width.value, y: y / height.value }, // Convert coordinates to percentages
    colors: ["#ff4757", "#1abc9c", "#f9ca24", "#e056fd", "#ff9f1a"],
  });
};

onUnmounted(() => {
  Matter.Render.stop(render);
  Matter.Engine.clear(engine);
});

onMounted(() => {});
</script>

<template>
  <div ref="canvasWrapper" class="canvas-wrapper relative">
    <div class="marbles">
      <p>{{ marbles }}</p>
      <UButtonGroup size="sm" orientation="horizontal">
        <UButton
          icon="i-heroicons-chevron-up-20-solid"
          size="sm"
          @click="add"
          variant="outline"
          class="pointer-events-auto rounded-full"
        />
        <UButton
          icon="i-heroicons-chevron-down-20-solid"
          size="sm"
          @click="subtract"
          variant="outline"
          class="pointer-events-auto rounded-full"
        />
      </UButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.marbles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.canvas-wrapper {
  width: 100%;
  height: 100dvh;
}
</style>
