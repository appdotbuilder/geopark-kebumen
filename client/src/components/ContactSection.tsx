
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateContactFeedbackInput } from '../../../server/src/schema';

export function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateContactFeedbackInput>({
    name: '',
    email: '',
    phone: null,
    subject: '',
    message: '',
    type: 'contact'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await trpc.submitContactFeedback.mutate(formData);
      alert('✅ Pesan Anda telah terkirim! Kami akan merespons dalam 1x24 jam.');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: null,
        subject: '',
        message: '',
        type: 'contact'
      });
    } catch (error) {
      console.error('Failed to submit contact feedback:', error);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">📞 Hubungi Kami</h2>
        <p className="text-blue-600">Sampaikan pertanyaan, saran, atau keluhan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Kirim Pesan
            </CardTitle>
            <CardDescription>
              Isi formulir di bawah ini untuk menghubungi tim Geopark Kebumen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-blue-800">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFeedbackInput) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  className="border-blue-200"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-blue-800">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFeedbackInput) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="contoh@email.com"
                  required
                  className="border-blue-200"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-blue-800">Nomor Telepon (Opsional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFeedbackInput) => ({ 
                      ...prev, 
                      phone: e.target.value || null 
                    }))
                  }
                  placeholder="08xxxxxxxxxx"
                  className="border-blue-200"
                />
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="type" className="text-blue-800">Jenis Pesan *</Label>
                <Select 
                  value={formData.type || 'contact'} 
                  onValueChange={(value: 'contact' | 'feedback' | 'complaint') =>
                    setFormData((prev: CreateContactFeedbackInput) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">📞 Pertanyaan/Kontak</SelectItem>
                    <SelectItem value="feedback">💡 Saran/Masukan</SelectItem>
                    <SelectItem value="complaint">⚠️ Keluhan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject" className="text-blue-800">Subjek *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactFeedbackInput) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="Ringkasan topik pesan Anda"
                  required
                  className="border-blue-200"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-blue-800">Pesan *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev: CreateContactFeedbackInput) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Tulis pesan detail Anda di sini..."
                  required
                  rows={5}
                  className="border-blue-200"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pesan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Office Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Alamat Kantor</h4>
                  <p className="text-gray-600">
                    📍 Jl. Pemuda No. 1, Kebumen<br />
                    Kabupaten Kebumen, Jawa Tengah<br />
                    54311
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Telepon</h4>
                  <p className="text-gray-600">
                    📞 (0287) 381234<br />
                    📱 0812-3456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Email</h4>
                  <p className="text-gray-600">
                    ✉️ info@geoparkkebumen.id<br />
                    ✉️ admin@geoparkkebumen.id
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Jam Operasional</h4>
                  <p className="text-gray-600">
                    🕘 Senin - Jumat: 08:00 - 16:00<br />
                    🕘 Sabtu: 08:00 - 12:00<br />
                    🚫 Minggu: Tutup
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🔗 Tautan Berguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <a href="#" className="block text-green-600 hover:text-green-800 hover:underline">
                  🌐 Website Resmi Pemkab Kebumen
                </a>
                <a href="#" className="block text-green-600 hover:text-green-800 hover:underline">
                  🏛️ Dinas Pariwisata Kebumen
                </a>
                <a href="#" className="block text-green-600 hover:text-green-800 hover:underline">
                  🌍 UNESCO Global Geopark Network
                </a>
                <a href="#" className="block text-green-600 hover:text-green-800 hover:underline">
                  📱 Follow Media Sosial Kami
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-white/80 backdrop-blur-sm border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">🚨 Kontak Darurat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">
                Untuk situasi darurat di area geopark:
              </p>
              <div className="space-y-2">
                <p className="text-red-600 font-medium">
                  📞 Emergency Hotline: 0287-DARURAT
                </p>
                <p className="text-red-600 font-medium">
                  🏥 PMI Kebumen: (0287) 381999
                </p>
                <p className="text-red-600 font-medium">
                  🚓 Polres Kebumen: (0287) 381110
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
