export class jVarTerminalHistory {
  constructor(jVarMaxSize = 100) {
    this.history = [];
    this.currentIndex = -1;
    this.maxSize = jVarMaxSize;
  }

  add(jVarCommand) {
    if (!jVarCommand || !jVarCommand.trim()) return;
    if (this.history[this.history.length - 1] !== jVarCommand) {
      this.history.push(jVarCommand);
      if (this.history.length > this.maxSize) {
        this.history.shift();
      }
    }
    this.currentIndex = this.history.length;
  }

  getPrevious() {
    if (this.history.length === 0) return null;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = 0;
    }
    return this.history[this.currentIndex];
  }

  getNext() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    this.currentIndex = this.history.length;
    return "";
  }

  resetPointer() {
    this.currentIndex = this.history.length;
  }
}
