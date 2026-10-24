/**
 * @file terminalHistory.js
 * @description Manages CLI command history with navigation support.
 * Keeps an ordered array of user commands and an active index pointer
 * to enable standard Up and Down arrow key navigation in the terminal.
 * Used exclusively by terminalUI input listeners.
 */

export class TerminalHistory {
  constructor(maxSize = 100) {
    this.history = [];
    this.currentIndex = -1;
    this.maxSize = maxSize;
  }

  add(command) {
    if (!command || !command.trim()) return;
    if (this.history[this.history.length - 1] !== command) {
      this.history.push(command);
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
