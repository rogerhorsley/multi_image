// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from '@/components/ui';
// @ts-ignore;
import { Download, Share2, Trash2 } from 'lucide-react';

export function GenerationCard({
  generation,
  onDownload,
  onShare,
  onDelete
}) {
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium truncate">{generation.prompt}</CardTitle>
        <CardDescription className="text-xs">
          {new Date(generation.timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <img src={generation.imageUrl} alt={generation.prompt} className="w-full h-48 object-cover rounded-lg" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onDownload(generation)}>
          <Download className="h-4 w-4 mr-2" />
          下载
        </Button>
        <Button variant="outline" size="sm" onClick={() => onShare(generation)}>
          <Share2 className="h-4 w-4 mr-2" />
          分享
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(generation.id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          删除
        </Button>
      </CardFooter>
    </Card>;
}