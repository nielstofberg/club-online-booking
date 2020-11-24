import { Component } from '@angular/core';
import { BookingService } from '../_services/booking.service'
import { Session } from '../_models/session'
import { Booking } from '../_models/booking'
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-booking-view-component',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.scss']
})
export class BookingViewComponent {

  _showAll = "All";
  _session: Session;

  constructor(public bs: BookingService,
    public auth: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.bs.getSessons().subscribe(result => {
      this.bs.sessions = result;
    });
  }

  showAll(): void {
    let all = this._showAll == 'All';
    this.bs.getSessons(all).subscribe(result => {
      this.bs.sessions = result;
      this._showAll = (all) ? 'Future only': 'All';
      this._session = null;
    });
  }

  viewSession(session: Session) {
    var id = Number(session.sessionId);
    if (id >= 0) {
      // This gets all the bookings against the session as well.
      this.bs.getSession(id).subscribe(result => {
        this._session = result;
      });
    }
    else {
      this._session = null;
    }
  }

  deleteSession(session: Session) {
    if (confirm('Are you sure you want to delete session' + session.sessionId).valueOf()){
      this.bs.getSession(session.sessionId).subscribe(result => {
        if (result.bookings.length > 0) {
          alert("Can not delete this session because there are bookings against it");
          this._session = result;
        }
        else {
          console.log("Ok To delete Session");
          this.bs.deleteSession(result.sessionId).subscribe(()=>{
            console.log("Session deleted");
            // Flip the value because showAll() flips it again.
            this._showAll = (this._showAll == 'All') ? 'Future only': 'All';
            this.showAll();
          },
            err => { console.log(err); }
          );
        }
      });
    }
  }

  deletebooking(booking: Booking) {
    if (confirm('Are you sure you want to delete the booking for ' + booking.memberNumber).valueOf()){
      this.bs.deleteBooking(booking.bookingId).subscribe(() => {}, 
        err =>{ alert(err); });
    }
  }

  accountClick() {
    this.router.navigate(['/accountadmin/'])
  }

}
