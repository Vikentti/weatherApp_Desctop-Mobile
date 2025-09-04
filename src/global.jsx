import '@/styles'
import {Head} from "minista";
import FixedData from "./components/FixedData";
import Body from "./layouts/Body";
import Header from "@/layouts/Header";

export default function (props) {

  const {
    children,
    title,
    url,
  } = props

  return (
    <>
      <Head htmlAttributes={{lang: 'en'}}>
        <title>Weather</title>
        <script src='/src/main.js' type='module'></script>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="/site.webmanifest"
        />


      </Head>

      <Body />
    </>
  )
}