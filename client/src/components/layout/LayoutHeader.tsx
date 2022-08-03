import { Layout, Menu } from "antd";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const { Header } = Layout;

const LayoutHeader: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const isBuyer = authCtx.isBuyer;
  const isSeller = authCtx.isSeller;

  const location = useLocation();

  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
        {isBuyer && (
          <>
            <Menu.Item key="/products">
              <Link to="/products">
                <span>Products</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/deposit">
              <Link to="/deposit">
                <span>Deposit</span>
              </Link>
            </Menu.Item>
          </>
        )}

        {isSeller && (
          <>
            <Menu.Item key="/products/mine">
              <Link to="/products/mine">
                <span>My Products</span>
              </Link>
            </Menu.Item>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Menu.Item key="/login">
              <Link to="/login">
                <span>Log In</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/signup">
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </Menu.Item>
          </>
        )}

        {isLoggedIn && (
          <Menu.Item key="/logout" onClick={() => authCtx.logOut()}>
            <span>Log Out</span>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default LayoutHeader;
