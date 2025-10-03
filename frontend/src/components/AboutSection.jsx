import { University, Newspaper } from "lucide-react";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative min-h-[70vh] overflow-hidden px-4 py-10 text-primary"
    >
      {/* Hero area with image + heading */}
      <div className="relative flex h-[50vh] items-center justify-center">
        <img
          src="/images/IMG_7965.JPG"
          alt="部室風景"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <h2 className="relative z-10 text-center text-white text-3xl font-bold md:text-4xl">
          報道部について
        </h2>
      </div>

      {/* Content area below */}
      <div className="relative z-10 mx-auto mt-12 flex max-w-5xl flex-col space-y-12">
        <p
          className="leading-relaxed text-primary/90 text-lg px-5"
          style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif' }}
        >
          東北大学学友会報道部は、学友会に所属する大学公認かつ学内最大のメディアとして、学生・教員にニュースを伝達する役割を担っております。内容は、学内外に東北大学の情報を発信することを目的としているため学内事情がメインとなりますが、仙台・宮城・東北のことについてもお伝えしてまいります。
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          {/* Left side: cards */}
          <div className="flex flex-col justify-center gap-6">
            <div className="gradient-border card-hover bg-black/40 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-black">
                    「東北大学新聞」の発行
                  </h4>
                </div>
              </div>
            </div>

            <div className="gradient-border card-hover bg-black/40 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <University className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-black">大学公認の広報誌「学友会」の記事執筆</h4>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: text */}
          <div className="flex items-center">
            <p className="leading-relaxed text-primary">
              活動の情報は、本ホームページだけでなく、ツイッターでも随時発信しております。興味のある方はぜひフォローしてみてください。<br /><br />
              また、新聞の無料定期購読や新規ポストの設置、広告掲載、商用利用に関わるご相談、プレスリリースなどの取材の希望、ご意見ご感想も承っております。本ホームページ下部のお問い合わせからご連絡ください。定期購読をお申し込みの際は、名前、住所、連絡先を明記してください。詳しくはこちら<br /><br />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};