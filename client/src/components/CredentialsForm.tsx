import { Button, Form, Input } from "antd";
import { AuthCredentials } from "../api-types/api-types";

interface Props {
  onFinish: (values: AuthCredentials) => void;
  disabled: boolean;
  submitText: string;
  initialValues?: AuthCredentials;
}

const CredentialsForm: React.FC<Props> = (props) => {
  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={props.onFinish}
      autoComplete="off"
      disabled={props.disabled}
      initialValues={props.initialValues}
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
          {props.submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CredentialsForm;
