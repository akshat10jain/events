import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { eventService } from '../../../services/event.service'

@Component({
  selector: 'app-getevent',
  templateUrl: './getevent.component.html',
  styleUrls: ['./getevent.component.css']
})
export class GeteventComponent implements OnInit {
  eventId
  events = []
  constructor(private _routeParams: ActivatedRoute,public eventService: eventService) {
    var queryParam = this._routeParams.params.subscribe((params: Params) => {
      this.eventId = params['id'];
    });
  }
  ngOnInit() {
    this.eventService.getEvents().subscribe((resp) => {
      console.log(resp)
      console.log(resp['data'])
      this.events = resp['data']
      
    
    })
  }

}
