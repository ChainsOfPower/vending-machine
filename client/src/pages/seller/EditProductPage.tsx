import { Button, Form, Input, notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../api-types/api-types";
import LoadingError from "../../components/LoadingError";

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

  const handleEdit = (values: Product) => {
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
      <Form
        name="buy"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleEdit}
        autoComplete="off"
        disabled={isUpdating}
        initialValues={productData}
      >
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>

        <Form.Item
          label="Product name"
          name="productName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Amount available"
          name="amountAvailable"
          rules={[{ required: true, message: "Available amount is required" }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          label="Cost"
          name="cost"
          rules={[{ required: true, message: "Cost is required" }]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default EditProductPage;
