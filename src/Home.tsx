import React, { useState, useEffect, useRef } from 'react';
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
  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchTopRepositories = async () => {
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
        const response = await fetch(
          `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&per_page=10`
        );
        if (!response.ok) throw new Error('獲取資料失敗');
        const data = await response.json();
        setRepositories(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : '發生錯誤');
      } finally {
        setLoading(false);
      }
    };
    fetchTopRepositories();
  }, [timeRange]);

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            GitHub 趨勢排行
          </h1>
          <p className="text-gray-400 mt-4">探索 GitHub 最熱門的開源專案，掌握最新趨勢</p>
        </header>

        <div className="flex justify-center gap-2 mb-10">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all border ${{
                day: 'border-blue-500',
                week: 'border-green-500',
                month: 'border-purple-500',
                year: 'border-orange-500',
              }[range]} ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {range === 'day' ? '今日' : range === 'week' ? '本週' : range === 'month' ? '本月' : '今年'}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            <span className="ml-4 text-lg text-gray-300">載入中...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 rounded p-4 text-center max-w-xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {repositories.map((repo) => (
              <div key={repo.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <img src={repo.owner.avatar_url} alt={repo.owner.login} className="h-10 w-10 rounded-full border-2 border-blue-500" />
                    <div>
                      <p className="text-sm text-blue-400">{repo.owner.login}</p>
                      <h3 className="text-lg font-bold text-white">{repo.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">{repo.description || '此專案沒有描述'}</p>
                  <div className="mt-auto flex flex-wrap gap-2 text-xs">
                    {repo.language && (
                      <span className={`px-2 py-1 rounded ${languageColors[repo.language] || 'bg-gray-700'} text-white`}>{repo.language}</span>
                    )}
                    <span className="px-2 py-1 rounded bg-blue-900 text-blue-300 border border-blue-700">Forks: {repo.forks_count}</span>
                    <span className="px-2 py-1 rounded bg-yellow-600 text-white">⭐ {repo.stargazers_count}</span>
                  </div>
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-600 text-center py-2 rounded-b hover:bg-blue-700 transition font-medium"
                >
                  查看專案
                </a>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          使用 GitHub API 獲取資料 • 設計與開發 © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
