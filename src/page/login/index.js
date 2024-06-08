import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import './css/login.css';
import '../../css/reset.css';
import { login } from '../../store/module/tokenStore';
import { useDispatch } from 'react-redux';

export default function LoginModal() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loginCred, setloginCred] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setloginCred({ ...loginCred, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setloginCred({ username: '', password: '' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  const handleLogin = async (e) => {
    dispatch(
      login(
        loginCred.username,
        loginCred.password,
        () => navigate('/'),
        (error) =>
          messageApi.open({
            type: 'error',
            content: error.message,
          })
      )
    );
  };

  return (
    <div id='login_modal' class='login_modal'>
      {contextHolder}
      <div class='modal_content'>
        <form>
          <div>
            <input
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              type='text'
              id='username'
              name='username'
              placeholder='username'
              value={loginCred.username}
            />
            <br />
          </div>
          <div>
            <input
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              type='password'
              id='password'
              name='password'
              placeholder='password'
              value={loginCred.password}
            />
            <br />
          </div>

          <div class='btn_container'>
            <div
              onClick={handleLogin}
              style={{ '--clr': '#04fc43' }}
              class='button'
            >
              <ion-icon id='ok' name='checkmark-outline'></ion-icon>
            </div>
            <div
              onClick={handleCancel}
              style={{ '--clr': '#ff2972' }}
              class='button'
            >
              <ion-icon id='close' name='close-outline'></ion-icon>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
