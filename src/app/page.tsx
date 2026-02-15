'use client'

import { useState, useEffect, useCallback } from 'react'
import { ModelViewer } from '@/components/model-viewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Download, 
  Heart, 
  Copy, 
  ExternalLink, 
  Loader2, 
  Moon, 
  Sun, 
  Image as ImageIcon, 
  Box, 
  Grid3X3,
  AlertCircle,
  Trash2,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react'

// Types
interface Asset {
  id: string
  type: 'image' | 'video' | 'model' | 'texture' | 'hdri'
  title: string
  thumbnail: string
  previewUrl?: string
  downloadUrl: string
  author: string
  authorUrl?: string
  source: 'unsplash' | 'pexels' | 'pixabay' | 'polyhaven'
  license: string
  width?: number
  height?: number
  tags?: string[]
  modelUrl?: string
}

interface SearchResults {
  assets: Asset[]
  total: number
  hasMore: boolean
}

interface APIKeys {
  unsplash: string
  pexels: string
  pixabay: string
}

type AssetType = 'all' | 'image' | 'video' | 'model' | 'texture' | 'hdri'
type Orientation = 'all' | 'landscape' | 'portrait' | 'square'

// API Configuration
const API_KEYS_STORAGE = 'asset-fetcher-api-keys'
const FAVORITES_STORAGE = 'asset-fetcher-favorites'

// Default placeholder API keys (users should replace with their own)
const DEFAULT_API_KEYS: APIKeys = {
  unsplash: '',
  pexels: '',
  pixabay: ''
}

// API Service Functions
const unsplashAPI = {
  async search(query: string, page: number, apiKey: string, orientation?: Orientation): Promise<SearchResults> {
    if (!apiKey) {
      throw new Error('Unsplash API key required. Please add your API key in settings.')
    }
    
    const orientationParam = orientation && orientation !== 'all' ? `&orientation=${orientation}` : ''
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20${orientationParam}`,
      {
        headers: {
          'Authorization': `Client-ID ${apiKey}`
        }
      }
    )
    
    if (!response.ok) {
      if (response.status === 403) throw new Error('Unsplash API rate limit exceeded')
      throw new Error('Failed to fetch from Unsplash')
    }
    
    const data = await response.json()
    
    return {
      assets: data.results.map((item: any) => ({
        id: `unsplash-${item.id}`,
        type: 'image' as const,
        title: item.alt_description || item.description || 'Untitled',
        thumbnail: item.urls.small,
        previewUrl: item.urls.regular,
        downloadUrl: item.urls.full,
        author: item.user.name,
        authorUrl: item.user.links.html,
        source: 'unsplash' as const,
        license: 'Unsplash License',
        width: item.width,
        height: item.height,
        tags: item.tags?.map((t: any) => t.title)
      })),
      total: data.total,
      hasMore: page < data.total_pages
    }
  }
}

const pexelsAPI = {
  async search(query: string, page: number, apiKey: string, orientation?: Orientation): Promise<SearchResults> {
    if (!apiKey) {
      throw new Error('Pexels API key required. Please add your API key in settings.')
    }
    
    const orientationParam = orientation && orientation !== 'all' ? `&orientation=${orientation}` : ''
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=20${orientationParam}`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    )
    
    if (!response.ok) {
      if (response.status === 403) throw new Error('Pexels API rate limit exceeded')
      throw new Error('Failed to fetch from Pexels')
    }
    
    const data = await response.json()
    
    return {
      assets: data.photos.map((item: any) => ({
        id: `pexels-${item.id}`,
        type: 'image' as const,
        title: item.alt || 'Untitled',
        thumbnail: item.src.medium,
        previewUrl: item.src.large,
        downloadUrl: item.src.original,
        author: item.photographer,
        authorUrl: item.photographer_url,
        source: 'pexels' as const,
        license: 'Pexels License',
        width: item.width,
        height: item.height
      })),
      total: data.total_results,
      hasMore: !!data.next_page
    }
  }
}

