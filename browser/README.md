# Browser

[Parsing HTML](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
[html5 parsing test](https://github.com/html5lib/html5lib-tests)

## Style

[Assigning Property Values](https://www.w3.org/TR/CSS2/cascade.html)

样式匹配 对于每一个 DOM Node 区所有的 CSS Style 进行匹配

对于逗号分隔的多个 Selector 匹配 DOM 节点时选用优先级（Specificity）最高的选择器，可以在解析 CSS 规则时将选择器按照优先级从高到底排序，
这样第一个匹配的选择器就是所有匹配的选择其中具有最高优先级的。

优先级的匹配，单个选择其中的标签（Tag）、ID 和所有类（class）必须都匹配。

找到 DOM 节点所有匹配的 CSS 规则后，按照优先级从低到高排序，对每个 CSS 规则中的属性进行计算，同名的属性，优先级高的规则排在后边会覆盖优先级低的规则中的属性值。

对 DOM 树中的所有 DOM 节点进行样式匹配构建样式树（StyleTree）。

1. [Cascade 规则](https://www.w3.org/TR/CSS2/cascade.html#cascade)，样式优先级，根据样式来源，origin。
1. 没有样式规则匹配到的 DOM 节点对应的样式属性使用默认值
1. 对于文字节点等无法声明样式的节点，其样式属性继承父节点属性
1. [specified, computed, actual values](https://www.w3.org/TR/CSS2/cascade.html#value-stages)
1. 内联样式

## Layout

visual formatting model

盒子生成算法
https://www.w3.org/TR/CSS2/visuren.html#box-gen
StyleNodeTree -> LayoutTree

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model

介绍浏览器原理
https://mp.weixin.qq.com/s?__biz=MzI0ODA2ODU2NQ==&mid=2651131609&idx=2&sn=3df598084177675024492b6a2b3fb9b5&chksm=f257ce63c520477590331c84a849f4d1df328a98e6cd54799227ca03b4697a8d5b35535d02cc&scene=21#wechat_redirect

布局

https://zhuanlan.zhihu.com/p/104927765

width/margin-left/margin-right auto 关键字的计算规则

padding/border 不接受 auto 关键字

1. overflow 的情况下，没有剩余空间可以分配
   1. width: auto 等于 0，其余的 auto 值也为 0，但是 margin-right 要重新计算值使得约束成立
   1. width 不是 auto 的情况，因为 width 本身造成了 overflow，其余 auto 为 0，不需要重新计算使约束成立
1. underflow 的情况下，存在剩余空间可以分配
   1. width: auto 占据全部剩余空间，其余 auto 为 0
   1. width: 不是 auto 的情况，margin-left/margin-right 有一个 auto 时占据剩余空间，两个都是 auto 时评分剩余空间，都不是 auto 时剩余空间分配给 margin-right。

https://spin.atomicobject.com/2015/07/14/css-responsive-square/
https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css

子节点的宽度取决于父节点的宽度，父节点的高度取决于子节点的高度
