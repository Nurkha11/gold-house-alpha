import React, { useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { deleteLocalMediaBlob, saveLocalMediaBlob } from '@/data/localMediaStore';
import { MediaFile, PropertyPhoto, PropertyPhotoCategory, PropertyVideo, PropertyVideoCategory } from '@/data/ownerTypes';

type OwnerMediaUploaderProps = {
  media: MediaFile[];
  onAdd: (file: MediaFile) => void;
  onChange?: (media: MediaFile[]) => void;
  onRemove?: (id: string) => void;
  mode?: 'all' | 'photo' | 'video';
};

type PhotoCategoryConfig = {
  label: string;
  hint: string;
  category: PropertyPhotoCategory;
  limit: number;
};

type VideoCategoryConfig = {
  label: string;
  hint: string;
  category: PropertyVideoCategory;
  maxDuration: number;
};

const photoCategories: PhotoCategoryConfig[] = [
  {
    label: 'Фото квартиры',
    hint: 'Первая фотография используется как обложка объявления. Обложку можно изменить.',
    category: 'apartment',
    limit: 30,
  },
  { label: 'Фото двора', hint: 'Покажите двор, входные группы и пространство вокруг дома.', category: 'yard', limit: 10 },
  { label: 'Фото подъезда', hint: 'Добавьте лифт, холл, лестницу и состояние подъезда.', category: 'entrance', limit: 10 },
  { label: 'Фото вида из окна', hint: 'Покажите вид из основных окон квартиры.', category: 'view', limit: 10 },
];

const videoCategories: VideoCategoryConfig[] = [
  { label: 'Видео квартиры', hint: 'Короткий обзор квартиры до 5 минут.', category: 'apartment', maxDuration: 300 },
  { label: 'Видео двора', hint: 'Двор, парковка и окружение дома до 2 минут.', category: 'yard', maxDuration: 120 },
  { label: 'Видео подъезда', hint: 'Подъезд, лифт и входная группа до 2 минут.', category: 'entrance', maxDuration: 120 },
  { label: 'Видео собственника', hint: 'Короткое честное обращение собственника до 2 минут.', category: 'owner', maxDuration: 120 },
];

const supportedPhotoMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const blockedHeicTypes = new Set(['image/heic', 'image/heif']);
const maxPhotoFileSize = 15 * 1024 * 1024;

const supportedVideoMimeTypes = new Set(['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/webm']);
const supportedVideoExtensions = new Set(['mp4', 'mov', 'm4v', 'webm']);
const maxVideoFileSize = 300 * 1024 * 1024;

function photoUri(photo: PropertyPhoto) {
  return photo.localUri || photo.remoteUrl || photo.uri || '';
}

function videoUri(video: PropertyVideo) {
  return video.localUri || video.remoteUrl || video.uri || '';
}

function categoryPhotos(media: MediaFile[], category: PropertyPhotoCategory) {
  return media
    .filter((file): file is PropertyPhoto => file.type === 'photo' && file.category === category)
    .sort((a, b) => a.order - b.order);
}

function categoryVideo(media: MediaFile[], category: PropertyVideoCategory) {
  return media.find((file): file is PropertyVideo => file.type === 'video' && file.category === category);
}

function normalizePhotoState(files: MediaFile[]) {
  const photos = files.filter((file): file is PropertyPhoto => file.type === 'photo');
  const videos = files.filter((file): file is PropertyVideo => file.type === 'video');
  const normalizedPhotos = photoCategories.flatMap(({ category }) =>
    photos
      .filter((photo) => photo.category === category)
      .sort((a, b) => a.order - b.order)
      .map((photo, index) => ({ ...photo, order: index })),
  );
  const apartmentPhotos = normalizedPhotos.filter((photo) => photo.category === 'apartment');
  const existingCover = apartmentPhotos.find((photo) => photo.isCover);
  const coverId = existingCover?.id ?? apartmentPhotos[0]?.id;

  return [
    ...normalizedPhotos.map((photo) => ({
      ...photo,
      isCover: photo.category === 'apartment' && photo.id === coverId,
    })),
    ...videos,
  ];
}

function isFileLike(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function createDuplicateKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified || 0}`;
}

function fileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

function formatBytes(value: number | null) {
  if (!value) return 'Размер не определен';
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} МБ`;
  return `${Math.max(1, Math.round(value / 1024))} КБ`;
}

function formatDuration(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds)) return 'Длительность не определена';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

function readVideoMetadata(localUri: string) {
  return new Promise<{ duration: number | null; width: number | null; height: number | null }>((resolve) => {
    if (typeof document === 'undefined') {
      resolve({ duration: null, width: null, height: null });
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        duration: Number.isFinite(video.duration) ? video.duration : null,
        width: video.videoWidth || null,
        height: video.videoHeight || null,
      });
    };
    video.onerror = () => resolve({ duration: null, width: null, height: null });
    video.src = localUri;
  });
}

