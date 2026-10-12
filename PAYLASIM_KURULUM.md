# Ödeme Defteri – Ortak Canlı Defter Kurulumu (Sıfırdan, Adım Adım)

Bu rehber hiç bilgisi olmayan biri için yazıldı. Her şeyi **tarayıcıdan** yapacaksınız. Program kurmanız gerekmiyor.
Süre: yaklaşık 15 dakika.

| Ne | Değer |
|---|---|
| Firebase projesi | `tahsilat-defteri` |
| GitHub deposu | https://github.com/dunyaambalaj/tahsilat-defteri |
| Site adresiniz | https://dunyaambalaj.github.io/tahsilat-defteri/ |

---

## Bu sistem nasıl çalışır?

- Defterin **tek bir ortak kopyası** Firebase'de (Google'ın bulutu) durur.
- Defter **bağlantısına sahip herkes** kayıt **ekleyebilir, düzenleyebilir, tahsilat girebilir, silebilir.**
- Biri bir şey yaptığında **birkaç saniye içinde herkesin ekranında** görünür (telefon, bilgisayar, tablet fark etmez).
- Aynı anda farklı kişiler farklı kayıtlar girse bile birbirini bozmaz.
- İnternet kesilirse uygulama çalışmaya devam eder; işlemler cihazda bekler, internet gelince **otomatik gönderilir.**
- Başlıktaki yazıdan durumu görürsünüz: **● CANLI** (her şey eşit), **● BAĞLANIYOR**, **● ÇEVRİMDIŞI**, **● HATA**.

**Cihaza özel (herkesin kendine ait) olanlar:** tema, karanlık mod, PIN kilidi, hatırlatma ayarları.
**Ortak olanlar:** tüm kayıtlar, firma adı/telefon/adres/vergi no, logo.

> ⚠️ **Güvenlik:** Bağlantı, defterin şifresi gibidir. Bağlantıyı bilen herkes her şeyi görür ve değiştirir. Bağlantıyı **sadece güvendiğiniz kişilere** verin. Silinen kayıtlar buluttan gerçekten silinmez (gizlenir), yine de düzenli **JSON yedek** almanız önerilir (Ayarlar → JSON indir).

---

## ADIM 1 – Anonim girişi açın (yeni, çok önemli)

Bu sistem kimseden e-posta ya da şifre istemez. Bağlantıyı açan herkes doğrudan deftere girer.

1. https://console.firebase.google.com adresine gidin, Google hesabınızla girin.
2. **tahsilat-defteri** projesine tıklayın.
3. Sol menüden **Build (Derleme)** → **Authentication** seçin.
   (Daha önce hiç açmadıysanız **Get started / Başlayın** butonuna basın.)
4. **Sign-in method (Oturum açma yöntemi)** sekmesinde **Anonymous (Anonim)** satırına tıklayın.
5. **Enable (Etkinleştir)** düğmesini açın ve **Save (Kaydet)** deyin.

> Bu sistemde **e-posta, şifre ya da kullanıcı hesabı yoktur.** "Anonim" giriş, Firebase'in arka planda kendiliğinden yaptığı isimsiz bağlantıdır; çalışanlarınız bunu görmez. Daha önce "E-posta/Şifre" yöntemini açtıysanız kapalı kalması da, açık kalması da fark etmez, kullanılmıyor.

## ADIM 2 – Veritabanını (Firestore) oluşturun

**Daha önce oluşturduysanız bu adımı atlayıp ADIM 3'e geçin.**

1. Sol menüden **Build** → **Firestore Database** seçin.
2. **Create database (Veritabanı oluştur)** butonuna basın.
3. Konum sorarsa **eur3 (Europe)** ya da **europe-west** seçin.
4. Güvenlik modu sorarsa **Production mode (Üretim modu)** seçin.
5. **Create** deyin ve birkaç saniye bekleyin.

## ADIM 3 – Yeni güvenlik kurallarını yapıştırın (çok önemli)

> Önceki rehberdeki kuralları **silip bunlarla değiştirmeniz şart.** Eski kurallar yeni sistemi engeller.

