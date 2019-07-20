# vue-ssr-puppeteer

### 这是一个使用 puppeteer 的 ssr demo

这个方案的主要优点在于

1.无论你的 vue 项目开发是在初始阶段还是已经完成，都可以很好的进行 ssr

2.基本没有学习成本

不过会牺牲一点性能。

---

## 怎么开始

1.安装相关模块

```
npm i
```

2.build 构建

```
npm run build
```

3.启动一个 node 服务，让不用进行 ssr 的静态资源提供访问,默认端口是 5001

```
node app.js
```

如果想自定义端口，这样启动

```
PORT=端口 node app.js
```

4.启动另一个 node 服务，处理 ssr 相关

```
node server.js
```

同样的，如果想自定义端口，可以这样启动

```
SSR_PORT=端口 node server.js
```

最后在浏览器中输入你的 ip 加上 ssr 的端口就可以正常访问
