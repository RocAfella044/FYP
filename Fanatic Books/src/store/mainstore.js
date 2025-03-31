import {configureStore} from '@reduxjs/toolkit'
import SearchSlice from './slice/searchSlice'
const mainstore = configureStore({
    reducer: {
        SearchSlice
    }
})  
export default mainstore