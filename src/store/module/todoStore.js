import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

const apiUrl = process.env.REACT_APP_API_URL;
const todoStore = createSlice({
  name: 'todo',
  initialState: {
    todoList: [],
  },
  reducers: {
    setTodoList(state, action) {
      state.todoList = action.payload;
    },
    completeTodo(state, action) {
      const items = state.todoList;
      let item = _.find(items, { id: action.payload });
      if (item) {
        item.completed = true;
        state.todoList = items;
      }
    },
    removeFromList(state, action) {
      state.todoList = _.filter(
        state.todoList,
        (item) => item.id !== action.payload
      );
    },
  },
});

const { setTodoList, removeFromList, completeTodo } = todoStore.actions;

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

function createTodo(content, success, failed) {
  return (dispatch) => {
    createInstance()
      .post('/todo', JSON.stringify({ content }))
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
        console.error('add todo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function completeTodoWithId(id, success, failed) {
  return (dispatch) => {
    createInstance()
      .put('/todo', JSON.stringify({ id }))
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          dispatch(completeTodo(id));
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('complete todo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function removeTodoById(id, success, failed) {
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
      .delete('/todo', { data })
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
        console.error('delete todo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

function fetchTodoList(success, failed) {
  return (dispatch) => {
    createInstance()
      .get('/todo')
      .then((res) => res.data)
      .then((data) => {
        if (data.status === 'ok') {
          dispatch(setTodoList(data.data));
          if (success) {
            success();
          }
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('list todo error:', error);
        if (failed) {
          failed();
        }
      });
  };
}

const reducer = todoStore.reducer;

export { fetchTodoList, removeTodoById, createTodo, completeTodoWithId };
export default reducer;
