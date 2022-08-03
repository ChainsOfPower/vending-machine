import { Button, Form, Input, notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

interface FormValues {
  username: string;
  plainPassword: string;
}

const LoginPage: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [{ loading }, execute] = useAxios<{ accessToken: string }>(
    { url: "/auth/signin", method: "POST" },
    { manual: true }
  );

  const onFinish = (values: FormValues) => {
    execute({ data: values })
      .then((response) => {
        notification.success({
          message: "Signed in successfuly"
        })
        authCtx.logIn(response.data.accessToken);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        errorMessage &&
          notification.error({
            message: "Signin failed",
            description: errorMessage,
          });
      });
  };

  return (
    <>
      <PageHeader className="site-page-header" title="Log in" />
      <Form
        name="login"
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
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginPage;
