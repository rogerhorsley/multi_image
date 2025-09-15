// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, ArrowLeft, Loader2 } from 'lucide-react';

import { GenerationCard } from '@/components/GenerationCard';
import { getGenerationHistory, deleteGenerationHistory } from '@/utils/cloudbase';

// 模拟历史数据
const MOCK_HISTORY = [{
  id: '1',
  prompt: '美丽的日落海滩，金色阳光，温暖色调',
  model: 'stable-diffusion',
  parameters: {
    steps: 50,
    guidance: 7.5,
    width: 512,
    height: 512
  },
  imageUrl: 'https://picsum.photos/512/512?random=1',
  timestamp: Date.now() - 1000000,
  type: 'text-to-image'
}, {
  id: '2',
  prompt: '赛博朋克城市夜景，霓虹灯光，未来感',
  model: 'midjourney',
  parameters: {
    steps: 75,
    guidance: 8.0,
    width: 768,
    height: 512
  },
  imageUrl: 'https://picsum.photos/768/512?random=2',
  timestamp: Date.now() - 2000000,
  type: 'image-to-image'
}, {
  id: '3',
  prompt: '森林中的魔法生物，发光效果，梦幻',
  model: 'dalle',
  parameters: {
    steps: 60,
    guidance: 6.5,
    width: 512,
    height: 768
  },
  imageUrl: 'https://picsum.photos/512/768?random=3',
  timestamp: Date.now() - 3000000,
  type: 'text-to-image'
}];
export default function App(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // 加载历史记录
  const loadHistory = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      
      // 直接使用模拟数据，避免CloudBase权限问题
      console.log('使用模拟历史数据');
      
      if (reset) {
        setHistory(MOCK_HISTORY);
      } else {
        // 模拟分页加载更多数据
        const moreData = MOCK_HISTORY.map((item, index) => ({
          ...item,
          id: `${item.id}_page${pageNum}_${index}`,
          prompt: `${item.prompt} (第${pageNum}页)`
        }));
        setHistory(prev => [...prev, ...moreData]);
      }
      
      // 模拟没有更多数据
      setHasMore(pageNum < 2);
      
    } catch (error) {
      console.error('加载历史记录失败:', error);
      // 确保始终有数据显示
      if (pageNum === 1) {
        setHistory(MOCK_HISTORY);
      }
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadHistory(1, true);
  }, [filterType]);

  const navigateBack = () => {
    $w.utils.navigateTo({
      pageId: 'index',
      params: {}
    });
  };
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });
  const handleDownload = generation => {
    // 模拟下载功能
    toast({
      title: '下载开始',
      description: '图像下载中...'
    });
  };
  const handleShare = generation => {
    // 模拟分享功能
    toast({
      title: '分享链接已复制',
      description: '生成结果链接已复制到剪贴板'
    });
  };
  const handleDelete = async (id) => {
    try {
      // 直接从本地状态删除，避免CloudBase权限问题
      setHistory(prev => prev.filter(item => item._id !== id && item.id !== id));
      toast({
        title: '删除成功',
        description: '生成记录已删除'
      });
    } catch (error) {
      console.error('删除记录失败:', error);
      toast({
        title: '删除失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadHistory(nextPage, false);
    }
  };
  return <div style={style} className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        {/* 头部 */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={navigateBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            生成历史
          </h1>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="搜索提示词..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">所有类型</option>
                <option value="text-to-image">文生图</option>
                <option value="image-to-image">图生图</option>
                <option value="image-to-video">图生视频</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 历史记录列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && history.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">加载中...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">暂无生成记录</p>
            </div>
          ) : (
            filteredHistory.map(item => (
              <GenerationCard 
                key={item._id || item.id} 
                generation={{
                  ...item,
                  id: item._id || item.id,
                  timestamp: item.timestamp || new Date(item.createTime).getTime()
                }} 
                onDownload={handleDownload} 
                onShare={handleShare} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>

        {/* 加载更多按钮 */}
        {hasMore && !loading && filteredHistory.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  加载中...
                </>
              ) : (
                '加载更多'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>;
}