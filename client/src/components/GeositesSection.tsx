
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Plus, Clock, Eye } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { CreateGeositeForm } from '@/components/CreateGeositeForm';
import type { Geosite } from '../../../server/src/schema';

export function GeositesSection() {
  const [geosites, setGeosites] = useState<Geosite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadGeosites = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await trpc.getGeosites.query();
      setGeosites(result);
    } catch (error) {
      console.error('Failed to load geosites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGeosites();
  }, [loadGeosites]);

  const filteredGeosites = geosites.filter((geosite: Geosite) =>
    geosite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    geosite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    geosite.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGeosite = async (newGeosite: Geosite) => {
    setGeosites((prev: Geosite[]) => [...prev, newGeosite]);
    setShowCreateForm(false);
  };

  const openGoogleMaps = (latitude: number, longitude: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">🏔️ Geosite Kebumen</h2>
          <p className="text-emerald-600">Jelajahi keajaiban geologi dan sejarah bumi Kebumen</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Geosite
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="🔍 Cari geosite berdasarkan nama, deskripsi, atau lokasi..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-emerald-200"
        />
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-emerald-800">Tambah Geosite Baru</h3>
            <CreateGeositeForm 
              onSuccess={handleCreateGeosite}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-emerald-600">Memuat data geosite...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && geosites.length === 0 && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-emerald-200">
          <CardContent>
            <MapPin className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Belum Ada Geosite</h3>
            <p className="text-emerald-600 mb-4">
              🏔️ Mulai dengan menambahkan geosite pertama untuk membangun database lokasi geopark.
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Geosite Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Geosites Grid */}
      {!isLoading && filteredGeosites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGeosites.map((geosite: Geosite) => (
            <Card key={geosite.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-emerald-800 line-clamp-2">{geosite.name}</CardTitle>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                    🌍 Geosite
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {geosite.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 line-clamp-2">{geosite.address}</span>
                </div>

                {/* Geological Value */}
                {geosite.geological_value && (
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <h4 className="font-medium text-emerald-800 mb-1">🪨 Nilai Geologi</h4>
                    <p className="text-sm text-emerald-700 line-clamp-2">{geosite.geological_value}</p>
                  </div>
                )}

                {/* History */}
                {geosite.history && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1">📚 Sejarah</h4>
                    <p className="text-sm text-blue-700 line-clamp-2">{geosite.history}</p>
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Ditambahkan: {geosite.created_at.toLocaleDateString('id-ID')}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => openGoogleMaps(geosite.latitude, geosite.longitude, geosite.name)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Lihat Peta
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && searchTerm && filteredGeosites.length === 0 && geosites.length > 0 && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-emerald-200">
          <CardContent>
            <Search className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">Tidak Ada Hasil</h3>
            <p className="text-emerald-600">
              🔍 Tidak ditemukan geosite yang sesuai dengan "{searchTerm}". Coba kata kunci lain.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
