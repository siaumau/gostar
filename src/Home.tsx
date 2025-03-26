import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  language: string;
  forks_count: number;
}

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const saved = localStorage.getItem('itemsPerPage');
    return saved ? parseInt(saved) : 12;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('itemsPerPage', itemsPerPage.toString());
  }, [itemsPerPage]);

  const fetchRepositories = async (query: string = '') => {
    try {
      setLoading(true);
      const date = new Date();
      switch (timeRange) {
        case 'day': date.setDate(date.getDate() - 1); break;
        case 'week': date.setDate(date.getDate() - 7); break;
        case 'month': date.setMonth(date.getMonth() - 1); break;
        case 'year': date.setFullYear(date.getFullYear() - 1); break;
      }
      const dateString = format(date, 'yyyy-MM-dd');

      let apiUrl = `https://api.github.com/search/repositories?sort=stars&order=desc&per_page=32`;

      if (query) {
        apiUrl += `&q=${encodeURIComponent(query)}`;
      } else {
        apiUrl += `&q=created:>${dateString}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('獲取資料失敗');
      const data = await response.json();
      setRepositories(data.items);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchRepositories(searchQuery);
    } else {
      fetchRepositories();
    }
  }, [timeRange]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    fetchRepositories(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 計算分頁
  const totalPages = Math.ceil(repositories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRepositories = repositories.slice(startIndex, endIndex);

  const languageColors: Record<string, string> = {
    JavaScript: 'bg-yellow-500',
    TypeScript: 'bg-blue-600',
    Python: 'bg-green-600',
    Java: 'bg-red-600',
    'C#': 'bg-purple-600',
    PHP: 'bg-indigo-600',
    Go: 'bg-cyan-600',
    Ruby: 'bg-pink-600',
    Rust: 'bg-orange-600',
    Kotlin: 'bg-amber-600',
    Swift: 'bg-rose-600',
    Dart: 'bg-teal-600',
    C: 'bg-gray-600',
    'C++': 'bg-blue-800',
  };

  const renderRepository = (repo: Repository) => (
    <div key={repo.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col min-w-full sm:min-w-0 h-[20rem] sm:h-[24rem] group">
      <div className="p-4 sm:p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border-2 border-blue-500/50 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col justify-center overflow-hidden">
            <p className="text-blue-400 text-sm sm:text-base mb-0.5 sm:mb-1 truncate opacity-75 group-hover:opacity-100 transition-opacity">{repo.owner.login}</p>
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400">{repo.name}</h3>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors">{repo.description || '此專案沒有描述'}</p>
        <div className="mt-auto space-y-2 sm:space-y-3">
          {repo.language && (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-700'} shadow-sm`}></span>
              <span className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors">{repo.language}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400/75 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span className="text-blue-400/75 group-hover:text-blue-400 transition-colors">{repo.forks_count}</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400/75 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-400/75 group-hover:text-yellow-400 transition-colors">{repo.stargazers_count}</span>
            </span>
          </div>
        </div>
      </div>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-center py-2.5 sm:py-3 rounded-b-xl text-sm sm:text-base font-medium text-white/90 hover:text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group-hover:shadow-lg"
      >
        查看專案
      </a>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-2 sm:mb-4 leading-tight animate-gradient">
            GitHub 趨勢排行
          </h1>
          <p className="text-base sm:text-xl text-gray-400 px-4">探索 GitHub 最熱門的開源專案,掌握最新趨勢。</p>
        </header>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
          <div className="flex justify-center gap-2 flex-nowrap">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border-2 backdrop-blur-sm whitespace-nowrap ${
                  {
                    day: 'border-blue-500/50 hover:bg-blue-500/20',
                    week: 'border-green-500/50 hover:bg-green-500/20',
                    month: 'border-purple-500/50 hover:bg-purple-500/20',
                    year: 'border-orange-500/50 hover:bg-orange-500/20',
                  }[range]
                } ${
                  timeRange === range
                    ? `bg-gradient-to-r ${
                      {
                        day: 'from-blue-600/90 to-blue-700/90',
                        week: 'from-green-600/90 to-green-700/90',
                        month: 'from-purple-600/90 to-purple-700/90',
                        year: 'from-orange-600/90 to-orange-700/90',
                      }[range]
                    } text-white shadow-lg`
                    : 'bg-gray-800/50 text-gray-300 hover:text-white'
                }`}
              >
                {range === 'day' ? '今日' : range === 'week' ? '本週' : range === 'month' ? '本月' : '今年'}
              </button>
            ))}
          </div>
          <div className="flex w-full sm:w-96 max-w-full">
            <input
              type="text"
              placeholder="搜尋專案名稱、描述或作者..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 rounded-l-xl bg-gray-800/50 backdrop-blur-sm border-2 border-r-0 border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white rounded-r-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center border-2 border-l-0 border-transparent backdrop-blur-sm"
              style={{ minWidth: '44px' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline ml-2">搜尋</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">每頁顯示：</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>
          <div className="text-gray-400 text-sm">
            共 {repositories.length} 個專案
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="ml-6 text-2xl text-gray-300">載入中...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 text-red-400 rounded-lg p-6 text-center max-w-xl mx-auto text-lg">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="relative">
            {isMobile && (
              <>
                <button
                  onClick={() => scrollCarousel('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gray-800/80 rounded-full p-3 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gray-800/80 rounded-full p-3 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div
              ref={carouselRef}
              className={`
                ${isMobile ? 'flex overflow-x-auto snap-x snap-mandatory hide-scrollbar' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}
                gap-6
              `}
            >
              {currentRepositories.map((repo) => (
                <div key={repo.id} className={`${isMobile ? 'snap-center w-full flex-shrink-0' : ''}`}>
                  {renderRepository(repo)}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && repositories.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <p className="text-xl">沒有找到符合搜尋條件的專案</p>
          </div>
        )}

        {!loading && !error && repositories.length > 0 && !isMobile && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一頁
            </button>
            <span className="text-gray-400 text-lg">
              第 {currentPage} 頁，共 {totalPages} 頁
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
            >
              下一頁
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        <footer className="mt-16 text-center text-base text-gray-500">
          使用 GitHub API 獲取資料 • 老胖克設計與開發 © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
