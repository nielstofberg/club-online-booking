import { Component } from '@angular/core';
import { BookingService } from '../_services/booking.service'
import { Session } from '../_models/session'
import { Booking } from '../_models/booking'
import { Event, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormArray} from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginComponent } from '../login/login.component';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-booking-new-component',
  templateUrl: './booking-new.component.html',
  styleUrls: ['./booking-new.component.scss']
})
export class BookingNewComponent {
  public currentCount = 0;
  _sessions: Session[];
  _session: Session;
  _booking: Booking;
  _failMessage: string = null;

  _bookingForm = this.fb.group({
    sessionId: [''],
    bookingId: [0],
    memberNumber: ['', Validators.required],
 });

  constructor(public bs: BookingService,
    private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.bs.getSessons().subscribe(result => {
      this._sessions = result.filter(s=> s.rangeOfficer);
    });
  }

  sessionChange(e) {
    var id = Number(e.target.value);
    if (id >= 0) {
      this.refreshSession(id);
    }
    else {
      this._session = null;
    }
  }

  refreshSession(id) {
    this.bs.getSession(id).subscribe(result => {
      this._session = result;
      this._bookingForm.patchValue({
        'sessionId': id, 
        'startTime': result.startTime,
        'endTime': result.endTime
      });
    });
  }

  onBookingFormSubmit() {
    if (this._bookingForm.valid) {
      if (this._session != null && this._bookingForm.dirty) {
        var booking: Booking = this._bookingForm.value;

        booking.sessionId = this._session.sessionId;
        this.bs.addBooking(booking).subscribe(r => {
          this._booking = r;
          this._bookingForm.reset();
        });
      }
    }
  }  
  
  private getTimeStamp(timeString) : Date {
    var time = timeString.split(':');
    return new Date(0,0,0,time[0],time[1],0,0);
  }

  onFinishClick() {
    this.router.navigate(['/login/']);
  }
}
