import API from "./api";
import Router from "./router";
import Observable from "./observable";
import Store from "./store";

const listObservable = new Observable();
const linksObservable = new Observable();
const store = new Store();
const apiClient = new API("e216d8b818bec7b6162213cd611b2846");

export default class UI {
  constructor(container) {
    this.container = container;
    listObservable.attach(movies => {
      this.container.innerText = "Loading list...";
      store.set("movies", movies);
      this.renderList();
    });
    linksObservable.attach(() => {
      const links = Array.from(document.getElementsByTagName("a"));
      links.forEach(link =>
        link.addEventListener("click", event => this.router.navigate(event))
      );
    });

    this.router = new Router({
      "/": () => {
        console.log("in / route handler");
        const movies = store.get("movies");
        if (movies === null || movies === undefined) {
          this.loadMovies();
        } else {
          this.renderList();
        }
      },
      "/about/:id": id => {
        const movie = store.getById(id, "movies");
        if (movie === null || movie === undefined) {
          apiClient.getMovieInfo(id).then(movie => {
            this.renderMovie(movie);
          });
        } else this.renderMovie(movie);
      }
    });
  }

  createListMarkup(slice = 20) {
    const movies = store.get("movies");
    return movies.length > 0 ? `<ul>
      ${movies
        .slice(0, slice)
        .map(
          movie =>
            `<li><a href="/about/${movie.id}">${movie.title ||
              movie.name}</a></li>`
        )
        .join("\n")}
    </ul>` : 'No movies found!';
  }

  createMovieMarkup(movie) {
    return `<h1>${movie.title || movie.name}</h1>
    <img src='https://image.tmdb.org/t/p/w300/${movie.poster_path}'>
    <p>${movie.overview}</p>
    <div id="recommendations">Loading...</div>
    `;
  }

  renderList() {
    const markup = this.createListMarkup();
    this.container.innerHTML = markup;
    linksObservable.notify();
  }

  renderMovie(movie) {
    const markup =
      movie !== undefined
        ? this.createMovieMarkup(movie)
        : `Can not find movie with this id`;
    this.container.innerHTML = markup;

    const promise =
      movie !== undefined ? apiClient.getRecommendations(movie.id) : null;
    if (promise)
      promise.then(({ results }) => {
        store.set("movies", results);
        const markup = this.createListMarkup(5);
        const recContainer = document.getElementById("recommendations");
        recContainer.innerHTML = `<h2>Recommendations</h2>` + markup;
        console.log("Notify links observers...");
        linksObservable.notify();
      });
  }

  loadMovies(query) {
    if (!!query) {
      apiClient.searchMovies(query).then(data => {
        console.log("Notify list observers (search)...");
        listObservable.notify(data.results);
      });
    } else {
      apiClient.getTrending().then(data => {
        console.log("Notify list observers...");
        listObservable.notify(data.results);
      });
    }
  }
}
