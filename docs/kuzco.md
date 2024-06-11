# Kuzco任务说明

## 注入代码

只能用于Kuzco在Macos下的注入console。

### 获得存储的jwt

```javascript
function getJWT() {
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      try {
        const text = this.responseText
        const json = JSON.parse(text)
        const jwt = json.data.token
        console.log(jwt)
      } catch (e) {}
    }
  }
  xhttp.open("GET", "http://localhost:10086/api/v1/kuzco/jwt", true);
  xhttp.send()
}
getJWT()
```

### 存入JWT

```javascript
if (window.kuzcojwt) {
  clearInterval(window.kuzcojwt)
}
function setJWT() {
  const token = localStorage.getItem('kuzco-jwt')
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      try {
        const text = this.responseText
        const json = JSON.parse(text)
        const token = json.data.token
        console.log(`设置成功：${token}`)
      } catch (e) {}
    }
  }
  xhttp.open("POST", "http://localhost:10086/api/v1/kuzco/jwt", true)
  const jwt = { token: token }
  xhttp.setRequestHeader("Content-type", "application/json")
  xhttp.send(JSON.stringify(jwt))
}
setJWT()
window.kuzcojwt = setInterval(setJWT, 60_000)
```

精简版

```javascript
if (window.kuzcojwt) {
  clearInterval(window.kuzcojwt)
}
st = () => {
  x = new XMLHttpRequest();x.onreadystatechange = ({ target: t }) => {
    try {
      t.readyState == 4 && t.status == 200 && console.log(`设置成功：${JSON.parse(t.responseText).data.token}`)
    } catch (e) {
      console.log(e.message)
    }
  }
  x.open("POST", "http://localhost:10086/api/v1/kuzco/jwt", true)
  x.setRequestHeader("Content-type", "application/json")
  x.send(JSON.stringify({ token: localStorage.getItem('kuzco-jwt') }))
}
st()
window.kuzcojwt = setInterval(st, 60_000)
```

压缩版

```javascript
window.kuzcojwt&&clearInterval(window.kuzcojwt),st=()=>{x=new XMLHttpRequest,x.onreadystatechange=({target:t})=>{try{4==t.readyState&&200==t.status&&console.log(`设置成功：${JSON.parse(t.responseText).data.token}`)}catch(t){console.log(t.message)}},x.open("POST","http://localhost:10086/api/v1/kuzco/jwt",!0),x.setRequestHeader("Content-type","application/json"),x.send(JSON.stringify({token:localStorage.getItem("kuzco-jwt")}))},st(),window.kuzcojwt=setInterval(st,6e4);
```
