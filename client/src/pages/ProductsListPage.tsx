import { Button, Table,  } from "antd";
import useAxios from "axios-hooks";

const columns = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
];

const ProductsListPage: React.FC = () => {
  const [{ data, loading, error }, refetch] = useAxios(
    "http://localhost:3001/products/"
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <div>Error loading data...</div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return <Table dataSource={data} columns={columns} />;
};

export default ProductsListPage;
