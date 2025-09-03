import './Search.scss'
import classNames from 'classnames'

const Search = (props) => {
  const {
    className,
  } = props

  const options = [
    {
      title: 'Search Location...',
      isDisabled: true,
      isSelected: true,
    },
    {
      value: 'Moscow',
      title: 'Москва',
    },
    {
      value: 'London',
      title: 'Лондон',
    },
    {
      value: 'New-york',
      title: 'Нью-йорк',
    },
    {
      value: 'Paris',
      title: 'Париж',
    },
    {
      value: 'Tokyo',
      title: 'Токио',
    },
    {
      value: 'Saint-Petersburg',
      title: 'Санкт-Петербург',
    },
  ]


  return (
    <>
      <form
        className={classNames(className, 'search')}
      >
        <div className="search__wrapper">
          <select
            name="Citys"
            id="citySelect"
            className="search__container"
          >
            {options.map(({title, value, isDisabled, isSelected}, index) => (
              <option
                className='search__item'
                value={value}
                key={index}
                disabled={isDisabled}
                selected={isSelected}

              >{title}</option>
            ))}
          </select>
        </div>
      </form>
    </>
  )
}

export default Search