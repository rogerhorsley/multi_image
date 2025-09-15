// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Image, Upload, Play, History } from 'lucide-react';

import { ModelSelector } from '@/components/ModelSelector';
import { ParameterPanel } from '@/components/ParameterPanel';
import { generateImage, saveGenerationHistory } from '@/utils/cloudbase';
const MODELS = [
  // 图像生成模型
  {
    id: 'seedream-4',
    name: 'SeDream 4',
    type: 'image',
    description: '字节跳动最新图像生成模型',
    provider: 'ByteDance'
  },
  {
    id: 'flux-schnell',
    name: 'FLUX Schnell',
    type: 'image',
    description: 'Black Forest Labs快速生成模型',
    provider: 'Black Forest Labs'
  },
  {
    id: 'imagen-4-fast',
    name: 'Imagen 4 Fast',
    type: 'image',
    description: 'Google快速图像生成模型',
    provider: 'Google'
  },
  {
    id: 'qwen-image',
    name: 'Qwen Image',
    type: 'image',
    description: '通义千问图像生成模型',
    provider: 'Alibaba'
  },
  {
    id: 'seedream-3',
    name: 'SeDream 3',
    type: 'image',
    description: '字节跳动图像生成模型',
    provider: 'ByteDance'
  },
  // 视频生成模型
  {
    id: 'veo-3-fast',
    name: 'Veo 3 Fast',
    type: 'video',
    description: 'Google快速视频生成模型',
    provider: 'Google'
  },
  {
    id: 'seedance-1-pro',
    name: 'SeDance 1 Pro',
    type: 'video',
    description: '字节跳动专业视频生成模型',
    provider: 'ByteDance'
  },
  {
    id: 'hailuo-02',
    name: 'Hailuo 02',
    type: 'video',
    description: 'MiniMax海螺视频生成模型',
    provider: 'MiniMax'
  },
  {
    id: 'kling-v2.1',
    name: 'Kling v2.1',
    type: 'video',
    description: '快手可灵视频生成模型',
    provider: 'Kuaishou'
  }
];
const DEFAULT_PARAMETERS = [{
  key: 'aspectRatio',
  label: '画面比例',
  type: 'select',
  options: [
    { value: '1:1', label: '正方形 (1:1)', width: 1024, height: 1024 },
    { value: '4:3', label: '标准 (4:3)', width: 1024, height: 768 },
    { value: '3:4', label: '竖屏 (3:4)', width: 768, height: 1024 },
    { value: '16:9', label: '宽屏 (16:9)', width: 1024, height: 576 },
    { value: '9:16', label: '手机竖屏 (9:16)', width: 576, height: 1024 }
  ],
  value: '1:1',
  description: '选择生成图像的画面比例'
}, {
  key: 'quality',
  label: '生成质量',
  type: 'select',
  options: [
    { value: 'fast', label: '快速生成', steps: 20, guidance: 5 },
    { value: 'standard', label: '标准质量', steps: 30, guidance: 7.5 },
    { value: 'high', label: '高质量', steps: 50, guidance: 10 }
  ],
  value: 'standard',
  description: '选择生成速度和质量的平衡'
}, {
  key: 'style',
  label: '风格强度',
  type: 'select',
  options: [
    { value: 'light', label: '轻微调整', strength: 0.3 },
    { value: 'medium', label: '适中变化', strength: 0.6 },
    { value: 'strong', label: '强烈变化', strength: 0.9 }
  ],
  value: 'medium',
  description: '图生图时的变化程度，仅在图生图模式下有效'
}, {
  key: 'duration',
  label: '视频时长',
  type: 'select',
  options: [
    { value: 3, label: '3秒 (快速)' },
    { value: 5, label: '5秒 (标准)' },
    { value: 8, label: '8秒 (较长)' },
    { value: 10, label: '10秒 (长视频)' }
  ],
  value: 5,
  description: '生成视频的时长，仅在视频生成模式下有效'
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
  
  // 确保组件正确挂载
  useEffect(() => {
    // 组件挂载后的初始化逻辑
  }, []);
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
  const handleGenerateImage = async () => {
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
      // 获取当前参数值
      const currentParams = parameters.reduce((acc, param) => {
        acc[param.key] = param.value;
        return acc;
      }, {});

      // 根据简化参数计算实际技术参数
      const aspectRatioParam = parameters.find(p => p.key === 'aspectRatio');
      const qualityParam = parameters.find(p => p.key === 'quality');
      const styleParam = parameters.find(p => p.key === 'style');
      
      const selectedAspectRatio = aspectRatioParam?.options?.find(opt => opt.value === currentParams.aspectRatio);
      const selectedQuality = qualityParam?.options?.find(opt => opt.value === currentParams.quality);
      const selectedStyle = styleParam?.options?.find(opt => opt.value === currentParams.style);

      // 构建实际的生成参数
      const generateParams = {
        prompt: prompt.trim(),
        model: selectedModel,
        width: selectedAspectRatio?.width || 1024,
        height: selectedAspectRatio?.height || 1024,
        steps: selectedQuality?.steps || 30,
        guidance: selectedQuality?.guidance || 7.5,
        seed: Math.floor(Math.random() * 999999), // 自动生成随机种子
        type: activeTab
      };

      // 如果是图生图或图生视频模式，添加参考图像
      if ((activeTab === 'image-to-image' || activeTab === 'image-to-video') && referenceImage) {
        generateParams.referenceImage = referenceImage.dataUrl;
        if (activeTab === 'image-to-image') {
          generateParams.strength = selectedStyle?.strength || 0.6;
        }
      }

      // 如果是视频生成，添加时长参数
      if (activeTab === 'image-to-video') {
        generateParams.duration = currentParams.duration || 5;
      }

      // 调用CloudBase云函数生成图像
      const result = await generateImage(generateParams);

      if (result.success) {
        const generationData = result.data;
        setGeneratedImage(generationData.imageUrl);

        // 保存到CloudBase数据库
        try {
          await saveGenerationHistory({
            ...generationData,
            originalParams: currentParams, // 保存用户选择的简化参数
            technicalParams: generateParams // 保存实际的技术参数
          });
        } catch (saveError) {
          console.warn('保存历史记录失败:', saveError);
          // 不影响主流程，只是警告
        }

        toast({
          title: '生成成功',
          description: '图像已生成完成'
        });
      } else {
        throw new Error(result.message || '生成失败');
      }
    } catch (error) {
      console.error('生成图像失败:', error);
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧模型选择 */}
          <div className="lg:col-span-1">
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelChange={handleModelChange} 
              models={MODELS}
              activeTab={activeTab}
            />
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
                        </div> : <div className="w-64 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors" onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}>
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
                        </div> : <div className="w-64 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors" onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}>
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
              <Button onClick={handleGenerateImage} disabled={isGenerating} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
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
            <ParameterPanel 
              parameters={parameters} 
              onParameterChange={handleParameterChange}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    </div>;
}