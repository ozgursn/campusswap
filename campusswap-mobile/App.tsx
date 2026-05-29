import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Image, Dimensions, Platform, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl?: string;
  isUrgent?: boolean;
  isPremium?: boolean;
  category?: string;
  campus?: string;
  userId?: number;
  user?: {
    name: string;
    email: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function App() {
  // --- EKRAN VE SEKME STATELERİ ---
  const [currentScreen, setCurrentScreen] = useState<string>('Auth'); 
  const [isRegister, setIsRegister] = useState<boolean>(false); 
  const [activeTab, setActiveTab] = useState<string>('Feed'); 
  const [isPostModalVisible, setPostModalVisible] = useState<boolean>(false); 
  
  // MODAL VE DETAY STATELERİ
  const [isDetailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [upgradeType, setUpgradeType] = useState<'urgent' | 'premium' | null>(null);

  // --- FORM GİRDİ STATELERİ ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sembolik Kart Stateleri
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Yeni İlan Stateleri
  const [postTitle, setPostTitle] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- ARAMA VE VERİ STATELERİ ---
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]); 
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [userProductsLoading, setUserProductsLoading] = useState<boolean>(false);

  // --- 🔄 PULL TO REFRESH STATE'İ ---
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // --- OTURUM STATELERİ ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  // 🔔 Canlı Bildirim Hafıza State'i (Kurallara Uygun Şekilde En Üst Gövdede)
  const [lastUrgentId, setLastUrgentId] = useState<number | null>(null);

  // NGROK SABİT URL TANIMLAMASI
  const BASE_URL = 'https://litter-stew-sensitize.ngrok-free.dev';

  // GENEL İLANLARI GETİR
  const fetchProducts = (search: string = '') => {
    if (!refreshing) setProductsLoading(true);
    const url = `${BASE_URL}/products${search ? `?search=${encodeURIComponent(search)}` : ''}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const formattedProducts = data.map((product: Product) => {
          if (product.imageUrl) {
            if (!product.imageUrl.startsWith('http')) {
              return { ...product, imageUrl: `${BASE_URL}${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}` };
            }
            if (product.imageUrl.includes('localhost') || product.imageUrl.includes('10.72.')) {
              const s_part = product.imageUrl.split(':3000');
              const path = s_part[1] || s_part[0].split('/uploads')[1];
              return { ...product, imageUrl: `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}` };
            }
          }
          return product;
        });
        setProducts(formattedProducts);
        setProductsLoading(false);
        setRefreshing(false); 
      })
      .catch((err) => {
        setProductsLoading(false);
        setRefreshing(false); 
        console.error(err);
      });
  };

  // KULLANICININ KENDİ İLANLARINI ÇEK
  const fetchUserProducts = () => {
    if (!currentUser) return;
    setUserProductsLoading(true);
    
    fetch(`${BASE_URL}/products/user/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((product: Product) => {
          if (product.imageUrl) {
            if (!product.imageUrl.startsWith('http')) {
              return { ...product, imageUrl: `${BASE_URL}${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}` };
            }
            if (product.imageUrl.includes('localhost') || product.imageUrl.includes('10.72.')) {
              const s_part = product.imageUrl.split(':3000');
              const path = s_part[1] || s_part[0].split('/uploads')[1];
              return { ...product, imageUrl: `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}` };
            }
          }
          return product;
        });
        setUserProducts(formatted);
        setUserProductsLoading(false);
      })
      .catch((err) => {
        setUserProductsLoading(false);
        console.error("Kullanıcı ilanları çekilemedi:", err);
      });
  };

  // Sekme Takip Eden Birinci Effect
  useEffect(() => {
    if (activeTab === 'Profile' && currentScreen === 'Main') {
      fetchUserProducts();
    }
  }, [activeTab]);

