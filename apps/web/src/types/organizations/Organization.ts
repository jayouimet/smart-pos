import User from "types/users/User";

export default interface Organization {
  id?: string;
  name: string;
  users?: Array<User>;
}