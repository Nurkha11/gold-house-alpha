import { useEffect, useState } from 'react';
import { Image, ImageResizeMode, ImageStyle, StyleProp } from 'react-native';
import { getLocalMediaReferenceId, loadLocalMediaBlobUrl } from '@/data/localMediaStore';

type ResolvedImageProps = {
  uri?: string;
  style: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
};

export function ResolvedImage({ uri, style, resizeMode = 'cover' }: ResolvedImageProps) {
  const [resolvedUri, setResolvedUri] = useState(uri);

  useEffect(() => {
    let mounted = true;
    let objectUrl: string | null = null;

    async function resolveUri() {
      const mediaId = getLocalMediaReferenceId(uri);
      if (!mediaId) {
        setResolvedUri(uri);
        return;
      }

      const blobUrl = await loadLocalMediaBlobUrl(mediaId).catch(() => null);
      objectUrl = blobUrl;

      if (mounted) {
        setResolvedUri(blobUrl ?? uri);
      }
    }

    resolveUri();

    return () => {
      mounted = false;
      if (objectUrl && typeof URL !== 'undefined') {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [uri]);

  return <Image source={{ uri: resolvedUri }} style={style} resizeMode={resizeMode} />;
}