const pixabayAPI = {
  async search(query: string, page: number, apiKey: string, orientation?: Orientation, assetType?: AssetType): Promise<SearchResults> {
    if (!apiKey) {
      throw new Error('Pixabay API key required. Please add your API key in settings.')
    }
    
    let typeParam = 'all'
    if (assetType === 'video') typeParam = 'video'
    else if (assetType === 'image') typeParam = 'photo'
    else if (assetType === 'model' || assetType === 'texture') typeParam = 'illustration'
    
    const orientationParam = orientation && orientation !== 'all' ? `&orientation=${orientation}` : ''
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}&per_page=20&image_type=${typeParam}${orientationParam}`
    )
    
    if (!response.ok) {
      if (response.status === 403) throw new Error('Pixabay API rate limit exceeded')
      throw new Error('Failed to fetch from Pixabay')
    }
    
    const data = await response.json()
    
    return {
      assets: (data.hits || []).map((item: any) => ({
        id: `pixabay-${item.id}`,
        type: item.videos ? 'video' as const : 'image' as const,
        title: item.tags || 'Untitled',
        thumbnail: item.previewURL || item.webformatURL,
        previewUrl: item.largeImageURL || item.webformatURL,
        downloadUrl: item.fullHDURL || item.imageURL || item.webformatURL,
        author: item.user,
        authorUrl: `https://pixabay.com/users/${item.user}-${item.user_id}/`,
        source: 'pixabay' as const,
        license: 'Pixabay License',
        width: item.imageWidth,
        height: item.imageHeight,
        tags: item.tags?.split(', ')
      })),
      total: data.totalHits,
      hasMore: page * 20 < data.totalHits
    }
  }
}

const polyhavenAPI = {
  async search(query: string, page: number, assetType?: AssetType): Promise<SearchResults> {
    // Determine which asset types to fetch
    // Poly Haven API uses: 'hdris', 'textures', 'models'
    let types: string[] = []
    if (!assetType || assetType === 'all') {
      types = ['hdris', 'textures', 'models']
    } else if (assetType === 'hdri') {
      types = ['hdris']
    } else if (assetType === 'texture') {
      types = ['textures']
    } else if (assetType === 'model') {
      types = ['models']
    } else {
      types = ['hdris', 'textures', 'models']
    }
    
    const allAssets: Asset[] = []
    let hasMore = false
    
    for (const type of types) {
      try {
        // Poly Haven API endpoint
        const response = await fetch(`https://api.polyhaven.com/assets?t=${type}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AssetFetcher/1.0'
          },
        })
        
        if (!response.ok) {
          console.warn(`Poly Haven API returned ${response.status} for type ${type}`)
          continue
        }
        
        const data = await response.json()
        
        if (!data || typeof data !== 'object') {
          continue
        }
        
        const assetsList = Object.entries(data)
        
        // Filter by search query
        const filtered = query 
          ? assetsList.filter(([id, info]: [string, any]) => 
              id.toLowerCase().includes(query.toLowerCase()) ||
              (info?.name && info.name.toLowerCase().includes(query.toLowerCase()))
            )
          : assetsList
        
        // Paginate
        const startIndex = (page - 1) * 20
        const pageAssets = filtered.slice(startIndex, startIndex + 20)
        
        for (const [id, info] of pageAssets) {
          const assetInfo = info as any
          // Handle authors - can be array, object, or string
          let authorName = 'Poly Haven'
          if (Array.isArray(assetInfo?.authors)) {
            authorName = assetInfo.authors.join(', ')
          } else if (typeof assetInfo?.authors === 'string') {
            authorName = assetInfo.authors
          } else if (assetInfo?.authors && typeof assetInfo.authors === 'object') {
            authorName = Object.values(assetInfo.authors).join(', ')
          }
          
          // Handle tags - ensure it's an array
          let tags: string[] = []
          if (Array.isArray(assetInfo?.tags)) {
            tags = assetInfo.tags
          } else if (typeof assetInfo?.tags === 'string') {
            tags = [assetInfo.tags]
          }
          
          allAssets.push({
            id: `polyhaven-${id}`,
            type: type === 'hdris' ? 'hdri' as const : type === 'models' ? 'model' as const : 'texture' as const,
            title: assetInfo?.name || id.replace(/_/g, ' '),
            thumbnail: `https://cdn.polyhaven.com/asset_img/thumbs/${id}.png?width=400`,
            previewUrl: `https://cdn.polyhaven.com/asset_img/renders/${id}.png?width=1200`,
            downloadUrl: `https://polyhaven.com/a/${id}`,
            author: authorName,
            authorUrl: 'https://polyhaven.com',
            source: 'polyhaven' as const,
            license: 'CC0',
            tags
          })
        }
        
        if (filtered.length > startIndex + 20) {
          hasMore = true
        }
      } catch (error) {
        console.error(`Error fetching ${type} from Poly Haven:`, error)
      }
    }
    
    return {
      assets: allAssets,
      total: allAssets.length,
      hasMore
    }
  },
  
  async getAssetInfo(id: string): Promise<any> {
    const response = await fetch(`https://api.polyhaven.com/info/${id}`)
    if (response.ok) {
      return await response.json()
    }
    return null
  }
}

