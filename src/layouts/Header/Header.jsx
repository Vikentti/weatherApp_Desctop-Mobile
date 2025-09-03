import './Header.scss'
import classNames from 'classnames'
import Search from "@/components/Search";

const Header = (props) => {
  const {
    className,
  } = props

  return (
    <header
      className='container header'
    >
      <Search />

    </header>
  )
}

export default Header