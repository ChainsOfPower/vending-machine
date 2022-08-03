import { Content } from "antd/lib/layout/layout";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProductsListPage from "../pages/ProductsListPage";
import SignupPage from "../pages/SignupPage";
import AuthContext from "../store/auth-context";

const LayoutContent: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Content style={{ padding: "0 25px" }}>
      <div className="site-layout-content">
        <Routes>
          {isLoggedIn && (
            <Route path="/products" element={<ProductsListPage />} />
          )}
          {!isLoggedIn && (
            <>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </>
          )}
          {/* TODO 3 redirects based on auth state */}
          {!isLoggedIn && <Route path="*" element={<Navigate to={"/login"} />} />}
          {isLoggedIn && <Route path="*" element={<Navigate to={"/products"} />} />}
        </Routes>
      </div>
    </Content>
  );
};

export default LayoutContent;
