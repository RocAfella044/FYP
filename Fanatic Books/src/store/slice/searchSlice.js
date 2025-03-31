import {createSlice} from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    isSearchPageOn: false,
  },
  reducers: {
    openSearchPage: (state) => {
      state.isSearchPageOn = true
    },
    closeSearchPage: (state) => {
      state.isSearchPageOn = false
    },

  
  },
})

export const {openSearchPage, closeSearchPage} =
  searchSlice.actions
export default searchSlice.reducer