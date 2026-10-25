# Ödeme Defteri – Ortak Canlı Defter Kurulumu (Sıfırdan, Adım Adım)

> **Güvenlik modeli güncellendi:** Bu belgenin eski anonim bağlantı adımları yeni sürüm için geçerli değildir. Mevcut kullanıcılar için [Google hesabı ve üyelik geçiş rehberini](SECURITY_MIGRATION.md) izleyin. Eski Firestore kuralını yeniden yayımlamayın.

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
- Yeni sürümde kayıtları yalnızca Google hesabı deftere eklenmiş üyeler görüntüler ve düzenler.
- Biri bir şey yaptığında **birkaç saniye içinde herkesin ekranında** görünür (telefon, bilgisayar, tablet fark etmez).
- Aynı anda farklı kişiler farklı kayıtlar girse bile birbirini bozmaz. Aynı kayda aynı anda tahsilat girseler bile tutarlar **toplanır**, üst üste yazılmaz.
- İnternet kesilirse uygulama çalışmaya devam eder; işlemler cihazda bekler, internet gelince **otomatik gönderilir.**
- Başlıktaki yazıdan durumu görürsünüz: **● CANLI** (her şey eşit), **● BAĞLANIYOR**, **● ÇEVRİMDIŞI**, **● HATA**.

**Cihaza özel (herkesin kendine ait) olanlar:** tema, karanlık mod, PIN kilidi, hatırlatma ayarları.
**Ortak olanlar:** tüm kayıtlar, firma adı/telefon/adres/vergi no, logo.

> ⚠️ **Güvenlik:** Defter bağlantısı yalnızca defteri tanımlar; Google hesabı ayrıca sahip tarafından üyeliğe eklenmelidir. Üyelik kaldırılınca yeni bulut erişimi kesilir, ancak önceden indirilmiş çevrimdışı kopya cihazda kalabilir. Düzenli JSON yedeği alın.

---

## ADIM 1 – Google girişini etkinleştirin

Authentication → Sign-in method bölümünde **Google** sağlayıcısını etkinleştirin. Mevcut kullanıcıların Google hesabını önceki anonim Firebase oturumuna bağlayabilmesi için geçiş tamamlanana kadar **Anonymous** sağlayıcısını da açık tutun. Ayrıntılı ve güvenli sıra için [geçiş rehberini](SECURITY_MIGRATION.md) kullanın.

## ADIM 2 – Veritabanını (Firestore) oluşturun

**Daha önce oluşturduysanız bu adımı atlayıp ADIM 3'e geçin.**

1. Sol menüden **Build** → **Firestore Database** seçin.
2. **Create database (Veritabanı oluştur)** butonuna basın.
3. Konum sorarsa **eur3 (Europe)** ya da **europe-west** seçin.
4. Güvenlik modu sorarsa **Production mode (Üretim modu)** seçin.
5. **Create** deyin ve birkaç saniye bekleyin.

## ADIM 3 – Firestore güvenlik kurallarını hazırlayın

Mevcut kullanıcıları olan projede önce **firestore.rules.migration** dosyasındaki geçici kuralları yayımlayın. Bu aşama uygulamanın Google sahip/üyelik metaverisini oluşturmasına izin verirken eski erişim modelini kısa süre korur.

Tüm mevcut defter sahipleri Google hesabıyla giriş yaptıktan ve çalışanları üye olarak ekledikten sonra **firestore.rules** dosyasındaki son kuralları yayımlayın. Son kurallar, üyelik kaydı olmayan hesapların defter verilerine erişimini keser.

> ⚠️ Üyeleri eklemeden son kuralları yayımlamayın; çalışanların eşitlemesi durur. İki aşamalı yayın sırası için [SECURITY_MIGRATION.md](SECURITY_MIGRATION.md) rehberini izleyin.

## ADIM 4 – Giriş için site adresinize izin verin

1. Authentication sayfasında **Settings (Ayarlar)** sekmesine gidin.
2. **Authorized domains (Yetkili alanlar)** bölümünde `dunyaambalaj.github.io` yoksa **Add domain** deyip yazın ve ekleyin.

## ADIM 5 – Dosyaları GitHub'a yükleyin

Bu sürümde `index.html`, `sw.js`, `firebase-config.js`, `firestore.rules`, `firestore.rules.migration` ve `SECURITY_MIGRATION.md` dosyaları da kullanılır.

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

## ADIM 7 – Bağlantıyı gönderin ve üyeyi onaylayın

Defter ilk oluşunca bağlantı penceresi **kendiliğinden açılır.** Sonradan bağlantıya ulaşmanın iki yolu var:

- Başlıktaki **● CANLI** yazısına dokunun, ya da
- Sağ üstten **Ayarlar** (dişli simgesi) → **"Ortak defter"** bölümü.

Oradan **Bağlantıyı kopyala** ya da **WhatsApp** butonuna basın.
3. Bağlantı şuna benzer: `https://dunyaambalaj.github.io/tahsilat-defteri/#d=AbCdEf...`
4. Çalışanınıza bağlantıyı gönderin. Çalışan Google hesabıyla giriş yapıp ekranda görünen kullanıcı kodunu size iletsin; ardından Ayarlar → Defter erişimi bölümünden kullanıcı kodunu üyeliğe ekleyin.

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
