"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, Gift, Zap, Crown, Users, Volume2, VolumeX, Sparkles, Target, Music, Globe, Star, Gamepad2 } from 'lucide-react';

export default function LumoraVideoInterface({ room }: { room: string }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [zencoins, setZencoins] = useState(640);
  const [isLiked, setIsLiked] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showAIEffects, setShowAIEffects] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'Live'|'Explore'|'Following'>('Explore');
  const [notifications, setNotifications] = useState<{id:number;message:string}[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const videos = [
    {
      id: 1,
      creator: {
        name: "Luna Martinez",
        username: "luna_creates",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b567?w=150",
        isVerified: true,
        tier: "diamond",
        isLive: false,
        followers: "2.3M"
      },
      title: "AI-Generated Dance Fusion 🤖✨",
      description: "Watch as AI creates music while I dance! Every move generates new beats 🎵 #AIArt #DanceFusion #Innovation",
      stats: { likes: 326, comments: 72, shares: 45, views: "1.2M", zencoinEarned: 2340 },
      features: { hasAIEffects: true, hasCollabMode: true, hasAR: true, hasVoiceChange: true, hasRealTimeMusic: true, hasTranslation: ["Spanish","French","Japanese"], hasNFTMoments: 3, collabUsers: 5 },
      tags: ["#AIArt", "#Dance", "#Music", "#Innovation"],
      mood: "energetic",
      aiGenerated: { musicStyle: "Electronic Fusion", visualEffects: "Particle Symphony", backgroundAI: "Cosmic Generator" }
    },
    {
      id: 2,
      creator: {
        name: "Tech Wizard",
        username: "tech_wizardry",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        isVerified: true,
        tier: "gold",
        isLive: true,
        followers: "1.8M"
      },
      title: "Live Code Collaboration - Building the Future",
      description: "Join me as we code an AI app LIVE with viewers! Real-time collaboration 💻 #LiveCoding #AI #Collab",
      stats: { likes: 189, comments: 124, shares: 67, views: "890K", zencoinEarned: 1890 },
      features: { hasCodeCollab: true, hasScreenShare: true, hasVoiceChat: true, hasWhiteboard: true, hasTranslation: ["Chinese","Russian","German"], hasNFTMoments: 1, collabUsers: 12 },
      tags: ["#Coding","#AI","#Tech","#Live"],
      mood: "focused",
      aiGenerated: { codeAssist: "GPT-4 Integration", debugHelper: "Real-time Error Detection", collaboration: "Multi-user IDE" }
    }
  ];
  const currentVideo = videos[currentVideoIndex];

  const gifts = [
    { name: "Sparkle", cost: 10, icon: "✨", effect: "sparkle", rarity: "common" },
    { name: "Fire Wave", cost: 25, icon: "🔥", effect: "fire", rarity: "uncommon" },
    { name: "Diamond Rain", cost: 50, icon: "💎", effect: "diamond", rarity: "rare" },
    { name: "Phoenix Wing", cost: 100, icon: "🐦‍🔥", effect: "phoenix", rarity: "epic" },
    { name: "Cosmic Portal", cost: 250, icon: "🌌", effect: "portal", rarity: "legendary" },
    { name: "AI Genesis", cost: 500, icon: "🤖", effect: "ai_genesis", rarity: "mythic" }
  ];

  const aiEffects = [
    { name: "Style Transfer", icon: "🎨", desc: "Transform video style in real-time" },
    { name: "Voice Clone", icon: "🎤", desc: "Speak in any celebrity voice" },
    { name: "Background AI", icon: "🌍", desc: "AI-generated backgrounds" },
    { name: "Music Sync", icon: "🎵", desc: "Auto-generate music to match mood" },
    { name: "Language Dub", icon: "🌐", desc: "Real-time language dubbing" },
    { name: "Emotion Enhance", icon: "😊", desc: "Amplify emotional expressions" }
  ];

  function addNotification(message: string) {
    const n = { id: Date.now(), message };
    setNotifications(prev => [...prev, n]);
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== n.id)), 3000);
  }

  function handleLike() {
    setIsLiked(v => !v);
    if (!isLiked) addNotification("❤️ Liked! Creator earned 1 Zencoin");
  }
  function handleGift(gift: {name:string;cost:number}) {
    if (gift.cost <= zencoins) {
      setZencoins(v => v - gift.cost);
      setShowGiftModal(false);
      addNotification(`🎁 ${gift.name} sent! Creator earned ${gift.cost} Zencoins`);
    } else {
      addNotification("❌ Insufficient Zencoins!");
    }
  }
  function handleFollow() {
    setIsFollowing(v => !v);
    if (!isFollowing) addNotification(`✅ Following ${currentVideo.creator.name}!`);
  }
  function handleAIEffect(effect: {name:string}) {
    addNotification(`🤖 ${effect.name} activated!`);
    setShowAIEffects(false);
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-lg relative z-20">
        <div className="flex space-x-3">
          <button className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${activeTab==='Live'?'bg-red-500 text-white shadow-lg':'bg-white/20 text-white/80 hover:bg-white/30'}`} onClick={()=>setActiveTab('Live')}>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span>Live</span>
          </button>
          <button className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${activeTab==='Explore'?'bg-white/30 text-white shadow-lg':'bg-white/20 text-white/80 hover:bg-white/30'}`} onClick={()=>setActiveTab('Explore')}>
            <Target className="w-4 h-4"/><span>Explore</span>
          </button>
          <button className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${activeTab==='Following'?'bg-white/30 text-white shadow-lg':'bg-white/20 text-white/80 hover:bg-white/30'}`} onClick={()=>setActiveTab('Following')}>
            <Users className="w-4 h-4"/><span>Following</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-400/30">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="text-white font-bold">{zencoins}</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800">
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <path d="M0,200 L0,120 L60,60 L120,100 L200,40 L280,80 L360,20 L400,60 L400,200 Z" fill="rgba(34, 197, 94, 0.8)"/>
              <path d="M0,200 L0,140 L80,80 L160,120 L240,60 L320,100 L400,80 L400,200 Z" fill="rgba(34, 197, 94, 0.6)"/>
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div className="text-8xl animate-pulse">🧘</div></div>
          {currentVideo.features.hasAIEffects && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse">
              <div className="absolute top-20 left-10 text-purple-400"><Sparkles className="w-6 h-6 animate-spin"/></div>
              <div className="absolute top-32 right-16 text-pink-400"><Zap className="w-5 h-5 animate-bounce"/></div>
              <div className="absolute bottom-40 left-20 text-blue-400"><Star className="w-4 h-4 animate-pulse"/></div>
            </div>
          )}
          {currentVideo.features.hasCollabMode && (
            <div className="absolute top-20 left-6 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30">
              <div className="flex items-center space-x-2"><Users className="w-4 h-4 text-green-400"/><span className="text-green-400 text-sm font-medium">{currentVideo.features.collabUsers} collaborating</span></div>
            </div>
          )}
          {currentVideo.features.hasRealTimeMusic && (
            <div className="absolute top-36 left-6 bg-purple-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-400/30">
              <div className="flex items-center space-x-2"><Music className="w-4 h-4 text-purple-400 animate-pulse"/><span className="text-purple-400 text-sm font-medium">AI Music</span></div>
            </div>
          )}
          {currentVideo.features.hasTranslation && (
            <div className="absolute bottom-60 left-6 bg-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-400/30">
              <div className="flex items-center space-x-2"><Globe className="w-4 h-4 text-blue-400"/><span className="text-blue-400 text-sm font-medium">{currentVideo.features.hasTranslation.length} languages</span></div>
            </div>
          )}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-6 z-10">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img src={currentVideo.creator.avatar} alt={currentVideo.creator.name} className="w-16 h-16 rounded-full border-3 border-white shadow-lg"/>
              {currentVideo.creator.isLive && (<div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">LIVE</div>)}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${currentVideo.creator.tier==='diamond'?'bg-cyan-400':currentVideo.creator.tier==='gold'?'bg-yellow-400':'bg-gray-400'}`}><Crown className="w-3 h-3 text-white"/></div>
            </div>
            <button onClick={handleFollow} className={`mt-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${isFollowing?'bg-gray-600 text-white':'bg-blue-500 text-white hover:bg-blue-600'}`}>{isFollowing?'Following':'Follow'}</button>
          </div>

          <div className="flex flex-col space-y-4">
            <button onClick={handleLike} className="flex flex-col items-center space-y-1 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${isLiked?'bg-red-500/30 border-red-400 scale-110':'bg-white/20 border-white/30 hover:bg-red-500/20 hover:border-red-400'}`}>
                <Heart className={`w-6 h-6 ${isLiked?'text-red-400 fill-red-400':'text-white'}`}/>
              </div>
              <span className="text-white text-xs font-medium">{currentVideo.stats.likes}</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400 transition-all">
                <MessageCircle className="w-6 h-6 text-white"/>
              </div>
              <span className="text-white text-xs font-medium">{currentVideo.stats.comments}</span>
            </button>

            <button onClick={()=>setShowGiftModal(true)} className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-yellow-400/50 flex items-center justify-center hover:scale-110 transition-all animate-pulse">
                <Gift className="w-6 h-6 text-yellow-400"/>
              </div>
              <span className="text-yellow-400 text-xs font-bold">Gift</span>
            </button>

            <button onClick={()=>setShowAIEffects(true)} className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-purple-400/50 flex items-center justify-center hover:scale-110 transition-all">
                <Sparkles className="w-6 h-6 text-purple-400"/>
              </div>
              <span className="text-purple-400 text-xs font-bold">AI FX</span>
            </button>

            <button onClick={()=>setShowCollabPanel(true)} className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-sm border border-green-400/50 flex items-center justify-center hover:scale-110 transition-all">
                <Users className="w-6 h-6 text-green-400"/>
              </div>
              <span className="text-green-400 text-xs font-bold">Collab</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-400 transition-all">
                <Share className="w-6 h-6 text-white"/>
              </div>
              <span className="text-white text-xs font-medium">{currentVideo.stats.shares}</span>
            </button>
          </div>

          <button onClick={()=>setIsMuted(v=>!v)} className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all">
            {isMuted ? <VolumeX className="w-6 h-6 text-white"/> : <Volume2 className="w-6 h-6 text-white"/>}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold text-lg">@{currentVideo.creator.username}</span>
              {currentVideo.creator.isVerified && (<div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></div>)}
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{currentVideo.description}</p>
            <div className="flex flex-wrap gap-2">
              {currentVideo.features.hasAIEffects && (<span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-400/30">🤖 AI Enhanced</span>)}
              {currentVideo.features.hasCollabMode && (<span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-400/30">👥 Collaborative</span>)}
              {currentVideo.features.hasNFTMoments > 0 && (<span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs border border-yellow-400/30">💎 {currentVideo.features.hasNFTMoments} NFT Moments</span>)}
              {currentVideo.features.hasRealTimeMusic && (<span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full text-xs border border-pink-400/30">🎵 Live Music Gen</span>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentVideo.tags.map((tag, i)=>(<span key={i} className="text-blue-300 text-sm hover:text-blue-200 cursor-pointer">{tag}</span>))}
            </div>
          </div>
        </div>
      </div>

      {showGiftModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-3xl p-6 w-full max-w-md border-t border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Send Gift</h3>
              <button onClick={()=>setShowGiftModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {gifts.map((gift, idx)=>(
                <button key={idx} onClick={()=>handleGift(gift)} disabled={gift.cost>zencoins}
                  className={`p-3 rounded-xl border transition-all ${gift.cost>zencoins?'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed':'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 hover:border-purple-400 hover:scale-105'}`}>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{gift.icon}</div>
                    <div className="text-white text-xs font-medium">{gift.name}</div>
                    <div className="text-yellow-400 text-xs">{gift.cost} ZC</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAIEffects && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-gradient-to-t from-purple-900 to-purple-800 rounded-t-3xl p-6 w-full max-w-md border-t border-purple-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">AI Effects</h3>
              <button onClick={()=>setShowAIEffects(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {aiEffects.map((effect, idx)=>(
                <button key={idx} onClick={()=>handleAIEffect(effect)} className="w-full p-4 bg-purple-800/30 hover:bg-purple-700/40 rounded-xl border border-purple-600/30 hover:border-purple-500 transition-all text-left">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{effect.icon}</span>
                    <div>
                      <div className="text-white font-medium">{effect.name}</div>
                      <div className="text-purple-300 text-sm">{effect.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-black/30 backdrop-blur-lg border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center"><span className="text-2xl">🧘</span></div>
            <span className="text-blue-300 text-xs font-medium">NEXA</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><span className="text-white text-xl">🏠</span></div>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center"><Gamepad2 className="w-5 h-5 text-purple-400"/></div>
            <span className="text-purple-300 text-xs font-medium">Gmar</span>
          </button>
        </div>
      </div>

      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {notifications.map(n=>(
          <div key={n.id} className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium animate-fade-in">{n.message}</div>
        ))}
      </div>
    </div>
  );
}
