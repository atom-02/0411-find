import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { usePosts } from './usePosts';
import { TTSButton } from './TTS';
import { 
  Search, 
  Plus, 
  LogOut, 
  MapPin, 
  Calendar, 
  User as UserIcon, 
  CheckCircle2, 
  X,
  AlertCircle,
  Package,
  Search as SearchIcon,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const { user, loading: authLoading, signIn, logout } = useAuth();
  const { posts, loading: postsLoading, addPost, updatePostStatus, deletePost } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newPost, setNewPost] = useState({
    type: 'lost' as 'lost' | 'found',
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Package className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">FindMyStuff</h1>
          <p className="text-gray-600 mb-10 text-lg">
            분실물을 찾고 습득물을 신고하는 가장 빠른 방법.<br/>
            지금 로그인하고 커뮤니티와 함께하세요.
          </p>
          <button
            onClick={signIn}
            className="w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Google 계정으로 시작하기
          </button>
        </motion.div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.type === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPost(newPost);
    setIsModalOpen(false);
    setNewPost({
      type: 'lost',
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FindMyStuff</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
              <span className="font-medium">{user.displayName}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero & Search */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">무엇을 도와드릴까요?</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="물건 이름, 장소 등으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Plus size={24} />
              게시물 등록
            </button>
          </div>
        </section>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter('all')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
              filter === 'all' ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            )}
          >
            전체보기
          </button>
          <button 
            onClick={() => setFilter('lost')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
              filter === 'lost' ? "bg-red-500 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            )}
          >
            분실물
          </button>
          <button 
            onClick={() => setFilter('found')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
              filter === 'found' ? "bg-green-500 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            )}
          >
            습득물
          </button>
        </div>

        {/* Posts Grid */}
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                        post.type === 'lost' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                      )}>
                        {post.type === 'lost' ? '분실' : '습득'}
                      </span>
                      <div className="flex items-center gap-2">
                        <TTSButton text={`${post.title}. ${post.description}`} />
                        {post.status === 'resolved' && (
                          <span className="bg-blue-50 text-blue-600 p-1 rounded-full">
                            <CheckCircle2 size={16} />
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={14} />
                        <span>{post.location || '장소 미지정'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} />
                        <span>{post.date || '날짜 미지정'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <UserIcon size={12} className="text-gray-400" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{post.authorName}</span>
                    </div>
                    
                    {post.authorUid === user.uid && post.status === 'active' && (
                      <button 
                        onClick={() => updatePostStatus(post.id, 'resolved')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        해결 완료
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">검색 결과가 없습니다.</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold">새 게시물 등록</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNewPost({...newPost, type: 'lost'})}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      newPost.type === 'lost' ? "bg-white text-red-600 shadow-sm" : "text-gray-500"
                    )}
                  >
                    분실물
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPost({...newPost, type: 'found'})}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      newPost.type === 'found' ? "bg-white text-green-600 shadow-sm" : "text-gray-500"
                    )}
                  >
                    습득물
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
                  <input 
                    required
                    type="text" 
                    placeholder="예: 검은색 가죽 지갑을 잃어버렸어요"
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">상세 내용</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="물건의 특징, 잃어버린/습득한 상황 등을 자세히 적어주세요."
                    value={newPost.description}
                    onChange={e => setNewPost({...newPost, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">장소</label>
                    <input 
                      type="text" 
                      placeholder="예: 강남역 2번 출구"
                      value={newPost.location}
                      onChange={e => setNewPost({...newPost, location: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">날짜</label>
                    <input 
                      type="date" 
                      value={newPost.date}
                      onChange={e => setNewPost({...newPost, date: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 mt-4"
                >
                  등록하기
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
