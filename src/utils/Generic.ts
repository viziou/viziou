function* generatePairs<T>(array: T[]): Generator<[T, T]> {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length ; j++) {
      yield [array[i], array[j]];
    }
  }
}

/* Basic testing */
// for (const [one, two] of generatePairs([1,2,3,4,5,'a','b','c','d'])) {
//   console.log(one + ', ' + two);
// }
