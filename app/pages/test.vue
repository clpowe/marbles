<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
	import planck from 'planck-js'
	import * as PIXI from 'pixi.js'
	import confetti from 'canvas-confetti'

	const route = useRoute()
	const { children, getChildren } = await useChildren()
	await getChildren()

	const child = computed(() =>
		children.value.find((c) => c.id === '9cc64e56-eb8d-4246-8d67-125716a25461')
	)
	const canvasWrapper = useTemplateRef('canvasWrapper')
	const { width, height } = useElementBounding(canvasWrapper)

	const THICCNESS = 60 // pixels
	const scale = 30 // pixels per meter

	let world: planck.World
	let pixiApp: PIXI.Application
	let ground: planck.Body, leftWall: planck.Body, rightWall: planck.Body
	const balls = ref<planck.Body[]>([])
	const ballGraphics = new Map<planck.Body, PIXI.Graphics>()

	onMounted(async () => {
		// Create Pixi Application
		pixiApp = new PIXI.Application()

		await pixiApp.init({
			width: width.value,
			height: height.value,
			transparent: true
		})

		canvasWrapper.value.appendChild(pixiApp.canvas)
		// Create Planck.js world with gravity
		world = planck.World({ gravity: planck.Vec2(0, 10) })
		// Create boundaries
		ground = world.createBody({
			type: 'static',
			position: planck.Vec2(
				width.value / 2 / scale,
				(height.value + THICCNESS / 2) / scale
			)
		})
		ground.createFixture(
			planck.Box((width.value * 10) / scale, THICCNESS / 2 / scale)
		)
		leftWall = world.createBody({
			type: 'static',
			position: planck.Vec2(
				(0 - THICCNESS / 2) / scale,
				height.value / 2 / scale
			)
		})
		leftWall.createFixture(
			planck.Box(THICCNESS / 2 / scale, (height.value * 5) / scale)
		)
		rightWall = world.createBody({
			type: 'static',
			position: planck.Vec2(
				(width.value + THICCNESS / 2) / scale,
				height.value / 2 / scale
			)
		})
		rightWall.createFixture(
			planck.Box(THICCNESS / 2 / scale, (height.value * 5) / scale)
		)
		// Create initial balls
		for (let i = 0; i < child.value.transactionSum; i++) {
			const ball = world.createDynamicBody({
				position: planck.Vec2((i * 60 + 25) / scale, 10 / scale),
				linearDamping: 0.001
			})
			ball.createFixture(planck.Circle(50 / scale), {
				friction: 0.5,
				restitution: 0.8
			})
			balls.value.push(ball)
			// Create a Pixi Graphics for the ball
			const gfx = new PIXI.Graphics()
			gfx.beginFill(0xff4757)
			gfx.drawCircle(0, 0, 50)
			gfx.endFill()
			gfx.x = ball.getPosition().x * scale
			gfx.y = ball.getPosition().y * scale
			pixiApp.stage.addChild(gfx)
			ballGraphics.set(ball, gfx)
		}
		// Use Pixi's ticker as the simulation loop
		pixiApp.ticker.add(() => {
			world.step(1 / 60)

			ballGraphics.forEach((gfx, ball) => {
				const pos = ball.getPosition()
				gfx.x = pos.x * scale
				gfx.y = pos.y * scale
				gfx.rotation = ball.getAngle()
			})
		})
	})

	watch([width, height], () => {
		if (pixiApp) {
			pixiApp.renderer.resize(width.value, height.value)
		}
		ground.setPosition(
			planck.Vec2(
				width.value / 2 / scale,
				(height.value + THICCNESS / 2) / scale
			)
		)
		rightWall.setPosition(
			planck.Vec2(
				(width.value + THICCNESS / 2) / scale,
				height.value / 2 / scale
			)
		)
	})

	let previousChildren = []

	async function add() {
		// Optimistic update
		previousChildren = children.value
		child.value.transactionSum += 1
		const idx = children.value.findIndex(
			(c) => c.id === '9cc64e56-eb8d-4246-8d67-125716a25461'
		)
		children.value[idx] = child.value

		// Add ball immediately
		const ball = world.createDynamicBody({
			position: planck.Vec2(25 / scale, 10 / scale),
			linearDamping: 0.001
		})
		ball.createFixture(planck.Circle(50 / scale), {
			friction: 0.5,
			restitution: 0.8
		})
		balls.value.push(ball)

		const gfx = new PIXI.Graphics()
		gfx.beginFill(0xff4757)
		gfx.drawCircle(0, 0, 50)
		gfx.endFill()
		gfx.x = ball.getPosition().x * scale
		gfx.y = ball.getPosition().y * scale
		pixiApp.stage.addChild(gfx)
		ballGraphics.set(ball, gfx)

	try {
		await $fetch('/api/updateMarbles', {
			method: 'POST',
			body: JSON.stringify({
				childId: '9cc64e56-eb8d-4246-8d67-125716a25461',
				amount: 1,
				reason: 'Marble transaction'
			}),
			headers: { 'Content-Type': 'application/json' }
		})
		} catch (error) {
			// Revert on error
			children.value = previousChildren
			// Remove the ball that was added optimistically
			const lastBall = balls.value.pop()
			if (lastBall) {
				world.destroyBody(lastBall)
				const lastGfx = ballGraphics.get(lastBall)
				if (lastGfx) {
					pixiApp.stage.removeChild(lastGfx)
					ballGraphics.delete(lastBall)
				}
			}
			console.error('Failed to add marble:', error)
		}
	}

	async function subtract() {
		// Optimistic update
		previousChildren = [...children.value]
		const originalSum = child.value.transactionSum
		child.value.transactionSum -= 1
		const idx = children.value.findIndex(
			(c) => c.id === '9cc64e56-eb8d-4246-8d67-125716a25461'
		)
		children.value[idx] = { ...child.value }

		// Remove ball immediately
		const ball = balls.value.pop()
		let removedBallData = null
		if (ball) {
		const pos = ball.getPosition()
		removedBallData = { pos: { x: pos.x, y: pos.y } }
			createConfettiExplosion(pos.x * scale, pos.y * scale)
			world.destroyBody(ball)

			const gfx = ballGraphics.get(ball)
			if (gfx) {
				pixiApp.stage.removeChild(gfx)
				ballGraphics.delete(ball)
			}
		}

	try {
		await $fetch('/api/updateMarbles', {
			method: 'POST',
			body: JSON.stringify({
				childId: '9cc64e56-eb8d-4246-8d67-125716a25461',
				amount: -1,
				reason: 'Marble transaction'
			}),
			headers: { 'Content-Type': 'application/json' }
		})
		} catch (error) {
			// Revert on error
			children.value = previousChildren
			child.value.transactionSum = originalSum
			
			// Re-add the ball if one was removed
			if (removedBallData) {
				const ball = world.createDynamicBody({
					position: planck.Vec2(removedBallData.pos.x, removedBallData.pos.y),
					linearDamping: 0.001
				})
				ball.createFixture(planck.Circle(50 / scale), {
					friction: 0.5,
					restitution: 0.8
				})
				balls.value.push(ball)

				const gfx = new PIXI.Graphics()
				gfx.beginFill(0xff4757)
				gfx.drawCircle(0, 0, 50)
				gfx.endFill()
				gfx.x = ball.getPosition().x * scale
				gfx.y = ball.getPosition().y * scale
				pixiApp.stage.addChild(gfx)
				ballGraphics.set(ball, gfx)
			}
			console.error('Failed to subtract marble:', error)
		}
	}

	const createConfettiExplosion = (x: number, y: number) => {
		confetti({
			particleCount: 50,
			spread: 70,
			origin: { x: x / pixiApp.canvas.width, y: y / pixiApp.canvas.height },
			colors: ['#ff4757', '#1abc9c', '#f9ca24', '#e056fd', '#ff9f1a']
		})
	}

	onUnmounted(() => {
		pixiApp.destroy(true, { children: true })
	})
</script>

<template>
	<div ref="canvasWrapper" class="canvas-wrapper relative">
		<div class="marbles">
			<!-- <p class="text-8xl font-bold">{{ child.transactionSum }}</p>
			<h1 class="text-4xl font-bold">{{ child.firstName }}</h1> -->
			<UButtonGroup size="lg" orientation="horizontal">
				<UButton
					icon="i-heroicons-chevron-up-20-solid"
					size="xl"
					@click="add"
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
