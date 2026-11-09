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
- Aynı anda farklı kişiler farklı kayıtlar girse bile birbirini bozmaz. Aynı kayda aynı anda tahsilat girseler bile tutarlar **toplanır**, üst üste yazılmaz.
- İnternet kesilirse uygulama çalışmaya devam eder; işlemler cihazda bekler, internet gelince **otomatik gönderilir.**
- Başlıktaki yazıdan durumu görürsünüz: **● CANLI** (her şey eşit), **● BAĞLANIYOR**, **● ÇEVRİMDIŞI**, **● HATA**.

**Cihaza özel (herkesin kendine ait) olanlar:** tema, karanlık mod, PIN kilidi, hatırlatma ayarları.
**Ortak olanlar:** tüm kayıtlar, firma adı/telefon/adres/vergi no, logo.

> ⚠️ **Güvenlik:** Bağlantı, defterin şifresi gibidir. Bağlantıyı bilen herkes her şeyi görür ve değiştirir. Bağlantıyı **sadece güvendiğiniz kişilere** verin. Silinen kayıtlar buluttan gerçekten silinmez (Silinenler kutusuna gider), yine de düzenli **JSON yedek** almanız önerilir (Ayarlar → JSON indir).

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
      allow read, delete: if girisli() && koleksiyon in ['kayitlar', 'ayar', 'aktif', 'cihaz'];
      allow create, update: if girisli() && koleksiyon in ['kayitlar', 'ayar', 'aktif', 'cihaz'] && gecerliVeri();
    }
  }
}
```

4. **Publish (Yayınla)** butonuna basın.

## ADIM 4 – Giriş için site adresinize izin verin

1. Authentication sayfasında **Settings (Ayarlar)** sekmesine gidin.
2. **Authorized domains (Yetkili alanlar)** bölümünde `dunyaambalaj.github.io` yoksa **Add domain** deyip yazın ve ekleyin.

## ADIM 5 – Dosyaları GitHub'a yükleyin

Bu rehberle birlikte **4 dosya** geldi: `index.html`, `sw.js`, `firebase-config.js`, `PAYLASIM_KURULUM.md`.

> 🔑 **`sw.js` çok önemli.** Telefon ve tarayıcılar siteyi hızlı açmak için eski sürümü saklar. Yeni `sw.js` bunu düzeltir: artık her açılışta en güncel sürüm alınır, internet yoksa saklanan sürüm kullanılır.

1. https://github.com/dunyaambalaj/tahsilat-defteri adresine gidin ve giriş yapın.
2. Sağ üstteki **Add file** → **Upload files** seçin.
3. **Dört dosyayı** sayfaya sürükleyin (aynı isimli dosyaların üzerine yazılır).
4. Aşağıdaki **Commit changes** (yeşil buton) deyin.

> ⚠️ Depoda `manifest.json` ve `icon.svg` dosyaları **kalmalı**, onlara dokunmayın.

GitHub'ın siteyi yenilemesi **1–2 dakika** sürer. Siteniz zaten yayında olduğu için **Settings → Pages** ayarına dokunmanız gerekmez.

## ADIM 5b – Yeni sürümün açıldığından emin olun

Yeni sürüm açılınca başlıkta **ÖDEME DEFTERİ · ● CANLI** (veya ● BAĞLANIYOR) yazısını ya da **"Ortak defter"** karşılama ekranını görürsünüz.
**Bunları görmüyorsanız hâlâ eski sürüm açılıyor demektir.**

### Hızlı test (30 saniye)
Adres çubuğuna şunu yazıp açın (sonundaki `?yeni=1` önemli):

`https://dunyaambalaj.github.io/tahsilat-defteri/?yeni=1`

