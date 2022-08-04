import { Button, notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { useContext } from "react";
import {
  ActiveSessions,
  AuthCredentials,
  User,
} from "../../api-types/api-types";
import CredentialsForm from "../../components/CredentialsForm";
import LoadingError from "../../components/LoadingError";
import AuthContext from "../../store/auth-context";

const EditProfilePage: React.FC = () => {
  const [
    { loading: isProfileLoading, data: profileData, error: profileError },
    refetchProfile,
  ] = useAxios<User>("/auth/profile");

  const [
    {
      loading: isLoginSessionsLoading,
      data: loginSessionsData,
      error: loginSessionError,
    },
    refetchLoginSessions,
  ] = useAxios<ActiveSessions>({ url: "/auth/active-sessions" });

  const [{ loading: isUpdateLoading }, executeUpdate] = useAxios<User>(
    { url: "/auth/credentials", method: "PATCH" },
    { manual: true }
  );

  const authCtx = useContext(AuthContext);

  const handleUpdate = (values: AuthCredentials) => {
    return executeUpdate({ data: values })
      .then(() => {
        notification.success({ message: "Profile updated successfully" });
      })
      .catch((error) => {
        notification.error({
          message: "Profile update failed",
          description: error?.response?.data?.message,
        });
      });
  };

  if (isProfileLoading || isLoginSessionsLoading) {
    return <span>Loading...</span>;
  }

  if (profileError) {
    return <LoadingError onRetry={refetchProfile} />;
  }

  if (loginSessionError) {
    return <LoadingError onRetry={refetchLoginSessions} />;
  }

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Update credentials"
        footer={
          <div>
            <div>
              You have {loginSessionsData?.activeSessionsCount} active sessions.
            </div>
            <Button
              type="primary"
              onClick={authCtx.logOutAllSessions}
            >
              Logout from all
            </Button>
          </div>
        }
      />
      <CredentialsForm
        disabled={isUpdateLoading}
        onFinish={handleUpdate}
        submitText="Update"
        initialValues={{ username: profileData?.username }}
      />
    </>
  );
};

export default EditProfilePage;
