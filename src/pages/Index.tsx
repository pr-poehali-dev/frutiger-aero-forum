import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URLS = {
  auth: 'https://functions.poehali.dev/6d95dc38-8fc8-4d36-b094-81ee8081b7e9',
  chat: 'https://functions.poehali.dev/5aeb0897-4934-419e-a1e7-23fb6c69a537',
  stats: 'https://functions.poehali.dev/7ae690ba-0dd6-4e3a-bd1a-4a3e14dccd72',
  playlist: 'https://functions.poehali.dev/14f1a4da-9e92-4d19-8c3f-dd0c1a6ee3da',
};

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('forum');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_users: 0, online_users: 0, total_topics: 567, total_messages: 8901 });
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playlistDate, setPlaylistDate] = useState('');

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

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URLS.chat);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch(API_URLS.auth);
      const data = await response.json();
      setOnlineUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(API_URLS.stats);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPlaylist = async () => {
    try {
      const response = await fetch(API_URLS.playlist);
      const data = await response.json();
      setPlaylist(data.playlist || []);
      setPlaylistDate(data.date || '');
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchOnlineUsers();
    fetchStats();
    fetchPlaylist();

    const interval = setInterval(() => {
      fetchMessages();
      fetchOnlineUsers();
      fetchStats();
    }, 3000);

    const playlistInterval = setInterval(() => {
      fetchPlaylist();
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(playlistInterval);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(data.user);
        setShowLogin(false);
        toast({ title: 'Успешно!', description: `Добро пожаловать, ${data.user.username}!` });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Неверные данные', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    }
  };

  const sendMessage = async () => {
    if (!currentUser) {
      toast({ title: 'Войдите в систему', description: 'Нужно войти, чтобы писать сообщения', variant: 'destructive' });
      setShowLogin(true);
      return;
    }

    if (chatMessage.trim()) {
      try {
        const response = await fetch(API_URLS.chat, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            message: chatMessage,
          }),
        });
        
        if (response.ok) {
          setChatMessage('');
          fetchMessages();
        }
      } catch (error) {
        toast({ title: 'Ошибка', description: 'Не удалось отправить сообщение', variant: 'destructive' });
      }
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/409ad78a-9320-42f1-ab96-b68763747d46/files/1bbc5e0e-bdee-4165-bd18-939cd01d21bf.jpg)' }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 glass-panel rounded-xl p-6 aero-reflection">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="Radio" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">
                  Frutiger World
                </h1>
                <p className="text-blue-100 text-sm">Ностальгический портал в стиле Windows Vista</p>
              </div>
            </div>
            <div className="flex gap-2">
              {currentUser ? (
                <div className="glass-button px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 border border-white/50">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs">
                        {currentUser.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-blue-900 font-semibold">{currentUser.username}</span>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowLogin(true)}
                  className="glass-button text-blue-900 font-semibold hover:scale-105 transition-transform"
                >
                  <Icon name="User" size={16} />
                  <span className="ml-2">Войти</span>
                </Button>
              )}
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
                <div className="p-6 space-y-6">
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

                  <div className="glass-panel rounded-lg p-6 aero-reflection">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-900">📅 Плейлист на сегодня</h3>
                      <span className="text-sm text-blue-600">{playlistDate}</span>
                    </div>
                    <p className="text-xs text-blue-600 mb-4">Обновляется каждые 24 часа</p>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {playlist.map((song, index) => (
                          <div key={index} className="glass-panel rounded-lg p-3 flex items-center justify-between hover:bg-white/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                {song.order}
                              </div>
                              <div>
                                <p className="font-semibold text-blue-900">{song.title}</p>
                                <p className="text-sm text-blue-700">{song.artist}</p>
                              </div>
                            </div>
                            <span className="text-sm text-blue-600">{song.duration}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
                                  {msg.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-blue-900 text-sm">{msg.username}</span>
                                  <span className="text-xs text-blue-600">{formatTime(msg.created_at)}</span>
                                </div>
                                <p className="text-blue-800">{msg.message}</p>
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
                    <Button 
                      size="lg" 
                      className="glass-button text-blue-900 font-bold hover:scale-105 transition-transform"
                      onClick={() => window.open('https://t.me/Frutigeraero_chat', '_blank')}
                    >
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
                    <h3 className="text-xl font-bold text-blue-900">Техподдержка</h3>
                    <div className="text-left space-y-3 glass-panel rounded-lg p-4">
                      <p className="text-blue-700">Напишите нам на почту:</p>
                      <a href="mailto:belugakitovski@gmail.com" className="text-blue-900 font-bold text-lg hover:underline block">
                        belugakitovski@gmail.com
                      </a>
                      <p className="text-sm text-blue-600">Мы ответим в течение недели</p>
                    </div>
                    <Button 
                      size="lg" 
                      className="glass-button text-blue-900 font-bold hover:scale-105 transition-transform w-full"
                      onClick={() => window.location.href = 'mailto:belugakitovski@gmail.com'}
                    >
                      <Icon name="Mail" size={18} />
                      <span className="ml-2">Написать письмо</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass-panel border-none shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">👥 Онлайн ({stats.online_users})</h3>
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 glass-panel rounded-lg p-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg animate-pulse"></div>
                      <span className="text-blue-900 font-medium">{user.username}</span>
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
                      <span className="font-bold text-blue-900">{stats.total_users}</span>
                    </div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Тем на форуме</span>
                      <span className="font-bold text-blue-900">{stats.total_topics}</span>
                    </div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Сообщений</span>
                      <span className="font-bold text-blue-900">{stats.total_messages}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="glass-panel border-white/50">
          <DialogHeader>
            <DialogTitle className="text-blue-900 text-2xl">Вход в систему</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-blue-900">Имя пользователя</label>
              <Input
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Admin"
                className="glass-panel border-white/50 text-blue-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-blue-900">Пароль</label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="admin123"
                className="glass-panel border-white/50 text-blue-900"
              />
            </div>
            <p className="text-xs text-blue-600">Подсказка: Admin / admin123</p>
            <Button 
              onClick={handleLogin}
              className="glass-button text-blue-900 font-bold w-full hover:scale-105 transition-transform"
            >
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;