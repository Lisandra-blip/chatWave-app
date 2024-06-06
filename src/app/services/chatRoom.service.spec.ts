/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatRoomService } from './chatRoom.service';

describe('Service: ChatRoom', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatRoomService]
    });
  });

  it('should ...', inject([ChatRoomService], (service: ChatRoomService) => {
    expect(service).toBeTruthy();
  }));
});
