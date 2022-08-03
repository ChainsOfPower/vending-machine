import { Button } from "antd";

interface Props {
  onRetry: () => void;
}

const LoadingError: React.FC<Props> = (props) => {
  return (
    <div>
      <div>Error loading data...</div>
      <Button onClick={props.onRetry}>Reload</Button>
    </div>
  );
};

export default LoadingError;
