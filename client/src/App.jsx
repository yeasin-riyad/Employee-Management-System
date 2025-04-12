import { Outlet } from 'react-router-dom'
import GlobalContextProvider from './provider/GlobalContextProvider';


const App = () => {
  
  return (
    <GlobalContextProvider>
      <div className="">
      <Outlet/>
    </div>
    </GlobalContextProvider>
  )
}

export default App
