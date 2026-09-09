export type Spa = {
  id: string;
  name: string;
  subTypes: SpaSubType[];
  description: string | null;
  bannerUrl: string | null;
  videoUrl: string | null;
  availableDays: string[];
};

export type SpaCategory = {
  id: number;
  name: string;
  servicesCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type SpaCategoryDetail = SpaCategory & {
  services: SpaCategoryService[];
  subTypes?: SpaCategoryService[];
};

export type SpaCategoryService = SpaSubType & {
  spaId: number;
  categoryId: number;
  currency: string;
  spa: {
    id: number;
    name: string;
    currency: string;
    bannerUrl: string | null;
    availableDays: string[];
    availableFromTime: string;
    availableToTime: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type SpaSubType = {
  id: number;
  name: string;
  description: string;
  prices: SpaPrice[];
};

export type SpaPrice = {
  id: string | number;
  subTypeId?: number;
  duration: number;
  timeUnit: string;
  price: number;
};
