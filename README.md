# Ödeme Defteri - GitHub Pages Kurulumu

Bu klasör, Ödeme Defteri uygulamasını GitHub Pages üzerinden internet adresi olarak yayınlamak ve telefona uygulama gibi kurmak için gereken dosyaları içerir.

## Önemli bilgi

- Uygulamanın kodu GitHub Pages üzerinden yayınlanır.
- Defter kayıtları Firebase Firestore'da tutulur; GitHub'a gönderilmez.
- Uygulama çevrimdışı çalışabilir ve internet gelince eşitler.
- Yeni sürüm Google hesabıyla giriş ve defter sahibi tarafından üyelik onayı gerektirir. Mevcut kullanıcılar için kuralları sırayla yayımlayın; [güvenli geçiş rehberini](SECURITY_MIGRATION.md) izleyin.

## Dosyalar

| Dosya | Görevi |
|---|---|
| index.html | Uygulamanın kendisi |
| manifest.json | Ana ekrana eklenen uygulamanın ayarları |
| sw.js | Çevrimdışı çalışma ve önbellek |\n| firestore.rules | Üyelik denetimli Firestore kuralları |\n| firestore.rules.migration | Eski kullanıcılar için geçiş kuralları |\n| SECURITY_MIGRATION.md | Hesap ve üyelik modeline geçiş rehberi |
| icon.svg | Uygulama simgesi |
| .nojekyll | GitHub Pages dosyaları olduğu gibi yayınlasın diye (isteğe bağlı) |
| README.md | Bu kılavuz |

---

## 1. GitHub hesabı ve depo

1. https://github.com adresinden **Sign up** ile hesap açın.
2. Giriş yaptıktan sonra sağ üstteki **+** simgesine dokunun, **New repository** seçin.
3. **Repository name** alanına `odeme-defteri` yazın.
4. **Public** seçeneğini işaretleyin. Private depoda GitHub Pages ücretli plan gerektirir.
5. **Create repository** düğmesine basın.

## 2. Dosyaları depoya yükleyin

1. Depo sayfasında **Add file** → **Upload files** seçin.
2. Bu klasördeki dosyaları (`index.html`, `manifest.json`, `sw.js`, `icon.svg`, `README.md`, varsa `.nojekyll`) sayfaya sürükleyin ya da **choose your files** ile seçin.
3. Sayfanın altında **Commit changes** düğmesine basın.

Not: Bu işlemi bilgisayardan yapmanız en kolayıdır. iPhone'da Safari üzerinden github.com açıp aynı adımları izleyebilirsiniz; ancak dosya seçme ekranı ve gizli dosyalar telefonda farklı görünebilir. `.nojekyll` olmadan da uygulama çalışır.

## 3. GitHub Pages'i açın

1. Depo sayfasında üstteki **Settings** sekmesine girin.
2. Sol menüde **Pages** seçeneğine tıklayın.
3. **Build and deployment** bölümünde **Source** için **Deploy from a branch** seçin.
4. **Branch** kısmında `main` seçin, klasör olarak **/ (root)** bırakın, **Save** deyin.
5. 1-2 dakika bekleyin. Sayfanın üst kısmında adresiniz çıkar:

```
https://KULLANICIADINIZ.github.io/odeme-defteri/
```

Bu adresi açtığınızda uygulama görünür.

## 4. Telefona kurma

### iPhone (Safari ile)
1. Adresi **Safari** ile açın. Ana ekrana ekleme için Safari gerekir.
2. Alttaki **Paylaş** simgesine (kare ve ok) dokunun.
3. **Ana Ekrana Ekle** → **Ekle** deyin.
4. Ana ekrandaki **Ödeme Defteri** simgesiyle açın.

### Android (Chrome ile)
1. Adresi **Chrome** ile açın.
2. Sağ üstteki **⋮** menüsünden **Uygulamayı yükle** veya **Ana ekrana ekle** seçin.

### Bilgisayar
Adresi Chrome veya Edge ile açın. Adres çubuğunda çıkan **yükle** simgesine tıklayarak masaüstüne ekleyebilirsiniz.

## 5. Güncelleme yapmak

Uygulamada değişiklik yaptığınızda:

1. Yeni `index.html` dosyasını depoya **aynı isimle** yükleyin: **Add file** → **Upload files** → **Commit changes**. Eski dosyanın üzerine yazılır.
2. `sw.js` dosyasını açın ve şu satırdaki sürüm numarasını artırın:
   ```
   const CACHE = "odeme-defteri-v1";
   ```
   `v1` yerine `v2` yazın, kaydedip yükleyin. Bu, telefondaki eski önbelleği yeniler.
3. Telefonda uygulamayı kapatıp açın. Hâlâ eski görünüyorsa Safari veya Chrome'da adresi yenileyin.

## 5b. Canlı paylaşım (isteğe bağlı)

Verileri bağlantıyla salt okunur paylaşmak için **PAYLASIM_KURULUM.md** dosyasındaki Firebase adımlarını izleyin. Bu kurulum yapılmadan uygulama yalnızca tek cihazda çalışır; paylaşım bölümü kapalı kalır.

Paylaşım için yüklemeniz gereken dosyalar: `index.html`, `firebase-config.js`, `manifest.json`, `sw.js`, `icon.svg`.

## 6. Veri güvenliği

- Veriler cihaz bazında tutulur. Telefon ve bilgisayar kayıtları **otomatik eşitlenmez**. Cihazlar arasında taşımak için **Ayarlar → JSON indir** ile yedek alıp diğer cihazda **JSON yükle** kullanın.
- Ana ekrana eklediğiniz simgeyi kullanın. Aynı adresi Safari'de açtığınızda verilerin ayrı tutulabileceğini unutmayın. Her zaman aynı yöntemi kullanın.
- Haftada bir **JSON indir** ile yedek alın ve güvenli bir yere kaydedin.
- Safari'de **Geçmişi ve Web Sitesi Verilerini Temizle** yapmayın; kayıtlar silinir.

## 7. Sorun giderme

| Sorun | Çözüm |
|---|---|
| Adres "404 - There isn't a GitHub Pages site here" diyor | 2-3 dakika bekleyin. Dosya adının tam olarak `index.html` (küçük harf) olduğunu ve depo ana sayfasında durduğunu kontrol edin. |
| Pages ayarında seçenek yok | Depo Private ise Public yapın ya da ücretli plan kullanın. |
| Eski sürüm görünüyor | `sw.js` içindeki sürüm numarasını artırıp yükleyin, sonra uygulamayı yeniden açın. |
| Uygulama açılıyor ama boş | Normal bir durumdur; bu cihazda henüz kayıt yoktur. Yedekten **JSON yükle** ile geri alabilirsiniz. |
| iPhone'da simge sadece sayfanın görüntüsü | iOS, SVG simgeleri ana ekran simgesi olarak desteklemez. İsterseniz PNG simge ekleyebiliriz. |
