//parse html text as dom
export const parser = txt => new DOMParser().parseFromString(txt, 'text/html');
//handle fetch data and parse it with required dataType
export const req = (url, opts, dataType) => fetch(url, opts ? opts : {}).then(e => e[dataType]())
//request url and parse response as json
export const reqJSON = (url, opts) => req(url, opts, 'json')
//request url and parse response as text
export const reqText = (url, opts) => req(url, opts, 'text')
//request url and parse response as arrayBuffer
export const reqBuff = (url, opts) => req(url, opts, 'arrayBuffer')
//set attributes for and element as object
export const setAttr = (el, obj) => {
  for (let i in obj) el.setAttribute(i, obj[i]);
  return el
}
//create element with {tagName} + get attributes as object 
export const createEl = (tag, attributes) => setAttr(document.createElement(tag), { ...attributes })
//parse arrayBuffer as base64 str
export const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
//a function to download arrayBuffer to user device
export const downloadByteArray = (name, ext, type, byte) => {
  let link = createEl('a', {
    href: "data:" + type + ";base64," + arrayBufferToBase64(byte),
    //add the file extension at the end of the file name to avoid download attribute conflict between the real file type and file name for example if the file name contains (.com) it's will use it as the file extention so use the file extension eveytime
    download: name + '.' + ext
  })
  link.click();
  return link
}