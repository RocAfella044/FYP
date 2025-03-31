import React from 'react'
import { useParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const Search = () => {
const [searchParam] = useSearchParams();
const query = searchParam.get('search');

    return (
    <div>
      {query}
    </div>
  )
}

export default Search
