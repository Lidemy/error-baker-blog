---
title: 帶你入門區塊鏈（二）
date: 2022-05-01
tags: [block-chain, article]
author: Xiang
layout: layouts/post.njk
image:
---

<!-- summary -->

寫給想要了解區塊鏈運作機制的你

<!-- summary -->
<!-- more -->

## 前言
前一篇 [帶你入門區塊鏈（ㄧ）](https://blog.errorbaker.tw/posts/xiang/block-chain-01/)以生活化的角度帶大家理解區塊鏈的基本概念。但是生活化的舉例，畢竟不容易理解實際上運作的方式。所以這篇文章將直接透過程式碼，讓大家理解區塊鏈會如何運作。

使用 Python 寫出一個小範例，內容包含建立創世塊、產生公私鑰、簽署合約、驗證區塊、調整挖礦難度...等等。除了提供程式碼參考外，也會附上各個步驟的說明，方便大家了解每個環節的作用是什麼。

> 此範例僅會展示單一節點運作的原理，暫不考慮多個礦工同時進行挖礦的情境


## 介紹

區塊鏈底下有三個主要的 Class：
- 交易 (Transaction)
- 區塊 (Block)
- 區塊鏈 (BlockChain)

##### 交易

```py
class Transaction:
  def __init__(self, sender, receiver, amounts, fee, message):
    self.sender = sender
    self.receiver = receiver
    self.amounts = amounts
    self.fee = fee
    self.message = message
```

每一筆交易底下會包含幾個項目：
- 付款方 (sender)
- 收款方 (receiver)
- 金額 (amounts)
- 手續費 (fee)
- 訊息 (message)

上面這些資訊都會在交易被建立的時候被帶入



##### 區塊

```py
class Block:
  def __init__(self, previous_hash, difficulty, miner, miner_rewards):
    self.previous_hash = previous_hash
    self.hash = ''
    self.difficulty = difficulty
    self.nonce = 0
    self.timestamp = int(time.time())
    self.transactions = []
    self.miner = miner
    self.miner_rewards = miner_rewards

```

每一個區塊底下，會包含幾個項目：
- 前一個區塊的 hash
- 該區塊自己的 hash
  - 預設為空字串
  - 會隨挖礦的過程不斷改變
- 挖礦難度
  - 型別是數字
  - 挖礦難度代表 hash 值開頭需要滿足幾個 0
  - ex.如果設定難度是 5，代表 hash 值開頭需要為 5 個 0 開頭才算合格
- nonce 值
  - 亂數值，型別是數字
  - 挖礦時會不斷改變 nonce 值，來找出匹配難度要求的 hash
- 建立時間
- 交易內容
  - 型別是陣列，每一個區塊可以寫入多筆交易
  - 需符合區塊的容量限制
- 挖掘此區塊的礦工
- 出塊獎勵

##### 區塊鏈

```py
class BlockChain:
  def __init__(self):
    self.adjust_difficulty_blocks = 10
    self.difficulty = 5
    self.block_time = 15
    self.miner_rewards = 50
    self.block_limitation = 10
    self.chain = []
    self.pending_transactions = []  
```

區塊鏈會包含幾個項目：
- 幾個區塊調整一次難度
  - 型別為數字
  - 如果設定為 10，代表每挖出 10 個區塊要調整一次挖礦難度
- 預設挖礦難度
  - 型別為數字
  - 挖礦難度代表 hash 值開頭需要滿足幾個 0
  - ex.如果設定難度是 5，代表 hash 值開頭需要為 5 個 0 開頭才算合格
- 期望出塊時間
  - 型別為數字
  - 如果設定為 15，代表希望每一個區塊的出塊時間為 15 秒
- 出塊獎勵
  - 型別為數字
  - 當有區塊被挖掘時，給予礦工的出塊獎勵
- 區塊容量限制
  - 型別為數字
  - 每個區塊可以放入的交易數目上限
- 鏈
  - 型別為陣列
  - 已經挖掘出的區塊，會被放入此陣列
- 交易等待池
  - 型別為陣列
  - 剛建立的交易會被放入此陣列
  - 礦工會從此陣列取出交易放入區塊當中


## 功能

區塊鏈底下需要擁有的功能如下：
- 產生創世塊
- 產生公私鑰
- 建立交易
- 挖礦
- 其他

底下的 function，都是定義在 `BlockChain` 這個 class 底下，所以 function 當中用到的 `self` 會指向 `BlockChain` 這個類別。 


**[☞ 產生創世塊]()**

```py
def create_genesis_block(self):
    new_block = Block('Hello World! By Xiang', self.difficulty, 'xiang', self.miner_rewards)
    new_block.hash = self.get_hash(new_block, 0)
    self.chain.append(new_block)
```

建立一個新的 `Block` 區塊，傳入的引數依序為： previous_hash, difficulty, miner, miner_rewards。
因為是創世塊，所以 previous_hash 可以直接給定一個自定義的字串，至於難度以及出塊獎勵，則是使用 `BlockChain` 初始化時設定的數值。

當 new_block 產生以後，先透過 `get_hash` 方法（下面會提到），找出這個創世塊的 hash，找到以後就可以把創世塊上到 `chain` 鏈上。

**[☞ 產生公私鑰]()**

因為區塊鏈的交易，必須要透過私鑰進行簽署，礦工再利用公鑰進行解密。所以每個使用者都會有一組對應的公私鑰。
因為我們程式碼只是要 Demo 區塊鏈運作，所以先利用 [PyCryptodome](https://pycryptodome.readthedocs.io/en/latest/src/examples.html#generate-public-key-and-private-key) 來做產生公私鑰的範例，實際的區塊鏈產生公私鑰的方法跟這邊是不同的。

```py
def generate_address(self):
    public, private = rsa.newkeys(512)
    public_key = public.save_pkcs1()
    private_key = private.save_pkcs1()
    return self.get_address_from_public(public_key), \
      self.extract_from_private(private_key)
```

上面這個 function，會隨機產生一組公私鑰，並且回傳出去。


**[☞ 建立交易]()**

建立交易會有幾個流程：
- 初始化交易
- 利用私鑰簽署交易
- 礦工驗證交易

```py
# 初始化交易
def initialize_transaction(self, sender, receiver, amount, fee, message):
    if self.get_balance(sender) < amount + fee:
      print("Balance not enough!")
      return False
    new_transaction = Transaction(sender, receiver, amount, fee, message)
    return new_transaction

# 利用私鑰簽署交易
def sign_transaction(self, transaction, private):
    private_key_pkcs = rsa.PrivateKey.load_pkcs1(private.encode('utf-8'))
    transaction_str = self.transaction_to_string(transaction)
    signature = rsa.sign(transaction_str.encode('utf-8'), private_key_pkcs, 'SHA-1')
    return signature

# 礦工驗證交易
  def add_transaction(self, transaction, signature):
    # 透過地址反推公鑰
    public_key = transaction.sender
    public_key_pkcs = rsa.PublicKey.load_pkcs1(public_key.encode('utf-8'))

    transaction_str = self.transaction_to_string(transaction)
    # 確認餘額是否足夠
    if transaction.fee + transaction.amounts > self.get_balance(transaction.sender):
      return False, "Balance not enough!"
    # 驗證簽證是否為真
    try:
      rsa.verify(transaction_str.encode('utf-8'), signature, public_key_pkcs)
      self.pending_transactions.append(transaction)
      return True, "Authorized successfully!"
    except Exception:
      return False, "RSA Verified wrong!"
```

初始化交易，會先檢查匯款方的餘額是否大於交易金額 + 手續費，並且透過 `Transaction` 建立一筆新的交易
簽署交易會先把剛剛建立的交易轉換成字串，再把它與私鑰一同進行簽署。
礦工驗證交易，會先透過匯款方的地址取得匯款方的公鑰，並且確認匯款方有足夠的餘額能進行交易，最後是透過公鑰進行解密，來驗證這筆交易是否是匯款方本人進行簽署的。

當交易被驗證通過以後，就會進入交易等待池中。


**[☞ 挖礦]()**

- 從等待池中取得交易
- 將交易內容、時間以及 nonce 值，進行雜湊
- 調整挖礦難度

```py

# 挖礦
  def mine_block(self, miner):
    start = time.process_time()

    last_block = self.chain[-1]
    new_block = Block(last_block.hash, self.difficulty, miner, self.miner_rewards)

    # 把交易打包入目前區塊
    self.add_transaction_to_block(new_block)
    new_block.previous_hash = last_block.hash
    new_block.difficulty = self.difficulty
    new_block.hash = self.get_hash(new_block, new_block.nonce)

    # 改變 nonce 值直到符合難度
    while new_block.hash[0:self.difficulty] != '0' * self.difficulty:
      new_block.nonce += 1
      new_block.hash = self.get_hash(new_block, new_block.nonce)
    
    time_consumed = round(time.process_time() - start, 5)
    print(f"Hash found: {new_block.hash} @ difficulty {self.difficulty}, time cost: {time_consumed}s")
    self.chain.append(new_block)

# 將等待池中的交易放入區塊
  def add_transaction_to_block(self, block):
    
    # 按照手續費多寡排序
    self.pending_transactions.sort(key=lambda x: x.fee, reverse=True)

    # 依照交易數量是否大於區塊上限，判斷是只收最高的那些，還是全收
    if len(self.pending_transactions) > self.block_limitation:
      transaction_accepted = self.pending_transactions[:self.block_limitaion]
      self.pending_transactions = self.pending_transactions[self.block_limitaion:]
    else:
      transaction_accepted = self.pending_transactions
      self.pending_transactions = []
    block.transactions = transaction_accepted

# 調節挖礦難度
  def adjust_difficulty(self):

    # 如果還沒到需要驗證的數量，或者現在還在創世塊，無需調整
    if len(self.chain) % self.adjust_difficulty_blocks != 0:
      return self.difficulty
    elif len(self.chain) <= self.adjust_difficulty_blocks:
      return self.difficulty
    else:
      start = self.chain[-1 * self.adjust_difficulty_blocks - 1].timestamp
      finish = self.chain[-1].timestamp
      
      # 用最後一個區塊的 timestamp 與待計算的第一個區塊的 timestamp 相減取平均
      average_time_consumed = round((finish - start) / (self.adjust_difficulty_blocks), 2)
      # 出塊時間過長減少難度，出塊時間過短增加難度
      if average_time_consumed > self.block_time:
        print(f"Average block time: {average_time_consumed}s. Lower the difficulty")
        self.difficulty -= 1
      else:
        print(f"Average block time: {average_time_consumed}s. High up the difficulty")
        self.difficulty += 1

# 雜湊
def get_hash(self, block, nonce):
    s = hashlib.sha1()
    s.update(
      (
        block.previous_hash
        + str(block.timestamp)
        + self.get_transactions_string(block)
        + str(nonce)
      ).encode("utf-8")
    )
    h = s.hexdigest()
    return h
```

挖礦首先會透過 `Block` 建立一個新的區塊，將 previous_hash, difficulty, miner, miner_rewards 傳進去。
從等待池中找出手續費最高的交易，依照手續費高低排序，在不超出區塊容量限制的前提下，把等待池中的交易們放進來區塊當中。
把區塊當中的 previous_hash, timestamp, transactions, nonce 進行雜湊，找出符合難度標準的 hash 值。
最後把新的區塊放上區塊鏈。

每一次產生新的區塊以後，會呼叫一次 `adjust_difficulty`，這個 function 是用來判斷現在是否需要調整挖礦難度的。
它會根據目前區塊鏈的長度判斷是否有需要調整難度，例如我們設定每 10 塊調整一次，就會在長度為 10, 20, 30... 的時候分別進行調整。調整方式是將最後一個區塊的 timestamp 與待計算的第一個區塊的 timestamp 相減取平均，看看是大於還是小於我們期望的出塊時間。如果時間太久了，就把難度 -1，如果時間太快了，就把難度 +1，確保未來的每一次出塊時間盡量保持在我們設定的期望時間附近。

**[☞ 其他]()**

- 計算帳戶餘額
- 驗證區塊鏈

```py

# 計算帳戶餘額
  def get_balance(self, account):
    balance = 0
    for block in self.chain:
      miner = False

      # 如果該帳號是這個區塊的礦工，加上出塊獎勵
      if block.miner == account:
        miner = True
        balance += block.miner_rewards
      
      # 對照區塊中的每一筆交易，如果這隻帳號是礦工就加上手續費，如果這隻帳號是匯款方就減掉支出，如果這隻帳號是收款方就加上收入
      for transaction in block.transactions:
        if miner:
          balance += transaction.fee
        if transaction.sender == account:
          balance -= transaction.amounts
          balance -= transaction.fee
        elif transaction.receiver == account:
          balance += transaction.amounts
    return balance
  
  # 驗證區塊鏈
  def verify_blockchain(self):
    previous_hash = ''
    for idx, block in enumerate(self.chain):
      
      # 比對每一個區塊的 hash 是否正確
      if self.get_hash(block, block.nonce) != block.hash:
        print("Error: Hash not matched!")
        return False
      elif previous_hash != block.previous_hash and idx:
        print("Error: Hash not matched to previous_hash")
        return False
      previous_hash = block.hash
    
    print("Hash correct!")
    return True
```

如果想要取得某個人的帳戶餘額，會從區塊鏈的第一塊開始檢查到最後一塊，如果有匯款出去就剪掉會出去的金額及手續費，如果有收到款項則加上金額。如果自己是該區塊的礦工，會把該區塊的手續費與出塊獎勵加上去。如此一來最後就能得出這個使用者的帳戶餘額。

如果想要驗證區塊鏈，只要從第一快檢查到最後一塊，看看每一塊的 hash 值是否都有符合該區塊區需要滿足的難度，如果該區塊難度為 5，hash 值就必須要是 5 個 0 開頭，難度為 6 則需要滿足 6 個 0 開頭...，以此類推。只要每一個區塊的驗證都是正確的，就可以確保整條區塊鏈都是沒問題的。

**[☞ 執行方法]()**

```py
# 測試執行
  def start(self):
    address, private = self.generate_address()
    self.create_genesis_block()
    while(True):
      # 初始化一筆交易
      transaction = self.initialize_transaction(address, 'test123', 1, 1, 'Test')
      if transaction:
        # 將交易透過私鑰進行簽證
        signature = self.sign_transaction(transaction, private)
        # 礦工進行驗證
        self.add_transaction(transaction, signature)
      self.mine_block(address)
      print(self.get_balance(address))
      self.adjust_difficulty()
```      

測試執行的方式，需要先建立創世塊，並透過 while 迴圈進行挖礦的動作。

![](https://blog.errorbaker.tw/img/posts/xiang/block-chain-02-01.png)

## 總結

這次的 Demo 僅由一個節點運行，透過 function 的說明來簡易描述區塊鏈的運作。
完整的程式碼在 [這邊](https://github.com/krebikshaw/blockchain/blob/master/Blockchain.py)，同一個資料夾底下有另外兩個檔案是展示多節點下的區塊鏈運作，有興趣的人可以自己複製到本地端跑跑看。

希望這兩篇文章，有成功帶給大家一些幫助，讓我們一起入門區塊鏈。