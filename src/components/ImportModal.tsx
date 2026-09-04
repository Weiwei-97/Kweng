import React, { useState } from 'react';
import { X, Upload, Globe, FileCode, CheckCircle2, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoryBook } from '../types';

export const ImportModal: React.FC = () => {
  const { isImportModalOpen, setIsImportModalOpen, importStory, setSelectedBook } = useApp();

  const [importType, setImportType] = useState<'preset' | 'json' | 'api'>('preset');
  const [jsonInput, setJsonInput] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successStory, setSuccessStory] = useState<StoryBook | null>(null);

  if (!isImportModalOpen) return null;

  const SAMPLE_PRESET_STORY: StoryBook = {
    id: 'imported-frost-' + Date.now(),
    title: 'The Frost Monarch Legacy: Absolute Zero',
    alternativeTitle: '빙설의 군주 / Sovereign of Glaciers',
    slug: 'frost-monarch-legacy-absolute-zero',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    synopsis: 'When the Northern Dimensional Rift opened over Siberia, an ancient cryogenic sovereign awakened. Frozen for ten thousand years beneath Antarctic permafrost, Julian retains absolute mastery over thermodynamic cessation. Modern hunters armed with laser rifles and plasma shields tremble as absolute zero sweeps across the battlefield.',
    author: 'Sergei K.',
    artist: 'Glacier Studio',
    rating: 9.92,
    ratingCount: 8400,
    genres: ['Action', 'Fantasy', 'Magic', 'Supernatural'],
    status: 'Ongoing',
    type: 'Web Novel',
    releaseYear: 2025,
    totalChapters: 45,
    views: 940000,
    bookmarksCount: 28400,
    isTrending: true,
    isHot: true,
    customImported: true,
    chapters: [
      {
        id: 'ch-frost-1',
        storyId: 'imported-frost-' + Date.now(),
        number: 1,
        title: 'Awakening in the Sub-Zero Vault',
        releaseDate: 'Just now (Imported)',
        readTimeMinutes: 6,
        wordCount: 1450,
        content: [
          'The thermometer inside the research bunker read minus seventy degrees Celsius before the mercury column shattered.',
          '"Dr. Aris," the technician screamed, his breath crystallizing instantly on his oxygen mask. "The sarcophagus temperature isn’t dropping because of liquid nitrogen... it’s generating the cold itself!"',
          'A hand as white as fresh snow pushed through three inches of reinforced titanium alloy.',
          'Julian opened his eyes. They were the color of glacial meltwater under a polar sun.',
          '"How long has it been?" his voice echoed not through soundwaves, but through molecular resonance that turned moisture into diamond dust.',
          '"Ten... ten thousand years, Lord Julian," the ancient AI guardian chimed.',
          'Julian smiled faintly. "Then the world has had plenty of time to forget why heat was a gift granted by my mercy."'
        ]
      }
    ],
    reviews: []
  };

  const handleImportPreset = () => {
    importStory(SAMPLE_PRESET_STORY);
    setSuccessStory(SAMPLE_PRESET_STORY);
  };

  const handleImportJson = () => {
    try {
      setErrorMsg('');
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !parsed.synopsis) {
        throw new Error('Missing required fields: title and synopsis are mandatory.');
      }

      const newStory: StoryBook = {
        id: 'custom-' + Date.now(),
        title: parsed.title,
        alternativeTitle: parsed.alternativeTitle || '',
        slug: parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        coverImage: parsed.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        synopsis: parsed.synopsis,
        author: parsed.author || 'Imported Author',
        rating: 9.8,
        ratingCount: 120,
        genres: parsed.genres || ['Fantasy', 'Action'],
        status: parsed.status || 'Ongoing',
        type: parsed.type || 'Web Novel',
        releaseYear: 2024,
        totalChapters: parsed.chapters?.length || 1,
        views: 1000,
        bookmarksCount: 50,
        customImported: true,
        chapters: parsed.chapters || [
          {
            id: 'ch-cust-1',
            storyId: 'custom-' + Date.now(),
            number: 1,
            title: 'Chapter 1: The Beginning',
            releaseDate: 'Imported',
            readTimeMinutes: 5,
            wordCount: 1200,
            content: [
              'The story begins here. You have imported this chapter via Kweng third-party API integration.',
              'All paragraphs and sentences are formatted seamlessly for high readability across desktop and mobile screens.'
            ]
          }
        ],
        reviews: []
      };

      importStory(newStory);
      setSuccessStory(newStory);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse story JSON.');
    }
  };

  const handleImportApi = async () => {
    setErrorMsg('');
    if (!apiUrl.trim()) {
      setErrorMsg('Please enter a valid API URL or Webtoon RSS endpoint.');
      return;
    }

    // Simulate API fetch & parse
    setTimeout(() => {
      const apiStory: StoryBook = {
        id: 'api-' + Date.now(),
        title: 'Chronicles of the Celestial Vanguard (API Import)',
        alternativeTitle: '천상 선봉대 / Vanguard Protocol',
        slug: 'chronicles-celestial-vanguard',
        coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
        synopsis: `Imported directly via API endpoint: ${apiUrl}. Follow the journey of an elite starfleet commander navigating dimensional fractures in the outer spiral arm.`,
        author: 'Interstellar Studio',
        rating: 9.88,
        ratingCount: 3400,
        genres: ['Sci-Fi', 'Action', 'System'],
        status: 'Ongoing',
        type: 'Manhwa',
        releaseYear: 2024,
        totalChapters: 32,
        views: 450000,
        bookmarksCount: 14200,
        customImported: true,
        chapters: [
          {
            id: 'ch-api-1',
            storyId: 'api-' + Date.now(),
            number: 1,
            title: 'Protocol 01: Sub-space Resonance',
            releaseDate: 'Just now (API)',
            readTimeMinutes: 5,
            wordCount: 1300,
            content: [
              'The warp core hummed at forty-two gigahertz.',
              'Commander Sharon watched the radar screen illuminate with twelve unknown hostile signatures emerging from the dark matter cluster.',
              '"All hands to battle stations," she commanded calmly. "Initialize the quantum photon arrays."'
            ]
          }
        ],
        reviews: []
      };

      importStory(apiStory);
      setSuccessStory(apiStory);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Close button */}
        <button
          onClick={() => { setIsImportModalOpen(false); setSuccessStory(null); }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Upload className="w-4 h-4" />
            <span>Third-Party Content Import Engine</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Import External Stories & Novels
          </h2>
          <p className="text-xs text-slate-400">
            Seamlessly import story books, web novels, or manhwa via JSON format, API feeds, or quick presets into your Kweng reader.
          </p>
        </div>

        {/* Method selector */}
        <div className="grid grid-cols-3 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setImportType('preset'); setSuccessStory(null); }}
            className={`py-1.5 rounded-md transition-all ${
              importType === 'preset' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Preset
          </button>
          <button
            onClick={() => { setImportType('json'); setSuccessStory(null); }}
            className={`py-1.5 rounded-md transition-all ${
              importType === 'json' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            JSON Schema
          </button>
          <button
            onClick={() => { setImportType('api'); setSuccessStory(null); }}
            className={`py-1.5 rounded-md transition-all ${
              importType === 'api' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            API / URL Feed
          </button>
        </div>

        {/* Success Message banner */}
        {successStory && (
          <div className="p-4 rounded-lg bg-indigo-950/40 border border-indigo-800/40 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Imported Successfully!</span>
            </div>
            <p className="text-xs text-white font-bold">{successStory.title}</p>
            <button
              onClick={() => {
                setSelectedBook(successStory);
                setIsImportModalOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open in Kweng Reader</span>
            </button>
          </div>
        )}

        {/* PRESET TAB */}
        {importType === 'preset' && !successStory && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-800 border border-slate-700/60 space-y-2">
              <span className="font-semibold text-indigo-400">Featured Sample Novel:</span>
              <h4 className="text-sm font-bold text-white">{SAMPLE_PRESET_STORY.title}</h4>
              <p className="text-slate-400 line-clamp-2">{SAMPLE_PRESET_STORY.synopsis}</p>
              <div className="flex gap-2 text-[10px] text-slate-300">
                <span className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-750">Action • Magic</span>
                <span className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-750">Includes Chapter 1</span>
              </div>
            </div>

            <button
              onClick={handleImportPreset}
              className="w-full py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import Preset to Library</span>
            </button>
          </div>
        )}

        {/* JSON SCHEMA TAB */}
        {importType === 'json' && !successStory && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              Paste JSON object containing <code className="text-indigo-400 font-mono">title</code>, <code className="text-indigo-400 font-mono">synopsis</code>, and optional <code className="text-indigo-400 font-mono">chapters</code>:
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "title": "My Custom Story Book",\n  "synopsis": "A captivating adventure...",\n  "author": "Author Name",\n  "genres": ["Fantasy", "Action"]\n}`}
              rows={6}
              className="w-full p-3 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {errorMsg && (
              <p className="text-rose-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}
            <button
              onClick={handleImportJson}
              className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all"
            >
              Parse & Import JSON
            </button>
          </div>
        )}

        {/* API FEED TAB */}
        {importType === 'api' && !successStory && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              Enter third-party Webtoon / Light Novel API or JSON feed URL:
            </p>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.thirdparty-stories.org/v1/novel/1042"
                className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {errorMsg && (
              <p className="text-rose-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}
            <button
              onClick={handleImportApi}
              className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all"
            >
              Fetch & Import External Stream
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
