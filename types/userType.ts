export interface IUserType {
  avatar: string | null;
  fullName: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  preferences: {
    orderStatus: boolean;
    passwordChange: boolean;
    specialOffers: boolean;
    newsletter: boolean;
  };
}
