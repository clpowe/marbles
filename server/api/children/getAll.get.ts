import { getChildren } from "~~/server/utils/children";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const children = await getChildren(user.id);
  return children;
});
