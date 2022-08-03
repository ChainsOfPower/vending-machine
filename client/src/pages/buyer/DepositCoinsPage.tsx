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
import { Change, User } from "../../api-types/api-types";
import LoadingError from "../../components/LoadingError";

const DepositCoinsPage: React.FC = () => {
  const [user, setUser] = useState<User | undefined>();
  const [form] = Form.useForm();

  const [{ loading, data, error }, refetch] = useAxios<User>("/auth/profile");

  const [{ loading: isDepositLoading }, executeDeposit] = useAxios<User>(
    { url: "/vending-machine/deposit", method: "POST" },
    { manual: true }
  );

  const [{ loading: isResetLoading }, executeReset] = useAxios<Change>(
    { url: "/vending-machine/reset", method: "POST" },
    { manual: true }
  );

  useEffect(() => {
    setUser(data);
  }, [data]);

  const handleDeposit = (values: any) => {
    executeDeposit({ data: values })
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

  const handleReset = () => {
    executeReset()
      .then((response) => {
        setUser((u) => {
          if (u === undefined) {
            return;
          }
          return { ...u, deposit: 0 };
        });
        const changeText = `Your change is ${response.data.coins.toString()}`;
        notification.success({
          message: "Deposit reset successfully",
          description: changeText,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Deposit reset failed",
          description: error?.response?.data?.message,
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
                if ([5, 10, 20, 50, 100].includes(+value)) {
                  return Promise.resolve();
                }
                return Promise.reject();
              },
            },
          ]}
        >
          <Input type="number" min={5} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Deposit
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="ghost" onClick={handleReset} disabled={isResetLoading}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DepositCoinsPage;
