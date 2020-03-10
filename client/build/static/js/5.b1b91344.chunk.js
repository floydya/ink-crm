(this["webpackJsonpink-crm"]=this["webpackJsonpink-crm"]||[]).push([[5],{109:function(n,t,e){"use strict";var r=e(20),a=e(5),c=e(0),i=e(9),o=e(122),u=e.n(o),l=e(119),s=function(){return localStorage.getItem("token")||null},p=function(n,t,e){return new Promise((function(r,a){u.a.create({headers:{"Content-Type":"application/json",Authorization:s()?"Bearer ".concat(s()):void 0}})({url:"".concat("http://api.demo.ink/api/v1").concat(t),method:n,params:"get"===n?e:void 0,data:"get"!==n?e:void 0,paramsSerializer:l.b}).then((function(n){r(n.data)}),(function(n){n.response?401===n.response.status?localStorage.removeItem("token"):a(n.response):a({code:"INTERNAL_ERROR",message:"Something went wrong. Please check your internet connection or contact our support.",status:503,data:{}})}))}))},d={get:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return p.apply(void 0,["get"].concat(t))},post:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return p.apply(void 0,["post"].concat(t))},put:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return p.apply(void 0,["put"].concat(t))},patch:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return p.apply(void 0,["patch"].concat(t))},delete:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return p.apply(void 0,["delete"].concat(t))}},f=function(n){var t=Object(c.useState)(n||{}),e=Object(a.a)(t,2),o=e[0],u=e[1];return[o,Object(c.useCallback)((function(n){Object(i.isFunction)(n)?u((function(t){return Object(r.a)({},t,{},n(t))})):u((function(t){return Object(r.a)({},t,{},n)}))}),[])]},v=e(61),b={},g=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=e.lazy,u=void 0!==o&&o,l=e.cachePolicy,s=void 0===l?"cache-first":l,p=e.mountFetch,g=void 0!==p&&p,h=Object(c.useRef)(!1),m=Object(v.a)(t),O=u&&!h.current,j=b[n]&&Object(i.isEqual)(b[n].apiVariables,t),y=j&&"no-cache"!==s&&!h.current,w=f({data:y?b[n].data:null,error:null,isLoading:!u&&!y,variables:{}}),k=Object(a.a)(w,2),x=k[0],E=k[1],A=Object(c.useCallback)((function(t){var e=Object(r.a)({},x.variables,{},t||{}),a=Object(r.a)({},m,{},e);return y&&"cache-first"===s?t&&E({variables:e}):E({isLoading:!0,variables:e}),d.get(n,a).then((function(t){return b[n]={data:t,apiVariables:a},E({data:t,error:null,isLoading:!1}),t}),(function(n){E({error:n,data:null,isLoading:!1})})).finally((function(){h.current=!0}))}),[n,m]);Object(c.useEffect)((function(){O||y&&"cache-only"===s||g&&A()}),[A]);var R=Object(c.useCallback)((function(t){return E((function(e){var a=e.data,c=t(a);return b[n]=Object(r.a)({},b[n]||{},{data:c}),{data:c}}))}),[E,n]),S=Object(c.useCallback)((function(){return E({data:null})}),[E]);return[Object(r.a)({},x,{variables:Object(r.a)({},m,{},x.variables),setLocalData:R,clearData:S}),A]},h=e(4),m={post:"isCreating",put:"isUpdating",patch:"isUpdating",delete:"isDeleting"},O=function(n,t){var e=f({data:null,error:null,isWorking:!1}),i=Object(a.a)(e,2),o=i[0],u=i[1],l=Object(c.useCallback)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise((function(r,a){u({isWorking:!0}),d[n](t,e).then((function(n){r(n),u({data:n,error:null,isWorking:!1})}),(function(n){a(n),u({error:n,data:null,isWorking:!1})}))}))}),[n,t,u]);return[Object(r.a)({},o,Object(h.a)({},m[n],o.isWorking)),l]};t.a={get:function(){return g.apply(void 0,arguments)},post:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return O.apply(void 0,["post"].concat(t))},put:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return O.apply(void 0,["put"].concat(t))},patch:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return O.apply(void 0,["patch"].concat(t))},delete:function(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return O.apply(void 0,["delete"].concat(t))}}},110:function(n,t,e){"use strict";e.d(t,"c",(function(){return g})),e.d(t,"g",(function(){return h})),e.d(t,"e",(function(){return m})),e.d(t,"f",(function(){return O})),e.d(t,"d",(function(){return j})),e.d(t,"b",(function(){return y})),e.d(t,"a",(function(){return w}));var r=e(2),a=e(3),c=e(1),i=e(37);function o(){var n=Object(r.a)(["\n  margin-left: 10px;\n"]);return o=function(){return n},n}function u(){var n=Object(r.a)(["\n  display: flex;\n  justify-content: center;\n  padding-top: 30px;\n"]);return u=function(){return n},n}function l(){var n=Object(r.a)(["\n  margin-top: 22px;\n  border-top: 1px solid ",";\n"]);return l=function(){return n},n}function s(){var n=Object(r.a)(["\n  padding: 0 3px 0 6px;\n"]);return s=function(){return n},n}function p(){var n=Object(r.a)(["\n  display: flex;\n  align-items: center;\n  margin-right: 15px;\n  ","\n"]);return p=function(){return n},n}function d(){var n=Object(r.a)(["\n  padding-bottom: 15px;\n  ","\n"]);return d=function(){return n},n}function f(){var n=Object(r.a)(["\n  padding: 25px 40px 35px;\n"]);return f=function(){return n},n}function v(){var n=Object(r.a)(["\n  width: 390px;\n  position: relative;\n  padding-bottom: 90px;\n  padding-top: 50px;\n"]);return v=function(){return n},n}function b(){var n=Object(r.a)(["\n  width: 100vw;\n  min-height: 100vh;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  padding: 15px; \n"]);return b=function(){return n},n}var g=a.c.div(b()),h=a.c.div(v()),m=Object(a.c)(i.c.Element)(f()),O=a.c.div(d(),c.b.size(21)),j=(a.c.div(p(),(function(n){return n.withBottomMargin&&"margin-bottom: 5px;"})),a.c.div(s()),a.c.div(l(),c.a.borderLightest)),y=a.c.div(u()),w=Object(a.c)(i.b)(o())},114:function(n,t,e){"use strict";e.d(t,"b",(function(){return a}));var r=e(34),a=function(){return{type:r.a.LOGOUT_USER}};t.a={loginUser:function(n){return{type:r.a.LOGIN_USER,payload:n}},fetchUser:function(n){return{type:r.a.FETCH_USER,payload:n}},logoutUser:a,setParlor:function(n){return{type:r.a.SET_PARLOR,payload:n}}}},117:function(n,t,e){"use strict";var r=e(114);e.d(t,"a",(function(){return r.a}))},119:function(n,t,e){"use strict";e.d(t,"d",(function(){return o})),e.d(t,"b",(function(){return u})),e.d(t,"c",(function(){return l})),e.d(t,"a",(function(){return s}));var r=e(20),a=e(116),c=e.n(a),i=e(9),o=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return c.a.parse(n,Object(r.a)({arrayFormat:"bracket"},t))},u=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return c.a.stringify(n,Object(r.a)({arrayFormat:"bracket"},t))},l=function(n,t){return u(Object(i.omit)(o(n),t))},s=function(n,t){return u(Object(r.a)({},o(n),{},t))}},163:function(n,t,e){"use strict";e.r(t);var r=e(38),a=e.n(r),c=e(112),i=e(5),o=e(0),u=e.n(o),l=e(116),s=e.n(l),p=e(109),d=e(37),f=e(110),v=e(58),b=e(117),g=e(27),h=e(56);t.default=function(){var n=Object(g.g)().search,t=s.a.parse(n).next,e=Object(o.useContext)(h.a),r=e.dispatch,l=e.loggedIn,m=p.a.post("/auth/login/"),O=Object(i.a)(m,2),j=O[0].isCreating,y=O[1];return l?u.a.createElement(g.a,{to:t||"/"}):u.a.createElement(f.c,null,u.a.createElement(f.g,null,u.a.createElement(d.c,{enableReinitialize:!0,initialValues:{username:"",password:""},validations:{username:d.c.is.required(),password:d.c.is.required()},onSubmit:function(){var n=Object(c.a)(a.a.mark((function n(t,e){var c,i;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,y(t);case 3:c=n.sent,i=c.token,localStorage.setItem("token",i),r(b.a.loginUser(i)),v.a.success("You are successfully authorized."),n.next=13;break;case 10:n.prev=10,n.t0=n.catch(0),d.c.handleAPIError(n.t0,e);case 13:case"end":return n.stop()}}),n,null,[[0,10]])})));return function(t,e){return n.apply(this,arguments)}}()},u.a.createElement(f.e,null,u.a.createElement(f.f,null,"\u0410\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f"),u.a.createElement(d.c.Field.Input,{name:"username",label:"\u0418\u043c\u044f \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f"}),u.a.createElement(d.c.Field.Input,{type:"password",name:"password",label:"\u041f\u0430\u0440\u043e\u043b\u044c"}),u.a.createElement(f.b,null,u.a.createElement(f.a,{type:"submit",variant:"primary",isWorking:j},"\u0412\u043e\u0439\u0442\u0438"))))))}}}]);
//# sourceMappingURL=5.b1b91344.chunk.js.map