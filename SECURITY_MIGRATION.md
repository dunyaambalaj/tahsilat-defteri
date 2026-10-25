# Google hesabı ve defter üyeliğine geçiş

Bu sürümde defter bağlantısı tek başına erişim vermez. Kullanıcı Google hesabıyla giriş yapar; her defterin sahibi üyeleri kullanıcı koduyla ekler. Defter sahibi **Sahip**, davet edilenler **Düzenleyici** olur. Düzenleyiciler kayıtları yönetebilir; yalnızca sahip üyeleri ekleyip kaldırabilir.

## Mevcut kullanıcılar için güvenli geçiş

Mevcut kurallar anonim olarak giriş yapan herkese, defter bağlantısını bildiği sürece veri okuma ve yazma izni veriyor. Geçişi aşamalı yapın; son kuralı mevcut kullanıcılar üyeliğe alınmadan önce yayımlamayın.

1. Her defter sahibi, uygulamadaki **Ayarlar → JSON indir** ile yedek alsın. Çoklu defter kullanılıyorsa her defterin yedeği ayrı alınsın.
2. Firebase Authentication → Sign-in method içinde **Google** sağlayıcısını etkinleştirin. **Anonymous** sağlayıcısını geçiş bitene kadar açık bırakın. Eski anonim oturum, uygulamanın Google hesabını aynı Firebase kullanıcısına bağlaması için kullanılır.
3. Firestore Rules sekmesinde **firestore.rules.migration** içeriğini yayımlayın. Bu geçiş kuralları, uygulamanın sahip ve üyelik metaverisini yazmasını sağlar; kayıt verilerinin eski erişim biçimini geçici olarak korur.
4. **index.html** ve **sw.js** dosyalarını yayımlayın. Kullanıcılar aynı cihaz ve tarayıcı profiliyle uygulamayı açıp **Google hesabıyla giriş yap** seçsin. İlk açan defter sahibi olacağından her defterin mevcut yöneticisi o defteri önce açmalıdır.
5. Her kullanıcı, giriş ekranında gösterilen Google kullanıcı kodunu defter sahibine iletsin. Sahip **Ayarlar → Defter erişimi** bölümünde kodu eklesin. Her kullanıcıya erişeceği her defter için ayrı üyelik verin.
6. Tüm gerekli kişiler ve defterler hazır olduktan sonra Firestore Rules sekmesinde **firestore.rules** içeriğini yayımlayın. Bu son adım üyelikte olmayan hesapların bulut verilerine erişimini keser.
7. Üyeliği kaldırılan bir cihazın önceden indirdiği çevrimdışı kopya cihazdan silinmez. Kullanıcıların cihazlarına erişimin de kontrol edilmesi gerekir.

### Önemli

- **firestore.rules.migration** geçicidir. Geçiş sırasında eski bağlantı erişimi sürdüğü için bu dosyayı son kural olarak bırakmayın.
- Son kuralları sahip üyelikleri ve davetler hazırlanmadan önce yayımlamak çalışanların eşitlemesini keser. Önce her kullanıcı kodunu davet edip, ardından son kuralı yayımlayın.
- Bir defterin ilk Google kullanıcısı, henüz sahip kaydı yoksa sahibi olur. Bu nedenle mevcut her defteri önce doğru yönetici açmalı.
- Google hesabı bir cihazda anonim hesabı yükseltmeye çalışır. Google hesabı başka bir Firebase hesabında zaten kayıtlıysa kullanıcı mevcut hesabıyla giriş yapar; sahip bu hesabın kodunu deftere ekler.
- Firebase Web API anahtarı istemci uygulamasında yer alır; tek başına veriye erişim yetkisi vermez. Gerçek erişim denetimi Firestore kurallarıyla yapılır.

## Yeni kurulum

Yeni ve boş bir defter için Google girişini etkinleştirin, **firestore.rules** kurallarını doğrudan yayımlayın ve uygulamayı dağıtın. İlk Google hesabı defter sahibi olur. Sonraki kullanıcılar giriş yapıp kullanıcı kodlarını sahibine iletir.

## Dosyalar

- **firestore.rules.migration**: Eski kullanıcıları içeri alırken geçici olarak kullanılacak kurallar.
- **firestore.rules**: Üyelik bazlı nihai kurallar.
- **index.html**: Google girişi, üyelik bekleme ekranı, sahip/düzenleyici akışı.
- **sw.js**: Yeni uygulama sürümünün önbellek anahtarı.
