import { createEventStream } from 'h3'

import updates from '~~/server/utils/eventEmmit'
import { getAllChildren } from '~~/server/utils/children'

export default defineEventHandler(async (event) => {
	const eventStream = createEventStream(event)

	const sendChildren = async () => {
		const children = await getAllChildren()
		await eventStream.push(JSON.stringify(children))
	}

	await sendChildren()

	updates.on('new', sendChildren)

	eventStream.onClosed(async () => {
		updates.off('new', sendChildren)
		await eventStream.close()
	})

	return eventStream.send()
})
