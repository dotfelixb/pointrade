
export type DatabaseUser = {
    id?: string;
    email: string;  
    username: string;
    password: string;  
    emailConfirmed?: boolean;
}

export type UserRegister = {
    username: string;
    email: string;
    password: string;
};

export type UserVerify = {
    email: string;
    token: string;
}

export type UserToken = {
    email: string;
    password: string;
}

export type AuthenticationToken  = {
    userId: string;
    username: string;
}

export type WalletDeposit = {
  userid: string;
  currencyid: string;
  issuedkey: string;
  rate: number;
  amount: number;
};