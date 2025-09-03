import './FixedData.scss'
import classNames from 'classnames'

const FixedData = (props) => {
  const {
    className,
  } = props

  return (
    <div
      className={classNames(className, 'fixed-data')}
    >
      <div className="fixed-data__temp">16</div>
      <div className="fixed-data__info">
        <div className="fixed-data__info-city">Moscow</div>
        <div className="fixed-data__info-time">
          06:09 - Monday, 9 Sep ‘23
        </div>
      </div>
      <img
        className='fixed-data__img'
        src="/cloud.svg"
        alt=""
        width="70"
        height="70"
        loading="lazy"
      />
    </div>
  )
}

export default FixedData