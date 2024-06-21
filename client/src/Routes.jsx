import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { UserContext } from "./UserContext";

export default function Routes() {
  const {username, id} = useContext(UserContext);
  
  if (username) {
    return 'Currently logged in as ' + username + "!";
  }
  return (
    <RegisterAndLoginForm />
  );
}