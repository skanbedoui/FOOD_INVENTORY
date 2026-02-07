const CATEGORY_KEYWORDS = {
  pasta: ['pasta','spaghetti','penne','macaroni','fusilli','vermicelli','tagliatelle','orzo'],
  tomato_sauce: ['tomato sauce','sauce tomate','passata','concentré de tomate','purée de tomate','sauce aux tomates'],
  harissa: ['harissa'],
  tuna: ['tuna','thon','conserve de thon','thon en conserve'],
  flour: ['flour','farine'],
  semoule: ['semoule'],
  chorba: ['chorba'],
  couscous: ['couscous']
};

function normalize(s = '') {
  return s.normalize?.('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function extractWeight(name) {
  if (!name) return null;
  const m = name.match(/(\d+(?:[.,]\d+)?)\s?(kg|g|l|ml)\b/i);
  if (!m) return null;
  let value = parseFloat(m[1].replace(',', '.'));
  const unit = m[2].toLowerCase();
  let grams = null;
  if (unit === 'kg') grams = Math.round(value * 1000);
  else if (unit === 'g') grams = Math.round(value);
  else if (unit === 'l') grams = Math.round(value * 1000);
  else if (unit === 'ml') grams = Math.round(value);
  return { grams, raw: m[0] };
}

async function lookupOpenFoodFacts(ean) {
  if (!ean) return null;
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${ean}.json`);
    if (!res.ok) return null;
    const j = await res.json();
    if (j.status === 1) {
      const p = j.product;
      return {
        name: p.product_name || p.generic_name || '',
        quantity: p.quantity || '',
        categories: p.categories_tags || [],
        packaging: p.packaging || ''
      };
    }
  } catch (e) {
    // ignore network errors
  }
  return null;
}

function classifyByName(name) {
  const n = normalize(name || '');
  for (const [cat, keys] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const k of keys) {
      if (n.includes(k)) return cat;
    }
  }
  return 'other';
}

async function classifyItem(item = {}) {
  const barcode = item.barcode || item.ean || item.upc || '';
  let source = 'heuristic';
  let nameToUse = (item.name || '').trim();

  if (barcode) {
    const product = await lookupOpenFoodFacts(barcode);
    if (product) {
      source = 'openfoodfacts';
      nameToUse = product.name || nameToUse;
    }
  }

  const category = classifyByName(nameToUse || item.name || '');
  const weight = extractWeight(nameToUse || item.name || '');

  return {
    name: nameToUse || item.name || '',
    category,
    weight,
    source
  };
}

module.exports = { classifyItem };
