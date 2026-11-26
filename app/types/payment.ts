export type PaymentProvider
  = | "stripe"
    | "esewa"
    | "khalti"
    | "fonepay"
    | "card"
    | "cybersource";

type PaymentMode
  = | "redirect_url"
    | "sdk"
    | "redirect_form"
    | "free"
    | "embedded"
    | "embedded_card"
    | "qr_websocket";

export type PaymentInfo = {
  provider: PaymentProvider;
  mode: PaymentMode;
  redirectUrl?: string;
  sessionId?: string;
  url?: string;
  method?: string;
  fields?: Record<string, string>;
  qrCode?: string;
  merchantWebSocketUrl?: string;
  statusCheckPath?: string;
  captureContext?: string;
  clientLibrary?: string;
  clientLibraryIntegrity?: string;
  sdk?: {
    clientLibrary?: string;
    clientLibraryIntegrity?: string;
  };
  autoProcessing?: boolean;
};

export type CheckoutResponse = {
  checkoutCode: string;
  provider?: PaymentProvider;
  status?: string;
  holdExpiresAt: string;
  amount: number;
  currency: string;
  captureContext?: string;
  clientLibrary?: string;
  clientLibraryIntegrity?: string;
  sdk?: {
    clientLibrary?: string;
    clientLibraryIntegrity?: string;
  };
  autoProcessing?: boolean;
  payment: PaymentInfo;
};
