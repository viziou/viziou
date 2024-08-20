//function ab2str(buf: ArrayBuffer): string {
//  return String.fromCharCode.apply(null, new Uint8Array(buf));
//}

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length*2); // 2 bytes per character
  const bufView = new Uint16Array(buf);
  for (let i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
