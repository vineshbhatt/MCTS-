import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-organizational-chart',
  templateUrl: './edit-organizational-chart.component.html',
  styleUrls: ['./edit-organizational-chart.component.scss']
})
export class EditOrganizationalChartComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  test() {
    this.router.navigate(['dashboard/administration/edit-org-chart/chart-users', 1]);
  }

}
