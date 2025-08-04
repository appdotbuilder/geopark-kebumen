
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateServiceInput, Service } from '../../../server/src/schema';

interface CreateServiceFormProps {
  onSuccess: (service: Service) => void;
  onCancel: () => void;
}

export function CreateServiceForm({ onSuccess, onCancel }: CreateServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateServiceInput>({
    name: '',
    type: 'guide',
    description: '',
    contact_info: '',
    price_range: null,
    rating: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await trpc.createService.mutate(formData);
      onSuccess(response);
    } catch (error) {
      console.error('Failed to create service:', error);
      alert('Gagal menambahkan layanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-green-800">Nama Layanan *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateServiceInput) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Contoh: Pemandu Wisata Jatijajar"
          required
          className="border-green-200"
        />
      </div>

      {/* Type */}
      <div>
        <Label htmlFor="type" className="text-green-800">Jenis Layanan *</Label>
        <Select 
          value={formData.type || 'guide'} 
          onValueChange={(value: 'guide' | 'accommodation' | 'transport' | 'culinary') =>
            setFormData((prev: CreateServiceInput) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger className="border-green-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="guide">👨‍🏫 Pemandu Wisata</SelectItem>
            <SelectItem value="accommodation">🏨 Akomodasi</SelectItem>
            <SelectItem value="transport">🚗 Transportasi</SelectItem>
            <SelectItem value="culinary">🍽️ Kuliner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-green-800">Deskripsi *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateServiceInput) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Deskripsikan layanan yang ditawarkan..."
          required
          rows={3}
          className="border-green-200"
        />
      </div>

      {/* Contact Info */}
      <div>
        <Label htmlFor="contact_info" className="text-green-800">Informasi Kontak *</Label>
        <Textarea
          id="contact_info"
          value={formData.contact_info}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateServiceInput) => ({ ...prev, contact_info: e.target.value }))
          }
          placeholder="Nama: John Doe&#10;Telepon: 081234567890&#10;Email: john@example.com"
          required
          rows={3}
          className="border-green-200"
        />
      </div>

      {/* Price Range */}
      <div>
        <Label htmlFor="price_range" className="text-green-800">Kisaran Harga (Opsional)</Label>
        <Input
          id="price_range"
          value={formData.price_range || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateServiceInput) => ({ 
              ...prev, 
              price_range: e.target.value || null 
            }))
          }
          placeholder="Contoh: Rp 100.000 - 300.000 per hari"
          className="border-green-200"
        />
      </div>

      {/* Rating */}
      <div>
        <Label htmlFor="rating" className="text-green-800">Rating (1-5, Opsional)</Label>
        <Input
          id="rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={formData.rating || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateServiceInput) => ({ 
              ...prev, 
              rating: e.target.value ? parseFloat(e.target.value) : null 
            }))
          }
          placeholder="Contoh: 4.5"
          className="border-green-200"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Layanan
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
        >
          <X className="w-4 h-4 mr-2" />
          Batal
        </Button>
      </div>
    </form>
  );
}
