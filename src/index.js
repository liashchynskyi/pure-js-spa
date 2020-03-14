import "./styles.css";
import UI from "./utils/ui";
import Router from "./utils/router";

const uiManager = new UI(document.getElementById("container"));

const searchForm = document.getElementsByTagName("form")[0];
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  Router.redirect("/");
  const query = document.getElementsByName("search")[0].value;
  uiManager.loadMovies(query);
});

const onChangeRoute = () => {
  const path = window.location.pathname;
  const id = path.split("/")[2];
  const route = uiManager.router.getByPath(path);
  console.log(path, id, route);
  route.handler(id);
};

window.onpopstate = onChangeRoute;

const ready = fn => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn, false);
  }
};

const fn = () => {
  onChangeRoute();
};

ready(fn);
