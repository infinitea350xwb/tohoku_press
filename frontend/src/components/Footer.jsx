import { ArrowUp } from "lucide-react";

export const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-12 flex flex-col">
      {/* Top Lines */}
      <div className="relative z-10 w-full flex justify-end pt-10">
        <span
          className="inline-block text-flow-right text-flip-horizontal text-highlight [--highlight-color:white] [--highlight-text:black] font-bold text-3xl md:text-6xl"
          style={{
            fontFamily:
              '"Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif',
          }}
        >
          {"\u3000"}あなたの視点を
        </span>
      </div>

      <div className="relative z-10 w-full flex justify-start">
        <span
          className="inline-block text-flow-left text-highlight [--highlight-color:black] [--highlight-text:white] font-bold text-3xl md:text-6xl"
          style={{
            fontFamily:
              '"Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif',
          }}
        >
          {"\u3000"}貸してください。
        </span>
      </div>
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/bushitsu.jpg"
          alt="部室風景"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 px-6 py-16 text-white flex flex-col gap-10">
        {/* Quote */}
        <div className="text-center text-sm md:text-base italic opacity-90">
          <p>「細部を語れ。生き生きとした細部を。」</p>
          <p className="mt-1">― レイ・ブラッドベリ『華氏451度』</p>
        </div>

        {/* Headline */}
        <h2 className="text-center font-bold text-2xl md:text-4xl">
          東北大学学友会報道部は、<br />
          新入部員を募集しています。
        </h2>

        {/* Body text */}
        <div className="max-w-3xl mx-auto space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            東北大学新聞は1966年に復刊。現在は学内唯一の大学公認メディアとして、
            年11号・毎月約4000部を発行し、学内外に無料で配布しています。
            川内北キャンパスでは講義棟B棟談話室・川内厚生会館にポストを設置しています。
          </p>
          <p>
            ニュース、大学関係者や地域にゆかりのある方のインタビューなどを掲載します。
            本紙は学生全体の正直な声を届けるもので、特定の学生団体および宗教団体とは
            一切の関係を持たない独立した報道姿勢を掲げています。
          </p>
          <p>
            どんなきっかけも動機も構いません。どうぞお気軽に、新歓へお越しください。
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm opacity-80">
          <p>
            &copy; {new Date().getFullYear()} 東北大学学友会報道部. All rights reserved.
          </p>
          <button
            type="button"
            onClick={handleScrollToTop}
            className="p-2 rounded-full bg-primary/30 hover:bg-primary/50 text-white transition-colors"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};