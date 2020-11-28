import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../_models/session';
import { Booking } from '../_models/booking';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BookingService {

	sessions: Session[];

	constructor(private http: HttpClient,
		@Inject('BASE_URL') private baseUrl: string) {
	}

	getSessons(all=false): Observable<Session[]> {
		if (all) {
			return this.http.get<Session[]>(this.baseUrl + 'api/Sessions?all=true');
		}
		else {
			return this.http.get<Session[]>(this.baseUrl + 'api/Sessions');
		}
	}

    getSession(id: number): Observable<Session> {
		return this.http.get<Session>(this.baseUrl + 'api/Sessions/' + id);
	}

	addSession(s: Session) : Observable<Session> {
		return this.http.post<Session>(this.baseUrl + 'api/Sessions/', s);
	}

	updateSession(id: number, s: Session) : Observable<Session> {
		return this.http.put<Session>(this.baseUrl + 'api/Sessions/' + id, s);
	}

	deleteSession(id: number): Observable<any> {
		return this.http.delete(this.baseUrl + 'api/Sessions/' + id);
	}

	addBooking(b: Booking): Observable<Booking> {
		return this.http.post<Booking>(this.baseUrl + 'api/Bookings', b);
	}

	deleteBooking(id: number): Observable<any> {
		return this.http.delete(this.baseUrl + 'api/Bookings/' + id);
	}
}
