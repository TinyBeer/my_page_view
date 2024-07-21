import { configureStore } from '@reduxjs/toolkit';
import tockenReducer from './module/tokenStore';
import todoReducer from './module/todoStore';
import cinemaReducer from './module/cinemaStore';

const store = configureStore({
  reducer: {
    token: tockenReducer,
    todo: todoReducer,
    cinema: cinemaReducer,
  },
});

export default store;
