import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Skeleton, Image } from 'antd';
import { refreshToken } from '../../store/module/tokenStore';
import { useNavigate } from 'react-router';
import { fetchVideoList } from '../../store/module/cinemaStore';

const apiUrl = process.env.REACT_APP_API_URL;

export default function App({ displayAlert }) {
  const [loginStatus, setLoginStatus] = useState(false);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loginStatus) {
      refreshToken(
        () => setLoginStatus(true),
        () => navigate('/login')
      );
    }

    const run = async () => {
      dispatch(
        fetchVideoList(
          () => setloading(false),
          () => navigate('/login')
        )
      );
    };
    run();
  }, [dispatch]);

  const videoList = useSelector((state) => state.cinema.videoList);
  console.log(videoList);
  return (
    <Row
      gutter={{
        xs: 8,
        sm: 16,
        md: 24,
        lg: 32,
      }}
    >
      {videoList &&
        videoList.length > 0 &&
        videoList.slice(0, 4).map((item, index) => {
          const key = `col-${index}`;
          return (
            <Col
              key={key}
              xs={{
                flex: '40%',
              }}
              sm={{
                flex: '35%',
              }}
              md={{
                flex: '32%',
              }}
              lg={{
                flex: '30%',
              }}
              xl={{
                flex: '25%',
              }}
            >
              <div
                style={{
                  // padding: '5px',
                  height: 240,
                  border: '2px solid lightgray',
                  marginBottom: '10px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#e8e8e8',
                }}
              >
                {loading ? (
                  <div>
                    <Skeleton.Image loading active />
                    <Skeleton
                      active={true}
                      paragraph={{
                        rows: 1,
                      }}
                    ></Skeleton>
                  </div>
                ) : (
                  <Image
                    style={{
                      backgroundColor: 'transparent',
                      height: '100%',
                      boxSizing: 'border-box',
                      clipPath:
                        'polygon(0% 20%, 0% 0%, 100% 0%, 100% 20%, 50% 40% )',
                    }}
                    preview={{
                      destroyOnClose: true,
                      imageRender: () => (
                        <video
                          // muted
                          width='80%'
                          controls
                          src={apiUrl + '/static/video/movie/' + item.name}
                        />
                      ),
                      toolbarRender: () => null,
                    }}
                    src={apiUrl + `/static/img/` + item.image}
                  />
                )}
                <span
                  style={{
                    position: 'absolute',
                    top: '65%',
                    fontSize: '24px',
                    left: '100px',
                    color: 'blue',
                  }}
                >
                  {item.title}
                </span>
              </div>
            </Col>
          );
        })}
    </Row>
  );
}
