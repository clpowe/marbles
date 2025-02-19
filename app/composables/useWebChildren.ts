export const useWebChildren = async () => {
  const children = useState<Child[]>("children", () => []);

  const { status, data, send, open, close } = useWebSocket(
    `wss://${location.host}/api/websocket`,
  );

  watch(data, (newdata) => {
    if (status.value === "OPEN") {
      children.value = JSON.parse(newdata);
    }
  });

  function handleClose() {
    close();
  }

  const handleOpen = (event: Event) => {
    open();
  };
  function handleUpdate(event: Event) {
    send("update");
  }
  return { children, handleClose, handleUpdate, handleOpen };
};
