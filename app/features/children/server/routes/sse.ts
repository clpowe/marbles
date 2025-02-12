import { getChildren } from "../db/children";
import updates from "~~/server/utils/eventEmmit";

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const [sessionError, UserSession] = await catchError(getUserSession(event));

  if (!UserSession?.user) {
    throw createError({
      statusCode: 401,
      message: sessionError?.message || "User not Found",
    });
  }

  // Define the update handler function separately so we can reference it for removal
  const handleUpdate = async () => {
    console.log("update received");
    const [error, children] = await catchError(
      getChildren(UserSession?.user?.id as string),
    );
    if (!error && children) {
      console.log(children);
      await eventStream.push({ data: JSON.stringify(children) });
    }
  };

  // Add the event listener
  updates.on("new", handleUpdate);

  // Cleanup when the client disconnects
  eventStream.onClosed(async () => {
    // Remove the specific event listener we added
    updates.off("new", handleUpdate);
    // Close the event stream
    await eventStream.close();
  });

  // Initial data fetch
  const [initialError, initialChildren] = await catchError(
    getChildren(UserSession.user.id as string),
  );

  if (!initialError && initialChildren) {
    await eventStream.push({ data: JSON.stringify(initialChildren) });
  }

  return eventStream.send();
});