// Helper function to generate attribution text
const generateAttribution = (asset: Asset): string => {
  switch (asset.source) {
    case 'unsplash':
      return `Photo by ${asset.author} on Unsplash: ${asset.authorUrl}?utm_source=asset_fetcher&utm_medium=referral`
    case 'pexels':
      return `Photo by ${asset.author} on Pexels: ${asset.authorUrl}`
    case 'pixabay':
      return `Image by ${asset.author} on Pixabay: ${asset.authorUrl}`
    case 'polyhaven':
      return `${asset.title} by ${asset.author} on Poly Haven (CC0): https://polyhaven.com`
    default:
      return `${asset.title} by ${asset.author}`
  }
}

// Main Component
export default function AssetFetcher() {
  const { toast } = useToast()
  
  // State
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [source, setSource] = useState<'unsplash' | 'pexels' | 'pixabay' | 'polyhaven'>('polyhaven')
  const [assetType, setAssetType] = useState<AssetType>('all')
  const [orientation, setOrientation] = useState<Orientation>('all')
  const [results, setResults] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [favorites, setFavorites] = useState<Asset[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKeys, setApiKeys] = useState<APIKeys>(DEFAULT_API_KEYS)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Load saved data
  useEffect(() => {
    // Load API keys
    const savedKeys = localStorage.getItem(API_KEYS_STORAGE)
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE)
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('asset-fetcher-dark-mode')
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true')
    }
    
    // Load model-viewer script dynamically (only if not already loaded)
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])
  
  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('asset-fetcher-dark-mode', String(isDarkMode))
  }, [isDarkMode])
  
  // Save API keys
  const saveApiKeys = (keys: APIKeys) => {
    setApiKeys(keys)
    localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(keys))
    toast({
      title: 'Settings saved',
      description: 'Your API keys have been saved locally.'
    })
  }
  
  // Search function
  const performSearch = useCallback(async (newPage: number = 1) => {
    if (!searchQuery.trim() && source !== 'polyhaven') {
      toast({
        title: 'Enter a search query',
        description: 'Please enter something to search for.',
        variant: 'destructive'
      })
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      let searchResults: SearchResults
      
      switch (source) {
        case 'unsplash':
          searchResults = await unsplashAPI.search(searchQuery, newPage, apiKeys.unsplash, orientation)
          break
        case 'pexels':
          searchResults = await pexelsAPI.search(searchQuery, newPage, apiKeys.pexels, orientation)
          break
        case 'pixabay':
          searchResults = await pixabayAPI.search(searchQuery, newPage, apiKeys.pixabay, orientation, assetType)
          break
        case 'polyhaven':
          searchResults = await polyhavenAPI.search(searchQuery, newPage, assetType)
          break
        default:
          throw new Error('Unknown source')
      }
      
      if (newPage === 1) {
        setResults(searchResults.assets)
      } else {
        setResults(prev => [...prev, ...searchResults.assets])
      }
      setTotal(searchResults.total)
      setHasMore(searchResults.hasMore)
      setPage(newPage)
      setShowFavorites(false)
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching')
      toast({
        title: 'Search failed',
        description: err.message || 'An error occurred while searching',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, source, apiKeys, orientation, assetType, toast])
  
  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setResults([])
    performSearch(1)
  }
  
  // Load more results
  const loadMore = () => {
    if (!isLoading && hasMore) {
      performSearch(page + 1)
    }
  }
  
  // Favorites management
  const toggleFavorite = (asset: Asset) => {
    const isFavorite = favorites.some(f => f.id === asset.id)
    if (isFavorite) {
      const newFavorites = favorites.filter(f => f.id !== asset.id)
      setFavorites(newFavorites)
      localStorage.setItem(FAVORITES_STORAGE, JSON.stringify(newFavorites))
      toast({
        title: 'Removed from favorites',
        description: `"${asset.title}" has been removed from your favorites.`
      })
    } else {
      const newFavorites = [...favorites, asset]
      setFavorites(newFavorites)
      localStorage.setItem(FAVORITES_STORAGE, JSON.stringify(newFavorites))
      toast({
        title: 'Added to favorites',
        description: `"${asset.title}" has been added to your favorites.`
      })
    }
  }
  
  const isFavorite = (assetId: string) => favorites.some(f => f.id === assetId)
  
  // Copy attribution
  const copyAttribution = async (asset: Asset) => {
    const attribution = generateAttribution(asset)
    await navigator.clipboard.writeText(attribution)
    setCopiedId(asset.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast({
      title: 'Attribution copied',
      description: 'The attribution text has been copied to your clipboard.'
    })
  }
  
  // Download asset
  const downloadAsset = (asset: Asset) => {
    window.open(asset.downloadUrl, '_blank')
  }
  
  // Clear favorites
  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem(FAVORITES_STORAGE)
    toast({
      title: 'Favorites cleared',
      description: 'All favorites have been removed.'
    })
  }
  
  // Render asset card
  const renderAssetCard = (asset: Asset) => (
    <Card 
      key={asset.id} 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-card border-border"
    >
      <div 
        className="aspect-square relative overflow-hidden"
        onClick={() => setSelectedAsset(asset)}
      >
        {asset.type === 'model' ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Box className="w-16 h-16 text-purple-400" />
          </div>
        ) : asset.type === 'hdri' ? (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center">
            <Grid3X3 className="w-16 h-16 text-orange-400" />
          </div>
        ) : (
          <img 
            src={asset.thumbnail} 
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                const fallback = document.createElement('div')
                fallback.className = 'w-full h-full bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center'
                fallback.innerHTML = '<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
                parent.appendChild(fallback)
              }
            }}
          />
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(asset)
                  }}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(asset.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite(asset.id) ? 'Remove from favorites' : 'Add to favorites'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyAttribution(asset)
                  }}
                >
                  {copiedId === asset.id ? <CheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy attribution</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadAsset(asset)
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {asset.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate text-card-foreground">{asset.title}</h3>
        <p className="text-xs text-muted-foreground truncate">by {asset.author}</p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {asset.source}
        </Badge>
        <span className="text-xs text-muted-foreground">{asset.license}</span>
      </CardFooter>
    </Card>
  )
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold hidden sm:block">Asset Fetcher</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isDarkMode ? 'Light mode' : 'Dark mode'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={showFavorites ? 'bg-accent' : ''}
                      >
                        <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                        {favorites.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {favorites.length}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Favorites ({favorites.length})</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(true)}
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>API Settings</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {/* Search Section */}
          {!showFavorites && (
            <div className="space-y-4 mb-8">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                
                <Select 
                  value={source} 
                  onValueChange={(v) => setSource(v as any)}
                >
                  <SelectTrigger className="w-full sm:w-[180px] h-12">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="polyhaven">Poly Haven</SelectItem>
                    <SelectItem value="unsplash">Unsplash</SelectItem>
                    <SelectItem value="pexels">Pexels</SelectItem>
                    <SelectItem value="pixabay">Pixabay</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button type="submit" size="lg" className="h-12 px-8" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                  Search
                </Button>
              </form>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Type:</Label>
                  <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="model">3D Models</SelectItem>
                      <SelectItem value="texture">Textures</SelectItem>
                      <SelectItem value="hdri">HDRIs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(source === 'unsplash' || source === 'pexels' || source === 'pixabay') && (
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Orientation:</Label>
                    <Select value={orientation} onValueChange={(v) => setOrientation(v as Orientation)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {/* API Key Warning */}
              {source !== 'polyhaven' && !apiKeys[source] && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>API Key Required:</strong> Please add your {source.charAt(0).toUpperCase() + source.slice(1)} API key in settings to search this source.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Favorites View */}
          {showFavorites ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  <h2 className="text-2xl font-bold">Favorites</h2>
                  <Badge variant="secondary">{favorites.length}</Badge>
                </div>
                {favorites.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={clearFavorites}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
              
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium text-muted-foreground">No favorites yet</h3>
                  <p className="text-muted-foreground mt-2">Click the heart icon on any asset to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {favorites.map(renderAssetCard)}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Results */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              {results.length > 0 && (
                <div className="mb-4">
                  <p className="text-muted-foreground">
                    Found <strong>{total}</strong> results
                  </p>
                </div>
              )}
              
              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {results.map(renderAssetCard)}
                  </div>
                  
                  {/* Load More */}
                  {hasMore && (
                    <div className="flex justify-center mt-8">
                      <Button 
                        onClick={loadMore} 
                        disabled={isLoading}
                        size="lg"
                        variant="outline"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : !isLoading && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium text-muted-foreground">Search for assets</h3>
                  <p className="text-muted-foreground mt-2">Enter a search term and select a source to find assets.</p>
                  
                  {source === 'polyhaven' && (
                    <Button 
                      onClick={() => performSearch(1)} 
                      className="mt-4"
                      disabled={isLoading}
                    >
                      Browse All Poly Haven Assets
                    </Button>
                  )}
                </div>
              )}
              
              {/* Loading State */}
              {isLoading && results.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </>
          )}
        </main>
        
        {/* Preview Modal */}
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="truncate pr-8">{selectedAsset?.title}</DialogTitle>
            </DialogHeader>
            
            {selectedAsset && (
              <div className="space-y-4">
                {/* Preview */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  {selectedAsset.type === 'model' ? (
                    <div className="w-full h-full">
                      <ModelViewer
                        src={selectedAsset.modelUrl || selectedAsset.previewUrl}
                        alt={selectedAsset.title}
                        autoRotate={true}
                        cameraControls={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : selectedAsset.type === 'hdri' || selectedAsset.type === 'texture' ? (
                    <img 
                      src={selectedAsset.previewUrl || selectedAsset.thumbnail}
                      alt={selectedAsset.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img 
                      src={selectedAsset.previewUrl || selectedAsset.thumbnail}
                      alt={selectedAsset.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                
                {/* Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedAsset.type}</Badge>
                    <Badge variant="outline">{selectedAsset.source}</Badge>
                    <Badge variant="outline">{selectedAsset.license}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by</span>
                    {selectedAsset.authorUrl ? (
                      <a 
                        href={selectedAsset.authorUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedAsset.author}
                      </a>
                    ) : (
                      <span>{selectedAsset.author}</span>
                    )}
                  </div>
                  
                  {selectedAsset.width && selectedAsset.height && (
                    <p className="text-sm text-muted-foreground">
                      Resolution: {selectedAsset.width} × {selectedAsset.height}
                    </p>
                  )}
                  
                  {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedAsset.tags.slice(0, 10).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Attribution */}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm truncate flex-1">
                        {generateAttribution(selectedAsset)}
                      </p>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyAttribution(selectedAsset)}
                      >
                        {copiedId === selectedAsset.id ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => toggleFavorite(selectedAsset)}
                      variant={isFavorite(selectedAsset.id) ? 'default' : 'outline'}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite(selectedAsset.id) ? 'fill-current' : ''}`} />
                      {isFavorite(selectedAsset.id) ? 'Saved' : 'Save'}
                    </Button>
                    
                    <Button onClick={() => copyAttribution(selectedAsset)} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Attribution
                    </Button>
                    
                    <Button onClick={() => downloadAsset(selectedAsset)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    {selectedAsset.authorUrl && (
                      <Button variant="ghost" asChild>
                        <a 
                          href={selectedAsset.authorUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Source
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Settings Modal */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>API Settings</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="unsplash-key">Unsplash API Key</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Get your free API key from unsplash.com/developers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="unsplash-key"
                  type="password"
                  placeholder="Enter your Unsplash API key"
                  value={apiKeys.unsplash}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, unsplash: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="pexels-key">Pexels API Key</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Get your free API key from pexels.com/api</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="pexels-key"
                  type="password"
                  placeholder="Enter your Pexels API key"
                  value={apiKeys.pexels}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, pexels: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="pixabay-key">Pixabay API Key</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Get your free API key from pixabay.com/api/docs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="pixabay-key"
                  type="password"
                  placeholder="Enter your Pixabay API key"
                  value={apiKeys.pixabay}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, pixabay: e.target.value }))}
                />
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Poly Haven</strong> does not require an API key. It&apos;s completely free to use!
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => saveApiKeys(apiKeys)} className="flex-1">
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Model Viewer Script */}
      <script 
        type="module" 
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        async
      />
    </div>
  )
}

// Check icon component
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
