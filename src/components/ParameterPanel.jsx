// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Slider } from '@/components/ui';

export function ParameterPanel({
  parameters,
  onParameterChange
}) {
  const handleSliderChange = (key, value) => {
    onParameterChange(key, value[0]);
  };
  const handleInputChange = (key, value) => {
    onParameterChange(key, parseFloat(value) || 0);
  };
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">生成参数</CardTitle>
        <CardDescription>调整模型生成参数</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {parameters.map(param => <div key={param.key} className="space-y-2">
            <Label htmlFor={param.key}>{param.label}</Label>
            {param.type === 'slider' ? <div className="space-y-2">
                <Slider id={param.key} min={param.min} max={param.max} step={param.step} value={[param.value]} onValueChange={value => handleSliderChange(param.key, value)} className="w-full" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{param.min}</span>
                  <span>{param.value}</span>
                  <span>{param.max}</span>
                </div>
              </div> : <Input id={param.key} type="number" value={param.value} onChange={e => handleInputChange(param.key, e.target.value)} min={param.min} max={param.max} step={param.step} />}
          </div>)}
      </CardContent>
    </Card>;
}