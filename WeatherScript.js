const serverUrl = "http://api.openweathermap.org/data/2.5/weather";
const cityName = document.getElementById("inpCity");
const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";
let searchBtn = document.getElementById("searchName");
let weatherImage = document.getElementById("weatherImg");
let favoriteButton = document.getElementById("favoriteBtn");
let cityList = document.querySelector(".cityList");
let mainCity = document.getElementById("mainCity");
let mainCityDet = document.getElementById("mainCityDet");
let cityText = document.getElementById("mainCity").textContent;
let detTemperature = document.getElementById("temperatureDet");
let feelsTemp = document.getElementById("feelsTemp");
let overcast = document.getElementById("overcast");
let sunrise = document.getElementById("sunrise");
let sunset = document.getElementById("sunset");

function saveFavoriteCities(array) {
  const list = JSON.stringify(array);
  localStorage.setItem("FavoriteCities", list);
}

function getFavoriteCities() {
  const savedList = localStorage.getItem("FavoriteCities");
  const savedArray = JSON.parse(savedList);
  return savedArray;
}

function saveCurrentCity(cityName) {
  localStorage.setItem("CurrentCity", cityName);
}

function getCurrentCity() {
  return localStorage.getItem("CurrentCity");
}

let list = [];

let storage = [];

storage.getFavoriteCities = function () {
  return JSON.parse(localStorage.getItem("query"));
};

storage.saveFavoriteCities = function (value) {
  localStorage.setItem("query", JSON.stringify(value));
};

function addTask(newTask) {
  newTask = {
    name: newTask,
  };
  list.push(newTask);
}

function deleteTask(name) {
  let obj = list
    .map((x) => {
      return x.name;
    })
    .indexOf(name);
  list.splice(obj, 1);
}

function getTemp() {
  let searchCity = `${cityName.value}`;
  const url = `${serverUrl}?q=${searchCity}&appid=${apiKey}`;

  let response = fetch(url);
  response
    .then((response) => response.json())
    .then((response) => {
      mainCity.textContent = searchCity;
      mainCityDet.textContent = searchCity;
      document.getElementById("temperature").innerHTML = `${Math.round(
        Number(response.main.temp) - 273.15
      )} &#8451;`;
      detTemperature.innerHTML = `${Math.round(
        Number(response.main.temp) - 273.15
      )} &#8451;`;
      weatherImage.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
      feelsTemp.innerHTML = `${Math.round(
        Number(response.main.feels_like) - 273.15
      )} &#8451;`;
      overcast.innerHTML = response.weather[0].main;
      sunrise.innerHTML = `${new Date(
        1000 * response.sys.sunrise
      ).getHours()}:${new Date(1000 * response.sys.sunrise).getMinutes()}`;
      sunset.innerHTML = `${new Date(
        1000 * response.sys.sunset
      ).getHours()}:${new Date(1000 * response.sys.sunrise).getMinutes()}`;
    })

    .catch(() => alert("Ошибка"));
}

searchBtn.addEventListener("click", () => {
  event.preventDefault();
  saveCurrentCity(mainCity.textContent);
  getTemp();
  render();
});

function addFavCity(mainCity) {
  let div = document.createElement("div");
  div.className = "cityInList";
  cityList.append(div);

  let favCity = document.createElement("li");
  favCity.className = "favoriteCity";
  favCity.textContent = mainCity;
  div.append(favCity);

  let closeBtn = document.createElement("div");
  closeBtn.id = "closeButton";
  closeBtn.innerHTML = `\&times`;
  div.append(closeBtn);
  closeBtn.addEventListener("click", () => {
    div.remove();
    deleteTask(mainCity);
    render();
  });

  div.addEventListener("click", async () => {
    let cityName = `${div.firstChild.textContent}`;
    mainCityDet.textContent = `${div.firstChild.textContent}`;
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
    try {
      let response = await fetch(url);
      saveCurrentCity(cityName);
      let user = await response.json();
      document.getElementById("mainCity").textContent = cityName;
      document.getElementById("temperature").innerHTML = `${Math.round(
        Number(user.main.temp) - 273.15
      )} &#8451;`;
      weatherImage.src = `http://openweathermap.org/img/wn/${user.weather[0].icon}@2x.png`;
      detTemperature.innerHTML = `${Math.round(
        Number(user.main.temp) - 273.15
      )} &#8451;`;
      weatherImage.src = `http://openweathermap.org/img/wn/${user.weather[0].icon}@2x.png`;
      feelsTemp.innerHTML = `${Math.round(
        Number(user.main.feels_like) - 273.15
      )} &#8451;`;
      overcast.innerHTML = user.weather[0].main;
      sunrise.innerHTML = `${new Date(
        1000 * user.sys.sunrise
      ).getHours()}:${new Date(1000 * user.sys.sunrise).getMinutes()}`;
      sunset.innerHTML = `${new Date(
        1000 * user.sys.sunset
      ).getHours()}:${new Date(1000 * user.sys.sunrise).getMinutes()}`;
    } catch (err) {
      alert("Ошибка");
    }
  });

  event.preventDefault();
}

function render() {
  cityList.textContent = "";
  storage.getFavoriteCities();
  for (let elem of list) {
    addFavCity(elem.name);
  }
  saveFavoriteCities(list);
}

favoriteButton.addEventListener("click", () => {
  console.log(mainCity.textContent);
  addTask(mainCity.textContent);
  render();
  return;
});

document.addEventListener("DOMContentLoaded", function () {
  let loadList = getFavoriteCities();
  if (loadList !== null) {
    loadList.forEach((element) => {
      list.push(element);
    });
  }
  render();
});

function getWeather() {
  let cityName = getCurrentCity();
  mainCityDet.textContent = cityName;
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
  let response = fetch(url);
  response
    .then((response) => response.json())
    .then((response) => {
      document.getElementById("mainCity").textContent = cityName;
      document.getElementById("temperature").innerHTML = `${Math.round(
        Number(response.main.temp) - 273.15
      )} &#8451;`;
      weatherImage.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
      detTemperature.innerHTML = `${Math.round(
        Number(response.main.temp) - 273.15
      )} &#8451;`;
      weatherImage.src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
      feelsTemp.innerHTML = `${Math.round(
        Number(response.main.feels_like) - 273.15
      )} &#8451;`;
      overcast.innerHTML = response.weather[0].main;
      sunrise.innerHTML = `${new Date(
        1000 * response.sys.sunrise
      ).getHours()}:${new Date(1000 * response.sys.sunrise).getMinutes()}`;
      sunset.innerHTML = `${new Date(
        1000 * response.sys.sunset
      ).getHours()}:${new Date(1000 * response.sys.sunrise).getMinutes()}`;
    })
    .catch(() => alert("Ошибка"));
}

getWeather();
