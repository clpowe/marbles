import type { Peer, Message } from "crossws";
import { getChildren } from "../db/children";

const room = "room";

export default defineWebSocketHandler({
  async upgrade(request) {
    await requireUserSession(request);
  },
  async open(peer) {
    const { user } = await requireUserSession(peer);
    const children = await getChildren(user?.id);
    peer.subscribe(room);
    peer.send(JSON.stringify(children));
    peer.publish(room, JSON.stringify(children));
  },
  async message(peer, message) {
    const { user } = await requireUserSession(peer);
    const children = await getChildren(user?.id);
    peer.send(JSON.stringify(children));
    peer.publish(room, JSON.stringify(children));
  },
  close(connection) {
    connection.close();
  },
});
