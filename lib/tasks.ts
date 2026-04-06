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
  b1: { id: 'b1', name: '浴槽・床の拭き掃除', category: 'bath', estimatedMinutes: 10 },

  // Weekly — Monday
  l1: { id: 'l1', name: '床の掃除機がけ（全室）', category: 'living', estimatedMinutes: 30 },

  // Weekly — Tuesday
  k2: { id: 'k2', name: 'コンロ周り拭き掃除', category: 'kitchen', estimatedMinutes: 10 },
  k3: { id: 'k3', name: 'シンク・排水口の掃除', category: 'kitchen', estimatedMinutes: 10 },

  // Weekly — Wednesday
  b4: { id: 'b4', name: '洗面台の掃除', category: 'bath', estimatedMinutes: 10 },
  m1: { id: 'm1', name: '洗濯機フィルター掃除', category: 'machine', estimatedMinutes: 10 },

  // Weekly — Thursday
  b5: { id: 'b5', name: '1階トイレ掃除', category: 'bath', estimatedMinutes: 15 },
  b6: { id: 'b6', name: '2階トイレ掃除', category: 'bath', estimatedMinutes: 15 },

  // Weekly — Friday
  l3: { id: 'l3', name: '玄関・たたきの掃除', category: 'living', estimatedMinutes: 10 },

  // Monthly — 1st Saturday: 冷蔵庫 + お風呂排水口(bi-weekly)
  k4: { id: 'k4', name: '冷蔵庫内の整理・拭き掃除', category: 'kitchen', estimatedMinutes: 20 },
  b3: { id: 'b3', name: 'お風呂の排水口掃除', category: 'bath', estimatedMinutes: 15 },

  // Monthly — 2nd Saturday: 電子レンジ
  k5: { id: 'k5', name: '電子レンジ内の掃除', category: 'kitchen', estimatedMinutes: 15 },

  // Monthly — 3rd Saturday: 換気扇 + お風呂排水口(bi-weekly)
  k1: {
    id: 'k1',
    name: '換気扇フィルターの掃除',
    category: 'kitchen',
    estimatedMinutes: 30,
    tip: '重曹水に10分つけ置きしてからすすぐ。本体は専門業者へ。',
  },

  // Monthly — 4th Saturday: 棚埃払い
  l2: { id: 'l2', name: '棚・家具の上の埃払い', category: 'living', estimatedMinutes: 20 },

  // Monthly — 1st Sunday: 浴室カビ防止
  b2: { id: 'b2', name: '浴室の壁・天井のカビ防止掃除', category: 'bath', estimatedMinutes: 20 },

  // Bi-weekly — 2nd & 4th Sunday: エアコン
  m4: { id: 'm4', name: 'エアコンフィルター掃除', category: 'machine', estimatedMinutes: 20 },

  // Monthly — 3rd Sunday: 洗濯機
  m2: { id: 'm2', name: '洗濯機の槽洗浄', category: 'machine', estimatedMinutes: 15 },
  m3: { id: 'm3', name: '洗濯機ドアパッキン拭き', category: 'machine', estimatedMinutes: 10 },

  // Quarterly — 2nd Saturday of Mar/Jun/Sep/Dec
  l4: { id: 'l4', name: '窓ガラス・サッシの掃除', category: 'living', estimatedMinutes: 45 },

  // Quarterly — 4th Saturday of Feb/May/Aug/Nov
  m5: { id: 'm5', name: '給湯器フィルターの確認・掃除', category: 'machine', estimatedMinutes: 15 },

  // Semi-annual — 2nd Saturday of Apr/Oct
  l5: { id: 'l5', name: 'カーテンの洗濯', category: 'living', estimatedMinutes: 30 },
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
