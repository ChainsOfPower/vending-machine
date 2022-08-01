import { Breadcrumb, Layout, Menu } from 'antd';
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC = () => (
  <Layout className='layout'>
    <Header>
      <div className='logo' />
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['2']}>
            <Menu.Item key='1'>
              <Link to='/'>
                <span>Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='2'>
              <Link to='/login'>
                <span>Log In</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='3'>
              <Link to='/register'>
                <span>Register</span>
              </Link>
            </Menu.Item>
        </Menu>
    </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className='site-layout-content'>
          <Routes>
            <Route path='/'/>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='register' element={<RegisterPage/>}/>
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Vending Machine ©2022 Created by Ivan Vukman</Footer>
  </Layout>
);

export default AppLayout;