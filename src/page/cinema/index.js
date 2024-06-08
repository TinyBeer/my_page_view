import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SunOutlined,
  TeamOutlined,
  MoonOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  ConfigProvider,
  Button,
  Layout,
  Menu,
  theme,
  Alert,
  Switch,
  Space,
} from 'antd';
import { Outlet, useNavigate } from 'react-router';
const { Header, Sider, Content } = Layout;
const App = () => {
  const [blackMode, setBlackMode] = useState(true);
  const [alertObj, setalertObj] = useState({ type: 'info', message: 'hello' });
  const [alertVisable, setalertVisable] = useState(false);
  // 默认折叠
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleAlertClose = () => {
    setalertVisable(false);
  };
  const shiftBlackMode = (checked) => {
    setBlackMode(checked);
  };
  const displayAlert = (type, message) => {
    setalertVisable(true);
    setalertObj({ type, message });
  };
  const navigate = useNavigate();
  return (
    <ConfigProvider
      theme={{
        // 1. 单独使用暗色算法
        algorithm: blackMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        // 2. 组合使用暗色算法与紧凑算法
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <Layout>
        <Sider
          collapsedWidth='60'
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme={blackMode ? 'dark' : 'light'}
        >
          <div className='demo-logo-vertical' />
          <Space style={{ margin: '10px 0px auto 5px' }}>
            {
              <Switch
                onChange={shiftBlackMode}
                defaultChecked={blackMode}
                unCheckedChildren={<SunOutlined />}
                checkedChildren={<MoonOutlined />}
              />
            }
          </Space>
          <Menu
            theme={blackMode ? 'dark' : 'light'}
            mode='inline'
            defaultSelectedKeys={['1']}
            onClick={({ key }) => navigate('/' + key)}
            items={[
              {
                key: 'cinema/video',
                icon: <VideoCameraOutlined />,
                label: 'viedeo',
              },
              {
                key: 'cinema/upload',
                icon: <UploadOutlined />,
                label: 'upload',
              },
              {
                key: 'ceinema/share',
                icon: <TeamOutlined />,
                label: 'share',
              },
              {
                key: 'cinema/personal_center',
                icon: <UserOutlined />,
                label: 'personal center',
              },
              {
                key: 'nav',
                icon: <ArrowLeftOutlined />,
                label: 'back nav',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            theme={blackMode && 'dark'}
            style={{
              padding: 0,
              // background: colorBgContainer,
              background: blackMode ? '#000' : '#fff',
            }}
          >
            {alertVisable && (
              <Alert
                type={alertObj.type}
                message={alertObj.message}
                banner
                closable
                afterClose={handleAlertClose}
              />
            )}
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: blackMode ? '#000' : '#fff',
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
            {/* <Video displayAlert={displayAlert} /> */}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default App;
