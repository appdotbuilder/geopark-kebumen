
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Plus, Users, MapPin, Clock, UserPlus } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { CreateEventForm } from '@/components/CreateEventForm';
import { EventRegistrationForm } from '@/components/EventRegistrationForm';
import type { Event } from '../../../server/src/schema';

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState<Event | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await trpc.getEvents.query();
      setEvents(result);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter((event: Event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = async (newEvent: Event) => {
    setEvents((prev: Event[]) => [...prev, newEvent]);
    setShowCreateForm(false);
  };

  const isEventActive = (event: Event) => {
    const now = new Date();
    return event.is_active && event.end_date >= now;
  };

  const isRegistrationOpen = (event: Event) => {
    const now = new Date();
    return event.registration_deadline ? event.registration_deadline >= now : true;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-800 mb-2">🎪 Acara & Kegiatan</h2>
          <p className="text-blue-600">Ikuti berbagai acara menarik di Geopark Kebumen</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Acara
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="🔍 Cari acara berdasarkan judul, deskripsi, atau lokasi..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-blue-200"
        />
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Buat Acara Baru</h3>
            <CreateEventForm 
              onSuccess={handleCreateEvent}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      {selectedEventForRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Daftar Acara: {selectedEventForRegistration.title}
            </h3>
            <EventRegistrationForm 
              event={selectedEventForRegistration}
              onSuccess={() => setSelectedEventForRegistration(null)}
              onCancel={() => setSelectedEventForRegistration(null)}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-blue-600">Memuat data acara...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent>
            <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Belum Ada Acara</h3>
            <p className="text-blue-600 mb-4">
              🎪 Mulai dengan membuat acara pertama untuk mengundang partisipasi masyarakat.
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Acara Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: Event) => (
            <Card key={event.id} className={`overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
              isEventActive(event) ? 'border-blue-200' : 'border-gray-200 opacity-75'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-blue-800 line-clamp-2">{event.title}</CardTitle>
                  <Badge variant={isEventActive(event) ? "default" : "secondary"} 
                         className={isEventActive(event) ? "bg-blue-100 text-blue-700 border-blue-300" : ""}>
                    {isEventActive(event) ? '🔴 Aktif' : '⚫ Selesai'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Range */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div className="text-blue-700">
                      <div><strong>Mulai:</strong> {formatDate(event.start_date)}</div>
                      <div><strong>Selesai:</strong> {formatDate(event.end_date)}</div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 line-clamp-2">{event.location}</span>
                </div>

                {/* Participants */}
                {event.max_participants && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Maks. {event.max_participants} peserta</span>
                  </div>
                )}

                {/* Registration Deadline */}
                {event.registration_deadline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600">
                      Batas daftar: {formatDateTime(event.registration_deadline)}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedEventForRegistration(event)}
                    disabled={!isEventActive(event) || !isRegistrationOpen(event)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    {!isEventActive(event) ? 'Selesai' : 
                     !isRegistrationOpen(event) ? 'Tutup' : 'Daftar'}
                  </Button>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-500 border-t pt-2">
                  Dibuat: {event.created_at.toLocaleDateString('id-ID')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && searchTerm && filteredEvents.length === 0 && events.length > 0 && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent>
            <Search className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Tidak Ada Hasil</h3>
            <p className="text-blue-600">
              🔍 Tidak ditemukan acara yang sesuai dengan "{searchTerm}". Coba kata kunci lain.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
