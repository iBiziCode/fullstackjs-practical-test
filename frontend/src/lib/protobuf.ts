import protobuf from 'protobufjs';

let userRoot: protobuf.Root | null = null;

export async function loadUserProto() {
  if (userRoot) return userRoot;
  userRoot = await protobuf.load('/proto/user.proto');
  return userRoot;
}

export async function decodeUsers(buffer: ArrayBuffer) {
  const root = await loadUserProto();
  const UserList = root.lookupType('users.UserList');
  const uint8Array = new Uint8Array(buffer);
  const message = UserList.decode(uint8Array);
  return UserList.toObject(message, { enums: String });
}
