# Canlı Paylaşım Kurulumu (Firebase)

Bu kurulumla:
- **Sahip** (siz) uygulamayı normal şekilde kullanır, kayıt yapar, tahsil eder.
- Her değişiklik bulut veritabanına otomatik gönderilir.
- **Bağlantıyı alan herkes** (telefon, tablet, bilgisayar) verileri **canlı ve salt okunur** görür. Değişiklik yapamaz, şifre gerekmez.

Bunun için ücretsiz Firebase planı yeterlidir. Kredi kartı istemez.

---

## Önce bilmeniz gerekenler

- **Bağlantıyı bilen herkes tüm kayıtları görür**: müşteri adı, tutar, vade, ödeme türü ve (gizlemezseniz) telefon ve notlar.
- Bağlantı rastgele ve uzun bir adrestir; tahmin edilemez. Yine de bağlantıyı yalnızca güvendiğiniz kişilere verin.
- Bağlantıyı istediğiniz zaman **durdurabilir** ya da **yenileyebilirsiniz** (eski bağlantı çalışmaz hale gelir).
- Düzenleme yetkisi yalnızca sizin hesabınızdadır.

---

## Adım 1: Firebase projesi oluşturun

1. https://console.firebase.google.com adresine Google hesabınızla girin.
2. **Proje oluştur** (Create a project) deyin.
3. Proje adı: `odeme-defteri`. **Devam** deyin.
4. Google Analytics sorulursa **kapalı** bırakın. **Proje oluştur** deyin, bitene kadar bekleyin.

## Adım 2: Veritabanını açın (Firestore)

1. Sol menüden **Build → Firestore Database** seçin.
2. **Veritabanı oluştur** (Create database) deyin.
3. Konum olarak **eur3 (Europe)** veya **europe-west1** seçin.
4. **Production mode (üretim modu)** seçili olsun. **Oluştur** deyin.

## Adım 3: Güvenlik kurallarını yapıştırın

1. Firestore sayfasında üstteki **Rules** (Kurallar) sekmesine girin.
2. Mevcut metni tamamen silin ve aşağıdakini yapıştırın.
3. **E-posta adresini** kendi sahip e-postanızla değiştirin (Adım 4'te oluşturacağınız hesap).
4. **Publish** (Yayınla) deyin.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /paylasim/{token} {
      allow get: if true;
      allow list: if false;
      allow create, update, delete: if request.auth != null
        && request.auth.token.email == "sahip@ornek.com";
    }
  }
}
```

Bu kuralın anlamı:
- Bağlantı adresini (token) bilen herkes **tek bir paylaşımı okuyabilir**.
- Hiç kimse tüm paylaşımların listesini göremez (`list: false`).
- Yazma ve silme yalnızca belirtilen e-posta ile giriş yapılmışsa mümkündür.

## Adım 4: Giriş (Authentication) ayarı ve sahip hesabı

1. Sol menüden **Build → Authentication** seçin, **Get started** (Başlayın) deyin.
2. **Sign-in method** (Oturum açma yöntemi) sekmesinde **Email/Password** seçin, **Enable** açın ve **Save** deyin.
3. **Users** (Kullanıcılar) sekmesine girin, **Add user** (Kullanıcı ekle) deyin.
4. Kendi e-postanızı ve güçlü bir şifre girin. **Add user** deyin.

Not: E-posta adresi Adım 3'teki kuraldaki adresle **birebir aynı** olmalıdır.

## Adım 5: Web uygulaması kaydı ve ayar bilgileri

1. Sol üstteki **dişli simge → Project settings** (Proje ayarları) deyin.
2. Aşağıda **Your apps** (Uygulamalarınız) bölümünde **</>** (Web) simgesine tıklayın.
3. Uygulama adı: `odeme-defteri`. **Hosting** kutusunu işaretlemeden **Register app** deyin.
4. Ekrana `const firebaseConfig = { ... }` şeklinde bir kod çıkacak. İçindeki değerleri (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) kopyalayın.

## Adım 6: firebase-config.js dosyasını doldurun

GitHub deposunda `firebase-config.js` dosyasını açın:

1. Dosyaya tıklayın, sağ üstteki **kalem (Edit)** simgesine basın.
2. `BURAYA_YAZIN` yazan yerleri Adım 5'teki değerlerle değiştirin. Örnek:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy....",
  authDomain: "odeme-defteri-xxxx.firebaseapp.com",
  projectId: "odeme-defteri-xxxx",
  storageBucket: "odeme-defteri-xxxx.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

window.OWNER_EMAIL = "sizin@eposta.com";
```

