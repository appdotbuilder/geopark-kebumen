
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateEventInput, Event } from '../../../server/src/schema';

interface CreateEventFormProps {
  onSuccess: (event: Event) => void;
  onCancel: () => void;
}

export function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    location: '',
    max_participants: null,
    registration_deadline: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await trpc.createEvent.mutate(formData);
      onSuccess(response);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Gagal membuat acara. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-blue-800">Judul Acara *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateEventInput) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Contoh: Workshop Geologi Dasar"
          required
          className="border-blue-200"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-blue-800">Deskripsi *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateEventInput) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Deskripsikan acara ini..."
          required
          rows={3}
          className="border-blue-200"
        />
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location" className="text-blue-800">Lokasi *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateEventInput) => ({ ...prev, location: e.target.value }))
          }
          placeholder="Contoh: Gua Jatijajar, Kebumen"
          required
          className="border-blue-200"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date" className="text-blue-800">Tanggal Mulai *</Label>
          <Input
            id="start_date"
            type="datetime-local"
            value={formData.start_date.toISOString().slice(0, 16)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateEventInput) => ({ 
                ...prev, 
                start_date: new Date(e.target.value) 
              }))
            }
            required
            className="border-blue-200"
          />
        </div>
        <div>
          <Label htmlFor="end_date" className="text-blue-800">Tanggal Selesai *</Label>
          <Input
            id="end_date"
            type="datetime-local"
            value={formData.end_date.toISOString().slice(0, 16)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateEventInput) => ({ 
                ...prev, 
                end_date: new Date(e.target.value) 
              }))
            }
            required
            className="border-blue-200"
          />
        </div>
      </div>

      {/* Max Participants */}
      <div>
        <Label htmlFor="max_participants" className="text-blue-800">Maksimal Peserta (Opsional)</Label>
        <Input
          id="max_participants"
          type="number"
          min="1"
          value={formData.max_participants || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateEventInput) => ({ 
              ...prev, 
              max_participants: e.target.value ? parseInt(e.target.value) : null 
            }))
          }
          placeholder="Contoh: 50"
          className="border-blue-200"
        />
      </div>

      {/* Registration Deadline */}
      <div>
        <Label htmlFor="registration_deadline" className="text-blue-800">Batas Waktu Pendaftaran (Opsional)</Label>
        <Input
          id="registration_deadline"
          type="datetime-local"
          value={formData.registration_deadline?.toISOString().slice(0, 16) || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateEventInput) => ({ 
              ...prev, 
              registration_deadline: e.target.value ? new Date(e.target.value) : null 
            }))
          }
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
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Buat Acara
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
  );
}
