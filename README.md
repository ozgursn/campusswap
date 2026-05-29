# ♻️ CampusSwap

<div align="center">
  <p><b>Kampüsün Ekonomisi, Senin Elinde!</b></p>
  <p>Üniversite öğrencileri arası güvenli, hızlı, kargosuz ve anlık bildirim destekli ikinci el pazaryeri platformu.</p>

  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
</div>

---

## ✨ Öne Çıkan Özellikler

* 🎓 **Kampüs Koruması (Gatekeeping):** Sadece `.edu.tr` uzantılı üniversite e-postaları ile doğrulanmış kayıt mekanizması.
* 🚨 **Real-Time Acil İlan Bildirim Motoru:** Bir ürün "Acil Satılık" durumuna alındığı an, hem Web hem de Mobil platformlarda sayfa yenilemeye gerek kalmadan (Zero-Refresh) anlık push uyarısı tetiklenir.
* 🤝 **Lokal Teslimat (Peer-to-Peer):** Alıcı ve satıcıyı aynı kampüs sınırlarında buluşturan, kargo ve komisyon maliyetlerini sıfırlayan akış.
* 📸 **Gelişmiş Medya Entegrasyonu:** Mobil cihazların yerel galerileriyle tam entegre, optimize edilmiş görsel yükleme altyapısı.

---

## 📂 Proje Mimarisi (Monorepo)

Proje, platformlar arası veri tutarlılığını maksimuma çıkarmak adına ölçeklenebilir bir monorepo yapısında kurgulanmıştır:

* 📁 `campusswap-api`: İş kurallarının, TypeORM veritabanı ilişkilerinin, global CORS vizelerinin ve statik medya yönetiminin bulunduğu **Restful API (NestJS)** katmanı.
* 📁 `campusswap-frontend`: Ngrok tünel bypass yeteneklerine ve Toast bildirim motoruna sahip modern **Web Arayüzü (React + Vite)** katmanı.
* 📁 `campusswap-mobile`: Güvenli catch-error blokları ve çoklu platform desteği barındıran **Mobil Uygulama (React Native + Expo)** katmanı.

---

## 🛠️ Teknik Altyapı ve Optimizasyonlar

* **CORS & Tunneling Management:** Web ve mobil istemcilerin yerel ağ üzerinden NestJS API katmanı ile güvenli el sıkışabilmesi için küresel CORS politikaları yapılandırılmış ve uzak erişim testleri **Ngrok** tüneli üzerinden simüle edilmiştir.
* **Safe Polling Stratejisi:** İstemci tarafında çalışan arka plan zamanlayıcıları (intervals), veri tabanından bir nesne silindiğinde veya ağ koptuğunda çökme yaşanmaması için *Varlık Kontrolü (Object Null Check)* ve *Sessiz Hata Koruması (Safe Catch)* ile sarmallanmıştır.

---

## 🚀 Geliştirici Ortamı Kurulumu

Projeyi yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları sırasıyla uygulayabilirsiniz:

### 1. Backend (NestJS) Kurulumu
Bash
cd campusswap-api
npm install
npm run start:dev

### 2. Web Frontend (React) Kurulumu
Bash
cd campusswap-frontend
npm install
npm run dev

Web arayüzüne http://localhost:5173 adresinden erişebilirsiniz.

### 3. Mobil Uygulama (Expo) Kurulumu
Bash
cd campusswap-mobile
npm install
npx expo start
Terminaldeki QR kodu fiziksel cihazınızdaki Expo Go uygulaması ile taratarak test edebilirsiniz.

---
**Geliştirici:** Özgür Uğur ŞEN| Bilgisayar Mühendisliği öğrencisi olarak sevgiyle ve kodla geliştirildi:)
