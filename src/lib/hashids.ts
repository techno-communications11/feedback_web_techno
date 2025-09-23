import Hashids from "hashids";

const hashids = new Hashids(
  "bce2ba0eee4d85d66c5c20a03e43f3da4b151a5b95a87dbb50b54869a01cd3ffe670bf596379e6945a1df9cb15f86ea68046960e51bbebd60ef59be5dbca8573",
  100
); // salt + min length

export const encodeId = (id: number) => hashids.encode(id);
export const decodeId = (hash: string) => hashids.decode(hash)[0];
