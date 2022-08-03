import { Space, Table } from "antd";
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
    key: "edit",
    render: (_: any, product: Product) => (
      <Space size="middle"> 
        <Link to={`/product/edit/${product.id}`}>Edit</Link>
      </Space>
    )
  }
];

const MyProductsPage: React.FC = () => {
  const [{ data, loading, error }, refetch] = useAxios<Product[]>(
    "/products/mine"
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <LoadingError onRetry={refetch}/>
  }

  return <Table dataSource={data?.map(d => ({key: d.id, ...d}))} columns={columns} />;
}

export default MyProductsPage;
