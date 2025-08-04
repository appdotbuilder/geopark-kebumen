
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreePine, Search, Plus, Calendar, User, Eye } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { CreateNewsArticleForm } from '@/components/CreateNewsArticleForm';
import type { NewsArticle } from '../../../server/src/schema';

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadNewsArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await trpc.getNewsArticles.query(true); // Only published articles
      setArticles(result);
    } catch (error) {
      console.error('Failed to load news articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewsArticles();
  }, [loadNewsArticles]);

  const filteredArticles = articles.filter((article: NewsArticle) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory && article.is_published;
  });

  const handleCreateArticle = async (newArticle: NewsArticle) => {
    setArticles((prev: NewsArticle[]) => [...prev, newArticle]);
    setShowCreateForm(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'news': return '📰';
      case 'article': return '📝';
      case 'announcement': return '📢';
      default: return '📄';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news': return 'Berita';
      case 'article': return 'Artikel';
      case 'announcement': return 'Pengumuman';
      default: return category;
    }
  };

  const articlesByCategory = {
    news: filteredArticles.filter(a => a.category === 'news'),
    article: filteredArticles.filter(a => a.category === 'article'),
    announcement: filteredArticles.filter(a => a.category === 'announcement')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">🌲 Berita & Artikel</h2>
          <p className="text-green-600">Informasi terkini seputar Geopark Kebumen</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tulis Artikel
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="🔍 Cari berdasarkan judul, konten, atau penulis..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-green-200"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 bg-white/80 backdrop-blur-sm border-green-200">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌐 Semua Kategori</SelectItem>
            <SelectItem value="news">📰 Berita</SelectItem>
            <SelectItem value="article">📝 Artikel</SelectItem>
            <SelectItem value="announcement">📢 Pengumuman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create Article Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-green-800">Tulis Artikel Baru</h3>
            <CreateNewsArticleForm 
              onSuccess={handleCreateArticle}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-green-600">Memuat artikel...</p>
        </div>
      )}

      {/* Articles by Category */}
      {!isLoading && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all">🌐 Semua</TabsTrigger>
            <TabsTrigger value="news">📰 Berita</TabsTrigger>
            <TabsTrigger value="article">📝 Artikel</TabsTrigger>
            <TabsTrigger value="announcement">📢 Pengumuman</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredArticles.length === 0 ? (
              <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent>
                  <TreePine className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    {articles.length === 0 ? 'Belum Ada Artikel' : 'Tidak Ada Hasil'}
                  </h3>
                  <p className="text-green-600 mb-4">
                    {articles.length === 0 
                      ? '🌲 Mulai dengan menulis artikel pertama untuk berbagi informasi.'
                      : `🔍 Tidak ditemukan artikel yang sesuai dengan "${searchTerm}".`
                    }
                  </p>
                  {articles.length === 0 && (
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tulis Artikel Pertama
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article: NewsArticle) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </TabsContent>

          {(['news', 'article', 'announcement'] as const).map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              {articlesByCategory[category].length === 0 ? (
                <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-green-200">
                  <CardContent>
                    <div className="text-4xl mb-4">{getCategoryIcon(category)}</div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      Belum Ada {getCategoryLabel(category)}
                    </h3>
                    <p className="text-green-600">
                      Belum ada {getCategoryLabel(category).toLowerCase()} yang dipublikasikan.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articlesByCategory[category].map((article: NewsArticle) => (
                    <ArticleCard key={article.id} article={article} />
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

function ArticleCard({ article }: { article: NewsArticle }) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'news': return '📰';
      case 'article': return '📝';
      case 'announcement': return '📢';
      default: return '📄';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'news': return 'Berita';
      case 'article': return 'Artikel';
      case 'announcement': return 'Pengumuman';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'article': return 'bg-green-100 text-green-700 border-green-300';
      case 'announcement': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : '';
  };

  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
      {/* Featured Image Placeholder */}
      {article.featured_image && (
        <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
          <div className="text-center text-green-600">
            <TreePine className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">🖼️ Gambar Artikel</p>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={getCategoryColor(article.category)}>
            {getCategoryIcon(article.category)} {getCategoryLabel(article.category)}
          </Badge>
          {article.published_at && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {formatDate(article.published_at)}
            </div>
          )}
        </div>
        <CardTitle className="text-green-800 line-clamp-2">
          {article.title}
        </CardTitle>
        {article.excerpt && (
          <CardDescription className="line-clamp-3">
            {article.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content Preview */}
        <div className="text-sm text-gray-600 line-clamp-4">
          {article.content.replace(/<[^>]*>/g, '')} {/* Strip HTML tags for preview */}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Oleh: {article.author}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Eye className="w-4 h-4 mr-1" />
            Baca Selengkapnya
          </Button>
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Dibuat: {article.created_at.toLocaleDateString('id-ID')}
        </div>
      </CardContent>
    </Card>
  );
}
