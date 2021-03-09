function deepMerge(a, b) {
  let newObj = { ...a };

  if (!a || !b) return newObj;

  if (a && slugify(a.name)) newObj['id'] = slugify(a.name);

  Object.keys(b).forEach(key => {
    const value = b[key];

    if (Array.isArray(value) && typeof value !== 'string') {
      newObj[key] = value.map((v, i) => {
        if (typeof v === 'string') {
          return v;
        } else {
          return deepMerge(a[key][i], v);
        }
      });
    } else if (typeof value === 'object') {
      newObj[key] = deepMerge(a[key], b[key]);
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}

exports.deepMerge = deepMerge;

function slugify(value) {
  if (!value) return '';

  return value
    .toLowerCase()
    .replace(/\s/g, '_')
    .replace(/\W/g, '')
    .replace(/\__+/g, '_');
}

exports.slugify = slugify;
