(()=>{var e={};e.id=7494,e.ids=[7494],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},67096:e=>{"use strict";e.exports=require("bcrypt")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},41790:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page-experimental.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},73292:e=>{"use strict";e.exports=require("fs/promises")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},63477:e=>{"use strict";e.exports=require("querystring")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},72611:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>a.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>d,routeModule:()=>x,tree:()=>c});var s=r(10426),i=r(19361),n=r(19234),a=r.n(n),o=r(76566),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(t,l);let c=["",{children:["[lang]",{children:["admin",{children:["post-list",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,20056)),"/var/www/next-creator/app/[lang]/admin/post-list/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,75300)),"/var/www/next-creator/app/[lang]/layout.tsx"],error:[()=>Promise.resolve().then(r.bind(r,84643)),"/var/www/next-creator/app/[lang]/error.tsx"],loading:[()=>Promise.resolve().then(r.bind(r,94954)),"/var/www/next-creator/app/[lang]/loading.tsx"]}]},{"not-found":[()=>Promise.resolve().then(r.t.bind(r,16452,23)),"next/dist/client/components/not-found-error"]}],d=["/var/www/next-creator/app/[lang]/admin/post-list/page.tsx"],p="/[lang]/admin/post-list/page",u={require:r,loadChunk:()=>Promise.resolve()},x=new s.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/[lang]/admin/post-list/page",pathname:"/[lang]/admin/post-list",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},26357:(e,t,r)=>{Promise.resolve().then(r.bind(r,63433)),Promise.resolve().then(r.bind(r,10349)),Promise.resolve().then(r.bind(r,95847)),Promise.resolve().then(r.bind(r,5404)),Promise.resolve().then(r.bind(r,812)),Promise.resolve().then(r.bind(r,54347)),Promise.resolve().then(r.bind(r,45528)),Promise.resolve().then(r.bind(r,11175)),Promise.resolve().then(r.bind(r,81194)),Promise.resolve().then(r.t.bind(r,22272,23)),Promise.resolve().then(r.t.bind(r,51846,23))},63433:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>Content});var s=r(92983),i=r(76078),n=r(76243),a=r.n(n),o=r(3636),l=r.n(o),c=r(97775);function Content({useLang:e,defaultLang:t,locales:r,localeLabels:n}){let[o,d]=(0,i.useState)(null),[p,u]=(0,i.useState)(!1),x=(0,i.useRef)(0),h=!1;function getPostList(){fetch("/api/post/get-many",{method:"POST",body:JSON.stringify({orderBy:[{register_date:"desc"}],take:20,skip:x.current})}).then(async t=>{if(t.ok){let r=await t.json(),i=[];for(let t of(x.current+=20,u(r.isNext),r.result))i.push((0,s.jsxs)("tr",{children:[s.jsx("td",{className:l().thumb,children:s.jsx("span",{className:l().img_wrap,children:t.media?s.jsx("img",{src:`../../api/media-stream?w=800&id=${t.media?.id}`,loading:"lazy",alt:"サムネイル画像"}):s.jsx("span",{className:l().no_image,children:"No image"})})}),(0,s.jsxs)("td",{children:[t.title[e],t.description&&s.jsx("span",{className:l().description,children:t.description[e]})]}),s.jsx("td",{children:t.CategoryPost.map(t=>`${t.category.name[e]}`).join(", ")}),s.jsx("td",{children:t.user.nameid}),s.jsx("td",{children:(0,c.ET)("y-m-d h:mi",t.register_date)}),s.jsx("td",{children:(0,c.ET)("y-m-d h:mi",t.update_date)}),(0,s.jsxs)("td",{children:[s.jsx(a(),{className:l().edit,href:`./post?mode=edit&id=${t.id}`,children:"編集"}),s.jsx("button",{className:l().trash,children:"ゴミ箱へ"})]})]}));d(e=>e?[...e,...i]:i)}})}return(0,i.useEffect)(()=>((async function(){h||getPostList()})(),()=>{h=!0}),[]),(0,s.jsxs)("div",{className:l().wrapper,children:[s.jsx("h2",{children:"投稿一覧"}),(0,s.jsxs)("div",{className:l().post_list_table,children:[(0,s.jsxs)("table",{children:[s.jsx("thead",{children:(0,s.jsxs)("tr",{children:[s.jsx("th",{children:"サムネイル"}),s.jsx("th",{children:"タイトル"}),s.jsx("th",{children:"カテゴリー"}),s.jsx("th",{children:"作成者"}),s.jsx("th",{children:"作成日時"}),s.jsx("th",{children:"更新日時"}),s.jsx("th",{children:"操作"})]})}),s.jsx("tbody",{children:o})]}),p&&s.jsx("div",{className:l().show_more,children:s.jsx("button",{onClick:()=>{getPostList()},children:"更に表示"})})]})]})}},3636:e=>{e.exports={wrapper:"content_wrapper__xLDsn",post_list_table:"content_post_list_table__Rt4HE",thumb:"content_thumb__2BINO",img_wrap:"content_img_wrap__KfYqf",no_image:"content_no_image__jT7iE",description:"content_description__OowH_",edit:"content_edit__A0ifR",trash:"content_trash__nQDev",show_more:"content_show_more__oPoNG"}},20056:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>PostManage});var s=r(55041),i=r(83873),n=r(50217),a=r(6962),o=r(18722),l=r(11208),c=r(38584),d=r(89385);let p=(0,d.createProxy)(String.raw`/var/www/next-creator/app/[lang]/admin/post-list/content.tsx`),{__esModule:u,$$typeof:x}=p,h=p.default;async function PostManage({params:{lang:e}}){let t=await (0,o.getServerSession)(a.Y);return t||(0,l.redirect)("/"),(0,s.jsxs)(s.Fragment,{children:[s.jsx(i.Z,{lang:e}),s.jsx(h,{locales:c.S.Z5,defaultLang:c.S.ZP,useLang:e,localeLabels:c.S.p8}),s.jsx(n.Z,{})]})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[8807,9059,7737,7253,1419,8722,8396,1208,6962,7408,7350,3239,598],()=>__webpack_exec__(72611));module.exports=r})();