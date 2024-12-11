import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from '../../store/user/user.action';
import { getUser as getReceiverUser } from '../../store/user/user.selector';
import { getUser } from '../../store/auth/auth.selector';
import { MessageActions } from '../../store/message/message.action';
import { getMessages } from '../../store/message/message.selector';
import { AppwriteDBService } from '../../services/appwrite-db.service';
import { ProfileActions } from '../../store/profile/profile.action';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
})
export class ChatMessagesComponent {
  @Input() userId!: string;

  private store = inject(Store);
  private appWriteDB = inject(AppwriteDBService);

  sender: any = {};
  receiver: any = {};
  messages: any[] = [];
  staticPhoto: string = this.appWriteDB.staticPhoto;

  ngOnInit() {
    this.store.dispatch(UserActions.fetchById({ id: this.userId }));
    this.store.dispatch(MessageActions.fetch());
    this.store.dispatch(MessageActions.fetchRealtime());
    this.store.select(getMessages).subscribe((messages) => {
      this.messages = messages.documents;
    });
    this.store.select(getReceiverUser).subscribe((user) => {
      this.receiver = { ...user };
      this.receiver.pic = this.receiver?.pic
        ? this.appWriteDB.getFileUrl(this.receiver.pic, 'test-storage')
        : this.staticPhoto;
    });
    this.store.select(getUser).subscribe((user) => {
      this.sender = { ...user };
      this.sender.pic = this.sender?.pic
        ? this.appWriteDB.getFileUrl(this.sender.pic, 'test-storage')
        : this.staticPhoto;
    });
  }

  onUserActivity(status: string) {
    this.store.dispatch(
      ProfileActions.updateProfile({
        id: this.sender.id,
        data: {
          status,
        },
      }),
    );
  }

  sendMessage(message: HTMLInputElement) {
    this.store.dispatch(
      MessageActions.sendMessage({
        data: {
          sender: this.sender.id,
          receiver: this.receiver.id,
          message: message.value,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    );
    message.value = '';
  }

  public bindClasses(type: string, item: any) {
    const msgSenderClass =
      'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end';
    const msgReceiverClass =
      'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start';
    const imgSenderClass = 'order-2 h-6 w-6 rounded-full';
    const imgReceiverClass = 'w-6 h-6 rounded-full order-1';
    switch (type) {
      case 'msgDivClass':
        return item.receiver.$id == this.receiver?.id
          ? msgSenderClass
          : msgReceiverClass;
      case 'imgClass':
        return item.receiver.$id == this.receiver?.id
          ? imgSenderClass
          : imgReceiverClass;
      default:
        return '';
    }
  }
}
