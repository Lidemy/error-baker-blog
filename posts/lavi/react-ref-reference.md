---
title: React Ref 的一點研究
date: 2021-09-27
tags: [react]
author: Lavi
layout: layouts/post.njk
---

<!-- summary -->
<!-- 除了拿 DOM element 還有存變數外，更全面的了解 Ref 一點點 -->
<!-- summary -->
<!-- more -->

# React Ref 的一點研究

> A JavaScript library for building user interfaces

React 是狀態和 UI 的 Library 我們都知道，使用了 React 可以這樣思考：每一個狀態都會產生出對應的 UI。使用了 React 之後，就很少使用像是 DOM 的原生 API 來操作元素了，但還是會有需要直接從 DOM 元素取得資料或者是操作的情境，這時候就是使用 ref 的時候。

React ref 就是一個可以直接操作 DOM 的出口，透過 `createRef` / `useRef`，以及將 ref 作為 props 放入 DOM element ，能透過 ref 直接操作 DOM。就像下面 React [官方文件](https://reactjs.org/docs/hooks-reference.html#useref) 中 hooks 的範例：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

我們直接透過 `input.current`，來使用 DOM 的 method。雖然上面是 Hooks 的範例，但其實在 Class component 也沒什麼不同，只是從在 function 中宣告變數變成 class 的內部屬性而已。

```js
class TextInputWithFocusButton extends React.Component {
  constructor(props) {
    super(props);
    this.inutEl = React.createRef();  
	this.handleClick = this.handleClick.bind(this)
  }
  
  onButtonClick () {
	this.inputEl.current.focus();
  }
  
  render() {
    return <>
      <input ref={this.inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>  }
}
```

另外一個會用到的 ref 的地方是，當你希望儲存一個不會影響 ui 的狀態的時候。在 React 中，每次 state 的改變都會造成 Rerender，進而改變 UI，但並不是每次都會想要這樣。這時候就能夠把值儲存在 ref 裡面：

```js
function notRefreshCounter() {
	const counterRef = useRef(0);
	
	const onClick = () => {
		counterRef.current++	
	}	
	
	const onPrint = () => {
	
	}
	return <div>
		<button onClick=>add 1</button>
	</div>
}
```

好的，比較基本的用法大概就是這樣了，那可以來談談一些比較有趣的用法。

## Callback Ref

剛剛我們在使用 ref 的時候可以分為兩種用法
1. 透過將 ref 放入 react element（jsx 語法建立的）的 props，可以操作 element 上面的方法或者讀取屬性。
2. 儲存不影響 UI 的值。

雖然講的是 ref，但其實第一種用法我們是透過兩個東西來做到的：
- create Ref 的 API，不論是 `React.createRef` 還是 `React.useRef`
- React element 上面的  ref 屬性

然而 React element 的 ref 屬性除了接受 `createRef` / `useRef`  以外，還可以接受function 的形式，	並能夠帶來更大的彈性。

```js

function AutoSelectInput() {
  const [_, refresh] = useState()

  const autoFocus = (element) => {
    if (element) {
      element.focus()
    }
  }

  return (
    <div className="App">
      <input ref={autoFocus}/>
      <button onClick={refresh}>refresh</button>
    </div>
  );
}

```

上面是個應用 callback ref 的小小範例，改寫自 react 官方文件，除了 component 第一次被 render 時會 auto focus 之外。當按下 refresh 時（ `useState` 這樣的用法可以在 [React FAQ](https://zh-hant.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate) 中看到），整個 component 重新 render 也會自動 focus 在 input 上面。

callback ref 是什麼？從他的名字上面就可以知道他其實是一個 callback function，那麼會在什麼時候被執行？

> React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires.

[文件](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs)中裡面提到了， callback ref 會在兩種情況被呼叫。

- DOM element 被 mount 上 component 的時候：執行  `callbackRef(element)` 
- DOM element 被 unmount 的時候：執行 `callbackRef(null)`

在時機上，其實有點像 useEffect 的 callback 中 return 的 cleanup function，或者說是 componentDidMount 還有 componentDidUnmount 會更準確。

不過在[文件](https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
)中有使用 callback ref 的注意事項：

> If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn’t matter in most cases.

文件中提到如果使用 inline function 作為 callback ref 時，每次 rerender 都會呼叫兩次，一次是 callbackRef(null)，一次是 callbackRef(element)。原因是因為每次都會建立新的 function，所以要清理舊的 function 然後設定新的。

雖然我自己沒有很清楚為什麼清理舊的 function 就必須執行 callback。但這個原因讓我們在使用 callback ref 的時候需要注意這種情形：

```js
function InlineAutoSelectInput() {
	const [_, refresh] = useState()

	return (
	<div className="App">
	  <input ref={(element) => {
		element.focus()
	  }}/>
	  <button onClick={refresh}>refresh</button>
	</div>
	);
	
}

```

如果像上面那樣是會報錯的，因為在 rerender 時第一次時 element 為 null，當然沒有 focus 給你用。

隨後有提到一種解決方法，換成 class component，然後把 方法 bind 在 class 上面，~~但沒有人會想要再回去寫 Class component~~。

```js
export default class ClassComp extends Component {
  constructor(props) {
    super(props);
    this.rerender = this.rerender.bind(this)
  }

  rerender() {
    this.forceUpdate()
    
  }

  focusRef(ele) {
  	ele.focus()
  } 

  render() {
    return (
      <div>
        <input ref={this.focusRef}/>
        <button onClick={this.rerender}>refresh</button>
      </div>
      );
  }
}
```

為什麼這樣就可以了呢？因為 callback ref 永遠指向同一個 function，也就是 `ClassComp` 產生的 instance 中的 `focusRef` 這個 function，而沒有建立新的，因此就不會發生 cleanup 的狀況。

但即使是這樣，React  element 被 unmount 時還是會呼叫 `callbackRef(null)` ，這樣的狀況還是會找不到 `ele.focus` 而報錯。

所以比較簡單，也比較保險的方式是這樣，加個 if 就好，這樣是 null 就會自動忽略：

```js
function InlineAutoSelectInput() {
	const [_, refresh] = useState()

	return (
	<div>
	  <input ref={(element) => {
		  if (element){
			element.focus()

		  }
	  }}/>
	  <button onClick={refresh}>refresh</button>
	</div>
	);
	
}
```

值得一提的是，雖然文件上只提到 inline 的 callback function 會有這個問題，但其實在 function component 中，即使使用變數也會遇到一樣的問題，我們拿前面提到的例子。

```js

function AutoSelectInput() {
  const [_, refresh] = useState()

  const autoFocus = (element) => {
    if (element) {
      element.focus()
    }
  }

  return (
    <div>
      <input ref={autoFocus}/>
      <button onClick={refresh}>refresh</button>
    </div>
  );
}

```

因為 callback ref 一樣是在 function component 被 render 的時候才被建立的，每次被帶進去 input 時一樣是不同的 function。

那想要在 function component 中也想要做到 class component 的效果要怎麼做？既然要保持相同，最直覺的作法就是 `useCallback` 了

```js

function AutoSelectInput() {
  const [_, refresh] = useState()

  const autoFocus = useCallback((element) => {
    if (element) {
      element.focus()
    }
  }, [])

  return (
    <div>
      <input ref={autoFocus}/>
      <button onClick={refresh}>refresh</button>
    </div>
  );
}

```


除此之外，因為沒有用到 component 內部的屬性， 所以這樣處理也是可行的，把 callback ref 提到外層。提到外層後就永遠指向同一個 function 了，能夠避免在沒有 mount / unmount 也呼叫的問題。

```js
const autoFocus = (element) => {
if (element) {
  element.focus()
	}
}

function AutoSelectInput() {
  const [_, refresh] = useState()
  return (
    <div>
      <input ref={autoFocus}/>
      <button onClick={refresh}>refresh</button>
    </div>
  );
}
```

### Callback Ref 用在哪裡？
在剛剛的範例中，我們使用 callback ref 來讓 input 元素自動 focus，而除了這樣的用法之外，在 React 的[文件](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)中也有提到可以用來拿取 DOM element 的元素資訊。

```js
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {    
	  if (node !== null) {      
		  setHeight(node.getBoundingClientRect().height);    
	  }  
  }, []);
	
  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>      
	  <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

自己對於 callback Ref 的理解是，父層能夠用 callback Ref 的方式，能夠在 DOM element 還是 React element，設定 mount / unmount 時的 callback function。在下面的範例中：

```js
export default function App() {
  const [_, refresh] = useState();

  console.log("rerender");

  useEffect(() => {
    console.log("effect");
  });

  useLayoutEffect(() => {
    console.log("layout effect");
  });

  return (
    <div ref={(ele) => { console.log("cb1", ele); }} >
      <h1>Hello Ref</h1>
      <input
        ref={(ele) => {
          console.log("cb2", ele);
        }}
      />
      <div
        ref={(ele) => {
          console.log("cb3", ele);
        }}
      ></div>
      <button onClick={refresh}>click</button>
      <PassRef
        ref={(ele) => {
          console.log("cb4", ele);
        }}
      />
      <ClassComp
        ref={(ins) => {
          console.log("cb5", ins);
        }}
      />
    </div>
  );
}
```


## Component 的 ref
剛剛提到的兩種用法是

1. ref 綁定在 DOM element 上，可以使用
	1. object
	2. callback
2. ref 作為不會 rerender 的 mutable object

那 ref 可以綁定在 Component Element 上嗎？可以的。

```js

class Child extends Component {
  constructor(props) {
    super(props);
	this.addCount = this.addCount.bind(this)
	this.state = {count: 0};
  }
	
  addCount() {
  	this.setState(({count}) => ({count: count + 1}))
  }

  render() {
    return (<div>
			<div>counter: {this.state.count}</div>	
		</div>);
  }
}

export default function () {
	const ref= useRef();
	
	const addConntFromParent = () => {
		if (ref.current) {
			ref.current.addCount()
		}
	}
	
  return (
    <div>
      <Child ref={ref}/>
      <button onClick={addConntFromParent}>add count</button>
    </div>
  );
}
```

透過 ref，我們可以拿到 `ClassComp`  的 instance 本身，而且還可以透過 instance 來操作 `ClassComp`，換句話說，我們可以在 Parent 操作 child component 內部的狀態。

function component 也可以做到這點，但是要透過 `useImperativeHandle` 這個 API。如果用上面那個範例但是改成 function component 的話：

```js

const  Child =  ({passRef}) => {
	const [state, setState] = useState(0);
	
	useImperativeHandle(passRef, () => ({
		addCount: () => {setState(state => state + 1)}
	}), [])
	
	return (<div>
			<div>counter: {state}</div>	
		</div>)
}

export default function () {
	const ref= useRef();
	
	const addCountFromParent = () => {
		if (ref.current) {
			ref.current.addCount()
		}
	}
	
  return (
    <div>
      <Child passRef={ref}/>
      <button onClick={addCountFromParent}>add count</button>
    </div>
  );
}
```

因為 function component 本身不像 class component 一樣能夠產生 instance 儲存狀態，我在我們需要透過 useImperativeHandle，並透過第二個參數的 function 建立一個 instance 給 parent 的 ref。

從這點就可以看到，我們可以自由決定需要公開的介面給 parent，這點比起 class component 完全公開 instance 內部的 property / method 來的更加安全，也帶有一點物件導向的味道。

但是在上面的範例可以看到我們的 `Child` 接收的是 passRef 這個 props 而不是 ref。原因是如果直接使用 ref 的話在預設狀況是會如 class component 的行為一樣綁定 instance 到 ref 上面。但是 function component 和 class component 處理方式不同，在這個部分會報錯。

```
Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

所以上面的範例才會使用 `passRef` 而不能直接使用 ref 來傳送進去 component。因此我們會需要 React .forwardRef 讓 function component 也能夠送 ref 進去。

```js

const Child = React.forwardRef((props, ref) => {
	const [state, setState] = useState(0);
	
	useImperativeHandle(ref, () => ({
		addCount: () => {setState(state => state + 1)}
	}), [])
	
	return (<div>
			<div>counter: {state}</div>	
		</div>)
})

export default function () {
	const ref= useRef();
	
	const addCountFromParent = () => {
		if (ref.current) {
			ref.current.addCount()
		}
	}
	
  return (
    <div>
      <Child ref={ref}/>
      <button onClick={addCountFromParent}>add count</button>
    </div>
  );
}
```

使用了 forwardRef 這個 HOC 包住 function component 之後，就能用第二個參數來接收 ref，這樣我們可以把 ref 傳進去給 useImperativeHandle 使用了。

## 總結

說實在這篇文章的內容幾乎都是文件上面有的東西，只是和 Ref 有關的 API 不少，再加上相關的資訊散佈再放在文件的各處，就對 Ref 比較難有全面的了解。

這篇看起來落落長，不過對於 Ref 這裡這樣理解：

- 是建立一個 mutable 的 object
	- `React.createRef`：使用在 class component 
	- `useRef`：使用在 function component
- React element（包含 DOM、Function component 和 Class component）上的 ref 屬性
	- 可以說是 component 在 mount / unmount 的 callback
		- 在帶入 function時，會在 mount 時執行 `callbackRef(node)`，而在 unmount 時執行 `callbackRef(null)`。
			- 如果 rerender 前後是不同的 callback ref function，會進行 cleanup 執行 callback function。
			- DOM element 的 node 會是 element 本身
			- Function component 的 node 會是 useImparativeHandle 第二個參數的 return 值
		- 在帶入 object 時，會自動執行 `(ele) => {object.current = ele}`。


## 一些奇怪的發現和猜想
在研究 ref 的時候做了些實驗，不過以目前對 react  的理解也還沒辦法解釋，或者有些東西目前只能做猜想沒辦法做證實（要證實只能看 source code 了，但目前看不太懂），所以就放在這邊，如果讀者們能夠解釋或者有想法的話歡迎提點或者是討論。

### 關於 callback ref 和 component 本身 lifecycle 的順序
我們把 給予 ref 的 Component 稱作 Parent，而接受 ref 的稱作 Child。

```js
function Parent() {

	return (
		<div>
			<FuncChild/>
			<ClassChild/>
		</div>
	)
}

```

我們都知道不管是 function component 還是 class component 本身都有所謂的 lifecycle / effect，會在 component 本身 render 結束之後被執行。自己蠻好奇說這些 lifecycle 和 callback ref 之間的執行順序是怎麼樣的，所以寫了下面這個實驗：

```js
const  FuncChild = React.fowardRef((_, ref) {
	useEffect(() => {
		console.log("func effect");
	}));

	useLayoutEffect(() => {
		console.log("func layoutEffect");
	})

	useImperativeHandle(ref, () => {
		console.log('func useImperativeHandle')
		return ({ name: "name" })
	} , []);

  return <h1>FuncComp</h1>;
}

class ClassChild extends Component {
  componentDidMount() {
    console.log("class componentDidMount");
  }

  render() {
    return <h1>ClassComp</h1>;
  }
}

export default function () {
  return (
    <div ref={() => {console.log("div ref")}}>
      <ClassChild
        ref={() => {
          console.log("class ref");
        }}
      />
      <FuncChild
        ref={() => {
          console.log("func ref");
        }}
      />
    </div>
  );
}
```

```
class componentDidMount
class ref
func layout effect
func useImpaertive
func ref
div ref
func effect
```

首先比較可以理解的是各個 element 的 ref 被 print 出來的順序：

1. class component 
2. function comonent 
3. div

class component 在 function component 前，所以這個順序理所當然。而因為 div 在外層，所以會等 children 被 render 完之後才會被 mount 上去，在最後很合理。

再來是 class component 的 ref 和 lifecycle 的順序。對於 class component 太不熟了，而且也蠻懶得去找資料，但可以理解的是會先執行完 component 內部的 lifecycle，然後才被 mount 上去 Parent component，所以才會是這樣的執行順序。

最後是 function component。第一點是 useLayoutEffect 的執行會在 ref 前面，layoutEffect 會在 DOM paint 後執行，這個部分覺得蠻合理的，而且文件也有提到 useLayoutEffect 觸發的時間點和 componentDidMount 相同。

最疑惑的是這點，useEffect 的觸發點在 callback ref 後面是可以預期的，會在 paint 之後。但這個結果代表說不只是在 component paint 之後，而是在整個 app 被重新 paint 之後（在 div ref 後面）。

這個研究大概就到這邊了，關於 useEffect 的執行時機點，Child / Parent 被 render 還有 paint 的順序，甚至還有 hook 是在什麼時間被執行的，這些概念目前似乎都很模糊，還需要更多理解。


### 純手工 ref 

我們真的需要 createRef / useRef？

```js

class ClassComp extends Component {
  constructor(props) {
    super(props);
    this.ref = {
      current: null
    };
    this.state = { show: true };
    this.printRef = this.printRef.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  printRef() {
    console.log(this.ref);
  }

  toggle() {
    this.setState(({ show }) => ({ show: !show }));
  }

  render() {
    return (
      <div>
        {this.state.show && <h1 ref={this.ref}>123</h1>}
        <button onClick={this.printRef}>print</button>
        <button onClick={this.toggle}>toggle</button>
      </div>
    );
  }
}

const ref = {
  current: null
}

function FuncComp() {
  const [show, setShow] = useState(true);
  const toggle= () => { setShow(state => !state) }
  const printRef= () => { console.log(ref) }

  return (
    <div>
      {show && <h1 ref={ref}>h1</h1>}
      <button onClick={printRef}>print ref</button>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}
```

這兩個範例都是沒問題的，不論是在  `h1`  有沒有 show 的狀態都可以正常的表現 ref 為 element / null。那為什麼會需要這兩個 api？useRef 或者是 React.createRef 是不是有做一些其他的事情？可能需要再研究了。

### 不使用 useInperativeHandle 來做綁定的話會怎麼樣？

```js
const Child = forwardRef((_, ref) => {
  const [state, setState] = useState(false)
  const toggle = () => {
    setState(state => !state)
  }
  ref.current = toggle;
  console.log("func", ref);
  return <p>{state + ''}</p>;
});

function Parent () {
  const [_, refresh] = useState();
  const ref = useRef();
  const click = () => {
    if (ref ) { ref.current() }
  };

  useEffect(() => {
    console.log(ref);
  });
  return (
    <div>
      <Child ref={ref} />
      <button onClick={refresh}>rerender</button>
      <button onClick={click}>toggle</button>
    </div>
  );
}
```

~~到底是為什麼要一直不照文件的做~~。用上面的作法，完全不使用 useImperativeHandle 這個 api，自己把 component 內的 setState 綁定到 `ref.current` 上面，這樣的用法也是沒問題的，不過也不清楚原因就是了。

## 參考資料

其實也不過都是文件而已

- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [How can I measure a DOM node?](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)
- [React.fowardRef](https://reactjs.org/docs/react-api.html#reactforwardref)
- [Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)
- [Forwarding Refs](https://reactjs.org/docs/forwarding-refs.html)






