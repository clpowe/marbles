export default defineWebSocketHandler({
  open(connection) {
    connection.send("");
  },
  message(connection, message) {
    connection;
  },
  close(connection) {
    connection.close();
  },
});
