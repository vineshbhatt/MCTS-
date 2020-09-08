import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationalChartComponent } from './edit-organizational-chart.component';

describe('EditOrganizationalChartComponent', () => {
  let component: EditOrganizationalChartComponent;
  let fixture: ComponentFixture<EditOrganizationalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrganizationalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
