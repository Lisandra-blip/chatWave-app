import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TagsService } from 'src/app/services/tags.service';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Output() selectedTagsChange = new EventEmitter<string[]>();
  @Input() selectedTags: any[] = [];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | any;

  @Input() tagsFilter: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl('');
  tags: any[] | any;
  filteredTags: any[] | any;

  constructor(
    private tagsService: TagsService,
  ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.tags?.slice()))
    );

  }

  ngOnInit() {
    this.tagsService.getTags().subscribe((tags: any[]) => {
      this.tags = tags;
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const selected = this.selectedTags ? this.isTagSelected(value) : false;

    if (value && !selected) {
      this.tags.push({name: value});
      this.selectedTags.push({name: value});
    }

    event.chipInput!.clear();
    this.selectedTagsChange.emit(this.selectedTags);
    this.tagsCtrl.setValue(null);
  }

  remove(value: string): void {
    const index = this.selectedTags.indexOf(value);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
    this.selectedTagsChange.emit(this.selectedTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selected = this.selectedTags ? this.isTagSelected(event.option.viewValue) : false;

    if(!selected)
    this.selectedTags.push({name: event.option.viewValue});

    this.tagInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
    this.selectedTagsChange.emit(this.selectedTags);
  }

  _filter(value: any ): string[] {
    if (typeof value.name !== 'string') {
      throw new TypeError('Invalid argument type. Expected a string.');
    }

    const filterValue = value.name.toLowerCase();
    return this.tags.filter((tag: any) => tag.name.toLowerCase().includes(filterValue));
  }

  isTagSelected(tag: any): boolean {
      const selected = this.selectedTags.filter((tags: any) => tags.name == tag);
      return selected.length > 0;
  }

}
