import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
const tokenStore = createSlice({
  name: 'token',
  initialState: {
    loginStatus: false,
    accessToken: localStorage.getItem('access_token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
  },
  reducers: {
    setLoginStatus(state, action) {
      state.loginStatus = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem('access_token', action.payload);
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
      localStorage.setItem('refresh_token', action.payload);
    },
  },
});

const { setLoginStatus, setAccessToken, setRefreshToken } = tokenStore.actions;

const instance = axios.create({
  baseURL: 'http://127.0.0.1:9999',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

const login = (username, password, success, failed) => {
  return (dispatch) => {
    // 发起POST请求
    instance
      .post(
        '/user/login',
        JSON.stringify({
          // 将登录信息转换为JSON字符串
          username,
          password,
        })
      )
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          dispatch(setLoginStatus(true));
          dispatch(setAccessToken(data.access_token));
          dispatch(setRefreshToken(data.refresh_token));
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        if (failed) {
          failed(error);
        }
      });
  };
};

const refreshToken = async (success, failed) => {
  const token = localStorage.getItem('refresh_token');
  if (!token) {
    failed(new Error('no refresh token'));
    return;
  }
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:9999',
    timeout: 1000,
    headers: { Authorization: token },
  });

  await instance
    .post('/user/refresh')
    .then((res) => {
      if (res.status === 200) {
        setLoginStatus(true);
        localStorage.setItem('access_token', res.data);
        if (success) {
          success();
        }
      } else {
        throw new Error('认证失败');
      }
    })
    .catch((error) => {
      if (failed) {
        failed(error);
      } else console.log(error);
    });
};

const reducer = tokenStore.reducer;
export { login, refreshToken };
export default reducer;
