import { getChildren } from "~~/server/utils/children";
import updates from "~~/server/utils/eventEmmit";

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const session = await getUserSession(event);

  console.log(session.user);

  if (!session.user) {
    console.log(session.user?.id);
    return;
  }

  updates.updates.on("new", async (data) => {
    const children = await getChildren(session.user?.id);
    await eventStream.push(JSON.stringify(children));
  });

  const interval = setInterval(async () => {
    const children = await getChildren(session.user?.id);
    await eventStream.push(JSON.stringify(children));
  }, 1000);

  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
