import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      category, 
      topic, 
      subtopic, 
      difficulty, 
      questionCount = 5,
      testType = 'practice'
    } = await request.json()

    if (!category || !topic || !difficulty) {
      return NextResponse.json({ 
        error: 'Category, topic, and difficulty are required' 
      }, { status: 400 })
    }

    console.log('Generating questions:', { category, topic, subtopic, difficulty, questionCount })

    // Generate prompt based on configuration
    const prompt = generateQuestionPrompt(category, topic, subtopic, difficulty, questionCount, testType)
    
    console.log('Generated prompt:', prompt)

    // Call Gemini API directly
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      console.log('No Gemini API key found, using fallback questions')
      return NextResponse.json({
        questions: generateFallbackQuestions(category, topic, subtopic, difficulty, questionCount),
        source: 'fallback',
        message: 'No API key configured'
      })
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      
      // Try with a different model if gemini-1.5-flash fails
      if (errorData.error?.code === 404) {
        console.log('Trying with gemini-1.5-pro model...')
        const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        })
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          const generatedText = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || ''
          const generatedQuestions = parseGeneratedQuestions(generatedText, questionCount)

          return NextResponse.json({
            questions: generatedQuestions,
            source: 'gemini-fallback',
            configuration: { category, topic, subtopic, difficulty, questionCount, testType }
          })
        }
      }
      
      // Return fallback questions if API fails
      return NextResponse.json({
        questions: generateFallbackQuestions(category, topic, subtopic, difficulty, questionCount),
        source: 'fallback',
        message: 'Using fallback questions due to API error'
      })
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('Gemini response text:', generatedText.substring(0, 1000) + '...')
    console.log('Full response length:', generatedText.length)
    const generatedQuestions = parseGeneratedQuestions(generatedText, questionCount)
    console.log('Parsed questions:', generatedQuestions.length, 'questions')
    
    // If parsing failed, return fallback questions
    if (generatedQuestions.length === 0) {
      console.log('No questions parsed, using fallback questions')
      return NextResponse.json({
        questions: generateFallbackQuestions(category, topic, subtopic, difficulty, questionCount),
        source: 'fallback-parsing-failed',
        configuration: { category, topic, subtopic, difficulty, questionCount, testType }
      })
    }

    return NextResponse.json({
      questions: generatedQuestions,
      source: 'gemini',
      configuration: { category, topic, subtopic, difficulty, questionCount, testType }
    })

  } catch (error) {
    console.error('Question generation error:', error)
    
    // Return fallback questions on error
    const { category, topic, subtopic, difficulty, questionCount = 5 } = await request.json().catch(() => ({}))
    
    return NextResponse.json({
      questions: generateFallbackQuestions(category, topic, subtopic, difficulty, questionCount),
      source: 'fallback',
      message: 'Using fallback questions due to error'
    })
  }
}

