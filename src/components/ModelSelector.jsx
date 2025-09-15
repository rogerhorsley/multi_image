// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export function ModelSelector({
  selectedModel,
  onModelChange,
  models
}) {
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">选择模型</CardTitle>
        <CardDescription>选择要使用的AI生成模型</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择模型" />
          </SelectTrigger>
          <SelectContent>
            {models.map(model => <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>;
}