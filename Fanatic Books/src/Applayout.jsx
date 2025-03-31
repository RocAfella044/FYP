import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import { useSelector } from 'react-redux'
import SearchPage from './Pages/Search'


const Applayout = () => {
 const isSearched = useSelector((store) => store.SearchSlice.isSearchPageOn);
  return (
    <div>
      <Navbar />

      {isSearched ? <SearchPage /> : <Outlet />}
      <Footer />
    </div>
  );
}

export default Applayout
