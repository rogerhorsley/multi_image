// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export function ModelSelector({
  selectedModel,
  onModelChange,
  models,
  activeTab
}) {
  // 根据当前标签页筛选模型
  const filteredModels = models.filter(model => {
    if (activeTab === 'image-to-video') {
      return model.type === 'video';
    }
    return model.type === 'image';
  });

  const selectedModelInfo = models.find(m => m.id === selectedModel);

  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">选择模型</CardTitle>
        <CardDescription>
          {activeTab === 'image-to-video' ? '选择视频生成模型' : '选择图像生成模型'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {filteredModels.map(model => (
            <div
              key={model.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedModel === model.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => onModelChange(model.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{model.name}</h4>
                  <p className="text-sm text-gray-400">{model.provider}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  selectedModel === model.id ? 'bg-purple-500' : 'bg-gray-600'
                }`} />
              </div>
              {model.description && (
                <p className="text-xs text-gray-500 mt-2">{model.description}</p>
              )}
            </div>
          ))}
        </div>
        
        {selectedModelInfo && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <h5 className="text-sm font-medium text-purple-400 mb-1">当前选择</h5>
            <p className="text-sm text-white">{selectedModelInfo.name}</p>
            <p className="text-xs text-gray-400">{selectedModelInfo.description}</p>
          </div>
        )}
      </CardContent>
    </Card>;
}