- Bu adreste başlıkta **ÖDEME DEFTERİ · ● ...** yazısı görünüyorsa yeni sürüm yüklenmiş demektir, sorun sadece telefonun/tarayıcının saklayıp durduğu **eski kopyadır.** Aşağıdaki "Sırayla deneyin" adımlarını uygulayın ya da bu adresi kullanmaya devam edin.
- Bu adreste de **yazı yoksa** GitHub'a yeni `index.html` yüklenmemiş demektir. ADIM 5'i tekrarlayın (yükledikten sonra GitHub'da `index.html` dosyasını açıp "Commit" tarihinin bugün olduğunu kontrol edin).

### Başlıktaki yazı ne anlama gelir?
| Yazı | Anlamı |
|---|---|
| ● CANLI (yeşil) | Her şey tamam, veriler tüm cihazlarla eşit. |
| ● BAĞLANIYOR | Bağlanılıyor, birkaç saniye bekleyin. |
| ● ÇEVRİMDIŞI | İnternet yok. Gelince otomatik eşitlenir. |
| ● HATA | Bir sorun var. Yazıya dokunun, **"Bağlantı tanısı"** nedenini yazar. |
| ● BAĞLI DEĞİL | Bu cihaz henüz bir defterle bağlı değil. Karşılama ekranından defter oluşturun ya da bağlantıyla katılın. |
| ● YEREL (bulut ayarı yok) | Firebase ayarı okunamadı. |

**Başlıktaki yazıya dokunursanız** bağlantı penceresi açılır: durum, defter bağlantısı, kopyala/WhatsApp ve **"Bağlantı tanısı"** (hangi adımın takıldığını gösterir). Sorun olursa bu pencerenin ekran görüntüsünü gönderin.

### Sırayla deneyin

1. **Önce yedek alın:** eski ekranda Ayarlar → **JSON indir.** (Kayıtlarınız tarayıcıda durur, aşağıdaki adımlar silmez ama yedek her zaman iyidir.)
2. GitHub'a `sw.js` dosyasını yüklediğinizden emin olun, 2 dakika bekleyin.
3. Siteyi açık tutan **tüm sekmeleri ve ana ekran uygulamasını tamamen kapatın** (telefonda uygulama ekranını yukarı kaydırıp kapatın).
4. Siteyi yeniden açın. **Bir kez daha kapatıp açın** (ilk açılışta yeni dosya arka planda yüklenir, ikincisinde görünür).
5. Bilgisayarda: `Ctrl + Shift + R` ile sert yenileme yapın.

> ⛔ Tarayıcı ayarlarından "site verilerini temizle" **yapmayın**, kayıtlarınız silinir.

## ADIM 6 – İlk defteri oluşturun (sadece 1 kişi, 1 kez)

**Bunu defteri şu ana kadar kullanan kişi yapsın** (verileri bu cihazdadır).

1. https://dunyaambalaj.github.io/tahsilat-defteri/ adresini açın.
   Eski görünüm gelirse sayfayı tam yenileyin: bilgisayarda `Ctrl + Shift + R`, telefonda sekmeyi kapatıp tekrar açın.
2. **"Ortak defter"** karşılama ekranı gelir.
3. **Yeni ortak defter oluştur** butonuna basın.
   Bu cihazda daha önce girdiğiniz kayıtlar varsa ekranda "X kayıt aktarılacak" yazar ve **hepsi otomatik buluta taşınır.**
4. Birkaç saniye içinde başlıkta **● CANLI** yazısı çıkar.

## ADIM 7 – Bağlantıyı herkese gönderin

Defter ilk oluşunca bağlantı penceresi **kendiliğinden açılır.** Sonradan bağlantıya ulaşmanın iki yolu var:

- Başlıktaki **● CANLI** yazısına dokunun, ya da
- Sağ üstten **Ayarlar** (dişli simgesi) → **"Ortak defter"** bölümü.

Oradan **Bağlantıyı kopyala** ya da **WhatsApp** butonuna basın.
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
- **Aynı kaydı aynı anda iki kişi düzenlerse** (form ile) sonradan kaydeden geçerli olur. Bunu önlemek için kayıt kartında ve pencerede **"✎ Ahmet düzenliyor"** uyarısı çıkar. Tahsilat ve erteleme işlemleri ise çakışmaz.
- **Tüm defteri sil:** Herkes için siler. Silme PIN'i varsa PIN, ardından ekrana **SIL** yazmanız istenir. Silinenler **Silinenler kutusundan** geri getirilebilir.
- **JSON yükle:** Yedek dosyasındaki kayıtları defterdekilerle **birleştirir**, mevcut kayıtları silmez.
- **Bu cihazı defterden ayır:** Ayarlar'daki bu buton sadece o cihazın bağlantısını koparır, defter silinmez.
- **Bağlantı kötü ellere geçtiyse:** Bağlantıyı iptal etmenin yolu yeni bir defter açıp verileri taşımaktır. Gerekirse bunu birlikte yaparız, yazmanız yeter.

---

## YENİ ÖZELLİKLER (Sürüm 5)

### Güncelleme için yapılacaklar (3 adım)
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin (ADIM 5'teki gibi: Add file → Upload files → Commit changes).
2. Firebase → Firestore Database → **Rules** sekmesinde kuralları ADIM 3'teki **yeni halleriyle** değiştirip **Publish** deyin. (Tek fark: listeye `'aktif'` eklendi. Bunu yapmazsanız her şey çalışır, yalnızca "✎ kim düzenliyor" göstergesi çalışmaz.)
3. Siteyi tamamen kapatıp açın (2 kez). Karşınıza **"Adınız"** penceresi gelir.

### 1) Kim yaptı?
- Her cihaz ilk açılışta **adını** sorar (örn. Ahmet). E-posta gerekmez. Adı Ayarlar → **Kullanıcı adı** bölümünden değiştirebilirsiniz.
- Her kayıtta **"Ekleyen / Son işlem"**, hareket geçmişinde her satırda **kimin yaptığı ve saati** görünür.
- Bu güncellemeden **önce** girilen kayıtlarda ekleyen bilgisi yoktur, yalnızca yeni işlemler damgalanır.

### 2) Tahsilat çakışması
İki kişi aynı kayda aynı anda tahsilat girerse tutarlar **toplanır** (örn. 300 + 450 = 750). Erteleme de aynı şekilde güvenlidir. İnternet yokken yapılan işlemler cihazda saklanır ve bağlantı gelince gönderilir; bu durumda aynı anda başka biri de işlem yaptıysa sonradan gönderilen geçerli olabilir.

### 3) Silinenler kutusu
Ayarlar → **Silinenler kutusu**. Silinen kayıtlar kim sildi ve ne zaman bilgisiyle listelenir; **Geri getir** ya da **Tümünü geri getir** ile döndürülür.

### 5) Silme PIN'i
Ayarlar → **Silme PIN'i belirle** (4-8 rakam). Bundan sonra kayıt silmek ve tüm defteri silmek için bu PIN istenir. **Tüm cihazlar için ortaktır;** PIN'i çalışanlarınızdan silme yetkisi olanlara söyleyin.
> ⚠️ Bu PIN uygulama içi bir kilittir. Bağlantıyı bilen ama PIN'i bilmeyen kişinin yanlışlıkla ya da kolayca silmesini engeller. Teknik bilgisi olan kötü niyetli biri için tam koruma sağlamaz; bu yüzden bağlantıyı yalnızca güvendiğiniz kişilerle paylaşın.

### 8) Canlı işlem uyarısı
Başkası kayıt, tahsilat, erteleme ya da silme yaptığında ekranın altında kısa bir uyarı çıkar: **"Ayşe tahsilat girdi: Mehmet Kırtasiye · 450,00 ₺"**. Aynı anda çok işlem olursa tek uyarıda toplanır.

### 9) Kim düzenliyor?
Biri bir kaydı düzenlerken, tahsil ederken ya da ertelerken diğer kişilerde o kayıtta **"✎ Ahmet"** etiketi ve pencerede uyarı bandı görünür. Pencere kapanınca ya da yaklaşık 1 dakika işlem olmazsa uyarı kalkar.

### 10) Telefon bildirimi
**Yapılan:** Ayarlar → Bildirimler → **Canlı işlem bildirimi** açılırsa, uygulama **arka plandayken** (küçültülmüş, başka sekmedeyken ya da ekran kilitliyken tarayıcı canlı kalıyorsa) başkasının işlemi için sistem bildirimi gelir.

**Yapılamayan:** Uygulama **tamamen kapalıyken** bildirim göndermek için bir **sunucu** gerekir (Firebase Cloud Functions). Bu, Firebase'in **ücretli (Blaze) planını** ve kurulumda komut satırı kullanımını gerektirir; yalnızca github.com ile yapılamaz. İsterseniz bunu ayrı bir adım olarak planlayabiliriz.
iPhone'da bildirimin çalışması için uygulamanın **Ana Ekrana eklenmiş** olması gerekir ve arka plan davranışı Android'e göre daha sınırlıdır.

---

## PRESTİJ CAM GÖRÜNÜMÜ VE TAKVİM (Sürüm 7)

### Güncelleme için yapılacaklar
1. GitHub'a **`index.html`**, **`sw.js`** ve **`manifest.json`** dosyalarını yükleyin (Add file → Upload files → Commit changes). Firebase tarafında **yeni bir ayar gerekmez.**
2. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b).

### Görünüm: zümrüt deri + altın, üzerinde iPhone'un "Liquid Glass" camı
- Orijinal **zümrüt-altın-krem** paleti korunur; üzerine yarı saydam cam yüzeyler, parlak altın kenarlar ve arkadaki ışığı süzen bulanıklık gelir.
- **Üst çubuk** zümrüt cam, altın çizgili. **Alt menü** ekranın altında yüzen cam hap; seçili sekmenin altında **kayan cam mercek** bulunur.
- Bilgisayarda menü üst çubukta, ortada cam bir hap içindedir.
- Menüler arası geçişte içerik kayarak gelir; kartlar sırayla yükselir.
- Pencereler (kayıt, ayarlar, paylaşım) ekrandan hafif içeride, büyük cam yaprak olarak açılır.
- **Temalar ilk haline döndü:** Deri Yeşil, Lacivert, Kahve, Bordo. Her temanın camı kendi renginden ışık alır. Karanlık mod da cam görünümlüdür.

### Görsel paylaşım
Paylaşım menüsünde artık **yalnızca görsel** vardır: **Görseli paylaş** (WhatsApp ve diğer uygulamalara doğrudan görsel gönderir), **PNG indir** ve **Görseli aç**. WhatsApp metin paylaşımı ve "Metni kopyala" kaldırıldı.
> Telefon tarayıcısı dosya paylaşmayı desteklemiyorsa "Görseli paylaş" görseli indirir; WhatsApp'ta ataç simgesiyle eklersiniz.

### Takvim: Gün · Hafta · Ay
Takvim sekmesinin üstündeki **Gün / Hafta / Ay** düğmesiyle görünüm değişir. Her görünümde üstte üç özet kutusu vardır:
- **Planlı** (mavi): vadesi o döneme denk gelen, henüz tahsil edilmemiş tutar
- **Tahsil edilen** (yeşil): o dönemde gerçekten alınan tutar
- **Geciken** (kırmızı): vadesi geçmiş ve hâlâ ödenmemiş tutar

| Görünüm | Ne gösterir |
|---|---|
| **Ay** | Ay takvimi. Her günde mavi/yeşil/kırmızı nokta, geniş ekranda tutarlar (örn. `31,7B` = 31,7 bin ₺). Bir güne dokununca altında o günün planlı ödemeleri ve tahsilatları açılır. |
| **Hafta** | Haftanın 7 günü ve her günün altında o günün planlı ödemeleri ile yapılan tahsilatları. |
| **Gün** | Seçili günün planlı ödeme kartları (Tahsil et / Ertele düğmeleriyle) ve o gün yapılan tahsilatlar, bu günden ertelenenler. |

**Bugün** düğmesi bugüne döner, **‹ ›** düğmeleri gün/hafta/ay ilerletir. Listedeki bir satıra dokunmak kaydın detayını açar.

> ℹ️ **Eski tahsilatlar:** Bu güncellemeden önce yapılan tahsilatlarda yalnızca toplam tutar ve tahsil tarihi bilindiği için, kısmi ödemeler tek hareket olarak **son tahsil tarihine** yazılır. Yeni yapılan her tahsilat kendi gününe ve kendi tutarıyla işlenir.

## SÜRÜM 8: Eski görünüm · Otomatik erteleme · Ertelenen sınıfı · Bağlı cihazlar

### Güncelleme için yapılacaklar (3 adım)
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin.
2. Firebase → Firestore Database → **Rules** sekmesinde kuralları ADIM 3'teki **yeni halleriyle** değiştirip **Publish** deyin. (Tek fark: listeye `'cihaz'` eklendi. Yapmazsanız her şey çalışır, yalnızca **bağlı cihazlar listesi** boş kalır.)
3. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b).

