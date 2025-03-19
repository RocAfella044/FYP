import React from 'react'
import {Link} from 'react-router-dom'
const Bookcard = ({book}) => {
  return (
    <Link to={`/book/${book.id}`}>
      <div
        key={book.id}
        className="w-60 bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform"
      >
        <img
          src={
            book.book_image && book.book_image.startsWith('http')
              ? book.book_image
              : `http://127.0.0.1:8000${book.book_image}`
          }
          alt={book.book_name}
          className="w-full h-60 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-700">{book.book_name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2"> {book.book_desc}</p>

        

          {/* Display Book Price */}
          {book.book_price !== null && (
            <p className="text-sm text-purple-700 font-semibold mt-2">
              Price: NPR {book.book_price}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Bookcard
