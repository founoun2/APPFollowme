import { Account } from 'appwrite';
import client from './appwrite';

const account = new Account(client);

export const signUp = async (email: string, password: string, name?: string) => {
  return account.create('unique()', email, password, name);
};

export const login = async (email: string, password: string) => {
  return account.createEmailSession(email, password);
};

export const getCurrentUser = async () => {
  return account.get();
};

export const logout = async () => {
  return account.deleteSession('current');
};
