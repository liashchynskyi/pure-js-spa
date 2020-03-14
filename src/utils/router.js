export default class Router {
  constructor(routes) {
    this.routes = Object.keys(routes).map(path => {
      return {
        path: new RegExp("^" + path.replace(/:[^\s/]+/g, "([\\d]+)") + "$"),
        handler: routes[path]
      };
    });
  }

  converter(path) {
    return new RegExp("^" + path.replace(/:[^\s/]+/g, "([\\d]+)") + "$");
  }

  getByPath(path) {
    const route = this.routes.filter(route => {
      return path.match(route.path);
    })[0];
    return route;
  }
  navigate(event) {
    event.preventDefault();
    const pathName = event.target.getAttribute("href");
    this.routes.forEach(route => {
      let found = pathName.match(route.path);
      if (found) {
        const args = found.slice(1);
        window.history.pushState({}, null, found[0]);
        route.handler(args);
      }
    });
  }
  static redirect(path) {
    window.history.pushState({}, null, path);
  }
}
