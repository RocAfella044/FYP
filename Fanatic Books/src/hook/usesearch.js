import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const useSearch = (searchQuery) => {
  const [searchResult, setSearchResult] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
     
        fetchSearchResult()
      
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])
  const fetchSearchResult = async () => {
    try {
      const response = await fetch(
      )
      if (!response.ok) {
        navigate('/error')
      }
      const data = await response.json()
      setSearchResult(data.results)
    } catch (error) {
      navigate('/error')
    }
  }
  return searchResult
}
export default useSearch
