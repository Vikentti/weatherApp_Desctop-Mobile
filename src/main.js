import fogIcon from '@/assets/icons/Fog.svg'
import brokenCloudyIcon from '@/assets/icons/Broken-Cloudy.svg'
import rainSunIcon from '@/assets/icons/Rain&Sun.svg'
import showerRainIcon from '@/assets/icons/Shower-Rain&Sun.svg'
import snowIcon from '@/assets/icons/Snow.svg'
import thunderIcon from '@/assets/icons/Thunderstorm.svg'
import sunnyIcon from '@/assets/icons/Sunny.svg'

import clearBg from '@/assets/images/clear.png'
import cloudNightBg from '@/assets/images/cloudNight.png'
import cloudBg from '@/assets/images/cloudy.png'
import mistBg from '@/assets/images/mist.png'
import nightBg from '@/assets/images/night.png'
import rainBg from '@/assets/images/rain.png'
import snowBg from '@/assets/images/snow.png'
import thunderBg from '@/assets/images/thunderstrom.png'



const WEATHER_API_KEY = '43e478e4b6fc474ab08164231252508';
const BASE_URL = 'https://api.weatherapi.com/v1';


const domElements = {
  maxTemp: document.getElementById('max-temp'),
  minTemp: document.getElementById('min-temp'),
  humidity: document.getElementById('humadity'),
  cloudy: document.getElementById('cloudy'),
  wind: document.getElementById('wind'),
  condition: document.querySelector('.today-weather__details-state'),
  currentTemp: document.querySelector('.fixed-data__temp'),
  cityName: document.querySelector('.fixed-data__info-city'),
  currentTime: document.querySelector('.fixed-data__info-time'),
  bgImage: document.querySelector('.body__bg'),
  fixDataImage: document.querySelector('.fixed-data__img'),
  forecastTemp: document.querySelectorAll('.today-weather__forecast-temp'),
  forecastCondition: document.querySelectorAll('.today-weather__forecast-what'),
  forecastTime: document.querySelectorAll('.today-weather__forecast-time'),
  forecastImages: document.querySelectorAll('.today-weather__forecast-img')
};


const weatherIcons = {
  cloudy: brokenCloudyIcon,
  mist: fogIcon,
  fog: fogIcon,
  rain: rainSunIcon,
  drizzle: rainSunIcon,
  heavy: showerRainIcon,
  snow: snowIcon,
  sunny: sunnyIcon,
  clear: sunnyIcon,
  thunder: thunderIcon
};


const weatherBackgrounds = {
  clear: clearBg,
  cloudNight: cloudNightBg,
  cloudy: cloudBg,
  mist: mistBg,
  night: nightBg,
  rain: rainBg,
  snow: snowBg,
  thunder: thunderBg
};


const isNight = (hour) => hour >= 21 || hour <= 4;

const formatTime = (hour, minute) => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const getWeatherIcon = (condition) => {
  const cond = condition.toLowerCase();

  if (cond.includes('cloudy') || cond.includes('overcast')) return weatherIcons.cloudy;
  if (cond.includes('mist') || cond.includes('fog')) return weatherIcons.mist;
  if ((cond.includes('rain') || cond.includes('drizzle')) && !cond.includes('thunder')) return weatherIcons.rain;
  if (cond.includes('heavy') && !cond.includes('snow')) return weatherIcons.heavy;
  if (cond.includes('snow') || cond.includes('blizzard') || cond.includes('ice')) return weatherIcons.snow;
  if (cond.includes('thunder')) return weatherIcons.thunder;
  if (cond.includes('sunny') || cond.includes('clear')) return weatherIcons.clear;

  return sunnyIcon;
};

const getWeatherBackground = (condition, isNight) => {
  const cond = condition.toLowerCase();

  if (isNight && cond.includes('clear')) return weatherBackgrounds.night;
  if (isNight && (cond.includes('cloudy') || cond.includes('overcast'))) return weatherBackgrounds.cloudNight;
  if (cond.includes('sunny') || cond.includes('clear')) return weatherBackgrounds.clear;
  if (cond.includes('mist') || cond.includes('fog')) return weatherBackgrounds.mist;
  if (cond.includes('cloudy') || cond.includes('overcast')) return weatherBackgrounds.cloudy;
  if ((cond.includes('rain') || cond.includes('drizzle')) && !cond.includes('thunder')) return weatherBackgrounds.rain;
  if (cond.includes('thunder')) return weatherBackgrounds.thunder;
  if (cond.includes('snow') || cond.includes('blizzard') || cond.includes('ice')) return weatherBackgrounds.snow;

  return clearBg;
};


