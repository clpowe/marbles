import { getAllChildren } from '~~/server/utils/children'

export default defineEventHandler(async () => {
	const children = await getAllChildren()
	return children
})
