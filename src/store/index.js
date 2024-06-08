import { configureStore } from '@reduxjs/toolkit';
import tockenReducer from './module/tokenStore';
import memoReducer from './module/memoStore';
import cinemaReducer from './module/cinemaStore';

const store = configureStore({
  reducer: {
    token: tockenReducer,
    memo: memoReducer,
    cinema: cinemaReducer,
  },
});

export default store;
