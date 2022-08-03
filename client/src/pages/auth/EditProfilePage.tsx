import { notification, PageHeader } from "antd";
import useAxios from "axios-hooks";
import { AuthCredentials, User } from "../../api-types/api-types";
import CredentialsForm from "../../components/CredentialsForm";
import LoadingError from "../../components/LoadingError";

const EditProfilePage: React.FC = () => {
  const [
    { loading: isProfileLoading, data: profileData, error: profileError },
    refetchProfile,
  ] = useAxios<User>("/auth/profile");

  const [{ loading: isUpdateLoading }, executeUpdate] = useAxios<User>(
    { url: "/auth/credentials", method: "PATCH" },
    { manual: true }
  );

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

  if (isProfileLoading) {
    return <span>Loading...</span>;
  }

  if (profileError) {
    return <LoadingError onRetry={refetchProfile} />;
  }

  return (
    <>
      <PageHeader  className="site-page-header" title="Update credentials" />
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
