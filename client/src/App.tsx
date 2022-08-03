import { Layout } from "antd";
import LayoutContent from "./components/LayoutContent";
import LayoutHeader from "./components/LayoutHeader";

const {Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <LayoutHeader/>
      <LayoutContent/>
      <Footer style={{ textAlign: "center" }}>
        Vending Machine ©2022 Created by Ivan Vukman
      </Footer>
    </Layout>
  );
};

export default App;
