export default class API {
  constructor(accessToken) {
    if (!accessToken) throw new Error("Token must be provided!");
    this.token = accessToken;
  }

  async getTrending() {
    const URL = `https://api.themoviedb.org/3/trending/all/day?api_key=${
      this.token
    }`;
    const result = await fetch(URL);
    return await result.json();
  }

  async getRecommendations(id) {
    const URL = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${
      this.token
    }`;
    const result = await fetch(URL);
    return await result.json();
  }

  async searchMovies(query) {
    const URL = `https://api.themoviedb.org/3/search/movie?api_key=${
      this.token
    }&query=${encodeURI(query)}`;
    const result = await fetch(URL);
    return await result.json();
  }

  async getMovieInfo(id) {
    const URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${
      this.token
    }`;
    const result = await fetch(URL);
    return await result.json();
  }
}
