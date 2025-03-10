import React from 'react'
import { useParams } from 'react-router-dom'

const Singlebook = () => {
const {id} = useParams()
    return (
    <div>
      {id}
    </div>
  )
}

export default Singlebook
