import './Body.scss'
import classNames from 'classnames'
import FixedData from "../../components/FixedData";
import WeekWeather from "../../components/WeekWeather";
import clearImage from '@/assets/images/clear.png';
import Header from "@/layouts/Header";


const Body = (props) => {
  const {
    className,
  } = props

  return (
    <>
      <main className="body">
        <div className="body__bg"></div>
        <Header/>
        <div className="body__inner container">
          <FixedData className='body__fixed' />
          <WeekWeather className='body__forecast' />
        </div>
      </main>
    </>
  )
}

export default Body