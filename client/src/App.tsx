import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import LayoutHeader from "./components/LayoutHeader";
import LoginPage from "./pages/LoginPage";
import ProductsListPage from "./pages/ProductsListPage";
import SignupPage from "./pages/SignupPage";

const {Content, Footer } = Layout;

const App: React.FC = () => {

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <LayoutHeader/>
      <Content style={{ padding: "0 25px" }}>
        <div className="site-layout-content">
          <Routes>
            <Route path="/products" element={<ProductsListPage/>} />
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
};

export default App;
