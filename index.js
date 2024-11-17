function factorial (initialValue, multiplier) {
  if (multiplier <= 0) return initialValue

  const nextValue = initialValue * multiplier
  const nextMultiplier = multiplier - 1

   return factorial(nextValue, nextMultiplier)
}


function factorialFor (initialValue, multiplier) {
  let value = initialValue

  for (let iterator = multiplier; iterator > 0; iterator--) {
    value *= iterator
  }

  return value
}

console.log(factorialFor(5, 4))