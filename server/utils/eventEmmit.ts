import { EventEmitter } from "events";

class UpdateEvents extends EventEmitter {
  constructor() {
    super();
  }

  new(data) {
    this.emit("new", data);
  }
}

const updates = new UpdateEvents();

export default {
  updates,
  newUpdate: (data) => updates.new(data),
};
