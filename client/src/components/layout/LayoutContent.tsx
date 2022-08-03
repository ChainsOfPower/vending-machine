import { Content } from "antd/lib/layout/layout";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BuyProductPage from "../../pages/buyer/BuyProductPage";
import DepositCoinsPage from "../../pages/buyer/DepositCoinsPage";
import LoginPage from "../../pages/auth/LoginPage";
import ProductsListPage from "../../pages/buyer/ProductsListPage";
import AuthContext from "../../store/auth-context";
import SignupPage from "../../pages/auth/SignupPage";

const LayoutContent: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const isBuyer = authCtx.isBuyer;

  return (
    <Content style={{ padding: "0 25px" }}>
      <div className="site-layout-content">
        <Routes>
          {isBuyer && (
            <>
              <Route path="/products" element={<ProductsListPage />} />
              <Route path="/buy-product/:productId" element={<BuyProductPage/>} />
              <Route path="/deposit" element={<DepositCoinsPage/>}/>
            </>
          )}
          {/* TODO seller pages */}
          {!isLoggedIn && (
            <>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </>
          )}
          {/* TODO 3 redirects based on auth state */}
          {!isLoggedIn && <Route path="*" element={<Navigate to={"/login"} />} />}
          {isBuyer && <Route path="*" element={<Navigate to={"/products"} />} />}
        </Routes>
      </div>
    </Content>
  );
};

export default LayoutContent;
