import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('forum');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'User123', text: 'Привет всем!', time: '14:32' },
    { id: 2, user: 'Admin', text: 'Добро пожаловать на форум!', time: '14:35' },
  ]);

  const forumPosts = [
    { 
      id: 1, 
      title: 'Добро пожаловать на форум!', 
      author: 'Admin', 
      replies: 42, 
      category: 'Общее',
      time: '2 часа назад'
    },
    { 
      id: 2, 
      title: 'Обсуждение новой музыки на радио', 
      author: 'MusicLover', 
      replies: 18, 
      category: 'Радио',
      time: '5 часов назад'
    },
    { 
      id: 3, 
      title: 'Как настроить голосовой чат?', 
      author: 'Newbie', 
      replies: 8, 
      category: 'Помощь',
      time: '1 день назад'
    },
  ];

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: 'Вы',
        text: chatMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 glass-panel rounded-xl p-6 aero-reflection">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="Radio" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">
                  FORUM
                </h1>
                <p className="text-blue-100 text-sm">Ностальгический портал в стиле Windows Vista</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="glass-button text-blue-900 font-semibold hover:scale-105 transition-transform">
                <Icon name="User" size={16} />
                <span className="ml-2">Войти</span>
              </Button>
            </div>
          </div>
        </header>

        <nav className="mb-6 glass-panel rounded-xl p-2 flex gap-2 aero-reflection">
          {[
            { id: 'forum', label: 'Форум', icon: 'MessageSquare' },
            { id: 'radio', label: 'Радио', icon: 'Radio' },
            { id: 'chat', label: 'Онлайн Чат', icon: 'MessageCircle' },
            { id: 'telegram', label: 'Telegram', icon: 'Send' },
            { id: 'support', label: 'Поддержка', icon: 'Headphones' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex-1 glass-button rounded-lg px-4 py-3 font-semibold transition-all ${
                activeSection === item.id 
                  ? 'bg-gradient-to-b from-white/50 to-white/30 text-blue-900 shadow-lg' 
                  : 'text-blue-800 hover:text-blue-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon name={item.icon as any} size={18} />
                <span className="hidden md:inline">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeSection === 'forum' && (
              <Card className="glass-panel border-none shadow-2xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">Последние обсуждения</h2>
                  <div className="space-y-3">
                    {forumPosts.map((post) => (
                      <div 
                        key={post.id} 
                        className="glass-panel rounded-lg p-4 hover:bg-white/30 transition-all cursor-pointer aero-reflection"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12 border-2 border-white/50 shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold">
                              {post.author[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-blue-900">{post.title}</h3>
                                <p className="text-sm text-blue-700">
                                  {post.author} • {post.category}
                                </p>
                              </div>
                              <span className="text-xs text-blue-600">{post.time}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-sm text-blue-700">
                              <span className="flex items-center gap-1">
                                <Icon name="MessageSquare" size={14} />
                                {post.replies} ответов
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'radio' && (
              <Card className="glass-panel border-none shadow-2xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">🎵 Радио FM</h2>
                  <div className="glass-panel rounded-lg p-6 space-y-4 aero-reflection">
                    <div className="flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                        <Icon name="Radio" size={80} className="text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">Сейчас играет</h3>
                      <p className="text-lg text-blue-700">Frutiger Aero Mix 2007</p>
                      <p className="text-sm text-blue-600">Ностальгическая волна</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button size="lg" className="glass-button text-blue-900 font-bold hover:scale-110 transition-transform">
                        <Icon name="Play" size={24} />
                      </Button>
                      <Button size="lg" className="glass-button text-blue-900 font-bold hover:scale-110 transition-transform">
                        <Icon name="SkipForward" size={24} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'chat' && (
              <Card className="glass-panel border-none shadow-2xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">💬 Онлайн Чат</h2>
                  <div className="glass-panel rounded-lg p-4 space-y-4 aero-reflection">
                    <ScrollArea className="h-96 pr-4">
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div key={msg.id} className="glass-panel rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Avatar className="w-8 h-8 border border-white/50">
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                                  {msg.user[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-blue-900 text-sm">{msg.user}</span>
                                  <span className="text-xs text-blue-600">{msg.time}</span>
                                </div>
                                <p className="text-blue-800">{msg.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2 mt-4">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Введите сообщение..."
                        className="glass-panel border-white/50 text-blue-900 placeholder:text-blue-600"
                      />
                      <Button onClick={sendMessage} className="glass-button text-blue-900 font-bold">
                        <Icon name="Send" size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'telegram' && (
              <Card className="glass-panel border-none shadow-2xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">📱 Наш Telegram</h2>
                  <div className="glass-panel rounded-lg p-8 text-center space-y-4 aero-reflection">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                        <Icon name="Send" size={64} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Присоединяйтесь к сообществу!</h3>
                    <p className="text-blue-700">Новости, обсуждения и эксклюзивный контент</p>
                    <Button size="lg" className="glass-button text-blue-900 font-bold hover:scale-105 transition-transform">
                      <Icon name="Send" size={18} />
                      <span className="ml-2">Открыть Telegram</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'support' && (
              <Card className="glass-panel border-none shadow-2xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">🎧 Поддержка</h2>
                  <div className="glass-panel rounded-lg p-8 text-center space-y-4 aero-reflection">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                        <Icon name="Headphones" size={64} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Техподдержка 24/7</h3>
                    <p className="text-blue-700">Мы всегда готовы помочь!</p>
                    <div className="space-y-2">
                      <Button size="lg" className="glass-button text-blue-900 font-bold hover:scale-105 transition-transform w-full">
                        <Icon name="MessageCircle" size={18} />
                        <span className="ml-2">Начать чат</span>
                      </Button>
                      <Button size="lg" className="glass-button text-blue-900 font-bold hover:scale-105 transition-transform w-full">
                        <Icon name="Mail" size={18} />
                        <span className="ml-2">Написать email</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass-panel border-none shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">👥 Онлайн</h3>
                <div className="space-y-2">
                  {['Admin', 'User123', 'MusicLover', 'Newbie', 'Guest'].map((user) => (
                    <div key={user} className="flex items-center gap-2 glass-panel rounded-lg p-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg"></div>
                      <span className="text-blue-900 font-medium">{user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="glass-panel border-none shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">📊 Статистика</h3>
                <div className="space-y-3">
                  <div className="glass-panel rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Пользователей</span>
                      <span className="font-bold text-blue-900">1,234</span>
                    </div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Тем на форуме</span>
                      <span className="font-bold text-blue-900">567</span>
                    </div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Сообщений</span>
                      <span className="font-bold text-blue-900">8,901</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
