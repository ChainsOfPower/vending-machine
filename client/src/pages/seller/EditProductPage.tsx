import { Button, notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../api-types/api-types";
import LoadingError from "../../components/LoadingError";
import ProductForm from "../../components/ProductForm";

const EditProductPage: React.FC = () => {
  const { productId } = useParams();
  const [productName, setProductName] = useState<string>();
  const navigate = useNavigate();

  const [
    { loading: isProductLoading, data: productData, error: productError },
    refetchProduct,
  ] = useAxios<Product>(`/products/${productId}`);

  useEffect(() => {
    setProductName(productData?.productName);
  }, [productData]);

  const [{ loading: isUpdating }, executeUpdate] = useAxios<Product>(
    { url: "/products", method: "PUT" },
    { manual: true }
  );

  const [{ loading: isDeleting }, executeDelete] = useAxios<void>(
    { url: `/products/${productId}`, method: "DELETE" },
    { manual: true }
  );

  const handleUpdate = (values: Product) => {
    executeUpdate({ data: values })
      .then((response) => {
        setProductName(response.data.productName);
        notification.success({ message: "Updated successfully" });
      })
      .catch((error) => {
        notification.error({
          message: "Update failed",
          description: error?.response?.data?.message,
        });
      });
  };

  const handleDelete = () => {
    executeDelete()
      .then((response) => {
        notification.success({ message: "Deleted successfully" });
        navigate("/products/mine");
      })
      .catch((error) => {
        notification.error({
          message: "Delete failed",
          description: error?.response?.data?.message,
        });
      });
  };

  if (isProductLoading) {
    return <span>Loading...</span>;
  }

  if (productError) {
    return <LoadingError onRetry={refetchProduct} />;
  }

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={`Edit "${productName}"`}
        footer={
          <Button
            onClick={handleDelete}
            danger
            disabled={isUpdating || isDeleting}
          >
            Delete
          </Button>
        }
      />
      <ProductForm
        disabled={isUpdating || isDeleting}
        initialValues={productData}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default EditProductPage;