### Eski görünüme dönüş
Ayarlar → **Görünüm stili**:
- **✦ Cam (yeni):** iPhone camı, yüzen menü, büyük başlıklar.
- **📒 Klasik defter (eski):** ilk tasarım. Zümrüt deri üst çubuk, kağıt çizgili sayfa, alttaki menü, damga etiketleri.

Bu seçim yalnızca o cihazı etkiler (tema ve karanlık mod gibi). Klasik görünümde de yeni özelliklerin hepsi (takvim, ertelenen sınıfı, cihaz listesi) çalışır. Temalar (Deri Yeşil, Lacivert, Kahve, Bordo) iki görünümde de geçerlidir.

### Otomatik erteleme
Vade gününde **tahsil edilmeyen** kayıt, ertesi gün **kendiliğinden bugüne ertelenir.**
- Siteyi açtığınızda, sayfa açıkken de her 5 dakikada bir ve uygulamaya geri dönüldüğünde kontrol edilir.
- Kayıtta **ilk vade** korunur; geçmişe **"Otomatik · Sistem"** olarak yazılır ve kaç kez ertelendiği artar.
- **Birkaç cihaz aynı anda açık olsa da** kayıt yalnızca **bir kez** ertelenir.
- Otomatik işlemler **"Geri al" listesine girmez** ve diğer kişilere "Sistem erteledi" uyarısı göndermez. Yapıldığında siteyi açan kişi "↻ N tahsilat bugüne ertelendi" uyarısını görür.
- Kısmen tahsil edilmiş kayıtların **kalan** tutarı ertelenir. Tamamen tahsil edilmiş kayıtlara dokunulmaz.
- İnternet yoksa işlem, bağlantı gelince ve defter eşitlendikten sonra yapılır.

