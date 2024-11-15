## 功能

- 标签式路由组件缓存，开箱即用
- 每一个新路由切换都会在页面内新增一个标签tab，缓存其路由组件，切换路由或者tab标签组件不会重新加载
- 支持配置路由组件是否需要缓存
- 支持 Activated 和 Deactivated 生命周期函数

## Demo

[CodeSandbox](https://codesandbox.io/p/sandbox/react-route-cache-demo-nc2xwy)

## 安装

```js
// npm
npm i react-route-cache -S
// pnpm
pnpm i react-route-cache -S
// yarn
yarn add react-route-cache
```

## 使用

给 Layout 组件的 outlet 加上 keep-alive

```js
// Layout.tsx
import { KeepAlive, KeepAliveScope, RouterTabs } from 'react-route-cache';
import { useOutlet } from 'react-router-dom';

const Layout = () => {
  // 需要使用useOutlet
  const outlet = useOutlet();

  return (
    <KeepAliveScope>
      <RouterTabs />
      <KeepAlive>{outlet}</KeepAlive>
    </KeepAliveScope>
  );
};

export default Layout;
```

路由定义需要增加 name、cache 属性（cache不配置默认开启缓存）

```js
// router.ts
// 也可以是createHashRouter
import Layout form './Layout'

createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        loader: rootLoader
        children: [
            {
                path: "events",
                element: <Event />,
                // 增加name属性，否则标签没有title，展示出现问题
                // 如果不需要缓存可以配置cache false, 不配置或者true都会开启缓存
                handle: { name: "事件", cache: false},
            }
         ]
      }
]);
```

生命周期函数

- useActivated 返回的方法会在 Deactivated 的时候执行。
- 第二个可选参数是一个依赖项数组，为了更新回调函数里的依赖，一般不会用到，功能类似 useCallback，依赖变化不会执行函数。

```js
import { useActivated, useDeactivated } from 'react-route-cache';

export const Demo = () => {
  useActivated(() => {
    console.log('激活');
    return () => {
      console.log('activated返回的方法会在Deactivated的时候执行');
    };
  });

  useDeactivated(() => {
    console.log('离开组件');
  });

  return <div>123</div>;
};
```

## KeepAliveScope Props

mode

- 默认匹配路由 path，path 变化则会新增一个 tab，也就是如果查询参数变化不会新增一个 tab 缓存组件
- 如果希望查询参数变化也会新增一个 tab 需要将 mode 改为 search

nameKey：如果路由 name 已被占用，可以通过该字段获取 handle 下其他字段的信息作为 tab 的 title

```js
interface KeepAliveScopeProps {
  mode?: "path" | "search";
  nameKey?: string;
}
<KeepAliveScope mode="search" nameKey="tabName" />
```

## RouterTabs & KeepAlive Props

### RouterTabs

- theme: 主题颜色，`dark | light`，默认为light

### KeepAlive

- exclude：排除不需要缓存的路由组件，支持正则表达式
- include：只缓存需要缓存的路由组件，支持正则表达式
- max：缓存的组件数量，默认 10
- styles：自定义样式

```javascript
styles：{
  wrapper?: CSSProperties; // 包裹元素的style
  content?: CSSProperties; // 内容元素的style
}
```

## 其他 API

close、closeAll、closeNavigator

- close 方法用于关闭当前标签页
- closeAll 用于关闭除了当前激活的 tab 所有的标签页
- closeNavigator 是为了解决比如表单创建页，创建完之后需要跳转到其他路由。closeNavigator 会关闭当前创建页标签，然后跳转到指定路由。是 close()和 navigator(url)的语法糖。

```js
import { useKeepAlive } from '../hooks/use-keep-alive';
...
  const { close, closeAll, closeNavigator } = useKeepAlive();
  close()
  closeAll()
  // 是close()和navigator方法跳转到其他路由
  closeNavigator(url)
...
```

### 开发 & 调试

```js
// 构建
npm run build
// 构建后运行example调试
npm run start -w example
// 发布
npm publish
```
