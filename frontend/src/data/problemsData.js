export const PROBLEMS_DATA = [
  {
    id: 'prob-101',
    number: 101,
    title: 'Sum of Two Integers Logic',
    slug: 'sum-of-two-integers',
    difficulty: 'Easy',
    category: 'Basic Math & Variables',
    tags: ['Variables', 'Arithmetic', 'Basic Logic'],
    acceptanceRate: '94.2%',
    points: 50,
    description: `Given two integers $A$ and $B$, write a step-by-step logical sequence to calculate their sum and output the resulting value.`,
    inputFormat: 'Two integers A and B separated by space.',
    outputFormat: 'Single integer representing the sum A + B.',
    constraints: '-10^9 <= A, B <= 10^9',
    sampleCases: [
      { input: 'A = 5, B = 7', output: '12' },
      { input: 'A = -3, B = 8', output: '5' }
    ],
    hints: [
      'First declare two variables to store inputs A and B.',
      'Create a third variable to store the result of adding A and B.',
      'Output or print the result variable.'
    ],
    expectedKeywords: ['declare', 'variable', 'sum', 'add', 'store', 'output', 'print']
  },
  {
    id: 'prob-102',
    number: 102,
    title: 'Check Even or Odd Logic',
    slug: 'check-even-or-odd',
    difficulty: 'Easy',
    category: 'Conditional Control',
    tags: ['Conditionals', 'Modulo', 'Branching'],
    acceptanceRate: '91.8%',
    points: 50,
    description: `Write a logical process to determine whether a given integer N is Even or Odd. If N is divisible by 2, output "Even", otherwise output "Odd".`,
    inputFormat: 'Single integer N.',
    outputFormat: 'String: "Even" or "Odd".',
    constraints: '-10^9 <= N <= 10^9',
    sampleCases: [
      { input: 'N = 4', output: 'Even' },
      { input: 'N = 7', output: 'Odd' }
    ],
    hints: [
      'Read input integer N.',
      'Check if the remainder of N divided by 2 is equal to 0.',
      'If true, print "Even". Otherwise, print "Odd".'
    ],
    expectedKeywords: ['read', 'integer', 'remainder', 'modulo', 'divide', 'if', 'else', 'even', 'odd']
  },
  {
    id: 'prob-103',
    number: 103,
    title: 'Find Maximum of Three Numbers',
    slug: 'find-maximum-of-three-numbers',
    difficulty: 'Easy',
    category: 'Conditional Control',
    tags: ['Conditionals', 'Comparisons', 'Control Flow'],
    acceptanceRate: '88.5%',
    points: 75,
    description: `Given three distinct numbers X, Y, and Z, construct the reasoning to identify and output the largest number among them.`,
    inputFormat: 'Three numbers X, Y, Z.',
    outputFormat: 'The maximum value among X, Y, Z.',
    constraints: '-10^6 <= X, Y, Z <= 10^6',
    sampleCases: [
      { input: 'X = 15, Y = 42, Z = 9', output: '42' }
    ],
    hints: [
      'Compare X with Y and Z.',
      'If X is greater than or equal to Y and Z, then X is maximum.',
      'Else if Y is greater than or equal to Z, then Y is maximum. Otherwise Z is maximum.'
    ],
    expectedKeywords: ['compare', 'greater', 'maximum', 'if', 'else if', 'print']
  },
  {
    id: 'prob-201',
    number: 201,
    title: 'Array Reversal Logic',
    slug: 'array-reversal-logic',
    difficulty: 'Intermediate',
    category: 'Arrays & Two Pointers',
    tags: ['Arrays', 'Two Pointers', 'Swapping', 'Loops'],
    acceptanceRate: '79.4%',
    points: 120,
    description: `Formulate a logical algorithm using two pointers (left and right) to reverse an array of N elements in-place.`,
    inputFormat: 'An array ARR of size N.',
    outputFormat: 'The array ARR with elements in reversed order.',
    constraints: '1 <= N <= 10^5',
    sampleCases: [
      { input: 'ARR = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' }
    ],
    hints: [
      'Initialize left pointer at index 0 and right pointer at index N - 1.',
      'While left pointer is less than right pointer:',
      'Swap ARR[left] and ARR[right].',
      'Increment left pointer by 1 and decrement right pointer by 1.'
    ],
    expectedKeywords: ['pointer', 'left', 'right', 'swap', 'loop', 'increment', 'decrement']
  },
  {
    id: 'prob-202',
    number: 202,
    title: 'Binary Search Logic',
    slug: 'binary-search-logic',
    difficulty: 'Intermediate',
    category: 'Searching Algorithms',
    tags: ['Binary Search', 'Arrays', 'Divide & Conquer'],
    acceptanceRate: '74.1%',
    points: 150,
    description: `Describe the logarithmic search process to find the target element T in a sorted array ARR. Output index if found, else -1.`,
    inputFormat: 'Sorted array ARR of size N, target T.',
    outputFormat: 'Index of T in ARR, or -1 if not found.',
    constraints: '1 <= N <= 10^5',
    sampleCases: [
      { input: 'ARR = [2, 5, 8, 12, 16], T = 12', output: '3' }
    ],
    hints: [
      'Set low = 0 and high = N - 1.',
      'While low <= high, calculate mid = (low + high) / 2.',
      'If ARR[mid] equals T, return mid.',
      'If ARR[mid] < T, update low = mid + 1. Else update high = mid - 1.'
    ],
    expectedKeywords: ['low', 'high', 'mid', 'binary search', 'sorted', 'divide', 'return']
  },
  {
    id: 'prob-203',
    number: 203,
    title: 'Palindrome String Verification',
    slug: 'palindrome-string-verification',
    difficulty: 'Intermediate',
    category: 'Strings & Parsing',
    tags: ['Strings', 'Two Pointers', 'Validation'],
    acceptanceRate: '82.0%',
    points: 100,
    description: `Design a logic workflow to check if a string S reads the same forwards and backwards, ignoring non-alphanumeric characters.`,
    inputFormat: 'A string S.',
    outputFormat: 'Boolean: true if palindrome, false otherwise.',
    constraints: '1 <= |S| <= 10^5',
    sampleCases: [
      { input: 'S = "racecar"', output: 'true' },
      { input: 'S = "hello"', output: 'false' }
    ],
    hints: [
      'Filter out non-alphanumeric characters and convert to lowercase.',
      'Compare characters from front and back towards middle.',
      'If all pairs match, return true.'
    ],
    expectedKeywords: ['string', 'lowercase', 'match', 'front', 'back', 'palindrome']
  },
  {
    id: 'prob-301',
    number: 301,
    title: 'Dijkstra Shortest Path Logic',
    slug: 'dijkstra-shortest-path',
    difficulty: 'Hard',
    category: 'Graph Algorithms',
    tags: ['Graphs', 'Dijkstra', 'Priority Queue', 'Greedy'],
    acceptanceRate: '61.3%',
    points: 250,
    description: `Construct the step-by-step logic for Dijkstra's Algorithm to find the shortest distance from a start node S to all other nodes in a weighted graph with non-negative edge weights.`,
    inputFormat: 'Graph G with V vertices, E edges, starting node S.',
    outputFormat: 'Array of shortest distances from S to each node.',
    constraints: '1 <= V <= 10^4, 0 <= edge weight <= 10^5',
    sampleCases: [
      { input: 'V = 4, S = 0, Edges = [(0,1,4), (0,2,1), (2,1,2)]', output: 'Distances: [0, 3, 1, inf]' }
    ],
    hints: [
      'Initialize distance array with infinity for all nodes except dist[S] = 0.',
      'Use a Min-Priority Queue to track (distance, node). Push (0, S).',
      'Pop node with smallest distance, iterate over neighbors, relax edge distances.'
    ],
    expectedKeywords: ['graph', 'distance', 'priority queue', 'min-heap', 'relax', 'infinity', 'shortest']
  },
  {
    id: 'prob-302',
    number: 302,
    title: 'LRU Cache Eviction Policy Logic',
    slug: 'lru-cache-eviction-policy',
    difficulty: 'Hard',
    category: 'System & Data Structures',
    tags: ['LRU Cache', 'Doubly Linked List', 'Hash Map', 'Design'],
    acceptanceRate: '58.7%',
    points: 300,
    description: `Specify the detailed logic for an LRU (Least Recently Used) Cache supporting get(key) and put(key, value) operations in O(1) time complexity.`,
    inputFormat: 'Cache Capacity K and sequence of get/put operations.',
    outputFormat: 'Retrieved values and updated cache state.',
    constraints: '1 <= Capacity K <= 10^4',
    sampleCases: [
      { input: 'Capacity = 2, put(1,1), put(2,2), get(1), put(3,3)', output: 'Key 2 evicted, get(1) returns 1' }
    ],
    hints: [
      'Combine a HashMap (for O(1) lookup) with a Doubly Linked List (for O(1) order manipulation).',
      'When getting or updating a key, move its node to the head (most recently used).',
      'When capacity exceeds K on put, evict node at tail (least recently used).'
    ],
    expectedKeywords: ['hashmap', 'doubly linked list', 'head', 'tail', 'evict', 'capacity', 'most recently used']
  }
];

export const SUPPORTED_LANGUAGES = [
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'python3', name: 'Python3' },
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'csharp', name: 'C#' },
  { id: 'c', name: 'C' },
  { id: 'go', name: 'Go' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'swift', name: 'Swift' },
  { id: 'rust', name: 'Rust' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'php', name: 'PHP' },
  { id: 'dart', name: 'Dart' },
  { id: 'scala', name: 'Scala' },
  { id: 'elixir', name: 'Elixir' },
  { id: 'erlang', name: 'Erlang' },
  { id: 'racket', name: 'Racket' },
];
