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

function fetchVideoList(success, failed) {
  return async (dispatch) => {
    const access_token = localStorage.getItem('access_token');
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:9999',
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token,
      },
    });
    instance
      .get('/video/list')
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'success') {
          if (success) {
            dispatch(setVideoList(data.videoes));
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

const reducer = cinemaStore.reducer;
export { fetchVideoList };
export default reducer;
