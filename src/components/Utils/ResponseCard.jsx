import moment from "moment";
import useUserNameByEmail from "../../hooks/useUserNameByEmail";

const ResponseCard = ({ response, className = "" }) => {
  const [userbyemail] = useUserNameByEmail(response.responseByEmail);

  return (
    <div
      className={`p-5 shadow-md mb-8 ${className} ${
        response.responseByRole === "normal_user"
          ? "bg-green-200"
          : "bg-gray-300"
      }`}
    >
      <div>
        <div className="flex flex-col space-y-2">
          <h5>{userbyemail.username}</h5>
          <div>
            Responded at{" "}
            {moment(response.createdAt).format("DD MMM, YY, h:mm:ss a")}
          </div>
        </div>
        <div className="my-3">{response.responseText}</div>
      </div>
    </div>
  );
};

export default ResponseCard;
