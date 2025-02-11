<script setup>
import { onMounted, onUnmounted, watchEffect, useTemplateRef, ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import Matter from "matter-js";
import confetti from "canvas-confetti";

// Reactive window size
const { width, height } = useWindowSize();
const canvasRef = useTemplateRef("canvas");

let engine, render;
const balls = ref([]); // Store added balls

// Initialize Matter.js
onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  engine = Matter.Engine.create();
  render = Matter.Render.create({
    canvas,
    engine,
    options: {
      width: width.value,
      height: height.value - 60, // Adjust for header
      wireframes: false,
      background: "#f4f4f4",
    },
  });

  // Ground (Static)
  const ground = Matter.Bodies.rectangle(
    width.value / 2,
    height.value - 80,
    width.value,
    40,
    {
      isStatic: true,
      render: { fillStyle: "#333" },
    },
  );

  Matter.World.add(engine.world, [ground]);
  Matter.Engine.run(engine);
  Matter.Render.run(render);

  // Collision detection
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((pair) => {
      if (pair.bodyA.render && pair.bodyB.render) {
        pair.bodyA.render.fillStyle = "#2ecc71"; // Change color on collision
        pair.bodyB.render.fillStyle = "#2ecc71";
      }
    });
  });
});

// Watch for window size changes and resize canvas dynamically
watchEffect(() => {
  if (render) {
    render.canvas.width = width.value;
    render.canvas.height = height.value - 60;
  }
});

// Function to add a new ball when button is clicked
const addBall = () => {
  const newBall = Matter.Bodies.circle(
    Math.random() * width.value, // Random x position
    100, // Start near the top
    30, // Ball radius
    {
      restitution: 0.8,
      render: { fillStyle: "#e67e22" },
    },
  );
  Matter.World.add(engine.world, newBall);
  balls.value.push(newBall);
};

// Function to remove the last added ball and trigger confetti explosion
const removeLastBall = () => {
  if (balls.value.length > 0) {
    const lastBall = balls.value.pop();
    const { position } = lastBall;

    // Create confetti explosion at ball's position
    createConfettiExplosion(position.x, position.y);

    Matter.World.remove(engine.world, lastBall);
  }
};

// Function to create confetti explosion using Confetti.js
const createConfettiExplosion = (x, y) => {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { x: x / width.value, y: y / height.value }, // Convert coordinates to percentages
    colors: ["#ff4757", "#1abc9c", "#f9ca24", "#e056fd", "#ff9f1a"],
  });
};

// Cleanup on unmount
onUnmounted(() => {
  Matter.Render.stop(render);
  Matter.Engine.clear(engine);
});
</script>

<template>
  <div class="container">
    <div class="header">
      <span>My Nuxt App</span>
      <div class="button-group">
        <button @click="addBall" class="add-ball-button">Add Ball</button>
        <button @click="removeLastBall" class="remove-ball-button">
          Remove Ball
        </button>
      </div>
    </div>
    <div class="card">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.header {
  width: 100%;
  height: 60px;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.button-group {
  display: flex;
  gap: 10px;
}

.add-ball-button,
.remove-ball-button {
  border: none;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s;
}

.add-ball-button {
  background: #e67e22;
}

.add-ball-button:hover {
  background: #d35400;
}

.remove-ball-button {
  background: #c0392b;
}

.remove-ball-button:hover {
  background: #a93226;
}

.card {
  position: absolute;
  top: 60px; /* Below the header */
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
}
</style>
