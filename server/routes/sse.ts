import { getChildren } from '~~/server/utils/children'
import updates from '~~/server/utils/eventEmmit'

export default defineEventHandler(async (event) => {
	const eventStream = createEventStream(event)
	const { user } = await getUserSession(event)

	updates.updates.on('new', async (data) => {
		const children = await getChildren(user?.id)
		await eventStream.push(JSON.stringify(children))
	})

	const interval = setInterval(async () => {
		const children = await getChildren(user?.id)
		await eventStream.push(JSON.stringify(children))
	}, 1000)

	eventStream.onClosed(async () => {
		clearInterval(interval)
		updates.updates.off('new', () => {})
		await eventStream.close()
	})

	return eventStream.send()
})