> ℹ️ Bundan dolayı **"Geciken"** bölümü artık neredeyse hiç dolmaz; vadesi geçenler **"Ertelenen tahsilatlar"** bölümüne geçer. Aynı kayıt her gün tahsil edilmezse ertelenme sayısı her gün 1 artar.

### Ertelenen tahsilatlar ayrı sınıfta
- **Özet:** "Bugün tahsil edilecekler" yalnızca hiç ertelenmemiş kayıtları gösterir. Ertelenenler altında ayrı **↻ Ertelenen tahsilatlar** bölümünde, kehribar çerçeveli kartlarda ve **"↻ 2. erteleme · oto"** etiketiyle çıkar. Kartta **ilk vade** de yazar.
- **Defter:** seçili günün listesi **Tahsilatlar** ve **Ertelenen tahsilatlar** diye iki gruba ayrılır.
- **Takvim:** üstteki kutular **Planlı · Ertelenen · Tahsil edilen** olur. Ertelenenler takvimde **kehribar nokta** ve **↻** tutarıyla işaretlenir; Gün/Hafta görünümünde ayrı başlık altında listelenir.
- **Hatırlatma (zil):** "Ertelenen tahsilatlar" ayrı bir bölümdür.

### Bağlı cihazlar
- Başlıkta **● CANLI · 3 cihaz** yazısı çıkar (şu an çevrimiçi cihaz sayısı).
- **Ayarlar → Bağlı cihazlar** (ve başlıktaki yazıya dokununca açılan pencere) tüm cihazları **isimleriyle** listeler: kullanıcı adı, cihaz türü (örn. *iPhone · Safari*, *Android · Chrome (uygulama)*), **şu an çevrimiçi** ya da **son görülme 3 sa önce** ve **Bu cihaz** etiketi.
- Çevrimiçi sayılma süresi yaklaşık **100 saniyedir**; uygulamayı kapatan ya da arka plana atan cihaz kısa sürede çevrimdışı görünür.
- Kullanılmayan eski cihazı çevrimdışı satırdaki **Kaldır** düğmesiyle listeden silebilirsiniz (cihaz tekrar açılırsa kendiliğinden yeniden görünür).
- Cihazın adı, o cihazdaki **Kullanıcı adı** ayarından gelir. Adı girilmemişse **"Adsız"** görünür.

## SÜRÜM 9: Güvenilirlik puanı · Aktivite akışı · Aylık hedef · Cihazı çıkar / Bağlantıyı yenile

### Güncelleme için yapılacaklar
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin.
2. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b).
**Firebase tarafında yeni bir ayar ya da kural değişikliği gerekmez.**

