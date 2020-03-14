export default class Observable {
  constructor() {
    this.observers = [];
  }
  attach(fn) {
    this.observers.push(fn);
  }
  detach(fn) {
    this.observers = this.observers.filter(subscriber => subscriber !== fn);
  }
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}