function createVideoElement(video: PropertyVideo) {
  const src = videoUri(video);

  return React.createElement('video', {
    src,
    controls: true,
    preload: 'metadata',
    style: {
      width: '100%',
      height: 170,
      borderRadius: 14,
      backgroundColor: colors.black,
      objectFit: 'cover',
    },
  });
}

function readPhotoAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function OwnerMediaUploader({ media, onChange, onRemove, mode = 'all' }: OwnerMediaUploaderProps) {
  const [activePhotoCategory, setActivePhotoCategory] = useState<PropertyPhotoCategory>('apartment');
  const [activeVideoCategory, setActiveVideoCategory] = useState<PropertyVideoCategory>('apartment');
  const [errorMessage, setErrorMessage] = useState('');
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const activePhotoCategoryRef = useRef<PropertyPhotoCategory>('apartment');
  const activeVideoCategoryRef = useRef<PropertyVideoCategory>('apartment');
  const photoMode = mode === 'all' || mode === 'photo';
  const videoMode = mode === 'all' || mode === 'video';

  function commit(nextMedia: MediaFile[]) {
    const normalized = normalizePhotoState(nextMedia);
    onChange?.(normalized);
  }

  function openPhotoPicker(category: PropertyPhotoCategory) {
    activePhotoCategoryRef.current = category;
    setActivePhotoCategory(category);
    setErrorMessage('');

    if (Platform.OS !== 'web') {
      setErrorMessage('Для телефона подключим expo-image-picker отдельным шагом. Сейчас реальные фото работают в Web / Desktop.');
      return;
    }

    photoInputRef.current?.click();
  }

  function openVideoPicker(category: PropertyVideoCategory) {
    activeVideoCategoryRef.current = category;
    setActiveVideoCategory(category);
    setErrorMessage('');

    if (Platform.OS !== 'web') {
      setErrorMessage('Для телефона подключим expo-image-picker отдельным шагом. Сейчас реальные видео работают в Web / Desktop.');
      return;
    }

    videoInputRef.current?.click();
  }

  async function addWebPhotoFiles(files: FileList | null) {
    if (!files?.length) return;

    const selectedCategory = activePhotoCategoryRef.current;
    const categoryConfig = photoCategories.find((item) => item.category === selectedCategory);
    if (!categoryConfig) return;

    const currentCategoryPhotos = categoryPhotos(media, selectedCategory);
    const existingKeys = new Set(
      media
        .filter((file): file is PropertyPhoto => file.type === 'photo')
        .map((photo) => photo.duplicateKey)
        .filter(Boolean),
    );
    const addedPhotos: PropertyPhoto[] = [];
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      if (!isFileLike(file)) return;

      if (blockedHeicTypes.has(file.type)) {
        errors.push(`${file.name}: этот формат пока не поддерживается. Выберите JPG, PNG или WebP.`);
        return;
      }

      if (!supportedPhotoMimeTypes.has(file.type)) {
        errors.push(`${file.name}: неподдерживаемый формат файла.`);
        return;
      }

      if (file.size > maxPhotoFileSize) {
        errors.push(`${file.name}: фотография превышает допустимый размер 15 МБ.`);
        return;
      }

      if (currentCategoryPhotos.length + addedPhotos.length >= categoryConfig.limit) {
        errors.push(
          selectedCategory === 'apartment'
            ? 'Можно добавить не более 30 фотографий квартиры.'
            : 'Для этой категории можно добавить не более 10 фотографий.',
        );
        return;
      }

      const duplicateKey = createDuplicateKey(file);
      if (existingKeys.has(duplicateKey)) {
        errors.push(`${file.name}: эта фотография уже добавлена.`);
        return;
      }

      existingKeys.add(duplicateKey);
      const photoId = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const localUri = await readPhotoAsDataUrl(file);
      await saveLocalMediaBlob(photoId, file, file.name).catch(() => undefined);
      const order = currentCategoryPhotos.length + addedPhotos.length;
      const isCover =
        selectedCategory === 'apartment' &&
        !media.some((item) => item.type === 'photo' && item.category === 'apartment' && item.isCover) &&
        order === 0;

      addedPhotos.push({
        id: photoId,
        type: 'photo',
        category: selectedCategory,
        name: file.name,
        uri: localUri,
        localUri,
        remoteUrl: null,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        width: null,
        height: null,
        order,
        isCover,
        uploadStatus: 'local',
        uploadProgress: 0,
        errorMessage: null,
        duplicateKey,
        createdAt: new Date().toISOString(),
      });
    }

    if (addedPhotos.length) {
      commit([...media, ...addedPhotos]);
    }
    setErrorMessage(errors.join('\n'));
  }

  async function addWebVideoFile(files: FileList | null) {
    const file = files?.[0];
    if (!file || !isFileLike(file)) return;

    const selectedCategory = activeVideoCategoryRef.current;
    const categoryConfig = videoCategories.find((item) => item.category === selectedCategory);
    if (!categoryConfig) return;

    const errors: string[] = [];
    const extension = fileExtension(file.name);
    const isSupportedVideo = supportedVideoMimeTypes.has(file.type) || supportedVideoExtensions.has(extension);

    if (!isSupportedVideo) {
      errors.push(`${file.name}: этот формат видео пока не поддерживается. Используйте MP4, MOV, M4V или WebM.`);
      setErrorMessage(errors.join('\n'));
      return;
    }

    if (file.size > maxVideoFileSize) {
      errors.push(`${file.name}: видео превышает допустимый размер 300 МБ.`);
      setErrorMessage(errors.join('\n'));
      return;
    }

    const localUri = URL.createObjectURL(file);
    const metadata = await readVideoMetadata(localUri);

    if (metadata.duration && metadata.duration > categoryConfig.maxDuration) {
      URL.revokeObjectURL(localUri);
      setErrorMessage(`${file.name}: видео слишком длинное для категории "${categoryConfig.label}". Лимит: ${formatDuration(categoryConfig.maxDuration)}.`);
      return;
    }

    const videoId = `video-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await saveLocalMediaBlob(videoId, file, file.name).catch(() => undefined);

    const video: PropertyVideo = {
      id: videoId,
      type: 'video',
      category: selectedCategory,
      name: categoryConfig.label,
      uri: localUri,
      localUri,
      remoteUrl: null,
      fileName: file.name,
      mimeType: file.type || `video/${extension}`,
      fileSize: file.size,
      duration: metadata.duration,
      width: metadata.width,
      height: metadata.height,
      thumbnailUri: null,
      uploadStatus: 'local',
      uploadProgress: 0,
      errorMessage: null,
      duplicateKey: createDuplicateKey(file),
      createdAt: new Date().toISOString(),
    };

    commit([...media.filter((item) => !(item.type === 'video' && item.category === selectedCategory)), video]);
    setErrorMessage('');
  }

  function removePhoto(photo: PropertyPhoto) {
    const next = media.filter((file) => file.id !== photo.id);
    deleteLocalMediaBlob(photo.id).catch(() => undefined);
    onRemove?.(photo.id);
    commit(next);
  }

  function removeVideo(video: PropertyVideo) {
    const uri = videoUri(video);
    if (Platform.OS === 'web' && uri.startsWith('blob:')) {
      URL.revokeObjectURL(uri);
    }
    deleteLocalMediaBlob(video.id).catch(() => undefined);
    const next = media.filter((file) => file.id !== video.id);
    onRemove?.(video.id);
    commit(next);
  }

  function setCover(photo: PropertyPhoto) {
    if (photo.category !== 'apartment') return;
    commit(media.map((file) => (file.type === 'photo' ? { ...file, isCover: file.id === photo.id } : file)));
  }

  function movePhoto(photo: PropertyPhoto, direction: -1 | 1) {
    const photos = categoryPhotos(media, photo.category);
    const currentIndex = photos.findIndex((item) => item.id === photo.id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= photos.length) return;

    const reordered = [...photos];
    const [current] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, current);
    const reorderedById = new Map(reordered.map((item, index) => [item.id, { ...item, order: index }]));
    commit(media.map((file) => (file.type === 'photo' && reorderedById.has(file.id) ? reorderedById.get(file.id)! : file)));
  }

  return (
    <View style={styles.wrap}>
      {Platform.OS === 'web'
        ? React.createElement('input', {
            ref: photoInputRef,
            type: 'file',
            accept: 'image/jpeg,image/png,image/webp',
            multiple: true,
            style: { display: 'none' },
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              addWebPhotoFiles(event.currentTarget.files);
              event.currentTarget.value = '';
            },
          })
        : null}

      {Platform.OS === 'web'
        ? React.createElement('input', {
            ref: videoInputRef,
            type: 'file',
            accept: 'video/mp4,video/quicktime,video/x-m4v,video/webm',
            multiple: false,
            style: { display: 'none' },
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              void addWebVideoFile(event.currentTarget.files);
              event.currentTarget.value = '';
            },
          })
        : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {photoMode
        ? photoCategories.map((item) => {
            const files = categoryPhotos(media, item.category);

            return (
              <View key={item.category} style={styles.section}>
                <View style={styles.sectionTop}>
                  <View style={styles.heading}>
                    <Text style={styles.uploadTitle}>{item.label}</Text>
                    <Text style={styles.uploadHint}>{item.hint}</Text>
                    <Text style={styles.uploadMeta}>Загружено: {files.length} из {item.limit}</Text>
                  </View>
                  <Pressable accessibilityLabel={`Добавить фотографии: ${item.label}`} onPress={() => openPhotoPicker(item.category)} style={styles.addButton}>
                    <Text style={styles.addText}>Добавить фото</Text>
                  </Pressable>
                </View>

                {files.length > 0 ? (
                  <View style={styles.photoGrid}>
                    {files.map((file, index) => (
                      <View key={file.id} style={styles.photoCard}>
                        <Image source={{ uri: photoUri(file) }} style={styles.preview} />
                        <View style={styles.badgeRow}>
                          <Text style={styles.orderBadge}>N {index + 1}</Text>
                          {file.isCover ? <Text style={styles.coverBadge}>Обложка объявления</Text> : null}
                        </View>
                        <Text style={styles.mediaName} numberOfLines={1}>{file.fileName}</Text>
                        <Text style={styles.mediaMeta}>{file.uploadStatus === 'local' ? 'Локальное превью' : 'Фото'}</Text>
                        <View style={styles.actionsRow}>
                          <Pressable accessibilityLabel={`Переместить фотографию ${index + 1} выше`} onPress={() => movePhoto(file, -1)} style={[styles.smallButton, index === 0 && styles.disabledButton]} disabled={index === 0}>
                            <Text style={styles.smallButtonText}>Выше</Text>
                          </Pressable>
                          <Pressable accessibilityLabel={`Переместить фотографию ${index + 1} ниже`} onPress={() => movePhoto(file, 1)} style={[styles.smallButton, index === files.length - 1 && styles.disabledButton]} disabled={index === files.length - 1}>
                            <Text style={styles.smallButtonText}>Ниже</Text>
                          </Pressable>
                        </View>
                        {file.category === 'apartment' ? (
                          <Pressable accessibilityLabel={`Сделать фотографию ${index + 1} обложкой`} onPress={() => setCover(file)} style={[styles.coverButton, file.isCover && styles.disabledButton]} disabled={file.isCover}>
                            <Text style={styles.coverButtonText}>{file.isCover ? 'Обложка выбрана' : 'Сделать обложкой'}</Text>
                          </Pressable>
                        ) : null}
                        <Pressable accessibilityLabel={`Удалить фотографию ${index + 1}`} onPress={() => removePhoto(file)} style={styles.removeButton}>
                          <Text style={styles.removeText}>Удалить</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })
        : null}

      {videoMode
        ? videoCategories.map((item) => {
            const file = categoryVideo(media, item.category);

            return (
              <View key={item.category} style={styles.section}>
                <View style={styles.sectionTop}>
                  <View style={styles.heading}>
                    <Text style={styles.uploadTitle}>{item.label}</Text>
                    <Text style={styles.uploadHint}>{item.hint}</Text>
                    <Text style={styles.uploadMeta}>{file ? 'Добавлено: 1 из 1' : 'Добавлено: 0 из 1'}</Text>
                  </View>
                  <Pressable accessibilityLabel={`${file ? 'Заменить' : 'Добавить'} видео: ${item.label}`} onPress={() => openVideoPicker(item.category)} style={styles.addButton}>
                    <Text style={styles.addText}>{file ? 'Заменить видео' : 'Добавить видео'}</Text>
                  </Pressable>
                </View>

                {file ? (
                  <View style={styles.videoCard}>
                    {Platform.OS === 'web' ? createVideoElement(file) : (
                      <View style={styles.videoPreview}>
                        <Text style={styles.play}>Video</Text>
                      </View>
                    )}
                    <Text style={styles.mediaName} numberOfLines={1}>{file.fileName}</Text>
                    <Text style={styles.mediaMeta}>{formatDuration(file.duration)} · {formatBytes(file.fileSize)} · локальное видео</Text>
                    <Text style={styles.mediaMeta}>Storage: ожидает подключения, remoteUrl не создан</Text>
                    <View style={styles.actionsRow}>
                      <Pressable onPress={() => openVideoPicker(item.category)} style={styles.smallButton}>
                        <Text style={styles.smallButtonText}>Заменить</Text>
                      </Pressable>
                      <Pressable onPress={() => removeVideo(file)} style={styles.removeButton}>
                        <Text style={styles.removeText}>Удалить</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  sectionTop: {
    gap: spacing.sm,
  },
  heading: {
    gap: 4,
  },
  addButton: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  addText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
  },
  uploadTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  uploadHint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  uploadMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: colors.text,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoCard: {
    width: 160,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  orderBadge: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },
  coverBadge: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  mediaName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  mediaMeta: {
    color: colors.muted,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  smallButton: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 7,
    alignItems: 'center',
  },
  smallButtonText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },
  coverButton: {
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 8,
    alignItems: 'center',
  },
  coverButtonText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  removeButton: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  removeText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.45,
  },
  videoCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  videoPreview: {
    height: 170,
    borderRadius: radius.md,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },
});
