// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Image, Upload, Play, History } from 'lucide-react';

import { ModelSelector } from '@/components/ModelSelector';
import { ParameterPanel } from '@/components/ParameterPanel';
const MODELS = [{
  id: 'stable-diffusion',
  name: 'Stable Diffusion XL',
  type: 'image'
}, {
  id: 'midjourney',
  name: 'Midjourney',
  type: 'image'
}, {
  id: 'dalle',
  name: 'DALL-E 3',
  type: 'image'
}, {
  id: 'runway',
  name: 'Runway ML',
  type: 'video'
}, {
  id: 'animate-diff',
  name: 'Animate Diffusion',
  type: 'video'
}];
const DEFAULT_PARAMETERS = [{
  key: 'steps',
  label: '生成步数',
  type: 'slider',
  min: 20,
  max: 100,
  step: 1,
  value: 50
}, {
  key: 'guidance',
  label: '引导强度',
  type: 'slider',
  min: 1,
  max: 20,
  step: 0.1,
  value: 7.5
}, {
  key: 'width',
  label: '宽度',
  type: 'input',
  min: 512,
  max: 1024,
  step: 64,
  value: 512
}, {
  key: 'height',
  label: '高度',
  type: 'input',
  min: 512,
  max: 1024,
  step: 64,
  value: 512
}];
export default function App(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('text-to-image');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [parameters, setParameters] = useState(DEFAULT_PARAMETERS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const handleModelChange = modelId => {
    setSelectedModel(modelId);
  };
  const handleParameterChange = (key, value) => {
    setParameters(prev => prev.map(param => param.key === key ? {
      ...param,
      value
    } : param));
  };
  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: '文件过大',
          description: '请选择小于10MB的图片',
          variant: 'destructive'
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        setReferenceImage({
          file: file,
          dataUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: '提示词不能为空',
        description: '请输入生成提示词',
        variant: 'destructive'
      });
      return;
    }
    setIsGenerating(true);
    try {
      const params = parameters.reduce((acc, param) => {
        acc[param.key] = param.value;
        return acc;
      }, {});

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockImageUrl = `https://picsum.photos/${params.width}/${params.height}?random=${Math.random()}`;
      setGeneratedImage(mockImageUrl);

      // 保存到历史记录
      const historyItem = {
        id: Date.now().toString(),
        prompt,
        model: selectedModel,
        parameters: params,
        imageUrl: mockImageUrl,
        timestamp: Date.now(),
        type: activeTab
      };

      // 这里应该调用数据模型保存历史记录
      toast({
        title: '生成成功',
        description: '图像已生成完成'
      });
    } catch (error) {
      toast({
        title: '生成失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const navigateToHistory = () => {
    $w.utils.navigateTo({
      pageId: 'history',
      params: {}
    });
  };
  return <div style={style} className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        {/* 头部导航 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI图像生成工具
          </h1>
          <Button variant="outline" onClick={navigateToHistory}>
            <History className="h-4 w-4 mr-2" />
            历史记录
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧模型选择 */}
          <div className="lg:col-span-1">
            <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} models={MODELS} />
          </div>

          {/* 中央内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="text-to-image">文生图</TabsTrigger>
                <TabsTrigger value="image-to-image">图生图</TabsTrigger>
                <TabsTrigger value="image-to-video">图生视频</TabsTrigger>
              </TabsList>

              <TabsContent value="text-to-image" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>文本生成图像</CardTitle>
                    <CardDescription>输入提示词生成高质量图像</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea placeholder="请输入详细的描述提示词..." value={prompt} onChange={e => setPrompt(e.target.value)} className="min-h-[120px]" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image-to-image" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>图像生成图像</CardTitle>
                    <CardDescription>上传参考图并输入提示词进行风格转换</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      {referenceImage ? <div className="relative">
                          <img src={referenceImage.dataUrl} alt="参考图" className="w-64 h-64 object-cover rounded-lg" />
                          <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setReferenceImage(null)}>
                            移除
                          </Button>
                        </div> : <div className="w-64 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
                          <div className="text-center">
                            <Upload className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-400 mt-2">点击上传参考图</p>
                          </div>
                        </div>}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    <Textarea placeholder="请输入风格描述或修改提示..." value={prompt} onChange={e => setPrompt(e.target.value)} className="min-h-[100px]" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image-to-video" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>图像生成视频</CardTitle>
                    <CardDescription>基于图像生成短视频内容</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      {referenceImage ? <div className="relative">
                          <img src={referenceImage.dataUrl} alt="参考图" className="w-64 h-64 object-cover rounded-lg" />
                          <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setReferenceImage(null)}>
                            移除
                          </Button>
                        </div> : <div className="w-64 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors" onClick={() => fileInputRef.current?.click()}>
                          <div className="text-center">
                            <Image className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-400 mt-2">点击上传参考图</p>
                          </div>
                        </div>}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    <Textarea placeholder="请输入视频动作描述..." value={prompt} onChange={e => setPrompt(e.target.value)} className="min-h-[100px]" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* 生成按钮和预览 */}
            <div className="flex space-x-4">
              <Button onClick={generateImage} disabled={isGenerating} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {isGenerating ? <>生成中...</> : activeTab === 'image-to-video' ? <>
                    <Play className="h-4 w-4 mr-2" />
                    生成视频
                  </> : <>
                    <Image className="h-4 w-4 mr-2" />
                    生成图像
                  </>}
              </Button>
            </div>

            {/* 生成结果预览 */}
            {generatedImage && <Card>
                <CardHeader>
                  <CardTitle>生成结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={generatedImage} alt="生成结果" className="w-full max-w-md mx-auto rounded-lg" />
                </CardContent>
              </Card>}
          </div>

          {/* 右侧参数面板 */}
          <div className="lg:col-span-1">
            <ParameterPanel parameters={parameters} onParameterChange={handleParameterChange} />
          </div>
        </div>
      </div>
    </div>;
}