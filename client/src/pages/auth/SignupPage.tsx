import { Button, Form, Input, notification, PageHeader, Select } from "antd";
import useAxios from "axios-hooks";
import { useNavigate } from "react-router-dom";

interface FormValues {
  username: string;
  plainPassword: string;
  role: string;
}

const SignupPage: React.FC = () => {
  const [{ loading }, execute] = useAxios(
    { url: "http://localhost:3001/auth/signup", method: "POST" },
    { manual: true }
  );

  const navigate = useNavigate();

  const onFinish = (values: FormValues) => {
    execute({ data: values })
      .then(() => {
        notification.success({
          message: "Signed up successfuly"
        })
        navigate("/login");
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        errorMessage &&
          notification.error({
            message: "Signup failed",
            description: errorMessage,
          });
      });
  };

  return (
    <>
      <PageHeader className="site-page-header" title="Sign Up" />

      <Form
        name="signup"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        disabled={loading}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="plainPassword"
          rules={[
            {
              required: true,
              message: "Please input your password (min 8 characters)!",
              min: 8,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select>
            <Select.Option value="BUYER">Buyer</Select.Option>
            <Select.Option value="SELLER">Seller</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignupPage;
