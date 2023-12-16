import User from "@pos_types/users/User";

export default interface Organization {
  id?: string;
  name: string;
  users?: Array<User>;
}