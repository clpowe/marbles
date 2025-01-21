export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);

  const interval = setInterval(async () => {
    const children = await useDrizzle().select().from(tables.children).all();
    await eventStream.push(JSON.stringify(children));
  }, 500);

  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
