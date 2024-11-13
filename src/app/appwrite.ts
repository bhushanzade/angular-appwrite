import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67347273003d66be5173');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';
