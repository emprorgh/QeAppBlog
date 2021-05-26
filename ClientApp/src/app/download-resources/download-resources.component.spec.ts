import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadResourcesComponent } from './download-resources.component';

describe('DownloadResourcesComponent', () => {
  let component: DownloadResourcesComponent;
  let fixture: ComponentFixture<DownloadResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
