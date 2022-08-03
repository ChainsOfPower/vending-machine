import { useParams } from "react-router-dom";

const BuyProductPage: React.FC = () => {
  let { productId } = useParams();

  return <span>{productId}</span>;
};

export default BuyProductPage;
