import { notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useNavigate } from "react-router-dom";
import { Product } from "../../api-types/api-types";
import ProductForm from "../../components/ProductForm";

const CreateProductPage: React.FC = () => {
  const [{ loading: isCreateLoading }, executeCreate] = useAxios<Product>(
    { url: "/products", method: "POST" },
    { manual: true }
  );

  const navigate = useNavigate();

  const handleCreate = (values: Product) => {
    executeCreate({ data: values })
      .then((response) => {
        notification.success({ message: "Product created successfully" });
        navigate(`/product/${response.data.id}`);
      })
      .catch((error) => {
        notification.error({
          message: "Error creating product",
          description: error?.response?.data?.message,
        });
      });
  };

  return (
    <>
      <PageHeader className="site-page-header" title={"Create new product"} />
      <ProductForm
        disabled={isCreateLoading}
        initialValues={undefined}
        onSubmit={handleCreate}
      />
    </>
  );
};

export default CreateProductPage;
