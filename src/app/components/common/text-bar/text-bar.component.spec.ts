/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TextBarComponent } from './text-bar.component';

describe('TextBarComponent', () => {
  let component: TextBarComponent;
  let fixture: ComponentFixture<TextBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