### Müşteri güvenilirlik puanı (★)
Her müşteriye 1-5 arası, yarım yıldızlı puan verilir. Müşteri listesinde, müşteri sayfasında (ayrıntılı panelle) ve riskli müşterinin kartında (**⚠ Riskli** / **★ Dikkatli** çipi) görünür.
- **Ortalama gecikme:** ödeme, **ilk vadeye** göre kaç gün geç geldi (ertelenmiş olsa bile ilk vade esas alınır). Hâlâ ödenmemiş ve ilk vadesi geçmiş kayıtlar da bekledikleri gün kadar sayılır.
- **Erteleme sıklığı:** kayıt başına ortalama erteleme.
- **Zamanında ödeme oranı:** ilk vadeden en çok 1 gün sonra ödenenler.
- Puan: 5 ★'dan başlar. Ortalama gecikme 2 / 4 / 8 / 15 günü aştıkça düşer, kayıt başına erteleme 0,5 / 1 / 2'yi aştıkça düşer, 30 günden eski açık borç varsa biraz daha düşer.
- **4,5+ Çok güvenilir · 3,5+ Güvenilir · 2,5+ Dikkatli · altı Riskli.** Müşterinin **en az 2 kaydı** yoksa "Yeni müşteri" yazar, puan verilmez.
> Puan bir **yardımcı göstergedir**; son kararı siz verirsiniz.

### Aktivite akışı
- **Özet** ekranının altında **Son hareketler** (son 6) ve **Aktivite akışının tamamı** düğmesi vardır.
- Akışta kim, ne zaman, hangi müşteriye ne yaptı zaman sırasıyla görünür: yeni kayıt, düzenleme, tahsilat, kısmi tahsilat, erteleme (**Sistem** otomatik ertelemeleri dahil), silme. Üstte **bugünün özeti** (yeni kayıt, tahsilat tutarı, ertelenen) bulunur.
- **Bugün / Son 7 gün / Tümü** ve **kişiye göre** filtre vardır. Satıra dokunmak kaydı açar.
- "Kim yaptı" bilgisi **sürüm 5'ten önce** yapılan işlemlerde yoktur ("Biri" yazar).

### Aylık tahsilat hedefi
- **Özet** ekranında **Ayarlar → Aylık tahsilat hedefi** ya da karttaki **"Aylık tahsilat hedefi belirle"** düğmesiyle tutar girilir. Hedef **her ay** geçerlidir ve **tüm cihazlarda ortaktır.**
- Kart şunları gösterir: bu ay alınan / hedef, ilerleme çubuğu ve **%**, **kalan** tutar, kalan günde **günlük gereken** tutar, **ay sonuna kadar beklenen toplam** (alınan + ay sonuna kadar vadesi gelen açık tutarlar) ve **geçen ay** toplamı. Hedef aşılırsa "🎉 Hedef tamamlandı" yazar.
- **Bugün tahsil** ve **Bu ay tahsil** kutuları artık gerçek **tahsilat hareketlerinden** hesaplanır (takvim ve hedefle aynı kaynak). Eski sürümde gördüğünüz rakamdan farklı çıkabilir.

### Cihazı uzaktan çıkar
**Ayarlar → Bağlı cihazlar** listesinde her cihazın yanında **Çıkar** düğmesi vardır.
- Çıkarılan cihaz **açıksa hemen**, kapalıysa **açıldığında** "Bu cihaz defterden çıkarıldı" ekranını görür; cihazdaki defter kodu ve defter verisi silinir.
- Yetki PIN'i belirlediyseniz çıkarırken PIN istenir.
- ⚠️ Çıkarılan kişi **bağlantıyı bildiği için yeniden katılabilir.** Tamamen engellemek için hemen ardından **Bağlantıyı yenile**'yi kullanın (çıkarma sonrası sizi buna yönlendirir).

### Bağlantıyı yenile (eskisini kapat)
**Ayarlar → Ortak defter → 🔒 Bağlantıyı yenile.** Bağlantı kötü ellere geçtiyse ya da biri çıkarıldıysa kullanın.
1. Defter **yeni bir gizli koda taşınır:** tüm kayıtlar ve ayarlar kopyalanır, sayılıp **doğrulanır.**
2. **Eski defter boşaltılır**, geriye yalnızca "kapalı" işareti kalır. Eski bağlantıyı açan biri boş defter görür.
3. Eski bağlantıdaki **diğer cihazlar** "Defter bağlantısı yenilendi" ekranını görür. **Yeni bağlantıyı siz (Ayarlar'dan kopyalayıp) güvendiğiniz kişilere gönderirsiniz.**
4. Siz otomatik olarak yeni bağlantıya geçersiniz; bağlantı penceresi açılır.
- Silme PIN'i varsa istenir; ayrıca ekrana **YENILE** yazmanız gerekir.
- **İşlem sırasında kimse kayıt girmesin** (birkaç saniye sürer). Doğrulama başarısız olursa **hiçbir şey değişmez**, eski bağlantı çalışmaya devam eder.
- Yenilemeden önce **JSON yedek** almanız önerilir.
- Yeni bağlantıyla katılan kişiler adlarını yeniden girer; cihaz listesi yeniden oluşur.

## SÜRÜM 10: Sabit + düğmesi · Mesai saatleri · Yetkili PIN'i · WhatsApp şablonları

### Güncelleme için yapılacaklar
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin.
2. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b).
**Firebase tarafında yeni bir ayar ya da kural değişikliği gerekmez.**

### Ödeme ekleme (+) düğmesi
Cam görünümde **+** düğmesi ekrana sabitlenmemiş, sayfanın en altında kalıyordu. Düzeltildi: eski defterdeki gibi **ekranın sağ altında sabit** durur, kaydırınca yerinde kalır, alttaki menüyle çakışmaz. Ödeme formunda taşan tarih kutuları da düzeltildi.

