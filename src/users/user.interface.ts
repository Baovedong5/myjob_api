export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  village: string;
  district: string;
  city: string;
  role: {
    name: string;
    permissions: string[];
  };
}
