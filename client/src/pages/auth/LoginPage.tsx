import { notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useContext } from "react";
import { AuthCredentials } from "../../api-types/api-types";
import CredentialsForm from "../../components/CredentialsForm";
import AuthContext from "../../store/auth-context";

const LoginPage: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const [{ loading }, execute] = useAxios<{ accessToken: string }>(
    { url: "/auth/signin", method: "POST" },
    { manual: true }
  );

  const handleLogin = (values: AuthCredentials) => {
    return execute({ data: values })
      .then((response) => {
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
      <CredentialsForm
        disabled={loading}
        onFinish={handleLogin}
        submitText="Log In"
      />
    </>
  );
};

export default LoginPage;
