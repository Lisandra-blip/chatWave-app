import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface Tag {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  tags$: Observable<Tag[]> | any

constructor(private firestore: AngularFirestore) { }

getTags(): Observable<any[]> {
  return this.firestore.collection('tags').valueChanges()
}

async addTags(selectedTags: Tag[]) {
  this.getTags().subscribe((tags) => {
    const tags$ = tags;
    selectedTags.forEach(tag => {
      const existingTag = tags$.find((t: { name: any; }) => t.name === tag.name);
      if (!existingTag)
        this.firestore.collection('tags').add({ name: tag.name })
    });
  })
}

}
