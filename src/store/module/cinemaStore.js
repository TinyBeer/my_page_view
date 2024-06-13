import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const cinemaStore = createSlice({
  name: 'cinema',
  initialState: {
    videoList: [],
  },
  reducers: {
    setVideoList(state, action) {
      state.videoList = action.payload;
    },
  },
});
const { setVideoList } = cinemaStore.actions;
const apiUrl = process.env.REACT_APP_API_URL;

function fetchVideoList(success, failed) {
  return async (dispatch) => {
    const access_token = localStorage.getItem('access_token');
    const instance = axios.create({
      baseURL: apiUrl,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token,
      },
    });
    instance
      .get('/movie/list')
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          if (success) {
            dispatch(setVideoList(data.movies));
            success();
          } else {
            throw new Error(data.message);
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('list video error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function createMovie(post, source, title, desc, success, failed) {
  return async (dispatch) => {
    const access_token = localStorage.getItem('access_token');
    const instance = axios.create({
      baseURL: apiUrl,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token,
      },
    });
    instance
      .post('/movie/create', JSON.stringify({ post, source, title, desc }))
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data.status === 'ok') {
          if (success) {
            success();
          } else {
            throw new Error(data.message);
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('create video error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

const reducer = cinemaStore.reducer;
export { fetchVideoList, createMovie };
export default reducer;
