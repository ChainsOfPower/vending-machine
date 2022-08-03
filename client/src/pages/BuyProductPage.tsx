import {
  Button,
  Descriptions,
  Form,
  Input,
  notification,
  PageHeader,
} from "antd";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuyProductResponse, Product, User } from "../api-types/api-types";
import LoadingError from "../components/LoadingError";

const BuyProductPage: React.FC = () => {
  const { productId } = useParams();
  const [amount, setAmount] = useState<number>(1);
  const [product, setProduct] = useState<Product>();
  const [deposit, setDeposit] = useState<number>();

  const [
    { loading: isProductLoading, data: productData, error: productError },
    refetchProduct,
  ] = useAxios<Product>(`/products/${productId}`);

  const [
    { loading: isProfileLoading, data: profileData, error: profileError },
    refetchProfile,
  ] = useAxios<User>("/auth/profile");

  const [{ loading: isBuyLoading }, executeBuy] = useAxios<BuyProductResponse>(
    { url: "/vending-machine/buy", method: "POST" },
    { manual: true }
  );

  useEffect(() => {
    setProduct(productData);
    setDeposit(profileData?.deposit);
  }, [productData, profileData]);

  const handleBuy = (values: any) => {
    executeBuy({ data: values })
      .then((response) => {
        setDeposit(0);
        setProduct(response.data.product);

        const changeText = `Your coins change is ${response.data.change.coins.toString()}`;

        notification.success({
          message: "Purchase successful",
          description: changeText,
        });
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;

        notification.error({
          message: "Purchase failed",
          description: errorMessage,
        });
      });
  };

  if (isProductLoading || isProfileLoading) {
    return <p>Loading...</p>;
  }

  if (productError) {
    return <LoadingError onRetry={refetchProduct} />;
  }

  if (profileError) {
    return <LoadingError onRetry={refetchProfile} />;
  }

  return (
    <>
      <PageHeader className="site-page-header">
        <Descriptions column={1} title={`Buy ${product?.productName}`}>
          <Descriptions.Item label="Available amount">
            {product?.amountAvailable}
          </Descriptions.Item>
          <Descriptions.Item label="Cost per item">
            {product?.cost}
          </Descriptions.Item>
          <Descriptions.Item label="Your deposit">{deposit}</Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <Form
        name="buy"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleBuy}
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
