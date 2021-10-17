const NodeRSA = require("node-rsa");
const fs = require("fs");

const privateKey = fs.readFileSync("./pkcs8.key").toString();
const publicKey = fs.readFileSync("./publickey.crt").toString();

console.log({ privateKey, publicKey });

const rsaPublic = new NodeRSA(publicKey, "pkcs8-public", {
  encryptionScheme: "pkcs1",
});
const rsaPrivate = new NodeRSA(privateKey, "pkcs8-private", {
  encryptionScheme: "pkcs1",
});

const jsonData = {
  id: 1,
  name: "some-data",
  timestamp: Date.now(),
};

const jsonString = JSON.stringify(jsonData);

{
  // Encode with Private
  // And Decode wtth Public or Private Key
  const encoded = rsaPrivate.encryptPrivate(jsonString, "base64");

  console.log({
    encodedByPrivateKey: encoded,
    decodedByPrivateKey: rsaPrivate.decryptPublic(encoded, "utf8"),
    decodedByPublicKey: rsaPublic.decryptPublic(encoded, "utf8"),
  });
}

{
  // Encode with Public Key
  // And Decode with Privare Key
  const encode = rsaPublic.encrypt(jsonString, "base64");
  console.log({
    encodeByPublicKey: encode,
    decodeByPrivateKey: rsaPrivate.decrypt(encode, "utf8"),
  });
}
{
  // Encode with Private Key
  // And Decode with Privare Key
  const encode = rsaPrivate.encrypt(jsonString, "base64");
  console.log({
    encodeByPrivateKey: encode,
    decodeByPrivateKey: rsaPrivate.decrypt(encode, "utf8"),
  });
}

{
  // Generate Signature By Private Key
  // And Verify by PrivateKey or Public Key
  const signature = rsaPrivate.sign(jsonString, "base64");
  const signBuffer = Buffer.from(signature, "base64");
  console.log({
    signatureByPrivateKey: signature,
    verifyByPrivateKey: rsaPrivate.verify(jsonString, signBuffer),
    verifyByPublicKey: rsaPublic.verify(jsonString, signBuffer),
  });
}
