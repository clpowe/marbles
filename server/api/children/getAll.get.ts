import { getChildren } from "~~/server/utils/children";

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  const children = await getChildren(user?.id);
  console.log("Children fetched:", children);
  return children;
});
