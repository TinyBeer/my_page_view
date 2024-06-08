import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // EditOutlined,
  // BgColorsOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Input, Layout, Card, Row, Col, notification } from 'antd';
import { refreshToken } from '../../store/module/tokenStore';
import { useDispatch, useSelector } from 'react-redux';
import {
  createMemo,
  fetchMemoList,
  removeMemoById,
} from '../../store/module/memoStore';
import './css/memo.css';
const { Meta } = Card;
const { Header, Content } = Layout;

export default function App() {
  const [refresh, setRefresh] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    const run = async () => {
      if (!loginStatus) {
        await refreshToken(
          () => setLoginStatus(true),
          () => navigate('/login')
        );
      }
      dispatch(fetchMemoList());
      return () => {};
    };

    run();
  }, [dispatch, refresh]);

  const memoList = useSelector((state) => state.memo.memoList);
  const onChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (memoList.length >= 4) {
        api.info({
          message: `已近这么多了，快要装不下了`,
          description: '',
          placement: 'top',
          duration: 2,
        });
        return;
      }

      dispatch(
        createMemo(e.target.value, () => {
          setInputValue('');
          setRefresh((pre) => !pre);
        })
      );
    }
  };
  return (
    <Layout>
      {contextHolder}
      <Header
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Input
          value={inputValue}
          style={{ minWidth: '240px', width: '50%' }}
          showCount
          maxLength={20}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder='想要做点啥？'
        />
      </Header>
      <Content style={{ padding: '0 48px', margin: '24px 16px' }}>
        <Row gutter={24}>
          {Array.isArray(memoList) &&
            memoList.slice(0, 4).map((item, index) => {
              const key = `${item.id}`;
              return (
                <Col
                  style={{ margin: '4px 8px 20px 8px' }}
                  key={key}
                  xs={{
                    flex: '100%',
                  }}
                  sm={{
                    flex: '50%',
                  }}
                  md={{
                    flex: '40%',
                  }}
                  lg={{
                    flex: '20%',
                  }}
                  xl={{
                    flex: '10%',
                  }}
                >
                  <Card
                    style={{
                      width: 240,
                      padding: '8 0',
                    }}
                    hoverable='true'
                    size='small'
                    cover={
                      <img
                        height={240}
                        width={240}
                        style={{
                          'clip-path':
                            'polygon(15% 15%, 85% 15%, 85% 85%, 15% 85%)',
                        }}
                        alt='example'
                        src={
                          'http://127.0.0.1:9999/static/img/memo/' +
                          (item.id % 8) +
                          '.png'
                        }
                      />
                    }
                    actions={[
                      <DeleteOutlined
                        key='delete'
                        onClick={() => dispatch(removeMemoById(item.id))}
                      />,
                      // <EditOutlined key='edit' />,
                      // <BgColorsOutlined
                      //   key='pic'
                      //   onClick={() => navigate('/nav')}
                      // />,
                    ]}
                  >
                    <Meta title={item.content} />
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Content>
    </Layout>
  );
}
