import './TodayWeather.scss'
import classNames from 'classnames'

const TodayWeather = (props) => {
  const {
    className,
  } = props

  const todayWeather = [
    {
      title: 'Temp max',
      src: 'hot.svg',
      id: 'max-temp'

    },
    {
      title: 'Temp min',
      src: 'cold.svg',
      id: 'min-temp',

    },
    {
      title: 'Humadity',
      src: 'humadity.svg',
      id: 'humadity',

    },
    {
      title: 'Cloudy',
      src: 'cloud.svg',
      id: 'cloudy',

    },
    {
      title: 'Wind',
      src: 'wind.svg',
      id: 'wind',

    },
  ]
  const weatherForecast = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ];

  return (
    <div className="today-weather">
      <p className="today-weather__params-header">Weather Details...</p>
      <div className="today-weather__params">

        <div className="today-weather__details">
          <p className="today-weather__details-state">thunderstorm with light drizzle</p>
          <ul className="today-weather__details-list">
            {todayWeather.map(({title, number, src, id}, index) => (
              <li
                className={classNames('today-weather__details-item')}
                key={index}
              >
                <p className="today-weather__details-title">{title}</p>
                <div className='today-weather__details-metrix'>
                  <p className="today-weather__details-weather" id={id}>
                    {number}
                  </p>
                  <img
                    className='today-weather__details-img'
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="today-weather__forecast">
        <p className="today-weather__forecast-title">Today’s Weather Forecast...</p>
        <ul className="today-weather__forecast-list">
          {weatherForecast.map((index) => (
            <li className="today-weather__forecast-item" key={index}>
              <div className="today-weather__forecast-body">
                <img
                  className='today-weather__forecast-img'
                  src=''
                  alt=""
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div className="today-weather__forecast-params">
                  <p className="today-weather__forecast-time"></p>
                  <p className="today-weather__forecast-what"></p>
                </div>
              </div>
              <div className="today-weather__forecast-weather">
                <p className="today-weather__forecast-temp"></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TodayWeather