import { Content } from "antd/lib/layout/layout";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BuyProductPage from "../../pages/buyer/BuyProductPage";
import DepositCoinsPage from "../../pages/buyer/DepositCoinsPage";
import LoginPage from "../../pages/auth/LoginPage";
import ProductsListPage from "../../pages/buyer/ProductsListPage";
import AuthContext from "../../store/auth-context";
import SignupPage from "../../pages/auth/SignupPage";
import MyProductsPage from "../../pages/seller/MyProductsPage";
import EditProductPage from "../../pages/seller/EditProductPage";

const LayoutContent: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const isBuyer = authCtx.isBuyer;
  const isSeller = authCtx.isSeller;

  return (
    <Content style={{ padding: "0 25px" }}>
      <div className="site-layout-content">
        <Routes>
          {isBuyer && (
            <>
              <Route path="/products" element={<ProductsListPage />} />
              <Route
                path="/product/buy/:productId"
                element={<BuyProductPage />}
              />
              <Route path="/deposit" element={<DepositCoinsPage />} />
            </>
          )}

          {isSeller && (
            <>
              <Route path="/products/mine" element={<MyProductsPage />} />
              <Route
                path="/product/edit/:productId"
                element={<EditProductPage />}
              />
            </>
          )}

          {!isLoggedIn && (
            <>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </>
          )}
          
          {!isLoggedIn && (
            <Route path="*" element={<Navigate to={"/login"} />} />
          )}
          {isBuyer && (
            <Route path="*" element={<Navigate to={"/products"} />} />
          )}
          {isSeller && (
            <Route path="*" element={<Navigate to={"/products/mine"}/>}/>
          )}
        </Routes>
      </div>
    </Content>
  );
};

export default LayoutContent;
