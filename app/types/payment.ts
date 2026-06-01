export type PaymentProvider =
  | "stripe"
  | "esewa"
  | "khalti"
  | "fonepay";

export type PaymentMode =
  | "redirect_url"
  | "sdk"
  | "embedded";

export interface PaymentInfo {
  provider: PaymentProvider;
  mode: PaymentMode;
  redirectUrl?: string;
  sessionId?: string;
}

export interface CheckoutResponse {
  checkoutCode: string;
  provider: PaymentProvider;
  status: string;
  holdExpiresAt: string;
  amount: number;
  currency: string;
  payment: PaymentInfo;
}