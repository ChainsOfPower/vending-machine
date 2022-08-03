import { notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../api-types/api-types";
import LoadingError from "../../components/LoadingError";
import ProductForm from "../../components/ProductForm";

const EditProductPage: React.FC = () => {
  const { productId } = useParams();
  const [productName, setProductName] = useState<string>();

  const [
    { loading: isProductLoading, data: productData, error: productError },
    refetchProduct,
  ] = useAxios<Product>(`/products/${productId}`);

  useEffect(() => {
    setProductName(productData?.productName);
  }, [productData]);

  const [{ loading: isUpdating }, executeUpdate] = useAxios<Product>(
    { url: `/products/update`, method: "PUT" },
    { manual: true }
  );

  const handleSubmit = (values: Product) => {
    executeUpdate({ data: values })
      .then((response) => {
        setProductName(response.data.productName);
        notification.success({ message: "Updated successfully " });
      })
      .catch((error) => {
        notification.error({
          message: "Update failed",
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
      />
      <ProductForm 
        disabled={isUpdating} 
        initialValues={productData} 
        onSubmit={handleSubmit}/>
    </>
  );
};

export default EditProductPage;