### Mesai saatleri
**Ayarlar → Yönetim ayarları → 🕘 Mesai saatleri.** Mesai günlerini (örn. Pzt–Cmt), başlangıç ve bitiş saatini seçip **Mesai kısıtı: Açık** yapın.
- **Tahsilat yalnızca mesai gün ve saatinde işlenebilir.** Mesai dışında **Tahsil** düğmesi "Mesai dışı… Sonraki mesai: Pazartesi 09:00" uyarısı verir. Yetki PIN'i tanımlıysa **yetkili kişi PIN'ini girerek** mesai dışında da işlem yapabilir (10 dakika geçerli).
- **Otomatik erteleme mesai gününe göre çalışır:** Cumartesi tahsil edilmeyen kayıt, Pazar mesai günü değilse **Pazartesi'ye** devredilir. Aynı şekilde Pazar günü vadeli kayıtlar da Pazartesi'ye geçer. Geçmişe "Otomatik: mesai günü değil" yazılır.
- **Elle erteleme** sırasında mesai günü olmayan bir gün seçerseniz kayıt otomatik olarak **sonraki mesai gününe** alınır ve uyarı çıkar.
- Takvimde **mesai günü olmayan günler soluk** görünür. Mesai dışındayken Özet'te "🕘 Mesai dışı · sonraki mesai: …" uyarısı çıkar.
- Mesai tanımlı değilse hiçbir kısıt yoktur, önceki gibi her gün bugüne devredilir. Ayar **tüm cihazlarda ortaktır**; saat olarak cihazın saati esas alınır.

### Yetki PIN'i (yetkili kişi)
Eski "Silme PIN'i" artık **Yetki PIN'i** oldu. PIN belirlendiğinde şunlar **yalnızca PIN'i bilen yetkili kişiye** açılır:
- Kayıt silme, tüm defteri silme, silinenleri temizleme
- **Aylık tahsilat hedefini** belirleme/değiştirme
- **Mesai saatlerini** değiştirme
- **WhatsApp şablonlarını** ekleme/düzenleme/silme
- Mesai dışında tahsilat işleme
- Cihaz çıkarma ve bağlantıyı yenileme
Ayar ekranlarında PIN bir kez girilince **5 dakika** boyunca tekrar sorulmaz. **Diğer kullanıcılar bu ayarları değiştiremez.** PIN belirlenmediyse bu ayarları herkes değiştirebilir; bu yüzden önce **Ayarlar → Yetki PIN'i belirle**'yi yapmanız önerilir.
> ⚠️ PIN uygulama içi bir kilittir. Teknik bilgisi olan kötü niyetli biri için tam koruma değildir; bağlantıyı yalnızca güvendiğiniz kişilerle paylaşın.

### Aylık tahsilat hedefi
Hedef **yalnızca Ayarlar → Yönetim ayarları → 🎯 Aylık tahsilat hedefi** üzerinden belirlenir (yetkili). Özet'teki **"hedef belirle" kartı kaldırıldı**; hedef tanımlıysa Özet'te yalnızca ilerleme kartı görünür.

### WhatsApp mesaj şablonları
- Kart, kayıt detayı ve müşteri sayfasındaki **WhatsApp** düğmesine basınca artık hazır mesaj gitmez; **şablon seçici** açılır: şablonu seçin, mesajı gerekirse düzenleyin, telefonu kontrol edin, **WhatsApp'ta aç** deyin. Kayıt ertelenmişse "Ertelenen ödeme bildirimi", kısmi ödemeliyse "Kısmi ödeme bildirimi", bugün vadeliyse "Bugün vadesi geldi" otomatik seçilir.
- **6 hazır şablon:** Vade hatırlatma ★, Bugün vadesi geldi, Ertelenen ödeme bildirimi, Kısmi ödeme bildirimi, Ödeme alındı / teşekkür, Bakiye bildirimi.
- **Şablon yönetimi (yetkili):** Ayarlar → Yönetim ayarları → 💬 WhatsApp mesaj şablonları. Yeni şablon ekleyin, düzenleyin, silin, **★ varsayılan** yapın, **varsayılanlara dönün**. Şablonlar **tüm cihazlarda ortaktır.**
- **Değişkenler** (düzenlerken dokunarak ekleyebilirsiniz, altta örnek önizleme görünür): `{musteri}` `{tutar}` `{kalan}` `{vade}` `{ilkvade}` `{tur}` `{belge}` `{erteleme}` `{bakiye}` `{firma}` `{tarih}` `{kisi}`
- ★ varsayılan şablon, **zil ekranındaki toplu hatırlatmalarda** (tek dokunuşla gönderim) kullanılır.

## SÜRÜM 11: Yönetici paneli · Çoklu defter · Tüm bildirimler · Yüzen + düğmesi

### Güncelleme için yapılacaklar
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin.
2. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b).
**Firebase tarafında yeni bir ayar ya da kural değişikliği gerekmez.**

### Yüzen + (ödeme ekleme) düğmesi
Cam görünümde **yüzen altın cam bir daire**: ekranın sağ altında sabit durur, hafifçe süzülür, basınca büyür. Kaydırınca yerinde kalır, alttaki menüyle çakışmaz. Klasik görünümde eski kare düğme aynen durur.

### Yönetici paneli
**Ayarlar → 🛡 Yönetici paneli.** İlk açışta **yönetici şifresini belirlersiniz** (en az 6 karakter; harf+rakam karışık uzun şifre önerilir). Sonrasında panele **yalnızca şifreyle** girilir; oturum **10 dakika** açık kalır, **Kilitle** düğmesiyle hemen kapatılır.
> ⚠️ Şifreyi **defteri kurduktan hemen sonra yönetici belirlemelidir**; belirlenene kadar panel herkese açıktır.