// 🚨 SİLME KORUMALI VE GÜVENLİ CANLI BİLDİRİM MOTORU
useEffect(() => {
  if (currentScreen !== 'Main') return;

  // İlk açılış kontrolü
  fetch(`${BASE_URL}/products?t=${Date.now()}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !Array.isArray(data) || data.length === 0) return; // 🛡️ Boş veri koruması
      const initialUrgent = data.find((p: Product) => p && (p.isUrgent === true || String(p.isUrgent) === 'true' || Number(p.isUrgent) === 1));
      if (initialUrgent && lastUrgentId === null) {
        setLastUrgentId(initialUrgent.id);
      }
    })
    .catch((err) => console.log('Sessiz veri kontrolü'));

  const interval = setInterval(() => {
    fetch(`${BASE_URL}/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        // 🛡️ KRİTİK KORUMA: Eğer ilan silindiyse veya veri henüz yüklenmediyse kodu burada durdur, çökme!
        if (!data || !Array.isArray(data) || data.length === 0) return;
        
        const latestProduct = data[0]; // Listenin en başındaki eleman
        
        // 🛡️ NESNE VARLIK KONTROLÜ: latestProduct nesnesi gerçekten var mı diye bakıyoruz (Silindiğinde hata vermez)
        if (
          latestProduct && 
          latestProduct.id !== undefined &&
          (latestProduct.isUrgent === true || String(latestProduct.isUrgent) === 'true') && 
          latestProduct.id !== lastUrgentId
        ) {
          setLastUrgentId(latestProduct.id);

          Alert.alert(
            "🚨 KAMPÜSTE ACİL İLAN!",
            `"${latestProduct.title}" az önce acil satılık durumuna alındı! Fiyat: ${latestProduct.price} TL. Kaçırmadan incele!`,
            [
              { 
                text: "Hemen İncele 🔍", 
                onPress: () => { 
                  setActiveTab('Feed'); 
                  fetchProducts(); 
                } 
              },
              { text: "Kapat", style: "cancel" }
            ],
            { cancelable: true }
          );
        }
      })
      .catch((err) => {
        // Ağ kopsa veya silme anında senkronizasyon şaşsa bile sessizce atlat, uygulamayı kilitleme!
      });
  }, 3000); 

  return () => clearInterval(interval);
}, [currentScreen, lastUrgentId]);

  const handleAuthSubmit = () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Eksik Alan', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (!email.toLowerCase().trim().endsWith('.edu.tr')) {
      Alert.alert('🎓 Kampüs Koruması', 'Sadece .edu.tr uzantılı üniversite e-postaları kullanılabilir.');
      return;
    }

    setAuthLoading(true);

    if (isRegister) {
      fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Kayıt hatası.');
          return data;
        })
        .then(() => {
          setAuthLoading(false);
          Alert.alert('🎉 Kayıt Başarılı!', 'Giriş yapabilirsiniz.');
          setIsRegister(false);
          setPassword('');
        })
        .catch((err) => {
          setAuthLoading(false);
          Alert.alert('Kayıt Hatası', err.message);
        });
    } else {
      fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Hatalı bilgiler.');
          return data;
        })
        .then((data) => {
          setAuthLoading(false);
          setUserToken(data.access_token);
          
          const loggedInUser = data.user || { id: 1, name: 'Öğrenci', email: email.trim() };
          setCurrentUser(loggedInUser);
          setCurrentScreen('Main'); 
          fetchProducts();
        })
        .catch((err) => {
          setAuthLoading(false);
          Alert.alert('Giriş Başarısız', err.message);
        });
    }
  };

