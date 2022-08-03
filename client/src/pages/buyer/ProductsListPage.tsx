import { Space, Table,  } from "antd";
import useAxios from "axios-hooks";
import { Link } from "react-router-dom";
import { Product } from "../../api-types/api-types";
import LoadingError from "../../components/LoadingError";

const columns = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Amount Available",
    dataIndex: "amountAvailable",
    key: "amountAvailable"
  },
  {
    title: "Cost",
    dataIndex: "cost",
    key: "cost"
  },
  {
    title: "",
    key: "buy",
    render: (_: any, product: Product) => (
      <Space size="middle"> 
        <Link to={`/product/buy/${product.id}`}>Buy</Link>
      </Space>
    )
  }
];

const ProductsListPage: React.FC = () => {
  const [{ data, loading, error }, refetch] = useAxios<Product[]>(
    "/products"
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <LoadingError onRetry={refetch}/>
  }

  return <Table dataSource={data?.map(d => ({key: d.id, ...d}))} columns={columns} />;
};

export default ProductsListPage;
