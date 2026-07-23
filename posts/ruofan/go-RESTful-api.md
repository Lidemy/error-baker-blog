---
title: a simple RESTful api with Go
description: "透過實作一個簡單的 RESTful API 認識 Golang：從安裝、go mod init 專案初始化、用 gorilla/mux 管理套件，到實作 main 與 handler function，適合想入門 Go 的人。"
date: 2022-01-01
tags: [Backend]
author: ruofan
layout: layouts/post.njk
image: /img/posts/ruofan/go-1.png
---
<!-- summary -->

迎接嶄新的一年，一起透過實作簡單的 restful api 來認識 Golang 吧！

<!-- summary -->

什麼是 Golang ? 以下是 Golang 官方文件 上的說明。

> Go is an open source programming language supported by Google

> Go is expressive, concise, clean, and efficient. Its concurrency mechanisms make it easy to write programs that get the most out of multicore and networked machines, while its novel type system enables flexible and modular program construction. Go compiles quickly to machine code yet has the convenience of garbage collection and the power of run-time reflection. It's a fast, statically typed, compiled language that feels like a dynamically typed, interpreted language.

#### install
在 [官方網站](https://go.dev/dl/) 安裝完成後，可以透過 `$ go version` 來確認是否安裝完成以及安裝的版本。

```bash
$go version
go version go1.17.5 darwin/amd64
```

#### init project
新增一個檔案夾， example: `go-project` ，接著在新增的檔案夾 `go mod init go-project`
這邊完成了初始化 project，並且會產生一個 `go.mod` 的檔案。

```bash
$go mod init go-project
go: creating new go.mod: module go-project
```
`go.mod` 檔案會紀錄 所有的 package，舉例來說：安裝了 `gorilla/mux` 這個 package。

```bash
$go get -u github.com/gorilla/mux
go get: added github.com/gorilla/mux v1.8.0
```
這時進入 `go.mod` 檔案會看到這邊紀錄了 `gorilla/mux` 最新的版本。

```go
module go-project

go 1.17

require github.com/gorilla/mux v1.8.0 // indirect
```
#### packages in Go
新增一個 `main.go` 的檔案來實作。
這邊第一行可以看到使用了 `package main` ，在不同的檔案中都會定義 `package packagename` ，而這邊的 `main` 是執行 `go application` 的入口點。

```go
package main
```
接著引入 `fmt package` 試著在 `main function` 印出資料。
```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello, Modules!")
}
```
在 `command line` 輸入 `go run main.go` 就會在 terminal 印出 `Hello, Modules! `
下一步，先來定義這次會用到的 data 結構。
從下方程式碼中，可以看到我們定義了 `Movie struct` 包含了 3 個 fields 以及一個 `Director struct`。

1. 這邊透過 `Struct Tags` 來定義，讓輸出的資料 id, isbn, title, director 為 Json 中的 key。
2. `*Director` 透過宣告一個 pointer 變數讓他的 type 是 `Director struct`。
```go
package main

import (
	"encoding/json"
)

type Movie struct {
	ID       string    `json:"id"`
	Isbn     string    `json:"isbn"`
	Title    string    `json:"title"`
	Director *Director `json:"director"`
}

type Director struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}
```
#### 實作 main func
1. 透過 `append function` 來新增兩筆假資料進入 `movies array`。
2. 透過 `net/http package` 中的 `ListenAndServe function starts an HTTP server`
    - `func ListenAndServe(addr string, handler Handler) error` 第一個參數接收一個 type 是 `string` 的 addr, 第二個參數接收一個 type 是 `Handler` 的 handler 處理進來的 request。
3. `gorilla/mux package` 中 `mux.Router `會讓進來的 request 對應到正確的 router，並且會去 call 對應到的 route 的 handler。
    - `r := mux.NewRouter()` 在這邊可以看到 `:=` 代表同時做了宣告和賦值兩件事。
4. `log.Fatal(http.ListenAndServe(":8000", r))` 如果有非預期的錯誤出現，在這邊會透過 `log.Fatal()` 印出來。
5. 透過 `r.HandleFunc()` 來實作 restful api。
```go
import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Movie struct {
	ID       string    `json:"id"`
	Isbn     string    `json:"isbn"`
	Title    string    `json:"title"`
	Director *Director `json:"director"`
}

type Director struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

var movies []Movie

func main() {
	r := mux.NewRouter()

	movies = append(movies, Movie{ID: "1", Isbn: "438227", Title: "Emily in Paris", Director: &Director{Firstname: "Michael", Lastname: "Amodio"}})
	movies = append(movies, Movie{ID: "2", Isbn: "438228", Title: "The Silent Sea", Director: &Director{Firstname: "Hang-yong", Lastname: "Choi"}})

	r.HandleFunc("/movies", getMovies).Methods("GET")
	r.HandleFunc("/movies/{id}", getMovie).Methods("GET")
	r.HandleFunc("/movies", createMovie).Methods("POST")
	r.HandleFunc("/movies/{id}", updateMovie).Methods("PUT")
	r.HandleFunc("/movies/{id}", deleteMovie).Methods("DELETE")

	fmt.Printf("Starting server at port 8000\n")
	log.Fatal(http.ListenAndServe(":8000", r))
}
```
#### 實作 handler func



1. `getMovies func` 的 type 是 `http.HandlerFunc` ，在 `http package` 文件上對 `type HandlerFunc` 的介紹是 ：

    > an adapter to allow the use of ordinary functions as HTTP handlers

    因此在這邊可以使用 `ServeHTTP()` 的方法，從相關的 [source code](https://github.com/golang/go/blob/f8a8a73096a4d36ce7d35e9643db89e669bbee1f/src/net/http/server.go#L2076) 可以看到這邊實作的方式相當簡潔。

    - 透過 `encoding/json package` 的 `func NewEncoder(w io.Writer) *Encoder` 方法讓 struct 解析成 Json。
2. `deleteMovie func` 中可以看到使用了 `gorilla/mux package` 的 `mux.Vars()` 方法取得我們在 route 設定的 id。
    - 在迴圈中透過 `range array`，我們可以拿到 array 中的 index 跟 value。
    - 這邊的 `movies[:index]` 透過 `slices` 方法將目標 index 移除。

3. `createMovie func` 中 `var movie Movie` 這邊宣告了一個 type 是 `Movie struct` 的變數 movie。
    - 透過 `strconv package` 中的 `strconv.Itoa()` 方法將 integer 轉成 string，搭配 `math/rand package` 的 `rand.Intn()` 方法產生亂數來製造出 id。
```go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"github.com/gorilla/mux"
)

type Movie struct {
	ID       string    `json:"id"`
	Isbn     string    `json:"isbn"`
	Title    string    `json:"title"`
	Director *Director `json:"director"`
}

type Director struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

var movies []Movie


func getMovies(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(movies)
}

func deleteMovie(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for index, item := range movies {
		if item.ID == params["id"] {
			movies = append(movies[:index], movies[index+1:]...)
			break
		}
	}
	json.NewEncoder(w).Encode((movies))
}

func getMovie(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for _, item := range movies {
		if item.ID == params["id"] {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
}

func createMovie(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var movie Movie
	_ = json.NewDecoder(r.Body).Decode(&movie)
	movie.ID = strconv.Itoa(rand.Intn(1000000))
	movies = append(movies, movie)
	json.NewEncoder(w).Encode(movie)
}

func updateMovie(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for index, item := range movies {
		if item.ID == params["id"] {
			movies = append(movies[:index], movies[index+1:]...)
			var movie Movie
			_ = json.NewDecoder(r.Body).Decode(&movie)
			movie.ID = params["id"]
			movies = append(movies, movie)
			json.NewEncoder(w).Encode(movie)
			return
		}
	}
}

func main() {
	r := mux.NewRouter()

	movies = append(movies, Movie{ID: "1", Isbn: "438227", Title: "Emily in Paris", Director: &Director{Firstname: "Michael", Lastname: "Amodio"}})
	movies = append(movies, Movie{ID: "2", Isbn: "438228", Title: "The Silent Sea", Director: &Director{Firstname: "Hang-yong", Lastname: "Choi"}})

	r.HandleFunc("/movies", getMovies).Methods("GET")
	r.HandleFunc("/movies/{id}", getMovie).Methods("GET")
	r.HandleFunc("/movies", createMovie).Methods("POST")
	r.HandleFunc("/movies/{id}", updateMovie).Methods("PUT")
	r.HandleFunc("/movies/{id}", deleteMovie).Methods("DELETE")

	fmt.Printf("Starting server at port 8000\n")
	log.Fatal(http.ListenAndServe(":8000", r))
}

```

打開 Insomnia call api 看一下吧！
![](/img/posts/ruofan/go-2.png)

## 小結

在實作過程中發現有相當多可以延伸與深入學習的地方，整體來說相當有趣！
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

- [Github | Repo: go-rest-api](https://github.com/ruofanwei/go-rest-api)

## 參考資料
- [Document | Writing Web Applications](https://golang.google.cn/doc/articles/wiki/)
- [Document | http](https://pkg.go.dev/net/http#Handler)
- [Document | Short variable declarations](https://go.dev/ref/spec#Short_variable_declarations)
- [golangbot | Arrays and Slices](https://golangbot.com/arrays-and-slices/)
- [digitalocean | How To Use Struct Tags in Go](https://www.digitalocean.com/community/tutorials/how-to-use-struct-tags-in-go)
- [Blog | What is Go lang func NewEncoder(w io.Writer) *Encoder?](https://www.educative.io/edpresso/what-is-go-lang-func-newencoderw-iowriter--starencoder)
- [Blog | An Introduction to Handlers and Servemuxes in Go](https://www.alexedwards.net/blog/an-introduction-to-handlers-and-servemuxes-in-go)
- [Blog | Go and JSON](https://eager.io/blog/go-and-json/)
