
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Play, Image as ImageIcon } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { MediaGallery } from '../../../server/src/schema';

export function MediaGallerySection() {
  const [mediaItems, setMediaItems] = useState<MediaGallery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const loadMediaGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await trpc.getMediaGallery.query();
      setMediaItems(result);
    } catch (error) {
      console.error('Failed to load media gallery:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMediaGallery();
  }, [loadMediaGallery]);

  const filteredMedia = mediaItems.filter((item: MediaGallery) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || item.media_type === selectedType;
    return matchesSearch && matchesType;
  });

  const images = filteredMedia.filter(item => item.media_type === 'image');
  const videos = filteredMedia.filter(item => item.media_type === 'video');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">📸 Galeri Media</h2>
        <p className="text-purple-600">Koleksi foto dan video keindahan Geopark Kebumen</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="🔍 Cari berdasarkan judul atau deskripsi..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-purple-200"
          />
        </div>
        <div className="flex gap-2">
          <Badge 
            variant={selectedType === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 ${
              selectedType === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/80 text-purple-600 border-purple-300 hover:bg-purple-50'
            }`}
            onClick={() => setSelectedType('all')}
          >
            🌐 Semua
          </Badge>
          <Badge 
            variant={selectedType === 'image' ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 ${
              selectedType === 'image' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/80 text-purple-600 border-purple-300 hover:bg-purple-50'
            }`}
            onClick={() => setSelectedType('image')}
          >
            📷 Foto ({images.length})
          </Badge>
          <Badge 
            variant={selectedType === 'video' ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 ${
              selectedType === 'video' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/80 text-purple-600 border-purple-300 hover:bg-purple-50'
            }`}
            onClick={() => setSelectedType('video')}
          >
            🎥 Video ({videos.length})
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-purple-600">Memuat galeri media...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && mediaItems.length === 0 && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-purple-200">
          <CardContent>
            <Camera className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold text-purple-800 mb-2">Galeri Kosong</h3>
            <p className="text-purple-600">
              📸 Belum ada foto atau video dalam galeri. Galeri akan diisi oleh administrator.
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Search Results */}
      {!isLoading && searchTerm && filteredMedia.length === 0 && mediaItems.length > 0 && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-purple-200">
          <CardContent>
            <Search className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold text-purple-800 mb-2">Tidak Ada Hasil</h3>
            <p className="text-purple-600">
              🔍 Tidak ditemukan media yang sesuai dengan "{searchTerm}".
            </p>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      {!isLoading && filteredMedia.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item: MediaGallery) => (
            <Card key={item.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 group">
              <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
                {/* Media Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.media_type === 'image' ? (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                      <p className="text-sm text-purple-600">📷 Foto</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="relative">
                        <Play className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                        <div className="absolute inset-0 bg-black/20 rounded-full group-hover:bg-black/30 transition-colors"></div>
                      </div>
                      <p className="text-sm text-purple-600">🎥 Video</p>
                    </div>
                  )}
                </div>

                {/* Media Type Badge */}
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant="outline" 
                    className={`${
                      item.media_type === 'image' 
                        ? 'bg-blue-100 text-blue-700 border-blue-300' 
                        : 'bg-red-100 text-red-700 border-red-300'
                    }`}
                  >
                    {item.media_type === 'image' ? '📷' : '🎥'}
                  </Badge>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer"></div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-purple-800 line-clamp-2 mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {item.description}
                  </p>
                )}
                <div className="text-xs text-gray-500">
                  📅 {item.created_at.toLocaleDateString('id-ID')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Media Statistics */}
      {!isLoading && mediaItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-purple-200">
          <Card className="text-center bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4">
              <Camera className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-800">{mediaItems.length}</div>
              <div className="text-sm text-purple-600">Total Media</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-800">{images.length}</div>
              <div className="text-sm text-blue-600">Foto</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm border-red-200">
            <CardContent className="p-4">
              <Play className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-800">{videos.length}</div>
              <div className="text-sm text-red-600">Video</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
