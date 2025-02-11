import { EventEmitter } from "events";

class UpdateEvents extends EventEmitter {
  constructor() {
    super();
  }

  new(data: unknown) {
    this.emit("new", data);
  }
}

const updates = new UpdateEvents();

export default {
  updates,
  newUpdate: (data: unknown) => updates.new(data),
};
