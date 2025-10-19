import { getAllChildren } from '~~/server/utils/children'

export default defineWebSocketHandler({
  async open(peer) {
    peer.subscribe('marbles')
    const children = await getAllChildren()
    peer.send(JSON.stringify(children))
  },
  async message(peer, message) {
    const children = await getAllChildren()
    peer.publish('marbles', JSON.stringify(children))
  },
  close(peer) {
    peer.unsubscribe('marbles')
  }
})
