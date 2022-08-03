import { Button, Descriptions, Form, Input, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useState } from "react";
import { useParams } from "react-router-dom";

//TODO: extract to api types folder
interface Product {
  id: number;
  productName: string;
  amountAvailable: number;
  cost: number;
}

interface User {
  id: number;
  username: string;
  deposit: number;
}

const BuyProductPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);

  let { productId } = useParams();

  const [
    { loading: isProductLoading, data: productData, error: productError },
    refetchProduct,
  ] = useAxios<Product>(`/products/${productId}`);

  const [
    { loading: isProfileLoading, data: profileData, error: profileError },
    refetchProfile,
  ] = useAxios<User>("/auth/profile");

  const [{ loading: isBuyLoading }, executeBuy] = useAxios<unknown>(
    { url: "/vending-machine/buy", method: "POST" },
    { manual: true }
  );

  if (isProductLoading || isProfileLoading) {
    return <p>Loading...</p>;
  }

  if (productError || profileError) {
    return (
      <div>
        <div>Error loading data...</div>
        <Button
          onClick={() => Promise.all([refetchProduct(), refetchProfile()])}
        >
          Reload
        </Button>
      </div>
    );
  }

  const onFinish = (values: any) => {
    console.log(values);
    executeBuy({ data: values })
      .then((data) => {

      })
      .catch((error) => {

      });
  };

  return (
    <>
      <PageHeader className="site-page-header">
        <Descriptions column={1} title={`Buy ${productData?.productName}`}>
          <Descriptions.Item label="Available amount">
            {productData?.amountAvailable}
          </Descriptions.Item>
          <Descriptions.Item label="Cost per item">
            {productData?.cost}
          </Descriptions.Item>
          <Descriptions.Item label="Your deposit">
            {profileData?.deposit}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <Form
        name="buy"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        disabled={isBuyLoading}
        initialValues={{ amount: 1, productId }}
      >
        <Form.Item hidden name="productId">
          <Input />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please buy at least one item!",
            },
          ]}
        >
          <Input
            type="number"
            min={1}
            onChange={(event) => setAmount(event.target.valueAsNumber)}
          />
        </Form.Item>

        <Form.Item label="Total cost">
          <Input disabled value={(amount || 0) * (productData?.cost || 0)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Buy
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default BuyProductPage;
