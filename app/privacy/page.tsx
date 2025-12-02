import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <SectionTitle title="Yasal" subtitle="Gizlilik Politikası" centered={true} />

                <div className="mt-12 space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">1. Giriş</h3>
                        <p>
                            Dr. Burger ("Şirket") olarak, web sitemizi ziyaret eden kullanıcılarımızın ("Kullanıcı") kişisel verilerinin gizliliğini korumaya büyük önem veriyoruz.
                            Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin toplanma yöntemi, işlenme amaçları,
                            aktarıldığı alıcı grupları ve sahip olduğunuz haklar konusunda sizi bilgilendirmek amacıyla hazırlanmıştır.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">2. Toplanan Kişisel Veriler</h3>
                        <p>
                            Web sitemiz üzerinden bizimle iletişime geçmeniz, franchise başvurusu yapmanız veya diğer formları doldurmanız durumunda aşağıdaki verileriniz toplanabilir:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Kimlik Bilgileri (Ad, Soyad)</li>
                            <li>İletişim Bilgileri (E-posta adresi, Telefon numarası)</li>
                            <li>İşlem Güvenliği Bilgileri (IP adresi, Site trafik bilgileri)</li>
                            <li>Talep/Şikayet Yönetimi Bilgileri (İletişim formunda belirttiğiniz mesajlar)</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">3. Kişisel Verilerin İşlenme Amaçları</h3>
                        <p>
                            Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>İletişim faaliyetlerinin yürütülmesi</li>
                            <li>Franchise ve iş başvurularının değerlendirilmesi</li>
                            <li>Müşteri ilişkileri yönetimi süreçlerinin yürütülmesi</li>
                            <li>Talep ve şikayetlerin takibi</li>
                            <li>Yetkili kişi, kurum ve kuruluşlara bilgi verilmesi</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">4. Kişisel Verilerin Aktarılması</h3>
                        <p>
                            Kişisel verileriniz, yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarına ve iş faaliyetlerinin yürütülmesi amacıyla
                            hizmet aldığımız tedarikçilere (sunucu hizmeti vb.), KVKK'nın 8. ve 9. maddelerinde belirtilen şartlara uygun olarak aktarılabilir.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">5. Veri Sahibinin Hakları</h3>
                        <p>
                            KVKK'nın 11. maddesi uyarınca, veri sahibi olarak aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                            <li>Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme,</li>
                            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                            <li>Kanuna uygun olarak silinmesini veya yok edilmesini isteme.</li>
                        </ul>
                        <p className="mt-4">
                            Bu haklarınızı kullanmak için bizimle <strong>info@drburger.com.tr</strong> adresi üzerinden iletişime geçebilirsiniz.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
