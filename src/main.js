function fetchWeatherData(city) {
  const forecastPromise = fetch(`https://api.weatherapi.com/v1/forecast.json?key=43e478e4b6fc474ab08164231252508&q=${city}&days=7&aqi=no`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ошибка! Код: ${response.status}`);
      return response.json();
    })
    .then(data => {
      function getTimeZone(city) {
        switch (city) {
          case 'London':
            return 'Europe/London'
          case 'Moscow':
            return 'Europe/Moscow'
          case 'Tokyo':
            return 'Asia/Tokyo'
          case 'Saint-Petersburg':
            return 'Europe/Moscow'
          case 'Paris':
            return 'Europe/Paris'
          case 'New-york':
            return 'America/New_York'

        }
      }

      function getTimeInCity(timeZone) {
        const options = {
          timeZone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        };

        return new Intl.DateTimeFormat('ru-RU', options).format(new Date());
      }

      const currentCityTime = getTimeInCity(getTimeZone(`${city}`))

      const hourNow = Number(currentCityTime.slice(0, 2));
      const minNow = Number(currentCityTime.slice(3, 5))
      const ForecastDays = data.forecast.forecastday;
      const todayTempByHours = ForecastDays[0].hour;
      const tomorrowTempByHours = ForecastDays[1].hour;

      const timeNeed = hourNow + 3

      const maxWeather = () => ForecastDays.map(day => day.day.maxtemp_c);
      const minWeather = () => ForecastDays.map(day => day.day.mintemp_c);

      const weatherEveryThreeHours = () => {
        const everyThree = [];
        const everyHours = [...todayTempByHours, ...tomorrowTempByHours]


        for (let i = timeNeed; i < 48; i += 3) {
          everyThree.push(everyHours[i].temp_c)
          if (everyThree.length === 8) {
            return everyThree
          }
        }
        return everyThree
      };
      const weatherEveryThreeHoursCondition = () => {
        const everyThreeCondition = [];
        const everyHours = [...todayTempByHours, ...tomorrowTempByHours]

        for (let i = timeNeed; i < 48; i += 3) {
          everyThreeCondition.push(everyHours[i].condition.text)
          if (everyThreeCondition.length === 8) {
            return everyThreeCondition
          }
        }
        return everyThreeCondition
      };

      function weatherForecastTime() {
        const res = []

        for (let i = timeNeed; i < 48; i += 3) {
          res.push(i)
          if (res.length === 8) {
            return res.map(el => el > 24 ? el - 24 : el)
          }
        }
      }


      return {
        weekMax: maxWeather(),
        weekMin: minWeather(),
        everyThreeHours: weatherEveryThreeHours(),
        everyThreeHoursCondition: weatherEveryThreeHoursCondition(),
        weatherForecastTime: weatherForecastTime(),
        minNow: minNow,
        currentCityTime: currentCityTime,
        getTimeZone: getTimeZone(city),
        hourNow: hourNow,
      };
    });

  const currentPromise = fetch(`https://api.weatherapi.com/v1/current.json?key=43e478e4b6fc474ab08164231252508&q=${city}&aqi=no`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ошибка! Код: ${response.status}`);
      return response.json();
    })
    .then(data => ({

      current: `${data.current.temp_c}°`,
      humidityPercent: `${data.current.humidity}%`,
      cloudPercent: `${data.current.cloud}%`,
      windSpeed: `${data.current.wind_kph} km/h`,
      condition: data.current.condition.text,

    }));

  return Promise.all([forecastPromise, currentPromise])
    .then(([forecastData, currentData]) => ({
      ...forecastData,
      ...currentData,
    }))
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      throw error;
    });
}

