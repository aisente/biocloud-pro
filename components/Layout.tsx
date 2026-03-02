
import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Database, 
  Settings, 
  HelpCircle,
  Menu,
  ChevronRight,
  Zap,
  Wand2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '项目仪表盘' },
    { id: 'toolbox', icon: Wand2, label: '生信小工具箱' },
    { id: 'wizard', icon: FlaskConical, label: '新建分析任务' },
    { id: 'data', icon: Database, label: '数据管理中心' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white transition-all duration-300 ease-in-out">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">BioCloud Pro</span>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeView === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span>系统设置</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>帮助与支持</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Sarah Chen 博士</p>
              <p className="text-xs text-slate-500">首席研究员 (PI)</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold shadow-sm">
              SC
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