3. `OWNER_EMAIL` satırına Adım 4'te oluşturduğunuz e-postayı yazın.
4. Sayfanın altında **Commit changes** deyin.

Not: Bu değerler (apiKey vb.) gizli sayılmaz; tarayıcıda zaten görünür. Asıl güvenlik Adım 3'teki kurallarla sağlanır. Şifrenizi asla bu dosyaya yazmayın.

## Adım 7: Yetkili alan adını ekleyin (gerekirse)

Giriş yaparken "unauthorized-domain" benzeri bir hata görürseniz:

1. Firebase'de **Authentication → Settings → Authorized domains** (Yetkili alan adları) bölümüne gidin.
2. **Add domain** deyin ve `KULLANICIADINIZ.github.io` yazın. Kaydedin.

## Adım 8: Uygulamada paylaşımı açın

1. Uygulamayı açın (GitHub Pages adresinden ya da ana ekran simgesinden).
2. Sağ üstteki **dişli (Ayarlar)** simgesine dokunun.
3. **Canlı paylaşım** bölümünde Adım 4'teki e-posta ve şifreyle **Giriş yap** deyin.
4. **Paylaşımı aç** düğmesine basın.
5. **Bağlantıyı kopyala** ya da **WhatsApp** ile gönderin.

Bundan sonra yaptığınız her değişiklik birkaç saniye içinde bağlantıdaki herkese yansır.

## Adım 9: İzleyici olarak nasıl açılır?

Bağlantıyı alan kişi:
- Herhangi bir cihazda bağlantıyı açar. **Giriş gerekmez.**
- Ekranda **CANLI GÖRÜNÜM** yazısı ve son güncelleme saati görünür.
- Düzenleme, ekleme, tahsil, silme düğmeleri gizlidir.
- İsterse telefonda **Paylaş → Ana Ekrana Ekle** ile simge oluşturabilir.

---

## Bağlantıyı yönetme

| İhtiyaç | Yapılacak |
|---|---|
| Paylaşımı geçici kapatmak | Ayarlar → **Paylaşımı durdur** (bağlantı çalışmaz, tekrar açınca aynı bağlantı geri gelir) |
| Eski bağlantıyı iptal etmek | Ayarlar → **Bağlantıyı yenile** (yeni adres oluşur, eski adres kapanır) |
| Telefon numaralarını göstermemek | Ayarlarda **Telefon ve notları izleyicilerden gizle** kutusu açık kalsın (varsayılan) |
| Hemen göndermek | Ayarlar → **Şimdi eşitle** |

## Önemli: Birden fazla cihazdan düzenleme

- Veriyi sahip hesabının açtığı cihazlarda düzenleyin. Son kaydeden cihaz tüm veriyi üzerine yazar.
- Aynı anda iki cihazdan farklı kayıt girerseniz biri kaybolabilir.
- Bu yüzden ana cihazınızda düzenleyin, diğer cihazlarda sadece izleyin ya da JSON yedeği ile taşıyın.

## Sorun giderme

| Mesaj / Durum | Anlamı ve çözümü |
|---|---|
| "Canlı paylaşım henüz kurulmadı" | `firebase-config.js` içinde hâlâ `BURAYA_YAZIN` var. Adım 6'yı tamamlayın. |
| "Giriş başarısız" | E-posta/şifre yanlış ya da kullanıcı Adım 4'te oluşturulmamış. |
| "Eşitleme hatası: permission-denied" | Giriş yapılmamış ya da kuraldaki e-posta, `OWNER_EMAIL` ile farklı. İkisini de aynı yapın. |
| "Eşitleme hatası: unavailable" | İnternet yok. Bağlantı gelince otomatik denenir; "Şimdi eşitle" de kullanabilirsiniz. |
| İzleyici "Bu bağlantı geçersiz" görüyor | Paylaşım durdurulmuş ya da bağlantı yenilenmiş. Ayarlardan kontrol edin. |
| İzleyici "Bağlantı kurulamadı" görüyor | İzleyicinin cihazında internet yok ya da `firebase-config.js` henüz doldurulmamış. |
| Çok fazla kayıt | Firestore tek kayıtta en fazla yaklaşık 1 MB saklar. Bu, binlerce kayıt demektir; sorun olursa haber verin, veriyi bölen bir yapıya geçeriz. |

## Ücret ve kota

Ücretsiz Spark planı bu kullanım için yeterlidir (birkaç kişi, günde birkaç yüz okuma/yazma). Firebase kullanım sayfasında kotaları izleyebilirsiniz.
