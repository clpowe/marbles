import { Peer, Message } from 'crossws'
const room = 'TEST'

export default defineWebSocketHandler({
	open(peer) {
		console.log('opened WS', peer.remoteAddress)
		peer.subscribe(room)
		peer.publish(room, 'Another user joind the chat')
	},
	close(peer) {
		console.log('closed WS')
	},
	error(peer, error) {
		console.log('error WS', peer, error)
	},
	message(peer, message) {
		console.log('message WS', peer.id, message.text())
		onCalc(peer, message)
	}
})
function onCalc(peer: Peer, message: Message) {
	if (message.text().startsWith('calc')) {
		const equation = message.text().replace('calc ', '')
		const result = eval(equation)
		peer.send(`The result of ${equation} is ${result}`)
		peer.publish(room, `The result of ${equation} is ${result}`)
	}
}
