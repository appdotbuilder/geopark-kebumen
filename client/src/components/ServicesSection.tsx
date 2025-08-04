
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Plus, Star, Phone, UserCheck, Home, Car, Utensils } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { CreateServiceForm } from '@/components/CreateServiceForm';
import type { Service } from '../../../server/src/schema';

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await trpc.getServices.query(selectedType === 'all' ? undefined : selectedType);
      setServices(result);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = services.filter((service: Service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateService = async (newService: Service) => {
    setServices((prev: Service[]) => [...prev, newService]);
    setShowCreateForm(false);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'guide': return <UserCheck className="w-5 h-5" />;
      case 'accommodation': return <Home className="w-5 h-5" />;
      case 'transport': return <Car className="w-5 h-5" />;
      case 'culinary': return <Utensils className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'guide': return '👨‍🏫 Pemandu';
      case 'accommodation': return '🏨 Akomodasi';
      case 'transport': return '🚗 Transportasi';
      case 'culinary': return '🍽️ Kuliner';
      default: return type;
    }
  };

  const servicesByType = {
    guide: filteredServices.filter(s => s.type === 'guide'),
    accommodation: filteredServices.filter(s => s.type === 'accommodation'),
    transport: filteredServices.filter(s => s.type === 'transport'),
    culinary: filteredServices.filter(s => s.type === 'culinary')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">🤝 Layanan Pendukung</h2>
          <p className="text-green-600">Temukan berbagai layanan terpercaya untuk kunjungan Anda</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="🔍 Cari layanan berdasarkan nama, deskripsi, atau kontak..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-green-200"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-48 bg-white/80 backdrop-blur-sm border-green-200">
            <SelectValue placeholder="Pilih Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌐 Semua Layanan</SelectItem>
            <SelectItem value="guide">👨‍🏫 Pemandu</SelectItem>
            <SelectItem value="accommodation">🏨 Akomodasi</SelectItem>
            <SelectItem value="transport">🚗 Transportasi</SelectItem>
            <SelectItem value="culinary">🍽️ Kuliner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create Service Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Tambah Layanan Baru</h3>
            <CreateServiceForm 
              onSuccess={handleCreateService}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-green-600">Memuat data layanan...</p>
        </div>
      )}

      {/* Services by Category */}
      {!isLoading && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all">🌐 Semua</TabsTrigger>
            <TabsTrigger value="guide">👨‍🏫 Pemandu</TabsTrigger>
            <TabsTrigger value="accommodation">🏨 Akomodasi</TabsTrigger>
            <TabsTrigger value="transport">🚗 Transport</TabsTrigger>
            <TabsTrigger value="culinary">🍽️ Kuliner</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredServices.length === 0 ? (
              <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent>
                  <Users className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {services.length === 0 ? 'Belum Ada Layanan' : 'Tidak Ada Hasil'}
                  </h3>
                  <p className="text-green-600 mb-4">
                    {services.length === 0 
                      ? '🤝 Mulai dengan menambahkan layanan pertama untuk membantu pengunjung.'
                      : `🔍 Tidak ditemukan layanan yang sesuai dengan "${searchTerm}".`
                    }
                  </p>
                  {services.length === 0 && (
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Layanan Pertama
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service: Service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </TabsContent>

          {(['guide', 'accommodation', 'transport', 'culinary'] as const).map((type) => (
            <TabsContent key={type} value={type} className="mt-6">
              {servicesByType[type].length === 0 ? (
                <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-green-200">
                  <CardContent>
                    {getServiceIcon(type)}
                    <h3 className="text-xl font-semibold text-green-800 mb-2 mt-4">
                      Belum Ada {getServiceTypeLabel(type).split(' ')[1]}
                    </h3>
                    <p className="text-green-600">
                      Belum ada layanan {getServiceTypeLabel(type).toLowerCase()} yang tersedia.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesByType[type].map((service: Service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'guide': return <UserCheck className="w-5 h-5" />;
      case 'accommodation': return <Home className="w-5 h-5" />;
      case 'transport': return <Car className="w-5 h-5" />;
      case 'culinary': return <Utensils className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'guide': return '👨‍🏫 Pemandu';
      case 'accommodation': return '🏨 Akomodasi';
      case 'transport': return '🚗 Transportasi';
      case 'culinary': return '🍽️ Kuliner';
      default: return type;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-green-100 text-green-700 border-green-300';
      case 'accommodation': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'transport': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'culinary': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className={`overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
      service.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-green-800 line-clamp-2 flex items-center gap-2">
            {getServiceIcon(service.type)}
            {service.name}
          </CardTitle>
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={getServiceTypeColor(service.type)}>
              {getServiceTypeLabel(service.type)}
            </Badge>
            {!service.is_active && (
              <Badge variant="secondary" className="text-xs">
                Tidak Aktif
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="flex items-start gap-2 text-sm">
          <Phone className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-gray-600 line-clamp-2">{service.contact_info}</span>
        </div>

        {/* Price Range */}
        {service.price_range && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">💰 Kisaran Harga</h4>
            <p className="text-sm text-green-700">{service.price_range}</p>
          </div>
        )}

        {/* Rating */}
        {service.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(service.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {service.rating.toFixed(1)} / 5.0
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Bergabung: {service.created_at.toLocaleDateString('id-ID')}
        </div>
      </CardContent>
    </Card>
  );
}