function generateQuestionPrompt(category: string, topic: string, subtopic: string, difficulty: string, questionCount: number, testType: string) {
  const difficultyLevel = difficulty === 'easy' ? 'beginner' : difficulty === 'medium' ? 'intermediate' : 'advanced'
  const timeContext = testType === 'timed' ? 'with time constraints' : 'for practice without time pressure'
  
  return `Generate ${questionCount} coding questions for a ${difficultyLevel} level ${category} test focused on ${topic}${subtopic && subtopic !== 'all' ? ` specifically ${subtopic}` : ''}.

Requirements:
1. Each question should be ${difficultyLevel} difficulty
2. Questions should be ${timeContext}
3. Include clear problem statements with examples
4. Provide test cases with expected outputs
5. Include constraints and edge cases
6. Make questions practical and interview-relevant

For each question, provide:
- Title (concise, descriptive)
- Description (clear problem statement)
- Examples (2-3 with input/output/explanation)
- Constraints (time/space complexity, input limits)
- Test cases (3-5 with input and expected output in comma-separated format, e.g., "1,2,3" not "[1,2,3]")
- Category (${topic})
- Difficulty (${difficulty})

Format as JSON array with this structure:
[
  {
    "id": 1,
    "title": "Question Title",
    "description": "Detailed problem description...",
    "examples": [
      {
        "input": "example input",
        "output": "example output", 
        "explanation": "explanation"
      }
    ],
    "constraints": ["constraint 1", "constraint 2"],
    "testCases": [
      {"input": "test input", "expected": "expected output"}
    ],
    "category": "${topic}",
    "difficulty": "${difficulty}",
    "solutions": {
      "javascript": "function solution(input) { /* Parse comma-separated input and solve */ }",
      "python": "def solution(input): /* Parse comma-separated input and solve */",
      "java": "public String solution(String input) { /* Parse comma-separated input and solve */ }",
      "cpp": "string solution(string input) { /* Parse comma-separated input and solve */ }",
      "csharp": "public string Solution(string input) { /* Parse comma-separated input and solve */ }",
      "go": "func solution(input string) string { /* Parse comma-separated input and solve */ }",
      "rust": "fn solution(input: &str) -> String { /* Parse comma-separated input and solve */ }"
    }
  }
]

IMPORTANT JSON FORMATTING RULES:
1. All strings must be properly escaped with double quotes
2. No unescaped quotes inside string values
3. Use \\n for newlines, \\t for tabs
4. Escape all quotes in code solutions with backslashes
5. Ensure the entire response is valid JSON
6. DO NOT wrap the response in markdown code blocks
7. Return ONLY the JSON array, nothing else

Make sure the JSON is valid and properly formatted. Return ONLY the JSON array without any markdown formatting.`
}

