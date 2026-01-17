import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TileData, TilingMethod, PaintData, SavedPA, UserProfile, TilingMethodInfo } from './types';
import { MOCK_TILES, MOCK_PAINTS } from './constants';
import TileCard from './components/TileCard';
import * as aiService from './services/ai/aiOrchestrator';
import { authService } from './services/authService';
import { designService, SavedDesign } from './services/designService';

const BRAND_COLOR = "#701a1a";

// 6 PHƯƠNG ÁN ỐP LÁT
const TILING_METHODS: TilingMethodInfo[] = [
  { id: 'PA1_full_height', name: 'PA1: Ốp Kịch Trần', icon: '🏛️', description: 'Full 4 vách + góc khuất, từ sàn lên trần', requiresPaint: false },
  { id: 'PA2_half_wall_120', name: 'PA2: Ốp Lửng 1.2m', icon: '📏', description: 'Ốp từ sàn lên 1.2m, phần trên sơn nước', requiresPaint: true, heightCm: 120 },
  { id: 'PA3_half_wall_border', name: 'PA3: Ốp 1.2m + Viền', icon: '📐', description: 'Ốp 1.2m + 1 hàng viền (~1.5m), trên sơn', requiresPaint: true, heightCm: 150 },
  { id: 'PA4_with_accent', name: 'PA4: Ốp Điểm Nhấn', icon: '✨', description: 'Ốp lửng + xen kẽ gạch hoa văn điểm nhấn', requiresPaint: true, heightCm: 120 },
  { id: 'PA5_wainscoting', name: 'PA5: Wainscoting 80cm', icon: '🎩', description: 'Kiểu cổ điển 80cm + sơn nước', requiresPaint: true, heightCm: 80 },
  { id: 'PA6_accent_wall', name: 'PA6: Tường Điểm Nhấn', icon: '🎯', description: 'Chỉ ốp 1 bức tường chính, còn lại sơn', requiresPaint: true },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);

  const [tiles, setTiles] = useState<TileData[]>(MOCK_TILES);
  const [paints] = useState<PaintData[]>(MOCK_PAINTS);
  const [savedPAs, setSavedPAs] = useState<SavedPA[]>([]);

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState<'config' | 'chat' | 'saved' | 'admin'>('config');
  const [activeTileCategory, setActiveTileCategory] = useState<string | null>('floor');
  const [searchTerm, setSearchTerm] = useState('');

  const [showGuestLogin, setShowGuestLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatImage, setChatImage] = useState<string | null>(null);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, image?: string }[]>([
    { role: 'ai', text: 'Chào Anh Tuấn! Em là trợ lý Grandcera. Anh có thể gửi ảnh mẫu gạch thực tế để em tư vấn mã tương ứng nhé!' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatImageRef = useRef<HTMLInputElement>(null);

  const [selectedFloor, setSelectedFloor] = useState<TileData | null>(null);
  const [selectedDark, setSelectedDark] = useState<TileData | null>(null);
  const [selectedLight, setSelectedLight] = useState<TileData | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<TileData | null>(null);
  const [selectedPaint, setSelectedPaint] = useState<PaintData | null>(paints[0]);

  const [tilingMethod, setTilingMethod] = useState<TilingMethod>('PA2_standard_3_1');
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [currentVisual, setCurrentVisual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.status === 'pending') {
      const unsubscribe = authService.checkUserStatus(currentUser.email, (newStatus) => {
        if (newStatus === 'approved') {
          setCurrentUser(prev => prev ? { ...prev, status: 'approved' } : null);
        } else if (newStatus === 'rejected') {
          setCurrentUser(null);
          alert("Yêu cầu của bạn đã bị từ chối.");
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === 'admin' && currentUser.status === 'approved') {
      const unsubscribe = authService.subscribePendingUsers((users) => {
        setPendingUsers(users);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.status === 'approved') {
      const unsubscribe = designService.subscribeUserDesigns(currentUser.email, (designs) => {
        setSavedDesigns(designs);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = async (email: string) => {
    if (!email.includes('@')) return alert("Vui lòng nhập đúng email!");
    setLoginLoading(true);
    const name = email.split('@')[0].toUpperCase();
    const photo = `https://ui-avatars.com/api/?name=${name}&background=701a1a&color=fff`;
    const user = await authService.loginWithGoogle(email, name, photo);
    setCurrentUser(user);
    setLoginLoading(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() && !chatImage) return;
    const userMsg = chatInput;
    const currentImg = chatImage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg, image: currentImg || undefined }]);
    setChatInput('');
    setChatImage(null);
    setIsSendingChat(true);
    try {
      const aiResponse = await aiService.getAIChatResponse(userMsg, currentImg || undefined);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Lỗi kết nối rồi anh Tuấn ơi!' }]);
    } finally { setIsSendingChat(false); }
  };

  const handleSaveTileFromChat = (imageUrl: string) => {
    const isFloor = window.confirm("Bấm OK để lưu vào 'GẠCH SÀN'\nBấm Cancel để lưu vào 'GẠCH TƯỜNG'");
    const newTile: TileData = {
      tile_id: `CHAT_${Date.now()}`,
      tile_type: isFloor ? 'floor' : 'wall',
      detailed_type: isFloor ? undefined : 'dark',
      tile_size: 'Custom',
      tile_surface: 'Glossy',
      tile_material: 'Porcelain',
      tile_coverage_per_box: 1.44,
      tile_image_url: imageUrl,
      name: `GẠCH CHAT ${tiles.length + 1}`,
      description: 'Gạch thực tế từ ảnh chat.',
      brand: 'Grandcera'
    };
    setTiles([newTile, ...tiles]);
    if (isFloor) setSelectedFloor(newTile); else setSelectedDark(newTile);
    alert("Đã lưu vào kho gạch mẫu bên phải!");
  };

  const handleSaveDesign = async () => {
    if (!currentVisual || !currentUser) return;
    setIsSaving(true);
    try {
      await designService.saveDesign({
        userEmail: currentUser.email,
        visualUrl: currentVisual,
        originalUrl: roomImage || '',
        timestamp: Date.now(),
        params: {
          floor: selectedFloor?.name || '',
          dark: selectedDark?.name,
          light: selectedLight?.name,
          accent: selectedAccent?.name,
          paint: selectedPaint?.name,
          method: tilingMethod
        }
      });
      alert("Đã lưu phương án thành công!");
    } catch (err) {
      alert("Lỗi khi lưu phương án.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRender = async () => {
    if (!roomImage) return alert("Anh Tuấn tải ảnh hiện trạng trước nhé!");

    // Validation: Kiểm tra màu sơn cho PA cần sơn
    const currentMethod = TILING_METHODS.find(m => m.id === tilingMethod);
    if (currentMethod?.requiresPaint && !selectedPaint) {
      alert("⚠️ Phương án này cần chọn MÀU SƠN cho phần tường còn lại!\n\nVui lòng chọn màu sơn ở Kho vật liệu bên phải.");
      return;
    }

    setIsLoading(true);
    const chatImageRefs = messages.filter(m => m.role === 'user' && m.image).map(m => m.image as string);
    try {
      const url = await aiService.renderVisual(selectedFloor || tiles[0], selectedDark, selectedLight, selectedAccent, selectedPaint, tilingMethod, roomImage, chatImageRefs);
      setCurrentVisual(url);
    } catch (err) { alert("Lỗi render, anh thử lại nhé!"); } finally { setIsLoading(false); }
  };


  // LOGIC TÌM KIẾM THÔNG MINH (Refined)
  const lowerSearch = searchTerm.toLowerCase();
  const isSànSearch = lowerSearch.includes('lát sàn') || lowerSearch.includes('gạch sàn') || lowerSearch.includes('nền');
  const isỐpSearch = lowerSearch.includes('gạch ốp') || lowerSearch.includes('ốp tường') || lowerSearch.includes('tường');
  const isSơnSearch = lowerSearch.includes('màu sơn') || lowerSearch.includes('sơn');

  const filteredTiles = useMemo(() => {
    return tiles.filter(t => {
      // Nếu đang tìm "lát sàn", chỉ hiện gạch floor
      if (isSànSearch) return t.tile_type === 'floor';
      // Nếu đang tìm "ốp tường", chỉ hiện gạch wall
      if (isỐpSearch) return t.tile_type === 'wall';
      // Nếu đang tìm "sơn", không hiện gạch
      if (isSơnSearch) return false;

      // Tìm theo text (mã, tên, mô tả)
      return t.name.toLowerCase().includes(lowerSearch) ||
        t.tile_id.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch);
    });
  }, [tiles, lowerSearch, isSànSearch, isỐpSearch, isSơnSearch]);

  const filteredPaints = useMemo(() => {
    if (isSànSearch || isỐpSearch) return []; // Đang tìm gạch thì không hiện sơn
    return paints.filter(p =>
      p.name.toLowerCase().includes(lowerSearch) ||
      p.brand.toLowerCase().includes(lowerSearch) ||
      isSơnSearch
    );
  }, [paints, lowerSearch, isSơnSearch, isSànSearch, isỐpSearch]);

  const categorizedTiles = useMemo(() => ({
    floor: filteredTiles.filter(t => t.tile_type === 'floor'),
    dark: filteredTiles.filter(t => t.tile_type === 'wall' && t.detailed_type === 'dark'),
    light: filteredTiles.filter(t => t.tile_type === 'wall' && t.detailed_type === 'light'),
    accent: filteredTiles.filter(t => t.tile_type === 'wall' && t.detailed_type === 'accent'),
  }), [filteredTiles]);

  // UI Màn hình Đăng nhập
  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#010410]">
        <div className="glass-card p-12 rounded-[3rem] text-center border border-white/10 max-w-sm w-full animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-[#701a1a] rounded-2xl flex items-center justify-center mx-auto mb-8 active-ring shadow-xl"><i className="fas fa-shield-cat text-white text-3xl"></i></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-2">GRANDCERA</h1>
          <p className="text-[7px] text-slate-500 uppercase tracking-[0.4em] mb-10">PHƯƠNG NAM STUDIO AI</p>
          <div className="space-y-4">
            {!showGuestLogin ? (
              <>
                <button onClick={() => handleLogin('qtpham01vnn@gmail.com')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase flex items-center justify-center gap-3 hover:bg-[#701a1a] transition-all btn-dynamic">
                  <i className="fab fa-google text-[#701a1a]"></i> Đăng nhập Admin
                </button>
                <button onClick={() => setShowGuestLogin(true)} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase hover:bg-slate-800 transition-all btn-dynamic">
                  <i className="fas fa-user"></i> Khách hàng trải nghiệm
                </button>
              </>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-2">
                <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Nhập email của bạn..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#701a1a]" />
                <div className="flex gap-2">
                  <button onClick={() => setShowGuestLogin(false)} className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase">Hủy</button>
                  <button onClick={() => handleLogin(emailInput)} disabled={loginLoading} className="flex-[2] py-3 bg-[#701a1a] rounded-xl text-[9px] font-black uppercase">
                    {loginLoading ? <i className="fas fa-circle-notch animate-spin"></i> : "Gửi yêu cầu"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // UI Màn hình Chờ duyệt
  if (currentUser.status === 'pending') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#010410]">
        <div className="glass-card p-12 rounded-[3rem] text-center border border-white/10 max-w-lg w-full">
          <i className="fas fa-hourglass-half text-4xl text-[#701a1a] mb-8 animate-pulse"></i>
          <h2 className="text-xl font-black uppercase tracking-widest mb-4">ĐANG CHỜ PHÊ DUYỆT</h2>
          <p className="text-slate-400 text-[9px] uppercase tracking-wider mb-8">Anh Tuấn sẽ duyệt yêu cầu của bạn sớm. Hệ thống sẽ tự động mở ngay khi có kết quả.</p>
          <button onClick={() => setCurrentUser(null)} className="text-[9px] font-black text-slate-500 hover:text-white uppercase">Quay lại</button>
        </div>
      </div>
    );
  }

  // UI Chính
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#010410] text-slate-200">
      {isZoomed && currentVisual && (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center" onClick={() => setIsZoomed(false)}>
          <img src={currentVisual} className="w-full h-full object-contain" alt="Full" />
          <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-xl"><i className="fas fa-times"></i></button>
        </div>
      )}

      <header className="px-6 py-3 flex justify-between items-center glass-card border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#701a1a] flex items-center justify-center"><i className="fas fa-shield-cat text-white text-sm"></i></div>
          <div>
            <h1 className="text-sm font-black italic uppercase tracking-tighter leading-none">GRANDCERA</h1>
            <p className="text-[6px] font-bold text-slate-500 uppercase tracking-widest">PHƯƠNG NAM STUDIO</p>
          </div>
        </div>
        <div className="flex gap-4">
          <input type="file" className="hidden" id="room-up" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setRoomImage(ev.target?.result as string); r.readAsDataURL(f); } }} />
          <label htmlFor="room-up" className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase cursor-pointer hover:bg-white/10 transition-all flex items-center gap-2 btn-dynamic shadow-md">TẢI HIỆN TRẠNG</label>
          <button onClick={handleRender} disabled={isLoading || !roomImage} className="px-5 py-2 rounded-lg bg-[#701a1a] text-[9px] font-black uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 btn-dynamic">
            {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>} DIỄN HỌA AI
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase">{currentUser.name}</p>
            <p className="text-[7px] text-[#701a1a] font-bold uppercase">{currentUser.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'KHÁCH HÀNG'}</p>
          </div>
          <img src={currentUser.photoURL} className="w-8 h-8 rounded-full border border-white/20" alt="Avatar" />
          <button onClick={() => setCurrentUser(null)} className="p-2 text-slate-500 hover:text-white transition-all"><i className="fas fa-sign-out-alt"></i></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`${leftPanelOpen ? 'w-[400px]' : 'w-0'} transition-all duration-500 bg-black/40 border-r border-white/5 flex flex-col z-40 overflow-hidden`}>
          <div className="flex border-b border-white/5">
            <button onClick={() => setActiveLeftTab('config')} className={`flex-1 py-3 text-[8px] font-black uppercase ${activeLeftTab === 'config' ? 'bg-[#701a1a]' : 'opacity-40 hover:opacity-70'}`}>Cấu hình</button>
            <button onClick={() => setActiveLeftTab('chat')} className={`flex-1 py-3 text-[8px] font-black uppercase ${activeLeftTab === 'chat' ? 'bg-[#701a1a]' : 'opacity-40 hover:opacity-70'}`}>Tư vấn AI</button>
            <button onClick={() => setActiveLeftTab('saved')} className={`flex-1 py-3 text-[8px] font-black uppercase ${activeLeftTab === 'saved' ? 'bg-[#701a1a]' : 'opacity-40 hover:opacity-70'}`}>Lưu</button>
            {currentUser.role === 'admin' && (
              <button onClick={() => setActiveLeftTab('admin')} className={`flex-1 py-3 text-[8px] font-black uppercase ${activeLeftTab === 'admin' ? 'bg-purple-900' : 'opacity-40 hover:opacity-70'}`}>Duyệt</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            {activeLeftTab === 'config' ? (
              <div className="space-y-6">
                <p className="text-[8px] font-black text-[#701a1a] uppercase tracking-widest">7 Phương án ốp lát</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {TILING_METHODS.map(pa => (
                    <button key={pa.id} onClick={() => setTilingMethod(pa.id)} className={`w-full p-3 rounded-xl border text-left transition-all ${tilingMethod === pa.id ? 'bg-[#701a1a] border-[#a12a2a] ring-2 ring-[#a12a2a]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{pa.icon}</span>
                        <div className="flex-1">
                          <p className="text-[9px] font-black uppercase">{pa.name}</p>
                          <p className="text-[7px] text-slate-400">{pa.description}</p>
                        </div>
                        {pa.requiresPaint && (
                          <span className="text-[6px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded uppercase">Cần sơn</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[8px] font-black text-[#701a1a] uppercase tracking-widest">Thông số phối bộ</p>
                  {[
                    { label: 'Gạch Sàn', val: selectedFloor },
                    { label: 'Gạch Đậm', val: selectedDark },
                    { label: 'Gạch Nhạt', val: selectedLight },
                    { label: 'Sơn tường', val: selectedPaint },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-[7px] font-black uppercase text-slate-500">{item.label}</span>
                      <span className="text-[8px] font-bold text-white truncate max-w-[150px]">{item.val?.name || '---'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeLeftTab === 'chat' ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-[10px] ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                        {m.image && (
                          <div className="relative mb-2 group">
                            <img src={m.image} className="w-full rounded-lg border border-white/10" alt="Chat" />
                            <button onClick={() => handleSaveTileFromChat(m.image!)} className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-md text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 hover:bg-green-600 transition-all"><i className="fas fa-plus mr-1"></i> Lưu mẫu</button>
                          </div>
                        )}
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="relative flex items-center gap-2">
                  <input type="file" ref={chatImageRef} className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setChatImage(ev.target?.result as string); r.readAsDataURL(f); } }} />
                  <button onClick={() => chatImageRef.current?.click()} className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 hover:bg-white/10 flex items-center justify-center transition-all"><i className="fas fa-paperclip"></i></button>
                  <div className="flex-1 relative">
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Gửi ảnh gạch thực tế..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] outline-none focus:border-[#701a1a]" />
                    <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#701a1a]"><i className="fas fa-paper-plane"></i></button>
                  </div>
                </div>
              </div>
            ) : activeLeftTab === 'admin' ? (
              <div className="space-y-4">
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-4">Danh sách chờ duyệt ({pendingUsers.length})</p>
                {pendingUsers.map(user => (
                  <div key={user.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="X" />
                      <div className="truncate">
                        <p className="text-[9px] font-black uppercase truncate">{user.name}</p>
                        <p className="text-[7px] text-slate-500 lowercase">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { authService.approveUser(user.email); }} className="flex-1 py-2 bg-green-600/20 text-green-500 text-[8px] font-black uppercase rounded-lg hover:bg-green-600 hover:text-white transition-all">Duyệt</button>
                      <button onClick={() => { authService.rejectUser(user.email); }} className="flex-1 py-2 bg-red-600/20 text-red-500 text-[8px] font-black uppercase rounded-lg hover:bg-red-600 hover:text-white transition-all">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {savedPAs.map(pa => (
                  <div key={pa.id} onClick={() => { setCurrentVisual(pa.imageUrl); setIsZoomed(true); }} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer group">
                    <img src={pa.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt="PA" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><i className="fas fa-expand text-white"></i></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-4 py-3 text-right text-[9px] text-slate-400 uppercase tracking-widest border-t border-white/5">v1.0.2</div>
        </aside>

        <section className="flex-1 flex flex-col p-4 relative bg-[#020617]">
          <div className="flex-1 rounded-[2.5rem] overflow-hidden relative group bg-black border border-white/5 shadow-2xl">
            {currentVisual ? (
              <div className="w-full h-full relative">
                <img src={currentVisual} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Output" />
                <div className="absolute top-8 right-8 flex flex-col gap-4">
                  <button onClick={() => setIsZoomed(true)} className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl text-white flex items-center justify-center shadow-xl hover:bg-white/20 transition-all border border-white/10"><i className="fas fa-expand"></i></button>
                  <button onClick={handleSaveDesign} disabled={isSaving} className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all disabled:opacity-50">
                    {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
                  </button>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-[8px] font-black uppercase tracking-[0.3em]">GRANDCERA STUDIO • AI RENDERING</div>
              </div>
            ) : roomImage ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <img src={roomImage} className="w-full h-full object-cover opacity-20 blur-xl" alt="B" />
                <button onClick={handleRender} className="px-12 py-5 bg-[#701a1a] rounded-2xl font-black uppercase text-sm shadow-2xl hover:scale-105 transition-all btn-dynamic">BẮT ĐẦU DIỄN HỌA</button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <i className="fas fa-shield-cat text-[150px] mb-8"></i>
                <p className="text-4xl font-black uppercase tracking-[1em]">GRANDCERA</p>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center animate-in fade-in">
                <div className="relative w-24 h-24 mb-10">
                  <div className="absolute inset-0 border-t-4 border-[#701a1a] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center"><i className="fas fa-shield-cat text-3xl text-[#701a1a] animate-pulse"></i></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#701a1a] animate-pulse">ĐANG PHỦ KÍN VÁCH TƯỜNG CẦU THANG...</p>
                <div className="w-64 h-1 bg-white/5 mt-8 rounded-full overflow-hidden"><div className="h-full bg-[#701a1a] animate-progress"></div></div>
              </div>
            )}
          </div>
        </section>

        <aside className={`${rightPanelOpen ? 'w-[450px]' : 'w-0'} transition-all duration-500 bg-black/30 border-l border-white/5 flex flex-col z-40 overflow-hidden`}>
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-[9px] font-black text-[#701a1a] uppercase tracking-widest">KHO VẬT LIỆU MẪU</h2>
              {(isSànSearch || isỐpSearch || isSơnSearch) && (
                <span className="text-[7px] font-black px-2 py-0.5 bg-[#701a1a] rounded uppercase animate-pulse">ĐANG LỌC</span>
              )}
            </div>
            <div className="relative group">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] group-focus-within:text-[#701a1a] transition-all"></i>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm 'Ốp', 'Lát sàn', 'Màu sơn'..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-[10px] outline-none focus:border-[#701a1a] transition-all" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* DANH MỤC GẠCH */}
            {[
              { id: 'floor', label: 'GẠCH LÁT SÀN (Nền)', items: categorizedTiles.floor },
              { id: 'dark', label: 'GẠCH ỐP TƯỜNG - MÀU ĐẬM', items: categorizedTiles.dark },
              { id: 'light', label: 'GẠCH ỐP TƯỜNG - MÀU NHẠT', items: categorizedTiles.light },
              { id: 'accent', label: 'VIÊN ĐIỂM & TRANG TRÍ', items: categorizedTiles.accent },
            ].map(cat => (
              cat.items.length > 0 && (
                <div key={cat.id} className="border-b border-white/5">
                  <button onClick={() => setActiveTileCategory(activeTileCategory === cat.id ? null : cat.id)} className={`w-full px-4 py-4 flex justify-between items-center hover:bg-white/5 transition-all ${activeTileCategory === cat.id ? 'bg-[#701a1a]/10 text-[#701a1a]' : 'opacity-70'}`}>
                    <span className="text-[8px] font-black uppercase">{cat.label} ({cat.items.length})</span>
                    <i className={`fas fa-chevron-down text-[7px] transition-transform ${activeTileCategory === cat.id ? 'rotate-180' : ''}`}></i>
                  </button>
                  {activeTileCategory === cat.id && (
                    <div className="p-3 grid grid-cols-2 gap-3 animate-in slide-in-from-top-1 duration-300">
                      {cat.items.map(t => (
                        <TileCard key={t.tile_id} tile={t} selected={selectedFloor?.tile_id === t.tile_id || selectedDark?.tile_id === t.tile_id || selectedLight?.tile_id === t.tile_id || selectedAccent?.tile_id === t.tile_id} onSelect={tile => {
                          if (tile.tile_type === 'floor') setSelectedFloor(tile);
                          else if (tile.detailed_type === 'dark') setSelectedDark(tile);
                          else if (tile.detailed_type === 'light') setSelectedLight(tile);
                          else if (tile.detailed_type === 'accent') setSelectedAccent(tile);
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}

            {/* DANH MỤC SƠN TƯỜNG */}
            {filteredPaints.length > 0 && (
              <div className="border-b border-white/5">
                <button onClick={() => setActiveTileCategory(activeTileCategory === 'paints' ? null : 'paints')} className={`w-full px-4 py-4 flex justify-between items-center hover:bg-white/5 transition-all ${activeTileCategory === 'paints' ? 'bg-[#701a1a]/10 text-[#701a1a]' : 'opacity-70'}`}>
                  <span className="text-[8px] font-black uppercase">MÀU SƠN NỔI TIẾNG ({filteredPaints.length})</span>
                  <i className={`fas fa-chevron-down text-[7px] transition-transform ${activeTileCategory === 'paints' ? 'rotate-180' : ''}`}></i>
                </button>
                {activeTileCategory === 'paints' && (
                  <div className="p-3 grid grid-cols-2 gap-3 animate-in slide-in-from-top-1 duration-300">
                    {filteredPaints.map(p => (
                      <div key={p.id} onClick={() => setSelectedPaint(p)} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedPaint?.id === p.id ? 'border-[#701a1a] bg-[#701a1a]/5 ring-2 ring-[#701a1a]/20' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                        <div className="h-16 w-full rounded-lg mb-2 shadow-inner" style={{ backgroundColor: p.hex }}></div>
                        <h4 className="text-[8px] font-black uppercase text-white truncate">{p.name}</h4>
                        <p className="text-[7px] font-bold text-slate-500 uppercase">{p.brand} | {p.code}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BỘ SƯU TẬP THIẾT KẾ ĐÃ LƯU */}
            {savedDesigns.length > 0 && (
              <div className="p-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[9px] font-black text-[#701a1a] uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-images"></i> BỘ SƯU TẬP ĐÃ LƯU
                  </h3>
                  <span className="text-[7px] text-white/40 font-black">{savedDesigns.length} BẢN</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {savedDesigns.map(design => (
                    <div key={design.id} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#701a1a]/50 transition-all cursor-pointer shadow-lg" onClick={() => setCurrentVisual(design.visualUrl)}>
                      <img src={design.visualUrl} alt="History" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <p className="text-[6px] text-white/60 font-medium truncate uppercase tracking-tighter">{design.params.method}</p>
                        <p className="text-[5px] text-white/30 uppercase mt-0.5">{new Date(design.timestamp).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); design.id && designService.deleteDesign(design.id); }}
                        className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-md rounded-lg text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <i className="fas fa-trash-alt text-[7px]"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="absolute left-0 top-1/2 -translate-y-1/2 z-[50] w-6 h-20 bg-[#701a1a]/20 hover:bg-[#701a1a] border border-white/10 rounded-r-xl flex items-center justify-center transition-all"><i className={`fas fa-chevron-${leftPanelOpen ? 'left' : 'right'} text-[10px]`}></i></button>
        <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="absolute right-0 top-1/2 -translate-y-1/2 z-[50] w-6 h-20 bg-[#701a1a]/20 hover:bg-[#701a1a] border border-white/10 rounded-l-xl flex items-center justify-center transition-all"><i className={`fas fa-chevron-${rightPanelOpen ? 'right' : 'left'} text-[10px]`}></i></button>
      </div>
    </div>
  );
};

export default App;
