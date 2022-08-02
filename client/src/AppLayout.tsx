import { Layout, Menu } from "antd";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC = () => (
  <Layout className="layout" style={{ height: "100vh" }}>
    <Header>
      <div className="logo" />
      {/* TODO: fix key */}
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">
            <span>Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/login">
            <span>Log In</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/signup">
            <span>Register</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: "0 25px" }}>
      <div className="site-layout-content">
        <Routes>
          <Route path="/" />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Vending Machine ©2022 Created by Ivan Vukman
    </Footer>
  </Layout>
);

export default AppLayout;
