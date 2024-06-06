import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ExploreService } from 'src/app/services/explore.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  chatRooms: any[] | any;
  filteredChatrooms: any[] = [];

  private lastVisible: any;

  _selectedTags: any[] = [];
  get selectedTags(): any[] { return this._selectedTags; }
  set selectedTags(tags: any[]) {
    this._selectedTags = tags;
    this.getInitialData();
  }

  constructor(
    private exploreService: ExploreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.getInitialData();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedTags' in changes)
      this.getInitialData();
  }

  public enterChatRoom(chat: any) {
    this.router.navigate(['inbox', chat]);
  }

  // ---------------

  async getInitialData() {
    this.chatRooms = of(await this.exploreService.filterChatrooms(this.selectedTags));
  }

  async loadMoreData() {
    const moreChatrooms = await this.exploreService.getMoreGroups(this.lastVisible);
    this.chatRooms = moreChatrooms;
  }

  onScroll() {
    // if (this.isNearBottom()) {
      this.loadMoreData();
    // }
  }

  isNearBottom(): boolean {
    const threshold = 150;
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;
    return position > height - threshold;
  }

}
