export interface Session {
  id: number;
  name: string;
  type: string;
  capacity: number;
  availability: number;
  bookedCount: number;
  description: string;
  bannerUrl: string;
  videoUrl: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  startsAt: Date;
  endsAt: Date;
  instructor: CreatedBy;
  instructorName: string;
  createdBy: CreatedBy;
  updatedBy: CreatedBy;
  createdByName: string;
  lastEditedByName: string;
  lastEditedAt: Date;
  venue: string;
  price: number;
  currency: string;
  isFree: boolean;
  remainingSpots: number;
  isBookable: boolean;
}

export interface CreatedBy {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  bio?: string;
}
