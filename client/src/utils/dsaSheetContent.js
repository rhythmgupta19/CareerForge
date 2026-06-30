// Company DSA Sheet curated questions: 20 most repeated questions in interviews.
// All challenges support C++, Java, Python, and JavaScript boilerplates, test cases, and solution matching.

export const getDsaSheetCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const sheetQuestions = {
    sheet_cp1: {
      title: 'Two Sum',
      subtitle: 'Google, Amazon, Meta, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/DRU_nIY4j4c?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Two Sum',
          desc: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.\n\nE.g. nums = [2,7,11,15], target = 9 -> return [0, 1]',
          constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
          functionName: 'twoSum',
          testCases: [
            { input: '[2,7,11,15], 9', expected: '[0,1]' },
            { input: '[3,2,4], 6', expected: '[1,2]' }
          ],
          hints: ['Try using a hashmap to store the complement of each element.', 'Keep track of elements you have already seen.'],
          bp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}`,
          sol: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> m;\n    for(int i=0; i<nums.size(); i++) {\n        int comp = target - nums[i];\n        if(m.count(comp)) return {m[comp], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}`
        },
        java: {
          title: 'Two Sum',
          desc: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.\n\nE.g. nums = [2,7,11,15], target = 9 -> return [0, 1]',
          constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
          functionName: 'twoSum',
          testCases: [
            { input: '[2,7,11,15], 9', expected: '[0,1]' },
            { input: '[3,2,4], 6', expected: '[1,2]' }
          ],
          hints: ['Use a HashMap to store values and indices.', 'Iterate through the array and search for target - nums[i] in map.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
          sol: `public static int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> m = new HashMap<>();\n    for(int i=0; i<nums.length; i++) {\n        int comp = target - nums[i];\n        if(m.containsKey(comp)) return new int[]{m.get(comp), i};\n        m.put(nums[i], i);\n    }\n    return new int[0];\n}`
        },
        python: {
          title: 'Two Sum',
          desc: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.\n\nE.g. nums = [2,7,11,15], target = 9 -> return [0, 1]',
          constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
          functionName: 'twoSum',
          testCases: [
            { input: '[2,7,11,15], 9', expected: '[0,1]' },
            { input: '[3,2,4], 6', expected: '[1,2]' }
          ],
          hints: ['Use a python dictionary as a hash table.', 'Iterate indices and search for target - val.'],
          bp: `def twoSum(nums: list, target: int) -> list:\n    # Write your code here\n    pass`,
          sol: `def twoSum(nums, target):\n    m = {}\n    for i, n in enumerate(nums):\n        comp = target - n\n        if comp in m: return [m[comp], i]\n        m[n] = i\n    return []`
        },
        javascript: {
          title: 'Two Sum',
          desc: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.\n\nE.g. nums = [2,7,11,15], target = 9 -> return [0, 1]',
          constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
          functionName: 'twoSum',
          testCases: [
            { input: '[2,7,11,15], 9', expected: '[0,1]' },
            { input: '[3,2,4], 6', expected: '[1,2]' }
          ],
          hints: ['Use a Map or JS object.', 'Iterate indices and match target - val.'],
          bp: `function twoSum(nums, target) {\n    // Write your code here\n    \n}`,
          sol: `function twoSum(nums, target) {\n    let m = new Map();\n    for(let i=0; i<nums.length; i++) {\n        let comp = target - nums[i];\n        if(m.has(comp)) return [m.get(comp), i];\n        m.set(nums[i], i);\n    }\n    return [];\n}`
        }
      }
    },
    sheet_cp2: {
      title: 'Best Time to Buy and Sell Stock',
      subtitle: 'Amazon, Microsoft, Google, Apple',
      videoEmbedUrl: 'https://www.youtube.com/embed/excAOcl19kk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Max Profit',
          desc: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nE.g. prices = [7,1,5,3,6,4] -> return 5 (buy on day 2 price=1, sell on day 5 price=6)',
          constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
          functionName: 'maxProfit',
          testCases: [
            { input: '[7,1,5,3,6,4]', expected: '5' },
            { input: '[7,6,4,3,1]', expected: '0' }
          ],
          hints: ['Keep track of the minimum price seen so far.', 'Compute profit for current day and update maxProfit.'],
          bp: `#include <vector>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // Write your code here\n    \n}`,
          sol: `int maxProfit(vector<int>& prices) {\n    int minPrice = 1e9, maxProf = 0;\n    for(int p : prices) {\n        minPrice = min(minPrice, p);\n        maxProf = max(maxProf, p - minPrice);\n    }\n    return maxProf;\n}`
        },
        java: {
          title: 'Max Profit',
          desc: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nE.g. prices = [7,1,5,3,6,4] -> return 5',
          constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
          functionName: 'maxProfit',
          testCases: [
            { input: '[7,1,5,3,6,4]', expected: '5' },
            { input: '[7,6,4,3,1]', expected: '0' }
          ],
          hints: ['Single pass dynamic programming.', 'Maintain a running minimum value.'],
          bp: `public class Solution {\n    public static int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int maxProfit(int[] prices) {\n    int minPrice = Integer.MAX_VALUE, maxProf = 0;\n    for(int p : prices) {\n        if(p < minPrice) minPrice = p;\n        else if(p - minPrice > maxProf) maxProf = p - minPrice;\n    }\n    return maxProf;\n}`
        },
        python: {
          title: 'Max Profit',
          desc: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nE.g. prices = [7,1,5,3,6,4] -> return 5',
          constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
          functionName: 'maxProfit',
          testCases: [
            { input: '[7,1,5,3,6,4]', expected: '5' },
            { input: '[7,6,4,3,1]', expected: '0' }
          ],
          hints: ['Keep tracking min price and max profit in loop.'],
          bp: `def maxProfit(prices: list) -> int:\n    # Write your code here\n    pass`,
          sol: `def maxProfit(prices):\n    min_p, max_prof = float('inf'), 0\n    for p in prices:\n        if p < min_p: min_p = p\n        elif p - min_p > max_prof: max_prof = p - min_p\n    return max_prof`
        },
        javascript: {
          title: 'Max Profit',
          desc: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nE.g. prices = [7,1,5,3,6,4] -> return 5',
          constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
          functionName: 'maxProfit',
          testCases: [
            { input: '[7,1,5,3,6,4]', expected: '5' },
            { input: '[7,6,4,3,1]', expected: '0' }
          ],
          hints: ['Track running min value and max profit.'],
          bp: `function maxProfit(prices) {\n    // Write your code here\n    \n}`,
          sol: `function maxProfit(prices) {\n    let minPrice = Infinity, maxProf = 0;\n    for(let p of prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProf = Math.max(maxProf, p - minPrice);\n    }\n    return maxProf;\n}`
        }
      }
    },
    sheet_cp3: {
      title: 'Contains Duplicate',
      subtitle: 'Amazon, Adobe, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/3OamzN90kQg?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Contains Duplicate',
          desc: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
          constraints: '1 <= nums.size() <= 10^5',
          functionName: 'containsDuplicate',
          testCases: [
            { input: '[1,2,3,1]', expected: 'true' },
            { input: '[1,2,3,4]', expected: 'false' }
          ],
          hints: ['Use an unordered_set to store seen values.', 'If value already exists in set, duplicate found.'],
          bp: `#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& nums) {\n    // Write your code here\n    \n}`,
          sol: `bool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    return s.size() < nums.size();\n}`
        },
        java: {
          title: 'Contains Duplicate',
          desc: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
          constraints: '1 <= nums.length <= 10^5',
          functionName: 'containsDuplicate',
          testCases: [
            { input: '[1,2,3,1]', expected: 'true' },
            { input: '[1,2,3,4]', expected: 'false' }
          ],
          hints: ['Use HashSet to track elements.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}`,
          sol: `public static boolean containsDuplicate(int[] nums) {\n    Set<Integer> s = new HashSet<>();\n    for(int n : nums) {\n        if(!s.add(n)) return true;\n    }\n    return false;\n}`
        },
        python: {
          title: 'Contains Duplicate',
          desc: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
          constraints: '1 <= len(nums) <= 10^5',
          functionName: 'containsDuplicate',
          testCases: [
            { input: '[1,2,3,1]', expected: 'true' },
            { input: '[1,2,3,4]', expected: 'false' }
          ],
          hints: ['Convert list to set and compare sizes.'],
          bp: `def containsDuplicate(nums: list) -> bool:\n    # Write your code here\n    pass`,
          sol: `def containsDuplicate(nums):\n    return len(set(nums)) < len(nums)`
        },
        javascript: {
          title: 'Contains Duplicate',
          desc: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
          constraints: '1 <= nums.length <= 10^5',
          functionName: 'containsDuplicate',
          testCases: [
            { input: '[1,2,3,1]', expected: 'true' },
            { input: '[1,2,3,4]', expected: 'false' }
          ],
          hints: ['Use ES6 Set class.'],
          bp: `function containsDuplicate(nums) {\n    // Write your code here\n    \n}`,
          sol: `function containsDuplicate(nums) {\n    return new Set(nums).size < nums.length;\n}`
        }
      }
    },
    sheet_cp4: {
      title: 'Product of Array Except Self',
      subtitle: 'Amazon, Microsoft, Facebook',
      videoEmbedUrl: 'https://www.youtube.com/embed/gReAturMcRs?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Product Except Self',
          desc: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Solve it in `O(N)` time without using the division operator.',
          constraints: '2 <= nums.length <= 10^5',
          functionName: 'productExceptSelf',
          testCases: [
            { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
            { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' }
          ],
          hints: ['Use prefix and suffix products in a single pass or two passes.', 'Store output in an array and accumulate suffix product from right.'],
          bp: `#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    // Write your code here\n    \n}`,
          sol: `vector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, 1);\n    for(int i=1; i<n; i++) res[i] = res[i-1] * nums[i-1];\n    int right = 1;\n    for(int i=n-1; i>=0; i--) {\n        res[i] *= right;\n        right *= nums[i];\n    }\n    return res;\n}`
        },
        java: {
          title: 'Product Except Self',
          desc: 'Given an array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements except `nums[i]`. No division operator allowed.',
          constraints: '2 <= nums.length <= 10^5',
          functionName: 'productExceptSelf',
          testCases: [
            { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
            { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' }
          ],
          hints: ['Left and Right product accumulations.'],
          bp: `public class Solution {\n    public static int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
          sol: `public static int[] productExceptSelf(int[] nums) {\n    int n = nums.length;\n    int[] res = new int[n];\n    res[0] = 1;\n    for(int i=1; i<n; i++) res[i] = res[i-1] * nums[i-1];\n    int right = 1;\n    for(int i=n-1; i>=0; i--) {\n        res[i] *= right;\n        right *= nums[i];\n    }\n    return res;\n}`
        },
        python: {
          title: 'Product Except Self',
          desc: 'Product of elements except self. No division operator allowed.',
          constraints: '2 <= len(nums) <= 10^5',
          functionName: 'productExceptSelf',
          testCases: [
            { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
            { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' }
          ],
          hints: ['Accumulate prefixes, then multiply suffixes backwards.'],
          bp: `def productExceptSelf(nums: list) -> list:\n    # Write your code here\n    pass`,
          sol: `def productExceptSelf(nums):\n    n = len(nums)\n    res = [1] * n\n    for i in range(1, n):\n        res[i] = res[i-1] * nums[i-1]\n    right = 1\n    for i in range(n-1, -1, -1):\n        res[i] *= right\n        right *= nums[i]\n    return res`
        },
        javascript: {
          title: 'Product Except Self',
          desc: 'Product of elements except self. No division operator allowed.',
          constraints: '2 <= nums.length <= 10^5',
          functionName: 'productExceptSelf',
          testCases: [
            { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
            { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' }
          ],
          hints: ['Accumulate prefixes, then multiply suffixes backwards.'],
          bp: `function productExceptSelf(nums) {\n    // Write your code here\n    \n}`,
          sol: `function productExceptSelf(nums) {\n    let n = nums.length;\n    let res = new Array(n).fill(1);\n    for(let i=1; i<n; i++) res[i] = res[i-1] * nums[i-1];\n    let right = 1;\n    for(let i=n-1; i>=0; i--) {\n        res[i] *= right;\n        right *= nums[i];\n    }\n    return res;\n}`
        }
      }
    },
    sheet_cp5: {
      title: 'Maximum Subarray (Kadane)',
      subtitle: 'Amazon, Microsoft, Google',
      videoEmbedUrl: 'https://www.youtube.com/embed/H5PvPRwUPng?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Maximum Subarray',
          desc: 'Given an integer array `nums`, find the subarray with the largest sum and return its sum. (Kadane\'s Algorithm).',
          constraints: '1 <= nums.length <= 10^5',
          functionName: 'maxSubArray',
          testCases: [
            { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
            { input: '[5,4,-1,7,8]', expected: '23' }
          ],
          hints: ['If running sum becomes negative, reset it to 0.', 'Keep track of the maximum sum observed.'],
          bp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your code here\n    \n}`,
          sol: `int maxSubArray(vector<int>& nums) {\n    int sum = 0, maxi = nums[0];\n    for(int n : nums) {\n        sum += n;\n        maxi = max(maxi, sum);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`
        },
        java: {
          title: 'Maximum Subarray',
          desc: 'Find the maximum subarray sum.',
          constraints: '1 <= nums.length <= 10^5',
          functionName: 'maxSubArray',
          testCases: [
            { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
            { input: '[5,4,-1,7,8]', expected: '23' }
          ],
          hints: ['Use Kadane\'s algorithm.'],
          bp: `public class Solution {\n    public static int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int maxSubArray(int[] nums) {\n    int sum = 0, maxi = nums[0];\n    for(int n : nums) {\n        sum += n;\n        if(sum > maxi) maxi = sum;\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`
        },
        python: {
          title: 'Maximum Subarray',
          desc: 'Find maximum subarray sum using Kadane\'s.',
          constraints: '1 <= len(nums) <= 10^5',
          functionName: 'maxSubArray',
          testCases: [
            { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
            { input: '[5,4,-1,7,8]', expected: '23' }
          ],
          hints: ['Iterate and maintain running sum and max sum.'],
          bp: `def maxSubArray(nums: list) -> int:\n    # Write your code here\n    pass`,
          sol: `def maxSubArray(nums):\n    sum_val, maxi = 0, nums[0]\n    for n in nums:\n        sum_val += n\n        if sum_val > maxi: maxi = sum_val\n        if sum_val < 0: sum_val = 0\n    return maxi`
        },
        javascript: {
          title: 'Maximum Subarray',
          desc: 'Find maximum subarray sum using Kadane\'s.',
          constraints: '1 <= nums.length <= 10^5',
          functionName: 'maxSubArray',
          testCases: [
            { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
            { input: '[5,4,-1,7,8]', expected: '23' }
          ],
          hints: ['Iterate and reset if negative.'],
          bp: `function maxSubArray(nums) {\n    // Write your code here\n    \n}`,
          sol: `function maxSubArray(nums) {\n    let sum = 0, maxi = nums[0];\n    for(let n of nums) {\n        sum += n;\n        maxi = Math.max(maxi, sum);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}`
        }
      }
    },
    sheet_cp6: {
      title: 'Reverse a Linked List',
      subtitle: 'Amazon, Microsoft, Adobe',
      videoEmbedUrl: 'https://www.youtube.com/embed/iRtLEoL-r-Y?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Reverse Linked List',
          desc: 'Given the head of a singly linked list, reverse the list, and return the reversed list. (Note: ListNode class is polyfilled with val and next).',
          constraints: '0 <= List.length <= 5000',
          functionName: 'reverseList',
          testCases: [
            { input: 'createList([1,2,3,4,5])', expected: 'createList([5,4,3,2,1])' },
            { input: 'createList([1,2])', expected: 'createList([2,1])' }
          ],
          hints: ['Maintain three pointers: prev, curr, next.', 'Change current node next pointer to point to previous.'],
          bp: `// ListNode* head is already parsed. Return the new head.\nListNode* reverseList(ListNode* head) {\n    // Write your code here\n    \n}`,
          sol: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while(curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`
        },
        java: {
          title: 'Reverse Linked List',
          desc: 'Reverse a singly linked list.',
          constraints: '0 <= List.length <= 5000',
          functionName: 'reverseList',
          testCases: [
            { input: 'createList([1,2,3,4,5])', expected: 'createList([5,4,3,2,1])' },
            { input: 'createList([1,2])', expected: 'createList([2,1])' }
          ],
          hints: ['Iterative reversal using pointers.'],
          bp: `public class Solution {\n    public static ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`,
          sol: `public static ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while(curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`
        },
        python: {
          title: 'Reverse Linked List',
          desc: 'Reverse a singly linked list.',
          constraints: '0 <= List.length <= 5000',
          functionName: 'reverseList',
          testCases: [
            { input: 'createList([1,2,3,4,5])', expected: 'createList([5,4,3,2,1])' },
            { input: 'createList([1,2])', expected: 'createList([2,1])' }
          ],
          hints: ['Swap pointers in loop.'],
          bp: `def reverseList(head: ListNode) -> ListNode:\n    # Write your code here\n    pass`,
          sol: `def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`
        },
        javascript: {
          title: 'Reverse Linked List',
          desc: 'Reverse a singly linked list.',
          constraints: '0 <= List.length <= 5000',
          functionName: 'reverseList',
          testCases: [
            { input: 'createList([1,2,3,4,5])', expected: 'createList([5,4,3,2,1])' },
            { input: 'createList([1,2])', expected: 'createList([2,1])' }
          ],
          hints: ['Swap references.'],
          bp: `function reverseList(head) {\n    // Write your code here\n    \n}`,
          sol: `function reverseList(head) {\n    let prev = null, curr = head;\n    while(curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`
        }
      }
    },
    sheet_cp7: {
      title: 'Detect Cycle in Linked List',
      subtitle: 'Amazon, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/aFitA8X1518?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Linked List Cycle',
          desc: 'Given the head of a linked list, determine if it has a cycle. Return `true` if there is a cycle, and `false` otherwise. (Uses Floyd\'s Tortoise and Hare algorithm).',
          constraints: '0 <= list length <= 10^4',
          functionName: 'hasCycle',
          testCases: [
            { input: 'createList([3,2,0,-4])', expected: 'false' } // no cycle created via plain array helper
          ],
          hints: ['Use two pointers: slow and fast.', 'Move slow by 1, fast by 2. If they meet, there is a cycle.'],
          bp: `bool hasCycle(ListNode* head) {\n    // Write your code here\n    \n}`,
          sol: `bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while(fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if(slow == fast) return true;\n    }\n    return false;\n}`
        },
        java: {
          title: 'Linked List Cycle',
          desc: 'Determine if a linked list contains a cycle.',
          constraints: '0 <= list length <= 10^4',
          functionName: 'hasCycle',
          testCases: [
            { input: 'createList([3,2,0,-4])', expected: 'false' }
          ],
          hints: ['Floyd\'s Cycle detection.'],
          bp: `public class Solution {\n    public static boolean hasCycle(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}`,
          sol: `public static boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while(fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if(slow == fast) return true;\n    }\n    return false;\n}`
        },
        python: {
          title: 'Linked List Cycle',
          desc: 'Determine if a linked list contains a cycle.',
          constraints: '0 <= list length <= 10^4',
          functionName: 'hasCycle',
          testCases: [
            { input: 'createList([3,2,0,-4])', expected: 'false' }
          ],
          hints: ['Two pointers logic.'],
          bp: `def hasCycle(head: ListNode) -> bool:\n    # Write your code here\n    pass`,
          sol: `def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False`
        },
        javascript: {
          title: 'Linked List Cycle',
          desc: 'Determine if a linked list contains a cycle.',
          constraints: '0 <= list length <= 10^4',
          functionName: 'hasCycle',
          testCases: [
            { input: 'createList([3,2,0,-4])', expected: 'false' }
          ],
          hints: ['Tortoise and hare pointers.'],
          bp: `function hasCycle(head) {\n    // Write your code here\n    \n}`,
          sol: `function hasCycle(head) {\n    let slow = head, fast = head;\n    while(fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if(slow === fast) return true;\n    }\n    return false;\n}`
        }
      }
    },
    sheet_cp8: {
      title: 'Merge Two Sorted Lists',
      subtitle: 'Amazon, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/Xb4sraKQV2o?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Merge Lists',
          desc: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
          constraints: '0 <= length of lists <= 1000',
          functionName: 'mergeTwoLists',
          testCases: [
            { input: 'createList([1,2,4]), createList([1,3,4])', expected: 'createList([1,1,2,3,4,4])' }
          ],
          hints: ['Create a dummy node to start the merged list.', 'Compare nodes of both lists, append the smaller one, and advance pointers.'],
          bp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your code here\n    \n}`,
          sol: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    ListNode dummy(0);\n    ListNode* tail = &dummy;\n    while(list1 && list2) {\n        if(list1->val <= list2->val) {\n            tail->next = list1;\n            list1 = list1->next;\n        } else {\n            tail->next = list2;\n            list2 = list2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = list1 ? list1 : list2;\n    return dummy.next;\n}`
        },
        java: {
          title: 'Merge Lists',
          desc: 'Merge two sorted linked lists.',
          constraints: '0 <= length of lists <= 1000',
          functionName: 'mergeTwoLists',
          testCases: [
            { input: 'createList([1,2,4]), createList([1,3,4])', expected: 'createList([1,1,2,3,4,4])' }
          ],
          hints: ['Use dummy node and tail pointer.'],
          bp: `public class Solution {\n    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n        return null;\n    }\n}`,
          sol: `public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    ListNode dummy = new ListNode(0);\n    ListNode tail = dummy;\n    while(list1 != null && list2 != null) {\n        if(list1.val <= list2.val) {\n            tail.next = list1;\n            list1 = list1.next;\n        } else {\n            tail.next = list2;\n            list2 = list2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = (list1 != null) ? list1 : list2;\n    return dummy.next;\n}`
        },
        python: {
          title: 'Merge Lists',
          desc: 'Merge two sorted lists.',
          constraints: '0 <= length of lists <= 1000',
          functionName: 'mergeTwoLists',
          testCases: [
            { input: 'createList([1,2,4]), createList([1,3,4])', expected: 'createList([1,1,2,3,4,4])' }
          ],
          hints: ['Splicing nodes.'],
          bp: `def mergeTwoLists(list1: ListNode, list2: ListNode) -> ListNode:\n    # Write your code here\n    pass`,
          sol: `def mergeTwoLists(list1, list2):\n    dummy = ListNode(0)\n    tail = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            tail.next = list1\n            list1 = list1.next\n        else:\n            tail.next = list2\n            list2 = list2.next\n        tail = tail.next\n    tail.next = list1 or list2\n    return dummy.next`
        },
        javascript: {
          title: 'Merge Lists',
          desc: 'Merge two sorted lists.',
          constraints: '0 <= length of lists <= 1000',
          functionName: 'mergeTwoLists',
          testCases: [
            { input: 'createList([1,2,4]), createList([1,3,4])', expected: 'createList([1,1,2,3,4,4])' }
          ],
          hints: ['Re-link next pointers.'],
          bp: `function mergeTwoLists(list1, list2) {\n    // Write your code here\n    \n}`,
          sol: `function mergeTwoLists(list1, list2) {\n    let dummy = new ListNode(0);\n    let tail = dummy;\n    while(list1 && list2) {\n        if(list1.val <= list2.val) {\n            tail.next = list1;\n            list1 = list1.next;\n        } else {\n            tail.next = list2;\n            list2 = list2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = list1 || list2;\n    return dummy.next;\n}`
        }
      }
    },
    sheet_cp9: {
      title: 'Valid Parentheses',
      subtitle: 'Amazon, Facebook, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/WKpHszpdfnM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Valid Parentheses',
          desc: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if: Open brackets must be closed by the same type of brackets, and brackets must be closed in the correct order.',
          constraints: '1 <= s.length <= 10^4',
          functionName: 'isValid',
          testCases: [
            { input: '"()"', expected: 'true' },
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Use a stack data structure.', 'Push opening brackets, check matching when seeing closing bracket.'],
          bp: `#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your code here\n    \n}`,
          sol: `bool isValid(string s) {\n    stack<char> st;\n    for(char c : s) {\n        if(c=='(' || c=='{' || c=='[') st.push(c);\n        else {\n            if(st.empty()) return false;\n            if(c==')' && st.top()!='(') return false;\n            if(c=='}' && st.top()!='{') return false;\n            if(c==']' && st.top()!='[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`
        },
        java: {
          title: 'Valid Parentheses',
          desc: 'Validate brackets string.',
          constraints: '1 <= s.length <= 10^4',
          functionName: 'isValid',
          testCases: [
            { input: '"()"', expected: 'true' },
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Stack operations.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}`,
          sol: `public static boolean isValid(String s) {\n    Stack<Character> st = new Stack<>();\n    for(char c : s.toCharArray()) {\n        if(c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if(st.isEmpty()) return false;\n            if(c == ')' && st.peek() != '(') return false;\n            if(c == '}' && st.peek() != '{') return false;\n            if(c == ']' && st.peek() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.isEmpty();\n}`
        },
        python: {
          title: 'Valid Parentheses',
          desc: 'Validate brackets string.',
          constraints: '1 <= len(s) <= 10^4',
          functionName: 'isValid',
          testCases: [
            { input: '"()"', expected: 'true' },
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Use python list as a stack.'],
          bp: `def isValid(s: str) -> bool:\n    # Write your code here\n    pass`,
          sol: `def isValid(s):\n    st = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in mapping:\n            top = st.pop() if st else '#'\n            if mapping[c] != top: return False\n        else: st.append(c)\n    return not st`
        },
        javascript: {
          title: 'Valid Parentheses',
          desc: 'Validate brackets string.',
          constraints: '1 <= s.length <= 10^4',
          functionName: 'isValid',
          testCases: [
            { input: '"()"', expected: 'true' },
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Use JS Array as Stack.'],
          bp: `function isValid(s) {\n    // Write your code here\n    \n}`,
          sol: `function isValid(s) {\n    let st = [];\n    for(let c of s) {\n        if(c==='(' || c==='{' || c==='[') st.push(c);\n        else {\n            if(st.length === 0) return false;\n            let top = st.pop();\n            if(c===')' && top!=='(') return false;\n            if(c==='}' && top!=='{') return false;\n            if(c===']' && top!=='[') return false;\n        }\n    }\n    return st.length === 0;\n}`
        }
      }
    },
    sheet_cp10: {
      title: 'Next Greater Element',
      subtitle: 'Amazon, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/V09NfaGf2Ao?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Next Greater Element',
          desc: 'Given an array `nums`, return an array representing the next greater element for each element. The next greater element of an element `x` is the first greater element to its right. If it does not exist, return -1.\n\nE.g. [1,3,2,4] -> return [3,4,4,-1]',
          constraints: '1 <= nums.length <= 10^4',
          functionName: 'nextGreaterElement',
          testCases: [
            { input: '[1,3,2,4]', expected: '[3,4,4,-1]' },
            { input: '[4,3,2,1]', expected: '[-1,-1,-1,-1]' }
          ],
          hints: ['Use a monotonic stack.', 'Iterate elements from right to left.'],
          bp: `#include <vector>\n#include <stack>\nusing namespace std;\n\nvector<int> nextGreaterElement(vector<int>& nums) {\n    // Write your code here\n    \n}`,
          sol: `vector<int> nextGreaterElement(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, -1);\n    stack<int> st;\n    for(int i=n-1; i>=0; i--) {\n        while(!st.empty() && st.top() <= nums[i]) st.pop();\n        if(!st.empty()) res[i] = st.top();\n        st.push(nums[i]);\n    }\n    return res;\n}`
        },
        java: {
          title: 'Next Greater Element',
          desc: 'Find the next greater element to the right.',
          constraints: '1 <= nums.length <= 10^4',
          functionName: 'nextGreaterElement',
          testCases: [
            { input: '[1,3,2,4]', expected: '[3,4,4,-1]' },
            { input: '[4,3,2,1]', expected: '[-1,-1,-1,-1]' }
          ],
          hints: ['Monotonic Stack.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static int[] nextGreaterElement(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
          sol: `public static int[] nextGreaterElement(int[] nums) {\n    int n = nums.length;\n    int[] res = new int[n];\n    Stack<Integer> st = new Stack<>();\n    for(int i=n-1; i>=0; i--) {\n        while(!st.isEmpty() && st.peek() <= nums[i]) st.pop();\n        res[i] = st.isEmpty() ? -1 : st.peek();\n        st.push(nums[i]);\n    }\n    return res;\n}`
        },
        python: {
          title: 'Next Greater Element',
          desc: 'Find next greater element.',
          constraints: '1 <= len(nums) <= 10^4',
          functionName: 'nextGreaterElement',
          testCases: [
            { input: '[1,3,2,4]', expected: '[3,4,4,-1]' },
            { input: '[4,3,2,1]', expected: '[-1,-1,-1,-1]' }
          ],
          hints: ['Backwards iteration with stack.'],
          bp: `def nextGreaterElement(nums: list) -> list:\n    # Write your code here\n    pass`,
          sol: `def nextGreaterElement(nums):\n    n = len(nums)\n    res = [-1] * n\n    st = []\n    for i in range(n-1, -1, -1):\n        while st and st[-1] <= nums[i]: st.pop()\n        if st: res[i] = st[-1]\n        st.append(nums[i])\n    return res`
        },
        javascript: {
          title: 'Next Greater Element',
          desc: 'Find next greater element.',
          constraints: '1 <= nums.length <= 10^4',
          functionName: 'nextGreaterElement',
          testCases: [
            { input: '[1,3,2,4]', expected: '[3,4,4,-1]' },
            { input: '[4,3,2,1]', expected: '[-1,-1,-1,-1]' }
          ],
          hints: ['Array pop operations.'],
          bp: `function nextGreaterElement(nums) {\n    // Write your code here\n    \n}`,
          sol: `function nextGreaterElement(nums) {\n    let n = nums.length;\n    let res = new Array(n).fill(-1);\n    let st = [];\n    for(let i=n-1; i>=0; i--) {\n        while(st.length > 0 && st[st.length-1] <= nums[i]) st.pop();\n        if(st.length > 0) res[i] = st[st.length-1];\n        st.push(nums[i]);\n    }\n    return res;\n}`
        }
      }
    },
    sheet_cp11: {
      title: 'Invert a Binary Tree',
      subtitle: 'Google, Amazon',
      videoEmbedUrl: 'https://www.youtube.com/embed/fKgZaGX-c4Y?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Invert Tree',
          desc: 'Given the root of a binary tree, invert the tree (swap left and right child recursively) and return its root. (Note: TreeNode class is polyfilled with val, left, and right).',
          constraints: '0 <= nodes <= 1000',
          functionName: 'invertTree',
          testCases: [
            { input: 'createTree([4,2,7,1,3,6,9])', expected: 'createTree([4,7,2,9,6,3,1])' }
          ],
          hints: ['Perform post-order or pre-order traversal.', 'Swap left and right pointers of the current node recursively.'],
          bp: `TreeNode* invertTree(TreeNode* root) {\n    // Write your code here\n    \n}`,
          sol: `TreeNode* invertTree(TreeNode* root) {\n    if(!root) return nullptr;\n    swap(root->left, root->right);\n    invertTree(root->left);\n    invertTree(root->right);\n    return root;\n}`
        },
        java: {
          title: 'Invert Tree',
          desc: 'Invert a binary tree.',
          constraints: '0 <= nodes <= 1000',
          functionName: 'invertTree',
          testCases: [
            { input: 'createTree([4,2,7,1,3,6,9])', expected: 'createTree([4,7,2,9,6,3,1])' }
          ],
          hints: ['Swap nodes recursively.'],
          bp: `public class Solution {\n    public static TreeNode invertTree(TreeNode root) {\n        // Write your code here\n        return null;\n    }\n}`,
          sol: `public static TreeNode invertTree(TreeNode root) {\n    if(root == null) return null;\n    TreeNode temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`
        },
        python: {
          title: 'Invert Tree',
          desc: 'Invert a binary tree.',
          constraints: '0 <= nodes <= 1000',
          functionName: 'invertTree',
          testCases: [
            { input: 'createTree([4,2,7,1,3,6,9])', expected: 'createTree([4,7,2,9,6,3,1])' }
          ],
          hints: ['Recursive swap.'],
          bp: `def invertTree(root: TreeNode) -> TreeNode:\n    # Write your code here\n    pass`,
          sol: `def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`
        },
        javascript: {
          title: 'Invert Tree',
          desc: 'Invert a binary tree.',
          constraints: '0 <= nodes <= 1000',
          functionName: 'invertTree',
          testCases: [
            { input: 'createTree([4,2,7,1,3,6,9])', expected: 'createTree([4,7,2,9,6,3,1])' }
          ],
          hints: ['Recursive swap.'],
          bp: `function invertTree(root) {\n    // Write your code here\n    \n}`,
          sol: `function invertTree(root) {\n    if(!root) return null;\n    let temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`
        }
      }
    },
    sheet_cp12: {
      title: 'Maximum Depth of Binary Tree',
      subtitle: 'Amazon, Goldman Sachs',
      videoEmbedUrl: 'https://www.youtube.com/embed/eD3tmO66aSE?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Max Depth',
          desc: 'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
          constraints: '0 <= nodes <= 10^4',
          functionName: 'maxDepth',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '3' },
            { input: 'createTree([1,null,2])', expected: '2' }
          ],
          hints: ['Return 0 if root is null.', 'Return 1 + max(depth of left, depth of right).'],
          bp: `int maxDepth(TreeNode* root) {\n    // Write your code here\n    \n}`,
          sol: `int maxDepth(TreeNode* root) {\n    if(!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}`
        },
        java: {
          title: 'Max Depth',
          desc: 'Find maximum depth of binary tree.',
          constraints: '0 <= nodes <= 10^4',
          functionName: 'maxDepth',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '3' },
            { input: 'createTree([1,null,2])', expected: '2' }
          ],
          hints: ['Depth calculation formula: 1 + Math.max(left, right).'],
          bp: `public class Solution {\n    public static int maxDepth(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int maxDepth(TreeNode root) {\n    if(root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`
        },
        python: {
          title: 'Max Depth',
          desc: 'Find maximum depth of binary tree.',
          constraints: '0 <= nodes <= 10^4',
          functionName: 'maxDepth',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '3' },
            { input: 'createTree([1,null,2])', expected: '2' }
          ],
          hints: ['1 + max(left, right) recursive step.'],
          bp: `def maxDepth(root: TreeNode) -> int:\n    # Write your code here\n    pass`,
          sol: `def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`
        },
        javascript: {
          title: 'Max Depth',
          desc: 'Find maximum depth of binary tree.',
          constraints: '0 <= nodes <= 10^4',
          functionName: 'maxDepth',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '3' },
            { input: 'createTree([1,null,2])', expected: '2' }
          ],
          hints: ['1 + Math.max(left, right) recursive step.'],
          bp: `function maxDepth(root) {\n    // Write your code here\n    \n}`,
          sol: `function maxDepth(root) {\n    if(!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`
        }
      }
    },
    sheet_cp13: {
      title: 'Lowest Common Ancestor in BST',
      subtitle: 'Amazon, Microsoft, Facebook',
      videoEmbedUrl: 'https://www.youtube.com/embed/cX_kPV_yS2Y?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'LCA of BST',
          desc: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes `p` and `q`. (Since it\'s a BST, LCA is the node where `p` and `q` split, or one is the LCA).',
          constraints: '2 <= nodes <= 10^5',
          functionName: 'lowestCommonAncestor',
          testCases: [
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 8', expected: '6' },
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 4', expected: '2' }
          ],
          hints: ['If both p and q are smaller than root, LCA is in left subtree.', 'If both are larger, LCA is in right subtree. Otherwise, current root is LCA.'],
          bp: `// inputs: root, p (value of p), q (value of q). Return LCA node value.\nint lowestCommonAncestor(TreeNode* root, int p, int q) {\n    // Write your code here\n    \n}`,
          sol: `int lowestCommonAncestor(TreeNode* root, int p, int q) {\n    if(!root) return 0;\n    if(root->val > p && root->val > q) return lowestCommonAncestor(root->left, p, q);\n    if(root->val < p && root->val < q) return lowestCommonAncestor(root->right, p, q);\n    return root->val;\n}`
        },
        java: {
          title: 'LCA of BST',
          desc: 'Find the lowest common ancestor node value in a BST.',
          constraints: '2 <= nodes <= 10^5',
          functionName: 'lowestCommonAncestor',
          testCases: [
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 8', expected: '6' },
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 4', expected: '2' }
          ],
          hints: ['Compare values in BST.'],
          bp: `public class Solution {\n    public static int lowestCommonAncestor(TreeNode root, int p, int q) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int lowestCommonAncestor(TreeNode root, int p, int q) {\n    if(root == null) return 0;\n    if(root.val > p && root.val > q) return lowestCommonAncestor(root.left, p, q);\n    if(root.val < p && root.val < q) return lowestCommonAncestor(root.right, p, q);\n    return root.val;\n}`
        },
        python: {
          title: 'LCA of BST',
          desc: 'Find the LCA value in a BST.',
          constraints: '2 <= nodes <= 10^5',
          functionName: 'lowestCommonAncestor',
          testCases: [
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 8', expected: '6' },
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 4', expected: '2' }
          ],
          hints: ['Traverse left or right dynamically.'],
          bp: `def lowestCommonAncestor(root: TreeNode, p: int, q: int) -> int:\n    # Write your code here\n    pass`,
          sol: `def lowestCommonAncestor(root, p, q):\n    if not root: return 0\n    if root.val > p and root.val > q: return lowestCommonAncestor(root.left, p, q)\n    if root.val < p and root.val < q: return lowestCommonAncestor(root.right, p, q)\n    return root.val`
        },
        javascript: {
          title: 'LCA of BST',
          desc: 'Find the LCA value in a BST.',
          constraints: '2 <= nodes <= 10^5',
          functionName: 'lowestCommonAncestor',
          testCases: [
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 8', expected: '6' },
            { input: 'createTree([6,2,8,0,4,7,9,null,null,3,5]), 2, 4', expected: '2' }
          ],
          hints: ['Compare node values.'],
          bp: `function lowestCommonAncestor(root, p, q) {\n    // Write your code here\n    \n}`,
          sol: `function lowestCommonAncestor(root, p, q) {\n    if(!root) return 0;\n    if(root.val > p && root.val > q) return lowestCommonAncestor(root.left, p, q);\n    if(root.val < p && root.val < q) return lowestCommonAncestor(root.right, p, q);\n    return root.val;\n}`
        }
      }
    },
    sheet_cp14: {
      title: 'Binary Tree Level Order Traversal',
      subtitle: 'Amazon, Microsoft, Bloomberg',
      videoEmbedUrl: 'https://www.youtube.com/embed/EoAsWbO7sqg?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Level Order',
          desc: 'Given the root of a binary tree, return the level order traversal of its nodes\' values as a 2D vector. (E.g. [3,9,20,null,null,15,7] -> [[3],[9,20],[15,7]])',
          constraints: '0 <= nodes <= 2000',
          functionName: 'levelOrder',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '[[3],[9,20],[15,7]]' }
          ],
          hints: ['Use a queue for breadth-first search (BFS).', 'Process nodes level by level using queue size.'],
          bp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n    // Write your code here\n    \n}`,
          sol: `vector<vector<int>> levelOrder(TreeNode* root) {\n    if(!root) return {};\n    vector<vector<int>> res;\n    queue<TreeNode*> q;\n    q.push(root);\n    while(!q.empty()) {\n        int sz = q.size();\n        vector<int> level;\n        for(int i=0; i<sz; i++) {\n            TreeNode* curr = q.front(); q.pop();\n            level.push_back(curr->val);\n            if(curr->left) q.push(curr->left);\n            if(curr->right) q.push(curr->right);\n        }\n        res.push_back(level);\n    }\n    return res;\n}`
        },
        java: {
          title: 'Level Order',
          desc: 'Level order traversal (BFS).',
          constraints: '0 <= nodes <= 2000',
          functionName: 'levelOrder',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '[[3],[9,20],[15,7]]' }
          ],
          hints: ['Queue BFS traversal.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
          sol: `public static List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> res = new ArrayList<>();\n    if(root == null) return res;\n    Queue<TreeNode> q = new LinkedList<>();\n    q.add(root);\n    while(!q.isEmpty()) {\n        int size = q.size();\n        List<Integer> level = new ArrayList<>();\n        for(int i=0; i<size; i++) {\n            TreeNode curr = q.poll();\n            level.add(curr.val);\n            if(curr.left != null) q.add(curr.left);\n            if(curr.right != null) q.add(curr.right);\n        }\n        res.add(level);\n    }\n    return res;\n}`
        },
        python: {
          title: 'Level Order',
          desc: 'Level order traversal.',
          constraints: '0 <= nodes <= 2000',
          functionName: 'levelOrder',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '[[3],[9,20],[15,7]]' }
          ],
          hints: ['BFS using collections.deque.'],
          bp: `def levelOrder(root: TreeNode) -> list:\n    # Write your code here\n    pass`,
          sol: `def levelOrder(root):\n    if not root: return []\n    res = []\n    q = [root]\n    while q:\n        level = []\n        next_q = []\n        for node in q:\n            level.append(node.val)\n            if node.left: next_q.append(node.left)\n            if node.right: next_q.append(node.right)\n        res.append(level)\n        q = next_q\n    return res`
        },
        javascript: {
          title: 'Level Order',
          desc: 'Level order traversal.',
          constraints: '0 <= nodes <= 2000',
          functionName: 'levelOrder',
          testCases: [
            { input: 'createTree([3,9,20,null,null,15,7])', expected: '[[3],[9,20],[15,7]]' }
          ],
          hints: ['BFS using arrays.'],
          bp: `function levelOrder(root) {\n    // Write your code here\n    \n}`,
          sol: `function levelOrder(root) {\n    if(!root) return [];\n    let res = [];\n    let q = [root];\n    while(q.length > 0) {\n        let size = q.length;\n        let level = [];\n        for(let i=0; i<size; i++) {\n            let curr = q.shift();\n            level.push(curr.val);\n            if(curr.left) q.push(curr.left);\n            if(curr.right) q.push(curr.right);\n        }\n        res.push(level);\n    }\n    return res;\n}`
        }
      }
    },
    sheet_cp15: {
      title: 'Number of Islands',
      subtitle: 'Amazon, Google, Microsoft, Meta',
      videoEmbedUrl: 'https://www.youtube.com/embed/muncqlKJ8ZY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Number of Islands',
          desc: 'Given an `m x n` 2D binary grid `grid` which represents a map of `1`s (land) and `0`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nE.g. grid = [["1","1","0"],["1","1","0"],["0","0","1"]] -> return 2',
          constraints: '1 <= m, n <= 100',
          functionName: 'numIslands',
          testCases: [
            { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3' }
          ],
          hints: ['Use Depth-First Search (DFS) or BFS to visit nodes.', 'Mark visited land by turning "1" to "0".'],
          bp: `#include <vector>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n    // Write your code here\n    \n}`,
          sol: `void dfs(vector<vector<char>>& grid, int r, int c) {\n    if(r<0 || r>=grid.size() || c<0 || c>=grid[0].size() || grid[r][c] == '0') return;\n    grid[r][c] = '0';\n    dfs(grid, r+1, c);\n    dfs(grid, r-1, c);\n    dfs(grid, r, c+1);\n    dfs(grid, r, c-1);\n}\nint numIslands(vector<vector<char>>& grid) {\n    int count = 0;\n    for(int r=0; r<grid.size(); r++) {\n        for(int c=0; c<grid[0].size(); c++) {\n            if(grid[r][c] == '1') {\n                count++;\n                dfs(grid, r, c);\n            }\n        }\n    }\n    return count;\n}`
        },
        java: {
          title: 'Number of Islands',
          desc: 'Find number of islands in grid.',
          constraints: '1 <= m, n <= 100',
          functionName: 'numIslands',
          testCases: [
            { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3' }
          ],
          hints: ['Recursively clear land elements (DFS).'],
          bp: `public class Solution {\n    public static int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `private static void dfs(char[][] grid, int r, int c) {\n    if(r<0 || r>=grid.length || c<0 || c>=grid[0].length || grid[r][c] == '0') return;\n    grid[r][c] = '0';\n    dfs(grid, r+1, c);\n    dfs(grid, r-1, c);\n    dfs(grid, r, c+1);\n    dfs(grid, r, c-1);\n}\npublic static int numIslands(char[][] grid) {\n    int count = 0;\n    for(int r=0; r<grid.length; r++) {\n        for(int c=0; c<grid[0].length; c++) {\n            if(grid[r][c] == '1') {\n                count++;\n                dfs(grid, r, c);\n            }\n        }\n    }\n    return count;\n}`
        },
        python: {
          title: 'Number of Islands',
          desc: 'Find number of islands in grid.',
          constraints: '1 <= m, n <= 100',
          functionName: 'numIslands',
          testCases: [
            { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3' }
          ],
          hints: ['Recursively clear land elements (DFS).'],
          bp: `def numIslands(grid: list) -> int:\n    # Write your code here\n    pass`,
          sol: `def numIslands(grid):\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r<0 or r>=m or c<0 or c>=n or grid[r][c] == '0': return\n        grid[r][c] = '0'\n        dfs(r+1, c)\n        dfs(r-1, c)\n        dfs(r, c+1)\n        dfs(r, c-1)\n    count = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == '1':\n                count += 1\n                dfs(r, c)\n    return count`
        },
        javascript: {
          title: 'Number of Islands',
          desc: 'Find number of islands in grid.',
          constraints: '1 <= m, n <= 100',
          functionName: 'numIslands',
          testCases: [
            { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3' }
          ],
          hints: ['DFS recursive approach.'],
          bp: `function numIslands(grid) {\n    // Write your code here\n    \n}`,
          sol: `function numIslands(grid) {\n    if(!grid || grid.length === 0) return 0;\n    let m = grid.length, n = grid[0].length;\n    function dfs(r, c) {\n        if(r<0 || r>=m || c<0 || c>=n || grid[r][c] === '0') return;\n        grid[r][c] = '0';\n        dfs(r+1, c);\n        dfs(r-1, c);\n        dfs(r, c+1);\n        dfs(r, c-1);\n    }\n    let count = 0;\n    for(let r=0; r<m; r++) {\n        for(let c=0; c<n; c++) {\n            if(grid[r][c] === '1') {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    return count;\n}`
        }
      }
    },
    sheet_cp16: {
      title: 'Path Exists in Graph',
      subtitle: 'Facebook, Google',
      videoEmbedUrl: 'https://www.youtube.com/embed/f2EfG57Rq3Y?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Path in Graph',
          desc: 'Given an bi-directional graph represented by the number of nodes `n` and a 2D array of `edges` (where `edges[i] = [u, v]`), find if there is a valid path from `source` to `destination`. Return `true` if exists, `false` otherwise.',
          constraints: '1 <= n <= 10^4\n0 <= edges.length <= 2*10^4',
          functionName: 'validPath',
          testCases: [
            { input: '3, [[0,1],[1,2],[2,0]], 0, 2', expected: 'true' },
            { input: '6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5', expected: 'false' }
          ],
          hints: ['Build an adjacency list first.', 'Run DFS/BFS starting from the source and check if you can visit the destination.'],
          bp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nbool validPath(int n, vector<vector<int>>& edges, int source, int destination) {\n    // Write your code here\n    \n}`,
          sol: `bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {\n    if(source == destination) return true;\n    vector<vector<int>> adj(n);\n    for(auto& e : edges) {\n        adj[e[0]].push_back(e[1]);\n        adj[e[1]].push_back(e[0]);\n    }\n    vector<bool> vis(n, false);\n    queue<int> q;\n    q.push(source);\n    vis[source] = true;\n    while(!q.empty()) {\n        int curr = q.front(); q.pop();\n        if(curr == destination) return true;\n        for(int nxt : adj[curr]) {\n            if(!vis[nxt]) {\n                vis[nxt] = true;\n                q.push(nxt);\n            }\n        }\n    }\n    return false;\n}`
        },
        java: {
          title: 'Path in Graph',
          desc: 'Determine if a path exists from source to destination in graph.',
          constraints: '1 <= n <= 10^4',
          functionName: 'validPath',
          testCases: [
            { input: '3, [[0,1],[1,2],[2,0]], 0, 2', expected: 'true' },
            { input: '6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5', expected: 'false' }
          ],
          hints: ['BFS traversal from source.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static boolean validPath(int n, int[][] edges, int source, int destination) {\n        // Write your code here\n        return false;\n    }\n}`,
          sol: `public static boolean validPath(int n, int[][] edges, int source, int destination) {\n    if(source == destination) return true;\n    List<List<Integer>> adj = new ArrayList<>();\n    for(int i=0; i<n; i++) adj.add(new ArrayList<>());\n    for(int[] e : edges) {\n        adj.get(e[0]).add(e[1]);\n        adj.get(e[1]).add(e[0]);\n    }\n    boolean[] vis = new boolean[n];\n    Queue<Integer> q = new LinkedList<>();\n    q.add(source);\n    vis[source] = true;\n    while(!q.isEmpty()) {\n        int curr = q.poll();\n        if(curr == destination) return true;\n        for(int nxt : adj.get(curr)) {\n            if(!vis[nxt]) {\n                vis[nxt] = true;\n                q.add(nxt);\n            }\n        }\n    }\n    return false;\n}`
        },
        python: {
          title: 'Path in Graph',
          desc: 'Determine if path exists.',
          constraints: '1 <= n <= 10^4',
          functionName: 'validPath',
          testCases: [
            { input: '3, [[0,1],[1,2],[2,0]], 0, 2', expected: 'true' },
            { input: '6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5', expected: 'false' }
          ],
          hints: ['Graph BFS.'],
          bp: `def validPath(n: int, edges: list, source: int, destination: int) -> bool:\n    # Write your code here\n    pass`,
          sol: `def validPath(n, edges, source, destination):\n    if source == destination: return True\n    adj = {i: [] for i in range(n)}\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    vis = [False] * n\n    q = [source]\n    vis[source] = True\n    for curr in q:\n        if curr == destination: return True\n        for nxt in adj[curr]:\n            if not vis[nxt]:\n                vis[nxt] = True\n                q.append(nxt)\n    return False`
        },
        javascript: {
          title: 'Path in Graph',
          desc: 'Determine if path exists.',
          constraints: '1 <= n <= 10^4',
          functionName: 'validPath',
          testCases: [
            { input: '3, [[0,1],[1,2],[2,0]], 0, 2', expected: 'true' },
            { input: '6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5', expected: 'false' }
          ],
          hints: ['Array BFS.'],
          bp: `function validPath(n, edges, source, destination) {\n    // Write your code here\n    \n}`,
          sol: `function validPath(n, edges, source, destination) {\n    if(source === destination) return true;\n    let adj = Array.from({ length: n }, () => []);\n    for(let [u, v] of edges) {\n        adj[u].push(v);\n        adj[v].push(u);\n    }\n    let vis = new Array(n).fill(false);\n    let q = [source];\n    vis[source] = true;\n    while(q.length > 0) {\n        let curr = q.shift();\n        if(curr === destination) return true;\n        for(let nxt of adj[curr]) {\n            if(!vis[nxt]) {\n                vis[nxt] = true;\n                q.push(nxt);\n            }\n        }\n    }\n    return false;\n}`
        }
      }
    },
    sheet_cp17: {
      title: 'Climbing Stairs',
      subtitle: 'Amazon, Adobe, Google',
      videoEmbedUrl: 'https://www.youtube.com/embed/A617IOwlq7E?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Climbing Stairs',
          desc: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
          constraints: '1 <= n <= 45',
          functionName: 'climbStairs',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['This is identical to finding the n-th Fibonacci number.', 'Formula: ways(n) = ways(n-1) + ways(n-2).'],
          bp: `int climbStairs(int n) {\n    // Write your code here\n    \n}`,
          sol: `int climbStairs(int n) {\n    if(n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for(int i=3; i<=n; i++) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`
        },
        java: {
          title: 'Climbing Stairs',
          desc: 'Calculate ways to climb stairs.',
          constraints: '1 <= n <= 45',
          functionName: 'climbStairs',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['Fibonacci relationship.'],
          bp: `public class Solution {\n    public static int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int climbStairs(int n) {\n    if(n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for(int i=3; i<=n; i++) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`
        },
        python: {
          title: 'Climbing Stairs',
          desc: 'Calculate ways to climb stairs.',
          constraints: '1 <= n <= 45',
          functionName: 'climbStairs',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['Bottom-up memoization.'],
          bp: `def climbStairs(n: int) -> int:\n    # Write your code here\n    pass`,
          sol: `def climbStairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1): a, b = b, a+b\n    return b`
        },
        javascript: {
          title: 'Climbing Stairs',
          desc: 'Calculate ways to climb stairs.',
          constraints: '1 <= n <= 45',
          functionName: 'climbStairs',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['Fibonacci relationship.'],
          bp: `function climbStairs(n) {\n    // Write your code here\n    \n}`,
          sol: `function climbStairs(n) {\n    if(n <= 2) return n;\n    let a = 1, b = 2;\n    for(let i=3; i<=n; i++) {\n        let c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`
        }
      }
    },
    sheet_cp18: {
      title: 'Coin Change',
      subtitle: 'Amazon, Microsoft, Goldman Sachs',
      videoEmbedUrl: 'https://www.youtube.com/embed/HGYgy8WYyfU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Coin Change',
          desc: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.',
          constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
          functionName: 'coinChange',
          testCases: [
            { input: '[1,2,5], 11', expected: '3' }, // 5 + 5 + 1
            { input: '[2], 3', expected: '-1' }
          ],
          hints: ['Use dynamic programming (DP).', 'Define dp[i] as the minimum coins needed to make amount i.'],
          bp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    // Write your code here\n    \n}`,
          sol: `int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, 1e9);\n    dp[0] = 0;\n    for(int i=1; i<=amount; i++) {\n        for(int c : coins) {\n            if(i >= c) dp[i] = min(dp[i], 1 + dp[i-c]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`
        },
        java: {
          title: 'Coin Change',
          desc: 'Find minimum number of coins to form amount.',
          constraints: '1 <= coins.length <= 12',
          functionName: 'coinChange',
          testCases: [
            { input: '[1,2,5], 11', expected: '3' },
            { input: '[2], 3', expected: '-1' }
          ],
          hints: ['Bottom-up Dynamic Programming.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n}`,
          sol: `public static int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for(int i=1; i<=amount; i++) {\n        for(int c : coins) {\n            if(i >= c) dp[i] = Math.min(dp[i], 1 + dp[i-c]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`
        },
        python: {
          title: 'Coin Change',
          desc: 'Find minimum number of coins.',
          constraints: '1 <= coins.length <= 12',
          functionName: 'coinChange',
          testCases: [
            { input: '[1,2,5], 11', expected: '3' },
            { input: '[2], 3', expected: '-1' }
          ],
          hints: ['Populate DP array.'],
          bp: `def coinChange(coins: list, amount: int) -> int:\n    # Write your code here\n    pass`,
          sol: `def coinChange(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i >= c: dp[i] = min(dp[i], 1 + dp[i-c])\n    return -1 if dp[amount] == float('inf') else dp[amount]`
        },
        javascript: {
          title: 'Coin Change',
          desc: 'Find minimum coins.',
          constraints: '1 <= coins.length <= 12',
          functionName: 'coinChange',
          testCases: [
            { input: '[1,2,5], 11', expected: '3' },
            { input: '[2], 3', expected: '-1' }
          ],
          hints: ['Bottom-up DP.'],
          bp: `function coinChange(coins, amount) {\n    // Write your code here\n    \n}`,
          sol: `function coinChange(coins, amount) {\n    let dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for(let i=1; i<=amount; i++) {\n        for(let c of coins) {\n            if(i >= c) dp[i] = Math.min(dp[i], 1 + dp[i-c]);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`
        }
      }
    },
    sheet_cp19: {
      title: 'Longest Common Subsequence',
      subtitle: 'Amazon, Microsoft, Honeywell',
      videoEmbedUrl: 'https://www.youtube.com/embed/NPvvyJh-C_w?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'LCS length',
          desc: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
          constraints: '1 <= text1.length, text2.length <= 1000',
          functionName: 'longestCommonSubsequence',
          testCases: [
            { input: '"abcde", "ace"', expected: '3' },
            { input: '"abc", "def"', expected: '0' }
          ],
          hints: ['If characters match, lcs(i,j) = 1 + lcs(i-1,j-1).', 'Otherwise, lcs(i,j) = max(lcs(i-1,j), lcs(i,j-1)).'],
          bp: `#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint longestCommonSubsequence(string text1, string text2) {\n    // Write your code here\n    \n}`,
          sol: `int longestCommonSubsequence(string text1, string text2) {\n    int m = text1.size(), n = text2.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));\n    for(int i=1; i<=m; i++) {\n        for(int j=1; j<=n; j++) {\n            if(text1[i-1] == text2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}`
        },
        java: {
          title: 'LCS length',
          desc: 'Find length of Longest Common Subsequence.',
          constraints: '1 <= text1.length, text2.length <= 1000',
          functionName: 'longestCommonSubsequence',
          testCases: [
            { input: '"abcde", "ace"', expected: '3' },
            { input: '"abc", "def"', expected: '0' }
          ],
          hints: ['2D DP table.'],
          bp: `public class Solution {\n    public static int longestCommonSubsequence(String text1, String text2) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int longestCommonSubsequence(String text1, String text2) {\n    int m = text1.length(), n = text2.length();\n    int[][] dp = new int[m+1][n+1];\n    for(int i=1; i<=m; i++) {\n        for(int j=1; j<=n; j++) {\n            if(text1.charAt(i-1) == text2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];\n            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}`
        },
        python: {
          title: 'LCS length',
          desc: 'Find LCS length.',
          constraints: '1 <= len(text1), len(text2) <= 1000',
          functionName: 'longestCommonSubsequence',
          testCases: [
            { input: '"abcde", "ace"', expected: '3' },
            { input: '"abc", "def"', expected: '0' }
          ],
          hints: ['Grid DP tabulating overlaps.'],
          bp: `def longestCommonSubsequence(text1: str, text2: str) -> int:\n    # Write your code here\n    pass`,
          sol: `def longestCommonSubsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if text1[i-1] == text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]`
        },
        javascript: {
          title: 'LCS length',
          desc: 'Find LCS length.',
          constraints: '1 <= text1.length, text2.length <= 1000',
          functionName: 'longestCommonSubsequence',
          testCases: [
            { input: '"abcde", "ace"', expected: '3' },
            { input: '"abc", "def"', expected: '0' }
          ],
          hints: ['Iterative DP matrix.'],
          bp: `function longestCommonSubsequence(text1, text2) {\n    // Write your code here\n    \n}`,
          sol: `function longestCommonSubsequence(text1, text2) {\n    let m = text1.length, n = text2.length;\n    let dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));\n    for(let i=1; i<=m; i++) {\n        for(let j=1; j<=n; j++) {\n            if(text1[i-1] === text2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}`
        }
      }
    },
    sheet_cp20: {
      title: 'N Meetings in One Room',
      subtitle: 'Amazon, Microsoft',
      videoEmbedUrl: 'https://www.youtube.com/embed/zPtI8q9ALU8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Max Meetings',
          desc: 'There is one meeting room in a firm. There are `N` meetings in the form of `(start[i], end[i])`. Find the maximum number of meetings that can be accommodated in the meeting room, assuming that only one meeting can take place in the meeting room at a time.\n\nE.g. start = [1,3,0,5,8,5], end = [2,4,6,7,9,9] -> return 4 (meetings: [1,2], [3,4], [5,7], [8,9])',
          constraints: '1 <= N <= 10^5',
          functionName: 'maxMeetings',
          testCases: [
            { input: '[1,3,0,5,8,5], [2,4,6,7,9,9]', expected: '4' }
          ],
          hints: ['Sort meetings by their end times.', 'Iteratively select meetings whose start time is greater than the end time of the last selected meeting.'],
          bp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxMeetings(vector<int>& start, vector<int>& end) {\n    // Write your code here\n    \n}`,
          sol: `int maxMeetings(vector<int>& start, vector<int>& end) {\n    int n = start.size();\n    vector<pair<int, int>> meetings;\n    for(int i=0; i<n; i++) meetings.push_back({end[i], start[i]});\n    sort(meetings.begin(), meetings.end());\n    int count = 0, limit = -1;\n    for(auto m : meetings) {\n        if(m.second > limit) {\n            count++;\n            limit = m.first;\n        }\n    }\n    return count;\n}`
        },
        java: {
          title: 'Max Meetings',
          desc: 'Find maximum meetings to accommodate.',
          constraints: '1 <= N <= 10^5',
          functionName: 'maxMeetings',
          testCases: [
            { input: '[1,3,0,5,8,5], [2,4,6,7,9,9]', expected: '4' }
          ],
          hints: ['Greedy scheduling sorting by end times.'],
          bp: `import java.util.*;\n\npublic class Solution {\n    public static int maxMeetings(int[] start, int[] end) {\n        // Write your code here\n        return 0;\n    }\n}`,
          sol: `public static int maxMeetings(int[] start, int[] end) {\n    int n = start.length;\n    int[][] meetings = new int[n][2];\n    for(int i=0; i<n; i++) {\n        meetings[i][0] = start[i];\n        meetings[i][1] = end[i];\n    }\n    Arrays.sort(meetings, Comparator.comparingInt(a -> a[1]));\n    int count = 0, limit = -1;\n    for(int i=0; i<n; i++) {\n        if(meetings[i][0] > limit) {\n            count++;\n            limit = meetings[i][1];\n        }\n    }\n    return count;\n}`
        },
        python: {
          title: 'Max Meetings',
          desc: 'Find maximum meetings.',
          constraints: '1 <= N <= 10^5',
          functionName: 'maxMeetings',
          testCases: [
            { input: '[1,3,0,5,8,5], [2,4,6,7,9,9]', expected: '4' }
          ],
          hints: ['Greedy sorting by end time.'],
          bp: `def maxMeetings(start: list, end: list) -> int:\n    # Write your code here\n    pass`,
          sol: `def maxMeetings(start, end):\n    meetings = sorted(zip(start, end), key=lambda x: x[1])\n    count, limit = 0, -1\n    for s, e in meetings:\n        if s > limit:\n            count += 1\n            limit = e\n    return count`
        },
        javascript: {
          title: 'Max Meetings',
          desc: 'Find maximum meetings.',
          constraints: '1 <= N <= 10^5',
          functionName: 'maxMeetings',
          testCases: [
            { input: '[1,3,0,5,8,5], [2,4,6,7,9,9]', expected: '4' }
          ],
          hints: ['Sort by end times.'],
          bp: `function maxMeetings(start, end) {\n    // Write your code here\n    \n}`,
          sol: `function maxMeetings(start, end) {\n    let meetings = [];\n    for(let i=0; i<start.length; i++) {\n        meetings.push({ start: start[i], end: end[i] });\n    }\n    meetings.sort((a, b) => a.end - b.end);\n    let count = 0, limit = -1;\n    for(let m of meetings) {\n        if(m.start > limit) {\n            count++;\n            limit = m.end;\n        }\n    }\n    return count;\n}`
        }
      }
    }
  };

  const q = sheetQuestions[checkpointId];
  if (!q) return null;

  return {
    title: q.title,
    subtitle: q.subtitle,
    videoEmbedUrl: q.videoEmbedUrl,
    ...q.challenges[language]
  };
};
