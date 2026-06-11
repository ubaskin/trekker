/**
 * Virtual laboratoriya "kimyo dvigateli":
 * suyuqliklar bazasi va reaksiya qoidalari.
 */

export const MAX_FILL = 0.9; // kolbaning maksimal to'lish darajasi

// Boshlang'ich holat: 2 ta kolba, har birida o'z reagenti
export const INITIAL_FLASKS = {
  A: {
    label: 'Kolba A',
    position: [-1.7, 0, 0],
    level: 0.55,
    liquid: { ids: ['naoh'], name: 'NaOH eritmasi (ishqor)', color: '#fde68a' },
  },
  B: {
    label: 'Kolba B',
    position: [1.7, 0, 0],
    level: 0.45,
    liquid: { ids: ['cuso4'], name: 'CuSO₄ eritmasi', color: '#99f6e4' },
  },
};

// Reaksiyalar bazasi — kalit: alfavit bo'yicha saralangan reagent ID'lari
const REACTIONS = {
  'cuso4+naoh': {
    name: "Mis (II) gidroksid cho'kmasi hosil bo'ldi!",
    equation: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    color: '#2563eb', // yorqin ko'k rang
  },
};

function reactionKey(idsA, idsB) {
  return [...new Set([...idsA, ...idsB])].sort().join('+');
}

/**
 * Ikki suyuqlik aralashtirilganda natijani hisoblaydi.
 * Reaksiya topilsa — uning rangi/nomi, aks holda oddiy fizik aralashma.
 */
export function mixLiquids(target, source) {
  const ids = [...new Set([...target.ids, ...source.ids])];
  const reaction = REACTIONS[reactionKey(target.ids, source.ids)] || null;

  if (reaction) {
    return {
      liquid: { ids, name: reaction.name, color: reaction.color },
      reaction,
    };
  }

  return {
    liquid: { ids, name: 'Aralashma', color: blendHex(target.color, source.color) },
    reaction: null,
  };
}

/** Ikki HEX rangning o'rtacha qiymati (reaksiyasiz aralashma uchun). */
function blendHex(hexA, hexB) {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const mix = (shift) => Math.round((((a >> shift) & 0xff) + ((b >> shift) & 0xff)) / 2);
  return `#${((mix(16) << 16) | (mix(8) << 8) | mix(0)).toString(16).padStart(6, '0')}`;
}
