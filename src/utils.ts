function isNumeric(value: any): boolean {
  return typeof value === 'string' && /^\d+$/.test(value);
}

export function convertStringBigIntsToBigInts(obj: any): any {
  console.log('converting', JSON.stringify(obj));
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertStringBigIntsToBigInts(item));
  }

  return Object.keys(obj).reduce((acc: { [key: string]: any }, key: string) => {
    const value = obj[key];
    if (isNumeric(value)) {
      try {
        acc[key] = BigInt(value);
      } catch (e) {
        acc[key] = value; // Keep as string if it fails to convert
      }
    } else if (typeof value === 'object') {
      acc[key] = convertStringBigIntsToBigInts(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}
