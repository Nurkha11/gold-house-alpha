const fs = require('fs');

const uploader = fs.readFileSync('components/OwnerMediaUploader.tsx', 'utf8');
const ownerTypes = fs.readFileSync('data/ownerTypes.ts', 'utf8');
const ownerStore = fs.readFileSync('data/ownerStore.ts', 'utf8');
const adminSubmission = fs.readFileSync('app/admin-submission.tsx', 'utf8');
const propertyDetails = fs.readFileSync('app/property/[id].tsx', 'utf8');
const videoStorage = fs.readFileSync('data/videoStorage.ts', 'utf8');

for (const forbidden of ['addVideoFile', 'fake progress', 'fake remoteUrl', 'YouTube']) {
  if (uploader.includes(forbidden)) {
    throw new Error(`Forbidden video upload marker still exists: ${forbidden}`);
  }
}

for (const marker of [
  "accept: 'video/mp4,video/quicktime,video/x-m4v,video/webm'",
  'multiple: false',
  'supportedVideoMimeTypes',
  'maxVideoFileSize',
  '300 МБ',
  'readVideoMetadata',
  'createVideoElement',
  'Заменить видео',
  'remoteUrl: null',
]) {
  if (!uploader.includes(marker)) {
    throw new Error(`Missing owner video uploader marker: ${marker}`);
  }
}

for (const marker of ['PropertyVideoCategory', 'PropertyVideo', 'thumbnailUri', 'uploadProgress']) {
  if (!ownerTypes.includes(marker)) {
    throw new Error(`Missing video type marker: ${marker}`);
  }
}

for (const marker of ['PropertyVideo', 'formatVideoDuration', 'remoteUrl: file.remoteUrl']) {
  if (!ownerStore.includes(marker)) {
    throw new Error(`Missing owner store video marker: ${marker}`);
  }
}

for (const marker of ['renderMediaPreview', "React.createElement('video'", 'Локально']) {
  if (!adminSubmission.includes(marker)) {
    throw new Error(`Missing admin video preview marker: ${marker}`);
  }
}

for (const marker of ['videoPlayerCard', "React.createElement('video'", 'property.videos[index]?.uri']) {
  if (!propertyDetails.includes(marker)) {
    throw new Error(`Missing buyer video preview marker: ${marker}`);
  }
}

for (const marker of ['VideoStorageAdapter', 'LocalVideoStorageAdapter', 'Remote video storage is not connected yet']) {
  if (!videoStorage.includes(marker)) {
    throw new Error(`Missing video storage marker: ${marker}`);
  }
}

console.log('Owner video upload check OK');
