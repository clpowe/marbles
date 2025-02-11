<script setup lang="ts">
const { id, marbles } = defineProps<{
  marbles: Number;
  name: String;
  id: String;
}>();

import Matter from "matter-js";

const canvasWrapper = useTemplateRef("canvasWrapper");

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
    let circle = Bodies.circle(i, 10, 30, {
      friction: 0.3,
      frictionAir: 0.00001,
      restitution: 0.8,
    });
    Composite.add(engine.world, circle);
    balls.value.push(circle);
  }

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
}

async function subract() {
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
  } catch (e) {
    console.log(e);
  }
}

onUnmounted(() => {
  Matter.Render.stop(render);
  Matter.Engine.clear(engine);
});
</script>

<template>
  <div class="holder">
    <div class="marble-holder">
      <p class="marbles">{{ marbles }}</p>
      <p class="name">{{ name }}</p>
      <div>
        <UButton @click="add" class="pointer-events-auto">Add</UButton>
        <UButton @click="subract" class="pointer-events-auto">Sub</UButton>
      </div>
    </div>
    <div ref="canvasWrapper" class="canvas-wrapper"></div>
  </div>
</template>

<style scoped>
.holder {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  height: 100dvh;
  width: 100dvw;
  pointer-events: none;
}

.marble-holder {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  place-self: center;
  display: grid;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.marbles {
  font-size: 8rem;
  line-height: 1;
  font-weight: 900;
  pointer-events: none;
}
.name {
  font-size: 2rem;
  font-weight: 900;
  pointer-events: none;
}
.canvas-wrapper {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  pointer-events: none;
}
p {
}
</style>
