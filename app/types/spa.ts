export type Spa = {
  id: string;
  name: string;
  subTypes: SpaSubType[];
  description: string | null;
  bannerUrl: string | null;
  videoUrl: string | null;
  availableDays: string[];
};

type SpaSubType = {
  id: number;
  name: string;
  description: string;
  prices: SpaPrice[];
};

type SpaPrice = {
  id: string;
  duration: number;
  timeUnit: string;
  price: number;
};
