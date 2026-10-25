# Google hesabı ve defter üyeliğine geçiş

Bu sürümde defter bağlantısı tek başına erişim vermez. Kullanıcı Google hesabıyla giriş yapar; her defterin sahibi üyeleri kullanıcı koduyla ekler. Defter sahibi **Sahip**, davet edilenler **Düzenleyici** olur. Düzenleyiciler kayıtları yönetebilir; yalnızca sahip üyeleri ekleyip kaldırabilir. Doğrulanmış `izmirdunyaambalaj@gmail.com` hesabı tüm defterlerde sabit sistem yöneticisidir; defter ve üyeliklerde tam yetkilidir.

## Mevcut kullanıcılar için güvenli geçiş

Mevcut kurallar anonim olarak giriş yapan herkese, defter bağlantısını bildiği sürece veri okuma ve yazma izni veriyor. Geçişi aşamalı yapın; son kuralı mevcut kullanıcılar üyeliğe alınmadan önce yayımlamayın.

1. Her defter sahibi, uygulamadaki **Ayarlar → JSON indir** ile yedek alsın. Çoklu defter kullanılıyorsa her defterin yedeği ayrı alınsın.
2. Firebase Authentication → Sign-in method içinde **Google** sağlayıcısını etkinleştirin. **Anonymous** sağlayıcısını geçiş bitene kadar açık bırakın. Eski anonim oturum, uygulamanın Google hesabını aynı Firebase kullanıcısına bağlaması için kullanılır.
3. Firestore Rules sekmesinde **firestore.rules.migration** içeriğini yayımlayın. Bu geçiş kuralları, uygulamanın sahip ve üyelik metaverisini yazmasını sağlar; kayıt verilerinin eski erişim biçimini geçici olarak korur.
4. **index.html** ve **sw.js** dosyalarını yayımlayın. Geçici kurallar eski link tabanlı erişimi korur; bu aşamada linki bilen oturum açmış kişiler hâlâ eski erişim sınırları içindedir. Bu nedenle geçişi kısa sürede tamamlayın. Kullanıcılar aynı cihaz ve tarayıcı profiliyle uygulamayı açıp **Google hesabıyla giriş yap** seçsin. Her mevcut defterin sahibi, sahiplik belgesini oluşturmak için o defteri ilk kez kendi oluşturduğu cihaz ve aynı tarayıcı profiliyle açmalıdır. Sabit sistem yöneticisi tüm defterlere bu cihaz kontrolünden bağımsız erişir ve üyeleri yönetebilir.
5. Çalışanlar defter bağlantısını açıp Google ile giriş yapsın ve **Üyelik başvurusu gönder** düğmesine bassın. Sahip veya sabit sistem yöneticisi, **Ayarlar → Defter erişimi** ekranındaki anlık bildirimi açıp başvuruyu onaylasın. Elle ekleme de kullanıcı koduyla yapılabilir.
6. Tüm gerekli kişiler ve defterler hazır olduktan sonra Firestore Rules sekmesinde **firestore.rules** içeriğini yayımlayın. Bu son adım üyelikte olmayan hesapların bulut verilerine erişimini keser.
7. Üyeliği kaldırılan bir cihazın önceden indirdiği çevrimdışı kopya cihazdan silinmez. Kullanıcıların cihazlarına erişimin de kontrol edilmesi gerekir.

### Önemli

- **firestore.rules.migration** geçicidir. Geçiş sırasında eski bağlantı erişimi sürdüğü için bu dosyayı son kural olarak bırakmayın.
- Son kuralları sahip üyelikleri ve davetler hazırlanmadan önce yayımlamak çalışanların eşitlemesini keser. Önce her kullanıcı kodunu davet edip, ardından son kuralı yayımlayın.
- Mevcut defter sahibi, sahiplik kaydını eski sahip işaretini içeren orijinal oluşturucu cihazdan açarak oluşturur. Bu cihaz kayıpsa sabit sistem yöneticisi üyelikleri yönetmeye devam edebilir; defter sahibi rolü için ayrıca kontrollü müdahale gerekir.
- `izmirdunyaambalaj@gmail.com` hesabı Firebase Authentication'da doğrulanmış Google hesabı olmalı. Bu sabit hesap Firestore kurallarında tüm defterlerde tam yetkilidir.
- Google hesabı bir cihazda anonim hesabı yükseltmeye çalışır. Google hesabı başka bir Firebase hesabında zaten kayıtlıysa kullanıcı mevcut hesabıyla giriş yapar; sahip bu hesabın kodunu deftere ekler.
- Firebase Web API anahtarı istemci uygulamasında yer alır; tek başına veriye erişim yetkisi vermez. Gerçek erişim denetimi Firestore kurallarıyla yapılır.

## Yeni kurulum

Yeni ve boş bir defter için Google girişini etkinleştirin, **firestore.rules** kurallarını doğrudan yayımlayın ve uygulamayı dağıtın. Defteri oluşturan Google hesabı sahip olur. Sonraki kullanıcılar giriş yapıp kullanıcı kodlarını sahibine iletir.

## Dosyalar

- **firestore.rules.migration**: Eski kullanıcıları içeri alırken geçici olarak kullanılacak kurallar.
- **firestore.rules**: Üyelik bazlı nihai kurallar.
- **index.html**: Google girişi, üyelik başvurusu, sahip/düzenleyici ve anlık bildirim akışı.
- **sw.js**: Yeni uygulama sürümünün önbellek anahtarı.
