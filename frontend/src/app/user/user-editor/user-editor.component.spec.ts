import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInformationComponent } from './user-editor.component';

describe('EditInformationComponent', () => {
  let component: EditInformationComponent;
  let fixture: ComponentFixture<EditInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
