import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <SectionTitle title="Yasal" subtitle="Kullanım Koşulları" centered={true} />

                <div className="mt-12 space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">1. Taraflar ve Amaç</h3>
                        <p>
                            Bu web sitesini ziyaret ederek veya kullanarak, aşağıda belirtilen Kullanım Koşulları'nı kabul etmiş sayılırsınız.
                            Bu koşullar, Dr. Burger ("Şirket") ile siteyi kullanan kişi ("Kullanıcı") arasındaki ilişkiyi düzenler.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">2. Fikri Mülkiyet Hakları</h3>
                        <p>
                            Bu web sitesinde yer alan tüm içerikler (logolar, metinler, görseller, tasarımlar, yazılımlar vb.) Dr. Burger'a aittir veya
                            lisanslı olarak kullanılmaktadır. Bu içerikler, Şirket'in yazılı izni olmaksızın kopyalanamaz, çoğaltılamaz, dağıtılamaz veya ticari amaçla kullanılamaz.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">3. Kullanım Kuralları</h3>
                        <p>
                            Kullanıcı, siteyi kullanırken aşağıdaki kurallara uymayı kabul eder:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Siteyi Türkiye Cumhuriyeti yasalarına ve genel ahlak kurallarına aykırı amaçlarla kullanmamak.</li>
                            <li>Sitenin güvenliğini tehdit edecek, çalışmasını engelleyecek girişimlerde bulunmamak.</li>
                            <li>Başkalarının kişisel verilerini izinsiz kullanmamak veya ele geçirmeye çalışmamak.</li>
                            <li>Site üzerinden yanıltıcı, gerçek dışı veya hukuka aykırı beyanlarda bulunmamak.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">4. Sorumluluk Reddi</h3>
                        <p>
                            Dr. Burger, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. Sitede yer alan bilgilerin doğruluğu ve güncelliği konusunda
                            azami özen gösterilmekle birlikte, olası hatalardan veya eksikliklerden dolayı Şirket sorumlu tutulamaz. Site üzerinden verilen linklerin
                            içeriğinden Şirket sorumlu değildir.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">5. Değişiklikler</h3>
                        <p>
                            Dr. Burger, işbu Kullanım Koşulları'nı dilediği zaman önceden bildirmeksizin değiştirme hakkını saklı tutar.
                            Değişiklikler sitede yayınlandığı tarihte yürürlüğe girer. Kullanıcıların siteyi düzenli olarak kontrol etmeleri önerilir.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-4">6. Uygulanacak Hukuk ve Yetki</h3>
                        <p>
                            İşbu Kullanım Koşulları'ndan doğacak uyuşmazlıklarda Türk Hukuku uygulanır ve Ankara Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
