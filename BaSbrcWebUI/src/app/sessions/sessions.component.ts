import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Booking } from '../_models/booking';
import { Session } from '../_models/session';
import { User } from '../_models/user';
import { BookingService } from '../_services/booking.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  _showAll = "All";
  _newSession : boolean = false;
  _editSession: boolean = false;
  _session: Session;

  _sessionForm = this.fb.group({
    sessionId: [0],
    location: ['25Yrd', Validators.required],
    sessionDate: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    capacity: [4, Validators.required],
    rangeOfficer: [''],
    roId: [0],
    bookings: ['']
  });

  constructor(public bs: BookingService,
    private fb: FormBuilder) {
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

  newSession() {
    this._newSession=true;
    this._sessionForm.setValue({
      sessionId: 0,
      location: '25Yrd',
      sessionDate: '',
      startTime: '',
      endTime: '',
      capacity: 4,
      rangeOfficer: '',
      roId: 0,
      bookings: ''  
    });
  }

  editSession(s : Session){
    let sd = s.sessionDate.toString().substr(0,10);
    this._editSession = true;
    this._session = s;
    this._sessionForm.setValue(s);
    this._sessionForm.patchValue({'sessionDate': sd})
  }

  onSessionFormSubmit() {
    if (this._sessionForm.valid) {
      if (this._sessionForm.dirty) {
        if (this._newSession) {
          // Add a new session
          let ns: Session = this._sessionForm.value;
          this.bs.addSession(ns).subscribe(() => {
            console.log("Session Added");
            // Flip the value because showAll() flips it again.
            this._showAll = (this._showAll == 'All') ? 'Future only': 'All';
            this.showAll();
          });
        } else {
          //Editing a session
          let ns: Session = this._sessionForm.value;
          this.bs.updateSession(ns.sessionId, ns).subscribe(() => {
            console.log("Session Updated");
            // Flip the value because showAll() flips it again.
            this._showAll = (this._showAll == 'All') ? 'Future only': 'All';
            this.showAll();
          });
        }
      }
      this._session = null;
      this._editSession = false;
      this._newSession = false;  
    }
  }
}