function parseGeneratedQuestions(response: string, expectedCount: number) {
  try {
    console.log('Parsing response, length:', response.length)
    // Clean the response first
    let cleanedResponse = response.trim()
    console.log('Cleaned response start:', cleanedResponse.substring(0, 100))
    
    // Check if response is wrapped in markdown code blocks
    if (cleanedResponse.startsWith('```json') && cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(7, -3).trim()
      console.log('Removed json markdown wrapper')
    } else if (cleanedResponse.startsWith('```') && cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3, -3).trim()
      console.log('Removed markdown wrapper')
    }
    
    // Try to extract JSON from the response
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      let jsonString = jsonMatch[0]
      console.log('Found JSON match, length:', jsonString.length)
      
      // More robust JSON fixing
      try {
        const questions = JSON.parse(jsonString)
        console.log('Successfully parsed JSON, found', questions.length, 'questions')
        return questions.slice(0, expectedCount)
      } catch (parseError: any) {
        console.log('First parse attempt failed:', parseError.message)
        console.log('JSON string start:', jsonString.substring(0, 200))
        
        // Try to fix common JSON issues
        jsonString = jsonString
          .replace(/\n/g, '\\n')  // Escape newlines
          .replace(/\t/g, '\\t')  // Escape tabs
          .replace(/\r/g, '\\r')  // Escape carriage returns
          .replace(/([^\\])"/g, '$1\\"')  // Escape unescaped quotes
          .replace(/^"/, '\\"')    // Escape leading quote
          .replace(/"$/, '\\"')    // Escape trailing quote
          .replace(/\\n/g, '\\n')  // Ensure newlines are properly escaped
          .replace(/\\t/g, '\\t')  // Ensure tabs are properly escaped
          .replace(/\\"/g, '\\"')  // Ensure quotes are properly escaped
        
        try {
          const questions = JSON.parse(jsonString)
          console.log('Second parse attempt successful, found', questions.length, 'questions')
          return questions.slice(0, expectedCount)
        } catch (secondError: any) {
          console.log('Second parse attempt failed:', secondError.message)
          console.log('Fixed JSON string start:', jsonString.substring(0, 200))
          
          // Try to manually extract questions using regex
          const questionMatches = jsonString.match(/\{[^{}]*"id"[^{}]*\}/g)
          if (questionMatches) {
            console.log('Found', questionMatches.length, 'question matches using regex')
            const questions = questionMatches.map((match, index) => {
              try {
                return JSON.parse(match)
              } catch {
                return {
                  id: index + 1,
                  title: `Question ${index + 1}`,
                  description: "Generated question",
                  examples: [],
                  constraints: [],
                  testCases: [],
                  category: "Generated",
                  difficulty: "Easy",
                  solutions: {
                    javascript: "function solution(input) { return input; }",
                    python: "def solution(input): return input",
                    java: "public int solution(int input) { return input; }",
                    cpp: "int solution(int input) { return input; }",
                    csharp: "public int Solution(int input) { return input; }",
                    go: "func solution(input int) int { return input }",
                    rust: "fn solution(input: i32) -> i32 { input }"
                  }
                }
              }
            })
            return questions.slice(0, expectedCount)
          }
        }
      }
    } else {
      console.log('No JSON array found in response')
    }
    
    // If no JSON found, try to parse the entire response
    const questions = JSON.parse(cleanedResponse)
    return Array.isArray(questions) ? questions.slice(0, expectedCount) : []
  } catch (error) {
    console.error('Error parsing generated questions:', error)
    console.error('Response that failed to parse:', response.substring(0, 500) + '...')
    return []
  }
}

function generateFallbackQuestions(category: string, topic: string, subtopic: string, difficulty: string, questionCount: number) {
  const fallbackQuestions: any = {
    'dsa': {
      'arrays': [
        {
          id: 1,
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          examples: [
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            }
          ],
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
          ],
          testCases: [
            { input: "2,7,11,15 9", expected: "0,1" },
            { input: "3,2,4 6", expected: "1,2" },
            { input: "3,3 6", expected: "0,1" }
          ],
          category: topic,
          difficulty: difficulty,
          solutions: {
            javascript: `// Complete solution for Two Sum problem
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Parse input and format output for test cases
function solution(input) {
    const parts = input.split(' ');
    const nums = parts[0].split(',').map(Number);
    const target = parseInt(parts[1]);
    const result = twoSum(nums, target);
    return result.join(',');
}

// Test the function
console.log(solution("2,7,11,15 9")); // Output: 0,1
console.log(solution("3,2,4 6"));     // Output: 1,2
console.log(solution("3,3 6"));       // Output: 0,1`,
            python: `# Complete solution for Two Sum problem
def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []

# Parse input and format output for test cases
def solution(input_str):
    parts = input_str.split(' ')
    nums = [int(x) for x in parts[0].split(',')]
    target = int(parts[1])
    result = twoSum(nums, target)
    return ','.join(map(str, result))

# Test the function
print(solution("2,7,11,15 9"))  # Output: 0,1
print(solution("3,2,4 6"))      # Output: 1,2
print(solution("3,3 6"))        # Output: 0,1`,
            java: `// Complete solution for Two Sum problem
import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
    
    public String solution(String input) {
        String[] parts = input.split(" ");
        String[] numStrs = parts[0].split(",");
        int[] nums = new int[numStrs.length];
        for (int i = 0; i < numStrs.length; i++) {
            nums[i] = Integer.parseInt(numStrs[i]);
        }
        int target = Integer.parseInt(parts[1]);
        int[] result = twoSum(nums, target);
        return result[0] + "," + result[1];
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.solution("2,7,11,15 9")); // Output: 0,1
        System.out.println(sol.solution("3,2,4 6"));     // Output: 1,2
        System.out.println(sol.solution("3,3 6"));       // Output: 0,1
    }
}`,
            cpp: `// Complete solution for Two Sum problem
#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

string solution(string input) {
    stringstream ss(input);
    string numStr, targetStr;
    ss >> numStr >> targetStr;
    
    vector<int> nums;
    stringstream numStream(numStr);
    string num;
    while (getline(numStream, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    int target = stoi(targetStr);
    vector<int> result = twoSum(nums, target);
    return to_string(result[0]) + "," + to_string(result[1]);
}

int main() {
    cout << solution("2,7,11,15 9") << endl; // Output: 0,1
    cout << solution("3,2,4 6") << endl;     // Output: 1,2
    cout << solution("3,3 6") << endl;       // Output: 0,1
    return 0;
}`,
            csharp: `// Complete solution for Two Sum problem
using System;
using System.Collections.Generic;

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (map.ContainsKey(complement)) {
                return new int[] { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return new int[0];
    }
    
    public string solution(string input) {
        string[] parts = input.Split(' ');
        string[] numStrs = parts[0].Split(',');
        int[] nums = Array.ConvertAll(numStrs, int.Parse);
        int target = int.Parse(parts[1]);
        int[] result = TwoSum(nums, target);
        return result[0] + "," + result[1];
    }
    
    public static void Main(string[] args) {
        Solution sol = new Solution();
        Console.WriteLine(sol.solution("2,7,11,15 9")); // Output: 0,1
        Console.WriteLine(sol.solution("3,2,4 6"));     // Output: 1,2
        Console.WriteLine(sol.solution("3,3 6"));       // Output: 0,1
    }
}`,
            go: `// Complete solution for Two Sum problem
package main

import (
    "fmt"
    "strconv"
    "strings"
)

func twoSum(nums []int, target int) []int {
    hashMap := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if index, exists := hashMap[complement]; exists {
            return []int{index, i}
        }
        hashMap[num] = i
    }
    return []int{}
}

func solution(input string) string {
    parts := strings.Split(input, " ")
    numStrs := strings.Split(parts[0], ",")
    nums := make([]int, len(numStrs))
    for i, numStr := range numStrs {
        nums[i], _ = strconv.Atoi(numStr)
    }
    target, _ := strconv.Atoi(parts[1])
    result := twoSum(nums, target)
    return fmt.Sprintf("%d,%d", result[0], result[1])
}

func main() {
    fmt.Println(solution("2,7,11,15 9")) // Output: 0,1
    fmt.Println(solution("3,2,4 6"))     // Output: 1,2
    fmt.Println(solution("3,3 6"))       // Output: 0,1
}`,
            rust: `// Complete solution for Two Sum problem
use std::collections::HashMap;

fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&index) = map.get(&complement) {
            return vec![index, i as i32];
        }
        map.insert(num, i as i32);
    }
    vec![]
}

fn solution(input: &str) -> String {
    let parts: Vec<&str> = input.split(' ').collect();
    let num_strs: Vec<&str> = parts[0].split(',').collect();
    let nums: Vec<i32> = num_strs.iter().map(|s| s.parse().unwrap()).collect();
    let target: i32 = parts[1].parse().unwrap();
    let result = two_sum(nums, target);
    format!("{},{}", result[0], result[1])
}

fn main() {
    println!("{}", solution("2,7,11,15 9")); // Output: 0,1
    println!("{}", solution("3,2,4 6"));     // Output: 1,2
    println!("{}", solution("3,3 6"));       // Output: 0,1
}`
          }
        },
        {
          id: 2,
          title: "Best Time to Buy and Sell Stock",
          description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
          examples: [
            {
              input: "prices = [7,1,5,3,6,4]",
              output: "5",
              explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
            }
          ],
          constraints: [
            "1 <= prices.length <= 10^5",
            "0 <= prices[i] <= 10^4"
          ],
          testCases: [
            { input: "7,1,5,3,6,4", expected: "5" },
            { input: "7,6,4,3,1", expected: "0" },
            { input: "1,2", expected: "1" }
          ],
          category: topic,
          difficulty: difficulty,
          solutions: {
            javascript: `function maxProfit(prices) {
    let minPrice = prices[0];
    let maxProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}

function solution(input) {
    const prices = input.split(',').map(Number);
    return maxProfit(prices).toString();
}`,
            python: `def maxProfit(prices):
    min_price = prices[0]
    max_profit = 0
    
    for price in prices[1:]:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    
    return max_profit

def solution(input_str):
    prices = [int(x) for x in input_str.split(',')]
    return str(maxProfit(prices))`,
            java: `public int maxProfit(int[] prices) {
    int minPrice = prices[0];
    int maxProfit = 0;
    
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}

public String solution(String input) {
    String[] priceStrs = input.split(",");
    int[] prices = new int[priceStrs.length];
    for (int i = 0; i < priceStrs.length; i++) {
        prices[i] = Integer.parseInt(priceStrs[i]);
    }
    return String.valueOf(maxProfit(prices));
}`,
            cpp: `int maxProfit(vector<int>& prices) {
    int minPrice = prices[0];
    int maxProfit = 0;
    
    for (int i = 1; i < prices.size(); i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}

string solution(string input) {
    stringstream ss(input);
    string priceStr;
    vector<int> prices;
    while (getline(ss, priceStr, ',')) {
        prices.push_back(stoi(priceStr));
    }
    return to_string(maxProfit(prices));
}`,
            csharp: `public int MaxProfit(int[] prices) {
    int minPrice = prices[0];
    int maxProfit = 0;
    
    for (int i = 1; i < prices.Length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}

public string solution(string input) {
    string[] priceStrs = input.Split(',');
    int[] prices = Array.ConvertAll(priceStrs, int.Parse);
    return MaxProfit(prices).ToString();
}`,
            go: `func maxProfit(prices []int) int {
    minPrice := prices[0]
    maxProfit := 0
    
    for i := 1; i < len(prices); i++ {
        if prices[i] < minPrice {
            minPrice = prices[i]
        } else if prices[i] - minPrice > maxProfit {
            maxProfit = prices[i] - minPrice
        }
    }
    
    return maxProfit
}

func solution(input string) string {
    priceStrs := strings.Split(input, ",")
    prices := make([]int, len(priceStrs))
    for i, priceStr := range priceStrs {
        prices[i], _ = strconv.Atoi(priceStr)
    }
    return strconv.Itoa(maxProfit(prices))
}`,
            rust: `fn max_profit(prices: Vec<i32>) -> i32 {
    let mut min_price = prices[0];
    let mut max_profit = 0;
    
    for &price in &prices[1..] {
        if price < min_price {
            min_price = price;
        } else if price - min_price > max_profit {
            max_profit = price - min_price;
        }
    }
    
    max_profit
}

fn solution(input: &str) -> String {
    let prices: Vec<i32> = input.split(',').map(|s| s.parse().unwrap()).collect();
    max_profit(prices).to_string()
}`
          }
        }
      ],
      'strings': [
        {
          id: 1,
          title: "Valid Parentheses",
          description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
          examples: [
            {
              input: 's = "()"',
              output: "true",
              explanation: "The string contains valid parentheses."
            }
          ],
          constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
          ],
          testCases: [
            { input: '"()"', expected: "true" },
            { input: '"()[]{}"', expected: "true" },
            { input: '"(]"', expected: "false" }
          ],
          category: topic,
          difficulty: difficulty,
          solutions: {
            javascript: `function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in map) {
            if (stack.length === 0 || stack.pop() !== map[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
            python: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
            java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> map = new HashMap<>();
    map.put(')', '(');
    map.put('}', '{');
    map.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (map.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != map.get(c)) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}`,
            cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> map = {
        {')', '('},
        {'}', '{'},
        {']', '['}
    };
    
    for (char c : s) {
        if (map.count(c)) {
            if (st.empty() || st.top() != map[c]) {
                return false;
            }
            st.pop();
        } else {
            st.push(c);
        }
    }
    
    return st.empty();
}`,
            csharp: `public bool IsValid(string s) {
    var stack = new Stack<char>();
    var map = new Dictionary<char, char> {
        {')', '('},
        {'}', '{'},
        {']', '['}
    };
    
    foreach (char c in s) {
        if (map.ContainsKey(c)) {
            if (stack.Count == 0 || stack.Pop() != map[c]) {
                return false;
            }
        } else {
            stack.Push(c);
        }
    }
    
    return stack.Count == 0;
}`,
            go: `func isValid(s string) bool {
    stack := []rune{}
    mapping := map[rune]rune{
        ')': '(',
        '}': '{',
        ']': '[',
    }
    
    for _, char := range s {
        if closing, exists := mapping[char]; exists {
            if len(stack) == 0 || stack[len(stack)-1] != closing {
                return false
            }
            stack = stack[:len(stack)-1]
        } else {
            stack = append(stack, char)
        }
    }
    
    return len(stack) == 0
}`,
            rust: `fn is_valid(s: String) -> bool {
    let mut stack = Vec::new();
    let map: std::collections::HashMap<char, char> = [
        (')', '('),
        ('}', '{'),
        (']', '['),
    ].iter().cloned().collect();
    
    for c in s.chars() {
        if let Some(&opening) = map.get(&c) {
            if stack.pop() != Some(opening) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    
    stack.is_empty()
}`
          }
        }
      ],
      'linked-lists': [
        {
          id: 1,
          title: "Reverse Linked List",
          description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
          examples: [
            {
              input: "head = [1,2,3,4,5]",
              output: "[5,4,3,2,1]",
              explanation: "The linked list is reversed."
            }
          ],
          constraints: [
            "The number of nodes in the list is the range [0, 5000]",
            "-5000 <= Node.val <= 5000"
          ],
          testCases: [
            { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" },
            { input: "[1,2]", expected: "[2,1]" },
            { input: "[]", expected: "[]" }
          ],
          category: topic,
          difficulty: difficulty,
          solutions: {
            javascript: `function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
            python: `def reverseList(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev`,
            java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
            cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current != nullptr) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
            csharp: `public ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}`,
            go: `func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    current := head
    
    for current != nil {
        next := current.Next
        current.Next = prev
        prev = current
        current = next
    }
    
    return prev
}`,
            rust: `fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    let mut current = head;
    
    while let Some(mut node) = current {
        let next = node.next.take();
        node.next = prev;
        prev = Some(node);
        current = next;
    }
    
    prev
}`
          }
        }
      ]
    },
    'database': {
      'basic-queries': [
        {
          id: 1,
          title: "Second Highest Salary",
          description: "Write a SQL query to get the second highest salary from the Employee table.",
          examples: [
            {
              input: "Employee table with id, salary columns",
              output: "200",
              explanation: "The second highest salary is 200."
            }
          ],
          constraints: [
            "If there is no second highest salary, return null",
            "Use standard SQL syntax"
          ],
          testCases: [
            { input: "Employee table with salaries [100, 200, 300]", expected: "200" },
            { input: "Employee table with salaries [100, 100]", expected: "null" }
          ],
          category: topic,
          difficulty: difficulty,
          solutions: {
            sql: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
            mysql: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
            postgresql: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`
          }
        }
      ]
    }
  }

  const categoryQuestions = fallbackQuestions[category as keyof typeof fallbackQuestions]
  const topicQuestions = categoryQuestions?.[topic as keyof typeof categoryQuestions] || []
  
  // If no specific topic questions, return a generic question
  if (!topicQuestions || topicQuestions.length === 0) {
    return [{
      id: 1,
      title: "Sample Problem",
      description: `This is a sample ${difficulty} level problem for ${topic} in ${category}.`,
      examples: [
        {
          input: "Sample input",
          output: "Sample output",
          explanation: "This is how the solution works."
        }
      ],
      constraints: [
        "1 <= n <= 1000",
        "Use efficient algorithms"
      ],
      testCases: [
        { input: "test1", expected: "result1" },
        { input: "test2", expected: "result2" }
      ],
      category: topic,
      difficulty: difficulty,
      solutions: {
        javascript: `function solution(input) {
    // Your solution here
    return input;
}`,
        python: `def solution(input):
    # Your solution here
    return input`,
        java: `public int solution(int input) {
    // Your solution here
    return input;
}`,
        cpp: `int solution(int input) {
    // Your solution here
    return input;
}`,
        csharp: `public int Solution(int input) {
    // Your solution here
    return input;
}`,
        go: `func solution(input int) int {
    // Your solution here
    return input
}`,
        rust: `fn solution(input: i32) -> i32 {
    // Your solution here
    input
}`
      }
    }]
  }
  
  return (topicQuestions as any[]).slice(0, questionCount)
}
