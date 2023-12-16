import User from "@type/users/User";

export default interface Organization {
  id?: string;
  name: string;
  users?: Array<User>;
}