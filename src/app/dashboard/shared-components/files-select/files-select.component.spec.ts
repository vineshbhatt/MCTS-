import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSelectComponent } from './files-select.component';

describe('FilesSelectComponent', () => {
  let component: FilesSelectComponent;
  let fixture: ComponentFixture<FilesSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
