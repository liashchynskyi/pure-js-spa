export default class Store {
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key) {
    let movies = [];
    if (localStorage.getItem(key) === undefined) return null;
    else {
      movies = localStorage.getItem(key);
      return JSON.parse(movies);
    }
  }

  getById(id, key) {
    return this.get(key)
      ? this.get(key).filter(movie => +movie.id === +id)[0]
      : null;
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
