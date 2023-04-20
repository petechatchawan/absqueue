import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/app/service/firebase-config';
import { person } from 'src/app/model/person.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class EditPage implements OnInit {
  path = 'person';
  date = '2023-04-20';
  name!: string;
  lastname!: string;
  phone!: string;
  docId: string;
  documents: any[] = [];

  _name: string = '';
  _lastname: string = '';
  _phone: string = '';
  _date: string = '';
  _id: string = '';
  constructor(private route: ActivatedRoute) {
    this.docId = '';
  }

  ngOnInit() {
    this.getDocuments();
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.docId = id;
      this._id = id;
    }
    // Call getDoc to retrieve the data of the document with the given ID
    const docRef = doc(db, this.path, this.docId);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Assign the retrieved data to the properties that are bound to the form fields
        this._name = data['name'];
        this._lastname = data['lastname'];
        this._date = data['brithday'];
        this._phone = data['phone'];
      } else {
        console.log('No such document!');
      }
    });
    // You can use this.docId to retrieve the document data and populate the form
  }

  async getDocuments() {
    const querySnapshot = await getDocs(collection(db, 'person'));
    this.documents = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  }

  async updatedate(id: string) {
    try {
      const docRef = doc(db, 'person', id);
      await updateDoc(docRef, {
        name: this.name,
        lastname: this.lastname,
        brithday: this.date,
        phone: this.phone,
      });
      alert(`Document with ID ${docRef.id} has been updated.`);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }
}