async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=2&aqi=no`
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const current = data.current;
    const forecast = data.forecast.forecastday[0];
    const location = data.location;


    const hourlyForecast = getHourlyForecast(data.forecast.forecastday, location.localtime);

    return {
      current: {
        temp: `${current.temp_c}°`,
        humidity: `${current.humidity}%`,
        cloud: `${current.cloud}%`,
        wind: `${current.wind_kph} km/h`,
        condition: current.condition.text
      },
      today: {
        maxTemp: forecast.day.maxtemp_c,
        minTemp: forecast.day.mintemp_c
      },
      location: {
        name: location.name,
        timezone: location.tz_id,
        localtime: location.localtime
      },
      hourlyForecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

function getHourlyForecast(forecastDays, localtime) {
  const now = new Date(localtime);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const hourlyData = [];


  const allHours = [
    ...forecastDays[0].hour,
    ...(forecastDays[1] ? forecastDays[1].hour : [])
  ];


  const currentHourIndex = allHours.findIndex(hour => {
    const hourTime = new Date(hour.time);
    return hourTime.getHours() === currentHour;
  });

  for (let i = 0; i < 8; i++) {
    const index = currentHourIndex + 3 * (i + 1);
    if (index >= allHours.length) break;

    const hourData = allHours[index];
    const time = new Date(hourData.time);

    hourlyData.push({
      time: formatTime(time.getHours(), currentMinute),
      temp: hourData.temp_c,
      condition: hourData.condition.text
    });
  }

  return hourlyData;
}

async function displayWeather(city) {
  try {
    const weatherData = await fetchWeatherData(city);


    domElements.maxTemp.textContent = weatherData.today.maxTemp;
    domElements.minTemp.textContent = weatherData.today.minTemp;
    domElements.humidity.textContent = weatherData.current.humidity;
    domElements.cloudy.textContent = weatherData.current.cloud;
    domElements.wind.textContent = weatherData.current.wind;
    domElements.condition.textContent = weatherData.current.condition;
    domElements.currentTemp.textContent = weatherData.current.temp;
    domElements.cityName.textContent = weatherData.location.name;


    updateCurrentTime(weatherData.location.localtime);


    const isNightTime = isNight(new Date(weatherData.location.localtime).getHours());
    domElements.fixDataImage.src = getWeatherIcon(weatherData.current.condition);
    domElements.bgImage.style.backgroundImage = `url(${getWeatherBackground(weatherData.current.condition, isNightTime)})`;


    updateHourlyForecast(weatherData.hourlyForecast);

  } catch (error) {
    console.error('Error displaying weather:', error);

  }
}

function updateCurrentTime(localtime) {
  const date = new Date(localtime);
  const options = {
    weekday: 'long',
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  domElements.currentTime.textContent = date.toLocaleDateString('en-EN', options);
}

function updateHourlyForecast(hourlyForecast) {
  hourlyForecast.forEach((hour, index) => {
    if (domElements.forecastTemp[index]) {
      domElements.forecastTemp[index].textContent = hour.temp;
    }

    if (domElements.forecastCondition[index]) {
      domElements.forecastCondition[index].textContent = hour.condition;
    }

    if (domElements.forecastTime[index]) {
      domElements.forecastTime[index].textContent = hour.time;
    }

    if (domElements.forecastImages[index]) {
      domElements.forecastImages[index].src = getWeatherIcon(hour.condition);
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {
  let currentCity = 'Moscow';


  const citySelect = document.getElementById('citySelect');


  let timeoutId;
  citySelect.addEventListener('change', function(event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      currentCity = event.target.value;
      displayWeather(currentCity);
    }, 300);
  });


  displayWeather(currentCity);
});