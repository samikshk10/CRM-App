export interface InputAuthLoginInterface {
  email: string;
  password: string;
}
export interface InputAuthTokenInterface {
  accessToken: string;
}

export interface InputConfirmSignUpInterface {
  email: string;
  confirmationCode: string;
}
export interface InputResendConfirmationCodeInterface {
  email: string;
}

export interface InputForgotPasswordInterface {
  email: string;
}

export interface InputConfirmForgotPasswordInterface {
  verificationCode: string;
  newPassword: string;
  email: string;
}

export  interface TokenInterface {
  accessToken? : string;
  refreshToken? : string;
}