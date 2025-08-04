
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, UserPlus } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateEventRegistrationInput, Event } from '../../../server/src/schema';

interface EventRegistrationFormProps {
  event: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventRegistrationForm({ event, onSuccess, onCancel }: EventRegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEventRegistrationInput>({
    event_id: event.id,
    participant_name: '',
    participant_email: '',
    participant_phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await trpc.registerForEvent.mutate(formData);
      alert('✅ Pendaftaran berhasil! Kami akan menghubungi Anda untuk konfirmasi.');
      onSuccess();
    } catch (error) {
      console.error('Failed to register for event:', error);
      alert('Gagal mendaftar acara. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Event Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">🎪 {event.title}</h4>
        <p className="text-sm text-blue-700 mb-1">📍 {event.location}</p>
        <p className="text-sm text-blue-700">📅 {event.start_date.toLocaleDateString('id-ID')} - {event.end_date.toLocaleDateString('id-ID')}</p>
        {event.max_participants && (
          <p className="text-sm text-blue-700">👥 Maks. {event.max_participants} peserta</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="participant_name" className="text-blue-800">Nama Lengkap *</Label>
          <Input
            id="participant_name"
            value={formData.participant_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateEventRegistrationInput) => ({ ...prev, participant_name: e.target.value }))
            }
            placeholder="Masukkan nama lengkap Anda"
            required
            className="border-blue-200"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="participant_email" className="text-blue-800">Email *</Label>
          <Input
            id="participant_email"
            type="email"
            value={formData.participant_email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateEventRegistrationInput) => ({ ...prev, participant_email: e.target.value }))
            }
            placeholder="contoh@email.com"
            required
            className="border-blue-200"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="participant_phone" className="text-blue-800">Nomor Telepon *</Label>
          <Input
            id="participant_phone"
            type="tel"
            value={formData.participant_phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateEventRegistrationInput) => ({ ...prev, participant_phone: e.target.value }))
            }
            placeholder="08xxxxxxxxxx"
            required
            className="border-blue-200"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mendaftar...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Daftar Sekarang
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
