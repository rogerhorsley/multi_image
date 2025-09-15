import cloudbase from '@cloudbase/js-sdk';

// CloudBase 配置
const app = cloudbase.init({
  env: 'cloud1-8gidil0r7a1a2742', // 你的环境ID
});

// 获取数据库引用
const db = app.database();

/**
 * 调用云函数生成图像
 * @param {Object} params 生成参数
 * @returns {Promise} 生成结果
 */
export async function generateImage(params) {
  try {
    const result = await app.callFunction({
      name: 'generate_image',
      data: {
        action: 'generate',
        ...params
      }
    });
    
    return result.result;
  } catch (error) {
    console.error('调用生成图像云函数失败:', error);
    throw new Error('图像生成失败，请稍后重试');
  }
}

/**
 * 保存生成历史记录
 * @param {Object} generationData 生成数据
 * @returns {Promise} 保存结果
 */
export async function saveGenerationHistory(generationData) {
  try {
    const result = await app.callFunction({
      name: 'generate_image',
      data: {
        action: 'saveHistory',
        generationData
      }
    });
    
    return result.result;
  } catch (error) {
    console.error('保存历史记录失败:', error);
    throw new Error('保存失败，请稍后重试');
  }
}

/**
 * 获取生成历史记录
 * @param {Object} params 查询参数
 * @returns {Promise} 历史记录列表
 */
export async function getGenerationHistory(params = {}) {
  try {
    const result = await app.callFunction({
      name: 'generate_image',
      data: {
        action: 'getHistory',
        ...params
      }
    });
    
    return result.result;
  } catch (error) {
    console.error('获取历史记录失败:', error);
    throw new Error('获取历史记录失败，请稍后重试');
  }
}

/**
 * 删除历史记录
 * @param {string} id 记录ID
 * @returns {Promise} 删除结果
 */
export async function deleteGenerationHistory(id) {
  try {
    const result = await app.callFunction({
      name: 'generate_image',
      data: {
        action: 'deleteHistory',
        id
      }
    });
    
    return result.result;
  } catch (error) {
    console.error('删除历史记录失败:', error);
    throw new Error('删除失败，请稍后重试');
  }
}

/**
 * 直接使用数据库查询（可选）
 */
export const database = {
  // 获取图像生成集合
  getGenerationsCollection() {
    return db.collection('image_generations');
  },
  
  // 实时监听数据变化
  watchGenerations(callback) {
    return db.collection('image_generations')
      .orderBy('createTime', 'desc')
      .watch({
        onChange: callback,
        onError: (error) => {
          console.error('数据监听错误:', error);
        }
      });
  }
};

export default app;