1. Firestore Database sayfasında üstteki **Rules (Kurallar)** sekmesine tıklayın.
2. Kutunun içindeki **her şeyi silin.**
3. Aşağıdaki kodun **tamamını** yapıştırın:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function girisli() {
      return request.auth != null;
    }
    function gecerliVeri() {
      return request.resource.data.d is string
          && request.resource.data.d.size() < 600000;
    }

    // Her defter, bağlantısındaki gizli kodla ayrılır.
    // Kodu bilmeyen biri defteri bulamaz, defterleri listeleyemez.
    match /defterler/{defterId}/{koleksiyon}/{belgeId} {
      allow read, delete: if girisli() && koleksiyon in ['kayitlar', 'ayar'];
      allow create, update: if girisli() && koleksiyon in ['kayitlar', 'ayar'] && gecerliVeri();
    }
  }
}
```

4. **Publish (Yayınla)** butonuna basın.

## ADIM 4 – Giriş için site adresinize izin verin

1. Authentication sayfasında **Settings (Ayarlar)** sekmesine gidin.
2. **Authorized domains (Yetkili alanlar)** bölümünde `dunyaambalaj.github.io` yoksa **Add domain** deyip yazın ve ekleyin.

## ADIM 5 – Dosyaları GitHub'a yükleyin

Bu rehberle birlikte **3 dosya** geldi: `index.html`, `firebase-config.js`, `PAYLASIM_KURULUM.md`.

1. https://github.com/dunyaambalaj/tahsilat-defteri adresine gidin ve giriş yapın.
2. Sağ üstteki **Add file** → **Upload files** seçin.
3. Üç dosyayı sayfaya sürükleyin (aynı isimli dosyaların üzerine yazılır).
4. Aşağıdaki **Commit changes** (yeşil buton) deyin.

> ⚠️ Depoda `manifest.json`, `icon.svg` ve `sw.js` dosyaları **kalmalı**, onlara dokunmayın.

GitHub'ın siteyi yenilemesi **1–2 dakika** sürer. Siteniz zaten yayında olduğu için **Settings → Pages** ayarına dokunmanız gerekmez.

## ADIM 6 – İlk defteri oluşturun (sadece 1 kişi, 1 kez)

**Bunu defteri şu ana kadar kullanan kişi yapsın** (verileri bu cihazdadır).

1. https://dunyaambalaj.github.io/tahsilat-defteri/ adresini açın.
   Eski görünüm gelirse sayfayı tam yenileyin: bilgisayarda `Ctrl + Shift + R`, telefonda sekmeyi kapatıp tekrar açın.
2. **"Ortak defter"** karşılama ekranı gelir.
3. **Yeni ortak defter oluştur** butonuna basın.
   Bu cihazda daha önce girdiğiniz kayıtlar varsa ekranda "X kayıt aktarılacak" yazar ve **hepsi otomatik buluta taşınır.**
4. Birkaç saniye içinde başlıkta **● CANLI** yazısı çıkar.

## ADIM 7 – Bağlantıyı herkese gönderin

1. Sağ üstten **Ayarlar** (dişli simgesi) açın.
2. **"Ortak defter"** bölümünde **Bağlantıyı kopyala** ya da **WhatsApp** butonuna basın.
3. Bağlantı şuna benzer: `https://dunyaambalaj.github.io/tahsilat-defteri/#d=AbCdEf...`
4. Çalışanlarınıza gönderin. Onlar bağlantıya tıklayınca defter açılır. **Başka bir şey yapmaları gerekmez.**

> 📱 **Telefonda uygulama gibi kullanmak için:** bağlantıyı açtıktan sonra tarayıcı menüsünden **"Ana ekrana ekle"** deyin.
> iPhone'da ana ekrandaki uygulama açılınca defter bağlantısını tanımazsa karşılama ekranındaki kutuya bağlantıyı yapıştırıp **Bağlantıyla katıl** deyin.

## ADIM 8 – Test edin

1. Bağlantıyı **başka bir telefondan** (ya da bilgisayarda gizli pencerede) açın.
2. Birinden yeni bir kayıt ekleyin.
3. Diğerinde 1–3 saniye içinde belirmelidir. 🎉

---

## Günlük kullanım ve bilmeniz gerekenler

- **Geri al:** "Son işlemi geri al" yalnızca **sizin yaptığınız son işlemi** geri alır, başkalarının işlemlerine dokunmaz.
- **Aynı kaydı aynı anda iki kişi değiştirirse** sonradan kaydeden geçerli olur. Birine tahsilat girerken başkası da girerse tutarlar çakışabilir; bu yüzden bir kayıt üzerinde işlem yapmadan önce ekranın **● CANLI** olduğuna bakın.
- **Tüm defteri sil:** Herkes için siler. Güvenlik için ekrana **SIL** yazmanız istenir.
- **JSON yükle:** Yedek dosyasındaki kayıtları defterdekilerle **birleştirir**, mevcut kayıtları silmez.
- **Bu cihazı defterden ayır:** Ayarlar'daki bu buton sadece o cihazın bağlantısını koparır, defter silinmez.
- **Bağlantı kötü ellere geçtiyse:** Bağlantıyı iptal etmenin yolu yeni bir defter açıp verileri taşımaktır. Gerekirse bunu birlikte yaparız, yazmanız yeter.

---

## Bir şey ters giderse

| Ekranda gördüğünüz | Ne yapmalı |
|---|---|
| "Ortak defter henüz kurulmadı" | `firebase-config.js` GitHub'a yüklenmemiş. ADIM 5'i tekrarlayın, 2 dakika bekleyip sayfayı tam yenileyin. |
| **● HATA – izin yok** | ADIM 3'teki yeni kurallar yayınlanmamış. Rules sekmesine gidip yeniden yapıştırıp **Publish** deyin. |
| **● HATA – Anonim giriş açık değil** | ADIM 1'i yapın (Anonymous → Enable → Save). |
| **● ÇEVRİMDIŞI** | İnternet yok. Bağlantı gelince otomatik düzelir. |
| **● BAĞLANIYOR** uzun sürüyor | İnterneti kontrol edin, sayfayı yenileyin. |
| Değişiklikler başkalarında görünmüyor | Başlıkta **● CANLI** yazıyor mu bakın. Değilse yukarıdaki satırlara bakın. |
| Eski görünüm geliyor | `Ctrl + Shift + R` yapın, telefonda sekmeyi kapatıp açın. Hâlâ eskiyse bize bildirin (önbellek dosyası `sw.js` güncellenecek). |
| Yeni katılan biri boş defter görüyor | Bağlantının **tamamını** (`#d=...` ile birlikte) açtığından emin olun. |

Takıldığınız adımın **ekran görüntüsünü** ve ekranda yazan **hata mesajını** gönderirseniz birlikte çözeriz.
