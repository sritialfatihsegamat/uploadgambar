// Skrip Google Apps Script: simpan gambar JPEG ke folder Drive SRITI.
const FOLDER_ID = '1pq8DQhRkh3VZ-xZo_bq14am1SVvN_C40';
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.mime !== 'image/jpeg') return out({ok:false, error:'Hanya JPEG'});
    if (!/^SRITIALFATIH2026_(ungu|hijau)_(potret|landskap)_\d{8}_\d{6}\.jpg$/.test(d.name)) return out({ok:false, error:'Nama fail tidak sah'});
    const bytes = Utilities.base64Decode(d.data);
    if (bytes.length > 10*1024*1024 || bytes[0] !== -1 || bytes[1] !== -40) return out({ok:false, error:'Bukan fail JPEG'});
    const folder = DriveApp.getFolderById(FOLDER_ID);
    if (!folder.getFilesByName(d.name).hasNext()) folder.createFile(Utilities.newBlob(bytes, 'image/jpeg', d.name));
    return out({ok:true});
  } catch (err) { return out({ok:false, error:String(err)}); }
}
function doGet() { return out({ok:true, info:'Photobooth SRITI sedia'}); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
