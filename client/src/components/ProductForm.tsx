import { Button, Form, Input } from "antd";
import { Product } from "../api-types/api-types";

interface Props {
  initialValues: Product | undefined;
  disabled: boolean;
  onSubmit: (values: Product) => void;
}

const ProductForm: React.FC<Props> = (props) => {
  return (
    <Form
        name="buy"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={props.onSubmit}
        autoComplete="off"
        disabled={props.disabled}
        initialValues={props.initialValues}
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
  )
};

export default ProductForm;