Yöneticinin yapması gereken **tüm ayarlar artık panelin içinde**, normal Ayarlar'dan kalktı:
- **Defterlerim** (çoklu defter, aşağıda)
- **Firma bilgileri** ve logo
- **Aylık tahsilat hedefi**, **mesai saatleri**, **WhatsApp mesaj şablonları**
- **↻ Otomatik erteleme açık/kapalı** (yeni)
- **Erişim ve güvenlik:** bağlı cihazlar ve **Çıkar**, **bağlantıyı yenile**, **yönetici şifresini değiştir**
- **Silinenler kutusu**, **JSON/CSV yedek ve yükleme**
- **Tehlikeli bölge:** tüm defteri sil

Normal Ayarlar'da kalanlar: görünüm (tema, karanlık mod, cam/klasik), bildirim tercihleri, kullanıcı adı, bağlı cihaz **listesi** (yalnızca görüntüleme), ortak defter bağlantısı, cihaz kilidi, son işlemi geri al.
- Yönetici oturumu açıkken **kayıt silme şifre sormaz**; oturum kapalıyken her silmede şifre istenir.
- Defteri **oluşturan cihazda** panelde **"Şifreyi sıfırla"** düğmesi de bulunur (şifre unutulursa tek çıkış yolu; başka cihazlarda yoktur).
- Eski sürümde belirlediğiniz **Yetki PIN'i aynen çalışır** ve panele ilk girişinizde otomatik olarak daha güçlü saklamaya yükseltilir.

### Diğer defterleri görüntüleyip yönetme (çoklu defter)
Panelin **Defterlerim** bölümünde yönetici şifresiyle girdiğinizde **tüm defterlerinizi** görürsünüz: her biri için kayıt sayısı, açık bakiye, bugün tahsil, ertelenen ve son işlem; üstte **tüm defterlerin toplamı**.
- **Aç ve yönet:** o deftere geçer (cihaz o defterin koduna bağlanır); orada da aynı şifreyle yönetici paneline girersiniz.
- **＋ Yeni defter:** adını yazın (örn. *Şube 2*); boş defter oluşturulur, **aynı yönetici şifresi** otomatik uygulanır.
- **🔗 Mevcut defteri ekle:** başka bir defterin bağlantısını yapıştırın. **O defterin yönetici şifresi sizinkiyle aynı yapılır** (diğer ayarları korunur).
- **Adı değiştir**, **Listeden çıkar** (defterin kendisi silinmez).
- **Yönetici şifresini değiştirirseniz** tüm defterlerdeki şifre ve kasa birlikte güncellenir.
- **Güvenlik:** defter listesi ve bağlantıları yönetici şifrenizle **şifrelenerek (AES-256-GCM)** saklanır. Çalışanlar diğer defterlerin bağlantısını göremez; çözmek için şifre gerekir.
> ⚠️ Bu koruma **şifrenizin gücüne bağlıdır.** Kısa bir şifreyi teknik bilgisi olan biri kaba kuvvetle deneyebilir. **8+ karakterli, harf ve rakam karışık** bir şifre kullanın. Her defterde farklı kişiler çalışıyorsa bile yönetici şifresi yalnızca sizde olmalıdır.

### Bildirimler: tüm işlemler
Zil düğmesi artık **Bildirimler** ekranını açar (ve rozet **okunmamış bildirim sayısını** gösterir):
- **Hareketler:** **Eklenen, Tahsil edilen, Silinen, Düzenlenen, Ertelenen (otomatik dahil), Geri getirilen** tüm işlemler kim yaptı, hangi müşteri, ne kadar bilgisiyle zaman sırasıyla listelenir; türe göre filtrelenir. Okunmamışlar ● ile işaretlenir.
- **🔔 Hatırlatmalar** düğmesi vadesi gelen / geciken / ertelenen listesini açar (eski bildirim ekranı).
- **Canlı uyarılar:** başkası bir işlem yapınca ekranda uyarı çıkar, **uygulama arka plandayken** Ayarlar → Canlı işlem bildirimi açıksa sistem bildirimi gelir. Örnekler: *"Ayşe yeni tahsilat ekledi: …"*, *"Ahmet tahsil etti: … · 5.000 ₺"*, *"Mehmet tahsilatı sildi: …"*, *"Sistem otomatik erteledi: …"*, *"… silinen kaydı geri getirdi"*.
- **Ayarlar → Bildirim türleri:** hangi türlerde uyarı alacağınızı bu cihaz için seçersiniz (bildirim ekranında hepsi yine listelenir).
- Silme ve geri getirme artık geçmişe **kim, ne zaman** bilgisiyle yazılır. Bu özellikten önce silinenlerde "kim sildi" bilgisi olmayabilir.

## SÜRÜM 12: Alt menüde ortada sabit + · Hatırlatma düzeltmesi · Görsel paylaşım · Yeni temalar

### Güncelleme için yapılacaklar
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin.
2. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b).
**Firebase tarafında yeni bir ayar ya da kural değişikliği gerekmez.**

### Alt menüde ortada sabit + (tahsilat ekleme)
- **+** düğmesi artık **alt menünün tam ortasında**, iki sekme solunda iki sekme sağında durur: **Özet · Defter · + · Takvim · Müşteri**. Hangi ekrana geçerseniz geçin **kaybolmaz**, ekranlar arası geçişte yerinde durur.
- **Rapor**, Müşteri sekmesinin içine alındı: Müşteri ekranının üstünde **Müşteriler | Rapor** geçiş anahtarı vardır. Rapor açıkken de alt menüde **Müşteri** sekmesi seçili görünür.
- Bilgisayarda (geniş ekran) alt menü olmadığından yüzen **+** düğmesi sağ altta durur; o da her ekranda görünür.

