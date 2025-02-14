type Child = {
  id: string;
  firstName: string;
  lastName: string;
  transactionSum: number;
};

export const useChildren = async () => {
  const children = useState("children", () => []);

  const { status, data, error, close } = useEventSource("/sse");

  watch(data, () => {
    if (data.value === "") return;
    children.value = JSON.parse(data.value as string);
  });

  return { children, close };
};
