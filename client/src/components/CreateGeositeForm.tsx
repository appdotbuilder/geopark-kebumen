
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateGeositeInput, Geosite } from '../../../server/src/schema';

interface CreateGeositeFormProps {
  onSuccess: (geosite: Geosite) => void;
  onCancel: () => void;
}

export function CreateGeositeForm({ onSuccess, onCancel }: CreateGeositeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGeositeInput>({
    name: '',
    description: '',
    history: null,
    geological_value: null,
    latitude: 0,
    longitude: 0,
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await trpc.createGeosite.mutate(formData);
      onSuccess(response);
    } catch (error) {
      console.error('Failed to create geosite:', error);
      alert('Gagal menambahkan geosite. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-emerald-800">Nama Geosite *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateGeositeInput) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Contoh: Gua Jatijajar"
          required
          className="border-emerald-200"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-emerald-800">Deskripsi *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateGeositeInput) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Deskripsikan geosite ini..."
          required
          rows={3}
          className="border-emerald-200"
        />
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address" className="text-emerald-800">Alamat *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateGeositeInput) => ({ ...prev, address: e.target.value }))
          }
          placeholder="Alamat lengkap geosite..."
          required
          rows={2}
          className="border-emerald-200"
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude" className="text-emerald-800">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateGeositeInput) => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))
            }
            placeholder="-7.6732"
            required
            className="border-emerald-200"
          />
        </div>
        <div>
          <Label htmlFor="longitude" className="text-emerald-800">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: CreateGeositeInput) => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))
            }
            placeholder="109.6345"
            required
            className="border-emerald-200"
          />
        </div>
      </div>

      {/* History */}
      <div>
        <Label htmlFor="history" className="text-emerald-800">Sejarah (Opsional)</Label>
        <Textarea
          id="history"
          value={formData.history || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateGeositeInput) => ({ 
              ...prev, 
              history: e.target.value || null 
            }))
          }
          placeholder="Ceritakan sejarah dari geosite ini..."
          rows={3}
          className="border-emerald-200"
        />
      </div>

      {/* Geological Value */}
      <div>
        <Label htmlFor="geological_value" className="text-emerald-800">Nilai Geologi (Opsional)</Label>
        <Textarea
          id="geological_value"
          value={formData.geological_value || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateGeositeInput) => ({ 
              ...prev, 
              geological_value: e.target.value || null 
            }))
          }
          placeholder="Jelaskan nilai geologi dari situs ini..."
          rows={3}
          className="border-emerald-200"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Geosite
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>
      </div>
    </form>
  );
}
