exports.id=4961,exports.ids=[4961],exports.modules={26303:(e,i)=>{/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */i.i=function(e,i,t,r,n){var a,s,f=8*n-r-1,c=(1<<f)-1,o=c>>1,m=-7,h=t?n-1:0,p=t?-1:1,u=e[i+h];for(h+=p,a=u&(1<<-m)-1,u>>=-m,m+=f;m>0;a=256*a+e[i+h],h+=p,m-=8);for(s=a&(1<<-m)-1,a>>=-m,m+=r;m>0;s=256*s+e[i+h],h+=p,m-=8);if(0===a)a=1-o;else{if(a===c)return s?NaN:(u?-1:1)*(1/0);s+=Math.pow(2,r),a-=o}return(u?-1:1)*s*Math.pow(2,a-r)},i.c=function(e,i,t,r,n,a){var s,f,c,o=8*a-n-1,m=(1<<o)-1,h=m>>1,p=23===n?5960464477539062e-23:0,u=r?0:a-1,l=r?1:-1,d=i<0||0===i&&1/i<0?1:0;for(isNaN(i=Math.abs(i))||i===1/0?(f=isNaN(i)?1:0,s=m):(s=Math.floor(Math.log(i)/Math.LN2),i*(c=Math.pow(2,-s))<1&&(s--,c*=2),s+h>=1?i+=p/c:i+=p*Math.pow(2,1-h),i*c>=2&&(s++,c/=2),s+h>=m?(f=0,s=m):s+h>=1?(f=(i*c-1)*Math.pow(2,n),s+=h):(f=i*Math.pow(2,h-1)*Math.pow(2,n),s=0));n>=8;e[t+u]=255&f,u+=l,f/=256,n-=8);for(s=s<<n|f,o+=n;o>0;e[t+u]=255&s,u+=l,s/=256,o-=8);e[t+u-l]|=128*d}},64961:(e,i,t)=>{"use strict";t.d(i,{pM:()=>fileTypeFromBuffer});var r=t(87561);r.existsSync,r.createReadStream;let EndOfFileStream_EndOfStreamError=class EndOfFileStream_EndOfStreamError extends Error{constructor(){super("End-Of-Stream")}};var n=t(72254);let AbstractTokenizer_AbstractTokenizer=class AbstractTokenizer_AbstractTokenizer{constructor(e){this.position=0,this.numBuffer=new Uint8Array(8),this.fileInfo=e||{}}async readToken(e,i=this.position){let t=n.Buffer.alloc(e.len),r=await this.readBuffer(t,{position:i});if(r<e.len)throw new EndOfFileStream_EndOfStreamError;return e.get(t,0)}async peekToken(e,i=this.position){let t=n.Buffer.alloc(e.len),r=await this.peekBuffer(t,{position:i});if(r<e.len)throw new EndOfFileStream_EndOfStreamError;return e.get(t,0)}async readNumber(e){let i=await this.readBuffer(this.numBuffer,{length:e.len});if(i<e.len)throw new EndOfFileStream_EndOfStreamError;return e.get(this.numBuffer,0)}async peekNumber(e){let i=await this.peekBuffer(this.numBuffer,{length:e.len});if(i<e.len)throw new EndOfFileStream_EndOfStreamError;return e.get(this.numBuffer,0)}async ignore(e){if(void 0!==this.fileInfo.size){let i=this.fileInfo.size-this.position;if(e>i)return this.position+=i,i}return this.position+=e,e}async close(){}normalizeOptions(e,i){if(i&&void 0!==i.position&&i.position<this.position)throw Error("`options.position` must be equal or greater than `tokenizer.position`");return i?{mayBeLess:!0===i.mayBeLess,offset:i.offset?i.offset:0,length:i.length?i.length:e.length-(i.offset?i.offset:0),position:i.position?i.position:this.position}:{mayBeLess:!1,offset:0,length:e.length,position:this.position}}};let BufferTokenizer=class BufferTokenizer extends AbstractTokenizer_AbstractTokenizer{constructor(e,i){super(i),this.uint8Array=e,this.fileInfo.size=this.fileInfo.size?this.fileInfo.size:e.length}async readBuffer(e,i){if(i&&i.position){if(i.position<this.position)throw Error("`options.position` must be equal or greater than `tokenizer.position`");this.position=i.position}let t=await this.peekBuffer(e,i);return this.position+=t,t}async peekBuffer(e,i){let t=this.normalizeOptions(e,i),r=Math.min(this.uint8Array.length-t.position,t.length);if(t.mayBeLess||!(r<t.length))return e.set(this.uint8Array.subarray(t.position,t.position+r),t.offset),r;throw new EndOfFileStream_EndOfStreamError}async close(){}};function dv(e){return new DataView(e.buffer,e.byteOffset)}t(26303);let a={len:1,get:(e,i)=>dv(e).getUint8(i),put:(e,i,t)=>(dv(e).setUint8(i,t),i+1)},s={len:2,get:(e,i)=>dv(e).getUint16(i,!0),put:(e,i,t)=>(dv(e).setUint16(i,t,!0),i+2)},f={len:2,get:(e,i)=>dv(e).getUint16(i),put:(e,i,t)=>(dv(e).setUint16(i,t),i+2)},c={len:4,get:(e,i)=>dv(e).getUint32(i,!0),put:(e,i,t)=>(dv(e).setUint32(i,t,!0),i+4)},o={len:4,get:(e,i)=>dv(e).getUint32(i),put:(e,i,t)=>(dv(e).setUint32(i,t),i+4)},m={len:4,get:(e,i)=>dv(e).getInt32(i),put:(e,i,t)=>(dv(e).setInt32(i,t),i+4)},h={len:8,get:(e,i)=>dv(e).getBigUint64(i,!0),put:(e,i,t)=>(dv(e).setBigUint64(i,t,!0),i+8)};let StringType=class StringType{constructor(e,i){this.len=e,this.encoding=i}get(e,i){return n.Buffer.from(e).toString(this.encoding,i,i+this.len)}};let AnsiStringType=class AnsiStringType{constructor(e){this.len=e}static decode(e,i,t){let r="";for(let n=i;n<t;++n)r+=AnsiStringType.codePointToString(AnsiStringType.singleByteDecoder(e[n]));return r}static inRange(e,i,t){return i<=e&&e<=t}static codePointToString(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(((e-=65536)>>10)+55296,(1023&e)+56320)}static singleByteDecoder(e){if(AnsiStringType.inRange(e,0,127))return e;let i=AnsiStringType.windows1252[e-128];if(null===i)throw Error("invaliding encoding");return i}get(e,i=0){return AnsiStringType.decode(e,i,i+this.len)}};AnsiStringType.windows1252=[8364,129,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,141,381,143,144,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,157,382,376,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255];let p={get:(e,i)=>127&e[i+3]|e[i+2]<<7|e[i+1]<<14|e[i]<<21,len:4};async function fileTypeFromBuffer(e){if(!(e instanceof Uint8Array||e instanceof ArrayBuffer))throw TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof e}\``);let i=e instanceof Uint8Array?e:new Uint8Array(e);if(i?.length>1)return core_fileTypeFromTokenizer(new BufferTokenizer(i,void 0))}function _check(e,i,t){for(let[r,n]of(t={offset:0,...t},i.entries()))if(t.mask){if(n!==(t.mask[r]&e[r+t.offset]))return!1}else if(n!==e[r+t.offset])return!1;return!0}async function core_fileTypeFromTokenizer(e){try{return new FileTypeParser().parse(e)}catch(e){if(!(e instanceof EndOfFileStream_EndOfStreamError))throw e}}let FileTypeParser=class FileTypeParser{check(e,i){return _check(this.buffer,e,i)}checkString(e,i){return this.check([...e].map(e=>e.charCodeAt(0)),i)}async parse(e){if(this.buffer=n.Buffer.alloc(4100),void 0===e.fileInfo.size&&(e.fileInfo.size=Number.MAX_SAFE_INTEGER),this.tokenizer=e,await e.peekBuffer(this.buffer,{length:12,mayBeLess:!0}),this.check([66,77]))return{ext:"bmp",mime:"image/bmp"};if(this.check([11,119]))return{ext:"ac3",mime:"audio/vnd.dolby.dd-raw"};if(this.check([120,1]))return{ext:"dmg",mime:"application/x-apple-diskimage"};if(this.check([77,90]))return{ext:"exe",mime:"application/x-msdownload"};if(this.check([37,33]))return(await e.peekBuffer(this.buffer,{length:24,mayBeLess:!0}),this.checkString("PS-Adobe-",{offset:2})&&this.checkString(" EPSF-",{offset:14}))?{ext:"eps",mime:"application/eps"}:{ext:"ps",mime:"application/postscript"};if(this.check([31,160])||this.check([31,157]))return{ext:"Z",mime:"application/x-compress"};if(this.check([199,113]))return{ext:"cpio",mime:"application/x-cpio"};if(this.check([96,234]))return{ext:"arj",mime:"application/x-arj"};if(this.check([239,187,191]))return this.tokenizer.ignore(3),this.parse(e);if(this.check([71,73,70]))return{ext:"gif",mime:"image/gif"};if(this.check([73,73,188]))return{ext:"jxr",mime:"image/vnd.ms-photo"};if(this.check([31,139,8]))return{ext:"gz",mime:"application/gzip"};if(this.check([66,90,104]))return{ext:"bz2",mime:"application/x-bzip2"};if(this.checkString("ID3")){await e.ignore(6);let i=await e.readToken(p);return e.position+i>e.fileInfo.size?{ext:"mp3",mime:"audio/mpeg"}:(await e.ignore(i),core_fileTypeFromTokenizer(e))}if(this.checkString("MP+"))return{ext:"mpc",mime:"audio/x-musepack"};if((67===this.buffer[0]||70===this.buffer[0])&&this.check([87,83],{offset:1}))return{ext:"swf",mime:"application/x-shockwave-flash"};if(this.check([255,216,255]))return this.check([247],{offset:3})?{ext:"jls",mime:"image/jls"}:{ext:"jpg",mime:"image/jpeg"};if(this.check([79,98,106,1]))return{ext:"avro",mime:"application/avro"};if(this.checkString("FLIF"))return{ext:"flif",mime:"image/flif"};if(this.checkString("8BPS"))return{ext:"psd",mime:"image/vnd.adobe.photoshop"};if(this.checkString("WEBP",{offset:8}))return{ext:"webp",mime:"image/webp"};if(this.checkString("MPCK"))return{ext:"mpc",mime:"audio/x-musepack"};if(this.checkString("FORM"))return{ext:"aif",mime:"audio/aiff"};if(this.checkString("icns",{offset:0}))return{ext:"icns",mime:"image/icns"};if(this.check([80,75,3,4])){try{for(;e.position+30<e.fileInfo.size;){await e.readBuffer(this.buffer,{length:30});let i={compressedSize:this.buffer.readUInt32LE(18),uncompressedSize:this.buffer.readUInt32LE(22),filenameLength:this.buffer.readUInt16LE(26),extraFieldLength:this.buffer.readUInt16LE(28)};if(i.filename=await e.readToken(new StringType(i.filenameLength,"utf-8")),await e.ignore(i.extraFieldLength),"META-INF/mozilla.rsa"===i.filename)return{ext:"xpi",mime:"application/x-xpinstall"};if(i.filename.endsWith(".rels")||i.filename.endsWith(".xml")){let e=i.filename.split("/")[0];switch(e){case"_rels":break;case"word":return{ext:"docx",mime:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"};case"ppt":return{ext:"pptx",mime:"application/vnd.openxmlformats-officedocument.presentationml.presentation"};case"xl":return{ext:"xlsx",mime:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}}}if(i.filename.startsWith("xl/"))return{ext:"xlsx",mime:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};if(i.filename.startsWith("3D/")&&i.filename.endsWith(".model"))return{ext:"3mf",mime:"model/3mf"};if("mimetype"===i.filename&&i.compressedSize===i.uncompressedSize){let t=await e.readToken(new StringType(i.compressedSize,"utf-8"));switch(t=t.trim()){case"application/epub+zip":return{ext:"epub",mime:"application/epub+zip"};case"application/vnd.oasis.opendocument.text":return{ext:"odt",mime:"application/vnd.oasis.opendocument.text"};case"application/vnd.oasis.opendocument.spreadsheet":return{ext:"ods",mime:"application/vnd.oasis.opendocument.spreadsheet"};case"application/vnd.oasis.opendocument.presentation":return{ext:"odp",mime:"application/vnd.oasis.opendocument.presentation"}}}if(0===i.compressedSize){let i=-1;for(;i<0&&e.position<e.fileInfo.size;)await e.peekBuffer(this.buffer,{mayBeLess:!0}),i=this.buffer.indexOf("504B0304",0,"hex"),await e.ignore(i>=0?i:this.buffer.length)}else await e.ignore(i.compressedSize)}}catch(e){if(!(e instanceof EndOfFileStream_EndOfStreamError))throw e}return{ext:"zip",mime:"application/zip"}}if(this.checkString("OggS")){await e.ignore(28);let i=n.Buffer.alloc(8);return(await e.readBuffer(i),_check(i,[79,112,117,115,72,101,97,100]))?{ext:"opus",mime:"audio/opus"}:_check(i,[128,116,104,101,111,114,97])?{ext:"ogv",mime:"video/ogg"}:_check(i,[1,118,105,100,101,111,0])?{ext:"ogm",mime:"video/ogg"}:_check(i,[127,70,76,65,67])?{ext:"oga",mime:"audio/ogg"}:_check(i,[83,112,101,101,120,32,32])?{ext:"spx",mime:"audio/ogg"}:_check(i,[1,118,111,114,98,105,115])?{ext:"ogg",mime:"audio/ogg"}:{ext:"ogx",mime:"application/ogg"}}if(this.check([80,75])&&(3===this.buffer[2]||5===this.buffer[2]||7===this.buffer[2])&&(4===this.buffer[3]||6===this.buffer[3]||8===this.buffer[3]))return{ext:"zip",mime:"application/zip"};if(this.checkString("ftyp",{offset:4})&&(96&this.buffer[8])!=0){let e=this.buffer.toString("binary",8,12).replace("\x00"," ").trim();switch(e){case"avif":case"avis":return{ext:"avif",mime:"image/avif"};case"mif1":return{ext:"heic",mime:"image/heif"};case"msf1":return{ext:"heic",mime:"image/heif-sequence"};case"heic":case"heix":return{ext:"heic",mime:"image/heic"};case"hevc":case"hevx":return{ext:"heic",mime:"image/heic-sequence"};case"qt":return{ext:"mov",mime:"video/quicktime"};case"M4V":case"M4VH":case"M4VP":return{ext:"m4v",mime:"video/x-m4v"};case"M4P":return{ext:"m4p",mime:"video/mp4"};case"M4B":return{ext:"m4b",mime:"audio/mp4"};case"M4A":return{ext:"m4a",mime:"audio/x-m4a"};case"F4V":return{ext:"f4v",mime:"video/mp4"};case"F4P":return{ext:"f4p",mime:"video/mp4"};case"F4A":return{ext:"f4a",mime:"audio/mp4"};case"F4B":return{ext:"f4b",mime:"audio/mp4"};case"crx":return{ext:"cr3",mime:"image/x-canon-cr3"};default:if(e.startsWith("3g")){if(e.startsWith("3g2"))return{ext:"3g2",mime:"video/3gpp2"};return{ext:"3gp",mime:"video/3gpp"}}return{ext:"mp4",mime:"video/mp4"}}}if(this.checkString("MThd"))return{ext:"mid",mime:"audio/midi"};if(this.checkString("wOFF")&&(this.check([0,1,0,0],{offset:4})||this.checkString("OTTO",{offset:4})))return{ext:"woff",mime:"font/woff"};if(this.checkString("wOF2")&&(this.check([0,1,0,0],{offset:4})||this.checkString("OTTO",{offset:4})))return{ext:"woff2",mime:"font/woff2"};if(this.check([212,195,178,161])||this.check([161,178,195,212]))return{ext:"pcap",mime:"application/vnd.tcpdump.pcap"};if(this.checkString("DSD "))return{ext:"dsf",mime:"audio/x-dsf"};if(this.checkString("LZIP"))return{ext:"lz",mime:"application/x-lzip"};if(this.checkString("fLaC"))return{ext:"flac",mime:"audio/x-flac"};if(this.check([66,80,71,251]))return{ext:"bpg",mime:"image/bpg"};if(this.checkString("wvpk"))return{ext:"wv",mime:"audio/wavpack"};if(this.checkString("%PDF")){try{await e.ignore(1350);let i=n.Buffer.alloc(Math.min(10485760,e.fileInfo.size));if(await e.readBuffer(i,{mayBeLess:!0}),i.includes(n.Buffer.from("AIPrivateData")))return{ext:"ai",mime:"application/postscript"}}catch(e){if(!(e instanceof EndOfFileStream_EndOfStreamError))throw e}return{ext:"pdf",mime:"application/pdf"}}if(this.check([0,97,115,109]))return{ext:"wasm",mime:"application/wasm"};if(this.check([73,73])){let e=await this.readTiffHeader(!1);if(e)return e}if(this.check([77,77])){let e=await this.readTiffHeader(!0);if(e)return e}if(this.checkString("MAC "))return{ext:"ape",mime:"audio/ape"};if(this.check([26,69,223,163])){async function readField(){let i=await e.peekNumber(a),t=128,r=0;for(;(i&t)==0&&0!==t;)++r,t>>=1;let s=n.Buffer.alloc(r+1);return await e.readBuffer(s),s}async function readElement(){let e=await readField(),i=await readField();i[0]^=128>>i.length-1;let t=Math.min(6,i.length);return{id:e.readUIntBE(0,e.length),len:i.readUIntBE(i.length-t,t)}}async function readChildren(i){for(;i>0;){let t=await readElement();if(17026===t.id){let i=await e.readToken(new StringType(t.len,"utf-8"));return i.replace(/\00.*$/g,"")}await e.ignore(t.len),--i}}let i=await readElement(),t=await readChildren(i.len);switch(t){case"webm":return{ext:"webm",mime:"video/webm"};case"matroska":return{ext:"mkv",mime:"video/x-matroska"};default:return}}if(this.check([82,73,70,70])){if(this.check([65,86,73],{offset:8}))return{ext:"avi",mime:"video/vnd.avi"};if(this.check([87,65,86,69],{offset:8}))return{ext:"wav",mime:"audio/vnd.wave"};if(this.check([81,76,67,77],{offset:8}))return{ext:"qcp",mime:"audio/qcelp"}}if(this.checkString("SQLi"))return{ext:"sqlite",mime:"application/x-sqlite3"};if(this.check([78,69,83,26]))return{ext:"nes",mime:"application/x-nintendo-nes-rom"};if(this.checkString("Cr24"))return{ext:"crx",mime:"application/x-google-chrome-extension"};if(this.checkString("MSCF")||this.checkString("ISc("))return{ext:"cab",mime:"application/vnd.ms-cab-compressed"};if(this.check([237,171,238,219]))return{ext:"rpm",mime:"application/x-rpm"};if(this.check([197,208,211,198]))return{ext:"eps",mime:"application/eps"};if(this.check([40,181,47,253]))return{ext:"zst",mime:"application/zstd"};if(this.check([127,69,76,70]))return{ext:"elf",mime:"application/x-elf"};if(this.check([33,66,68,78]))return{ext:"pst",mime:"application/vnd.ms-outlook"};if(this.checkString("PAR1"))return{ext:"parquet",mime:"application/x-parquet"};if(this.check([79,84,84,79,0]))return{ext:"otf",mime:"font/otf"};if(this.checkString("#!AMR"))return{ext:"amr",mime:"audio/amr"};if(this.checkString("{\\rtf"))return{ext:"rtf",mime:"application/rtf"};if(this.check([70,76,86,1]))return{ext:"flv",mime:"video/x-flv"};if(this.checkString("IMPM"))return{ext:"it",mime:"audio/x-it"};if(this.checkString("-lh0-",{offset:2})||this.checkString("-lh1-",{offset:2})||this.checkString("-lh2-",{offset:2})||this.checkString("-lh3-",{offset:2})||this.checkString("-lh4-",{offset:2})||this.checkString("-lh5-",{offset:2})||this.checkString("-lh6-",{offset:2})||this.checkString("-lh7-",{offset:2})||this.checkString("-lzs-",{offset:2})||this.checkString("-lz4-",{offset:2})||this.checkString("-lz5-",{offset:2})||this.checkString("-lhd-",{offset:2}))return{ext:"lzh",mime:"application/x-lzh-compressed"};if(this.check([0,0,1,186])){if(this.check([33],{offset:4,mask:[241]}))return{ext:"mpg",mime:"video/MP1S"};if(this.check([68],{offset:4,mask:[196]}))return{ext:"mpg",mime:"video/MP2P"}}if(this.checkString("ITSF"))return{ext:"chm",mime:"application/vnd.ms-htmlhelp"};if(this.check([202,254,186,190]))return{ext:"class",mime:"application/java-vm"};if(this.check([253,55,122,88,90,0]))return{ext:"xz",mime:"application/x-xz"};if(this.checkString("<?xml "))return{ext:"xml",mime:"application/xml"};if(this.check([55,122,188,175,39,28]))return{ext:"7z",mime:"application/x-7z-compressed"};if(this.check([82,97,114,33,26,7])&&(0===this.buffer[6]||1===this.buffer[6]))return{ext:"rar",mime:"application/x-rar-compressed"};if(this.checkString("solid "))return{ext:"stl",mime:"model/stl"};if(this.checkString("AC")){let e=this.buffer.toString("binary",2,6);if(e.match("^d*")&&e>=1e3&&e<=1050)return{ext:"dwg",mime:"image/vnd.dwg"}}if(this.checkString("070707"))return{ext:"cpio",mime:"application/x-cpio"};if(this.checkString("BLENDER"))return{ext:"blend",mime:"application/x-blender"};if(this.checkString("!<arch>")){await e.ignore(8);let i=await e.readToken(new StringType(13,"ascii"));return"debian-binary"===i?{ext:"deb",mime:"application/x-deb"}:{ext:"ar",mime:"application/x-unix-archive"}}if(this.checkString("**ACE",{offset:7})&&(await e.peekBuffer(this.buffer,{length:14,mayBeLess:!0}),this.checkString("**",{offset:12})))return{ext:"ace",mime:"application/x-ace-compressed"};if(this.check([137,80,78,71,13,10,26,10])){async function readChunkHeader(){return{length:await e.readToken(m),type:await e.readToken(new StringType(4,"binary"))}}await e.ignore(8);do{let i=await readChunkHeader();if(i.length<0)return;switch(i.type){case"IDAT":return{ext:"png",mime:"image/png"};case"acTL":return{ext:"apng",mime:"image/apng"};default:await e.ignore(i.length+4)}}while(e.position+8<e.fileInfo.size);return{ext:"png",mime:"image/png"}}if(this.check([65,82,82,79,87,49,0,0]))return{ext:"arrow",mime:"application/x-apache-arrow"};if(this.check([103,108,84,70,2,0,0,0]))return{ext:"glb",mime:"model/gltf-binary"};if(this.check([102,114,101,101],{offset:4})||this.check([109,100,97,116],{offset:4})||this.check([109,111,111,118],{offset:4})||this.check([119,105,100,101],{offset:4}))return{ext:"mov",mime:"video/quicktime"};if(this.check([73,73,82,79,8,0,0,0,24]))return{ext:"orf",mime:"image/x-olympus-orf"};if(this.checkString("gimp xcf "))return{ext:"xcf",mime:"image/x-xcf"};if(this.check([73,73,85,0,24,0,0,0,136,231,116,216]))return{ext:"rw2",mime:"image/x-panasonic-rw2"};if(this.check([48,38,178,117,142,102,207,17,166,217])){async function readHeader(){let i=n.Buffer.alloc(16);return await e.readBuffer(i),{id:i,size:Number(await e.readToken(h))}}for(await e.ignore(30);e.position+24<e.fileInfo.size;){let i=await readHeader(),t=i.size-24;if(_check(i.id,[145,7,220,183,183,169,207,17,142,230,0,192,12,32,83,101])){let i=n.Buffer.alloc(16);if(t-=await e.readBuffer(i),_check(i,[64,158,105,248,77,91,207,17,168,253,0,128,95,92,68,43]))return{ext:"asf",mime:"audio/x-ms-asf"};if(_check(i,[192,239,25,188,77,91,207,17,168,253,0,128,95,92,68,43]))return{ext:"asf",mime:"video/x-ms-asf"};break}await e.ignore(t)}return{ext:"asf",mime:"application/vnd.ms-asf"}}if(this.check([171,75,84,88,32,49,49,187,13,10,26,10]))return{ext:"ktx",mime:"image/ktx"};if((this.check([126,16,4])||this.check([126,24,4]))&&this.check([48,77,73,69],{offset:4}))return{ext:"mie",mime:"application/x-mie"};if(this.check([39,10,0,0,0,0,0,0,0,0,0,0],{offset:2}))return{ext:"shp",mime:"application/x-esri-shape"};if(this.check([255,79,255,81]))return{ext:"j2c",mime:"image/j2c"};if(this.check([0,0,0,12,106,80,32,32,13,10,135,10])){await e.ignore(20);let i=await e.readToken(new StringType(4,"ascii"));switch(i){case"jp2 ":return{ext:"jp2",mime:"image/jp2"};case"jpx ":return{ext:"jpx",mime:"image/jpx"};case"jpm ":return{ext:"jpm",mime:"image/jpm"};case"mjp2":return{ext:"mj2",mime:"image/mj2"};default:return}}if(this.check([255,10])||this.check([0,0,0,12,74,88,76,32,13,10,135,10]))return{ext:"jxl",mime:"image/jxl"};if(this.check([254,255]))return this.check([0,60,0,63,0,120,0,109,0,108],{offset:2})?{ext:"xml",mime:"application/xml"}:void 0;if(this.check([0,0,1,186])||this.check([0,0,1,179]))return{ext:"mpg",mime:"video/mpeg"};if(this.check([0,1,0,0,0]))return{ext:"ttf",mime:"font/ttf"};if(this.check([0,0,1,0]))return{ext:"ico",mime:"image/x-icon"};if(this.check([0,0,2,0]))return{ext:"cur",mime:"image/x-icon"};if(this.check([208,207,17,224,161,177,26,225]))return{ext:"cfb",mime:"application/x-cfb"};if(await e.peekBuffer(this.buffer,{length:Math.min(256,e.fileInfo.size),mayBeLess:!0}),this.check([97,99,115,112],{offset:36}))return{ext:"icc",mime:"application/vnd.iccprofile"};if(this.checkString("BEGIN:")){if(this.checkString("VCARD",{offset:6}))return{ext:"vcf",mime:"text/vcard"};if(this.checkString("VCALENDAR",{offset:6}))return{ext:"ics",mime:"text/calendar"}}if(this.checkString("FUJIFILMCCD-RAW"))return{ext:"raf",mime:"image/x-fujifilm-raf"};if(this.checkString("Extended Module:"))return{ext:"xm",mime:"audio/x-xm"};if(this.checkString("Creative Voice File"))return{ext:"voc",mime:"audio/x-voc"};if(this.check([4,0,0,0])&&this.buffer.length>=16){let e=this.buffer.readUInt32LE(12);if(e>12&&this.buffer.length>=e+16)try{let i=this.buffer.slice(16,e+16).toString(),t=JSON.parse(i);if(t.files)return{ext:"asar",mime:"application/x-asar"}}catch{}}if(this.check([6,14,43,52,2,5,1,1,13,1,2,1,1,2]))return{ext:"mxf",mime:"application/mxf"};if(this.checkString("SCRM",{offset:44}))return{ext:"s3m",mime:"audio/x-s3m"};if(this.check([71])&&this.check([71],{offset:188})||this.check([71],{offset:4})&&this.check([71],{offset:196}))return{ext:"mts",mime:"video/mp2t"};if(this.check([66,79,79,75,77,79,66,73],{offset:60}))return{ext:"mobi",mime:"application/x-mobipocket-ebook"};if(this.check([68,73,67,77],{offset:128}))return{ext:"dcm",mime:"application/dicom"};if(this.check([76,0,0,0,1,20,2,0,0,0,0,0,192,0,0,0,0,0,0,70]))return{ext:"lnk",mime:"application/x.ms.shortcut"};if(this.check([98,111,111,107,0,0,0,0,109,97,114,107,0,0,0,0]))return{ext:"alias",mime:"application/x.apple.alias"};if(this.check([76,80],{offset:34})&&(this.check([0,0,1],{offset:8})||this.check([1,0,2],{offset:8})||this.check([2,0,2],{offset:8})))return{ext:"eot",mime:"application/vnd.ms-fontobject"};if(this.check([6,6,237,245,216,29,70,229,189,49,239,231,254,116,183,29]))return{ext:"indd",mime:"application/x-indesign"};if(await e.peekBuffer(this.buffer,{length:Math.min(512,e.fileInfo.size),mayBeLess:!0}),function(e,i=0){let t=Number.parseInt(e.toString("utf8",148,154).replace(/\0.*$/,"").trim(),8);if(Number.isNaN(t))return!1;let r=256;for(let t=i;t<i+148;t++)r+=e[t];for(let t=i+156;t<i+512;t++)r+=e[t];return t===r}(this.buffer))return{ext:"tar",mime:"application/x-tar"};if(this.check([255,254]))return this.check([60,0,63,0,120,0,109,0,108,0],{offset:2})?{ext:"xml",mime:"application/xml"}:this.check([255,14,83,0,107,0,101,0,116,0,99,0,104,0,85,0,112,0,32,0,77,0,111,0,100,0,101,0,108,0],{offset:2})?{ext:"skp",mime:"application/vnd.sketchup.skp"}:void 0;if(this.checkString("-----BEGIN PGP MESSAGE-----"))return{ext:"pgp",mime:"application/pgp-encrypted"};if(this.buffer.length>=2&&this.check([255,224],{offset:0,mask:[255,224]})){if(this.check([16],{offset:1,mask:[22]}))return this.check([8],{offset:1,mask:[8]}),{ext:"aac",mime:"audio/aac"};if(this.check([2],{offset:1,mask:[6]}))return{ext:"mp3",mime:"audio/mpeg"};if(this.check([4],{offset:1,mask:[6]}))return{ext:"mp2",mime:"audio/mpeg"};if(this.check([6],{offset:1,mask:[6]}))return{ext:"mp1",mime:"audio/mpeg"}}}async readTiffTag(e){let i=await this.tokenizer.readToken(e?f:s);switch(this.tokenizer.ignore(10),i){case 50341:return{ext:"arw",mime:"image/x-sony-arw"};case 50706:return{ext:"dng",mime:"image/x-adobe-dng"}}}async readTiffIFD(e){let i=await this.tokenizer.readToken(e?f:s);for(let t=0;t<i;++t){let i=await this.readTiffTag(e);if(i)return i}}async readTiffHeader(e){let i=(e?f:s).get(this.buffer,2),t=(e?o:c).get(this.buffer,4);if(42===i){if(t>=6){if(this.checkString("CR",{offset:8}))return{ext:"cr2",mime:"image/x-canon-cr2"};if(t>=8&&(this.check([28,0,254,0],{offset:8})||this.check([31,0,11,0],{offset:8})))return{ext:"nef",mime:"image/x-nikon-nef"}}await this.tokenizer.ignore(t);let i=await this.readTiffIFD(e);return i??{ext:"tif",mime:"image/tiff"}}if(43===i)return{ext:"tif",mime:"image/tiff"}}}}};