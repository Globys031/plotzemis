// For when a user needs to access a protected resource

import Storage from "../user/userStorage";

export default function authHeader() {
  const sessionToken = Storage.getCurrentToken();

  if (sessionToken) {
    return { Authorization: 'Bearer ' + sessionToken };
  }
  return { Authorization: '' };
}