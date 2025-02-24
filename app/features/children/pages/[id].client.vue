<script setup lang="ts">
	import Matter from 'matter-js'
	import confetti from 'canvas-confetti'

	const route = useRoute()

	const { children, add } = await useWebChildren()

	// Handle touch double-taps
	let lastTapTime = 0
	const DOUBLE_TAP_DELAY = 300 // milliseconds

	const child = computed(() => {
		if (children.value) {
			return children.value.find((child) => child.id === route.params.id)
		} else {
			return {
				id: '',
				firstName: '',
				lastName: '',
				transactionSum: 0
			}
		}
	})
	const canvasWrapper = useTemplateRef('canvasWrapper')

	const { width, height } = useElementBounding(canvasWrapper)
	const THICCNESS = 60

	const Engine = Matter.Engine
	const Render = Matter.Render
	const Runner = Matter.Runner
	const Bodies = Matter.Bodies
	const Composite = Matter.Composite

	let engine: Matter.Engine,
		render: Matter.Render,
		runner: Matter.Runner,
		leftWall: Matter.Body
	let rightWall: Matter.Body
	let ground: Matter.Body
	const balls = ref<Matter.Body[]>([])

	onMounted(() => {
		engine = Engine.create()
		render = Render.create({
			element: canvasWrapper.value ?? undefined,
			engine: engine,
			options: {
				width: width.value,
				height: height.value,
				wireframes: false,
				background: 'transparent'
			}
		})

		for (let i = 0; i < child.value.transactionSum; i++) {
			const centerX = width.value / 2

			let circle: Matter.Body = Bodies.circle(centerX, 10, size(30, 80), {
				friction: 0.5,
				frictionAir: 0.001,
				restitution: 0.8
			})

			balls.value.push(circle)
		}

		Composite.add(engine.world, balls.value)

		ground = Bodies.rectangle(
			width.value / 2,
			height.value + THICCNESS / 2,
			27184,
			THICCNESS,
			{ isStatic: true }
		)

		leftWall = Bodies.rectangle(
			0 - THICCNESS / 2,
			height.value / 2,
			THICCNESS,
			height.value * 5,
			{
				isStatic: true
			}
		)

		rightWall = Bodies.rectangle(
			width.value + THICCNESS / 2,
			height.value / 2,
			THICCNESS,
			height.value * 5,
			{ isStatic: true }
		)

		Composite.add(engine.world, [ground, leftWall, rightWall])

		let mouse = Matter.Mouse.create(render.canvas)
		let mouseConstraint = Matter.MouseConstraint.create(engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.5,
				render: {
					visible: false
				}
			}
		})

		Composite.add(engine.world, mouseConstraint)

		Render.run(render)
		runner = Runner.create()
		Runner.run(runner, engine)

		render.canvas.addEventListener('dblclick', (event: MouseEvent) => {
			const rect = render.canvas.getBoundingClientRect()
			const pos = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			}
			handleDoubleEvent(pos.x, pos.y)
		})

		render.canvas.addEventListener('touchend', (event: TouchEvent) => {
			const currentTime = Date.now()
			if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
				const touch = event.changedTouches[0]
				const rect = render.canvas.getBoundingClientRect()
				const pos = {
					x: touch.clientX - rect.left,
					y: touch.clientY - rect.top
				}
				handleDoubleEvent(pos.x, pos.y)
				event.preventDefault() // prevent simulated mouse events
			}
			lastTapTime = currentTime
		})
	})

	watch([width, height], () => {
		render.canvas.width = width.value
		render.canvas.height = height.value

		Matter.Body.setPosition(
			ground,
			Matter.Vector.create(width.value / 2, height.value + THICCNESS / 2)
		)

		// reposition right wall
		Matter.Body.setPosition(
			rightWall,
			Matter.Vector.create(width.value + THICCNESS / 2, height.value / 2)
		)
	})

	let previousChildren: {
		id: string
		firstName: string
		lastName: string
		transactionSum: number
	}[] = []

	async function useAdd() {
		add(
			route.params.id,
			previousChildren,
			balls,
			Composite,
			Bodies,
			width,
			size,
			child,
			engine
		)
	}

	async function subtract() {
		try {
			const res = await $fetch('/api/updateMarbles', {
				method: 'POST',
				body: JSON.stringify({
					childId: route.params.id,
					amount: -1,
					reason: 'Marble transaction'
				}),
				headers: {
					'Content-Type': 'application/json'
				},

				onRequest() {
					previousChildren = children.value
					child.value.transactionSum -= 1
					const idx = children.value.findIndex(
						(child) => child.id === route.params.id
					)
					children.value[idx] = child.value

					const ball: Matter.Body | undefined = balls.value.pop()
					if (!ball) return
					const { position } = ball as Matter.Body
					createConfettiExplosion(position.x, position.y)
					Composite.remove(engine.world, ball)
				},
				onResponseError() {
					children.value = previousChildren
				}
			})
		} catch (e) {
			console.log(e)
		}
	}

	function handleDoubleEvent(x: number, y: number) {
		const clickedBodies = Matter.Query.point(balls.value, { x, y })
		console.log(clickedBodies[0])
		if (clickedBodies.length) {
			const bodyToRemove = clickedBodies[0]
			if (!bodyToRemove) return
			Composite.remove(engine.world, bodyToRemove)
			balls.value = balls.value.filter((b) => b !== bodyToRemove)
			child.value.transactionSum-- // update state if needed
			createConfettiExplosion(x, y)
			$fetch('/api/updateMarbles', {
				method: 'POST',
				body: JSON.stringify({
					childId: route.params.id,
					amount: -1,
					reason: 'Marble transaction'
				}),
				headers: { 'Content-Type': 'application/json' }
			})
		}
	}

	// Function to create confetti explosion using Confetti.js
	const createConfettiExplosion = (x: number, y: number) => {
		confetti({
			particleCount: 50,
			spread: 70,
			origin: { x: x / width.value, y: y / height.value }, // Convert coordinates to percentages
			colors: ['#ff4757', '#1abc9c', '#f9ca24', '#e056fd', '#ff9f1a']
		})
	}

	const size = function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min
	}

	onUnmounted(() => {
		Matter.Render.stop(render)
		Matter.Engine.clear(engine)
	})
</script>

<template>
	<div ref="canvasWrapper" class="canvas-wrapper relative">
		<div class="marbles">
			<p class="text-8xl font-bold">{{ child.transactionSum }}</p>
			<h1 class="text-4xl font-bold">
				{{ child.firstName }}
			</h1>
			<UButtonGroup size="lg" orientation="horizontal">
				<UButton
					icon="i-heroicons-chevron-up-20-solid"
					size="xl"
					@click="useAdd"
					variant="outline"
					class="pointer-events-auto rounded-full"
				/>
				<UButton
					icon="i-heroicons-chevron-down-20-solid"
					size="xl"
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
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h1 {
		font-size: 2rem;
		font-weight: 800;
	}

	p {
		font-size: 9rem;
		font-weight: 800;
		line-height: 1;
	}
	.canvas-wrapper {
		width: 100%;
		height: 100dvh;
	}
</style>
