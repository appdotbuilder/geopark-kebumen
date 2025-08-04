
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, Phone, Star, Camera, Globe, Mountain, TreePine } from 'lucide-react';
import { GeositesSection } from '@/components/GeositesSection';
import { EventsSection } from '@/components/EventsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { MediaGallerySection } from '@/components/MediaGallerySection';
import { NewsSection } from '@/components/NewsSection';
import { ContactSection } from '@/components/ContactSection';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-full flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">Geopark Kebumen</h1>
                <p className="text-sm text-emerald-600">Pusat Layanan Digital</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                🌍 UNESCO Global Geopark
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Beranda
            </TabsTrigger>
            <TabsTrigger value="geosites" className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              Geosite
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Acara
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Layanan
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Galeri
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              Berita
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Kontak
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-green-600 text-white p-12 text-center">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">🏔️ Selamat Datang di Geopark Kabupaten Kebumen</h2>
                <p className="text-xl mb-6 opacity-90">
                  Jelajahi keajaiban geologi dan kekayaan budaya Kebumen dalam satu platform digital
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => setActiveTab('geosites')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Eksplorasi Geosite
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setActiveTab('events')}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Lihat Acara
                  </Button>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center bg-white/80 backdrop-blur-sm border-emerald-200">
                <CardContent className="p-6">
                  <Mountain className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-800">15+</h3>
                  <p className="text-emerald-600">Geosite Aktif</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 backdrop-blur-sm border-blue-200">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-800">25+</h3>
                  <p className="text-blue-600">Acara Tahunan</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-800">50+</h3>
                  <p className="text-green-600">Layanan Partner</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 backdrop-blur-sm border-purple-200">
                <CardContent className="p-6">
                  <Star className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="text-2xl font-bold text-purple-800">4.8</h3>
                  <p className="text-purple-600">Rating Pengunjung</p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-emerald-800 mb-4">
                    <MapPin className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Pemetaan Geosite</h3>
                  </div>
                  <p className="text-gray-600">
                    🗺️ Eksplorasi lokasi geosite dengan integrasi Google Maps, lengkap dengan informasi geologi dan sejarah.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-blue-800 mb-4">
                    <Calendar className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Manajemen Acara</h3>
                  </div>
                  <p className="text-gray-600">
                    🎪 Kelola dan daftar acara geopark, dari workshop edukasi hingga festival budaya lokal.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-green-800 mb-4">
                    <Users className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Layanan Terintegrasi</h3>
                  </div>
                  <p className="text-gray-600">
                    🤝 Akses mudah ke pemandu wisata, akomodasi, transportasi, dan kuliner lokal terpercaya.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="geosites">
            <GeositesSection />
          </TabsContent>

          <TabsContent value="events">
            <EventsSection />
          </TabsContent>

          <TabsContent value="services">
            <ServicesSection />
          </TabsContent>

          <TabsContent value="gallery">
            <MediaGallerySection />
          </TabsContent>

          <TabsContent value="news">
            <NewsSection />
          </TabsContent>

          <TabsContent value="contact">
            <ContactSection />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">🏔️ Geopark Kebumen</h3>
              <p className="text-emerald-200">
                Platform digital resmi untuk eksplorasi dan pengelolaan Geopark Kabupaten Kebumen.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">📍 Kontak</h3>
              <p className="text-emerald-200">
                Jl. Pemuda No. 1, Kebumen<br />
                Telepon: (0287) 381234<br />
                Email: info@geoparkkebumen.id
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">🔗 Tautan</h3>
              <div className="space-y-2 text-emerald-200">
                <p>UNESCO Global Geopark</p>
                <p>Pemerintah Kabupaten Kebumen</p>
                <p>Dinas Pariwisata Kebumen</p>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 mt-8 pt-4 text-center text-emerald-300">
            © 2024 Geopark Kabupaten Kebumen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
