import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

const apiUrl = process.env.REACT_APP_API_URL;
const memoStore = createSlice({
  name: 'memo',
  initialState: {
    memoList: [],
  },
  reducers: {
    setMemoList(state, action) {
      state.memoList = action.payload;
    },
    completeMemo(state, action) {
      const items = state.memoList;
      let item = _.find(items, { id: action.payload });
      if (item) {
        item.completed = true;
        state.memoList = items;
      }
    },
    removeFromList(state, action) {
      state.memoList = _.filter(
        state.memoList,
        (item) => item.id !== action.payload
      );
    },
  },
});

const { setMemoList, removeFromList, completeMemo } = memoStore.actions;

const createInstance = () => {
  const access_token = localStorage.getItem('access_token');
  return axios.create({
    baseURL: apiUrl,
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: access_token,
    },
  });
};

function createMemo(content, success, failed) {
  return (dispatch) => {
    createInstance()
      .post('/memo/create', JSON.stringify({ content }))
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('add memo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function completeMemoWithId(id, success, failed) {
  return (dispatch) => {
    createInstance()
      .put('/memo/complete', JSON.stringify({ id }))
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          dispatch(completeMemo(id));
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('complete memo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function removeMemoById(id, success, failed) {
  return (dispatch) => {
    // axios默认不支持delete带body
    const access_token = localStorage.getItem('access_token');
    const data = JSON.stringify({ id });
    axios
      .create({
        baseURL: apiUrl,
        timeout: 1000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: access_token,
        },
      })
      .delete('/memo/delete', { data })
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          dispatch(removeFromList(id));
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('delete memo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function fetchMemoList(success, failed) {
  return (dispatch) => {
    createInstance()
      .get('/memo/list')
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          dispatch(setMemoList(data.memoes));
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('list memo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

const reducer = memoStore.reducer;

export { fetchMemoList, removeMemoById, createMemo, completeMemoWithId };
export default reducer;
