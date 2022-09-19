// For when a user needs to access a protected resource

import { Metadata } from "grpc-web";
import Storage from "../global/userStorage";

export default function authHeader() {
  const sessionToken = Storage.getCurrentToken();

  const metadata = {} as Metadata;
  if (sessionToken) {
    // https://stackoverflow.com/questions/69948951/is-token-based-authentication-for-grpc-adds-metadata-for-each-call
    metadata["custom-auth-header"] = sessionToken
  } else {
    metadata["custom-auth-header"] = ""
  }
  return metadata;
}