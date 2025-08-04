
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateNewsArticleInput, NewsArticle } from '../../../server/src/schema';

interface CreateNewsArticleFormProps {
  onSuccess: (article: NewsArticle) => void;
  onCancel: () => void;
}

export function CreateNewsArticleForm({ onSuccess, onCancel }: CreateNewsArticleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateNewsArticleInput>({
    title: '',
    content: '',
    excerpt: null,
    featured_image: null,
    author: '',
    category: 'news',
    is_published: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await trpc.createNewsArticle.mutate(formData);
      onSuccess(response);
    } catch (error) {
      console.error('Failed to create news article:', error);
      alert('Gagal membuat artikel. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-green-800">Judul Artikel *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateNewsArticleInput) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Contoh: Penemuan Fosil Baru di Geopark Kebumen"
          required
          className="border-green-200"
        />
      </div>

      {/* Author */}
      <div>
        <Label htmlFor="author" className="text-green-800">Penulis *</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateNewsArticleInput) => ({ ...prev, author: e.target.value }))
          }
          placeholder="Nama penulis artikel"
          required
          className="border-green-200"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" className="text-green-800">Kategori *</Label>
        <Select 
          value={formData.category || 'news'} 
          onValueChange={(value: 'news' | 'article' | 'announcement') =>
            setFormData((prev: CreateNewsArticleInput) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger className="border-green-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">📰 Berita</SelectItem>
            <SelectItem value="article">📝 Artikel</SelectItem>
            <SelectItem value="announcement">📢 Pengumuman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Excerpt */}
      <div>
        <Label htmlFor="excerpt" className="text-green-800">Ringkasan (Opsional)</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateNewsArticleInput) => ({ 
              ...prev, 
              excerpt: e.target.value || null 
            }))
          }
          placeholder="Ringkasan singkat artikel..."
          rows={3}
          className="border-green-200"
        />
      </div>

      {/* Featured Image URL */}
      <div>
        <Label htmlFor="featured_image" className="text-green-800">URL Gambar Utama (Opsional)</Label>
        <Input
          id="featured_image"
          type="url"
          value={formData.featured_image || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev: CreateNewsArticleInput) => ({ 
              ...prev, 
              featured_image: e.target.value || null 
            }))
          }
          placeholder="https://example.com/image.jpg"
          className="border-green-200"
        />
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content" className="text-green-800">Konten Artikel *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((prev: CreateNewsArticleInput) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Tulis konten artikel lengkap di sini..."
          required
          rows={10}
          className="border-green-200"
        />
      </div>

      {/* Publish Status */}
      <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked: boolean) =>
            setFormData((prev: CreateNewsArticleInput) => ({ ...prev, is_published: checked }))
          }
        />
        <Label htmlFor="is_published" className="text-green-800 font-medium">
          {formData.is_published ? '✅ Publikasikan artikel' : '📝 Simpan sebagai draft'}
        </Label>
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
              {formData.is_published ? 'Publikasikan' : 'Simpan Draft'}
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
