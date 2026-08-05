const fs = require('fs');

const uploader = fs.readFileSync('components/OwnerMediaUploader.tsx', 'utf8');

for (const forbidden of ['mockImages', 'addMockFile', 'mock upload']) {
  if (uploader.includes(forbidden)) {
    throw new Error(`Mock upload marker still exists: ${forbidden}`);
  }
}

for (const marker of [
  "React.createElement('input'",
  "type: 'file'",
  'multiple: true',
  'supportedPhotoMimeTypes',
  'maxPhotoFileSize',
  '15 МБ',
  'Сделать обложкой',
  'movePhoto',
  'normalizePhotoState',
]) {
  if (!uploader.includes(marker)) {
    throw new Error(`Owner photo uploader is missing marker: ${marker}`);
  }
}

const ownerTypes = fs.readFileSync('data/ownerTypes.ts', 'utf8');
for (const marker of ['PropertyPhotoCategory', 'PropertyPhoto', 'localUri', 'remoteUrl', 'isCover', 'uploadStatus']) {
  if (!ownerTypes.includes(marker)) {
    throw new Error(`Owner media type is missing marker: ${marker}`);
  }
}

const ownerForm = fs.readFileSync('app/owner-submission.tsx', 'utf8');
for (const marker of ['Добавьте реальные фотографии объекта', 'Минимум для отправки', 'onChange={updateMedia}', 'Фото квартиры не добавлено']) {
  if (!ownerForm.includes(marker)) {
    throw new Error(`Owner form is missing photo upload marker: ${marker}`);
  }
}

const admin = fs.readFileSync('app/admin-submission.tsx', 'utf8');
for (const marker of ['Квартира', 'Двор', 'Подъезд', 'Вид из окна', 'Обложка']) {
  if (!admin.includes(marker)) {
    throw new Error(`Admin photo moderation marker is missing: ${marker}`);
  }
}

const storage = fs.readFileSync('data/photoStorage.ts', 'utf8');
for (const marker of ['PhotoStorageAdapter', 'LocalPhotoStorageAdapter', 'Remote photo storage is not connected yet']) {
  if (!storage.includes(marker)) {
    throw new Error(`Photo storage marker is missing: ${marker}`);
  }
}

console.log('Owner photo upload check OK');
