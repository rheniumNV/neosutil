const axios = require("axios");
const json2emap = require("json2emap");

testData = [
  {
    title: "NeosVRなにもしない集会",
    startTime: 1639486800000,
    endTime: 1639488600000,
    detail:
      '↓詳細はこちらのツイート <br> <a href="https://twitter.com/Metananimo/status/1470189124485521408?s=20">https://twitter.com/Metananimo/status/1470189124485521408?s=20</a>  <br><br>一部引用<br> <br>21:45～ワールド会場　質疑応答<br>22:00　なにもしない開始<br>22:30 　なにもしない終了　各自解散<br> <br>～なにかしてるに抵触する行為～<br>・発声<br>・アバターチェンジ<br>・作業全般（デスクトップやオーバーレイツールによる作業や動画の視聴も同様）<br>・飲食（適度な水分補給はこの限りではない）<br>・その他、 参加者の”なにもしない”を著しく阻害する行為',
    place: "NeosVR",
  },
  {
    title: "NeosVR初心者案内デー",
    startTime: 1639486800000,
    endTime: 1639490400000,
    detail: "基本操作からアバターセットアップまでまるっと覚えちゃおう～！！",
    place: "NeosVR",
  },
  {
    title: "Neosモデリング講習会",
    startTime: 1639569600000,
    endTime: 1639573200000,
    detail: "毎週水曜日２１時からはNeosモデリングの日！",
    place: "NeosVR",
  },
  {
    title: "喫茶かっこう",
    startTime: 1639656000000,
    endTime: 1639659600000,
    detail:
      "ゆるい雑談や動画視聴、ゲーム、人集めなどでお気軽にお立ち寄りくださいいくつかのVR飲食物をKFCにて販売中ですが、ゲームや飲食物は持ち込み可です。",
    place: "NeosVR",
  },
  {
    title: "WEEKEND CASINO",
    startTime: 1639742400000,
    endTime: 1639764000000,
    detail:
      "毎週金・土曜日の21時からはWEEKEND CASINO！WEEKEND CASINOでは「KFC」と呼ばれるNEOSで使われるゲーム内通貨を賭けて遊ぶことができます！スロットやブラックジャック、ビデオポーカー、ビンゴゲーム等、様々なゲームで遊べます！誰でも参加可能なので、是非お越しください！",
    place: "NeosVR",
  },
  {
    title: "WEEKEND CASINO",
    startTime: 1639828800000,
    endTime: 1639850400000,
    detail:
      "毎週金・土曜日の21時からはWEEKEND CASINO！WEEKEND CASINOでは「KFC」と呼ばれるNEOSで使われるゲーム内通貨を賭けて遊ぶことができます！スロットやブラックジャック、ビデオポーカー、ビンゴゲーム等、様々なゲームで遊べます！誰でも参加可能なので、是非お越しください！",
    place: "NeosVR",
  },
  {
    title: "GAMECENTER RELAXDOG",
    startTime: 1639915200000,
    endTime: 1639969200000,
    detail:
      "毎週日曜夜OPEN『GAMECENTER RELAXDOG』無料で遊べるゲームはもちろんKFCでポイントカードを購入してクレーンゲームやガチャ、スクラッチも遊べます。GETした品はその場で保存してお持ち帰り可能！21：00～24：00（JST）で同名ワールドがオープン！",
    place: "NeosVR",
  },
  {
    title: "NeosVR初心者案内デー",
    startTime: 1640091600000,
    endTime: 1640095200000,
    detail: "基本操作からアバターセットアップまでまるっと覚えちゃおう～！！",
    place: "NeosVR",
  },
  {
    title: "Neosモデリング講習会",
    startTime: 1640174400000,
    endTime: 1640178000000,
    detail: "毎週水曜日２１時からはNeosモデリングの日！",
    place: "NeosVR",
  },
  {
    title: "喫茶かっこう",
    startTime: 1640260800000,
    endTime: 1640264400000,
    detail:
      "ゆるい雑談や動画視聴、ゲーム、人集めなどでお気軽にお立ち寄りくださいいくつかのVR飲食物をKFCにて販売中ですが、ゲームや飲食物は持ち込み可です。",
    place: "NeosVR",
  },
  {
    title: "WEEKEND CASINO",
    startTime: 1640347200000,
    endTime: 1640368800000,
    detail:
      "毎週金・土曜日の21時からはWEEKEND CASINO！WEEKEND CASINOでは「KFC」と呼ばれるNEOSで使われるゲーム内通貨を賭けて遊ぶことができます！スロットやブラックジャック、ビデオポーカー、ビンゴゲーム等、様々なゲームで遊べます！誰でも参加可能なので、是非お越しください！",
    place: "NeosVR",
  },
  {
    title: "WEEKEND CASINO",
    startTime: 1640433600000,
    endTime: 1640455200000,
    detail:
      "毎週金・土曜日の21時からはWEEKEND CASINO！WEEKEND CASINOでは「KFC」と呼ばれるNEOSで使われるゲーム内通貨を賭けて遊ぶことができます！スロットやブラックジャック、ビデオポーカー、ビンゴゲーム等、様々なゲームで遊べます！誰でも参加可能なので、是非お越しください！",
    place: "NeosVR",
  },
  {
    title: "クリスマスプレゼント交換会",
    startTime: 1640437200000,
    endTime: 1640440800000,
    detail: "プレゼント交換しましょう！",
    place: "NeosVR",
  },
  {
    title: "GAMECENTER RELAXDOG",
    startTime: 1640520000000,
    endTime: 1640574000000,
    detail:
      "毎週日曜夜OPEN『GAMECENTER RELAXDOG』無料で遊べるゲームはもちろんKFCでポイントカードを購入してクレーンゲームやガチャ、スクラッチも遊べます。GETした品はその場で保存してお持ち帰り可能！21：00～24：00（JST）で同名ワールドがオープン！",
    place: "NeosVR",
  },
];

exports.getEventCalender1Week = async (req, res) => {
  const { useEmap = true } = req.query;

  //const eventData = await axios("https://neokun.kokoa.dev/");
  const eventData = testData;

  res.send(useEmap ? json2emap(eventData) : eventData);
};
