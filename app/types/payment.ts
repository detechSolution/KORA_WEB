export type PaymentProvider
  = | "stripe"
    | "esewa"
    | "khalti"
    | "fonepay";

type PaymentMode
  = | "redirect_url"
    | "sdk"
    | "redirect_form"
    | "embedded";

export type PaymentInfo = {
  provider: PaymentProvider;
  mode: PaymentMode;
  redirectUrl?: string;
  sessionId?: string;
  url?: string;
  method?: string;
  fields?: Record<string, string>;
};

export type CheckoutResponse = {
  checkoutCode: string;
  provider: PaymentProvider;
  status: string;
  holdExpiresAt: string;
  amount: number;
  currency: string;
  payment: PaymentInfo;
};
