import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  batchSize = 10;
  lastVisible: QueryDocumentSnapshot<any> | any;
  currentTags: string[] | any;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  async ngOnInit() { }

  // FILTRO

  async getUserTags(selectedTags: any[]): Promise<string[]> {
    if (selectedTags.length > 0) {
      return selectedTags.map(tag => tag.name);
    } else {
      const profile = await this.userService.getUserProfile();
      return profile.tags || [];
    }
  }

  async filterChatrooms(selectedTags: any[]) {
    const tags = await this.getUserTags(selectedTags);
    this.currentTags = tags;

    if (tags.length === 0) return [];

    try {
      const querySnapshot = await this.firestore.collection('chatRooms').ref
        .where('tags', 'array-contains', tags[0]).where('privado', '==', 0)
        .limit(this.batchSize)
        .get();

      if (querySnapshot.empty) {
        return [];
      }

      let filteredResults = querySnapshot.docs.filter(doc => {
        const data = doc.data();
        return tags.every(tag => data['tags'].includes(tag));
      });

      this.lastVisible = filteredResults[filteredResults.length - 1];
      return filteredResults.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

    } catch (error) {
      console.error('Erro ao filtrar chatrooms:', error);
      throw new Error('Falha ao buscar chatrooms');
    }
  }

  getMoreGroups(lastVisible: any) {
    return this.firestore.collection('chatRooms', ref =>
        ref.where('tags', 'array-contains-any', this.currentTags).where('privado', '==', 0)
           .startAfter(lastVisible)
           .limit(this.batchSize))
      .snapshotChanges()
      .pipe(map(changes =>
        changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      ));
  }
}

