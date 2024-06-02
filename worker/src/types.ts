export type WalletTransaction = {
  id: string;
  issuerid: string;
  issueeid: string;
  issuercurrencyid: string;
  issueecurrencyid: string;
  issuedkey: string;
  amount: number;
  processed: boolean;
  deleted: boolean;
  createdby: string;
  createdat: Date;
  updatedby: string;
  updatedat: Date;
};

export type WalletTransactionLeg = {
  id: string;
  transactionid: string;
  amount: number;
  leg: string;
  createdby: string;
  createdat: Date;
  updatedby: string;
  updatedat: Date;
};
