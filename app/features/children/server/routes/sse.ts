import { getChildren } from "../db/children";
import updates from "~~/server/utils/eventEmmit";
export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "User not Found",
    });
  }

  const updateChildren = async () => {
    console.log("g");
    const children = await getChildren(user?.id);
    console.log(children[0]);
    await eventStream.push(JSON.stringify(children));
  };

  updates.on("new", updateChildren);

  eventStream.onClosed(async () => {
    updates.off("new", updateChildren);
    await eventStream.close();
  });

  return eventStream.send();
});