const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Fotoğraf ekleyebilmek için galeri izni vermeniz gerekir.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // ⚡ DEPRECATED UYARISINI SİLEN YENİ NESİL KOD:
      mediaTypes: ['images'], // Eski MediaTypeOptions.Images yerine direkt bunu yazdık ✨
      allowsEditing: false, 
      quality: 0.8, 
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri); 
    }
  };

  const handleCreatePost = () => {
    if (!postTitle || !postPrice) {
      Alert.alert("Eksik Alan", "Lütfen ilan başlığı ve fiyat alanlarını doldurun.");
      return;
    }

    setAuthLoading(true);
    const formData = new FormData();
    formData.append('title', postTitle.trim());
    formData.append('price', postPrice);
    formData.append('description', postDescription.trim());
    formData.append('userId', String(currentUser?.id || 1));
    formData.append('category', 'Kitap & Eğitim'); 
    formData.append('campus', 'Kınıklar Kampüsü'); 

    if (selectedImage) {
      const uriParts = selectedImage.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('image', {
        uri: selectedImage,
        name: `photo_${Date.now()}.${fileType}`,
        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      } as any);
    }

    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'İlan yüklenemedi.');
        return data;
      })
      .then(() => {
        setAuthLoading(false);
        setPostModalVisible(false);
        setPostTitle(''); setPostPrice(''); setPostDescription(''); setSelectedImage(null);
        fetchProducts(); 
        if (activeTab === 'Profile') fetchUserProducts();
        Alert.alert("Başarılı 🎉", "Fotoğraflı ilanın kampüste başarıyla yayında!");
      })
      .catch((err) => {
        setAuthLoading(false);
        Alert.alert("Hata", err.message);
      });
  };

  const handlePaymentSubmit = () => {
    if (!cardNumber || !cardExpiry || !cardCvv) {
      Alert.alert("Hata", "Lütfen sembolik kart bilgilerini eksiksiz doldurun.");
      return;
    }

    setAuthLoading(true);
    const path = upgradeType === 'urgent' ? 'make-urgent' : 'premium';
    const url = `${BASE_URL}/products/${selectedProduct?.id}/${path}`;

    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('İlan güncellenemedi.');
        return res.json();
      })
      .then(() => {
        setAuthLoading(false);
        setPaymentModalVisible(false);
        setCardNumber(''); setCardExpiry(''); setCardCvv('');
        Alert.alert("İşlem Başarılı 💎", `Ödeme alındı! İlanınız başarıyla ${upgradeType === 'urgent' ? 'ACİL' : 'PREMIUM'} durumuna yükseltildi.`);
        fetchProducts();
        fetchUserProducts();
      })
      .catch((err) => {
        setAuthLoading(false);
        Alert.alert("Hata", err.message);
      });
  };

  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      "İlanı Sil",
      "Bu ilanı tamamen kaldırmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
          style: "destructive",
          onPress: () => {
            setUserProductsLoading(true);
            fetch(`${BASE_URL}/products/${productId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser?.id || 1 })
            })
              .then(async (res) => {
                if (!res.ok) throw new Error('İlan silinirken bir hata oluştu.');
                Alert.alert("Başarılı", "İlanınız başarıyla kaldırıldı.");
                fetchProducts();
                fetchUserProducts();
              })
              .catch((err) => Alert.alert("Hata", err.message))
              .finally(() => setUserProductsLoading(false));
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    setCurrentScreen('Auth'); setActiveTab('Feed'); setName(''); setEmail(''); setPassword(''); setSearchQuery(''); setProducts([]); setUserProducts([]); setCurrentUser(null); setUserToken(null);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const openUpgradeWorkflow = (product: Product, type: 'urgent' | 'premium') => {
    setSelectedProduct(product);
    setUpgradeType(type);
    setPaymentModalVisible(true);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => openProductDetail(item)} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={styles.noImageBg}><Text style={styles.noImageText}>📦 Resim Yok</Text></View>
        )}
        {item.isUrgent && (
          <View style={styles.urgentBadge}><Text style={styles.urgentBadgeText}>Acil</Text></View>
        )}
        {item.isPremium && (
          <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>Öne Çıkan</Text></View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productDescription} numberOfLines={1}>{item.description || 'Açıklama belirtilmemiş.'}</Text>
        <Text style={styles.productPrice}>{item.price} TL</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {currentScreen === 'Auth' ? (
        <View style={styles.loginWrapper}>
          <View style={styles.loginCard}>
            <View style={styles.webTabsHeader}>
              <TouchableOpacity style={!isRegister ? styles.webActiveTabMenu : styles.webPassiveTabMenu} onPress={() => setIsRegister(false)}>
                <Text style={!isRegister ? styles.webActiveTabText : styles.webPassiveTabText}>Giriş Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity style={isRegister ? styles.webActiveTabMenu : styles.webPassiveTabMenu} onPress={() => setIsRegister(true)}>
                <Text style={isRegister ? styles.webActiveTabText : styles.webPassiveTabText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.logoText}>🎓 CampusSwap</Text>
            <Text style={styles.subText}>
              {isRegister ? 'Kampüs Ağına Katıl. Sadece doğrulanmış öğrenciler.' : 'Kampüs içi güvenli, hızlı ikinci el pazarı'}
            </Text>

            {isRegister && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput style={styles.input} placeholder="Örn: Ali Yılmaz" value={name} onChangeText={setName} placeholderTextColor="#94A3B8" />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Üniversite E-Postası</Text>
              <TextInput style={styles.input} placeholder="ogrenci@universite.edu.tr" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#94A3B8" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput style={styles.input} placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#94A3B8" />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAuthSubmit} disabled={authLoading}>
              {authLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.homeHeader}>
            {activeTab === 'Profile' ? (
              <TouchableOpacity onPress={() => setActiveTab('Feed')} style={styles.backButton}>
                <Text style={styles.backButtonText}>⬅ İlanlar</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.homeTitle}>🎓 Campus<Text style={{color: '#10B981'}}>Swap</Text></Text>
            )}

            <View style={styles.headerRightAction}>
              {activeTab === 'Feed' && (
                <>
                  <TouchableOpacity style={styles.miniAddButton} onPress={() => setPostModalVisible(true)}>
                    <Text style={styles.miniAddButtonText}>+ İlan Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topProfileButton} onPress={() => setActiveTab('Profile')}>
                    <Text style={styles.topProfileButtonText}>👤 Profilim</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {activeTab === 'Feed' && (
            <View style={styles.searchBarContainer}>
              <TextInput style={styles.searchTextInput} placeholder="Kampüste ürün ara... (Örn: Masa, Kitap)" value={searchQuery} onChangeText={(text) => { setSearchQuery(text); fetchProducts(text); }} placeholderTextColor="#94A3B8" />
            </View>
          )}

          <View style={styles.contentArea}>
            {activeTab === 'Feed' ? (
              productsLoading && !refreshing ? ( 
                <View style={styles.loadingCenter}><ActivityIndicator size="large" color="#1B4332" /></View>
              ) : (
                <FlatList 
                  data={products} 
                  keyExtractor={(item) => item.id.toString()} 
                  renderItem={renderProductItem} 
                  numColumns={2} 
                  columnWrapperStyle={styles.row} 
                  contentContainerStyle={styles.listContainer} 
                  ListEmptyComponent={<Text style={styles.emptyText}>Aradığınız kriterde ilan bulunamadı.</Text>}
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    fetchProducts(searchQuery);
                  }}
                />
              )
            ) : (
              <ScrollView contentContainerStyle={styles.profileWrapper}>
                <View style={styles.profileCard}>
                  <View style={styles.avatarCircle}><Text style={styles.avatarText}>{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</Text></View>
                  <Text style={styles.profileName}>{currentUser?.name || 'Öğrenci'}</Text>
                  <Text style={styles.profileEmail}>🎓 {currentUser?.email || 'ogrenci@edu.tr'}</Text>
                  <View style={styles.badgeRow}><View style={styles.verifiedBadge}><Text style={styles.verifiedBadgeText}>Doğrulanmış Öğrenci</Text></View></View>
                </View>

                <View style={styles.menuContainer}>
                  <Text style={styles.menuTitle}>📦 Benim Aktif İlanlarım</Text>
                  
                  {userProductsLoading ? (
                    <ActivityIndicator size="small" color="#1B4332" style={{ marginVertical: 20 }} />
                  ) : userProducts.length === 0 ? (
                    <Text style={styles.emptyUserProductsText}>Henüz hiç ilan vermemişsiniz.</Text>
                  ) : (
                    userProducts.map((item) => (
                      <View key={item.id} style={styles.userProductRow}>
                        {item.imageUrl ? (
                          <Image source={{ uri: item.imageUrl }} style={styles.userProductMiniImage} resizeMode="cover" />
                        ) : (
                          <View style={[styles.userProductMiniImage, { justifyContent: 'center', alignItems: 'center' }]}><Text>📦</Text></View>
                        )}
                        <View style={styles.userProductRowDetails}>
                          <Text style={styles.userProductRowTitle} numberOfLines={1}>{item.title}</Text>
                          <Text style={styles.userProductRowPrice}>{item.price} TL</Text>
                          <View style={{flexDirection: 'row', gap: 4, marginTop: 4}}>
                            {item.isUrgent && <View style={styles.miniBadgeUrgent}><Text style={styles.miniBadgeText}>Acil</Text></View>}
                            {item.isPremium && <View style={styles.miniBadgePremium}><Text style={styles.miniBadgeText}>Premium</Text></View>}
                          </View>
                        </View>
                        
                        <View style={styles.userProductActionBox}>
                          <TouchableOpacity 
                            style={styles.actionDeleteBtn} 
                            onPress={() => handleDeleteProduct(item.id)}
                          >
                            <Text style={styles.actionDeleteBtnText}>🗑️ İlanı Sil</Text>
                          </TouchableOpacity>

                          {!item.isUrgent && (
                            <TouchableOpacity style={styles.actionUrgentBtn} onPress={() => openUpgradeWorkflow(item, 'urgent')}>
                              <Text style={styles.actionBtnText}>🚨 Acil Yap</Text>
                            </TouchableOpacity>
                          )}
                          {!item.isPremium && (
                            <TouchableOpacity style={styles.actionPremiumBtn} onPress={() => openUpgradeWorkflow(item, 'premium')}>
                              <Text style={styles.actionBtnText}>⭐ Öne Çıkar</Text>
                            </TouchableOpacity>
                          )}
                          {item.isUrgent && item.isPremium && (
                            <Text style={styles.maxedOutText}>⚡ Full Paket</Text>
                          )}
                        </View>
                      </View>
                    ))
                  )}
                </View>

                <TouchableOpacity style={styles.customLogoutBtn} onPress={handleLogout}>
                  <Text style={styles.customLogoutBtnText}>Oturumu Kapat</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>

          {activeTab === 'Feed' && (
            <View style={styles.bottomStatusStrip}><View style={styles.activeDot} /><Text style={styles.stripText}>Filtrelenmiş Canlı Veri Aktif</Text></View>
          )}

          {/* MODAL: YENİ İLAN VERME FORMU */}
          <Modal visible={isPostModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>🚀 Fotoğraflı İlan Oluştur</Text>
                  <TouchableOpacity onPress={() => { setPostModalVisible(false); setSelectedImage(null); }}>
                    <Text style={styles.modalCloseText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.imageSelectorBox} onPress={pickImage}>
                  {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.selectedFormImage} /> : <Text style={styles.imageSelectorBoxText}>📸 Ürün Fotoğrafı Seç</Text>}
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>İlan Başlığı *</Text>
                  <TextInput style={styles.input} placeholder="Örn: Temiz Çalışma Masası" value={postTitle} onChangeText={setPostTitle} placeholderTextColor="#94A3B8" />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Fiyat (TL) *</Text>
                  <TextInput style={styles.input} placeholder="Örn: 450" keyboardType="numeric" value={postPrice} onChangeText={setPostPrice} placeholderTextColor="#94A3B8" />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Açıklama</Text>
                  <TextInput style={[styles.input, { height: 60, textAlignVertical: 'top', paddingTop: 8 }]} placeholder="Ürün durumu, kampüs içi teslim yeri..." multiline={true} value={postDescription} onChangeText={setPostDescription} placeholderTextColor="#94A3B8" />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleCreatePost} disabled={authLoading}>
                  {authLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Fotoğraflı İlanı Paylaş</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* MODAL: İLAN DETAY SAYFASI */}
          <Modal visible={isDetailModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { minHeight: '75%', padding: 0 }]}>
                <View style={[styles.modalHeader, { paddingHorizontal: 24, paddingTop: 20, marginBottom: 0 }]}>
                  <Text style={styles.modalTitle}>🔎 İlan Detayı</Text>
                  <TouchableOpacity onPress={() => { setDetailModalVisible(false); setSelectedProduct(null); }}>
                    <Text style={styles.modalCloseText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
                  <View style={styles.detailImageContainer}>
                    {selectedProduct?.imageUrl ? <Image source={{ uri: selectedProduct.imageUrl }} style={styles.detailProductImage} resizeMode="cover" /> : <View style={styles.noImageBg}><Text style={styles.noImageText}>📦 Fotoğraf Yok</Text></View>}
                  </View>
                  <View style={styles.detailTitleRow}>
                    <Text style={styles.detailPrice}>{selectedProduct?.price} TL</Text>
                    <Text style={styles.detailTitle}>{selectedProduct?.title}</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>📍 Konum: <Text style={{fontWeight: '700', color: '#1E293B'}}>{selectedProduct?.campus || 'Merkez Kampüs'}</Text></Text>
                    <Text style={styles.categoryText}>📁 Kategori: <Text style={{fontWeight: '700', color: '#1E293B'}}>{selectedProduct?.category || 'Genel'}</Text></Text>
                  </View>
                  <View style={styles.detailDescBox}>
                    <Text style={styles.descSectionTitle}>Ürün Açıklaması</Text>
                    <Text style={styles.detailDescText}>{selectedProduct?.description || 'Açıklama belirtildi.'}</Text>
                  </View>
                  <View style={styles.sellerCard}>
                    <Text style={styles.sellerCardTitle}>👤 Satıcı Bilgileri</Text>
                    <Text style={styles.sellerName}>{selectedProduct?.user?.name || 'Doğrulanmış Kampüs Öğrencisi'}</Text>
                    <TouchableOpacity style={styles.emailCommunicationButton} onPress={() => Alert.alert('📬 İletişim', `${selectedProduct?.user?.email || 'ogrenci@edu.tr'} adresine mesaj atabilirsiniz.`)}>
                      <Text style={styles.emailCommunicationButtonText}>📧 E-Posta ile İletişime Geç</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* MODAL: SEMBOLİK KREDİ KARTI ÖDEME EKRANI */}
          <Modal visible={isPaymentModalVisible} animationType="fade" transparent={true}>
            <View style={styles.paymentModalOverlay}>
              <View style={styles.paymentCard}>
                <Text style={styles.paymentTitle}>💳 Kampüs Ödeme Geçidi</Text>
                <Text style={styles.paymentSubText}>"{selectedProduct?.title}" ilanını {upgradeType === 'urgent' ? '🚨 ACİL' : '⭐ ÖNE ÇIKAN'} yapmak için sembolik panel.</Text>
                <Text style={styles.paymentPriceTag}>Tutar: 19,90 TL</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Kart Üzerindeki İsim</Text>
                  <TextInput style={styles.input} placeholder="Örn: Ali Yılmaz" placeholderTextColor="#94A3B8" />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Kart Numarası</Text>
                  <TextInput style={styles.input} placeholder="4444 5555 6666 7777" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={setCardNumber} placeholderTextColor="#94A3B8" />
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Son Kul. (AA/YY)</Text>
                    <TextInput style={styles.input} placeholder="12/28" keyboardType="numeric" maxLength={5} value={cardExpiry} onChangeText={setCardExpiry} placeholderTextColor="#94A3B8" />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput style={styles.input} placeholder="123" keyboardType="numeric" secureTextEntry maxLength={3} value={cardCvv} onChangeText={setCardCvv} placeholderTextColor="#94A3B8" />
                  </View>
                </View>

                <TouchableOpacity style={[styles.button, { backgroundColor: '#10B981', marginTop: 12 }]} onPress={handlePaymentSubmit} disabled={authLoading}>
                  {authLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🔒 19,90 TL Güvenli Ödeme Yap</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelPaymentBtn} onPress={() => { setPaymentModalVisible(false); setCardNumber(''); setCardExpiry(''); setCardCvv(''); }}>
                  <Text style={styles.cancelPaymentBtnText}>İptal Et</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  loginWrapper: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F8FAFC' },
  loginCard: { backgroundColor: '#fff', padding: 28, borderRadius: 24, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 5, borderColor: '#F1F5F9', borderWidth: 1 },
  webTabsHeader: { flexDirection: 'row', gap: 16, marginBottom: 24, borderBottomWidth: 2, borderColor: '#F1F5F9', paddingBottom: 12 },
  webActiveTabMenu: { flex: 1, alignItems: 'center' },
  webPassiveTabMenu: { flex: 1, alignItems: 'center' },
  webActiveTabText: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  webPassiveTabText: { fontSize: 18, fontWeight: '500', color: '#94A3B8' },
  logoText: { fontSize: 28, fontWeight: '900', color: '#1B4332', textAlign: 'center', letterSpacing: -0.5 },
  subText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, marginBottom: 24, fontWeight: '500', paddingHorizontal: 10 },
  inputContainer: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginLeft: 2 },
  input: { height: 46, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, fontSize: 14, color: '#0F172A', backgroundColor: '#F8FAFC' },
  button: { height: 46, backgroundColor: '#1B4332', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8, shadowColor: '#1B4332', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  mainContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  contentArea: { flex: 1 },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  homeTitle: { fontSize: 22, fontWeight: '900', color: '#1B4332', letterSpacing: -0.5 },
  headerRightAction: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  miniAddButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#10B981' },
  miniAddButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  topProfileButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E6F4EA', borderColor: '#A7F3D0', borderWidth: 1 },
  topProfileButtonText: { color: '#065F46', fontWeight: '700', fontSize: 13 },
  backButton: { paddingVertical: 6 },
  backButtonText: { fontSize: 16, fontWeight: '700', color: '#1B4332' },
  miniLogoutButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#FEE2E2' },
  miniLogoutText: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBarContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  searchTextInput: { height: 44, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, fontSize: 14, color: '#0F172A' },
  listContainer: { padding: 16, paddingBottom: 16 },
  row: { justifyContent: 'space-between' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40, fontSize: 15 },
  
  productCard: { backgroundColor: '#fff', width: cardWidth, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderColor: '#E2E8F0', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  imageContainer: { width: '100%', height: cardWidth * 0.9, backgroundColor: '#F1F5F9', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  noImageBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noImageText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  
  urgentBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  urgentBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  premiumBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  premiumBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  
  productInfo: { padding: 12 },
  productTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  productDescription: { fontSize: 12, color: '#64748B', marginTop: 2 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#1B4332', marginTop: 8 },
  
  profileWrapper: { padding: 20 },
  profileCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', borderColor: '#E2E8F0', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E6F4EA', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#10B981' },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#1B4332' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  profileEmail: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 16 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  verifiedBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  verifiedBadgeText: { color: '#065F46', fontSize: 12, fontWeight: '700' },
  menuContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderColor: '#E2E8F0', borderWidth: 1 },
  menuTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 16, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyUserProductsText: { textAlign: 'center', color: '#94A3B8', marginVertical: 20, fontSize: 14 },
  
  userProductRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  userProductMiniImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#F1F5F9' },
  userProductRowDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  userProductRowTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  userProductRowPrice: { fontSize: 14, fontWeight: '800', color: '#1B4332', marginTop: 2 },
  miniBadgeUrgent: { backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  miniBadgePremium: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  miniBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400E' },
  
  userProductActionBox: { gap: 6, marginLeft: 8 },
  actionUrgentBtn: { backgroundColor: '#EF4444', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignItems: 'center' },
  actionPremiumBtn: { backgroundColor: '#F59E0B', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  maxedOutText: { fontSize: 11, fontWeight: '600', color: '#10B981', fontStyle: 'italic' },
  
  actionDeleteBtn: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignItems: 'center', borderColor: '#FCA5A5', borderWidth: 1 },
  actionDeleteBtnText: { color: '#DC2626', fontSize: 11, fontWeight: '700' },

  customLogoutBtn: { marginTop: 24, backgroundColor: '#FEE2E2', padding: 14, borderRadius: 12, alignItems: 'center' },
  customLogoutBtnText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
  bottomStatusStrip: { flexDirection: 'row', height: 44, backgroundColor: '#ffffff', borderTopWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', gap: 8, paddingBottom: Platform.OS === 'android' ? 4 : 0 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  stripText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 480, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1B4332' },
  modalCloseText: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
  imageSelectorBox: { width: '100%', height: 120, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginBottom: 16, backgroundColor: '#F8FAFC', overflow: 'hidden' },
  imageSelectorBoxText: { color: '#64748B', fontWeight: '600', fontSize: 14 },
  selectedFormImage: { width: '100%', height: '100%' },
  detailImageContainer: { width: '100%', height: 220, borderRadius: 16, backgroundColor: '#F1F5F9', overflow: 'hidden', marginTop: 16, borderColor: '#E2E8F0', borderWidth: 1 },
  detailProductImage: { width: '100%', height: '100%' },
  detailTitleRow: { marginTop: 16 },
  detailPrice: { fontSize: 24, fontWeight: '900', color: '#1B4332' },
  detailTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  locationContainer: { flexDirection: 'column', gap: 4, marginTop: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  locationText: { fontSize: 14, color: '#64748B' },
  categoryText: { fontSize: 14, color: '#64748B' },
  detailDescBox: { marginTop: 16 },
  descSectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailDescText: { fontSize: 15, color: '#334155', marginTop: 6, lineHeight: 22 },
  sellerCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginTop: 24, borderColor: '#E2E8F0', borderWidth: 1 },
  sellerCardTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  sellerName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  emailCommunicationButton: { backgroundColor: '#1B4332', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  emailCommunicationButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  paymentModalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 20 },
  paymentCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  paymentTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', textAlign: 'center' },
  paymentSubText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  paymentPriceTag: { fontSize: 22, fontWeight: '900', color: '#10B981', textAlign: 'center', marginVertical: 16, backgroundColor: '#E6F4EA', paddingVertical: 8, borderRadius: 10, overflow: 'hidden' },
  cancelPaymentBtn: { marginTop: 14, paddingVertical: 10, alignItems: 'center' },
  cancelPaymentBtnText: { color: '#94A3B8', fontWeight: '700', fontSize: 14 }
});