import { Client, Account, Databases, Storage } from 'appwrite';
import { environment } from '../environments/environment';

export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(environment.appWrite.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID } from 'appwrite';
