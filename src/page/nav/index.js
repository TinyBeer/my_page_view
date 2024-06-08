import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import '../../css/nav.css';
import '../../css/reset.css';
import { refreshToken } from '../../store/module/tokenStore';

export default function Nav() {
  const [menuActive, setmenuActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const run = async () => {
      refreshToken(
        () => {
          setmenuActive(true);
        },
        (err) => {
          navigate('/login');
        }
      );
    };

    run();
  }, []);
  const handleClick = () => {
    setmenuActive((pre) => !pre);
  };
  const logout = () => {
    const userResponse = window.confirm('你确定要注销吗？');
    if (userResponse) {
      console.log('用户点击了确定。');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } else {
      console.log('用户点击了取消。');
    }
  };
  const arr = [
    {
      style: { '--clr': '#ff2972' },
      link: '#',
      icon: <ion-icon name='home-outline'></ion-icon>,
    },
    {
      style: { '--clr': '#fee800' },
      link: '/memo',
      icon: <ion-icon name='document-outline'></ion-icon>,
    },
    {
      style: { '--clr': '#04fc43' },
      link: '#',
      icon: <ion-icon name='settings-outline'></ion-icon>,
    },
    {
      style: { '--clr': '#fe00f1' },
      link: '#',
      icon: <ion-icon name='image-outline'></ion-icon>,
    },
    {
      style: { '--clr': '#00b0fe' },
      link: '/game',
      icon: <ion-icon name='game-controller-outline'></ion-icon>,
    },
    {
      style: { '--clr': '#fea600' },
      link: '/cinema',
      icon: <ion-icon name='videocam-outline'></ion-icon>,
    },
    {
      logout: true,
      style: { '--clr': '#a529ff' },
      link: '#',
      icon: <ion-icon name='person-outline'></ion-icon>,
    },
    {
      style: { '--clr': '#01bdab' },
      link: '#',
      icon: <ion-icon name='camera-outline'></ion-icon>,
    },
  ];

  return (
    <div className='nav-container'>
      <ul className={menuActive ? 'menu active' : 'menu'}>
        <div onClick={handleClick} className='menuToggle'>
          <ion-icon name='add-outline'></ion-icon>
        </div>
        {arr.map((item, idx) => {
          if (item.logout) {
            return (
              <li onClick={logout} style={{ '--i': idx, ...item.style }}>
                <a href={item.link}>{item.icon}</a>
              </li>
            );
          }

          return (
            <li style={{ '--i': idx, ...item.style }}>
              <Link to={item.link}>{item.icon}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
