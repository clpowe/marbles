import { EventEmitter } from 'events'

interface UpdateEvents extends EventEmitter {
	emitNew(data: unknown): void
}

class UpdateEventsEmitter extends EventEmitter implements UpdateEvents {
	constructor() {
		super()
	}

	emitNew(data: unknown) {
		this.emit('new', data)
	}
}

const updates = new UpdateEventsEmitter()
// Export the instance itself, not an object containing it
export default updates
