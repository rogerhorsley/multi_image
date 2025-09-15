import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/index.jsx'
import HistoryPage from './pages/history.jsx'
import { ToastProvider } from './components/ui/use-toast'
import './index.css'

// 简单的路由系统
function Router() {
  const [currentPage, setCurrentPage] = React.useState('index');
  
  // 模拟 $w.utils.navigateTo 功能
  const navigateTo = ({ pageId }) => {
    setCurrentPage(pageId);
  };
  
  // 创建模拟的 $w 对象
  const $w = {
    utils: {
      navigateTo
    }
  };
  
  // 根据当前页面渲染对应组件
  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return <HistoryPage $w={$w} />;
      case 'index':
      default:
        return <App $w={$w} />;
    }
  };
  
  return renderPage();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <Router />
    </ToastProvider>
  </React.StrictMode>,
)