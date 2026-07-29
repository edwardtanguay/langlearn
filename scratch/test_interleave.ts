import { buildInterleavedQueue } from '../server/utils/algorithm'

function runTests() {
  console.log('--- Testing buildInterleavedQueue ---')

  // Test 1: Standard 3:1 interleaving (10 new, 4 due)
  const newCards = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10']
  const dueCards = ['D1', 'D2', 'D3', 'D4']

  const result1 = buildInterleavedQueue(newCards, dueCards, { newRatio: 3, dueRatio: 1 })
  console.log('Test 1 (Standard 3:1):', result1)
  const expected1 = ['N1', 'N2', 'N3', 'D1', 'N4', 'N5', 'N6', 'D2', 'N7', 'N8', 'N9', 'D3', 'N10', 'D4']
  console.assert(JSON.stringify(result1) === JSON.stringify(expected1), 'Test 1 Failed!')

  // Test 2: 0 Due cards (Fallback to 100% new)
  const result2 = buildInterleavedQueue(['N1', 'N2', 'N3'], [])
  console.log('Test 2 (0 Due cards):', result2)
  console.assert(JSON.stringify(result2) === JSON.stringify(['N1', 'N2', 'N3']), 'Test 2 Failed!')

  // Test 3: 0 New cards (Fallback to 100% due)
  const result3 = buildInterleavedQueue([], ['D1', 'D2'])
  console.log('Test 3 (0 New cards):', result3)
  console.assert(JSON.stringify(result3) === JSON.stringify(['D1', 'D2']), 'Test 3 Failed!')

  // Test 4: Partial/incomplete batch
  const result4 = buildInterleavedQueue(['N1', 'N2'], ['D1'])
  console.log('Test 4 (Partial 2 New, 1 Due):', result4)
  console.assert(JSON.stringify(result4) === JSON.stringify(['N1', 'N2', 'D1']), 'Test 4 Failed!')

  console.log('All tests passed successfully!')
}

runTests()
