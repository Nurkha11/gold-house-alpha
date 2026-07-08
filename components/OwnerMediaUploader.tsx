import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { MediaFile } from '@/data/ownerTypes';

type OwnerMediaUploaderProps = {
  media: MediaFile[];
  onAdd: (file: MediaFile) => void;
  onRemove?: (id: string) => void;
  mode?: 'all' | 'photo' | 'video';
};

const mockImages = [
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80',
];

const mediaButtons: Array<{ label: string; action: string; type: MediaFile['type']; category: MediaFile['category'] }> = [
  { label: 'Фото квартиры', action: 'Добавить фото', type: 'photo', category: 'apartment' },
  { label: 'Фото двора', action: 'Добавить фото', type: 'photo', category: 'yard' },
  { label: 'Фото подъезда', action: 'Добавить фото', type: 'photo', category: 'entrance' },
  { label: 'Фото вида из окна', action: 'Добавить фото', type: 'photo', category: 'view' },
  { label: 'Видео квартиры', action: 'Добавить видео', type: 'video', category: 'apartment' },
  { label: 'Видео двора', action: 'Добавить видео', type: 'video', category: 'yard' },
  { label: 'Видео подъезда', action: 'Добавить видео', type: 'video', category: 'entrance' },
  { label: 'Видео собственника', action: 'Добавить видео', type: 'video', category: 'owner' },
];

export function OwnerMediaUploader({ media, onAdd, onRemove, mode = 'all' }: OwnerMediaUploaderProps) {
  const visibleButtons = mediaButtons.filter((item) => mode === 'all' || item.type === mode);

  function addMockFile(item: (typeof mediaButtons)[number]) {
    const nextIndex = media.filter((file) => file.type === item.type && file.category === item.category).length + 1;
    onAdd({
      id: `media-${Date.now()}-${nextIndex}`,
      type: item.type,
      category: item.category,
      name: `${item.label} ${nextIndex}`,
      uri: item.type === 'photo' ? mockImages[nextIndex % mockImages.length] : undefined,
    });
  }

  return (
    <View style={styles.wrap}>
      {visibleButtons.map((item) => {
        const files = media.filter((file) => file.type === item.type && file.category === item.category);

        return (
          <View key={item.label} style={styles.section}>
            <View style={styles.sectionTop}>
              <View>
                <Text style={styles.uploadTitle}>{item.label}</Text>
                <Text style={styles.uploadMeta}>Загружено: {files.length}</Text>
              </View>
              <Pressable onPress={() => addMockFile(item)} style={styles.addButton}>
                <Text style={styles.addText}>{item.action}</Text>
              </Pressable>
            </View>

            {files.length > 0 ? (
              <View style={styles.mediaList}>
                {files.map((file) => (
                  <View key={file.id} style={styles.mediaItem}>
                    {file.type === 'photo' && file.uri ? (
                      <Image source={{ uri: file.uri }} style={styles.preview} />
                    ) : (
                      <View style={styles.videoPreview}>
                        <Text style={styles.play}>▶</Text>
                      </View>
                    )}
                    <View style={styles.mediaText}>
                      <Text style={styles.mediaName}>{file.name}</Text>
                      <Text style={styles.mediaMeta}>{file.type === 'photo' ? 'Фото' : 'Видео'} · mock upload</Text>
                    </View>
                    {onRemove ? (
                      <Pressable onPress={() => onRemove(file.id)} style={styles.removeButton}>
                        <Text style={styles.removeText}>Удалить</Text>
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  sectionTop: {
    gap: spacing.sm,
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
  uploadMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  mediaList: {
    gap: spacing.sm,
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.sm,
  },
  preview: {
    width: 62,
    height: 62,
    borderRadius: radius.sm,
  },
  videoPreview: {
    width: 62,
    height: 62,
    borderRadius: radius.sm,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    color: colors.background,
    fontSize: 22,
    fontWeight: '900',
  },
  mediaText: {
    flex: 1,
  },
  mediaName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  mediaMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  removeButton: {
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  removeText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
});
