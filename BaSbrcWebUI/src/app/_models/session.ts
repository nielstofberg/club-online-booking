import { Booking } from "./booking";

export interface Session {
	sessionId: number;
	location: string;
	sessionDate: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  rangeOfficer: string;
  roId: number;
  bookings: Booking[]
}
