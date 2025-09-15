// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, ArrowLeft } from 'lucide-react';

import { GenerationCard } from '@/components/GenerationCard';

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
  const [history, setHistory] = useState(MOCK_HISTORY);
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
  const handleDelete = id => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: '删除成功',
      description: '生成记录已删除'
    });
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
          {filteredHistory.length === 0 ? <div className="col-span-full text-center py-12">
              <p className="text-gray-400">暂无生成记录</p>
            </div> : filteredHistory.map(item => <GenerationCard key={item.id} generation={item} onDownload={handleDownload} onShare={handleShare} onDelete={handleDelete} />)}
        </div>
      </div>
    </div>;
}