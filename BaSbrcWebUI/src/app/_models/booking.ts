import { Session } from "./session";

export interface Booking {
	bookingId: number;
	memberNumber: string;
	sessionId: number;
	session: Session;
}
