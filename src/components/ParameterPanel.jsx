// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Button } from '@/components/ui';

export function ParameterPanel({
  parameters,
  onParameterChange,
  activeTab
}) {
  const handleSliderChange = (key, value) => {
    onParameterChange(key, value);
  };
  
  const handleInputChange = (key, value) => {
    if (key === 'seed' && value === '') {
      onParameterChange(key, '');
    } else {
      onParameterChange(key, parseFloat(value) || 0);
    }
  };

  const handleSelectChange = (key, value) => {
    onParameterChange(key, value);
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 999999);
    onParameterChange('seed', randomSeed);
  };

  // 根据当前模式筛选相关参数
  const getRelevantParameters = () => {
    return parameters.filter(param => {
      if (activeTab === 'image-to-video') {
        return ['aspectRatio', 'quality', 'duration'].includes(param.key);
      } else if (activeTab === 'image-to-image') {
        return ['aspectRatio', 'quality', 'style'].includes(param.key);
      } else {
        return ['aspectRatio', 'quality'].includes(param.key);
      }
    });
  };

  const relevantParams = getRelevantParameters();

  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">生成参数</CardTitle>
        <CardDescription>
          {activeTab === 'image-to-video' ? '调整视频生成参数' : '调整图像生成参数'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {relevantParams.map(param => (
          <div key={param.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={param.key} className="text-sm font-medium text-white">
                {param.label}
              </label>
            </div>
            
            {param.description && (
              <p className="text-xs text-gray-400">{param.description}</p>
            )}
            
            <select
              id={param.key}
              value={param.value}
              onChange={(e) => handleSelectChange(param.key, e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {param.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        
        <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
          <h5 className="text-sm font-medium text-purple-400 mb-2">参数说明</h5>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 生成步数：更多步数通常质量更好，但耗时更长</li>
            <li>• 引导强度：控制对提示词的遵循程度</li>
            <li>• 随机种子：固定种子可重现相同结果</li>
            {activeTab === 'image-to-image' && (
              <li>• 变化强度：控制相对原图的变化程度</li>
            )}
            {activeTab === 'image-to-video' && (
              <li>• 视频时长：生成视频的秒数</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>;
}