### Günün hatırlatmaları (mobil)
Hatırlatma satırları ekrana sığmıyor, tutar ve WhatsApp düğmesi sağda kesiliyor, isimler yarım görünüyordu. Düzeltildi: **müşteri adı tam görünür** (gerekirse alt satıra iner), tutar adın altında durur, WhatsApp düğmesi her zaman görünür. Aynısı Özet'teki **Önümüzdeki 7 gün** satırlarında da uygulandı.

### Görsel paylaşım
Paylaşım penceresindeki **metin olarak "ÖDEME FİŞİ"** bölümü kaldırıldı. Artık **yalnızca oluşturulan PNG görseli** gösterilir; altında **Görseli paylaş · PNG indir · Görseli aç** düğmeleri vardır.

### Yeni temalar (8 adet, toplam 12)
Ayarlar → Tema: önceki 4 temaya (Deri Yeşil, Lacivert, Kahve, Bordo) ek olarak **Okyanus, Gün Batımı, Zeytin, Ametist, Sakura, Grafit, Çöl, Aurora**. Seçim ekranında her temanın **3 renkli önizlemesi** görünür. Temalar **cam ve klasik** görünümde, **aydınlık ve karanlık** modda çalışır; cam görünümde ışık kürelerini, alt menüdeki + düğmesini ve vurgu renklerini temadan alır.

### Görsel iyileştirmeler
- Özet'teki **rakamlar açılışta 0'dan sayarak** yükselir.
- **Kısmi ödemeli kartlarda ilerleme çubuğu** (alınan / toplam).
- **Takvimde ısı haritası:** ay görünümünde planlı/ertelenen tutarı yüksek günler daha koyu zeminle öne çıkar.
- **Müşteri avatarları** isme göre farklı renkte.
- **Boş ekranlarda illüstrasyon**, tutarlarda hizalı (tabular) rakamlar.

## SÜRÜM 13: Defterleri otomatik bulma · Ertelenenler Özet'te · Hizalı kartlar

### Güncelleme için yapılacaklar
1. GitHub'a **`index.html`** ve **`sw.js`** dosyalarını yükleyin.
2. Siteyi tamamen kapatıp 2 kez açın (ADIM 5b). **Firebase tarafında yeni ayar gerekmez.**

### Defterlerim: bağlantı yapıştırmaya gerek yok
Yönetici paneline girdiğinizde **tüm defterleriniz otomatik listelenir:**
- **Yönetici dizini:** defter listesi, yönetici şifrenizden türeyen gizli bir adreste **şifreli** saklanır. Şifreyi bilen **her cihaz** (yeni telefon dahil) tüm defterleri bağlantısız görür.
- **Bu cihazda açılmış defterler** otomatik bulunur. Şifresi olmayanlar kendiliğinden **yönetime alınır**; **farklı şifreli** olanlar "Farklı şifre" olarak çıkar, **kendi şifresini girerek** bağlarsınız. Gereksiz olanlar **Yoksay** ile gizlenir.
- **Bağlantıyla ekle** düğmesi yalnızca, hiçbir cihazınızda açılmamış bir defter için kalır.
- Yönetici şifresini değiştirdiğinizde dizin yeni gizli adrese **otomatik taşınır**.

### Ertelenen tahsilatlar Özet'te
Özet'teki **↻ Ertelenen tahsilatlar** bölümü artık ertelenen **tüm açık kayıtları** gösterir (vadesi ileri bir güne alınanlar dahil; önceden yalnızca bugün ve öncesi görünüyordu). Başlıkta toplam, **bugün ve öncesi vadeli** ve **ileri vadeli** sayıları yazar. İlk 6 kart gösterilir, **Tümünü göster** ile hepsi açılır.

### Kartlarda sabit hizalama
Tüm tahsilat kartları aynı düzende çizilir: **üst bilgi · ayrıntı · tutar bloğu · butonlar**. Aynı satırdaki kartlarda **Tahsil / Ertele / WhatsApp düğmeleri ve tutar blokları aynı yükseklikte** durur; kısmi ödemeli ya da çok satırlı kartlar düğmeleri aşağı/yukarı kaydırmaz. Ayrıca:
- Kart düğmeleri **44 px** (parmakla basması kolay).
- "Damga" (ERTELENDİ / KISMİ) uzun müşteri adının ve etiketlerin üstüne binmez.
- Klasik görünümde bilgisayarda yalnızca **alt menüdeki +** görünür (çift + kalktı).

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
| "Düzenleme göstergesi" ya da "Cihaz listesi: kapalı" (tanıda) | Kurallar güncellenmemiş. ADIM 3'teki yeni kuralları yayınlayın (içinde `'aktif'` ve `'cihaz'` olmalı). |
| Eski görünüm geliyor, "CANLI" yazısı yok | **ADIM 5b**'yi uygulayın (yeni `sw.js` yüklü olmalı, siteyi tamamen kapatıp 2 kez açın). |
| Yeni katılan biri boş defter görüyor | Bağlantının **tamamını** (`#d=...` ile birlikte) açtığından emin olun. |

Takıldığınız adımın **ekran görüntüsünü** ve ekranda yazan **hata mesajını** gönderirseniz birlikte çözeriz.
