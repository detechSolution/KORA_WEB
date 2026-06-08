export type Spa = {
  id: string;
  name: string;
  subTypes: SpaSubType[];
  description: string | null;
  bannerUrl: string | null;
  videoUrl: string | null;
  availableDays: string[];
};

export type SpaSubType = {
  id: number;
  name: string;
  description: string;
  prices: SpaPrice[];
};

export type SpaPrice = {
  id: string;
  duration: number;
  timeUnit: string;
  price: number;
};
