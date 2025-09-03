import './WeekWeather.scss'
import classNames from 'classnames'
import Search from "@/components/Search";
import TodayWeather from "@/components/TodayWeather";

const WeekWeather = (props) => {
  const {
    className,
  } = props


  return (
    <div className={classNames(className, 'week-weather')}>
      <TodayWeather />
    </div>
  )
}

export default WeekWeather