async function displayWeather(city) {
  try {
    const weatherData = await fetchWeatherData(city);

    document.getElementById('max-temp').innerHTML = weatherData.weekMax[0];
    document.getElementById('min-temp').innerHTML = weatherData.weekMin[0];
    document.getElementById('humadity').innerHTML = weatherData.humidityPercent;
    document.getElementById('cloudy').innerHTML = weatherData.cloudPercent;
    document.getElementById('wind').innerHTML = weatherData.windSpeed;
    document.querySelector('.today-weather__details-state').innerHTML = weatherData.condition
    document.querySelector('.fixed-data__temp').innerHTML = weatherData.current


    const hourNow = weatherData.hourNow;
    const forecastElements = document.querySelectorAll('.today-weather__forecast-temp')
    const forecastElementCondition = document.querySelectorAll('.today-weather__forecast-what')
    const forecastElementTime = document.querySelectorAll('.today-weather__forecast-time')
    const currentTimeAndDate = document.querySelector('.fixed-data__info-time')
    const weatherForecastImagesElements = document.querySelectorAll('.today-weather__forecast-img')
    const weatherForecast = weatherData.everyThreeHours
    const weatherForecastCondition = weatherData.everyThreeHoursCondition
    const weatherForecastTime = weatherData.weatherForecastTime.map((el) => {
      if (el >= 1 && el <= 9) {
        return `0${el}:${weatherData.minNow}`
      } else {
        return `${el}:${weatherData.minNow}`
      }
    })
    const condition = weatherData.condition;
    const bgImage = document.querySelector('.body__bg')
    const fixDataImage = document.querySelector('.fixed-data__img')
    const night = hourNow >= 21 || hourNow <= 4


    function fixedImageChange() {
      const cond = condition.toLowerCase()
      if (cond.includes('cloudy') || cond.includes('overcast')) {
        fixDataImage.src = "/icons/Broken-Cloudy.svg"
      } else if (cond.includes("mist") || cond.includes('fog')) {
        fixDataImage.src = "/icons/Fog.svg"
      } else if ((cond.includes('rain') || cond.includes('drizzle')) && !cond.includes('thunder') && !cond.includes('heavy')) {
        fixDataImage.src = "/icons/Rain&Sun.svg"
      } else if (cond.includes('heavy') && !cond.includes('snow')) {
        fixDataImage.src = "/icons/Shower-Rain&Sun.svg"
      } else if (cond.includes('snow') || cond.includes('blizzard') || cond.includes('ice') || cond.includes('sleet')) {
        fixDataImage.src = "/icons/Snow.svg"
      } else if (cond.includes('sunny') || cond.includes('clear')) {
        fixDataImage.src = "/icons/Sunny.svg"
      } else if (cond.includes('thunder')) {
        fixDataImage.src = "/icons/Thunderstorm.svg"
      }
    }

    function forecastElementsToggggl() {
      forecastElements.forEach((element, index) => {
        if (weatherForecast[index]) {
          element.innerHTML = weatherForecast[index]
        }
      })
      forecastElementCondition.forEach((element, index) => {
        if (weatherForecastCondition[index]) {
          element.innerHTML = weatherForecastCondition[index]
        }
      })
      forecastElementTime.forEach((element, index) => {
        if (weatherForecastTime[index]) {
          element.innerHTML = weatherForecastTime[index]
        }
      })
      weatherForecastImagesElements.forEach((element, index) => {
        const cond = weatherForecastCondition[index].toLowerCase()
        if (cond.includes('cloudy') || cond.includes('overcast')) {
          element.src = "/icons/Broken-Cloudy.svg"
        } else if (cond.includes("mist") || cond.includes('fog')) {
          element.src = "/icons/Fog.svg"
        } else if ((cond.includes('rain') || cond.includes('drizzle')) && !cond.includes('thunder') && !cond.includes('heavy')) {
          element.src = "/icons/Rain&Sun.svg"
        } else if (cond.includes('heavy') && !cond.includes('snow')) {
          element.src = "/icons/Shower-Rain&Sun.svg"
        } else if (cond.includes('snow') || cond.includes('blizzard') || cond.includes('ice') || cond.includes('sleet')) {
          element.src = "/icons/Snow.svg"
        } else if (cond.includes('sunny') || cond.includes('clear')) {
          element.src = "/icons/Sunny.svg"
        } else if (cond.includes('thunder')) {
          element.src = "/icons/Thunderstorm.svg"
        }
      })
    }

    function changeBg() {
      const cond = condition.toLowerCase();

      if (night && cond.includes('clear')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/night.png")`
      } else if (night && (cond.includes('cloudy') || cond.includes('overcast'))) {
        bgImage.style.backgroundImage = `url("/src/assets/images/cloudNight.png")`
      } else if (cond.includes('sunny') || cond.includes('clear')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/clear.png")`
      } else if (cond.includes("mist") || cond.includes('fog')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/mist.png")`
      } else if (cond.includes('cloudy') || cond.includes('overcast')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/cloudy.png")`
      } else if ((cond.includes('rain') || cond.includes('drizzle')) && !cond.includes('thunder')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/rain.png")`
      } else if (cond.includes('thunder')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/thunderstrom.png")`
      } else if (cond.includes('snow') || cond.includes('blizzard') || cond.includes('ice') || cond.includes('sleet')) {
        bgImage.style.backgroundImage = `url("/src/assets/images/snow.png")`
      }
    }

    function getTimePartsInCity(timeZone) {
      const options = {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'long',
      };

      const formatter = new Intl.DateTimeFormat('en-EN', options);
      const parts = formatter.formatToParts(new Date());

      const result = {};
      parts.forEach(part => {
        if (part.type !== 'literal') {
          result[part.type] = part.value;
        }
      });

      return result;
    }

    function showCurrentTimeAndDate() {
      const timeParts = getTimePartsInCity(weatherData.getTimeZone)

      const day = timeParts.day
      const time = `${timeParts.hour}:${timeParts.minute}`
      const dayOfWeek = timeParts.weekday
      const month = timeParts.month
      const year = timeParts.year.slice(2, 4)


      return currentTimeAndDate.innerHTML = `${time} - ${dayOfWeek}, ${day} ${month} '${year}`
    }

    fixedImageChange()
    forecastElementsToggggl()
    showCurrentTimeAndDate()
    changeBg()

  } catch (error) {
    console.error('Ошибка:', error);
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const citySelect = document.getElementById('citySelect');
  let currentCity = 'Moscow';


  displayWeather(currentCity);
  updateCityName(currentCity);


  citySelect.addEventListener('change', function (event) {
    currentCity = event.target.value;
    updateCityName(currentCity);
    displayWeather(currentCity);
  });


  function updateCityName(city) {
    document.querySelector('.fixed-data__info-city').textContent = city;
  }
});



