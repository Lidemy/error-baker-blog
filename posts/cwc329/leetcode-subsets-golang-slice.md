---
title: Leetcode Subsets and Golang Slice
date: 2024-08-28
tags: [golang, leetcode]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

最近在學習 golang 順便用它來練習一些演算法，沒想到就遇上了 golang 新手最常見的問題：slice 與 underlying array。本篇會帶到這題的解法，以及 golang 關於 slice 的一些基礎概念。

<!-- summary -->

# Leetcode Subsets Problem and Golang Slice

## Subsets Problem

[Leetcode 78. Subsets](https://leetcode.com/problems/subsets/description/) 給任意內容不重複的整數陣列，要求出所有這個陣列可能的子集合，
ex:

```go
subsets([]int{1,2}) // [[], [1], [2], [1,2]]
subsets([]int{}) // [[]]
```
這個題目可以使用 backtracking 去遍歷所有可能，讓每一個數字都有出現與不出現兩種選擇，這樣即可求出所有可能組合。
我第一個解法如下：

```go
func subsets(nums []int) [][]int {
	type Element struct {
		current []int
		layer   int
	}
	start := Element{current: []int{}, layer: 0}
	stack := []Element{start}

	results := [][]int{}

	for len(stack) > 0 {
		pop := stack[len(stack)-1]
		stack = stack[:len(stack)-1]

		layer := pop.layer
		current := pop.current

		if layer == len(nums) {
			results = append(results, current)
		} else {
			num := nums[layer]
			appended := append(current, num)
			stack = append(
				stack,
				Element{
					layer:   layer + 1,
					current: current,
				},
				Element{
					layer:   layer + 1,
					current: appended,
				},
			)
		}
	}

	return results
}
```

這個解法看似沒有問題，不過如果 input 的長度大於等於 5 的時候就會有問題。

```go
func main() {
  /**
  * [[1 2 3] [1 2] [1 3] [1] [2 3] [2] [3] []]
  */
	fmt.Println(subsets([]int{1, 2, 3}))
  /**
  *[[1 2 3 4] [1 2 3] [1 2 4] [1 2] [1 3 4] [1 3] [1 4] [1] [2 3 4] [2 3] [2 4] [2] [3 4] [3] [4] []]
  */
	fmt.Println(subsets([]int{1, 2, 3, 4}))
  /**
  * [
  *  [1 2 3 4 5]
  *  [1 2 3 5] [1 2 3 5] [1 2 3]
  *  [1 2 4 5] [1 2 4] [1 2 5]
  *  [1 2] [1 3 4 5] [1 3 4] [1 3 5] [1 3]
  *  [1 4 5] [1 4] [1 5] [1] [2 3 4 5] [2 3 4]
  *  [2 3 5] [2 3] [2 4 5] [2 4] [2 5] [2] [3 4 5] [3 4] [3 5] [3] [4 5] [4] [5] []
  * ]
  */
	fmt.Println(subsets([]int{1, 2, 3, 4, 5}))
}
```

可以看到在第三個 test case `[]int{1,2,3,4,5}` 本來應該是 `[1 2 3 4]`, `[1 2 3 5]` 的輸出變成重複的 `[1 2 3 5]`。

## Go Slice

我因為這個問題困擾頗久，後來在翻閱 [The Go Programming Language](https://www.gopl.io/) 這本書的 ch.4 時候找到可能的原因，就是 golang 的 slice 其實是指向一個 underlying array，slice 本身存有開始的 pointer 以及長度。
所以有可能我理想中的 `[1 2 3 4]` 與 `[1 2 3 5]` 就是都指向了同一個 underlying array，所以在 slice 長度相同的時候會出現一樣的 `[1 2 3 5]`。
為了求證，我把結果的每個 slice 的 underlying array address 都印出來看看：

```go
func main() {
	subset := subsets([]int{1, 2, 3, 4, 5})
	for _, val := range subset {
		printUnderlyingArray(val)
	}
  /**
  * 節錄 output:
  * Slice value: [1 2 3 5]
  * Underlying array value: [1 2 3 5]
  * Underlying array header: 0xc0000200c0
  * Slice value: [1 2 3 5]
  * Underlying array value: [1 2 3 5]
  * Underlying array header: 0xc0000200c0
  * Slice value: [1 2 3]
  * Underlying array value: [1 2 3 5]
  * Underlying array header: 0xc0000200c0
  */
}

func printUnderlyingArray[T any](slice []T) {
	// Get the pointer to the underlying array
	arrayPtr := unsafe.SliceData(slice)

	// Create a slice that points to the entire underlying array
	array := unsafe.Slice(arrayPtr, cap(slice))

	fmt.Println("Slice value:", slice)
	fmt.Println("Underlying array value:", array)
	fmt.Println("Underlying array header:", arrayPtr)
}
```

可以看到不但兩個 `[1 2 3 5]` 都是指向同一個 underlying array，就連 `[1 2 3]` 也是指向同一個。
為了更細部看到底發生什麼事情，我在回圈中找尋結果，以下是重點部分：

當從 stack pop 出 `{layer: 3, current: [1 2 3]}` 之後，會在 stack 放入 `{layer: 4, current: [1 2 3]}`, `{layer : 4, current: [1 2 3 4]}`，這時候 `[1 2 3]`, `[1 2 3 4]` 的 underlying array 都是一樣的。
經過幾次處理之後 stack 的上層數個元素為`[... {layer: 4, current: [1 2 3]} {layer: 5, current: [1 2 3 4]}]`，這次 pop 之後會把 `[1 2 3 4]` 放入 `results` 中，要注意此時 `[1 2 3 4]` 與 `[1 2 3]` 的 underlying array 還是一樣的。
接著要 pop 出 `{layer: 4, current: [1 2 3]}`，這次會在 stack 放入 `{layer: 5, current: [1 2 3]}`, `{layer: 5, current: [1 2 3 5]}`，就是在把 `5` append 到 `current` 的這個動作將 underlying array 的值變為 `[1 2 3 5]`，而原本已經在 results 裡面的 `[1 2 3 4]` 則因為指向同一個 underlying array 所以內容也變成 `[1 2 3 5]`。
這個現象可以用以下的程式碼示範：

```go
func poc() {
	arr := [4]int{1, 2, 3, 4}
	slice1 := arr[0:3]
	slice2 := arr[0:]
	fmt.Println("before")
	fmt.Println("slice1:", slice1)
	fmt.Println("slice2:", slice2)
	slice3 := append(slice1, 5)
	fmt.Println("after")
	fmt.Println("slice1:", slice1)
	fmt.Println("slice2:", slice2)
	fmt.Println("slice3:", slice3)
}
/**
* before
* slice1: [1 2 3]
* slice2: [1 2 3 4]
* after
* slice1: [1 2 3]
* slice2: [1 2 3 5]
* slice3: [1 2 3 5]
*/
```

上面的程式碼簡化整個過程，可以看到在沒有操作 slice2 的情況下，只是 append slice1 就可以改變 slice2 的值。因為 append 雖然會回傳一個新的 slice，但是並不保證使用一個新的 underlying array，而是會在新的 slice capacity 大於 underlying array 時才會創建一個新的 underlying array，而這個什麼時候會發生就是 golang 底層決定的。
解決這個問題的方法也很簡單，就是使用 golang 內建的 `copy` function 就可以創建一個使用不同 underlying array 的 slice，如此就能確保不會有意料之外的 side effect。
修正過後的程式碼為：

```go
func subsets(nums []int) [][]int {
	type Element struct {
		current []int
		layer   int
	}
	start := Element{current: []int{}, layer: 0}
	stack := []Element{start}

	results := [][]int{}

	for len(stack) > 0 {
		pop := stack[len(stack)-1]
		stack = stack[:len(stack)-1]

		layer := pop.layer
		current := pop.current

		if layer == len(nums) {
			results = append(results, current)
		} else {
			num := nums[layer]
			appended := make([]int, len(current))
			notAppended := make([]int, len(current))
			copy(notAppended, current)
			copy(appended, current)
      appended = append(appended, num)
			stack = append(
				stack,
				Element{
					layer:   layer + 1,
					current: appended,
				},
				Element{
					layer:   layer + 1,
					current: notAppended,
				},
			)
		}
	}

	return results
}
```

## Optimization

在修正 slice 造成的問題之後，leetcode 順利 AC，不過我發現一個有趣的地方。
我的執行時間為 1ms，在所有 solutions 中是 72% 左右，但是這題的分佈有點特別，另外大約還有 20% 左右是 0ms，這代表這段程式碼應該還可以執行得更快。
於是我再研究一下這段哪裡可以改進。這邊的優化也與 `copy` 與 `append` function 有關。
append slice 的時候，如果 underlying array 的 capacity 不夠，golang 就會另外創建一個有更多 capacity 的 underlying array。而 copy slice 的時候每次都會建立一個新的 underlying array。而建立新的 underlying array 是個比較花費資源的動作，優化可以從這邊著手。
首先避免 append 重複建立 underlying array，`results` 長度其實在拿到 inputs 的時候就可以推論出為 2\^n，n 為 inputs 的長度。所以可以在 results 宣告的時候指定長度，這樣就可以避免 results 超過原本 capacity 時重新建立 underlying array 的操作，兩者的差異可以用下面的程式碼測試：

```go
func main() {
	num := 1 << 10
	appendPredefinedLengthSlice(num)
	appendSlice(num)
}

func appendSlice(num int) {
	start := time.Now()
	slice := make([]int, 0)

	for i := 0; i < num; i++ {
		slice = append(slice, i)
	}

	elapsed := time.Since(start)
	fmt.Printf("append %d times to a 0 length slice took %s\n", num, elapsed)
}

func appendPredefinedLengthSlice(num int) {
	start := time.Now()
	slice := make([]int, 0, num)

	for i := 0; i < num; i++ {
		slice = append(slice, i)
	}

	elapsed := time.Since(start)
	fmt.Printf("append %d times to a %d length slice took %s\n", num, num, elapsed)
}
```

再來避免不必要的 copy，第一新增到 stack 時不用把兩個結果都 copy，只在新增數字時 copy slice 即可；第二只需要在新增到 results 前 copy slice。
優化後的程式碼為：

```go
func subsets(nums []int) [][]int {
	type Element struct {
		current []int
		layer   int
	}

	n := len(nums)
	totalSubsets := 1 << n // 2^n
	results := make([][]int, 0, totalSubsets)

	start := Element{current: make([]int, 0, n), layer: 0}
	stack := []Element{start}

	for len(stack) > 0 {
		pop := stack[len(stack)-1]
		stack = stack[:len(stack)-1]

		layer := pop.layer
		current := pop.current

		if layer == n {
			// Create a copy of current to avoid sharing slices
			result := make([]int, len(current))
			copy(result, current)
			results = append(results, result)
		} else {
			num := nums[layer]

			// Append num to current to form a new subset
			appended := make([]int, len(current)+1)
			copy(appended, current)
			appended[len(current)] = num

			// Push the new states to the stack
			stack = append(stack,
				Element{
					layer:   layer + 1,
					current: appended,
				},
				Element{
					layer:   layer + 1,
					current: current,
				},
			)
		}
	}

	return results
}
```

這份程式碼最後跑出 0ms，雖然不排除有機器的差異，因為優化前後的程式碼都曾跑到 1ms 過，不過 append 的差異從上面的測試中是可以得到明顯的差異。

## Conclusion

從這個題目我意外地親身體驗 golang slice 可能遇到的 side effect 以及一些可以做的簡單優化，算是有些額外的小收穫，簡單地記錄並且分享給大家。
