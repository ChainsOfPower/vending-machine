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
import { User } from "../../api-types/api-types";
import LoadingError from "../../components/LoadingError";

const DepositCoinsPage: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();
  const [form] = Form.useForm();

  const [{ loading, data, error }, refetch] = useAxios<User>("/auth/profile");

  const [{ loading: isDepositLoading }, executeBuy] = useAxios<User>(
    { url: "/vending-machine/deposit", method: "POST" },
    { manual: true }
  );

  useEffect(() => {
    setUser(data);
  }, [data]);

  const handleDeposit = (values: any) => {
    executeBuy({ data: values })
      .then((data) => {
        notification.success({
          message: "Successfully deposited coin",
        });
        setUser(data.data);
        form.resetFields();
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;

        notification.error({
          message: "Deposit failed",
          description: errorMessage,
        });
      });
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <LoadingError onRetry={refetch} />;
  }

  return (
    <>
      <PageHeader>
        <Descriptions column={1} title="Deposit coins">
          <Descriptions.Item label="Your deposit">
            {user?.deposit}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <Form 
        form={form}
        name="deposit"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleDeposit}
        autoComplete="off"
        disabled={isDepositLoading}
      >
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              message: "Deposit must be one of [5, 10, 20, 50, 100]",
              validator: (_, value) => {
                if([5, 10, 20, 50, 100].includes(+value)) {
                  return Promise.resolve()
                }
                return Promise.reject();
              }
            }
          ]}
        >
          <Input type="number" min={5} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Deposit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DepositCoinsPage;
