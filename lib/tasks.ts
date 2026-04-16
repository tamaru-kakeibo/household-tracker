export type Category = 'kitchen' | 'bath' | 'living' | 'machine';

export interface Task {
  id: string;
  name: string;
  category: Category;
  estimatedMinutes: number;
  tip?: string;
}

export const TASKS: Record<string, Task> = {
  // Daily
  b1: {
    id: 'b1', name: '浴槽・床の拭き掃除', category: 'bath', estimatedMinutes: 10,
    tip: '浴室用洗剤をスプレーしてスポンジで円を描くように洗う。排水口は最後にまとめて。',
  },

  // Weekly — Monday
  l1: {
    id: 'l1', name: '床の掃除機がけ（全室）', category: 'living', estimatedMinutes: 30,
    tip: '部屋の端から中央へ向けてかけると埃が舞いにくい。ソファ下や家具の隙間も忘れずに。',
  },

  // Weekly — Tuesday
  k2: {
    id: 'k2', name: 'コンロ周り拭き掃除', category: 'kitchen', estimatedMinutes: 10,
    tip: '油汚れには重曹スプレーが効果的。頑固な汚れはラップを被せて10分置いてから拭き取る。',
  },
  k3: {
    id: 'k3', name: 'シンク・排水口の掃除', category: 'kitchen', estimatedMinutes: 10,
    tip: '排水口は重曹を振りかけてからクエン酸水をかけ、15分後に流すと消臭にも効果的。',
  },

  // Weekly — Wednesday
  b4: {
    id: 'b4', name: '洗面台の掃除', category: 'bath', estimatedMinutes: 10,
    tip: '鏡の水垢にはクエン酸水を吹きかけて拭くと綺麗に落ちる。蛇口周りはメラミンスポンジが便利。',
  },
  m1: {
    id: 'm1', name: '洗濯機フィルター掃除', category: 'machine', estimatedMinutes: 10,
    tip: '乾燥フィルターの埃は使い古しの歯ブラシで取り除くと簡単。目詰まりは乾燥時間が長くなるサイン。',
  },

  // Weekly — Thursday
  b5: {
    id: 'b5', name: '1階トイレ掃除', category: 'bath', estimatedMinutes: 15,
    tip: 'トイレ洗剤を便器内に入れてブラシで磨く。外側・タンク・床は除菌シートで拭き取る。',
  },
  b6: {
    id: 'b6', name: '2階トイレ掃除', category: 'bath', estimatedMinutes: 15,
    tip: 'トイレ洗剤を便器内に入れてブラシで磨く。外側・タンク・床は除菌シートで拭き取る。',
  },

  // Weekly — Friday
  l3: {
    id: 'l3', name: '玄関・たたきの掃除', category: 'living', estimatedMinutes: 10,
    tip: 'たたきの土埃はほうきで掃いてから固く絞った雑巾で水拭きすると綺麗になる。',
  },

  // Monthly — 1st Saturday
  k4: {
    id: 'k4', name: '冷蔵庫内の整理・拭き掃除', category: 'kitchen', estimatedMinutes: 20,
    tip: '食品を出して重曹水で棚を拭くと消臭にもなる。期限切れのチェックも一緒に行うと◎。',
  },
  b3: {
    id: 'b3', name: 'お風呂の排水口掃除', category: 'bath', estimatedMinutes: 15,
    tip: '髪の毛を取り除いた後、重曹を振りかけてクエン酸水をかけると除菌・消臭に効果的。',
  },

  // Monthly — 2nd Saturday
  k5: {
    id: 'k5', name: '電子レンジ内の掃除', category: 'kitchen', estimatedMinutes: 15,
    tip: '水を入れたコップを5分加熱して庫内を蒸らすと汚れが落ちやすくなる。その後固く絞った雑巾で拭く。',
  },

  // Monthly — 3rd Saturday
  k1: {
    id: 'k1', name: '換気扇フィルターの掃除', category: 'kitchen', estimatedMinutes: 30,
    tip: '重曹水に10分つけ置きしてからすすぐ。本体（シロッコファン）の掃除は専門業者へ。',
  },

  // Monthly — 4th Saturday
  l2: {
    id: 'l2', name: '棚・家具の上の埃払い', category: 'living', estimatedMinutes: 20,
    tip: 'マイクロファイバークロスを使うと埃が舞いにくい。高い場所から低い場所へ、上から下の順で払う。',
  },

  // Monthly — 1st Sunday
  b2: {
    id: 'b2', name: '浴室の壁・天井のカビ防止掃除', category: 'bath', estimatedMinutes: 20,
    tip: '防カビくん煙剤を使うと約2ヶ月カビの発生を予防できる。使用後はしっかり換気を。',
  },

  // Bi-weekly — 2nd & 4th Sunday
  m4: {
    id: 'm4', name: 'エアコンフィルター掃除', category: 'machine', estimatedMinutes: 20,
    tip: '外したフィルターは掃除機で埃を吸い取ってから水洗い。完全に乾かしてから戻すこと。',
  },

  // Monthly — 3rd Sunday
  m2: {
    id: 'm2', name: '洗濯機の槽洗浄', category: 'machine', estimatedMinutes: 15,
    tip: '槽洗浄専用洗剤または酸素系漂白剤を使い、高水位で一晩つけ置きするとより効果的。',
  },
  m3: {
    id: 'm3', name: '洗濯機ドアパッキン拭き', category: 'machine', estimatedMinutes: 10,
    tip: 'ゴムパッキンのカビには塩素系漂白剤を含ませたキッチンペーパーを30分貼り付けてから拭き取る。',
  },

  // Quarterly — 2nd Saturday of Mar/Jun/Sep/Dec（1階）
  l4a: {
    id: 'l4a', name: '窓ガラス・サッシの掃除（1階）', category: 'living', estimatedMinutes: 25,
    tip: '曇りの日が最適（晴れた日は乾きが早く拭き跡が残りやすい）。サッシの溝は古い歯ブラシで掃くと便利。',
  },
  // Quarterly — 2nd Sunday of Mar/Jun/Sep/Dec（2階）
  l4b: {
    id: 'l4b', name: '窓ガラス・サッシの掃除（2階）', category: 'living', estimatedMinutes: 30,
    tip: '高い場所の窓は安全に注意。内側から拭いた後、外側も拭くと効果的。サッシの溝に詰まった汚れは歯ブラシで。',
  },

  // Quarterly — 4th Saturday of Feb/May/Aug/Nov
  m5: {
    id: 'm5', name: '給湯器フィルターの確認・掃除', category: 'machine', estimatedMinutes: 15,
    tip: 'フィルターを取り外して水で洗い流す。目詰まりがひどい場合は柔らかいブラシを使用。給湯器の説明書も確認を。',
  },

  // Semi-annual — 4th Saturday of Jan/Jul
  m6: {
    id: 'm6', name: 'エコキュートの水抜き', category: 'machine', estimatedMinutes: 20,
    tip: '貯湯タンク下の排水栓を開けて数分間水を流し、不純物を排出する。年2回（1月・7月）が目安。作業前に取扱説明書を確認し、高温に注意。',
  },

  // Bedding — Weekly Sunday
  bd1: {
    id: 'bd1', name: 'シーツ・枕カバーの洗濯', category: 'living', estimatedMinutes: 15,
    tip: '枕カバーは皮脂・汗が直接付くため週1回が理想。シーツと一緒にまとめて洗うと効率的。',
  },

  // Bedding — Monthly 4th Saturday
  bd2: {
    id: 'bd2', name: '布団の天日干し', category: 'living', estimatedMinutes: 20,
    tip: '晴れた日の10〜14時に干すのが最適。カバーをはずして両面各1〜2時間。取り込む前に軽くたたいてダニを落とす。',
  },

  // Bedding — Monthly 2nd Saturday
  bd3: {
    id: 'bd3', name: '毛布の洗濯', category: 'living', estimatedMinutes: 20,
    tip: '洗濯表示を確認。大きい毛布はコインランドリーの大型機が便利。乾燥機OKの素材なら一緒に乾燥まで。',
  },

  // Bedding — Monthly 4th Sunday
  bd4: {
    id: 'bd4', name: 'マットレスの掃除機がけ・除菌', category: 'living', estimatedMinutes: 15,
    tip: '掃除機でダニの死骸・皮脂を吸い取った後、除菌スプレーを軽く噴霧。3〜6ヶ月に1度は上下を入れ替えると長持ち。',
  },

  // Semi-annual — 2nd Saturday of Apr/Oct（1階）
  l5a: {
    id: 'l5a', name: 'カーテンの洗濯（1階）', category: 'living', estimatedMinutes: 20,
    tip: '洗濯表示を必ず確認。乾燥機は避け、洗濯後はカーテンレールにかけたまま干すとシワになりにくい。',
  },
  // Semi-annual — 2nd Sunday of Apr/Oct（2階）
  l5b: {
    id: 'l5b', name: 'カーテンの洗濯（2階）', category: 'living', estimatedMinutes: 25,
    tip: '2階は枚数が多いので洗濯機を複数回まわす場合も。洗い終わったものからすぐにレールに戻すと効率的。',
  },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  kitchen: {
    label: 'キッチン',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  bath: {
    label: '水回り',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    dot: 'bg-sky-400',
  },
  living: {
    label: '居室',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  machine: {
    label: '設備',
    bg: 'bg-violet-50',
    text: 'text-violet-800',
    border: 'border-violet-200',
    dot: 'bg-violet-400',
  },
};
