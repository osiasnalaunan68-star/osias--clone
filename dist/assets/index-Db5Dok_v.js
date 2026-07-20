var Qd=Object.defineProperty;var Zd=(a,n,i)=>n in a?Qd(a,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):a[n]=i;var Qn=(a,n,i)=>Zd(a,typeof n!="symbol"?n+"":n,i);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const g of s.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&e(g)}).observe(document,{childList:!0,subtree:!0});function i(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(t){if(t.ep)return;t.ep=!0;const s=i(t);fetch(t.href,s)}})();function Np(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}function Yd(a){if(a.__esModule)return a;var n=a.default;if(typeof n=="function"){var i=function e(){return this instanceof e?Reflect.construct(n,arguments,this.constructor):n.apply(this,arguments)};i.prototype=n.prototype}else i={};return Object.defineProperty(i,"__esModule",{value:!0}),Object.keys(a).forEach(function(e){var t=Object.getOwnPropertyDescriptor(a,e);Object.defineProperty(i,e,t.get?t:{enumerable:!0,get:function(){return a[e]}})}),i}var Rp={exports:{}},Do={},Op={exports:{}},Y={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mt=Symbol.for("react.element"),Jd=Symbol.for("react.portal"),Xd=Symbol.for("react.fragment"),ac=Symbol.for("react.strict_mode"),nc=Symbol.for("react.profiler"),ic=Symbol.for("react.provider"),ec=Symbol.for("react.context"),tc=Symbol.for("react.forward_ref"),oc=Symbol.for("react.suspense"),sc=Symbol.for("react.memo"),rc=Symbol.for("react.lazy"),dl=Symbol.iterator;function gc(a){return a===null||typeof a!="object"?null:(a=dl&&a[dl]||a["@@iterator"],typeof a=="function"?a:null)}var _p={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},jp=Object.assign,Hp={};function ke(a,n,i){this.props=a,this.context=n,this.refs=Hp,this.updater=i||_p}ke.prototype.isReactComponent={};ke.prototype.setState=function(a,n){if(typeof a!="object"&&typeof a!="function"&&a!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,n,"setState")};ke.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function Kp(){}Kp.prototype=ke.prototype;function Rr(a,n,i){this.props=a,this.context=n,this.refs=Hp,this.updater=i||_p}var Or=Rr.prototype=new Kp;Or.constructor=Rr;jp(Or,ke.prototype);Or.isPureReactComponent=!0;var cl=Array.isArray,Fp=Object.prototype.hasOwnProperty,_r={current:null},zp={key:!0,ref:!0,__self:!0,__source:!0};function Lp(a,n,i){var e,t={},s=null,g=null;if(n!=null)for(e in n.ref!==void 0&&(g=n.ref),n.key!==void 0&&(s=""+n.key),n)Fp.call(n,e)&&!zp.hasOwnProperty(e)&&(t[e]=n[e]);var u=arguments.length-2;if(u===1)t.children=i;else if(1<u){for(var d=Array(u),m=0;m<u;m++)d[m]=arguments[m+2];t.children=d}if(a&&a.defaultProps)for(e in u=a.defaultProps,u)t[e]===void 0&&(t[e]=u[e]);return{$$typeof:mt,type:a,key:s,ref:g,props:t,_owner:_r.current}}function lc(a,n){return{$$typeof:mt,type:a.type,key:n,ref:a.ref,props:a.props,_owner:a._owner}}function jr(a){return typeof a=="object"&&a!==null&&a.$$typeof===mt}function pc(a){var n={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(i){return n[i]})}var hl=/\/+/g;function ms(a,n){return typeof a=="object"&&a!==null&&a.key!=null?pc(""+a.key):n.toString(36)}function Qt(a,n,i,e,t){var s=typeof a;(s==="undefined"||s==="boolean")&&(a=null);var g=!1;if(a===null)g=!0;else switch(s){case"string":case"number":g=!0;break;case"object":switch(a.$$typeof){case mt:case Jd:g=!0}}if(g)return g=a,t=t(g),a=e===""?"."+ms(g,0):e,cl(t)?(i="",a!=null&&(i=a.replace(hl,"$&/")+"/"),Qt(t,n,i,"",function(m){return m})):t!=null&&(jr(t)&&(t=lc(t,i+(!t.key||g&&g.key===t.key?"":(""+t.key).replace(hl,"$&/")+"/")+a)),n.push(t)),1;if(g=0,e=e===""?".":e+":",cl(a))for(var u=0;u<a.length;u++){s=a[u];var d=e+ms(s,u);g+=Qt(s,n,i,d,t)}else if(d=gc(a),typeof d=="function")for(a=d.call(a),u=0;!(s=a.next()).done;)s=s.value,d=e+ms(s,u++),g+=Qt(s,n,i,d,t);else if(s==="object")throw n=String(a),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return g}function Et(a,n,i){if(a==null)return a;var e=[],t=0;return Qt(a,e,"","",function(s){return n.call(i,s,t++)}),e}function mc(a){if(a._status===-1){var n=a._result;n=n(),n.then(function(i){(a._status===0||a._status===-1)&&(a._status=1,a._result=i)},function(i){(a._status===0||a._status===-1)&&(a._status=2,a._result=i)}),a._status===-1&&(a._status=0,a._result=n)}if(a._status===1)return a._result.default;throw a._result}var Ka={current:null},Zt={transition:null},uc={ReactCurrentDispatcher:Ka,ReactCurrentBatchConfig:Zt,ReactCurrentOwner:_r};function Gp(){throw Error("act(...) is not supported in production builds of React.")}Y.Children={map:Et,forEach:function(a,n,i){Et(a,function(){n.apply(this,arguments)},i)},count:function(a){var n=0;return Et(a,function(){n++}),n},toArray:function(a){return Et(a,function(n){return n})||[]},only:function(a){if(!jr(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};Y.Component=ke;Y.Fragment=Xd;Y.Profiler=nc;Y.PureComponent=Rr;Y.StrictMode=ac;Y.Suspense=oc;Y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=uc;Y.act=Gp;Y.cloneElement=function(a,n,i){if(a==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var e=jp({},a.props),t=a.key,s=a.ref,g=a._owner;if(n!=null){if(n.ref!==void 0&&(s=n.ref,g=_r.current),n.key!==void 0&&(t=""+n.key),a.type&&a.type.defaultProps)var u=a.type.defaultProps;for(d in n)Fp.call(n,d)&&!zp.hasOwnProperty(d)&&(e[d]=n[d]===void 0&&u!==void 0?u[d]:n[d])}var d=arguments.length-2;if(d===1)e.children=i;else if(1<d){u=Array(d);for(var m=0;m<d;m++)u[m]=arguments[m+2];e.children=u}return{$$typeof:mt,type:a.type,key:t,ref:s,props:e,_owner:g}};Y.createContext=function(a){return a={$$typeof:ec,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},a.Provider={$$typeof:ic,_context:a},a.Consumer=a};Y.createElement=Lp;Y.createFactory=function(a){var n=Lp.bind(null,a);return n.type=a,n};Y.createRef=function(){return{current:null}};Y.forwardRef=function(a){return{$$typeof:tc,render:a}};Y.isValidElement=jr;Y.lazy=function(a){return{$$typeof:rc,_payload:{_status:-1,_result:a},_init:mc}};Y.memo=function(a,n){return{$$typeof:sc,type:a,compare:n===void 0?null:n}};Y.startTransition=function(a){var n=Zt.transition;Zt.transition={};try{a()}finally{Zt.transition=n}};Y.unstable_act=Gp;Y.useCallback=function(a,n){return Ka.current.useCallback(a,n)};Y.useContext=function(a){return Ka.current.useContext(a)};Y.useDebugValue=function(){};Y.useDeferredValue=function(a){return Ka.current.useDeferredValue(a)};Y.useEffect=function(a,n){return Ka.current.useEffect(a,n)};Y.useId=function(){return Ka.current.useId()};Y.useImperativeHandle=function(a,n,i){return Ka.current.useImperativeHandle(a,n,i)};Y.useInsertionEffect=function(a,n){return Ka.current.useInsertionEffect(a,n)};Y.useLayoutEffect=function(a,n){return Ka.current.useLayoutEffect(a,n)};Y.useMemo=function(a,n){return Ka.current.useMemo(a,n)};Y.useReducer=function(a,n,i){return Ka.current.useReducer(a,n,i)};Y.useRef=function(a){return Ka.current.useRef(a)};Y.useState=function(a){return Ka.current.useState(a)};Y.useSyncExternalStore=function(a,n,i){return Ka.current.useSyncExternalStore(a,n,i)};Y.useTransition=function(){return Ka.current.useTransition()};Y.version="18.3.1";Op.exports=Y;var D=Op.exports;const qp=Np(D);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dc=D,cc=Symbol.for("react.element"),hc=Symbol.for("react.fragment"),yc=Object.prototype.hasOwnProperty,kc=dc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,bc={key:!0,ref:!0,__self:!0,__source:!0};function Wp(a,n,i){var e,t={},s=null,g=null;i!==void 0&&(s=""+i),n.key!==void 0&&(s=""+n.key),n.ref!==void 0&&(g=n.ref);for(e in n)yc.call(n,e)&&!bc.hasOwnProperty(e)&&(t[e]=n[e]);if(a&&a.defaultProps)for(e in n=a.defaultProps,n)t[e]===void 0&&(t[e]=n[e]);return{$$typeof:cc,type:a,key:s,ref:g,props:t,_owner:kc.current}}Do.Fragment=hc;Do.jsx=Wp;Do.jsxs=Wp;Rp.exports=Do;var c=Rp.exports,Ks={},Up={exports:{}},Xa={},Vp={exports:{}},$p={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(a){function n(N,G){var U=N.length;N.push(G);a:for(;0<U;){var ga=U-1>>>1,ra=N[ga];if(0<t(ra,G))N[ga]=G,N[U]=ra,U=ga;else break a}}function i(N){return N.length===0?null:N[0]}function e(N){if(N.length===0)return null;var G=N[0],U=N.pop();if(U!==G){N[0]=U;a:for(var ga=0,ra=N.length,dn=ra>>>1;ga<dn;){var Ma=2*(ga+1)-1,qn=N[Ma],nn=Ma+1,en=N[nn];if(0>t(qn,U))nn<ra&&0>t(en,qn)?(N[ga]=en,N[nn]=U,ga=nn):(N[ga]=qn,N[Ma]=U,ga=Ma);else if(nn<ra&&0>t(en,U))N[ga]=en,N[nn]=U,ga=nn;else break a}}return G}function t(N,G){var U=N.sortIndex-G.sortIndex;return U!==0?U:N.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;a.unstable_now=function(){return s.now()}}else{var g=Date,u=g.now();a.unstable_now=function(){return g.now()-u}}var d=[],m=[],C=1,f=null,S=3,P=!1,T=!1,A=!1,L=typeof setTimeout=="function"?setTimeout:null,k=typeof clearTimeout=="function"?clearTimeout:null,h=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function b(N){for(var G=i(m);G!==null;){if(G.callback===null)e(m);else if(G.startTime<=N)e(m),G.sortIndex=G.expirationTime,n(d,G);else break;G=i(m)}}function v(N){if(A=!1,b(N),!T)if(i(d)!==null)T=!0,Va(E);else{var G=i(m);G!==null&&Ca(v,G.startTime-N)}}function E(N,G){T=!1,A&&(A=!1,k(j),j=-1),P=!0;var U=S;try{for(b(G),f=i(d);f!==null&&(!(f.expirationTime>G)||N&&!na());){var ga=f.callback;if(typeof ga=="function"){f.callback=null,S=f.priorityLevel;var ra=ga(f.expirationTime<=G);G=a.unstable_now(),typeof ra=="function"?f.callback=ra:f===i(d)&&e(d),b(G)}else e(d);f=i(d)}if(f!==null)var dn=!0;else{var Ma=i(m);Ma!==null&&Ca(v,Ma.startTime-G),dn=!1}return dn}finally{f=null,S=U,P=!1}}var O=!1,_=null,j=-1,X=5,K=-1;function na(){return!(a.unstable_now()-K<X)}function Q(){if(_!==null){var N=a.unstable_now();K=N;var G=!0;try{G=_(!0,N)}finally{G?aa():(O=!1,_=null)}}else O=!1}var aa;if(typeof h=="function")aa=function(){h(Q)};else if(typeof MessageChannel<"u"){var ea=new MessageChannel,yi=ea.port2;ea.port1.onmessage=Q,aa=function(){yi.postMessage(null)}}else aa=function(){L(Q,0)};function Va(N){_=N,O||(O=!0,aa())}function Ca(N,G){j=L(function(){N(a.unstable_now())},G)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(N){N.callback=null},a.unstable_continueExecution=function(){T||P||(T=!0,Va(E))},a.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):X=0<N?Math.floor(1e3/N):5},a.unstable_getCurrentPriorityLevel=function(){return S},a.unstable_getFirstCallbackNode=function(){return i(d)},a.unstable_next=function(N){switch(S){case 1:case 2:case 3:var G=3;break;default:G=S}var U=S;S=G;try{return N()}finally{S=U}},a.unstable_pauseExecution=function(){},a.unstable_requestPaint=function(){},a.unstable_runWithPriority=function(N,G){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var U=S;S=N;try{return G()}finally{S=U}},a.unstable_scheduleCallback=function(N,G,U){var ga=a.unstable_now();switch(typeof U=="object"&&U!==null?(U=U.delay,U=typeof U=="number"&&0<U?ga+U:ga):U=ga,N){case 1:var ra=-1;break;case 2:ra=250;break;case 5:ra=1073741823;break;case 4:ra=1e4;break;default:ra=5e3}return ra=U+ra,N={id:C++,callback:G,priorityLevel:N,startTime:U,expirationTime:ra,sortIndex:-1},U>ga?(N.sortIndex=U,n(m,N),i(d)===null&&N===i(m)&&(A?(k(j),j=-1):A=!0,Ca(v,U-ga))):(N.sortIndex=ra,n(d,N),T||P||(T=!0,Va(E))),N},a.unstable_shouldYield=na,a.unstable_wrapCallback=function(N){var G=S;return function(){var U=S;S=G;try{return N.apply(this,arguments)}finally{S=U}}}})($p);Vp.exports=$p;var fc=Vp.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wc=D,Ja=fc;function I(a){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+a,i=1;i<arguments.length;i++)n+="&args[]="+encodeURIComponent(arguments[i]);return"Minified React error #"+a+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Qp=new Set,Ve={};function Hi(a,n){pe(a,n),pe(a+"Capture",n)}function pe(a,n){for(Ve[a]=n,a=0;a<n.length;a++)Qp.add(n[a])}var Kn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Fs=Object.prototype.hasOwnProperty,Sc=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,yl={},kl={};function xc(a){return Fs.call(kl,a)?!0:Fs.call(yl,a)?!1:Sc.test(a)?kl[a]=!0:(yl[a]=!0,!1)}function vc(a,n,i,e){if(i!==null&&i.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return e?!1:i!==null?!i.acceptsBooleans:(a=a.toLowerCase().slice(0,5),a!=="data-"&&a!=="aria-");default:return!1}}function Cc(a,n,i,e){if(n===null||typeof n>"u"||vc(a,n,i,e))return!0;if(e)return!1;if(i!==null)switch(i.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function Fa(a,n,i,e,t,s,g){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=e,this.attributeNamespace=t,this.mustUseProperty=i,this.propertyName=a,this.type=n,this.sanitizeURL=s,this.removeEmptyString=g}var Ea={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){Ea[a]=new Fa(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var n=a[0];Ea[n]=new Fa(n,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){Ea[a]=new Fa(a,2,!1,a.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){Ea[a]=new Fa(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){Ea[a]=new Fa(a,3,!1,a.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(a){Ea[a]=new Fa(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){Ea[a]=new Fa(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){Ea[a]=new Fa(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){Ea[a]=new Fa(a,5,!1,a.toLowerCase(),null,!1,!1)});var Hr=/[\-:]([a-z])/g;function Kr(a){return a[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var n=a.replace(Hr,Kr);Ea[n]=new Fa(n,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var n=a.replace(Hr,Kr);Ea[n]=new Fa(n,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var n=a.replace(Hr,Kr);Ea[n]=new Fa(n,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){Ea[a]=new Fa(a,1,!1,a.toLowerCase(),null,!1,!1)});Ea.xlinkHref=new Fa("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){Ea[a]=new Fa(a,1,!1,a.toLowerCase(),null,!0,!0)});function Fr(a,n,i,e){var t=Ea.hasOwnProperty(n)?Ea[n]:null;(t!==null?t.type!==0:e||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Cc(n,i,t,e)&&(i=null),e||t===null?xc(n)&&(i===null?a.removeAttribute(n):a.setAttribute(n,""+i)):t.mustUseProperty?a[t.propertyName]=i===null?t.type===3?!1:"":i:(n=t.attributeName,e=t.attributeNamespace,i===null?a.removeAttribute(n):(t=t.type,i=t===3||t===4&&i===!0?"":""+i,e?a.setAttributeNS(e,n,i):a.setAttribute(n,i))))}var Gn=wc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Dt=Symbol.for("react.element"),Ui=Symbol.for("react.portal"),Vi=Symbol.for("react.fragment"),zr=Symbol.for("react.strict_mode"),zs=Symbol.for("react.profiler"),Zp=Symbol.for("react.provider"),Yp=Symbol.for("react.context"),Lr=Symbol.for("react.forward_ref"),Ls=Symbol.for("react.suspense"),Gs=Symbol.for("react.suspense_list"),Gr=Symbol.for("react.memo"),Yn=Symbol.for("react.lazy"),Jp=Symbol.for("react.offscreen"),bl=Symbol.iterator;function Te(a){return a===null||typeof a!="object"?null:(a=bl&&a[bl]||a["@@iterator"],typeof a=="function"?a:null)}var ka=Object.assign,us;function Re(a){if(us===void 0)try{throw Error()}catch(i){var n=i.stack.trim().match(/\n( *(at )?)/);us=n&&n[1]||""}return`
`+us+a}var ds=!1;function cs(a,n){if(!a||ds)return"";ds=!0;var i=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(m){var e=m}Reflect.construct(a,[],n)}else{try{n.call()}catch(m){e=m}a.call(n.prototype)}else{try{throw Error()}catch(m){e=m}a()}}catch(m){if(m&&e&&typeof m.stack=="string"){for(var t=m.stack.split(`
`),s=e.stack.split(`
`),g=t.length-1,u=s.length-1;1<=g&&0<=u&&t[g]!==s[u];)u--;for(;1<=g&&0<=u;g--,u--)if(t[g]!==s[u]){if(g!==1||u!==1)do if(g--,u--,0>u||t[g]!==s[u]){var d=`
`+t[g].replace(" at new "," at ");return a.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",a.displayName)),d}while(1<=g&&0<=u);break}}}finally{ds=!1,Error.prepareStackTrace=i}return(a=a?a.displayName||a.name:"")?Re(a):""}function Ac(a){switch(a.tag){case 5:return Re(a.type);case 16:return Re("Lazy");case 13:return Re("Suspense");case 19:return Re("SuspenseList");case 0:case 2:case 15:return a=cs(a.type,!1),a;case 11:return a=cs(a.type.render,!1),a;case 1:return a=cs(a.type,!0),a;default:return""}}function qs(a){if(a==null)return null;if(typeof a=="function")return a.displayName||a.name||null;if(typeof a=="string")return a;switch(a){case Vi:return"Fragment";case Ui:return"Portal";case zs:return"Profiler";case zr:return"StrictMode";case Ls:return"Suspense";case Gs:return"SuspenseList"}if(typeof a=="object")switch(a.$$typeof){case Yp:return(a.displayName||"Context")+".Consumer";case Zp:return(a._context.displayName||"Context")+".Provider";case Lr:var n=a.render;return a=a.displayName,a||(a=n.displayName||n.name||"",a=a!==""?"ForwardRef("+a+")":"ForwardRef"),a;case Gr:return n=a.displayName||null,n!==null?n:qs(a.type)||"Memo";case Yn:n=a._payload,a=a._init;try{return qs(a(n))}catch{}}return null}function Tc(a){var n=a.type;switch(a.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return a=n.render,a=a.displayName||a.name||"",n.displayName||(a!==""?"ForwardRef("+a+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return qs(n);case 8:return n===zr?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function mi(a){switch(typeof a){case"boolean":case"number":case"string":case"undefined":return a;case"object":return a;default:return""}}function Xp(a){var n=a.type;return(a=a.nodeName)&&a.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Mc(a){var n=Xp(a)?"checked":"value",i=Object.getOwnPropertyDescriptor(a.constructor.prototype,n),e=""+a[n];if(!a.hasOwnProperty(n)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var t=i.get,s=i.set;return Object.defineProperty(a,n,{configurable:!0,get:function(){return t.call(this)},set:function(g){e=""+g,s.call(this,g)}}),Object.defineProperty(a,n,{enumerable:i.enumerable}),{getValue:function(){return e},setValue:function(g){e=""+g},stopTracking:function(){a._valueTracker=null,delete a[n]}}}}function Nt(a){a._valueTracker||(a._valueTracker=Mc(a))}function am(a){if(!a)return!1;var n=a._valueTracker;if(!n)return!0;var i=n.getValue(),e="";return a&&(e=Xp(a)?a.checked?"true":"false":a.value),a=e,a!==i?(n.setValue(a),!0):!1}function ro(a){if(a=a||(typeof document<"u"?document:void 0),typeof a>"u")return null;try{return a.activeElement||a.body}catch{return a.body}}function Ws(a,n){var i=n.checked;return ka({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:i??a._wrapperState.initialChecked})}function fl(a,n){var i=n.defaultValue==null?"":n.defaultValue,e=n.checked!=null?n.checked:n.defaultChecked;i=mi(n.value!=null?n.value:i),a._wrapperState={initialChecked:e,initialValue:i,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function nm(a,n){n=n.checked,n!=null&&Fr(a,"checked",n,!1)}function Us(a,n){nm(a,n);var i=mi(n.value),e=n.type;if(i!=null)e==="number"?(i===0&&a.value===""||a.value!=i)&&(a.value=""+i):a.value!==""+i&&(a.value=""+i);else if(e==="submit"||e==="reset"){a.removeAttribute("value");return}n.hasOwnProperty("value")?Vs(a,n.type,i):n.hasOwnProperty("defaultValue")&&Vs(a,n.type,mi(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(a.defaultChecked=!!n.defaultChecked)}function wl(a,n,i){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var e=n.type;if(!(e!=="submit"&&e!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+a._wrapperState.initialValue,i||n===a.value||(a.value=n),a.defaultValue=n}i=a.name,i!==""&&(a.name=""),a.defaultChecked=!!a._wrapperState.initialChecked,i!==""&&(a.name=i)}function Vs(a,n,i){(n!=="number"||ro(a.ownerDocument)!==a)&&(i==null?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+i&&(a.defaultValue=""+i))}var Oe=Array.isArray;function te(a,n,i,e){if(a=a.options,n){n={};for(var t=0;t<i.length;t++)n["$"+i[t]]=!0;for(i=0;i<a.length;i++)t=n.hasOwnProperty("$"+a[i].value),a[i].selected!==t&&(a[i].selected=t),t&&e&&(a[i].defaultSelected=!0)}else{for(i=""+mi(i),n=null,t=0;t<a.length;t++){if(a[t].value===i){a[t].selected=!0,e&&(a[t].defaultSelected=!0);return}n!==null||a[t].disabled||(n=a[t])}n!==null&&(n.selected=!0)}}function $s(a,n){if(n.dangerouslySetInnerHTML!=null)throw Error(I(91));return ka({},n,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function Sl(a,n){var i=n.value;if(i==null){if(i=n.children,n=n.defaultValue,i!=null){if(n!=null)throw Error(I(92));if(Oe(i)){if(1<i.length)throw Error(I(93));i=i[0]}n=i}n==null&&(n=""),i=n}a._wrapperState={initialValue:mi(i)}}function im(a,n){var i=mi(n.value),e=mi(n.defaultValue);i!=null&&(i=""+i,i!==a.value&&(a.value=i),n.defaultValue==null&&a.defaultValue!==i&&(a.defaultValue=i)),e!=null&&(a.defaultValue=""+e)}function xl(a){var n=a.textContent;n===a._wrapperState.initialValue&&n!==""&&n!==null&&(a.value=n)}function em(a){switch(a){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Qs(a,n){return a==null||a==="http://www.w3.org/1999/xhtml"?em(n):a==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":a}var Rt,tm=function(a){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,i,e,t){MSApp.execUnsafeLocalFunction(function(){return a(n,i,e,t)})}:a}(function(a,n){if(a.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in a)a.innerHTML=n;else{for(Rt=Rt||document.createElement("div"),Rt.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=Rt.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;n.firstChild;)a.appendChild(n.firstChild)}});function $e(a,n){if(n){var i=a.firstChild;if(i&&i===a.lastChild&&i.nodeType===3){i.nodeValue=n;return}}a.textContent=n}var He={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Pc=["Webkit","ms","Moz","O"];Object.keys(He).forEach(function(a){Pc.forEach(function(n){n=n+a.charAt(0).toUpperCase()+a.substring(1),He[n]=He[a]})});function om(a,n,i){return n==null||typeof n=="boolean"||n===""?"":i||typeof n!="number"||n===0||He.hasOwnProperty(a)&&He[a]?(""+n).trim():n+"px"}function sm(a,n){a=a.style;for(var i in n)if(n.hasOwnProperty(i)){var e=i.indexOf("--")===0,t=om(i,n[i],e);i==="float"&&(i="cssFloat"),e?a.setProperty(i,t):a[i]=t}}var Bc=ka({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zs(a,n){if(n){if(Bc[a]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(I(137,a));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(I(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(I(61))}if(n.style!=null&&typeof n.style!="object")throw Error(I(62))}}function Ys(a,n){if(a.indexOf("-")===-1)return typeof n.is=="string";switch(a){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Js=null;function qr(a){return a=a.target||a.srcElement||window,a.correspondingUseElement&&(a=a.correspondingUseElement),a.nodeType===3?a.parentNode:a}var Xs=null,oe=null,se=null;function vl(a){if(a=ct(a)){if(typeof Xs!="function")throw Error(I(280));var n=a.stateNode;n&&(n=jo(n),Xs(a.stateNode,a.type,n))}}function rm(a){oe?se?se.push(a):se=[a]:oe=a}function gm(){if(oe){var a=oe,n=se;if(se=oe=null,vl(a),n)for(a=0;a<n.length;a++)vl(n[a])}}function lm(a,n){return a(n)}function pm(){}var hs=!1;function mm(a,n,i){if(hs)return a(n,i);hs=!0;try{return lm(a,n,i)}finally{hs=!1,(oe!==null||se!==null)&&(pm(),gm())}}function Qe(a,n){var i=a.stateNode;if(i===null)return null;var e=jo(i);if(e===null)return null;i=e[n];a:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(e=!e.disabled)||(a=a.type,e=!(a==="button"||a==="input"||a==="select"||a==="textarea")),a=!e;break a;default:a=!1}if(a)return null;if(i&&typeof i!="function")throw Error(I(231,n,typeof i));return i}var ar=!1;if(Kn)try{var Me={};Object.defineProperty(Me,"passive",{get:function(){ar=!0}}),window.addEventListener("test",Me,Me),window.removeEventListener("test",Me,Me)}catch{ar=!1}function Ic(a,n,i,e,t,s,g,u,d){var m=Array.prototype.slice.call(arguments,3);try{n.apply(i,m)}catch(C){this.onError(C)}}var Ke=!1,go=null,lo=!1,nr=null,Ec={onError:function(a){Ke=!0,go=a}};function Dc(a,n,i,e,t,s,g,u,d){Ke=!1,go=null,Ic.apply(Ec,arguments)}function Nc(a,n,i,e,t,s,g,u,d){if(Dc.apply(this,arguments),Ke){if(Ke){var m=go;Ke=!1,go=null}else throw Error(I(198));lo||(lo=!0,nr=m)}}function Ki(a){var n=a,i=a;if(a.alternate)for(;n.return;)n=n.return;else{a=n;do n=a,n.flags&4098&&(i=n.return),a=n.return;while(a)}return n.tag===3?i:null}function um(a){if(a.tag===13){var n=a.memoizedState;if(n===null&&(a=a.alternate,a!==null&&(n=a.memoizedState)),n!==null)return n.dehydrated}return null}function Cl(a){if(Ki(a)!==a)throw Error(I(188))}function Rc(a){var n=a.alternate;if(!n){if(n=Ki(a),n===null)throw Error(I(188));return n!==a?null:a}for(var i=a,e=n;;){var t=i.return;if(t===null)break;var s=t.alternate;if(s===null){if(e=t.return,e!==null){i=e;continue}break}if(t.child===s.child){for(s=t.child;s;){if(s===i)return Cl(t),a;if(s===e)return Cl(t),n;s=s.sibling}throw Error(I(188))}if(i.return!==e.return)i=t,e=s;else{for(var g=!1,u=t.child;u;){if(u===i){g=!0,i=t,e=s;break}if(u===e){g=!0,e=t,i=s;break}u=u.sibling}if(!g){for(u=s.child;u;){if(u===i){g=!0,i=s,e=t;break}if(u===e){g=!0,e=s,i=t;break}u=u.sibling}if(!g)throw Error(I(189))}}if(i.alternate!==e)throw Error(I(190))}if(i.tag!==3)throw Error(I(188));return i.stateNode.current===i?a:n}function dm(a){return a=Rc(a),a!==null?cm(a):null}function cm(a){if(a.tag===5||a.tag===6)return a;for(a=a.child;a!==null;){var n=cm(a);if(n!==null)return n;a=a.sibling}return null}var hm=Ja.unstable_scheduleCallback,Al=Ja.unstable_cancelCallback,Oc=Ja.unstable_shouldYield,_c=Ja.unstable_requestPaint,fa=Ja.unstable_now,jc=Ja.unstable_getCurrentPriorityLevel,Wr=Ja.unstable_ImmediatePriority,ym=Ja.unstable_UserBlockingPriority,po=Ja.unstable_NormalPriority,Hc=Ja.unstable_LowPriority,km=Ja.unstable_IdlePriority,No=null,Bn=null;function Kc(a){if(Bn&&typeof Bn.onCommitFiberRoot=="function")try{Bn.onCommitFiberRoot(No,a,void 0,(a.current.flags&128)===128)}catch{}}var Sn=Math.clz32?Math.clz32:Lc,Fc=Math.log,zc=Math.LN2;function Lc(a){return a>>>=0,a===0?32:31-(Fc(a)/zc|0)|0}var Ot=64,_t=4194304;function _e(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return a}}function mo(a,n){var i=a.pendingLanes;if(i===0)return 0;var e=0,t=a.suspendedLanes,s=a.pingedLanes,g=i&268435455;if(g!==0){var u=g&~t;u!==0?e=_e(u):(s&=g,s!==0&&(e=_e(s)))}else g=i&~t,g!==0?e=_e(g):s!==0&&(e=_e(s));if(e===0)return 0;if(n!==0&&n!==e&&!(n&t)&&(t=e&-e,s=n&-n,t>=s||t===16&&(s&4194240)!==0))return n;if(e&4&&(e|=i&16),n=a.entangledLanes,n!==0)for(a=a.entanglements,n&=e;0<n;)i=31-Sn(n),t=1<<i,e|=a[i],n&=~t;return e}function Gc(a,n){switch(a){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function qc(a,n){for(var i=a.suspendedLanes,e=a.pingedLanes,t=a.expirationTimes,s=a.pendingLanes;0<s;){var g=31-Sn(s),u=1<<g,d=t[g];d===-1?(!(u&i)||u&e)&&(t[g]=Gc(u,n)):d<=n&&(a.expiredLanes|=u),s&=~u}}function ir(a){return a=a.pendingLanes&-1073741825,a!==0?a:a&1073741824?1073741824:0}function bm(){var a=Ot;return Ot<<=1,!(Ot&4194240)&&(Ot=64),a}function ys(a){for(var n=[],i=0;31>i;i++)n.push(a);return n}function ut(a,n,i){a.pendingLanes|=n,n!==536870912&&(a.suspendedLanes=0,a.pingedLanes=0),a=a.eventTimes,n=31-Sn(n),a[n]=i}function Wc(a,n){var i=a.pendingLanes&~n;a.pendingLanes=n,a.suspendedLanes=0,a.pingedLanes=0,a.expiredLanes&=n,a.mutableReadLanes&=n,a.entangledLanes&=n,n=a.entanglements;var e=a.eventTimes;for(a=a.expirationTimes;0<i;){var t=31-Sn(i),s=1<<t;n[t]=0,e[t]=-1,a[t]=-1,i&=~s}}function Ur(a,n){var i=a.entangledLanes|=n;for(a=a.entanglements;i;){var e=31-Sn(i),t=1<<e;t&n|a[e]&n&&(a[e]|=n),i&=~t}}var sa=0;function fm(a){return a&=-a,1<a?4<a?a&268435455?16:536870912:4:1}var wm,Vr,Sm,xm,vm,er=!1,jt=[],ei=null,ti=null,oi=null,Ze=new Map,Ye=new Map,Xn=[],Uc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Tl(a,n){switch(a){case"focusin":case"focusout":ei=null;break;case"dragenter":case"dragleave":ti=null;break;case"mouseover":case"mouseout":oi=null;break;case"pointerover":case"pointerout":Ze.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ye.delete(n.pointerId)}}function Pe(a,n,i,e,t,s){return a===null||a.nativeEvent!==s?(a={blockedOn:n,domEventName:i,eventSystemFlags:e,nativeEvent:s,targetContainers:[t]},n!==null&&(n=ct(n),n!==null&&Vr(n)),a):(a.eventSystemFlags|=e,n=a.targetContainers,t!==null&&n.indexOf(t)===-1&&n.push(t),a)}function Vc(a,n,i,e,t){switch(n){case"focusin":return ei=Pe(ei,a,n,i,e,t),!0;case"dragenter":return ti=Pe(ti,a,n,i,e,t),!0;case"mouseover":return oi=Pe(oi,a,n,i,e,t),!0;case"pointerover":var s=t.pointerId;return Ze.set(s,Pe(Ze.get(s)||null,a,n,i,e,t)),!0;case"gotpointercapture":return s=t.pointerId,Ye.set(s,Pe(Ye.get(s)||null,a,n,i,e,t)),!0}return!1}function Cm(a){var n=Mi(a.target);if(n!==null){var i=Ki(n);if(i!==null){if(n=i.tag,n===13){if(n=um(i),n!==null){a.blockedOn=n,vm(a.priority,function(){Sm(i)});return}}else if(n===3&&i.stateNode.current.memoizedState.isDehydrated){a.blockedOn=i.tag===3?i.stateNode.containerInfo:null;return}}}a.blockedOn=null}function Yt(a){if(a.blockedOn!==null)return!1;for(var n=a.targetContainers;0<n.length;){var i=tr(a.domEventName,a.eventSystemFlags,n[0],a.nativeEvent);if(i===null){i=a.nativeEvent;var e=new i.constructor(i.type,i);Js=e,i.target.dispatchEvent(e),Js=null}else return n=ct(i),n!==null&&Vr(n),a.blockedOn=i,!1;n.shift()}return!0}function Ml(a,n,i){Yt(a)&&i.delete(n)}function $c(){er=!1,ei!==null&&Yt(ei)&&(ei=null),ti!==null&&Yt(ti)&&(ti=null),oi!==null&&Yt(oi)&&(oi=null),Ze.forEach(Ml),Ye.forEach(Ml)}function Be(a,n){a.blockedOn===n&&(a.blockedOn=null,er||(er=!0,Ja.unstable_scheduleCallback(Ja.unstable_NormalPriority,$c)))}function Je(a){function n(t){return Be(t,a)}if(0<jt.length){Be(jt[0],a);for(var i=1;i<jt.length;i++){var e=jt[i];e.blockedOn===a&&(e.blockedOn=null)}}for(ei!==null&&Be(ei,a),ti!==null&&Be(ti,a),oi!==null&&Be(oi,a),Ze.forEach(n),Ye.forEach(n),i=0;i<Xn.length;i++)e=Xn[i],e.blockedOn===a&&(e.blockedOn=null);for(;0<Xn.length&&(i=Xn[0],i.blockedOn===null);)Cm(i),i.blockedOn===null&&Xn.shift()}var re=Gn.ReactCurrentBatchConfig,uo=!0;function Qc(a,n,i,e){var t=sa,s=re.transition;re.transition=null;try{sa=1,$r(a,n,i,e)}finally{sa=t,re.transition=s}}function Zc(a,n,i,e){var t=sa,s=re.transition;re.transition=null;try{sa=4,$r(a,n,i,e)}finally{sa=t,re.transition=s}}function $r(a,n,i,e){if(uo){var t=tr(a,n,i,e);if(t===null)Ts(a,n,e,co,i),Tl(a,e);else if(Vc(t,a,n,i,e))e.stopPropagation();else if(Tl(a,e),n&4&&-1<Uc.indexOf(a)){for(;t!==null;){var s=ct(t);if(s!==null&&wm(s),s=tr(a,n,i,e),s===null&&Ts(a,n,e,co,i),s===t)break;t=s}t!==null&&e.stopPropagation()}else Ts(a,n,e,null,i)}}var co=null;function tr(a,n,i,e){if(co=null,a=qr(e),a=Mi(a),a!==null)if(n=Ki(a),n===null)a=null;else if(i=n.tag,i===13){if(a=um(n),a!==null)return a;a=null}else if(i===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;a=null}else n!==a&&(a=null);return co=a,null}function Am(a){switch(a){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(jc()){case Wr:return 1;case ym:return 4;case po:case Hc:return 16;case km:return 536870912;default:return 16}default:return 16}}var ni=null,Qr=null,Jt=null;function Tm(){if(Jt)return Jt;var a,n=Qr,i=n.length,e,t="value"in ni?ni.value:ni.textContent,s=t.length;for(a=0;a<i&&n[a]===t[a];a++);var g=i-a;for(e=1;e<=g&&n[i-e]===t[s-e];e++);return Jt=t.slice(a,1<e?1-e:void 0)}function Xt(a){var n=a.keyCode;return"charCode"in a?(a=a.charCode,a===0&&n===13&&(a=13)):a=n,a===10&&(a=13),32<=a||a===13?a:0}function Ht(){return!0}function Pl(){return!1}function an(a){function n(i,e,t,s,g){this._reactName=i,this._targetInst=t,this.type=e,this.nativeEvent=s,this.target=g,this.currentTarget=null;for(var u in a)a.hasOwnProperty(u)&&(i=a[u],this[u]=i?i(s):s[u]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ht:Pl,this.isPropagationStopped=Pl,this}return ka(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var i=this.nativeEvent;i&&(i.preventDefault?i.preventDefault():typeof i.returnValue!="unknown"&&(i.returnValue=!1),this.isDefaultPrevented=Ht)},stopPropagation:function(){var i=this.nativeEvent;i&&(i.stopPropagation?i.stopPropagation():typeof i.cancelBubble!="unknown"&&(i.cancelBubble=!0),this.isPropagationStopped=Ht)},persist:function(){},isPersistent:Ht}),n}var be={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Zr=an(be),dt=ka({},be,{view:0,detail:0}),Yc=an(dt),ks,bs,Ie,Ro=ka({},dt,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Yr,button:0,buttons:0,relatedTarget:function(a){return a.relatedTarget===void 0?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){return"movementX"in a?a.movementX:(a!==Ie&&(Ie&&a.type==="mousemove"?(ks=a.screenX-Ie.screenX,bs=a.screenY-Ie.screenY):bs=ks=0,Ie=a),ks)},movementY:function(a){return"movementY"in a?a.movementY:bs}}),Bl=an(Ro),Jc=ka({},Ro,{dataTransfer:0}),Xc=an(Jc),ah=ka({},dt,{relatedTarget:0}),fs=an(ah),nh=ka({},be,{animationName:0,elapsedTime:0,pseudoElement:0}),ih=an(nh),eh=ka({},be,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),th=an(eh),oh=ka({},be,{data:0}),Il=an(oh),sh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},rh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},gh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function lh(a){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(a):(a=gh[a])?!!n[a]:!1}function Yr(){return lh}var ph=ka({},dt,{key:function(a){if(a.key){var n=sh[a.key]||a.key;if(n!=="Unidentified")return n}return a.type==="keypress"?(a=Xt(a),a===13?"Enter":String.fromCharCode(a)):a.type==="keydown"||a.type==="keyup"?rh[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Yr,charCode:function(a){return a.type==="keypress"?Xt(a):0},keyCode:function(a){return a.type==="keydown"||a.type==="keyup"?a.keyCode:0},which:function(a){return a.type==="keypress"?Xt(a):a.type==="keydown"||a.type==="keyup"?a.keyCode:0}}),mh=an(ph),uh=ka({},Ro,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),El=an(uh),dh=ka({},dt,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Yr}),ch=an(dh),hh=ka({},be,{propertyName:0,elapsedTime:0,pseudoElement:0}),yh=an(hh),kh=ka({},Ro,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),bh=an(kh),fh=[9,13,27,32],Jr=Kn&&"CompositionEvent"in window,Fe=null;Kn&&"documentMode"in document&&(Fe=document.documentMode);var wh=Kn&&"TextEvent"in window&&!Fe,Mm=Kn&&(!Jr||Fe&&8<Fe&&11>=Fe),Dl=" ",Nl=!1;function Pm(a,n){switch(a){case"keyup":return fh.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Bm(a){return a=a.detail,typeof a=="object"&&"data"in a?a.data:null}var $i=!1;function Sh(a,n){switch(a){case"compositionend":return Bm(n);case"keypress":return n.which!==32?null:(Nl=!0,Dl);case"textInput":return a=n.data,a===Dl&&Nl?null:a;default:return null}}function xh(a,n){if($i)return a==="compositionend"||!Jr&&Pm(a,n)?(a=Tm(),Jt=Qr=ni=null,$i=!1,a):null;switch(a){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Mm&&n.locale!=="ko"?null:n.data;default:return null}}var vh={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Rl(a){var n=a&&a.nodeName&&a.nodeName.toLowerCase();return n==="input"?!!vh[a.type]:n==="textarea"}function Im(a,n,i,e){rm(e),n=ho(n,"onChange"),0<n.length&&(i=new Zr("onChange","change",null,i,e),a.push({event:i,listeners:n}))}var ze=null,Xe=null;function Ch(a){zm(a,0)}function Oo(a){var n=Yi(a);if(am(n))return a}function Ah(a,n){if(a==="change")return n}var Em=!1;if(Kn){var ws;if(Kn){var Ss="oninput"in document;if(!Ss){var Ol=document.createElement("div");Ol.setAttribute("oninput","return;"),Ss=typeof Ol.oninput=="function"}ws=Ss}else ws=!1;Em=ws&&(!document.documentMode||9<document.documentMode)}function _l(){ze&&(ze.detachEvent("onpropertychange",Dm),Xe=ze=null)}function Dm(a){if(a.propertyName==="value"&&Oo(Xe)){var n=[];Im(n,Xe,a,qr(a)),mm(Ch,n)}}function Th(a,n,i){a==="focusin"?(_l(),ze=n,Xe=i,ze.attachEvent("onpropertychange",Dm)):a==="focusout"&&_l()}function Mh(a){if(a==="selectionchange"||a==="keyup"||a==="keydown")return Oo(Xe)}function Ph(a,n){if(a==="click")return Oo(n)}function Bh(a,n){if(a==="input"||a==="change")return Oo(n)}function Ih(a,n){return a===n&&(a!==0||1/a===1/n)||a!==a&&n!==n}var vn=typeof Object.is=="function"?Object.is:Ih;function at(a,n){if(vn(a,n))return!0;if(typeof a!="object"||a===null||typeof n!="object"||n===null)return!1;var i=Object.keys(a),e=Object.keys(n);if(i.length!==e.length)return!1;for(e=0;e<i.length;e++){var t=i[e];if(!Fs.call(n,t)||!vn(a[t],n[t]))return!1}return!0}function jl(a){for(;a&&a.firstChild;)a=a.firstChild;return a}function Hl(a,n){var i=jl(a);a=0;for(var e;i;){if(i.nodeType===3){if(e=a+i.textContent.length,a<=n&&e>=n)return{node:i,offset:n-a};a=e}a:{for(;i;){if(i.nextSibling){i=i.nextSibling;break a}i=i.parentNode}i=void 0}i=jl(i)}}function Nm(a,n){return a&&n?a===n?!0:a&&a.nodeType===3?!1:n&&n.nodeType===3?Nm(a,n.parentNode):"contains"in a?a.contains(n):a.compareDocumentPosition?!!(a.compareDocumentPosition(n)&16):!1:!1}function Rm(){for(var a=window,n=ro();n instanceof a.HTMLIFrameElement;){try{var i=typeof n.contentWindow.location.href=="string"}catch{i=!1}if(i)a=n.contentWindow;else break;n=ro(a.document)}return n}function Xr(a){var n=a&&a.nodeName&&a.nodeName.toLowerCase();return n&&(n==="input"&&(a.type==="text"||a.type==="search"||a.type==="tel"||a.type==="url"||a.type==="password")||n==="textarea"||a.contentEditable==="true")}function Eh(a){var n=Rm(),i=a.focusedElem,e=a.selectionRange;if(n!==i&&i&&i.ownerDocument&&Nm(i.ownerDocument.documentElement,i)){if(e!==null&&Xr(i)){if(n=e.start,a=e.end,a===void 0&&(a=n),"selectionStart"in i)i.selectionStart=n,i.selectionEnd=Math.min(a,i.value.length);else if(a=(n=i.ownerDocument||document)&&n.defaultView||window,a.getSelection){a=a.getSelection();var t=i.textContent.length,s=Math.min(e.start,t);e=e.end===void 0?s:Math.min(e.end,t),!a.extend&&s>e&&(t=e,e=s,s=t),t=Hl(i,s);var g=Hl(i,e);t&&g&&(a.rangeCount!==1||a.anchorNode!==t.node||a.anchorOffset!==t.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(n=n.createRange(),n.setStart(t.node,t.offset),a.removeAllRanges(),s>e?(a.addRange(n),a.extend(g.node,g.offset)):(n.setEnd(g.node,g.offset),a.addRange(n)))}}for(n=[],a=i;a=a.parentNode;)a.nodeType===1&&n.push({element:a,left:a.scrollLeft,top:a.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<n.length;i++)a=n[i],a.element.scrollLeft=a.left,a.element.scrollTop=a.top}}var Dh=Kn&&"documentMode"in document&&11>=document.documentMode,Qi=null,or=null,Le=null,sr=!1;function Kl(a,n,i){var e=i.window===i?i.document:i.nodeType===9?i:i.ownerDocument;sr||Qi==null||Qi!==ro(e)||(e=Qi,"selectionStart"in e&&Xr(e)?e={start:e.selectionStart,end:e.selectionEnd}:(e=(e.ownerDocument&&e.ownerDocument.defaultView||window).getSelection(),e={anchorNode:e.anchorNode,anchorOffset:e.anchorOffset,focusNode:e.focusNode,focusOffset:e.focusOffset}),Le&&at(Le,e)||(Le=e,e=ho(or,"onSelect"),0<e.length&&(n=new Zr("onSelect","select",null,n,i),a.push({event:n,listeners:e}),n.target=Qi)))}function Kt(a,n){var i={};return i[a.toLowerCase()]=n.toLowerCase(),i["Webkit"+a]="webkit"+n,i["Moz"+a]="moz"+n,i}var Zi={animationend:Kt("Animation","AnimationEnd"),animationiteration:Kt("Animation","AnimationIteration"),animationstart:Kt("Animation","AnimationStart"),transitionend:Kt("Transition","TransitionEnd")},xs={},Om={};Kn&&(Om=document.createElement("div").style,"AnimationEvent"in window||(delete Zi.animationend.animation,delete Zi.animationiteration.animation,delete Zi.animationstart.animation),"TransitionEvent"in window||delete Zi.transitionend.transition);function _o(a){if(xs[a])return xs[a];if(!Zi[a])return a;var n=Zi[a],i;for(i in n)if(n.hasOwnProperty(i)&&i in Om)return xs[a]=n[i];return a}var _m=_o("animationend"),jm=_o("animationiteration"),Hm=_o("animationstart"),Km=_o("transitionend"),Fm=new Map,Fl="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function di(a,n){Fm.set(a,n),Hi(n,[a])}for(var vs=0;vs<Fl.length;vs++){var Cs=Fl[vs],Nh=Cs.toLowerCase(),Rh=Cs[0].toUpperCase()+Cs.slice(1);di(Nh,"on"+Rh)}di(_m,"onAnimationEnd");di(jm,"onAnimationIteration");di(Hm,"onAnimationStart");di("dblclick","onDoubleClick");di("focusin","onFocus");di("focusout","onBlur");di(Km,"onTransitionEnd");pe("onMouseEnter",["mouseout","mouseover"]);pe("onMouseLeave",["mouseout","mouseover"]);pe("onPointerEnter",["pointerout","pointerover"]);pe("onPointerLeave",["pointerout","pointerover"]);Hi("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Hi("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Hi("onBeforeInput",["compositionend","keypress","textInput","paste"]);Hi("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Hi("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Hi("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var je="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Oh=new Set("cancel close invalid load scroll toggle".split(" ").concat(je));function zl(a,n,i){var e=a.type||"unknown-event";a.currentTarget=i,Nc(e,n,void 0,a),a.currentTarget=null}function zm(a,n){n=(n&4)!==0;for(var i=0;i<a.length;i++){var e=a[i],t=e.event;e=e.listeners;a:{var s=void 0;if(n)for(var g=e.length-1;0<=g;g--){var u=e[g],d=u.instance,m=u.currentTarget;if(u=u.listener,d!==s&&t.isPropagationStopped())break a;zl(t,u,m),s=d}else for(g=0;g<e.length;g++){if(u=e[g],d=u.instance,m=u.currentTarget,u=u.listener,d!==s&&t.isPropagationStopped())break a;zl(t,u,m),s=d}}}if(lo)throw a=nr,lo=!1,nr=null,a}function ua(a,n){var i=n[mr];i===void 0&&(i=n[mr]=new Set);var e=a+"__bubble";i.has(e)||(Lm(n,a,2,!1),i.add(e))}function As(a,n,i){var e=0;n&&(e|=4),Lm(i,a,e,n)}var Ft="_reactListening"+Math.random().toString(36).slice(2);function nt(a){if(!a[Ft]){a[Ft]=!0,Qp.forEach(function(i){i!=="selectionchange"&&(Oh.has(i)||As(i,!1,a),As(i,!0,a))});var n=a.nodeType===9?a:a.ownerDocument;n===null||n[Ft]||(n[Ft]=!0,As("selectionchange",!1,n))}}function Lm(a,n,i,e){switch(Am(n)){case 1:var t=Qc;break;case 4:t=Zc;break;default:t=$r}i=t.bind(null,n,i,a),t=void 0,!ar||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(t=!0),e?t!==void 0?a.addEventListener(n,i,{capture:!0,passive:t}):a.addEventListener(n,i,!0):t!==void 0?a.addEventListener(n,i,{passive:t}):a.addEventListener(n,i,!1)}function Ts(a,n,i,e,t){var s=e;if(!(n&1)&&!(n&2)&&e!==null)a:for(;;){if(e===null)return;var g=e.tag;if(g===3||g===4){var u=e.stateNode.containerInfo;if(u===t||u.nodeType===8&&u.parentNode===t)break;if(g===4)for(g=e.return;g!==null;){var d=g.tag;if((d===3||d===4)&&(d=g.stateNode.containerInfo,d===t||d.nodeType===8&&d.parentNode===t))return;g=g.return}for(;u!==null;){if(g=Mi(u),g===null)return;if(d=g.tag,d===5||d===6){e=s=g;continue a}u=u.parentNode}}e=e.return}mm(function(){var m=s,C=qr(i),f=[];a:{var S=Fm.get(a);if(S!==void 0){var P=Zr,T=a;switch(a){case"keypress":if(Xt(i)===0)break a;case"keydown":case"keyup":P=mh;break;case"focusin":T="focus",P=fs;break;case"focusout":T="blur",P=fs;break;case"beforeblur":case"afterblur":P=fs;break;case"click":if(i.button===2)break a;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":P=Bl;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":P=Xc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":P=ch;break;case _m:case jm:case Hm:P=ih;break;case Km:P=yh;break;case"scroll":P=Yc;break;case"wheel":P=bh;break;case"copy":case"cut":case"paste":P=th;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":P=El}var A=(n&4)!==0,L=!A&&a==="scroll",k=A?S!==null?S+"Capture":null:S;A=[];for(var h=m,b;h!==null;){b=h;var v=b.stateNode;if(b.tag===5&&v!==null&&(b=v,k!==null&&(v=Qe(h,k),v!=null&&A.push(it(h,v,b)))),L)break;h=h.return}0<A.length&&(S=new P(S,T,null,i,C),f.push({event:S,listeners:A}))}}if(!(n&7)){a:{if(S=a==="mouseover"||a==="pointerover",P=a==="mouseout"||a==="pointerout",S&&i!==Js&&(T=i.relatedTarget||i.fromElement)&&(Mi(T)||T[Fn]))break a;if((P||S)&&(S=C.window===C?C:(S=C.ownerDocument)?S.defaultView||S.parentWindow:window,P?(T=i.relatedTarget||i.toElement,P=m,T=T?Mi(T):null,T!==null&&(L=Ki(T),T!==L||T.tag!==5&&T.tag!==6)&&(T=null)):(P=null,T=m),P!==T)){if(A=Bl,v="onMouseLeave",k="onMouseEnter",h="mouse",(a==="pointerout"||a==="pointerover")&&(A=El,v="onPointerLeave",k="onPointerEnter",h="pointer"),L=P==null?S:Yi(P),b=T==null?S:Yi(T),S=new A(v,h+"leave",P,i,C),S.target=L,S.relatedTarget=b,v=null,Mi(C)===m&&(A=new A(k,h+"enter",T,i,C),A.target=b,A.relatedTarget=L,v=A),L=v,P&&T)n:{for(A=P,k=T,h=0,b=A;b;b=Wi(b))h++;for(b=0,v=k;v;v=Wi(v))b++;for(;0<h-b;)A=Wi(A),h--;for(;0<b-h;)k=Wi(k),b--;for(;h--;){if(A===k||k!==null&&A===k.alternate)break n;A=Wi(A),k=Wi(k)}A=null}else A=null;P!==null&&Ll(f,S,P,A,!1),T!==null&&L!==null&&Ll(f,L,T,A,!0)}}a:{if(S=m?Yi(m):window,P=S.nodeName&&S.nodeName.toLowerCase(),P==="select"||P==="input"&&S.type==="file")var E=Ah;else if(Rl(S))if(Em)E=Bh;else{E=Mh;var O=Th}else(P=S.nodeName)&&P.toLowerCase()==="input"&&(S.type==="checkbox"||S.type==="radio")&&(E=Ph);if(E&&(E=E(a,m))){Im(f,E,i,C);break a}O&&O(a,S,m),a==="focusout"&&(O=S._wrapperState)&&O.controlled&&S.type==="number"&&Vs(S,"number",S.value)}switch(O=m?Yi(m):window,a){case"focusin":(Rl(O)||O.contentEditable==="true")&&(Qi=O,or=m,Le=null);break;case"focusout":Le=or=Qi=null;break;case"mousedown":sr=!0;break;case"contextmenu":case"mouseup":case"dragend":sr=!1,Kl(f,i,C);break;case"selectionchange":if(Dh)break;case"keydown":case"keyup":Kl(f,i,C)}var _;if(Jr)a:{switch(a){case"compositionstart":var j="onCompositionStart";break a;case"compositionend":j="onCompositionEnd";break a;case"compositionupdate":j="onCompositionUpdate";break a}j=void 0}else $i?Pm(a,i)&&(j="onCompositionEnd"):a==="keydown"&&i.keyCode===229&&(j="onCompositionStart");j&&(Mm&&i.locale!=="ko"&&($i||j!=="onCompositionStart"?j==="onCompositionEnd"&&$i&&(_=Tm()):(ni=C,Qr="value"in ni?ni.value:ni.textContent,$i=!0)),O=ho(m,j),0<O.length&&(j=new Il(j,a,null,i,C),f.push({event:j,listeners:O}),_?j.data=_:(_=Bm(i),_!==null&&(j.data=_)))),(_=wh?Sh(a,i):xh(a,i))&&(m=ho(m,"onBeforeInput"),0<m.length&&(C=new Il("onBeforeInput","beforeinput",null,i,C),f.push({event:C,listeners:m}),C.data=_))}zm(f,n)})}function it(a,n,i){return{instance:a,listener:n,currentTarget:i}}function ho(a,n){for(var i=n+"Capture",e=[];a!==null;){var t=a,s=t.stateNode;t.tag===5&&s!==null&&(t=s,s=Qe(a,i),s!=null&&e.unshift(it(a,s,t)),s=Qe(a,n),s!=null&&e.push(it(a,s,t))),a=a.return}return e}function Wi(a){if(a===null)return null;do a=a.return;while(a&&a.tag!==5);return a||null}function Ll(a,n,i,e,t){for(var s=n._reactName,g=[];i!==null&&i!==e;){var u=i,d=u.alternate,m=u.stateNode;if(d!==null&&d===e)break;u.tag===5&&m!==null&&(u=m,t?(d=Qe(i,s),d!=null&&g.unshift(it(i,d,u))):t||(d=Qe(i,s),d!=null&&g.push(it(i,d,u)))),i=i.return}g.length!==0&&a.push({event:n,listeners:g})}var _h=/\r\n?/g,jh=/\u0000|\uFFFD/g;function Gl(a){return(typeof a=="string"?a:""+a).replace(_h,`
`).replace(jh,"")}function zt(a,n,i){if(n=Gl(n),Gl(a)!==n&&i)throw Error(I(425))}function yo(){}var rr=null,gr=null;function lr(a,n){return a==="textarea"||a==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var pr=typeof setTimeout=="function"?setTimeout:void 0,Hh=typeof clearTimeout=="function"?clearTimeout:void 0,ql=typeof Promise=="function"?Promise:void 0,Kh=typeof queueMicrotask=="function"?queueMicrotask:typeof ql<"u"?function(a){return ql.resolve(null).then(a).catch(Fh)}:pr;function Fh(a){setTimeout(function(){throw a})}function Ms(a,n){var i=n,e=0;do{var t=i.nextSibling;if(a.removeChild(i),t&&t.nodeType===8)if(i=t.data,i==="/$"){if(e===0){a.removeChild(t),Je(n);return}e--}else i!=="$"&&i!=="$?"&&i!=="$!"||e++;i=t}while(i);Je(n)}function si(a){for(;a!=null;a=a.nextSibling){var n=a.nodeType;if(n===1||n===3)break;if(n===8){if(n=a.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return a}function Wl(a){a=a.previousSibling;for(var n=0;a;){if(a.nodeType===8){var i=a.data;if(i==="$"||i==="$!"||i==="$?"){if(n===0)return a;n--}else i==="/$"&&n++}a=a.previousSibling}return null}var fe=Math.random().toString(36).slice(2),Pn="__reactFiber$"+fe,et="__reactProps$"+fe,Fn="__reactContainer$"+fe,mr="__reactEvents$"+fe,zh="__reactListeners$"+fe,Lh="__reactHandles$"+fe;function Mi(a){var n=a[Pn];if(n)return n;for(var i=a.parentNode;i;){if(n=i[Fn]||i[Pn]){if(i=n.alternate,n.child!==null||i!==null&&i.child!==null)for(a=Wl(a);a!==null;){if(i=a[Pn])return i;a=Wl(a)}return n}a=i,i=a.parentNode}return null}function ct(a){return a=a[Pn]||a[Fn],!a||a.tag!==5&&a.tag!==6&&a.tag!==13&&a.tag!==3?null:a}function Yi(a){if(a.tag===5||a.tag===6)return a.stateNode;throw Error(I(33))}function jo(a){return a[et]||null}var ur=[],Ji=-1;function ci(a){return{current:a}}function da(a){0>Ji||(a.current=ur[Ji],ur[Ji]=null,Ji--)}function la(a,n){Ji++,ur[Ji]=a.current,a.current=n}var ui={},Oa=ci(ui),qa=ci(!1),Di=ui;function me(a,n){var i=a.type.contextTypes;if(!i)return ui;var e=a.stateNode;if(e&&e.__reactInternalMemoizedUnmaskedChildContext===n)return e.__reactInternalMemoizedMaskedChildContext;var t={},s;for(s in i)t[s]=n[s];return e&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=n,a.__reactInternalMemoizedMaskedChildContext=t),t}function Wa(a){return a=a.childContextTypes,a!=null}function ko(){da(qa),da(Oa)}function Ul(a,n,i){if(Oa.current!==ui)throw Error(I(168));la(Oa,n),la(qa,i)}function Gm(a,n,i){var e=a.stateNode;if(n=n.childContextTypes,typeof e.getChildContext!="function")return i;e=e.getChildContext();for(var t in e)if(!(t in n))throw Error(I(108,Tc(a)||"Unknown",t));return ka({},i,e)}function bo(a){return a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||ui,Di=Oa.current,la(Oa,a),la(qa,qa.current),!0}function Vl(a,n,i){var e=a.stateNode;if(!e)throw Error(I(169));i?(a=Gm(a,n,Di),e.__reactInternalMemoizedMergedChildContext=a,da(qa),da(Oa),la(Oa,a)):da(qa),la(qa,i)}var Rn=null,Ho=!1,Ps=!1;function qm(a){Rn===null?Rn=[a]:Rn.push(a)}function Gh(a){Ho=!0,qm(a)}function hi(){if(!Ps&&Rn!==null){Ps=!0;var a=0,n=sa;try{var i=Rn;for(sa=1;a<i.length;a++){var e=i[a];do e=e(!0);while(e!==null)}Rn=null,Ho=!1}catch(t){throw Rn!==null&&(Rn=Rn.slice(a+1)),hm(Wr,hi),t}finally{sa=n,Ps=!1}}return null}var Xi=[],ae=0,fo=null,wo=0,rn=[],gn=0,Ni=null,On=1,_n="";function Ai(a,n){Xi[ae++]=wo,Xi[ae++]=fo,fo=a,wo=n}function Wm(a,n,i){rn[gn++]=On,rn[gn++]=_n,rn[gn++]=Ni,Ni=a;var e=On;a=_n;var t=32-Sn(e)-1;e&=~(1<<t),i+=1;var s=32-Sn(n)+t;if(30<s){var g=t-t%5;s=(e&(1<<g)-1).toString(32),e>>=g,t-=g,On=1<<32-Sn(n)+t|i<<t|e,_n=s+a}else On=1<<s|i<<t|e,_n=a}function ag(a){a.return!==null&&(Ai(a,1),Wm(a,1,0))}function ng(a){for(;a===fo;)fo=Xi[--ae],Xi[ae]=null,wo=Xi[--ae],Xi[ae]=null;for(;a===Ni;)Ni=rn[--gn],rn[gn]=null,_n=rn[--gn],rn[gn]=null,On=rn[--gn],rn[gn]=null}var Ya=null,Za=null,ca=!1,wn=null;function Um(a,n){var i=ln(5,null,null,0);i.elementType="DELETED",i.stateNode=n,i.return=a,n=a.deletions,n===null?(a.deletions=[i],a.flags|=16):n.push(i)}function $l(a,n){switch(a.tag){case 5:var i=a.type;return n=n.nodeType!==1||i.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(a.stateNode=n,Ya=a,Za=si(n.firstChild),!0):!1;case 6:return n=a.pendingProps===""||n.nodeType!==3?null:n,n!==null?(a.stateNode=n,Ya=a,Za=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(i=Ni!==null?{id:On,overflow:_n}:null,a.memoizedState={dehydrated:n,treeContext:i,retryLane:1073741824},i=ln(18,null,null,0),i.stateNode=n,i.return=a,a.child=i,Ya=a,Za=null,!0):!1;default:return!1}}function dr(a){return(a.mode&1)!==0&&(a.flags&128)===0}function cr(a){if(ca){var n=Za;if(n){var i=n;if(!$l(a,n)){if(dr(a))throw Error(I(418));n=si(i.nextSibling);var e=Ya;n&&$l(a,n)?Um(e,i):(a.flags=a.flags&-4097|2,ca=!1,Ya=a)}}else{if(dr(a))throw Error(I(418));a.flags=a.flags&-4097|2,ca=!1,Ya=a}}}function Ql(a){for(a=a.return;a!==null&&a.tag!==5&&a.tag!==3&&a.tag!==13;)a=a.return;Ya=a}function Lt(a){if(a!==Ya)return!1;if(!ca)return Ql(a),ca=!0,!1;var n;if((n=a.tag!==3)&&!(n=a.tag!==5)&&(n=a.type,n=n!=="head"&&n!=="body"&&!lr(a.type,a.memoizedProps)),n&&(n=Za)){if(dr(a))throw Vm(),Error(I(418));for(;n;)Um(a,n),n=si(n.nextSibling)}if(Ql(a),a.tag===13){if(a=a.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(I(317));a:{for(a=a.nextSibling,n=0;a;){if(a.nodeType===8){var i=a.data;if(i==="/$"){if(n===0){Za=si(a.nextSibling);break a}n--}else i!=="$"&&i!=="$!"&&i!=="$?"||n++}a=a.nextSibling}Za=null}}else Za=Ya?si(a.stateNode.nextSibling):null;return!0}function Vm(){for(var a=Za;a;)a=si(a.nextSibling)}function ue(){Za=Ya=null,ca=!1}function ig(a){wn===null?wn=[a]:wn.push(a)}var qh=Gn.ReactCurrentBatchConfig;function Ee(a,n,i){if(a=i.ref,a!==null&&typeof a!="function"&&typeof a!="object"){if(i._owner){if(i=i._owner,i){if(i.tag!==1)throw Error(I(309));var e=i.stateNode}if(!e)throw Error(I(147,a));var t=e,s=""+a;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===s?n.ref:(n=function(g){var u=t.refs;g===null?delete u[s]:u[s]=g},n._stringRef=s,n)}if(typeof a!="string")throw Error(I(284));if(!i._owner)throw Error(I(290,a))}return a}function Gt(a,n){throw a=Object.prototype.toString.call(n),Error(I(31,a==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":a))}function Zl(a){var n=a._init;return n(a._payload)}function $m(a){function n(k,h){if(a){var b=k.deletions;b===null?(k.deletions=[h],k.flags|=16):b.push(h)}}function i(k,h){if(!a)return null;for(;h!==null;)n(k,h),h=h.sibling;return null}function e(k,h){for(k=new Map;h!==null;)h.key!==null?k.set(h.key,h):k.set(h.index,h),h=h.sibling;return k}function t(k,h){return k=pi(k,h),k.index=0,k.sibling=null,k}function s(k,h,b){return k.index=b,a?(b=k.alternate,b!==null?(b=b.index,b<h?(k.flags|=2,h):b):(k.flags|=2,h)):(k.flags|=1048576,h)}function g(k){return a&&k.alternate===null&&(k.flags|=2),k}function u(k,h,b,v){return h===null||h.tag!==6?(h=Os(b,k.mode,v),h.return=k,h):(h=t(h,b),h.return=k,h)}function d(k,h,b,v){var E=b.type;return E===Vi?C(k,h,b.props.children,v,b.key):h!==null&&(h.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===Yn&&Zl(E)===h.type)?(v=t(h,b.props),v.ref=Ee(k,h,b),v.return=k,v):(v=so(b.type,b.key,b.props,null,k.mode,v),v.ref=Ee(k,h,b),v.return=k,v)}function m(k,h,b,v){return h===null||h.tag!==4||h.stateNode.containerInfo!==b.containerInfo||h.stateNode.implementation!==b.implementation?(h=_s(b,k.mode,v),h.return=k,h):(h=t(h,b.children||[]),h.return=k,h)}function C(k,h,b,v,E){return h===null||h.tag!==7?(h=Ei(b,k.mode,v,E),h.return=k,h):(h=t(h,b),h.return=k,h)}function f(k,h,b){if(typeof h=="string"&&h!==""||typeof h=="number")return h=Os(""+h,k.mode,b),h.return=k,h;if(typeof h=="object"&&h!==null){switch(h.$$typeof){case Dt:return b=so(h.type,h.key,h.props,null,k.mode,b),b.ref=Ee(k,null,h),b.return=k,b;case Ui:return h=_s(h,k.mode,b),h.return=k,h;case Yn:var v=h._init;return f(k,v(h._payload),b)}if(Oe(h)||Te(h))return h=Ei(h,k.mode,b,null),h.return=k,h;Gt(k,h)}return null}function S(k,h,b,v){var E=h!==null?h.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return E!==null?null:u(k,h,""+b,v);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Dt:return b.key===E?d(k,h,b,v):null;case Ui:return b.key===E?m(k,h,b,v):null;case Yn:return E=b._init,S(k,h,E(b._payload),v)}if(Oe(b)||Te(b))return E!==null?null:C(k,h,b,v,null);Gt(k,b)}return null}function P(k,h,b,v,E){if(typeof v=="string"&&v!==""||typeof v=="number")return k=k.get(b)||null,u(h,k,""+v,E);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Dt:return k=k.get(v.key===null?b:v.key)||null,d(h,k,v,E);case Ui:return k=k.get(v.key===null?b:v.key)||null,m(h,k,v,E);case Yn:var O=v._init;return P(k,h,b,O(v._payload),E)}if(Oe(v)||Te(v))return k=k.get(b)||null,C(h,k,v,E,null);Gt(h,v)}return null}function T(k,h,b,v){for(var E=null,O=null,_=h,j=h=0,X=null;_!==null&&j<b.length;j++){_.index>j?(X=_,_=null):X=_.sibling;var K=S(k,_,b[j],v);if(K===null){_===null&&(_=X);break}a&&_&&K.alternate===null&&n(k,_),h=s(K,h,j),O===null?E=K:O.sibling=K,O=K,_=X}if(j===b.length)return i(k,_),ca&&Ai(k,j),E;if(_===null){for(;j<b.length;j++)_=f(k,b[j],v),_!==null&&(h=s(_,h,j),O===null?E=_:O.sibling=_,O=_);return ca&&Ai(k,j),E}for(_=e(k,_);j<b.length;j++)X=P(_,k,j,b[j],v),X!==null&&(a&&X.alternate!==null&&_.delete(X.key===null?j:X.key),h=s(X,h,j),O===null?E=X:O.sibling=X,O=X);return a&&_.forEach(function(na){return n(k,na)}),ca&&Ai(k,j),E}function A(k,h,b,v){var E=Te(b);if(typeof E!="function")throw Error(I(150));if(b=E.call(b),b==null)throw Error(I(151));for(var O=E=null,_=h,j=h=0,X=null,K=b.next();_!==null&&!K.done;j++,K=b.next()){_.index>j?(X=_,_=null):X=_.sibling;var na=S(k,_,K.value,v);if(na===null){_===null&&(_=X);break}a&&_&&na.alternate===null&&n(k,_),h=s(na,h,j),O===null?E=na:O.sibling=na,O=na,_=X}if(K.done)return i(k,_),ca&&Ai(k,j),E;if(_===null){for(;!K.done;j++,K=b.next())K=f(k,K.value,v),K!==null&&(h=s(K,h,j),O===null?E=K:O.sibling=K,O=K);return ca&&Ai(k,j),E}for(_=e(k,_);!K.done;j++,K=b.next())K=P(_,k,j,K.value,v),K!==null&&(a&&K.alternate!==null&&_.delete(K.key===null?j:K.key),h=s(K,h,j),O===null?E=K:O.sibling=K,O=K);return a&&_.forEach(function(Q){return n(k,Q)}),ca&&Ai(k,j),E}function L(k,h,b,v){if(typeof b=="object"&&b!==null&&b.type===Vi&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case Dt:a:{for(var E=b.key,O=h;O!==null;){if(O.key===E){if(E=b.type,E===Vi){if(O.tag===7){i(k,O.sibling),h=t(O,b.props.children),h.return=k,k=h;break a}}else if(O.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===Yn&&Zl(E)===O.type){i(k,O.sibling),h=t(O,b.props),h.ref=Ee(k,O,b),h.return=k,k=h;break a}i(k,O);break}else n(k,O);O=O.sibling}b.type===Vi?(h=Ei(b.props.children,k.mode,v,b.key),h.return=k,k=h):(v=so(b.type,b.key,b.props,null,k.mode,v),v.ref=Ee(k,h,b),v.return=k,k=v)}return g(k);case Ui:a:{for(O=b.key;h!==null;){if(h.key===O)if(h.tag===4&&h.stateNode.containerInfo===b.containerInfo&&h.stateNode.implementation===b.implementation){i(k,h.sibling),h=t(h,b.children||[]),h.return=k,k=h;break a}else{i(k,h);break}else n(k,h);h=h.sibling}h=_s(b,k.mode,v),h.return=k,k=h}return g(k);case Yn:return O=b._init,L(k,h,O(b._payload),v)}if(Oe(b))return T(k,h,b,v);if(Te(b))return A(k,h,b,v);Gt(k,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,h!==null&&h.tag===6?(i(k,h.sibling),h=t(h,b),h.return=k,k=h):(i(k,h),h=Os(b,k.mode,v),h.return=k,k=h),g(k)):i(k,h)}return L}var de=$m(!0),Qm=$m(!1),So=ci(null),xo=null,ne=null,eg=null;function tg(){eg=ne=xo=null}function og(a){var n=So.current;da(So),a._currentValue=n}function hr(a,n,i){for(;a!==null;){var e=a.alternate;if((a.childLanes&n)!==n?(a.childLanes|=n,e!==null&&(e.childLanes|=n)):e!==null&&(e.childLanes&n)!==n&&(e.childLanes|=n),a===i)break;a=a.return}}function ge(a,n){xo=a,eg=ne=null,a=a.dependencies,a!==null&&a.firstContext!==null&&(a.lanes&n&&(Ga=!0),a.firstContext=null)}function mn(a){var n=a._currentValue;if(eg!==a)if(a={context:a,memoizedValue:n,next:null},ne===null){if(xo===null)throw Error(I(308));ne=a,xo.dependencies={lanes:0,firstContext:a}}else ne=ne.next=a;return n}var Pi=null;function sg(a){Pi===null?Pi=[a]:Pi.push(a)}function Zm(a,n,i,e){var t=n.interleaved;return t===null?(i.next=i,sg(n)):(i.next=t.next,t.next=i),n.interleaved=i,zn(a,e)}function zn(a,n){a.lanes|=n;var i=a.alternate;for(i!==null&&(i.lanes|=n),i=a,a=a.return;a!==null;)a.childLanes|=n,i=a.alternate,i!==null&&(i.childLanes|=n),i=a,a=a.return;return i.tag===3?i.stateNode:null}var Jn=!1;function rg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ym(a,n){a=a.updateQueue,n.updateQueue===a&&(n.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function Hn(a,n){return{eventTime:a,lane:n,tag:0,payload:null,callback:null,next:null}}function ri(a,n,i){var e=a.updateQueue;if(e===null)return null;if(e=e.shared,ia&2){var t=e.pending;return t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n,zn(a,i)}return t=e.interleaved,t===null?(n.next=n,sg(e)):(n.next=t.next,t.next=n),e.interleaved=n,zn(a,i)}function ao(a,n,i){if(n=n.updateQueue,n!==null&&(n=n.shared,(i&4194240)!==0)){var e=n.lanes;e&=a.pendingLanes,i|=e,n.lanes=i,Ur(a,i)}}function Yl(a,n){var i=a.updateQueue,e=a.alternate;if(e!==null&&(e=e.updateQueue,i===e)){var t=null,s=null;if(i=i.firstBaseUpdate,i!==null){do{var g={eventTime:i.eventTime,lane:i.lane,tag:i.tag,payload:i.payload,callback:i.callback,next:null};s===null?t=s=g:s=s.next=g,i=i.next}while(i!==null);s===null?t=s=n:s=s.next=n}else t=s=n;i={baseState:e.baseState,firstBaseUpdate:t,lastBaseUpdate:s,shared:e.shared,effects:e.effects},a.updateQueue=i;return}a=i.lastBaseUpdate,a===null?i.firstBaseUpdate=n:a.next=n,i.lastBaseUpdate=n}function vo(a,n,i,e){var t=a.updateQueue;Jn=!1;var s=t.firstBaseUpdate,g=t.lastBaseUpdate,u=t.shared.pending;if(u!==null){t.shared.pending=null;var d=u,m=d.next;d.next=null,g===null?s=m:g.next=m,g=d;var C=a.alternate;C!==null&&(C=C.updateQueue,u=C.lastBaseUpdate,u!==g&&(u===null?C.firstBaseUpdate=m:u.next=m,C.lastBaseUpdate=d))}if(s!==null){var f=t.baseState;g=0,C=m=d=null,u=s;do{var S=u.lane,P=u.eventTime;if((e&S)===S){C!==null&&(C=C.next={eventTime:P,lane:0,tag:u.tag,payload:u.payload,callback:u.callback,next:null});a:{var T=a,A=u;switch(S=n,P=i,A.tag){case 1:if(T=A.payload,typeof T=="function"){f=T.call(P,f,S);break a}f=T;break a;case 3:T.flags=T.flags&-65537|128;case 0:if(T=A.payload,S=typeof T=="function"?T.call(P,f,S):T,S==null)break a;f=ka({},f,S);break a;case 2:Jn=!0}}u.callback!==null&&u.lane!==0&&(a.flags|=64,S=t.effects,S===null?t.effects=[u]:S.push(u))}else P={eventTime:P,lane:S,tag:u.tag,payload:u.payload,callback:u.callback,next:null},C===null?(m=C=P,d=f):C=C.next=P,g|=S;if(u=u.next,u===null){if(u=t.shared.pending,u===null)break;S=u,u=S.next,S.next=null,t.lastBaseUpdate=S,t.shared.pending=null}}while(!0);if(C===null&&(d=f),t.baseState=d,t.firstBaseUpdate=m,t.lastBaseUpdate=C,n=t.shared.interleaved,n!==null){t=n;do g|=t.lane,t=t.next;while(t!==n)}else s===null&&(t.shared.lanes=0);Oi|=g,a.lanes=g,a.memoizedState=f}}function Jl(a,n,i){if(a=n.effects,n.effects=null,a!==null)for(n=0;n<a.length;n++){var e=a[n],t=e.callback;if(t!==null){if(e.callback=null,e=i,typeof t!="function")throw Error(I(191,t));t.call(e)}}}var ht={},In=ci(ht),tt=ci(ht),ot=ci(ht);function Bi(a){if(a===ht)throw Error(I(174));return a}function gg(a,n){switch(la(ot,n),la(tt,a),la(In,ht),a=n.nodeType,a){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:Qs(null,"");break;default:a=a===8?n.parentNode:n,n=a.namespaceURI||null,a=a.tagName,n=Qs(n,a)}da(In),la(In,n)}function ce(){da(In),da(tt),da(ot)}function Jm(a){Bi(ot.current);var n=Bi(In.current),i=Qs(n,a.type);n!==i&&(la(tt,a),la(In,i))}function lg(a){tt.current===a&&(da(In),da(tt))}var ha=ci(0);function Co(a){for(var n=a;n!==null;){if(n.tag===13){var i=n.memoizedState;if(i!==null&&(i=i.dehydrated,i===null||i.data==="$?"||i.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===a)break;for(;n.sibling===null;){if(n.return===null||n.return===a)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Bs=[];function pg(){for(var a=0;a<Bs.length;a++)Bs[a]._workInProgressVersionPrimary=null;Bs.length=0}var no=Gn.ReactCurrentDispatcher,Is=Gn.ReactCurrentBatchConfig,Ri=0,ya=null,xa=null,Aa=null,Ao=!1,Ge=!1,st=0,Wh=0;function Da(){throw Error(I(321))}function mg(a,n){if(n===null)return!1;for(var i=0;i<n.length&&i<a.length;i++)if(!vn(a[i],n[i]))return!1;return!0}function ug(a,n,i,e,t,s){if(Ri=s,ya=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,no.current=a===null||a.memoizedState===null?Qh:Zh,a=i(e,t),Ge){s=0;do{if(Ge=!1,st=0,25<=s)throw Error(I(301));s+=1,Aa=xa=null,n.updateQueue=null,no.current=Yh,a=i(e,t)}while(Ge)}if(no.current=To,n=xa!==null&&xa.next!==null,Ri=0,Aa=xa=ya=null,Ao=!1,n)throw Error(I(300));return a}function dg(){var a=st!==0;return st=0,a}function Mn(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Aa===null?ya.memoizedState=Aa=a:Aa=Aa.next=a,Aa}function un(){if(xa===null){var a=ya.alternate;a=a!==null?a.memoizedState:null}else a=xa.next;var n=Aa===null?ya.memoizedState:Aa.next;if(n!==null)Aa=n,xa=a;else{if(a===null)throw Error(I(310));xa=a,a={memoizedState:xa.memoizedState,baseState:xa.baseState,baseQueue:xa.baseQueue,queue:xa.queue,next:null},Aa===null?ya.memoizedState=Aa=a:Aa=Aa.next=a}return Aa}function rt(a,n){return typeof n=="function"?n(a):n}function Es(a){var n=un(),i=n.queue;if(i===null)throw Error(I(311));i.lastRenderedReducer=a;var e=xa,t=e.baseQueue,s=i.pending;if(s!==null){if(t!==null){var g=t.next;t.next=s.next,s.next=g}e.baseQueue=t=s,i.pending=null}if(t!==null){s=t.next,e=e.baseState;var u=g=null,d=null,m=s;do{var C=m.lane;if((Ri&C)===C)d!==null&&(d=d.next={lane:0,action:m.action,hasEagerState:m.hasEagerState,eagerState:m.eagerState,next:null}),e=m.hasEagerState?m.eagerState:a(e,m.action);else{var f={lane:C,action:m.action,hasEagerState:m.hasEagerState,eagerState:m.eagerState,next:null};d===null?(u=d=f,g=e):d=d.next=f,ya.lanes|=C,Oi|=C}m=m.next}while(m!==null&&m!==s);d===null?g=e:d.next=u,vn(e,n.memoizedState)||(Ga=!0),n.memoizedState=e,n.baseState=g,n.baseQueue=d,i.lastRenderedState=e}if(a=i.interleaved,a!==null){t=a;do s=t.lane,ya.lanes|=s,Oi|=s,t=t.next;while(t!==a)}else t===null&&(i.lanes=0);return[n.memoizedState,i.dispatch]}function Ds(a){var n=un(),i=n.queue;if(i===null)throw Error(I(311));i.lastRenderedReducer=a;var e=i.dispatch,t=i.pending,s=n.memoizedState;if(t!==null){i.pending=null;var g=t=t.next;do s=a(s,g.action),g=g.next;while(g!==t);vn(s,n.memoizedState)||(Ga=!0),n.memoizedState=s,n.baseQueue===null&&(n.baseState=s),i.lastRenderedState=s}return[s,e]}function Xm(){}function au(a,n){var i=ya,e=un(),t=n(),s=!vn(e.memoizedState,t);if(s&&(e.memoizedState=t,Ga=!0),e=e.queue,cg(eu.bind(null,i,e,a),[a]),e.getSnapshot!==n||s||Aa!==null&&Aa.memoizedState.tag&1){if(i.flags|=2048,gt(9,iu.bind(null,i,e,t,n),void 0,null),Ta===null)throw Error(I(349));Ri&30||nu(i,n,t)}return t}function nu(a,n,i){a.flags|=16384,a={getSnapshot:n,value:i},n=ya.updateQueue,n===null?(n={lastEffect:null,stores:null},ya.updateQueue=n,n.stores=[a]):(i=n.stores,i===null?n.stores=[a]:i.push(a))}function iu(a,n,i,e){n.value=i,n.getSnapshot=e,tu(n)&&ou(a)}function eu(a,n,i){return i(function(){tu(n)&&ou(a)})}function tu(a){var n=a.getSnapshot;a=a.value;try{var i=n();return!vn(a,i)}catch{return!0}}function ou(a){var n=zn(a,1);n!==null&&xn(n,a,1,-1)}function Xl(a){var n=Mn();return typeof a=="function"&&(a=a()),n.memoizedState=n.baseState=a,a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:rt,lastRenderedState:a},n.queue=a,a=a.dispatch=$h.bind(null,ya,a),[n.memoizedState,a]}function gt(a,n,i,e){return a={tag:a,create:n,destroy:i,deps:e,next:null},n=ya.updateQueue,n===null?(n={lastEffect:null,stores:null},ya.updateQueue=n,n.lastEffect=a.next=a):(i=n.lastEffect,i===null?n.lastEffect=a.next=a:(e=i.next,i.next=a,a.next=e,n.lastEffect=a)),a}function su(){return un().memoizedState}function io(a,n,i,e){var t=Mn();ya.flags|=a,t.memoizedState=gt(1|n,i,void 0,e===void 0?null:e)}function Ko(a,n,i,e){var t=un();e=e===void 0?null:e;var s=void 0;if(xa!==null){var g=xa.memoizedState;if(s=g.destroy,e!==null&&mg(e,g.deps)){t.memoizedState=gt(n,i,s,e);return}}ya.flags|=a,t.memoizedState=gt(1|n,i,s,e)}function ap(a,n){return io(8390656,8,a,n)}function cg(a,n){return Ko(2048,8,a,n)}function ru(a,n){return Ko(4,2,a,n)}function gu(a,n){return Ko(4,4,a,n)}function lu(a,n){if(typeof n=="function")return a=a(),n(a),function(){n(null)};if(n!=null)return a=a(),n.current=a,function(){n.current=null}}function pu(a,n,i){return i=i!=null?i.concat([a]):null,Ko(4,4,lu.bind(null,n,a),i)}function hg(){}function mu(a,n){var i=un();n=n===void 0?null:n;var e=i.memoizedState;return e!==null&&n!==null&&mg(n,e[1])?e[0]:(i.memoizedState=[a,n],a)}function uu(a,n){var i=un();n=n===void 0?null:n;var e=i.memoizedState;return e!==null&&n!==null&&mg(n,e[1])?e[0]:(a=a(),i.memoizedState=[a,n],a)}function du(a,n,i){return Ri&21?(vn(i,n)||(i=bm(),ya.lanes|=i,Oi|=i,a.baseState=!0),n):(a.baseState&&(a.baseState=!1,Ga=!0),a.memoizedState=i)}function Uh(a,n){var i=sa;sa=i!==0&&4>i?i:4,a(!0);var e=Is.transition;Is.transition={};try{a(!1),n()}finally{sa=i,Is.transition=e}}function cu(){return un().memoizedState}function Vh(a,n,i){var e=li(a);if(i={lane:e,action:i,hasEagerState:!1,eagerState:null,next:null},hu(a))yu(n,i);else if(i=Zm(a,n,i,e),i!==null){var t=Ha();xn(i,a,e,t),ku(i,n,e)}}function $h(a,n,i){var e=li(a),t={lane:e,action:i,hasEagerState:!1,eagerState:null,next:null};if(hu(a))yu(n,t);else{var s=a.alternate;if(a.lanes===0&&(s===null||s.lanes===0)&&(s=n.lastRenderedReducer,s!==null))try{var g=n.lastRenderedState,u=s(g,i);if(t.hasEagerState=!0,t.eagerState=u,vn(u,g)){var d=n.interleaved;d===null?(t.next=t,sg(n)):(t.next=d.next,d.next=t),n.interleaved=t;return}}catch{}finally{}i=Zm(a,n,t,e),i!==null&&(t=Ha(),xn(i,a,e,t),ku(i,n,e))}}function hu(a){var n=a.alternate;return a===ya||n!==null&&n===ya}function yu(a,n){Ge=Ao=!0;var i=a.pending;i===null?n.next=n:(n.next=i.next,i.next=n),a.pending=n}function ku(a,n,i){if(i&4194240){var e=n.lanes;e&=a.pendingLanes,i|=e,n.lanes=i,Ur(a,i)}}var To={readContext:mn,useCallback:Da,useContext:Da,useEffect:Da,useImperativeHandle:Da,useInsertionEffect:Da,useLayoutEffect:Da,useMemo:Da,useReducer:Da,useRef:Da,useState:Da,useDebugValue:Da,useDeferredValue:Da,useTransition:Da,useMutableSource:Da,useSyncExternalStore:Da,useId:Da,unstable_isNewReconciler:!1},Qh={readContext:mn,useCallback:function(a,n){return Mn().memoizedState=[a,n===void 0?null:n],a},useContext:mn,useEffect:ap,useImperativeHandle:function(a,n,i){return i=i!=null?i.concat([a]):null,io(4194308,4,lu.bind(null,n,a),i)},useLayoutEffect:function(a,n){return io(4194308,4,a,n)},useInsertionEffect:function(a,n){return io(4,2,a,n)},useMemo:function(a,n){var i=Mn();return n=n===void 0?null:n,a=a(),i.memoizedState=[a,n],a},useReducer:function(a,n,i){var e=Mn();return n=i!==void 0?i(n):n,e.memoizedState=e.baseState=n,a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:n},e.queue=a,a=a.dispatch=Vh.bind(null,ya,a),[e.memoizedState,a]},useRef:function(a){var n=Mn();return a={current:a},n.memoizedState=a},useState:Xl,useDebugValue:hg,useDeferredValue:function(a){return Mn().memoizedState=a},useTransition:function(){var a=Xl(!1),n=a[0];return a=Uh.bind(null,a[1]),Mn().memoizedState=a,[n,a]},useMutableSource:function(){},useSyncExternalStore:function(a,n,i){var e=ya,t=Mn();if(ca){if(i===void 0)throw Error(I(407));i=i()}else{if(i=n(),Ta===null)throw Error(I(349));Ri&30||nu(e,n,i)}t.memoizedState=i;var s={value:i,getSnapshot:n};return t.queue=s,ap(eu.bind(null,e,s,a),[a]),e.flags|=2048,gt(9,iu.bind(null,e,s,i,n),void 0,null),i},useId:function(){var a=Mn(),n=Ta.identifierPrefix;if(ca){var i=_n,e=On;i=(e&~(1<<32-Sn(e)-1)).toString(32)+i,n=":"+n+"R"+i,i=st++,0<i&&(n+="H"+i.toString(32)),n+=":"}else i=Wh++,n=":"+n+"r"+i.toString(32)+":";return a.memoizedState=n},unstable_isNewReconciler:!1},Zh={readContext:mn,useCallback:mu,useContext:mn,useEffect:cg,useImperativeHandle:pu,useInsertionEffect:ru,useLayoutEffect:gu,useMemo:uu,useReducer:Es,useRef:su,useState:function(){return Es(rt)},useDebugValue:hg,useDeferredValue:function(a){var n=un();return du(n,xa.memoizedState,a)},useTransition:function(){var a=Es(rt)[0],n=un().memoizedState;return[a,n]},useMutableSource:Xm,useSyncExternalStore:au,useId:cu,unstable_isNewReconciler:!1},Yh={readContext:mn,useCallback:mu,useContext:mn,useEffect:cg,useImperativeHandle:pu,useInsertionEffect:ru,useLayoutEffect:gu,useMemo:uu,useReducer:Ds,useRef:su,useState:function(){return Ds(rt)},useDebugValue:hg,useDeferredValue:function(a){var n=un();return xa===null?n.memoizedState=a:du(n,xa.memoizedState,a)},useTransition:function(){var a=Ds(rt)[0],n=un().memoizedState;return[a,n]},useMutableSource:Xm,useSyncExternalStore:au,useId:cu,unstable_isNewReconciler:!1};function bn(a,n){if(a&&a.defaultProps){n=ka({},n),a=a.defaultProps;for(var i in a)n[i]===void 0&&(n[i]=a[i]);return n}return n}function yr(a,n,i,e){n=a.memoizedState,i=i(e,n),i=i==null?n:ka({},n,i),a.memoizedState=i,a.lanes===0&&(a.updateQueue.baseState=i)}var Fo={isMounted:function(a){return(a=a._reactInternals)?Ki(a)===a:!1},enqueueSetState:function(a,n,i){a=a._reactInternals;var e=Ha(),t=li(a),s=Hn(e,t);s.payload=n,i!=null&&(s.callback=i),n=ri(a,s,t),n!==null&&(xn(n,a,t,e),ao(n,a,t))},enqueueReplaceState:function(a,n,i){a=a._reactInternals;var e=Ha(),t=li(a),s=Hn(e,t);s.tag=1,s.payload=n,i!=null&&(s.callback=i),n=ri(a,s,t),n!==null&&(xn(n,a,t,e),ao(n,a,t))},enqueueForceUpdate:function(a,n){a=a._reactInternals;var i=Ha(),e=li(a),t=Hn(i,e);t.tag=2,n!=null&&(t.callback=n),n=ri(a,t,e),n!==null&&(xn(n,a,e,i),ao(n,a,e))}};function np(a,n,i,e,t,s,g){return a=a.stateNode,typeof a.shouldComponentUpdate=="function"?a.shouldComponentUpdate(e,s,g):n.prototype&&n.prototype.isPureReactComponent?!at(i,e)||!at(t,s):!0}function bu(a,n,i){var e=!1,t=ui,s=n.contextType;return typeof s=="object"&&s!==null?s=mn(s):(t=Wa(n)?Di:Oa.current,e=n.contextTypes,s=(e=e!=null)?me(a,t):ui),n=new n(i,s),a.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Fo,a.stateNode=n,n._reactInternals=a,e&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=t,a.__reactInternalMemoizedMaskedChildContext=s),n}function ip(a,n,i,e){a=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(i,e),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(i,e),n.state!==a&&Fo.enqueueReplaceState(n,n.state,null)}function kr(a,n,i,e){var t=a.stateNode;t.props=i,t.state=a.memoizedState,t.refs={},rg(a);var s=n.contextType;typeof s=="object"&&s!==null?t.context=mn(s):(s=Wa(n)?Di:Oa.current,t.context=me(a,s)),t.state=a.memoizedState,s=n.getDerivedStateFromProps,typeof s=="function"&&(yr(a,n,s,i),t.state=a.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof t.getSnapshotBeforeUpdate=="function"||typeof t.UNSAFE_componentWillMount!="function"&&typeof t.componentWillMount!="function"||(n=t.state,typeof t.componentWillMount=="function"&&t.componentWillMount(),typeof t.UNSAFE_componentWillMount=="function"&&t.UNSAFE_componentWillMount(),n!==t.state&&Fo.enqueueReplaceState(t,t.state,null),vo(a,i,t,e),t.state=a.memoizedState),typeof t.componentDidMount=="function"&&(a.flags|=4194308)}function he(a,n){try{var i="",e=n;do i+=Ac(e),e=e.return;while(e);var t=i}catch(s){t=`
Error generating stack: `+s.message+`
`+s.stack}return{value:a,source:n,stack:t,digest:null}}function Ns(a,n,i){return{value:a,source:null,stack:i??null,digest:n??null}}function br(a,n){try{console.error(n.value)}catch(i){setTimeout(function(){throw i})}}var Jh=typeof WeakMap=="function"?WeakMap:Map;function fu(a,n,i){i=Hn(-1,i),i.tag=3,i.payload={element:null};var e=n.value;return i.callback=function(){Po||(Po=!0,Pr=e),br(a,n)},i}function wu(a,n,i){i=Hn(-1,i),i.tag=3;var e=a.type.getDerivedStateFromError;if(typeof e=="function"){var t=n.value;i.payload=function(){return e(t)},i.callback=function(){br(a,n)}}var s=a.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(i.callback=function(){br(a,n),typeof e!="function"&&(gi===null?gi=new Set([this]):gi.add(this));var g=n.stack;this.componentDidCatch(n.value,{componentStack:g!==null?g:""})}),i}function ep(a,n,i){var e=a.pingCache;if(e===null){e=a.pingCache=new Jh;var t=new Set;e.set(n,t)}else t=e.get(n),t===void 0&&(t=new Set,e.set(n,t));t.has(i)||(t.add(i),a=uy.bind(null,a,n,i),n.then(a,a))}function tp(a){do{var n;if((n=a.tag===13)&&(n=a.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return a;a=a.return}while(a!==null);return null}function op(a,n,i,e,t){return a.mode&1?(a.flags|=65536,a.lanes=t,a):(a===n?a.flags|=65536:(a.flags|=128,i.flags|=131072,i.flags&=-52805,i.tag===1&&(i.alternate===null?i.tag=17:(n=Hn(-1,1),n.tag=2,ri(i,n,1))),i.lanes|=1),a)}var Xh=Gn.ReactCurrentOwner,Ga=!1;function ja(a,n,i,e){n.child=a===null?Qm(n,null,i,e):de(n,a.child,i,e)}function sp(a,n,i,e,t){i=i.render;var s=n.ref;return ge(n,t),e=ug(a,n,i,e,s,t),i=dg(),a!==null&&!Ga?(n.updateQueue=a.updateQueue,n.flags&=-2053,a.lanes&=~t,Ln(a,n,t)):(ca&&i&&ag(n),n.flags|=1,ja(a,n,e,t),n.child)}function rp(a,n,i,e,t){if(a===null){var s=i.type;return typeof s=="function"&&!vg(s)&&s.defaultProps===void 0&&i.compare===null&&i.defaultProps===void 0?(n.tag=15,n.type=s,Su(a,n,s,e,t)):(a=so(i.type,null,e,n,n.mode,t),a.ref=n.ref,a.return=n,n.child=a)}if(s=a.child,!(a.lanes&t)){var g=s.memoizedProps;if(i=i.compare,i=i!==null?i:at,i(g,e)&&a.ref===n.ref)return Ln(a,n,t)}return n.flags|=1,a=pi(s,e),a.ref=n.ref,a.return=n,n.child=a}function Su(a,n,i,e,t){if(a!==null){var s=a.memoizedProps;if(at(s,e)&&a.ref===n.ref)if(Ga=!1,n.pendingProps=e=s,(a.lanes&t)!==0)a.flags&131072&&(Ga=!0);else return n.lanes=a.lanes,Ln(a,n,t)}return fr(a,n,i,e,t)}function xu(a,n,i){var e=n.pendingProps,t=e.children,s=a!==null?a.memoizedState:null;if(e.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},la(ee,Qa),Qa|=i;else{if(!(i&1073741824))return a=s!==null?s.baseLanes|i:i,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:a,cachePool:null,transitions:null},n.updateQueue=null,la(ee,Qa),Qa|=a,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},e=s!==null?s.baseLanes:i,la(ee,Qa),Qa|=e}else s!==null?(e=s.baseLanes|i,n.memoizedState=null):e=i,la(ee,Qa),Qa|=e;return ja(a,n,t,i),n.child}function vu(a,n){var i=n.ref;(a===null&&i!==null||a!==null&&a.ref!==i)&&(n.flags|=512,n.flags|=2097152)}function fr(a,n,i,e,t){var s=Wa(i)?Di:Oa.current;return s=me(n,s),ge(n,t),i=ug(a,n,i,e,s,t),e=dg(),a!==null&&!Ga?(n.updateQueue=a.updateQueue,n.flags&=-2053,a.lanes&=~t,Ln(a,n,t)):(ca&&e&&ag(n),n.flags|=1,ja(a,n,i,t),n.child)}function gp(a,n,i,e,t){if(Wa(i)){var s=!0;bo(n)}else s=!1;if(ge(n,t),n.stateNode===null)eo(a,n),bu(n,i,e),kr(n,i,e,t),e=!0;else if(a===null){var g=n.stateNode,u=n.memoizedProps;g.props=u;var d=g.context,m=i.contextType;typeof m=="object"&&m!==null?m=mn(m):(m=Wa(i)?Di:Oa.current,m=me(n,m));var C=i.getDerivedStateFromProps,f=typeof C=="function"||typeof g.getSnapshotBeforeUpdate=="function";f||typeof g.UNSAFE_componentWillReceiveProps!="function"&&typeof g.componentWillReceiveProps!="function"||(u!==e||d!==m)&&ip(n,g,e,m),Jn=!1;var S=n.memoizedState;g.state=S,vo(n,e,g,t),d=n.memoizedState,u!==e||S!==d||qa.current||Jn?(typeof C=="function"&&(yr(n,i,C,e),d=n.memoizedState),(u=Jn||np(n,i,u,e,S,d,m))?(f||typeof g.UNSAFE_componentWillMount!="function"&&typeof g.componentWillMount!="function"||(typeof g.componentWillMount=="function"&&g.componentWillMount(),typeof g.UNSAFE_componentWillMount=="function"&&g.UNSAFE_componentWillMount()),typeof g.componentDidMount=="function"&&(n.flags|=4194308)):(typeof g.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=e,n.memoizedState=d),g.props=e,g.state=d,g.context=m,e=u):(typeof g.componentDidMount=="function"&&(n.flags|=4194308),e=!1)}else{g=n.stateNode,Ym(a,n),u=n.memoizedProps,m=n.type===n.elementType?u:bn(n.type,u),g.props=m,f=n.pendingProps,S=g.context,d=i.contextType,typeof d=="object"&&d!==null?d=mn(d):(d=Wa(i)?Di:Oa.current,d=me(n,d));var P=i.getDerivedStateFromProps;(C=typeof P=="function"||typeof g.getSnapshotBeforeUpdate=="function")||typeof g.UNSAFE_componentWillReceiveProps!="function"&&typeof g.componentWillReceiveProps!="function"||(u!==f||S!==d)&&ip(n,g,e,d),Jn=!1,S=n.memoizedState,g.state=S,vo(n,e,g,t);var T=n.memoizedState;u!==f||S!==T||qa.current||Jn?(typeof P=="function"&&(yr(n,i,P,e),T=n.memoizedState),(m=Jn||np(n,i,m,e,S,T,d)||!1)?(C||typeof g.UNSAFE_componentWillUpdate!="function"&&typeof g.componentWillUpdate!="function"||(typeof g.componentWillUpdate=="function"&&g.componentWillUpdate(e,T,d),typeof g.UNSAFE_componentWillUpdate=="function"&&g.UNSAFE_componentWillUpdate(e,T,d)),typeof g.componentDidUpdate=="function"&&(n.flags|=4),typeof g.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof g.componentDidUpdate!="function"||u===a.memoizedProps&&S===a.memoizedState||(n.flags|=4),typeof g.getSnapshotBeforeUpdate!="function"||u===a.memoizedProps&&S===a.memoizedState||(n.flags|=1024),n.memoizedProps=e,n.memoizedState=T),g.props=e,g.state=T,g.context=d,e=m):(typeof g.componentDidUpdate!="function"||u===a.memoizedProps&&S===a.memoizedState||(n.flags|=4),typeof g.getSnapshotBeforeUpdate!="function"||u===a.memoizedProps&&S===a.memoizedState||(n.flags|=1024),e=!1)}return wr(a,n,i,e,s,t)}function wr(a,n,i,e,t,s){vu(a,n);var g=(n.flags&128)!==0;if(!e&&!g)return t&&Vl(n,i,!1),Ln(a,n,s);e=n.stateNode,Xh.current=n;var u=g&&typeof i.getDerivedStateFromError!="function"?null:e.render();return n.flags|=1,a!==null&&g?(n.child=de(n,a.child,null,s),n.child=de(n,null,u,s)):ja(a,n,u,s),n.memoizedState=e.state,t&&Vl(n,i,!0),n.child}function Cu(a){var n=a.stateNode;n.pendingContext?Ul(a,n.pendingContext,n.pendingContext!==n.context):n.context&&Ul(a,n.context,!1),gg(a,n.containerInfo)}function lp(a,n,i,e,t){return ue(),ig(t),n.flags|=256,ja(a,n,i,e),n.child}var Sr={dehydrated:null,treeContext:null,retryLane:0};function xr(a){return{baseLanes:a,cachePool:null,transitions:null}}function Au(a,n,i){var e=n.pendingProps,t=ha.current,s=!1,g=(n.flags&128)!==0,u;if((u=g)||(u=a!==null&&a.memoizedState===null?!1:(t&2)!==0),u?(s=!0,n.flags&=-129):(a===null||a.memoizedState!==null)&&(t|=1),la(ha,t&1),a===null)return cr(n),a=n.memoizedState,a!==null&&(a=a.dehydrated,a!==null)?(n.mode&1?a.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(g=e.children,a=e.fallback,s?(e=n.mode,s=n.child,g={mode:"hidden",children:g},!(e&1)&&s!==null?(s.childLanes=0,s.pendingProps=g):s=Go(g,e,0,null),a=Ei(a,e,i,null),s.return=n,a.return=n,s.sibling=a,n.child=s,n.child.memoizedState=xr(i),n.memoizedState=Sr,a):yg(n,g));if(t=a.memoizedState,t!==null&&(u=t.dehydrated,u!==null))return ay(a,n,g,e,u,t,i);if(s){s=e.fallback,g=n.mode,t=a.child,u=t.sibling;var d={mode:"hidden",children:e.children};return!(g&1)&&n.child!==t?(e=n.child,e.childLanes=0,e.pendingProps=d,n.deletions=null):(e=pi(t,d),e.subtreeFlags=t.subtreeFlags&14680064),u!==null?s=pi(u,s):(s=Ei(s,g,i,null),s.flags|=2),s.return=n,e.return=n,e.sibling=s,n.child=e,e=s,s=n.child,g=a.child.memoizedState,g=g===null?xr(i):{baseLanes:g.baseLanes|i,cachePool:null,transitions:g.transitions},s.memoizedState=g,s.childLanes=a.childLanes&~i,n.memoizedState=Sr,e}return s=a.child,a=s.sibling,e=pi(s,{mode:"visible",children:e.children}),!(n.mode&1)&&(e.lanes=i),e.return=n,e.sibling=null,a!==null&&(i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)),n.child=e,n.memoizedState=null,e}function yg(a,n){return n=Go({mode:"visible",children:n},a.mode,0,null),n.return=a,a.child=n}function qt(a,n,i,e){return e!==null&&ig(e),de(n,a.child,null,i),a=yg(n,n.pendingProps.children),a.flags|=2,n.memoizedState=null,a}function ay(a,n,i,e,t,s,g){if(i)return n.flags&256?(n.flags&=-257,e=Ns(Error(I(422))),qt(a,n,g,e)):n.memoizedState!==null?(n.child=a.child,n.flags|=128,null):(s=e.fallback,t=n.mode,e=Go({mode:"visible",children:e.children},t,0,null),s=Ei(s,t,g,null),s.flags|=2,e.return=n,s.return=n,e.sibling=s,n.child=e,n.mode&1&&de(n,a.child,null,g),n.child.memoizedState=xr(g),n.memoizedState=Sr,s);if(!(n.mode&1))return qt(a,n,g,null);if(t.data==="$!"){if(e=t.nextSibling&&t.nextSibling.dataset,e)var u=e.dgst;return e=u,s=Error(I(419)),e=Ns(s,e,void 0),qt(a,n,g,e)}if(u=(g&a.childLanes)!==0,Ga||u){if(e=Ta,e!==null){switch(g&-g){case 4:t=2;break;case 16:t=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:t=32;break;case 536870912:t=268435456;break;default:t=0}t=t&(e.suspendedLanes|g)?0:t,t!==0&&t!==s.retryLane&&(s.retryLane=t,zn(a,t),xn(e,a,t,-1))}return xg(),e=Ns(Error(I(421))),qt(a,n,g,e)}return t.data==="$?"?(n.flags|=128,n.child=a.child,n=dy.bind(null,a),t._reactRetry=n,null):(a=s.treeContext,Za=si(t.nextSibling),Ya=n,ca=!0,wn=null,a!==null&&(rn[gn++]=On,rn[gn++]=_n,rn[gn++]=Ni,On=a.id,_n=a.overflow,Ni=n),n=yg(n,e.children),n.flags|=4096,n)}function pp(a,n,i){a.lanes|=n;var e=a.alternate;e!==null&&(e.lanes|=n),hr(a.return,n,i)}function Rs(a,n,i,e,t){var s=a.memoizedState;s===null?a.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:e,tail:i,tailMode:t}:(s.isBackwards=n,s.rendering=null,s.renderingStartTime=0,s.last=e,s.tail=i,s.tailMode=t)}function Tu(a,n,i){var e=n.pendingProps,t=e.revealOrder,s=e.tail;if(ja(a,n,e.children,i),e=ha.current,e&2)e=e&1|2,n.flags|=128;else{if(a!==null&&a.flags&128)a:for(a=n.child;a!==null;){if(a.tag===13)a.memoizedState!==null&&pp(a,i,n);else if(a.tag===19)pp(a,i,n);else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===n)break a;for(;a.sibling===null;){if(a.return===null||a.return===n)break a;a=a.return}a.sibling.return=a.return,a=a.sibling}e&=1}if(la(ha,e),!(n.mode&1))n.memoizedState=null;else switch(t){case"forwards":for(i=n.child,t=null;i!==null;)a=i.alternate,a!==null&&Co(a)===null&&(t=i),i=i.sibling;i=t,i===null?(t=n.child,n.child=null):(t=i.sibling,i.sibling=null),Rs(n,!1,t,i,s);break;case"backwards":for(i=null,t=n.child,n.child=null;t!==null;){if(a=t.alternate,a!==null&&Co(a)===null){n.child=t;break}a=t.sibling,t.sibling=i,i=t,t=a}Rs(n,!0,i,null,s);break;case"together":Rs(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function eo(a,n){!(n.mode&1)&&a!==null&&(a.alternate=null,n.alternate=null,n.flags|=2)}function Ln(a,n,i){if(a!==null&&(n.dependencies=a.dependencies),Oi|=n.lanes,!(i&n.childLanes))return null;if(a!==null&&n.child!==a.child)throw Error(I(153));if(n.child!==null){for(a=n.child,i=pi(a,a.pendingProps),n.child=i,i.return=n;a.sibling!==null;)a=a.sibling,i=i.sibling=pi(a,a.pendingProps),i.return=n;i.sibling=null}return n.child}function ny(a,n,i){switch(n.tag){case 3:Cu(n),ue();break;case 5:Jm(n);break;case 1:Wa(n.type)&&bo(n);break;case 4:gg(n,n.stateNode.containerInfo);break;case 10:var e=n.type._context,t=n.memoizedProps.value;la(So,e._currentValue),e._currentValue=t;break;case 13:if(e=n.memoizedState,e!==null)return e.dehydrated!==null?(la(ha,ha.current&1),n.flags|=128,null):i&n.child.childLanes?Au(a,n,i):(la(ha,ha.current&1),a=Ln(a,n,i),a!==null?a.sibling:null);la(ha,ha.current&1);break;case 19:if(e=(i&n.childLanes)!==0,a.flags&128){if(e)return Tu(a,n,i);n.flags|=128}if(t=n.memoizedState,t!==null&&(t.rendering=null,t.tail=null,t.lastEffect=null),la(ha,ha.current),e)break;return null;case 22:case 23:return n.lanes=0,xu(a,n,i)}return Ln(a,n,i)}var Mu,vr,Pu,Bu;Mu=function(a,n){for(var i=n.child;i!==null;){if(i.tag===5||i.tag===6)a.appendChild(i.stateNode);else if(i.tag!==4&&i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return;i=i.return}i.sibling.return=i.return,i=i.sibling}};vr=function(){};Pu=function(a,n,i,e){var t=a.memoizedProps;if(t!==e){a=n.stateNode,Bi(In.current);var s=null;switch(i){case"input":t=Ws(a,t),e=Ws(a,e),s=[];break;case"select":t=ka({},t,{value:void 0}),e=ka({},e,{value:void 0}),s=[];break;case"textarea":t=$s(a,t),e=$s(a,e),s=[];break;default:typeof t.onClick!="function"&&typeof e.onClick=="function"&&(a.onclick=yo)}Zs(i,e);var g;i=null;for(m in t)if(!e.hasOwnProperty(m)&&t.hasOwnProperty(m)&&t[m]!=null)if(m==="style"){var u=t[m];for(g in u)u.hasOwnProperty(g)&&(i||(i={}),i[g]="")}else m!=="dangerouslySetInnerHTML"&&m!=="children"&&m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(Ve.hasOwnProperty(m)?s||(s=[]):(s=s||[]).push(m,null));for(m in e){var d=e[m];if(u=t!=null?t[m]:void 0,e.hasOwnProperty(m)&&d!==u&&(d!=null||u!=null))if(m==="style")if(u){for(g in u)!u.hasOwnProperty(g)||d&&d.hasOwnProperty(g)||(i||(i={}),i[g]="");for(g in d)d.hasOwnProperty(g)&&u[g]!==d[g]&&(i||(i={}),i[g]=d[g])}else i||(s||(s=[]),s.push(m,i)),i=d;else m==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,u=u?u.__html:void 0,d!=null&&u!==d&&(s=s||[]).push(m,d)):m==="children"?typeof d!="string"&&typeof d!="number"||(s=s||[]).push(m,""+d):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&(Ve.hasOwnProperty(m)?(d!=null&&m==="onScroll"&&ua("scroll",a),s||u===d||(s=[])):(s=s||[]).push(m,d))}i&&(s=s||[]).push("style",i);var m=s;(n.updateQueue=m)&&(n.flags|=4)}};Bu=function(a,n,i,e){i!==e&&(n.flags|=4)};function De(a,n){if(!ca)switch(a.tailMode){case"hidden":n=a.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?a.tail=null:i.sibling=null;break;case"collapsed":i=a.tail;for(var e=null;i!==null;)i.alternate!==null&&(e=i),i=i.sibling;e===null?n||a.tail===null?a.tail=null:a.tail.sibling=null:e.sibling=null}}function Na(a){var n=a.alternate!==null&&a.alternate.child===a.child,i=0,e=0;if(n)for(var t=a.child;t!==null;)i|=t.lanes|t.childLanes,e|=t.subtreeFlags&14680064,e|=t.flags&14680064,t.return=a,t=t.sibling;else for(t=a.child;t!==null;)i|=t.lanes|t.childLanes,e|=t.subtreeFlags,e|=t.flags,t.return=a,t=t.sibling;return a.subtreeFlags|=e,a.childLanes=i,n}function iy(a,n,i){var e=n.pendingProps;switch(ng(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Na(n),null;case 1:return Wa(n.type)&&ko(),Na(n),null;case 3:return e=n.stateNode,ce(),da(qa),da(Oa),pg(),e.pendingContext&&(e.context=e.pendingContext,e.pendingContext=null),(a===null||a.child===null)&&(Lt(n)?n.flags|=4:a===null||a.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,wn!==null&&(Er(wn),wn=null))),vr(a,n),Na(n),null;case 5:lg(n);var t=Bi(ot.current);if(i=n.type,a!==null&&n.stateNode!=null)Pu(a,n,i,e,t),a.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!e){if(n.stateNode===null)throw Error(I(166));return Na(n),null}if(a=Bi(In.current),Lt(n)){e=n.stateNode,i=n.type;var s=n.memoizedProps;switch(e[Pn]=n,e[et]=s,a=(n.mode&1)!==0,i){case"dialog":ua("cancel",e),ua("close",e);break;case"iframe":case"object":case"embed":ua("load",e);break;case"video":case"audio":for(t=0;t<je.length;t++)ua(je[t],e);break;case"source":ua("error",e);break;case"img":case"image":case"link":ua("error",e),ua("load",e);break;case"details":ua("toggle",e);break;case"input":fl(e,s),ua("invalid",e);break;case"select":e._wrapperState={wasMultiple:!!s.multiple},ua("invalid",e);break;case"textarea":Sl(e,s),ua("invalid",e)}Zs(i,s),t=null;for(var g in s)if(s.hasOwnProperty(g)){var u=s[g];g==="children"?typeof u=="string"?e.textContent!==u&&(s.suppressHydrationWarning!==!0&&zt(e.textContent,u,a),t=["children",u]):typeof u=="number"&&e.textContent!==""+u&&(s.suppressHydrationWarning!==!0&&zt(e.textContent,u,a),t=["children",""+u]):Ve.hasOwnProperty(g)&&u!=null&&g==="onScroll"&&ua("scroll",e)}switch(i){case"input":Nt(e),wl(e,s,!0);break;case"textarea":Nt(e),xl(e);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(e.onclick=yo)}e=t,n.updateQueue=e,e!==null&&(n.flags|=4)}else{g=t.nodeType===9?t:t.ownerDocument,a==="http://www.w3.org/1999/xhtml"&&(a=em(i)),a==="http://www.w3.org/1999/xhtml"?i==="script"?(a=g.createElement("div"),a.innerHTML="<script><\/script>",a=a.removeChild(a.firstChild)):typeof e.is=="string"?a=g.createElement(i,{is:e.is}):(a=g.createElement(i),i==="select"&&(g=a,e.multiple?g.multiple=!0:e.size&&(g.size=e.size))):a=g.createElementNS(a,i),a[Pn]=n,a[et]=e,Mu(a,n,!1,!1),n.stateNode=a;a:{switch(g=Ys(i,e),i){case"dialog":ua("cancel",a),ua("close",a),t=e;break;case"iframe":case"object":case"embed":ua("load",a),t=e;break;case"video":case"audio":for(t=0;t<je.length;t++)ua(je[t],a);t=e;break;case"source":ua("error",a),t=e;break;case"img":case"image":case"link":ua("error",a),ua("load",a),t=e;break;case"details":ua("toggle",a),t=e;break;case"input":fl(a,e),t=Ws(a,e),ua("invalid",a);break;case"option":t=e;break;case"select":a._wrapperState={wasMultiple:!!e.multiple},t=ka({},e,{value:void 0}),ua("invalid",a);break;case"textarea":Sl(a,e),t=$s(a,e),ua("invalid",a);break;default:t=e}Zs(i,t),u=t;for(s in u)if(u.hasOwnProperty(s)){var d=u[s];s==="style"?sm(a,d):s==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&tm(a,d)):s==="children"?typeof d=="string"?(i!=="textarea"||d!=="")&&$e(a,d):typeof d=="number"&&$e(a,""+d):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ve.hasOwnProperty(s)?d!=null&&s==="onScroll"&&ua("scroll",a):d!=null&&Fr(a,s,d,g))}switch(i){case"input":Nt(a),wl(a,e,!1);break;case"textarea":Nt(a),xl(a);break;case"option":e.value!=null&&a.setAttribute("value",""+mi(e.value));break;case"select":a.multiple=!!e.multiple,s=e.value,s!=null?te(a,!!e.multiple,s,!1):e.defaultValue!=null&&te(a,!!e.multiple,e.defaultValue,!0);break;default:typeof t.onClick=="function"&&(a.onclick=yo)}switch(i){case"button":case"input":case"select":case"textarea":e=!!e.autoFocus;break a;case"img":e=!0;break a;default:e=!1}}e&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return Na(n),null;case 6:if(a&&n.stateNode!=null)Bu(a,n,a.memoizedProps,e);else{if(typeof e!="string"&&n.stateNode===null)throw Error(I(166));if(i=Bi(ot.current),Bi(In.current),Lt(n)){if(e=n.stateNode,i=n.memoizedProps,e[Pn]=n,(s=e.nodeValue!==i)&&(a=Ya,a!==null))switch(a.tag){case 3:zt(e.nodeValue,i,(a.mode&1)!==0);break;case 5:a.memoizedProps.suppressHydrationWarning!==!0&&zt(e.nodeValue,i,(a.mode&1)!==0)}s&&(n.flags|=4)}else e=(i.nodeType===9?i:i.ownerDocument).createTextNode(e),e[Pn]=n,n.stateNode=e}return Na(n),null;case 13:if(da(ha),e=n.memoizedState,a===null||a.memoizedState!==null&&a.memoizedState.dehydrated!==null){if(ca&&Za!==null&&n.mode&1&&!(n.flags&128))Vm(),ue(),n.flags|=98560,s=!1;else if(s=Lt(n),e!==null&&e.dehydrated!==null){if(a===null){if(!s)throw Error(I(318));if(s=n.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(I(317));s[Pn]=n}else ue(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;Na(n),s=!1}else wn!==null&&(Er(wn),wn=null),s=!0;if(!s)return n.flags&65536?n:null}return n.flags&128?(n.lanes=i,n):(e=e!==null,e!==(a!==null&&a.memoizedState!==null)&&e&&(n.child.flags|=8192,n.mode&1&&(a===null||ha.current&1?va===0&&(va=3):xg())),n.updateQueue!==null&&(n.flags|=4),Na(n),null);case 4:return ce(),vr(a,n),a===null&&nt(n.stateNode.containerInfo),Na(n),null;case 10:return og(n.type._context),Na(n),null;case 17:return Wa(n.type)&&ko(),Na(n),null;case 19:if(da(ha),s=n.memoizedState,s===null)return Na(n),null;if(e=(n.flags&128)!==0,g=s.rendering,g===null)if(e)De(s,!1);else{if(va!==0||a!==null&&a.flags&128)for(a=n.child;a!==null;){if(g=Co(a),g!==null){for(n.flags|=128,De(s,!1),e=g.updateQueue,e!==null&&(n.updateQueue=e,n.flags|=4),n.subtreeFlags=0,e=i,i=n.child;i!==null;)s=i,a=e,s.flags&=14680066,g=s.alternate,g===null?(s.childLanes=0,s.lanes=a,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=g.childLanes,s.lanes=g.lanes,s.child=g.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=g.memoizedProps,s.memoizedState=g.memoizedState,s.updateQueue=g.updateQueue,s.type=g.type,a=g.dependencies,s.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),i=i.sibling;return la(ha,ha.current&1|2),n.child}a=a.sibling}s.tail!==null&&fa()>ye&&(n.flags|=128,e=!0,De(s,!1),n.lanes=4194304)}else{if(!e)if(a=Co(g),a!==null){if(n.flags|=128,e=!0,i=a.updateQueue,i!==null&&(n.updateQueue=i,n.flags|=4),De(s,!0),s.tail===null&&s.tailMode==="hidden"&&!g.alternate&&!ca)return Na(n),null}else 2*fa()-s.renderingStartTime>ye&&i!==1073741824&&(n.flags|=128,e=!0,De(s,!1),n.lanes=4194304);s.isBackwards?(g.sibling=n.child,n.child=g):(i=s.last,i!==null?i.sibling=g:n.child=g,s.last=g)}return s.tail!==null?(n=s.tail,s.rendering=n,s.tail=n.sibling,s.renderingStartTime=fa(),n.sibling=null,i=ha.current,la(ha,e?i&1|2:i&1),n):(Na(n),null);case 22:case 23:return Sg(),e=n.memoizedState!==null,a!==null&&a.memoizedState!==null!==e&&(n.flags|=8192),e&&n.mode&1?Qa&1073741824&&(Na(n),n.subtreeFlags&6&&(n.flags|=8192)):Na(n),null;case 24:return null;case 25:return null}throw Error(I(156,n.tag))}function ey(a,n){switch(ng(n),n.tag){case 1:return Wa(n.type)&&ko(),a=n.flags,a&65536?(n.flags=a&-65537|128,n):null;case 3:return ce(),da(qa),da(Oa),pg(),a=n.flags,a&65536&&!(a&128)?(n.flags=a&-65537|128,n):null;case 5:return lg(n),null;case 13:if(da(ha),a=n.memoizedState,a!==null&&a.dehydrated!==null){if(n.alternate===null)throw Error(I(340));ue()}return a=n.flags,a&65536?(n.flags=a&-65537|128,n):null;case 19:return da(ha),null;case 4:return ce(),null;case 10:return og(n.type._context),null;case 22:case 23:return Sg(),null;case 24:return null;default:return null}}var Wt=!1,Ra=!1,ty=typeof WeakSet=="function"?WeakSet:Set,H=null;function ie(a,n){var i=a.ref;if(i!==null)if(typeof i=="function")try{i(null)}catch(e){ba(a,n,e)}else i.current=null}function Cr(a,n,i){try{i()}catch(e){ba(a,n,e)}}var mp=!1;function oy(a,n){if(rr=uo,a=Rm(),Xr(a)){if("selectionStart"in a)var i={start:a.selectionStart,end:a.selectionEnd};else a:{i=(i=a.ownerDocument)&&i.defaultView||window;var e=i.getSelection&&i.getSelection();if(e&&e.rangeCount!==0){i=e.anchorNode;var t=e.anchorOffset,s=e.focusNode;e=e.focusOffset;try{i.nodeType,s.nodeType}catch{i=null;break a}var g=0,u=-1,d=-1,m=0,C=0,f=a,S=null;n:for(;;){for(var P;f!==i||t!==0&&f.nodeType!==3||(u=g+t),f!==s||e!==0&&f.nodeType!==3||(d=g+e),f.nodeType===3&&(g+=f.nodeValue.length),(P=f.firstChild)!==null;)S=f,f=P;for(;;){if(f===a)break n;if(S===i&&++m===t&&(u=g),S===s&&++C===e&&(d=g),(P=f.nextSibling)!==null)break;f=S,S=f.parentNode}f=P}i=u===-1||d===-1?null:{start:u,end:d}}else i=null}i=i||{start:0,end:0}}else i=null;for(gr={focusedElem:a,selectionRange:i},uo=!1,H=n;H!==null;)if(n=H,a=n.child,(n.subtreeFlags&1028)!==0&&a!==null)a.return=n,H=a;else for(;H!==null;){n=H;try{var T=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(T!==null){var A=T.memoizedProps,L=T.memoizedState,k=n.stateNode,h=k.getSnapshotBeforeUpdate(n.elementType===n.type?A:bn(n.type,A),L);k.__reactInternalSnapshotBeforeUpdate=h}break;case 3:var b=n.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(I(163))}}catch(v){ba(n,n.return,v)}if(a=n.sibling,a!==null){a.return=n.return,H=a;break}H=n.return}return T=mp,mp=!1,T}function qe(a,n,i){var e=n.updateQueue;if(e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&a)===a){var s=t.destroy;t.destroy=void 0,s!==void 0&&Cr(n,i,s)}t=t.next}while(t!==e)}}function zo(a,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var i=n=n.next;do{if((i.tag&a)===a){var e=i.create;i.destroy=e()}i=i.next}while(i!==n)}}function Ar(a){var n=a.ref;if(n!==null){var i=a.stateNode;switch(a.tag){case 5:a=i;break;default:a=i}typeof n=="function"?n(a):n.current=a}}function Iu(a){var n=a.alternate;n!==null&&(a.alternate=null,Iu(n)),a.child=null,a.deletions=null,a.sibling=null,a.tag===5&&(n=a.stateNode,n!==null&&(delete n[Pn],delete n[et],delete n[mr],delete n[zh],delete n[Lh])),a.stateNode=null,a.return=null,a.dependencies=null,a.memoizedProps=null,a.memoizedState=null,a.pendingProps=null,a.stateNode=null,a.updateQueue=null}function Eu(a){return a.tag===5||a.tag===3||a.tag===4}function up(a){a:for(;;){for(;a.sibling===null;){if(a.return===null||Eu(a.return))return null;a=a.return}for(a.sibling.return=a.return,a=a.sibling;a.tag!==5&&a.tag!==6&&a.tag!==18;){if(a.flags&2||a.child===null||a.tag===4)continue a;a.child.return=a,a=a.child}if(!(a.flags&2))return a.stateNode}}function Tr(a,n,i){var e=a.tag;if(e===5||e===6)a=a.stateNode,n?i.nodeType===8?i.parentNode.insertBefore(a,n):i.insertBefore(a,n):(i.nodeType===8?(n=i.parentNode,n.insertBefore(a,i)):(n=i,n.appendChild(a)),i=i._reactRootContainer,i!=null||n.onclick!==null||(n.onclick=yo));else if(e!==4&&(a=a.child,a!==null))for(Tr(a,n,i),a=a.sibling;a!==null;)Tr(a,n,i),a=a.sibling}function Mr(a,n,i){var e=a.tag;if(e===5||e===6)a=a.stateNode,n?i.insertBefore(a,n):i.appendChild(a);else if(e!==4&&(a=a.child,a!==null))for(Mr(a,n,i),a=a.sibling;a!==null;)Mr(a,n,i),a=a.sibling}var Ba=null,fn=!1;function Zn(a,n,i){for(i=i.child;i!==null;)Du(a,n,i),i=i.sibling}function Du(a,n,i){if(Bn&&typeof Bn.onCommitFiberUnmount=="function")try{Bn.onCommitFiberUnmount(No,i)}catch{}switch(i.tag){case 5:Ra||ie(i,n);case 6:var e=Ba,t=fn;Ba=null,Zn(a,n,i),Ba=e,fn=t,Ba!==null&&(fn?(a=Ba,i=i.stateNode,a.nodeType===8?a.parentNode.removeChild(i):a.removeChild(i)):Ba.removeChild(i.stateNode));break;case 18:Ba!==null&&(fn?(a=Ba,i=i.stateNode,a.nodeType===8?Ms(a.parentNode,i):a.nodeType===1&&Ms(a,i),Je(a)):Ms(Ba,i.stateNode));break;case 4:e=Ba,t=fn,Ba=i.stateNode.containerInfo,fn=!0,Zn(a,n,i),Ba=e,fn=t;break;case 0:case 11:case 14:case 15:if(!Ra&&(e=i.updateQueue,e!==null&&(e=e.lastEffect,e!==null))){t=e=e.next;do{var s=t,g=s.destroy;s=s.tag,g!==void 0&&(s&2||s&4)&&Cr(i,n,g),t=t.next}while(t!==e)}Zn(a,n,i);break;case 1:if(!Ra&&(ie(i,n),e=i.stateNode,typeof e.componentWillUnmount=="function"))try{e.props=i.memoizedProps,e.state=i.memoizedState,e.componentWillUnmount()}catch(u){ba(i,n,u)}Zn(a,n,i);break;case 21:Zn(a,n,i);break;case 22:i.mode&1?(Ra=(e=Ra)||i.memoizedState!==null,Zn(a,n,i),Ra=e):Zn(a,n,i);break;default:Zn(a,n,i)}}function dp(a){var n=a.updateQueue;if(n!==null){a.updateQueue=null;var i=a.stateNode;i===null&&(i=a.stateNode=new ty),n.forEach(function(e){var t=cy.bind(null,a,e);i.has(e)||(i.add(e),e.then(t,t))})}}function kn(a,n){var i=n.deletions;if(i!==null)for(var e=0;e<i.length;e++){var t=i[e];try{var s=a,g=n,u=g;a:for(;u!==null;){switch(u.tag){case 5:Ba=u.stateNode,fn=!1;break a;case 3:Ba=u.stateNode.containerInfo,fn=!0;break a;case 4:Ba=u.stateNode.containerInfo,fn=!0;break a}u=u.return}if(Ba===null)throw Error(I(160));Du(s,g,t),Ba=null,fn=!1;var d=t.alternate;d!==null&&(d.return=null),t.return=null}catch(m){ba(t,n,m)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)Nu(n,a),n=n.sibling}function Nu(a,n){var i=a.alternate,e=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:if(kn(n,a),Tn(a),e&4){try{qe(3,a,a.return),zo(3,a)}catch(A){ba(a,a.return,A)}try{qe(5,a,a.return)}catch(A){ba(a,a.return,A)}}break;case 1:kn(n,a),Tn(a),e&512&&i!==null&&ie(i,i.return);break;case 5:if(kn(n,a),Tn(a),e&512&&i!==null&&ie(i,i.return),a.flags&32){var t=a.stateNode;try{$e(t,"")}catch(A){ba(a,a.return,A)}}if(e&4&&(t=a.stateNode,t!=null)){var s=a.memoizedProps,g=i!==null?i.memoizedProps:s,u=a.type,d=a.updateQueue;if(a.updateQueue=null,d!==null)try{u==="input"&&s.type==="radio"&&s.name!=null&&nm(t,s),Ys(u,g);var m=Ys(u,s);for(g=0;g<d.length;g+=2){var C=d[g],f=d[g+1];C==="style"?sm(t,f):C==="dangerouslySetInnerHTML"?tm(t,f):C==="children"?$e(t,f):Fr(t,C,f,m)}switch(u){case"input":Us(t,s);break;case"textarea":im(t,s);break;case"select":var S=t._wrapperState.wasMultiple;t._wrapperState.wasMultiple=!!s.multiple;var P=s.value;P!=null?te(t,!!s.multiple,P,!1):S!==!!s.multiple&&(s.defaultValue!=null?te(t,!!s.multiple,s.defaultValue,!0):te(t,!!s.multiple,s.multiple?[]:"",!1))}t[et]=s}catch(A){ba(a,a.return,A)}}break;case 6:if(kn(n,a),Tn(a),e&4){if(a.stateNode===null)throw Error(I(162));t=a.stateNode,s=a.memoizedProps;try{t.nodeValue=s}catch(A){ba(a,a.return,A)}}break;case 3:if(kn(n,a),Tn(a),e&4&&i!==null&&i.memoizedState.isDehydrated)try{Je(n.containerInfo)}catch(A){ba(a,a.return,A)}break;case 4:kn(n,a),Tn(a);break;case 13:kn(n,a),Tn(a),t=a.child,t.flags&8192&&(s=t.memoizedState!==null,t.stateNode.isHidden=s,!s||t.alternate!==null&&t.alternate.memoizedState!==null||(fg=fa())),e&4&&dp(a);break;case 22:if(C=i!==null&&i.memoizedState!==null,a.mode&1?(Ra=(m=Ra)||C,kn(n,a),Ra=m):kn(n,a),Tn(a),e&8192){if(m=a.memoizedState!==null,(a.stateNode.isHidden=m)&&!C&&a.mode&1)for(H=a,C=a.child;C!==null;){for(f=H=C;H!==null;){switch(S=H,P=S.child,S.tag){case 0:case 11:case 14:case 15:qe(4,S,S.return);break;case 1:ie(S,S.return);var T=S.stateNode;if(typeof T.componentWillUnmount=="function"){e=S,i=S.return;try{n=e,T.props=n.memoizedProps,T.state=n.memoizedState,T.componentWillUnmount()}catch(A){ba(e,i,A)}}break;case 5:ie(S,S.return);break;case 22:if(S.memoizedState!==null){hp(f);continue}}P!==null?(P.return=S,H=P):hp(f)}C=C.sibling}a:for(C=null,f=a;;){if(f.tag===5){if(C===null){C=f;try{t=f.stateNode,m?(s=t.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(u=f.stateNode,d=f.memoizedProps.style,g=d!=null&&d.hasOwnProperty("display")?d.display:null,u.style.display=om("display",g))}catch(A){ba(a,a.return,A)}}}else if(f.tag===6){if(C===null)try{f.stateNode.nodeValue=m?"":f.memoizedProps}catch(A){ba(a,a.return,A)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===a)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===a)break a;for(;f.sibling===null;){if(f.return===null||f.return===a)break a;C===f&&(C=null),f=f.return}C===f&&(C=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:kn(n,a),Tn(a),e&4&&dp(a);break;case 21:break;default:kn(n,a),Tn(a)}}function Tn(a){var n=a.flags;if(n&2){try{a:{for(var i=a.return;i!==null;){if(Eu(i)){var e=i;break a}i=i.return}throw Error(I(160))}switch(e.tag){case 5:var t=e.stateNode;e.flags&32&&($e(t,""),e.flags&=-33);var s=up(a);Mr(a,s,t);break;case 3:case 4:var g=e.stateNode.containerInfo,u=up(a);Tr(a,u,g);break;default:throw Error(I(161))}}catch(d){ba(a,a.return,d)}a.flags&=-3}n&4096&&(a.flags&=-4097)}function sy(a,n,i){H=a,Ru(a)}function Ru(a,n,i){for(var e=(a.mode&1)!==0;H!==null;){var t=H,s=t.child;if(t.tag===22&&e){var g=t.memoizedState!==null||Wt;if(!g){var u=t.alternate,d=u!==null&&u.memoizedState!==null||Ra;u=Wt;var m=Ra;if(Wt=g,(Ra=d)&&!m)for(H=t;H!==null;)g=H,d=g.child,g.tag===22&&g.memoizedState!==null?yp(t):d!==null?(d.return=g,H=d):yp(t);for(;s!==null;)H=s,Ru(s),s=s.sibling;H=t,Wt=u,Ra=m}cp(a)}else t.subtreeFlags&8772&&s!==null?(s.return=t,H=s):cp(a)}}function cp(a){for(;H!==null;){var n=H;if(n.flags&8772){var i=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:Ra||zo(5,n);break;case 1:var e=n.stateNode;if(n.flags&4&&!Ra)if(i===null)e.componentDidMount();else{var t=n.elementType===n.type?i.memoizedProps:bn(n.type,i.memoizedProps);e.componentDidUpdate(t,i.memoizedState,e.__reactInternalSnapshotBeforeUpdate)}var s=n.updateQueue;s!==null&&Jl(n,s,e);break;case 3:var g=n.updateQueue;if(g!==null){if(i=null,n.child!==null)switch(n.child.tag){case 5:i=n.child.stateNode;break;case 1:i=n.child.stateNode}Jl(n,g,i)}break;case 5:var u=n.stateNode;if(i===null&&n.flags&4){i=u;var d=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&i.focus();break;case"img":d.src&&(i.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var m=n.alternate;if(m!==null){var C=m.memoizedState;if(C!==null){var f=C.dehydrated;f!==null&&Je(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(I(163))}Ra||n.flags&512&&Ar(n)}catch(S){ba(n,n.return,S)}}if(n===a){H=null;break}if(i=n.sibling,i!==null){i.return=n.return,H=i;break}H=n.return}}function hp(a){for(;H!==null;){var n=H;if(n===a){H=null;break}var i=n.sibling;if(i!==null){i.return=n.return,H=i;break}H=n.return}}function yp(a){for(;H!==null;){var n=H;try{switch(n.tag){case 0:case 11:case 15:var i=n.return;try{zo(4,n)}catch(d){ba(n,i,d)}break;case 1:var e=n.stateNode;if(typeof e.componentDidMount=="function"){var t=n.return;try{e.componentDidMount()}catch(d){ba(n,t,d)}}var s=n.return;try{Ar(n)}catch(d){ba(n,s,d)}break;case 5:var g=n.return;try{Ar(n)}catch(d){ba(n,g,d)}}}catch(d){ba(n,n.return,d)}if(n===a){H=null;break}var u=n.sibling;if(u!==null){u.return=n.return,H=u;break}H=n.return}}var ry=Math.ceil,Mo=Gn.ReactCurrentDispatcher,kg=Gn.ReactCurrentOwner,pn=Gn.ReactCurrentBatchConfig,ia=0,Ta=null,Sa=null,Ia=0,Qa=0,ee=ci(0),va=0,lt=null,Oi=0,Lo=0,bg=0,We=null,La=null,fg=0,ye=1/0,Nn=null,Po=!1,Pr=null,gi=null,Ut=!1,ii=null,Bo=0,Ue=0,Br=null,to=-1,oo=0;function Ha(){return ia&6?fa():to!==-1?to:to=fa()}function li(a){return a.mode&1?ia&2&&Ia!==0?Ia&-Ia:qh.transition!==null?(oo===0&&(oo=bm()),oo):(a=sa,a!==0||(a=window.event,a=a===void 0?16:Am(a.type)),a):1}function xn(a,n,i,e){if(50<Ue)throw Ue=0,Br=null,Error(I(185));ut(a,i,e),(!(ia&2)||a!==Ta)&&(a===Ta&&(!(ia&2)&&(Lo|=i),va===4&&ai(a,Ia)),Ua(a,e),i===1&&ia===0&&!(n.mode&1)&&(ye=fa()+500,Ho&&hi()))}function Ua(a,n){var i=a.callbackNode;qc(a,n);var e=mo(a,a===Ta?Ia:0);if(e===0)i!==null&&Al(i),a.callbackNode=null,a.callbackPriority=0;else if(n=e&-e,a.callbackPriority!==n){if(i!=null&&Al(i),n===1)a.tag===0?Gh(kp.bind(null,a)):qm(kp.bind(null,a)),Kh(function(){!(ia&6)&&hi()}),i=null;else{switch(fm(e)){case 1:i=Wr;break;case 4:i=ym;break;case 16:i=po;break;case 536870912:i=km;break;default:i=po}i=Lu(i,Ou.bind(null,a))}a.callbackPriority=n,a.callbackNode=i}}function Ou(a,n){if(to=-1,oo=0,ia&6)throw Error(I(327));var i=a.callbackNode;if(le()&&a.callbackNode!==i)return null;var e=mo(a,a===Ta?Ia:0);if(e===0)return null;if(e&30||e&a.expiredLanes||n)n=Io(a,e);else{n=e;var t=ia;ia|=2;var s=ju();(Ta!==a||Ia!==n)&&(Nn=null,ye=fa()+500,Ii(a,n));do try{py();break}catch(u){_u(a,u)}while(!0);tg(),Mo.current=s,ia=t,Sa!==null?n=0:(Ta=null,Ia=0,n=va)}if(n!==0){if(n===2&&(t=ir(a),t!==0&&(e=t,n=Ir(a,t))),n===1)throw i=lt,Ii(a,0),ai(a,e),Ua(a,fa()),i;if(n===6)ai(a,e);else{if(t=a.current.alternate,!(e&30)&&!gy(t)&&(n=Io(a,e),n===2&&(s=ir(a),s!==0&&(e=s,n=Ir(a,s))),n===1))throw i=lt,Ii(a,0),ai(a,e),Ua(a,fa()),i;switch(a.finishedWork=t,a.finishedLanes=e,n){case 0:case 1:throw Error(I(345));case 2:Ti(a,La,Nn);break;case 3:if(ai(a,e),(e&130023424)===e&&(n=fg+500-fa(),10<n)){if(mo(a,0)!==0)break;if(t=a.suspendedLanes,(t&e)!==e){Ha(),a.pingedLanes|=a.suspendedLanes&t;break}a.timeoutHandle=pr(Ti.bind(null,a,La,Nn),n);break}Ti(a,La,Nn);break;case 4:if(ai(a,e),(e&4194240)===e)break;for(n=a.eventTimes,t=-1;0<e;){var g=31-Sn(e);s=1<<g,g=n[g],g>t&&(t=g),e&=~s}if(e=t,e=fa()-e,e=(120>e?120:480>e?480:1080>e?1080:1920>e?1920:3e3>e?3e3:4320>e?4320:1960*ry(e/1960))-e,10<e){a.timeoutHandle=pr(Ti.bind(null,a,La,Nn),e);break}Ti(a,La,Nn);break;case 5:Ti(a,La,Nn);break;default:throw Error(I(329))}}}return Ua(a,fa()),a.callbackNode===i?Ou.bind(null,a):null}function Ir(a,n){var i=We;return a.current.memoizedState.isDehydrated&&(Ii(a,n).flags|=256),a=Io(a,n),a!==2&&(n=La,La=i,n!==null&&Er(n)),a}function Er(a){La===null?La=a:La.push.apply(La,a)}function gy(a){for(var n=a;;){if(n.flags&16384){var i=n.updateQueue;if(i!==null&&(i=i.stores,i!==null))for(var e=0;e<i.length;e++){var t=i[e],s=t.getSnapshot;t=t.value;try{if(!vn(s(),t))return!1}catch{return!1}}}if(i=n.child,n.subtreeFlags&16384&&i!==null)i.return=n,n=i;else{if(n===a)break;for(;n.sibling===null;){if(n.return===null||n.return===a)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function ai(a,n){for(n&=~bg,n&=~Lo,a.suspendedLanes|=n,a.pingedLanes&=~n,a=a.expirationTimes;0<n;){var i=31-Sn(n),e=1<<i;a[i]=-1,n&=~e}}function kp(a){if(ia&6)throw Error(I(327));le();var n=mo(a,0);if(!(n&1))return Ua(a,fa()),null;var i=Io(a,n);if(a.tag!==0&&i===2){var e=ir(a);e!==0&&(n=e,i=Ir(a,e))}if(i===1)throw i=lt,Ii(a,0),ai(a,n),Ua(a,fa()),i;if(i===6)throw Error(I(345));return a.finishedWork=a.current.alternate,a.finishedLanes=n,Ti(a,La,Nn),Ua(a,fa()),null}function wg(a,n){var i=ia;ia|=1;try{return a(n)}finally{ia=i,ia===0&&(ye=fa()+500,Ho&&hi())}}function _i(a){ii!==null&&ii.tag===0&&!(ia&6)&&le();var n=ia;ia|=1;var i=pn.transition,e=sa;try{if(pn.transition=null,sa=1,a)return a()}finally{sa=e,pn.transition=i,ia=n,!(ia&6)&&hi()}}function Sg(){Qa=ee.current,da(ee)}function Ii(a,n){a.finishedWork=null,a.finishedLanes=0;var i=a.timeoutHandle;if(i!==-1&&(a.timeoutHandle=-1,Hh(i)),Sa!==null)for(i=Sa.return;i!==null;){var e=i;switch(ng(e),e.tag){case 1:e=e.type.childContextTypes,e!=null&&ko();break;case 3:ce(),da(qa),da(Oa),pg();break;case 5:lg(e);break;case 4:ce();break;case 13:da(ha);break;case 19:da(ha);break;case 10:og(e.type._context);break;case 22:case 23:Sg()}i=i.return}if(Ta=a,Sa=a=pi(a.current,null),Ia=Qa=n,va=0,lt=null,bg=Lo=Oi=0,La=We=null,Pi!==null){for(n=0;n<Pi.length;n++)if(i=Pi[n],e=i.interleaved,e!==null){i.interleaved=null;var t=e.next,s=i.pending;if(s!==null){var g=s.next;s.next=t,e.next=g}i.pending=e}Pi=null}return a}function _u(a,n){do{var i=Sa;try{if(tg(),no.current=To,Ao){for(var e=ya.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ao=!1}if(Ri=0,Aa=xa=ya=null,Ge=!1,st=0,kg.current=null,i===null||i.return===null){va=1,lt=n,Sa=null;break}a:{var s=a,g=i.return,u=i,d=n;if(n=Ia,u.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var m=d,C=u,f=C.tag;if(!(C.mode&1)&&(f===0||f===11||f===15)){var S=C.alternate;S?(C.updateQueue=S.updateQueue,C.memoizedState=S.memoizedState,C.lanes=S.lanes):(C.updateQueue=null,C.memoizedState=null)}var P=tp(g);if(P!==null){P.flags&=-257,op(P,g,u,s,n),P.mode&1&&ep(s,m,n),n=P,d=m;var T=n.updateQueue;if(T===null){var A=new Set;A.add(d),n.updateQueue=A}else T.add(d);break a}else{if(!(n&1)){ep(s,m,n),xg();break a}d=Error(I(426))}}else if(ca&&u.mode&1){var L=tp(g);if(L!==null){!(L.flags&65536)&&(L.flags|=256),op(L,g,u,s,n),ig(he(d,u));break a}}s=d=he(d,u),va!==4&&(va=2),We===null?We=[s]:We.push(s),s=g;do{switch(s.tag){case 3:s.flags|=65536,n&=-n,s.lanes|=n;var k=fu(s,d,n);Yl(s,k);break a;case 1:u=d;var h=s.type,b=s.stateNode;if(!(s.flags&128)&&(typeof h.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(gi===null||!gi.has(b)))){s.flags|=65536,n&=-n,s.lanes|=n;var v=wu(s,u,n);Yl(s,v);break a}}s=s.return}while(s!==null)}Ku(i)}catch(E){n=E,Sa===i&&i!==null&&(Sa=i=i.return);continue}break}while(!0)}function ju(){var a=Mo.current;return Mo.current=To,a===null?To:a}function xg(){(va===0||va===3||va===2)&&(va=4),Ta===null||!(Oi&268435455)&&!(Lo&268435455)||ai(Ta,Ia)}function Io(a,n){var i=ia;ia|=2;var e=ju();(Ta!==a||Ia!==n)&&(Nn=null,Ii(a,n));do try{ly();break}catch(t){_u(a,t)}while(!0);if(tg(),ia=i,Mo.current=e,Sa!==null)throw Error(I(261));return Ta=null,Ia=0,va}function ly(){for(;Sa!==null;)Hu(Sa)}function py(){for(;Sa!==null&&!Oc();)Hu(Sa)}function Hu(a){var n=zu(a.alternate,a,Qa);a.memoizedProps=a.pendingProps,n===null?Ku(a):Sa=n,kg.current=null}function Ku(a){var n=a;do{var i=n.alternate;if(a=n.return,n.flags&32768){if(i=ey(i,n),i!==null){i.flags&=32767,Sa=i;return}if(a!==null)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else{va=6,Sa=null;return}}else if(i=iy(i,n,Qa),i!==null){Sa=i;return}if(n=n.sibling,n!==null){Sa=n;return}Sa=n=a}while(n!==null);va===0&&(va=5)}function Ti(a,n,i){var e=sa,t=pn.transition;try{pn.transition=null,sa=1,my(a,n,i,e)}finally{pn.transition=t,sa=e}return null}function my(a,n,i,e){do le();while(ii!==null);if(ia&6)throw Error(I(327));i=a.finishedWork;var t=a.finishedLanes;if(i===null)return null;if(a.finishedWork=null,a.finishedLanes=0,i===a.current)throw Error(I(177));a.callbackNode=null,a.callbackPriority=0;var s=i.lanes|i.childLanes;if(Wc(a,s),a===Ta&&(Sa=Ta=null,Ia=0),!(i.subtreeFlags&2064)&&!(i.flags&2064)||Ut||(Ut=!0,Lu(po,function(){return le(),null})),s=(i.flags&15990)!==0,i.subtreeFlags&15990||s){s=pn.transition,pn.transition=null;var g=sa;sa=1;var u=ia;ia|=4,kg.current=null,oy(a,i),Nu(i,a),Eh(gr),uo=!!rr,gr=rr=null,a.current=i,sy(i),_c(),ia=u,sa=g,pn.transition=s}else a.current=i;if(Ut&&(Ut=!1,ii=a,Bo=t),s=a.pendingLanes,s===0&&(gi=null),Kc(i.stateNode),Ua(a,fa()),n!==null)for(e=a.onRecoverableError,i=0;i<n.length;i++)t=n[i],e(t.value,{componentStack:t.stack,digest:t.digest});if(Po)throw Po=!1,a=Pr,Pr=null,a;return Bo&1&&a.tag!==0&&le(),s=a.pendingLanes,s&1?a===Br?Ue++:(Ue=0,Br=a):Ue=0,hi(),null}function le(){if(ii!==null){var a=fm(Bo),n=pn.transition,i=sa;try{if(pn.transition=null,sa=16>a?16:a,ii===null)var e=!1;else{if(a=ii,ii=null,Bo=0,ia&6)throw Error(I(331));var t=ia;for(ia|=4,H=a.current;H!==null;){var s=H,g=s.child;if(H.flags&16){var u=s.deletions;if(u!==null){for(var d=0;d<u.length;d++){var m=u[d];for(H=m;H!==null;){var C=H;switch(C.tag){case 0:case 11:case 15:qe(8,C,s)}var f=C.child;if(f!==null)f.return=C,H=f;else for(;H!==null;){C=H;var S=C.sibling,P=C.return;if(Iu(C),C===m){H=null;break}if(S!==null){S.return=P,H=S;break}H=P}}}var T=s.alternate;if(T!==null){var A=T.child;if(A!==null){T.child=null;do{var L=A.sibling;A.sibling=null,A=L}while(A!==null)}}H=s}}if(s.subtreeFlags&2064&&g!==null)g.return=s,H=g;else a:for(;H!==null;){if(s=H,s.flags&2048)switch(s.tag){case 0:case 11:case 15:qe(9,s,s.return)}var k=s.sibling;if(k!==null){k.return=s.return,H=k;break a}H=s.return}}var h=a.current;for(H=h;H!==null;){g=H;var b=g.child;if(g.subtreeFlags&2064&&b!==null)b.return=g,H=b;else a:for(g=h;H!==null;){if(u=H,u.flags&2048)try{switch(u.tag){case 0:case 11:case 15:zo(9,u)}}catch(E){ba(u,u.return,E)}if(u===g){H=null;break a}var v=u.sibling;if(v!==null){v.return=u.return,H=v;break a}H=u.return}}if(ia=t,hi(),Bn&&typeof Bn.onPostCommitFiberRoot=="function")try{Bn.onPostCommitFiberRoot(No,a)}catch{}e=!0}return e}finally{sa=i,pn.transition=n}}return!1}function bp(a,n,i){n=he(i,n),n=fu(a,n,1),a=ri(a,n,1),n=Ha(),a!==null&&(ut(a,1,n),Ua(a,n))}function ba(a,n,i){if(a.tag===3)bp(a,a,i);else for(;n!==null;){if(n.tag===3){bp(n,a,i);break}else if(n.tag===1){var e=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof e.componentDidCatch=="function"&&(gi===null||!gi.has(e))){a=he(i,a),a=wu(n,a,1),n=ri(n,a,1),a=Ha(),n!==null&&(ut(n,1,a),Ua(n,a));break}}n=n.return}}function uy(a,n,i){var e=a.pingCache;e!==null&&e.delete(n),n=Ha(),a.pingedLanes|=a.suspendedLanes&i,Ta===a&&(Ia&i)===i&&(va===4||va===3&&(Ia&130023424)===Ia&&500>fa()-fg?Ii(a,0):bg|=i),Ua(a,n)}function Fu(a,n){n===0&&(a.mode&1?(n=_t,_t<<=1,!(_t&130023424)&&(_t=4194304)):n=1);var i=Ha();a=zn(a,n),a!==null&&(ut(a,n,i),Ua(a,i))}function dy(a){var n=a.memoizedState,i=0;n!==null&&(i=n.retryLane),Fu(a,i)}function cy(a,n){var i=0;switch(a.tag){case 13:var e=a.stateNode,t=a.memoizedState;t!==null&&(i=t.retryLane);break;case 19:e=a.stateNode;break;default:throw Error(I(314))}e!==null&&e.delete(n),Fu(a,i)}var zu;zu=function(a,n,i){if(a!==null)if(a.memoizedProps!==n.pendingProps||qa.current)Ga=!0;else{if(!(a.lanes&i)&&!(n.flags&128))return Ga=!1,ny(a,n,i);Ga=!!(a.flags&131072)}else Ga=!1,ca&&n.flags&1048576&&Wm(n,wo,n.index);switch(n.lanes=0,n.tag){case 2:var e=n.type;eo(a,n),a=n.pendingProps;var t=me(n,Oa.current);ge(n,i),t=ug(null,n,e,a,t,i);var s=dg();return n.flags|=1,typeof t=="object"&&t!==null&&typeof t.render=="function"&&t.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,Wa(e)?(s=!0,bo(n)):s=!1,n.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,rg(n),t.updater=Fo,n.stateNode=t,t._reactInternals=n,kr(n,e,a,i),n=wr(null,n,e,!0,s,i)):(n.tag=0,ca&&s&&ag(n),ja(null,n,t,i),n=n.child),n;case 16:e=n.elementType;a:{switch(eo(a,n),a=n.pendingProps,t=e._init,e=t(e._payload),n.type=e,t=n.tag=yy(e),a=bn(e,a),t){case 0:n=fr(null,n,e,a,i);break a;case 1:n=gp(null,n,e,a,i);break a;case 11:n=sp(null,n,e,a,i);break a;case 14:n=rp(null,n,e,bn(e.type,a),i);break a}throw Error(I(306,e,""))}return n;case 0:return e=n.type,t=n.pendingProps,t=n.elementType===e?t:bn(e,t),fr(a,n,e,t,i);case 1:return e=n.type,t=n.pendingProps,t=n.elementType===e?t:bn(e,t),gp(a,n,e,t,i);case 3:a:{if(Cu(n),a===null)throw Error(I(387));e=n.pendingProps,s=n.memoizedState,t=s.element,Ym(a,n),vo(n,e,null,i);var g=n.memoizedState;if(e=g.element,s.isDehydrated)if(s={element:e,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},n.updateQueue.baseState=s,n.memoizedState=s,n.flags&256){t=he(Error(I(423)),n),n=lp(a,n,e,i,t);break a}else if(e!==t){t=he(Error(I(424)),n),n=lp(a,n,e,i,t);break a}else for(Za=si(n.stateNode.containerInfo.firstChild),Ya=n,ca=!0,wn=null,i=Qm(n,null,e,i),n.child=i;i;)i.flags=i.flags&-3|4096,i=i.sibling;else{if(ue(),e===t){n=Ln(a,n,i);break a}ja(a,n,e,i)}n=n.child}return n;case 5:return Jm(n),a===null&&cr(n),e=n.type,t=n.pendingProps,s=a!==null?a.memoizedProps:null,g=t.children,lr(e,t)?g=null:s!==null&&lr(e,s)&&(n.flags|=32),vu(a,n),ja(a,n,g,i),n.child;case 6:return a===null&&cr(n),null;case 13:return Au(a,n,i);case 4:return gg(n,n.stateNode.containerInfo),e=n.pendingProps,a===null?n.child=de(n,null,e,i):ja(a,n,e,i),n.child;case 11:return e=n.type,t=n.pendingProps,t=n.elementType===e?t:bn(e,t),sp(a,n,e,t,i);case 7:return ja(a,n,n.pendingProps,i),n.child;case 8:return ja(a,n,n.pendingProps.children,i),n.child;case 12:return ja(a,n,n.pendingProps.children,i),n.child;case 10:a:{if(e=n.type._context,t=n.pendingProps,s=n.memoizedProps,g=t.value,la(So,e._currentValue),e._currentValue=g,s!==null)if(vn(s.value,g)){if(s.children===t.children&&!qa.current){n=Ln(a,n,i);break a}}else for(s=n.child,s!==null&&(s.return=n);s!==null;){var u=s.dependencies;if(u!==null){g=s.child;for(var d=u.firstContext;d!==null;){if(d.context===e){if(s.tag===1){d=Hn(-1,i&-i),d.tag=2;var m=s.updateQueue;if(m!==null){m=m.shared;var C=m.pending;C===null?d.next=d:(d.next=C.next,C.next=d),m.pending=d}}s.lanes|=i,d=s.alternate,d!==null&&(d.lanes|=i),hr(s.return,i,n),u.lanes|=i;break}d=d.next}}else if(s.tag===10)g=s.type===n.type?null:s.child;else if(s.tag===18){if(g=s.return,g===null)throw Error(I(341));g.lanes|=i,u=g.alternate,u!==null&&(u.lanes|=i),hr(g,i,n),g=s.sibling}else g=s.child;if(g!==null)g.return=s;else for(g=s;g!==null;){if(g===n){g=null;break}if(s=g.sibling,s!==null){s.return=g.return,g=s;break}g=g.return}s=g}ja(a,n,t.children,i),n=n.child}return n;case 9:return t=n.type,e=n.pendingProps.children,ge(n,i),t=mn(t),e=e(t),n.flags|=1,ja(a,n,e,i),n.child;case 14:return e=n.type,t=bn(e,n.pendingProps),t=bn(e.type,t),rp(a,n,e,t,i);case 15:return Su(a,n,n.type,n.pendingProps,i);case 17:return e=n.type,t=n.pendingProps,t=n.elementType===e?t:bn(e,t),eo(a,n),n.tag=1,Wa(e)?(a=!0,bo(n)):a=!1,ge(n,i),bu(n,e,t),kr(n,e,t,i),wr(null,n,e,!0,a,i);case 19:return Tu(a,n,i);case 22:return xu(a,n,i)}throw Error(I(156,n.tag))};function Lu(a,n){return hm(a,n)}function hy(a,n,i,e){this.tag=a,this.key=i,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=e,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ln(a,n,i,e){return new hy(a,n,i,e)}function vg(a){return a=a.prototype,!(!a||!a.isReactComponent)}function yy(a){if(typeof a=="function")return vg(a)?1:0;if(a!=null){if(a=a.$$typeof,a===Lr)return 11;if(a===Gr)return 14}return 2}function pi(a,n){var i=a.alternate;return i===null?(i=ln(a.tag,n,a.key,a.mode),i.elementType=a.elementType,i.type=a.type,i.stateNode=a.stateNode,i.alternate=a,a.alternate=i):(i.pendingProps=n,i.type=a.type,i.flags=0,i.subtreeFlags=0,i.deletions=null),i.flags=a.flags&14680064,i.childLanes=a.childLanes,i.lanes=a.lanes,i.child=a.child,i.memoizedProps=a.memoizedProps,i.memoizedState=a.memoizedState,i.updateQueue=a.updateQueue,n=a.dependencies,i.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},i.sibling=a.sibling,i.index=a.index,i.ref=a.ref,i}function so(a,n,i,e,t,s){var g=2;if(e=a,typeof a=="function")vg(a)&&(g=1);else if(typeof a=="string")g=5;else a:switch(a){case Vi:return Ei(i.children,t,s,n);case zr:g=8,t|=8;break;case zs:return a=ln(12,i,n,t|2),a.elementType=zs,a.lanes=s,a;case Ls:return a=ln(13,i,n,t),a.elementType=Ls,a.lanes=s,a;case Gs:return a=ln(19,i,n,t),a.elementType=Gs,a.lanes=s,a;case Jp:return Go(i,t,s,n);default:if(typeof a=="object"&&a!==null)switch(a.$$typeof){case Zp:g=10;break a;case Yp:g=9;break a;case Lr:g=11;break a;case Gr:g=14;break a;case Yn:g=16,e=null;break a}throw Error(I(130,a==null?a:typeof a,""))}return n=ln(g,i,n,t),n.elementType=a,n.type=e,n.lanes=s,n}function Ei(a,n,i,e){return a=ln(7,a,e,n),a.lanes=i,a}function Go(a,n,i,e){return a=ln(22,a,e,n),a.elementType=Jp,a.lanes=i,a.stateNode={isHidden:!1},a}function Os(a,n,i){return a=ln(6,a,null,n),a.lanes=i,a}function _s(a,n,i){return n=ln(4,a.children!==null?a.children:[],a.key,n),n.lanes=i,n.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation},n}function ky(a,n,i,e,t){this.tag=n,this.containerInfo=a,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ys(0),this.expirationTimes=ys(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ys(0),this.identifierPrefix=e,this.onRecoverableError=t,this.mutableSourceEagerHydrationData=null}function Cg(a,n,i,e,t,s,g,u,d){return a=new ky(a,n,i,u,d),n===1?(n=1,s===!0&&(n|=8)):n=0,s=ln(3,null,null,n),a.current=s,s.stateNode=a,s.memoizedState={element:e,isDehydrated:i,cache:null,transitions:null,pendingSuspenseBoundaries:null},rg(s),a}function by(a,n,i){var e=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ui,key:e==null?null:""+e,children:a,containerInfo:n,implementation:i}}function Gu(a){if(!a)return ui;a=a._reactInternals;a:{if(Ki(a)!==a||a.tag!==1)throw Error(I(170));var n=a;do{switch(n.tag){case 3:n=n.stateNode.context;break a;case 1:if(Wa(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break a}}n=n.return}while(n!==null);throw Error(I(171))}if(a.tag===1){var i=a.type;if(Wa(i))return Gm(a,i,n)}return n}function qu(a,n,i,e,t,s,g,u,d){return a=Cg(i,e,!0,a,t,s,g,u,d),a.context=Gu(null),i=a.current,e=Ha(),t=li(i),s=Hn(e,t),s.callback=n??null,ri(i,s,t),a.current.lanes=t,ut(a,t,e),Ua(a,e),a}function qo(a,n,i,e){var t=n.current,s=Ha(),g=li(t);return i=Gu(i),n.context===null?n.context=i:n.pendingContext=i,n=Hn(s,g),n.payload={element:a},e=e===void 0?null:e,e!==null&&(n.callback=e),a=ri(t,n,g),a!==null&&(xn(a,t,g,s),ao(a,t,g)),g}function Eo(a){if(a=a.current,!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function fp(a,n){if(a=a.memoizedState,a!==null&&a.dehydrated!==null){var i=a.retryLane;a.retryLane=i!==0&&i<n?i:n}}function Ag(a,n){fp(a,n),(a=a.alternate)&&fp(a,n)}function fy(){return null}var Wu=typeof reportError=="function"?reportError:function(a){console.error(a)};function Tg(a){this._internalRoot=a}Wo.prototype.render=Tg.prototype.render=function(a){var n=this._internalRoot;if(n===null)throw Error(I(409));qo(a,n,null,null)};Wo.prototype.unmount=Tg.prototype.unmount=function(){var a=this._internalRoot;if(a!==null){this._internalRoot=null;var n=a.containerInfo;_i(function(){qo(null,a,null,null)}),n[Fn]=null}};function Wo(a){this._internalRoot=a}Wo.prototype.unstable_scheduleHydration=function(a){if(a){var n=xm();a={blockedOn:null,target:a,priority:n};for(var i=0;i<Xn.length&&n!==0&&n<Xn[i].priority;i++);Xn.splice(i,0,a),i===0&&Cm(a)}};function Mg(a){return!(!a||a.nodeType!==1&&a.nodeType!==9&&a.nodeType!==11)}function Uo(a){return!(!a||a.nodeType!==1&&a.nodeType!==9&&a.nodeType!==11&&(a.nodeType!==8||a.nodeValue!==" react-mount-point-unstable "))}function wp(){}function wy(a,n,i,e,t){if(t){if(typeof e=="function"){var s=e;e=function(){var m=Eo(g);s.call(m)}}var g=qu(n,e,a,0,null,!1,!1,"",wp);return a._reactRootContainer=g,a[Fn]=g.current,nt(a.nodeType===8?a.parentNode:a),_i(),g}for(;t=a.lastChild;)a.removeChild(t);if(typeof e=="function"){var u=e;e=function(){var m=Eo(d);u.call(m)}}var d=Cg(a,0,!1,null,null,!1,!1,"",wp);return a._reactRootContainer=d,a[Fn]=d.current,nt(a.nodeType===8?a.parentNode:a),_i(function(){qo(n,d,i,e)}),d}function Vo(a,n,i,e,t){var s=i._reactRootContainer;if(s){var g=s;if(typeof t=="function"){var u=t;t=function(){var d=Eo(g);u.call(d)}}qo(n,g,a,t)}else g=wy(i,n,a,t,e);return Eo(g)}wm=function(a){switch(a.tag){case 3:var n=a.stateNode;if(n.current.memoizedState.isDehydrated){var i=_e(n.pendingLanes);i!==0&&(Ur(n,i|1),Ua(n,fa()),!(ia&6)&&(ye=fa()+500,hi()))}break;case 13:_i(function(){var e=zn(a,1);if(e!==null){var t=Ha();xn(e,a,1,t)}}),Ag(a,1)}};Vr=function(a){if(a.tag===13){var n=zn(a,134217728);if(n!==null){var i=Ha();xn(n,a,134217728,i)}Ag(a,134217728)}};Sm=function(a){if(a.tag===13){var n=li(a),i=zn(a,n);if(i!==null){var e=Ha();xn(i,a,n,e)}Ag(a,n)}};xm=function(){return sa};vm=function(a,n){var i=sa;try{return sa=a,n()}finally{sa=i}};Xs=function(a,n,i){switch(n){case"input":if(Us(a,i),n=i.name,i.type==="radio"&&n!=null){for(i=a;i.parentNode;)i=i.parentNode;for(i=i.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<i.length;n++){var e=i[n];if(e!==a&&e.form===a.form){var t=jo(e);if(!t)throw Error(I(90));am(e),Us(e,t)}}}break;case"textarea":im(a,i);break;case"select":n=i.value,n!=null&&te(a,!!i.multiple,n,!1)}};lm=wg;pm=_i;var Sy={usingClientEntryPoint:!1,Events:[ct,Yi,jo,rm,gm,wg]},Ne={findFiberByHostInstance:Mi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},xy={bundleType:Ne.bundleType,version:Ne.version,rendererPackageName:Ne.rendererPackageName,rendererConfig:Ne.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Gn.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){return a=dm(a),a===null?null:a.stateNode},findFiberByHostInstance:Ne.findFiberByHostInstance||fy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Vt=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Vt.isDisabled&&Vt.supportsFiber)try{No=Vt.inject(xy),Bn=Vt}catch{}}Xa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Sy;Xa.createPortal=function(a,n){var i=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Mg(n))throw Error(I(200));return by(a,n,null,i)};Xa.createRoot=function(a,n){if(!Mg(a))throw Error(I(299));var i=!1,e="",t=Wu;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(e=n.identifierPrefix),n.onRecoverableError!==void 0&&(t=n.onRecoverableError)),n=Cg(a,1,!1,null,null,i,!1,e,t),a[Fn]=n.current,nt(a.nodeType===8?a.parentNode:a),new Tg(n)};Xa.findDOMNode=function(a){if(a==null)return null;if(a.nodeType===1)return a;var n=a._reactInternals;if(n===void 0)throw typeof a.render=="function"?Error(I(188)):(a=Object.keys(a).join(","),Error(I(268,a)));return a=dm(n),a=a===null?null:a.stateNode,a};Xa.flushSync=function(a){return _i(a)};Xa.hydrate=function(a,n,i){if(!Uo(n))throw Error(I(200));return Vo(null,a,n,!0,i)};Xa.hydrateRoot=function(a,n,i){if(!Mg(a))throw Error(I(405));var e=i!=null&&i.hydratedSources||null,t=!1,s="",g=Wu;if(i!=null&&(i.unstable_strictMode===!0&&(t=!0),i.identifierPrefix!==void 0&&(s=i.identifierPrefix),i.onRecoverableError!==void 0&&(g=i.onRecoverableError)),n=qu(n,null,a,1,i??null,t,!1,s,g),a[Fn]=n.current,nt(a),e)for(a=0;a<e.length;a++)i=e[a],t=i._getVersion,t=t(i._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[i,t]:n.mutableSourceEagerHydrationData.push(i,t);return new Wo(n)};Xa.render=function(a,n,i){if(!Uo(n))throw Error(I(200));return Vo(null,a,n,!1,i)};Xa.unmountComponentAtNode=function(a){if(!Uo(a))throw Error(I(40));return a._reactRootContainer?(_i(function(){Vo(null,null,a,!1,function(){a._reactRootContainer=null,a[Fn]=null})}),!0):!1};Xa.unstable_batchedUpdates=wg;Xa.unstable_renderSubtreeIntoContainer=function(a,n,i,e){if(!Uo(i))throw Error(I(200));if(a==null||a._reactInternals===void 0)throw Error(I(38));return Vo(a,n,i,!1,e)};Xa.version="18.3.1-next-f1338f8080-20240426";function Uu(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Uu)}catch(a){console.error(a)}}Uu(),Up.exports=Xa;var vy=Up.exports,Sp=vy;Ks.createRoot=Sp.createRoot,Ks.hydrateRoot=Sp.hydrateRoot;var Vu={exports:{}};const Cy={},Ay=Object.freeze(Object.defineProperty({__proto__:null,default:Cy},Symbol.toStringTag,{value:"Module"})),xp=Yd(Ay);(function(a,n){var i=void 0,e=function(t){return i||(i=new Promise(function(s,g){var Xg,al,nl,il,el;var u=typeof t<"u"?t:{},d=u.onAbort;u.onAbort=function(o){g(new Error(o)),d&&d(o)},u.postRun=u.postRun||[],u.postRun.push(function(){s(u)}),a=void 0;var m;m||(m=typeof u<"u"?u:{});var C=!!globalThis.window,f=!!globalThis.WorkerGlobalScope,S=((al=(Xg=globalThis.process)==null?void 0:Xg.versions)==null?void 0:al.node)&&((nl=globalThis.process)==null?void 0:nl.type)!="renderer";m.onRuntimeInitialized=function(){function o(w,B){switch(typeof B){case"boolean":Vd(w,B?1:0);break;case"number":qd(w,B);break;case"string":Wd(w,B,-1,-1);break;case"object":if(B===null)ll(w);else if(B.length!=null){var F=Tt(B.length);K.set(B,F),Ud(w,F,B.length,-1),Ae(F)}else It(w,"Wrong API use : tried to return a value of an unknown type ("+B+").",-1);break;default:ll(w)}}function r(w,B){for(var F=[],z=0;z<w;z+=1){var Z=cn(B+4*z,"i32"),oa=Kd(Z);if(oa===1||oa===2)Z=Gd(Z);else if(oa===3)Z=zd(Z);else if(oa===4){oa=Z,Z=Fd(oa),oa=Ld(oa);for(var hn=new Uint8Array(Z),sn=0;sn<Z;sn+=1)hn[sn]=K[oa+sn];Z=hn}else Z=null;F.push(Z)}return F}function l(w,B){this.Qa=w,this.db=B,this.Oa=1,this.mb=[]}function p(w,B){if(this.db=B,this.fb=At(w),this.fb===null)throw Error("Unable to allocate memory for the SQL string");this.lb=this.fb,this.$a=this.sb=null}function y(w){if(this.filename="dbfile_"+(4294967295*Math.random()>>>0),w!=null){var B=this.filename,F="/",z=B;if(F&&(F=typeof F=="string"?F:Yo(F),z=B?we(F+"/"+B):F),B=Eg(!0,!0),z=cd(z,B),w){if(typeof w=="string"){F=Array(w.length);for(var Z=0,oa=w.length;Z<oa;++Z)F[Z]=w.charCodeAt(Z);w=F}St(z,B|146),F=qi(z,577),Ug(F,w,0,w.length,0),es(F),St(z,B)}}this.handleError(W(this.filename,x)),this.db=cn(x,"i32"),ml(this.db),this.gb={},this.Sa={}}var x=vi(4),M=m.cwrap,W=M("sqlite3_open","number",["string","number"]),ta=M("sqlite3_close_v2","number",["number"]),$=M("sqlite3_exec","number",["number","string","number","number","number"]),ma=M("sqlite3_changes","number",["number"]),Pa=M("sqlite3_prepare_v2","number",["number","string","number","number","number"]),tl=M("sqlite3_sql","string",["number"]),xd=M("sqlite3_normalized_sql","string",["number"]),ol=M("sqlite3_prepare_v2","number",["number","number","number","number","number"]),vd=M("sqlite3_bind_text","number",["number","number","number","number","number"]),sl=M("sqlite3_bind_blob","number",["number","number","number","number","number"]),Cd=M("sqlite3_bind_double","number",["number","number","number"]),Ad=M("sqlite3_bind_int","number",["number","number","number"]),Td=M("sqlite3_bind_parameter_index","number",["number","string"]),Md=M("sqlite3_step","number",["number"]),Pd=M("sqlite3_errmsg","string",["number"]),Bd=M("sqlite3_column_count","number",["number"]),Id=M("sqlite3_data_count","number",["number"]),Ed=M("sqlite3_column_double","number",["number","number"]),rl=M("sqlite3_column_text","string",["number","number"]),Dd=M("sqlite3_column_blob","number",["number","number"]),Nd=M("sqlite3_column_bytes","number",["number","number"]),Rd=M("sqlite3_column_type","number",["number","number"]),Od=M("sqlite3_column_name","string",["number","number"]),_d=M("sqlite3_reset","number",["number"]),jd=M("sqlite3_clear_bindings","number",["number"]),Hd=M("sqlite3_finalize","number",["number"]),gl=M("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Kd=M("sqlite3_value_type","number",["number"]),Fd=M("sqlite3_value_bytes","number",["number"]),zd=M("sqlite3_value_text","string",["number"]),Ld=M("sqlite3_value_blob","number",["number"]),Gd=M("sqlite3_value_double","number",["number"]),qd=M("sqlite3_result_double","",["number","number"]),ll=M("sqlite3_result_null","",["number"]),Wd=M("sqlite3_result_text","",["number","string","number","number"]),Ud=M("sqlite3_result_blob","",["number","number","number","number"]),Vd=M("sqlite3_result_int","",["number","number"]),It=M("sqlite3_result_error","",["number","string","number"]),pl=M("sqlite3_aggregate_context","number",["number","number"]),ml=M("RegisterExtensionFunctions","number",["number"]),ul=M("sqlite3_update_hook","number",["number","number","number"]);l.prototype.bind=function(w){if(!this.Qa)throw"Statement closed";return this.reset(),Array.isArray(w)?this.Gb(w):w!=null&&typeof w=="object"?this.Hb(w):!0},l.prototype.step=function(){if(!this.Qa)throw"Statement closed";this.Oa=1;var w=Md(this.Qa);switch(w){case 100:return!0;case 101:return!1;default:throw this.db.handleError(w)}},l.prototype.Ab=function(w){return w==null&&(w=this.Oa,this.Oa+=1),Ed(this.Qa,w)},l.prototype.Ob=function(w){if(w==null&&(w=this.Oa,this.Oa+=1),w=rl(this.Qa,w),typeof BigInt!="function")throw Error("BigInt is not supported");return BigInt(w)},l.prototype.Tb=function(w){return w==null&&(w=this.Oa,this.Oa+=1),rl(this.Qa,w)},l.prototype.getBlob=function(w){w==null&&(w=this.Oa,this.Oa+=1);var B=Nd(this.Qa,w);w=Dd(this.Qa,w);for(var F=new Uint8Array(B),z=0;z<B;z+=1)F[z]=K[w+z];return F},l.prototype.get=function(w,B){B=B||{},w!=null&&this.bind(w)&&this.step(),w=[];for(var F=Id(this.Qa),z=0;z<F;z+=1)switch(Rd(this.Qa,z)){case 1:var Z=B.useBigInt?this.Ob(z):this.Ab(z);w.push(Z);break;case 2:w.push(this.Ab(z));break;case 3:w.push(this.Tb(z));break;case 4:w.push(this.getBlob(z));break;default:w.push(null)}return w},l.prototype.qb=function(){for(var w=[],B=Bd(this.Qa),F=0;F<B;F+=1)w.push(Od(this.Qa,F));return w},l.prototype.zb=function(w,B){w=this.get(w,B),B=this.qb();for(var F={},z=0;z<B.length;z+=1)F[B[z]]=w[z];return F},l.prototype.Sb=function(){return tl(this.Qa)},l.prototype.Pb=function(){return xd(this.Qa)},l.prototype.run=function(w){return w!=null&&this.bind(w),this.step(),this.reset()},l.prototype.wb=function(w,B){B==null&&(B=this.Oa,this.Oa+=1),w=At(w),this.mb.push(w),this.db.handleError(vd(this.Qa,B,w,-1,0))},l.prototype.Fb=function(w,B){B==null&&(B=this.Oa,this.Oa+=1);var F=Tt(w.length);K.set(w,F),this.mb.push(F),this.db.handleError(sl(this.Qa,B,F,w.length,0))},l.prototype.vb=function(w,B){B==null&&(B=this.Oa,this.Oa+=1),this.db.handleError((w===(w|0)?Ad:Cd)(this.Qa,B,w))},l.prototype.Ib=function(w){w==null&&(w=this.Oa,this.Oa+=1),sl(this.Qa,w,0,0,0)},l.prototype.xb=function(w,B){switch(B==null&&(B=this.Oa,this.Oa+=1),typeof w){case"string":this.wb(w,B);return;case"number":this.vb(w,B);return;case"bigint":this.wb(w.toString(),B);return;case"boolean":this.vb(w+0,B);return;case"object":if(w===null){this.Ib(B);return}if(w.length!=null){this.Fb(w,B);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+w+")."},l.prototype.Hb=function(w){var B=this;return Object.keys(w).forEach(function(F){var z=Td(B.Qa,F);z!==0&&B.xb(w[F],z)}),!0},l.prototype.Gb=function(w){for(var B=0;B<w.length;B+=1)this.xb(w[B],B+1);return!0},l.prototype.reset=function(){return this.freemem(),jd(this.Qa)===0&&_d(this.Qa)===0},l.prototype.freemem=function(){for(var w;(w=this.mb.pop())!==void 0;)Ae(w)},l.prototype.Ya=function(){this.freemem();var w=Hd(this.Qa)===0;return delete this.db.gb[this.Qa],this.Qa=0,w},p.prototype.next=function(){if(this.fb===null)return{done:!0};if(this.$a!==null&&(this.$a.Ya(),this.$a=null),!this.db.db)throw this.ob(),Error("Database closed");var w=Pt(),B=vi(4);q(x),q(B);try{this.db.handleError(ol(this.db.db,this.lb,-1,x,B)),this.lb=cn(B,"i32");var F=cn(x,"i32");return F===0?(this.ob(),{done:!0}):(this.$a=new l(F,this.db),this.db.gb[F]=this.$a,{value:this.$a,done:!1})}catch(z){throw this.sb=J(this.lb),this.ob(),z}finally{Mt(w)}},p.prototype.ob=function(){Ae(this.fb),this.fb=null},p.prototype.Qb=function(){return this.sb!==null?this.sb:J(this.lb)},typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"&&(p.prototype[Symbol.iterator]=function(){return this}),y.prototype.run=function(w,B){if(!this.db)throw"Database closed";if(B){w=this.tb(w,B);try{w.step()}finally{w.Ya()}}else this.handleError($(this.db,w,0,0,x));return this},y.prototype.exec=function(w,B,F){if(!this.db)throw"Database closed";var z=null,Z=null,oa=null;try{oa=Z=At(w);var hn=vi(4);for(w=[];cn(oa,"i8")!==0;){q(x),q(hn),this.handleError(ol(this.db,oa,-1,x,hn));var sn=cn(x,"i32");if(oa=cn(hn,"i32"),sn!==0){var $a=null;for(z=new l(sn,this),B!=null&&z.bind(B);z.step();)$a===null&&($a={columns:z.qb(),values:[]},w.push($a)),$a.values.push(z.get(null,F));z.Ya()}}return w}catch(yn){throw z&&z.Ya(),yn}finally{Z&&Ae(Z)}},y.prototype.Mb=function(w,B,F,z,Z){typeof B=="function"&&(z=F,F=B,B=void 0),w=this.tb(w,B);try{for(;w.step();)F(w.zb(null,Z))}finally{w.Ya()}if(typeof z=="function")return z()},y.prototype.tb=function(w,B){if(q(x),this.handleError(Pa(this.db,w,-1,x,0)),w=cn(x,"i32"),w===0)throw"Nothing to prepare";var F=new l(w,this);return B!=null&&F.bind(B),this.gb[w]=F},y.prototype.Ub=function(w){return new p(w,this)},y.prototype.Nb=function(){Object.values(this.gb).forEach(function(B){B.Ya()}),Object.values(this.Sa).forEach(Vn),this.Sa={},this.handleError(ta(this.db));var w=hd(this.filename);return this.handleError(W(this.filename,x)),this.db=cn(x,"i32"),ml(this.db),w},y.prototype.close=function(){this.db!==null&&(Object.values(this.gb).forEach(function(w){w.Ya()}),Object.values(this.Sa).forEach(Vn),this.Sa={},this.Za&&(Vn(this.Za),this.Za=void 0),this.handleError(ta(this.db)),zg("/"+this.filename),this.db=null)},y.prototype.handleError=function(w){if(w===0)return null;throw w=Pd(this.db),Error(w)},y.prototype.Rb=function(){return ma(this.db)},y.prototype.Kb=function(w,B){Object.prototype.hasOwnProperty.call(this.Sa,w)&&(Vn(this.Sa[w]),delete this.Sa[w]);var F=Ce(function(z,Z,oa){Z=r(Z,oa);try{var hn=B.apply(null,Z)}catch(sn){It(z,sn,-1);return}o(z,hn)},"viii");return this.Sa[w]=F,this.handleError(gl(this.db,w,B.length,1,0,F,0,0,0)),this},y.prototype.Jb=function(w,B){var F=B.init||function(){return null},z=B.finalize||function($a){return $a},Z=B.step;if(!Z)throw"An aggregate function must have a step function in "+w;var oa={};Object.hasOwnProperty.call(this.Sa,w)&&(Vn(this.Sa[w]),delete this.Sa[w]),B=w+"__finalize",Object.hasOwnProperty.call(this.Sa,B)&&(Vn(this.Sa[B]),delete this.Sa[B]);var hn=Ce(function($a,yn,ps){var Ci=pl($a,1);Object.hasOwnProperty.call(oa,Ci)||(oa[Ci]=F()),yn=r(yn,ps),yn=[oa[Ci]].concat(yn);try{oa[Ci]=Z.apply(null,yn)}catch($d){delete oa[Ci],It($a,$d,-1)}},"viii"),sn=Ce(function($a){var yn=pl($a,1);try{var ps=z(oa[yn])}catch(Ci){delete oa[yn],It($a,Ci,-1);return}o($a,ps),delete oa[yn]},"vi");return this.Sa[w]=hn,this.Sa[B]=sn,this.handleError(gl(this.db,w,Z.length-1,1,0,0,hn,sn,0)),this},y.prototype.Zb=function(w){return this.Za&&(ul(this.db,0,0),Vn(this.Za),this.Za=void 0),w?(this.Za=Ce(function(B,F,z,Z,oa){switch(F){case 18:B="insert";break;case 23:B="update";break;case 9:B="delete";break;default:throw"unknown operationCode in updateHook callback: "+F}if(z=J(z),Z=J(Z),oa>Number.MAX_SAFE_INTEGER)throw"rowId too big to fit inside a Number";w(B,z,Z,Number(oa))},"viiiij"),ul(this.db,this.Za,0),this):this},l.prototype.bind=l.prototype.bind,l.prototype.step=l.prototype.step,l.prototype.get=l.prototype.get,l.prototype.getColumnNames=l.prototype.qb,l.prototype.getAsObject=l.prototype.zb,l.prototype.getSQL=l.prototype.Sb,l.prototype.getNormalizedSQL=l.prototype.Pb,l.prototype.run=l.prototype.run,l.prototype.reset=l.prototype.reset,l.prototype.freemem=l.prototype.freemem,l.prototype.free=l.prototype.Ya,p.prototype.next=p.prototype.next,p.prototype.getRemainingSQL=p.prototype.Qb,y.prototype.run=y.prototype.run,y.prototype.exec=y.prototype.exec,y.prototype.each=y.prototype.Mb,y.prototype.prepare=y.prototype.tb,y.prototype.iterateStatements=y.prototype.Ub,y.prototype.export=y.prototype.Nb,y.prototype.close=y.prototype.close,y.prototype.handleError=y.prototype.handleError,y.prototype.getRowsModified=y.prototype.Rb,y.prototype.create_function=y.prototype.Kb,y.prototype.create_aggregate=y.prototype.Jb,y.prototype.updateHook=y.prototype.Zb,m.Database=y};var P="./this.program",T=(o,r)=>{throw r},A=(el=(il=globalThis.document)==null?void 0:il.currentScript)==null?void 0:el.src;typeof __filename<"u"?A=__filename:f&&(A=self.location.href);var L="",k,h;if(S){var b=xp;L=__dirname+"/",h=o=>(o=X(o)?new URL(o):o,b.readFileSync(o)),k=async o=>(o=X(o)?new URL(o):o,b.readFileSync(o,void 0)),1<process.argv.length&&(P=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),a.exports=m,T=(o,r)=>{throw process.exitCode=o,r}}else if(C||f){try{L=new URL(".",A).href}catch{}f&&(h=o=>{var r=new XMLHttpRequest;return r.open("GET",o,!1),r.responseType="arraybuffer",r.send(null),new Uint8Array(r.response)}),k=async o=>{if(X(o))return new Promise((l,p)=>{var y=new XMLHttpRequest;y.open("GET",o,!0),y.responseType="arraybuffer",y.onload=()=>{y.status==200||y.status==0&&y.response?l(y.response):p(y.status)},y.onerror=p,y.send(null)});var r=await fetch(o,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw Error(r.status+" : "+r.url)}}var v=console.log.bind(console),E=console.error.bind(console),O,_=!1,j,X=o=>o.startsWith("file://"),K,na,Q,aa,ea,yi,Va,Ca;function N(){var o=Bt.buffer;K=new Int8Array(o),Q=new Int16Array(o),na=new Uint8Array(o),aa=new Int32Array(o),ea=new Uint32Array(o),yi=new Float32Array(o),Va=new Float64Array(o),Ca=new BigInt64Array(o),new BigUint64Array(o)}function G(o){var r;throw(r=m.onAbort)==null||r.call(m,o),o="Aborted("+o+")",E(o),_=!0,new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info.")}var U;async function ga(o){if(!O)try{var r=await k(o);return new Uint8Array(r)}catch{}if(o==U&&O)o=new Uint8Array(O);else if(h)o=h(o);else throw"both async and sync fetching of the wasm failed";return o}async function ra(o,r){try{var l=await ga(o);return await WebAssembly.instantiate(l,r)}catch(p){E(`failed to asynchronously prepare wasm: ${p}`),G(p)}}async function dn(o){var r=U;if(!O&&!X(r)&&!S)try{var l=fetch(r,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(l,o)}catch(p){E(`wasm streaming compile failed: ${p}`),E("falling back to ArrayBuffer instantiation")}return ra(r,o)}class Ma{constructor(r){Qn(this,"name","ExitStatus");this.message=`Program terminated with exit(${r})`,this.status=r}}var qn=o=>{for(;0<o.length;)o.shift()(m)},nn=[],en=[],$o=()=>{var o=m.preRun.shift();en.push(o)},En=0,ki=null;function cn(o,r="i8"){switch(r.endsWith("*")&&(r="*"),r){case"i1":return K[o];case"i8":return K[o];case"i16":return Q[o>>1];case"i32":return aa[o>>2];case"i64":return Ca[o>>3];case"float":return yi[o>>2];case"double":return Va[o>>3];case"*":return ea[o>>2];default:G(`invalid type for getValue: ${r}`)}}var Fi=!0;function q(o){var r="i32";switch(r.endsWith("*")&&(r="*"),r){case"i1":K[o]=0;break;case"i8":K[o]=0;break;case"i16":Q[o>>1]=0;break;case"i32":aa[o>>2]=0;break;case"i64":Ca[o>>3]=BigInt(0);break;case"float":yi[o>>2]=0;break;case"double":Va[o>>3]=0;break;case"*":ea[o>>2]=0;break;default:G(`invalid type for setValue: ${r}`)}}var wa=new TextDecoder,tn=(o,r,l,p)=>{if(l=r+l,p)return l;for(;o[r]&&!(r>=l);)++r;return r},J=(o,r,l)=>o?wa.decode(na.subarray(o,tn(na,o,r,l))):"",Dn=(o,r)=>{for(var l=0,p=o.length-1;0<=p;p--){var y=o[p];y==="."?o.splice(p,1):y===".."?(o.splice(p,1),l++):l&&(o.splice(p,1),l--)}if(r)for(;l;l--)o.unshift("..");return o},we=o=>{var r=o.charAt(0)==="/",l=o.slice(-1)==="/";return(o=Dn(o.split("/").filter(p=>!!p),!r).join("/"))||r||(o="."),o&&l&&(o+="/"),(r?"/":"")+o},Se=o=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(o).slice(1);return o=r[0],r=r[1],!o&&!r?".":(r&&(r=r.slice(0,-1)),o+r)},bi=o=>o&&o.match(/([^\/]+|\/)\/*$/)[1],fi=()=>{if(S){var o=xp;return r=>o.randomFillSync(r)}return r=>crypto.getRandomValues(r)},yt=o=>{(yt=fi())(o)},od=(...o)=>{for(var r="",l=!1,p=o.length-1;-1<=p&&!l;p--){if(l=0<=p?o[p]:"/",typeof l!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!l)return"";r=l+"/"+r,l=l.charAt(0)==="/"}return r=Dn(r.split("/").filter(y=>!!y),!l).join("/"),(l?"/":"")+r||"."},kt=o=>{var r=tn(o,0);return wa.decode(o.buffer?o.subarray(0,r):new Uint8Array(o.slice(0,r)))},Qo=[],zi=o=>{for(var r=0,l=0;l<o.length;++l){var p=o.charCodeAt(l);127>=p?r++:2047>=p?r+=2:55296<=p&&57343>=p?(r+=4,++l):r+=3}return r},Cn=(o,r,l,p)=>{if(!(0<p))return 0;var y=l;p=l+p-1;for(var x=0;x<o.length;++x){var M=o.codePointAt(x);if(127>=M){if(l>=p)break;r[l++]=M}else if(2047>=M){if(l+1>=p)break;r[l++]=192|M>>6,r[l++]=128|M&63}else if(65535>=M){if(l+2>=p)break;r[l++]=224|M>>12,r[l++]=128|M>>6&63,r[l++]=128|M&63}else{if(l+3>=p)break;r[l++]=240|M>>18,r[l++]=128|M>>12&63,r[l++]=128|M>>6&63,r[l++]=128|M&63,x++}}return r[l]=0,l-y},Bg=[];function Ig(o,r){Bg[o]={input:[],output:[],eb:r},ns(o,sd)}var sd={open(o){var r=Bg[o.node.rdev];if(!r)throw new R(43);o.tty=r,o.seekable=!1},close(o){o.tty.eb.fsync(o.tty)},fsync(o){o.tty.eb.fsync(o.tty)},read(o,r,l,p){if(!o.tty||!o.tty.eb.Bb)throw new R(60);for(var y=0,x=0;x<p;x++){try{var M=o.tty.eb.Bb(o.tty)}catch{throw new R(29)}if(M===void 0&&y===0)throw new R(6);if(M==null)break;y++,r[l+x]=M}return y&&(o.node.atime=Date.now()),y},write(o,r,l,p){if(!o.tty||!o.tty.eb.ub)throw new R(60);try{for(var y=0;y<p;y++)o.tty.eb.ub(o.tty,r[l+y])}catch{throw new R(29)}return p&&(o.node.mtime=o.node.ctime=Date.now()),y}},rd={Bb(){var y;a:{if(!Qo.length){var o=null;if(S){var r=Buffer.alloc(256),l=0,p=process.stdin.fd;try{l=b.readSync(p,r,0,256)}catch(x){if(x.toString().includes("EOF"))l=0;else throw x}0<l&&(o=r.slice(0,l).toString("utf-8"))}else(y=globalThis.window)!=null&&y.prompt&&(o=window.prompt("Input: "),o!==null&&(o+=`
`));if(!o){o=null;break a}r=Array(zi(o)+1),o=Cn(o,r,0,r.length),r.length=o,Qo=r}o=Qo.shift()}return o},ub(o,r){r===null||r===10?(v(kt(o.output)),o.output=[]):r!=0&&o.output.push(r)},fsync(o){var r;0<((r=o.output)==null?void 0:r.length)&&(v(kt(o.output)),o.output=[])},hc(){return{bc:25856,dc:5,ac:191,cc:35387,$b:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ic(){return 0},jc(){return[24,80]}},gd={ub(o,r){r===null||r===10?(E(kt(o.output)),o.output=[]):r!=0&&o.output.push(r)},fsync(o){var r;0<((r=o.output)==null?void 0:r.length)&&(E(kt(o.output)),o.output=[])}},V={Wa:null,Xa(){return V.createNode(null,"/",16895,0)},createNode(o,r,l,p){if((l&61440)===24576||(l&61440)===4096)throw new R(63);return V.Wa||(V.Wa={dir:{node:{Ta:V.La.Ta,Ua:V.La.Ua,lookup:V.La.lookup,ib:V.La.ib,rename:V.La.rename,unlink:V.La.unlink,rmdir:V.La.rmdir,readdir:V.La.readdir,symlink:V.La.symlink},stream:{Va:V.Ma.Va}},file:{node:{Ta:V.La.Ta,Ua:V.La.Ua},stream:{Va:V.Ma.Va,read:V.Ma.read,write:V.Ma.write,jb:V.Ma.jb,kb:V.Ma.kb}},link:{node:{Ta:V.La.Ta,Ua:V.La.Ua,readlink:V.La.readlink},stream:{}},yb:{node:{Ta:V.La.Ta,Ua:V.La.Ua},stream:dd}}),l=Og(o,r,l,p),za(l.mode)?(l.La=V.Wa.dir.node,l.Ma=V.Wa.dir.stream,l.Na={}):(l.mode&61440)===32768?(l.La=V.Wa.file.node,l.Ma=V.Wa.file.stream,l.Ra=0,l.Na=null):(l.mode&61440)===40960?(l.La=V.Wa.link.node,l.Ma=V.Wa.link.stream):(l.mode&61440)===8192&&(l.La=V.Wa.yb.node,l.Ma=V.Wa.yb.stream),l.atime=l.mtime=l.ctime=Date.now(),o&&(o.Na[r]=l,o.atime=o.mtime=o.ctime=l.atime),l},fc(o){return o.Na?o.Na.subarray?o.Na.subarray(0,o.Ra):new Uint8Array(o.Na):new Uint8Array(0)},La:{Ta(o){var r={};return r.dev=(o.mode&61440)===8192?o.id:1,r.ino=o.id,r.mode=o.mode,r.nlink=1,r.uid=0,r.gid=0,r.rdev=o.rdev,za(o.mode)?r.size=4096:(o.mode&61440)===32768?r.size=o.Ra:(o.mode&61440)===40960?r.size=o.link.length:r.size=0,r.atime=new Date(o.atime),r.mtime=new Date(o.mtime),r.ctime=new Date(o.ctime),r.blksize=4096,r.blocks=Math.ceil(r.size/r.blksize),r},Ua(o,r){for(var l of["mode","atime","mtime","ctime"])r[l]!=null&&(o[l]=r[l]);r.size!==void 0&&(r=r.size,o.Ra!=r&&(r==0?(o.Na=null,o.Ra=0):(l=o.Na,o.Na=new Uint8Array(r),l&&o.Na.set(l.subarray(0,Math.min(r,o.Ra))),o.Ra=r)))},lookup(){throw V.nb||(V.nb=new R(44),V.nb.stack="<generic error, no stack>"),V.nb},ib(o,r,l,p){return V.createNode(o,r,l,p)},rename(o,r,l){try{var p=wi(r,l)}catch{}if(p){if(za(o.mode))for(var y in p.Na)throw new R(55);Xo(p)}delete o.parent.Na[o.name],r.Na[l]=o,o.name=l,r.ctime=r.mtime=o.parent.ctime=o.parent.mtime=Date.now()},unlink(o,r){delete o.Na[r],o.ctime=o.mtime=Date.now()},rmdir(o,r){var l=wi(o,r),p;for(p in l.Na)throw new R(55);delete o.Na[r],o.ctime=o.mtime=Date.now()},readdir(o){return[".","..",...Object.keys(o.Na)]},symlink(o,r,l){return o=V.createNode(o,r,41471,0),o.link=l,o},readlink(o){if((o.mode&61440)!==40960)throw new R(28);return o.link}},Ma:{read(o,r,l,p,y){var x=o.node.Na;if(y>=o.node.Ra)return 0;if(o=Math.min(o.node.Ra-y,p),8<o&&x.subarray)r.set(x.subarray(y,y+o),l);else for(p=0;p<o;p++)r[l+p]=x[y+p];return o},write(o,r,l,p,y,x){if(r.buffer===K.buffer&&(x=!1),!p)return 0;if(o=o.node,o.mtime=o.ctime=Date.now(),r.subarray&&(!o.Na||o.Na.subarray)){if(x)return o.Na=r.subarray(l,l+p),o.Ra=p;if(o.Ra===0&&y===0)return o.Na=r.slice(l,l+p),o.Ra=p;if(y+p<=o.Ra)return o.Na.set(r.subarray(l,l+p),y),p}x=y+p;var M=o.Na?o.Na.length:0;if(M>=x||(x=Math.max(x,M*(1048576>M?2:1.125)>>>0),M!=0&&(x=Math.max(x,256)),M=o.Na,o.Na=new Uint8Array(x),0<o.Ra&&o.Na.set(M.subarray(0,o.Ra),0)),o.Na.subarray&&r.subarray)o.Na.set(r.subarray(l,l+p),y);else for(x=0;x<p;x++)o.Na[y+x]=r[l+x];return o.Ra=Math.max(o.Ra,y+p),p},Va(o,r,l){if(l===1?r+=o.position:l===2&&(o.node.mode&61440)===32768&&(r+=o.node.Ra),0>r)throw new R(28);return r},jb(o,r,l,p,y){if((o.node.mode&61440)!==32768)throw new R(43);if(o=o.node.Na,y&2||!o||o.buffer!==K.buffer){y=!0,p=65536*Math.ceil(r/65536);var x=Yg(65536,p);if(x&&na.fill(0,x,x+p),p=x,!p)throw new R(48);o&&((0<l||l+r<o.length)&&(o.subarray?o=o.subarray(l,l+r):o=Array.prototype.slice.call(o,l,l+r)),K.set(o,p))}else y=!1,p=o.byteOffset;return{Xb:p,Eb:y}},kb(o,r,l,p){return V.Ma.write(o,r,0,p,l,!1),0}}},Eg=(o,r)=>{var l=0;return o&&(l|=365),r&&(l|=146),l},Zo=null,Dg={},Li=[],ld=1,Wn=null,Ng=!1,Rg=!0,R=class{constructor(o){Qn(this,"name","ErrnoError");this.Pa=o}},pd=class{constructor(){Qn(this,"hb",{});Qn(this,"node",null)}get flags(){return this.hb.flags}set flags(o){this.hb.flags=o}get position(){return this.hb.position}set position(o){this.hb.position=o}},md=class{constructor(o,r,l,p){Qn(this,"La",{});Qn(this,"Ma",{});Qn(this,"bb",null);o||(o=this),this.parent=o,this.Xa=o.Xa,this.id=ld++,this.name=r,this.mode=l,this.rdev=p,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&365)===365}set read(o){o?this.mode|=365:this.mode&=-366}get write(){return(this.mode&146)===146}set write(o){o?this.mode|=146:this.mode&=-147}};function on(o,r={}){if(!o)throw new R(44);r.pb??(r.pb=!0),o.charAt(0)==="/"||(o="//"+o);var l=0;a:for(;40>l;l++){o=o.split("/").filter(W=>!!W);for(var p=Zo,y="/",x=0;x<o.length;x++){var M=x===o.length-1;if(M&&r.parent)break;if(o[x]!==".")if(o[x]==="..")if(y=Se(y),p===p.parent){o=y+"/"+o.slice(x+1).join("/"),l--;continue a}else p=p.parent;else{y=we(y+"/"+o[x]);try{p=wi(p,o[x])}catch(W){if((W==null?void 0:W.Pa)===44&&M&&r.Wb)return{path:y};throw W}if(!p.bb||M&&!r.pb||(p=p.bb.root),(p.mode&61440)===40960&&(!M||r.ab)){if(!p.La.readlink)throw new R(52);p=p.La.readlink(p),p.charAt(0)==="/"||(p=Se(y)+"/"+p),o=p+"/"+o.slice(x+1).join("/");continue a}}}return{path:y,node:p}}throw new R(32)}function Yo(o){for(var r;;){if(o===o.parent)return o=o.Xa.Db,r?o[o.length-1]!=="/"?`${o}/${r}`:o+r:o;r=r?`${o.name}/${r}`:o.name,o=o.parent}}function Jo(o,r){for(var l=0,p=0;p<r.length;p++)l=(l<<5)-l+r.charCodeAt(p)|0;return(o+l>>>0)%Wn.length}function Xo(o){var r=Jo(o.parent.id,o.name);if(Wn[r]===o)Wn[r]=o.cb;else for(r=Wn[r];r;){if(r.cb===o){r.cb=o.cb;break}r=r.cb}}function wi(o,r){var l=za(o.mode)?(l=Gi(o,"x"))?l:o.La.lookup?0:2:54;if(l)throw new R(l);for(l=Wn[Jo(o.id,r)];l;l=l.cb){var p=l.name;if(l.parent.id===o.id&&p===r)return l}return o.La.lookup(o,r)}function Og(o,r,l,p){return o=new md(o,r,l,p),r=Jo(o.parent.id,o.name),o.cb=Wn[r],Wn[r]=o}function za(o){return(o&61440)===16384}function Gi(o,r){return Rg?0:r.includes("r")&&!(o.mode&292)||r.includes("w")&&!(o.mode&146)||r.includes("x")&&!(o.mode&73)?2:0}function _g(o,r){if(!za(o.mode))return 54;try{return wi(o,r),20}catch{}return Gi(o,"wx")}function jg(o,r,l){try{var p=wi(o,r)}catch(y){return y.Pa}if(o=Gi(o,"wx"))return o;if(l){if(!za(p.mode))return 54;if(p===p.parent||Yo(p)==="/")return 10}else if(za(p.mode))return 31;return 0}function bt(o){if(!o)throw new R(63);return o}function _a(o){if(o=Li[o],!o)throw new R(8);return o}function Hg(o,r=-1){if(o=Object.assign(new pd,o),r==-1)a:{for(r=0;4096>=r;r++)if(!Li[r])break a;throw new R(33)}return o.fd=r,Li[r]=o}function ud(o,r=-1){var l,p;return o=Hg(o,r),(p=(l=o.Ma)==null?void 0:l.ec)==null||p.call(l,o),o}function as(o,r,l){var p=o==null?void 0:o.Ma.Ua;o=p?o:r,p??(p=r.La.Ua),bt(p),p(o,l)}var dd={open(o){var r,l;o.Ma=Dg[o.node.rdev].Ma,(l=(r=o.Ma).open)==null||l.call(r,o)},Va(){throw new R(70)}};function ns(o,r){Dg[o]={Ma:r}}function Kg(o,r){var l=r==="/";if(l&&Zo)throw new R(10);if(!l&&r){var p=on(r,{pb:!1});if(r=p.path,p=p.node,p.bb)throw new R(10);if(!za(p.mode))throw new R(54)}r={type:o,kc:{},Db:r,Vb:[]},o=o.Xa(r),o.Xa=r,r.root=o,l?Zo=o:p&&(p.bb=r,p.Xa&&p.Xa.Vb.push(r))}function ft(o,r,l){var p=on(o,{parent:!0}).node;if(o=bi(o),!o)throw new R(28);if(o==="."||o==="..")throw new R(20);var y=_g(p,o);if(y)throw new R(y);if(!p.La.ib)throw new R(63);return p.La.ib(p,o,r,l)}function cd(o,r=438){return ft(o,r&4095|32768,0)}function An(o,r=511){return ft(o,r&1023|16384,0)}function wt(o,r,l){typeof l>"u"&&(l=r,r=438),ft(o,r|8192,l)}function is(o,r){if(!od(o))throw new R(44);var l=on(r,{parent:!0}).node;if(!l)throw new R(44);r=bi(r);var p=_g(l,r);if(p)throw new R(p);if(!l.La.symlink)throw new R(63);l.La.symlink(l,r,o)}function Fg(o){var r=on(o,{parent:!0}).node;o=bi(o);var l=wi(r,o),p=jg(r,o,!0);if(p)throw new R(p);if(!r.La.rmdir)throw new R(63);if(l.bb)throw new R(10);r.La.rmdir(r,o),Xo(l)}function zg(o){var r=on(o,{parent:!0}).node;if(!r)throw new R(44);o=bi(o);var l=wi(r,o),p=jg(r,o,!1);if(p)throw new R(p);if(!r.La.unlink)throw new R(63);if(l.bb)throw new R(10);r.La.unlink(r,o),Xo(l)}function xe(o,r){return o=on(o,{ab:!r}).node,bt(o.La.Ta)(o)}function Lg(o,r,l,p){as(o,r,{mode:l&4095|r.mode&-4096,ctime:Date.now(),Lb:p})}function St(o,r){o=typeof o=="string"?on(o,{ab:!0}).node:o,Lg(null,o,r)}function Gg(o,r,l){if(za(r.mode))throw new R(31);if((r.mode&61440)!==32768)throw new R(28);var p=Gi(r,"w");if(p)throw new R(p);as(o,r,{size:l,timestamp:Date.now()})}function qi(o,r,l=438){if(o==="")throw new R(44);if(typeof r=="string"){var p={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090}[r];if(typeof p>"u")throw Error(`Unknown file open mode: ${r}`);r=p}if(l=r&64?l&4095|32768:0,typeof o=="object")p=o;else{var y=o.endsWith("/"),x=on(o,{ab:!(r&131072),Wb:!0});p=x.node,o=x.path}if(x=!1,r&64)if(p){if(r&128)throw new R(20)}else{if(y)throw new R(31);p=ft(o,l|511,0),x=!0}if(!p)throw new R(44);if((p.mode&61440)===8192&&(r&=-513),r&65536&&!za(p.mode))throw new R(54);if(!x&&(p?(p.mode&61440)===40960?y=32:(y=["r","w","rw"][r&3],r&512&&(y+="w"),y=za(p.mode)&&(y!=="r"||r&576)?31:Gi(p,y)):y=44,y))throw new R(y);return r&512&&!x&&(y=p,y=typeof y=="string"?on(y,{ab:!0}).node:y,Gg(null,y,0)),r=Hg({node:p,path:Yo(p),flags:r&-131713,seekable:!0,position:0,Ma:p.Ma,Yb:[],error:!1}),r.Ma.open&&r.Ma.open(r),x&&St(p,l&511),r}function es(o){if(o.fd===null)throw new R(8);o.rb&&(o.rb=null);try{o.Ma.close&&o.Ma.close(o)}catch(r){throw r}finally{Li[o.fd]=null}o.fd=null}function qg(o,r,l){if(o.fd===null)throw new R(8);if(!o.seekable||!o.Ma.Va)throw new R(70);if(l!=0&&l!=1&&l!=2)throw new R(28);o.position=o.Ma.Va(o,r,l),o.Yb=[]}function Wg(o,r,l,p,y){if(0>p||0>y)throw new R(28);if(o.fd===null)throw new R(8);if((o.flags&2097155)===1)throw new R(8);if(za(o.node.mode))throw new R(31);if(!o.Ma.read)throw new R(28);var x=typeof y<"u";if(!x)y=o.position;else if(!o.seekable)throw new R(70);return r=o.Ma.read(o,r,l,p,y),x||(o.position+=r),r}function Ug(o,r,l,p,y){if(0>p||0>y)throw new R(28);if(o.fd===null)throw new R(8);if(!(o.flags&2097155))throw new R(8);if(za(o.node.mode))throw new R(31);if(!o.Ma.write)throw new R(28);o.seekable&&o.flags&1024&&qg(o,0,2);var x=typeof y<"u";if(!x)y=o.position;else if(!o.seekable)throw new R(70);return r=o.Ma.write(o,r,l,p,y,void 0),x||(o.position+=r),r}function hd(o){var r=r||0;r=qi(o,r),o=xe(o).size;var l=new Uint8Array(o);return Wg(r,l,0,o,0),es(r),l}function Un(o,r,l){o=we("/dev/"+o);var p=Eg(!!r,!!l);Un.Cb??(Un.Cb=64);var y=Un.Cb++<<8|0;ns(y,{open(x){x.seekable=!1},close(){var x;(x=l==null?void 0:l.buffer)!=null&&x.length&&l(10)},read(x,M,W,ta){for(var $=0,ma=0;ma<ta;ma++){try{var Pa=r()}catch{throw new R(29)}if(Pa===void 0&&$===0)throw new R(6);if(Pa==null)break;$++,M[W+ma]=Pa}return $&&(x.node.atime=Date.now()),$},write(x,M,W,ta){for(var $=0;$<ta;$++)try{l(M[W+$])}catch{throw new R(29)}return ta&&(x.node.mtime=x.node.ctime=Date.now()),$}}),wt(o,p,y)}var pa={};function Si(o,r,l){if(r.charAt(0)==="/")return r;if(o=o===-100?"/":_a(o).path,r.length==0){if(!l)throw new R(44);return o}return o+"/"+r}function xt(o,r){ea[o>>2]=r.dev,ea[o+4>>2]=r.mode,ea[o+8>>2]=r.nlink,ea[o+12>>2]=r.uid,ea[o+16>>2]=r.gid,ea[o+20>>2]=r.rdev,Ca[o+24>>3]=BigInt(r.size),aa[o+32>>2]=4096,aa[o+36>>2]=r.blocks;var l=r.atime.getTime(),p=r.mtime.getTime(),y=r.ctime.getTime();return Ca[o+40>>3]=BigInt(Math.floor(l/1e3)),ea[o+48>>2]=l%1e3*1e6,Ca[o+56>>3]=BigInt(Math.floor(p/1e3)),ea[o+64>>2]=p%1e3*1e6,Ca[o+72>>3]=BigInt(Math.floor(y/1e3)),ea[o+80>>2]=y%1e3*1e6,Ca[o+88>>3]=BigInt(r.ino),0}var vt=void 0,Ct=()=>{var o=aa[+vt>>2];return vt+=4,o},ts=0,yd=[0,31,60,91,121,152,182,213,244,274,305,335],kd=[0,31,59,90,120,151,181,212,243,273,304,334],ve={},Vg=o=>{var r;j=o,Fi||0<ts||((r=m.onExit)==null||r.call(m,o),_=!0),T(o,new Ma(o))},bd=o=>{if(!_)try{o()}catch(r){r instanceof Ma||r=="unwind"||T(1,r)}finally{if(!(Fi||0<ts))try{j=o=j,Vg(o)}catch(r){r instanceof Ma||r=="unwind"||T(1,r)}}},os={},$g=()=>{var p;if(!ss){var o={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((p=globalThis.navigator)==null?void 0:p.language)??"C").replace("-","_")+".UTF-8",_:P||"./this.program"},r;for(r in os)os[r]===void 0?delete o[r]:o[r]=os[r];var l=[];for(r in o)l.push(`${r}=${o[r]}`);ss=l}return ss},ss,fd=(o,r,l,p)=>{var y={string:$=>{var ma=0;if($!=null&&$!==0){ma=zi($)+1;var Pa=vi(ma);Cn($,na,Pa,ma),ma=Pa}return ma},array:$=>{var ma=vi($.length);return K.set($,ma),ma}};o=m["_"+o];var x=[],M=0;if(p)for(var W=0;W<p.length;W++){var ta=y[l[W]];ta?(M===0&&(M=Pt()),x[W]=ta(p[W])):x[W]=p[W]}return l=o(...x),l=function($){return M!==0&&Mt(M),r==="string"?J($):r==="boolean"?!!$:$}(l)},At=o=>{var r=zi(o)+1,l=Tt(r);return l&&Cn(o,na,l,r),l},xi,rs=[],Vn=o=>{xi.delete($n.get(o)),$n.set(o,null),rs.push(o)},Qg=o=>{const r=o.length;return[r%128|128,r>>7,...o]},wd={i:127,p:127,j:126,f:125,d:124,e:111},Zg=o=>Qg(Array.from(o,r=>wd[r])),Ce=(o,r)=>{if(!xi){xi=new WeakMap;var l=$n.length;if(xi)for(var p=0;p<0+l;p++){var y=$n.get(p);y&&xi.set(y,p)}}if(l=xi.get(o)||0)return l;l=rs.length?rs.pop():$n.grow(1);try{$n.set(l,o)}catch(x){if(!(x instanceof TypeError))throw x;r=Uint8Array.of(0,97,115,109,1,0,0,0,1,...Qg([1,96,...Zg(r.slice(1)),...Zg(r[0]==="v"?"":r[0])]),2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0),r=new WebAssembly.Module(r),r=new WebAssembly.Instance(r,{e:{f:o}}).exports.f,$n.set(l,r)}return xi.set(o,l),l};if(Wn=Array(4096),Kg(V,"/"),An("/tmp"),An("/home"),An("/home/web_user"),function(){An("/dev"),ns(259,{read:()=>0,write:(p,y,x,M)=>M,Va:()=>0}),wt("/dev/null",259),Ig(1280,rd),Ig(1536,gd),wt("/dev/tty",1280),wt("/dev/tty1",1536);var o=new Uint8Array(1024),r=0,l=()=>(r===0&&(yt(o),r=o.byteLength),o[--r]);Un("random",l),Un("urandom",l),An("/dev/shm"),An("/dev/shm/tmp")}(),function(){An("/proc");var o=An("/proc/self");An("/proc/self/fd"),Kg({Xa(){var r=Og(o,"fd",16895,73);return r.Ma={Va:V.Ma.Va},r.La={lookup(l,p){l=+p;var y=_a(l);return l={parent:null,Xa:{Db:"fake"},La:{readlink:()=>y.path},id:l+1},l.parent=l},readdir(){return Array.from(Li.entries()).filter(([,l])=>l).map(([l])=>l.toString())}},r}},"/proc/self/fd")}(),m.noExitRuntime&&(Fi=m.noExitRuntime),m.print&&(v=m.print),m.printErr&&(E=m.printErr),m.wasmBinary&&(O=m.wasmBinary),m.thisProgram&&(P=m.thisProgram),m.preInit)for(typeof m.preInit=="function"&&(m.preInit=[m.preInit]);0<m.preInit.length;)m.preInit.shift()();m.stackSave=()=>Pt(),m.stackRestore=o=>Mt(o),m.stackAlloc=o=>vi(o),m.cwrap=(o,r,l,p)=>{var y=!l||l.every(x=>x==="number"||x==="boolean");return r!=="string"&&y&&!p?m["_"+o]:(...x)=>fd(o,r,l,x)},m.addFunction=Ce,m.removeFunction=Vn,m.UTF8ToString=J,m.stringToNewUTF8=At,m.writeArrayToMemory=(o,r)=>{K.set(o,r)};var Tt,Ae,Yg,Jg,Mt,vi,Pt,Bt,$n,Sd={a:(o,r,l,p)=>G(`Assertion failed: ${J(o)}, at: `+[r?J(r):"unknown filename",l,p?J(p):"unknown function"]),i:function(o,r){try{return o=J(o),St(o,r),0}catch(l){if(typeof pa>"u"||l.name!=="ErrnoError")throw l;return-l.Pa}},L:function(o,r,l){try{if(r=J(r),r=Si(o,r),l&-8)return-28;var p=on(r,{ab:!0}).node;return p?(o="",l&4&&(o+="r"),l&2&&(o+="w"),l&1&&(o+="x"),o&&Gi(p,o)?-2:0):-44}catch(y){if(typeof pa>"u"||y.name!=="ErrnoError")throw y;return-y.Pa}},j:function(o,r){try{var l=_a(o);return Lg(l,l.node,r,!1),0}catch(p){if(typeof pa>"u"||p.name!=="ErrnoError")throw p;return-p.Pa}},h:function(o){try{var r=_a(o);return as(r,r.node,{timestamp:Date.now(),Lb:!1}),0}catch(l){if(typeof pa>"u"||l.name!=="ErrnoError")throw l;return-l.Pa}},b:function(o,r,l){vt=l;try{var p=_a(o);switch(r){case 0:var y=Ct();if(0>y)break;for(;Li[y];)y++;return ud(p,y).fd;case 1:case 2:return 0;case 3:return p.flags;case 4:return y=Ct(),p.flags|=y,0;case 12:return y=Ct(),Q[y+0>>1]=2,0;case 13:case 14:return 0}return-28}catch(x){if(typeof pa>"u"||x.name!=="ErrnoError")throw x;return-x.Pa}},g:function(o,r){try{var l=_a(o),p=l.node,y=l.Ma.Ta;o=y?l:p,y??(y=p.La.Ta),bt(y);var x=y(o);return xt(r,x)}catch(M){if(typeof pa>"u"||M.name!=="ErrnoError")throw M;return-M.Pa}},H:function(o,r){r=-9007199254740992>r||9007199254740992<r?NaN:Number(r);try{if(isNaN(r))return-61;var l=_a(o);if(0>r||!(l.flags&2097155))throw new R(28);return Gg(l,l.node,r),0}catch(p){if(typeof pa>"u"||p.name!=="ErrnoError")throw p;return-p.Pa}},G:function(o,r){try{if(r===0)return-28;var l=zi("/")+1;return r<l?-68:(Cn("/",na,o,r),l)}catch(p){if(typeof pa>"u"||p.name!=="ErrnoError")throw p;return-p.Pa}},K:function(o,r){try{return o=J(o),xt(r,xe(o,!0))}catch(l){if(typeof pa>"u"||l.name!=="ErrnoError")throw l;return-l.Pa}},C:function(o,r,l){try{return r=J(r),r=Si(o,r),An(r,l),0}catch(p){if(typeof pa>"u"||p.name!=="ErrnoError")throw p;return-p.Pa}},J:function(o,r,l,p){try{r=J(r);var y=p&256;return r=Si(o,r,p&4096),xt(l,y?xe(r,!0):xe(r))}catch(x){if(typeof pa>"u"||x.name!=="ErrnoError")throw x;return-x.Pa}},x:function(o,r,l,p){vt=p;try{r=J(r),r=Si(o,r);var y=p?Ct():0;return qi(r,l,y).fd}catch(x){if(typeof pa>"u"||x.name!=="ErrnoError")throw x;return-x.Pa}},v:function(o,r,l,p){try{if(r=J(r),r=Si(o,r),0>=p)return-28;var y=on(r).node;if(!y)throw new R(44);if(!y.La.readlink)throw new R(28);var x=y.La.readlink(y),M=Math.min(p,zi(x)),W=K[l+M];return Cn(x,na,l,p+1),K[l+M]=W,M}catch(ta){if(typeof pa>"u"||ta.name!=="ErrnoError")throw ta;return-ta.Pa}},u:function(o){try{return o=J(o),Fg(o),0}catch(r){if(typeof pa>"u"||r.name!=="ErrnoError")throw r;return-r.Pa}},f:function(o,r){try{return o=J(o),xt(r,xe(o))}catch(l){if(typeof pa>"u"||l.name!=="ErrnoError")throw l;return-l.Pa}},r:function(o,r,l){try{if(r=J(r),r=Si(o,r),l)if(l===512)Fg(r);else return-28;else zg(r);return 0}catch(p){if(typeof pa>"u"||p.name!=="ErrnoError")throw p;return-p.Pa}},q:function(o,r,l){try{r=J(r),r=Si(o,r,!0);var p=Date.now(),y,x;if(l){var M=ea[l>>2]+4294967296*aa[l+4>>2],W=aa[l+8>>2];W==1073741823?y=p:W==1073741822?y=null:y=1e3*M+W/1e6,l+=16,M=ea[l>>2]+4294967296*aa[l+4>>2],W=aa[l+8>>2],W==1073741823?x=p:W==1073741822?x=null:x=1e3*M+W/1e6}else x=y=p;if((x??y)!==null){o=y;var ta=on(r,{ab:!0}).node;bt(ta.La.Ua)(ta,{atime:o,mtime:x})}return 0}catch($){if(typeof pa>"u"||$.name!=="ErrnoError")throw $;return-$.Pa}},m:()=>G(""),l:()=>{Fi=!1,ts=0},A:function(o,r){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),o=new Date(1e3*o),aa[r>>2]=o.getSeconds(),aa[r+4>>2]=o.getMinutes(),aa[r+8>>2]=o.getHours(),aa[r+12>>2]=o.getDate(),aa[r+16>>2]=o.getMonth(),aa[r+20>>2]=o.getFullYear()-1900,aa[r+24>>2]=o.getDay();var l=o.getFullYear();aa[r+28>>2]=(l%4!==0||l%100===0&&l%400!==0?kd:yd)[o.getMonth()]+o.getDate()-1|0,aa[r+36>>2]=-(60*o.getTimezoneOffset()),l=new Date(o.getFullYear(),6,1).getTimezoneOffset();var p=new Date(o.getFullYear(),0,1).getTimezoneOffset();aa[r+32>>2]=(l!=p&&o.getTimezoneOffset()==Math.min(p,l))|0},y:function(o,r,l,p,y,x,M){y=-9007199254740992>y||9007199254740992<y?NaN:Number(y);try{var W=_a(p);if(r&2&&!(l&2)&&(W.flags&2097155)!==2)throw new R(2);if((W.flags&2097155)===1)throw new R(2);if(!W.Ma.jb)throw new R(43);if(!o)throw new R(28);var ta=W.Ma.jb(W,o,y,r,l),$=ta.Xb;return aa[x>>2]=ta.Eb,ea[M>>2]=$,0}catch(ma){if(typeof pa>"u"||ma.name!=="ErrnoError")throw ma;return-ma.Pa}},z:function(o,r,l,p,y,x){x=-9007199254740992>x||9007199254740992<x?NaN:Number(x);try{var M=_a(y);if(l&2){if(l=x,(M.node.mode&61440)!==32768)throw new R(43);if(!(p&2)){var W=na.slice(o,o+r);M.Ma.kb&&M.Ma.kb(M,W,l,r,p)}}}catch(ta){if(typeof pa>"u"||ta.name!=="ErrnoError")throw ta;return-ta.Pa}},n:(o,r)=>{if(ve[o]&&(clearTimeout(ve[o].id),delete ve[o]),!r)return 0;var l=setTimeout(()=>{delete ve[o],bd(()=>Jg(o,performance.now()))},r);return ve[o]={id:l,lc:r},0},B:(o,r,l,p)=>{var y=new Date().getFullYear(),x=new Date(y,0,1).getTimezoneOffset();y=new Date(y,6,1).getTimezoneOffset(),ea[o>>2]=60*Math.max(x,y),aa[r>>2]=+(x!=y),r=M=>{var W=Math.abs(M);return`UTC${0<=M?"-":"+"}${String(Math.floor(W/60)).padStart(2,"0")}${String(W%60).padStart(2,"0")}`},o=r(x),r=r(y),y<x?(Cn(o,na,l,17),Cn(r,na,p,17)):(Cn(o,na,p,17),Cn(r,na,l,17))},d:()=>Date.now(),s:()=>2147483648,c:()=>performance.now(),o:o=>{var r=na.length;if(o>>>=0,2147483648<o)return!1;for(var l=1;4>=l;l*=2){var p=r*(1+.2/l);p=Math.min(p,o+100663296);a:{p=(Math.min(2147483648,65536*Math.ceil(Math.max(o,p)/65536))-Bt.buffer.byteLength+65535)/65536|0;try{Bt.grow(p),N();var y=1;break a}catch{}y=void 0}if(y)return!0}return!1},E:(o,r)=>{var l=0,p=0,y;for(y of $g()){var x=r+l;ea[o+p>>2]=x,l+=Cn(y,na,x,1/0)+1,p+=4}return 0},F:(o,r)=>{var l=$g();ea[o>>2]=l.length,o=0;for(var p of l)o+=zi(p)+1;return ea[r>>2]=o,0},e:function(o){try{var r=_a(o);return es(r),0}catch(l){if(typeof pa>"u"||l.name!=="ErrnoError")throw l;return l.Pa}},p:function(o,r){try{var l=_a(o);return K[r]=l.tty?2:za(l.mode)?3:(l.mode&61440)===40960?7:4,Q[r+2>>1]=0,Ca[r+8>>3]=BigInt(0),Ca[r+16>>3]=BigInt(0),0}catch(p){if(typeof pa>"u"||p.name!=="ErrnoError")throw p;return p.Pa}},w:function(o,r,l,p){try{a:{var y=_a(o);o=r;for(var x,M=r=0;M<l;M++){var W=ea[o>>2],ta=ea[o+4>>2];o+=8;var $=Wg(y,K,W,ta,x);if(0>$){var ma=-1;break a}if(r+=$,$<ta)break;typeof x<"u"&&(x+=$)}ma=r}return ea[p>>2]=ma,0}catch(Pa){if(typeof pa>"u"||Pa.name!=="ErrnoError")throw Pa;return Pa.Pa}},D:function(o,r,l,p){r=-9007199254740992>r||9007199254740992<r?NaN:Number(r);try{if(isNaN(r))return 61;var y=_a(o);return qg(y,r,l),Ca[p>>3]=BigInt(y.position),y.rb&&r===0&&l===0&&(y.rb=null),0}catch(x){if(typeof pa>"u"||x.name!=="ErrnoError")throw x;return x.Pa}},I:function(o){var l,p;try{var r=_a(o);return(p=(l=r.Ma)==null?void 0:l.fsync)==null?void 0:p.call(l,r)}catch(y){if(typeof pa>"u"||y.name!=="ErrnoError")throw y;return y.Pa}},t:function(o,r,l,p){try{a:{var y=_a(o);o=r;for(var x,M=r=0;M<l;M++){var W=ea[o>>2],ta=ea[o+4>>2];o+=8;var $=Ug(y,K,W,ta,x);if(0>$){var ma=-1;break a}if(r+=$,$<ta)break;typeof x<"u"&&(x+=$)}ma=r}return ea[p>>2]=ma,0}catch(Pa){if(typeof pa>"u"||Pa.name!=="ErrnoError")throw Pa;return Pa.Pa}},k:Vg};function gs(){function o(){var y;if(m.calledRun=!0,!_){if(!m.noFSInit&&!Ng){var r,l;Ng=!0,r??(r=m.stdin),l??(l=m.stdout),p??(p=m.stderr),r?Un("stdin",r):is("/dev/tty","/dev/stdin"),l?Un("stdout",null,l):is("/dev/tty","/dev/stdout"),p?Un("stderr",null,p):is("/dev/tty1","/dev/stderr"),qi("/dev/stdin",0),qi("/dev/stdout",1),qi("/dev/stderr",1)}if(ls.N(),Rg=!1,(y=m.onRuntimeInitialized)==null||y.call(m),m.postRun)for(typeof m.postRun=="function"&&(m.postRun=[m.postRun]);m.postRun.length;){var p=m.postRun.shift();nn.push(p)}qn(nn)}}if(0<En)ki=gs;else{if(m.preRun)for(typeof m.preRun=="function"&&(m.preRun=[m.preRun]);m.preRun.length;)$o();qn(en),0<En?ki=gs:m.setStatus?(m.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>m.setStatus(""),1),o()},1)):o()}}var ls;return async function(){var l;function o(p){var y;return p=ls=p.exports,m._sqlite3_free=p.P,m._sqlite3_value_text=p.Q,m._sqlite3_prepare_v2=p.R,m._sqlite3_step=p.S,m._sqlite3_reset=p.T,m._sqlite3_exec=p.U,m._sqlite3_finalize=p.V,m._sqlite3_column_name=p.W,m._sqlite3_column_text=p.X,m._sqlite3_column_type=p.Y,m._sqlite3_errmsg=p.Z,m._sqlite3_clear_bindings=p._,m._sqlite3_value_blob=p.$,m._sqlite3_value_bytes=p.aa,m._sqlite3_value_double=p.ba,m._sqlite3_value_int=p.ca,m._sqlite3_value_type=p.da,m._sqlite3_result_blob=p.ea,m._sqlite3_result_double=p.fa,m._sqlite3_result_error=p.ga,m._sqlite3_result_int=p.ha,m._sqlite3_result_int64=p.ia,m._sqlite3_result_null=p.ja,m._sqlite3_result_text=p.ka,m._sqlite3_aggregate_context=p.la,m._sqlite3_column_count=p.ma,m._sqlite3_data_count=p.na,m._sqlite3_column_blob=p.oa,m._sqlite3_column_bytes=p.pa,m._sqlite3_column_double=p.qa,m._sqlite3_bind_blob=p.ra,m._sqlite3_bind_double=p.sa,m._sqlite3_bind_int=p.ta,m._sqlite3_bind_text=p.ua,m._sqlite3_bind_parameter_index=p.va,m._sqlite3_sql=p.wa,m._sqlite3_normalized_sql=p.xa,m._sqlite3_changes=p.ya,m._sqlite3_close_v2=p.za,m._sqlite3_create_function_v2=p.Aa,m._sqlite3_update_hook=p.Ba,m._sqlite3_open=p.Ca,Tt=m._malloc=p.Da,Ae=m._free=p.Ea,m._RegisterExtensionFunctions=p.Fa,Yg=p.Ga,Jg=p.Ha,Mt=p.Ia,vi=p.Ja,Pt=p.Ka,Bt=p.M,$n=p.O,N(),En--,(y=m.monitorRunDependencies)==null||y.call(m,En),En==0&&ki&&(p=ki,ki=null,p()),ls}En++,(l=m.monitorRunDependencies)==null||l.call(m,En);var r={a:Sd};return m.instantiateWasm?new Promise(p=>{m.instantiateWasm(r,(y,x)=>{p(o(y))})}):(U??(U=m.locateFile?m.locateFile("sql-wasm.wasm",L):L+"sql-wasm.wasm"),o((await dn(r)).instance))}(),gs(),u}),i)};a.exports=e,a.exports.default=e})(Vu);var Ty=Vu.exports;const My=Np(Ty),Py=""+new URL("sql-wasm-UFUCzYNW.wasm",import.meta.url).href;let js=null;async function By(){const a=await My({locateFile:()=>Py}),i=await fetch("./customs_law.db");if(!i.ok)throw new Error(`Could not load customs_law.db (HTTP ${i.status})`);const e=await i.arrayBuffer();return new a.Database(new Uint8Array(e))}function Iy(){return js||(js=By()),js}async function jn(a,n=[]){const e=(await Iy()).prepare(a);e.bind(n);const t=[];for(;e.step();)t.push(e.getAsObject());return e.free(),t}async function vp(a,n=[]){const i=await jn(a,n);return i.length?i[0]:null}function Cp(a){if(!a)return 0;a=String(a).toUpperCase().trim();const n={I:1,V:5,X:10,L:50,C:100,D:500,M:1e3};let i=0,e=0;for(let t=a.length-1;t>=0;t--){const s=n[a[t]]||0;i+=s<e?-s:s,e=s}return i}async function Ey(){const a=await jn(`
    SELECT 
      t.id AS title_id,
      t.node_number AS title_number,
      t.title AS title_title,
      c.id AS chapter_id,
      c.node_number AS chapter_number,
      c.title AS chapter_title,
      (SELECT COUNT(*) FROM legal_nodes s WHERE s.parent_id = c.id AND s.node_type = 'section') AS section_count
    FROM legal_nodes t
    LEFT JOIN legal_nodes c ON c.parent_id = t.id AND c.node_type = 'chapter'
    WHERE t.node_type = 'title'
    ORDER BY CAST(c.node_number AS INTEGER) ASC
  `),n=new Map;for(const t of a)n.has(t.title_id)||n.set(t.title_id,{title_id:t.title_id,title_number:t.title_number,title_title:t.title_title,chapters:[]}),t.chapter_id&&n.get(t.title_id).chapters.push({id:t.chapter_id,node_number:t.chapter_number,title:t.chapter_title,section_count:t.section_count});const i=await jn(`
    SELECT 
      c.id AS chapter_id,
      c.node_number AS chapter_number,
      c.title AS chapter_title,
      (SELECT COUNT(*) FROM legal_nodes s WHERE s.parent_id = c.id AND s.node_type = 'section') AS section_count
    FROM legal_nodes c
    WHERE c.node_type = 'chapter' AND c.parent_id IS NULL
    ORDER BY CAST(c.node_number AS INTEGER) ASC
  `),e=Array.from(n.values()).sort((t,s)=>Cp(t.title_number)-Cp(s.title_number));return i.length&&e.push({title_id:null,title_number:null,title_title:"Chapters (no title)",chapters:i.map(t=>({id:t.chapter_id,node_number:t.chapter_number,title:t.chapter_title,section_count:t.section_count}))}),e}async function Dy(a,n=null){let i="node_type = 'chapter' AND node_number = ?",e=[a];if(n){const f=await vp("SELECT id FROM legal_nodes WHERE node_type = 'title' AND node_number = ?",[n]);if(!f)return null;i+=" AND parent_id = ?",e.push(f.id)}else i+=" AND parent_id IS NULL";const t=await vp(`SELECT * FROM legal_nodes WHERE ${i}`,e);if(!t)return null;const g=await jn(`
    WITH RECURSIVE subtree(id, parent_id, node_type, node_number, title, content, status, version, depth, sort_order) AS (
      SELECT id, parent_id, node_type, node_number, title, content, status, version, depth, sort_order
      FROM legal_nodes WHERE id = ?
      UNION ALL
      SELECT n.id, n.parent_id, n.node_type, n.node_number, n.title, n.content, n.status, n.version, n.depth, n.sort_order
      FROM legal_nodes n JOIN subtree s ON n.parent_id = s.id
    )
    SELECT * FROM subtree ORDER BY depth, sort_order
  `,[t.id]),u={},d={...t,children:[]};u[t.id]=d;for(const f of g){if(f.id===t.id)continue;const S=u[f.parent_id];if(!S)continue;const P={...f,children:[]};S.children.push(P),u[f.id]=P}const m=Object.keys(u);if(m.length){const f=await jn(`SELECT node_id, keyword FROM node_keywords WHERE node_id IN (${m.join(",")})`);for(const T of f){const A=u[T.node_id];A&&(A.keywords||(A.keywords=[]),A.keywords.push(T.keyword))}const S=await jn(`SELECT node_id, reference_text, url, display_text FROM node_cross_references WHERE node_id IN (${m.join(",")})`);for(const T of S){const A=u[T.node_id];A&&(A.cross_references||(A.cross_references=[]),A.cross_references.push({text:T.display_text||T.reference_text,url:T.url}))}const P=await jn(`SELECT node_id, note_text FROM node_notes WHERE node_id IN (${m.join(",")})`);for(const T of P){const A=u[T.node_id];A&&(A.notes||(A.notes=[]),A.notes.push(T.note_text))}}function C(f){return{id:f.id,uuid:f.uuid||"",node_type:f.node_type,node_number:f.node_number,title:f.title,content:f.content,status:f.status,version:f.version,keywords:f.keywords||[],cross_references:f.cross_references||[],notes:f.notes||[],children:(f.children||[]).map(S=>C(S))}}return C(d)}async function Ny(a,n="all",i=50){const e=a.trim().split(/\s+/).filter(u=>u.length>0);if(!e.length)return[];const t=e.map(u=>`"${u}"`).join(" ");let s=`
    SELECT s.node_id, n.node_type, n.node_number, n.title, n.content,
           snippet(search_index, 4, '[', ']', '...', 20) AS excerpt,
           t_parent.node_number AS title_number, t_parent.title AS title_title,
           ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
           0 AS exact_match
    FROM search_index s
    JOIN legal_nodes n ON n.id = s.node_id
    LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
    LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
    WHERE search_index MATCH ?
  `;const g=[t];n!=="all"&&(s+=" AND n.node_type = ?",g.push(n)),s+=" ORDER BY bm25(search_index, 12.0, 6.0, 1.0, 4.0) LIMIT ?",g.push(i);try{return await jn(s,g)}catch{let d=`
      SELECT n.id AS node_id, n.node_type, n.node_number, n.title, n.content,
             substr(n.content, 1, 200) AS excerpt,
             t_parent.node_number AS title_number, t_parent.title AS title_title,
             ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
             0 AS exact_match
      FROM legal_nodes n
      LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
      LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
      WHERE ${e.map(()=>"(n.node_number LIKE ? OR n.title LIKE ? OR n.content LIKE ? OR n.node_type LIKE ?)").join(" AND ")}
    `;const m=[];for(const C of e){const f=`%${C}%`;m.push(f,f,f,f)}return n!=="all"&&(d+=" AND n.node_type = ?",m.push(n)),d+=" ORDER BY n.node_type, CAST(n.node_number AS INTEGER) LIMIT ?",m.push(i),await jn(d,m)}}const pt="customsLaw_highlights";function Ry(a){try{return JSON.parse(localStorage.getItem(pt)||"{}")[a]||[]}catch{return[]}}function Oy(a,n,i,e="#90EE90"){const t=JSON.parse(localStorage.getItem(pt)||"{}");t[a]||(t[a]=[]);const s={id:Date.now()+Math.random()*1e3,node_id:a,start_offset:n,end_offset:i,color:e,created_at:new Date().toISOString()};return t[a].push(s),localStorage.setItem(pt,JSON.stringify(t)),s}function _y(a){const n=JSON.parse(localStorage.getItem(pt)||"{}");for(const i in n)n[i]=n[i].filter(e=>e.id!==a),n[i].length===0&&delete n[i];localStorage.setItem(pt,JSON.stringify(n))}const ji="customsLaw_notes";function jy(a){try{return JSON.parse(localStorage.getItem(ji)||"{}")[a]||[]}catch{return[]}}function Hy(a,n){const i=JSON.parse(localStorage.getItem(ji)||"{}");i[a]||(i[a]=[]);const e=new Date().toISOString(),t={id:Date.now()+Math.random()*1e3,node_id:a,content:n,created_at:e,updated_at:e};return i[a].push(t),localStorage.setItem(ji,JSON.stringify(i)),t}function Ky(a,n,i){const e=JSON.parse(localStorage.getItem(ji)||"{}"),s=(e[a]||[]).find(g=>g.id===n);return s&&(s.content=i,s.updated_at=new Date().toISOString(),localStorage.setItem(ji,JSON.stringify(e))),s||null}function Fy(a,n){const i=JSON.parse(localStorage.getItem(ji)||"{}");i[a]&&(i[a]=i[a].filter(e=>e.id!==n),i[a].length===0&&delete i[a],localStorage.setItem(ji,JSON.stringify(i)))}const Dr="customsLaw_lastPosition";function zy(a){try{const i={...JSON.parse(localStorage.getItem(Dr)||"{}"),...a,saved_at:new Date().toISOString()};localStorage.setItem(Dr,JSON.stringify(i))}catch{}}function Ly(){try{return JSON.parse(localStorage.getItem(Dr)||"null")}catch{return null}}const $u="customsLaw_tutorialSeen";function Gy(){try{return localStorage.getItem($u)==="true"}catch{return!0}}function qy(){try{localStorage.setItem($u,"true")}catch{}}const Wy={193:{_label:"section 101 — Declaration of Policy",title:"Ano ang Pangunahing Layunin ng CMTA? (Section 101)",content:`📖 Kahulugan

Ang Section 101 ay may dalawang antas. Una, ang opening sentence na naglalahad ng 4 na pangkalahatang layunin ng Estado. Pangalawa, ang pariralang "Towards this end, the State shall:" na sinusundan ng 7 specific na mandato (a–g) kung paano isasakatuparan ang mga layuning iyon. Ito ang "puso" ng CMTA dahil dito nakabatay ang halos lahat ng ginagawang patakaran ng BOC.

🔍 Breakdown

*   **4 pangkalahatang layunin (opening sentence):**
    *   Protektahan at pahusayin ang revenue ng gobyerno
    *   Pabilisin ang international trade (trade facilitation)
    *   Pigilan at supilin ang customs fraud
    *   I-modernize ang customs at tariff administration
*   **7 specific na mandato (a–g)** — tingnan ang hiwalay na entries para sa detalye ng bawat isa: (a) continuous system enhancement/harmonization, (b) clear at transparent rules na aligned sa international standards, (c) transparency/accessibility para sa informed compliance, (d) consultation sa gov't agencies at private sector, (e) fair at expeditious appeal, (f) ICT at modern practices, (g) professionalism at meritocracy.

💡 Simpleng Paliwanag

Isipin mo ang 4 layunin bilang ang "bakit" (destination), at ang 7 mandato (a–g) bilang ang "paano" (roadmap) — mas specific at actionable na mga hakbang para maabot ang 4 layunin.

📦 Halimbawa

Para pabilisin ang kalakalan (layunin) at maging moderno (layunin), gumagamit ang BOC ng online portal kung saan pwede nang mag-lodge ng goods declaration ang isang Customs Broker nang hindi na pumupunta physically sa port. Ito ay direktang pagsasakatuparan ng paragraph (f) — ang mandato na gumamit ng ICT.

⭐ Bakit Mahalaga Ito?

Bawat proseso o CMO na ginagawa ng BOC ay dapat traceable pabalik sa isa sa 7 mandato ng Section 101. Kapag may bagong patakaran, dapat laging sumasagot ito sa tanong: aling sa 4 layunin o 7 mandato nito ang tinutugunan?

⚠️ Dapat Tandaan

*   Ang revenue generation at trade facilitation ay dapat laging balanse.
*   Hindi "4 mandates" lang ang dapat kabisaduhin — may 7 karagdagang letrang probisyon (a–g) na hiwalay na tinatanong sa exam.

🎯 Board Exam Tip

Karaniwang sinusubok pareho ang 4 layunin AT ang 7 mandato bilang "Which is NOT..." o "Except" questions. Kabisaduhin: 4 layunin + 7 letrang mandato = 11 total na possible testable items sa isang seksyon lang.

❓ Madalas Malito ang Students

*   **Tanong:** Purely pangongolekta lang ba ng buwis ang trabaho ng Customs?
*   **Sagot:** Hindi. Isa sa pinakamalaking pagbabago sa CMTA ay ang pagtutok sa "trade facilitation".
*   **Tanong:** Ilan ba talaga ang dapat kabisaduhin sa Section 101?
*   **Sagot:** 4 sa opening sentence, at 7 pa sa (a) hanggang (g) — magkaiba ang function pero magkaugnay.

🔗 Related Topics

*   Sec. 101(a)–(g) — mga hiwalay na entries para sa bawat mandato
*   Sec. 102 - Definition of Terms
*   Revised Kyoto Convention (RKC) - basis of modernization

🤖 Need More Explanation?

Explain the Declaration of Policy under Section 101 of the Philippine CMTA simply. Clarify the difference between the 4 general policy goals in the opening sentence and the 7 specific mandates (a) to (g). Give practical examples of how BOC balances revenue collection and trade facilitation. Provide board exam insights.`,prompt:"Explain the Declaration of Policy under Section 101 of the Philippine CMTA simply. Clarify the difference between the 4 general policy goals in the opening sentence and the 7 specific mandates (a) to (g). Give practical examples of how BOC balances revenue collection and trade facilitation. Provide board exam insights."},194:{_label:"paragraph (a) — ",title:"Pag-develop ng Customs Systems (Section 101a)",content:`📖 Kahulugan

Ang paragraph (a) ay bahagi ng Declaration of Policy na nag-uutos sa Estado na patuloy na pagandahin at pag-ayusin ang mga sistema at proseso sa Customs para maging pare-pareho at maayos (harmonized) ang pamamaraan.

🔍 Breakdown

*   **Continuous enhancement:** Hindi pwedeng tumigil sa pag-improve; dapat laging nag-a-upgrade.
*   **Harmonize customs procedures:** Dapat pare-pareho ang proseso kahit saang port ka mag-transact, para hindi nakakalito.

💡 Simpleng Paliwanag

Dapat laging ina-upgrade ng Customs ang kanilang sistema. Kung paano ka nag-process ng import sa Manila, dapat ganun din kadali at kapareho ang proseso sa Cebu o Davao.

📦 Halimbawa

Imbes na iba ang form na ginagamit sa Port of Manila at iba sa Port of Batangas, gumawa ng iisang standard electronic goods declaration system na ginagamit sa buong bansa para ma-harmonize ang proseso.

⭐ Bakit Mahalaga Ito?

Naiiwasan nito ang kalituhan ng mga importers at brokers. Kapag harmonized ang sistema, mas mabilis at walang delay sa paglabas ng kargamento.

⚠️ Dapat Tandaan

*   Ang harmonization ay sumusunod sa international standards tulad ng Revised Kyoto Convention.

🎯 Board Exam Tip

Tandaan ang salitang "harmonize". Ito ay key principle sa ilalim ng international trade agreements na sinunod ng CMTA.

❓ Madalas Malito ang Students

*   **Tanong:** Bakit kailangang i-harmonize?
*   **Sagot:** Para iwas sa red tape at corruption. Kapag standard ang proseso, mas madaling bantayan.

🔗 Related Topics

*   Sec. 101 - Declaration of Policy
*   Sec. 109 - Application of ICT

🤖 Need More Explanation?

Explain Section 101(a) of the Philippine CMTA regarding the harmonization of customs procedures. Why is continuous enhancement of systems important for trade facilitation? Provide examples.`,prompt:"Explain Section 101(a) of the Philippine CMTA regarding the harmonization of customs procedures. Why is continuous enhancement of systems important for trade facilitation? Provide examples."},195:{_label:"paragraph (b) — ",title:"Malinaw na Patakaran at International Standards (Section 101b)",content:`📖 Kahulugan

Ang paragraph (b) ay nag-uutos na ang mga gagawing rules at regulations ng Customs ay dapat malinaw, transparent, at nakabase sa kung ano ang best practices at standards sa buong mundo.

🔍 Breakdown

*   **Clear and transparent:** Dapat madaling maintindihan at hindi tinatago ang mga rules.
*   **International standards / Best practices:** Dapat sumunod ang Pilipinas sa ginagawa ng mga mauunlad na bansa at ng World Customs Organization (WCO).

💡 Simpleng Paliwanag

Hindi pwedeng manghula ang importer sa kung ano ang patakaran. Dapat nakasulat ito nang malinaw at kapareho ng sistema ng ibang bansa para madali tayong makipag-kalakalan sa buong mundo.

📦 Halimbawa

Ang BOC ay naglalabas ng Customs Memorandum Orders (CMOs) na naka-post publicly sa website nila tungkol sa bagong proseso ng clearance. Ang prosesong ito ay naka-align sa standards ng Revised Kyoto Convention.

⭐ Bakit Mahalaga Ito?

Kapag malinaw ang rules, naiiwasan ang pangongotong at natutulungan ang mga negosyante na mag-comply nang tama.

⚠️ Dapat Tandaan

*   Ang CMTA ay isinabatas mismo para i-align ang ating lumang batas sa international standards (gaya ng WCO at RKC).

🎯 Board Exam Tip

Laging ikonekta ang "international standards" sa World Customs Organization (WCO) at Revised Kyoto Convention (RKC).

❓ Madalas Malito ang Students

*   **Tanong:** Obligado ba ang Pilipinas na sumunod sa international standards?
*   **Sagot:** Oo, bilang miyembro ng WCO at signatory sa mga international treaties, kailangan nating i-adopt ang best practices.

🔗 Related Topics

*   Sec. 101 - Declaration of Policy
*   Revised Kyoto Convention (RKC)

🤖 Need More Explanation?

Explain Section 101(b) of the Philippine CMTA about adopting international standards. How does the BOC ensure that its rules are transparent and aligned with WCO best practices?`,prompt:"Explain Section 101(b) of the Philippine CMTA about adopting international standards. How does the BOC ensure that its rules are transparent and aligned with WCO best practices?"},196:{_label:"paragraph (c) — ",title:"Transparency at Informed Compliance (Section 101c)",content:`📖 Kahulugan

Inuutos ng paragraph (c) na dapat madaling ma-access ng publiko ang lahat ng impormasyon, batas, at patakaran ng Customs. Ang layunin nito ay para ang mga tao ay makasunod sa batas dahil alam nila ito (informed compliance).

🔍 Breakdown

*   **Transparency and accessibility:** Dapat madaling mahanap at mabasa ng publiko ang mga memo at batas.
*   **Informed and diligent compliance:** Mas susunod ang mga tao kung educated at informed sila sa tamang proseso.

💡 Simpleng Paliwanag

Para sumunod ang mga tao sa batas, dapat alam nila ang batas. Kaya obligasyon ng Customs na ilathala at ipaalam sa publiko ang mga requirements nang walang tinatago.

📦 Halimbawa

Kung may bagong taripa na ipapataw sa mga imported na kotse, dapat i-publish ito ng BOC sa kanilang website at sa mga dyaryo bago ito ipatupad, para alam ng mga car importers kung magkano ang babayaran nila.

⭐ Bakit Mahalaga Ito?

Tinatanggal nito ang palusot na "hindi ko alam ang batas" dahil ginawa nang accessible ng gobyerno ang lahat ng impormasyon.

⚠️ Dapat Tandaan

*   Ang informed compliance ay nagshi-shift ng burden: tinuturuan ng gobyerno ang importer, tapos ang importer ay inaaasahang magdeklara ng tama.

🎯 Board Exam Tip

Tandaan ang term na "Informed Compliance". Ito ang kabaligtaran ng lumang sistema na "catch me if you can". Ngayon, tinuturuan muna bago parusahan.

❓ Madalas Malito ang Students

*   **Tanong:** Paano pinapatupad ang transparency?
*   **Sagot:** Sa pamamagitan ng website ng BOC, public consultations, at customer assistance desks.

🔗 Related Topics

*   Sec. 111 - Information of General Application
*   Sec. 112 - Information of a Specific Nature

🤖 Need More Explanation?

Explain the concept of 'Informed Compliance' and transparency under Section 101(c) of the CMTA. Why is accessibility to customs information crucial for stakeholders?`,prompt:"Explain the concept of 'Informed Compliance' and transparency under Section 101(c) of the CMTA. Why is accessibility to customs information crucial for stakeholders?"},197:{_label:"paragraph (d) — ",title:"Konsultasyon sa Stakeholders (Section 101d)",content:`📖 Kahulugan

Sinasabi ng paragraph (d) na hindi pwedeng magdesisyon mag-isa ang Customs. Dapat silang makipag-usap at makipagtulungan sa ibang ahensya ng gobyerno at sa private sector bago gumawa ng mga patakaran.

🔍 Breakdown

*   **Consult, coordinate and cooperate:** Ang proseso ng paggawa ng rules ay dapat may dayalogo.
*   **Other government agencies & private sector:** Kasama dito ang DTI, DA, mga importers, at mga Customs Brokers.

💡 Simpleng Paliwanag

Bago gumawa ng bagong rule ang Customs, kailangan muna nilang tanungin ang opinyon ng mga Customs Broker at iba pang negosyante para malaman kung maganda ba ito o pahirap lang sa kanila.

📦 Halimbawa

Bago mag-implement ng bagong port storage fees, nagpapatawag ang BOC ng public hearing kasama ang Chamber of Customs Brokers, Inc. (CCBI) at Philippine Ports Authority (PPA) para pag-usapan kung makatarungan ba ang presyo.

⭐ Bakit Mahalaga Ito?

Ang mga taong araw-araw nagta-transact sa Customs (private sector) ang mas nakakaalam ng sitwasyon sa ground. Ang konsultasyon ay nag-iwas sa paggawa ng patakaran na hindi praktikal.

⚠️ Dapat Tandaan

*   Ang pagbalangkas ng mga CAO (Customs Administrative Order) ay laging may public consultation bago pirmahan ng Secretary of Finance.

🎯 Board Exam Tip

Sa CMTA, ang private sector ay itinuturing na "partners" sa trade facilitation, hindi lang basta regulated entities.

❓ Madalas Malito ang Students

*   **Tanong:** Sino ang bumubuo ng private sector sa Customs?
*   **Sagot:** Kasama dito ang mga importers, exporters, customs brokers, freight forwarders, at shipping lines.

🔗 Related Topics

*   Sec. 101 - Declaration of Policy

🤖 Need More Explanation?

Explain Section 101(d) of the CMTA regarding consultation with other agencies and the private sector. Give an example of how BOC collaborates with stakeholders in policy-making.`,prompt:"Explain Section 101(d) of the CMTA regarding consultation with other agencies and the private sector. Give an example of how BOC collaborates with stakeholders in policy-making."},198:{_label:"paragraph (e) — ",title:"Patas at Mabilis na Apela (Section 101e)",content:`📖 Kahulugan

Inuutos ng paragraph (e) na dapat magkaroon ng patas at mabilis na proseso kung saan pwedeng magreklamo o mag-apela ang isang tao kung hindi siya pabor sa desisyon ng Customs.

🔍 Breakdown

*   **Fair and expeditious:** Dapat walang kinikilingan at hindi inaabot ng dekada bago maresolba.
*   **Administrative and judicial appellate remedy:** Pwedeng i-apela sa loob muna ng BOC (administrative) at kung hindi pa rin pabor, pwedeng dalhin sa korte (judicial, gaya ng CTA).

💡 Simpleng Paliwanag

Kung sa tingin mo ay mali ang pag-compute ng Customs Examiner sa buwis ng kargamento mo, may karapatan kang magreklamo at i-apela ito, at dapat itong aksyunan ng gobyerno nang mabilis at patas.

📦 Halimbawa

Nag-issue ang District Collector ng Warrant of Seizure and Detention (WSD) sa goods mo. Dahil naniniwala kang legal ang importasyon mo, nag-file ka ng apela sa Commissioner of Customs para ipawalang-bisa ang WSD.

⭐ Bakit Mahalaga Ito?

Ito ay bahagi ng "Due Process". Hindi pwedeng diktador ang Customs; dapat may tamang venue para pakinggan ang panig ng importer o broker.

⚠️ Dapat Tandaan

*   Laging may hierarchy ang apela: Mula sa District Collector -> Commissioner of Customs -> Secretary of Finance -> Court of Tax Appeals (CTA).

🎯 Board Exam Tip

Tandaan na ang Court of Tax Appeals (CTA) ang may exclusive appellate jurisdiction sa mga desisyon ng Commissioner of Customs sa mga kasong may kinalaman sa buwis at taripa.

❓ Madalas Malito ang Students

*   **Tanong:** Pwede ba akong dumiretso agad sa korte kung ayaw ko sa desisyon ng Collector?
*   **Sagot:** Hindi. Dapat sundin ang "exhaustion of administrative remedies". I-apela muna sa Commissioner bago sa korte.

🔗 Related Topics

*   Sec. 114 - Right of Appeal, Forms and Ground
*   Title XI - Administrative and Judicial Procedures

🤖 Need More Explanation?

Explain the right to fair and expeditious appellate remedy under Section 101(e) of the CMTA. What is the standard hierarchy of appeal from a decision of a District Collector up to the judicial courts?`,prompt:"Explain the right to fair and expeditious appellate remedy under Section 101(e) of the CMTA. What is the standard hierarchy of appeal from a decision of a District Collector up to the judicial courts?"},199:{_label:"paragraph (f) — ",title:"Paggamit ng Teknolohiya o ICT (Section 101f)",content:`📖 Kahulugan

Ang paragraph (f) ay nag-uutos sa Customs na gumamit ng mga modernong kasanayan at Information and Communications Technology (ICT) o computers at internet para gawin ang kanilang trabaho.

🔍 Breakdown

*   **Modern practices:** Pagtanggal sa mga luma at mabagal na prosesong mano-mano.
*   **Information and communications technology (ICT):** Paggamit ng computer systems, e-payments, at online lodgement.

💡 Simpleng Paliwanag

Dapat digital at paperless na ang Customs. Imbes na pumila ka nang mahaba dala ang patong-patong na papel, dapat pwede na itong i-submit online gamit ang computer.

📦 Halimbawa

Ginagamit na ngayon ang Value-Added Service Providers (VASPs) kung saan ang Customs Broker ay nagta-type ng goods declaration sa kanyang laptop sa opisina, at ise-send ito electronically sa system ng BOC nang hindi umaalis sa upuan.

⭐ Bakit Mahalaga Ito?

Pinapabilis nito ang trabaho, binabawasan ang face-to-face contact (na madalas ugat ng korapsyon), at ginagawang mas efficient ang pag-trace ng mga dokumento.

⚠️ Dapat Tandaan

*   Ang layunin ng CMTA ay maging "paperless customs environment".

🎯 Board Exam Tip

Ang paggamit ng ICT ay direktang konektado sa Section 109 ng CMTA. Tandaan na ang electronic documents ay may kaparehong legal validity sa mga printed documents sa ilalim ng batas na ito.

❓ Madalas Malito ang Students

*   **Tanong:** Valid pa rin ba ang papel na dokumento?
*   **Sagot:** Oo, sa mga kaso na nangangailangan ng manual intervention, pero ang default at pinu-push ng CMTA ay electronic processing.

🔗 Related Topics

*   Sec. 109 - Application of Information and Communications Technology
*   E-Commerce Act of 2000 (RA 8792)

🤖 Need More Explanation?

Explain Section 101(f) and the mandate for the Bureau of Customs to use Information and Communications Technology (ICT). Give examples of how ICT is currently applied in the Philippine Customs processes.`,prompt:"Explain Section 101(f) and the mandate for the Bureau of Customs to use Information and Communications Technology (ICT). Give examples of how ICT is currently applied in the Philippine Customs processes."},200:{_label:"paragraph (g) — ",title:"Professionalism at Meritocracy (Section 101g)",content:`📖 Kahulugan

Inuutos ng paragraph (g) na dapat panatilihin ang pagiging propesyonal sa customs tax administration — ang eksaktong parirala sa batas. Dapat ang mga na-ha-hire at nako-promote na empleyado ay base sa kanilang galing at kakayahan (meritocracy), hindi dahil sa "backer" o palakasan.

🔍 Breakdown

*   **Professionalism sa customs tax administration:** Paggawa ng trabaho nang may integridad, tapat, at maayos — tandaan, "customs tax administration" ang exact wording, hindi lang "customs administration".
*   **Meritocracy:** Ang pagtaas ng posisyon ay nakabase sa qualifications, experience, at performance.
*   **Attracting and retaining competent personnel:** Pagbibigay ng tamang sahod at training para hindi umalis ang mga magagaling na empleyado.

💡 Simpleng Paliwanag

Dapat ang nagtatrabaho sa Customs ay mga taong qualified at matalino sa trabaho nila. Kung sino ang magaling at nagtatrabaho nang tama, siya ang dapat ma-promote, hindi kung sino ang malakas sa pulitika.

📦 Halimbawa

Para ma-promote bilang Customs Operations Officer (COO), kailangan munang pumasa ng empleyado sa mga strict na exams at interviews ng Personnel Selection Board, imbes na ma-appoint lang dahil kaibigan siya ng isang pulitiko.

⭐ Bakit Mahalaga Ito?

Ito ay panlaban sa korapsyon. Kapag ang mga empleyado ay nandun dahil sa sariling sikap at galing, mas pro-protektahan nila ang trabaho nila at susunod sa batas.

⚠️ Dapat Tandaan

*   Kasama sa modernization hindi lang ang computers kundi pati na rin ang human resources o pag-upgrade sa mga empleyado.
*   Ang literal na text ng batas ay "Institute professionalism and meritocracy in customs tax administration..." — posibleng literal na sipiin ito sa exam.

🎯 Board Exam Tip

Kung tatanungin ano ang nagre-regulate sa pag-hire sa BOC bukod sa CMTA, ito ay ang Civil Service Commission (CSC) rules na nagpapatupad din ng meritocracy. Sa fill-in-the-blank o exact-phrase questions, tandaan ang salitang "tax" sa "customs tax administration".

❓ Madalas Malito ang Students

*   **Tanong:** Paano ma-retain ang competent personnel?
*   **Sagot:** Sa pamamagitan ng patuloy na training (tulad ng sa Customs Training Institute) at pagbibigay ng fair na career progression.

🔗 Related Topics

*   Sec. 101 - Declaration of Policy
*   Civil Service Rules

🤖 Need More Explanation?

Discuss Section 101(g) of the CMTA regarding professionalism and meritocracy in the Bureau of Customs, using the exact statutory phrase "customs tax administration". How does the law try to reform the human resources aspect of customs administration?`,prompt:'Discuss Section 101(g) of the CMTA regarding professionalism and meritocracy in the Bureau of Customs, using the exact statutory phrase "customs tax administration". How does the law try to reform the human resources aspect of customs administration?'},201:{_label:"section 102 — Definition of Terms",title:"Panimula sa Definition of Terms (Section 102)",content:`📖 Kahulugan

Ang Section 102 ay ang bahagi ng batas na naglilista at nagpapaliwanag ng mga teknikal na salita na ginagamit sa loob ng CMTA. 

🔍 Breakdown

*   **"As used in this Act"**: Ibig sabihin, ang mga kahulugang nakasulat dito ay ang legal at opisyal na ibig sabihin kapag ginamit ang salita sa loob mismo ng RA 10863 (CMTA).

💡 Simpleng Paliwanag

Ito ang "dictionary" ng CMTA. Kung naguguluhan ka kung ano ang ibig sabihin ng isang salita sa Customs (tulad ng "Entry", "Importation", o "Smuggling"), dito mo titingnan ang opisyal na ibig sabihin nito para walang turuan o maling interpretasyon.

📦 Halimbawa

Kapag sinabi ng examiner na "nag-lodge ako ng goods declaration," hahanapin mo sa Section 102 kung ano talaga ang ibig sabihin ng "Goods Declaration" at "Lodgement" sa paningin ng batas.

⭐ Bakit Mahalaga Ito?

Iniiwasan nito ang kalituhan. Sa batas, bawat salita ay may eksaktong ibig sabihin. Kapag hindi pareho ang intindi ng Broker at ng Examiner sa isang salita, magkakaroon ng away o kaso.

⚠️ Dapat Tandaan

*   Ang mga definitions na ito ay exclusive sa CMTA. Maaaring iba ang ibig sabihin ng salitang ito sa ibang batas (gaya ng Civil Code), pero para sa Customs, Section 102 ang masusunod.

🎯 Board Exam Tip

Ang mga definitions mula sa Section 102 ay madalas na lumalabas sa board exam bilang mga "Identification" o "Multiple Choice" questions. Kabisaduhin ang mga keywords ng bawat term!

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan ko bang i-memorize word-for-word ang definitions?
*   **Sagot:** Hindi kailangang word-for-word. Ang mahalaga ay alam mo ang *keywords* (hal. Abatement = reduction of duties).

🔗 Related Topics

*   Lahat ng subsections mula (a) hanggang (uu) ng Section 102.

🤖 Need More Explanation?

Explain the importance of Section 102 (Definition of Terms) in the Philippine CMTA. Why is it important for Customs Brokers and students to rely on statutory definitions rather than regular dictionary meanings?`,prompt:"Explain the importance of Section 102 (Definition of Terms) in the Philippine CMTA. Why is it important for Customs Brokers and students to rely on statutory definitions rather than regular dictionary meanings?"},202:{_label:"paragraph (a) Abatement — ",title:"Ano ang Abatement? (Section 102a)",content:`📖 Kahulugan

Ang Abatement ay ang pagbabawas o pagbaba ng halaga ng babayarang buwis at taripa (duties and taxes) na **hindi pa nababayaran** dahil sa ilang kadahilanan, tulad ng pagkasira ng mga kalakal.

🔍 Breakdown

*   **Reduction or diminution:** Pagbawas sa kabuuang halaga (pwede buo o parte lang).
*   **Where payment has not been made:** Ito ang pinaka-importanteng keyword. Ang buwis ay hindi pa nababayaran ng importer.

💡 Simpleng Paliwanag

Kung ang kargamento mo ay nasira bago mo pa mabayaran ang buwis, pwede kang humingi ng "discount" o tuluyang huwag nang magbayad ng buwis para doon sa nasirang bahagi. Ito ay tinatawag na Abatement.

📦 Halimbawa

Nag-import ka ng 100 kahon ng mansanas. Pagdating sa port, nakita na ang 20 kahon ay bulok na dahil nasira ang freezer ng barko. Bago ka magbayad ng buwis, pwede kang mag-apply ng abatement para ang babayaran mo na lang na buwis ay para sa 80 kahon na maayos.

⭐ Bakit Mahalaga Ito?

Ito ay nagbibigay ng hustisya sa importer. Hindi makatarungan na pagbayarin siya ng buong buwis para sa mga kalakal na nasira o nawala nang wala siyang kasalanan bago pa man ito mailabas sa Customs.

⚠️ Dapat Tandaan

*   Kung **nabayaran na** ang buwis at gusto mong bawiin, hindi na ito Abatement. Ang tawag doon ay **Refund**.

🎯 Board Exam Tip

Laging itinatapat ang Abatement vs Refund sa exam. 
Abatement = payment has NOT been made.
Refund = payment HAS been made.

❓ Madalas Malito ang Students

*   **Tanong:** Pwede ba ang abatement kung ninakaw ang goods ko sa warehouse pagkatapos kong magbayad?
*   **Sagot:** Hindi. Dahil bayad na, refund na ang tamang remedyo (kung applicable), hindi abatement.

🔗 Related Topics

*   Sec. 102 (ll) - Refund
*   Title IV, Chapter 2, Section 406 - Abatement of Duties and Taxes

🤖 Need More Explanation?

Explain the definition of Abatement under Section 102(a) of the CMTA. What is the main difference between Abatement and Refund? Give a practical customs scenario applying abatement.`,prompt:"Explain the definition of Abatement under Section 102(a) of the CMTA. What is the main difference between Abatement and Refund? Give a practical customs scenario applying abatement."},203:{_label:"paragraph (b) Actual or Outright Exportation — ",title:"Ano ang Actual or Outright Exportation? (Section 102b)",content:`📖 Kahulugan

Ang Actual or Outright Exportation ay ang proseso kung saan ang mga produkto mula sa Pilipinas (na malayang ibinebenta dito) ay inilalabas sa teritoryo ng bansa nang may intensyong doon na ito manatili nang permanente sa ibang bansa.

🔍 Breakdown

*   **Being in free circulation:** Mga produktong legal na nandito sa Pilipinas at walang hadlang na ibenta o gamitin dito.
*   **Leave the Philippine territory:** Inilalabas papunta sa ibang bansa.
*   **Intended to remain permanently outside:** Walang planong ibalik ang produkto sa Pilipinas. Ibinenta na ito nang tuluyan sa labas.

💡 Simpleng Paliwanag

Ito ang normal na pag-e-export. Gumawa ka ng produkto dito sa Pilipinas, ibinenta mo sa Amerika, at hindi na ito babalik dito. Permanenteng umalis na ang kargamento.

📦 Halimbawa

Isang kumpanya sa Cebu na gumagawa ng dried mangoes ay nagpadala ng dalawang container nito papuntang Japan para ibenta sa mga supermarkets doon. Ito ay isang Actual or Outright Exportation dahil ang dried mangoes ay hindi na ibabalik sa Pilipinas.

⭐ Bakit Mahalaga Ito?

Mahalaga itong ma-distinguish dahil ang outright exportation ay kadalasang exempted o walang binabayarang export duty, kumpara sa mga goods na ilalabas lang pansamantala (gaya ng repair) na may ibang rules na sinusunod.

⚠️ Dapat Tandaan

*   Iba ito sa "Conditional Exportation" kung saan ang kargamento ay lalabas lang para ipa-repair o i-display sa exhibit tapos babalik din sa bansa.

🎯 Board Exam Tip

Ang keyword dito ay "remain permanently outside it". Kapag nabasa mo ito sa tanong, ang sagot ay Actual or Outright Exportation.

❓ Madalas Malito ang Students

*   **Tanong:** Paano kung hindi nabenta sa labas at kinailangang ibalik sa Pilipinas, outright exportation pa rin ba noong una?
*   **Sagot:** Oo, nung una ay outright exportation pa rin iyon base sa intensyon noong umalis. Ang pagbalik nito ay ituturing na bilang "Returned Goods" sa ilalim ng Conditional Importation.

🔗 Related Topics

*   Sec. 102 (s) - Exportation
*   Sec. 102 (m) - Conditional Importation

🤖 Need More Explanation?

Explain Actual or Outright Exportation under Section 102(b) of the CMTA. What makes it different from other forms of exportation? Provide a simple example.`,prompt:"Explain Actual or Outright Exportation under Section 102(b) of the CMTA. What makes it different from other forms of exportation? Provide a simple example."},204:{_label:"paragraph (c) Admission — ",title:"Ano ang Admission? (Section 102c)",content:`📖 Kahulugan

Ang Admission ay ang simpleng pagpasok ng mga imported na kargamento papunta sa isang Free Zone (tulad ng PEZA, Clark, o Subic) mula sa barko o eroplano, direkta man ito o dumaan sa ibang port.

🔍 Breakdown

*   **Bringing imported goods:** Pagdadala ng mga kalakal mula sa ibang bansa.
*   **Directly or through transit:** Pwedeng idiretso agad sa Free Zone (kung may sariling port doon tulad ng Subic), o idiskarga muna sa Manila port tapos ita-transit via truck papuntang PEZA zone sa Laguna.
*   **Into a free zone:** Ang destinasyon ay hindi ang regular na merkado, kundi isang special economic zone.

💡 Simpleng Paliwanag

Kapag ang kargamento ay galing abroad at pumasok sa Pilipinas para dalhin sa mga lugar tulad ng PEZA o Freeport, ang tawag sa prosesong iyon ay "Admission", hindi "Entry".

📦 Halimbawa

May dumating na tela mula China. Imbes na bayaran agad ng buwis sa Manila, ang tela ay isinakay sa truck (transit) papunta sa isang pabrika ng damit sa loob ng Cavite Economic Zone (PEZA). Ang pagpasok ng tela sa PEZA ay tinatawag na Admission.

⭐ Bakit Mahalaga Ito?

Mahalagang malaman ang pagkakaiba ng Admission at Entry. Kapag "Entry", pumasok ito sa Customs Territory at karaniwang may buwis. Kapag "Admission", pumasok ito sa Free Zone at tax/duty-free.

⚠️ Dapat Tandaan

*   Ang Admission ay ginagamit **exclusively** para sa pagpasok ng goods sa **Free Zones**.

🎯 Board Exam Tip

Kapag ang tanong ay pagpasok sa "Customs Territory", ang sagot ay ENTRY. Kapag pagpasok sa "Free Zone", ang sagot ay ADMISSION.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho lang ba ang Importation at Admission?
*   **Sagot:** Ang Importation ay ang pangkalahatang pagpasok sa bansa. Ang Admission ay isang *uri* ng importation kung saan ang bagsak ng goods ay sa Free Zone.

🔗 Related Topics

*   Sec. 102 (r) - Entry
*   Sec. 102 (w) - Free Zone
*   Sec. 102 (z) - Importation

🤖 Need More Explanation?

Explain the concept of Admission under Section 102(c) of the Philippine CMTA. What is the strict legal difference between 'Admission' and 'Entry'? Provide practical examples involving PEZA zones.`,prompt:"Explain the concept of Admission under Section 102(c) of the Philippine CMTA. What is the strict legal difference between 'Admission' and 'Entry'? Provide practical examples involving PEZA zones."},205:{_label:"paragraph (d) Airway Bill (AWB) — ",title:"Ano ang Airway Bill (AWB)? (Section 102d)",content:`📖 Kahulugan

Ang Airway Bill (AWB) ay isang dokumento sa transportasyon na ginagamit para sa mga kargamentong ipinapadala sa pamamagitan ng eroplano (airfreight). Ito ay resibo ng kargamento at kontrata sa pagitan ng nagpadala at ng airline.

🔍 Breakdown

*   **Transport document for airfreight:** Dokumentong eksklusibo sa pagpapadala via hangin.
*   **Specify the holder or consignee:** Nakasulat dito kung sino ang tatanggap ng kargamento na may karapatang kunin ito pagdating sa airport.
*   **Contract of carriage:** Naglalaman ng kasunduan (limits of liability, claims) sa pagitan ng shipper at airline.
*   **Transport instructions & description:** Nakasulat ang detalye ng goods at kung magkano ang binayad sa paglipad nito.

💡 Simpleng Paliwanag

Kung sasakay ka ng eroplano, mayroon kang plane ticket. Ang Airway Bill ay ang "plane ticket" ng mga kargamento o kahon na isinasakay sa eroplano. Dito nakasulat kung saan ito pupunta at sino ang kukuha.

📦 Halimbawa

Nag-order ka ng mamahaling laptop mula Singapore via DHL (eroplano). Ang DHL ay mag-i-issue ng Airway Bill na may tracking number. Pagdating sa NAIA, kailangan mo o ng broker mo ang AWB para patunayan sa Customs na ikaw ang consignee na may karapatang kumuha ng laptop.

⭐ Bakit Mahalaga Ito?

Ang AWB ay isa sa mga pinaka-importanteng dokumento sa air customs clearance. Ginagamit ito para malaman kung magkano ang freight charges na isasama sa pag-compute ng dutiable value (sa pamamagitan ng CIF/CIP valuation).

⚠️ Dapat Tandaan

*   Hindi tulad ng Bill of Lading sa barko, ang Airway Bill ay **hindi negotiable** (hindi pwedeng ipasa-pasa ang pagmamay-ari nang basta-basta sa pamamagitan ng endorsement).

🎯 Board Exam Tip

Tandaan: Airfreight = Airway Bill (AWB). Water-borne freight = Bill of Lading (B/L).

❓ Madalas Malito ang Students

*   **Tanong:** Title of ownership ba ang AWB gaya ng B/L?
*   **Sagot:** Hindi. Ang AWB ay resibo at kontrata ng paglipat (contract of carriage) pero hindi document of title. 

🔗 Related Topics

*   Sec. 102 (h) - Bill of Lading
*   Valuation System (Freight component)

🤖 Need More Explanation?

Explain what an Airway Bill (AWB) is under Section 102(d) of the CMTA. What information does it contain and why is it important for Customs clearance? Differentiate it simply from a Bill of Lading.`,prompt:"Explain what an Airway Bill (AWB) is under Section 102(d) of the CMTA. What information does it contain and why is it important for Customs clearance? Differentiate it simply from a Bill of Lading."},206:{_label:"paragraph (e) Appeal — ",title:"Ano ang Appeal? (Section 102e)",content:`📖 Kahulugan

Ang Appeal o Apela ay ang pormal na hakbang ng isang tao para ireklamo at pakiusapang baguhin ang isang desisyon, utos, o pagkukulang ng Bureau of Customs kung sa tingin niya ay mali ito at nakakasama sa kanya.

🔍 Breakdown

*   **Remedy by which a person aggrieved:** Isang solusyon o aksyon para sa taong naagrabyado o hindi pabor sa desisyon.
*   **Action, decision, order, or omission of the Bureau:** Pwedeng i-apela ang ginawa ng BOC, desisyon nila, o kahit ang *hindi nila pag-aksyon* (omission).
*   **Seeks redress:** Humihingi ng katarungan o pagbabago sa desisyon.
*   **Before the Bureau, Sec of Finance, or court:** Ito ang tatlong lugar kung saan pwedeng i-akyat ang reklamo depende sa level.

💡 Simpleng Paliwanag

Kung siningil ka ng Customs ng 1 Milyong pisong buwis pero ang kwenta mo ay 500 Libo lang, hindi mo kailangang tanggapin na lang agad yun. Pwede kang mag-"Appeal" para patingnan muli ang kaso mo sa mas nakakataas na opisyal.

📦 Halimbawa

Kinom-fiscate ng District Collector sa Port of Manila ang kargamento mo dahil inakala niyang peke (smuggled) ito. Bilang importer na may kumpletong papeles, pwede kang mag-file ng "Appeal" sa Commissioner of Customs para baligtarin ang desisyon ng Collector.

⭐ Bakit Mahalaga Ito?

Ito ay garantisado ng Konstitusyon (Due Process). Tinitiyak nito na may check and balance at hindi pwedeng abusuhin ng isang customs examiner o collector ang kanyang kapangyarihan.

⚠️ Dapat Tandaan

*   May limitadong panahon lang (usually 15 days, check Sec 114) para mag-file ng apela. Kapag lumipas ito, magiging final and executory na ang desisyon.

🎯 Board Exam Tip

Laging tandaan ang hierarchy ng appeal: Collector -> Commissioner -> Sec of Finance (sa ilang kaso) -> Court of Tax Appeals (CTA) -> Supreme Court.

❓ Madalas Malito ang Students

*   **Tanong:** Pwede ba i-apela ang kawalan ng aksyon ng Customs?
*   **Sagot:** Oo. Sinasabi sa batas na pati ang "omission" (hindi pag-aksyon sa tamang panahon) ay pwedeng maging grounds for appeal.

🔗 Related Topics

*   Sec. 114 - Right of Appeal, Forms and Ground
*   Sec. 101 (e) - Declaration of Policy (Fair remedy)

🤖 Need More Explanation?

Explain the definition of Appeal under Section 102(e) of the CMTA. In simple terms, how does the appeal process protect the rights of importers and brokers against adverse customs decisions?`,prompt:"Explain the definition of Appeal under Section 102(e) of the CMTA. In simple terms, how does the appeal process protect the rights of importers and brokers against adverse customs decisions?"},207:{_label:"paragraph (f) Assessment — ",title:"Ano ang Assessment? (Section 102f)",content:`📖 Kahulugan

Ang Assessment ay ang proseso kung saan kinukuwenta at inaalam ng Customs kung magkano ang eksaktong halaga ng buwis, taripa, at iba pang bayarin na dapat bayaran sa isang imported o in-export na kargamento.

🔍 Breakdown

*   **Process of determining the amount:** Ang mismong pagko-compute o pagkuwenta.
*   **Duties and taxes and other charges:** Kasama dito ang customs duty, Value-Added Tax (VAT), excise tax (kung meron), at iba pang fees tulad ng IPF.
*   **Due on imported and exported goods:** Ina-apply ito sa kalakal na pumapasok at lumalabas ng bansa.

💡 Simpleng Paliwanag

Ito ang "pag-kwenta" ng resibo. Bago mailabas ng importer ang kanyang goods mula sa pantalan, kailangang dumaan ito sa Assessment para malaman nang eksakto kung magkano ang utang niyang buwis sa gobyerno.

📦 Halimbawa

Nag-submit ang Customs Broker ng deklarasyon para sa pag-import ng mga sapatos. Titingnan ng Customs Examiner ang papel, aalamin ang classification (HS Code) ng sapatos, titingnan ang value, at magko-compute (Assessment) para lumabas na P50,000 ang duties and taxes na dapat bayaran.

⭐ Bakit Mahalaga Ito?

Ang Assessment ang nagtatakda kung magkano ang kikitain ng gobyerno. Kung mali ang assessment, pwedeng malugi ang gobyerno (dahil sa under-assessment) o pwedeng ma-agrabyado ang importer (over-assessment).

⚠️ Dapat Tandaan

*   Ang assessment ay pwedeng *self-assessment* (ang declarant/broker ang nag-compute na titingnan na lang ng BOC) o pwedeng i-assess ng mismong BOC officer.

🎯 Board Exam Tip

Kabisaduhin ang formula ng Assessment! Dutiable Value x Rate of Duty = Customs Duty. Tapos Landed Cost x VAT rate = VAT.

❓ Madalas Malito ang Students

*   **Tanong:** Ang assessment ba ay pareho sa valuation?
*   **Sagot:** Hindi. Ang *Valuation* ay ang pag-alam sa halaga (price) ng kargamento. Ang *Assessment* ay ang pag-compute ng buwis base sa value na nakuha.

🔗 Related Topics

*   Sec. 429 - Final Assessment
*   Title IV, Chapter 3 - Assessment

🤖 Need More Explanation?

Explain the concept of Assessment under Section 102(f) of the Philippine CMTA. What is the difference between valuation and assessment? Give a simple example of how assessment is done.`,prompt:"Explain the concept of Assessment under Section 102(f) of the Philippine CMTA. What is the difference between valuation and assessment? Give a simple example of how assessment is done."},208:{_label:"paragraph (g) Authorized Economic Operator (AEO) — ",title:"Ano ang AEO? (Section 102g)",content:`📖 Kahulugan

Ang Authorized Economic Operator (AEO) ay isang pribadong kumpanya (pwedeng importer, exporter, o broker) na binigyan ng accreditation ng Bureau of Customs bilang "VIP" o highly-trusted partner dahil palagi silang sumusunod sa batas at ligtas ang kanilang supply chain.

🔍 Breakdown

*   **Importer, exporter, broker... duly accredited:** Sinuman na bahagi ng international trade na pumasa sa mahigpit na evaluation ng BOC.
*   **Based on WCO Framework / RKC:** Sumusunod ito sa international standards ng pag-secure sa global trade.
*   **Promote trade facilitation & seamless movement:** Ang reward ng pagiging AEO ay mabilis at walang abalang paglabas ng kargamento (VIP treatment).
*   **Secure international trade:** Nakakasiguro ang gobyerno na hindi sila mag-i-is-smuggle o magpapasok ng kontrabando.

💡 Simpleng Paliwanag

Isipin mong may express lane o VIP lane sa airport. Ang AEO ay ang "VIP pass" ng mga kumpanya sa Customs. Dahil na-background check na silang mabuti at napatunayang tapat at hindi mandaraya, pinapabilis ang pag-process ng kanilang mga papeles kaysa sa mga normal na nag-iimport.

📦 Halimbawa

Ang Toyota Motor Philippines, dahil sa matagal at magandang track record sa pagbabayad ng tamang buwis, nag-apply at pumasa bilang AEO. Ngayon, pag may dumating silang pyesa, halos hindi na in-i-inspeksyon nang matagal (green lane) at nakakalabas agad ang kargamento nila dahil trusted na sila ng BOC.

⭐ Bakit Mahalaga Ito?

Tinutulungan ng AEO program ang BOC na ilaan ang kanilang oras sa paghuli ng mga totoong smuggler, habang pinapabilis ang negosyo ng mga tapat na kumpanya. Win-win situation ito para sa gobyerno at private sector.

⚠️ Dapat Tandaan

*   Ang AEO accreditation ay pwedeng bawiin (suspend/revoke) anumang oras kung ang kumpanya ay mahuling lumalabag sa batas o bumaba ang security standards nila.

🎯 Board Exam Tip

Ang concept ng AEO ay nanggaling sa WCO SAFE Framework of Standards. Ito ay isang paboritong topic pagdating sa modernization and trade facilitation questions.

❓ Madalas Malito ang Students

*   **Tanong:** Malalaking kumpanya lang ba ang pwedeng maging AEO?
*   **Sagot:** Hindi. Pwede rin mag-apply ang mga Customs Brokers at transport providers basta ma-meet nila ang security at compliance requirements ng BOC.

🔗 Related Topics

*   Title XII, Chapter 3 - Authorized Economic Operator (AEO) Program
*   Sec. 101 - Declaration of Policy (Trade Facilitation)

🤖 Need More Explanation?

Explain the Authorized Economic Operator (AEO) program under Section 102(g) of the CMTA. What are the benefits of being an AEO and why did the World Customs Organization (WCO) push for this framework? Provide examples.`,prompt:"Explain the Authorized Economic Operator (AEO) program under Section 102(g) of the CMTA. What are the benefits of being an AEO and why did the World Customs Organization (WCO) push for this framework? Provide examples."},209:{_label:"paragraph (h) Bill of Lading (B/L) — ",title:"Ano ang Bill of Lading (B/L)? (Section 102h)",content:`📖 Kahulugan

Ang Bill of Lading (B/L) ay isang opisyal na dokumento at kontrata na iniisyu ng shipping line o carrier para sa mga kargamentong pinapadala sa pamamagitan ng barko (water-borne freight). Nagsisilbi itong resibo ng mga kalakal at patunay ng karapatang kunin ang kargamento.

🔍 Breakdown

*   **Transport document for water-borne freight:** Para lang ito sa barko o dagat. 
*   **Holder or consignee has the right to claim:** Kung kaninong pangalan ang nakasulat o kung sino ang may hawak ng orihinal na dokumento, siya ang may karapatang kumuha ng kargamento sa pantalan.
*   **Contract of carriage:** Kasunduan ito na nagsasaad ng limitasyon sa pananagutan (limits of liability) ng barko kung may masira o mawala.

💡 Simpleng Paliwanag

Kung ang Airway Bill ay "plane ticket" ng kargamento, ang Bill of Lading ay ang "ticket sa barko" at "resibo" nang sabay. Ang nakakaiba sa B/L, ito ay parang titulo ng lupa. Kung sino ang may hawak ng orihinal na B/L, siya ang may-ari ng goods na nasa loob ng barko.

📦 Halimbawa

Umorder ka ng isang container ng bigas mula Vietnam. Pagkasakay sa barko, bibigyan ng shipping line ang seller ng Bill of Lading. Ipadadala ng seller ang B/L na ito sa iyo (sa Pilipinas) matapos mong magbayad. Pagdating ng barko sa Port of Manila, ipapakita ng Customs Broker mo ang orihinal na B/L sa shipping line at sa Customs para mapatunayang sa iyo talaga ang bigas.

⭐ Bakit Mahalaga Ito?

Ito ang pinakamahalagang dokumento sa pag-import via sea. Kung walang B/L, hindi ka pwedeng mag-file ng goods declaration. Dito rin nakabase ang pamasahe (freight) na kailangang isama sa computation ng buwis.

⚠️ Dapat Tandaan

*   Ang Bill of Lading (B/L) ay para sa barko. Ang Airway Bill (AWB) ay para sa eroplano.
*   Ang B/L ay isang "document of title", ibig sabihin pwede itong ibenta o ipasa sa iba habang nasa laot pa ang barko (negotiable).

🎯 Board Exam Tip

Madalas itanong ang tatlong function ng B/L: (1) Resibo ng kalakal, (2) Kontrata ng pagpapadala, at (3) Titulo ng pagmamay-ari (Document of Title). 

❓ Madalas Malito ang Students

*   **Tanong:** Paano kung NVOCC (Non-Vessel Operating Common Carrier) o forwarder ang kausap ko at hindi direktang shipping line?
*   **Sagot:** Nag-i-issue din sila ng B/L. Ang tawag doon ay "House Bill of Lading" (HBL), habang ang ini-issue ng mismong barko (tulad ng Maersk) sa NVOCC ay ang "Master Bill of Lading" (MBL).

🔗 Related Topics

*   Sec. 102 (d) - Airway Bill
*   Sec. 102 (ee) - NVOCC

🤖 Need More Explanation?

Explain the concept of a Bill of Lading (B/L) under Section 102(h) of the CMTA. What are its three main functions in international trade? How does it differ from an Airway Bill in terms of being a document of title?`,prompt:"Explain the concept of a Bill of Lading (B/L) under Section 102(h) of the CMTA. What are its three main functions in international trade? How does it differ from an Airway Bill in terms of being a document of title?"},210:{_label:"paragraph (i) Bureau — ",title:"Ano ang Bureau? (Section 102i)",content:`📖 Kahulugan

Kapag nabasa mo ang salitang "Bureau" sa loob ng CMTA, ito ay eksklusibong tumutukoy sa Bureau of Customs (BOC) ng Pilipinas.

🔍 Breakdown

*   **Bureau of Customs:** Ang ahensya ng gobyerno sa ilalim ng Department of Finance (DOF) na inatasang magpatupad ng CMTA.

💡 Simpleng Paliwanag

Ito ay shortcut ng batas. Imbes na isulat ng mahaba ang "Bureau of Customs" nang paulit-ulit sa daan-daang pahina ng CMTA, sinasabi na lang nilang "the Bureau".

📦 Halimbawa

Kung nakasulat sa Section 400 na "The goods shall be declared to the Bureau...", ibig sabihin idedeklara mo ito sa Bureau of Customs, hindi sa Bureau of Internal Revenue (BIR) o Bureau of Immigration (BI).

⭐ Bakit Mahalaga Ito?

Iniiwasan nito ang kalituhan (ambiguity) sa batas. Tinitiyak nito na malinaw kung aling ahensya ang may hurisdiksyon sa mga prosesong nakasaad.

⚠️ Dapat Tandaan

*   Ang Bureau of Customs ay nasa ilalim ng Department of Finance.

🎯 Board Exam Tip

Sobrang basic, pero tandaan na kapag "Bureau", BOC ito. Kapag "Commission", Tariff Commission ito (hindi Civil Service Commission).

❓ Madalas Malito ang Students

*   **Tanong:** Bakit kailangan pa itong i-define kung obvious naman?
*   **Sagot:** Sa paggawa ng batas (statutory construction), kailangang walang puwang sa maling interpretasyon. Standard practice sa batas na i-define ang mga dinadaglat na salita.

🔗 Related Topics

*   Sec. 102 (l) - Commission

🤖 Need More Explanation?

In the context of the Philippine CMTA, explain why basic terms like 'Bureau' are explicitly defined in Section 102.`,prompt:"In the context of the Philippine CMTA, explain why basic terms like 'Bureau' are explicitly defined in Section 102."},211:{_label:"paragraph (j) Carrier — ",title:"Ano ang Carrier? (Section 102j)",content:`📖 Kahulugan

Ang Carrier ay ang tao, kumpanya, o entity na may hawak, nag-o-operate, at responsable sa mismong pagbiyahe at paglipat ng mga kargamento mula sa isang lugar patungo sa iba.

🔍 Breakdown

*   **Person actually transporting goods:** Sila ang nagdadala (gaya ng shipping lines o airlines).
*   **Responsible for the operation of the means of transport:** Kasama ang mga nag-o-operate ng barko, eroplano, pati na rin ang mga freight forwarders, cargo consolidators, at NVOCC na responsable sa kargamento habang in-transit.

💡 Simpleng Paliwanag

Sila ang mga "taga-deliver" o "transporter" sa malakihang bulto. Sila ang nagmamay-ari o umuupa ng barko o eroplano para dalhin ang mga kalakal mula abroad papunta sa Pilipinas (o vice versa).

📦 Halimbawa

Mga sikat na carriers na madalas ma-encounter sa Customs ay ang Philippine Airlines (airlines), Maersk o Evergreen (shipping lines), at mga malalaking consolidators na may pananagutan sa paghahatid ng goods mo nang ligtas.

⭐ Bakit Mahalaga Ito?

May malaking obligasyon ang carrier sa Customs. Bago pa man dumating ang barko o eroplano, obligado ang carrier na i-submit ang Inward Foreign Manifest (IFM) sa Bureau of Customs. Sila rin ang nag-i-issue ng transport documents gaya ng B/L at AWB.

⚠️ Dapat Tandaan

*   Sa ilalim ng CMTA, kahit hindi pag-aari ng isang NVOCC ang barko, itinuturing pa rin siyang "carrier" pagdating sa obligasyon sa kargamento ng kanyang kliyente.

🎯 Board Exam Tip

Sa batas, ang carrier ay may "extraordinary diligence" na dapat sundin sa pangangalaga ng goods, ayon sa Civil Code of the Philippines.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Carrier at Freight Forwarder?
*   **Sagot:** Ang Freight Forwarder ay isang klase ng carrier sa paningin ng batas kung sila ang umaako sa responsibilidad ng paglipat ng kargamento, kahit na umuupa lang din sila ng espasyo sa isang main shipping line.

🔗 Related Topics

*   Sec. 102 (h) - Bill of Lading
*   Sec. 102 (ee) - NVOCC
*   Title IV, Chapter 1 - Advance Customs Manifest

🤖 Need More Explanation?

Explain the definition of 'Carrier' under Section 102(j) of the CMTA. What are the key responsibilities of a carrier towards the Bureau of Customs upon arrival of a vessel or aircraft?`,prompt:"Explain the definition of 'Carrier' under Section 102(j) of the CMTA. What are the key responsibilities of a carrier towards the Bureau of Customs upon arrival of a vessel or aircraft?"},212:{_label:"paragraph (k) Clearance — ",title:"Ano ang Clearance? (Section 102k)",content:`📖 Kahulugan

Ang Clearance ay ang pinal at kumpletong pag-apruba ng Customs na tapos na ang lahat ng proseso, bayaran, at dokumento kaya pinapayagan nang ilabas, i-export, o ipasa ang kargamento.

🔍 Breakdown

*   **Completion of customs and other government formalities:** Ibig sabihin, nagawa na ang lahat ng hinihingi ng batas (pagbayad ng buwis, pagbigay ng permits).
*   **Allow goods to enter... or to be exported:** Ang resulta ng clearance ay ang kalayaan ng goods na gawin ang kanyang layunin (kunin ng importer, ipasok sa warehouse, o ilabas ng bansa).

💡 Simpleng Paliwanag

Ito ang "Green Light" o go-signal. Kapag sinabi ng examiner na "Cleared" na ang goods mo, ibig sabihin pasado ka na. Wala ka nang utang na buwis, tama ang papel mo, at pwede mo nang kunin ang kargamento mo para iuwi.

📦 Halimbawa

Nag-import ka ng computer parts. Pagkatapos mong i-file ang goods declaration, binayaran mo ang duties and taxes, at nai-submit mo ang clearance mula sa NTC (National Telecommunications Commission). Dahil kumpleto na, ibibigay na ng BOC ang "Customs Clearance", at pwede nang kargahin ng truck ang computer parts palabas ng pantalan.

⭐ Bakit Mahalaga Ito?

Ito ang pinaka-goal ng bawat Customs Broker at importer. Hangga't walang clearance, nasa ilalim pa rin ng kontrol ng Customs (jurisdictional control) ang kargamento at hindi ito pwedeng galawin ng may-ari.

⚠️ Dapat Tandaan

*   Hindi lang Customs formalities ang kailangan para magka-clearance. Kailangan din ang "other government formalities" (tulad ng permits mula sa FDA, DA, o DTI kung regulated ang goods).

🎯 Board Exam Tip

Tandaan na ang Clearance ay iba sa Release. Ang Clearance ay ang pagkumpleto ng proseso; ang Release ay ang mismong pagbibigay ng physical custody ng goods matapos ang clearance.

❓ Madalas Malito ang Students

*   **Tanong:** Kung bayad na ang buwis, automatic cleared na ba?
*   **Sagot:** Hindi palagi. Kung bayad na ang buwis pero may kulang kang Import Permit, hindi mo pa rin makukuha ang Customs Clearance.

🔗 Related Topics

*   Sec. 102 (kk) - Release of Goods
*   Sec. 117 - Regulated Importation

🤖 Need More Explanation?

Explain the concept of 'Clearance' under Section 102(k) of the CMTA. Why is paying duties and taxes sometimes not enough to achieve full customs clearance? Give an example involving other government agencies.`,prompt:"Explain the concept of 'Clearance' under Section 102(k) of the CMTA. Why is paying duties and taxes sometimes not enough to achieve full customs clearance? Give an example involving other government agencies."},213:{_label:"paragraph (l) Commission — ",title:"Ano ang Commission? (Section 102l)",content:`📖 Kahulugan

Kapag ginamit ang salitang "Commission" sa loob ng CMTA, ito ay tumutukoy sa Tariff Commission.

🔍 Breakdown

*   **Tariff Commission:** Ito ang ahensya ng gobyerno na eksperto pagdating sa pag-aaral, pag-classify ng mga kalakal, at pag-recommend ng mga rate ng taripa na dapat ipataw sa mga imports.

💡 Simpleng Paliwanag

Kung ang "Bureau" ay BOC, ang "Commission" ay ang Tariff Commission. Sila ang "think-tank" na tumutulong mag-decide kung anong HS Code ang tamang gamitin o kung dapat bang taasan o babaan ang buwis sa isang partikular na produkto para protektahan ang mga lokal na magsasaka at negosyante.

📦 Halimbawa

Kung nalilito ka kung ang na-import mong bagong klase ng kemikal ay papatawan ng 0% o 5% tariff, pwede kang humingi ng "Advance Ruling" sa Tariff Commission para siguradong tama ang HS Code classification mo bago pa man dumating ang barko.

⭐ Bakit Mahalaga Ito?

Ang Tariff Commission ay hiwalay at independiyenteng ahensya mula sa BOC. Mahalaga sila dahil sila ang gumagawa ng malalimang pag-aaral (investigation) bago gamitin ng Presidente ang kanyang kapangyarihan na magbago ng tariff rates (Flexible Clause).

⚠️ Dapat Tandaan

*   Ang Bureau of Customs ay nasa ilalim ng Department of Finance (DOF).
*   **Update sa currency:** Noong Abril 2025, ni-reorganize ng RA 12145 ang NEDA papuntang Department of Economy, Planning, and Development (DEPDev). Ang Tariff Commission ay attached agency ngayon ng DEPDev (dating NEDA) para sa administrative supervision. Sa mismong teksto ng CMTA (hal. Flexible Clause), "NEDA" pa rin ang nakasulat dahil hindi pa na-amend ang batas mismo — kaya sa exam, alamin kung tinatanong ang literal na text ng batas (NEDA) o ang kasalukuyang ahensya (DEPDev).

🎯 Board Exam Tip

Kapag ang tanong sa exam ay tungkol sa ahensya na may hawak ng "Advance Ruling for Tariff Classification", ang tamang sagot ay Tariff Commission, HINDI Bureau of Customs. Kung tinatanong ang "attached agency" ng Tariff Commission base sa literal na CMTA text, NEDA ang sagot; kung tinatanong ang kasalukuyang set-up, DEPDev na.

❓ Madalas Malito ang Students

*   **Tanong:** Sila ba ang nangongolekta ng buwis?
*   **Sagot:** Hindi. Ang BOC ang nangongolekta ng buwis. Ang Tariff Commission ang nagtatakda/nagaaral ng classification at rates.

🔗 Related Topics

*   Sec. 1100 - Classification Ruling (issued by the Commission)
*   Title XVI - Tariff Administration and Policy (Tariff Commission)
*   RA 12145 - NEDA to DEPDev reorganization

🤖 Need More Explanation?

Define 'Commission' under Section 102(l) of the CMTA. What is the role of the Tariff Commission in the Philippine customs setup, specifically regarding tariff classification and advance rulings, compared to the Bureau of Customs? Note the 2025 reorganization of its parent agency from NEDA to DEPDev.`,prompt:"Define 'Commission' under Section 102(l) of the CMTA. What is the role of the Tariff Commission in the Philippine customs setup, specifically regarding tariff classification and advance rulings, compared to the Bureau of Customs? Note the 2025 reorganization of its parent agency from NEDA to DEPDev."},214:{_label:"paragraph (m) Conditional Importation — ",title:"Ano ang Conditional Importation? (Section 102m)",content:`📖 Kahulugan

Ang Conditional Importation (kilala rin bilang Temporary Admission) ay isang pribilehiyo kung saan pinapayagan kang magpasok ng kargamento sa Pilipinas nang hindi nagbabayad ng buwis o may bawas na buwis, sa **kondisyon** na gagamitin lang ito para sa isang tiyak na layunin at ibabalik din sa ibang bansa matapos gamitin.

🔍 Breakdown

*   **Temporary admission:** Pansamantala lang ang pag-stay ng goods sa bansa.
*   **Conditionally relieved from duties and taxes:** Libre (o partially libre) sa buwis, pero may kapalit na pangako o kondisyon.
*   **Specific purpose:** May malinaw na dahilan ang pagpasok (e.g., ipapakita sa exhibit, sasali sa contest).
*   **Intended for reexportation:** Obligadong ilabas muli ng Pilipinas pagkatapos ng itinakdang araw.
*   **Without having undergone any substantial change:** Hindi pwedeng baguhin ang itsura o i-manufacture. Kung paano pumasok, ganoon din lalabas (pwera lang sa normal na pagkaluma o depreciation dahil ginamit).

💡 Simpleng Paliwanag

Ito ay parang "hiram". Humiram ka ng kagamitan galing abroad para gamitin nang panandalian dito sa Pilipinas. Dahil hindi mo naman ibebenta rito, hindi ka sisingilin ng Customs ng buwis. Pero kapag hindi mo binalik sa ibang bansa sa takdang oras, magiging utang mo na ang buwis.

📦 Halimbawa

Magkakaroon ng concert si Taylor Swift sa Philippine Arena. Ang mga instruments, stage props, at malalaking speakers nila ay ipapasok sa bansa. Ipapapasok ito ng Customs sa ilalim ng Conditional Importation (tax-free). Pagkatapos ng concert tour, ikakarga ulit sa eroplano pabalik lahat ng ginamit. Hindi binago ang gamit, kaya pasado ito sa kondisyon.

⭐ Bakit Mahalaga Ito?

Tinutulungan nito ang bansa na makapag-host ng mga international events, makakuha ng temporary repairs, at makapag-exhibit ng mga teknolohiya na hindi nagbibigay ng pabigat (buwis) sa mga dayuhan, dahil alam naman nating babalik din ang mga ito sa pinanggalingan nila.

⚠️ Dapat Tandaan

*   Kahit tax-free, kailangang mag-post ng bond (security) ang importer na katumbas ng buwis na dapat sana ay babayaran. Kapag hindi nila inilabas ang kargamento (reexport), kukunin ng Customs ang bond bilang pambayad.

🎯 Board Exam Tip

Kabisaduhin ang keyword na "reexportation within a specified period" at "without undergoing substantial change". Ito ang malaking kaibahan nito sa Free Zones kung saan ang raw materials ay dumadaan sa manufacturing o substantial change.

❓ Madalas Malito ang Students

*   **Tanong:** Paano kung habang ginagamit sa Pilipinas ay nasira at binago nang husto ang kargamento?
*   **Sagot:** Mawawala ang pribilehiyo ng Conditional Importation dahil nagkaroon ng "substantial change". Ang importer ay pagbabayarin na ng kaukulang buwis at taripa.

🔗 Related Topics

*   Sec. 800 - Conditionally Free Importations
*   Sec. 102 (jj) - Reexportation

🤖 Need More Explanation?

Explain 'Conditional Importation' under Section 102(m) of the CMTA. What are the strict conditions required by law to enjoy tax-free temporary admission? Give practical examples like international concerts or sports events.`,prompt:"Explain 'Conditional Importation' under Section 102(m) of the CMTA. What are the strict conditions required by law to enjoy tax-free temporary admission? Give practical examples like international concerts or sports events."},215:{_label:"paragraph (n) Customs Broker — ",title:"Ano ang Customs Broker? (Section 102n)",content:`📖 Kahulugan

Ang Customs Broker ay isang propesyonal na nakapasa sa board exam, may lisensya mula sa PRC, at rehistrado sa pamahalaan para maging eksperto sa pag-aayos at pagpo-proseso ng mga kargamento sa Customs sa ngalan ng mga importer at exporter.

🔍 Breakdown

*   **Bona fide holder of a valid Certificate of Registration / PIC:** Dapat may valid na ID at certificate (lisensya) mula sa gobyerno. Hindi ito pwedeng pekehin o ipagamit sa iba.
*   **Issued by PRB and PRC:** Ang Professional Regulatory Board for Customs Brokers (PRB) at Professional Regulation Commission (PRC) ang tanging pwedeng magbigay ng lisensya.
*   **Pursuant to Republic Act No. 9280:** Ito ang batas na nagre-regulate sa propesyon ng mga Customs Broker (Customs Brokers Act of 2004).

💡 Simpleng Paliwanag

Tulad ng isang Abugado na kumakatawan sa iyo sa korte, ang Customs Broker ang kumakatawan sa iyo sa Customs. Sila ang nag-aral nang apat na taon (BSCA), pumasa sa mahirap na board exam, at may lisensya para alamin kung magkano ang babayaran mong buwis at paano mapapalabas ang kargamento mo nang legal.

📦 Halimbawa

Isang negosyante ang bumili ng makinarya mula Germany, pero wala siyang alam sa pag-i-import. Kukuha siya ng isang lisensyadong Customs Broker. Ang Broker ang magta-type ng Goods Declaration, magko-compute ng buwis, at pipirma sa dokumento bilang propesyonal bago ito i-submit sa Bureau of Customs.

⭐ Bakit Mahalaga Ito?

Pinoprotektahan ng probisyon na ito ang propesyon. Ibig sabihin, hindi pwedeng mag-astang "broker" o "fixer" ang kahit sino lang. Kailangan ng sapat na edukasyon at lisensya dahil ang paggawa ng mali sa Customs ay pwedeng magresulta sa milyun-milyong pisong multa o pagkakulong.

⚠️ Dapat Tandaan

*   Sa ilalim ng CMTA, ang Customs Broker ay may pananagutan sa katumpakan (accuracy) ng deklarasyon, ngunit **hindi** siya ang mananagot sa pagbabayad ng buwis (ang importer ang magbabayad nun).
*   **Update — SC ruling 2023:** Sinuportahan ng Korte Suprema (Feb. 20, 2023 decision, na-release later that year) ang constitutionality ng Section 106(d), na nagpapahintulot sa isang duly-authorized agent o attorney-in-fact (hindi lisensyadong broker) na maging declarant at pumirma ng goods declaration. Ito ay dahil sa petisyon ng Chamber of Customs Brokers, Inc. (CCBI) na tinanggihan ng Korte Suprema.

🎯 Board Exam Tip

Huwag kalimutan ang RA 9280 (Customs Brokers Act of 2004). Paboritong itanong ito sa unang subject ng board exam (Customs Laws). Kasabay nito, alamin ang 2023 SC ruling na nagpapatibay sa Sec. 106(d) — malaking indikasyon ito na hindi na eksklusibo sa brokers ang karapatang pumirma ng goods declaration.

❓ Madalas Malito ang Students

*   **Tanong:** Obligado ba ang importer na kumuha ng Customs Broker?
*   **Sagot:** May dalawang antas ito. Una, sa Sec. 106, may two-year transition period mula sa effectivity ng CMTA (2016–2018) kung saan broker lang ang pwedeng pumirma. Pangalawa, matapos ang transition, pwede na ring pumirma ang isang duly-authorized agent/attorney-in-fact sa ilalim ng subparagraph (d) — at kinumpirma ito bilang constitutional ng Korte Suprema noong 2023, kahit tinutulan ito ng CCBI. Sa praktika, karamihan ng commercial imports ay gumagamit pa rin ng broker dahil sa technical na kaalaman nila.

🔗 Related Topics

*   Sec. 106 - Declarant
*   Sec. 107 - Rights and Responsibilities of the Declarant
*   Republic Act No. 9280
*   CCBI vs. constitutionality of Sec. 106(d) — 2023 SC decision

🤖 Need More Explanation?

Explain the definition and role of a 'Customs Broker' under Section 102(n) of the CMTA in relation to RA 9280. Include the 2023 Supreme Court ruling upholding Section 106(d), which allows non-broker declarants. What makes brokers different from regular fixers, and what are their primary responsibilities when filing a goods declaration?`,prompt:"Explain the definition and role of a 'Customs Broker' under Section 102(n) of the CMTA in relation to RA 9280. Include the 2023 Supreme Court ruling upholding Section 106(d), which allows non-broker declarants. What makes brokers different from regular fixers, and what are their primary responsibilities when filing a goods declaration?"},216:{_label:"paragraph (o) Customs Office — ",title:"Ano ang Customs Office? (Section 102o)",content:`📖 Kahulugan

Ang Customs Office ay anumang opisina, departamento, o yunit sa loob ng Bureau of Customs na may kapangyarihang gumawa at magpatupad ng mga trabahong nakasaad sa batas tungkol sa kalakalan at taripa.

🔍 Breakdown

*   **Any customs administrative unit:** Pwedeng tumukoy ito sa isang buong building (tulad ng Port of Manila) o sa isang maliit na division (tulad ng Formal Entry Division).
*   **Competent and authorized:** Dapat may opisyal na utos at kapangyarihan mula sa Commissioner para gawin ang trabaho nila.
*   **Perform functions enumerated under customs laws:** Ang trabaho ay base sa kung ano ang inutos ng CMTA (halimbawa: pangongolekta ng buwis, pag-iinspeksyon ng bagahe).

💡 Simpleng Paliwanag

Kahit anong opisina na pagmamay-ari at pinapatakbo ng Bureau of Customs para gawin ang trabaho nila. Mula sa main building sa Manila, hanggang sa maliit na desk ng examiner sa airport, ituturing itong Customs Office.

📦 Halimbawa

Kung sasabihin ng batas na "Goods must be presented to the nearest Customs Office", ibig sabihin kailangan mong dalhin ang dokumento at kargamento mo sa pinakamalapit na Port of Entry o Sub-port (hal. Port of Cebu o Sub-port of Mactan) dahil authorized sila na mag-process niyan.

⭐ Bakit Mahalaga Ito?

Mahalaga itong malaman dahil ang mga legal na dokumento (tulad ng protest o goods declaration) ay dapat i-file lamang sa isang tamang "Customs Office" at hindi sa kahit saan-saang sangay ng gobyerno.

⚠️ Dapat Tandaan

*   Ang isang opisina ay hindi pwedeng gumawa ng aksyon (gaya ng seizure) kung wala sa hurisdiksyon nila ang trabahong iyon. Dapat sila ay "competent and authorized" sa partikular na gawaing iyon.

🎯 Board Exam Tip

Intindihin na ang Customs Office ay hindi lang tumutukoy sa gusali kundi sa mismong *administrative unit* (grupo ng mga tao at opisyales na binigyan ng kapangyarihan).

❓ Madalas Malito ang Students

*   **Tanong:** Ang booth ba ng Customs sa airport ay isang Customs Office?
*   **Sagot:** Oo. Kahit maliit itong booth, basta may mga authorized Customs Officers doon na nag-a-assess ng buwis ng mga travelers, ito ay isang Customs Office.

🔗 Related Topics

*   Sec. 200 - Chief Officials of the Bureau
*   Sec. 206 - Customs Districts and Ports of Entry

🤖 Need More Explanation?

Define 'Customs Office' under Section 102(o) of the CMTA. Does this only refer to physical buildings like the Port of Manila, or does it include administrative units within the Bureau?`,prompt:"Define 'Customs Office' under Section 102(o) of the CMTA. Does this only refer to physical buildings like the Port of Manila, or does it include administrative units within the Bureau?"},217:{_label:"paragraph (p) Customs Officer — ",title:"Ano ang Customs Officer? (Section 102p)",content:`📖 Kahulugan

Ang Customs Officer ay isang empleyado ng Bureau of Customs na may kapangyarihang magdesisyon at gumamit ng sariling pang-unawa (discretion) sa pagpapatupad ng batas, hindi lang basta taga-type o taga-ayos ng papel.

🔍 Breakdown

*   **Distinguished from a clerk or employee:** Hindi lahat ng empleyado ng BOC ay "Customs Officer". Hiwalay sila sa mga utility worker, janitor, o data encoders na clerical lang ang trabaho.
*   **Involves the exercise of discretion:** May kapangyarihan silang mag-aral ng kaso, magdesisyon kung tama o mali ang deklarasyon, at mag-approve o mag-deny.
*   **Authorized to perform a specific function:** Sila ang inutusan ng batas na gumawa ng mahahalagang desisyon gaya ng pag-assess ng buwis.

💡 Simpleng Paliwanag

Ang Customs Officer ay ang mga may "say" o kapangyarihan sa kargamento mo. Halimbawa, ang Customs Examiner o Appraiser na magde-decide kung tama ang buwis na binabayaran mo. Iba sila sa mga empleyado na taga-receive lang ng papel sa window (clerk).

📦 Halimbawa

Kung ang nag-receive ng papeles mo ay isang clerk sa opisina, hindi siya ang magde-decide kung may penalty ka. Ang papeles ay ipapasa sa isang Customs Operations Officer (COO) na siyang mag-aaral nito, gagamit ng kanyang "discretion", at magpapataw ng tamang buwis o penalty. Ang COO ang tinatawag na Customs Officer.

⭐ Bakit Mahalaga Ito?

May mga batas at kaparusahan na applicable lamang sa mga "Customs Officers". Halimbawa, mas mabigat ang parusa kapag ang isang Customs Officer na may kapangyarihan (discretion) ay tumanggap ng suhol, kumpara sa simpleng manual laborer.

⚠️ Dapat Tandaan

*   Ang keyword dito ay **"exercise of discretion"**. Ang kapangyarihang magpasya ay ang pangunahing kaibahan ng Customs Officer sa isang ordinaryong empleyado ng BOC.

🎯 Board Exam Tip

Kung may tanong sa exam: "Refers to a person whose duty involves the exercise of discretion..." matik, ang sagot ay Customs Officer.

❓ Madalas Malito ang Students

*   **Tanong:** Customs Officer din ba ang mga pulis sa pantalan?
*   **Sagot:** Hindi sila BOC Customs Officers kung sila ay miyembro ng ibang ahensya (tulad ng PPA Police o Coast Guard), maliban na lang kung sila ay binigyan ng deputization ng Commissioner of Customs para magpatupad ng customs laws.

🔗 Related Topics

*   Title II, Chapter 1 - Bureau of Customs (Personnel)
*   Police Authority of Customs Officers

🤖 Need More Explanation?

Explain the distinction between a 'Customs Officer' and a regular customs employee under Section 102(p) of the CMTA. Why is the element of 'exercise of discretion' central to this definition?`,prompt:"Explain the distinction between a 'Customs Officer' and a regular customs employee under Section 102(p) of the CMTA. Why is the element of 'exercise of discretion' central to this definition?"},218:{_label:"paragraph (q) Customs Territory — ",title:"Ano ang Customs Territory? (Section 102q)",content:`📖 Kahulugan

Ang Customs Territory ay tumutukoy sa mga bahagi ng Pilipinas kung saan ang mga batas sa taripa at pagbubuwis ng Bureau of Customs ay mahigpit at ganap na ipinapatupad.

🔍 Breakdown

*   **Areas in the Philippines:** Ang lupa, tubig, at himpapawid na sakop ng Republika ng Pilipinas.
*   **Where customs and tariff laws may be enforced:** Ibig sabihin, kapag pumasok dito ang dayuhang kalakal, tatamaan agad ito ng buwis (Customs Duty at VAT).

💡 Simpleng Paliwanag

Ito ang "regular" na Pilipinas. Lahat ng lugar sa Pilipinas (Manila, Cebu, probinsya, kalsada) kung saan kailangan mong magbayad ng buwis bago magbenta ng imported na produkto, iyon ang Customs Territory. HINDI kasama dito ang mga Free Zones (tulad ng PEZA at Subic) dahil itinuturing silang "hiwalay" (foreign territory sa paningin ng batas) pagdating sa buwis.

📦 Halimbawa

Kung ang imported na sapatos ay dumating sa Port of Manila at dinala sa isang mall sa Makati, pumasok na ito sa "Customs Territory". Obligadong magbayad ng buwis ang nag-import bago ito ilabas ng pantalan. Pero kung dinala ito sa Clark Freeport Zone (Free Zone), hindi pa ito pumasok sa Customs Territory, kaya wala pang buwis.

⭐ Bakit Mahalaga Ito?

Ang pagtukoy kung nasaan ang Customs Territory ay nagsasabi kung kailan maniningil ng buwis ang gobyerno. Kapag tumawid na sa border ng Customs Territory ang kargamento galing abroad o galing sa Free Zone, kailangan nang mag-file ng "Entry" at magbayad.

⚠️ Dapat Tandaan

*   **Formula sa isip:** Philippine Territory = Customs Territory + Free Zones.
*   Kahit nasa Pilipinas ang Subic at PEZA, legally speaking, sila ay itinuturing na *labas* ng Customs Territory para sa layunin ng customs duties.

🎯 Board Exam Tip

Pag-aralang mabuti ang relasyon ng Free Zone at Customs Territory. Kapag naglabas ka ng kargamento mula sa PEZA (Free Zone) at idideliver mo sa ordinaryong pabrika sa Manila (Customs Territory), magbabayad ka pa rin ng buwis, at tinatawag din itong "Importation".

❓ Madalas Malito ang Students

*   **Tanong:** Kung Customs territory ang Pilipinas, bakit hindi pwedeng manghuli ang BOC sa loob ng PEZA?
*   **Sagot:** Dahil ang PEZA ay isang Free Zone. May sarili silang charter at umiiral na rules, at itinuturing itong foreign soil para sa customs duty purposes (maliban kung may nahuling smuggled goods na pumasok doon na pwedeng habulin ng BOC).

🔗 Related Topics

*   Sec. 102 (w) - Free Zone
*   Sec. 102 (r) - Entry

🤖 Need More Explanation?

Explain the concept of 'Customs Territory' under Section 102(q) of the CMTA. Why are Free Zones legally separate from the Customs Territory even though they are geographically inside the Philippines? Provide examples.`,prompt:"Explain the concept of 'Customs Territory' under Section 102(q) of the CMTA. Why are Free Zones legally separate from the Customs Territory even though they are geographically inside the Philippines? Provide examples."},219:{_label:"paragraph (r) Entry — ",title:"Ano ang Entry? (Section 102r)",content:`📖 Kahulugan

Ang Entry ay ang pormal na pagpapahayag, pagpa-proseso, at pagpapasok ng mga imported na kargamento papunta sa Customs Territory (mga lugar na may buwis sa Pilipinas).

🔍 Breakdown

*   **Act, documentation and process:** Hindi lang ito simpleng pagpasok. Kailangan ng papel (goods declaration), pag-process ng papel na ito, at ang pisikal na pagdating ng goods.
*   **Bringing imported goods into the customs territory:** Ipinapasok sa lugar kung saan pinapatawan ng buwis at taripa.
*   **Including goods coming from free zones:** Kahit na ang kargamento ay galing na sa Clark (na nasa Pilipinas na), kapag ilalabas ito at ibebenta sa Manila, itinuturing pa rin itong "Entry".

💡 Simpleng Paliwanag

Ito ang pormal na "pag-check-in" ng kargamento. Kapag may dumating na padala mula abroad, hindi mo pwedeng kunin na lang basta. Kailangan mong mag-file ng dokumento para ipaalam sa gobyerno na ipapasok mo ito sa merkado natin at handa kang magbayad ng buwis. Ang buong prosesong ito ang tawag na "Entry".

📦 Halimbawa

May dumating na isang container ng damit galing South Korea. Upang mailabas mo ito ng pantalan at maibenta sa Divisoria, kailangan ng Customs Broker mo na mag-file ng "Formal Entry" sa e2m system ng Customs, mag-assess ng buwis, at magbayad. Ang tawag sa ginawa ng broker mo ay Entry.

⭐ Bakit Mahalaga Ito?

Kapag walang Entry, ang pagpasok ng goods ay nagiging iligal o smuggled. Ito rin ang hudyat kung kailan magsisimulang mag-compute at maningil ng duties and taxes ang BOC.

⚠️ Dapat Tandaan

*   Pagpasok sa Customs Territory = ENTRY.
*   Pagpasok sa Free Zone = ADMISSION.

🎯 Board Exam Tip

Laging pinagkukumpara ang Entry at Admission sa mga exams. Tandaan ang destinasyon. Kapag ang destination ay "Customs Territory", ang terminong ginagamit sa CMTA ay Entry.

❓ Madalas Malito ang Students

*   **Tanong:** Kung ang kargamento ay galing sa PEZA Cavite tapos dinala sa SM Mall of Asia (MOA), Importation/Entry ba yun?
*   **Sagot:** OO. Kahit magkatabi lang ang Cavite at Pasay, dahil ang PEZA ay Free Zone (parang abroad) at ang MOA ay Customs Territory, ang paglipat ng goods ay dumadaan sa proseso ng Entry at magbabayad ng buwis.

🔗 Related Topics

*   Sec. 102 (c) - Admission
*   Sec. 102 (q) - Customs Territory
*   Sec. 116 - Free Zones

🤖 Need More Explanation?

Define the term 'Entry' under Section 102(r) of the CMTA. Clearly differentiate 'Entry' into the Customs Territory versus 'Admission' into a Free Zone. Provide a practical example of a shipment from Subic Freeport being brought into Metro Manila.`,prompt:"Define the term 'Entry' under Section 102(r) of the CMTA. Clearly differentiate 'Entry' into the Customs Territory versus 'Admission' into a Free Zone. Provide a practical example of a shipment from Subic Freeport being brought into Metro Manila."},220:{_label:"paragraph (s) Exportation — ",title:"Ano ang Exportation? (Section 102s)",content:`📖 Kahulugan

Ang Exportation ay ang kumpletong kilos, pagpa-proseso ng dokumento, at pagpapadala ng mga kalakal palabas ng teritoryo ng Pilipinas papunta sa ibang bansa.

🔍 Breakdown

*   **Act, documentation, and process:** Kailangan andoon yung mismong pag-load sa barko/eroplano (act), ang pag-file ng papel (documentation), at pagkumpleto ng requirements sa Customs (process).
*   **Bringing goods out of Philippine territory:** Paglalabas ng mga kalakal sa border ng ating bansa.

💡 Simpleng Paliwanag

Kabaligtaran ng Import. Kung gumawa ka ng produkto dito sa Pilipinas at ipinadala mo, ibinenta mo, o dinala mo sa ibang bansa (tulad ng US o Japan), ang tawag dyan ay Exportation.

📦 Halimbawa

Isang negosyante sa Davao ay nagbabalot ng mga saging (Cavendish bananas). Gagawa siya ng Export Declaration at ipo-process ito sa Customs, pagkatapos ay ikakarga ang mga saging sa barkong papuntang China. Ang prosesong ito ay Exportation.

⭐ Bakit Mahalaga Ito?

Gusto ng gobyerno na suportahan ang exportation dahil nagpapasok ito ng dolyar sa bansa. Kaya madalas, ang mga in-e-export na kalakal ay walang ipinapataw na taripa at zero-rated sa VAT, pero kailangan pa rin itong idaan sa tamang dokumentasyon para ma-record ng bansa (statistics).

⚠️ Dapat Tandaan

*   Kahit tax-free ang karamihan sa mga exports, hindi ibig sabihin ay hindi ka na magpa-file ng papel. Obligado pa rin ang "Export Declaration".
*   Kung ang kargamento ay smuggled palabas ng bansa, ito ay tinatawag na "fraudulent exportation" o smuggling.

🎯 Board Exam Tip

Alamin na may dalawang uri nito na nabanggit sa batas: (1) Actual/Outright Exportation at (2) Conditional Exportation (e.g. pagpapalabas para i-repair tapos ibabalik din).

❓ Madalas Malito ang Students

*   **Tanong:** May binabayaran bang buwis kapag mag-eexport?
*   **Sagot:** Sa Pilipinas, pangkalahatang walang export tax o duty para suportahan ang mga lokal na negosyo, maliban na lang kung may special na batas na nagpapataw nito sa mga partikular na produkto (tulad ng mga logs dati).

🔗 Related Topics

*   Sec. 102 (b) - Actual or Outright Exportation
*   Sec. 102 (t) - Export Declaration

🤖 Need More Explanation?

Explain the concept of 'Exportation' under Section 102(s) of the CMTA. Why is accurate documentation required for exportation even if there are generally no export duties in the Philippines?`,prompt:"Explain the concept of 'Exportation' under Section 102(s) of the CMTA. Why is accurate documentation required for exportation even if there are generally no export duties in the Philippines?"},221:{_label:"paragraph (t) Export Declaration — ",title:"Ano ang Export Declaration? (Section 102t)",content:`📖 Kahulugan

Ang Export Declaration ay ang pormal na form o papel (ngayon ay electronically filed) kung saan isinasaad ng nagpapadala (exporter) ang lahat ng detalye ng mga kalakal na gusto niyang ilabas ng Pilipinas upang humingi ng clearance sa Customs.

🔍 Breakdown

*   **Statement made in the manner prescribed:** Pormal na dokumento, madalas ay ine-encode sa system (Single Administrative Document o SAD) base sa format ng BOC.
*   **Indicate the procedure to be observed:** Kung ito ba ay outright export (hindi na babalik) o for repair (babago at ibabalik).
*   **Particulars of which the customs... require:** Naglalaman ng detalye gaya ng dami, bigat, halaga, at classification ng produkto.

💡 Simpleng Paliwanag

Ito ang application form mo palabas. Bago ka makaalis ng Pilipinas na may dalang commercial quantity ng kargamento, kailangan mong sabihin sa gobyerno kung ano ito, saan pupunta, at magkano ang halaga. Nakasulat lahat ito sa Export Declaration.

📦 Halimbawa

Bago ikarga ang isang container ng mga gawang-kamay na bagik (rattan bags) papuntang Europe, magsa-submit ang Customs Broker mo ng Single Administrative Document (Export Declaration) sa system ng Customs. Idedeklara doon na nagkakahalaga ito ng $10,000, 500 piraso, at intended for outright export.

⭐ Bakit Mahalaga Ito?

Ito ay kailangan para sa (1) pag-monitor na walang kontrabandong lalabas ng bansa, (2) pagkolekta ng statistics ng PSA para sa ekonomiya, at (3) pagpapatunay sa BIR na na-export talaga ang goods para sa Zero-Rated VAT applications ng exporter.

⚠️ Dapat Tandaan

*   Ang Export Declaration (ED) para sa nilalabas, ang Import/Goods Declaration (ID) para sa pinapasok.

🎯 Board Exam Tip

May mga government agencies bukod sa BOC na humihingi ng Export Declaration, gaya ng Bangko Sentral ng Pilipinas (BSP) para sa monitoring ng foreign exchange, kaya sinabi sa batas na "prescribed by the Bureau and other appropriate agencies".

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan pa rin ba ng Customs Broker kapag magpa-file ng Export Declaration?
*   **Sagot:** Oo, sa kasalukuyang rules, licensed Customs Brokers ang pumipirma at naglo-lodge ng Export Declarations para sa commercial shipments.

🔗 Related Topics

*   Sec. 102 (s) - Exportation
*   Title V - Export Clearance and Operations

🤖 Need More Explanation?

Explain what an 'Export Declaration' is under Section 102(t) of the CMTA. What specific details must be included in this declaration and why is it crucial for economic statistics and taxation (like VAT zero-rating)?`,prompt:"Explain what an 'Export Declaration' is under Section 102(t) of the CMTA. What specific details must be included in this declaration and why is it crucial for economic statistics and taxation (like VAT zero-rating)?"},222:{_label:"paragraph (u) Flexible Clause — ",title:"Ano ang Flexible Clause? (Section 102u)",content:`📖 Kahulugan

Ang Flexible Clause ay ang espesyal na kapangyarihan ng Presidente ng Pilipinas na baguhin ang mga taripa o buwis sa mga imported na kalakal, o ipagbawal ang pagpasok ng ilang produkto, para maprotektahan ang ekonomiya, base sa rekomendasyon ng NEDA.

🔍 Breakdown

*   **Power of the President upon recommendation of NEDA:** Hindi ito pwedeng gawin ng Presidente nang basta-basta. Kailangang pag-aralan at i-rekomenda muna ito ng National Economic and Development Authority (NEDA).
*   **1) Increase, reduce or remove existing protective tariff (max 100%):** Pwedeng itaas hanggang 100% ang buwis, o tanggalin nang tuluyan.
*   **2) Establish import quota or ban:** Pwedeng limitahan (quota) kung ilang tone-toneladang bigas lang ang papasok, o i-ban nang tuluyan ang isang produkto.
*   **3) Impose additional duty (max 10%):** Pwedeng magdagdag ng panibagong hanggang 10% na buwis sa lahat ng imports kung may krisis.

💡 Simpleng Paliwanag

Normal na ang Kongreso (mga Senador at Congressman) ang gumagawa at nagpapalit ng buwis. Pero dahil mabagal ang pagpasa ng batas, binibigyan ng Kongreso ang Presidente ng kapangyarihan (Flexible Clause) na bilisan ang pagbabago ng taripa para mabilis na protektahan ang mga Pilipinong magsasaka at negosyante kung biglang bumaha ng murang imports mula sa ibang bansa.

📦 Halimbawa

Biglang bumaha ang sobrang murang sibuyas mula sa ibang bansa at nalulugi na ang mga magsasaka sa Nueva Ecija. Gamit ang Flexible Clause, at base sa pag-aaral ng NEDA, pwedeng mag-issue ang Presidente ng Executive Order na nagtataas ng taripa sa imported na sibuyas mula 30% papuntang 60% para maging patas ang laban sa presyo.

⭐ Bakit Mahalaga Ito?

Kailangan ito para sa mabilisang aksyon. Ang pambansang ekonomiya ay pabago-bago. Kung maghihintay pa na gumawa ng batas ang Kongreso, baka patay na ang lokal na industriya natin.

⚠️ Dapat Tandaan

*   Ang Presidente ay hindi pwedeng magtaas ng protective tariff rate ng higit sa 100% ad valorem, kahit gaano pa kalala ang sitwasyon, base sa limitasyon ng batas.
*   **Update sa currency:** Sa mismong teksto ng CMTA, "NEDA" ang nakasaad na recommending agency. Noong Abril 2025, ni-reorganize ng RA 12145 ang NEDA papuntang Department of Economy, Planning, and Development (DEPDev). Hanggat hindi in-a-amend ang CMTA mismo, ang literal na sagot sa exam ay NEDA — pero alamin din na ang kasalukuyang institutional set-up ay DEPDev na.

🎯 Board Exam Tip

Kabisaduhin ang mga numerong ito:
Max Protective Tariff Rate = 100% ad valorem
Max Additional Duty = 10% ad valorem
Recommending Agency (per CMTA text) = NEDA (ngayon, DEPDev)

❓ Madalas Malito ang Students

*   **Tanong:** Tariff Commission ba ang nagrerekomenda sa Presidente?
*   **Sagot:** Ang Tariff Commission ang nagsasagawa ng investigation at public hearings, tapos ire-report nila ito sa NEDA (ngayon DEPDev), at ang ahensyang iyon ang pormal na magre-rekomenda sa Presidente.

🔗 Related Topics

*   Sec. 1608 - Flexible Clause (Detailed Section)
*   National Economic and Development Authority (NEDA) / DEPDev

🤖 Need More Explanation?

Explain the 'Flexible Clause' under Section 102(u) and Section 1608 of the CMTA. Why did Congress delegate this tariff-making power to the President? Note the 2025 reorganization of NEDA into DEPDev and how it affects the recommending agency. Give a scenario showing how the President can protect local industries using this clause.`,prompt:"Explain the 'Flexible Clause' under Section 102(u) and Section 1608 of the CMTA. Why did Congress delegate this tariff-making power to the President? Note the 2025 reorganization of NEDA into DEPDev and how it affects the recommending agency. Give a scenario showing how the President can protect local industries using this clause."},223:{_label:"paragraph (v) Foreign Exporter — ",title:"Ano ang Foreign Exporter? (Section 102v)",content:`📖 Kahulugan

Ang Foreign Exporter ay ang pangalan ng tao o kumpanya na nakasulat sa mga dokumento bilang tagapagpadala (seller/shipper) ng kargamento mula sa ibang bansa papunta sa Pilipinas, kahit pa hindi sila ang mismong gumawa (manufacturer) ng produkto.

🔍 Breakdown

*   **Whose name appears on documentation:** Sila ang nakasulat na "Shipper" o "Exporter" sa Invoice at Bill of Lading.
*   **Attesting to the export... to the Philippines:** Sila ang legal na nagbenta at nagpadala ng kalakal papunta sa atin.
*   **Regardless of the manufacturer's name:** Kahit iba ang tatak ng pabrika sa invoice, ang ituturing na exporter ay ang kumpanyang nagpadala nito.

💡 Simpleng Paliwanag

Ito ang seller mo sa abroad. Hindi kailangang sila ang nag-imbento o gumawa ng produkto. Kung bumili ka ng mga Nike shoes sa isang trading company sa Hong Kong at sila ang nagpadala sa Pilipinas, ang trading company sa Hong Kong ang "Foreign Exporter", hindi ang pabrika ng Nike sa China.

📦 Halimbawa

Bumili ka ng 50 kahon ng mga computer mouse. Ang pabrika (manufacturer) ay Logitech na nasa Taiwan. Pero binili mo ito sa "ABC Global Trading" sa Singapore. Ang nakalagay sa Commercial Invoice bilang shipper ay ABC Global Trading. Sa mata ng BOC, si ABC Global Trading ang Foreign Exporter.

⭐ Bakit Mahalaga Ito?

Mahalaga itong malaman para sa background check, risk management, at kapag inaalam kung tama ang presyo (valuation) ng goods. Ang Customs ay makikipag-ugnayan o magtitingin sa profile ng pangalan na naka-deklara bilang foreign exporter para malaman kung may history ito ng undervaluation.

⚠️ Dapat Tandaan

*   Huwag ipagkamali ang Manufacturer sa Exporter. Maaaring pareho sila, ngunit madalas ay magkaiba sa pandaigdigang kalakalan dahil sa mga middlemen (traders).

🎯 Board Exam Tip

Kabisaduhin ang linya na "regardless of the manufacturer's name in the invoice". Ito ang trigger phrase para sa definition ng Foreign Exporter.

❓ Madalas Malito ang Students

*   **Tanong:** Kung ipapa-verify ng BOC ang presyo, kanino sila titingin, sa manufacturer o sa exporter?
*   **Sagot:** Titingin sila sa kontrata (Invoice) sa pagitan ng importer at ng *foreign exporter*. Ang transaksyon na ito ang basehan ng Transaction Value.

🔗 Related Topics

*   Sec. 102 (a) - Importer (Related concept)
*   Title VII - Customs Valuation

🤖 Need More Explanation?

Explain the term 'Foreign Exporter' as defined in Section 102(v) of the CMTA. Why does the law emphasize that the exporter is considered regardless of who the actual manufacturer is? Give an example involving a trader.`,prompt:"Explain the term 'Foreign Exporter' as defined in Section 102(v) of the CMTA. Why does the law emphasize that the exporter is considered regardless of who the actual manufacturer is? Give an example involving a trader."},224:{_label:"paragraph (w) Free Zone — ",title:"Ano ang Free Zone? (Section 102w)",content:`📖 Kahulugan

Ang Free Zone ay mga espesyal at natutukoy na lugar sa Pilipinas na idineklarang walang buwis (tax at duty-free) para sa mga kalakal na pumapasok, dahil itinuturing silang parang "banyagang teritoryo" pagdating sa customs duty, upang maka-akit ng mga foreign investors.

🔍 Breakdown

*   **Special economic zones registered with PEZA (RA 7916):** Mga industrial parks tulad ng Cavite Economic Zone o Laguna Technopark.
*   **Duly chartered or legislated special economic zones and freeports:** Mga lugar na ginawan ng sariling batas ng Kongreso.
*   **Clark, Subic, Poro Point, John Hay (RA 7227 / 9400):** Mga sikat na Freeport zones na dating base militar ng Amerika.
*   **Aurora, Cagayan, Zamboanga, Bataan:** Iba pang mga specific freeports sa iba't ibang probinsya.

💡 Simpleng Paliwanag

Isipin mong ang Free Zone ay isang "bubble" sa loob ng Pilipinas. Kapag nasa loob ng bubble na ito ang mga kalakal (gaya ng makina o tela para gumawa ng sapatos), hindi ito papatawan ng buwis ng Customs. Kapag ini-export din nila agad ang mga nagawang produkto, walang buwis. Pero kung ilalabas nila ang produkto mula sa bubble at ibebenta sa ordinaryong Pilipino, doon lang sila papatawan ng buwis.

📦 Halimbawa

Isang kumpanya ng wiring harness para sa kotse ang nag-set up ng pabrika sa Clark Freeport Zone. Ang mga ina-angkat nilang makina galing Japan at mga tanso galing China ay diretso sa Clark at wala silang babayarang import duties at taxes sa BOC. Dahil dito, mas mura nilang nagagawa ang produkto na in-e-export din nila sa America.

⭐ Bakit Mahalaga Ito?

Ito ang isa sa pinakamalaking source ng trabaho sa Pilipinas. Binibigyan ng gobyerno ng pribilehiyo ang mga dayuhan (na huwag magbayad ng buwis sa raw materials) basta't magtayo sila ng pabrika sa loob ng Free Zones at mag-hire ng libu-libong Pilipino.

⚠️ Dapat Tandaan

*   Ang pagpasok ng goods sa Free Zone ay tinatawag na **Admission**, HINDI Entry.
*   Ang mga kargamento ay dumadaan pa rin sa Customs control habang ibinibiyahe patungo rito, para siguruhing hindi ililihis (divert) sa lokal na merkado ang tax-free goods.

🎯 Board Exam Tip

Sa batas, ang Free Zone ay *outside the Customs Territory*. Ito ang pinaka-importanteng konsepto na dapat mong maintindihan.

❓ Madalas Malito ang Students

*   **Tanong:** Kung wala sa Customs Territory ang Free Zone, bawal ba pumasok ang BOC diyan?
*   **Sagot:** Ang BOC ay may coordinative powers sa Free Zone authorities (gaya ng PEZA o SBMA) lalo na sa pag-check kung may smuggling (kung ang goods na dapat ay sa Free Zone lang, patagong inilabas papuntang Metro Manila).

🔗 Related Topics

*   Sec. 102 (q) - Customs Territory
*   Sec. 102 (c) - Admission
*   Sec. 116 - Free Zones

🤖 Need More Explanation?

Explain the concept of 'Free Zone' under Section 102(w) of the CMTA. Enumerate the different types of Free Zones mentioned in the law (like PEZA and specific Freeports). Explain the legal fiction that Free Zones are considered 'outside the customs territory.'`,prompt:"Explain the concept of 'Free Zone' under Section 102(w) of the CMTA. Enumerate the different types of Free Zones mentioned in the law (like PEZA and specific Freeports). Explain the legal fiction that Free Zones are considered 'outside the customs territory.'"},225:{_label:"paragraph (x) Goods — ",title:"Ano ang Goods? (Section 102x)",content:`📖 Kahulugan

Sa ilalim ng CMTA, ang salitang "Goods" ay ang pangkalahatang tawag sa anumang bagay, produkto, o kagamitan na maaaring ipasok (import) o ilabas (export) sa ating bansa.

🔍 Breakdown

*   **Articles, wares, merchandise:** Kahit anong pisikal na produkto (halimbawa: damit, sasakyan, pagkain, makinarya, alahas).
*   **Any other items:** Kahit mga kakaibang bagay tulad ng live animals, kemikal, o mga personal na bagahe.
*   **Subject of importation or exportation:** Basta't itinawid sa border ng bansa, ito ay itinuturing na goods.

💡 Simpleng Paliwanag

Sa simpleng salita, ito yung "kargamento" o "kalakal". Noong panahon ng lumang batas (TCCP), ang tawag nila rito ay "Articles". Nang ipasa ang CMTA, pinalitan nila ito ng salitang "Goods" para umayon sa standard na ginagamit sa buong mundo (WCO at Kyoto Convention).

📦 Halimbawa

Lahat ng ito ay itinuturing na "Goods" sa mata ng Customs: Isang container ng frozen meat mula Brazil; Isang mamahaling relo na binili mo sa Paris at suot mo pag-uwi; Mga isda (tuna) na i-e-export natin sa Japan.

⭐ Bakit Mahalaga Ito?

Ito ang mismong subject ng batas. Ang buong trabaho ng Bureau of Customs (magpataw ng buwis, mag-inspeksyon, manghuli ng kontrabando) ay umiikot sa paggalaw ng mga "Goods".

⚠️ Dapat Tandaan

*   May mga "Goods" na bawal i-import o i-export (Prohibited Goods, gaya ng shabu) at may mga goods na kailangan ng special permit (Regulated Goods, gaya ng bigas).

🎯 Board Exam Tip

Tandaan na pinalitan ng CMTA ang terminolohiyang "Articles" ng "Goods". Kahit na paminsan-minsan ay nagagamit pa rin ang salitang articles sa industriya, sa legal na aspeto ng CMTA, "Goods" ang tamang termino.

❓ Madalas Malito ang Students

*   **Tanong:** Goods din ba yung aso na dinala ko galing abroad?
*   **Sagot:** Oo. Sa legal na definition, ang mga buhay na hayop (live animals) na ipinapasok sa bansa ay sakop ng "Goods" at kailangan ng tamang deklarasyon (at permit mula sa Bureau of Animal Industry).

🔗 Related Topics

*   Sec. 115 - Treatment of Importation
*   Sec. 117 - Regulated Importation and Exportation
*   Sec. 118 - Prohibited Importation and Exportation

🤖 Need More Explanation?

Define the term 'Goods' as used in Section 102(x) of the CMTA. Why did the new law shift from using the word 'Articles' to 'Goods'? Give diverse examples of what constitutes 'goods' in customs procedures.`,prompt:"Define the term 'Goods' as used in Section 102(x) of the CMTA. Why did the new law shift from using the word 'Articles' to 'Goods'? Give diverse examples of what constitutes 'goods' in customs procedures."},226:{_label:"paragraph (y) Goods Declaration — ",title:"Ano ang Goods Declaration? (Section 102y)",content:`📖 Kahulugan

Ang Goods Declaration ay ang pormal na pagpasa ng impormasyon sa Customs (kadalasan sa pamamagitan ng computer system) kung saan sinasabi ng importer kung ano ang kalakal niya, saan pupunta, at magkano ang idinedeklara niyang halaga nito.

🔍 Breakdown

*   **Statement made in the manner prescribed:** Pormal na dokumento o electronic file, madalas ginagamit ang form na Single Administrative Document (SAD).
*   **Indicate the procedure to be observed:** Sasabihin mo dito kung ito ba ay for consumption (ibebenta sa Pilipinas), for warehousing (itago muna), o admission (dadalhin sa PEZA).
*   **Application for the entry or admission of imported goods:** Ito ang "application form" mo para papasukin ng batas ang kalakal mo.
*   **Particulars of which the customs administration shall require:** Detalye gaya ng timbang, HS Code, description, value, at origin.

💡 Simpleng Paliwanag

Ito ang kapalit ng tinatawag dati na "Import Entry". Ito ang papel o electronic record kung saan nagiging tapat ka sa gobyerno. "Goberyno, may parating akong 100 sako ng asukal galing Thailand, eto ang halaga nila, at handa akong magbayad ng buwis."

📦 Halimbawa

Dumating ang mga laptop na in-import mo. Ang Customs Broker mo ay maglo-log in sa Value-Added Service Provider (VASP) system at ita-type niya ang impormasyon ng mga laptop (brand, model, price). Pag-submit niya nito online, iyon na ang pagsasagawa ng "Goods Declaration".

⭐ Bakit Mahalaga Ito?

Ito ang nagiging basehan ng computation ng buwis (Assessment). Dito rin nagsisimula ang legal na relasyon mo at pananagutan mo sa BOC. Kung may mali kang idineklara (halimbawa, sinabi mong mansanas pero ang laman ay cellphone), mahuhuli ka sa technical smuggling (misdeclaration).

⚠️ Dapat Tandaan

*   Inalis na ng CMTA ang salitang "Import Entry Declaration" at pinalitan ito ng pangkalahatang term na "Goods Declaration" para sumunod sa Revised Kyoto Convention.
*   Ang goods declaration ay ginagawa sa ilalim ng parusa ng perjury (panunumpa ng katotohanan).

🎯 Board Exam Tip

Tandaan na ang declarant at ang licensed customs broker ay parehong may pananagutan sa accuracy o pagiging totoo ng lahat ng nakasulat sa Goods Declaration (Section 107).

❓ Madalas Malito ang Students

*   **Tanong:** Goods declaration ba yung form na pinupunan ko sa airport bago lumabas (Customs Baggage Declaration Form)?
*   **Sagot:** Oo. Isang uri iyon ng goods declaration na ginagamit para sa mga travelers at pasahero.

🔗 Related Topics

*   Sec. 106 - Declarant
*   Sec. 107 - Rights and Responsibilities of the Declarant
*   Sec. 102 (dd) - Lodgement

🤖 Need More Explanation?

Explain the concept of 'Goods Declaration' under Section 102(y) of the CMTA. How has this term evolved from the old Tariff and Customs Code's terminology? Explain the responsibility of the declarant in filing this document.`,prompt:"Explain the concept of 'Goods Declaration' under Section 102(y) of the CMTA. How has this term evolved from the old Tariff and Customs Code's terminology? Explain the responsibility of the declarant in filing this document."},227:{_label:"paragraph (z) Importation — ",title:"Ano ang Importation? (Section 102z)",content:`📖 Kahulugan

Ang Importation, sa ilalim ng Section 102(z), ay tumutukoy sa pagpasok ng mga kalakal mula sa ibang bansa (foreign territory) patungo sa Philippine territory — maaaring ito ay para sa consumption, warehousing, o admission ayon sa depinisyon ng batas.

🔍 Breakdown

*   **Foreign territory to Philippine territory:** Dapat mula sa labas papasok sa bansa.
*   **For consumption:** Ipapasok para gamitin o ibenta agad sa Pilipinas.
*   **For warehousing:** Itatago muna sa isang bonded warehouse bago gamitin o ibenta.
*   **For admission:** Dinadala papunta sa isang Free Zone (tulad ng PEZA, Clark, Subic) — ito rin ay itinuturing na importation ayon sa batas.

💡 Simpleng Paliwanag

Mayroong tatlong posibleng "daan" papasok ng gamit mula ibang bansa: (1) diretso itong gagamitin o ibebenta rito (consumption), (2) itatago muna sa isang bonded warehouse (warehousing), o (3) dadalhin sa isang Free Zone tulad ng PEZA o Clark (admission). Anuman sa tatlong ito ang mangyari, itinuturing pa rin itong importation sa ilalim ng batas.

📦 Halimbawa

May isang negosyanteng nag-import ng de-latang pagkain mula Thailand. Kung diretso niya itong ibebenta sa palengke, ito ay consumption entry. Kung itatago muna niya sa isang bonded warehouse bago ito ilabas nang paunti-unti, ito ay warehousing. Kung dadalhin naman ito sa isang factory sa loob ng isang PEZA zone, ito ay admission — pero sa lahat ng tatlong sitwasyon, importation pa rin ito ayon sa Section 102(z).

⭐ Bakit Mahalaga Ito?

Ito ang pundasyon kung kailan at paano nagsisimula ang obligasyon sa buwis ng isang importer. Malinaw dito na kahit ang goods ay hindi diretsong ibebenta sa domestic market kundi dadalhin lang sa isang Free Zone, itinuturing pa rin itong importation — mahalaga ito para hindi maisip na ang mga shipment papunta sa PEZA o Clark ay awtomatikong exempted na sa customs coverage.

⚠️ Dapat Tandaan

*   Tatlong destinasyon lang ang nasa depinisyon: consumption, warehousing, o admission sa free zone — lahat ay itinuturing pa ring importation.
*   Ang admission papunta sa Free Zone ay hindi nangangahulugang exempted na sa proseso ng importation.

🎯 Board Exam Tip

Alalahanin ang tatlong destinasyon: CONSUMPTION, WAREHOUSING, ADMISSION. Madalas gamitin ito ng examiner para subukan kung alam mong kahit papunta sa Free Zone, itinuturing pa ring importation ang goods.

❓ Madalas Malito ang Students

*   **Tanong:** Kapag ang kalakal ay pumasok lang sa isang Free Zone (tulad ng Clark o Subic) at hindi sa "regular" customs territory, itinuturing pa rin ba itong importation?
*   **Sagot:** Oo — dahil ang admission papunta sa Free Zone ay malinaw na nakasaad bilang bahagi ng depinisyon ng Importation sa Section 102(z).

🔗 Related Topics

*   Sec. 103 - When Importation Begins and Deemed Terminated
*   Sec. 102(c) - Admission
*   Sec. 102(w) - Free Zone

🤖 Need More Explanation?

Explain 'Importation' under Section 102(z) of the CMTA in simple terms. Give practical Customs examples covering consumption, warehousing, and admission into a free zone. Explain why this definition matters for determining customs liability, mention related provisions like Section 103 and Section 102(w) on Free Zones, note any relevant CAOs/CMOs if applicable, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Importation' under Section 102(z) of the CMTA in simple terms. Give practical Customs examples covering consumption, warehousing, and admission into a free zone. Explain why this definition matters for determining customs liability, mention related provisions like Section 103 and Section 102(w) on Free Zones, note any relevant CAOs/CMOs if applicable, and clarify common misconceptions students have about this term."},228:{_label:"paragraph (aa) Freight Forwarder — ",title:"Ano ang Freight Forwarder? (Section 102aa)",content:`📖 Kahulugan

Ang Freight Forwarder, sa ilalim ng Section 102(aa), ay isang lokal na entity na kumikilos bilang cargo intermediary — tumutulong sila sa pag-transport ng kalakal ng kanilang kliyente, ngunit hindi sila kumikilos bilang carrier.

🔍 Breakdown

*   **Local entity:** Nakabase sa Pilipinas.
*   **Cargo intermediary:** Tagapamagitan sa pagitan ng shipper at ng aktwal na carrier.
*   **Without assuming the role of carrier:** Hindi sila legal na carrier — kaiba ito sa NVOCC.
*   **Other forwarding services:** Booking cargo space, negotiating freight rates, preparing documents, advancing freight payments, packing/crating, trucking, at warehousing.
*   **Agent/representative of foreign NVOCC:** Maaari rin silang kumilos bilang lokal na kinatawan ng dayuhang NVOCC/cargo consolidator na nakalagay bilang consignee sa master bill of lading ng isang consolidated shipment.

💡 Simpleng Paliwanag

Isipin mo ang Freight Forwarder bilang "travel agent" ng kargamento — hindi sila ang eroplano o barko mismo, pero sila ang nag-aayos ng lahat ng detalye: booking, dokumento, bayad, at logistics, para sa kanilang kliyente.

📦 Halimbawa

May isang lokal na freight forwarding company sa Maynila na tumutulong sa isang exporter ng gawang-kamay na muwebles. Inaayos nila ang booking ng cargo space sa isang shipping line, tinutulungan nilang kumpletuhin ang mga dokumento, at inaasikaso pa nila ang packing at warehousing bago ito ilo-load sa barko. Sila mismo ay hindi nagmamay-ari ng barko — sila lang ang coordinator ng buong proseso.

⭐ Bakit Mahalaga Ito?

Malaking tulong ang mga Freight Forwarder lalo na sa maliliit at katamtamang negosyo na walang direktang access sa malalaking shipping lines. Mahalagang malaman ng estudyante na hindi sila carrier — kaya iba ang legal na responsibilidad nila kumpara sa isang aktwal na carrier o NVOCC.

⚠️ Dapat Tandaan

*   Ang Freight Forwarder ay hindi carrier — kaya naiiba ito sa NVOCC (paragraph ee) na maaaring ituring na carrier kahit walang sariling barko.
*   Maaari silang kumilos bilang ahente ng isang foreign NVOCC.

🎯 Board Exam Tip

Tandaan ang keyword na "LOCAL entity" at "WITHOUT assuming the role of a carrier" — ito ang pangunahing pagkakaiba sa NVOCC at International Freight Forwarder.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Freight Forwarder at NVOCC?
*   **Sagot:** Hindi. Ang Freight Forwarder ay hindi kumikilos bilang carrier, samantalang ang NVOCC ay itinuturing na carrier kahit walang sariling barko.

🔗 Related Topics

*   Sec. 102(bb) - International Freight Forwarder
*   Sec. 102(ee) - NVOCC
*   Sec. 102(j) - Carrier

🤖 Need More Explanation?

Explain 'Freight Forwarder' under Section 102(aa) of the CMTA in simple terms. Give practical Customs examples of what a freight forwarder does. Explain why this definition exists and how it differs from a Carrier and an NVOCC under Section 102(j) and 102(ee). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Freight Forwarder' under Section 102(aa) of the CMTA in simple terms. Give practical Customs examples of what a freight forwarder does. Explain why this definition exists and how it differs from a Carrier and an NVOCC under Section 102(j) and 102(ee). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},229:{_label:"paragraph (bb) International Freight Forwarder — ",title:"Ano ang International Freight Forwarder? (Section 102bb)",content:`📖 Kahulugan

Ang International Freight Forwarder, sa ilalim ng Section 102(bb), ay tumutukoy sa mga taong responsable sa pag-assemble at pag-consolidate ng iba't ibang shipment tungo sa iisang lote (single lot), at kadalasan ay buong responsibilidad nila ang international transport ng shipment mula sa punto ng pagtanggap hanggang sa punto ng destinasyon.

🔍 Breakdown

*   **Assembly and consolidation:** Pinagsasama-sama ang maliliit na shipment mula sa iba't ibang shipper papunta sa isang lote.
*   **Single lot:** Layunin ay mas episyenteng paggamit ng espasyo sa barko o eroplano.
*   **Full responsibility, in most cases:** Kadalasan, sila mismo ang sagot mula point of receipt hanggang point of destination — mas malawak ang saklaw ng responsibilidad kumpara sa ordinaryong Freight Forwarder.

💡 Simpleng Paliwanag

Kung ang ordinaryong Freight Forwarder ay parang coordinator lang, ang International Freight Forwarder naman ay parang project manager ng buong biyahe ng kargamento — sila ang bumubuo ng maliliit na shipment papunta sa isang lote, at kadalasan sila mismo ang sagot mula simula hanggang sa dulo ng biyahe papunta sa ibang bansa.

📦 Halimbawa

Isang International Freight Forwarder ang tumatanggap ng maliliit na shipment mula sa limang magkakaibang negosyanteng Pilipino na nagbebenta sa Estados Unidos. Pinagsasama nila ito sa iisang lote (consolidation), at sila mismo ang bahalang mag-asikaso mula sa pagkuha ng kalakal sa Pilipinas hanggang sa paghatid nito sa warehouse ng buyer sa US.

⭐ Bakit Mahalaga Ito?

Ang kakayahan nilang mag-consolidate ng maliliit na shipment papunta sa isang lote ay nagpapababa ng gastos para sa mga maliliit na exporter, at nagbibigay-daan sa mas episyenteng paggamit ng espasyo sa barko o eroplano — mahalagang bahagi ito ng supply chain sa modernong trade.

⚠️ Dapat Tandaan

*   Ang "assembly and consolidation" ang pangunahing function na naiiba sa ordinaryong Freight Forwarder.
*   Sila ang kadalasang sagot sa buong international leg ng transport, hindi lang sa lokal na bahagi.

🎯 Board Exam Tip

Ang "consolidation into single lot" ang pinaka-madaling marker para makilala ito sa exam — kaugnay rin ito ng konsepto ng Less Container Load (LCL) sa ilalim ng NVOCC.

❓ Madalas Malito ang Students

*   **Tanong:** Ano ang pagkakaiba ng International Freight Forwarder sa ordinaryong Freight Forwarder (paragraph aa)?
*   **Sagot:** Ang Freight Forwarder ay lokal na intermediary na hindi kumikilos bilang carrier, habang ang International Freight Forwarder ay may mas malawak na saklaw — sila ang bumubuo/nag-co-consolidate ng shipment at karaniwang buong responsable sa international transport nito.

🔗 Related Topics

*   Sec. 102(aa) - Freight Forwarder
*   Sec. 102(ee) - NVOCC

🤖 Need More Explanation?

Explain 'International Freight Forwarder' under Section 102(bb) of the CMTA in simple terms. Give practical Customs examples involving consolidation of shipments. Explain why this definition exists and how it differs from an ordinary Freight Forwarder under Section 102(aa) and an NVOCC under Section 102(ee). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'International Freight Forwarder' under Section 102(bb) of the CMTA in simple terms. Give practical Customs examples involving consolidation of shipments. Explain why this definition exists and how it differs from an ordinary Freight Forwarder under Section 102(aa) and an NVOCC under Section 102(ee). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},230:{_label:"paragraph (cc) Jurisdictional Control — ",title:"Ano ang Jurisdictional Control? (Section 102cc)",content:`📖 Kahulugan

Ang Jurisdictional Control, sa ilalim ng Section 102(cc), ay tumutukoy sa kapangyarihan at karapatan ng Bureau of Customs na mag-ehersisyo ng supervision at police authority sa lahat ng dagat na nasa loob ng jurisdiction ng Philippine territory, pati na rin sa lahat ng baybayin, pantalan, paliparan, look, ilog, at inland waters — navigable man o hindi mula sa dagat.

🔍 Breakdown

*   **Power and rights of the Bureau:** Legal na batayan ng awtoridad ng BOC.
*   **Supervision and police authority:** Kasama dito ang karapatang mag-inspeksyon, mag-search, at mag-enforce.
*   **All seas within Philippine jurisdiction:** Hindi lang customs territory sa lupa, kundi pati ang mga karagatan.
*   **Coasts, ports, airports, harbors, bays, rivers, inland waters:** Napakalawak ng saklaw — kahit inland waters na hindi navigable mula sa dagat.

💡 Simpleng Paliwanag

Isipin mo ito bilang "saklaw ng bantay" ng Bureau of Customs — hindi lang sa mga opisyal na piyer at paliparan sila may kapangyarihan, kundi pati sa buong look, dagat, ilog, at kahit lawa na konektado sa dagat, hangga't ito ay nasa loob ng jurisdiction ng Pilipinas.

📦 Halimbawa

Kapag may nakitang barkong kahina-hinala na dumadaan sa isang look malapit sa isang probinsiya, kahit hindi ito opisyal na daungan o piyer, may karapatan pa rin ang BOC na pigilan at siyasatin ito dahil ito ay sakop ng kanilang Jurisdictional Control.

⭐ Bakit Mahalaga Ito?

Binibigyan nito ang BOC ng legal na basehan para mag-patrol at mag-enforce kahit sa mga lugar na hindi opisyal na daungan — kritikal ito sa pakikipaglaban sa smuggling na kadalasang ginagawa sa mga liblib na look o baybayin, hindi lang sa malalaking piyer.

⚠️ Dapat Tandaan

*   Mas malawak ang Jurisdictional Control kumpara sa Customs Territory (paragraph q) — sakop nito kahit ang mga lugar na hindi karaniwang itinuturing na daungan.
*   Kasama rito ang mga inland waters kahit hindi navigable mula sa dagat.

🎯 Board Exam Tip

Huwag ikumpara ang Jurisdictional Control (saklaw ng police authority ng Bureau) sa Customs Territory (saklaw kung saan pwedeng i-enforce ang customs at tariff laws) — magkaiba ang dalawa kahit magkatulad ang dating.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Jurisdictional Control at Customs Territory?
*   **Sagot:** Hindi. Ang Customs Territory ay tumutukoy sa saan pwedeng ipatupad ang customs at tariff laws, habang ang Jurisdictional Control ay tumutukoy sa kapangyarihan mismo ng Bureau na mag-supervise at mag-enforce ng police authority sa mas malawak na saklaw — kasama ang mga dagat, look, at ilog.

🔗 Related Topics

*   Sec. 102(q) - Customs Territory
*   Sec. 102(i) - Bureau

🤖 Need More Explanation?

Explain 'Jurisdictional Control' under Section 102(cc) of the CMTA in simple terms. Give practical Customs examples of where this authority applies. Explain why this definition exists and how it differs from Customs Territory under Section 102(q). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Jurisdictional Control' under Section 102(cc) of the CMTA in simple terms. Give practical Customs examples of where this authority applies. Explain why this definition exists and how it differs from Customs Territory under Section 102(q). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},231:{_label:"paragraph (dd) Lodgement — ",title:"Ano ang Lodgement? (Section 102dd)",content:`📖 Kahulugan

Ang Lodgement, sa ilalim ng Section 102(dd), ay tumutukoy sa registration ng Goods Declaration sa Bureau of Customs — ito ang opisyal na pagpaparehistro ng dokumento bilang unang hakbang sa proseso ng customs clearance.

🔍 Breakdown

*   **Registration:** Ang aktwal na pagsusumite at pagpaparehistro sa BOC.
*   **Goods Declaration:** Ang dokumentong naglalaman ng detalye ng shipment (tingnan Sec. 102y).
*   **With the Bureau:** Direktang isinusumite sa Bureau of Customs — sa modernong praktis, karaniwan itong ginagawa sa pamamagitan ng electronic system alinsunod sa itinatakda ng Sec. 109 (ICT sa Customs).

💡 Simpleng Paliwanag

Isipin mo itong parang pag-drop ng aplikasyon sa isang opisina — ang Lodgement ay ang aktwal na pagsusumite at pagpaparehistro ng iyong Goods Declaration sa Bureau of Customs, bilang opisyal na hakbang para simulan ang proseso ng clearance.

📦 Halimbawa

Pagkatapos ihanda ng isang Customs Broker ang Goods Declaration base sa Commercial Invoice at Packing List ng kanyang kliyente, isinusumite niya ito sa Bureau of Customs para irehistro. Ang aktong ito ng pagsusumite at pagpaparehistro — sa modernong sistema, karaniwang sa pamamagitan ng electronic na paraan — ang tinatawag na Lodgement.

⭐ Bakit Mahalaga Ito?

Ang Lodgement ang opisyal na simula ng proseso ng customs clearance — mula rito nagsisimulang bilangin ang mga importanteng deadline, at nagsisimula na ang responsibilidad ng declarant sa katumpakan ng impormasyon.

⚠️ Dapat Tandaan

*   Ang Lodgement ay ibang yugto mula sa Assessment o Release — ito lang ang pagpaparehistro, hindi pa approval.
*   Sa mismong depinisyon, walang partikular na banggit sa paraan (manual o electronic) — pero sa praktika ngayon, electronic na ito alinsunod sa Sec. 109.

🎯 Board Exam Tip

Kabisaduhin: Lodgement = REGISTRATION ng goods declaration SA Bureau — huwag ikumpara agad sa Assessment o Release.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Lodgement at Goods Declaration?
*   **Sagot:** Hindi. Ang Goods Declaration ay ang dokumento mismo (Sec. 102y), habang ang Lodgement ay ang aksyon ng pagpaparehistro ng dokumentong iyon sa Bureau.

🔗 Related Topics

*   Sec. 102(y) - Goods Declaration
*   Sec. 106 - Declarant
*   Sec. 109 - Application of ICT

🤖 Need More Explanation?

Explain 'Lodgement' under Section 102(dd) of the CMTA in simple terms. Give practical Customs examples of how a goods declaration gets lodged with the Bureau. Explain why this step matters in the customs clearance process, mention related provisions like Section 102(y) on Goods Declaration and Section 109 on ICT, mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Lodgement' under Section 102(dd) of the CMTA in simple terms. Give practical Customs examples of how a goods declaration gets lodged with the Bureau. Explain why this step matters in the customs clearance process, mention related provisions like Section 102(y) on Goods Declaration and Section 109 on ICT, mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},232:{_label:"paragraph (ee) Non-Vessel Operating Common Carrier (NVOCC) — ",title:"Ano ang NVOCC? (Section 102ee)",content:`📖 Kahulugan

Ang Non-Vessel Operating Common Carrier (NVOCC), sa ilalim ng Section 102(ee), ay isang entity na maaaring may-ari o walang-ari ng barko, na nagbibigay ng point-to-point service — maaaring kasama dito ang ilang modes of transport, at/o gumagawa ng groupage ng less container load (LCL) shipments, at naglalabas ng kaukulang transport document.

🔍 Breakdown

*   **May or may not own or operate a vessel:** Hindi requirement na may sariling barko ang NVOCC.
*   **Point-to-point service:** Nagbibigay sila ng serbisyo mula punto A patungong punto B.
*   **Several modes of transport:** Maaaring gumamit ng kombinasyon ng barko, eroplano, o trak.
*   **Groupage of LCL shipments:** Pinagsasama-sama nila ang maliliit na kargamento (less than a full container load) mula sa iba't ibang shipper papunta sa isang container.
*   **Issues transport document:** Sila ang naglalabas ng House Bill of Lading sa kanilang kliyente.

💡 Simpleng Paliwanag

Isipin mo ang NVOCC bilang isang virtual na shipping line — nag-aalok sila ng serbisyo ng pagpapadala mula punto A hanggang B, at naglalabas pa sila ng sarili nilang dokumento (House Bill of Lading), kahit wala silang aktwal na barko.

📦 Halimbawa

Isang NVOCC ang tumatanggap ng maliliit na kargamento mula sa iba't ibang negosyanteng Pilipino na nagpapadala papuntang Estados Unidos. Pinagsasama nila ang mga ito (groupage) sa isang less-than-container-load na shipment, umuupa ng espasyo sa isang aktwal na shipping line, at naglalabas ng kani-kanilang House Bill of Lading sa bawat kliyente.

⭐ Bakit Mahalaga Ito?

Nagbibigay sila ng access sa international shipping para sa mga maliliit na negosyante na hindi kayang mag-book ng buong container — mahalaga rin itong maunawaan dahil sila rin ay may parehong obligasyon sa BOC gaya ng isang tunay na carrier.

⚠️ Dapat Tandaan

*   Hindi requirement na may sariling barko ang NVOCC — pwede silang umupa lang ng espasyo.
*   Ang groupage ng LCL shipments ang isa sa pangunahing serbisyo nila — dito nagkakaroon ng savings ang maliliit na shipper.

🎯 Board Exam Tip

Tandaan: NVOCC = "may or may not own a vessel" + "issues transport document" — huwag isipin na kailangan silang may barko para ituring silang carrier.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan bang may sariling barko ang isang NVOCC para ituring itong ganoon?
*   **Sagot:** Hindi. Malinaw sa depinisyon na "may or may not own or operate a vessel" — ang mahalaga ay nagbibigay sila ng point-to-point service at naglalabas ng transport document.

🔗 Related Topics

*   Sec. 102(aa) - Freight Forwarder
*   Sec. 102(bb) - International Freight Forwarder
*   Sec. 102(h) - Bill of Lading

🤖 Need More Explanation?

Explain 'Non-Vessel Operating Common Carrier (NVOCC)' under Section 102(ee) of the CMTA in simple terms. Give practical Customs examples of NVOCC operations including LCL groupage. Explain why this definition exists and how it differs from a Freight Forwarder under Section 102(aa). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Non-Vessel Operating Common Carrier (NVOCC)' under Section 102(ee) of the CMTA in simple terms. Give practical Customs examples of NVOCC operations including LCL groupage. Explain why this definition exists and how it differs from a Freight Forwarder under Section 102(aa). Mention any relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},233:{_label:"paragraph (ff) Outright Smuggling — ",title:"Ano ang Outright Smuggling? (Section 102ff)",content:`📖 Kahulugan

Ang Outright Smuggling, sa ilalim ng Section 102(ff), ay ang pag-import ng goods papasok sa bansa nang walang kumpletong customs-prescribed na dokumento, o hindi dumaan sa clearance ng Customs o iba pang regulatory agencies, layunin ay iwasan ang pagbabayad ng buwis, duties, at iba pang singil ng gobyerno.

🔍 Breakdown

*   **Without complete importation documents:** kulang o walang kinakailangang dokumento.
*   **Without being cleared by customs/regulatory agencies:** hindi dumaan sa opisyal na proseso.
*   **Purpose of evading payment:** sadyang layunin ay iwasan ang buwis at singil.

💡 Simpleng Paliwanag

Ito yung "diretsong pagtatago" ng kargamento — hindi man lang dumaan sa Customs, walang dokumento, at ang layunin lang talaga ay makaiwas sa buwis.

📦 Halimbawa

May bangkang dumaong sa isang liblib na baybayin na may dalang de-kahong sigarilyo na hindi dumaan sa anumang Customs port o dokumentasyon, at direktang inilipat papunta sa isang warehouse para ibenta nang hindi nagbayad ng buwis — ito ay Outright Smuggling.

⭐ Bakit Mahalaga Ito?

Isa ito sa dalawang pangunahing uri ng smuggling na dapat malaman ng estudyante (kasama ang Technical Smuggling), dahil malaki ang epekto nito sa revenue ng gobyerno at sa fair trade competition.

⚠️ Dapat Tandaan

*   Kailangang mapatunayan ang kumpletong kawalan ng dokumento o clearance, kasabay ng layuning umiwas sa buwis — hindi lang basta pagkakamali.

🎯 Board Exam Tip

Itanong sa sarili: "Wala bang dokumento/clearance AT sadyang layunin bang umiwas sa buwis?" Kung oo sa dalawa, Outright Smuggling ito.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Outright Smuggling at Technical Smuggling?
*   **Sagot:** Hindi. Sa Outright Smuggling, WALANG dokumento o clearance; sa Technical Smuggling (paragraph pp), MAY dokumento pero mali o pekeng impormasyon ang nilalaman.

🔗 Related Topics

*   Sec. 102(pp) - Technical Smuggling
*   Sec. 102(nn) - Smuggling

🤖 Need More Explanation?

Explain 'Outright Smuggling' under Section 102(ff) of the CMTA in simple terms. Give practical Customs examples. Explain why the law distinguishes this from Technical Smuggling under Section 102(pp), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Outright Smuggling' under Section 102(ff) of the CMTA in simple terms. Give practical Customs examples. Explain why the law distinguishes this from Technical Smuggling under Section 102(pp), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},234:{_label:"paragraph (gg) Perishable Good — ",title:"Ano ang Perishable Good? (Section 102gg)",content:`📖 Kahulugan

Ang Perishable Good, sa ilalim ng Section 102(gg), ay tumutukoy sa mga kalakal na madaling masira, bumababa nang malaki ang halaga habang naka-imbak, o mangangailangan ng sobrang gastos kung patuloy itong itatago — kaya maaari itong direktang i-auction kung ito ay itinuturing na makatwiran.

🔍 Breakdown

*   **Liable to perish:** madaling masira, hal. prutas, gulay, karne.
*   **Greatly depreciate in value while stored:** bumababa nang malaki ang value habang nakaimbak.
*   **Cannot be kept without disproportionate expense:** sobrang mahal itago, hal. frozen goods na nangangailangan ng cold storage.
*   **May be sold at auction upon reasonable notice:** direktang ibebenta sa auction imbes na maghintay ng normal na proseso.

💡 Simpleng Paliwanag

Kung ang kargamento mo ay prutas, gulay, o de-yelong produkto, at natagalan ka sa pagkuha nito sa Customs, hindi na hihintayin pa ng BOC na masira ito — pwede na nilang ibenta agad sa auction.

📦 Halimbawa

May shipment ng sariwang mangga na dumating sa Port of Manila pero hindi kaagad kinuha ng consignee dahil sa hindi pagkakabayad ng buwis sa oras. Dahil perishable ito, maaaring agad itong i-auction ng BOC sa halip na hintayin pa ang normal na abandonment period.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng flexibility sa BOC para maiwasan ang malaking pagkalugi (parehong sa gobyerno at sa importer) dahil sa pagkasira ng goods habang naghihintay ng normal na proseso.

⚠️ Dapat Tandaan

*   Hindi lahat ng delay ay awtomatikong nagreresulta sa auction — kailangan itong "reasonable" at may notice muna.

🎯 Board Exam Tip

I-link ito sa konsepto ng abandonment at auction sale sa ibang bahagi ng CMTA — perishable goods ang karaniwang exception sa normal na timeline.

❓ Madalas Malito ang Students

*   **Tanong:** Ibig sabihin ba nito ay awtomatikong nawawala ang karapatan ng importer sa goods?
*   **Sagot:** Hindi awtomatiko — kailangan pa ring may notice at "reasonable" na basehan bago ito i-auction.

🔗 Related Topics

*   Abandonment provisions ng CMTA
*   Auction sale provisions ng CMTA

🤖 Need More Explanation?

Explain 'Perishable Good' under Section 102(gg) of the CMTA in simple terms. Give practical Customs examples of how perishable goods are handled differently. Explain why this exception exists, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Perishable Good' under Section 102(gg) of the CMTA in simple terms. Give practical Customs examples of how perishable goods are handled differently. Explain why this exception exists, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},235:{_label:"paragraph (hh) Port of Entry — ",title:"Ano ang Port of Entry? (Section 102hh)",content:`📖 Kahulugan

Ang Port of Entry, sa ilalim ng Section 102(hh), ay isang domestic port na bukas sa parehong domestic at international trade — kasama dito ang mga principal port of entry at subports of entry, at ang termino ay saklaw rin ang airport of entry.

🔍 Breakdown

*   **Principal port of entry:** ang pinakapunong daungan ng isang Customs District, kung saan naka-istasyon ang District Collector.
*   **Subports of entry:** nasa ilalim ng administrative jurisdiction ng District Collector ng principal port.
*   **Includes airport of entry:** hindi lang seaport, kasama rin ang mga paliparan.

💡 Simpleng Paliwanag

Isipin mo ito bilang "headquarters at branch" system — may pangunahing daungan (principal port) na siyang opisina ng punong District Collector, at may mga "branch" o subports na nasa ilalim ng kanyang administrasyon.

📦 Halimbawa

Ang Port of Manila ay maaaring maging principal port ng isang Customs District, habang ang mga daungan sa karatig-lalawigan na nasa ilalim ng parehong district ay itinuturing na subports of entry.

⭐ Bakit Mahalaga Ito?

Mahalagang malaman ito para maintindihan ang istruktura ng administratibong hurisdiksyon ng BOC — kung saang opisina dapat idulog ang isang partikular na transaksyon.

⚠️ Dapat Tandaan

*   Ang Port of Entry ay hindi lang tumutukoy sa seaport — malinaw sa batas na kasama rin dito ang airport of entry.

🎯 Board Exam Tip

Alalahanin ang tatlong konsepto: Principal Port, Subport, at Airport of Entry — lahat sakop ng "Port of Entry."

❓ Madalas Malito ang Students

*   **Tanong:** Iba ba ang Port of Entry sa Port of Discharge?
*   **Sagot:** Oo — ang Port of Entry ay tumutukoy sa administrative na istasyon ng Customs District, habang ang Port of Discharge (paragraph ii) ay ang aktwal na lugar kung saan ibinababa ang shipment mula sa barko o eroplano.

🔗 Related Topics

*   Sec. 102(ii) - Port of Discharge

🤖 Need More Explanation?

Explain 'Port of Entry' under Section 102(hh) of the CMTA in simple terms. Give practical Customs examples of principal ports vs subports. Explain why this classification matters and how it differs from Port of Discharge under Section 102(ii), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Port of Entry' under Section 102(hh) of the CMTA in simple terms. Give practical Customs examples of principal ports vs subports. Explain why this classification matters and how it differs from Port of Discharge under Section 102(ii), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},236:{_label:"paragraph (ii) Port of Discharge — ",title:"Ano ang Port of Discharge? (Section 102ii)",content:`📖 Kahulugan

Ang Port of Discharge, o Port of Unloading, sa ilalim ng Section 102(ii), ay ang lugar kung saan ibinababa ng barko, eroplano, o tren ang mga shipment nito, kung saan ito ipapadala patungo sa kani-kanilang consignee.

🔍 Breakdown

*   **Place of unloading:** pisikal na lokasyon kung saan bababa ang kargamento.
*   **Applies to vessel, aircraft, or train:** hindi lang barko.
*   **Dispatch point to consignee:** mula dito ipapadala na papunta sa huling tatanggap.

💡 Simpleng Paliwanag

Ito ang "huling stop" ng barko o eroplano bago ipadala ang kargamento sa tunay na may-ari. Dito nagsisimula ang proseso ng paghahatid papunta sa consignee.

📦 Halimbawa

Isang barko mula Japan ang dumaong sa Manila South Harbor at doon nag-unload ng mga container. Ang Manila South Harbor sa kasong ito ang Port of Discharge — mula rito ipapadala na ang mga container papunta sa bodega ng mga consignee.

⭐ Bakit Mahalaga Ito?

Mahalaga ito sa pagtukoy kung saan opisyal na nagsimula ang proseso ng delivery at kung sino ang may hurisdiksyon sa unang bahagi ng logistics chain pagkatapos bumaba ang goods.

⚠️ Dapat Tandaan

*   Hindi lahat ng Port of Discharge ay Port of Entry — posibleng iba ang lugar ng pagbaba ng kargamento sa opisyal na "port of entry" ayon sa Customs District structure.

🎯 Board Exam Tip

Ikonekta ang Port of Discharge sa Manifest — dito madalas ikumpara ang laman ng manifest sa aktwal na na-unload.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ito ng Port of Entry?
*   **Sagot:** Hindi — magkaiba ang function; ang isa ay administrative station (Port of Entry) at ang isa ay pisikal na lugar ng pag-unload (Port of Discharge).

🔗 Related Topics

*   Sec. 102(hh) - Port of Entry

🤖 Need More Explanation?

Explain 'Port of Discharge' under Section 102(ii) of the CMTA in simple terms. Give practical Customs examples of unloading and dispatch to consignees. Explain why this differs from Port of Entry under Section 102(hh), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Port of Discharge' under Section 102(ii) of the CMTA in simple terms. Give practical Customs examples of unloading and dispatch to consignees. Explain why this differs from Port of Entry under Section 102(hh), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},237:{_label:"paragraph (jj) Reexportation — ",title:"Ano ang Reexportation? (Section 102jj)",content:`📖 Kahulugan

Ang Reexportation, sa ilalim ng Section 102(jj), ay tumutukoy sa pag-eksport pabalik ng mga kalakal na dating na-import papasok sa Pilipinas.

🔍 Breakdown

*   **Previously imported goods:** dapat na-import muna ito sa Pilipinas.
*   **Exported again:** ipinadala palabas muli patungo sa ibang bansa.

💡 Simpleng Paliwanag

Ito yung "balikan" — na-import muna ang goods sa Pilipinas, pero sa halip na gamitin dito, ipinadala itong muli palabas ng bansa.

📦 Halimbawa

May makinarya na na-import muna sa Pilipinas para sa pagsusuri o pag-repair, pero pagkatapos ay ipinadala itong pabalik sa bansang pinagmulan — ito ay reexportation.

⭐ Bakit Mahalaga Ito?

Kaugnay ito ng Conditional Importation (paragraph m) kung saan may mga goods na pansamantala lang pumasok at inaasahang ie-export ulit sa loob ng itinakdang panahon.

⚠️ Dapat Tandaan

*   May kinalaman ito sa mga refund o duty drawback provisions sa ibang bahagi ng CMTA, dahil maaaring maka-claim ng refund ang importer sa ilang partikular na sitwasyon.

🎯 Board Exam Tip

Iugnay ang Reexportation sa Conditional Importation (temporary admission) — madalas magkasamang lumalabas sa exam.

❓ Madalas Malito ang Students

*   **Tanong:** Ang lahat bang na-import ay puwedeng i-reexport?
*   **Sagot:** Depende — may mga requirement at proseso na dapat sundin, at hindi awtomatikong bahagi ito ng bawat importation.

🔗 Related Topics

*   Sec. 102(m) - Conditional Importation

🤖 Need More Explanation?

Explain 'Reexportation' under Section 102(jj) of the CMTA in simple terms. Give practical Customs examples. Explain how it relates to Conditional Importation under Section 102(m), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Reexportation' under Section 102(jj) of the CMTA in simple terms. Give practical Customs examples. Explain how it relates to Conditional Importation under Section 102(m), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},238:{_label:"paragraph (kk) Release of Goods — ",title:"Ano ang Release of Goods? (Section 102kk)",content:`📖 Kahulugan

Ang Release of Goods, sa ilalim ng Section 102(kk), ay ang aksyon ng Bureau of Customs na pahintulutan ang mga kalakal na sumasailalim sa clearance na ilagay sa pangangasiwa ng kinauukulang partido.

🔍 Breakdown

*   **Action by the Bureau:** desisyon at galaw ng BOC.
*   **Goods undergoing clearance:** kargamentong kasalukuyang dumadaan sa proseso.
*   **Placed at disposal of the party concerned:** ibinibigay na ang kontrol pabalik sa importer/consignee.

💡 Simpleng Paliwanag

Ito ang "release" na hinihintay ng bawat importer — ang opisyal na pahintulot ng BOC na ilabas na ang kargamento at ibigay na ito sa may-ari o consignee.

📦 Halimbawa

Matapos maayos na mabayaran ang duties at taxes at ma-verify ng examiner ang shipment, inisyu ng BOC ang Release Order — ibig sabihin, maaari nang kunin ng importer ang kanyang kargamento sa piyer o warehouse.

⭐ Bakit Mahalaga Ito?

Ito ang pinakahihintay na yugto sa buong proseso ng importation — nangangahulugan ito na kumpleto na ang obligasyon ng importer at maaari na niyang gamitin o ibenta ang goods.

⚠️ Dapat Tandaan

*   Ang Release ay hindi awtomatiko — kailangan munang makumpleto ang assessment, pagbabayad, at anumang required inspection.

🎯 Board Exam Tip

Iugnay ang Release sa termino ng Importation (paragraph z) — ang Release ay isa sa mga pangyayaring nagre-resulta sa pagiging "terminated" ng importation sa ilalim ng Sec. 103.

❓ Madalas Malito ang Students

*   **Tanong:** Kapareho ba ng Clearance (paragraph k) ang Release?
*   **Sagot:** Magkaugnay pero magkaiba — ang Clearance ay ang buong proseso/completion ng formalities, habang ang Release ay ang partikular na aksyon ng pagbibigay ng disposal rights sa may-ari.

🔗 Related Topics

*   Sec. 102(k) - Clearance
*   Sec. 103 - When Importation Begins and Deemed Terminated

🤖 Need More Explanation?

Explain 'Release of Goods' under Section 102(kk) of the CMTA in simple terms. Give practical Customs examples of the release process. Explain how it relates to Clearance under Section 102(k) and to Section 103 on termination of importation, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Release of Goods' under Section 102(kk) of the CMTA in simple terms. Give practical Customs examples of the release process. Explain how it relates to Clearance under Section 102(k) and to Section 103 on termination of importation, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},239:{_label:"paragraph (ll) Refund — ",title:"Ano ang Refund? (Section 102ll)",content:`📖 Kahulugan

Ang Refund, sa ilalim ng Section 102(ll), ay ang pagbabalik, buo man o bahagi lamang, ng duties at taxes na naibayad na sa mga kalakal.

🔍 Breakdown

*   **Return of duties and taxes:** pagbabalik ng nabayarang halaga.
*   **In whole or in part:** maaaring buong halaga o parte lamang.
*   **Already paid on goods:** kondisyon na may naunang bayad.

💡 Simpleng Paliwanag

Ito yung "singil-back" — kapag may sitwasyon (hal. sobrang bayad o overpayment) na dapat ibalik ng gobyerno sa importer ang bahagi o buong halaga ng nabayaran nitong buwis.

📦 Halimbawa

May importer na nagbayad ng mas mataas na duty dahil sa maling classification, ngunit pagkatapos ng reassessment, napatunayang mas mababa dapat ang tamang rate. Ang sobrang binayaran ay maaaring i-claim bilang refund.

⭐ Bakit Mahalaga Ito?

Nagsisilbi itong proteksyon sa mga importer laban sa overpayment o maling assessment, at nagpapanatili ng fairness sa sistema ng customs valuation.

⚠️ Dapat Tandaan

*   May partikular na proseso at panahon (prescriptive period) para maka-claim ng refund — hindi ito basta-basta maaaring hingin kahit kailan.

🎯 Board Exam Tip

Ikonekta ang Refund sa Abatement (paragraph a) — ang Abatement ay bago pa mabayaran (reduction bago ang payment), habang ang Refund ay pagkatapos nang nabayaran na.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Refund at Abatement?
*   **Sagot:** Hindi. Ang Abatement ay nangyayari BAGO mabayaran ang duties/taxes, habang ang Refund ay pagbabalik ng NAIBAYAD na sa simula pa lang.

🔗 Related Topics

*   Sec. 102(a) - Abatement

🤖 Need More Explanation?

Explain 'Refund' under Section 102(ll) of the CMTA in simple terms. Give practical Customs examples of overpayment scenarios. Explain how it differs from Abatement under Section 102(a), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Refund' under Section 102(ll) of the CMTA in simple terms. Give practical Customs examples of overpayment scenarios. Explain how it differs from Abatement under Section 102(a), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},240:{_label:"paragraph (mm) Security — ",title:"Ano ang Security? (Section 102mm)",content:`📖 Kahulugan

Ang Security, sa ilalim ng Section 102(mm), ay anumang uri ng garantiya — tulad ng surety bond, cash bond, standby letter of credit, o irrevocable letter of credit — na nagsisiguro na matutupad ang obligasyon ng isang partido sa Bureau of Customs.

🔍 Breakdown

*   **Surety bond:** garantiya mula sa isang bonding company.
*   **Cash bond:** aktwal na cash na idineposito bilang garantiya.
*   **Standby/irrevocable letter of credit:** garantiya mula sa bangko.
*   **Ensures satisfaction of obligation:** layunin ay masiguro na matutupad ang obligasyon sa BOC.

💡 Simpleng Paliwanag

Ito yung "kolateral" na hinihingi ng BOC para masiguro nilang babayaran talaga ng importer ang kanyang obligasyon, kahit pa may dispute o pending na proseso.

📦 Halimbawa

Sa kaso ng Tentative Release (paragraph qq), kailangang maglagay ang importer ng cash bond bilang security bago niya makuha ang kanyang kargamento habang naghihintay ng resolusyon sa isang disputed assessment.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng proteksyon sa gobyerno na hindi mawawalan ng revenue kahit pa may mga sitwasyong pending o disputed, habang pinapayagan pa ring kumilos ang importer.

⚠️ Dapat Tandaan

*   May iba't ibang uri ng Security — hindi lang cash bond ang tanging paraan.

🎯 Board Exam Tip

Kabisaduhin ang apat na uri: Surety Bond, Cash Bond, Standby Letter of Credit, Irrevocable Letter of Credit.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan bang laging cash ang Security?
*   **Sagot:** Hindi — maaari itong sa anyo ng bond o letter of credit mula sa bangko, hindi lang literal na cash.

🔗 Related Topics

*   Sec. 102(qq) - Tentative Release

🤖 Need More Explanation?

Explain 'Security' under Section 102(mm) of the CMTA in simple terms. Give practical Customs examples of the different forms of security. Explain why the Bureau requires this, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Security' under Section 102(mm) of the CMTA in simple terms. Give practical Customs examples of the different forms of security. Explain why the Bureau requires this, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},241:{_label:"paragraph (nn) Smuggling — ",title:"Ano ang Smuggling? (Section 102nn)",content:`📖 Kahulugan

Ang Smuggling, sa ilalim ng Section 102(nn), ay ang fraudulent na pag-import ng anumang kalakal papasok sa Pilipinas, o ang pagtulong sa pagtanggap, pagtatago, pagbili, pagbenta, o paglilipat ng gayong goods nang alam na ito ay fraudulently na na-import — kasama rin dito ang fraudulent na pag-export.

🔍 Breakdown

*   **Fraudulent act of importing:** sadyang panlilinlang sa pag-import.
*   **Assisting in receiving, concealing, buying, selling, disposing, transporting:** kasama rin ang mga sangkot sa "downstream" na hawak ng smuggled goods.
*   **Full knowledge:** dapat alam nila na fraudulently na-import ang goods.
*   **Fraudulent exportation:** kasama rin sa depinisyon ang illegal na pag-export.

💡 Simpleng Paliwanag

Malawak ang saklaw ng Smuggling — hindi lang ang nag-import kundi maging ang bumili, nagtago, o nagbenta ng alam nilang smuggled goods ay maaari ring managot.

📦 Halimbawa

May negosyanteng bumili ng de-latang produkto na alam niyang walang kumpletong dokumento at hindi dumaan sa BOC. Dahil alam niya ito at binili at ibinenta pa niya, siya rin ay maaaring managot sa ilalim ng Smuggling kahit hindi siya ang orihinal na nag-import.

⭐ Bakit Mahalaga Ito?

Ito ang pangkalahatang termino na sumasaklaw sa lahat ng anyo ng illegal na importation/exportation — pundasyon ito ng mga partikular na termino tulad ng Outright Smuggling at Technical Smuggling.

⚠️ Dapat Tandaan

*   Ang "full knowledge" ay mahalagang elemento — dapat mapatunayan na alam ng akusado na fraudulently na-import ang goods.

🎯 Board Exam Tip

Ito ang "umbrella term" — alalahanin na ang Outright at Technical Smuggling ay dalawang partikular na anyo nito.

❓ Madalas Malito ang Students

*   **Tanong:** Managot ba kahit hindi ako ang nag-import kundi bumili lang ako ng alam kong smuggled goods?
*   **Sagot:** Oo — malinaw sa depinisyon na ang pagtanggap, pagbili, o pagtatago ng goods na alam mong fraudulently na-import ay saklaw din ng Smuggling.

🔗 Related Topics

*   Sec. 102(ff) - Outright Smuggling
*   Sec. 102(pp) - Technical Smuggling

🤖 Need More Explanation?

Explain 'Smuggling' under Section 102(nn) of the CMTA in simple terms. Give practical Customs examples covering both the importer and downstream buyers. Explain how it relates to Outright and Technical Smuggling under Section 102(ff) and (pp), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Smuggling' under Section 102(nn) of the CMTA in simple terms. Give practical Customs examples covering both the importer and downstream buyers. Explain how it relates to Outright and Technical Smuggling under Section 102(ff) and (pp), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},242:{_label:"paragraph (oo) Taxes — ",title:"Ano ang Taxes? (Section 102oo)",content:`📖 Kahulugan

Ang Taxes, sa ilalim ng Section 102(oo), ay tumutukoy sa lahat ng buwis, bayarin, at singil na ipinapataw sa ilalim ng CMTA at ng National Internal Revenue Code (NIRC) ng 1997, na kinokolekta ng Bureau of Customs.

🔍 Breakdown

*   **Imposed under this Act (CMTA):** mga singil na nasa CMTA mismo.
*   **Imposed under the NIRC:** kasama rin ang mga buwis sa ilalim ng batas sa internal revenue, hal. VAT at excise tax sa imported goods.
*   **Collected by the Bureau:** ang BOC ang naniningil, kahit ang batayan ay parehong CMTA at NIRC.

💡 Simpleng Paliwanag

Kapag nag-import ka, hindi lang customs duty ang babayaran mo — pati na rin ang mga buwis sa ilalim ng NIRC, tulad ng VAT at excise tax, at ang lahat ng ito ay kinokolekta ng BOC.

📦 Halimbawa

Kapag nag-import ng de-alcohol na inumin, hindi lang import duty ang babayaran — kasama rin ang excise tax at VAT sa ilalim ng NIRC, at lahat ito ay sinisingil ng Bureau of Customs sa oras ng importation.

⭐ Bakit Mahalaga Ito?

Nililinaw nito na ang BOC ay may kapangyarihang mangolekta hindi lang ng customs duties, kundi pati ng mga buwis na batay sa ibang batas kapag ito ay may kinalaman sa imported goods.

⚠️ Dapat Tandaan

*   Ang "Taxes" dito ay malawak — hindi lang tumutukoy sa import duty, kundi sa lahat ng uri ng buwis, bayarin, at singil.

🎯 Board Exam Tip

Alalahanin: Taxes = CMTA + NIRC, at BOC ang kumokolekta ng pareho.

❓ Madalas Malito ang Students

*   **Tanong:** Magkasingkahulugan ba ang Duty at Taxes?
*   **Sagot:** Hindi — ang duty ay tumutukoy sa customs duty lamang, habang ang Taxes ay mas malawak na sumasaklaw pati sa VAT, excise tax, at iba pang bayarin sa ilalim ng NIRC.

🔗 Related Topics

*   Sec. 104 - When Duty and Tax are Due on Imported Goods

🤖 Need More Explanation?

Explain 'Taxes' under Section 102(oo) of the CMTA in simple terms. Give practical Customs examples involving VAT and excise tax on imports. Explain how this differs from 'duty' and connects to Section 104, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Taxes' under Section 102(oo) of the CMTA in simple terms. Give practical Customs examples involving VAT and excise tax on imports. Explain how this differs from 'duty' and connects to Section 104, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},243:{_label:"paragraph (pp) Technical Smuggling — ",title:"Ano ang Technical Smuggling? (Section 102pp)",content:`📖 Kahulugan

Ang Technical Smuggling, sa ilalim ng Section 102(pp), ay ang pag-import ng goods sa pamamagitan ng fraudulent, falsified, o erroneous na deklarasyon tungkol sa kalikasan, uri, kalidad, dami, o timbang ng kalakal, layunin ay bawasan o iwasan ang pagbabayad ng buwis.

🔍 Breakdown

*   **Fraudulent/falsified/erroneous declaration:** mali o pekeng impormasyon sa deklarasyon.
*   **Nature, kind, quality, quantity, weight:** ito ang mga aspetong maaaring i-misdeklara.
*   **Purpose:** bawasan o iwasan ang buwis, duties, at iba pang singil.

💡 Simpleng Paliwanag

Hindi tulad ng Outright Smuggling na walang dokumento, ang Technical Smuggling ay MAY dokumento — pero mali o pekeng impormasyon ang laman, para lang mas mababa ang mababayarang buwis.

📦 Halimbawa

May importer na nagdeklara ng kanyang kargamentong de-goma bilang "toys" imbes na "electronics" para mas mababa ang applicable duty rate, kahit alam niyang mali ang kanyang deklarasyon — ito ay Technical Smuggling.

⭐ Bakit Mahalaga Ito?

Karaniwan itong nangyayari sa pamamagitan ng misclassification o undervaluation, kaya mahalagang maunawaan ito ng mga customs broker at BOC personnel para mahuli ang ganitong uri ng fraud.

⚠️ Dapat Tandaan

*   Dapat mapatunayan na fraudulent, falsified, o erroneous ang deklarasyon — hindi lahat ng honest mistake ay Technical Smuggling (tingnan din Sec. 108).

🎯 Board Exam Tip

Ikumpara sa Sec. 108 — mahalagang malaman ang linya sa pagitan ng honest mistake (walang malaking parusa) at Technical Smuggling (may fraudulent intent).

❓ Madalas Malito ang Students

*   **Tanong:** Kung nagkamali lang ako sa quantity dahil sa human error, Technical Smuggling na ba ito?
*   **Sagot:** Hindi kung walang fraudulent intent — ayon sa Sec. 108, hindi dapat imposed ang substantial penalties sa inadvertent errors na walang fraud o gross negligence.

🔗 Related Topics

*   Sec. 102(ff) - Outright Smuggling
*   Sec. 108 - Penalties for Errors in Goods Declaration

🤖 Need More Explanation?

Explain 'Technical Smuggling' under Section 102(pp) of the CMTA in simple terms. Give practical Customs examples involving misclassification or undervaluation. Explain how this differs from Outright Smuggling under Section 102(ff) and from honest errors under Section 108, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Technical Smuggling' under Section 102(pp) of the CMTA in simple terms. Give practical Customs examples involving misclassification or undervaluation. Explain how this differs from Outright Smuggling under Section 102(ff) and from honest errors under Section 108, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},244:{_label:"paragraph (qq) Tentative Release — ",title:"Ano ang Tentative Release? (Section 102qq)",content:`📖 Kahulugan

Ang Tentative Release, sa ilalim ng Section 102(qq), ay ang sitwasyon kung saan, habang dinidispute at pinag-aaralan pa ang isang assessment, maaaring maglagay ang importer ng cash bond na katumbas ng duties at taxes na dapat bayaran, bago niya makuha ang release ng kanyang mga kalakal.

🔍 Breakdown

*   **Assessment is disputed and pending review:** hindi pa final ang desisyon.
*   **Importer puts up cash bond:** dapat maglagay ng garantiya.
*   **Cash bond equivalent to duties and taxes due:** dapat katumbas ng buong sinisingil na halaga.
*   **Importer can obtain release:** makukuha na ang goods kahit pending pa ang dispute.

💡 Simpleng Paliwanag

Kapag hindi ka sang-ayon sa assessment ng BOC pero gusto mong makuha na agad ang iyong kargamento, pwede kang maglagay muna ng cash bond na katumbas ng sinisingil sa iyo — makukuha mo na ang goods habang hinihintay pa ang resolusyon ng dispute.

📦 Halimbawa

Nag-dispute ang isang importer sa dutiable value na itinalaga ng examiner sa kanyang shipment. Habang hinihintay ang resolusyon, naglagay siya ng cash bond na katumbas ng buong halagang sinisingil, at nakuha na niya ang kanyang kargamento kaagad.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng balanse sa pagitan ng karapatan ng importer na agad makuha ang kanyang goods, at ng karapatan ng gobyerno na masigurong may garantiya kung sakaling manalo ang BOC sa dispute.

⚠️ Dapat Tandaan

*   Ang cash bond ay dapat katumbas ng buong duties at taxes na sinisingil — hindi puwedeng bahagi lamang.

🎯 Board Exam Tip

Ikonekta ito sa Security (paragraph mm) — ang cash bond dito ay isang halimbawa ng Security.

❓ Madalas Malito ang Students

*   **Tanong:** Ibig sabihin ba ng Tentative Release ay nanalo na ang importer sa dispute?
*   **Sagot:** Hindi — "tentative" lang ito, ibig sabihin makukuha na ang goods habang naghihintay pa ng final resolution; maaari pa ring baguhin ang huling desisyon.

🔗 Related Topics

*   Sec. 102(mm) - Security

🤖 Need More Explanation?

Explain 'Tentative Release' under Section 102(qq) of the CMTA in simple terms. Give practical Customs examples of disputed assessments. Explain how this connects to Security under Section 102(mm), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Tentative Release' under Section 102(qq) of the CMTA in simple terms. Give practical Customs examples of disputed assessments. Explain how this connects to Security under Section 102(mm), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},245:{_label:"paragraph (rr) Transit — ",title:"Ano ang Transit? (Section 102rr)",content:`📖 Kahulugan

Ang Transit, sa ilalim ng Section 102(rr), ay ang customs procedure kung saan ang mga kalakal, sa kanilang orihinal na anyo, ay dinadala sa ilalim ng customs control mula sa isang customs office patungo sa iba, o patungo sa isang Free Zone.

🔍 Breakdown

*   **In its original form:** hindi dapat nagbago ang anyo ng goods habang nasa transit.
*   **Under customs control:** bantay ng BOC sa buong biyahe.
*   **From one customs office to another:** maaaring parehong nasa loob ng Pilipinas.
*   **Or to a free zone:** maaari ring patungo sa isang PEZA/Clark/Subic zone.

💡 Simpleng Paliwanag

Ito yung "daanan lang" ng kalakal — mula sa isang Customs office papunta sa iba, o papunta sa isang Free Zone, habang bantay ito ng BOC at walang pagbabago sa kanyang orihinal na anyo.

📦 Halimbawa

May kargamento na dumaong sa Manila pero ang huling destinasyon ay isang factory sa loob ng Subic Freeport Zone — habang dinadala ito mula sa piyer papunta sa Subic, ito ay nasa ilalim ng Transit.

⭐ Bakit Mahalaga Ito?

Mahalaga itong maintindihan para malaman kung kailan hindi pa dapat sisingilin ng buwis ang isang shipment — habang nasa Transit, hindi pa ito nasa "domestic consumption" stage.

⚠️ Dapat Tandaan

*   Dapat "in its original form" ang goods — kung nagbago ang anyo nito habang nasa daan, maaaring hindi na ito ituring na simpleng Transit.

🎯 Board Exam Tip

Ikumpara ang Transit (papunta sa ibang Customs office o Free Zone) sa Transshipment (paragraph ss) na parehong Customs office lang ang saklaw pero ibang means of transport.

❓ Madalas Malito ang Students

*   **Tanong:** Pareho ba ang Transit at Transshipment?
*   **Sagot:** Hindi. Sa Transit, papunta ito sa IBANG customs office o free zone; sa Transshipment, nananatili ito sa PAREHONG customs office, kundi lang nagbabago ang means of transport.

🔗 Related Topics

*   Sec. 102(ss) - Transshipment
*   Sec. 102(w) - Free Zone

🤖 Need More Explanation?

Explain 'Transit' under Section 102(rr) of the CMTA in simple terms. Give practical Customs examples involving movement to a free zone. Explain how it differs from Transshipment under Section 102(ss), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Transit' under Section 102(rr) of the CMTA in simple terms. Give practical Customs examples involving movement to a free zone. Explain how it differs from Transshipment under Section 102(ss), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},246:{_label:"paragraph (ss) Transshipment — ",title:"Ano ang Transshipment? (Section 102ss)",content:`📖 Kahulugan

Ang Transshipment, sa ilalim ng Section 102(ss), ay ang customs procedure kung saan ang mga kalakal ay inililipat, sa ilalim ng customs control, mula sa importing means of transport patungo sa exporting means of transport, sa loob ng iisang customs office na parehong opisina ng importation at exportation.

🔍 Breakdown

*   **Transferred under customs control:** bantay ng BOC ang paglipat.
*   **From importing to exporting means of transport:** mula sa barko/eroplanong nagdala papunta sa barko/eroplanong maghahatid palabas.
*   **Within one customs office:** pareho lang ang lokasyon — hindi tulad ng Transit na lumilipat sa ibang opisina.
*   **Office of both importation and exportation:** parehong function ang isang customs office na ito.

💡 Simpleng Paliwanag

Ito yung pagpalit lang ng "sasakyan" ng kargamento habang nasa parehong piyer o paliparan — bumaba muna sa isang barko/eroplano, tapos isasakay agad sa ibang barko/eroplano papunta sa tunay na destinasyon, nang hindi na kailangang lumipat pa ng ibang Customs office.

📦 Halimbawa

May container na bumaba sa Port of Manila mula sa isang barkong Asyano, pero direktang isinakay ito sa ibang barko na patungong Europe — nangyari ito sa loob lamang ng Port of Manila, kaya ito ay Transshipment.

⭐ Bakit Mahalaga Ito?

Pinapadali nito ang logistics ng mga kargamentong dadaan lamang sa Pilipinas patungo sa ibang bansa, nang hindi na kailangang dumaan sa ibang customs office.

⚠️ Dapat Tandaan

*   Ang kaibahan nito sa Transit ay ang lokasyon — sa Transshipment, iisang customs office lang ang saklaw.

🎯 Board Exam Tip

I-memorize: Transit = magkaibang customs office; Transshipment = iisang customs office lang, magkaibang sasakyan.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan bang lumabas muna sa Pilipinas ang goods bago ito ituring na Transshipment?
*   **Sagot:** Hindi ito ang requirement — ang mahalaga ay nangyari ang paglipat ng means of transport sa loob ng iisang customs office na parehong opisina ng importation at exportation.

🔗 Related Topics

*   Sec. 102(rr) - Transit

🤖 Need More Explanation?

Explain 'Transshipment' under Section 102(ss) of the CMTA in simple terms. Give practical Customs examples of transfer between means of transport at one office. Explain how it differs from Transit under Section 102(rr), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Transshipment' under Section 102(ss) of the CMTA in simple terms. Give practical Customs examples of transfer between means of transport at one office. Explain how it differs from Transit under Section 102(rr), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},247:{_label:"paragraph (tt) Traveler — ",title:"Ano ang Traveler? (Section 102tt)",content:`📖 Kahulugan

Ang Traveler, sa ilalim ng Section 102(tt), ay tumutukoy sa sinumang pansamantalang pumapasok sa teritoryo ng isang bansa kung saan hindi siya karaniwang naninirahan, o umaalis sa naturang teritoryo; kasama rin ang sinumang umaalis sa bansang kanyang karaniwang tinitirhan o bumabalik dito.

🔍 Breakdown

*   **Non-resident entering temporarily:** dayuhang pumapasok pansamantala.
*   **Non-resident leaving:** dayuhang umaalis matapos ang bisita.
*   **Departing resident:** Pilipinong lumalabas ng bansa.
*   **Returning resident:** Pilipinong bumabalik mula sa ibang bansa.

💡 Simpleng Paliwanag

Malawak ang saklaw ng "Traveler" — kasama rito ang mga turistang dayuhan, mga OFW na papalabas o babalik, at kahit sinong Pilipino na paalis o babalik mula sa ibang bansa.

📦 Halimbawa

Isang OFW na papauwi mula Saudi Arabia para sa bakasyon ay itinuturing na returning resident traveler, habang ang isang turistang Koreanong dumadalaw sa Pilipinas ay itinuturing na non-resident traveler.

⭐ Bakit Mahalaga Ito?

Mahalaga ito para sa mga probisyon tungkol sa duty-free allowances, personal effects, at iba pang customs facilitation na partikular sa mga pasahero, hindi cargo shipment.

⚠️ Dapat Tandaan

*   Apat na klasipikasyon ang saklaw nito: non-resident (papasok), non-resident (papalabas), departing resident, at returning resident.

🎯 Board Exam Tip

Alalahanin ang apat na kategorya ng Traveler — madalas itanong kung aling kategorya ang applicable sa isang partikular na sitwasyon.

❓ Madalas Malito ang Students

*   **Tanong:** Kasama ba ang mga Pilipinong bumibiyahe papunta sa ibang lalawigan sa depinisyong ito?
*   **Sagot:** Hindi — ang Traveler dito ay tumutukoy lamang sa pagtawid sa teritoryo ng ibang bansa (international travel), hindi domestic trips.

🔗 Related Topics

*   Wala pang direktang related section sa batch na ito

🤖 Need More Explanation?

Explain 'Traveler' under Section 102(tt) of the CMTA in simple terms. Give practical Customs examples of the four classifications. Explain why this distinction matters for duty-free allowances and passenger facilitation, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Traveler' under Section 102(tt) of the CMTA in simple terms. Give practical Customs examples of the four classifications. Explain why this distinction matters for duty-free allowances and passenger facilitation, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},248:{_label:"paragraph (uu) Third Party — ",title:"Ano ang Third Party? (Section 102uu)",content:`📖 Kahulugan

Ang Third Party, sa ilalim ng Section 102(uu), ay tumutukoy sa sinumang taong direktang nakikipag-ugnayan sa Bureau of Customs, para at sa ngalan ng ibang tao, kaugnay ng importation, exportation, paglipat, o pag-iimbak ng mga kalakal.

🔍 Breakdown

*   **Deals directly with the Bureau:** personal na nakikipag-transaksyon sa BOC.
*   **For and on behalf of another person:** hindi para sa sarili, kundi kumakatawan sa iba.
*   **Relating to importation, exportation, movement, or storage:** malawak na saklaw ng transaksyon.

💡 Simpleng Paliwanag

Ito yung "kinatawan" sa transaksyon — hindi ang mismong may-ari ng goods ang direktang nakikipag-usap sa BOC, kundi may ibang taong kumakatawan sa kanya.

📦 Halimbawa

Isang Customs Broker na nakikipag-ugnayan sa BOC para sa lodgement ng Goods Declaration ng kanyang kliyenteng importer ay itinuturing na Third Party sa transaksyon.

⭐ Bakit Mahalaga Ito?

Ito ang batayan ng Sec. 110 (Relationship Between the Bureau and Third Parties), kung saan sinisiguro ng batas na parehong pagtrato ang matatanggap ng mga direktang nakikipagtransaksyon at ng mga gumagamit ng third party.

⚠️ Dapat Tandaan

*   Ang isang Third Party ay dapat may awtoridad mula sa pinagkakatiwalaang partido para kumilos sa kanilang ngalan.

🎯 Board Exam Tip

Ikonekta agad ito sa Sec. 110 — pareho ang karapatan at obligasyon ng Third Party sa nagtalaga sa kanila.

❓ Madalas Malito ang Students

*   **Tanong:** Ang Customs Broker ba ay laging itinuturing na Third Party?
*   **Sagot:** Oo, kapag siya ay kumikilos sa ngalan ng importer/exporter sa kanilang transaksyon sa BOC.

🔗 Related Topics

*   Sec. 110 - Relationship Between the Bureau and Third Parties
*   Sec. 102(n) - Customs Broker

🤖 Need More Explanation?

Explain 'Third Party' under Section 102(uu) of the CMTA in simple terms. Give practical Customs examples using a Customs Broker as representative. Explain how this connects to Section 110, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term.`,prompt:"Explain 'Third Party' under Section 102(uu) of the CMTA in simple terms. Give practical Customs examples using a Customs Broker as representative. Explain how this connects to Section 110, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this term."},249:{_label:"section 103 — When Importation Begins and Deemed Terminated",title:"Kailan Nagsisimula at Natatapos ang Importation? (Section 103)",content:`📖 Kahulugan

Itinatakda ng Section 103 ang eksaktong simula at katapusan ng proseso ng importation — nagsisimula ito kapag pumasok ang barko o eroplano sa Philippine territory na may intensyong mag-unload dito, at natatapos kapag natupad na ang isa sa dalawang kondisyong nakasaad sa batas.

🔍 Breakdown

*   **Begins:** pagpasok ng barko/eroplano sa Philippine territory NA may intensyong mag-unload — kailangan pareho ang dalawang element.
*   **Terminated (condition a):** nabayaran na o na-secure na ang duties, taxes, at charges sa port of entry, o may legal permit for withdrawal kung exempted.
*   **Terminated (condition b):** kung exempted ang goods, natapos ito kapag legal na umalis na sa hurisdiksyon ng Bureau.

💡 Simpleng Paliwanag

Isipin mo itong isang flight na may takeoff at landing. Ang "takeoff" ay ang pagpasok ng barko sa ating teritoryo na may planong mag-unload — dito nagsisimula legal na ang importation. Ang "landing" naman ay depende: kung dutiable ang goods, natatapos ito pagbayad ng buwis; kung exempted naman, natatapos ito kapag legal itong nakaalis na sa control ng BOC.

📦 Halimbawa

Isang cargo ship mula China ang pumasok sa Philippine waters na may planong mag-unload sa Manila — dito na opisyal na nagsimula ang importation, kahit hindi pa ito nakakadaong. Matapos mabayaran ang buwis at makuha ang release, saka lang opisyal na "terminated" ang importation.

⭐ Bakit Mahalaga Ito?

Ito ang legal na batayan kung kailan magsisimula ang jurisdiction ng BOC sa isang shipment, at kung kailan matatapos ang responsibilidad ng importer — kritikal ito sa pagtukoy ng liability sa buwis at sa mga kaso ng smuggling.

⚠️ Dapat Tandaan

*   Dalawang element ang kailangan para masabing nagsimula na ang importation: (1) pagpasok sa teritoryo, AT (2) intensyong mag-unload doon — hindi sapat ang isa lamang.

🎯 Board Exam Tip

Alalahanin ang salitang "WITH THE INTENTION TO UNLOAD" — madalas itong ginagamit sa exam para subukan kung naiintindihan mo na hindi sapat ang basta pagpasok lang sa teritoryo.

❓ Madalas Malito ang Students

*   **Tanong:** Kung dumaan lang ang barko sa Philippine waters papunta sa ibang bansa nang walang planong mag-unload, itinuturing ba itong importation?
*   **Sagot:** Hindi — kulang ang element na "intention to unload therein"; ito ay maaaring ituring na Transit imbes.

🔗 Related Topics

*   Sec. 102(z) - Importation
*   Sec. 102(kk) - Release of Goods

🤖 Need More Explanation?

Explain Section 103 of the CMTA on when importation begins and is deemed terminated. Give practical Customs examples of vessels entering Philippine territory. Explain why the two-element test (entry plus intention to unload) matters, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 103 of the CMTA on when importation begins and is deemed terminated. Give practical Customs examples of vessels entering Philippine territory. Explain why the two-element test (entry plus intention to unload) matters, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},250:{_label:"paragraph (a) — ",title:"Sec. 103(a) — Pagbabayad ng Duties at Taxes bilang Batayan ng Pagtatapos ng Importation",content:`📖 Kahulugan

Ayon sa Section 103(a), itinuturing na tapos na ang importation kapag nabayaran na, o na-secure na babayaran, ang mga duties, taxes, at iba pang singil sa port of entry — maliban na lamang kung ang goods ay exempted at may legal permit na para sa withdrawal.

🔍 Breakdown

*   **Paid or secured to be paid:** maaaring aktwal na bayad, o may security (bond) na garantiya ng bayad.
*   **At the port of entry:** dapat sa tamang lokasyon nangyari ito.
*   **Exception para sa exempted goods:** kung libre sa buwis, kailangan lang ng legal permit for withdrawal.

💡 Simpleng Paliwanag

Ito ang pinaka-karaniwang paraan kung paano natatapos ang importation — kapag binayaran mo na, o nagsecure ka ng bond para dito, ang iyong buwis, opisyal nang tapos ang proseso.

📦 Halimbawa

Nagbayad ang isang importer ng kumpletong duties at taxes sa kanyang shipment ng de-koryenteng gamit sa Port of Batangas — sa sandaling ito, itinuturing nang "terminated" ang kanyang importation.

⭐ Bakit Mahalaga Ito?

Ito ang pinaka-direktang criterion para sa karamihan ng regular na importation — mahalagang malaman ito ng bawat Customs Broker at Importer.

⚠️ Dapat Tandaan

*   Ang "secured to be paid" (hal. sa pamamagitan ng bond) ay katumbas din ng aktwal na bayad para sa layuning ito.

🎯 Board Exam Tip

I-pair ito laging sa paragraph (b) — dalawa lang ang paraan para matapos ang importation, at magkaiba ang applicable scenario ng bawat isa.

❓ Madalas Malito ang Students

*   **Tanong:** Kung nag-post lang ako ng bond pero hindi pa aktwal na nagbayad, tapos na ba ang importation ko?
*   **Sagot:** Oo — malinaw sa batas na "paid OR secured to be paid," parehong valid ang aktwal na bayad at ang pag-secure sa pamamagitan ng bond.

🔗 Related Topics

*   Sec. 103 (buong seksyon)
*   Sec. 102(mm) - Security

🤖 Need More Explanation?

Explain Section 103(a) of the CMTA in simple terms. Give practical Customs examples of payment or bonding at the port of entry. Explain how this connects to Security under Section 102(mm), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 103(a) of the CMTA in simple terms. Give practical Customs examples of payment or bonding at the port of entry. Explain how this connects to Security under Section 102(mm), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},251:{_label:"paragraph (b) — ",title:"Sec. 103(b) — Legal na Pag-alis mula sa Hurisdiksyon ng Bureau",content:`📖 Kahulugan

Ayon sa Section 103(b), sa kaso ng mga goods na itinuturing na exempted, natatapos ang importation kapag legal na nakaalis na ang mga ito sa hurisdiksyon ng Bureau of Customs.

🔍 Breakdown

*   **Applies only to exempted goods:** hindi ito applicable sa dutiable goods (doon applicable ang paragraph a).
*   **Legally left the jurisdiction:** dapat opisyal at legal ang pag-alis, hindi basta-basta.

💡 Simpleng Paliwanag

Kung ang iyong goods ay walang babayarang buwis dahil exempted, hindi na bayad ang basehan ng katapusan — sa halip, ang basehan ay ang legal na pag-alis nito mula sa control ng BOC.

📦 Halimbawa

May donasyong relief goods na exempted sa buwis para sa mga biktima ng bagyo. Sa sandaling legal itong nakalabas na sa control ng BOC papunta sa itinalagang destinasyon nito, itinuturing na "terminated" ang importation nito.

⭐ Bakit Mahalaga Ito?

Nililinaw nito na kahit walang babayarang buwis, may kailangan pa ring sundin na legal na proseso bago ganap na "matapos" ang importation.

⚠️ Dapat Tandaan

*   Ang salitang "legally left" ay mahalaga — kung ang paglabas ay hindi sumunod sa tamang proseso, hindi ito itinuturing na "terminated" sa ilalim ng probisyong ito.

🎯 Board Exam Tip

Alalahanin: Paragraph (a) = para sa DUTIABLE goods (bayad); Paragraph (b) = para sa EXEMPTED goods (legal na pag-alis).

❓ Madalas Malito ang Students

*   **Tanong:** Kung exempted ang goods ko, wala na akong kailangang gawin?
*   **Sagot:** May kailangan pa ring proseso — dapat legal na umalis ang goods sa hurisdiksyon ng Bureau, hindi ito nangyayari nang awtomatiko.

🔗 Related Topics

*   Sec. 103(a)
*   Sec. 102(z) - Importation

🤖 Need More Explanation?

Explain Section 103(b) of the CMTA in simple terms. Give practical Customs examples involving duty-exempt goods. Explain why 'legally left the jurisdiction' still requires a process, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 103(b) of the CMTA in simple terms. Give practical Customs examples involving duty-exempt goods. Explain why 'legally left the jurisdiction' still requires a process, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},252:{_label:"section 104 — When Duty and Tax are Due on Imported Goods",title:"Kailan Dapat Bayaran ang Duty at Tax sa Imported Goods? (Section 104)",content:`📖 Kahulugan

Ayon sa Section 104, lahat ng goods na ini-import sa Pilipinas — kasama pa ang mga dating exported mula sa Pilipinas — ay sakop ng duty sa oras ng importation, maliban na lamang kung may ibang probisyon sa CMTA o ibang batas.

🔍 Breakdown

*   **All goods subject to duty upon importation:** pangkalahatang panuntunan.
*   **Includes previously exported goods:** kahit dating produkto ng Pilipinas na na-export, sakop pa rin kapag na-import muli.
*   **20% legal interest per annum:** ipapataw sa unpaid duties, taxes, at iba pang singil, kompyutasyon mula sa petsa ng final assessment.
*   **Interest accrues on fines/penalties too:** hindi lang sa duty, kundi pati sa multa.
*   **Bureau issues receipt:** dapat mag-isyu ng resibo bilang patunay ng bayad.

💡 Simpleng Paliwanag

Bilang default, lahat ng ini-import ay may kaakibat na duty — walang exception maliban kung may partikular na batas na nagsasabing exempted. At kung hindi mo binayaran sa oras ang iyong duty, magkakaroon ka ng 20% na interes bawat taon bilang parusa sa late payment.

📦 Halimbawa

May importer na huli nang nagbayad ng kanyang assessed duties matapos ang deadline. Dahil dito, bukod sa orihinal na halaga ng duty, kailangan niya ring bayaran ang 20% legal interest per annum, kinukwenta mula sa petsa ng final assessment.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng insentibo para agad magbayad ang mga importer, at nagsisilbing proteksyon sa revenue ng gobyerno laban sa mga late o hindi nagbabayad na importer.

⚠️ Dapat Tandaan

*   Kahit dating produkto ng Pilipinas ang goods na na-export dati, kapag na-import muli, sakop pa rin ito ng duty maliban kung may exemption.

🎯 Board Exam Tip

I-memorize ang eksaktong rate: 20% per annum legal interest — madalas itanong ito sa exam bilang specific figure.

❓ Madalas Malito ang Students

*   **Tanong:** Kung dating exported ko na produkto ng Pilipinas ang aking i-import muli, exempted na ba ako sa duty?
*   **Sagot:** Hindi awtomatiko — malinaw sa batas na kasama pa rin sa sakop ng duty ang mga goods na dating na-export mula sa Pilipinas, maliban kung may partikular na exemption na applicable.

🔗 Related Topics

*   Sec. 429 (See Also sa opisyal na source)
*   Sec. 103 - When Importation Begins and Terminated

🤖 Need More Explanation?

Explain Section 104 of the CMTA in simple terms. Give practical Customs examples involving late payment and the 20% legal interest. Explain why previously exported goods are still subject to duty, mention Section 429 and relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 104 of the CMTA in simple terms. Give practical Customs examples involving late payment and the 20% legal interest. Explain why previously exported goods are still subject to duty, mention Section 429 and relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},253:{_label:"section 105 — Effective Date of Rate of Import Duty",title:"Anong Duty Rate ang Applicable? Effective Date ng Import Duty (Section 105)",content:`📖 Kahulugan

Itinatakda ng Section 105 kung anong petsa ang gagamitin para malaman ang tamang duty rate ng isang imported goods — karaniwan ay ang rate na effective sa petsa ng importation o sa petsa ng withdrawal mula sa warehouse para sa consumption.

🔍 Breakdown

*   **Rate effective at date of importation:** default rule para sa regular na importation.
*   **Rate effective upon withdrawal from warehouse for consumption:** sa kaso ng warehousing entry.
*   **Withdrawal from free zone:** ang rate ay batay sa petsa ng withdrawal papunta sa customs territory, applicable sa orihinal na goods na na-admit.
*   **Goods sold at customs public auction:** ang rate ay batay sa petsa ng auction, alinsunod sa Sec. 1143(a).

💡 Simpleng Paliwanag

Hindi laging ang petsa ng pagbili o pag-order online ang batayan ng duty rate — depende sa uri ng entry (regular, warehousing, free zone, o auction), may partikular na petsa na ginagamit bilang "reference point" para sa applicable rate.

📦 Halimbawa

May goods na na-admit muna sa isang Free Zone noong nasa mababang rate pa ang applicable duty, pero ni-withdraw lamang papunta sa customs territory nang tumaas na ang rate — ang gagamiting rate ay ang effective sa petsa ng withdrawal, hindi ang petsa ng orihinal na admission sa Free Zone.

⭐ Bakit Mahalaga Ito?

Kritikal ito sa tamang pagkalkula ng duty, lalo na sa mga sitwasyon kung saan may pagbabago sa tariff rates sa pagitan ng petsa ng pagpasok at ng aktwal na proseso ng entry.

⚠️ Dapat Tandaan

*   Magkaibang "reference date" ang ginagamit depende sa klase ng entry — huwag basta ipagpalagay na palaging "petsa ng pagdating" ang batayan.

🎯 Board Exam Tip

I-memorize ang apat na iba't ibang scenario: regular importation, warehousing withdrawal, free zone withdrawal, at auction sale — bawat isa ay may sariling reference date.

❓ Madalas Malito ang Students

*   **Tanong:** Kung tumaas ang duty rate habang naka-imbak pa ang goods ko sa isang bonded warehouse, aling rate ang gagamitin?
*   **Sagot:** Ang rate na effective sa petsa ng withdrawal mula sa warehouse para sa consumption — hindi ang rate noong petsa ng orihinal na importation.

🔗 Related Topics

*   Sec. 1143(a) - Customs Public Auction

🤖 Need More Explanation?

Explain Section 105 of the CMTA in simple terms. Give practical Customs examples comparing regular importation, warehousing withdrawal, and free zone withdrawal. Explain why the reference date matters when tariff rates change, mention Section 1143(a) and relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 105 of the CMTA in simple terms. Give practical Customs examples comparing regular importation, warehousing withdrawal, and free zone withdrawal. Explain why the reference date matters when tariff rates change, mention Section 1143(a) and relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},254:{_label:"section 106 — Declarant",title:"Sino ang Declarant? (Section 106)",content:`📖 Kahulugan

Itinatakda ng Section 106 kung sino ang maaaring maging Declarant — ang taong opisyal na maglalagda at maglolodge ng Goods Declaration sa Bureau of Customs, maaaring ito ay ang consignee mismo o sinumang may karapatang mag-disposed ng goods.

🔍 Breakdown

*   **Consignee or person with right to dispose:** dalawang posibleng klase ng declarant.
*   **Lodges the goods declaration:** sila ang opisyal na naglalagda at nagsusumite.
*   **Juridical person may authorize a responsible officer:** kung korporasyon ang consignee, may maaaring pahintulutang opisyal na lumagda sa ngalan nito.
*   **Processed by declarant or licensed customs broker:** dalawang pwedeng magproseso.
*   **Two-year transition period:** para sa implementasyon ng paragraph (d), alinsunod sa CMO 34-2019.

💡 Simpleng Paliwanag

Ang Declarant ay ang "opisyal na taong" kumakatawan sa isang shipment sa harap ng BOC — maaaring ito mismo ang consignee/importer, ang exporter, isang licensed customs broker, o isang legal na kinatawan.

📦 Halimbawa

Isang kumpanyang nag-import ng makinarya ay nagtalaga ng isang responsableng opisyal nito bilang authorized signatory sa Goods Declaration, at kinuha rin nila ang serbisyo ng isang licensed Customs Broker para iproseso ang buong dokumentasyon.

⭐ Bakit Mahalaga Ito?

Mahalagang malaman kung sino ang legal na maaaring kumilos bilang Declarant, dahil sa kanila nakasalalay ang responsibilidad sa katumpakan ng deklarasyon.

⚠️ Dapat Tandaan

*   May two-year transition period bago buong ipinatupad ang paragraph (d) ng seksyong ito, alinsunod sa CMO 34-2019.

🎯 Board Exam Tip

Kabisaduhin ang apat na klase ng Declarant sa ilalim ng (a)-(d): importer, exporter, customs broker, at duly authorized agent/attorney-in-fact.

❓ Madalas Malito ang Students

*   **Tanong:** Ang Customs Broker ba ang laging Declarant?
*   **Sagot:** Hindi laging sila — maaaring ang Declarant ay ang importer/exporter mismo, at ang Customs Broker naman ay ang magpoproseso lamang ng deklarasyon, bagama't karaniwan silang parehong lumalagda sa dokumento.

🔗 Related Topics

*   Sec. 107 - Rights and Responsibilities of the Declarant
*   CMO 34-2019 - Interim Guidelines on Sections 106 and 107

🤖 Need More Explanation?

Explain Section 106 of the CMTA on the Declarant in simple terms. Give practical Customs examples of the four classes of declarant. Explain the two-year transition period under CMO 34-2019, mention relevant CAOs/CMOs, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 106 of the CMTA on the Declarant in simple terms. Give practical Customs examples of the four classes of declarant. Explain the two-year transition period under CMO 34-2019, mention relevant CAOs/CMOs, provide board exam insights, and clarify common misconceptions students have about this section."},255:{_label:"paragraph (a) — ",title:"Sec. 106(a) — Ang Importer bilang Declarant",content:`📖 Kahulugan

Ayon sa Sec. 106(a), ang importer, bilang may hawak ng Bill of Lading, ay maaaring kumilos bilang Declarant ng isang shipment.

🔍 Breakdown

*   **Importer = holder of B/L:** ito ang pinaka-direktang klase ng declarant.

💡 Simpleng Paliwanag

Kung ikaw mismo ang may hawak ng Bill of Lading ng iyong shipment, ikaw mismo ang pwedeng maging opisyal na Declarant nito.

📦 Halimbawa

Isang kumpanyang nag-order ng raw materials mula abroad, at nasa kanilang pangalan ang Bill of Lading, ay maaaring direktang kumilos bilang Declarant ng kanilang shipment.

⭐ Bakit Mahalaga Ito?

Ito ang pinaka-simpleng at direktang setup — walang ibang partido na kailangan pang mag-authorize.

⚠️ Dapat Tandaan

*   Dapat talaga siya ang holder ng B/L — hindi lang basta claimant.

🎯 Board Exam Tip

Ikonekta agad sa Sec. 102(h) - Bill of Lading.

❓ Madalas Malito ang Students

*   **Tanong:** Kung hindi ako ang nakalagay sa Bill of Lading pero ako ang tunay na bumili ng goods, pwede pa rin ba akong maging Declarant?
*   **Sagot:** Hindi sa ilalim ng paragraph (a); kailangan mong maging holder ng B/L, o kumilos sa pamamagitan ng agent/attorney-in-fact (paragraph d).

🔗 Related Topics

*   Sec. 102(h) - Bill of Lading

🤖 Need More Explanation?

Explain Section 106(a) of the CMTA in simple terms. Give practical Customs examples of an importer holding a bill of lading. Explain how this connects to Section 102(h), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 106(a) of the CMTA in simple terms. Give practical Customs examples of an importer holding a bill of lading. Explain how this connects to Section 102(h), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},256:{_label:"paragraph (b) — ",title:"Sec. 106(b) — Ang Exporter bilang Declarant",content:`📖 Kahulugan

Ayon sa Sec. 106(b), ang exporter, bilang may-ari ng goods na ipapadala palabas, ay maaari ring kumilos bilang Declarant.

🔍 Breakdown

*   **Exporter = owner of goods to be shipped out:** applicable sa exportation transactions, kabaligtaran ng paragraph (a) na para sa importation.

💡 Simpleng Paliwanag

Kung ikaw ang may-ari ng goods na ipapadala mo palabas ng bansa, ikaw mismo ang pwedeng maging Declarant para sa Export Declaration nito.

📦 Halimbawa

Isang lokal na manufacturer ng handicraft na nagpapadala ng kanyang produkto papuntang Europe ay maaaring direktang kumilos bilang Declarant sa kanyang Export Declaration.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng malinaw na batayan kung sino ang responsable sa panig ng exportation, kaparehas ng ginagawa ng paragraph (a) sa panig ng importation.

⚠️ Dapat Tandaan

*   Dapat siya talaga ang may-ari ng goods, hindi lang basta shipper o forwarder.

🎯 Board Exam Tip

Ikonekta sa Sec. 102(s) - Exportation, at Sec. 102(t) - Export Declaration.

❓ Madalas Malito ang Students

*   **Tanong:** Ang Freight Forwarder ba ang Declarant sa exportation?
*   **Sagot:** Hindi — ang exporter/may-ari ng goods ang Declarant; ang Freight Forwarder ay tumutulong lamang sa logistics.

🔗 Related Topics

*   Sec. 102(s) - Exportation
*   Sec. 102(t) - Export Declaration

🤖 Need More Explanation?

Explain Section 106(b) of the CMTA in simple terms. Give practical Customs examples of an exporter as declarant. Explain how this connects to Sections 102(s) and 102(t), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 106(b) of the CMTA in simple terms. Give practical Customs examples of an exporter as declarant. Explain how this connects to Sections 102(s) and 102(t), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},257:{_label:"paragraph (c) — ",title:"Sec. 106(c) — Ang Customs Broker bilang Declarant",content:`📖 Kahulugan

Ayon sa Sec. 106(c), ang isang licensed Customs Broker, kapag kumikilos sa ilalim ng awtoridad ng importer o ng holder ng bill, ay maaari ring maging Declarant.

🔍 Breakdown

*   **Requires authority from importer/bill holder:** hindi awtomatiko ang karapatan — kailangan munang bigyan ng awtoridad ng importer.

💡 Simpleng Paliwanag

Kung may bonafide Customs Broker kang inupahan at binigyan mo siya ng awtoridad na kumatawan sa iyo, siya na mismo ang maaaring kumilos bilang Declarant sa iyong ngalan.

📦 Halimbawa

Nag-hire ang isang maliit na negosyante ng isang licensed Customs Broker para asikasuhin ang kanyang importation. Sa awtoridad na binigay sa kanya, ang broker mismo ang lumagda at kumilos bilang Declarant.

⭐ Bakit Mahalaga Ito?

Ito ang pinaka-karaniwang setup sa praktika lalo na para sa mga negosyanteng walang sariling in-house na customs team.

⚠️ Dapat Tandaan

*   Kailangang may malinaw na awtorisasyon mula sa importer o bill holder bago maaaring kumilos ang broker bilang Declarant.

🎯 Board Exam Tip

Ikonekta sa Sec. 102(n) - Customs Broker, at sa Sec. 107 kung saan nakasaad na ang broker ay hindi responsable sa bayad ng duties/taxes kahit siya ang Declarant.

❓ Madalas Malito ang Students

*   **Tanong:** Kung ako ang Customs Broker na Declarant, ako na ba ang mananagot sa bayad ng buwis?
*   **Sagot:** Hindi — ayon sa Sec. 107, responsable ang broker sa katumpakan ng deklarasyon, pero hindi sa pagbabayad ng duties, taxes, at iba pang charges.

🔗 Related Topics

*   Sec. 102(n) - Customs Broker
*   Sec. 107 - Rights and Responsibilities of the Declarant

🤖 Need More Explanation?

Explain Section 106(c) of the CMTA in simple terms. Give practical Customs examples of a broker acting under the importer's authority. Explain how this connects to Section 107 on payment responsibility, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 106(c) of the CMTA in simple terms. Give practical Customs examples of a broker acting under the importer's authority. Explain how this connects to Section 107 on payment responsibility, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},258:{_label:"paragraph (d) — ",title:"Sec. 106(d) — Awtorisadong Ahente o Attorney-in-Fact bilang Declarant",content:`📖 Kahulugan

Ayon sa Sec. 106(d), ang sinumang taong may wastong kapangyarihan na kumilos bilang ahente o attorney-in-fact para sa bawat holder ay maaari ring maging Declarant.

🔍 Breakdown

*   **Duly empowered agent/attorney-in-fact:** dapat may legal na dokumento ng awtorisasyon, hal. Special Power of Attorney.
*   **Subject to the two-year transition period** ng parent Sec. 106, alinsunod sa CMO 34-2019.

💡 Simpleng Paliwanag

Ito ay para sa mga sitwasyon kung saan may ibang tao, hindi customs broker, na binigyan ng legal na kapangyarihan para kumatawan sa importer o exporter.

📦 Halimbawa

Isang kumpanya sa abroad na walang lokal na opisina ay nagbigay ng Special Power of Attorney sa isang lokal na kinatawan para kumilos bilang kanilang attorney-in-fact sa mga transaksyon sa BOC.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng flexibility sa mga sitwasyon kung saan hindi practical o posible para sa importer/exporter na personal na kumilos.

⚠️ Dapat Tandaan

*   Ang implementasyon ng paragraph na ito ay sinusubaybayan sa ilalim ng two-year transition period mula sa parent Sec. 106.

🎯 Board Exam Tip

Ikonekta sa buong apat na klase ng Declarant sa ilalim ng Sec. 106 (a-d).

❓ Madalas Malito ang Students

*   **Tanong:** Sino ang may awtoridad na magbigay ng "power" sa isang agent/attorney-in-fact?
*   **Sagot:** Ang holder (importer, holder ng B/L, o exporter na may-ari ng goods) ang nagbibigay ng awtorisasyon sa pamamagitan ng legal na dokumento tulad ng Special Power of Attorney.

🔗 Related Topics

*   Sec. 106 (buong seksyon)
*   CMO 34-2019

🤖 Need More Explanation?

Explain Section 106(d) of the CMTA in simple terms. Give practical Customs examples of a duly authorized agent or attorney-in-fact acting as declarant. Explain the two-year transition period under CMO 34-2019, mention relevant CAOs/CMOs, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 106(d) of the CMTA in simple terms. Give practical Customs examples of a duly authorized agent or attorney-in-fact acting as declarant. Explain the two-year transition period under CMO 34-2019, mention relevant CAOs/CMOs, provide board exam insights, and clarify common misconceptions students have about this provision."},259:{_label:"section 107 — Rights and Responsibilities of the Declarant",title:"Mga Karapatan at Responsibilidad ng Declarant (Section 107)",content:`📖 Kahulugan

Itinatakda ng Section 107 ang hatian ng responsibilidad sa pagitan ng Declarant at ng licensed Customs Broker — ang Declarant ang may pananagutan sa katumpakan ng Goods Declaration AT sa pagbabayad ng duties, taxes, at iba pang singil, samantalang ang Customs Broker ay may pananagutan lamang sa katumpakan ng deklarasyon.

🔍 Breakdown

*   **Declarant responsible for accuracy AND payment:** dalawang responsibilidad.
*   **Licensed customs broker responsible for accuracy ONLY:** hindi kasama ang bayad ng duties/taxes.
*   **Both must sign the goods declaration:** kahit assisted ng broker, dapat pareho silang lumagda.

💡 Simpleng Paliwanag

Malinaw dito na kahit tinulungan ka ng isang Customs Broker sa paghahanda ng iyong deklarasyon, ikaw pa rin ang may huling responsibilidad sa pagbabayad ng buwis — ang broker ay katuwang mo lang sa katumpakan ng dokumento, pareho kayong lumalagda.

📦 Halimbawa

Nagkamali ang isang Customs Broker sa pagdeklara ng quantity ng isang shipment. Dahil pareho silang lumagda ng importer at broker sa Goods Declaration, pareho silang maaaring managot sa katumpakan ng impormasyon — pero ang aktwal na duties at taxes ay obligasyon pa rin ng importer.

⭐ Bakit Mahalaga Ito?

Nililinaw nito ang malinaw na hatian ng accountability sa pagitan ng dalawang partido, na kritikal sa mga kaso ng disputes o errors sa deklarasyon.

⚠️ Dapat Tandaan

*   Ang broker ay HINDI responsable sa pagbabayad ng duties/taxes, kahit siya ang nagproseso ng deklarasyon.

🎯 Board Exam Tip

Alalahanin ang paghahati: Accuracy = parehong Declarant at Broker; Payment = Declarant lamang.

❓ Madalas Malito ang Students

*   **Tanong:** Kung nagkamali ang Customs Broker sa aking deklarasyon, siya na ba ang mananagot sa buwis na dapat kong bayaran?
*   **Sagot:** Hindi — mananatili sa Declarant ang obligasyon sa pagbabayad ng duties at taxes, kahit sino pa ang nagkamali sa paghahanda ng dokumento; pareho lang silang managot sa katumpakan ng deklarasyon.

🔗 Related Topics

*   Sec. 106 - Declarant
*   Sec. 108 - Penalties for Errors in Goods Declaration

🤖 Need More Explanation?

Explain Section 107 of the CMTA in simple terms. Give practical Customs examples showing how accuracy and payment responsibility are split between the declarant and the broker. Explain why this distinction matters, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 107 of the CMTA in simple terms. Give practical Customs examples showing how accuracy and payment responsibility are split between the declarant and the broker. Explain why this distinction matters, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},260:{_label:"section 108 — Penalties for Errors in Goods Declaration",title:"Parusa sa mga Pagkakamali sa Goods Declaration (Section 108)",content:`📖 Kahulugan

Ayon sa Section 108, hindi dapat magpataw ang Bureau ng malaking parusa kapag ang pagkakamali sa Goods Declaration ay hindi sinasadya at walang fraudulent intent o gross negligence, bagama't maaari pa ring magpataw ng makatwirang parusa para maiwasan ang paulit-ulit na pagkakamali.

🔍 Breakdown

*   **No substantial penalties for inadvertent errors:** proteksyon para sa honest mistakes.
*   **Condition:** no fraudulent intent or gross negligence.
*   **Penalty may still be imposed but not excessive:** hindi ibig sabihin walang parusa, kundi hindi dapat sobra-sobra.
*   **Purpose:** to discourage repetition ng error.

💡 Simpleng Paliwanag

Nauunawaan ng batas na tao lang tayo at nagkakamali — kaya kung honest mistake lang ang isang error sa deklarasyon, hindi ka dapat patawan ng sobrang bigat na parusa. Pero maaari ka pa ring bigyan ng maliit na parusa para lang maging maingat ka sa susunod.

📦 Halimbawa

Nagkamali ang isang Customs Broker sa pagta-type ng isang digit sa quantity ng shipment dahil sa typo, walang anumang intensyon na manloko. Sa ganitong sitwasyon, hindi dapat ipataw ang matinding parusa, bagama't maaari pa ring may minimal na multa para sa pag-iingat sa hinaharap.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng proteksyon sa mga honest na Customs Broker at importer laban sa sobra-sobrang parusa, habang pinananatili pa rin ang disiplina sa sistema.

⚠️ Dapat Tandaan

*   Ang linya sa pagitan ng "inadvertent error" (protektado dito) at "Technical Smuggling" (hindi protektado, dahil may fraudulent intent) ay mahalagang maintindihan.

🎯 Board Exam Tip

Ikumpara agad ito sa Sec. 102(pp) - Technical Smuggling — parehong may pagkakamali sa deklarasyon, pero magkaiba ang presensya ng fraudulent intent.

❓ Madalas Malito ang Students

*   **Tanong:** Ibig sabihin ba nito ay walang anumang parusa sa mga pagkakamali?
*   **Sagot:** Hindi — malinaw sa batas na "a penalty may be imposed but shall not be excessive," ibig sabihin maaari pa ring magkaroon ng parusa, basta hindi ito sobra-sobra para sa isang honest mistake.

🔗 Related Topics

*   Sec. 102(pp) - Technical Smuggling
*   Sec. 107 - Rights and Responsibilities of the Declarant

🤖 Need More Explanation?

Explain Section 108 of the CMTA in simple terms. Give practical Customs examples of an inadvertent error vs a fraudulent one. Explain how this connects to Technical Smuggling under Section 102(pp), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 108 of the CMTA in simple terms. Give practical Customs examples of an inadvertent error vs a fraudulent one. Explain how this connects to Technical Smuggling under Section 102(pp), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},261:{_label:"section 109 — Application of Information and Communications Technology",title:"Paggamit ng ICT sa Customs (Section 109)",content:`📖 Kahulugan

Itinatakda ng Section 109 na dapat gumamit ang Bureau of Customs ng modernong information and communications technology para mapahusay ang customs control, magkaroon ng episyenteng operasyon, at makamit ang layuning "paperless customs environment," alinsunod sa international standards.

🔍 Breakdown

*   **Enhance customs control via ICT:** modernisasyon ng proseso.
*   **Communication and exchange of trade/logistics info:** pakikipag-ugnayan sa national at regional level.
*   **Data security standards:** dapat sumunod sa local at international na pamantayan sa seguridad ng datos.
*   **Disaster preparedness and recovery plan:** dapat may backup plan para hindi ma-disrupt ang serbisyo.
*   **Legal effect of electronic documents:** kapareho ng bisa ng electronic documents sa physical na dokumento.
*   **Consultation with stakeholders:** dapat may konsultasyon bago ipatupad ang bagong teknolohiya.

💡 Simpleng Paliwanag

Sinasabi lang nito na dapat "mag-digital" ang BOC — gamit ang teknolohiya para mas mabilis, episyente, at secure ang proseso, at dapat legal at valid din ang mga electronic na dokumento tulad ng physical na papel.

📦 Halimbawa

Sa modernong e2m system ng BOC, ang mga Goods Declaration, permit, at resibo ay ginagawa na sa electronic form — ito ay direktang implementasyon ng Sec. 109, kung saan binigyan ng parehong legal na bisa ang electronic documents gaya ng dati'y physical na papel.

⭐ Bakit Mahalaga Ito?

Ito ang legal na basehan ng lahat ng modernisasyon ng BOC — mula sa Lodgement hanggang sa electronic payment, lahat ito ay naka-anchor sa Sec. 109.

⚠️ Dapat Tandaan

*   Kasama sa obligasyon ng BOC ang pagkakaroon ng disaster preparedness plan para hindi maapektuhan ang serbisyo kahit may technical disruptions.

🎯 Board Exam Tip

Ikonekta ito sa Lodgement (Sec. 102dd) — ang electronic registration ng Goods Declaration ay direktang aplikasyon ng prinsipyong nakasaad dito.

❓ Madalas Malito ang Students

*   **Tanong:** May legal na bisa ba ang electronic na dokumento kagaya ng physical na papel?
*   **Sagot:** Oo — malinaw sa batas na dapat may legal effect, validity, o enforceability ang electronic documents, permits, licenses, o certificates, basta't nasusunod ang mga kinakailangang requirements.

🔗 Related Topics

*   Sec. 102(dd) - Lodgement
*   Sec. 110 - Relationship Between the Bureau and Third Parties

🤖 Need More Explanation?

Explain Section 109 of the CMTA in simple terms. Give practical Customs examples of the e2m electronic system. Explain how this connects to Lodgement under Section 102(dd), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 109 of the CMTA in simple terms. Give practical Customs examples of the e2m electronic system. Explain how this connects to Lodgement under Section 102(dd), mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},262:{_label:"paragraph (a) — ",title:"Sec. 109(a) — Pagkilala sa Awtentisidad ng Electronic Documents",content:`📖 Kahulugan

Ayon sa Sec. 109(a), obligado ang Bureau na kilalanin ang authenticity at reliability ng mga electronic documents na gagamitin sa customs procedures.

💡 Simpleng Paliwanag

Dapat tratuhin ng BOC ang isang wastong electronic document nang kasing-seryoso ng isang physical na dokumentong may basaha't lagda.

📦 Halimbawa

Kapag nag-upload ang isang broker ng electronic Goods Declaration sa e2m system, dapat itong kilalanin ng BOC bilang totoo at mapagkakatiwalaang dokumento, hindi requirement pa ang physical na kopya bilang karagdagang patunay.

⭐ Bakit Mahalaga Ito?

Ito ang pundasyon kung bakit maaaring umasa ang buong industriya sa purely electronic transactions nang walang pag-aalinlangan sa legal na bisa nito.

⚠️ Dapat Tandaan

*   Ang authenticity at reliability ay dapat masiguro sa pamamagitan ng tamang security infrastructure, tingnan din ang parent section tungkol sa data security.

🎯 Board Exam Tip

Ikonekta ito sa buong layunin ng Sec. 109 — paperless customs environment.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan pa rin bang magpadala ng physical copy bilang backup?
*   **Sagot:** Hindi ang layunin ng probisyong ito — dapat kilalanin mismo ng BOC ang electronic document bilang sapat at mapagkakatiwalaan.

🔗 Related Topics

*   Sec. 109 (buong seksyon)

🤖 Need More Explanation?

Explain Section 109(a) of the CMTA in simple terms. Give practical Customs examples of electronic document recognition in the e2m system. Explain why this matters for a paperless environment, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 109(a) of the CMTA in simple terms. Give practical Customs examples of electronic document recognition in the e2m system. Explain why this matters for a paperless environment, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},263:{_label:"paragraph (b) — ",title:"Sec. 109(b) — Electronic na Pagpapadala ng Approval",content:`📖 Kahulugan

Ayon sa Sec. 109(b), ang BOC ay obligadong magpadala ng kanilang approval sa anyo ng electronic data messages o electronic documents.

💡 Simpleng Paliwanag

Kapag na-approve na ang iyong transaksyon, hindi na kailangang maghintay ng physical na papel — maaari itong ipadala sa iyo sa electronic form.

📦 Halimbawa

Matapos ma-approve ang isang Goods Declaration, direktang naka-post ang approval sa e2m portal ng broker/importer, imbes na maghintay ng naka-print na dokumento mula sa BOC.

⭐ Bakit Mahalaga Ito?

Nagpapabilis ito ng buong proseso ng customs clearance, dahil hindi na kailangang maghintay ng physical na delivery ng mga dokumento ng approval.

⚠️ Dapat Tandaan

*   Ang electronic na approval ay may parehong legal na bisa gaya ng physical na dokumento, ayon sa parent section.

🎯 Board Exam Tip

Ikonekta sa layunin ng "paperless customs environment" sa Sec. 109.

❓ Madalas Malito ang Students

*   **Tanong:** Valid ba ang electronic approval kahit walang physical na kopya?
*   **Sagot:** Oo — malinaw sa batas na maaaring electronic ang paraan ng pagpapadala ng approval, at ito ay may parehong legal na bisa.

🔗 Related Topics

*   Sec. 109 (buong seksyon)

🤖 Need More Explanation?

Explain Section 109(b) of the CMTA in simple terms. Give practical Customs examples of electronic approval transmission. Explain why this speeds up clearance, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 109(b) of the CMTA in simple terms. Give practical Customs examples of electronic approval transmission. Explain why this speeds up clearance, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},264:{_label:"paragraph (c) — ",title:"Sec. 109(c) — Electronic na Pagbabayad at Pag-isyu ng Resibo",content:`📖 Kahulugan

Ayon sa Sec. 109(c), maaaring hingin at/o tanggapin ng BOC ang pagbabayad, at mag-isyu ng resibo bilang patunay nito, sa pamamagitan ng mga sistemang gumagamit ng electronic data messages o electronic documents.

💡 Simpleng Paliwanag

Puwede nang magbayad online o sa electronic paraan ng iyong duties at taxes, at ang resibo na matatanggap mo bilang patunay ng bayad ay maaari ring electronic — hindi na kailangang physical na resibo.

📦 Halimbawa

Isang importer na nagbayad ng kanyang duties at taxes sa pamamagitan ng online banking na naka-link sa e2m system ng BOC, at agad na natanggap ang electronic receipt bilang patunay ng bayad.

⭐ Bakit Mahalaga Ito?

Pinapabilis at pinapadali nito ang buong proseso ng pagbabayad, at binabawasan ang panganib ng pagkawala ng physical na resibo.

⚠️ Dapat Tandaan

*   Ang electronic receipt ay dapat may parehong legal na bisa gaya ng physical na resibo bilang patunay ng bayad.

🎯 Board Exam Tip

Ikonekta ito sa Sec. 104 tungkol sa obligasyon ng Bureau na mag-isyu ng resibo bilang proof of payment.

❓ Madalas Malito ang Students

*   **Tanong:** Sapat na ba ang electronic receipt bilang patunay kung may dispute sa hinaharap?
*   **Sagot:** Oo, dahil binigyan ng parehong legal effect at validity ang electronic documents sa ilalim ng Sec. 109.

🔗 Related Topics

*   Sec. 104 - When Duty and Tax are Due
*   Sec. 109 (buong seksyon)

🤖 Need More Explanation?

Explain Section 109(c) of the CMTA in simple terms. Give practical Customs examples of electronic payment and receipts. Explain how this connects to Section 104's receipt requirement, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision.`,prompt:"Explain Section 109(c) of the CMTA in simple terms. Give practical Customs examples of electronic payment and receipts. Explain how this connects to Section 104's receipt requirement, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this provision."},265:{_label:"section 110 — Relationship Between the Bureau and Third Parties",title:"Relasyon ng Bureau at mga Third Party (Section 110)",content:`📖 Kahulugan

Itinatakda ng Section 110 na ang mga partido ay maaaring direktang makipagtransaksyon sa Bureau of Customs, o sa pamamagitan ng isang itinalagang third party na kumakatawan sa kanila, at dapat parehong pantay ang pagtrato sa dalawang paraan.

🔍 Breakdown

*   **Direct or through third party:** dalawang opsyon para sa transaksyon.
*   **No less favorable treatment:** parehong dapat pagtrato ang dalawang paraan.
*   **Third party has same rights and obligations as designating party:** kapareho ng karapatan at obligasyon.
*   **Secretary of Finance issues guidelines:** sila ang magbibigay ng detalyadong alituntunin.

💡 Simpleng Paliwanag

Kahit direkta kang makipag-usap sa BOC o gumamit ka ng kinatawan tulad ng Customs Broker, dapat parehong klase ng serbisyo at proseso ang matatanggap mo — walang dapat "shortcut" o "penalty" sa alinmang paraan.

📦 Halimbawa

Isang importer na direktang nakikipag-transaksyon sa BOC ay dapat tratuhin nang pareho sa isang importer na gumagamit ng Customs Broker bilang kanilang third party — walang dapat mas mabagal o mas mahigpit na requirement sa isa kumpara sa isa.

⭐ Bakit Mahalaga Ito?

Nagsisiguro ito ng fairness at pantay na proseso sa lahat ng stakeholders, anuman ang kanilang piniling paraan ng pakikipagtransaksyon sa BOC.

⚠️ Dapat Tandaan

*   Ang third party ay dapat may parehong karapatan AT obligasyon ng nagtalaga sa kanila — hindi lang benefits, kundi pati responsibilidad.

🎯 Board Exam Tip

Ikonekta ito sa Sec. 102(uu) - Third Party, at sa konsepto ng Customs Broker bilang karaniwang halimbawa ng third party.

❓ Madalas Malito ang Students

*   **Tanong:** Mas mabilis bang maproseso ang transaksyon kung direkta akong makikipag-ugnayan sa BOC kaysa gumamit ng broker?
*   **Sagot:** Hindi dapat — malinaw sa batas na hindi dapat ma-treat nang "less favorably" ang isang paraan kumpara sa isa; parehong dapat pantay ang proseso.

🔗 Related Topics

*   Sec. 102(uu) - Third Party
*   Sec. 102(n) - Customs Broker

🤖 Need More Explanation?

Explain Section 110 of the CMTA in simple terms. Give practical Customs examples comparing direct transactions vs using a broker. Explain how this connects to Section 102(uu) on Third Party, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 110 of the CMTA in simple terms. Give practical Customs examples comparing direct transactions vs using a broker. Explain how this connects to Section 102(uu) on Third Party, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},266:{_label:"section 111 — Information of General Application",title:"Impormasyon na Pangkalahatang Aplikasyon (Section 111)",content:`📖 Kahulugan

Itinatakda ng Section 111 na dapat i-publish ang lahat ng batas, desisyon, ruling, circular, memoranda, at orders ng BOC, at dapat itong madaling ma-access ng sinumang interesadong tao, maliban na lamang kung ito ay confidential o para lamang sa internal na paggamit.

🔍 Breakdown

*   **Publication requirement:** dapat i-publish alinsunod sa batas.
*   **Accessibility of general information:** dapat readily accessible sa publiko.
*   **Exception:** confidential or internal use only.
*   **Advance notice of changes:** dapat gawing available bago pa ang effective date ng bagong probisyon, maliban kung precluded ang advance notice.

💡 Simpleng Paliwanag

Dapat "bukas ang libro" ng BOC sa publiko — lahat ng batas, alituntunin, at patakaran nila ay dapat mahanap at maintindihan ng sinumang interesadong tao, at dapat sila ay bigyan ng abiso bago pa man ipatupad ang mga pagbabago.

📦 Halimbawa

Bago ipatupad ng BOC ang isang bagong Customs Administrative Order tungkol sa valuation, dapat itong i-publish at gawing accessible sa publiko bago pa man ang petsa ng implementasyon nito, para may sapat na oras ang mga stakeholder na mag-adjust.

⭐ Bakit Mahalaga Ito?

Ito ang batayan ng transparency sa Customs administration — kaugnay ito ng Declaration of Policy sa Sec. 101(c) tungkol sa pag-establish ng regime ng transparency.

⚠️ Dapat Tandaan

*   May exception para sa impormasyong confidential o para lamang sa internal use ng Bureau — hindi lahat ay dapat i-disclose.

🎯 Board Exam Tip

Ikonekta ito sa Sec. 101(c) at Sec. 112 — magkaiba ang saklaw: general application dito, specific matter doon.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan bang lahat ng impormasyon ng BOC ay ipublish?
*   **Sagot:** Hindi lahat — hindi kasama dito ang mga impormasyong confidential o para lamang sa internal use ng Bureau.

🔗 Related Topics

*   Sec. 101(c) - Declaration of Policy
*   Sec. 112 - Information of Specific Nature

🤖 Need More Explanation?

Explain Section 111 of the CMTA in simple terms. Give practical Customs examples of publication requirements for new orders. Explain how this connects to Section 101(c) and differs from Section 112, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 111 of the CMTA in simple terms. Give practical Customs examples of publication requirements for new orders. Explain how this connects to Section 101(c) and differs from Section 112, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},267:{_label:"section 112 — Information of a Specific Nature",title:"Impormasyon na Partikular ang Kalikasan (Section 112)",content:`📖 Kahulugan

Ayon sa Section 112, obligado ang BOC na magbigay ng impormasyon, na hindi confidential o para lamang sa internal use, kaugnay ng isang partikular na bagay, kapag ito ay hiniling ng isang interesadong partido para sa lehitimong layunin.

🔍 Breakdown

*   **Specific matter, upon request:** hindi general publication kundi partikular na hiling.
*   **Legitimate use requirement:** dapat may lehitimong dahilan ang humihiling.
*   **Bureau may charge a reasonable fee:** maaaring may bayad.
*   **Released within reasonable time:** dapat may makatwirang takdang panahon ng pagbibigay ng impormasyon.

💡 Simpleng Paliwanag

Kung may partikular kang katanungan sa BOC tungkol sa iyong sariling transaksyon o kaso, may karapatan kang humingi ng impormasyon tungkol dito — puwede lang silang maningil ng makatwirang bayad, at dapat nila itong ibigay sa loob ng makatwirang panahon.

📦 Halimbawa

Humiling ang isang importer ng detalyadong impormasyon tungkol sa status ng kanyang naka-pending na shipment sa isang partikular na Customs district. Dahil ito ay lehitimong request at hindi confidential, obligado ang BOC na ibigay ito, posibleng may kaukulang bayad.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng mekanismo para sa mga stakeholder na makakuha ng detalyadong sagot sa kanilang sariling transaksyon, hindi lang general publication ng batas.

⚠️ Dapat Tandaan

*   May karapatan ang BOC na maniningil ng reasonable fee sa pagbibigay ng ganitong uri ng impormasyon.

🎯 Board Exam Tip

Ikumpara agad ito sa Sec. 111 — general application versus specific nature.

❓ Madalas Malito ang Students

*   **Tanong:** Libre ba ang paghingi ng ganitong impormasyon?
*   **Sagot:** Hindi laging libre — maaaring maningil ang Bureau ng reasonable fee bago ibigay ang hiniling na impormasyon.

🔗 Related Topics

*   Sec. 111 - Information of General Application
*   Sec. 113 - Decision and Ruling

🤖 Need More Explanation?

Explain Section 112 of the CMTA in simple terms. Give practical Customs examples of requesting specific transaction information. Explain how this differs from Section 111, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 112 of the CMTA in simple terms. Give practical Customs examples of requesting specific transaction information. Explain how this differs from Section 111, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions students have about this section."},268:{_label:"section 113 — Decision and Ruling",title:"Desisyon at Ruling ng Bureau (Section 113)",content:`📖 Kahulugan

Ayon sa Section 113, obligado ang Bureau na mag-isyu ng binding at advance decision o ruling sa hiling ng isang interesadong partido, tungkol sa mga bagay na may kinalaman sa importation o exportation ng goods.

🔍 Breakdown

*   **Binding and advance decision/ruling:** dapat sumusunod ang BOC sa desisyong ito, at maaaring hilingin bago pa gawin ang aktwal na transaksyon.
*   **Written request required:** dapat nakasulat ang hiling.
*   **Written notification within specified period:** dapat isulat at ibigay ang desisyon sa loob ng itinakdang panahon.
*   **Reasons and right of appeal if adverse:** kung hindi paborable ang desisyon, dapat may dahilan at abiso ng karapatang mag-apela.
*   **30-day period:** dapat i-isyu ang ruling sa loob ng 30 araw mula pagkakumpleto ng dokumento.

💡 Simpleng Paliwanag

Kung hindi ka sigurado sa tamang classification o valuation ng iyong planong i-import, puwede kang humiling ng "advance ruling" sa BOC bago pa man mangyari ang aktwal na transaksyon — at ito ay magiging binding, ibig sabihin dapat sundin ito ng BOC.

📦 Halimbawa

Nag-request ang isang kumpanya ng advance ruling sa Bureau tungkol sa tamang HS classification ng isang bagong produkto na balak nilang i-import, para masigurong tama ang kanilang paghahanda ng dokumento bago pa man dumating ang aktwal na shipment. Sa loob ng 30 araw mula pagkumpleto ng requirements, dapat magbigay ng ruling ang BOC.

⭐ Bakit Mahalaga Ito?

Nagbibigay ito ng certainty at predictability sa mga negosyante bago pa man sila gumawa ng malaking desisyon sa importation o exportation, na nakakatulong sa risk management.

⚠️ Dapat Tandaan

*   Ang ruling ay dapat i-isyu sa loob ng 30 araw mula sa pagsusumite ng kinakailangang dokumento at impormasyon.

🎯 Board Exam Tip

I-memorize ang 30-day period, at ikonekta ito sa CAO 03-2016 (Advance Ruling System) para sa mas detalyadong proseso.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan ko bang maghintay hanggang dumating ang aktwal na shipment ko bago ako humingi ng ruling?
*   **Sagot:** Hindi — ang layunin mismo ng "advance" ruling ay makakuha ka ng binding na desisyon BAGO pa man mangyari ang aktwal na importation o exportation.

🔗 Related Topics

*   Sec. 114 - Right of Appeal
*   CAO 03-2016 - Advance Ruling System

🤖 Need More Explanation?

Explain Section 113 of the CMTA in simple terms. Give practical Customs examples of requesting an advance ruling on HS classification. Explain the 30-day period and how this connects to Section 114 and CAO 03-2016, provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 113 of the CMTA in simple terms. Give practical Customs examples of requesting an advance ruling on HS classification. Explain the 30-day period and how this connects to Section 114 and CAO 03-2016, provide board exam insights, and clarify common misconceptions students have about this section."},269:{_label:"section 114 — Right of Appeal, Forms and Ground",title:"Karapatang Mag-apela (Section 114)",content:`📖 Kahulugan

Ayon sa Section 114, ang sinumang partidong naapektuhan ng isang desisyon o omission ng Bureau kaugnay ng importation, exportation, o iba pang legal na claim, ay may karapatang mag-apela sa loob ng labinlimang (15) araw mula pagkatanggap ng kwestiyunableng desisyon o utos.

🔍 Breakdown

*   **15-day period to appeal:** mahigpit na deadline.
*   **Written appeal required:** dapat nakasulat.
*   **Must specify grounds:** dapat malinaw ang dahilan ng apela.
*   **Bureau may allow reasonable time for supporting evidence:** maaaring bigyan ng karagdagang panahon para sa ebidensya.

💡 Simpleng Paliwanag

Kung hindi ka sang-ayon sa isang desisyon ng BOC, may 15 araw kang panahon mula sa pagkatanggap ng desisyon para mag-file ng nakasulat na apela, at dapat mong ilagay ang malinaw na dahilan kung bakit ka umaapela.

📦 Halimbawa

Hindi sumang-ayon ang isang importer sa dutiable value na itinakda ng examiner sa kanyang shipment. Sa loob ng 15 araw mula pagkatanggap ng desisyon, nag-file siya ng nakasulat na apela na may malinaw na paliwanag kung bakit mali, sa kanyang palagay, ang naging assessment.

⭐ Bakit Mahalaga Ito?

Ito ang legal na proteksyon ng bawat stakeholder laban sa mga desisyon ng BOC na sa tingin nila ay mali o hindi makatarungan — bahagi ito ng "fair and expeditious administrative and judicial appellate remedy" na nakasaad sa Declaration of Policy.

⚠️ Dapat Tandaan

*   Mahigpit ang 15-day period — kung lalampas ka dito, maaaring mawala ang iyong karapatang mag-apela.

🎯 Board Exam Tip

I-memorize ang 15-day period, at ikonekta ito sa Sec. 101(e) at Sec. 102(e) - Appeal.

❓ Madalas Malito ang Students

*   **Tanong:** Kailangan bang may kumpletong ebidensya agad sa oras ng pag-file ng apela?
*   **Sagot:** Hindi kinakailangan agad — malinaw sa batas na maaaring bigyan ng Bureau ng makatwirang panahon ang umaapela para maisumite ang supporting evidence.

🔗 Related Topics

*   Sec. 101(e) - Declaration of Policy
*   Sec. 102(e) - Appeal
*   Sec. 113 - Decision and Ruling

🤖 Need More Explanation?

Explain Section 114 of the CMTA in simple terms. Give practical Customs examples of filing a written appeal within 15 days. Explain how this connects to Section 101(e) and Section 102(e), provide board exam insights, and clarify common misconceptions students have about this section.`,prompt:"Explain Section 114 of the CMTA in simple terms. Give practical Customs examples of filing a written appeal within 15 days. Explain how this connects to Section 101(e) and Section 102(e), provide board exam insights, and clarify common misconceptions students have about this section."},309:{_label:"section 115 — Treatment of Importation",title:'Section 115: Kailan Itinuturing na "Entered" ang Imported Goods?',content:`📖 Kahulugan
Sa Section 115 ng CMTA, sinasabi kung kailan opisyal na itinuturing na "entered" (naipasok) ang mga imported goods sa Pilipinas para sa consumption. Hindi ito tumutukoy sa physical na pagdating ng goods, kundi sa legal na proseso ng pag-file ng declaration.

🔍 Breakdown
- Imported Goods – ang mga bagay na dinala papasok sa bansa mula sa ibang bansa.
- "Entered" for Consumption – legal status na nangangahulugang handa na itong i-process para sa domestic use, hindi lang pagdating sa daungan.
- Electronically Lodged – dapat gawin sa pamamagitan ng electronic/online system ng Bureau of Customs, hindi na manual submission.
- Goods Declaration – ang pangunahing dokumento na naglalaman ng detalye ng shipment.
- Required Supporting Documents – kasamang papeles tulad ng invoice, bill of lading, atbp.
- Pertinent Customs Office – ang tamang opisina ng customs kung saan dapat i-file ang declaration.

💡 Simpleng Paliwanag
Isipin mo na parang pag-file ng application online. Hindi pa ibig sabihin "entered" yung goods dahil lang dumating na sa daungan ang barko. "Entered" ito sa sandaling ma-submit online ang declaration kasama lahat ng kailangang papeles sa tamang customs office.

📦 Halimbawa
May importer sa Cebu na nag-order ng sasakyan mula Japan. Pagdating ng barko sa Cebu port, ang kanyang customs broker ang nag-lodge ng goods declaration sa electronic system ng Bureau of Customs kasama ang invoice at bill of lading. Sa sandaling iyon, opisyal nang "entered" ang sasakyan kahit nasa customs custody pa ito at hindi pa na-release.

⭐ Bakit Mahalaga Ito?
Ang konsepto ng "entry" ay nagsisilbing starting point para sa maraming customs procedures — kasama na dito ang pagcompute ng duties and taxes at pagsisimula ng ilang legal timelines. Kailangan itong maintindihan ng customs broker para malaman kung kailan opisyal na nagsisimula ang legal na obligasyon sa isang shipment.

⚠️ Dapat Tandaan
Huwag ipagkamali ang "entered" sa "released" — magkaiba ang dalawa. Ang entry ay tungkol sa pag-file ng declaration, habang ang release ay tungkol sa pagbibigay ng pisikal na possession ng goods sa importer.

🎯 Board Exam Tip
Karaniwang tinatanong sa exam ang tamang kahulugan ng "entered" — i-memorize ang tatlong elemento: electronic lodgment, goods declaration, at supporting documents, sa tamang customs office.

❓ Madalas Malito ang Students
Tanong: "Bakit 'entered' na agad kahit customs custody pa ang goods?" Sagot: Dahil ang "entry" ay legal/procedural na konsepto — tumutukoy ito sa pag-file ng declaration, hindi sa physical na pagpasok o release ng goods.

🔗 Related Topics
Section 116 (Free Importation and Exportation), konsepto ng Goods Declaration, CAO 09-2020.`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 115 ng CMTA (Republic Act No. 10863) tungkol sa "Treatment of Importation" — kailan itinuturing na "entered" ang imported goods. I-explain nang simple, magbigay ng practical na halimbawa mula sa aktwal na Customs operations sa Pilipinas, ipaliwanag kung bakit umiiral ang batas na ito, banggitin ang kaugnay na Section 116, at ang CAO 09-2020. Magbigay din ng tips para sa Customs Broker board exam at linawin ang karaniwang maling akala ng mga estudyante tungkol dito.'},310:{_label:"section 116 — Free Importation and Exportation",title:"Section 116: Ang Pangkalahatang Panuntunan sa Malayang Pag-import at Pag-export",content:`📖 Kahulugan
Ang Section 116 ang nagsasaad ng general rule sa CMTA: lahat ng goods ay maaaring malayang i-import papasok at i-export palabas ng Pilipinas nang walang kailangang permit, clearance, o lisensya, maliban na lang kung may ibang batas o regulasyon na nagsasabi ng iba.

🔍 Breakdown
- "Unless Otherwise Provided by Law or Regulation" – ito ang exception clause, nangangahulugang may mga batas na maaaring mag-require ng permit para sa specific goods.
- "Freely Imported and Exported" – default rule, walang kailangang espesyal na dokumento.
- Import/Export Permits, Clearances, Licenses – ang mga karaniwang requirement na hindi kailangan maliban kung may exception.

💡 Simpleng Paliwanag
Sa madaling salita, "free maliban kung sinabing bawal" ang principle. Lahat ay pwedeng i-trade papasok o palabas maliban kung espesipikong sinasabi ng batas na kailangan ng special permit — tulad ng regulated goods (Section 117), restricted goods (Section 119), o prohibited goods (Section 118).

📦 Halimbawa
Isang negosyante sa Davao ang nag-import ng ordinaryong kasangkapan sa bahay mula Indonesia. Dahil hindi ito regulated, restricted, o prohibited goods, hindi na siya kailangang kumuha pa ng special import permit — basta't sumunod lang siya sa normal customs procedures (declaration, duties, taxes).

⭐ Bakit Mahalaga Ito?
Ito ang foundational principle ng trade sa CMTA — nagbibigay ito ng economic freedom at nagpapadali sa negosyo. Mahalagang maintindihan ito bilang baseline bago pumasok sa mga exception sa Sections 117 hanggang 119.

⚠️ Dapat Tandaan
Ang "free" dito ay hindi nangangahulugang walang duties o taxes — tumutukoy lang ito sa kawalan ng kailangang permit, license, o clearance. Ito ang general rule; ang Sections 117–119 ang mga exception.

🎯 Board Exam Tip
Common trap sa exam ang pagsasama ng "free importation" sa "duty-free" — hindi sila pareho. I-relate ito bilang default rule bago pumunta sa specific regulated, restricted, o prohibited lists.

❓ Madalas Malito ang Students
Tanong: "Ibig bang sabihin lahat ng goods ay pwede nang i-import nang walang restriction?" Sagot: Hindi — ang Section 116 lang ang general rule; may mga specific exception sa Sections 117 (regulated), 118 (prohibited), at 119 (restricted).

🔗 Related Topics
Section 117 (Regulated), Section 118 (Prohibited), Section 119 (Restricted).`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 116 ng CMTA (Republic Act No. 10863) tungkol sa "Free Importation and Exportation." I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit ito ang general rule ng CMTA, banggitin ang kaugnay na Sections 117, 118, at 119, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},311:{_label:"section 117 — Regulated Importation and Exportation",title:"Section 117: Ano ang Regulated Goods at Paano Ito I-import?",content:`📖 Kahulugan
Ang mga regulated goods ay maaari lang i-import o i-export kung mayroon munang nakuhang goods declaration o export declaration, clearances, lisensya, at ibang requirements bago pa man mangyari ang importation o exportation.

🔍 Breakdown
- Regulated Goods – goods na may special requirement bago pwedeng i-trade.
- Prior Securing of Requirements – dapat makuha muna ang clearance o lisensya bago mag-import o mag-export.
- Exception sa Submission After Arrival – sa importation, pwedeng i-submit ang requirements pagkatapos dumating ang goods pero bago i-release mula sa customs custody, pero applicable lang ito kung pinapayagan ng governing laws o regulations.

💡 Simpleng Paliwanag
Kung regulated ang paninda mo, halimbawa gamot o kemikal, kailangan mo munang kumuha ng permit sa tamang ahensya bago mo ito i-import o i-export. May exception lang: kung pinapayagan ng batas, pwede mong isumite ang mga papeles pagkatapos dumating ang goods, basta bago pa ito ma-release sa iyo.

📦 Halimbawa
Isang pharmaceutical company ang nag-import ng gamot mula India. Dahil regulated ang gamot, kailangan muna nilang kumuha ng import clearance mula sa FDA bago pa man mag-abot ang shipment sa Pilipinas. Kung hindi pa kumpleto ang requirements pagdating ng shipment, maaari lang itong isumite pagkatapos, basta bago pa ma-release mula sa customs custody, kung pinapayagan ito ng regulasyon ng FDA.

⭐ Bakit Mahalaga Ito?
Nagpoprotekta ito sa publiko sa pamamagitan ng pagsisiguro na ang mga sensitibong produkto — gaya ng gamot, kemikal, at pagkain — ay dumadaan sa tamang regulatory review bago makarating sa merkado.

⚠️ Dapat Tandaan
Ang "after arrival" submission ay exception lang, hindi general rule — dapat may specific na batas o regulasyon na nagpapahintulot nito.

🎯 Board Exam Tip
I-distinguish ang "regulated" (Section 117 — kailangan ng prior clearance) laban sa "restricted" (Section 119 — bawal maliban kung authorized) at "prohibited" (Section 118 — completely banned).

❓ Madalas Malito ang Students
Tanong: "Regulated ba parehas ng restricted?" Sagot: Hindi — magkaiba ang treatment. Ang regulated goods ay pwedeng i-trade basta may tamang clearance, habang ang restricted goods ay talagang bawal maliban kung may specific authorization.

🔗 Related Topics
Section 116 (Free Importation), Section 119 (Restricted), mga regulatory agencies tulad ng FDA at DA.`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 117 ng CMTA (Republic Act No. 10863) tungkol sa "Regulated Importation and Exportation." I-explain nang simple, magbigay ng practical na halimbawa (hal. pharmaceutical o food products), ipaliwanag ang exception sa post-arrival submission, banggitin ang kaugnay na Sections 116 at 119, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},312:{_label:"section 118 — Prohibited Importation and Exportation",title:"Section 118: Anong mga Goods ang Ganap na Bawal i-Import o i-Export?",content:`📖 Kahulugan
Ang Section 118 ang naglilista ng mga goods na TALAGANG BAWAL i-import papasok o i-export palabas ng Pilipinas — walang exception, walang special permit na makapagpapahintulot nito.

🔍 Breakdown
- "Prohibited" – pinaka-mahigpit na klasipikasyon sa CMTA, iba ito sa "restricted" na pwede pang ma-authorize.
- Ang listahan sa ilalim nito (paragraphs a–g) ay sumasaklaw sa seditious materials, abortion-related items, obscene materials, mislabeled precious metals, adulterated food/drugs, IP-infringing goods, at iba pang ipinagbabawal ng batas.

💡 Simpleng Paliwanag
Kung nasa listahan ng Section 118, wala nang paraan para legal itong i-import o i-export — hindi ito katulad ng regulated o restricted goods na may paraan para ma-authorize.

📦 Halimbawa
May taong nagtangkang mag-import ng mga pekeng gamit na may fake trademark (counterfeit bags) mula sa ibang bansa. Ito ay malinaw na prohibited sa ilalim ng paragraph (f) ng Section 118 dahil infringing goods ito sa ilalim ng Intellectual Property Code.

⭐ Bakit Mahalaga Ito?
Pinoprotektahan nito ang national security, public health, moral standards, at intellectual property rights ng bansa mula sa mga talagang mapaminsalang produkto.

⚠️ Dapat Tandaan
Ang prohibited goods ay iba sa restricted goods — walang paraan para ma-authorize ang prohibited goods, samantalang ang restricted goods (Section 119) ay maaaring pahintulutan kung may proper authorization.

🎯 Board Exam Tip
I-memorize ang pitong (7) kategorya sa ilalim ng Section 118 (paragraphs a–g) — madalas itong pinagsasama ng mga estudyante sa Section 119.

❓ Madalas Malito ang Students
Tanong: "Parehas lang ba ang prohibited at restricted goods?" Sagot: Hindi — permanente at walang exception ang prohibited (Section 118), habang ang restricted goods (Section 119) ay maaaring pahintulutan kung may authorization mula sa batas o regulasyon.

🔗 Related Topics
Paragraphs (a) hanggang (g) ng Section 118, Section 119 (Restricted Importation and Exportation).`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 118 ng CMTA (Republic Act No. 10863) tungkol sa "Prohibited Importation and Exportation." I-explain nang simple ang pagkakaiba nito sa restricted goods, magbigay ng practical na halimbawa, ipaliwanag kung bakit umiiral ang batas na ito, banggitin ang mga paragraph (a–g) at Section 119, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},313:{_label:"paragraph (a) — Seditious/Inciting Materials",title:"Section 118(a): Materyales na Nag-uudyok ng Rebelyon o Karahasan",content:`📖 Kahulugan
Bawal i-import o i-export ang anumang nakasulat o nakalimbag na materyales na nag-aadvocate o nag-uudyok ng treason, rebellion, insurrection, o sedition laban sa gobyerno ng Pilipinas, o forcible resistance sa anumang batas, gayundin ang mga materyales na naglalaman ng banta sa buhay o pananakit ng kahit sino sa Pilipinas.

🔍 Breakdown
- Written or Printed Goods – kasama dito ang libro, polyeto, flyers, atbp.
- Advocating or Inciting – hindi lang basta nagbabanggit, kundi nag-uudyok o nagtataguyod ng ganitong gawain.
- Treason, Rebellion, Insurrection, Sedition – mga krimen laban sa estado.
- Threat to Take Life or Inflict Bodily Harm – direktang banta ng karahasan sa isang tao.

💡 Simpleng Paliwanag
Kung ang isang libro o polyeto ay nag-uudyok ng rebelyon laban sa gobyerno o may nakasulat na banta sa buhay ng ibang tao, hindi ito pwedeng dalhin papasok o palabas ng bansa.

📦 Halimbawa
Sa isang seaport sa Batangas, may na-intercept na shipment ng mga polyeto mula sa ibang bansa na nag-uudyok ng armadong pag-aalsa laban sa gobyerno ng Pilipinas. Dahil dito, agad itong na-seize ng Bureau of Customs bilang prohibited goods sa ilalim ng paragraph (a).

⭐ Bakit Mahalaga Ito?
Pinoprotektahan nito ang national security at public order laban sa mga materyales na maaaring maghikayat ng karahasan o pagpapabagsak sa gobyerno.

⚠️ Dapat Tandaan
Kailangan may element ng "advocacy" o "incitement" — hindi lang basta discussion o criticism ng gobyerno ang saklaw nito.

🎯 Board Exam Tip
I-relate ito sa konsepto ng freedom of speech — importanteng malaman na may limitasyon ito pagdating sa incitement ng violence o rebellion.

❓ Madalas Malito ang Students
Tanong: "Bawal na ba ang lahat ng kritisismo sa gobyerno?" Sagot: Hindi — ang saklaw lang nito ay ang mga materyales na nag-uudyok o nagtataguyod ng aktwal na treason, rebellion, o karahasan, hindi ordinaryong pagpuna o political commentary.

🔗 Related Topics
Section 118 (main provision), Revised Penal Code (treason, sedition, rebellion).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa mga prohibited na seditious o inciting materials. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Revised Penal Code, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},314:{_label:"paragraph (b) — Abortion-Related Goods",title:"Section 118(b): Mga Gamit at Impormasyon Tungkol sa Unlawful Abortion",content:`📖 Kahulugan
Bawal i-import o i-export ang mga gamit, instrumento, gamot, at substances na dinisenyo o inangkop para makapagdulot ng unlawful abortion, pati na rin ang anumang naka-print na materyal na nag-a-advertise o nagbibigay ng impormasyon kung saan, paano, o kanino maaaring gawin ang unlawful abortion.

🔍 Breakdown
- Goods, Instruments, Drugs and Substances – mga pisikal na bagay o gamot na designed para sa unlawful abortion.
- Designed, Intended or Adapted – hindi kailangang purpose-built, kahit adapted lang para sa ganitong gamit ay saklaw pa rin.
- Printed Matter – mga advertisement o babasahin na nagbibigay impormasyon tungkol sa unlawful abortion.

💡 Simpleng Paliwanag
Kahit anong klaseng gamit o babasahin na may kinalaman sa illegal na pagpapalaglag ay bawal dalhin papasok o palabas ng Pilipinas.

📦 Halimbawa
May na-flag na package sa isang courier facility sa NAIA na naglalaman ng mga abortion-inducing pills na hindi legal na ibinebenta sa Pilipinas. Dahil ito ay designed para sa unlawful abortion, na-classify itong prohibited goods sa ilalim ng paragraph (b).

⭐ Bakit Mahalaga Ito?
Kaugnay ito ng existing laws ng Pilipinas na nagbabawal ng abortion, kaya ang customs law ay sumusuporta rin dito sa pamamagitan ng pagpigil sa pagpasok ng mga related na gamit at impormasyon.

⚠️ Dapat Tandaan
Ang salitang "unlawful" ay mahalaga — dapat malinaw na ang layunin o gamit ay para sa illegal abortion.

🎯 Board Exam Tip
I-connect ito sa mga probisyon ng Revised Penal Code tungkol sa abortion para mas maintindihan ang legal basis.

❓ Madalas Malito ang Students
Tanong: "Bawal ba lahat ng medical equipment na may kinalaman sa reproductive health?" Sagot: Hindi — ang saklaw lang nito ay yung specifically designed o intended para sa unlawful abortion, hindi ang lahat ng reproductive health products.

🔗 Related Topics
Section 118 (main provision), Revised Penal Code (abortion provisions).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa mga prohibited na abortion-related goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Revised Penal Code, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},315:{_label:"paragraph (c) — Obscene/Immoral Materials",title:"Section 118(c): Mga Obscene o Immoral na Materyales",content:`📖 Kahulugan
Bawal i-import o i-export ang mga nakasulat o nakalimbag na materyales, negatives, pelikula, litrato, engravings, lithographs, painting, drawing, o anumang representasyon na may obscene o immoral na katangian.

🔍 Breakdown
- Written or Printed Goods – libro, magazine, atbp.
- Negatives or Cinematographic Films – pelikula at kaugnay na materyales.
- Photographs, Engravings, Lithographs, Paintings, Drawings – iba't ibang visual media.
- Obscene or Immoral Character – ang standard na ginagamit para masabing bawal ito.

💡 Simpleng Paliwanag
Anumang klase ng media — libro man, litrato, o pelikula — na itinuturing na malaswa o immoral ay hindi pwedeng i-import o i-export.

📦 Halimbawa
May na-intercept na shipment ng mga pornographic magazines mula sa ibang bansa sa isang customs checkpoint sa Subic Freeport. Dahil ito ay obscene materials, na-seize ito bilang prohibited goods sa ilalim ng paragraph (c).

⭐ Bakit Mahalaga Ito?
Pinoprotektahan nito ang public morals at kabataan mula sa pagkalat ng mga obscene o immoral na materyales.

⚠️ Dapat Tandaan
Ang "obscene" ay maaaring maging subjective standard — depende ito sa existing jurisprudence at guidelines ng mga concerned agencies.

🎯 Board Exam Tip
I-note na ang standard ng "obscenity" ay hindi laging tuwirang nakadepende sa CMTA lang — may koneksyon ito sa ibang batas at jurisprudence.

❓ Madalas Malito ang Students
Tanong: "Sino ang nagde-decide kung obscene o hindi ang isang produkto?" Sagot: Karaniwan itong sinusuri ng Bureau of Customs kasabay ng ibang ahensya base sa existing legal standards, hindi basta desisyon ng isang tao lang.

🔗 Related Topics
Section 118 (main provision), regulasyon ng MTRCB.`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa mga prohibited na obscene o immoral na materyales. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung paano tinutukoy ang "obscenity" sa Philippine law, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},316:{_label:"paragraph (d) — Mislabeled Precious Metal Goods",title:"Section 118(d): Mga Gawa sa Ginto o Pilak na may Maling Marka",content:`📖 Kahulugan
Bawal i-import o i-export ang mga gawa mula sa ginto, pilak, o iba pang mamahaling metal o alloy kung ang stamp, brand, o marka nito ay hindi tumutugma sa tunay na kalidad o fineness ng metal.

🔍 Breakdown
- Manufactured Goods of Gold, Silver or Precious Metals – produkto na gawa sa mamahaling metal.
- Stamp, Brand or Mark – ang selyo o tatak na nagsasaad ng kalidad ng metal.
- Does Not Indicate Actual Fineness – kapag mali o mapanlinlang ang naka-mark na kalidad kumpara sa totoong nilalaman.

💡 Simpleng Paliwanag
Kung ang alahas o gamit mo na gawa sa ginto o pilak ay may markang nagsasabing "18k" pero hindi naman totoo, bawal itong i-import o i-export dahil nakalilinlang ito sa consumers.

📦 Halimbawa
May isang jewelry supplier na nag-import ng mga alahas na naka-mark na "24k pure gold" pero base sa laboratory testing, mababa lang pala ang purity nito. Dahil hindi tumutugma ang marka sa aktwal na kalidad, ito ay na-classify na prohibited sa ilalim ng paragraph (d).

⭐ Bakit Mahalaga Ito?
Pinoprotektahan nito ang mga consumers laban sa fraud at mapanlinlang na produkto, at pinapanatili ang integridad ng jewelry at precious metal trade.

⚠️ Dapat Tandaan
Ang batayan ng pagbabawal dito ay ang di-pagtugma ng marka sa tunay na kalidad — hindi basta ang pagbebenta ng ginto o pilak mismo.

🎯 Board Exam Tip
I-relate ito sa consumer protection laws at ang papel ng proper labeling sa precious metal trade.

❓ Madalas Malito ang Students
Tanong: "Bawal na ba lahat ng jewelry na gawa sa ginto?" Sagot: Hindi — ang saklaw lang nito ay yung may maling o mapanlinlang na marka ng kalidad, hindi ang lahat ng gintong alahas.

🔗 Related Topics
Section 118 (main provision), consumer protection regulations.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa mga prohibited na mislabeled precious metal goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa consumer protection, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},317:{_label:"paragraph (e) — Adulterated/Misbranded Food or Drugs",title:"Section 118(e): Adulterated at Misbranded na Pagkain o Gamot",content:`📖 Kahulugan
Bawal i-import o i-export ang anumang adulterated o misbranded na pagkain o produktong panlaman ng tao, gayundin ang adulterated o misbranded na gamot, kung ito ay lumalabag sa kaugnay na batas at regulasyon.

🔍 Breakdown
- Adulterated – kapag may sangkap na hindi dapat naroon o kulang sa dapat na sangkap ng produkto.
- Misbranded – kapag mali o mapanlinlang ang label o impormasyon sa produkto.
- Food or Goods for Human Consumption – kasama dito ang mga pagkain at inumin.
- Adulterated or Misbranded Drug – mga gamot na hindi safe o may maling label.
- In Violation of Relevant Laws and Regulations – dapat konektado sa existing laws tulad ng regulasyon ng FDA.

💡 Simpleng Paliwanag
Kung ang isang pagkain o gamot ay may sangkap na hindi dapat naroon, o mali ang nakasulat na impormasyon dito, bawal itong i-import o i-export dahil delikado ito sa kalusugan ng publiko.

📦 Halimbawa
Na-intercept ng Bureau of Customs ang isang shipment ng infant formula milk na may mababang nutritional content kaysa sa nakasaad sa label nito. Dahil misbranded ito, na-classify itong prohibited goods sa ilalim ng paragraph (e), kaugnay ng regulasyon ng FDA.

⭐ Bakit Mahalaga Ito?
Direktang nagpoprotekta ito sa public health sa pamamagitan ng pagpigil sa pagpasok ng mga mapanganib o mapanlinlang na pagkain at gamot.

⚠️ Dapat Tandaan
Ang classification na "adulterated" o "misbranded" ay karaniwang base sa determination ng FDA o kaugnay na regulatory agency, kaugnay ng CMTA.

🎯 Board Exam Tip
I-connect ito sa papel ng FDA sa customs clearance ng food at drug products.

❓ Madalas Malito ang Students
Tanong: "Sino ang nagde-determine kung adulterated o misbranded ang isang produkto?" Sagot: Karaniwan itong ginagawa ng FDA o kaugnay na regulatory agency, base sa existing food and drug safety laws, hindi ng Bureau of Customs mag-isa.

🔗 Related Topics
Section 118 (main provision), regulasyon ng FDA.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (e) ng CMTA (Republic Act No. 10863) tungkol sa mga prohibited na adulterated o misbranded na pagkain at gamot. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang papel ng FDA, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},318:{_label:"paragraph (f) — IP Infringing Goods",title:"Section 118(f): Mga Infringing Goods sa Ilalim ng IP Code",content:`📖 Kahulugan
Bawal i-import o i-export ang mga infringing goods, ibig sabihin, mga produktong lumalabag sa karapatan ng may-ari ng intellectual property base sa Intellectual Property Code at kaugnay na batas.

🔍 Breakdown
- Infringing Goods – mga produktong lumalabag sa trademark, copyright, patent, o iba pang IP rights.
- Intellectual Property Code – ang pangunahing batas na nagpoprotekta sa IP rights sa Pilipinas (Republic Act No. 8293).
- Related Laws – iba pang batas na may kinalaman sa IP protection.

💡 Simpleng Paliwanag
Kung peke o counterfeit ang isang produkto — halimbawa fake branded bag, pirated DVD, o unauthorized na kopya — bawal itong i-import o i-export dahil lumalabag ito sa karapatan ng orihinal na may-ari.

📦 Halimbawa
May customs officer sa Manila International Container Port na nag-intercept ng isang container na puno ng counterfeit na sapatos na may pekeng logo ng isang sikat na international brand. Dahil ito ay clear na trademark infringement, ito ay na-classify na prohibited goods sa ilalim ng paragraph (f).

⭐ Bakit Mahalaga Ito?
Pinoprotektahan nito ang mga negosyo at innovator laban sa pagnanakaw ng kanilang intellectual property, at tumutulong ito sa pagpigil ng counterfeit trade na nakakasira sa ekonomiya at sa consumer safety.

⚠️ Dapat Tandaan
Ang determination ng "infringement" ay karaniwang gumagamit ng standards mula sa Intellectual Property Code, at maaaring mangailangan ng koordinasyon sa Intellectual Property Office of the Philippines (IPOPHL).

🎯 Board Exam Tip
I-relate ito sa Republic Act No. 8293 (IP Code) — alamin ang connection nito sa border enforcement measures ng IP rights.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang may rehistradong trademark bago ma-classify na infringing ang isang produkto?" Sagot: Karaniwan, oo — dapat may valid at registered IP right na nilalabag para maituring itong infringing goods sa ilalim ng batas.

🔗 Related Topics
Section 118 (main provision), Republic Act No. 8293 (Intellectual Property Code), IPOPHL border enforcement.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (f) ng CMTA (Republic Act No. 10863) tungkol sa prohibited na infringing goods. I-explain nang simple, magbigay ng practical na halimbawa (hal. counterfeit products), ipaliwanag ang koneksyon nito sa Republic Act No. 8293 (IP Code) at IPOPHL, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},319:{_label:"paragraph (g) — Other Prohibited by Law",title:'Section 118(g): Ang "Catch-All" Clause ng Prohibited Goods',content:`📖 Kahulugan
Ito ang "catch-all" provision ng Section 118 — bawal din i-import o i-export ang lahat ng ibang goods o bahagi nito na malinaw na ipinagbabawal ng ibang batas, o ng mga rules and regulations na inisyu ng competent authority.

🔍 Breakdown
- All Other Goods or Parts Thereof – kahit hindi partikular na nakalista sa paragraphs (a) hanggang (f), pwede pa ring ma-cover.
- Explicitly Prohibited by Law – dapat malinaw na sinasabi ng ibang batas na bawal ito.
- Rules and Regulations Issued by Competent Authority – kasama rin dito ang mga regulasyon mula sa ibang government agencies.

💡 Simpleng Paliwanag
Ito yung "safety net" clause — kung may ibang batas o regulasyon na malinaw na nagbabawal sa isang produkto, kahit hindi ito nakalista sa paragraphs (a-f), bawal pa rin itong i-import o i-export.

📦 Halimbawa
Halimbawa, may espesipikong environmental law na nagbabawal sa pag-import ng certain hazardous waste materials. Kahit hindi direktang nakalista sa Section 118 (a-f), maituturing pa rin itong prohibited sa ilalim ng paragraph (g) dahil malinaw itong ipinagbabawal ng ibang batas.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa batas para ma-cover ang mga bagong sitwasyon o produkto na maaaring saklawin ng bagong batas o regulasyon sa hinaharap, nang hindi na kailangang i-amend pa ang CMTA mismo.

⚠️ Dapat Tandaan
Dapat "explicit" ang prohibition mula sa ibang batas o regulasyon — hindi basta implied o assumed na bawal.

🎯 Board Exam Tip
Alamin na ang paragraph (g) ay laging ginagamit bilang "safety net" provision — inaasahan ito sa exam bilang reference sa ibang special laws.

❓ Madalas Malito ang Students
Tanong: "Anong ibang batas ang covered dito?" Sagot: Depende ito sa specific na batas o regulasyon na umiiral — halimbawa, environmental laws o wildlife protection laws. Hindi ito nagsasaad ng specific na listahan sa CMTA mismo.

🔗 Related Topics
Section 118 (main provision), iba't ibang special laws na may prohibition clauses.`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 118, paragraph (g) ng CMTA (Republic Act No. 10863) tungkol sa "catch-all" clause ng prohibited goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit kailangan ng ganitong flexible na provision, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},320:{_label:"section 119 — Restricted Importation and Exportation",title:"Section 119: Ano ang Restricted Goods at ang Transit Restriction?",content:`📖 Kahulugan
Ang Section 119 ay naglilista ng mga restricted goods — ibig sabihin, bawal itong i-import o i-export MALIBAN kung mayroong authorization mula sa batas o regulasyon. Kasama rin dito na ang restriction ay umaabot hanggang sa transit ng mga goods na ito.

🔍 Breakdown
- "Restricted" – hindi kasing higpit ng "prohibited" — may posibilidad na ma-authorize.
- Except When Authorized by Law or Regulation – ang exception clause na nagbibigay-daan sa legal na pag-import o pag-export kung may proper na permit.
- Transit Restriction – kahit dumadaan lang ang goods sa Pilipinas patungo sa ibang bansa, saklaw pa rin ito ng restriction.

💡 Simpleng Paliwanag
Ang restricted goods ay parang "bawal, pero may paraan." Kung may proper authorization ka mula sa tamang ahensya, pwede mo pa ring i-import o i-export ang mga ito. Pero kung wala kang authorization, bawal — kahit dumadaan lang ito sa Pilipinas.

📦 Halimbawa
Isang gun dealer na may valid na license mula sa Philippine National Police (PNP) ang nag-import ng mga legal firearms para sa isang authorized na negosyo. Dahil may authorization siya, hindi ito bawal kahit nasa listahan ng restricted goods.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng balance sa pagitan ng public safety at legitimate na pangangailangan — halimbawa, ang mga law enforcement agencies o legitimate na negosyo ay maaaring gumamit ng mga otherwise-restricted na items basta may tamang permit.

⚠️ Dapat Tandaan
Ang restriction ay hindi lang applicable sa import o export kundi pati na rin sa transit ng mga goods — kahit "papasa-daan" lang ang mga ito sa Pilipinas, kailangan pa rin ng authorization.

🎯 Board Exam Tip
I-distinguish nang mabuti ang "prohibited" (walang exception) laban sa "restricted" (may exception kung may authorization) — madalas itong pinagsasama ng mga estudyante.

❓ Madalas Malito ang Students
Tanong: "Kung dadaan lang sa Pilipinas ang restricted goods papunta sa ibang bansa, kailangan pa rin ba ng permit?" Sagot: Oo — malinaw na sinasabi sa batas na ang restriction ay saklaw din ang transit, hindi lang ang aktwal na import o export.

🔗 Related Topics
Paragraphs (a) hanggang (f) ng Section 119, Section 118 (Prohibited Importation and Exportation).`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 119 ng CMTA (Republic Act No. 10863) tungkol sa "Restricted Importation and Exportation" at ang transit restriction. I-explain nang simple ang pagkakaiba nito sa prohibited goods, magbigay ng practical na halimbawa, banggitin ang paragraphs (a-f) at Section 118, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},321:{_label:"paragraph (a) — Explosives/Firearms",title:"Section 119(a): Explosives, Firearms, at Weapons of War",content:`📖 Kahulugan
Restricted ang pag-import o pag-export ng dynamite, gunpowder, ammunitions, at iba pang explosives, gayundin ang mga firearms at weapons of war o kahit bahagi lang nito, maliban kung may authorization.

🔍 Breakdown
- Dynamite, Gunpowder, Ammunitions, Explosives – mga materyales na maaaring gamitin para sa pagsabog.
- Firearms and Weapons of War – baril at kagamitang pandigma.
- Parts Thereof – kasama rin ang mga bahagi ng nasabing armas, hindi lang ang buong piraso.

💡 Simpleng Paliwanag
Bawal magdala ng baril, bala, pampasabog, o kahit piraso lang ng mga ito papasok o palabas ng bansa, maliban kung may proper license o authorization mula sa tamang ahensya, tulad ng PNP Firearms and Explosives Office.

📦 Halimbawa
May licensed gun store owner na nag-import ng mga legal na firearms mula sa United States para ibenta sa Pilipinas. Dahil kumpleto siya sa mga required na permit mula sa PNP, hindi ito bawal kahit nasa listahan ng restricted goods.

⭐ Bakit Mahalaga Ito?
Direktang nakaugnay ito sa national security at public safety — kinokontrol ang daloy ng mga armas at pampasabog para maiwasan ang paggamit nito sa terorismo, krimen, o karahasan.

⚠️ Dapat Tandaan
Ang "parts thereof" ay importante — kahit component lang o bahagi ng baril o pampasabog, saklaw pa rin ito ng restriction.

🎯 Board Exam Tip
I-connect ito sa Republic Act No. 10591 (Comprehensive Firearms and Ammunition Regulation Act) at ang papel ng PNP-FEO sa pagbibigay ng authorization.

❓ Madalas Malito ang Students
Tanong: "Bawal na ba lahat ng airsoft guns o replica firearms?" Sagot: Depende ito sa classification — hindi lahat ng replica ay automatic na covered, pero maraming regulasyon pa rin ang umiiral dito depende sa uri at gamit ng item.

🔗 Related Topics
Section 119 (main provision), Republic Act No. 10591, PNP-FEO.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 119, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa restricted na explosives at firearms. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Republic Act No. 10591 at PNP-FEO, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},322:{_label:"paragraph (b) — Gambling Devices",title:"Section 119(b): Mga Gambling Devices at Chance-Based na Makina",content:`📖 Kahulugan
Restricted ang pag-import o pag-export ng mga roulette wheels, gambling outfits, loaded dice, marked cards, machines o apparatus na ginagamit sa gambling o sa distribution ng pera, sigarilyo, o ibang goods base sa chance, kasama ang jackpot at pinball machines o katulad nito.

🔍 Breakdown
- Roulette Wheels, Gambling Outfits – mga kagamitan na tuwirang ginagamit sa gambling.
- Loaded Dice, Marked Cards – mga kagamitang dinisenyo para sa panloloko sa laro.
- Machines/Apparatus for Distribution Based on Chance – kasama dito ang mga jackpot at pinball machines.
- Parts Thereof – kahit bahagi lang ng mga nasabing kagamitan, saklaw pa rin.

💡 Simpleng Paliwanag
Anumang kagamitan na para sa gambling o para sa mga "chance-based" na laro (tulad ng slot machines) ay hindi basta-basta pwedeng i-import o i-export, maliban kung may authorization mula sa tamang regulatory body tulad ng PAGCOR.

📦 Halimbawa
May authorized casino operator na nag-import ng mga slot machines mula sa ibang bansa para gamitin sa isang licensed casino sa Pilipinas. Dahil may PAGCOR authorization ang operator, hindi ito bawal kahit ito ay technically restricted goods.

⭐ Bakit Mahalaga Ito?
Kinokontrol nito ang paglaganap ng illegal gambling operations at pinoprotektahan ang publiko laban sa mga hindi regulated na gambling activities.

⚠️ Dapat Tandaan
Ang authorization ay karaniwang nanggagaling sa PAGCOR o katulad na regulatory body, hindi basta kahit sinong negosyante ang pwedeng mag-import ng gambling equipment.

🎯 Board Exam Tip
I-relate ito sa role ng PAGCOR bilang regulatory body ng legal gambling sa Pilipinas.

❓ Madalas Malito ang Students
Tanong: "Bawal na ba lahat ng laruang cards o board games?" Sagot: Hindi — ang saklaw lang nito ay yung specific na designed para sa gambling gaya ng marked cards o loaded dice, hindi ang ordinaryong laruan o board games.

🔗 Related Topics
Section 119 (main provision), regulasyon ng PAGCOR.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 119, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa restricted na gambling devices. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa PAGCOR, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},323:{_label:"paragraph (c) — Lottery/Sweepstakes Tickets",title:"Section 119(c): Lottery at Sweepstakes Tickets",content:`📖 Kahulugan
Restricted ang pag-import o pag-export ng lottery at sweepstakes tickets, maliban sa mga advertisement nito at listahan ng mga drawings.

🔍 Breakdown
- Lottery and Sweepstakes Tickets – ang aktwal na tiket na ginagamit para sumali sa lottery o sweepstakes.
- Exception: Advertisements Thereof – mga patalastas tungkol sa lottery ay hindi covered ng restriction.
- Exception: Lists of Drawings – listahan ng mga resulta ng lottery draws ay hindi rin covered.

💡 Simpleng Paliwanag
Bawal magdala ng aktwal na lottery tickets papasok o palabas ng bansa, pero pwede namang dalhin ang mga patalastas o listahan ng resulta ng lottery draws dahil hindi ito covered ng restriction.

📦 Halimbawa
May OFW na bumalik mula sa ibang bansa ang nagdadala ng isang bag ng foreign lottery tickets na binili niya bilang souvenir para sa mga kaibigan. Dahil restricted ang aktwal na lottery tickets, maaari itong ma-flag ng customs maliban kung may proper authorization.

⭐ Bakit Mahalaga Ito?
Kinokontrol nito ang illegal na foreign lottery operations sa loob ng bansa, at pinoprotektahan ang integridad ng lokal na lottery system tulad ng PCSO.

⚠️ Dapat Tandaan
Malinaw na exempted ang mga advertisement at listahan ng drawings — hindi lahat ng may kinalaman sa lottery ay automatic na restricted.

🎯 Board Exam Tip
I-memorize ang exception clause dito — madalas itong ginagawang tricky question sa exam (advertisement vs. actual ticket).

❓ Madalas Malito ang Students
Tanong: "Bawal ba magdala ng resulta ng foreign lottery draws?" Sagot: Hindi — malinaw na sinasabi sa batas na ang listahan ng drawings ay exempted mula sa restriction, ang aktwal na tickets lang ang covered.

🔗 Related Topics
Section 119 (main provision), regulasyon ng PCSO.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 119, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa restricted na lottery at sweepstakes tickets. I-explain nang simple, magbigay ng practical na halimbawa, linawin ang exception para sa advertisement at listahan ng drawings, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},324:{_label:"paragraph (d) — Dangerous Drugs",title:"Section 119(d): Marijuana, Opium, at Iba Pang Dangerous Drugs",content:`📖 Kahulugan
Restricted ang pag-import o pag-export ng marijuana, opium, poppies, coca leaves, heroin, o ibang narcotics o synthetic drugs na idineklara o maaaring idineklara na habit-forming ng Pangulo ng Pilipinas, pati na rin ang anumang compound, derivative, o preparation nito, maliban kung ito ay ini-import ng gobyerno o ng taong may proper authorization mula sa Dangerous Drugs Board para sa medisinal na layunin.

🔍 Breakdown
- Marijuana, Opium, Poppies, Coca Leaves, Heroin – mga specific na dangerous drugs na nabanggit.
- Other Narcotics or Synthetic Drugs – kasama rin ang ibang drugs na idineklara ng Pangulo bilang habit-forming.
- Compound, Salt, Derivative, or Preparation – kahit hindi pure form, kasama pa rin ang mga porma na ito.
- Exception: Government Import – pwede kung ang gobyerno mismo ang nag-import.
- Exception: Authorized by Dangerous Drugs Board for Medicinal Purposes – pwede rin kung may authorization para sa medical use.

💡 Simpleng Paliwanag
Bawal magdala ng illegal drugs papasok o palabas ng bansa, maliban kung ang gobyerno mismo ang nag-import nito o may specific na permit mula sa Dangerous Drugs Board para sa medical o research purposes.

📦 Halimbawa
May hospital na may special na permit mula sa Dangerous Drugs Board ang nag-import ng morphine (isang derivative ng opium) para gamitin sa pain management ng mga pasyente. Dahil may proper authorization, hindi ito bawal kahit technically restricted ang substance.

⭐ Bakit Mahalaga Ito?
Direktang related ito sa war on drugs at public health — kinokontrol nito ang daloy ng dangerous drugs papasok at palabas ng bansa habang pinapayagan pa rin ang legitimate medical use.

⚠️ Dapat Tandaan
Ang exception ay very specific — dapat may government involvement o proper Dangerous Drugs Board authorization, at para lang sa medisinal na layunin.

🎯 Board Exam Tip
I-connect ito sa Republic Act No. 9165 (Comprehensive Dangerous Drugs Act of 2002) at ang papel ng Dangerous Drugs Board sa pagbibigay ng authorization.

❓ Madalas Malito ang Students
Tanong: "Kung may prescription lang, pwede na bang mag-import ng dangerous drugs?" Sagot: Hindi — dapat may specific na authorization mula sa Dangerous Drugs Board, hindi lang basta ordinaryong prescription mula sa doktor.

🔗 Related Topics
Section 119 (main provision), Republic Act No. 9165, Dangerous Drugs Board.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 119, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa restricted na dangerous drugs. I-explain nang simple, magbigay ng practical na halimbawa (hal. medical use exception), ipaliwanag ang koneksyon nito sa Republic Act No. 9165 at Dangerous Drugs Board, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},325:{_label:"paragraph (e) — Opium Pipes",title:"Section 119(e): Opium Pipes at mga Bahagi Nito",content:`📖 Kahulugan
Restricted ang pag-import o pag-export ng opium pipes o mga bahagi nito, anuman ang materyal na ginamit dito.

🔍 Breakdown
- Opium Pipes – mga kagamitang ginagamit para sa paninigarilyo ng opium.
- Parts Thereof – kahit bahagi lang ng pipe, saklaw pa rin.
- Of Whatever Material – hindi mahalaga kung ano ang gawa ng pipe (kahoy, metal, atbp.), lahat ay covered.

💡 Simpleng Paliwanag
Kahit hindi mismong drugs ang dinadala, ang mismong kagamitan na ginagamit para gamitin ang opium — tulad ng opium pipes — ay bawal ding i-import o i-export.

📦 Halimbawa
May turista na bumili ng antique opium pipe sa isang bansang Asyano bilang souvenir at sinubukang dalhin ito pabalik sa Pilipinas. Kahit walang laman ang pipe, maaari pa rin itong ma-flag ng customs bilang restricted item sa ilalim ng paragraph (e), maliban kung may proper na authorization o exemption.

⭐ Bakit Mahalaga Ito?
Kahit hindi mismong drug ang dinadala, ang paraphernalia mismo ay maaaring maging instrumento ng drug abuse, kaya kinokontrol din ito para maiwasan ang paglaganap ng drug culture.

⚠️ Dapat Tandaan
Hindi mahalaga ang materyal ng pipe — kahit antique o decorative lang ito, saklaw pa rin ng restriction.

🎯 Board Exam Tip
Madalas itong kalimutan ng mga estudyante bilang separate na paragraph mula sa dangerous drugs (paragraph d) — tandaan na ito ay tungkol sa paraphernalia, hindi sa substance mismo.

❓ Madalas Malito ang Students
Tanong: "Pwede bang dalhin ang isang antique opium pipe bilang collector's item o cultural artifact?" Sagot: Bilang general rule, restricted pa rin ito maliban kung may specific na authorization o exemption mula sa batas o regulasyon.

🔗 Related Topics
Section 119 (main provision), Section 119(d) (Dangerous Drugs).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 119, paragraph (e) ng CMTA (Republic Act No. 10863) tungkol sa restricted na opium pipes. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 119(d) tungkol sa dangerous drugs, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},326:{_label:"paragraph (f) — Other Restricted Goods",title:"Section 119(f): Iba Pang Restricted Goods at ang Transit Restriction",content:`📖 Kahulugan
Ito ang "catch-all" provision para sa restricted goods — saklaw nito ang lahat ng ibang goods na ang pag-import o pag-export ay restricted base sa ibang batas o regulasyon. Idinagdag din dito na ang restriction sa lahat ng nabanggit na goods sa Section 119 ay umaabot din sa kanilang transit.

🔍 Breakdown
- Any Other Goods Whose Importation and Exportation Are Restricted – flexible na provision na maaaring sumaklaw sa mga bagong klase ng restricted goods sa hinaharap.
- Transit Restriction – mahalagang bahagi ng buong Section 119 — kahit dumadaan lang ang restricted goods sa Pilipinas patungo sa ibang bansa, kailangan pa rin ito ng authorization.

💡 Simpleng Paliwanag
Ito ang "safety net" clause ng Section 119 — kung may ibang batas na nagsasabing restricted ang isang produkto, kahit hindi ito partikular na nakalista sa paragraphs (a-e), covered pa rin ito. At tandaan, kahit "dadaan" lang ang goods sa Pilipinas patungo sa ibang bansa, kailangan pa rin ng authorization.

📦 Halimbawa
Halimbawa, may partikular na batas na nagbabawal ng pag-import ng endangered wildlife species maliban kung may CITES permit. Kahit hindi direktang nakalista sa Section 119 (a-e), maituturing pa rin itong restricted sa ilalim ng paragraph (f) dahil malinaw itong ipinagbabawal ng ibang batas.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa batas para ma-cover ang mga bagong sitwasyon, at ang transit provision ay mahalaga dahil pinipigilan nito ang paggamit ng Pilipinas bilang "transit point" para sa illegal na daloy ng restricted goods papunta sa ibang bansa.

⚠️ Dapat Tandaan
Ang transit restriction ay applicable sa LAHAT ng paragraphs sa ilalim ng Section 119 (a hanggang f), hindi lang sa paragraph (f) mismo.

🎯 Board Exam Tip
Laging tinatanong sa exam ang tungkol sa transit restriction — tandaan na hindi lang actual import/export ang covered, kundi pati na rin ang transit ng restricted goods.

❓ Madalas Malito ang Students
Tanong: "Kung transit lang papuntang ibang bansa ang restricted goods, kailangan pa rin ba ng authorization sa Pilipinas?" Sagot: Oo — malinaw na sinasabi sa batas na ang restriction ay saklaw din ang transit ng mga goods, hindi lang ang aktwal na pag-import o pag-export.

🔗 Related Topics
Section 119 (main provision), paragraphs (a) hanggang (e), CITES at ibang special laws.`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 119, paragraph (f) ng CMTA (Republic Act No. 10863) tungkol sa "catch-all" clause ng restricted goods at ang transit restriction. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit importante ang transit provision, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},335:{_label:"section 120 — Relief Consignment",title:"Section 120: Ano ang Relief Consignment at ang Simplified Procedure Para Dito?",content:`📖 Kahulugan
Ang Section 120 ay tungkol sa "relief consignment" — ang mga goods tulad ng pagkain, gamot, kagamitan, at materyales para sa temporary shelter na dini-donate o pina-lease sa gobyerno o accredited private entities para ipamahagi nang libre sa mga biktima ng kalamidad. Kapag may naideklarang state of calamity, ang pag-clear ng ganitong klaseng goods ay bibigyan ng prayoridad at magiging mas simple ang proseso.

🔍 Breakdown
- Relief Consignment – ang special na klasipikasyon para sa goods na para sa calamity relief.
- Food, Medicine, Equipment, Materials for Shelter – ang uri ng goods na covered.
- Donated or Leased – pwede itong ibigay nang libre o paupahan, basta't para sa relief purpose.
- Government Institutions and Accredited Private Entities – ang mga pwedeng tumanggap at mamahagi ng relief goods.
- State of Calamity – ang trigger na kailangan bago maging applicable ang priority at simplified procedure.
- Simplified Customs Procedure – mas mabilis at mas madaling proseso ng customs clearance, partikular sa panahon ng kagipitan.

💡 Simpleng Paliwanag
Kapag may bagyo, lindol, o ibang kalamidad at may state of calamity na idineklara, ang mga relief goods tulad ng pagkain at gamot na dadaan sa customs ay bibigyan ng special treatment — mas mabilis at mas simple ang proseso kumpara sa ordinaryong shipment, dahil kailangan agad ito ng mga biktima.

📦 Halimbawa
Matapos ang malakas na bagyo sa Bicol region, nagdeklara ang gobyerno ng state of calamity. Isang international NGO ang nagpadala ng shipment ng canned goods, tents, at gamot papuntang Manila para ipamahagi sa mga evacuee. Dahil ito ay relief consignment, pinabilis ng Bureau of Customs ang pag-clear ng shipment gamit ang simplified procedure, sa halip na dumaan pa sa normal, mas mahabang proseso.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil sa oras ng kalamidad, ang bilis ng pagdating ng tulong ay maaaring magligtas ng buhay. Kaya't binibigyan ng CMTA ng prayoridad ang mga relief goods para hindi na-de-delay pa ang pagdating ng mga ito sa mga nangangailangan dahil sa mabagal na customs process.

⚠️ Dapat Tandaan
Hindi lahat ng donated goods ay automatic na "relief consignment" — dapat ito ay para sa food, medicine, equipment, o shelter materials, at dapat may naideklarang state of calamity bago maging applicable ang simplified procedure.

🎯 Board Exam Tip
I-relate ang Section 120 sa Section 121 (Duty and Tax Treatment) — magkaugnay ang dalawang probisyon at madalas silang magkasabay na itanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kailangan ba palaging libre ang relief consignment?" Sagot: Hindi — malinaw sa batas na pwede itong "donated OR leased," ibig sabihin maaari pa ring paupahan ang equipment basta't para pa rin ito sa libreng pamamahagi o paggamit ng mga biktima ng kalamidad.

🔗 Related Topics
Section 121 (Duty and Tax Treatment), paragraphs (a) hanggang (d) ng Section 120, OCOM 53-2020, Joint Administrative Order (JAO) on Relief Consignments.`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 120 ng CMTA (Republic Act No. 10863) tungkol sa "Relief Consignment." I-explain nang simple, magbigay ng practical na halimbawa mula sa aktwal na sitwasyon ng kalamidad sa Pilipinas, ipaliwanag kung bakit umiiral ang batas na ito, banggitin ang kaugnay na Section 121 at ang OCOM 53-2020 at JAO on Relief Consignments, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},336:{_label:"paragraph (a) — Simplified/Provisional Declaration",title:"Section 120(a): Simplified o Provisional na Goods Declaration",content:`📖 Kahulugan
Bilang bahagi ng simplified procedure para sa relief consignment, pinapayagan ang paglo-lodge ng simplified goods declaration, o kaya provisional o incomplete na declaration, basta't kumpletuhin ito sa loob ng tinakdang panahon.

🔍 Breakdown
- Simplified Goods Declaration – mas maikli at mas madaling bersyon ng regular declaration.
- Provisional or Incomplete Goods Declaration – pwede munang mag-file ng hindi pa kumpletong declaration.
- Subject to Completion Within a Specified Period – may deadline pa rin para kumpletuhin ang mga kulang na detalye.

💡 Simpleng Paliwanag
Sa halip na hintayin munang kumpleto lahat ng detalye bago mag-file, pwede nang mag-lodge agad ng simplified o incomplete declaration para sa relief goods, basta't kumpletuhin na lang ito sa loob ng takdang panahon. Layunin nito ay mapabilis ang pagpasok ng relief goods.

📦 Halimbawa
Sa gitna ng emergency response matapos ang lindol sa Batangas, isang customs broker ang nag-file ng provisional declaration para sa isang shipment ng medical supplies mula sa isang foreign donor, dahil kulang pa ang ilang supporting documents. Pinayagan ito ng Bureau of Customs, basta't kumpletuhin ang buong declaration sa loob ng ilang araw.

⭐ Bakit Mahalaga Ito?
Sa emergency situations, kadalasang hindi kaagad kumpleto ang lahat ng dokumento dahil sa bilis ng pangyayari. Ang flexibility na ibinibigay ng paragraph na ito ay nagpapabilis sa pagpasok ng tulong nang hindi hinihintay munang makumpleto ang lahat ng papeles.

⚠️ Dapat Tandaan
Hindi ibig sabihin ng "provisional" ay wala nang kailangang kumpletuhin — dapat pa ring i-submit ang buong declaration sa loob ng specified period na itinakda ng regulasyon.

🎯 Board Exam Tip
Tandaan na ito ay isa sa apat (4) na measures na ibinibigay ng Bureau para sa relief consignment — kabisaduhin ang lahat ng paragraphs (a) hanggang (d).

❓ Madalas Malito ang Students
Tanong: "Walang consequence ba kung hindi makumpleto ang declaration sa takdang panahon?" Sagot: Ang batas mismo ay hindi nagdedetalye ng specific consequence dito — ito ay karaniwang nakadepende sa implementing rules and regulations na inisyu ng DOF at DSWD.

🔗 Related Topics
Section 120 (main provision), paragraphs (b), (c), at (d).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 120, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa simplified o provisional goods declaration para sa relief consignment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit kailangan ang flexibility na ito sa panahon ng kalamidad, banggitin ang kaugnay na paragraphs (b-d), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},337:{_label:"paragraph (b) — Pre-Arrival Processing",title:"Section 120(b): Pag-Process ng Declaration Bago Pa Dumating ang Goods",content:`📖 Kahulugan
Bilang bahagi ng simplified procedure, pinapayagan ang paglo-lodge, pagre-register, at pag-check ng goods declaration at supporting documents bago pa man dumating ang aktwal na goods, para agad itong ma-release pagdating nito.

🔍 Breakdown
- Lodging, Registering and Checking – ang tatlong hakbang na maaaring gawin nang maaga.
- Prior to Arrival of the Goods – ang pinaka-mahalagang bahagi — hindi na kailangang hintayin munang dumating ang goods bago simulan ang proseso.
- Release Upon Arrival – layunin nito na sa sandaling dumating ang goods, agad na itong ma-release.

💡 Simpleng Paliwanag
Sa halip na hintayin munang dumating ang shipment bago simulan ang paperwork, puwede nang i-prepare at i-check nang maaga ang lahat ng dokumento habang nasa biyahe pa ang goods. Sa ganitong paraan, sa sandaling dumating ang shipment, mabilis na itong ma-rerelease.

📦 Halimbawa
Habang biyahe pa papuntang Cebu ang isang cargo plane na puno ng relief goods mula sa isang foreign government, naunang inihanda at nire-review na ng customs broker at Bureau of Customs ang goods declaration at mga supporting documents. Sa sandaling dumating ang eroplano sa Cebu, mabilis na na-release ang shipment dahil kumpleto na ang pre-processing.

⭐ Bakit Mahalaga Ito?
Sa panahon ng kalamidad, bawat oras ay mahalaga. Ang pag-process nang maaga ay nagbabawas ng delay sa pag-release ng relief goods, na direktang nakakaapekto sa bilis ng pagdating ng tulong sa mga biktima.

⚠️ Dapat Tandaan
Ang "pre-arrival processing" ay hindi nangangahulugang pwede nang i-release ang goods bago pa ito dumating — ang release mismo ay mangyayari pa rin "upon arrival," ang pag-prepare lang ng dokumento ang ginagawa nang maaga.

🎯 Board Exam Tip
I-compare ito sa normal customs procedure kung saan karaniwang pagkatapos pa dumating ang goods saka nagsisimula ang document processing — ang pagkakaiba dito ay ang "advance" na proseso.

❓ Madalas Malito ang Students
Tanong: "Pwede na bang gamitin agad ang goods bago pa ito dumating dahil naprocess na ang papeles?" Sagot: Hindi — ang release ay mangyayari pa rin "upon arrival" ng goods; ang naunang naproseso lang ay ang declaration at dokumento, hindi ang physical na pagpapalabas ng goods.

🔗 Related Topics
Section 120 (main provision), paragraphs (a), (c), at (d).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 120, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa pre-arrival processing ng goods declaration para sa relief consignment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit mahalaga ang bilis ng proseso sa panahon ng kalamidad, banggitin ang kaugnay na paragraphs (a), (c), at (d), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},338:{_label:"paragraph (c) — After-Hours Clearance",title:"Section 120(c): Clearance Kahit Lampas Oras o Malayo sa Customs Office",content:`📖 Kahulugan
Bilang bahagi ng simplified procedure, pinapayagan ang pag-clear ng relief consignment kahit lampas na sa designated business hours o kahit malayo sa customs offices, at wala nang karagdagang bayad na sisingilin para dito.

🔍 Breakdown
- Clearance Beyond Designated Hours of Business – pwedeng mag-process kahit gabi na o holiday.
- Away from Customs Offices – pwedeng mag-clear kahit hindi sa opisyal na customs office mismo.
- Waiver of Corresponding Charges – normally may extra charge ang after-hours o off-site na proseso, pero para sa relief consignment, walang babayaran para dito.

💡 Simpleng Paliwanag
Sa emergency, hindi na kailangang hintayin pa ang regular office hours o pumunta pa sa opisyal na customs office — pwede nang iproseso kahit saan at kahit anong oras ang clearance ng relief goods, at wala pang extra bayad para dito.

📦 Halimbawa
Dumating ang isang emergency shipment ng gamot mula sa isang international relief organization sa gabi, pagkatapos ng regular office hours ng isang seaport sa Iloilo. Dahil ito ay relief consignment matapos ideklara ang state of calamity, pinayagan ng Bureau of Customs ang after-hours clearance nang walang extra charge, para maiwasan ang delay sa pagdating ng tulong.

⭐ Bakit Mahalaga Ito?
Hindi laging "office hours" lang dumarating ang kalamidad o ang pangangailangan ng tulong. Ang flexibility na ito ay nagsisiguro na hindi mahaharang ang critical relief goods dahil lang sa oras ng pagdating o lokasyon ng processing.

⚠️ Dapat Tandaan
Ang waiver ng charges ay applicable lang sa mga karagdagang bayad na normally sinisingil para sa after-hours o off-site na clearance — hindi ito nangangahulugang exempted na rin ang goods sa duties and taxes (na saklaw ng Section 121).

🎯 Board Exam Tip
Huwag ipagkamali ang "waiver of charges" dito (para sa processing fees) sa "exemption from duties and taxes" na nasa Section 121 — magkaiba ang dalawang konsepto.

❓ Madalas Malito ang Students
Tanong: "Ibig sabihin ba nito ay libre na rin ang duties and taxes ng relief goods?" Sagot: Hindi direkta dito — ang paragraph (c) ay tungkol lang sa waiver ng charges para sa after-hours o off-site processing; ang exemption sa duties and taxes ay separate na probisyon sa ilalim ng Section 121.

🔗 Related Topics
Section 120 (main provision), Section 121 (Duty and Tax Treatment), paragraphs (a), (b), at (d).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 120, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa after-hours at off-site na clearance para sa relief consignment. I-explain nang simple, magbigay ng practical na halimbawa, linawin ang pagkakaiba nito sa duty/tax exemption sa Section 121, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},339:{_label:"paragraph (d) — Limited Examination/Sampling",title:"Section 120(d): Limitadong Pag-Eexamine o Pag-Sample ng Relief Goods",content:`📖 Kahulugan
Bilang bahagi ng simplified procedure, ang pag-eeksamin at/o pag-sample ng relief consignment ay gagawin lamang sa exceptional circumstances, hindi na ito ginagawang routine na proseso.

🔍 Breakdown
- Examination and/or Sampling – ang karaniwang proseso ng customs na sinusuri o kinukunan ng sample ang goods.
- Only in Exceptional Circumstances – hindi na ito default procedure para sa relief goods, kundi exception na lamang.

💡 Simpleng Paliwanag
Sa normal na shipment, madalas isailalim sa physical examination o sampling ang goods bago i-release. Pero para sa relief consignment, hindi na ito ginagawa nang regular — sa mga espesyal na kaso lang ito isasagawa, para hindi na-delay pa ang pag-release ng tulong.

📦 Halimbawa
May dumating na shipment ng relief goods na donated na damit at kumot mula sa isang foreign NGO papuntang Tacloban matapos ang isang malakas na bagyo. Sa halip na isailalim pa ito sa full physical inspection tulad ng ordinaryong cargo, pinayagan agad ito ng Bureau of Customs na ma-release, dahil hindi ito nasa exceptional circumstance na nangangailangan ng examination.

⭐ Bakit Mahalaga Ito?
Ang full examination at sampling ay maaaring magdulot ng significant delay, na hindi maganda para sa mga relief goods na kailangang agad na maipamahagi. Sa pamamagitan ng paglilimita sa examination sa exceptional cases lang, mas mapapabilis ang pagdating ng tulong sa mga biktima.

⚠️ Dapat Tandaan
Hindi ito nangangahulugang "walang examination kailanman" — sa mga exceptional circumstances (halimbawa, kung may suspetsa ng smuggling sa ilalim ng "relief goods" na label), maaari pa ring isagawa ang examination.

🎯 Board Exam Tip
Tandaan ang salitang "exceptional circumstances" — ito ang keyword na madalas hanapin sa exam questions tungkol sa paragraph (d).

❓ Madalas Malito ang Students
Tanong: "Kailan itinuturing na 'exceptional circumstance' ang isang kaso?" Sagot: Hindi partikular na dinedefine ng CMTA ang eksaktong sitwasyon — ito ay karaniwang nakadepende sa implementing rules and regulations at sa judgment ng Bureau of Customs base sa specific na kaso.

🔗 Related Topics
Section 120 (main provision), paragraphs (a), (b), at (c).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 120, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa limitadong examination at sampling ng relief consignment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit nililimita ang examination sa exceptional circumstances lang, banggitin ang kaugnay na paragraphs (a-c), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},340:{_label:"section 121 — Duty and Tax Treatment",title:"Section 121: Duty at Tax Exemption para sa Relief Consignment",content:`📖 Kahulugan
Ang Section 121 ay nagsasaad na ang relief consignment, ayon sa depinisyon nito sa Section 120, na in-import habang may state of calamity at para sa isang specific na calamity area para sa paggamit ng mga biktima roon, ay exempted sa duties at taxes.

🔍 Breakdown
- Relief Consignment as Defined in Section 120 – dapat kwalipikado muna ito bilang relief consignment base sa Section 120.
- Imported During a State of Calamity – dapat na-import ito habang may umiiral na state of calamity.
- Intended for a Specific Calamity Area – dapat nakatutok ito sa isang partikular na apektadong lugar.
- For the Use of the Calamity Victims Therein – ang end-user ay dapat ang mga biktima ng kalamidad sa nasabing lugar.
- Exempt from Duties and Taxes – ang buong benepisyo ng probisyon — walang babayarang duties o taxes.

💡 Simpleng Paliwanag
Kung matutugunan ang lahat ng requirements ng "relief consignment" sa Section 120 — kasama na ang tamang timing (state of calamity) at tamang destinasyon (specific calamity area para sa mga biktima) — hindi na kailangang magbayad ng duties at taxes para sa mga goods na ito.

📦 Halimbawa
Matapos ang isang malakas na bagyo sa Cagayan Valley at idineklara ang state of calamity, isang religious organization ang nag-import ng shipment ng bigas, gamot, at kumot mula sa ibang bansa, partikular para ipamahagi sa mga evacuee sa Cagayan. Dahil natugunan ang lahat ng requirements — relief consignment, sa panahon ng state of calamity, at para sa specific na calamity area — ang buong shipment ay exempted sa duties and taxes.

⭐ Bakit Mahalaga Ito?
Sa pamamagitan ng pag-eexempt ng relief goods sa duties at taxes, mas napapabilis at napapadali ang pagbibigay ng tulong sa mga biktima ng kalamidad, dahil wala nang financial burden na kailangang pasanin ang mga nagbibigay o tumatanggap ng tulong.

⚠️ Dapat Tandaan
Hindi automatic na exempted ang lahat ng donated goods — dapat munang ma-qualify ito bilang "relief consignment" sa ilalim ng Section 120, kasama ang tamang timing at destinasyon, bago maging applicable ang exemption sa Section 121.

🎯 Board Exam Tip
I-memorize ang tatlong (3) requirements para sa duty/tax exemption: (1) qualified as relief consignment, (2) imported during state of calamity, (3) intended for specific calamity area para sa mga biktima roon.

❓ Madalas Malito ang Students
Tanong: "Kung na-import ang relief goods pero sa ibang lugar (hindi 'yung calamity area) ito ipinamahagi, exempted pa rin ba ito?" Sagot: Batay sa malinaw na wika ng batas, dapat ito ay "intended for a specific calamity area for the use of the calamity victims therein" — kaya kung hindi ito para sa mismong calamity area, maaaring hindi na ito kwalipikado para sa exemption.

🔗 Related Topics
Section 120 (Relief Consignment), paragraphs (a) hanggang (d) ng Section 120.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 121 ng CMTA (Republic Act No. 10863) tungkol sa Duty and Tax Treatment ng relief consignment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang tatlong requirements para sa exemption, banggitin ang kaugnay na Section 120, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},393:{_label:"section 100 — Short Title",title:"Ano ang CMTA? (Short Title)",content:`📖 Kahulugan

Ang Section 100 ay nasa Title I (Preliminary Provisions), Chapter 1 (Short Title) ng CMTA — ang pinaka-unang probisyon ng buong batas. Dito opisyal na pinapangalanan ang Republic Act No. 10863 bilang "Customs Modernization and Tariff Act" o CMTA.

🔍 Breakdown

- **"This Act"** — tumutukoy sa buong RA 10863, na ang *long title* (opisyal, mahabang pangalan) ay "An Act Modernizing the Customs and Tariff Administration."
- **"shall be known as"** — ito na ang magiging *short title* — ang pangalang gagamitin sa pang-araw-araw na reference, hearing, o kaso.
- **"Customs Modernization and Tariff Act (CMTA)"** — "Modernization" dahil sa layuning i-streamline ang mga proseso ng BOC; "Tariff Act" dahil sakop din nito ang pagpapataw ng buwis/taripa sa mga inaangkat na produkto.

💡 Simpleng Paliwanag

RA 10863 ang "buong pangalan" (long title), CMTA ang "palayaw" (short title). Hindi lang ito pampasimple — sa legal na drafting sa Pilipinas, layunin ng short title na patas na maipaalam sa publiko ang laman ng batas, gawin itong madaling makilala, at magsilbing sanggunian sa hinaharap.

⭐ Bakit Mahalaga Ito

Kung wala nito, palagi mong gagamitin ang mahabang RA number o long title kapag nag-cite. Ito rin ang "official name" na makikita sa halos lahat ng CMTA-related na dokumento, memo, at jurisprudence ng BOC.

⚠️ Dapat Tandaan

- RA 10863 at CMTA ay iisa — walang pagkakaiba sa substance, magkaiba lang ang tawag.
- Pinalitan ng CMTA ang lumang **Tariff and Customs Code of the Philippines (TCCP)**.
- Nilagdaan ni Pang. Benigno S. Aquino III ang CMTA noong Mayo 30, 2016, at nagkabisa ito noong Hunyo 16, 2016 — 15 araw pagkatapos ng publikasyon sa Manila Bulletin noong Hunyo 1, 2016.

🎯 Board Exam Tip

Karaniwang itinatanong:
- RA number ng CMTA → **RA 10863**
- Petsa ng paglagda → **May 30, 2016**
- Petsa ng effectivity → **June 16, 2016**
- Anong batas ang pinalitan? → **TCCP**

❓ Madalas Malito ang Students

- *Tanong:* Pareho ba ang "long title" at "short title"?
- *Sagot:* Hindi. Ang long title ("An Act Modernizing the Customs and Tariff Administration") ang buong pormal na pamagat ng batas na nagbibigay ng saklaw nito; ang short title (CMTA) ang pinaikling opisyal na tawag na nakasaad sa Section 100.

🔗 Related Topics

- Long Title ng RA 10863
- Tariff and Customs Code of the Philippines (TCCP) — ang pinalitang batas
- Section 101 (Declaration of Policy) — susunod na probisyon`,prompt:`I am studying the Philippine Customs Modernization and Tariff Act (CMTA). Please explain Section 100 (Short Title) in simple terms. Even though it just gives the name of the law, please explain why it's called "Customs Modernization" and "Tariff Act". What was the previous law it replaced? Please provide context on how this law relates to the daily work of a Customs Broker and the Bureau of Customs, and give insights for the Customs Broker Licensure Exam (CBLE).`},422:{_label:"section 200 — Chief Officials of the Bureau",title:"Section 200: Sino ang mga Namumuno sa Bureau of Customs?",content:`📖 Kahulugan
Ang Section 200 ay naglalarawan sa organizational leadership ng Bureau of Customs. Pinamumunuan ito ng isang Commissioner, na tinutulungan ng hindi bababa sa apat (4) pero hindi hihigit sa anim (6) na Deputy Commissioners. Parehong inaapoint ng Pangulo ng Pilipinas ang Commissioner at ang mga Deputy Commissioners.

🔍 Breakdown
- Commissioner – ang pinakamataas na opisyal ng Bureau of Customs, hinihirang mismo ng Pangulo.
- At Least Four (4) but Not More Than Six (6) Deputy Commissioners – nagtatakda ng minimum at maximum na bilang ng katulong na opisyal, para hindi masyadong maliit o masyadong malaki ang leadership team.
- Appointed by the President – parehong Commissioner at Deputy Commissioners ay presidential appointees, hindi karaniwang promotion mula sa loob lamang.
- Majority from the Ranks of the Bureau – dapat karamihan sa mga Deputy Commissioners ay galing mismo sa Bureau of Customs, para masiguro ang institutional knowledge at experience.

💡 Simpleng Paliwanag
Isipin mo ang Bureau of Customs na parang isang malaking kumpanya — may isang "CEO" (ang Commissioner) at may 4 hanggang 6 na "Vice Presidents" (ang Deputy Commissioners). Lahat sila ay hinihirang ng Pangulo, pero karamihan sa mga Deputy Commissioners ay dapat talagang taga-loob ng Bureau para may sapat silang karanasan sa customs operations.

📦 Halimbawa
Nagkaroon ng bakanteng posisyon bilang Deputy Commissioner para sa Intelligence Group ng Bureau of Customs. Base sa Section 200, ang Pangulo ang magde-decide kung sino ang ihihirang, pero dahil kailangan na majority ng mga Deputy Commissioners ay galing sa ranks ng Bureau, mas malamang na isang senior customs official mula sa loob mismo ng ahensya ang mapili para sa posisyon.

⭐ Bakit Mahalaga Ito?
Mahalaga itong maintindihan ng mga estudyante dahil ito ang nagtatakda ng basic organizational structure ng Bureau of Customs — kung sino ang may authority na mag-decide sa mga customs matters, at kung paano sila pinili.

⚠️ Dapat Tandaan
Hindi lahat ng Deputy Commissioners ay kailangang galing sa Bureau — "at least majority" lang ang requirement, ibig sabihin maaari pa ring may kasamang hindi taga-Bureau of Customs.

🎯 Board Exam Tip
I-memorize ang eksaktong bilang: 4 minimum, 6 maximum na Deputy Commissioners — madalas itong specific na tinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Ang Commissioner ba ay dapat ding galing sa ranks ng Bureau?" Sagot: Hindi ito malinaw na nakasaad sa Section 200 — ang "majority from the ranks" requirement ay tumutukoy lamang sa mga Deputy Commissioners, hindi sa Commissioner.

🔗 Related Topics
Section 201 (Powers and Functions of the Commissioner), Section 202 (Functions of the Bureau).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 200 ng CMTA (Republic Act No. 10863) tungkol sa Chief Officials ng Bureau of Customs. I-explain nang simple, magbigay ng practical na halimbawa tungkol sa appointment ng Commissioner at Deputy Commissioners, ipaliwanag ang kahalagahan ng organizational structure na ito, banggitin ang kaugnay na Section 201 at 202, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},423:{_label:"section 201 — Powers and Functions of the Commissioner",title:"Section 201: Ang mga Kapangyarihan at Tungkulin ng Commissioner",content:`📖 Kahulugan
Ang Section 201 ay naglilista ng mga specific na powers and functions na hawak ng Commissioner ng Bureau of Customs — mula sa pagbibigay-kahulugan sa batas, hanggang sa pag-delegate ng authority sa ibang customs officers.

🔍 Breakdown
Ang Section 201 ay ang "main provision" na nagbubukas sa listahan ng pitong (7) specific na powers (paragraphs a-g), kabilang ang interpretasyon ng batas, pag-exercise ng customs powers, pag-review ng mga desisyon, at iba pa. Bawat paragraph ay may sariling detalyadong saklaw na tatalakayin nang hiwalay.

💡 Simpleng Paliwanag
Ang Commissioner ang "pinakamataas na hukom" sa loob ng Bureau of Customs pagdating sa interpretasyon ng batas at customs decisions — pero may mga limitasyon at checks pa rin mula sa Secretary of Finance at Court of Tax Appeals.

📦 Halimbawa
May isang importer na naghain ng reklamo tungkol sa disputed assessment ng kanyang shipment. Sa ilalim ng Section 201, may kapangyarihan ang Commissioner na i-review at desisyunan ang usaping ito, subject pa rin sa posibleng appeal sa Secretary of Finance o sa Court of Tax Appeals.

⭐ Bakit Mahalaga Ito?
Mahalagang maintindihan ito dahil ito ang legal basis ng authority ng Commissioner sa halos lahat ng customs operations — mula interpretasyon ng batas hanggang sa pag-assign ng mga customs officers.

⚠️ Dapat Tandaan
Hindi absolute ang power ng Commissioner — maraming sa mga ito ay "subject to review" ng Secretary of Finance o ng Court of Tax Appeals.

🎯 Board Exam Tip
I-memorize ang pitong (7) specific powers sa paragraphs (a) hanggang (g) — madalas itong hiwa-hiwalay na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Absolute ba ang kapangyarihan ng Commissioner na mag-interpret ng batas?" Sagot: Hindi — kahit "exclusive and original jurisdiction" ang termino, ito ay subject pa rin sa review ng Secretary of Finance.

🔗 Related Topics
Paragraphs (a) hanggang (g) ng Section 201, Section 200 (Chief Officials), Court of Tax Appeals.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201 ng CMTA (Republic Act No. 10863) tungkol sa Powers and Functions of the Commissioner. I-explain nang simple ang overview ng pitong specific powers, magbigay ng practical na halimbawa, banggitin ang kaugnay na paragraphs (a-g) at ang 2023-28 OCOM MEMO at CAO 06-2022, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},424:{_label:"paragraph (a) — Interpretation of the Act",title:"Section 201(a): Kapangyarihan sa Interpretasyon ng CMTA",content:`📖 Kahulugan
May exclusive at original jurisdiction ang Commissioner na mag-interpret ng mga probisyon ng CMTA, kasama ang pakikipagtulungan sa ibang relevant government agencies, pero subject pa rin ito sa review ng Secretary of Finance.

🔍 Breakdown
- Exclusive and Original Jurisdiction – ang Commissioner lang, hindi ibang opisyal, ang may unang karapatan na mag-interpret ng batas.
- In Collaboration with Other Relevant Government Agencies – hindi mag-isa lang ang Commissioner sa pag-interpret, kundi kasama ang ibang concerned agencies.
- Subject to Review by the Secretary of Finance – may check and balance — hindi final ang interpretasyon ng Commissioner, maaari pa itong baguhin ng Secretary of Finance.

💡 Simpleng Paliwanag
Kung may hindi malinaw na probisyon sa CMTA, ang Commissioner ang unang magde-decide kung ano ang tamang interpretasyon, kasama ang input ng ibang government agencies kung kinakailangan — pero puwede pa ring i-review at baguhin ito ng Secretary of Finance.

📦 Halimbawa
May hindi malinaw na tanong tungkol sa kung ano ang eksaktong saklaw ng "relief consignment" para sa isang bagong klaseng disaster relief equipment. Ang Commissioner, kasama ang DSWD, ang unang magbibigay ng opisyal na interpretasyon, pero maaari pa itong i-review ng Secretary of Finance kung may dispute.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng clarity at consistency sa pag-apply ng CMTA sa buong bansa — walang confusion kung sino ang may huling salita sa interpretasyon ng batas.

⚠️ Dapat Tandaan
Kahit "exclusive and original," hindi ito nangangahulugang "final" — laging may possibility ng review mula sa Secretary of Finance.

🎯 Board Exam Tip
I-note ang tatlong key elements: exclusive/original jurisdiction, collaboration with other agencies, at review by Secretary of Finance — madalas itong pinagsasama sa exam.

❓ Madalas Malito ang Students
Tanong: "Kung nag-interpret na ang Commissioner, wala nang paraan para baguhin ito?" Sagot: May paraan — ang interpretasyon ng Commissioner ay subject pa rin sa review ng Secretary of Finance, kaya hindi ito absolutely final.

🔗 Related Topics
Section 201 (main provision), Secretary of Finance's oversight role.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa kapangyarihan ng Commissioner na mag-interpret ng batas. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang papel ng Secretary of Finance sa pag-review, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},425:{_label:"paragraph (b) — Exercise of Customs Powers",title:"Section 201(b): Pag-exercise ng Customs Powers, Duties, at Functions",content:`📖 Kahulugan
Maaaring i-exercise ng Commissioner ang anumang customs power, duty, o function, maging direkta o indirekta.

🔍 Breakdown
- Any Customs Power, Duties and Functions – malawak na saklaw, hindi limitado sa specific na power lamang.
- Directly or Indirectly – pwedeng gawin mismo ng Commissioner (direct), o sa pamamagitan ng ibang customs officers (indirect).

💡 Simpleng Paliwanag
Ang Commissioner ay may broad na authority — pwede niyang gawin mismo ang isang customs function, o pwede rin niyang ipagawa ito sa ibang tao sa Bureau. Ito ang "catch-all" na power na sumasaklaw sa lahat ng customs-related na gawain.

📦 Halimbawa
Sa panahon ng malaking smuggling operation, maaaring direktang mamuno ang Commissioner sa isang special task force (direct exercise), o maaari rin niyang i-assign ang isang senior customs officer para pamunuan ang operation habang siya ang nagsusupervise mula sa itaas (indirect exercise).

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa Commissioner para epektibong mapamahalaan ang malawak na operasyon ng Bureau of Customs, nang hindi limitado sa mga specific na aksyon lamang.

⚠️ Dapat Tandaan
Kahit malawak ang power na ito, dapat pa rin itong gamitin alinsunod sa balangkas ng CMTA at hindi paglabag sa ibang probisyon nito.

🎯 Board Exam Tip
Tandaan ang "directly or indirectly" — ito ang key phrase na nagpapakita ng broad discretion ng Commissioner.

❓ Madalas Malito ang Students
Tanong: "Ibig bang sabihin nito, kahit anong gusto ng Commissioner, pwede niyang gawin?" Sagot: Hindi — ang power na ito ay tungkol sa flexibility sa pag-exercise ng EXISTING customs powers, duties, at functions, hindi ito nangangahulugang unlimited o walang batayan na authority.

🔗 Related Topics
Section 201 (main provision), Section 202 (Functions of the Bureau).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa direct at indirect na pag-exercise ng customs powers ng Commissioner. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},426:{_label:"paragraph (c) — Review of Customs Officer Actions",title:"Section 201(c): Pag-review ng Aksyon o Desisyon ng Customs Officers",content:`📖 Kahulugan
Maaaring i-review ng Commissioner ang anumang aksyon o desisyon ng kahit sinong customs officer na ginawa alinsunod sa mga probisyon ng CMTA.

🔍 Breakdown
- Review Any Action or Decision – malawak na power na sumasaklaw sa lahat ng klase ng desisyon.
- Of Any Customs Officer – kahit sinong opisyal sa loob ng Bureau, mula sa pinakamababang ranggo hanggang sa senior officials.
- Performed Pursuant to the Provisions of This Act – dapat may koneksyon ang aksyon sa CMTA — customs-related decisions lang ang saklaw.

💡 Simpleng Paliwanag
Kung may customs officer na gumawa ng desisyon — halimbawa, pag-assess ng duties o pag-seize ng goods — may karapatan ang Commissioner na i-review at posibleng baguhin ang desisyong iyon.

📦 Halimbawa
May isang District Collector na nagdesisyon na i-seize ang isang shipment dahil sa suspetsang undervaluation. Kung sa palagay ng may-ari ng goods ay mali ang desisyon, maaari itong dalhin sa Commissioner para i-review, na may kapangyarihang baguhin o i-uphold ang naunang desisyon ng District Collector.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng accountability mechanism sa loob ng Bureau — hindi basta-basta final ang desisyon ng bawat customs officer, dahil may higher authority na pwedeng mag-review nito.

⚠️ Dapat Tandaan
Ang review power na ito ay para sa mga aksyon na "pursuant to the provisions of this Act" — hindi ito saklaw sa mga personal o hindi customs-related na gawain ng officer.

🎯 Board Exam Tip
I-relate ito sa administrative due process — ang review power ng Commissioner ay bahagi ng internal check and balance system ng Bureau.

❓ Madalas Malito ang Students
Tanong: "Pwede bang mag-file ng appeal ang importer direkta sa Commissioner laban sa desisyon ng isang customs officer?" Sagot: Ang batas ay nagsasaad na may power ang Commissioner na i-review ang ganitong desisyon; ang specific na procedural steps para dito ay karaniwang nasa implementing rules and regulations ng Bureau.

🔗 Related Topics
Section 201 (main provision), paragraph (d) — Review of Disputed Assessments.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa power ng Commissioner na i-review ang aksyon o desisyon ng customs officers. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},427:{_label:"paragraph (d) — Review of Disputed Assessments",title:"Section 201(d): Pag-review ng Disputed Assessments",content:`📖 Kahulugan
Maaaring i-review at desisyunan ng Commissioner ang mga disputed assessment at ibang kaugnay na usapin, pero subject pa rin ito sa review ng Secretary of Finance at sa exclusive appellate jurisdiction ng Court of Tax Appeals (CTA).

🔍 Breakdown
- Review and Decide Disputed Assessments – kapangyarihan na resolbahin ang hindi pagkakasundo tungkol sa halaga ng duties/taxes na dapat bayaran.
- Other Matters Related Thereto – kasama rin ang ibang usaping konektado sa disputed assessments.
- Subject to Review by the Secretary of Finance – unang layer ng appeal.
- Exclusive Appellate Jurisdiction of the CTA – ang Court of Tax Appeals ang huling hukuman na maaaring mag-review ng ganitong desisyon.

💡 Simpleng Paliwanag
Kung may importer na hindi sumasang-ayon sa halagang ini-assess ng Bureau of Customs sa kanyang shipment, ang Commissioner ang unang magde-decide sa dispute. Kung hindi pa rin nasisiyahan ang importer, pwede pa itong i-appeal sa Secretary of Finance, at kung kinakailangan, hanggang sa Court of Tax Appeals.

📦 Halimbawa
May isang trading company na hindi sumasang-ayon sa duty assessment ng kanilang imported electronics dahil sa itinuturing nilang mataas na valuation. Una nilang dinala ang dispute sa Commissioner para sa desisyon. Kung hindi pa rin sila nasiyahan sa resulta, maaari na nilang i-elevate ang kaso sa Court of Tax Appeals bilang huling hakbang.

⭐ Bakit Mahalaga Ito?
Mahalaga itong maintindihan ng mga customs broker at importer dahil ito ang nagtatakda ng proseso kung paano ma-resolve ang mga hindi pagkakasundo sa assessment — kritikal ito sa disputes tungkol sa duties at taxes.

⚠️ Dapat Tandaan
Hindi Commissioner ang huling hukom dito — may dalawang antas pa ng appeal: Secretary of Finance muna, tapos ang Court of Tax Appeals bilang exclusive appellate jurisdiction.

🎯 Board Exam Tip
I-memorize ang tamang sequence ng appeal: Commissioner → Secretary of Finance → Court of Tax Appeals. Madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Pwede bang direktang mag-file sa Court of Tax Appeals kung hindi ako sang-ayon sa assessment?" Sagot: Batay sa nakasaad sa batas, may proseso munang dapat sundin — kailangan munang dumaan sa Commissioner at Secretary of Finance bago maabot ang CTA bilang exclusive appellate jurisdiction.

🔗 Related Topics
Section 201 (main provision), Court of Tax Appeals, paragraph (c) — Review of Customs Officer Actions.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa pag-review ng disputed assessments. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang tamang sequence ng appeal papunta sa Court of Tax Appeals, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},428:{_label:"paragraph (e) — Delegation of Powers",title:"Section 201(e): Pag-delegate ng Powers sa Ibang Customs Officer",content:`📖 Kahulugan
Maaaring i-delegate ng Commissioner ang mga power na hawak niya sa ilalim ng CMTA sa kahit sinong customs officer na may ranggong katumbas ng division chief pataas, MALIBAN sa tatlong specific na powers: (1) promulgation of rules and regulations, (2) issuance/revocation/modification of rulings, at (3) compromise or abate of customs obligations.

🔍 Breakdown
- Delegate the Powers – pwedeng ipasa ng Commissioner ang kanyang authority sa ibang tao.
- To Any Customs Officer with Rank Equivalent to Division Chief or Higher – may minimum na ranggo requirement bago maaaring tumanggap ng delegated power.
- Except for the Following – tatlong power na HINDI puwedeng i-delegate:
  (1) Promulgation of Rules and Regulations – ang paggawa ng bagong customs rules.
  (2) Issuance, Revocation or Modification of Rulings – ang opisyal na pagbibigay o pagbabago ng customs rulings.
  (3) Compromise or Abate of Customs Obligations – ang pagbaba o pag-waive ng customs obligations.

💡 Simpleng Paliwanag
Hindi kailangang gawin ng Commissioner mismo ang lahat ng bagay — pwede niyang ipasa ang ibang tungkulin sa mga senior customs officer (division chief pataas). Pero may tatlong bagay na HINDI niya pwedeng ipasa sa iba — dapat siya mismo ang gumawa nito dahil sobrang sensitive at mahalaga ang mga ito.

📦 Halimbawa
Dahil sa dami ng trabaho, ang Commissioner ay nag-delegate ng authority sa isang Deputy Commissioner para pangasiwaan ang day-to-day operations ng isang specific customs district. Pero kung may kailangang i-compromise na malaking customs obligation ng isang kumpanya dahil sa financial hardship, hindi ito maaaring ipasa sa Deputy Commissioner — ang Commissioner mismo ang dapat gumawa ng desisyon dito.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng balanse sa pagitan ng efficiency (sa pamamagitan ng delegation) at accountability (sa pamamagitan ng non-delegable powers) — tinitiyak nito na ang pinaka-sensitibong desisyon ay nananatili sa kamay ng Commissioner mismo.

⚠️ Dapat Tandaan
Mahalagang i-memorize ang tatlong EXCEPTIONS sa delegation — ito ang madalas na "trap" sa exam, dahil maraming estudyante ang nag-aakalang lahat ay puwedeng i-delegate.

🎯 Board Exam Tip
Gamitin ang mnemonic na "PIC" para matandaan ang tatlong non-delegable powers: Promulgation of rules, Issuance/revocation of rulings, Compromise/abate ng obligations.

❓ Madalas Malito ang Students
Tanong: "Pwede bang i-delegate ng Commissioner ang power niya na mag-compromise ng customs obligation kung may valid reason?" Sagot: Hindi — malinaw na nakasaad sa batas na ito ay isa sa tatlong exception na HINDI puwedeng i-delegate, kahit anong reason pa ito.

🔗 Related Topics
Section 201 (main provision), Section 200 (Chief Officials), CAO 06-2022 on Assignments, Reassignments and Designations.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (e) ng CMTA (Republic Act No. 10863) tungkol sa pag-delegate ng powers ng Commissioner at ang tatlong exceptions dito. I-explain nang simple, magbigay ng practical na halimbawa, banggitin ang CAO 06-2022, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},429:{_label:"paragraph (f) — Assignment/Reassignment of Officers",title:"Section 201(f): Assignment at Reassignment ng Customs Officers",content:`📖 Kahulugan
May kapangyarihan ang Commissioner na mag-assign o mag-reassign ng kahit sinong customs officer, subject sa approval ng Secretary of Finance, pero may specific na limitasyon: ang mga District Collector at ibang customs officers na may assessment functions ay hindi maaaring manatili sa parehong assignment nang mahigit tatlong (3) taon.

🔍 Breakdown
- Assignment or Reassignment – ang power na maglipat o mag-assign ng customs officer sa isang posisyon.
- Subject to the Approval of the Secretary of Finance – hindi absolute — kailangan pa rin ng pag-apruba mula sa Secretary of Finance.
- District Collectors and Other Officers with Assessment Functions – specific na klase ng officers na sakop ng three-year rule.
- Not More Than Three (3) Years in the Same Area of Assignment – ang "anti-entrenchment" rule na pumipigil sa masyadong matagal na pananatili sa iisang lugar.

💡 Simpleng Paliwanag
May power ang Commissioner na maglipat-lipat ng customs officers sa iba't ibang assignment, pero kailangan pa rin ng approval ng Secretary of Finance. May special rule din para sa mga District Collector at katulad — hindi sila puwedeng manatili nang mahigit tatlong taon sa parehong lugar, para maiwasan ang posibleng corruption o "cozy relationships" sa mga local stakeholders.

📦 Halimbawa
May isang District Collector na naka-assign na sa Port of Cebu nang halos tatlong taon. Base sa Section 201(f), kailangan na siyang i-reassign ng Commissioner (na may approval ng Secretary of Finance) sa ibang customs district, dahil hindi na siya puwedeng manatili pa sa parehong assignment.

⭐ Bakit Mahalaga Ito?
Ang three-year rotation rule ay isang anti-corruption measure — pinipigilan nito ang pagbuo ng masyadong malapit na relasyon sa pagitan ng customs officers na may assessment power at ng mga negosyanteng dumadaan sa kanilang jurisdiction, na maaaring humantong sa katiwalian.

⚠️ Dapat Tandaan
Ang three-year limit ay applicable lang sa mga officer na may ASSESSMENT FUNCTIONS (tulad ng District Collectors) — hindi ito universal na rule para sa lahat ng customs officer positions.

🎯 Board Exam Tip
I-memorize ang eksaktong bilang: hindi hihigit sa tatlong (3) taon sa parehong area of assignment — ito ay madalas na specific na tinatanong sa exam bilang anti-corruption measure.

❓ Madalas Malito ang Students
Tanong: "Applicable ba ang three-year rule sa lahat ng customs officers?" Sagot: Hindi — malinaw na nakasaad sa batas na ito ay specific lang sa District Collectors at ibang customs officers na "perform assessment functions," hindi sa lahat ng positions sa Bureau.

🔗 Related Topics
Section 201 (main provision), Section 200 (Chief Officials), Secretary of Finance's oversight role.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (f) ng CMTA (Republic Act No. 10863) tungkol sa assignment at reassignment ng customs officers, kasama ang three-year rotation rule. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang layunin nito bilang anti-corruption measure, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},430:{_label:"paragraph (g) — Other Duties",title:"Section 201(g): Iba Pang Tungkulin Para sa Epektibong Implementasyon",content:`📖 Kahulugan
Ito ang "catch-all" provision na nagbibigay sa Commissioner ng authority na gawin ang lahat ng ibang tungkulin at function na kinakailangan para sa epektibong implementasyon ng CMTA at ibang customs-related laws.

🔍 Breakdown
- Perform All Other Duties and Functions – malawak na saklaw na hindi limitado sa mga naunang nakalistang powers (paragraphs a-f).
- As May Be Necessary – kailangan lang na "necessary" o kinakailangan, hindi arbitrary.
- For the Effective Implementation – ang layunin ay palaging nakatutok sa epektibong pagpapatupad ng batas.
- Of This Act and Other Customs Related Laws – hindi lang CMTA kundi pati na rin ibang batas na may kinalaman sa customs.

💡 Simpleng Paliwanag
Ito ang "safety net" provision — kung may bagong sitwasyon o hamon na lumitaw na hindi direktang covered ng paragraphs (a) hanggang (f), may authority pa rin ang Commissioner na kumilos, basta't ito ay para sa epektibong pagpapatupad ng batas.

📦 Halimbawa
Sa panahon ng pandemic, kinailangan ng Bureau of Customs na mag-implement ng bagong health protocol sa mga daungan na hindi direktang nakasaad sa ibang paragraphs ng Section 201. Sa ilalim ng paragraph (g), may authority ang Commissioner na gumawa ng ganitong mga hakbang, dahil ito ay necessary para sa epektibong implementasyon ng customs operations.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa Commissioner para tumugon sa mga bagong sitwasyon o hamon na hindi na-anticipate ng batas nang direkta, nang hindi na kailangang i-amend pa ang buong CMTA.

⚠️ Dapat Tandaan
Kahit malawak ang saklaw nito, dapat pa ring nasa loob ito ng balangkas ng "effective implementation" ng CMTA — hindi ito unlimited na kapangyarihan na maaaring gamitin nang walang batayan.

🎯 Board Exam Tip
Tandaan na ito ang "catch-all" clause ng Section 201 — laging kasama ito bilang huling item sa listahan ng powers ng Commissioner.

❓ Madalas Malito ang Students
Tanong: "Ibig sabihin ba nito, kahit anong gusto ng Commissioner pwede niyang gawin?" Sagot: Hindi — dapat ang kanyang aksyon ay "necessary for the effective implementation" ng CMTA at ibang customs laws, hindi basta arbitrary na desisyon.

🔗 Related Topics
Section 201 (main provision), paragraphs (a) hanggang (f).`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 201, paragraph (g) ng CMTA (Republic Act No. 10863) tungkol sa "catch-all" na tungkulin ng Commissioner. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang layunin ng ganitong flexible na provision, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},431:{_label:"section 202 — Functions of the Bureau",title:"Section 202: Ang mga Pangunahing Tungkulin ng Bureau of Customs",content:`📖 Kahulugan
Ang Section 202 ay naglilista ng labing-isang (11) pangunahing duties at functions ng buong Bureau of Customs bilang institusyon — mula sa pangongolekta ng revenue hanggang sa pagpigil ng smuggling at pagpapatupad ng batas.

🔍 Breakdown
Kung ang Section 201 ay tungkol sa powers ng Commissioner bilang indibidwal na opisyal, ang Section 202 naman ay tungkol sa functions ng buong Bureau bilang institusyon. Sumasaklaw ito sa revenue collection, trade facilitation, border control, anti-smuggling, at maging compensation study para sa mga empleyado.

💡 Simpleng Paliwanag
Kung ang Commissioner ang "puno" ng Bureau, ang Section 202 naman ang naglalarawan sa "trabaho" ng buong organisasyon — ano ba talaga ang ginagawa ng Bureau of Customs bilang ahensya, hindi lang sa isang tao.

📦 Halimbawa
Sa isang ordinaryong araw sa Port of Manila, ang Bureau of Customs ay sabay-sabay na nagsasagawa ng iba't ibang functions: kinokolekta nila ang duties mula sa mga papasok na shipment, sinusuri nila ang mga cargo para sa smuggled goods, sinusupervise nila ang pagdating ng mga barko, at pinoproseso rin nila ang foreign mail — lahat ito ay konkretong ehemplo ng functions na nakalista sa Section 202.

⭐ Bakit Mahalaga Ito?
Mahalagang maintindihan ito ng mga customs students dahil ito ang buod ng "raison d'être" o pangunahing dahilan kung bakit umiiral ang Bureau of Customs bilang isang government agency.

⚠️ Dapat Tandaan
Huwag ipagkamali ang Section 202 (Functions of the Bureau) sa Section 201 (Powers of the Commissioner) — magkaiba ang subject: institusyon laban sa indibidwal na opisyal.

🎯 Board Exam Tip
I-memorize ang mga major categories ng functions: revenue collection, trade facilitation, border control, at anti-smuggling — grupohin ang labing-isang paragraphs sa mga temang ito para mas madaling matandaan.

❓ Madalas Malito ang Students
Tanong: "Ano ang pagkakaiba ng Section 201 at Section 202?" Sagot: Ang Section 201 ay tungkol sa specific powers ng Commissioner bilang indibidwal na opisyal, habang ang Section 202 ay tungkol sa mga institutional functions ng buong Bureau of Customs.

🔗 Related Topics
Section 201 (Powers and Functions of the Commissioner), paragraphs (a) hanggang (k) ng Section 202.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202 ng CMTA (Republic Act No. 10863) tungkol sa Functions of the Bureau. I-explain nang simple ang overview ng labing-isang functions, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa Section 201, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},432:{_label:"paragraph (a) — Assessment and Collection",title:"Section 202(a): Assessment at Collection ng Customs Revenues",content:`📖 Kahulugan
Isa sa pangunahing function ng Bureau of Customs ay ang pag-assess at pangongolekta ng customs revenues mula sa imported goods, pati na rin ang ibang dues, fees, charges, fines, at penalties na sakop ng CMTA.

🔍 Breakdown
- Assessment and Collection – dalawang magkaibang proseso: una, tinutukoy ang tamang halaga (assessment); pangalawa, kinokolekta ito (collection).
- Customs Revenues from Imported Goods – ang pangunahing pinagmumulan ng kita — duties and taxes mula sa imported goods.
- Other Dues, Fees, Charges, Fines and Penalties – kasama rin ang ibang klase ng bayarin, hindi lang basic duties/taxes.

💡 Simpleng Paliwanag
Ito ang pinaka-basic at pinaka-kilalang function ng Bureau of Customs — ang pagtukoy kung magkano dapat bayaran ng isang importer, at ang aktwal na pangongolekta ng bayad na iyon, kasama na ang anumang penalty kung may paglabag.

📦 Halimbawa
May isang importer ng electronics na nagpasok ng shipment sa Port of Batangas. Ang Bureau of Customs ang nagtukoy ng tamang customs duty base sa value at classification ng produkto (assessment), at pagkatapos ay kinolekta nila ang bayad bago pinalabas ang shipment (collection).

⭐ Bakit Mahalaga Ito?
Ito ang pangunahing revenue-generating function ng Bureau of Customs, na mahalaga sa pambansang kaban ng bayan (national treasury) at sa paggana ng gobyerno.

⚠️ Dapat Tandaan
Hindi lang "duties" ang saklaw nito — kasama rin ang ibang fees, charges, fines, at penalties na maaaring ma-impose sa ilalim ng CMTA.

🎯 Board Exam Tip
Tandaan na ito ang "core" o pangunahing function ng Bureau — madalas na starting point ito sa mga discussion tungkol sa customs administration.

❓ Madalas Malito ang Students
Tanong: "Parehas lang ba ang assessment at collection?" Sagot: Hindi — ang assessment ay ang proseso ng pagtukoy kung magkano ang dapat bayaran, habang ang collection ay ang aktwal na pangongolekta ng bayad na iyon.

🔗 Related Topics
Section 202 (main provision), Section 201(d) — Review of Disputed Assessments.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa assessment and collection ng customs revenues. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},433:{_label:"paragraph (b) — Simplification and Harmonization",title:"Section 202(b): Simplification at Harmonization ng Customs Procedures",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagpapasimple at pag-harmonize ng customs procedures, para mapadali ang paggalaw ng goods sa international trade.

🔍 Breakdown
- Simplification – ginagawang mas simple at mas madali ang mga customs processes.
- Harmonization – ginagawang consistent o pare-pareho ang mga procedures, posibleng kasabay ng international standards o practices.
- Facilitate Movement of Goods in International Trade – ang pangunahing layunin — mapabilis at mapadali ang daloy ng kalakal sa pandaigdigang kalakalan.

💡 Simpleng Paliwanag
Sa halip na gawing komplikado at magulo ang proseso ng pag-import at pag-export, tungkulin ng Bureau of Customs na gawing mas simple at mas standardized ang mga ito, para mas mabilis at mas madali ang trade sa pagitan ng Pilipinas at ibang bansa.

📦 Halimbawa
Nag-implement ang Bureau of Customs ng isang electronic single-window system kung saan ang mga importer ay maaaring mag-submit ng lahat ng required documents sa isang online platform lang, sa halip na dumaan pa sa maraming magkakahiwalay na ahensya. Ito ay direktang halimbawa ng simplification and harmonization function.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa competitiveness ng Pilipinas sa global trade — kung masyadong komplikado ang customs procedures, maaaring umiwas ang mga negosyante sa pag-trade sa Pilipinas, na negatibo sa ekonomiya.

⚠️ Dapat Tandaan
Ang "simplification" ay hindi nangangahulugang "pagbaba ng standards" — layunin nito ay gawing efficient ang proseso, hindi ibaba ang quality ng regulatory oversight.

🎯 Board Exam Tip
I-relate ito sa modernong trade facilitation trends tulad ng electronic processing at single-window systems.

❓ Madalas Malito ang Students
Tanong: "Ibig sabihin ba nito, mas kaunti na lang ang requirements sa customs?" Sagot: Hindi ito ang pangunahing punto — ang simplification and harmonization ay tungkol sa paggawa ng mas efficient at mas standardized na proseso, hindi sa pagbawas ng mga legal requirements.

🔗 Related Topics
Section 202 (main provision), Section 120 (Relief Consignment — simplified procedure example).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa simplification and harmonization ng customs procedures. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang kahalagahan nito sa trade facilitation, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},434:{_label:"paragraph (c) — Border Control",title:"Section 202(c): Border Control Laban sa Smuggled Goods",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang border control para pigilan ang pagpasok ng mga smuggled goods sa bansa.

🔍 Breakdown
- Border Control – ang pagbabantay at pagkontrol sa mga entry points ng bansa (ports, airports, atbp.).
- Prevent Entry of Smuggled Goods – ang direktang layunin — pigilan ang illegal na pagpasok ng goods na hindi dumaan sa tamang customs procedure.

💡 Simpleng Paliwanag
Ang Bureau of Customs ang "guwardiya" ng ating mga border — sila ang unang linya ng depensa laban sa mga smuggled goods na sinusubukang ipasok sa bansa nang hindi dumadaan sa tamang proseso at nang hindi nagbabayad ng tamang duties.

📦 Halimbawa
Sa isang seaport sa Zamboanga, nagsagawa ang Bureau of Customs ng regular patrol at inspection sa mga papasok na barko para tiyakin na walang smuggled goods, tulad ng unauthorized na sigarilyo o alak, na papasok nang hindi dumadaan sa tamang customs declaration.

⭐ Bakit Mahalaga Ito?
Kritikal ito para maprotektahan ang revenue ng gobyerno, ang lokal na industriya laban sa unfair competition mula sa smuggled goods, at ang public safety laban sa mga bawal o mapanganib na produkto.

⚠️ Dapat Tandaan
Ang border control ay hindi lang tungkol sa physical na pagbabantay — kasama rin dito ang paggamit ng modernong teknolohiya at intelligence gathering para matukoy ang mga potensyal na smuggling activities.

🎯 Board Exam Tip
I-relate ito sa paragraph (d) — Prevention and Suppression of Smuggling — magkaugnay ang dalawang provisions kaya madalas silang pinagsasama sa exam.

❓ Madalas Malito ang Students
Tanong: "Ano ang pagkakaiba ng border control (paragraph c) at prevention/suppression of smuggling (paragraph d)?" Sagot: Magkaugnay ang dalawa pero magkaiba ang focus — ang border control ay mas nakatuon sa physical na entry points, habang ang prevention/suppression ng smuggling ay mas malawak, kasama ang investigation at enforcement laban sa smuggling operations sa kabuuan.

🔗 Related Topics
Section 202 (main provision), paragraph (d) — Prevention and Suppression of Smuggling.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa border control laban sa smuggled goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa paragraph (d), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},435:{_label:"paragraph (d) — Prevention/Suppression of Smuggling",title:"Section 202(d): Prevention at Suppression ng Smuggling at Customs Fraud",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagpigil at pagsupil ng smuggling at ibang klase ng customs fraud.

🔍 Breakdown
- Prevention – proactive na hakbang para pigilan bago pa mangyari ang smuggling.
- Suppression – reactive na hakbang para pigilan o itigil ang ongoing na smuggling activities.
- Smuggling – illegal na pagpasok o paglabas ng goods nang hindi dumadaan sa tamang customs procedure.
- Other Customs Fraud – mas malawak na saklaw, kasama ang ibang klase ng panloloko sa customs, tulad ng undervaluation o misdeclaration.

💡 Simpleng Paliwanag
Ang function na ito ay tungkol sa aktibong paglaban ng Bureau of Customs laban sa smuggling at iba pang panloloko — hindi lang basta pagbabantay sa border, kundi aktibong pag-iimbestiga at pag-aresto sa mga sangkot sa ganitong illegal na gawain.

📦 Halimbawa
Natuklasan ng Bureau of Customs Intelligence Group ang isang syndicate na gumagamit ng undervaluation scheme para makaiwas sa tamang duties sa kanilang imported na goods. Sa ilalim ng function na ito, nagsagawa sila ng masusing imbestigasyon at nag-file ng kaso laban sa mga sangkot.

⭐ Bakit Mahalaga Ito?
Protektado nito ang integridad ng revenue system ng gobyerno at nagbibigay ng level playing field sa mga legitimate na negosyante na tapat na nagbabayad ng tamang duties.

⚠️ Dapat Tandaan
Ang "customs fraud" ay mas malawak kaysa sa "smuggling" mismo — kasama dito ang iba't ibang uri ng panlilinlang tulad ng misdeclaration, undervaluation, at maling classification.

🎯 Board Exam Tip
I-differentiate ang "smuggling" (illegal entry/exit ng goods) sa "customs fraud" (mas malawak, kasama ang misdeclaration, undervaluation, atbp.) — parehong covered ng paragraph na ito.

❓ Madalas Malito ang Students
Tanong: "Puro physical na pagbabantay lang ba ang ginagawa dito?" Sagot: Hindi — kasama rin dito ang investigation, intelligence gathering, at legal enforcement laban sa mga smuggling operations at customs fraud, hindi lang physical patrol.

🔗 Related Topics
Section 202 (main provision), paragraph (c) — Border Control, paragraph (j) — Forfeiture Cases.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa prevention and suppression ng smuggling at customs fraud. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba ng smuggling at customs fraud, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},436:{_label:"paragraph (e) — Facilitation and Security of Trade",title:"Section 202(e): Facilitation at Security sa Pamamagitan ng Informed Compliance Program",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagpapadali (facilitation) at pagpapanatili ng seguridad (security) ng international trade and commerce sa pamamagitan ng isang informed compliance program.

🔍 Breakdown
- Facilitation – pagpapadali ng daloy ng legitimate trade.
- Security – pagtitiyak na secure ang buong proseso laban sa mga banta.
- Informed Compliance Program – isang sistema kung saan tinuturuan at binibigyang-impormasyon ang mga negosyante tungkol sa tamang pagsunod sa customs rules, sa halip na puro palaging enforcement lang.

💡 Simpleng Paliwanag
Sa halip na puro pagpaparusa lang ang ginagawa ng Bureau of Customs, tungkulin din nila na turuan at bigyang-impormasyon ang mga negosyante kung paano tama ang pagsunod sa batas — para mas madali at mas secure ang buong proseso ng trade.

📦 Halimbawa
Nagsagawa ang Bureau of Customs ng seminar para sa mga bagong customs broker at importer tungkol sa tamang paraan ng pag-declare ng goods at pag-comply sa mga requirements, sa halip na hintayin na lang na magkamali sila at parusahan. Ito ay konkretong halimbawa ng informed compliance program.

⭐ Bakit Mahalaga Ito?
Sa pamamagitan ng pag-educate sa mga stakeholders, nababawasan ang honest mistakes na maaaring humantong sa disputes o penalties, at nagiging mas mabilis at mas maayos ang buong trade process.

⚠️ Dapat Tandaan
Ang "informed compliance" ay iba sa basic enforcement — proactive at educational ang approach nito, hindi lang basta reactive na pagpaparusa.

🎯 Board Exam Tip
Tandaan ang "informed compliance program" bilang specific na termino — ito ay malamang na direktang itanong sa exam bilang mekanismo ng trade facilitation.

❓ Madalas Malito ang Students
Tanong: "Ano ang informed compliance program?" Sagot: Ito ay isang approach kung saan ang Bureau of Customs ay proactive na nagbibigay ng impormasyon at edukasyon sa mga negosyante tungkol sa tamang pagsunod sa customs rules, sa halip na umasa lang sa enforcement at penalties.

🔗 Related Topics
Section 202 (main provision), paragraph (b) — Simplification and Harmonization.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (e) ng CMTA (Republic Act No. 10863) tungkol sa facilitation and security ng trade sa pamamagitan ng informed compliance program. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},437:{_label:"paragraph (f) — Supervision of Vessels/Aircraft",title:"Section 202(f): Supervision at Control sa Entrance at Clearance ng Vessels/Aircraft",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagsusupervise at pagkontrol sa entrance (pagdating) at clearance (pag-alis) ng mga barko at eroplano na sangkot sa foreign commerce.

🔍 Breakdown
- Supervision and Control – hindi lang basic monitoring, kundi may aktibong kontrol sa proseso.
- Entrance and Clearance – dalawang magkaibang stages: entrance (pagdating/pagpasok) at clearance (pahintulot na umalis).
- Vessels and Aircraft – parehong barko (sea) at eroplano (air) ang saklaw.
- Engaged in Foreign Commerce – dapat may kinalaman sa international trade, hindi domestic lang.

💡 Simpleng Paliwanag
Bago makapasok o makaalis ang isang barko o eroplano na galing o papuntang ibang bansa, kailangan munang dumaan ito sa proseso ng Bureau of Customs — sila ang nagbibigay ng pahintulot kung kailan pwedeng pumasok o umalis ang mga sasakyang ito.

📦 Halimbawa
Bago makapag-dock ang isang cargo ship mula sa Singapore sa Port of Manila, kailangan munang dumaan ito sa proseso ng entrance procedures ng Bureau of Customs. Kapag handa na itong umalis papuntang ibang bansa matapos i-unload ang cargo, kailangan din nitong kumuha ng clearance mula sa Bureau bago makaalis.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na ang lahat ng barko at eroplano na dumadaan sa Pilipinas ay properly monitored, para hindi magamit ang mga ito bilang paraan ng smuggling o iba pang illegal na aktibidad.

⚠️ Dapat Tandaan
Ang saklaw nito ay "engaged in foreign commerce" lang — hindi ito applicable sa purely domestic na biyahe ng barko o eroplano sa loob ng Pilipinas.

🎯 Board Exam Tip
I-note ang dalawang stages: entrance at clearance — parehong kailangan ng customs supervision, hindi lang isa sa dalawa.

❓ Madalas Malito ang Students
Tanong: "Kasama rin ba dito ang domestic flights o inter-island na barko?" Sagot: Batay sa nakasaad sa batas, ang saklaw nito ay "engaged in foreign commerce" — kaya't ang purely domestic na biyahe ay hindi covered ng specific na provision na ito.

🔗 Related Topics
Section 202 (main provision), paragraph (g) — Foreign Mail Supervision.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (f) ng CMTA (Republic Act No. 10863) tungkol sa supervision and control sa entrance at clearance ng vessels at aircraft. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},438:{_label:"paragraph (g) — Supervision of Foreign Mails",title:"Section 202(g): Supervision sa Foreign Mails Para sa Revenue at Anti-Contraband",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagsusupervise at pagkontrol sa pag-handle ng foreign mail na dumarating sa Pilipinas, para sa layuning kolektahin ang revenue at pigilan ang pagpasok ng contraband.

🔍 Breakdown
- Supervision and Control – aktibong pagbabantay sa proseso ng pag-handle ng foreign mail.
- Foreign Mails Arriving in the Philippines – mga sulat, parcel, o package na galing sa ibang bansa.
- Purpose of Collecting Revenues – isa sa dalawang layunin — kolektahin ang tamang duties/taxes mula sa mga naka-mail na goods.
- Preventing the Entry of Contraband – ang pangalawang layunin — pigilan ang pagpasok ng bawal na goods sa pamamagitan ng mail system.

💡 Simpleng Paliwanag
Kahit mail o parcel lang ang paraan ng pagpasok ng goods sa Pilipinas, hindi ito nangangahulugang exempted na ito sa customs supervision — sinisiyasat pa rin ito ng Bureau of Customs, parehong para sa pagkolekta ng tamang bayad at para sa pagpigil ng mga bawal na produkto.

📦 Halimbawa
May isang parcel na dumating mula sa isang online shopping platform sa ibang bansa, naglalaman ng mga gadgets. Bago ito ipadala sa recipient, dumaan muna ito sa Bureau of Customs para masuri kung kailangan bang bayaran ng duties, at para tiyakin na walang bawal na laman ang parcel.

⭐ Bakit Mahalaga Ito?
Sa panahon ng online shopping at e-commerce, dumarami ang goods na pumapasok sa bansa sa pamamagitan ng mail o courier services — kaya mahalaga ang function na ito para hindi maging "loophole" ang mail system para sa smuggling o tax evasion.

⚠️ Dapat Tandaan
May dalawang layunin ang provision na ito: revenue collection AT contraband prevention — parehong mahalaga, hindi lang isa sa dalawa.

🎯 Board Exam Tip
I-relate ito sa modernong context ng e-commerce at online shopping — mahalagang topic ito dahil sa dumaraming parcel na pumapasok sa bansa.

❓ Madalas Malito ang Students
Tanong: "Exempted ba sa customs inspection ang mga personal na parcel o gift mula sa kamag-anak sa abroad?" Sagot: Ang batas mismo ay hindi nagbibigay ng blanket exemption dito — ang lahat ng foreign mail ay subject pa rin sa supervision ng Bureau of Customs, kahit may specific na de minimis rules na maaaring mag-apply depende sa halaga at klase ng laman.

🔗 Related Topics
Section 202 (main provision), paragraph (h) — Supervision of Import/Export Cargoes.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (g) ng CMTA (Republic Act No. 10863) tungkol sa supervision ng foreign mails. I-explain nang simple, magbigay ng practical na halimbawa na may kinalaman sa online shopping o e-commerce parcels, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},439:{_label:"paragraph (h) — Supervision of Import/Export Cargoes",title:"Section 202(h): Supervision sa Lahat ng Import/Export Cargoes sa Piers at Terminal Facilities",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagsusupervise at pagkontrol sa lahat ng import at export cargoes na naka-landed o naka-store sa piers, airports, terminal facilities, kasama ang container yards at freight stations, para sa proteksyon ng government revenue at pagpigil ng contraband.

🔍 Breakdown
- Supervision and Control – aktibong pagbabantay at pagkontrol.
- All Import and Export Cargoes – malawak na saklaw, kasama ang parehong papasok at palabas na kalakal.
- Landed or Stored – kasama ang goods na nasa proseso ng pagbaba (landed) at ang goods na naka-imbak (stored).
- Piers, Airports, Terminal Facilities, Container Yards, Freight Stations – malawak na listahan ng lokasyon kung saan applicable ang supervision.
- For the Protection of Government Revenue and Prevention of Entry of Contraband – dalawang layunin, katulad ng sa paragraph (g).

💡 Simpleng Paliwanag
Saan man naka-landed o naka-store ang import/export cargo — pier man, airport, o container yard — nasa ilalim pa rin ito ng supervision ng Bureau of Customs. Layunin nito ay protektahan ang revenue ng gobyerno at pigilan ang pagpasok ng mga bawal na produkto.

📦 Halimbawa
Sa isang malaking container yard malapit sa Manila International Container Port, dumadaan ang libu-libong container bawat araw. Ang Bureau of Customs ay nagpapanatili ng patuloy na supervision sa buong facility na ito, mula sa pagdating ng containers hanggang sa pag-release nito, para matiyak na walang smuggled o undeclared na goods.

⭐ Bakit Mahalaga Ito?
Malawak ang saklaw ng modernong supply chain — hindi lang sa barko o eroplano mismo, kundi pati na rin sa mga warehouse, container yard, at freight station kung saan pansamantalang naka-imbak ang goods. Kailangan ng comprehensive supervision para hindi magkaroon ng "gaps" sa security.

⚠️ Dapat Tandaan
Malawak ang saklaw ng lokasyon dito — hindi lang "customs office" o "port" kundi pati na rin ang container yards at freight stations, na madalas kalimutan ng mga estudyante.

🎯 Board Exam Tip
I-memorize ang listahan ng lokasyon: piers, airports, terminal facilities, container yards, freight stations — madalas itong specific na tinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Bakit kailangan pa ring i-supervise ang goods kahit naka-store na sa warehouse o container yard, hindi pa naman ito ini-import?" Sagot: Dahil ang goods na "landed or stored" sa mga nasabing facility ay parte pa rin ng customs process — hanggang hindi pa na-release ang goods mula sa customs custody, nasa ilalim pa rin ito ng supervision ng Bureau para maiwasan ang smuggling o iba pang fraud.

🔗 Related Topics
Section 202 (main provision), paragraph (g) — Supervision of Foreign Mails.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (h) ng CMTA (Republic Act No. 10863) tungkol sa supervision ng import/export cargoes sa piers, airports, at terminal facilities. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},440:{_label:"paragraph (i) — Compensation Study",title:"Section 202(i): Compensation Study Para sa mga Empleyado ng Bureau",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pagsasagawa ng compensation study, na may layuning bumuo at magrekomenda sa Pangulo ng isang competitive na compensation at remuneration system, para maakit at mapanatili ang mga highly qualified na personnel, habang tinitiyak din na financially sound at sustainable ang Bureau.

🔍 Breakdown
- Conduct a Compensation Study – pananaliksik tungkol sa sahod at benepisyo ng mga empleyado.
- Developing and Recommending to the President – ang resulta ng study ay ire-recommend sa Pangulo, hindi basta agad ipapatupad.
- Competitive Compensation and Remuneration System – layunin na maging "competitive" ang sweldo kumpara sa ibang trabaho o industriya.
- Attract and Retain Highly Qualified Personnel – dalawang layunin: makakuha ng magagaling na tao AT mapanatili sila sa Bureau.
- Financially Sound and Sustainable – dapat hindi ito magdulot ng financial problem sa Bureau sa hinaharap.

💡 Simpleng Paliwanag
Ang Bureau of Customs ay may tungkuling mag-aral kung paano nila mapapabuti ang sahod at benepisyo ng kanilang mga empleyado, para makakuha at mapanatili sila ng mga magagaling na tao sa trabaho — pero dapat siguraduhing hindi ito magdudulot ng financial problem sa organisasyon sa hinaharap.

📦 Halimbawa
Nagsagawa ang Bureau of Customs ng isang comprehensive na compensation study na nag-compare ng kanilang sahod sa ibang government agencies at pribadong sektor na may katulad na trabaho. Base sa resulta, nag-recommend sila sa Pangulo ng bagong compensation package para sa mga customs examiners at appraisers, para hindi na sila umalis papunta sa mas mataas na sweldo sa ibang trabaho.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para maiwasan ang "brain drain" sa Bureau — kung mababa ang sahod, maaaring mawala ang magagaling na empleyado papunta sa private sector, na negatibo sa efficiency at integridad ng customs operations.

⚠️ Dapat Tandaan
Hindi ito automatic na pagtaas ng sahod — ito ay "study" muna na magre-recommend sa Pangulo, hindi direktang implementasyon.

🎯 Board Exam Tip
Tandaan na ang function na ito ay tungkol sa "human resource" aspect ng Bureau — kaiba ito sa mga ibang function na mas nakatuon sa operations o enforcement.

❓ Madalas Malito ang Students
Tanong: "Ibig sabihin ba nito, otomatikong tataas ang sahod ng mga customs employees?" Sagot: Hindi — ang function na ito ay tungkol sa pagsasagawa ng study at pag-recommend sa Pangulo; ang aktwal na implementasyon ng bagong compensation system ay hiwalay na proseso na hindi awtomatikong nangyayari.

🔗 Related Topics
Section 202 (main provision), Section 200 (Chief Officials).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (i) ng CMTA (Republic Act No. 10863) tungkol sa compensation study para sa mga empleyado ng Bureau of Customs. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang layunin nito na maiwasan ang brain drain, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},441:{_label:"paragraph (j) — Forfeiture Cases",title:"Section 202(j): Exclusive Original Jurisdiction sa Forfeiture Cases",content:`📖 Kahulugan
Isa sa function ng Bureau of Customs ay ang pag-exercise ng exclusive original jurisdiction sa mga forfeiture cases sa ilalim ng CMTA.

🔍 Breakdown
- Exclusive Original Jurisdiction – ang Bureau of Customs lang, hindi ibang korte o ahensya, ang unang may karapatan magdesisyon sa ganitong klaseng kaso.
- Forfeiture Cases – mga kaso kung saan ang goods ay maaaring "i-forfeit" o kunin ng gobyerno dahil sa paglabag sa customs laws (halimbawa, smuggling o hindi pagbabayad ng tamang duties).

💡 Simpleng Paliwanag
Kung may goods na dapat i-forfeit o kunin ng gobyerno dahil sa paglabag sa customs laws, ang Bureau of Customs mismo — hindi ibang regular na korte — ang unang may kapangyarihang magdesisyon dito.

📦 Halimbawa
May isang shipment ng smuggled na sigarilyo na na-intercept sa Port of Subic. Dahil ito ay clear na paglabag sa customs laws, ang Bureau of Customs ang may exclusive original jurisdiction na magdesisyon kung ito ay i-forfeit (kukunin) ng gobyerno, hindi ito dapat unang dalhin sa regular na korte.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng specialized at mabilisang proseso para sa mga forfeiture cases, dahil ang Bureau of Customs ang may technical expertise sa customs matters, kumpara sa regular na korte na maaaring mas mabagal ang proseso.

⚠️ Dapat Tandaan
Ang "exclusive original jurisdiction" ay nangangahulugang doon dapat unang mag-umpisa ang kaso — pero maaari pa ring may appeal process papunta sa mas mataas na awtoridad, katulad ng nakita sa Section 201(d).

🎯 Board Exam Tip
I-relate ito sa Section 201(d) tungkol sa disputed assessments — parehong may konsepto ng "original jurisdiction" ng Bureau of Customs bago pumunta sa mas mataas na antas ng appeal.

❓ Madalas Malito ang Students
Tanong: "Pwede bang direktang dalhin sa regular na korte ang isang forfeiture case nang hindi dumadaan sa Bureau of Customs?" Sagot: Batay sa "exclusive original jurisdiction" na nakasaad sa batas, ang Bureau of Customs ang dapat unang magkaroon ng hurisdiksyon sa ganitong kaso, hindi pwedeng laktawan ito papuntang regular na korte.

🔗 Related Topics
Section 202 (main provision), Section 201(d) — Review of Disputed Assessments.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (j) ng CMTA (Republic Act No. 10863) tungkol sa exclusive original jurisdiction ng Bureau of Customs sa forfeiture cases. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 201(d), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},442:{_label:"paragraph (k) — Enforcement",title:"Section 202(k): Enforcement ng CMTA at Ibang Customs-Related Laws",content:`📖 Kahulugan
Ang huling function na nakalista sa Section 202 ay ang pagpapatupad (enforcement) ng CMTA mismo, kasama ang lahat ng ibang batas, rules, at regulations na may kinalaman sa customs administration.

🔍 Breakdown
- Enforcement – ang aktwal na pagpapatupad ng batas, hindi lang basta pag-alam dito.
- This Act – tumutukoy sa CMTA (Republic Act No. 10863) mismo.
- All Other Laws, Rules and Regulations Related to Customs Administration – malawak na saklaw, kasama ang ibang batas na may kinalaman sa customs, hindi lang ang CMTA.

💡 Simpleng Paliwanag
Ito ang "catch-all" enforcement function ng Bureau of Customs — hindi lang CMTA ang kanilang ipinapatupad, kundi pati na rin ang lahat ng ibang batas, rules, at regulations na may koneksyon sa customs administration.

📦 Halimbawa
Bukod sa CMTA, ang Bureau of Customs ay nagpapatupad din ng ibang batas tulad ng Intellectual Property Code (para sa border enforcement ng IP rights) at Dangerous Drugs Act (para sa pagpigil ng pagpasok ng illegal drugs) — lahat ito ay bahagi ng malawak na enforcement function nila.

⭐ Bakit Mahalaga Ito?
Ipinapakita nito na ang Bureau of Customs ay hindi lang nagpapatupad ng isang batas — sila ay isang malawak na enforcement agency na sumasaklaw sa maraming aspeto ng border control at trade regulation.

⚠️ Dapat Tandaan
Ang "enforcement" function na ito ay ang buod ng lahat ng naunang nakalistang functions (paragraphs a-j) — ito ang pangkalahatang basehan kung bakit umiiral ang lahat ng ibang specific na tungkulin ng Bureau.

🎯 Board Exam Tip
Tandaan na ito ang "summary" o pangkalahatang enforcement mandate ng Bureau — konektado ito sa halos lahat ng ibang paragraphs sa Section 202.

❓ Madalas Malito ang Students
Tanong: "Bakit kailangan pa ng separate na paragraph para sa enforcement, hindi ba kasama na ito sa mga naunang function?" Sagot: Ang paragraph (k) ay nagsisilbing broad, catch-all na basehan ng enforcement authority ng Bureau — sinisiguro nito na anumang customs-related na batas, kahit hindi direktang bahagi ng CMTA, ay maipapatupad pa rin ng Bureau of Customs.

🔗 Related Topics
Section 202 (main provision), paragraphs (a) hanggang (j).`,prompt:'Ipaliwanag mo nang mas detalyado ang Section 202, paragraph (k) ng CMTA (Republic Act No. 10863) tungkol sa enforcement ng CMTA at ibang customs-related laws. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit ito ang "summary" na provision ng Section 202, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante.'},443:{_label:"section 203 — Annual Report of the Commissioner",title:"Section 203: Ang Taunang Ulat ng Commissioner",content:`📖 Kahulugan
Ang Section 203 ay nag-oobliga sa Commissioner na magsumite ng annual report tungkol sa performance ng Bureau of Customs, na dapat matanggap ng Pangulo, ng Kongreso ng Pilipinas, at ng NEDA, on or before March 31 ng sumunod na taon.

🔍 Breakdown
- Submit an Annual Report – taunang obligasyon ng Commissioner na mag-report.
- On the Performance of the Bureau – ang laman ng report ay tungkol sa kung paano naganap ang mga operations ng Bureau.
- To the President, the Congress of the Philippines and the NEDA – tatlong recipient ng report, para sa accountability at transparency.
- On or Before March 31 of the Following Year – malinaw na deadline — halimbawa, ang report para sa 2025 ay dapat isumite on or before March 31, 2026.

💡 Simpleng Paliwanag
Bawat taon, obligado ang Commissioner na gumawa ng isang "report card" tungkol sa performance ng Bureau of Customs, at ipasa ito sa Pangulo, sa Kongreso, at sa NEDA — hindi lalampas sa March 31 ng susunod na taon.

📦 Halimbawa
Matapos ang fiscal year 2025, kinailangan ng Commissioner ng Bureau of Customs na maghanda ng comprehensive annual report tungkol sa revenue collection, anti-smuggling operations, at ibang performance indicators ng Bureau, at isumite ito sa Pangulo, Kongreso, at NEDA nang hindi lalampas sa March 31, 2026.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa transparency at accountability — sa pamamagitan ng annual report, nasusubaybayan ng mga mambabatas at ng Pangulo kung epektibo ba ang Bureau of Customs sa kanilang mandato, at kung may mga aspeto na kailangang pagbutihin.

⚠️ Dapat Tandaan
Mahigpit ang deadline na March 31 ng SUSUNOD na taon — hindi ito basta "end of year" kundi specific na petsa sa unang quarter ng susunod na taon.

🎯 Board Exam Tip
I-memorize ang eksaktong deadline (March 31) at ang tatlong recipient ng report (President, Congress, NEDA) — madalas itong specific na tinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kailan dapat isumite ang annual report para sa taong 2025?" Sagot: Dapat itong isumite on or before March 31, 2026 — ang report ay para sa nakaraang taon, pero isinusumite ito sa unang quarter ng susunod na taon.

🔗 Related Topics
Section 200 (Chief Officials), Section 202 (Functions of the Bureau), NEDA.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 203 ng CMTA (Republic Act No. 10863) tungkol sa Annual Report of the Commissioner. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang kahalagahan nito para sa transparency at accountability, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},444:{_label:"section 204 — Promulgation of Rules and Regulations",title:"Section 204: Paggawa ng Rules and Regulations ng Commissioner",content:`📖 Kahulugan
Ang Section 204 ay nagbibigay sa Commissioner ng kapangyarihang mag-promulgate ng rules and regulations para sa pagpapatupad ng CMTA, subject sa approval ng Secretary of Finance. Kailangan din niyang regular na maghanda at maglathala ng isang updated na customs manual, at bigyan ng electronic copies ang Kongreso, NEDA, at Tariff Commission ng mga department orders, administrative orders, circulars, at rules and regulations.

🔍 Breakdown
- Promulgate Rules and Regulations – ang paggawa ng opisyal na implementing rules para sa CMTA.
- Subject to the Approval of the Secretary of Finance – hindi pwedeng mag-isa lang ang Commissioner — kailangan ng pag-apruba mula sa Secretary of Finance.
- Regularly Prepare and Publish an Updated Customs Manual – obligasyon na panatilihing updated ang comprehensive na manual ng customs rules.
- Furnish Congress, NEDA, and Tariff Commission with Electronic Copies – transparency requirement — dapat ibigay sa tatlong specific na institusyon ang mga bagong regulations.

💡 Simpleng Paliwanag
Ang Commissioner ang may tungkuling gumawa ng mga detalyadong rules para maipatupad nang maayos ang CMTA, pero kailangan munang aprubahan ito ng Secretary of Finance. Dapat din niyang panatilihing updated ang "reference manual" ng customs rules, at ibahagi ang mga bagong regulations sa Kongreso, NEDA, at Tariff Commission.

📦 Halimbawa
Matapos ang pag-apruba ng isang bagong Customs Administrative Order (CAO) tungkol sa e-commerce imports, kinailangan munang aprubahan ito ng Secretary of Finance bago ito ipinatupad. Matapos ito, kinailangan ding i-update ng Bureau of Customs ang kanilang customs manual, at bigyan ng electronic copy ang Kongreso, NEDA, at Tariff Commission ng bagong CAO na ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa checks and balance — hindi basta-basta makakagawa ng bagong rules ang Commissioner nang walang oversight, at tinitiyak din nito na updated at accessible ang mga customs rules sa mga concerned government institutions.

⚠️ Dapat Tandaan
Ang power na mag-promulgate ng rules and regulations ay isa sa tatlong NON-DELEGABLE powers ng Commissioner (base sa Section 201(e)) — hindi ito puwedeng ipasa sa ibang customs officer.

🎯 Board Exam Tip
I-connect ito sa Section 201(e) — ang promulgation of rules and regulations ay laging binabanggit bilang isa sa mga hindi puwedeng i-delegate na powers ng Commissioner.

❓ Madalas Malito ang Students
Tanong: "Pwede bang mag-isa lang gumawa ng bagong customs rules ang Commissioner?" Sagot: Hindi — kahit siya ang gumagawa nito, kailangan pa rin niyang dumaan sa approval ng Secretary of Finance bago maipatupad ang bagong rules and regulations.

🔗 Related Topics
Section 201(e) — Non-Delegable Powers, Section 205 (Copies of Goods Declaration), CAO 02-2024, CAO 07-2019.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 204 ng CMTA (Republic Act No. 10863) tungkol sa Promulgation of Rules and Regulations. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 201(e) tungkol sa non-delegable powers, banggitin ang CAO 02-2024 at CAO 07-2019, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},445:{_label:"section 205 — Copies of Goods Declaration",title:"Section 205: Pagbibigay ng Copies ng Goods Declaration sa Ibang Ahensya",content:`📖 Kahulugan
Ang Section 205 ay nag-oobliga sa Commissioner na regular na bigyan ng electronic copies ang NEDA, Philippine Statistics Authority (PSA), Bureau of Internal Revenue (BIR), at Tariff Commission ng lahat ng customs goods declaration na naproseso at na-clear ng Bureau. Bukod dito, may karapatan din ang Tariff Commission na humingi at matanggap ang copies ng liquidated goods declaration at ibang supporting documents na na-file sa Commission on Audit (COA).

🔍 Breakdown
- Regularly Furnish – dapat regular, hindi paminsan-minsan lang, ang pagbibigay ng impormasyon.
- NEDA, PSA, BIR, and Tariff Commission – apat na government agencies na dapat regular na tumatanggap ng electronic copies.
- Electronic Copies of All Customs Goods Declaration – malawak na saklaw — lahat ng na-clear na declaration, hindi lang piling sample.
- Upon Request, Tariff Commission Access to Liquidated Goods Declaration – karagdagang karapatan ng Tariff Commission na humingi ng access sa mga liquidated (fully settled) na declaration na naka-file sa COA.
- Maintain Electronic Records – obligasyon ng Bureau na panatilihing naka-imbak sa electronic form ang mga declaration at supporting documents.

💡 Simpleng Paliwanag
Ang Bureau of Customs ay hindi lang nag-iimbak ng data para sa sarili nilang gamit — obligado silang ibahagi ang impormasyon tungkol sa mga na-clear na shipment sa ibang government agencies tulad ng NEDA (para sa economic planning), PSA (para sa statistics), BIR (para sa tax purposes), at Tariff Commission (para sa tariff-related studies).

📦 Halimbawa
Bawat buwan, ang Bureau of Customs ay nagpapadala ng electronic data ng lahat ng na-process na goods declaration sa NEDA para gamitin sa economic planning, sa PSA para sa trade statistics, at sa BIR para sa tax reconciliation. Kung kailangan ng Tariff Commission ng mas detalyadong impormasyon tungkol sa isang partikular na liquidated declaration na naka-file na sa COA, maaari nila itong hingin at dapat ibigay ito ng Bureau.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa inter-agency coordination at data-driven na policy-making — ang impormasyon mula sa customs declarations ay mahalaga hindi lang para sa Bureau of Customs, kundi pati na rin para sa economic planning, statistics, at tax administration ng buong gobyerno.

⚠️ Dapat Tandaan
Mayroong dalawang klase ng data-sharing dito: (1) regular/automatic na pagbibigay ng copies sa apat na agencies, at (2) request-based na access ng Tariff Commission sa mas detalyadong liquidated declarations sa COA.

🎯 Board Exam Tip
I-memorize ang apat na regular recipient (NEDA, PSA, BIR, Tariff Commission) at ang karagdagang special access ng Tariff Commission sa COA records — madalas itong pinagsasama sa exam.

❓ Madalas Malito ang Students
Tanong: "Pareho ba ang access ng apat na agencies sa customs data?" Sagot: Hindi eksakto — lahat sila ay regular na tumatanggap ng electronic copies ng goods declaration, pero ang Tariff Commission lang ang may karagdagang karapatan na humingi ng access sa liquidated goods declaration at supporting documents na naka-file sa COA.

🔗 Related Topics
Section 204 (Promulgation of Rules and Regulations), Section 202(a) — Assessment and Collection.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 205 ng CMTA (Republic Act No. 10863) tungkol sa Copies of Goods Declaration na ibinabahagi sa NEDA, PSA, BIR, at Tariff Commission. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang karagdagang access ng Tariff Commission sa COA records, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},447:{_label:"section 206 — Customs Districts",title:"Section 206: Ano ang Customs Districts at Sino ang Namumuno Dito?",content:`📖 Kahulugan
Ang Section 206 ay tungkol sa paghahati ng Pilipinas sa maraming Customs Districts para sa administrative purposes. Ang bilang at limitasyon ng bawat district ay maaaring baguhin ng Commissioner, basta't may approval ito ng Secretary of Finance. Bawat district ay may isang District Collector bilang pinuno, tinutulungan ng mga Deputy District Collectors.

🔍 Breakdown
- Customs Districts – ang paghahati ng bansa sa iba't ibang administrative zones para sa customs purposes.
- As Many as Necessary – flexible ang bilang, depende sa pangangailangan.
- Changed from Time to Time by the Commissioner, with Approval of the Secretary of Finance – may authority ang Commissioner na baguhin ang mga limitasyon, pero kailangan ng approval.
- One (1) District Collector per District – bawat district ay may isang pinunong opisyal.
- Deputy District Collectors – katulong ng District Collector, ang bilang ay depende sa pangangailangan.
- Location, Business Hours, Staffing Pattern Based on Particular Requirements – flexible din ang operational details ng bawat district office.

💡 Simpleng Paliwanag
Hinahati ng Bureau of Customs ang buong Pilipinas sa iba't ibang "zones" o districts para mas madaling ma-manage ang customs operations sa iba't ibang lugar. Bawat district ay may sariling "puno" (District Collector), at ang detalye ng operations nito — saan ang office, anong oras bukas — ay depende sa specific na pangangailangan ng bawat lugar.

📦 Halimbawa
Dahil sa dami ng trade activity sa Mindanao, maaaring i-adjust ng Commissioner (na may approval ng Secretary of Finance) ang jurisdictional limits ng Customs District ng Zamboanga o Cagayan de Oro, para mas maayos na masakop ang lumalaking volume ng imports at exports sa lugar.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ito ang basic administrative structure na nagpapahintulot sa Bureau of Customs na epektibong mag-manage ng customs operations sa buong bansa, sa halip na iisang central office lang ang humahawak ng lahat.

⚠️ Dapat Tandaan
Hindi kayang mag-isa ang Commissioner na baguhin ang district boundaries — kailangan pa rin ng approval mula sa Secretary of Finance.

🎯 Board Exam Tip
I-relate ito sa Section 207 (Ports of Entry) — magkaugnay ang dalawang konsepto dahil ang mga ports of entry ay nasa ilalim ng supervision ng mga Customs Districts.

❓ Madalas Malito ang Students
Tanong: "Fixed ba ang bilang ng Customs Districts sa Pilipinas?" Sagot: Hindi — malinaw sa batas na ito ay "as many as necessary," ibig sabihin flexible ito at maaaring baguhin ng Commissioner (na may approval ng Secretary of Finance) depende sa pangangailangan.

🔗 Related Topics
Section 207 (Ports of Entry), Section 210 (Duties of the District Collector), CAO 04-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 206 ng CMTA (Republic Act No. 10863) tungkol sa Customs Districts. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 207 at 210, banggitin ang CAO 04-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},448:{_label:"section 207 — Ports of Entry",title:"Section 207: Ang mga Opisyal na Ports of Entry sa Pilipinas",content:`📖 Kahulugan
Ang Section 207 ay naglilista ng mga opisyal na ports of entry sa Pilipinas, na nasa ilalim ng supervision at control ng kani-kanilang Customs District. May District Collector na naka-assign sa mga principal ports, habang Deputy District Collector naman ang pwedeng i-assign sa ibang klase ng ports.

🔍 Breakdown
- Ports of Entry – ang opisyal na lugar kung saan pwedeng pumasok o lumabas ang mga imported/exported goods.
- Under Supervision and Control of a Customs District – bawat port ay konektado sa isang specific na Customs District.
- District Collector for Principal Ports; Deputy District Collector for Other Ports – iba't ibang antas ng opisyal depende sa klase ng port.
- List of Principal Ports – kasama dito ang Aparri, San Fernando, Manila, MICP, NAIA, Subic, Clark, Batangas, Legaspi, Iloilo, Cebu, Tacloban, Surigao, Cagayan de Oro, Zamboanga, Davao, at Limay.
- Provision of Suitable Areas – obligado ang mga sea port at airport authorities, kasama ang private operators, na magbigay ng lugar para sa customs examination at equipment nang walang bayad, sa loob ng napagkasunduang panahon.

💡 Simpleng Paliwanag
Hindi basta kahit saang daungan o airport pwedeng magpasok o maglabas ng goods — dapat ito ay isa sa mga opisyal na "ports of entry" na nakalista sa batas. Bawat isa sa mga port na ito ay may nakatalagang customs official, at obligado ang mga port/airport operators na magbigay ng libreng lugar para sa customs inspection.

📦 Halimbawa
May isang shipping company na nagpaplano magpasok ng cargo sa Pilipinas. Dapat nilang piliin na sa isa sa mga listadong principal ports — tulad ng Manila International Container Port o Subic — sila magdo-dock, dahil ito ang mga opisyal na entry point na may nakatalagang District Collector at kumpletong customs facilities.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na organized at controlled ang lahat ng entry at exit points ng goods sa Pilipinas — hindi basta kahit saan pwedeng magdaan ang mga shipment, para mas madaling ma-monitor at ma-secure ang border.

⚠️ Dapat Tandaan
Mahalagang tandaan na ang listahan ng principal ports ay hindi "fixed forever" — malinaw sa batas na maaari pang magkaroon ng ibang ports na malikha sa hinaharap "pursuant to this Act."

🎯 Board Exam Tip
I-memorize ang listahan ng principal ports of entry — madalas itong direktang tinatanong sa exam, kaya kabisaduhin ang mga pangalan.

❓ Madalas Malito ang Students
Tanong: "Parehas ba lahat ng ports of entry sa klase ng opisyal na naka-assign?" Sagot: Hindi — ang principal ports ay may District Collector na naka-assign, habang ang ibang klase ng ports ay maaaring Deputy District Collector na lang ang mamuno.

🔗 Related Topics
Section 206 (Customs Districts), Section 208 (Power of the President to Open and Close Any Port).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 207 ng CMTA (Republic Act No. 10863) tungkol sa Ports of Entry. I-explain nang simple, ilista ang mga principal ports, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 206 at 208, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},449:{_label:"section 208 — Power of the President to Open and Close Any Port",title:"Section 208: Kapangyarihan ng Pangulo na Magbukas o Magsara ng Port",content:`📖 Kahulugan
Ang Section 208 ay nagbibigay sa Pangulo ng Pilipinas ng kapangyarihang magbukas o magsara ng anumang port of entry, base sa rekomendasyon ng Secretary of Finance. Kapag may isinarang port, ang mga umiiral na personnel doon ay ire-reassign ng Commissioner, na may approval din ng Secretary of Finance.

🔍 Breakdown
- Upon Recommendation of the Secretary of Finance – hindi basta desisyon lang ng Pangulo, kundi kailangan munang irekomenda ito ng Secretary of Finance.
- President May Open or Close Any Port of Entry – ang Pangulo ang may final na kapangyarihan na magdesisyon.
- Upon Closure, Personnel Shall Be Reassigned – hindi basta natatanggal ang mga empleyado kapag nagsara ang isang port — sila ay ire-reassign.
- By the Commissioner, Subject to Approval of the Secretary of Finance – ang Commissioner ang gagawa ng reassignment, pero kailangan pa rin ng approval.

💡 Simpleng Paliwanag
Ang Pangulo ang may huling desisyon kung magbubukas o magsasara ng isang customs port, pero hindi siya basta-basta gagawa nito — kailangan munang may rekomendasyon mula sa Secretary of Finance. At kung may isasarang port, hindi mawawalan ng trabaho ang mga empleyado — sila ay ililipat na lang sa ibang assignment.

📦 Halimbawa
Dahil sa pagbaba ng trade volume sa isang minor port sa Northern Luzon, nagrekomenda ang Secretary of Finance sa Pangulo na isara na lang ang port na ito para maging mas efficient ang resources ng Bureau. Pagkatapos aprubahan ng Pangulo ang closure, ang mga customs officer na naka-assign doon ay ire-reassign ng Commissioner sa ibang customs district, na may approval din ng Secretary of Finance.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng flexibility sa gobyerno na i-adjust ang customs infrastructure base sa nagbabagong pangangailangan ng trade at ekonomiya, habang pinoprotektahan pa rin ang mga empleyadong apektado ng pagsasara ng isang port.

⚠️ Dapat Tandaan
Hindi maaaring direktang magsara o magbukas ng port ang Secretary of Finance mag-isa — sila ay nagrerekomenda lang, ang Pangulo pa rin ang may final decision.

🎯 Board Exam Tip
Tandaan ang "chain of authority" dito: Secretary of Finance (recommends) → President (decides) → Commissioner (implements reassignment, with SOF approval).

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari sa mga empleyado kapag nagsara ang isang port?" Sagot: Malinaw sa batas na sila ay ire-reassign ng Commissioner (na may approval ng Secretary of Finance) — hindi sila basta matatanggal sa trabaho dahil lang sa pagsara ng port.

🔗 Related Topics
Section 207 (Ports of Entry), Section 206 (Customs Districts).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 208 ng CMTA (Republic Act No. 10863) tungkol sa kapangyarihan ng Pangulo na magbukas o magsara ng port of entry. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang chain of authority sa pagitan ng Secretary of Finance, Pangulo, at Commissioner, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},450:{_label:"section 209 — Assignment of Customs Officers and Employees to Other Duties",title:"Section 209: Pag-assign ng Customs Officers sa Ibang Tungkulin",content:`📖 Kahulugan
Ang Section 209 ay nagbibigay sa Commissioner ng kapangyarihan, na may approval ng Secretary of Finance, na mag-assign ng kahit sinong empleyado ng Bureau sa ibang port, service, division, o office sa loob ng staffing pattern o organizational structure ng Bureau, o mag-assign ng ibang tungkulin — basta't hindi ito makakaapekto sa tenure, status, rank, o sahod ng empleyado.

🔍 Breakdown
- Commissioner, with Approval of the Secretary of Finance – parehong may kasamang approval requirement, katulad ng ibang assignment powers.
- Assign Any Employee to Any Port, Service, Division or Office – malawak na saklaw ng puwedeng i-reassign.
- Within the Bureau's Staffing Pattern or Organizational Structure – dapat pa rin ito nasa loob ng officially approved na structure ng Bureau.
- May Assign Other Duties – hindi lang lokasyon, kundi pati tungkulin, pwedeng baguhin.
- Provided, That Such Assignment Shall NOT: Affect Tenure, Change Status, Demote Rank, or Deduct Salary – mahigpit na proteksyon para sa mga empleyado.

💡 Simpleng Paliwanag
May kapangyarihan ang Commissioner na ilipat ang mga empleyado ng Bureau of Customs sa ibang assignment o bigyan sila ng ibang tungkulin, basta't may approval ito ng Secretary of Finance. Pero may proteksyon ang mga empleyado — hindi puwedeng gamitin ang ganitong reassignment para parusahan sila sa pamamagitan ng pagbaba ng ranggo, sahod, o pagbago ng kanilang employment status.

📦 Halimbawa
Dahil sa pangangailangan sa isang bagong customs facility sa Clark, inassign ng Commissioner (na may approval ng Secretary of Finance) ang isang senior customs examiner mula sa Manila papuntang Clark para tumulong sa bagong operations. Dahil hindi naman nagbago ang ranggo, sahod, o employment status ng examiner, legal at valid ang ganitong reassignment sa ilalim ng Section 209.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa Bureau of Customs na epektibong i-deploy ang kanilang manpower base sa pangangailangan ng iba't ibang lugar o operations, habang pinoprotektahan pa rin ang mga karapatan ng mga empleyado laban sa arbitrary o punitive na reassignment.

⚠️ Dapat Tandaan
Ang proteksyon na "no demotion, no salary deduction, no change of status" ay mahalagang safeguard — kung ang isang reassignment ay lumalabag dito, maaari itong ma-question bilang illegal.

🎯 Board Exam Tip
I-memorize ang apat na proteksyon ng empleyado: (1) hindi maaapektuhan ang tenure, (2) walang pagbabago sa status, (3) walang demotion sa rank, (4) walang salary deduction.

❓ Madalas Malito ang Students
Tanong: "Pwede bang gamitin ang reassignment power na ito para 'parusahan' ang isang empleyadong hindi kagustuhan ng superior?" Sagot: Hindi dapat — malinaw sa batas na ang assignment ay hindi dapat makaapekto sa tenure, status, rank, o sahod ng empleyado; kung ang reassignment ay ginamit bilang punitive measure na lumalabag sa mga proteksyong ito, maaari itong ituring na illegal.

🔗 Related Topics
Section 201(f) — Assignment/Reassignment under Commissioner's Powers, Section 206 (Customs Districts).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 209 ng CMTA (Republic Act No. 10863) tungkol sa assignment ng customs officers sa ibang duties. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang mga proteksyon ng empleyado, banggitin ang koneksyon nito sa Section 201(f), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},451:{_label:"section 210 — Duties of the District Collector",title:"Section 210: Ang mga Tungkulin ng District Collector",content:`📖 Kahulugan
Ang Section 210 ay naglilista ng mga pangunahing tungkulin ng District Collector sa loob ng kanyang assigned Customs District. Ang mga tungkuling ito ay maaari ding i-delegate sa Deputy District Collector, subject pa rin sa supervision at control ng District Collector.

🔍 Breakdown
Ang Section 210 ay ang "main provision" na nagbubukas sa listahan ng walong (8) specific na duties (paragraphs 1-8), mula sa pagtiyak ng entry ng imported goods hanggang sa pagpigil ng smuggling. May dagdag na detalye rin dito tungkol sa delegation ng duties sa Deputy District Collector, at ang supervisory relationship sa pagitan ng Deputy District Collector ng sub-port at ng District Collector ng principal port.

💡 Simpleng Paliwanag
Ang District Collector ang "puno" ng bawat Customs District, at siya ang responsable sa halos lahat ng customs operations sa kanyang lugar — mula sa pagsuri ng goods hanggang sa pangongolekta ng duties. Pwede niyang ipasa ang ibang tungkulin sa kanyang Deputy, pero siya pa rin ang may overall na responsibilidad.

📦 Halimbawa
Sa Port of Cebu, ang District Collector ang namumuno sa lahat ng customs operations — mula sa pag-assess ng duties ng mga imported goods, hanggang sa pagpigil ng smuggling sa kanilang jurisdiction. Maaari niyang ipasa ang ilang specific na tungkulin, tulad ng pang-araw-araw na examination ng goods, sa kanyang Deputy District Collector, pero siya pa rin ang overall responsible sa buong operations.

⭐ Bakit Mahalaga Ito?
Mahalagang maintindihan ito ng mga customs students dahil ang District Collector ang "frontline" na opisyal na direktang nakikitungo sa mga importer, exporter, at customs broker sa araw-araw na operations.

⚠️ Dapat Tandaan
Ang Deputy District Collector na naka-assign sa isang sub-port ay nasa ilalim pa rin ng supervision at control ng District Collector ng kaukulang principal port — may clear hierarchy.

🎯 Board Exam Tip
I-memorize ang walong (8) duties sa paragraphs (1-8) — grupohin sa mga temang katulad ng entry control, prohibition enforcement, valuation, revenue collection, at anti-smuggling para mas madaling matandaan.

❓ Madalas Malito ang Students
Tanong: "Pwede bang gawin ng Deputy District Collector ang lahat ng duties ng District Collector?" Sagot: Oo, sa pamamagitan ng delegation, pero ito ay "subject to the supervision and control of the District Collector" — hindi ibig sabihin independent at hiwalay na authority ang Deputy District Collector.

🔗 Related Topics
Paragraphs (1) hanggang (8) ng Section 210, Section 211 (Temporary Succession), CMO 31-2018.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210 ng CMTA (Republic Act No. 10863) tungkol sa Duties of the District Collector. I-explain nang simple ang overview ng walong duties, magbigay ng practical na halimbawa, ipaliwanag ang delegation sa Deputy District Collector, banggitin ang CMO 31-2018, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},452:{_label:"paragraph (1) — Ensure Entry of Imported Goods",title:"Section 210(1): Pagtiyak ng Entry ng Lahat ng Imported Goods sa Customs Office",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pagtiyak na ang lahat ng imported goods ay pumapasok o na-eenter sa customs office.

🔍 Breakdown
- Ensure Entry – aktibong tungkulin na siguraduhin, hindi lang basic monitoring.
- All Imported Goods – walang exception, dapat lahat ng imported goods ay dumadaan sa proseso.
- At the Customs Office – dapat sa tamang opisyal na customs office dumadaan ang entry.

💡 Simpleng Paliwanag
Tungkulin ng District Collector na siguraduhing walang goods na "nakakalusot" nang hindi dumadaan sa tamang proseso ng customs entry — lahat ng imported goods sa kanyang district ay dapat na maayos na naipasok sa sistema.

📦 Halimbawa
Sa Port of Batangas, tinitiyak ng District Collector na lahat ng papasok na shipment — maging malaki mang cargo ship o maliit na parcel — ay dumadaan sa tamang proseso ng entry sa customs office, para walang goods na makakapasok nang hindi naiproseso.

⭐ Bakit Mahalaga Ito?
Ito ang foundational duty na nagtitiyak na napapanatili ang integridad ng buong customs system — kung walang tamang entry control, magiging madali ang smuggling at iba pang illegal na aktibidad.

⚠️ Dapat Tandaan
Walang exception ang salitang "all" — kahit maliit na shipment, dapat pa rin dumaan sa tamang entry process.

🎯 Board Exam Tip
Tandaan ito bilang "foundational" duty — ito ang unang hakbang bago pa man ma-apply ang ibang duties tulad ng examination o assessment.

❓ Madalas Malito ang Students
Tanong: "Ano ang ibig sabihin ng 'entry' dito, kasama ba ito sa Section 115 na pinag-usapan noon?" Sagot: Oo, konektado ito sa konsepto ng "entered" sa Section 115 — ang District Collector ang may tungkuling tiyakin na maayos na naisasagawa ang proseso ng pag-enter ng goods sa customs office.

🔗 Related Topics
Section 210 (main provision), Section 115 (Treatment of Importation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (1) ng CMTA (Republic Act No. 10863) tungkol sa pagtiyak ng entry ng imported goods sa customs office. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 115, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},453:{_label:"paragraph (2) — Prevent Prohibited Importation/Exportation",title:"Section 210(2): Pagpigil sa Importasyon at Exportasyon ng Prohibited Goods",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pagpigil sa importasyon at exportasyon ng mga prohibited goods.

🔍 Breakdown
- Prevent – proactive na tungkulin, hindi lang basta reaction pagkatapos mangyari.
- Importation and Exportation – parehong papasok at palabas na direksyon ay covered.
- Prohibited Goods – tumutukoy sa mga goods na nakalista sa Section 118, tulad ng seditious materials, obscene content, at infringing goods.

💡 Simpleng Paliwanag
Direkta itong konektado sa Section 118 — tungkulin ng District Collector na aktibong pigilan ang pagpasok o paglabas ng mga bagay na talagang bawal, tulad ng mga prohibited goods na natutunan na natin dati.

📦 Halimbawa
Sa Port of Manila, natuklasan ng customs examiner na may nakatagong shipment ng counterfeit branded goods (na infringing goods sa ilalim ng Section 118). Bilang bahagi ng kanyang tungkulin sa ilalim ng Section 210(2), inutusan ng District Collector na i-seize ang shipment para mapigilan ang pagpasok nito sa bansa.

⭐ Bakit Mahalaga Ito?
Direktang ipinapatupad ng District Collector ang prohibition list sa Section 118 sa kanyang district — kritikal ito para sa national security, public health, at proteksyon ng intellectual property rights.

⚠️ Dapat Tandaan
I-connect ang duty na ito sa specific list sa Section 118 — hindi general prohibition lang ito, kundi implementasyon ng specific na batas.

🎯 Board Exam Tip
I-relate ang paragraph (2) sa Section 118 (Prohibited Importation and Exportation) — ang District Collector ang "enforcer" ng batas na ito sa ground level.

❓ Madalas Malito ang Students
Tanong: "Ano ang pagkakaiba ng duty na ito (paragraph 2) sa duty ng paragraph (3) tungkol sa regulated goods?" Sagot: Magkaiba ang saklaw — ang paragraph (2) ay tungkol sa PROHIBITED goods (Section 118, ganap na bawal), habang ang paragraph (3) ay tungkol sa REGULATED goods (Section 117, kailangan lang ng tamang clearance/permit).

🔗 Related Topics
Section 210 (main provision), Section 118 (Prohibited Importation and Exportation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (2) ng CMTA (Republic Act No. 10863) tungkol sa pagpigil sa importasyon at exportasyon ng prohibited goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 118, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},454:{_label:"paragraph (3) — Legal Compliance of Regulated Goods",title:"Section 210(3): Pagtiyak ng Legal Compliance ng Regulated Goods",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pagtiyak ng legal compliance ng mga regulated goods, habang pinapadali rin ang daloy ng legitimate na trade.

🔍 Breakdown
- Ensure Legal Compliance of Regulated Goods – tinitiyak na ang mga regulated goods (mula Section 117) ay may kumpletong requirements bago pumasok o lumabas.
- Facilitate the Flow of Legitimate Trade – hindi lang "enforcement" ang focus, kundi pati na rin ang pagpapadali ng legal na negosyo.

💡 Simpleng Paliwanag
Tungkulin din ng District Collector na tiyakin na ang mga regulated goods — tulad ng gamot o kemikal — ay may tamang permit at clearance bago pumasok o lumabas sa bansa, habang sabay na ginagawang mabilis at madali ang proseso para sa mga legitimate na negosyante.

📦 Halimbawa
May isang pharmaceutical importer sa Port of Iloilo na nag-import ng regulated na gamot. Tinitiyak ng District Collector na kumpleto ang FDA clearance ng shipment bago ito i-release, pero ginagawa rin niya itong mabilis at hindi nakaka-delay sa negosyo ng legitimate na importer.

⭐ Bakit Mahalaga Ito?
Mahalaga ang balance na ito — hindi lang basta enforcement ang trabaho ng District Collector, kundi pati na rin ang pagtiyak na hindi nahihirapan ang mga legitimate na negosyante dahil sa masyadong mahigpit na proseso.

⚠️ Dapat Tandaan
May dalawang parte ang duty na ito: (1) legal compliance enforcement, at (2) trade facilitation — parehong mahalaga, hindi lang isa sa dalawa.

🎯 Board Exam Tip
I-relate ito sa Section 117 (Regulated Importation and Exportation) — ang District Collector ang nag-eenforce ng requirements na nakasaad doon.

❓ Madalas Malito ang Students
Tanong: "Pareho ba ito ng duty sa paragraph (2) tungkol sa prohibited goods?" Sagot: Hindi — ang paragraph (3) ay tungkol sa REGULATED goods (may paraan para ma-comply, kailangan lang ng tamang permit), habang ang paragraph (2) ay tungkol sa PROHIBITED goods (walang paraan, talagang bawal).

🔗 Related Topics
Section 210 (main provision), Section 117 (Regulated Importation and Exportation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (3) ng CMTA (Republic Act No. 10863) tungkol sa legal compliance ng regulated goods at trade facilitation. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 117, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},455:{_label:"paragraph (4) — Examine, Classify, Value",title:"Section 210(4): Pag-eeksamin, Pag-classify, at Pag-value ng Imported Goods",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pag-eeksamin, pag-classify, at pag-value ng mga imported goods.

🔍 Breakdown
- Examine – ang physical o dokumentaryong pagsuri sa goods.
- Classify – ang pagtukoy kung anong klase o kategorya ng produkto ang isang goods (mahalaga para sa tamang tariff rate).
- Value – ang pagtukoy ng tamang valuation o halaga ng goods (batayan para sa computation ng duties).

💡 Simpleng Paliwanag
Bago ma-compute ang tamang duties ng isang shipment, kailangan munang suriin ng District Collector (o ng kanyang team) ang goods, tukuyin kung anong klase ito (classification), at tukuyin din ang tamang halaga nito (valuation) — tatlong magkakaugnay na hakbang.

📦 Halimbawa
May dumating na shipment ng imported furniture sa Port of Davao. Bilang bahagi ng kanyang tungkulin, tinitiyak ng District Collector na ma-eeksamin ang goods (physical inspection), ma-classify nang tama (ano bang klase ng furniture — wood, metal, atbp.), at ma-value nang tama (magkano ang declared value kumpara sa market value).

⭐ Bakit Mahalaga Ito?
Ang tamang examination, classification, at valuation ay ang batayan ng tamang pag-compute ng duties at taxes — kung mali ang mga ito, maaaring magkaroon ng underpayment o overpayment ng revenue.

⚠️ Dapat Tandaan
Magkakaugnay ang tatlong proseso na ito — hindi sila independent sa isa't isa; ang classification ay nakakaapekto sa tamang tariff rate, at ang valuation ay ang batayan ng computation.

🎯 Board Exam Tip
I-memorize ang tatlong hakbang: examine → classify → value — ito ang core technical function ng customs assessment process.

❓ Madalas Malito ang Students
Tanong: "Sino talaga ang gumagawa ng examination — ang District Collector mismo?" Sagot: Sa praktika, karaniwang may mga customs examiners at appraisers na gumagawa ng aktwal na inspection, pero ang overall responsibility at supervision ay nasa District Collector, base sa kanyang duty sa ilalim ng Section 210.

🔗 Related Topics
Section 210 (main provision), paragraph (5) — Assessment and Collection of Duties.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (4) ng CMTA (Republic Act No. 10863) tungkol sa pag-eeksamin, pag-classify, at pag-value ng imported goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon ng tatlong proseso, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},456:{_label:"paragraph (5) — Assess and Collect Duties",title:"Section 210(5): Pag-assess at Pangongolekta ng Duties, Taxes, at Charges",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pag-assess at pangongolekta ng duties, taxes, at ibang charges sa mga imported goods.

🔍 Breakdown
- Assess – ang pagtukoy ng tamang halaga ng duties/taxes na dapat bayaran, base sa naunang examination, classification, at valuation.
- Collect – ang aktwal na pangongolekta ng bayad mula sa importer.
- Duties, Taxes and Other Charges – malawak na saklaw, hindi lang basic duties kundi pati na rin ibang klase ng bayarin.

💡 Simpleng Paliwanag
Matapos ma-examine, ma-classify, at ma-value ang goods (paragraph 4), ang susunod na tungkulin ng District Collector ay tukuyin kung magkano ang dapat bayaran (assess) at aktwal na kolektahin ang bayad na iyon (collect) mula sa importer.

📦 Halimbawa
Matapos ma-classify at ma-value ang isang shipment ng imported machinery sa Port of Cebu, kinakalkula ng District Collector ang tamang duties and taxes base sa applicable tariff rate, at kinokolekta ito mula sa importer bago pa man i-release ang shipment.

⭐ Bakit Mahalaga Ito?
Ito ang core revenue-generating function ng District Collector sa kanyang district — direktang nakaka-apekto ito sa kita ng gobyerno mula sa international trade.

⚠️ Dapat Tandaan
Ang assessment at collection ay dalawang magkaibang hakbang — una tinutukoy ang tamang halaga, pagkatapos saka kinokolekta.

🎯 Board Exam Tip
I-relate ito sa paragraph (4) — sunud-sunod na proseso ito: examine/classify/value muna (paragraph 4), tapos assess/collect (paragraph 5).

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung hindi sang-ayon ang importer sa assessment ng District Collector?" Sagot: Base sa naunang natutunan sa Section 201(d), may proseso ng dispute resolution — maaaring i-appeal ang disputed assessment hanggang sa Commissioner, Secretary of Finance, at Court of Tax Appeals kung kinakailangan.

🔗 Related Topics
Section 210 (main provision), paragraph (4) — Examine/Classify/Value, Section 201(d) — Review of Disputed Assessments.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (5) ng CMTA (Republic Act No. 10863) tungkol sa assessment at collection ng duties, taxes, at charges. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa paragraph (4) at Section 201(d), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},457:{_label:"paragraph (6) — Hold and Dispose Goods",title:"Section 210(6): Pag-hawak at Pag-dispose ng Imported Goods",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pag-hawak (hold) at pag-dispose ng imported goods, alinsunod sa mga probisyon ng CMTA.

🔍 Breakdown
- Hold – ang pagpapanatili ng goods sa customs custody, karaniwang habang hinihintay ang completion ng requirements o resolution ng isang dispute.
- Dispose – ang huling pagharap sa goods — maaaring release, forfeiture, o auction, depende sa sitwasyon.
- In Accordance with This Act – dapat sumunod sa mga specific na probisyon ng CMTA, hindi arbitrary na desisyon.

💡 Simpleng Paliwanag
Minsan, hindi agad ma-release ang isang shipment — kailangan munang i-hold ito ng District Collector, halimbawa habang may kulang na requirement o may ongoing na dispute. At kung may goods na hindi na dapat i-release (halimbawa, dahil sa forfeiture), ang District Collector din ang responsable sa tamang pag-dispose nito, base sa nakasaad sa batas.

📦 Halimbawa
May isang shipment sa Port of Legaspi na hinawakan (held) ng District Collector dahil may kulang na supporting documents. Matapos makumpleto ang requirements, na-release ang goods. Sa ibang kaso naman, kung may na-forfeit na goods dahil sa smuggling, ang District Collector ang responsable sa tamang pag-dispose nito, alinsunod sa mga proseso na nakasaad sa CMTA.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa proper na pamamahala ng mga goods na nasa customs custody — tinitiyak nito na may malinaw na proseso kung paano hahawakan at ide-dispose ang mga goods, sa halip na basta na lang mawawala o hindi properly ma-account.

⚠️ Dapat Tandaan
Ang pag-hold at pag-dispose ay dapat sumunod sa mga specific na probisyon ng CMTA — hindi ito basta arbitrary na desisyon ng District Collector.

🎯 Board Exam Tip
I-relate ito sa forfeiture proceedings (Section 202(j)) at ibang related provisions tungkol sa disposal ng goods sa CMTA.

❓ Madalas Malito ang Students
Tanong: "Ano ang ibig sabihin ng 'dispose' dito — ibig bang sabihin laging binebenta o itinatapon ang goods?" Sagot: Hindi laging ganito — ang "dispose" dito ay malawak na termino na maaaring mangahulugan ng release, forfeiture, auction, o ibang klase ng disposition, depende sa specific na probisyon ng CMTA na applicable sa sitwasyon.

🔗 Related Topics
Section 210 (main provision), Section 202(j) — Forfeiture Cases.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (6) ng CMTA (Republic Act No. 10863) tungkol sa pag-hold at pag-dispose ng imported goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa forfeiture proceedings, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},458:{_label:"paragraph (7) — Prevent Smuggling/Customs Fraud",title:"Section 210(7): Pagpigil sa Smuggling at Ibang Customs Fraud",content:`📖 Kahulugan
Isa sa tungkulin ng District Collector ay ang pagpigil sa smuggling at ibang klase ng customs fraud sa kanyang district.

🔍 Breakdown
- Prevent Smuggling – aktibong pagpigil sa illegal na entry o exit ng goods sa kanyang district.
- Other Customs Fraud – malawak na saklaw, kasama ang misdeclaration, undervaluation, at iba pang panloloko.

💡 Simpleng Paliwanag
Parehong function ito ng Section 202(d) (function ng buong Bureau), pero dito ay specific na sa level ng District Collector at sa loob ng kanyang assigned district — siya ang "frontline commander" laban sa smuggling sa kanyang lugar.

📦 Halimbawa
Sa Port of Surigao, natuklasan ng intelligence unit na may grupong gumagamit ng maling classification para makaiwas sa mataas na tariff rate ng isang produkto. Bilang District Collector, tungkulin niyang mag-imbestiga at kumilos laban sa ganitong klase ng customs fraud sa kanyang district.

⭐ Bakit Mahalaga Ito?
Ang District Collector ang direktang responsable sa ground-level implementation ng anti-smuggling efforts — siya ang unang linya ng depensa sa kanyang specific na district.

⚠️ Dapat Tandaan
I-relate ito sa Section 202(d) — pareho ang konsepto, pero ang Section 210(7) ay specific na sa level ng individual na District Collector, habang ang Section 202(d) ay institutional function ng buong Bureau.

🎯 Board Exam Tip
I-connect ang paragraph na ito sa Section 202(c) at (d) — magkakaugnay ang mga konsepto ng border control, smuggling prevention sa iba't ibang level ng organisasyon.

❓ Madalas Malito ang Students
Tanong: "Ano ang pagkakaiba ng duty na ito sa function ng buong Bureau sa Section 202(d)?" Sagot: Magkatulad ang layunin, pero ang Section 210(7) ay specific na tungkulin ng District Collector sa kanyang assigned district, habang ang Section 202(d) ay pangkalahatang function ng buong Bureau of Customs bilang institusyon.

🔗 Related Topics
Section 210 (main provision), Section 202(c) at (d).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (7) ng CMTA (Republic Act No. 10863) tungkol sa pagpigil sa smuggling at customs fraud sa level ng District Collector. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 202(c) at (d), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},459:{_label:"paragraph (8) — Other Necessary Duties",title:"Section 210(8): Iba Pang Tungkulin na Maaaring I-assign ng Commissioner",content:`📖 Kahulugan
Ito ang "catch-all" provision ng Section 210 — dapat ding gampanan ng District Collector ang iba pang kailangang tungkulin na maaaring i-assign ng Commissioner para sa epektibong implementasyon ng CMTA.

🔍 Breakdown
- Perform Other Necessary Duties – malawak na saklaw, hindi limitado sa mga naunang nakalistang duties (paragraphs 1-7).
- Assigned by the Commissioner – dapat mula sa Commissioner ang assignment, hindi basta kahit sino.
- For the Effective Implementation of This Act – palaging nakatutok sa layunin ng epektibong pagpapatupad ng CMTA.

💡 Simpleng Paliwanag
Parang "safety net" din ito, katulad ng nakita natin sa Section 201(g) at 202(k) — kung may bagong tungkulin na hindi direktang covered ng paragraphs (1) hanggang (7), maaaring i-assign ito ng Commissioner sa District Collector, basta't ito ay para sa epektibong implementasyon ng batas.

📦 Halimbawa
Sa panahon ng isang national health emergency, kinailangan ng Commissioner na mag-assign ng bagong tungkulin sa lahat ng District Collectors — ang pagsuri ng health-related documentation para sa mga papasok na shipment. Kahit hindi ito direktang nakasaad sa paragraphs (1-7), valid ito sa ilalim ng paragraph (8) dahil ito ay assignment mula sa Commissioner.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa Commissioner para tumugon sa mga bagong sitwasyon o hamon sa pamamagitan ng pag-assign ng bagong duties sa mga District Collectors, nang hindi na kailangang i-amend pa ang buong batas.

⚠️ Dapat Tandaan
Dapat mula mismo sa Commissioner ang assignment ng bagong duty — hindi puwedeng basta na lang mag-"self-assign" ng bagong tungkulin ang isang District Collector.

🎯 Board Exam Tip
I-relate ito sa katulad na "catch-all" provisions sa Section 201(g) at Section 202(k) — magkatulad ang pattern ng CMTA sa pagbibigay ng flexibility sa iba't ibang antas ng organisasyon.

❓ Madalas Malito ang Students
Tanong: "Sino ang pwedeng mag-assign ng bagong duty sa District Collector sa ilalim ng paragraph (8)?" Sagot: Malinaw sa batas na ang Commissioner lang ang may ganitong authority — hindi basta kahit sinong opisyal ang pwedeng mag-assign ng bagong tungkulin sa District Collector sa ilalim ng probisyong ito.

🔗 Related Topics
Section 210 (main provision), Section 201(g), Section 202(k).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 210, paragraph (8) ng CMTA (Republic Act No. 10863) tungkol sa iba pang tungkulin na maaaring i-assign ng Commissioner sa District Collector. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 201(g) at 202(k), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},460:{_label:"section 211 — Temporary Succession of Deputy District Collector",title:"Section 211: Sino ang Pumapalit Kapag Wala ang District Collector?",content:`📖 Kahulugan
Ang Section 211 ay naglalarawan sa proseso ng temporary succession kapag ang District Collector ay wala, may disability, o kung may bakante ang posisyon. Sa ganitong sitwasyon, ang Deputy District Collector ang pansamantalang gagampan ng tungkulin. Kung walang Deputy District Collector, ang District Collector mismo ang magde-designate ng senior ranking customs officer, at kung magkatabla ang seniority, dodo-drawing ng lots.

🔍 Breakdown
- Absence or Disability of a District Collector, or Vacancy – tatlong sitwasyon na maaaring mag-trigger ng temporary succession.
- Deputy District Collector Shall Temporarily Discharge the Duties – ang unang "in line" na pumapalit.
- Should There Be No Deputy District Collector – kung walang Deputy, may fallback plan.
- District Collector Shall Designate, in Writing, a Senior Ranking Customs Officer – dapat nakasulat ang designation, hindi basta verbal.
- Two or More Senior Ranking Officers with Equal Length of Service – Drawing of Lots – tie-breaker mechanism.
- Report to Commissioner Within Twenty-Four (24) Hours – mahigpit na deadline para sa pag-report ng designation.

💡 Simpleng Paliwanag
Kung sakaling wala ang District Collector — maaaring nagbabakasyon, may sakit, o walang laman ang posisyon — hindi puwedeng "walang pinuno" ang district. Ang Deputy District Collector ang unang pumapalit. Kung wala namang Deputy, ang District Collector mismo (bago siya umalis, o kung siya ay may laman pa) ang magtatalaga ng senior officer na pansamantalang mamumuno, at dapat i-report ito sa Commissioner sa loob ng 24 oras.

📦 Halimbawa
Biglang nagkasakit ang District Collector ng Port of Tacloban at kinailangang mag-medical leave nang ilang linggo. Sa ilalim ng Section 211, ang Deputy District Collector ang pansamantalang gaganap sa tungkulin ng District Collector habang wala ito, para hindi ma-disrupt ang customs operations sa port.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na walang "leadership gap" sa isang Customs District — laging may malinaw na proseso kung sino ang mamumuno kahit pansamantalang wala ang regular na District Collector.

⚠️ Dapat Tandaan
Mahigpit ang 24-hour reporting requirement sa Commissioner — hindi ito optional, obligadong i-report agad ang designation.

🎯 Board Exam Tip
I-memorize ang tamang sequence: Deputy District Collector muna, kung wala, District Collector mag-de-designate ng senior officer (in writing), kung magkatabla, drawing of lots, at i-report sa Commissioner sa loob ng 24 hours.

❓ Madalas Malito ang Students
Tanong: "Kung dalawang senior officer ang magkapareho ng ranggo pero magkaiba ng haba ng serbisyo, sino ang mauuna?" Sagot: Batay sa batas, ang "drawing of lots" ay ginagamit lamang kung ang mga senior ranking officers ay may EQUAL length of service — kung magkaiba ang haba ng serbisyo, malamang na ang mas matagal na naglingkod ang bibigyang prayoridad, kahit hindi ito explicit na nakasaad sa text.

🔗 Related Topics
Section 210 (Duties of the District Collector), Section 200 (Chief Officials).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 211 ng CMTA (Republic Act No. 10863) tungkol sa temporary succession ng Deputy District Collector. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang tamang sequence ng succession at ang 24-hour reporting requirement, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},461:{_label:"section 212 — Records to be Kept by Customs Officers",title:"Section 212: Obligasyon sa Pagpapanatili ng Records",content:`📖 Kahulugan
Ang Section 212 ay nag-oobliga sa mga District Collector, Deputy District Collector, at customs officers na gumaganap sa ganitong kapasidad na magpanatili ng permanent records ng lahat ng opisyal na transaksyon, at i-turn over ang lahat ng records at official papers sa kanilang successor o ibang authorized officials. Dapat ding available ang mga records na ito para sa inspection ng ibang authorized officials ng Bureau. Kung kinakailangan, ang District Collector ang maglalagay ng official dry seal ng Bureau sa mga dokumentong nangangailangan ng authentication.

🔍 Breakdown
- Maintain Permanent Records of Official Transactions – obligasyon na i-record at i-preserve ang lahat ng opisyal na gawain.
- Turn-Over All Records to Successors or Authorized Officials – dapat ipasa ang records kapag may pagpapalit ng opisyal.
- Available for Inspection by Other Authorized Officials – hindi pwedeng itago o i-withhold ang records mula sa mga taong may karapatang mag-inspect.
- Affix Official Dry Seal – ang District Collector ang responsable sa paglalagay ng opisyal na seal para sa authentication ng mga dokumento, kung required.

💡 Simpleng Paliwanag
Ang lahat ng ginagawang customs transactions ay dapat naka-record at naka-preserve nang maayos, hindi lang para sa kasalukuyang opisyal, kundi para rin ito maipasa sa susunod na papalit sa kanya. At kung may susuriin na authorized officials, dapat available ang mga records na ito. Ang official dry seal naman ay ginagamit para patunayan ang authenticity ng mga importanteng dokumento.

📦 Halimbawa
Matapos ang tatlong taong assignment ng isang District Collector sa Port of Iloilo (base sa three-year rotation rule sa Section 201(f)), inilipat siya sa ibang district. Bago siya umalis, kinailangan niyang i-turn over ang lahat ng permanent records ng kanyang mga opisyal na transaksyon sa bagong District Collector na papalit sa kanya, para hindi maputol ang institutional knowledge at accountability.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa continuity at accountability ng Bureau of Customs — sa pamamagitan ng maayos na record-keeping, hindi nawawala ang importanteng impormasyon kahit magpalit ng opisyal, at may audit trail para sa transparency.

⚠️ Dapat Tandaan
Ang official dry seal requirement ay "if required" lang — hindi ito applicable sa lahat ng dokumento, kundi doon lang sa mga nangangailangan ng authentication.

🎯 Board Exam Tip
I-relate ito sa Section 211 (Temporary Succession) — ang record-keeping at turn-over ay mahalagang bahagi ng smooth transition kapag may pagpapalit ng District Collector, pansamantala man o permanente.

❓ Madalas Malito ang Students
Tanong: "Sino ang responsable sa paglalagay ng official dry seal — kahit sinong customs officer ba?" Sagot: Malinaw sa batas na ang District Collector ang may responsibilidad na maglagay ng official dry seal, kung required, sa mga dokumento at records na nangangailangan ng authentication — hindi ito basta kahit sinong customs officer.

🔗 Related Topics
Section 211 (Temporary Succession), Section 213 (Reports of the District Collector to the Commissioner).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 212 ng CMTA (Republic Act No. 10863) tungkol sa records na dapat panatilihin ng customs officers. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 211, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},462:{_label:"section 213 — Reports of the District Collector to the Commissioner",title:"Section 213: Obligasyon ng District Collector na Mag-report sa Commissioner",content:`📖 Kahulugan
Ang Section 213 ay nag-oobliga sa District Collector na i-report sa Commissioner ang anumang probable o initiated litigation sa loob ng kanyang Customs District, at magsumite ng regular monthly reports tungkol sa lahat ng transaksyon sa kanyang district.

🔍 Breakdown
- Report Any Probable or Initiated Litigation – dapat i-report kahit "probable" pa lang (hindi pa aktwal na nagsimula) o kaya "initiated" na (nagsimula na) na kaso.
- Within the Customs District – dapat ito ay may kinalaman sa kanyang specific na district.
- Submit Regular Monthly Reports – obligadong buwanang ulat, hindi lang paminsan-minsan.
- On All District Transactions – malawak na saklaw ng report, lahat ng transaksyon sa district.

💡 Simpleng Paliwanag
Ang District Collector ay may dalawang klase ng reporting obligation: una, dapat niyang i-report agad sa Commissioner kung may nakikita siyang potensyal na legal na problema o litigation sa kanyang district; pangalawa, dapat siyang magpasa ng regular na buwanang ulat tungkol sa lahat ng nangyayari sa kanyang district.

📦 Halimbawa
Natuklasan ng District Collector ng Port of Zamboanga na may isang malaking importer na posibleng magdemanda sa Bureau of Customs dahil sa isang disputed assessment. Bilang bahagi ng kanyang tungkulin sa ilalim ng Section 213, agad niya itong ni-report sa Commissioner bilang "probable litigation," bukod pa sa kanyang regular na monthly report tungkol sa lahat ng transaksyon sa kanyang district.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa proactive management ng legal risks ng Bureau of Customs, at para sa patuloy na pagsubaybay ng Commissioner sa performance at sitwasyon ng bawat Customs District sa buong bansa.

⚠️ Dapat Tandaan
May dalawang magkaibang klase ng report dito: (1) ad-hoc na report tungkol sa litigation (kung kailan lang may nangyari), at (2) regular monthly report (palagian, buwan-buwan).

🎯 Board Exam Tip
I-note ang salitang "probable" — hindi kailangang hintaying aktwal na naisampa na ang kaso bago i-report; kahit potensyal pa lang na litigation ay dapat nang i-report.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang aktwal nang naisampa ang kaso bago i-report ng District Collector sa Commissioner?" Sagot: Hindi — malinaw sa batas na kahit "probable" litigation pa lang, ibig sabihin posibilidad lang na magkaroon ng kaso, ay dapat nang i-report, hindi na kailangang hintayin pang aktwal na maisampa ang demanda.

🔗 Related Topics
Section 203 (Annual Report of the Commissioner), Section 212 (Records to be Kept by Customs Officers).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 213 ng CMTA (Republic Act No. 10863) tungkol sa reports ng District Collector sa Commissioner. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba ng litigation report at monthly report, banggitin ang koneksyon nito sa Section 203, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},464:{_label:"section 214 — Persons Exercising Police Authority",title:"Section 214: Sino ang May Police Authority sa Ilalim ng CMTA?",content:`📖 Kahulugan
Ang Section 214 ay naglilista kung sinu-sino ang mga taong may authority na mag-search, mag-seize, at mag-arrest para sa epektibong implementasyon ng CMTA. Bukod dito, may mga karagdagang rules tungkol sa coordination, turn-over ng seized goods, mission orders, at ang authority ng Commissioner na tukuyin ang scope ng ganitong police power.

🔍 Breakdown
- Search, Seizure, and Arrest – tatlong pangunahing police power na tinatalakay sa buong section na ito.
- Coordinate with the Commissioner – kailangan ng constant coordination ang lahat ng may police authority.
- Physical Turn-Over of Seized Goods – dapat agad na iturn-over sa Bureau ang mga na-seize na goods, maliban kung may ibang batas na nagsasabi ng iba.
- Mission Orders – dapat malinaw ang pangalan ng nagsasagawa ng mission at ang mga tasks.
- Commissioner Defines Scope (with SOF Approval) – ang Commissioner ang magde-detalye ng saklaw, lugar, proseso, at kundisyon ng police authority.
- Seizure Proceedings under Chapters 3 and 4 of Title XI – dapat sumunod sa specific na proseso ng batas ang lahat ng seizure.

💡 Simpleng Paliwanag
Hindi lang basic customs officers ang may kapangyarihang mag-search, mag-seize, o mag-arrest — may specific na listahan ng mga taong pinahihintulutan ng batas. Pero kahit sila ay may ganitong authority, may mga rules pa rin sila na sinusunod, tulad ng pag-coordinate sa Commissioner at ang tamang pag-turn-over ng seized goods.

📦 Halimbawa
May isang joint operation sa pagitan ng Bureau of Customs at AFP laban sa isang smuggling syndicate sa dagat malapit sa Zamboanga. Dahil authorized ng Commissioner ang mga sundalong AFP na sumali sa operation, may police authority sila para mag-search at mag-seize ng mga smuggled goods, basta't kasunod ng tamang mission order at agad na iturn-over ang na-seize na goods sa Bureau of Customs.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nililinaw nito kung sino talaga ang legal na pinahihintulutan na mag-exercise ng ganitong malaking kapangyarihan — hindi basta kahit sino ang pwedeng mag-search o mag-seize ng goods sa ngalan ng customs enforcement.

⚠️ Dapat Tandaan
Ang physical turn-over ng seized goods sa Bureau ay obligado, "unless provided under existing laws, rules and regulations" — meron pang posibleng exception depende sa ibang batas.

🎯 Board Exam Tip
I-memorize ang tatlong kategorya sa paragraphs (a-c): Bureau officials, AFP/national law enforcement (kailangan ng authorization), at BIR officials (limitado lang sa internal revenue tax cases).

❓ Madalas Malito ang Students
Tanong: "Pwede bang basta na lang mag-search o mag-seize ang isang sundalo ng AFP kahit walang authorization mula sa Commissioner?" Sagot: Hindi — malinaw sa batas na kailangan munang may "authorization of the Commissioner" bago magkaroon ng police authority ang mga miyembro ng AFP o national law enforcement agencies.

🔗 Related Topics
Paragraphs (a) hanggang (c) ng Section 214, Section 215 (Place Where Authority May Be Exercised), Section 303, CAO 10-2020, CAO 03-2019.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 214 ng CMTA (Republic Act No. 10863) tungkol sa Persons Exercising Police Authority. I-explain nang simple ang overview ng tatlong kategorya ng authorized persons, magbigay ng practical na halimbawa, banggitin ang CAO 10-2020 at CAO 03-2019, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},465:{_label:"paragraph (a) — Bureau Officials",title:"Section 214(a): Mga Opisyal ng Bureau na May Police Authority",content:`📖 Kahulugan
Ang unang kategorya ng mga taong may police authority ay ang mga opisyal ng Bureau of Customs mismo — kasama ang District Collectors, Deputy District Collectors, police officers, agents, inspectors, at guards ng Bureau.

🔍 Breakdown
- Officials of the Bureau – general na termino para sa mga opisyal sa loob ng Bureau of Customs.
- District Collectors, Deputy District Collectors – ang mga pinuno ng bawat Customs District, na natutunan na natin sa Sections 210-211.
- Police Officers, Agents, Inspectors, Guards of the Bureau – iba't ibang klase ng frontline personnel na may direktang enforcement function.

💡 Simpleng Paliwanag
Sila ang "core" o pangunahing grupo na may police authority — ang mismong mga taong nagtatrabaho sa loob ng Bureau of Customs, mula sa mataas na opisyal (District Collector) hanggang sa mga guard at inspector sa ground level.

📦 Halimbawa
Sa Port of Batangas, may customs inspector na nagsagawa ng physical search sa isang suspicious na container na may hinihinalang undeclared goods. Bilang opisyal ng Bureau, may legal na authority siya na gawin ito sa ilalim ng paragraph (a).

⭐ Bakit Mahalaga Ito?
Sila ang pinaka-natural na may police authority dahil sila mismo ang core personnel ng Bureau of Customs — hindi na kailangan ng espesyal na authorization mula sa Commissioner katulad ng ibang kategorya.

⚠️ Dapat Tandaan
Hindi lang "officials" — kasama rin ang mas junior na positions tulad ng guards at inspectors sa saklaw ng police authority na ito.

🎯 Board Exam Tip
I-compare ito sa paragraphs (b) at (c) — ang paragraph (a) ay HINDI nangangailangan ng special authorization dahil sila mismo ang Bureau personnel, hindi katulad ng AFP/law enforcement (paragraph b) na kailangan ng authorization mula sa Commissioner.

❓ Madalas Malito ang Students
Tanong: "Kailangan pa bang magkaroon ng special authorization ang isang customs guard bago siya magkaroon ng police authority?" Sagot: Hindi na kailangan — dahil sila mismo ay Bureau of Customs personnel, awtomatikong nasa saklaw sila ng police authority sa ilalim ng paragraph (a), hindi tulad ng ibang kategorya na kailangan pa ng authorization.

🔗 Related Topics
Section 214 (main provision), Section 210 (Duties of the District Collector).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 214, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa police authority ng mga opisyal ng Bureau of Customs. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa paragraphs (b) at (c), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},466:{_label:"paragraph (b) — AFP/Law Enforcement Authorization",title:"Section 214(b): AFP at National Law Enforcement na May Police Authority",content:`📖 Kahulugan
Ang pangalawang kategorya ng mga taong may police authority ay ang mga opisyal at miyembro ng Armed Forces of the Philippines (AFP) at ibang national law enforcement agencies, pero KAILANGAN muna ito ng authorization mula sa Commissioner bago sila magkaroon ng ganitong kapangyarihan.

🔍 Breakdown
- Upon Authorization of the Commissioner – kritikal na requirement — hindi automatic ang police authority nila, dapat munang bigyan ng pahintulot ng Commissioner.
- Officers and Members of the AFP – kasama ang mga sundalo at opisyal ng military.
- National Law Enforcement Agencies – kasama ang ibang ahensya tulad ng PNP at iba pang national enforcement bodies.

💡 Simpleng Paliwanag
Hindi automatic na may police authority ang mga sundalo o pulis sa customs matters — kailangan munang bigyan sila ng espesyal na pahintulot ng Commissioner bago sila makapag-search o makapag-seize ng goods sa ilalim ng CMTA.

📦 Halimbawa
Sa panahon ng malaking anti-smuggling operation sa dagat malapit sa Palawan, nag-request ang Bureau of Customs ng suporta mula sa Philippine Navy. Bago sila makapag-search o makapag-seize ng mga suspicious na barko, kailangan munang bigyan sila ng authorization ng Commissioner para magkaroon ng valid na police authority sa ilalim ng CMTA.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang check and balance — hindi basta-basta pwedeng mag-exercise ng customs police power ang sinumang miyembro ng AFP o law enforcement, para matiyak na naaayon pa rin ito sa proper na customs procedures at accountability.

⚠️ Dapat Tandaan
Ang authorization requirement dito ay mahalagang pagkakaiba kumpara sa paragraph (a) — kung ang Bureau officials ay automatic na may authority, ang AFP/law enforcement ay kailangan munang bigyan ng specific na authorization.

🎯 Board Exam Tip
I-highlight ang salitang "upon authorization" bilang key phrase para sa paragraph (b) — madalas itong ginagawang trap sa exam.

❓ Madalas Malito ang Students
Tanong: "Kung may PNP officer na nakakita ng smuggled goods habang nasa regular patrol, pwede na ba niya itong i-seize agad?" Sagot: Batay sa batas, kailangan munang may authorization mula sa Commissioner bago magkaroon ng ganitong police authority ang PNP officer sa ilalim ng CMTA — kung walang ganitong authorization, hindi siya covered ng paragraph (b).

🔗 Related Topics
Section 214 (main provision), paragraph (a) — Bureau Officials, CAO 03-2019.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 214, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa police authority ng AFP at national law enforcement agencies. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit kailangan ng authorization mula sa Commissioner, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},467:{_label:"paragraph (c) — BIR Officials",title:"Section 214(c): BIR Officials na May Police Authority sa Internal Revenue Tax Cases",content:`📖 Kahulugan
Ang ikatlong kategorya ng mga taong may police authority ay ang mga opisyal ng Bureau of Internal Revenue (BIR), pero LIMITADO lang ito sa mga kaso na nasa loob ng regular na performance ng kanilang tungkulin, at kung saan involved ang payment ng internal revenue taxes.

🔍 Breakdown
- Officials of the BIR – ang mga opisyal ng Bureau of Internal Revenue, hindi Bureau of Customs.
- On All Cases Falling Within the Regular Performance of Their Duties – limitado lang sa normal na scope ng trabaho nila, hindi general na police authority.
- When Payment of Internal Revenue Taxes is Involved – ang specific na trigger — dapat may kinalaman ito sa internal revenue tax, hindi basta anumang customs matter.

💡 Simpleng Paliwanag
May police authority rin ang mga BIR officials, pero hindi ito kasing lawak ng authority ng Bureau of Customs personnel — limitado lang ito sa mga sitwasyon kung saan may kinalaman sa internal revenue taxes, at kasama pa rin ito sa normal na trabaho nila.

📦 Halimbawa
May isang shipment ng imported goods na may kinalaman sa parehong customs duties AT internal revenue taxes (tulad ng excise tax). Kung sa proseso ng regular na performance ng duties ng isang BIR official, natuklasan niya ang isang paglabag na may kinalaman sa payment ng internal revenue taxes sa mismong shipment na ito, maaari siyang mag-exercise ng police authority sa ilalim ng paragraph (c).

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil kinikilala nito na may overlap sa pagitan ng customs at internal revenue matters — lalo na sa mga produktong subject sa parehong customs duties at internal revenue taxes tulad ng sigarilyo at alak.

⚠️ Dapat Tandaan
Limitado ang saklaw ng authority ng BIR officials dito — hindi ito general customs police power, kundi tumutukoy lang sa mga sitwasyon na may specific na koneksyon sa internal revenue tax matters.

🎯 Board Exam Tip
I-note ang dalawang limitasyon sa paragraph (c): (1) dapat nasa regular performance ng duties, at (2) dapat may involved na payment ng internal revenue taxes — parehong kailangan, hindi lang isa.

❓ Madalas Malito ang Students
Tanong: "Pwede bang mag-exercise ng general police authority ang isang BIR official sa anumang customs matter?" Sagot: Hindi — malinaw sa batas na limitado ang authority ng BIR officials sa mga kaso na "falling within the regular performance of their duties" AT kung saan "payment of internal revenue taxes is involved," hindi ito general na police power.

🔗 Related Topics
Section 214 (main provision), paragraphs (a) at (b).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 214, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa limitadong police authority ng BIR officials. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang dalawang limitasyon nito, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},468:{_label:"section 215 — Place Where Authority May be Exercised",title:"Section 215: Saan Puwedeng I-exercise ang Police Authority?",content:`📖 Kahulugan
Ang Section 215 ay naglilimita kung saan puwedeng i-exercise ang police authority na natutunan natin sa Section 214 — dapat lang ito nasa loob ng customs premises (ayon sa Section 303) at nasa loob ng limitasyon ng authority na ibinigay ng Commissioner. Obligado ring bigyan ng port at airport authorities ang mga authorized customs officers ng unhampered access sa lahat ng premises sa loob ng kanilang jurisdiction.

🔍 Breakdown
- Only Within Customs Premises – hindi puwedeng basta kahit saan i-exercise ang police authority, dapat ito nasa loob ng customs premises.
- As Provided for in Section 303 – ang depinisyon ng "customs premises" ay hindi dito, kundi nasa Section 303.
- Within the Limits of the Authority Granted by the Commissioner – kahit nasa customs premises, dapat pa rin ito sa loob ng specific na authority na ibinigay ng Commissioner.
- Unhampered Access for Authorized Customs Officers – obligasyon ng port/airport authorities na bigyan ng libreng access ang mga customs officers.

💡 Simpleng Paliwanag
Hindi puwedeng basta kahit saan mag-exercise ng police authority ang isang customs officer — dapat ito nasa loob ng "customs premises" (tulad ng port o airport area), at dapat pa rin ito nasa loob ng specific na scope na ibinigay sa kanya ng Commissioner. Sa kabilang banda, obligado naman ang mga port at airport authorities na bigyan ng libreng access ang mga customs officer sa lahat ng bahagi ng kanilang jurisdiction.

📦 Halimbawa
May customs officer na naka-assign sa Ninoy Aquino International Airport. Puwede niyang i-exercise ang kanyang police authority sa loob ng airport premises, tulad ng cargo areas at warehouse facilities, dahil ito ay saklaw ng customs premises. Obligado rin ang airport authority na bigyan siya ng libreng access sa lahat ng bahagi ng airport na kailangan niya para sa customs enforcement.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para malinaw ang geographical scope ng police authority — hindi ito unlimited power na maaaring i-exercise kahit saan, kundi limitado sa mga specific na lugar na may kinalaman sa customs operations.

⚠️ Dapat Tandaan
Dalawang layer ng limitasyon dito: (1) dapat nasa customs premises, at (2) dapat nasa loob ng authority na ibinigay ng Commissioner — parehong kailangan.

🎯 Board Exam Tip
I-relate ito sa Section 303 para sa exact na depinisyon ng "customs premises" — kailangan mo ring balikan ang Section na iyon para lubos na maintindihan ang Section 215.

❓ Madalas Malito ang Students
Tanong: "Pwede bang mag-search ang customs officer sa isang property na wala sa customs premises kung may suspetsa siyang may smuggled goods doon?" Sagot: Ang Section 215 ay nagsasabing dapat lang "within customs premises" i-exercise ang police authority — kung ang lugar ay wala sa saklaw ng customs premises, maaaring hindi na ito covered ng ganitong authority, at maaaring kailanganin ng ibang legal na proseso.

🔗 Related Topics
Section 214 (Persons Exercising Police Authority), Section 303 (Customs Premises).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 215 ng CMTA (Republic Act No. 10863) tungkol sa lugar kung saan puwedeng i-exercise ang police authority. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 303, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},469:{_label:"section 216 — Exercise of Power of Seizure",title:"Section 216: Kapangyarihan at Tungkulin na Mag-seize ng Goods",content:`📖 Kahulugan
Ang Section 216 ay nagbibigay sa sinumang may police authority sa ilalim ng CMTA ng kapangyarihan AT tungkulin na mag-seize ng barko, eroplano, cargo, goods, hayop, o kahit anong movable property, kung ito ay subject sa forfeiture o kung ito ay subject ng fine sa ilalim ng CMTA.

🔍 Breakdown
- Power and Duty – hindi lang "pwede," kundi "dapat" — obligasyon ito, hindi lang discretion.
- To Seize – ang aktwal na pagkuha ng possession ng goods bilang bahagi ng enforcement.
- Vessel, Aircraft, Cargo, Goods, Animal, or Any Other Movable Property – malawak na saklaw ng seizable items.
- Subject to Forfeiture – ang goods ay dapat na kwalipikadong ma-forfeit base sa ibang probisyon ng CMTA.
- Subject of a Fine Imposed Under This Act – o kaya, ang goods ay may kaugnay na fine sa ilalim ng batas.

💡 Simpleng Paliwanag
Kapag may goods na dapat i-forfeit o may kaugnay na fine sa ilalim ng CMTA, hindi lang "pwede" na i-seize ito ng may police authority — obligado talaga silang gawin ito. Malawak din ang saklaw — hindi lang goods kundi pati na rin barko, eroplano, at kahit hayop.

📦 Halimbawa
May natuklasang barkong nagdadala ng smuggled na sigarilyo sa dagat malapit sa Cebu. Dahil ang mismong barko at ang laman nitong smuggled goods ay parehong subject sa forfeiture, may obligasyon ang customs officer na mag-seize hindi lang ng cargo, kundi pati na rin ng barko mismo.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil malinaw nitong itinatakda na ang seizure ay hindi lang discretionary power — ito ay obligasyon ng mga may police authority kung natutugunan ang mga kondisyon (forfeiture o fine).

⚠️ Dapat Tandaan
Ang salitang "power AND duty" ay mahalaga — hindi ito basta opsyonal na kapangyarihan, kundi obligadong gawin kung natutugunan ang mga kondisyon.

🎯 Board Exam Tip
I-memorize ang malawak na listahan ng seizable items: vessel, aircraft, cargo, goods, animal, o any other movable property — hindi lang basic "goods" ang saklaw.

❓ Madalas Malito ang Students
Tanong: "Pwede bang piliin ng customs officer na hindi na lang mag-seize kahit alam niyang subject sa forfeiture ang goods?" Sagot: Batay sa malinaw na wika ng batas ("power and duty"), obligado ang customs officer na mag-seize kung ang goods ay subject sa forfeiture o may kaugnay na fine — hindi ito basta opsyonal na desisyon.

🔗 Related Topics
Section 214 (Persons Exercising Police Authority), Chapters 3 at 4 ng Title XI (Seizure Proceedings).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 216 ng CMTA (Republic Act No. 10863) tungkol sa power and duty ng seizure. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit ito ay obligasyon at hindi lang discretion, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},470:{_label:"section 217 — Duty of Officer to Disclose Official Character",title:"Section 217: Obligasyon na Ipakita ang Opisyal na Karakter",content:`📖 Kahulugan
Ang Section 217 ay nag-oobliga sa sinumang may police authority na i-disclose ang katangian ng kanilang authority kapag sila ay tinatanong sa oras ng pag-exercise nito, at dapat nilang ipakita ang kaukulang written authority na inisyu ng Commissioner.

🔍 Breakdown
- Disclose the Nature of the Authority – dapat ipaliwanag kung ano at bakit sila may ganitong kapangyarihan.
- Upon Being Questioned – ang trigger ay kapag may nagtatanong sa kanila, hindi kailangang proactive na ipakita agad kung walang tanong.
- At the Time of Exercise Thereof – dapat mangyari ito habang isinasagawa nila ang kanilang police authority.
- Exhibit the Corresponding Written Authority – dapat ding ipakita ang aktwal na dokumento — hindi lang verbal na pagpapaliwanag.
- Issued by the Commissioner – dapat mula sa Commissioner ang written authority na ito.

💡 Simpleng Paliwanag
Kung may customs officer na nag-eexercise ng police authority — halimbawa, nag-search o nag-seize — at may tumanong sa kanya kung ano ang basehan niya para gawin ito, obligado siyang ipaliwanag at ipakita ang kanyang written authority mula sa Commissioner. Hindi puwedeng "trust me lang" o walang paper trail.

📦 Halimbawa
May customs officer na nag-search ng isang warehouse sa Clark dahil sa hinihinalang smuggled goods. Nang tanungin siya ng may-ari ng warehouse kung anong karapatan niya para gawin ito, kailangan niyang ipakita ang kanyang written mission order o authorization mula sa Commissioner bilang batayan ng kanyang aksyon.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang proteksyon laban sa abuse of authority — kung may sinumang nagpapanggap na may police authority pero hindi naman totoo, may karapatan ang publiko na tanungin at hingin ang written proof nito.

⚠️ Dapat Tandaan
Hindi lang verbal na pagpapaliwanag ang sapat — dapat may aktwal na written authority na maipapakita.

🎯 Board Exam Tip
I-relate ito sa Section 214 tungkol sa mission orders — ang written authority na binabanggit dito ay konektado sa mission orders na dapat malinaw na may pangalan at tasks.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang proactive na ipakita agad ng customs officer ang kanyang authority kahit walang tumatanong?" Sagot: Batay sa nakasaad sa batas, ang obligasyon na i-disclose ay "upon being questioned" — ibig sabihin ang trigger ay kapag may tumatanong, hindi ito automatic na dapat ipakita agad kahit walang katanungan.

🔗 Related Topics
Section 214 (Persons Exercising Police Authority), Section 216 (Exercise of Power of Seizure).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 217 ng CMTA (Republic Act No. 10863) tungkol sa duty ng officer na i-disclose ang official character. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa mission orders sa Section 214, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},471:{_label:"section 218 — Authority to Require Assistance and Information",title:"Section 218: Karapatan na Humingi ng Tulong mula sa PNP at AFP",content:`📖 Kahulugan
Ang Section 218 ay nagbibigay sa sinumang may police authority ng karapatan na humingi ng tulong mula sa Philippine National Police (PNP), AFP, at ibang national law enforcement agencies, kapag kinakailangan para sa pag-eexecute ng search, seizure, o arrest. Obligado rin ang mga police officer at ibang national law enforcers na magbigay ng ganitong lawful assistance.

🔍 Breakdown
- Demand Assistance and Request Information – dalawang klase ng suporta na maaaring hingin — physical assistance at impormasyon.
- From PNP, AFP, and Other National Law Enforcement Agencies – malawak na saklaw ng mga ahensyang maaaring hingan ng tulong.
- When Necessary – hindi automatic, kundi conditional lang kapag talagang kailangan.
- To Effect Any Search, Seizure or Arrest – ang layunin ng paghingi ng tulong.
- Duty to Give Lawful Assistance – obligado ang mga inirerequest na ahensya na tumulong, basta't ito ay lawful.

💡 Simpleng Paliwanag
Kung ang isang customs officer ay nangangailangan ng dagdag na suporta para maisagawa ang search, seizure, o arrest — halimbawa, dahil delikado ang sitwasyon o kailangan ng dagdag na manpower — pwede siyang humingi ng tulong mula sa PNP o AFP, at obligado silang tumulong basta't ito ay legal.

📦 Halimbawa
Sa isang malaking anti-smuggling operation sa Port of Davao, humingi ang Bureau of Customs ng suporta mula sa PNP dahil sa posibleng delikadong sitwasyon kung saan armado ang mga smuggler. Sa ilalim ng Section 218, obligado ang PNP na magbigay ng lawful assistance sa customs enforcement operation na ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng legal basis para sa inter-agency cooperation sa mga customs enforcement operations, lalo na sa mga sitwasyong nangangailangan ng dagdag na manpower o specialized na kakayahan tulad ng armed response.

⚠️ Dapat Tandaan
Ang assistance na kailangan ibigay ng PNP/AFP ay dapat "lawful" — hindi sila obligadong tumulong sa mga hindi legal na aksyon.

🎯 Board Exam Tip
I-differentiate ito sa Section 214(b) — ang Section 218 ay tungkol sa PAGHINGI ng assistance para sa isang specific na operation, habang ang Section 214(b) ay tungkol sa AFP/law enforcement na magkaroon mismo ng full police authority sa ilalim ng CMTA (may authorization mula sa Commissioner).

❓ Madalas Malito ang Students
Tanong: "Pareho ba ito ng Section 214(b) tungkol sa AFP na may police authority?" Sagot: Hindi eksakto pareho — ang Section 218 ay tungkol sa paghingi ng ASSISTANCE mula sa PNP/AFP para sa isang specific na operation, habang ang Section 214(b) ay tungkol sa AFP/law enforcement na magkaroon mismo ng buong police authority sa ilalim ng CMTA, na may authorization mula sa Commissioner.

🔗 Related Topics
Section 214(b) — AFP/Law Enforcement Authorization, Section 216 (Exercise of Power of Seizure).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 218 ng CMTA (Republic Act No. 10863) tungkol sa authority na humingi ng assistance mula sa PNP at AFP. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa Section 214(b), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},472:{_label:"section 219 — Authority to Enter Properties",title:"Section 219: Karapatan na Pumasok sa mga Property (Maliban sa Dwelling House)",content:`📖 Kahulugan
Ang Section 219 ay nagbibigay sa sinumang may police authority ng karapatan na pumasok, dumaan, at mag-search ng anumang lupa, enclosure, warehouse, store, building, o structure — basta't hindi ito "principally used as a dwelling house." May karagdagang paglilinaw din na kung may security personnel o empleyadong nakatira sa isang warehouse o storage facility, hindi pa rin ito ituturing na dwelling house.

🔍 Breakdown
- Enter, Pass Through, and Search – tatlong klase ng aksyon na pinapayagan.
- At Any Time – walang oras restriction, pwedeng kahit anong oras.
- Land, Enclosure, Warehouse, Store, Building or Structure – malawak na saklaw ng mga lugar na pwedeng pasukin.
- Not Principally Used as a Dwelling House – ang pangunahing exception — hindi ito applicable sa mga bahay na tirahan.
- Security Personnel/Employee Living in Warehouse – Not Considered Dwelling House – espesyal na clarification na kahit may nakatira, hindi pa rin ito magiging "dwelling house" kung ang principal use ay storage.

💡 Simpleng Paliwanag
Malawak ang karapatan ng customs officer na pumasok at mag-search ng mga property tulad ng warehouse, lupa, o building, kahit walang warrant — pero HINDI ito applicable kung ang lugar ay talagang bahay na tirahan. Kahit may security guard na natutulog sa loob ng warehouse, hindi pa rin ito magiging "dwelling house" dahil ang principal use nito ay para sa storage, hindi para sa pamumuhay.

📦 Halimbawa
May customs officer na nagsuspetsa ng smuggled goods na nakatago sa isang warehouse malapit sa Subic Freeport. Kahit walang warrant, pwede siyang pumasok at mag-search sa warehouse na ito, dahil ang principal use nito ay storage, hindi dwelling house — kahit may security guard na natutulog doon.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para malinaw ang pagkakaiba ng access rights ng customs officers sa business/storage properties kumpara sa personal na tirahan — nagbibigay ito ng balanse sa pagitan ng effective enforcement at proteksyon ng personal privacy.

⚠️ Dapat Tandaan
Ang exception dito ay ang KEY — kailangang malinaw na maintindihan ang pagkakaiba sa Section 220 (dwelling house, kailangan ng warrant) — ang Section 219 ay para sa mga hindi dwelling house.

🎯 Board Exam Tip
I-relate ito nang direkta sa Section 220 — ang dalawang provisions na ito ay laging pinagsasama sa exam bilang "warrant" vs. "no warrant needed" na sitwasyon.

❓ Madalas Malito ang Students
Tanong: "Kung may nakatirang security guard sa isang warehouse, kailangan na ba ng warrant bago pumasok doon?" Sagot: Hindi — malinaw na nakasaad sa batas na kung ang security personnel o empleyado ay nakatira sa isang warehouse, store, o structure na ginagamit para sa storage ng goods, hindi ito ituturing na dwelling house, kaya hindi kailangan ng warrant.

🔗 Related Topics
Section 220 (Authority to Search Dwelling House), Section 215 (Place Where Authority May Be Exercised).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 219 ng CMTA (Republic Act No. 10863) tungkol sa authority na pumasok sa mga properties na hindi dwelling house. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa Section 220, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},473:{_label:"section 220 — Authority to Search Dwelling House",title:"Section 220: Kailangan ng Warrant Bago Ma-search ang Dwelling House",content:`📖 Kahulugan
Ang Section 220 ay ang direktang kabaligtaran ng Section 219 — kung ang isang lugar ay talagang dwelling house (bahay na tirahan), hindi ito basta pwedeng pasukin at i-search ng customs officer. Kailangan muna ng warrant na inisyu ng isang Judge, base sa sworn application na nagpapakita ng probable cause at malinaw na naglalarawan ng lugar na sasalain at ang goods na ise-seize.

🔍 Breakdown
- Dwelling House – ang lugar na talagang ginagamit bilang tirahan, hindi warehouse o storage.
- Warrant Issued by a Judge of a Competent Court – kailangan ng korte, hindi basta customs officer o Commissioner ang magbibigay ng authority.
- Sworn Application Showing Probable Cause – dapat may malinaw na basehan ng "probable cause," hindi basta suspetsa lang.
- Particularly Describing the Place to Be Searched – dapat specific ang lokasyon, hindi general o vague.
- And the Goods to Be Seized – dapat din specific ang mga goods na hinahanap.

💡 Simpleng Paliwanag
Kung dwelling house ang lugar na gustong i-search, hindi na ito katulad ng warehouse o storage facility na basta pwedeng pasukin nang walang warrant — kailangan munang kumuha ng warrant mula sa isang Judge, kasama ang sapat na basehan (probable cause) at malinaw na paglalarawan ng lugar at ng mga hinahanap na goods.

📦 Halimbawa
May malakas na intelligence report na nagsasabing may nagtatago ng smuggled goods sa isang residential house sa Quezon City. Dahil dwelling house ito, hindi basta pwedeng pasukin ito ng customs officer — kailangan muna nilang mag-file ng sworn application sa isang Judge, magpakita ng probable cause, at kumuha ng search warrant bago sila makapasok at makapag-search sa bahay.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang constitutional safeguard laban sa unreasonable search — pinoprotektahan nito ang privacy ng mga tao sa kanilang tahanan, kahit sa konteksto ng customs enforcement.

⚠️ Dapat Tandaan
Ang requirement ng warrant dito ay mahigpit — kailangan ito galing sa Judge ng competent court, hindi basta pwedeng bigyan ng authorization ang Commissioner o District Collector para sa dwelling house search.

🎯 Board Exam Tip
I-memorize ang tatlong requirements ng warrant: (1) sworn application, (2) probable cause, (3) particular description ng lugar at goods — madalas itong specific na tinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Pwede bang gamitin ang authority sa Section 219 (no warrant needed) sa isang dwelling house kung may matinding suspetsa?" Sagot: Hindi — malinaw na nakasaad sa Section 220 na kailangan ng warrant para ma-search ang dwelling house, anuman ang antas ng suspetsa; ang Section 219 ay explicitly hindi applicable sa mga lugar na "principally used as a dwelling house."

🔗 Related Topics
Section 219 (Authority to Enter Properties), Bill of Rights (unreasonable search and seizure protection).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 220 ng CMTA (Republic Act No. 10863) tungkol sa authority na mag-search ng dwelling house. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang tatlong requirements ng warrant, banggitin ang koneksyon nito sa Section 219, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},474:{_label:"section 221 — Authority to Search Vessels/Aircrafts",title:"Section 221: Karapatan na Mag-search ng Vessels, Aircraft, at mga Sakay Dito",content:`📖 Kahulugan
Ang Section 221 ay nagbibigay sa sinumang may police authority ng karapatan na sumakay, mag-inspect, mag-search, at mag-examine ng isang barko o eroplano, pati na rin ang anumang container, trunk, package, box, o envelope na naroroon, at mismong mag-search ng katawan ng kahit sinong tao na sakay dito. Kung may probable violation, maaari nilang i-seize ang goods, barko, eroplano, o kahit bahagi lamang nito.

🔍 Breakdown
- Board, Inspect, Search, and Examine – malawak na saklaw ng pinapayagang aksyon sa barko o eroplano.
- Vessel or Aircraft and Container/Trunk/Package/Box/Envelope – kasama pati ang mga bagay na dala-dala sa loob.
- Physically Search and Examine Any Person Thereon – kasama pati ang search sa katawan ng mga pasahero o crew.
- Seize Goods, Vessel, Aircraft, or Any Part Thereof – ang consequence kung may probable violation.
- Removal of False Bottom, Partition, Bulkhead – kasama ang aktibong pag-alis ng mga hidden compartment para hanapin ang concealed goods.
- No Claim for Damage Unless Gross Negligence or Abuse of Authority – proteksyon ng gobyerno laban sa damage claims, maliban kung may gross negligence o abuse.

💡 Simpleng Paliwanag
Malawak ang karapatan ng customs officer na sumakay, mag-search, at mag-examine ng barko o eroplano, kasama ang lahat ng laman nito at kahit ang mga taong nakasakay. Pwede pa nilang sirain ang mga hidden compartment kung kinakailangan para hanapin ang concealed goods. At kung may masira sa proseso na ito, hindi sila liable maliban kung napatunayang may gross negligence o abuse of authority sila.

📦 Halimbawa
May isang cargo ship na dumating sa Port of Cebu na hinihinalaang may nakatagong smuggled goods sa isang false bottom compartment. Sumakay ang customs officers, at pagkatapos ng masusing search, natagpuan nila ang secret compartment matapos nilang alisin ang isang partition. Dahil may nakitang concealed dutiable goods, na-seize nila ito, at hindi sila liable para sa pagsira ng partition dahil ginawa ito bilang bahagi ng legitimate na search.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil malawak ang saklaw ng inspection powers sa vessels/aircraft, na madalas gamitin sa smuggling — nagbibigay ito ng malawak na kapangyarihan para epektibong matukoy ang mga hidden o concealed na goods.

⚠️ Dapat Tandaan
May proteksyon ang gobyerno laban sa damage claims, PERO may exception — kung mapatunayang may gross negligence o abuse of authority, maaari pa ring managot ang gobyerno para sa pinsala.

🎯 Board Exam Tip
I-memorize ang exception sa "no claim for damage" rule: gross negligence o abuse of authority — madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Liable ba ang Bureau of Customs kung masira ang isang legitimate na compartment habang naghahanap sila ng smuggled goods pero wala naman silang nakita?" Sagot: Batay sa batas, hindi sila liable para sa damage sa goods, vessel, o aircraft maliban kung mapatunayang may gross negligence o abuse of authority sa pag-exercise ng kanilang search power — kahit walang natagpuang violation.

🔗 Related Topics
Section 216 (Exercise of Power of Seizure), Section 222 (Authority to Search Vehicles, Other Carriers).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 221 ng CMTA (Republic Act No. 10863) tungkol sa authority na mag-search ng vessels o aircraft. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang exception sa 'no claim for damage' rule, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},475:{_label:"section 222 — Authority to Search Vehicles/Other Carriers",title:"Section 222: Karapatan na Mag-search ng Vehicles, Carriers, Persons, at Hayop",content:`📖 Kahulugan
Ang Section 222 ay nagbibigay sa sinumang may police authority ng karapatan na, sa ilalim ng "reasonable cause," buksan at suriin ang anumang box, trunk, envelope, o container para tukuyin kung may dutiable o prohibited goods dito. Kasama rin dito ang search ng mga receptacle na ginagamit para sa transport ng human remains at patay na hayop, gayundin ang authority na paghintuin, i-search, at i-examine ang kahit anong vehicle, carrier, tao, o hayop na hinihinalaang nagdadala ng dutiable o prohibited goods.

🔍 Breakdown
- Upon Reasonable Cause – ang trigger requirement — dapat may sapat na basehan bago i-exercise ang search authority.
- Open and Examine Box, Trunk, Envelope, or Other Container – ang basic search power sa mga container.
- Purpose of Determining Dutiable or Prohibited Goods – ang layunin ng search.
- Includes Search of Receptacles for Human Remains and Dead Animals – espesyal na inclusion — kahit ang mga lalagyan ng patay na tao o hayop ay maaaring ma-search.
- Stop, Search and Examine Vehicle, Carrier, Person or Animal – malawak na saklaw ng mga bagay na maaaring ihinto at ma-search.

💡 Simpleng Paliwanag
Kung may sapat na basehan o "reasonable cause," pwedeng buksan at suriin ng customs officer ang kahit anong klase ng lalagyan — box, trunk, o kahit ang lalagyan ng bangkay ng tao o hayop — para tignan kung may nakatagong dutiable o prohibited goods. Pwede rin nilang paghintuin at i-search ang mga sasakyan, tao, o kahit hayop na hinihinalaang may dala-dalang ganitong goods.

📦 Halimbawa
Sa isang checkpoint malapit sa Port of Manila, may sasakyang naghahatid ng cargo na sumasakay papalabas ng port area. May reasonable cause ang customs officer na paghinuhinalaan itong may dalang undeclared goods dahil sa hindi tugmang dokumento. Sa ilalim ng Section 222, pwede niyang paghintuin at i-search ang sasakyan.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil binibigyan nito ng malawak na search authority ang customs officers sa land-based na transportasyon, hindi lang sa barko o eroplano — kritikal ito para sa comprehensive na anti-smuggling enforcement.

⚠️ Dapat Tandaan
Mahalagang tandaan ang "reasonable cause" requirement — hindi ito arbitrary na search, dapat may sapat na basehan bago ito i-exercise.

🎯 Board Exam Tip
I-note ang unique na inclusion ng "receptacles used for transport of human remains and dead animals" — madalas itong nakakalimutang detalye ng mga estudyante.

❓ Madalas Malito ang Students
Tanong: "Kailangan ba ng "reasonable cause" bago paghintuin ang isang ordinaryong sasakyan sa checkpoint?" Sagot: Oo — malinaw sa batas na ang authority na ito ay "upon reasonable cause," kaya kailangang may sapat na basehan bago i-exercise ang search power, hindi ito basta random o walang batayan na paghinto.

🔗 Related Topics
Section 221 (Authority to Search Vessels/Aircraft), Section 223 (Authority to Search Persons Arriving from Foreign Countries).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 222 ng CMTA (Republic Act No. 10863) tungkol sa authority na mag-search ng vehicles, carriers, persons, at animals. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang 'reasonable cause' requirement, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},476:{_label:"section 223 — Authority to Search Persons Arriving From Foreign Countries",title:"Section 223: Search sa mga Pasaherong Galing sa Ibang Bansa",content:`📖 Kahulugan
Ang Section 223 ay nagbibigay ng authority na i-search at i-detain ang mga travelers na dumarating mula sa ibang bansa, kung may reasonable cause. Mahalagang tandaan na dapat palaging respetuhin ang dignidad ng taong sinasala at dini-detain, at maaaring gamitin ang female inspectors para sa search ng mga babaeng pasahero.

🔍 Breakdown
- Upon Reasonable Cause – katulad ng ibang search provisions, kailangan ng sapat na basehan.
- Travelers Arriving from Foreign Countries – specific na saklaw — mga pasaherong galing sa ibang bansa, karaniwang sa airport o seaport.
- Search and Detention by Customs Officers – dalawang klase ng aksyon na pinapayagan.
- Dignity of the Person Shall Be Respected at All Times – mahalagang human rights safeguard.
- Female Inspectors for Search of Female Persons – espesyal na provision para sa proper at respetadong search ng mga babae.

💡 Simpleng Paliwanag
Kung may sapat na basehan, pwedeng i-search at i-detain ng customs officer ang isang traveler na kararating lang mula sa ibang bansa. Pero mahalagang tandaan — kahit may authority sila na gawin ito, dapat palaging respetado ang dignidad ng tao, at kung babae ang isasala, dapat female officer ang gagawa ng search.

📦 Halimbawa
Sa Ninoy Aquino International Airport, may pasaherong dumating mula sa ibang bansa na kumikilos nang kakaiba at may reasonable cause para pagdudahan ng customs officer. Isinagawa ang search, at dahil babae ang pasahero, isang female customs inspector ang nag-conduct ng personal na search, alinsunod sa requirement ng Section 223, habang pinapanatili ang dignidad ng pasahero sa buong proseso.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil binabalanse nito ang security needs ng customs enforcement (pagpigil ng smuggling sa pamamagitan ng mga papasok na pasahero) sa human rights at dignidad ng bawat indibidwal na sinasala.

⚠️ Dapat Tandaan
Hindi lang basta "authority to search" ang laman ng probisyong ito — malinaw ding nakasaad ang obligasyon na respetuhin ang dignidad ng tao, at ang special provision para sa female inspectors.

🎯 Board Exam Tip
I-memorize ang dalawang key safeguards: (1) dignity of the person shall be respected, (2) female inspectors para sa female persons — madalas itong specific na tinatanong bilang human rights aspect ng customs search.

❓ Madalas Malito ang Students
Tanong: "Obligado bang laging may female inspector available sa bawat airport para sa search ng babaeng pasahero?" Sagot: Ang batas ay nagsasabing "female inspectors MAY be employed" — ibig sabihin ito ay pinapayagan at inirerekomenda, pero hindi malinaw na nakasaad sa batas ang eksaktong obligasyon o penalty kung walang available na female inspector sa isang partikular na sitwasyon.

🔗 Related Topics
Section 222 (Authority to Search Vehicles, Persons and Animals), human rights safeguards sa customs search.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 223 ng CMTA (Republic Act No. 10863) tungkol sa authority na mag-search ng mga travelers mula sa ibang bansa. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang mga human rights safeguards dito, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},477:{_label:"section 224 — Power to Inspect and Visit",title:"Section 224: Kapangyarihang Mag-inspect ng Goods na Nasa Tindahan o Storage",content:`📖 Kahulugan
Ang Section 224 ay nagbibigay sa Commissioner o kahit sinong customs officer na may written authorization mula sa Commissioner, ng kapangyarihang humingi ng ebidensya ng pagbabayad ng duties at taxes sa mga imported goods na openly na binebenta o naka-store. Kung hindi maipakita ng interested party ang ebidensyang ito sa loob ng labinlimang (15) araw, maaaring i-seize ang goods at isailalim sa forfeiture proceedings — pero may proseso pa rin para mapatunayan ng may-ari ang source at ang tamang pagbabayad.

🔍 Breakdown
- Demand Evidence of Payment of Duties and Taxes – ang basic power — humingi ng proof of payment.
- Goods Openly for Sale or Kept in Storage – dalawang sitwasyon kung saan applicable ang power na ito.
- Failure to Produce Within 15 Days – Seizure and Forfeiture Proceedings – ang consequence kung walang maipakitang ebidensya.
- Opportunity to Prove Source and Payment – proteksyon ng interested party sa panahon ng proceedings.
- Motion to Quash/Recall Warrant – Release Within 15 Days if Documents Are Authentic – proseso para sa pagbawi ng seized goods kung mapatunayang tama pala ang pagbabayad.
- Subject to Clearance by the Commissioner – kahit approved na ang release, kailangan pa rin ng clearance mula sa Commissioner.
- Release Shall Not Be Contrary to Law – final na safeguard — hindi dapat labag sa batas ang release.

💡 Simpleng Paliwanag
Kahit hindi na sa customs area mismo, may kapangyarihan pa rin ang Commissioner (o kanyang authorized officer) na humingi ng proof of payment sa mga goods na binebenta sa palengke o naka-store sa warehouse. Kung walang maipakitang proof sa loob ng 15 araw, maaari itong ma-seize. Pero may pagkakataon pa rin ang may-ari na patunayan na legal naman pala ito, at kung mapatunayan, pwede pa ring ma-release ang goods sa loob ng 15 araw mula sa pag-file ng motion to quash.

📦 Halimbawa
May isang tindahan sa Divisoria na nagbebenta ng imported electronics. Nag-authorize ang Commissioner ng isang customs officer na mag-inspect sa lugar, at humingi ng ebidensya ng payment ng duties/taxes sa mga produkto. Dahil walang maipakitang proof ang may-ari sa loob ng 15 araw, na-seize ang mga goods. Pero nang maglaon, natagpuan ng may-ari ang orihinal na resibo ng pagbabayad, at pagkatapos i-verify ang authenticity nito, na-release ang goods sa loob ng 15 araw mula sa pag-file ng motion, subject pa rin sa clearance ng Commissioner.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng malawak na enforcement power sa Bureau of Customs kahit sa mga goods na nasa domestic market na, hindi lang sa entry points — kritikal ito para pigilan ang pagbenta ng smuggled goods sa mga tindahan.

⚠️ Dapat Tandaan
May dalawang magkasunod na 15-day periods dito: (1) 15 days para magpakita ng ebidensya bago ma-seize, at (2) 15 days para i-release ang goods kung mapatunayang authentic ang mga dokumento matapos ma-file ang motion to quash.

🎯 Board Exam Tip
I-memorize ang dalawang 15-day timelines, at ang requirement na kahit mapatunayang tama ang documents, kailangan pa rin ng "clearance by the Commissioner" bago talaga ma-release ang goods.

❓ Madalas Malito ang Students
Tanong: "Kung mapatunayang authentic ang mga dokumento ng may-ari matapos ma-seize ang goods, awtomatiko na bang ma-release ito?" Sagot: Hindi awtomatiko — kahit mapatunayang authentic ang mga dokumento, ang District Collector ay dapat pa ring gumawa ng release sa loob ng 15 araw mula sa pagtanggap ng motion, at ito ay subject pa rin sa clearance ng Commissioner, at dapat hindi ito labag sa batas.

🔗 Related Topics
Section 214 (Persons Exercising Police Authority), Section 216 (Exercise of Power of Seizure), 2024-02 OCOM MEMO.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 224 ng CMTA (Republic Act No. 10863) tungkol sa power to inspect and visit ng Commissioner. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang dalawang 15-day timelines at ang proseso ng release, banggitin ang 2024-02 OCOM MEMO, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},480:{_label:"section 300 — Customs Jurisdiction",title:"Section 300: Saan Sumasaklaw ang Jurisdiction ng Bureau of Customs?",content:`📖 Kahulugan
Ang Section 300 ay naglalarawan sa malawak na jurisdiction ng Bureau of Customs — sumasaklaw ito sa lahat ng dagat sa loob ng Philippine territory, lahat ng coasts, ports, airports, harbors, bays, rivers, at inland waters (navigable man o hindi), kasama ang kahit anong paraan ng transportasyon. May karagdagang "hot pursuit" doctrine din dito na nagpapahintulot sa Bureau na ituloy ang paghabol sa isang barko o eroplano kahit lumabas na ito sa territorial waters o airspace ng Pilipinas.

🔍 Breakdown
- Jurisdiction Over All Seas Within Philippine Territory – malawak na saklaw ng karagdagang water territory.
- Coasts, Ports, Airports, Harbors, Bays, Rivers, Inland Waters – detalyadong listahan ng mga lokasyon, kasama ang mga hindi navigable na ilog o katubigan.
- Any Means of Conveyance – kahit anong paraan ng transportasyon, hindi lang barko o eroplano.
- Pursue Imported Goods Subject to Seizure – aktibong kapangyarihang habulin ang goods na dapat i-seize, saan man ito dinadala.
- Pursuit May Continue Beyond Territorial Waters/Air Space – ang "hot pursuit" doctrine — kung nagsimula ang paghabol sa loob ng Philippine territory, pwede itong magpatuloy kahit lumabas na sa high seas o international airspace.
- Seizure in High Seas or International Air Space – ang huling resulta ng valid na hot pursuit — pwedeng ma-seize kahit nasa labas na ng Philippine territory.

💡 Simpleng Paliwanag
Malawak talaga ang saklaw ng kapangyarihan ng Bureau of Customs — hindi lang sa mga opisyal na daungan, kundi pati na rin sa lahat ng katubigan sa loob ng Pilipinas, at kahit saang paraan ng transportasyon dinadala ang goods. Kung may barko o eroplanong sumusubok tumakas matapos itong ma-flag para sa seizure, pwede pa rin itong habulin ng Bureau of Customs kahit lumabas na ito sa territorial waters o airspace natin — parang "hot pursuit" sa mga pelikula, pero para sa customs enforcement.

📦 Halimbawa
May isang barkong nagdadala ng smuggled goods na natukoy habang papalapit sa Port of Zamboanga. Nang mapansin ng mga awtoridad na sinusubukan itong tumakas patungo sa international waters matapos itong i-flag para sa seizure, sa ilalim ng Section 300, maaaring ipagpatuloy ng Bureau of Customs ang paghabol dito kahit lumabas na ito sa territorial waters ng Pilipinas, hanggang sa maabutan at ma-seize ito sa high seas.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil binibigyan nito ng malawak at epektibong kapangyarihan ang Bureau of Customs na labanan ang smuggling — kung limitado lang sana ang kanilang jurisdiction sa loob ng territorial waters, madaling makakatakas ang mga smuggler sa pamamagitan lang ng paglabas sa Philippine waters.

⚠️ Dapat Tandaan
Ang "hot pursuit" doctrine ay may specific na requirement — dapat NAGSIMULA ang paghabol sa loob ng territorial waters o airspace bago ito magpatuloy sa labas nito; hindi ito basta pwedeng gamitin kung ang barko o eroplano ay wala na talaga sa loob ng Philippine jurisdiction mula sa simula pa lang.

🎯 Board Exam Tip
I-relate ang "hot pursuit" doctrine na ito sa international law principles tungkol sa maritime jurisdiction — madalas itong itanong bilang applied concept sa customs enforcement.

❓ Madalas Malito ang Students
Tanong: "Pwede bang habulin ng Bureau of Customs ang isang barko sa high seas kahit hindi ito nagsimula ang paghabol sa loob ng Philippine territorial waters?" Sagot: Batay sa malinaw na wika ng batas, ang pursuit ay dapat "began within the territorial waters or air space" bago ito magpatuloy sa labas nito — kung hindi nagsimula sa loob ng Philippine jurisdiction ang paghabol, maaaring hindi na ito covered ng doctrine na ito.

🔗 Related Topics
Section 214 (Persons Exercising Police Authority), Section 215 (Place Where Authority May Be Exercised), Section 216 (Exercise of Power of Seizure), CAO 03-2019, CAO 01-2022.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 300 ng CMTA (Republic Act No. 10863) tungkol sa Customs Jurisdiction, kasama ang 'hot pursuit' doctrine. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Sections 214-216 tungkol sa police authority, banggitin ang CAO 03-2019 at CAO 01-2022, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},482:{_label:"section 301 — Customs Control Over Goods",title:"Section 301: Customs Control sa Lahat ng Goods na Pumapasok at Lumalabas",content:`📖 Kahulugan
Ang Section 301 ay nagsasaad na LAHAT ng goods, kasama ang means of transport, na pumapasok o lumalabas sa customs territory, ay subject sa customs control — kahit pa liable man sila sa duties and taxes o hindi. Ginagamit ng Bureau ang audit-based controls, risk management systems, automation, at compliance measurement strategy para sa epektibong customs control, at nakikipagtulungan din sila sa ibang customs administrations at government agencies.

🔍 Breakdown
- All Goods, Including Means of Transport – malawak na saklaw, kasama pati ang sasakyang gamit sa pagdadala.
- Entering or Leaving the Customs Territory – parehong papasok at palabas na direksyon ang covered.
- Regardless of Whether Liable to Duties and Taxes – kahit exempted o hindi kailangang magbayad, subject pa rin sa customs control.
- Audit-Based Controls and Risk Management Systems – modernong approach sa customs enforcement, hindi lang basic inspection.
- Automation to the Fullest Extent Possible – paggamit ng teknolohiya para sa efficiency.
- Compliance Measurement Strategy – sistema para sukatin kung gaano ka-compliant ang mga stakeholders.
- Mutual Administrative Assistance Agreements – pakikipagtulungan sa ibang bansa para sa mas epektibong customs control.
- Coordinate with Other Government Agencies, Free Zone Authorities, and Stakeholders – malawak na collaboration approach.

💡 Simpleng Paliwanag
Hindi lang basta "dutiable" na goods ang sinusubaybayan ng Bureau of Customs — LAHAT ng goods na pumapasok o lumalabas sa Pilipinas, kahit exempted pa sa duties/taxes, ay nasa ilalim pa rin ng customs control. Gumagamit din sila ng modernong teknolohiya at data analysis, hindi lang basic manual checking, at nakikipag-coordinate sila sa ibang ahensya para mas epektibo ang buong sistema.

📦 Halimbawa
May isang shipment ng relief goods (na exempted sa duties at taxes base sa Section 121) na dumating sa Port of Cebu matapos ang isang kalamidad. Kahit exempted ito sa bayad, subject pa rin ito sa customs control ng Bureau — kasama ang risk assessment at monitoring, para matiyak na tunay na relief goods ito at hindi ginagamit bilang paraan ng smuggling.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng comprehensive na framework para sa customs oversight — hindi ito basta "revenue collection" lang, kundi malawak na control system na sumasaklaw sa lahat ng goods, may bayad man o wala.

⚠️ Dapat Tandaan
Ang "regardless of whether they are liable to duties and taxes" ay mahalagang parte — huwag isipin na ang exempted goods (tulad ng relief consignment) ay lubos nang "libre" sa customs oversight; subject pa rin sila sa control, kahit hindi na kailangang magbayad.

🎯 Board Exam Tip
I-memorize ang apat na modernong tools na ginagamit: audit-based controls, risk management systems, automation, at compliance measurement strategy — madalas itong specific na tinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kung exempted na sa duties and taxes ang isang shipment (tulad ng relief consignment), hindi na ba ito kailangang dumaan pa sa customs control?" Sagot: Hindi tama iyan — malinaw sa batas na LAHAT ng goods, "regardless of whether they are liable to duties and taxes," ay subject pa rin sa customs control; ang exemption ay tumutukoy lang sa bayad, hindi sa oversight ng Bureau.

🔗 Related Topics
Section 121 (Duty and Tax Treatment ng Relief Consignment), Section 300 (Customs Jurisdiction), CMO 09-2020 (AEO Program), CMO 31-2018.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 301 ng CMTA (Republic Act No. 10863) tungkol sa Customs Control Over Goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang modernong tools na ginagamit tulad ng risk management at automation, banggitin ang CMO 09-2020 at CMO 31-2018, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},483:{_label:"section 302 — Enforcement of Port Regulation of the Bureau of Quarantine",title:"Section 302: Pakikipagtulungan sa Bureau of Quarantine",content:`📖 Kahulugan
Ang Section 302 ay nag-oobliga sa mga customs officials at empleyado na makipagtulungan sa quarantine authorities sa pagpapatupad ng port quarantine regulations na ginawa ng Bureau of Quarantine, at dapat nilang ipatupad ito kung ito ay may kinalaman sa shipping at navigation matters.

🔍 Breakdown
- Customs Officials and Employees Shall Cooperate – obligasyon ng Bureau of Customs na tumulong, hindi lang basic awareness.
- Quarantine Authorities – ang Bureau of Quarantine, na may sariling health-related regulations sa mga daungan.
- Port Quarantine Regulations – mga specific na batas o alituntunin tungkol sa health at sanitation sa mga port.
- Give Effect to the Same – dapat aktibong ipatupad, hindi lang tanggapin.
- Insofar as Connected with Matters of Shipping and Navigation – may limitasyon — dapat may koneksyon sa shipping at navigation, hindi general health matters.

💡 Simpleng Paliwanag
Ang Bureau of Customs ay hindi lang basta focus sa duties at taxes — obligado rin silang tumulong sa Bureau of Quarantine sa pagpapatupad ng health-related regulations sa mga daungan, lalo na kung may kinalaman ito sa mga barko, eroplano, at ibang shipping/navigation matters.

📦 Halimbawa
Sa panahon ng isang health emergency, nag-implement ang Bureau of Quarantine ng bagong protocol para sa mga barkong dumarating mula sa mga bansang may outbreak. Bilang bahagi ng kanilang obligasyon sa ilalim ng Section 302, tumulong ang mga customs officials sa Port of Manila para ipatupad ang mga health screening requirements na ito bago pahintulutan ang mga barko na mag-dock.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ipinapakita nito na ang Bureau of Customs ay hindi nag-iisang ahensya sa mga daungan — kailangan ng inter-agency cooperation, lalo na sa mga isyung may kinalaman sa public health at safety.

⚠️ Dapat Tandaan
May limitasyon ang saklaw ng cooperation — dapat ito ay "connected with matters of shipping and navigation," hindi general health enforcement na wala nang koneksyon sa customs operations.

🎯 Board Exam Tip
I-relate ito sa modernong context tulad ng COVID-19 pandemic protocols — magandang halimbawa ito ng inter-agency cooperation sa pagitan ng Bureau of Customs at Bureau of Quarantine.

❓ Madalas Malito ang Students
Tanong: "Ang Bureau of Customs ba ang gumagawa ng quarantine regulations?" Sagot: Hindi — ang Bureau of Quarantine ang gumagawa at nagpo-promulgate ng port quarantine regulations; ang tungkulin lang ng Bureau of Customs ay makipagtulungan at magpatupad nito kung may koneksyon sa shipping at navigation matters.

🔗 Related Topics
Section 301 (Customs Control Over Goods), CAO 15-2020, CMO 05-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 302 ng CMTA (Republic Act No. 10863) tungkol sa enforcement ng port regulations ng Bureau of Quarantine. I-explain nang simple, magbigay ng practical na halimbawa, banggitin ang CAO 15-2020 at CMO 05-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},484:{_label:"section 303 — Control Over Premises Used for Customs Purposes",title:"Section 303: Exclusive Control ng Bureau sa mga Customs Premises",content:`📖 Kahulugan
Ang Section 303 ay nagbibigay sa Bureau of Customs ng exclusive control, direction, at management sa mga customs offices, facilities, warehouses, ports, airports, wharves, infrastructure, at ibang premises sa loob ng Customs Districts, para sa customs purposes. Pero hindi ito nakaka-prejudice sa general police powers ng LGUs, Philippine Coast Guard, at ibang law enforcement agencies sa pag-eexercise ng kani-kanilang functions.

🔍 Breakdown
- Exclusive Control, Direction and Management – malakas na termino, ibig sabihin ang Bureau ang "boss" sa mga premises na ito para sa customs purposes.
- Customs Offices, Facilities, Warehouses, Ports, Airports, Wharves, Infrastructure – malawak na listahan ng mga saklaw na lugar.
- For Customs Purposes – ang limitasyon — ang exclusivity ay applicable lang sa customs-related matters.
- Without Prejudice to General Police Powers of LGUs, PCG, and Law Enforcement Agencies – mahalagang exception — hindi ito nangangahulugang wala nang authority ang ibang agencies sa parehong lugar.

💡 Simpleng Paliwanag
Sa loob ng mga customs premises — tulad ng port, airport, o warehouse — ang Bureau of Customs ang may pangunahing kontrol, PERO para lang ito sa customs matters. Hindi ito nangangahulugang wala nang karapatan ang LGU, Coast Guard, o pulis na mag-eexercise ng kanilang sariling authority sa parehong lugar, kung ito ay may kinalaman sa kanilang sariling mandato.

📦 Halimbawa
Sa Manila International Container Port, ang Bureau of Customs ang may pangunahing kontrol sa mga customs warehouse at examination areas — sila ang nagdedesisyon kung sino ang makakapasok at ano ang mga proseso doon. Pero kung may crime na naganap sa parehong lugar (halimbawa, physical assault), ang PNP pa rin ang may authority na mag-imbestiga base sa kanilang general police power, hindi ito hinaharangan ng exclusive control ng Bureau of Customs.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nililinaw nito ang scope ng authority ng Bureau of Customs sa mga premises na sila ang nangangasiwa, habang tinitiyak din na hindi ito nakaka-conflict sa authority ng ibang law enforcement agencies.

⚠️ Dapat Tandaan
I-relate ito sa Section 215 — ang "customs premises" na binabanggit dito ay ang parehong konsepto na ginagamit sa Section 215 tungkol sa lugar kung saan puwedeng i-exercise ang police authority.

🎯 Board Exam Tip
I-memorize ang exception clause: "without prejudice to the general police powers of the LGUs, the Philippine Coast Guard and law enforcement agencies" — madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Ibig bang sabihin, exclusive na exclusive ang kontrol ng Bureau of Customs sa mga premises na ito, wala nang ibang ahensya na pwedeng pumasok?" Sagot: Hindi — malinaw sa batas na ang exclusivity ay "for customs purposes" lang, at hindi ito nakaka-prejudice sa general police powers ng LGUs, Coast Guard, at ibang law enforcement agencies sa pag-eexercise ng kanilang sariling functions sa parehong lugar.

🔗 Related Topics
Section 215 (Place Where Authority May Be Exercised), Section 304 (Power of the President to Subject Premises to Customs Jurisdiction), Section 305 (Trespass or Obstruction).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 303 ng CMTA (Republic Act No. 10863) tungkol sa control ng Bureau of Customs sa mga premises. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 215, linawin ang exception para sa LGU/Coast Guard/law enforcement, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},485:{_label:"section 304 — Power of the President to Subject Premises to Customs Jurisdiction",title:"Section 304: Kapangyarihan ng Pangulo na Isailalim ang Premises sa Customs Jurisdiction",content:`📖 Kahulugan
Ang Section 304 ay nagbibigay sa Pangulo ng kapangyarihan, sa pamamagitan ng executive order at kung kailangan ng public interest, na i-declare ang anumang public wharf, landing place, infrastructure, street, o land sa kahit anong port of entry na nasa ilalim ng jurisdiction ng Bureau, para sa customs purposes at/o para pahintulutan ang isang port o terminal operator na ilipat ang mga overstaying cargo sa isang inland depot o terminal.

🔍 Breakdown
- Upon Recommendation... When Public Interest Requires – dalawang trigger requirement — dapat kinakailangan ito para sa public interest.
- By Executive Order – ang legal mechanism na gagamitin ng Pangulo.
- Public Wharf, Landing Place, Infrastructure, Street or Land – malawak na saklaw ng mga lugar na maaaring isailalim sa customs jurisdiction.
- In Any Port of Entry Under the Jurisdiction of the Bureau – dapat ito ay nasa loob ng existing port of entry.
- For Customs Purposes – ang layunin ng declaration.
- Authorize Transfer of Overstaying Cargoes to Inland Depot or Terminal – karagdagang authority na ipahintulot ang paglipat ng mga cargo na matagal nang naka-imbak.

💡 Simpleng Paliwanag
Kung kinakailangan para sa public interest, may kapangyarihan ang Pangulo na palawigin ang jurisdiction ng Bureau of Customs sa mga karagdagang lugar sa loob ng isang port — tulad ng streets o infrastructure na hindi pa dating covered. Pwede rin niyang pahintulutan ang paglipat ng mga cargo na matagal nang naka-store papunta sa ibang lugar, para hindi masyadong ma-congest ang mismong port.

📦 Halimbawa
Dahil sa matinding congestion sa Port of Manila dulot ng napakaraming overstaying cargo, nag-isyu ang Pangulo ng executive order para pahintulutan ang terminal operator na ilipat ang mga overstaying cargo sa isang inland depot sa Laguna, para mas mapadali ang operations sa pangunahing port.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng flexibility sa gobyerno na i-expand ang customs jurisdiction o i-manage ang problema ng port congestion, sa pamamagitan ng mataas na antas ng authority (Presidential executive order).

⚠️ Dapat Tandaan
Ang batas ay nagsasaad na "upon the recommendation of the Secretary of Finance" sa simula ng probisyon (base sa context ng ibang similar provisions), pero hindi ito explicit na nakasaad sa text na ibinigay — mahalagang basahin nang mabuti ang eksaktong wika ng batas.

🎯 Board Exam Tip
I-relate ito sa Section 208 (Power of the President to Open and Close Any Port) — parehong Presidential power ito tungkol sa ports, pero magkaiba ang specific na saklaw.

❓ Madalas Malito ang Students
Tanong: "Ano ang pagkakaiba ng Section 304 sa Section 208?" Sagot: Magkaiba ang saklaw — ang Section 208 ay tungkol sa pagbubukas o pagsasara ng isang buong port of entry, habang ang Section 304 ay tungkol sa pag-declare ng specific na premises (wharf, street, land, atbp.) sa loob ng isang existing port bilang customs jurisdiction, o pagpapahintulot ng cargo transfer sa inland depot.

🔗 Related Topics
Section 208 (Power of the President to Open and Close Any Port), Section 303 (Control Over Premises Used for Customs Purposes).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 304 ng CMTA (Republic Act No. 10863) tungkol sa kapangyarihan ng Pangulo na isailalim ang mga premises sa customs jurisdiction. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa Section 208, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},486:{_label:"section 305 — Trespass or Obstruction of Customs Premises",title:"Section 305: Bawal Pumasok o Humarang sa Customs Premises Nang Walang Authority",content:`📖 Kahulugan
Ang Section 305 ay nagbabawal sa kahit sinong tao na pumasok o humarang sa isang customs office, warehouse, port, airport, wharf, o ibang premises na nasa ilalim ng kontrol ng Bureau, nang walang prior authority — kasama pati ang mga kalye o eskinita kung saan matatagpuan ang mga facilities na ito.

🔍 Breakdown
- No Person Shall Enter or Obstruct – dalawang klase ng bawal na aksyon — pagpasok at paghadlang.
- Customs Office, Warehouse, Port, Airport, Wharf, or Other Premises – malawak na listahan ng mga protektadong lugar.
- Under the Control of the Bureau – dapat ito ay nasa ilalim ng kontrol ng Bureau of Customs, konektado sa Section 303.
- Without Prior Authority – ang key requirement — walang bawal kung may authorization.
- Including Streets or Alleys Where These Facilities Are Located – kasama pati ang access roads papunta sa mga facilities.

💡 Simpleng Paliwanag
Hindi puwedeng basta-basta pumasok o humadlang sa mga customs facilities — kailangan munang may authorization bago ito gawin. At hindi lang ang mismong building o warehouse ang protektado, pati na rin ang mga kalye at eskinita na papunta rito.

📦 Halimbawa
May grupo ng protesters na nagplanong humarang sa entrance ng isang customs warehouse sa Port of Cebu bilang bahagi ng isang demonstration. Dahil wala silang prior authority na gawin ito, maaari silang managot sa ilalim ng Section 305 dahil sa pagharang sa customs premises.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para protektahan ang normal na operations ng Bureau of Customs laban sa unauthorized na pagpasok o paghadlang, na maaaring makasagabal sa epektibong pagpapatupad ng customs functions.

⚠️ Dapat Tandaan
Malawak ang saklaw ng "premises" dito — hindi lang ang building mismo, kundi pati na rin ang mga streets at alleys na access papunta sa facility.

🎯 Board Exam Tip
I-relate ito sa Section 303 (Control Over Premises) — ang mga lugar na protektado sa Section 305 ay ang parehong mga lugar na nasa ilalim ng exclusive control ng Bureau sa Section 303.

❓ Madalas Malito ang Students
Tanong: "Kasama ba sa bawal na entry ang mga ordinaryong dumadaan lang sa kalye malapit sa isang customs warehouse?" Sagot: Ang batas ay malawak ang saklaw hanggang sa "streets or alleys where these facilities are located," pero ang pangunahing layunin nito ay pigilan ang unauthorized entry o obstruction na may kinalaman sa customs operations, hindi ang basic pagdaan ng publiko sa mga pampublikong daan.

🔗 Related Topics
Section 303 (Control Over Premises Used for Customs Purposes), Section 304 (Power of the President to Subject Premises to Customs Jurisdiction).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 305 ng CMTA (Republic Act No. 10863) tungkol sa trespass o obstruction ng customs premises. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 303, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},487:{_label:"section 306 — Special Surveillance for the Protection of Customs Revenue",title:"Section 306: Special Surveillance ng Bureau kasama ang Papel ng Philippine Coast Guard",content:`📖 Kahulugan
Ang Section 306 ay nag-oobliga sa Bureau of Customs na magsagawa ng surveillance sa mga barko o eroplanong papasok sa Philippine territory at sa mga imported goods na papasok sa customs office. Malinaw ding sinasabi na ang function ng Philippine Coast Guard na pigilan at supilin ang illegal na entry ng goods, smuggling, at ibang customs fraud, gayundin ang kanilang surveillance function sa mga barko, ay patuloy pa ring magkakabisa base sa Republic Act No. 9993 (Philippine Coast Guard Law of 2009).

🔍 Breakdown
- Bureau Shall Conduct Surveillance – aktibong tungkulin ng Bureau of Customs na mag-monitor.
- Vessels or Aircrafts Entering Philippine Territory – ang mga sasakyang paksa ng surveillance.
- Imported Goods Entering the Customs Office – kasama rin ang mismong goods, hindi lang ang means of transport.
- Philippine Coast Guard Function Continues to Be in Force – malinaw na hindi na-supersede o na-replace ng CMTA ang existing na authority ng PCG sa ilalim ng RA 9993.
- Prevent and Suppress Illegal Entry, Smuggling, Customs Fraud, Maritime Law Violations – ang malawak na saklaw ng PCG mandate na kinikilala rito.

💡 Simpleng Paliwanag
Hindi lang mag-isa ang Bureau of Customs sa surveillance duties — sila ay may sariling tungkulin na mag-monitor ng mga papasok na barko, eroplano, at goods, pero malinaw ding sinasabi ng batas na ang Philippine Coast Guard ay may sarili ring surveillance at enforcement function base sa kanilang sariling batas (RA 9993), at hindi ito na-a-alis ng CMTA.

📦 Halimbawa
Sa dagat malapit sa Batangas, ang Bureau of Customs ay nagmomonitor ng mga imported goods na dumarating sa kanilang customs office, habang ang Philippine Coast Guard naman ay may sariling patrol at surveillance operations sa mismong karagatan, base sa kanilang mandato sa ilalim ng RA 9993 — parehong umiiral at nagkukumplementuhan ang dalawang klase ng surveillance.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nililinaw nito na hindi nag-iisa ang Bureau of Customs sa larangan ng maritime at customs enforcement — may kasamang ibang ahensya tulad ng PCG na may sariling legal mandate, at dapat magkaugnay ang trabaho nila.

⚠️ Dapat Tandaan
Mahalagang tandaan na ang batas ay explicit na nagsasabing "shall continue to be in force" ang function ng PCG — ibig sabihin hindi ito na-diminish o na-override ng CMTA, magkatuwang silang gumagana.

🎯 Board Exam Tip
I-memorize ang reference sa RA 9993 (Philippine Coast Guard Law of 2009) — madalas itong specific na binabanggit sa exam bilang related law sa customs enforcement.

❓ Madalas Malito ang Students
Tanong: "Kung may surveillance function na ang Bureau of Customs, ibig bang sabihin nawalan na ng ganitong function ang Philippine Coast Guard?" Sagot: Hindi — malinaw na nakasaad sa batas na ang function ng PCG sa ilalim ng RA 9993 ay "shall continue to be in force," ibig sabihin patuloy pa rin silang may sariling surveillance at enforcement mandate, hindi ito na-alis ng CMTA.

🔗 Related Topics
Section 300 (Customs Jurisdiction), Republic Act No. 9993 (Philippine Coast Guard Law of 2009).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 306 ng CMTA (Republic Act No. 10863) tungkol sa special surveillance para sa customs revenue protection at ang papel ng Philippine Coast Guard. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa RA 9993, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},488:{_label:"section 307 — Temporary Storage of Goods",title:"Section 307: Sistema Para sa Temporary Storage ng Abandoned o Overstaying Goods",content:`📖 Kahulugan
Ang Section 307 ay nag-oobliga sa Commissioner, subject sa rules and regulations na ii-issue ng Secretary of Finance, na magtatag ng isang sistema para sa temporary storage ng mga imported goods bago pa man ma-file ang goods declaration, partikular na para sa mga abandoned o overstaying goods.

🔍 Breakdown
- Subject to Rules and Regulations by the Secretary of Finance – kailangan ng implementing rules mula sa Secretary of Finance.
- Commissioner Shall Establish a System – obligasyon ng Commissioner na gumawa ng ganitong sistema.
- Temporary Storage of Imports Prior to Goods Declaration – ang layunin — imbakan ang goods bago pa man ma-file ang official declaration.
- Abandoned or Overstaying Goods – specific na klase ng goods na covered — yung mga hindi na-claim o matagal nang naka-imbak.

💡 Simpleng Paliwanag
Kung may mga goods na naiwan o na-abandon ng may-ari, o kaya naman ay matagal nang naka-store nang walang aksyon (overstaying), kailangan ng Bureau ng isang malinaw na sistema kung paano ito ii-store nang pansamantala bago pa man dumaan sa buong proseso ng goods declaration — para hindi basta na lang "nakalat" ang mga ito sa mga customs facility.

📦 Halimbawa
May isang container ng imported furniture sa Port of Batangas na hindi na-claim ng importer sa loob ng ilang buwan matapos itong dumating. Sa ilalim ng Section 307, dapat may established na sistema ang Bureau of Customs kung saan pwedeng i-store nang pansamantala ang ganitong klaseng overstaying goods, habang hinihintay ang susunod na hakbang (tulad ng abandonment proceedings).

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa maayos na pamamahala ng mga goods na hindi pa completely naprocess — nagbibigay ito ng structured na paraan para hawakan ang mga abandoned o overstaying shipment, sa halip na basta na lang "nakatambak" ito sa daungan.

⚠️ Dapat Tandaan
Ang "temporary storage" system na ito ay specific para sa goods na WALA PANG goods declaration — iba ito sa regular na warehousing ng mga goods na dumaan na sa proper na customs process.

🎯 Board Exam Tip
I-relate ito sa konsepto ng "abandonment" sa customs law — mahalagang topic ito na madalas konektado sa temporary storage at disposal proceedings.

❓ Madalas Malito ang Students
Tanong: "Ano ang pagkakaiba ng 'temporary storage' dito sa regular na customs bonded warehouse?" Sagot: Ang batas mismo ay hindi nagbibigay ng detalyadong pagkakaiba sa pagitan ng dalawa sa text na ito — ang Section 307 ay tungkol sa isang sistema partikular para sa abandoned o overstaying goods bago pa man ma-file ang goods declaration, habang ang customs bonded warehouse ay may sariling separate na framework base sa ibang probisyon ng CMTA at CAO 01-2022.

🔗 Related Topics
Section 301 (Customs Control Over Goods), CAO 09-2019, CAO 17-2019 (Abandonment).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 307 ng CMTA (Republic Act No. 10863) tungkol sa temporary storage ng abandoned o overstaying goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang konsepto ng abandonment, banggitin ang CAO 09-2019 at CAO 17-2019, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},491:{_label:"section 400 — Goods to be Imported through Customs Office",title:"Section 400: Dapat Dumaan sa Customs Office ang Lahat ng Imported Goods",content:`📖 Kahulugan
Ang Section 400 ay nagsasaad na lahat ng goods na ini-import papunta sa Pilipinas ay dapat na-eenter sa pamamagitan ng isang customs office sa isang port of entry, o kaya naman ay maaaring ma-admit o ma-remove mula sa isang free zone, depende sa sitwasyon.

🔍 Breakdown
- All Goods Imported into the Philippines – walang exception, dapat lahat ng imported goods ay saklaw nito.
- Entered through a Customs Office at a Port of Entry – ang default rule — dapat dumaan sa opisyal na customs office na nasa isang official port of entry.
- Admitted to or Removed from a Free Zone – ang alternative na proseso — para sa goods na papasok o lalabas sa free zones (tulad ng PEZA, Clark, Subic), may sarili itong proseso.
- As the Case May Be – nagpapakita na depende sa sitwasyon, alinman sa dalawang proseso ang applicable.

💡 Simpleng Paliwanag
Walang "backdoor" na paraan para magpasok ng goods sa Pilipinas — dapat lahat ito ay dumaan sa opisyal na customs office sa isang tamang port, maliban na lang kung ang destinasyon ay isang free zone tulad ng Clark o Subic, na may sarili namang proseso.

📦 Halimbawa
May isang kumpanya na nag-import ng raw materials mula China. Dahil ang destinasyon ng kanilang factory ay nasa loob ng Clark Freeport Zone, dumaan ang kanilang shipment sa proseso ng admission sa free zone, sa halip na sa regular na customs office entry na ginagamit ng mga ordinaryong importer.

⭐ Bakit Mahalaga Ito?
Ito ang foundational rule na nagtitiyak na lahat ng imported goods ay may malinaw na entry point at proseso — walang goods na "nakakalusot" nang hindi dumadaan sa alinman sa dalawang opisyal na channel.

⚠️ Dapat Tandaan
Huwag isipin na ang free zone entry ay "loophole" o paraan para makaiwas sa customs — ito ay opisyal na alternative na proseso na may sarili ring regulasyon.

🎯 Board Exam Tip
I-memorize ang dalawang paraan ng entry: (1) regular customs office sa port of entry, at (2) admission/removal sa free zone — parehong opisyal na proseso.

❓ Madalas Malito ang Students
Tanong: "Ibig bang sabihin, hindi na kailangan ng customs process ang goods na papunta sa free zone?" Sagot: Hindi tama iyan — ang free zone ay may sarili pa ring proseso ng "admission," ito ay iba lang sa regular na customs office entry, hindi ito nangangahulugang wala nang customs oversight.

🔗 Related Topics
Section 401 (Importations Subject to Goods Declaration), konsepto ng Free Zones.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 400 ng CMTA (Republic Act No. 10863) tungkol sa Goods to be Imported through Customs Office. I-explain nang simple, magbigay ng practical na halimbawa tungkol sa free zones tulad ng Clark o Subic, ipaliwanag ang koneksyon nito sa Section 401, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},492:{_label:"section 401 — Importations Subject to Goods Declaration",title:"Section 401: Ang Limang Klase ng Goods Declaration",content:`📖 Kahulugan
Ang Section 401 ay nagsasaad na, maliban na lang kung may ibang provision ang CMTA, lahat ng imported goods ay subject sa paglo-lodge ng goods declaration. May limang klase ng goods declaration: para sa consumption, customs bonded warehousing, admission, conditional importation, o customs transit.

🔍 Breakdown
- Unless Otherwise Provided for in This Act – may exception clause, hindi absolute ang requirement.
- All Imported Goods Shall Be Subject to Lodgement of Goods Declaration – ang general rule — dapat may declaration.
- For Consumption – ang pinaka-karaniwang klase, para sa goods na gagamitin o ibebenta sa domestic market.
- For Customs Bonded Warehousing – para sa goods na iiimbak muna sa bonded warehouse.
- For Admission – para sa goods na papasok sa free zone.
- For Conditional Importation – para sa goods na may specific na kondisyon bago ma-release.
- For Customs Transit – para sa goods na dadaan lang sa Pilipinas patungo sa ibang bansa.

💡 Simpleng Paliwanag
Hindi lahat ng imported goods ay parehong klase ng declaration ang ginagamit — depende sa layunin ng pag-import (gagamitin agad, iiimbak, papunta sa free zone, may kondisyon, o dadaan lang), may kaukulang tamang klase ng goods declaration na dapat gamitin.

📦 Halimbawa
May isang trading company na nag-import ng electronics para direktang ibenta sa Pilipinas — gagamit sila ng "goods declaration for consumption." Samantala, ang isa pang kumpanya na nag-import ng raw materials para iimbak muna sa isang bonded warehouse bago gamitin sa production ay gagamit ng "goods declaration for customs bonded warehousing."

⭐ Bakit Mahalaga Ito?
Mahalagang maintindihan ang limang klase na ito dahil ito ang magdedetermine kung anong proseso, requirements, at duty treatment ang applicable sa isang partikular na shipment.

⚠️ Dapat Tandaan
May exception ang general rule — "unless otherwise provided for in this Act" ibig sabihin may ibang probisyon ng CMTA na maaaring mag-exempt sa requirement na ito.

🎯 Board Exam Tip
I-memorize ang limang klase ng goods declaration: consumption, customs bonded warehousing, admission, conditional importation, at customs transit — madalas itong direktang tinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Parehas ba ang proseso at requirements ng lahat ng klase ng goods declaration?" Sagot: Hindi — magkaiba ang layunin at konteksto ng bawat klase, kaya naman magkaiba rin ang specific na requirements at proseso na applicable sa bawat isa, base sa ibang probisyon ng CMTA.

🔗 Related Topics
Section 400 (Goods to be Imported through Customs Office), Section 402 (Goods Declaration for Consumption), Section 403 (Provisional Goods Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 401 ng CMTA (Republic Act No. 10863) tungkol sa limang klase ng goods declaration. I-explain nang simple, magbigay ng practical na halimbawa para sa bawat klase, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},493:{_label:"section 402 — Goods Declaration for Consumption",title:"Section 402: Formal at Informal Entry Process para sa Consumption",content:`📖 Kahulugan
Ang Section 402 ay naglalarawan sa dalawang proseso ng pag-clear ng goods declaration for consumption — ang formal entry process (default) at ang informal entry process (para sa mga specific na exception na goods).

🔍 Breakdown
- Formal Entry Process – ang default na proseso para sa lahat ng goods declaration for consumption.
- Informal Entry Process – simplified na proseso para sa specific na klase ng goods (tingnan ang paragraphs a-b).
- Commissioner May Adjust the Value – may authority ang Commissioner na baguhin ang value threshold ng goods na covered ng informal entry.

💡 Simpleng Paliwanag
Kapag mag-i-import ka ng goods para gamitin o ibenta sa Pilipinas (consumption), karaniwan itong dadaan sa "formal" na proseso — puno ng requirements. Pero may ilang specific na sitwasyon (maliit na commercial shipment, personal effects) kung saan pwede nang gamitin ang mas simple at mas mabilis na "informal" na proseso.

📦 Halimbawa
May isang OFW na dumating mula sa Middle East na may dalang personal effects sa kanyang baggage. Dahil hindi ito commercial quantity, gagamit siya ng informal entry process, na mas mabilis at mas simple kumpara sa isang malaking commercial shipment na dadaan sa formal entry process.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para maiwasan ang "one-size-fits-all" na approach — hindi kailangan ng parehong level ng scrutiny ang isang maliit na personal shipment kumpara sa malaking commercial cargo.

⚠️ Dapat Tandaan
Ang informal entry process ay hindi "walang customs control" — mas simple lang ang proseso, hindi ito nangangahulugang exempted na sa duties/taxes o customs oversight.

🎯 Board Exam Tip
I-relate ito sa paragraphs (a) at (b) — kailangan mong malaman ang exact na value threshold (P50,000) at ang konsepto ng "personal at household effects, hindi commercial quantity."

❓ Madalas Malito ang Students
Tanong: "Automatic bang formal entry ang gagamitin sa lahat ng goods declaration for consumption?" Sagot: Hindi — malinaw sa batas na formal entry ang default "except" para sa mga goods na covered ng paragraphs (a) at (b), na dadaan sa informal entry process.

🔗 Related Topics
Section 401 (Importations Subject to Goods Declaration), paragraphs (a) at (b), CAO 02-2021.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 402 ng CMTA (Republic Act No. 10863) tungkol sa formal at informal entry process para sa goods declaration for consumption. I-explain nang simple, magbigay ng practical na halimbawa, banggitin ang CAO 02-2021, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},494:{_label:"paragraph (a) — Commercial Goods Under P50,000",title:"Section 402(a): Commercial Goods na Mas Mababa sa P50,000 (Informal Entry)",content:`📖 Kahulugan
Saklaw ng informal entry process ang mga goods na commercial nature na ang FOB (Free on Board) o FCA (Free Carrier At) value ay mas mababa sa limampung libong piso (P50,000.00). Bawat tatlong (3) taon matapos ang effectivity ng CMTA, ia-adjust ng Secretary of Finance ang halagang ito base sa Consumer Price Index (CPI) na inilalathala ng PSA.

🔍 Breakdown
- Goods of a Commercial Nature – dapat commercial ang layunin, hindi personal.
- FOB or FCA Value Less Than P50,000 – specific na value threshold, base sa alinman sa dalawang trading terms.
- Every Three Years, Secretary of Finance Shall Adjust – periodic adjustment base sa inflation.
- Using the CPI as Published by PSA – ang basehan ng adjustment computation.

💡 Simpleng Paliwanag
Kung commercial ang layunin ng iyong maliit na shipment (halimbawa, sample o maliit na batch ng produkto) at mas mababa sa P50,000 ang value nito (base sa FOB o FCA), pwede mo nang gamitin ang mas simple at mabilis na informal entry process, sa halip na dumaan sa buong formal entry process.

📦 Halimbawa
May isang online seller na nag-import ng sample products mula China na nagkakahalaga lang ng P30,000 (FOB value) para i-test sa lokal na market. Dahil ito ay commercial goods pero mas mababa sa P50,000 threshold, maaari niyang gamitin ang informal entry process, na mas mabilis at mas simple.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa maliliit na negosyante at bagong importer — binibigyan sila ng mas mabilis at mas hindi mahirap na proseso para sa maliliit na commercial shipment, na nagpapaganda sa business environment.

⚠️ Dapat Tandaan
Ang value threshold na P50,000 ay hindi "fixed forever" — may built-in mechanism para i-adjust ito every three years base sa CPI, kaya posibleng magbago ito sa hinaharap.

🎯 Board Exam Tip
I-memorize ang exact na threshold (P50,000) at ang adjustment mechanism (every 3 years, base sa CPI) — madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Fixed ba talaga ang P50,000 threshold, hindi na ito magbabago?" Sagot: Hindi — malinaw sa batas na every three years matapos ang effectivity ng CMTA, ia-adjust ito ng Secretary of Finance base sa Consumer Price Index, kaya maaaring magbago ang exact na halaga sa paglipas ng panahon.

🔗 Related Topics
Section 402 (main provision), paragraph (b) — Personal/Household Effects, CAO 02-2021.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 402, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa commercial goods na mas mababa sa P50,000 para sa informal entry process. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang adjustment mechanism base sa CPI, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},495:{_label:"paragraph (b) — Personal/Household Effects",title:"Section 402(b): Personal at Household Effects (Informal Entry)",content:`📖 Kahulugan
Saklaw din ng informal entry process ang personal at household effects o goods na hindi commercial quantity, na ini-import sa loob ng baggage ng isang pasahero o sa pamamagitan ng mail.

🔍 Breakdown
- Personal and Household Effects or Goods – ang klase ng goods na covered — para sa personal na gamit, hindi negosyo.
- Not in Commercial Quantity – mahalagang qualifier — hindi dapat malaking dami na parang pang-benta.
- Imported in a Passenger's Baggage or Mail – dalawang paraan ng pagpasok na covered.

💡 Simpleng Paliwanag
Kung ikaw ay isang pasahero na may dalang personal na gamit sa iyong bagahe (hindi para ibenta, kundi para sa sariling gamit), o may dumarating na parcel sa mail na personal effects lang, pwede mo itong ma-process gamit ang mas simple na informal entry — hindi na kailangan ng buong formal entry proseso.

📦 Halimbawa
May isang balikbayan na dumating sa NAIA na may dalang mga damit, gadgets, at pasalubong para sa pamilya sa kanyang bagahe. Dahil ito ay personal effects at hindi commercial quantity, mapo-proseso ito gamit ang informal entry process, na mas mabilis kumpara sa formal entry na ginagamit para sa commercial shipments.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa mga ordinaryong Pilipinong bumabalik mula sa abroad o tumatanggap ng regalo mula sa kamag-anak — hindi sila kailangang dumaan sa mahaba at komplikadong formal entry process para lang sa kanilang personal na gamit.

⚠️ Dapat Tandaan
Ang "not in commercial quantity" ay mahalagang limitasyon — kung sobrang dami ng dala mo na parang para ibenta, maaaring hindi na ito ma-qualify bilang personal effects kahit personal ang label mo dito.

🎯 Board Exam Tip
I-differentiate ito sa paragraph (a) — ang paragraph (b) ay para sa PERSONAL effects (walang value threshold na binanggit), habang ang paragraph (a) ay para sa COMMERCIAL goods na may specific na value threshold (P50,000).

❓ Madalas Malito ang Students
Tanong: "May value limit ba ang personal effects sa paragraph (b), katulad ng P50,000 sa paragraph (a)?" Sagot: Batay sa text ng batas, walang explicit na value threshold na binanggit para sa personal effects — ang criteria dito ay "not in commercial quantity," hindi specific na peso amount, magkaiba ito sa criteria ng paragraph (a).

🔗 Related Topics
Section 402 (main provision), paragraph (a) — Commercial Goods Under P50,000.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 402, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa personal at household effects para sa informal entry process. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa paragraph (a), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},496:{_label:"section 403 — Provisional Goods Declaration",title:"Section 403: Kailan Pwedeng Mag-file ng Provisional Goods Declaration?",content:`📖 Kahulugan
Ang Section 403 ay nagbibigay-daan sa isang declarant na mag-file ng provisional goods declaration kung wala pa siyang kumpletong impormasyon o supporting documents, basta't may sapat itong impormasyon para sa Bureau, at nangangako ang declarant na kukumpletuhin ito sa loob ng 45 araw (na maaaring ma-extend ng isa pang 45 araw). Ang duty treatment ng provisional declaration ay hindi naiiba sa complete declaration, at maaaring i-release ang goods sa pamamagitan ng pag-post ng security.

🔍 Breakdown
- Declarant Does Not Have All Information or Supporting Documents – ang trigger para gamitin ang provisional declaration.
- Substantially Contains Necessary Information – hindi kailangang perfect, pero dapat may sapat na detalye.
- Complete Within 45 Days, Extendable for Another 45 Days – ang deadline at posibleng extension.
- Duty Treatment Not Different from Complete Declaration – hindi ito nagbibigay ng "discount" o advantage sa duties.
- Release Upon Posting of Security – maaaring ma-release agad ang goods habang hinihintay ang completion, basta't may security bond.

💡 Simpleng Paliwanag
Minsan, hindi pa kumpleto ang lahat ng papeles mo pero kailangan mo nang i-process ang shipment — pwede kang mag-file ng "pansamantalang" declaration, basta't may sapat na impormasyon ito, at mangako kang kukumpletuhin ang natitirang detalye sa loob ng 45 araw (na pwede pang ma-extend). Hindi ka rin makakatakas sa tamang duties dahil dito — pareho pa rin ang treatment. Pwede pang ma-release agad ang goods kung mag-post ka ng security.

📦 Halimbawa
May isang importer sa Port of Manila na nag-file ng provisional goods declaration para sa isang shipment ng machinery parts, dahil hindi pa kumpleto ang ilang technical certification mula sa supplier. Nag-post siya ng security equivalent sa estimated duties and taxes, at na-release ang goods habang hinihintay niya ang kumpletong dokumento sa loob ng 45 araw.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng flexibility sa mga importer na may legitimate na dahilan kung bakit hindi pa kumpleto ang kanilang papeles, nang hindi na kailangang i-delay ang buong shipment.

⚠️ Dapat Tandaan
Hindi ibig sabihin ng "provisional" na mas mababa ang babayarang duties — ang treatment ay pareho pa rin sa complete declaration, kaya't dapat pa rin i-post ang tamang security.

🎯 Board Exam Tip
I-memorize ang 45-day deadline at ang possibility ng isa pang 45-day extension — total na 90 days ang maximum na pwedeng hintayin.

❓ Madalas Malito ang Students
Tanong: "Automatic bang ma-extend ang 45-day period kung hiningi ito?" Sagot: Hindi automatic — malinaw sa batas na ang extension ay "for valid reasons" lang, kaya dapat may sapat na basehan bago ito aprubahan ng Bureau.

🔗 Related Topics
Section 401 (Importations Subject to Goods Declaration), Section 411 (Contents of Goods Declaration), CAO 02-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 403 ng CMTA (Republic Act No. 10863) tungkol sa Provisional Goods Declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang 45-day timeline at security requirement, banggitin ang CAO 02-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},497:{_label:"section 404 — Owner of Imported Goods",title:"Section 404: Sino ang Itinuturing na May-ari ng Imported Goods?",content:`📖 Kahulugan
Ang Section 404 ay nagsasaad kung sino ang legal na itinuturing na may-ari ng imported goods — karaniwan ay ang consignee o ang holder ng bill of lading, airway bill, o katulad na dokumento, basta't duly endorsed. Kasama rin dito ang underwriters ng abandoned goods at salvors ng goods na na-save mula sa wreck bilang maaaring ituring na mga consignee.

🔍 Breakdown
- Property of the Consignee – ang default na basehan ng ownership.
- Holder of Bill of Lading, Airway Bill, or Equivalent Document – alternative na basehan, basta't duly endorsed.
- If Duly Endorsed by the Consignee – dapat may proper endorsement kung ang basehan ay ang holder ng dokumento.
- If Consigned to Order, Duly Endorsed by the Consignor – espesyal na sitwasyon kung "to order" ang consignment.
- Underwriters of Abandoned Goods – maaaring ituring na consignee ang mga insurance underwriter ng abandoned goods.
- Salvors of Goods Saved from Wreck – maaari ding ituring na consignee ang mga taong nag-salvage ng goods mula sa wreck.

💡 Simpleng Paliwanag
Sa customs law, hindi laging simple ang pagtukoy kung sino ang "may-ari" ng isang shipment — pero ang default rule ay ang consignee (ang taong nakalagay bilang tatanggap), o kung sino man ang may hawak ng properong dokumento (bill of lading, atbp.) na duly endorsed. May special provisions din para sa abandoned goods at goods mula sa mga wreck.

📦 Halimbawa
May isang shipment na dumating sa Port of Cebu na may bill of lading na nakapangalan sa isang trading company bilang consignee. Dahil sila ang consignee at hawak nila ang duly endorsed na bill of lading, sila ang itinuturing na legal na may-ari ng goods para sa customs purposes, kahit hindi pa physically nasa kanila ang goods.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para malinaw kung sino ang legal na accountable at may karapatan sa isang shipment — kritikal ito para sa determination ng liability, karapatan na mag-claim, at iba pang legal na proseso.

⚠️ Dapat Tandaan
Ang "duly endorsed" ay mahalagang requirement — hindi basta basta ka nang ma-consider na may-ari kung wala kang proper na endorsement sa dokumento.

🎯 Board Exam Tip
I-memorize ang special cases: underwriters (para sa abandoned goods) at salvors (para sa goods mula sa wreck) — madalas itong nakakalimutang detalye ng mga estudyante.

❓ Madalas Malito ang Students
Tanong: "Kung hindi ako ang consignee pero hawak ko ang bill of lading, ako na ba ang may-ari?" Sagot: Depende — batay sa batas, kung ikaw ang "holder" ng bill of lading at ito ay "duly endorsed by the consignee" sa iyong pangalan, maaari kang ituring na may-ari; kung walang proper endorsement, hindi ka basta-basta magiging legal na may-ari.

🔗 Related Topics
Section 405 (Liability of Importer for Duties and Taxes), Section 418 (Derelicts and Goods from Abandoned Wrecks).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 404 ng CMTA (Republic Act No. 10863) tungkol sa may-ari ng imported goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang special cases ng underwriters at salvors, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},498:{_label:"section 405 — Liability of Importer for Duties and Taxes",title:"Section 405: Personal na Utang ang Duties at Taxes ng Importer",content:`📖 Kahulugan
Ang Section 405 ay nagsasaad na, maliban na lang kung may relief mula sa batas o regulasyon, ang liability para sa duties, taxes, fees, at ibang charges na kaugnay ng importation ay nagiging isang personal na utang (personal debt) ng importer sa gobyerno, at ito ay ma-di-discharge lang sa pamamagitan ng aktwal na pagbabayad. Ito rin ay nagiging isang lien sa imported goods, na maaaring i-enforce habang ang goods ay nasa customs custody.

🔍 Breakdown
- Unless Relieved by Laws or Regulations – may exception clause, hindi absolute ang liability.
- Personal Debt Due and Demandable – malakas na termino, parang ordinaryong utang na dapat bayaran.
- Against the Importer in Favor of the Government – malinaw ang parties — importer ang may utang, gobyerno ang creditor.
- Discharged Only Upon Payment – walang ibang paraan para mabura ang obligasyon kundi ang aktwal na pagbabayad.
- Constitutes a Lien on the Imported Goods – karagdagang proteksyon para sa gobyerno — ang mismong goods ay maaaring gamiting collateral.
- Enforced While Goods Are Under Customs Custody – ang lien ay applicable habang nasa customs custody pa ang goods.

💡 Simpleng Paliwanag
Kung mag-i-import ka ng goods, ang duties at taxes na dapat mong bayaran ay hindi lang basic "fee" — ito ay itinuturing na personal mong utang sa gobyerno, katulad ng ibang klase ng utang. Hindi ito mawawala hangga't hindi mo binabayaran. Bukod pa dito, habang nasa customs custody ang iyong goods, maaari itong "i-hold" ng gobyerno bilang collateral hanggang hindi ka nagbabayad (lien).

📦 Halimbawa
May isang importer sa Port of Davao na nag-import ng machinery pero hindi pa nabayaran ang buong duties and taxes. Dahil ang liability na ito ay itinuturing na personal debt, ang gobyerno ay may karapatang mag-enforce ng lien sa mismong machinery habang ito ay nasa customs custody, hanggang hindi nababayaran ang tamang duties.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil binibigyan nito ng malakas na legal na basehan ang gobyerno para tiyakin ang pagbabayad ng duties and taxes — hindi ito basta "pwede kong balewalain" na obligasyon.

⚠️ Dapat Tandaan
Ang lien ay applicable lang "while such goods are under customs' custody" — kung na-release na ang goods, maaaring iba na ang proseso ng pag-enforce ng utang.

🎯 Board Exam Tip
I-memorize ang dalawang legal na konsepto dito: (1) personal debt (utang mismo sa importer), at (2) lien sa goods (collateral habang nasa customs custody) — magkaiba pero magkaugnay.

❓ Madalas Malito ang Students
Tanong: "Kung hindi nabayaran ng importer ang duties, maaari na lang bang i-abandon ang goods para mabura ang utang?" Sagot: Hindi ganoon kasimple — ang liability ay "personal debt due and demandable," at ito ay ma-di-discharge lang sa pamamagitan ng aktwal na payment; ang pag-abandon ng goods ay hindi awtomatikong nagbubura ng personal na obligasyon ng importer.

🔗 Related Topics
Section 404 (Owner of Imported Goods), Section 406 (Importations by the Government).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 405 ng CMTA (Republic Act No. 10863) tungkol sa liability ng importer para sa duties and taxes. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang konsepto ng personal debt at lien, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},499:{_label:"section 406 — Importations by the Government",title:"Section 406: Kailangan Pa Ring Magbayad ang Gobyerno sa Sariling Importations",content:`📖 Kahulugan
Ang Section 406 ay nagsasaad na, maliban sa mga cases na nasasaklawan ng Section 800, lahat ng importations ng gobyerno para sa sariling gamit o para sa mga subordinate branches, instrumentalities, o government-owned/controlled corporations, ay subject pa rin sa duties, taxes, fees, at ibang charges sa ilalim ng CMTA.

🔍 Breakdown
- Except Those Provided for in Section 800 – may specific na exception, kailangang balikan ang Section 800 para sa detalye.
- All Importations by the Government – malawak na saklaw, kasama ang direktang gobyerno at ang mga sangay nito.
- For Its Own Use or That of Its Subordinate Branches or Instrumentalities – kasama ang iba't ibang antas ng government structure.
- Corporations, Agencies or Instrumentalities Owned or Controlled by the Government – kasama rin ang GOCCs at katulad na entities.
- Subject to Duties, Taxes, Fees and Other Charges – ang general rule — kahit gobyerno mismo, dapat magbayad pa rin.

💡 Simpleng Paliwanag
Bagama't maaaring akala mo na exempted na sa duties/taxes ang gobyerno kapag sila mismo ang nag-i-import, hindi ganoon ang batas — kailangan pa rin nilang magbayad ng tamang duties at taxes, maliban na lang kung specific na exempted ito base sa Section 800 (na naka-hiwalay na provision).

📦 Halimbawa
May isang government agency na nag-import ng specialized equipment para sa kanilang operations. Base sa Section 406, kailangan pa rin nilang bayaran ang tamang duties and taxes para sa shipment na ito, maliban kung ito ay specifically covered ng exemption sa ilalim ng Section 800.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para maprotektahan ang integridad ng revenue system — hindi dapat magkaroon ng "blanket exemption" para sa lahat ng government importation, dahil maaari itong abusuhin o magresulta sa hindi pantay na treatment.

⚠️ Dapat Tandaan
Mahalagang balikan ang Section 800 para malaman ang eksaktong saklaw ng exception — ang Section 406 mismo ay hindi nagbibigay ng detalye kung ano ang mga specific na exempted na importation.

🎯 Board Exam Tip
I-relate ito sa Section 800 — laging kasabay ang dalawang provisions na ito sa mga discussion tungkol sa government importation.

❓ Madalas Malito ang Students
Tanong: "Ibig bang sabihin, kailangan palaging magbayad ng duties/taxes ang gobyerno sa lahat ng importation nila?" Sagot: Hindi absolute — malinaw sa batas na may exception "except those provided for in Section 800," kaya kailangang balikan ang specific na probisyon na iyon para malaman kung anong klase ng government importation ang exempted.

🔗 Related Topics
Section 800 (exception provision), Section 405 (Liability of Importer for Duties and Taxes).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 406 ng CMTA (Republic Act No. 10863) tungkol sa importations by the government. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 800, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},500:{_label:"section 407 — Goods Declaration and Period of Filing",title:"Section 407: Format, Requirements, at Deadline ng Goods Declaration",content:`📖 Kahulugan
Ang Section 407 ay naglalarawan sa mga pangkalahatang rules tungkol sa goods declaration — dapat sumunod ito sa international standards hangga't maaari, limitado lang sa necessary na impormasyon, at dapat electronic ang paglo-lodge. Dapat ding i-lodge ang goods declaration sa loob ng 15 araw mula sa petsa ng discharge ng huling package mula sa barko o eroplano, na maaaring ma-extend ng isa pang 15 araw.

🔍 Breakdown
- Format Shall Conform with International Standards, As Far as Practicable – hindi absolute, pero dapat sundin hangga't maaari.
- Data Limited to Necessary Particulars – hindi dapat mag-require ng sobrang impormasyon.
- Electronic Lodgement Required – mandatory na electronic filing, hindi na paper-based.
- Supporting Documents Only for Customs Control – limitado lang sa kailangan, hindi lahat ng klase ng dokumento.
- Translation Not Required Except When Necessary – hindi mandatory ang translation, maliban na lang kung talagang kailangan.
- 15-Day Filing Deadline from Discharge of Last Package – ang eksaktong timeline.
- Extendable for Another 15 Days, Upon Valid Request Before Expiration – extension mechanism.

💡 Simpleng Paliwanag
Malinaw ang batas sa proseso ng goods declaration — dapat electronic ito, limitado lang sa necessary na impormasyon (hindi dapat overload sa requirements), at may mahigpit na 15-day deadline mula sa pagbaba ng huling package sa barko o eroplano. May pwede pang i-extend na isa pang 15 araw, pero dapat i-request ito bago pa mag-expire ang orihinal na deadline.

📦 Halimbawa
May isang container ship na nag-unload ng huling package sa Port of Manila noong ika-1 ng Enero. Base sa Section 407, ang deadline ng importer para mag-lodge ng goods declaration ay ika-16 ng Enero (15 araw). Kung kailangan niya ng dagdag na panahon, dapat niyang i-request ang extension bago pa dumating ang ika-16 ng Enero.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa efficiency at predictability ng customs process — malinaw ang timeline at requirements, sumusunod din sa international best practices para sa mas maayos na trade facilitation.

⚠️ Dapat Tandaan
Mahigpit ang requirement na dapat i-request ang extension "before the expiration of the original period" — hindi puwedeng humingi ng extension pagkatapos na mag-expire na ang orihinal na 15-day deadline.

🎯 Board Exam Tip
I-memorize ang exact na 15-day deadline at ang extension na isa pang 15 araw (total 30 days maximum), at ang requirement na dapat i-request bago mag-expire ang orihinal na period.

❓ Madalas Malito ang Students
Tanong: "Pwede pa bang humingi ng extension kahit na-expire na ang orihinal na 15-day period?" Sagot: Hindi — malinaw sa batas na ang request para sa extension ay dapat gawin "before the expiration of the original period," kaya kung na-expire na ang orihinal na deadline, hindi na ito basta pwedeng ma-extend.

🔗 Related Topics
Section 401 (Importations Subject to Goods Declaration), Section 408 (Lodgement and Amendment of Goods Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 407 ng CMTA (Republic Act No. 10863) tungkol sa goods declaration at period of filing. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang 15-day deadline at extension mechanism, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},501:{_label:"section 408 — Lodgement and Amendment of Goods Declaration",title:"Section 408: Pag-lodge at Pag-amend ng Goods Declaration",content:`📖 Kahulugan
Ang Section 408 ay nagpapahintulot sa electronic lodgement ng goods declaration sa kahit anong designated customs office, at pinapayagan din ang declarant na mag-amend ng goods declaration na na-lodge na, basta't may valid na dahilan at sumusunod sa mga terms and conditions ng regulasyon — pero dapat matanggap ang request para sa amendment BAGO ang final assessment o examination ng goods.

🔍 Breakdown
- Electronic Lodgement at Any Designated Customs Office – flexibility sa lokasyon ng pag-file, basta't designated office.
- Permit Declarant to Amend – pinapayagan ang pagbabago sa isang existing na declaration.
- For Valid Reason and Under Terms/Conditions by Regulation – hindi basta-basta pwedeng mag-amend, may requirements.
- Request Must Be Received Prior to Final Assessment or Examination – mahalagang deadline — hindi na pwede kung na-finalize na ang assessment o naka-simula na ang examination.

💡 Simpleng Paliwanag
Pwede kang mag-file ng goods declaration nang electronic sa kahit anong designated customs office, at kung may pagkakamali ka o kailangan mong baguhin ang impormasyon, may proseso para dito — basta't may valid na dahilan at ginawa mo ito BAGO pa man ma-finalize ang assessment o simulan ang examination ng goods.

📦 Halimbawa
May isang importer na nag-file ng goods declaration sa Port of Cebu, pero natuklasan niya ang isang typo error sa quantity ng kanyang shipment bago pa man ma-assess ito ng customs. Sa ilalim ng Section 408, maaari niyang i-request ang amendment ng declaration, basta't isumite niya ito bago ma-finalize ang assessment.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil kinikilala nito na posible ang honest mistakes sa pag-file ng declaration, at nagbibigay ito ng makatarungang paraan para maitama ang mga ito, habang may malinaw na deadline para hindi ito abusuhin.

⚠️ Dapat Tandaan
Ang deadline para sa amendment ay MAHALAGA — dapat ito ay bago ang "final assessment or examination," hindi na puwede kapag na-finalize na ang proseso.

🎯 Board Exam Tip
I-highlight ang timing requirement: amendment request must be "prior to final assessment or examination" — ito ang key phrase na madalas na-tetest sa exam.

❓ Madalas Malito ang Students
Tanong: "Pwede pa bang mag-amend ng goods declaration kung nasimulan na ang physical examination ng goods?" Sagot: Batay sa malinaw na wika ng batas, ang amendment request ay dapat matanggap "prior to final assessment or examination ng goods," kaya kung nasimulan na ang examination, malamang na hindi na ito puwedeng i-amend sa ilalim ng probisyong ito.

🔗 Related Topics
Section 407 (Goods Declaration and Period of Filing), Section 403 (Provisional Goods Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 408 ng CMTA (Republic Act No. 10863) tungkol sa lodgement at amendment ng goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang deadline requirement para sa amendment, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},502:{_label:"section 409 — Advance Lodgement and Clearance",title:"Section 409: Pag-lodge at Pag-clear Bago pa Dumating ang Goods",content:`📖 Kahulugan
Ang Section 409 ay nagbibigay sa Bureau ng authority na magbigay-daan para sa lodgement at clearance ng goods declaration at supporting documents BAGO pa man dumating ang aktwal na goods, base sa mga terms and conditions na ii-provide sa mga rules and regulations.

🔍 Breakdown
- The Bureau May Provide – discretionary power ng Bureau, hindi mandatory.
- Lodgement and Clearance – parehong hakbang na maaaring gawin nang maaga.
- Prior to the Arrival of the Goods – ang key concept — bago pa man dumating ang shipment.
- Under Terms and Conditions by Rules and Regulations – dapat sundin ang specific na implementing rules.

💡 Simpleng Paliwanag
May authority ang Bureau na payagan ang mga importer na i-proseso ang kanilang declaration at makakuha na ng clearance BAGO pa man aktwal na dumating ang kanilang shipment sa Pilipinas — layunin nito ay mapabilis ang buong proseso, katulad ng nakita natin sa Section 120(b) para sa relief consignment, pero ito ay general na provision na applicable sa regular importations.

📦 Halimbawa
May isang importer na alam na niya ang detalye ng kanyang papasok na shipment habang biyahe pa ito mula Japan. Gamit ang advance lodgement system, na-proseso na niya ang goods declaration at nakakuha na ng clearance bago pa man aktwal na dumaong ang barko sa Port of Manila, kaya't sa sandaling dumating ito, mabilis na itong na-release.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa trade facilitation — binabawasan nito ang oras ng paghihintay pagkatapos dumating ang shipment, dahil naunang naisagawa na ang karamihan sa proseso.

⚠️ Dapat Tandaan
Discretionary power ito ng Bureau ("may provide"), hindi ito automatic na entitlement ng lahat ng importer — dapat sundin ang specific na terms and conditions na itinakda sa implementing rules.

🎯 Board Exam Tip
I-relate ito sa Section 120(b) — ang advance lodgement concept ay ginamit din bilang bahagi ng simplified procedure para sa relief consignment, pero ang Section 409 ay mas general na provision para sa lahat ng klase ng importation.

❓ Madalas Malito ang Students
Tanong: "Pareho ba ito ng Section 120(b) tungkol sa relief consignment?" Sagot: Magkatulad ang konsepto (advance processing bago dumating ang goods), pero ang Section 409 ay general na provision na applicable sa lahat ng klase ng importation, habang ang Section 120(b) ay specific na para sa relief consignment sa panahon ng calamity.

🔗 Related Topics
Section 120(b) — Pre-Arrival Processing for Relief Consignment, CMO 31-2018.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 409 ng CMTA (Republic Act No. 10863) tungkol sa advance lodgement and clearance. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 120(b), banggitin ang CMO 31-2018, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},503:{_label:"section 410 — Entry of Goods in Part for Consumption and in Part for Warehousing",title:"Section 410: Simultaneous na Entry para sa Split Shipment (Consumption at Warehousing)",content:`📖 Kahulugan
Ang Section 410 ay nagpapahintulot na kung ang isang goods declaration na covered ng isang bill of lading o airway bill ay may bahaging para sa consumption at bahaging para sa warehousing, maaari itong parehong i-enter nang sabay-sabay para sa release sa port of entry.

🔍 Breakdown
- Covered by One Bill of Lading or Airway Bill – iisang shipping document lang, hindi magkahiwalay.
- Goods Meant in Part for Consumption and in Part for Warehousing – split ang layunin ng iisang shipment.
- Both Entered Simultaneously for Release – pinapayagan na sabay-sabay ang proseso, hindi kailangang magkahiwalay.

💡 Simpleng Paliwanag
Minsan, ang isang shipment (na may iisang bill of lading) ay hindi puro consumption o puro warehousing lang — halimbawa, kalahati ay direktang gagamitin (consumption) at kalahati ay iiimbak muna (warehousing). Sa ilalim ng Section 410, hindi mo na kailangang gumawa ng dalawang magkahiwalay na proseso — pwede mong i-enter ang dalawa nang sabay-sabay.

📦 Halimbawa
May isang kumpanya na nag-import ng isang buong container ng raw materials sa Port of Batangas, kung saan ang kalahati ay direktang gagamitin sa kanilang production line (consumption) at ang kalahati naman ay iiimbak muna sa isang bonded warehouse para sa future use (warehousing). Kahit iisang bill of lading lang ang covering document, maaari nilang i-enter ang dalawang bahagi nang sabay-sabay, sa halip na gumawa ng dalawang hiwalay na proseso.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa efficiency — hindi na kailangang gawing komplikado at magkahiwalay na proseso ang isang shipment na may dalawang layunin, na nagpapabilis sa buong customs clearance.

⚠️ Dapat Tandaan
Ang probisyong ito ay applicable lamang kung ang buong shipment ay "covered by one bill of lading or airway bill" — kung magkahiwalay ang shipping documents, maaaring hindi na ito applicable.

🎯 Board Exam Tip
I-relate ito sa Section 401 tungkol sa iba't ibang klase ng goods declaration — ipinapakita ng Section 410 na posibleng pagsamahin ang dalawang klase (consumption at warehousing) sa iisang proseso ng entry.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang dalawang magkahiwalay na goods declaration ang gawin para sa split shipment na ito?" Sagot: Hindi kailangan — malinaw sa batas na maaaring "both entered simultaneously for release," ibig sabihin pinapayagan ang sabay-sabay na proseso para sa parehong bahagi ng shipment, hindi kailangang magkahiwalay.

🔗 Related Topics
Section 401 (Importations Subject to Goods Declaration), warehousing procedures sa CMTA.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 410 ng CMTA (Republic Act No. 10863) tungkol sa entry ng goods na in part for consumption at in part for warehousing. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 401, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},504:{_label:"section 411 — Contents of Goods Declaration",title:"Section 411: Ano ang Dapat Nakapaloob sa Goods Declaration?",content:`📖 Kahulugan
Ang Section 411 ay naglilista ng mga specific na impormasyon na dapat nakapaloob sa isang goods declaration — mula sa pangalan ng consignee hanggang sa value ng goods, at ibang kinakailangan na detalye. Kung hindi kumpleto ang impormasyon na kailangan ng declarant, pinapayagan ang pag-file ng provisional o incomplete na declaration, base sa Section 403.

🔍 Breakdown
- Names of the Consignee, Importing Vessel or Aircraft – basic identifying information.
- Port of Departure, Port of Destination, Date of Arrival – logistics information.
- Number and Marks of Packages, or Quantity if in Bulk – physical description ng shipment.
- Nature and Correct Commodity Description – ano talaga ang goods.
- Value as Set Forth in a Proper Invoice – ang financial na detalye, base sa invoice.
- Such Other Information as Required by Rules and Regulations – flexible na provision para sa karagdagang requirements.
- Provisional/Incomplete Declaration Allowed – kung hindi kumpleto, connected ito sa Section 403's 45-day completion rule.

💡 Simpleng Paliwanag
Hindi basta general lang ang impormasyong kailangan sa isang goods declaration — dapat malinaw at kumpleto ang detalye, mula sa kung sino ang tatanggap, saan galing at saan patungo ang shipment, ano talaga ang laman nito, at magkano ang halaga base sa invoice. Kung hindi mo pa kumpleto ang lahat ng ito, may proseso naman para sa provisional declaration na natutunan na natin sa Section 403.

📦 Halimbawa
May isang importer na nag-file ng goods declaration para sa isang shipment ng imported furniture sa Port of Iloilo. Kasama sa kanyang declaration ang pangalan niya bilang consignee, ang barkong nagdala ng shipment, ang port of departure (halimbawa Shanghai) at destination, ang bilang ng packages, ang detalyadong description ng furniture, at ang value base sa commercial invoice.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ito ang basic na "checklist" ng impormasyon na kailangan para sa tamang pagproseso ng isang goods declaration — kritikal ito para sa tamang assessment, classification, at valuation.

⚠️ Dapat Tandaan
Huwag ikagulat kung hindi mo pa kumpleto ang lahat ng required information — may legitimate na paraan para dito sa pamamagitan ng provisional declaration, basta't sundin ang 45-day completion rule sa Section 403.

🎯 Board Exam Tip
I-memorize ang core elements na kailangan: consignee, vessel/aircraft, ports, dates, package details, commodity description, at value — mahalagang checklist ito para sa exam.

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung hindi kumpleto ang impormasyon na inilagay sa goods declaration?" Sagot: Base sa Section 411, konektado ito sa Section 403 — kung hindi kumpleto ang impormasyon, pinapayagan ang pag-file ng provisional o incomplete na declaration, basta't sundin ang requirements tulad ng 45-day completion period.

🔗 Related Topics
Section 403 (Provisional Goods Declaration), Section 412 (Statements to be Provided in the Goods Declaration), Section 413 (Description of Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 411 ng CMTA (Republic Act No. 10863) tungkol sa contents ng goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 403, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},505:{_label:"section 412 — Statements to be Provided in the Goods Declaration",title:"Section 412: Mahahalagang Sworn Statements sa Goods Declaration",content:`📖 Kahulugan
Ang Section 412 ay nagsasaad na walang entry ng imported goods ang papayagan maliban kung na-lodge na ang goods declaration, at ang declaration na ito ay dapat maglaman ng specific na statements, sa ilalim ng penalties of falsification o perjury. Dapat ding electronic ang pag-submit ng declaration, base sa Electronic Commerce Act of 2000 (RA 8792), at ang printed/certified na bersyon nito ay itinuturing na actionable document para sa prosecution kung mapatunayang fraudulent.

🔍 Breakdown
- No Entry Allowed Unless Goods Declaration Has Been Lodged – malinaw na requirement bago pa man mangyari ang entry.
- Under Penalties of Falsification or Perjury – seryosong legal consequence kung may mali o hindi tapat na impormasyon.
- Submitted Electronically Pursuant to RA 8792 – legal basis ng electronic submission.
- Printed and Certified Version as Actionable Document – ang legal status ng printed copy para sa prosecution purposes.

💡 Simpleng Paliwanag
Hindi puwedeng basta "paalam-alam" lang ang laman ng goods declaration — kailangan itong maglaman ng specific na statements na dapat totoo at tumpak, dahil kung mahuling may kasinungalingan dito, maaari kang managot sa ilalim ng falsification o perjury laws. Dapat din itong i-submit nang electronic, at kung ma-print at ma-certify ito, maaari itong gamitin bilang ebidensya sa korte kung mapatunayang fraudulent.

📦 Halimbawa
May isang importer na nag-file ng goods declaration sa Port of Manila kung saan sinabi niyang ang value ng kanyang shipment ay P500,000, pero sa katunayan mas mataas pa ito. Kung mahuling fraudulent ang kanyang declaration matapos ma-verify, maaari siyang managot sa ilalim ng falsification o perjury laws, gamit ang printed at certified na bersyon ng kanyang electronic declaration bilang ebidensya.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang deterrent laban sa fraud at maling deklarasyon — ang seryosong consequence ng falsification/perjury ay nagbibigay ng malakas na insentibo para sa mga importer na maging tapat sa kanilang declaration.

⚠️ Dapat Tandaan
Ang electronic submission ay hindi lang basic convenience — may legal basis ito sa RA 8792, at may legal significance ang printed/certified na bersyon nito bilang actionable document.

🎯 Board Exam Tip
I-relate ito sa RA 8792 (Electronic Commerce Act of 2000) — mahalagang batayan ito para sa legal validity ng electronic goods declaration.

❓ Madalas Malito ang Students
Tanong: "Legal ba ang electronic goods declaration, o kailangan pa rin ng physical/paper na dokumento?" Sagot: Legal ang electronic submission base sa RA 8792 — malinaw sa batas na dapat electronic ang goods declaration, at kung ma-print at ma-certify ito ng competent customs officer bilang faithful reproduction, ito ay may legal status bilang actionable document.

🔗 Related Topics
Section 411 (Contents of Goods Declaration), paragraphs (a) at (b), Republic Act No. 8792.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 412 ng CMTA (Republic Act No. 10863) tungkol sa statements na dapat i-provide sa goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa RA 8792, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},506:{_label:"paragraph (a) — Accurate Account of Prices",title:"Section 412(a): Sworn Statement na Tumpak ang Prices at Walang Inomit",content:`📖 Kahulugan
Ang unang required statement sa goods declaration ay ang pagpapatunay na ang invoice at goods declaration ay naglalaman ng tumpak at tapat na account ng mga presyong binayaran o dapat bayaran para sa goods, kasama ang ibang adjustments, at wala talagang na-omit o itinago na maaaring maging paraan ng pandaraya sa gobyerno para makaiwas sa duties/taxes.

🔍 Breakdown
- Accurate and Faithful Account of Prices Paid or Payable – ang core commitment — dapat totoo ang presyo na nakadeklara.
- Other Adjustments to the Price – kasama pati ang mga karagdagang adjustment sa presyo, hindi lang base price.
- Nothing Has Been Omitted or Concealed – malinaw na walang dapat itago o i-skip.
- Whereby the Government Might Be Defrauded – ang layunin ng requirement — protektahan ang gobyerno laban sa pandaraya.

💡 Simpleng Paliwanag
Sa pamamagitan ng pag-sign sa goods declaration, sinasabi mo (sa ilalim ng panunumpa) na totoo at kumpleto ang lahat ng presyo na nakalagay dito — walang itinatago, walang binabawasan, para hindi maloko ang gobyerno sa tamang duties/taxes na dapat nilang makuha.

📦 Halimbawa
May isang importer na nag-declare ng P300,000 bilang value ng kanyang shipment sa Port of Subic, pero sa totoo lang ay mayroon pang additional na P50,000 na commission fee na hindi niya isinama sa declaration para bawasan ang duties na babayaran niya. Ito ay direktang paglabag sa statement na ito, dahil hindi kumpleto at tumpak ang kanyang deklarasyon.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ito ang core anti-fraud protection ng customs valuation system — walang "puwang" para sa pagtatago ng presyo o adjustment para lang makatipid sa duties.

⚠️ Dapat Tandaan
Hindi lang ang base price ang kasama dito — pati na rin ang "other adjustments," ibig sabihin komprehensibo ang saklaw ng required accuracy.

🎯 Board Exam Tip
I-relate ito sa konsepto ng "customs valuation" — ang statement na ito ang nagsisiguro na tumpak ang basehan ng valuation process.

❓ Madalas Malito ang Students
Tanong: "Kung hindi sinasadya ang pagkakamali sa presyo, managot pa rin ba ako sa ilalim ng statement na ito?" Sagot: Ang batas ay nagsasabing kailangang "accurate and faithful" ang declaration na ito, pero ang penalty ng falsification/perjury (sa main provision ng Section 412) ay karaniwang nangangailangan ng intent o fraudulent motive — mahalagang balikan ang specific na implementing rules para sa detalyadong distinction sa pagitan ng honest mistake at fraud.

🔗 Related Topics
Section 412 (main provision), paragraph (b) — Statement on Invoices/Bills of Lading.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 412, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa sworn statement ng accurate account ng prices sa goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},507:{_label:"paragraph (b) — Statement on Invoices/Bills of Lading",title:"Section 412(b): Sworn Statement na Kumpleto at Genuine ang mga Dokumento",content:`📖 Kahulugan
Ang ikalawang required statement sa goods declaration ay ang pagpapatunay, sa abot ng kaalaman at paniniwala ng declarant, na ang lahat ng invoices at bills of lading o airway bills na may kinalaman sa goods ay ang TANGING umiiral na dokumento para sa importation na ito, na ang mga ito ay nasa parehong estado nang matanggap ng declarant, at ang lahat ng deklarasyon dito ay tunay at totoo.

🔍 Breakdown
- To the Best of the Declarant's Information and Belief – hindi absolute certainty, kundi base sa honest na kaalaman ng declarant.
- Only Ones in Existence Relating to the Importation – dapat walang ibang duplicate o hidden na dokumento.
- In the Same State as When Received – hindi dapat na-alter o na-tamper matapos matanggap.
- Genuine and True in All Respects – ang huling assurance ng authenticity.

💡 Simpleng Paliwanag
Sa pamamagitan ng pag-sign dito, sinasabi mo na, base sa alam mo, ang mga dokumento na isinumite mo — invoice, bill of lading, atbp. — ang TANGING mga kopya na umiiral para sa importation na ito, hindi mo ito binago matapos matanggap, at totoo at tunay ang laman nito.

📦 Halimbawa
May isang importer na nagsumite ng bill of lading sa kanyang goods declaration sa Port of Manila. Sa pamamagitan ng statement na ito, ipinapahayag niya na ito ang tanging bill of lading na umiiral para sa shipment na ito (walang ibang duplicate na ginagamit sa ibang bansa o para sa ibang layunin), at hindi niya ito binago mula nang matanggap niya ito mula sa shipping company.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para pigilan ang paggamit ng multiple o pekeng dokumento para sa iisang shipment, na maaaring gamitin para sa double-dealing o iba pang klase ng fraud sa customs system.

⚠️ Dapat Tandaan
Ang qualifier na "to the best of the declarant's information and belief" ay mahalaga — ibig sabihin ito ay base sa honest na kaalaman ng declarant, hindi absolute guarantee, pero dapat pa rin itong genuine at tapat na representasyon.

🎯 Board Exam Tip
I-pair ang paragraph (a) at (b) bilang magkasamang "twin statements" na dapat maunawaan bilang core sworn declarations sa goods declaration.

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung may lumitaw na ibang bill of lading para sa parehong shipment matapos ang declaration?" Sagot: Ang statement na ito ay tungkol sa representasyon ng declarant "to the best of his information and belief" — kung talagang may ibang existing na dokumento na hindi niya alam, maaaring hindi ito basta ituring na paglabag, pero kung sinadya niyang itago ito, maaari itong maging basehan ng falsification o perjury.

🔗 Related Topics
Section 412 (main provision), paragraph (a) — Accurate Account of Prices, Section 414 (Commercial and Noncommercial Invoice).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 412, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa sworn statement na kumpleto at genuine ang mga dokumento sa goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},508:{_label:"section 413 — Description of Goods",title:"Section 413: Ang Requirement ng Sapat at Specific na Description ng Goods",content:`📖 Kahulugan
Ang Section 413 ay nag-oobliga na ang description ng goods sa goods declaration ay dapat sapat at specific ang detalye, para ma-identify ang goods para sa customs valuation, statistical purposes, at classification sa tamang tariff heading at subheading, sa currency ng invoice, at sa ibang particulars na kailangan para sa tamang assessment at collection ng duties/taxes. Dapat ding hiwalay na i-declare ang quantity at value ng bawat klase ng goods base sa kanilang tariff heading/subheading, at dapat malinaw na makita ang totals ng bawat isa.

🔍 Breakdown
- Sufficient and Specific in Detail – hindi puwedeng masyadong general o vague ang description.
- Enable Identification for Customs Valuation, Statistical Purposes, Classification – tatlong layunin ng detailed description.
- Currency of the Invoice – dapat consistent sa currency na ginamit sa invoice.
- Quantity and Value Separately Declared per Heading/Subheading – hindi puwedeng i-combine ang magkakaibang klase ng goods sa iisang entry lang.
- Totals Duly Shown – dapat malinaw ang total para sa bawat heading/subheading.

💡 Simpleng Paliwanag
Hindi puwedeng sabihin mo lang na "electronics" bilang description ng iyong shipment — dapat detalyado ito, para malinaw kung anong specific na klase ng produkto ito, para sa tamang classification, valuation, at statistics. Kung magkakaibang klase ng goods ang laman ng iyong shipment, dapat hiwalay mong i-declare ang quantity at value ng bawat isa, hindi puwedeng pagsamahin lang.

📦 Halimbawa
May isang importer na nag-import ng mixed shipment na naglalaman ng cellphones at laptops sa Port of Cebu. Sa halip na sabihin lang na "electronics" bilang description, dapat niyang hiwalay na i-declare ang quantity at value ng cellphones (sa kanilang tamang tariff heading) at ang quantity at value ng laptops (sa kanilang sariling tariff heading), kasama ang malinaw na totals para sa bawat isa.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa tamang classification at valuation — kung hindi detalyado ang description, mahihirapan ang customs officers na tukuyin ang tamang tariff rate at duties na dapat i-apply, na maaaring magresulta sa maling assessment.

⚠️ Dapat Tandaan
Hindi puwedeng pagsamahin ang magkakaibang klase ng goods sa iisang general na entry — dapat separately declared ang bawat isa base sa kanilang respective heading o subheading.

🎯 Board Exam Tip
I-relate ito sa konsepto ng tariff classification at ang Harmonized System — ang detalyadong description ay direktang nakaka-apekto sa tamang pag-classify ng goods.

❓ Madalas Malito ang Students
Tanong: "Pwede bang gamitin ang general term tulad ng 'assorted goods' bilang description sa goods declaration?" Sagot: Hindi dapat — malinaw sa batas na ang description ay dapat "sufficient and specific in detail" para ma-identify ang goods para sa tamang valuation at classification; ang general terms tulad ng "assorted goods" ay malamang na hindi sapat sa requirement na ito.

🔗 Related Topics
Section 411 (Contents of Goods Declaration), Section 414 (Commercial and Noncommercial Invoice).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 413 ng CMTA (Republic Act No. 10863) tungkol sa description of goods sa goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa tariff classification, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},509:{_label:"section 414 — Commercial and Noncommercial Invoice",title:"Section 414: Ang mga Kailangang Nilalaman ng Commercial Invoice",content:`📖 Kahulugan
Ang Section 414 ay naglilista ng mga specific na impormasyon na dapat nakapaloob sa isang commercial invoice ng imported goods. Ang mga requirement na ito ay applicable din, hangga't maaari, sa mga goods na hindi covered ng sale, tulad ng consignment, lease, samples, o donations, na may kaukulang consignment, pro forma, o noncommercial invoice.

🔍 Breakdown
Ang Section 414 ay ang "main provision" na nagbubukas sa listahan ng pitong (7) required elements (paragraphs a-g) ng isang commercial invoice, mula sa agreed price hanggang sa iba pang facts na kailangan para sa proper examination. May karagdagang paglilinaw din na kahit hindi sale ang batayan ng importation (tulad ng consignment, lease, samples, o donations), applicable pa rin ang mga requirement na ito hangga't maaari.

💡 Simpleng Paliwanag
Ang commercial invoice ay hindi basta "resibo" lamang — dapat itong maglaman ng specific na impormasyon na kailangan ng customs para sa tamang valuation at classification. Kahit ang goods ay hindi naman binili (halimbawa, donation o sample), dapat pa rin sundin ang mga requirement na ito hangga't maaari, gamit ang katumbas na klase ng invoice.

📦 Halimbawa
May isang kumpanya na nag-import ng machinery mula Germany bilang bahagi ng isang regular na sale transaction. Ang kanilang commercial invoice ay dapat maglaman ng lahat ng required elements — agreed price, buyer/seller information, port of entry, detalyadong description, quantity, at iba pang kailangang impormasyon, base sa paragraphs (a) hanggang (g).

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ang commercial invoice ang isa sa pinaka-importanteng supporting document para sa tamang customs valuation — kung kulang o hindi kumpleto ang impormasyon dito, maaaring magkaroon ng delay o dispute sa assessment.

⚠️ Dapat Tandaan
Ang mga requirement na ito ay applicable din sa NON-commercial transactions (donation, sample, lease) "to the extent possible" — hindi ito exclusive lang sa aktwal na sale transactions.

🎯 Board Exam Tip
I-memorize ang pitong (7) required elements sa paragraphs (a-g) — madalas itong hiwa-hiwalay na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kailangan pa rin bang sundin ang mga requirement na ito kung donation lang ang goods, walang sale na nangyari?" Sagot: Oo — malinaw sa batas na "to the extent possible," applicable pa rin ang mga requirement na ito kahit sa mga goods na hindi covered ng sale, tulad ng donations, gamit ang katumbas na klase ng invoice (consignment, pro forma, o noncommercial invoice).

🔗 Related Topics
Paragraphs (a) hanggang (g) ng Section 414, Section 701(1), Section 413 (Description of Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414 ng CMTA (Republic Act No. 10863) tungkol sa commercial and noncommercial invoice. I-explain nang simple ang overview ng pitong required elements, magbigay ng practical na halimbawa, ipaliwanag ang applicability nito sa non-sale transactions, banggitin ang Section 701(1), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},510:{_label:"paragraph (a) — Agreed Price",title:"Section 414(a): Ang Agreed Price sa Commercial Invoice",content:`📖 Kahulugan
Ang unang required element sa isang commercial invoice ay ang agreed price na binayaran o dapat bayaran para sa goods.

🔍 Breakdown
- The Agreed Price – ang presyong napagkasunduan sa pagitan ng buyer at seller.
- Paid or to Be Paid – kasama pareho ang na-bayad na at ang babayarang presyo pa lang.

💡 Simpleng Paliwanag
Ang pinaka-basic na impormasyon na kailangan sa commercial invoice ay kung magkano ang presyong napagkasunduan para sa goods — kung nabayaran na ito, o kung babayaran pa lang, dapat malinaw itong nakalagay.

📦 Halimbawa
May isang importer na bumili ng textile mula Vietnam sa presyong $10,000. Sa kanilang commercial invoice, dapat malinaw na nakalagay ang $10,000 bilang agreed price, kung ito ba ay na-bayad na o babayaran pa sa supplier.

⭐ Bakit Mahalaga Ito?
Ito ang foundational na impormasyon para sa buong customs valuation process — walang agreed price, walang basehan para sa tamang assessment ng duties/taxes.

⚠️ Dapat Tandaan
I-relate ito sa Section 415 (Mode of Payment and Terms of Trade) — ang agreed price ay konektado sa mga internationally accepted terms tulad ng incoterms.

🎯 Board Exam Tip
Tandaan na ito ang "starting point" ng buong commercial invoice requirement — ang buong customs valuation ay nagsisimula sa agreed price na ito.

❓ Madalas Malito ang Students
Tanong: "Ano ang gagawin kung nagbago ang presyo pagkatapos ng orihinal na agreement?" Sagot: Ang batas ay hindi direktang nagbibigay ng detalye dito sa paragraph (a) mismo — pero konektado ito sa paragraph (b) tungkol sa adjustments sa price, na maaaring mag-cover ng ganitong sitwasyon.

🔗 Related Topics
Section 414 (main provision), paragraph (b) — Price Adjustments, Section 415 (Mode of Payment and Terms of Trade).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa agreed price sa commercial invoice. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},511:{_label:"paragraph (b) — Price Adjustments",title:"Section 414(b): Adjustments sa Price base sa Section 701(1)",content:`📖 Kahulugan
Ang ikalawang required element sa commercial invoice ay ang mga adjustments sa presyong binayaran o babayaran, ayon sa depinisyon nito sa Section 701(1) ng CMTA, kung hindi pa ito nasasama sa invoice, kung applicable.

🔍 Breakdown
- Adjustments to the Price Paid or to Be Paid – karagdagang halaga na dapat isama sa customs value, bukod sa basic price.
- As Defined in Section 701(1) – ang exact na depinisyon ay nasa ibang section, hindi dito.
- If Not Yet Included in the Invoice – conditional lang ito, kung hindi pa naisama.
- As May Be Applicable – depende sa sitwasyon, hindi lahat ng shipment ay may ganitong adjustment.

💡 Simpleng Paliwanag
Minsan, hindi lang ang basic agreed price ang dapat isama sa customs valuation — may mga karagdagang gastos o adjustment (tulad ng commission, royalty, o iba pang bagay na nakadepinisyon sa Section 701(1)) na dapat isama, kung hindi pa ito nasasama sa orihinal na invoice.

📦 Halimbawa
May isang importer na bumili ng branded products mula sa isang foreign manufacturer, kung saan may separate na royalty fee na dapat bayaran bilang bahagi ng agreement, pero hindi pa ito nakasama sa orihinal na commercial invoice. Base sa paragraph (b), dapat isama ang royalty na ito bilang adjustment sa presyo, base sa depinisyon nito sa Section 701(1).

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na tumpak ang buong customs value ng goods — hindi lang basic price ang dapat isaalang-alang, kundi pati na rin ang mga karagdagang costs na bahagi ng totoong "presyo" ng transaction.

⚠️ Dapat Tandaan
Dapat balikan ang Section 701(1) para sa eksaktong listahan kung anong klase ng adjustments ang saklaw nito — hindi ito nakadetalye dito sa Section 414(b) mismo.

🎯 Board Exam Tip
I-relate ito nang direkta sa Section 701(1) — kailangan mong pag-aralan ang parehong provisions na ito para lubos na maintindihan ang buong konsepto ng customs valuation adjustments.

❓ Madalas Malito ang Students
Tanong: "Ano ba ang mga specific na klase ng adjustments na tinutukoy dito?" Sagot: Ang eksaktong listahan ng mga adjustments ay nakadepinisyon sa Section 701(1) ng CMTA, hindi dito sa Section 414(b) — kailangang balikan ang provision na iyon para sa detalyadong sagot.

🔗 Related Topics
Section 414 (main provision), paragraph (a) — Agreed Price, Section 701(1).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa adjustments sa price base sa Section 701(1). I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 701(1), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},512:{_label:"paragraph (c) — Buyer, Seller, Time and Place of Sale",title:"Section 414(c): Buyer, Seller, at ang Petsa/Lugar ng Sale",content:`📖 Kahulugan
Ang ikatlong required element sa commercial invoice ay ang pangalan ng buyer at seller, kasama ang oras at lugar ng sale.

🔍 Breakdown
- Names of the Buyer and Seller – malinaw na identification ng dalawang partido sa transaction.
- Time of Sale – kailan naganap ang transaksyon.
- Place of Sale – saan naganap ang transaksyon.

💡 Simpleng Paliwanag
Dapat malinaw sa commercial invoice kung sino ang bumili at nagbenta ng goods, at kailan at saan naganap ang transaksyong ito — mahalagang impormasyon para sa pagtukoy kung tunay at legitimate ang sale.

📦 Halimbawa
May isang trading company sa Pilipinas (buyer) na bumili ng textile products mula sa isang manufacturer sa Vietnam (seller). Sa kanilang commercial invoice, dapat malinaw na nakalagay ang pangalan ng parehong kumpanya, kasama ang petsa at lugar (halimbawa, Ho Chi Minh City, Vietnam) kung saan naganap ang sale.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa verification ng transaction — nagbibigay ito ng malinaw na audit trail kung sino ang mga partido at kailan/saan ito naganap, na makatutulong sa pag-verify ng authenticity ng transaction.

⚠️ Dapat Tandaan
Malinaw na dapat lahat ng apat na detalye (buyer, seller, time, place) ay nakapaloob — hindi sapat kung isa lang o dalawa sa mga ito ang nakadeklara.

🎯 Board Exam Tip
I-memorize ang apat na detalye na kailangan: buyer, seller, time of sale, place of sale — simple pero madalas na tinatanong bilang basic checklist item.

❓ Madalas Malito ang Students
Tanong: "Bakit kailangan pa ng 'place of sale' kung may 'port of entry' naman na hiwalay na requirement sa paragraph (d)?" Sagot: Magkaiba ang dalawa — ang "place of sale" ay tumutukoy sa kung saan naganap ang transaksyon ng pagbili at pagbenta (halimbawa, sa opisina ng seller sa ibang bansa), habang ang "port of entry" ay tumutukoy sa kung saan pumapasok ang goods sa Pilipinas — magkaibang impormasyon na parehong kailangan.

🔗 Related Topics
Section 414 (main provision), paragraph (d) — Port of Entry.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa buyer, seller, at time/place of sale sa commercial invoice. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},513:{_label:"paragraph (d) — Port of Entry",title:"Section 414(d): Ang Port of Entry sa Commercial Invoice",content:`📖 Kahulugan
Ang ikaapat na required element sa commercial invoice ay ang port of entry — ang tamang customs port kung saan papasok ang goods sa Pilipinas.

🔍 Breakdown
- The Port of Entry – ang specific na port kung saan papasok ang shipment, base sa listahan ng principal ports sa Section 207.

💡 Simpleng Paliwanag
Dapat malinaw sa commercial invoice kung saang port (halimbawa, Manila, Cebu, Subic) papasok ang goods — mahalagang impormasyon ito para sa tamang pagproseso at pagtukoy kung aling Customs District ang may jurisdiction sa shipment.

📦 Halimbawa
May isang shipment ng imported electronics na dinisenyo para pumasok sa Port of Cebu. Sa kanilang commercial invoice, dapat malinaw na nakalagay na "Port of Cebu" bilang port of entry, para malaman kaagad kung aling customs office ang mag-pro-process sa shipment na ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa proper na routing at jurisdiction — malaman kaagad ng Bureau of Customs kung aling specific na Customs District ang dapat mag-handle sa shipment.

⚠️ Dapat Tandaan
I-relate ito sa Section 207 — ang "port of entry" na binabanggit dito ay dapat isa sa mga opisyal na principal ports na nakalista roon, o ibang legitimate na port of entry.

🎯 Board Exam Tip
I-connect ito sa Section 207 (Ports of Entry) — ang commercial invoice requirement na ito ay direktang konektado sa listahan ng opisyal na ports.

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung mag-iba ang aktwal na port kung saan dumaong ang barko kumpara sa nakalagay sa invoice?" Sagot: Ang batas mismo ay hindi nagbibigay ng detalye kung ano ang specific na consequence nito — pero mahalaga na tumpak ang impormasyong ito sa invoice para sa maayos na pagproseso ng customs declaration.

🔗 Related Topics
Section 414 (main provision), Section 207 (Ports of Entry).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa port of entry sa commercial invoice. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 207, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},514:{_label:"paragraph (e) — Description for Tariff/Valuation",title:"Section 414(e): Sapat na Description para sa Tariff Classification at Valuation",content:`📖 Kahulugan
Ang ikalimang required element sa commercial invoice ay ang sapat na description na magpapahintulot ng tumpak na pagkilala ng goods para sa tariff classification, customs valuation, at statistical purposes — kasama ang tamang commodity description, grade o kalidad, numbers, marks o symbols kung saan ito ibinebenta ng seller o manufacturer, pati na rin ang marks at bilang ng packages.

🔍 Breakdown
- Sufficient Description for Identification – katulad ng Section 413, dapat sapat ang detalye.
- Tariff Classification, Customs Valuation, and Statistical Purposes – tatlong layunin ng detalyadong description.
- Correct Commodity Description, in Customary Term or Commercial Designation – dapat gamitin ang tamang termino, hindi basta general.
- Grade or Quality – kailangan ding malinaw ang kalidad ng produkto.
- Numbers, Marks or Symbols Under Which Sold – ang mga specific na identifier na ginagamit ng seller/manufacturer.
- Marks and Number of Packages – detalye ng packaging.

💡 Simpleng Paliwanag
Katulad ng nakita natin sa Section 413, dapat detalyado ang description ng goods sa commercial invoice — hindi lang general term, kundi kasama ang grade/quality, mga numero o marka na ginagamit ng manufacturer, at detalye ng packaging, para malinaw ang pagkakakilanlan ng produkto.

📦 Halimbawa
Sa halip na sabihin lang na "t-shirts" bilang description, dapat detalyado ang commercial invoice ng isang textile importer — halimbawa "100% cotton t-shirts, Grade A, Model No. TS-2024, packed in 50 dozens per carton" — para malinaw ang tamang classification at valuation.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para direktang ma-support ang requirement sa Section 413 tungkol sa detalyadong description — ang commercial invoice ang pangunahing source ng ganitong impormasyon.

⚠️ Dapat Tandaan
I-relate ito nang direkta sa Section 413 — parehong nag-eemphasize ang dalawang provisions sa kahalagahan ng detalyadong at specific na description ng goods.

🎯 Board Exam Tip
I-pair ang Section 413 at Section 414(e) bilang magkaugnay na requirements tungkol sa description ng goods — ang isa ay para sa goods declaration mismo, ang isa ay para sa commercial invoice.

❓ Madalas Malito ang Students
Tanong: "Sapat na ba ang basic na commodity name bilang description sa commercial invoice?" Sagot: Hindi sapat — malinaw sa batas na dapat kasama ang grade/quality, numbers/marks/symbols, at packaging details, hindi lang basic commodity name, para matugunan ang requirement ng "sufficient description" para sa tariff classification at valuation.

🔗 Related Topics
Section 414 (main provision), Section 413 (Description of Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (e) ng CMTA (Republic Act No. 10863) tungkol sa sapat na description para sa tariff classification at valuation sa commercial invoice. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 413, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},515:{_label:"paragraph (f) — Quantities in Weights/Measures",title:"Section 414(f): Quantities sa Weights o Measures ng Shipped Goods",content:`📖 Kahulugan
Ang ikaanim na required element sa commercial invoice ay ang quantities, sa anyo ng weights o measures, ng goods na na-ship.

🔍 Breakdown
- Quantities in Weights or Measures – dapat nasa specific unit ng weight (kg, tons) o measure (meters, pieces, atbp.).
- Of the Goods Shipped – ang aktwal na dami ng goods na na-ship, hindi ordered quantity o iba pa.

💡 Simpleng Paliwanag
Dapat malinaw sa commercial invoice ang eksaktong dami ng goods — gamit ang tamang unit of measurement (kilo, metro, piraso, atbp.), base sa aktwal na na-ship, hindi lang basta general estimate.

📦 Halimbawa
May isang shipment ng imported rice sa Port of Iloilo. Sa commercial invoice, dapat malinaw na nakalagay ang eksaktong weight — halimbawa, "20,000 kilograms" o "20 metric tons" — hindi lang basta "maraming sako ng bigas."

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa tamang computation ng duties/taxes na karaniwang base sa quantity o weight, at para sa accurate na statistical records ng Bureau of Customs.

⚠️ Dapat Tandaan
Dapat ito ay "of the goods shipped" — ibig sabihin ang aktwal na na-ship, hindi kung ano ang orihinal na order na maaaring magkaiba dahil sa partial shipment o iba pang dahilan.

🎯 Board Exam Tip
I-relate ito sa Section 413 — ang "quantity" requirement dito ay katugma ng "quantity and value of each of the several classes of goods" na binanggit sa Section 413.

❓ Madalas Malito ang Students
Tanong: "Ano ang gagawin kung magkaiba ang quantity na na-order at ang aktwal na na-ship?" Sagot: Ang commercial invoice ay dapat magreflect ng aktwal na quantity na NA-SHIP, hindi ang orihinal na order — mahalagang tumpak ang declaration base sa totoong na-deliver na dami.

🔗 Related Topics
Section 414 (main provision), Section 413 (Description of Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (f) ng CMTA (Republic Act No. 10863) tungkol sa quantities sa weights o measures ng shipped goods sa commercial invoice. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},516:{_label:"paragraph (g) — Other Necessary Facts",title:"Section 414(g): Iba Pang Facts na Kailangan Para sa Examination, Valuation, at Classification",content:`📖 Kahulugan
Ang ikapitong at huling required element sa commercial invoice ay ang "catch-all" provision — anumang ibang fact na itinuturing na kinakailangan para sa proper examination, customs valuation, at tariff classification ng goods, base sa mga rules and regulations.

🔍 Breakdown
- Any Other Fact Deemed Necessary – malawak na saklaw, hindi limitado sa mga naunang nakalistang elements (paragraphs a-f).
- For Proper Examination, Customs Valuation, and Tariff Classification – ang tatlong layunin, katulad ng paragraph (e).
- As May Be Prescribed by Rules and Regulations – dapat may basehan sa implementing rules, hindi arbitrary.

💡 Simpleng Paliwanag
Ito ang "safety net" na provision ng Section 414 — kung may karagdagang impormasyon na kailangan pa para sa tamang examination, valuation, o classification na hindi covered ng mga naunang paragraphs, maaari itong i-require base sa specific na rules and regulations.

📦 Halimbawa
Sa panahon ng isang bagong regulasyon tungkol sa environmental compliance ng certain products, maaaring mag-require ang Bureau ng karagdagang certification o impormasyon sa commercial invoice na hindi direktang covered ng paragraphs (a) hanggang (f), base sa bagong implementing rules na inisyu para sa specific na produkto.

⭐ Bakit Mahalaga Ito?
Nagbibigay ito ng flexibility sa Bureau of Customs para mag-adjust ng requirements base sa mga bagong sitwasyon o specific na klase ng produkto, nang hindi na kailangang i-amend pa ang buong Section 414.

⚠️ Dapat Tandaan
Kahit malawak ang saklaw nito, dapat pa rin itong may basehan sa "rules and regulations" — hindi ito basta arbitrary na requirement na maaaring i-impose nang walang legal na batayan.

🎯 Board Exam Tip
Tandaan na ito ang "catch-all" clause ng Section 414 — laging kasama ito bilang huling item sa listahan ng commercial invoice requirements.

❓ Madalas Malito ang Students
Tanong: "Sino ang nagde-decide kung ano ang 'other facts' na kailangan sa ilalim ng paragraph (g)?" Sagot: Base sa batas, ito ay "as may be prescribed by rules and regulations," ibig sabihin ang specific na implementing rules ng Bureau of Customs ang magde-detalye kung ano ang mga karagdagang fact na maaaring kailanganin, hindi ito basta desisyon ng isang indibidwal na customs officer.

🔗 Related Topics
Section 414 (main provision), paragraphs (a) hanggang (f).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 414, paragraph (g) ng CMTA (Republic Act No. 10863) tungkol sa iba pang facts na kailangan para sa examination, valuation, at classification sa commercial invoice. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},517:{_label:"section 415 — Mode of Payment and Terms of Trade",title:"Section 415: Pagkilala sa International Standards ng Payment at Trade Terms",content:`📖 Kahulugan
Ang Section 415 ay nagsasaad na, subject sa existing na batas at rules sa foreign currency exchange, ang internationally accepted standards at practices tungkol sa mode of payment o remittance para sa import/export transactions, kasama ang mga standards mula sa international trading bodies tulad ng International Chamber of Commerce (ICC) sa trading terms (incoterms) at sa international letters of credit tulad ng Uniform Customs and Practice for Documentary Credits (UCPDC), ay kinikilala.

🔍 Breakdown
- Subject to Existing Laws and Rules on Foreign Currency Exchange – may batayang limitasyon mula sa existing forex regulations.
- Internationally Accepted Standards and Practices – malawak na pagkilala sa mga global standards.
- Mode of Payment or Remittance – tumutukoy sa kung paano binabayaran ang mga import/export transactions.
- ICC Incoterms – specific na example ng international standard, tungkol sa trading terms tulad ng FOB, CIF, atbp.
- UCPDC on International Letters of Credit – specific na example para sa mga letter of credit transactions.

💡 Simpleng Paliwanag
Hindi kailangang mag-imbento ng sariling Philippine-specific na rules para sa mode of payment at trading terms — kinikilala ng CMTA ang mga internationally accepted standards tulad ng incoterms (mula ICC) at UCPDC para sa letters of credit, basta't sumusunod pa rin ito sa existing na forex regulations natin.

📦 Halimbawa
May isang importer sa Pilipinas na gumagamit ng "FOB Shanghai" bilang incoterm sa kanyang transaction sa isang Chinese supplier. Base sa Section 415, kinikilala ng Bureau of Customs ang ganitong internationally standard na terminong ito bilang basehan ng trading terms, hindi na kailangang mag-imbento pa ng ibang lokal na termino.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa consistency at predictability sa international trade — dahil kinikilala ng Pilipinas ang mga globally accepted standards, mas madali ang pakikipag-negosyo sa mga foreign trading partners na gumagamit na rin ng parehong standards.

⚠️ Dapat Tandaan
Ang pagkilala sa international standards ay hindi absolute — dapat pa rin itong "subject to existing laws and rules on foreign currency exchange" ng Pilipinas.

🎯 Board Exam Tip
I-memorize ang dalawang specific na examples na binanggit: ICC Incoterms (para sa trading terms) at UCPDC (para sa letters of credit) — madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kailangan pa bang sumunod sa Philippine-specific na rules kahit ginagamit na ang international incoterms?" Sagot: Oo — malinaw sa batas na ang pagkilala sa international standards ay "subject to existing laws and rules on foreign currency exchange," kaya kahit ginagamit ang incoterms, dapat pa rin itong sumunod sa existing na Philippine forex regulations.

🔗 Related Topics
Section 414(a) — Agreed Price, konsepto ng FOB/FCA value sa Section 402(a).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 415 ng CMTA (Republic Act No. 10863) tungkol sa mode of payment and terms of trade, kasama ang incoterms at UCPDC. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa foreign currency exchange rules, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},518:{_label:"section 416 — Examination of Samples",title:"Section 416: Proper na Proseso sa Pagkuha ng Representative Samples",content:`📖 Kahulugan
Ang Section 416 ay nag-oobliga sa customs officers na tiyakin na ang mga representative samples na kinuha habang isinasagawa ang examination ay properong ni-receipt at na-retain sa loob ng makatwirang panahon. Dapat ding ma-note ang quantity at value ng mga samples na kinuha sa specified box ng goods declaration o electronic form, at dapat itong duly labeled para maidentify ito sa importation kung saan ito kinuha.

🔍 Breakdown
- Representative Samples – mga specimen na kinuha mula sa isang shipment para sa testing o examination purposes.
- Properly Receipted For – dapat may resibo o dokumentasyon ang pagkuha ng samples.
- Retained Within a Reasonable Period of Time – hindi puwedeng habang-buhay na hawakan, may reasonable time frame.
- Quantity and Value Noted in Goods Declaration – dapat itong i-record sa proper na section ng declaration.
- Duly Labeled to Identify with the Importation – dapat malinaw ang label para hindi ito mahalo sa ibang samples mula sa ibang shipment.

💡 Simpleng Paliwanag
Kapag kumuha ng sample ang customs officer mula sa iyong shipment para sa testing o examination, may proper na proseso na dapat sundin — dapat may resibo ito, hindi ito hahawakan nang walang katapusan, dapat i-record sa iyong goods declaration ang quantity at value nito, at dapat malinaw itong naka-label para malaman kung saang shipment ito galing.

📦 Halimbawa
May customs examiner na kumuha ng sample mula sa isang shipment ng chemical products sa Port of Batangas para sa laboratory testing. Bilang bahagi ng proseso, nag-issue siya ng resibo para sa mga samples na kinuha, ni-note ang quantity at value nito sa goods declaration, at ni-label nang malinaw ang mga sample container para ma-trace ito pabalik sa specific na shipment.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa accountability at transparency — hindi puwedeng basta na lang kumuha ng samples ang customs officer nang walang proper na documentation, at dapat malinaw ang audit trail kung saan ito galing.

⚠️ Dapat Tandaan
Ang "reasonable period of time" para sa pagretain ng samples ay hindi specific na nakadetalye sa batas — malamang na nasa implementing rules ito i-detalye.

🎯 Board Exam Tip
I-memorize ang tatlong core requirements: proper receipt, reasonable retention period, at duly labeled na identification — mahalagang checklist para sa exam.

❓ Madalas Malito ang Students
Tanong: "Sino ang bahala sa value ng samples na kinuha — kasama ba ito sa duties/taxes computation?" Sagot: Ang batas ay nagsasabing dapat i-note ang quantity at value ng samples sa goods declaration — hindi malinaw na nakasaad dito kung paano ito tinatrato para sa duties/taxes purposes, malamang na nasa ibang probisyon o implementing rules ito idetalye.

🔗 Related Topics
Section 411 (Contents of Goods Declaration), Section 413 (Description of Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 416 ng CMTA (Republic Act No. 10863) tungkol sa examination of samples. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang tatlong core requirements, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},519:{_label:"section 417 — Forwarding of Cargo and Remains of Wrecked Vessel or Aircraft",title:"Section 417: Proseso Para sa Cargo at Labi ng Nawasak na Barko o Eroplano",content:`📖 Kahulugan
Ang Section 417 ay naglalarawan sa proseso kung paano ma-forward ang goods na na-save mula sa isang wreck ng barko o eroplano sa loob ng Pilipinas, papunta sa kanilang tunay na ports of destination, nang hindi na kailangang dumaan sa customs office kung saan ito unang na-cast ashore o na-unload. May proseso rin para sa pag-export ng "remains" ng wreck.

🔍 Breakdown
- Vessels or Aircrafts Wrecked Within the Philippines – ang trigger event ng probisyong ito.
- Original Owners, Consignees, or Underwriters (in case of abandonment) – ang mga taong maaaring humingi ng approval.
- Seek Approval from the Bureau – kailangan ng permission bago ipagpatuloy ang forwarding.
- Forward Goods to Ports of Destination Without Going Through District Where Cast Ashore – ang special na benefit — hindi na kailangang dumaan sa lokal na customs office.
- Particular Manifests, Certified by Customs Officer – dapat may proper na dokumentasyon.
- Owner May Export Remains of the Wreck – karagdagang pahintulot para sa pag-export ng labi ng wreck.
- Remains Include Hull, Rigging, Sea Stores, Goods, Equipment (Sails, Ropes, Chain Anchors) – malawak na depinisyon ng "remains."

💡 Simpleng Paliwanag
Kung may nawasak na barko o eroplano sa Pilipinas, hindi kailangang dumaan sa customs office kung saan ito na-wreck bago maipadala ang na-save na cargo papunta sa tunay na destinasyon nito — may special na proseso ito, basta't may approval mula sa Bureau. Pwede ring i-export ang mismong labi ng wreck (hull, equipment, atbp.) matapos ang proper na examination.

📦 Halimbawa
May isang cargo ship na nawasak malapit sa baybayin ng Palawan, na may lamang cargo na dapat sana ay dadalhin papunta sa Manila. Sa halip na dumaan pa sa customs office sa Palawan (kung saan ito na-wreck), maaaring hingin ng owner ng cargo ang approval ng Bureau para direktang ipadala ang na-save na goods papunta sa Manila, na siyang tunay na destinasyon nito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa mabilis at maayos na pamamahala ng mga emergency situation tulad ng shipwreck — hindi na kailangang idagdag pa ang komplikasyon ng dumaan sa maling customs district, na maaaring hindi handa para sa ganitong specialized na cargo.

⚠️ Dapat Tandaan
Ang "remains" ng wreck ay malawak ang saklaw — hindi lang basic hull, kundi pati na rin ang mga sea stores, goods, at equipment tulad ng sails, ropes, at chain anchors.

🎯 Board Exam Tip
I-relate ito sa Section 418 (Derelicts and Goods from Abandoned Wrecks) — magkaugnay ang dalawang provisions tungkol sa mga sitwasyon ng shipwreck.

❓ Madalas Malito ang Students
Tanong: "Kailangan pa bang mag-file ng bagong goods declaration para sa cargo na ma-forward mula sa isang wreck?" Sagot: Ang batas ay hindi nagbibigay ng detalyadong sagot dito — ang tinutukoy lang ng Section 417 ay ang authority na i-forward ang goods nang hindi dumadaan sa customs office kung saan ito na-wreck, hindi nito direktang sinasabi kung paano ang buong documentation process, na malamang na nasa ibang implementing rules.

🔗 Related Topics
Section 418 (Derelicts and Goods from Abandoned Wrecks), Section 404 (Owner of Imported Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 417 ng CMTA (Republic Act No. 10863) tungkol sa forwarding ng cargo at remains ng wrecked vessel o aircraft. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 418, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},520:{_label:"section 418 — Derelicts and Goods from Abandoned Wrecks",title:"Section 418: Proseso Para sa Derelicts at Goods mula sa Abandoned Wrecks",content:`📖 Kahulugan
Ang Section 418 ay naglalarawan ng detalyadong proseso para sa derelicts (nag-abandonang barko) at goods na na-recover mula sa dagat o abandoned wrecks — mula sa jurisdiction, custody, pag-notify sa District Collector, hanggang sa dutiability at appraisal process ng mga ganitong goods.

🔍 Breakdown
- Under Jurisdiction of the Port Where Goods Arrive – ang basehan ng jurisdiction.
- Retained in Custody of the Bureau – dapat nasa Bureau of Customs ang custody.
- Deemed Property of Government if Unclaimed – kung walang nag-claim, mapupunta sa gobyerno.
- Manifest Required for Lighters/Other Craft – dapat may proper na dokumentasyon kung sino ang naghatid.
- Immediate Notice to District Collector – mabilisang requirement ng pag-report.
- District Collector Represented at Salvage – para maiwasan ang fraud, dapat may representative sa salvage operations.
- Prima Facie Dutiable – default assumption na dapat magbayad ng duties, maliban kung mapatunayang Philippine production.
- Foreign Goods Landed from Vessel in Distress Dutiable if Sold/Disposed in Philippines – specific na rule para sa vessel in distress.
- Appraisal Before Admission to Customs Territory – dapat may proper appraisal, may karapatan ding mag-appeal ang owner/importer.
- No Duty on Parts of Philippine Vessel/Aircraft – exemption para sa sariling Philippine na sasakyan.

💡 Simpleng Paliwanag
Kung may na-recover na goods mula sa dagat o mula sa isang abandoned wreck, may malinaw na proseso kung paano ito ha-handle — dapat itong ma-custody ng Bureau of Customs, dapat agad i-report sa District Collector, at dapat may representative ang Bureau sa mismong salvage operation para maiwasan ang fraud. Default assumption ay dutiable ito, maliban kung mapatunayang Philippine production. May special exemption din para sa mga parte ng Philippine vessel o aircraft mismo — hindi ito dapat mabayaran ng duty.

📦 Halimbawa
May isang foreign cargo ship na nawasak malapit sa baybayin ng Batangas. Nang ma-recover ang mga goods mula sa wreck, kinailangan itong i-custody ng Bureau of Customs, at agad na-report ito sa District Collector. Dahil hindi na-claim ng orihinal na may-ari sa loob ng reasonable time, ang mga goods na ito ay naging property ng gobyerno. Bago ito napa-admit sa customs territory, dumaan muna ito sa proper appraisal process.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa maayos na pamamahala ng mga hindi karaniwang sitwasyon tulad ng shipwreck — tinitiyak nito na hindi basta na lang "nawawala" o "na-uunclaimed" ang mga valuable na goods na na-recover, at may malinaw na proseso para sa dutiability nito.

⚠️ Dapat Tandaan
Mahalagang tandaan ang exemption para sa Philippine vessels/aircraft — "no part of a Philippine vessel or aircraft or its equipment... shall be subject to duty," kahit ito ay nawasak sa Philippine o foreign waters.

🎯 Board Exam Tip
I-memorize ang "prima facie dutiable" presumption para sa foreign vessels/aircraft, at ang exemption para sa Philippine vessels/aircraft — madalas itong pinagsasama sa exam bilang contrasting rules.

❓ Madalas Malito ang Students
Tanong: "Dutiable ba ang lahat ng goods na na-recover mula sa isang shipwreck?" Sagot: Hindi absolute — ang batas ay nagsasabing "prima facie dutiable" ang derelicts at goods mula sa foreign vessels/aircraft (ibig sabihin, dutiable maliban kung mapatunayang hindi), pero may specific na exemption para naman sa mga parte ng Philippine vessel o aircraft mismo, na hindi kailanman subject sa duty.

🔗 Related Topics
Section 417 (Forwarding of Cargo and Remains of Wrecked Vessel), Section 404 (Owner of Imported Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 418 ng CMTA (Republic Act No. 10863) tungkol sa derelicts at goods mula sa abandoned wrecks. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang dutiability rules at ang exemption para sa Philippine vessels, banggitin ang koneksyon nito sa Section 417, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},522:{_label:"section 419 — Examination of Goods",title:"Section 419: Ang Proseso ng Examination ng Goods",content:`📖 Kahulugan
Ang Section 419 ay naglalarawan sa general rules tungkol sa examination ng goods — dapat itong isagawa agad matapos ma-lodge ang goods declaration, may priority ang live animals at perishable goods, at karaniwan ay isinasagawa ito sa presensya ng declarant. Kukuha lang ng samples kung kinakailangan, at dapat minimal ang dami ng kukunin.

🔍 Breakdown
- Conducted Immediately After Goods Declaration Has Been Lodged – hindi dapat ma-delay ang examination.
- Priority to Live Animals, Perishable Goods – ang mga ito ang unang bibigyan ng pansin dahil sa urgency.
- Coordination and Joint Examination with Other Regulatory Agencies – posibleng magsama-sama ang Bureau at ibang ahensya sa examination.
- General Rule: In the Presence of the Declarant or Authorized Representative – default requirement, may exception.
- Absence Allowed in Exceptional Circumstances, Valid Grounds – ang exception, dapat may basehan.
- Bureau May Require Declarant's Presence or Assistance – karagdagang authority ng Bureau.
- Samples Taken Only When Needed, As Minimal as Possible – limitasyon sa pagkuha ng samples.

💡 Simpleng Paliwanag
Kapag kinakailangan ng examination ang isang shipment, dapat itong gawin agad matapos ma-file ang declaration — hindi dapat ipagpaliban. May priority din ang mga live animals at nabubulok na produkto dahil sa urgency. Karaniwan, dapat naroroon ang declarant o kanyang representative habang isinasagawa ang examination, pero may exception kung may valid na dahilan.

📦 Halimbawa
May isang shipment ng sariwang prutas mula Thailand na dumating sa Port of Manila. Dahil perishable goods ito, binigyan ito ng priority sa examination schedule, sa halip na hintayin pa ang turn nito katulad ng ibang regular na cargo. Naroroon ang customs broker bilang authorized representative ng importer habang isinasagawa ang examination.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak ang efficient at makatarungang proseso ng examination — hindi dapat mabulok ang mga perishable goods dahil lang sa red tape, at dapat protektado ang karapatan ng declarant na maroon habang sinusuri ang kanilang shipment.

⚠️ Dapat Tandaan
Ang absence ng declarant sa examination ay hindi basta-basta pinapayagan — dapat ito ay "exceptional circumstance" na may "valid and justifiable grounds," base sa regulasyon ng Secretary of Finance.

🎯 Board Exam Tip
I-memorize ang priority items: live animals at perishable goods — madalas itong specific na itinatanong bilang example ng "immediate examination" cases.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang laging naroroon ang declarant habang isinasagawa ang examination?" Sagot: Ito ang general rule, pero may exception — pwedeng isagawa ang examination nang wala ang declarant sa "exceptional circumstance" na may valid at justifiable grounds, base sa regulasyong ii-promulgate ng Secretary of Finance.

🔗 Related Topics
Section 420 (Conditions for Examination), Section 421 (Duties of Customs Officer), Section 411 (Contents of Goods Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 419 ng CMTA (Republic Act No. 10863) tungkol sa examination of goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang priority items at ang exception sa presence requirement, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},523:{_label:"section 420 — Conditions for Examination",title:"Section 420: Kailan Kinakailangan ang Physical Examination?",content:`📖 Kahulugan
Ang Section 420 ay naglalarawan sa mga kondisyon kung kailan kailangan ang physical examination ng goods, base sa mga specific na sitwasyon (paragraphs a-e). Kinikilala rin nito ang paggamit ng nonintrusive examination tulad ng x-ray machines, at may authority ang Commissioner na mag-exempt ng mga authorized economic operators mula sa physical examination.

🔍 Breakdown
- Nonintrusive Examination (X-ray Machines) – modernong alternative sa physical examination, base sa international standards.
- Physical Examination Conducted When (Paragraphs a-e) – limang specific na trigger conditions.
- Commissioner May Exempt AEOs or Trade Facilitation Program Participants – special exemption para sa mga trusted na negosyante.
- Physical Examination Shall Be Conducted in an Expeditious Manner – dapat mabilis, hindi dapat matagalan.

💡 Simpleng Paliwanag
Hindi lahat ng shipment ay dumadaan sa physical na pagbukas at pagsuri — may modernong teknolohiya tulad ng x-ray na ginagamit muna. Pero kung may specific na dahilan (tulad ng alert order, derogatory information, o random electronic selection), kailangan talaga ng physical examination. May mga "trusted" na negosyante rin (AEOs) na maaaring ma-exempt dito.

📦 Halimbawa
May isang container na dumaan sa x-ray scanning sa Port of Cebu bilang unang hakbang. Dahil normal ang lumabas na resulta at walang red flag, hindi na ito dumaan pa sa physical examination. Sa kabilang banda, may isa pang shipment na na-flag ng Alert Order mula sa competent authority, kaya kinailangan itong dumaan sa physical examination base sa paragraph (b).

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa balance sa pagitan ng efficiency (hindi lahat kailangang physical examination) at security (may malinaw na trigger conditions kung kailan talaga kinakailangan).

⚠️ Dapat Tandaan
Hindi automatic na exempted ang AEOs sa lahat ng klase ng examination — ang exemption ay discretionary power ng Commissioner ("may exempt"), hindi absolute right.

🎯 Board Exam Tip
I-memorize ang limang trigger conditions sa paragraphs (a-e) para sa physical examination — madalas itong hiwa-hiwalay na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kung AEO ang isang kumpanya, awtomatiko na bang exempted sila sa lahat ng klase ng examination?" Sagot: Hindi absolute — ang batas ay nagsasabing "may exempt," ibig sabihin discretionary power ito ng Commissioner, hindi automatic entitlement kahit AEO ang status ng kumpanya.

🔗 Related Topics
Paragraphs (a) hanggang (e) ng Section 420, Section 419 (Examination of Goods), CMO 09-2020 (AEO Program).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 420 ng CMTA (Republic Act No. 10863) tungkol sa conditions for examination. I-explain nang simple ang overview ng nonintrusive examination at physical examination triggers, magbigay ng practical na halimbawa, banggitin ang CMO 09-2020 tungkol sa AEO Program, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},524:{_label:"paragraph (a) — Derogatory Information",title:"Section 420(a): Physical Examination Dahil sa Derogatory Information",content:`📖 Kahulugan
Kailangan ng physical examination kung ito ay direktang inutos ng Commissioner base sa derogatory information tungkol sa isang shipment.

🔍 Breakdown
- Directed by the Commissioner – dapat mula sa Commissioner mismo ang utos, hindi basta kahit sinong customs officer.
- On Account of Derogatory Information – ang basehan — may negatibong impormasyon o intelligence tungkol sa shipment.

💡 Simpleng Paliwanag
Kung may natanggap na negatibong impormasyon o intelligence tungkol sa isang partikular na shipment — halimbawa, hinihinalang may smuggled goods — maaaring direktang mag-utos ang Commissioner na dumaan ito sa physical examination, kahit pa naka-normal ang lumabas sa x-ray o iba pang nonintrusive method.

📦 Halimbawa
May natanggap na intelligence report ang Bureau of Customs na isang partikular na importer sa Port of Manila ay posibleng gumagamit ng undervaluation scheme sa kanilang mga shipment. Base sa derogatory information na ito, direktang inutos ng Commissioner na dumaan sa physical examination ang susunod na shipment ng importer na ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang proactive na tool laban sa smuggling at fraud — hindi kailangang maghintay pa ng random selection kung may specific na intelligence na nagsasabing kailangan ng closer scrutiny ang isang shipment.

⚠️ Dapat Tandaan
Ang authority na ito ay nasa Commissioner, hindi sa ordinaryong customs officer o District Collector — ito ay isang mataas na antas na desisyon.

🎯 Board Exam Tip
I-relate ito sa intelligence-based enforcement approach ng Bureau of Customs — ang "derogatory information" ay karaniwang mula sa intelligence gathering o tip.

❓ Madalas Malito ang Students
Tanong: "Pwede bang mag-order ng physical examination ang isang District Collector base sa derogatory information, hindi lang ang Commissioner?" Sagot: Batay sa malinaw na wika ng batas, ang authority dito ay "directed by the Commissioner," kaya specific na sa Commissioner ang power na ito, hindi basta kahit sinong customs officer.

🔗 Related Topics
Section 420 (main provision), paragraph (b) — Alert Order.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 420, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa physical examination dahil sa derogatory information. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},525:{_label:"paragraph (b) — Alert Order",title:"Section 420(b): Physical Examination Dahil sa Alert Order",content:`📖 Kahulugan
Kailangan ng physical examination kung ang goods ay subject sa isang Alert Order na inisyu ng competent authority.

🔍 Breakdown
- Subject to an Alert Order – dapat may umiiral na Alert Order tungkol sa specific na shipment.
- Issued by Competent Authority – dapat mula sa tamang opisyal o ahensya ang Alert Order.

💡 Simpleng Paliwanag
Kung may "Alert Order" na inisyu para sa isang shipment — na parang "red flag" mula sa isang authorized na opisyal — awtomatiko itong dadaan sa physical examination, hindi na basta pwedeng i-clear gamit lang ang nonintrusive method.

📦 Halimbawa
May nag-isyu ng Alert Order ang isang District Collector sa isang shipment na dumating sa Port of Subic dahil sa hinala ng misdeclaration. Dahil may Alert Order na, kailangan itong dumaan sa physical examination base sa paragraph (b), hindi na sapat ang basic x-ray scan lamang.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ang Alert Order system ay isang mahalagang enforcement tool laban sa smuggling — ang mandatory physical examination na kasunod nito ay tinitiyak na hindi na-bypass ang isang flagged shipment.

⚠️ Dapat Tandaan
Ang batas ay hindi nagbibigay ng detalyadong depinisyon kung sino eksakto ang "competent authority" na maaaring mag-isyu ng Alert Order — malamang na nasa implementing rules ito i-detalye (tulad ng CAO 07-2019 na binanggit sa Section 204).

🎯 Board Exam Tip
I-relate ito sa CAO 07-2019 (Pre-Lodgement Control Order and Alert Order) na nabanggit sa mga naunang sections — ito ang implementing rule na may detalye tungkol sa Alert Orders.

❓ Madalas Malito ang Students
Tanong: "Pareho ba ang Alert Order dito sa 'derogatory information' sa paragraph (a)?" Sagot: Magkaiba ang dalawa — ang paragraph (a) ay tungkol sa direktang utos ng Commissioner base sa intelligence information, habang ang paragraph (b) ay tungkol sa isang formal na Alert Order na inisyu ng competent authority, na maaaring magkaibang opisyal kaysa sa Commissioner.

🔗 Related Topics
Section 420 (main provision), paragraph (a) — Derogatory Information, CAO 07-2019.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 420, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa physical examination dahil sa Alert Order. I-explain nang simple, magbigay ng practical na halimbawa, banggitin ang CAO 07-2019, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},526:{_label:"paragraph (c) — Electronically Selected",title:"Section 420(c): Physical Examination Dahil sa Electronic Selection",content:`📖 Kahulugan
Kailangan ng physical examination kung ang goods ay electronically selected para dito.

🔍 Breakdown
- Electronically Selected for Physical Examination – automated o computer-based na proseso ng pagpili kung aling shipment ang dadaan sa physical check.

💡 Simpleng Paliwanag
Hindi lang basta random o manual na desisyon ang nagde-determine kung aling shipment ang dadaan sa physical examination — may computer o electronic system na maaaring mag-select nito, malamang base sa risk management criteria o algorithm.

📦 Halimbawa
Sa proseso ng automated risk assessment ng Bureau of Customs, may isang shipment na na-flag ng electronic system para sa physical examination base sa certain risk factors, kahit walang specific na Alert Order o derogatory information na natanggap.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang bahagi ng modernong risk management approach ng Bureau of Customs — hindi lang manual decision-making ang ginagamit, kundi may automated system din na tumutulong tukuyin kung aling shipment ang mas mataas ang risk.

⚠️ Dapat Tandaan
I-relate ito sa Section 301 tungkol sa risk management systems na ginagamit ng Bureau — ang "electronic selection" dito ay konektado sa mas malawak na framework ng automated customs control.

🎯 Board Exam Tip
I-connect ito sa Section 301 (Customs Control Over Goods) — parehong nag-eemphasize sa paggamit ng automation at risk management systems ng Bureau.

❓ Madalas Malito ang Students
Tanong: "Ano ang batayan ng electronic system para pumili ng shipment na dadaan sa physical examination?" Sagot: Ang batas mismo ay hindi nagbibigay ng detalye kung ano ang exact na criteria o algorithm na ginagamit ng electronic system — malamang na ito ay bahagi ng internal risk management system ng Bureau na hindi nakadetalye sa CMTA mismo.

🔗 Related Topics
Section 420 (main provision), Section 301 (Customs Control Over Goods — risk management systems).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 420, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa physical examination dahil sa electronic selection. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 301 tungkol sa risk management, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},527:{_label:"paragraph (d) — Issues/Controversies",title:"Section 420(d): Physical Examination Dahil sa Issues o Controversies",content:`📖 Kahulugan
Kailangan ng physical examination kung may issues at controversies na nakapaligid sa goods declaration at sa import clearance process.

🔍 Breakdown
- Issues and Controversies – malawak na termino, maaaring kasama ang disputes, questions, o hindi pagkakaunawaan.
- Surrounding the Goods Declaration and Import Clearance Process – ang saklaw ng issues, kaugnay sa proseso ng declaration at clearance.

💡 Simpleng Paliwanag
Kung may hindi malinaw o pinagtatalunan tungkol sa isang goods declaration — halimbawa, may dispute sa classification o valuation — maaaring kailanganin ang physical examination para malinawan ang sitwasyon, sa halip na umasa lang sa mga dokumento.

📦 Halimbawa
May dispute sa pagitan ng importer at customs officer tungkol sa tamang tariff classification ng isang shipment sa Port of Davao — hindi sila magkasundo kung ano talaga ang klase ng produkto base sa mga dokumento lang. Para malutas ang controversy na ito, kinailangan ng physical examination para malinaw na matukoy ang tamang classification.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang paraan para malutas ang mga dispute sa pamamagitan ng aktwal na pagtingin sa goods, sa halip na umasa lang sa paper documentation na maaaring hindi sapat para malutas ang isyu.

⚠️ Dapat Tandaan
Malawak ang saklaw ng "issues and controversies" — hindi ito limitado sa isang specific na klase ng dispute, kundi general na provision para sa kahit anong klase ng hindi pagkakaunawaan sa declaration o clearance process.

🎯 Board Exam Tip
I-relate ito sa konsepto ng dispute resolution sa customs — ang physical examination ay maaaring magsilbing paraan para malutas ang mga technical disputes.

❓ Madalas Malito ang Students
Tanong: "Sino ang nagde-decide kung may sapat na 'issue o controversy' para mag-trigger ng physical examination?" Sagot: Ang batas mismo ay hindi nagbibigay ng detalyadong criteria para dito — malamang na ito ay discretionary judgment ng customs officer o District Collector base sa specific na sitwasyon ng bawat kaso.

🔗 Related Topics
Section 420 (main provision), Section 421 (Duties of Customs Officer).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 420, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa physical examination dahil sa issues at controversies. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},528:{_label:"paragraph (e) — Importer/Declarant Request",title:"Section 420(e): Physical Examination Dahil sa Request ng Importer o Declarant",content:`📖 Kahulugan
Kailangan ng physical examination kung ang importer o declarant mismo ang humiling nito.

🔍 Breakdown
- The Importer or Declarant Requests – ang initiative para sa examination ay nagmula sa mismong importer o declarant, hindi sa Bureau.

💡 Simpleng Paliwanag
Kung ikaw mismo, bilang importer o declarant, ay gustong mapatunayan ang kalagayan o detalye ng iyong shipment sa pamamagitan ng physical examination — halimbawa, para sa iyong sariling proteksyon o dokumentasyon — pwede kang humingi nito, at ito ay isasagawa base sa iyong request.

📦 Halimbawa
May isang importer na nag-import ng fragile na equipment sa Port of Manila, at gusto niyang matiyak na walang pinsala ang naganap sa transport bago pa man niya tanggapin ang shipment. Humiling siya ng physical examination sa Bureau of Customs bilang bahagi ng kanyang sariling due diligence, at ito ay isinagawa base sa kanyang request sa ilalim ng paragraph (e).

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil nagbibigay ito ng karapatan sa importer o declarant na proactive na protektahan ang kanilang sariling interes, sa halip na basta na lang umasa sa desisyon ng Bureau kung kailangan ba ng examination o hindi.

⚠️ Dapat Tandaan
Ito ang tanging paragraph sa listahan kung saan ang trigger ay nagmumula mismo sa importer o declarant, hindi sa Bureau o sa isang automated system.

🎯 Board Exam Tip
I-note na ito ang "voluntary" na trigger sa listahan ng physical examination conditions — kaiba ito sa ibang paragraphs na Bureau-initiated.

❓ Madalas Malito ang Students
Tanong: "May bayad ba ang importer kung sila mismo ang humiling ng physical examination?" Sagot: Base sa Section 422 (Customs Expenses Constituting Charges on Goods), ang cost ng examination ay para sa account ng importer o exporter — kaya malamang na applicable pa rin ito kahit boluntaryong request ng importer ang naging basehan ng examination.

🔗 Related Topics
Section 420 (main provision), Section 422 (Customs Expenses Constituting Charges on Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 420, paragraph (e) ng CMTA (Republic Act No. 10863) tungkol sa physical examination dahil sa request ng importer o declarant. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 422 tungkol sa examination costs, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},529:{_label:"section 421 — Duties of Customs Officer Tasked to Examine the Imported Goods",title:"Section 421: Ang mga Tungkulin ng Customs Officer sa Pag-eeksamin ng Goods",content:`📖 Kahulugan
Ang Section 421 ay naglilista ng mga specific na tungkulin ng customs officer na naatasang mag-examine, mag-classify, at mag-value ng goods. Kung hindi magampanan ng customs officer ang mga tungkuling ito, siya ay mapaparusahan base sa Section 1431 ng Title XIV ng CMTA.

🔍 Breakdown
Ang Section 421 ay ang "main provision" na nagbubukas sa listahan ng apat (4) na specific na duties (paragraphs a-d) ng isang customs officer sa examination proseso — mula sa pag-verify ng packages hanggang sa pag-report ng tamang declaration status. May malinaw ding consequence kung hindi ito magampanan — penalty base sa Section 1431.

💡 Simpleng Paliwanag
Hindi basta "tumingin lang" ang trabaho ng customs officer sa examination — may specific na checklist sila na dapat sundin, mula sa pagverify ng packages hanggang sa pagreport ng findings nila. At kung hindi nila ito tapat na gagawin, may parusa para dito base sa ibang probisyon ng CMTA.

📦 Halimbawa
Sa Port of Iloilo, may customs officer na naatasang mag-examine ng isang shipment ng imported textiles. Bilang bahagi ng kanyang tungkulin, sinuri niya kung tugma ang packages sa goods declaration, kumuha siya ng sample para sa laboratory analysis, nag-issue siya ng resibo para sa sample, at nag-report kung tama ang declared value, quantity, at classification ng shipment.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak ang accountability at integridad ng examination process — hindi ito basta "trust me" na proseso, kundi may malinaw na checklist na dapat sundin ng bawat customs officer.

⚠️ Dapat Tandaan
May malinaw na consequence kung hindi magampanan ang mga tungkuling ito — penalty base sa Section 1431, kaya seryoso ito bilang obligasyon, hindi basta discretionary.

🎯 Board Exam Tip
I-memorize ang apat na duties sa paragraphs (a-d), at ang koneksyon nito sa Section 1431 bilang consequence ng non-performance.

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung hindi ginampanan ng customs officer ang kanyang duties sa ilalim ng Section 421?" Sagot: Malinaw sa batas na ang "failure on the part of the customs officer to perform the above duties shall be penalized according to Section 1431 of Title XIV" — may specific na legal consequence para sa non-performance ng mga tungkuling ito.

🔗 Related Topics
Paragraphs (a) hanggang (d) ng Section 421, Section 419 (Examination of Goods), Section 1431 of Title XIV.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 421 ng CMTA (Republic Act No. 10863) tungkol sa duties of customs officer na naatasang mag-examine ng imported goods. I-explain nang simple ang overview ng apat na duties, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 1431, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},530:{_label:"paragraph (a) — Verify Packages Match Declaration",title:"Section 421(a): Pag-verify na Tugma ang Packages sa Declaration",content:`📖 Kahulugan
Ang unang tungkulin ng customs officer sa examination ay tukuyin kung ang mga packages para sa examination at ang kanilang laman ay tugma sa goods declaration, invoice, at ibang kaugnay na dokumento.

🔍 Breakdown
- Determine Whether the Packages and Their Contents – dalawang antas ng pag-verify — ang packaging mismo at ang laman nito.
- In Accordance with the Goods Declaration, Invoice and Other Pertinent Documents – ang basehan ng pagkumpara — dapat tugma sa mga naisumite nang dokumento.

💡 Simpleng Paliwanag
Ang unang trabaho ng customs officer sa examination ay simpleng "cross-check" — tignan kung ang aktwal na natanggap na packages, kasama ang laman nito, ay tumutugma sa sinabi sa goods declaration at invoice. Kung may discrepancy, ito ang unang babantayan.

📦 Halimbawa
May customs officer na nag-eeksamin ng isang shipment ng electronics sa Port of Cebu. Bilang unang hakbang, tinignan niya kung tugma ang bilang ng packages sa nakadeklara, at kung ang laman ng bawat kahon ay talagang mga electronics gaya ng nakasaad sa invoice, hindi ibang produkto na hindi nadeklara.

⭐ Bakit Mahalaga Ito?
Ito ang foundational check ng buong examination process — kung hindi tugma ang packages sa declaration, malaking red flag ito na maaaring magsimula ng mas malalim na imbestigasyon.

⚠️ Dapat Tandaan
Dalawang antas ang pag-verify dito — hindi lang ang packaging (bilang, kondisyon) kundi pati na rin ang laman (contents) mismo.

🎯 Board Exam Tip
Tandaan na ito ang "first step" sa examination duties — ang basic cross-checking bago pa man pumunta sa mas detalyadong duties tulad ng sampling.

❓ Madalas Malito ang Students
Tanong: "Ano ang gagawin ng customs officer kung hindi tugma ang packages sa declaration?" Sagot: Ang batas mismo ay hindi nagbibigay ng detalyadong susunod na hakbang dito sa paragraph (a) — pero ang discrepancy na ito ay maaaring maging basehan para sa mas detalyadong investigation, at maaari itong ma-connect sa duty niya sa paragraph (d) na i-report ang findings.

🔗 Related Topics
Section 421 (main provision), paragraph (d) — Report on Correct Declaration.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 421, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa pag-verify ng packages kumpara sa goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},531:{_label:"paragraph (b) — Take Samples",title:"Section 421(b): Pagkuha ng Samples Kung Kinakailangan",content:`📖 Kahulugan
Ang ikalawang tungkulin ng customs officer sa examination ay kumuha ng samples ng imported goods para sa examination o laboratory analysis, kung kinakailangan.

🔍 Breakdown
- Take Samples of the Imported Goods – ang aktwal na pagkuha ng specimen mula sa shipment.
- For Examination or Laboratory Analysis – dalawang posibleng layunin ng pagkuha ng sample.
- When Necessary – conditional, hindi automatic sa lahat ng shipment.

💡 Simpleng Paliwanag
Kung kinakailangan, dapat kumuha ng sample ang customs officer mula sa shipment — halimbawa, para sa karagdagang testing o laboratory analysis para matiyak ang tamang klasipikasyon o kalidad ng produkto. Konektado ito sa Section 416 na natutunan na natin tungkol sa examination of samples.

📦 Halimbawa
May customs officer na nag-eeksamin ng isang shipment ng chemical products sa Port of Batangas. Dahil kailangan niyang matiyak ang tamang komposisyon ng chemical (para sa tamang tariff classification), kumuha siya ng maliit na sample mula sa shipment para ipadala sa laboratory para sa analysis.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa mga sitwasyon kung saan hindi sapat ang basic visual inspection — kailangan ng scientific o technical na testing para matiyak ang tamang nature ng goods, lalo na sa mga complex na produkto tulad ng kemikal.

⚠️ Dapat Tandaan
I-relate ito sa Section 416 — ang mismong proseso ng pagkuha ng samples (receipting, retention, labeling) ay detalyadong nakasaad doon.

🎯 Board Exam Tip
I-connect ito nang direkta sa Section 416 (Examination of Samples) — ang duty na ito sa paragraph (b) ay konektado sa mas detalyadong proseso na nakasaad sa Section 416.

❓ Madalas Malito ang Students
Tanong: "Palagi bang kailangang kumuha ng sample sa bawat shipment na dumadaan sa physical examination?" Sagot: Hindi — malinaw sa batas na ito ay "when necessary," ibig sabihin conditional lang ito base sa pangangailangan, hindi automatic requirement sa lahat ng shipment.

🔗 Related Topics
Section 421 (main provision), Section 416 (Examination of Samples), paragraph (c) — Issue Receipt for Sample.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 421, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa pagkuha ng samples ng imported goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 416, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},532:{_label:"paragraph (c) — Issue Receipt for Sample",title:"Section 421(c): Pag-issue ng Resibo para sa Sample",content:`📖 Kahulugan
Ang ikatlong tungkulin ng customs officer sa examination ay mag-issue ng resibo para sa anumang sample na kinuha at na-retain habang isinasagawa ang examination.

🔍 Breakdown
- Issue a Receipt – ang mismong dokumentasyon ng pagkuha ng sample.
- For a Sample Taken and Retained – dapat kasama ang parehong pagkuha at pagretain ng sample.
- During Examination – dapat mangyari ito sa panahon ng examination process.

💡 Simpleng Paliwanag
Kung kumuha ng sample ang customs officer (base sa duty niya sa paragraph b), dapat siyang mag-issue ng resibo para dito — para may proper na dokumentasyon at accountability sa pagkuha ng sample. Ito ang direktang implementasyon ng requirement na nakita natin sa Section 416.

📦 Halimbawa
Matapos kumuha ng sample mula sa isang shipment ng cosmetic products sa Port of Manila, agad na nag-issue ang customs officer ng resibo na nagpapatunay ng pagkuha ng sample, kasama ang detalye tungkol sa quantity at kaugnay na shipment.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa transparency at accountability — walang "unauthorized" o hindi dokumentadong pagkuha ng sample, dahil obligado ang customs officer na mag-issue ng resibo bilang proof.

⚠️ Dapat Tandaan
Direktang konektado ito sa Section 416 tungkol sa "properly receipted for" na requirement — ang paragraph (c) ay ang specific na duty ng officer na mag-implement nito.

🎯 Board Exam Tip
I-pair ang paragraph (b) at (c) bilang magkasunod na duties — kumuha ng sample (b), tapos mag-issue ng receipt para dito (c).

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung walang na-issue na resibo para sa isang sample na kinuha?" Sagot: Ang batas mismo ay hindi nagbibigay ng detalyadong consequence dito sa paragraph (c) mismo, pero ang failure na gawin ang duty na ito ay maaaring ma-penalize base sa general provision ng Section 421 na tumutukoy sa Section 1431.

🔗 Related Topics
Section 421 (main provision), paragraph (b) — Take Samples, Section 416 (Examination of Samples).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 421, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa pag-issue ng resibo para sa sample. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa paragraph (b) at Section 416, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},533:{_label:"paragraph (d) — Report Correct Declaration",title:"Section 421(d): Pag-report kung Tama ang Declaration",content:`📖 Kahulugan
Ang ikaapat at huling tungkulin ng customs officer sa examination ay i-report kung ang goods ay tama ang pagkakadeklara pagdating sa value, quantity, measurement, weight, tariff classification, at kung hindi ito na-import nang labag sa batas.

🔍 Breakdown
- Report Whether the Goods Have Been Correctly Declared – ang huling output ng examination proseso — isang formal na report.
- As to Value, Quantity, Measurement, Weight, Tariff Classification – limang specific na aspeto na dapat i-verify.
- Not Imported Contrary to Law – karagdagang check kung ang goods ay hindi labag sa batas (halimbawa, hindi prohibited o restricted nang walang authorization).

💡 Simpleng Paliwanag
Matapos ang buong examination process — pagsuri ng packages, pagkuha ng sample, atbp. — dapat gumawa ng final na report ang customs officer kung tama ba ang lahat ng detalye na na-declare (value, quantity, weight, klasipikasyon) at kung legal ba ang buong importation.

📦 Halimbawa
Matapos ang detalyadong examination ng isang shipment ng imported machinery sa Port of Zamboanga, gumawa ang customs officer ng formal report na nagpapatunay na tama ang declared value, quantity, at tariff classification ng shipment, at walang violation ng batas na natagpuan.

⭐ Bakit Mahalaga Ito?
Ito ang "final output" ng buong examination duties — ang report na ito ang magiging basehan para sa tamang assessment ng duties/taxes, at para sa desisyon kung ire-release ba ang goods o may kailangan pang further action.

⚠️ Dapat Tandaan
Malawak ang saklaw ng report na ito — hindi lang value kundi pati na rin quantity, measurement, weight, tariff classification, AT legal compliance.

🎯 Board Exam Tip
I-memorize ang limang aspeto na dapat i-cover ng report: value, quantity, measurement, weight, tariff classification, plus ang legal compliance check.

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung natuklasan ng customs officer sa kanyang report na mali ang declared value?" Sagot: Ang batas mismo sa Section 421 ay hindi nagbibigay ng detalyadong susunod na hakbang dito — pero ito ay maaaring maging basehan para sa reassessment, dispute resolution proceedings (Section 201d), o maging para sa penalty proceedings depende sa severity ng discrepancy.

🔗 Related Topics
Section 421 (main provision), Section 411 (Contents of Goods Declaration), Section 1431 of Title XIV.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 421, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa pag-report kung tama ang declaration ng goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang limang aspeto na dapat i-cover, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},534:{_label:"section 422 — Customs Expenses Constituting Charges on Goods",title:"Section 422: Sino ang Nagbabayad sa Gastos ng Examination at Storage?",content:`📖 Kahulugan
Ang Section 422 ay nagsasaad na ang gastos ng examination ay para sa account ng importer o exporter, subject sa proper accounting at documentation. Lahat ng expenses na ginastos ng Bureau para sa handling o storage ng goods at ibang necessary operations ay chargeable laban sa goods, at nagiging isang lien dito.

🔍 Breakdown
- Cost of Examination for the Account of the Importer or Exporter – malinaw na ang importer/exporter, hindi ang Bureau, ang magbabayad ng examination costs.
- Subject to Proper Accounting and Documentation – dapat may malinaw na record ng mga gastos na ito.
- All Expenses for Handling or Storage – malawak na saklaw, hindi lang examination kundi pati na rin storage at handling.
- Chargeable Against the Goods – ang mismong goods ang "babayaran" ng mga expenses na ito.
- Constitute a Lien Thereon – katulad ng nakita natin sa Section 405 tungkol sa duties/taxes, may lien din ang gastos na ito sa mismong goods.

💡 Simpleng Paliwanag
Hindi libre ang examination at storage ng iyong shipment sa customs — ikaw bilang importer o exporter ang magbabayad ng mga gastos na ito. At katulad ng duties/taxes, kung hindi mo babayaran ang mga expenses na ito, maaaring i-hold ng gobyerno ang iyong goods bilang collateral (lien) hanggang hindi mo binabayaran.

📦 Halimbawa
May isang importer na nag-import ng heavy machinery sa Port of Manila na kinailangang mag-imbak nang matagal sa isang customs warehouse habang naghihintay ng kumpletong dokumento. Ang storage fees na natipon sa panahon ng imbakan na ito ay para sa account ng importer, at kung hindi niya babayaran ito, maaaring i-enforce ng Bureau ang lien sa mismong machinery.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para malinaw sa mga importer/exporter na hindi libre ang mga serbisyo ng Bureau of Customs tulad ng examination at storage — may kaukulang gastos ito na dapat nilang asahan at bayaran.

⚠️ Dapat Tandaan
I-relate ito sa Section 405 — parehong konsepto ng "lien" ang ginagamit, pareho sa duties/taxes at sa customs expenses, na nagbibigay ng malakas na proteksyon sa gobyerno para matiyak ang pagbabayad.

🎯 Board Exam Tip
I-connect ito sa Section 405 (Liability of Importer for Duties and Taxes) — parehong may konsepto ng lien sa goods bilang security para sa hindi pa nababayarang obligasyon.

❓ Madalas Malito ang Students
Tanong: "Sino ang nagbabayad ng gastos sa examination — ang Bureau of Customs o ang importer?" Sagot: Malinaw sa batas na "the cost of examination shall be for the account of the importer or exporter," kaya ang importer/exporter, hindi ang Bureau of Customs, ang responsable sa pagbabayad ng mga gastos na ito.

🔗 Related Topics
Section 405 (Liability of Importer for Duties and Taxes — konsepto ng lien), Section 419 (Examination of Goods), Section 421 (Duties of Customs Officer).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 422 ng CMTA (Republic Act No. 10863) tungkol sa customs expenses constituting charges on goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang konsepto ng lien at ang koneksyon nito sa Section 405, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},536:{_label:"section 423 — Determination of the De Minimis Value",title:"Section 423: Ang De Minimis Value — Kailan Walang Babayarang Duties/Taxes?",content:`📖 Kahulugan
Ang Section 423 ay nagtatakda ng "de minimis" value — kung ang FOB o FCA value ng goods ay P10,000 o mas mababa, WALANG duties at taxes na kokolektahin dito. Every three (3) taon matapos ang effectivity ng CMTA, ia-adjust ng Secretary of Finance ang halagang ito base sa Consumer Price Index (CPI) na inilalathala ng PSA.

🔍 Breakdown
- No Duties and Taxes Shall Be Collected – kumpletong exemption, hindi lang informal entry.
- FOB or FCA Value of P10,000 or Below – ang exact na threshold para sa de minimis exemption.
- Adjusted Every Three (3) Years – periodic review mechanism, katulad ng nakita natin sa Section 402(a).
- Using the CPI as Published by PSA – ang basehan ng adjustment.

💡 Simpleng Paliwanag
Kung sobrang liit ng value ng iyong shipment — P10,000 pababa base sa FOB o FCA — hindi ka na kailangang magbayad ng duties at taxes. Ito ang tinatawag na "de minimis" rule, na nag-aalis ng burden sa napakaliliit na transaksyon. Katulad ng threshold sa Section 402(a), maaari itong mag-adjust every three years base sa inflation.

📦 Halimbawa
May isang online shopper na nag-order ng maliit na accessory mula sa ibang bansa na nagkakahalaga lang ng P8,000 (FOB value). Dahil mas mababa ito sa P10,000 de minimis threshold, walang duties o taxes na kokolektahin dito kapag dumating ito sa Pilipinas.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para hindi maabala ang maliliit na transaksyon (tulad ng online shopping) ng napakaraming red tape at gastos na hindi naman katumbas ng liit ng value ng shipment.

⚠️ Dapat Tandaan
Huwag ipagkamali ang "de minimis" (Section 423, walang duties/taxes) sa "informal entry threshold" (Section 402a, P50,000, may duties/taxes pa rin pero simplified lang ang proseso) — magkaiba ang dalawang konsepto kahit magkatulad ang structure.

🎯 Board Exam Tip
I-memorize ang exact na de minimis threshold (P10,000) at i-differentiate ito sa informal entry threshold (P50,000 sa Section 402a) — madalas itong pinagsasama ng mga estudyante sa exam.

❓ Madalas Malito ang Students
Tanong: "Pareho ba ang P10,000 de minimis threshold dito sa P50,000 threshold sa Section 402(a)?" Sagot: Hindi — magkaiba ang dalawa. Ang de minimis (P10,000) ay nangangahulugang WALANG duties/taxes na babayaran, habang ang threshold sa Section 402(a) (P50,000) ay tumutukoy lang sa kung gagamit ka ng informal entry PROCESS — may duties/taxes ka pa ring babayaran doon, mas simple lang ang proseso.

🔗 Related Topics
Section 402(a) — Informal Entry Threshold, CAO 01-2017.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 423 ng CMTA (Republic Act No. 10863) tungkol sa De Minimis Value. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa informal entry threshold sa Section 402(a), banggitin ang CAO 01-2017, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},537:{_label:"section 424 — Duty of Customs Officer Tasked to Assess Imported Goods",title:"Section 424: Tungkulin ng Customs Officer sa Pag-assess ng Imported Goods",content:`📖 Kahulugan
Ang Section 424 ay nagsasaad na para sa layunin ng pag-assess ng duties at taxes sa imported goods, dapat i-classify, i-value, at tukuyin ng customs officer ang duties at taxes na dapat bayaran. Dapat din siyang maghanda at magsumite ng assessment report base sa itinatag ng CMTA.

🔍 Breakdown
- Classify, Value, and Determine the Duties and Taxes – tatlong core na gawain ng customs officer sa assessment process.
- Prepare and Submit an Assessment Report – ang formal na output ng buong proseso.
- As Established Under This Act – dapat sumunod sa itinakdang format o proseso ng CMTA.

💡 Simpleng Paliwanag
Matapos ma-examine ang goods (natutunan natin sa Sections 419-421), susunod na trabaho ng customs officer ay ang aktwal na assessment — tukuyin ang tamang classification, magtakda ng value, at kompyutin ang duties/taxes na dapat bayaran. Dapat din niya itong i-formalize sa isang assessment report.

📦 Halimbawa
Matapos ang examination ng isang shipment ng imported furniture sa Port of Cebu, ang customs officer ay nag-classify sa produkto sa tamang tariff heading, nagtakda ng tamang customs value, at kinompute ang duties at taxes na dapat bayaran ng importer, at inihanda niya ang assessment report na naglalaman ng lahat ng detalyeng ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito dahil ito ang "jembatan" sa pagitan ng examination at ng aktwal na pagbabayad — walang assessment, walang malinaw na basehan kung magkano ang dapat bayaran ng importer.

⚠️ Dapat Tandaan
I-relate ito sa Section 421 tungkol sa duties ng customs officer sa examination — ang Section 424 ay ang susunod na hakbang, tumutuon na sa aktwal na computation ng duties/taxes.

🎯 Board Exam Tip
I-connect ang Section 424 sa Section 421 bilang sunud-sunod na proseso: examination duties muna (421), tapos assessment duties (424).

❓ Madalas Malito ang Students
Tanong: "Pareho ba ang "examination" sa "assessment"?" Sagot: Magkaiba pero magkaugnay — ang examination (Section 419-421) ay ang pisikal na pagsuri sa goods, habang ang assessment (Section 424) ay ang pagtukoy ng tamang classification, value, at pagkompyut ng duties/taxes base sa impormasyong nakalap mula sa examination.

🔗 Related Topics
Section 421 (Duties of Customs Officer para sa Examination), Section 425 (Tentative Assessment), Section 429 (Final Assessment).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 424 ng CMTA (Republic Act No. 10863) tungkol sa duty ng customs officer na mag-assess ng imported goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 421, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},538:{_label:"section 425 — Tentative Assessment of Goods Subject to Dispute Settlement",title:"Section 425: Tentative Assessment Kapag May Dispute",content:`📖 Kahulugan
Ang Section 425 ay nagsasaad na ang assessment ay ituturing na "tentative" kung ang duties at taxes na initially na-assess ay pinagtatalunan (disputed) ng importer. Makukumpleto lang ang assessment sa pamamagitan ng final readjustment base sa tariff ruling (kung classification dispute) o sa final resolution ng protest case (kung valuation, rules of origin, o ibang customs issues). Maaari pang i-release ang goods habang tentative pa ang assessment, basta't may sapat na security na naka-post.

🔍 Breakdown
- Tentative Assessment – hindi pa final, dahil may dispute.
- If Duties and Taxes Initially Assessed Are Disputed by the Importer – ang trigger ng tentative status.
- Completed Upon Final Readjustment – ang assessment ay "makukumpleto" lang matapos malutas ang dispute.
- Tariff Ruling (Classification Dispute) or Final Resolution of Protest Case (Valuation, Origin, Other Issues) – dalawang klase ng resolution mechanism, depende sa klase ng dispute.
- District Collector May Allow Release Upon Posting of Security – hindi kailangang hintayin ang buong resolution bago ma-release ang goods.

💡 Simpleng Paliwanag
Kung hindi ka sang-ayon sa initial assessment ng customs (halimbawa, sa classification o valuation), ang assessment ay magiging "tentative" lang habang hinihintay ang resolution ng dispute. Hindi mo naman kailangang hintayin ang buong proseso bago makuha ang iyong goods — maaari itong ma-release kung mag-post ka ng security equivalent sa disputed amount.

📦 Halimbawa
May isang importer sa Port of Manila na hindi sang-ayon sa classification na ginawa ng customs officer sa kanyang shipment, na nagresulta sa mas mataas na duties. Habang hinihintay ang tariff ruling para malutas ang dispute, pinahintulutan ng District Collector ang release ng goods matapos mag-post ang importer ng security equivalent sa disputed amount.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para balansehin ang karapatan ng importer na kwestyunin ang isang assessment, habang tinitiyak pa rin ng gobyerno na hindi sila mawawalan ng access sa duties/taxes na dapat bayaran kung sakaling manalo sila sa dispute.

⚠️ Dapat Tandaan
Ang release ng goods habang tentative ang assessment ay DISCRETIONARY power ng District Collector ("may allow"), hindi automatic entitlement ng importer.

🎯 Board Exam Tip
I-differentiate ang dalawang klase ng dispute resolution: tariff ruling (para sa classification) vs. protest case resolution (para sa valuation, rules of origin, atbp.).

❓ Madalas Malito ang Students
Tanong: "Automatic bang ma-release ang goods kung mag-file ka ng dispute sa assessment?" Sagot: Hindi automatic — ito ay discretionary power ng District Collector ("may allow the release"), at kailangan pa ring mag-post ng sufficient security equivalent sa disputed amount bago ito ma-approve.

🔗 Related Topics
Section 424 (Duty of Customs Officer), Section 426 (Tentative Assessment of Provisional Declaration), Section 429 (Final Assessment).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 425 ng CMTA (Republic Act No. 10863) tungkol sa tentative assessment ng goods subject sa dispute settlement. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang dalawang klase ng dispute resolution, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},539:{_label:"section 426 — Tentative Assessment of Provisional Goods Declaration",title:"Section 426: Tentative Assessment ng Provisional Goods Declaration",content:`📖 Kahulugan
Ang Section 426 ay nagsasaad na ang assessment ng isang provisional goods declaration ay ituturing ding "tentative," at makukumpleto lang ito sa pamamagitan ng final readjustment matapos isumite ng declarant ang karagdagang impormasyon o dokumentasyon na kailangan para makumpleto ang declaration, sa loob ng panahong nakasaad sa Section 403.

🔍 Breakdown
- Assessment of a Provisional Goods Declaration – ang konteksto — natutunan na natin ang provisional declaration sa Section 403.
- Deemed Tentative – katulad din ng Section 425, hindi pa final ang assessment.
- Completed Upon Final Readjustment and Submission of Additional Information – ang trigger ng completion — kapag naisumite na ang kulang na impormasyon.
- Within the Period Provided in Section 403 – dapat sumunod sa 45-day (o extended) na timeline.

💡 Simpleng Paliwanag
Katulad ng nakita natin sa Section 425, ang assessment ng isang provisional declaration ay tentative din — pero dito, ang basehan ng "tentative" status ay hindi dispute, kundi ang kakulangan ng impormasyon. Makukumpleto lang ang assessment kapag naisumite na ng declarant ang kulang na dokumento sa loob ng 45-day period (o extended na panahon) base sa Section 403.

📦 Halimbawa
May isang importer na nag-file ng provisional goods declaration sa Port of Davao dahil hindi pa kumpleto ang kanyang certification documents. Ang initial assessment na ginawa base sa provisional declaration ay tentative pa, at makukumpleto lang ito matapos niyang isumite ang kulang na dokumento sa loob ng 45 araw, base sa Section 403.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para maintindihan na ang "tentative" na status ay hindi lang applicable sa disputes — applicable din ito sa mga sitwasyon kung saan hindi pa kumpleto ang impormasyon, na konektado sa flexibility na binigay ng Section 403.

⚠️ Dapat Tandaan
I-differentiate ito sa Section 425 — magkaiba ang basehan ng "tentative" status: Section 425 ay dahil sa dispute, habang Section 426 ay dahil sa incomplete information.

🎯 Board Exam Tip
I-pair ang Section 425 at 426 bilang dalawang klase ng "tentative assessment" — magkaiba ang trigger (dispute vs. incomplete info) pero parehong "di pa final" ang assessment.

❓ Madalas Malito ang Students
Tanong: "Pareho ba ang proseso ng pagkumpleto ng tentative assessment sa Section 425 at 426?" Sagot: Magkaiba — sa Section 425, ang completion ay nakadepende sa resolution ng dispute (tariff ruling o protest case), habang sa Section 426, ang completion ay nakadepende sa pagsumite ng declarant ng kulang na impormasyon sa loob ng timeline na nakasaad sa Section 403.

🔗 Related Topics
Section 403 (Provisional Goods Declaration), Section 425 (Tentative Assessment for Disputes), Section 411 (Contents of Goods Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 426 ng CMTA (Republic Act No. 10863) tungkol sa tentative assessment ng provisional goods declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa Section 425, banggitin ang koneksyon nito sa Section 403, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},540:{_label:"section 427 — Readjustment of Appraisal, Classification or Return",title:"Section 427: Kailan Pwedeng Baguhin ang Naunang Appraisal o Classification?",content:`📖 Kahulugan
Ang Section 427 ay nagsasaad na ang appraisal, classification, o return, na final na nang naipasa, naaprubahan, o na-modify ng District Collector, ay hindi na dapat baguhin o i-modify sa anumang paraan, MALIBAN sa apat na specific na sitwasyon (paragraphs 1-4).

🔍 Breakdown
- Appraisal, Classification or Return – ang mga naunang desisyon na tinatalakay dito.
- As Finally Passed Upon, Approved or Modified by the District Collector – dapat ito ay final na desisyon.
- Shall Not Be Altered or Modified – ang general rule — hindi na dapat baguhin.
- Except (Paragraphs 1-4) – apat na specific na exception kung kailan pwede pa ring baguhin.

💡 Simpleng Paliwanag
Once final na ang isang appraisal o classification desisyon ng District Collector, hindi na ito dapat basta na lang baguhin — para sa stability at finality ng proseso. PERO may apat na specific na sitwasyon kung saan pwede pa ring baguhin ito, tulad ng statement of error, request for reappraisal, protest, o pagkatapos ng compliance audit.

📦 Halimbawa
May isang shipment sa Port of Iloilo na na-appraise na ng District Collector, at itinuturing na final. Pagkalipas ng ilang buwan, natuklasan ng Commissioner sa pamamagitan ng compliance audit na may error sa naunang appraisal. Base sa paragraph (4), maaari pa ring i-demand ng Commissioner ang readjustment nito, kahit "final" na ito dati.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para balansehin ang finality (para sa predictability ng business) at flexibility (para maitama ang mga honest error o matukoy ang mga fraud sa pamamagitan ng audit).

⚠️ Dapat Tandaan
Ang general rule ay "shall not be altered" — mahigpit ito, kaya't ang apat na exception ay dapat na malinaw na maintindihan bilang tanging paraan para baguhin ang isang final na desisyon.

🎯 Board Exam Tip
I-memorize ang apat na exception (paragraphs 1-4) at ang kani-kanilang timeline: 1 year (statement of error), 15 days (reappraisal request), timely protest, at demand pagkatapos ng compliance audit.

❓ Madalas Malito ang Students
Tanong: "Wala na bang paraan para baguhin ang isang final na appraisal o classification?" Sagot: May apat na specific na paraan pa rin, nakalista sa paragraphs (1) hanggang (4) — kasama ang statement of error, request for reappraisal, timely protest, at demand ng Commissioner pagkatapos ng compliance audit.

🔗 Related Topics
Paragraphs (1) hanggang (4) ng Section 427, Section 912, Section 429 (Final Assessment), Section 430 (Period of Limitation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 427 ng CMTA (Republic Act No. 10863) tungkol sa readjustment ng appraisal, classification, o return. I-explain nang simple ang overview ng apat na exceptions, magbigay ng practical na halimbawa, banggitin ang Section 912, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},541:{_label:"paragraph (1) — Statement of Error Within 1 Year",title:"Section 427(1): Statement of Error sa Loob ng Isang Taon",content:`📖 Kahulugan
Maaaring baguhin ang final na appraisal, classification, o return sa loob ng isang (1) taon matapos ang pagbabayad ng duties, sa pamamagitan ng statement of error na alinsunod sa Section 912 ng CMTA, basta't ito ay aprubahan ng District Collector.

🔍 Breakdown
- Within One (1) Year After Payment of Duties – ang deadline ng exception na ito.
- Statement of Error – ang mekanismo — isang formal na dokumento na nagsasaad ng pagkakamali.
- In Conformity with Section 912 – dapat sumunod sa specific na proseso ng Section 912.
- Approved by the District Collector – dapat aprubahan ito, hindi automatic.

💡 Simpleng Paliwanag
Kung may natuklasang honest na pagkakamali sa isang appraisal o classification (halimbawa, computational error), may isang taon kang panahon mula sa pagbabayad ng duties para i-file ang "statement of error," na susundin ang proseso sa Section 912. Kailangan pa rin itong aprubahan ng District Collector bago ito magkaepekto.

📦 Halimbawa
May isang importer sa Port of Batangas na natuklasan, walong buwan matapos magbayad ng duties, na mayroon palang computational error sa naunang assessment ng kanyang shipment. Sa loob ng one-year window, nag-file siya ng statement of error alinsunod sa Section 912, na inaprubahan naman ng District Collector.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang "safety valve" para sa honest mistakes — hindi dapat permanenteng nakatali ang isang importer sa isang error na hindi naman sinadya, basta't sundin ang proper na proseso at timeline.

⚠️ Dapat Tandaan
Mahigpit ang one-year deadline — kailangang balikan ang Section 912 para sa detalyadong proseso ng pag-file ng statement of error.

🎯 Board Exam Tip
I-memorize ang one-year timeline mula sa payment of duties, at ang requirement na dapat sumunod sa Section 912 at aprubahan ng District Collector.

❓ Madalas Malito ang Students
Tanong: "Automatic bang maa-approve ang isang statement of error kung na-file ito sa loob ng one-year period?" Sagot: Hindi automatic — malinaw sa batas na dapat itong "approved by the District Collector," ibig sabihin may discretion pa rin ang District Collector kung aaprubahan ba ang statement of error, hindi lang basta pag-file na lang ang kailangan.

🔗 Related Topics
Section 427 (main provision), Section 912.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 427, paragraph (1) ng CMTA (Republic Act No. 10863) tungkol sa statement of error sa loob ng isang taon. I-explain nang simple, magbigay ng practical na halimbawa, banggitin ang koneksyon nito sa Section 912, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},542:{_label:"paragraph (2) — Reappraisal/Reclassification Request Within 15 Days",title:"Section 427(2): Request for Reappraisal o Reclassification sa Loob ng 15 Araw",content:`📖 Kahulugan
Maaaring baguhin ang final na appraisal o classification sa loob ng labinlimang (15) araw matapos ang pagbabayad, sa pamamagitan ng request para sa reappraisal o reclassification na dapat idirekta ng District Collector papunta sa Commissioner, kung sa tingin niya ay MABABA ang appraisal o classification.

🔍 Breakdown
- Within Fifteen (15) Days After Payment – mas mahigpit na deadline kumpara sa paragraph (1).
- Request for Reappraisal or Reclassification – ang mekanismo.
- Addressed to the Commissioner by the District Collector – ang District Collector mismo ang nagre-request sa Commissioner, hindi ang importer.
- If the Appraisal or Classification is Deemed to Be Low – ang specific na trigger — kung SA TINGIN ng District Collector ay mababa ang naunang assessment.

💡 Simpleng Paliwanag
Kung sa palagay ng District Collector, matapos ang final na assessment, ay MABABA pala ang naunang appraisal o classification (ibig sabihin, dapat sana mas mataas ang binayarang duties), may 15-day window siya para hilingin sa Commissioner na i-reappraise o i-reclassify ito. Mahalagang tandaan — ang District Collector ang nagre-request, hindi ang importer.

📦 Halimbawa
Matapos ang final assessment ng isang shipment ng electronics sa Port of Manila, napansin ng District Collector na parang mababa ang naunang appraisal na ginawa — malamang na mas mataas dapat ang duties na dapat bayaran. Sa loob ng 15 araw matapos ang payment, nag-request siya sa Commissioner para sa reappraisal ng shipment.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang proteksyon ng gobyerno laban sa mga underassessment — hindi lang ang importer ang may paraan para i-correct ang isang error, kundi pati na rin ang District Collector mismo, kung sa tingin niya ay may kulang sa revenue collection.

⚠️ Dapat Tandaan
Mahalagang i-highlight — ang REQUESTING PARTY dito ay ang DISTRICT COLLECTOR, hindi ang importer, kaiba ito sa paragraph (3) kung saan ang interested party (karaniwang ang importer) ang nagpo-protest.

🎯 Board Exam Tip
I-memorize ang 15-day timeline at ang tamang party na nagre-request (District Collector to Commissioner) — madalas itong nalilito sa paragraph (3).

❓ Madalas Malito ang Students
Tanong: "Pwede bang ang importer ang mag-request ng reappraisal sa ilalim ng paragraph (2) kung sa tingin nila ay mababa ang assessment?" Sagot: Hindi — malinaw sa batas na ang request na ito ay "addressed to the Commissioner by the District Collector," ibig sabihin ang District Collector ang nagre-request, hindi ang importer; ang importer's remedy ay nasa paragraph (3) sa pamamagitan ng protest.

🔗 Related Topics
Section 427 (main provision), paragraph (3) — Protest by Interested Party.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 427, paragraph (2) ng CMTA (Republic Act No. 10863) tungkol sa request for reappraisal o reclassification sa loob ng 15 araw. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung sino ang tamang requesting party, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},543:{_label:"paragraph (3) — Protest by Interested Party",title:"Section 427(3): Timely Protest ng Interested Party",content:`📖 Kahulugan
Maaaring baguhin ang final na appraisal, classification, o return sa pamamagitan ng request para sa reappraisal at/o reclassification, sa anyo ng isang timely protest na idirekta sa District Collector, kung ang interested party ay hindi nasisiyahan (dissatisfied) sa appraisal o return.

🔍 Breakdown
- Request for Reappraisal and/or Reclassification – katulad ng mekanismo sa paragraph (2), pero ibang requesting party.
- Timely Protest – dapat gawin ito sa tamang panahon (hindi specific na nakadetalye dito ang exact timeline).
- Addressed to the District Collector – dito ipinapadala ang protest, hindi direkta sa Commissioner.
- By the Interested Party – karaniwang ang importer o kanyang representative.
- If Dissatisfied with the Appraisal or Return – ang trigger — kung hindi sang-ayon ang interested party sa desisyon.

💡 Simpleng Paliwanag
Kaiba sa paragraph (2) kung saan ang District Collector ang nagre-request, dito naman sa paragraph (3), ang interested party mismo (karaniwang ang importer) ang maaaring mag-file ng "timely protest" sa District Collector, kung hindi sila sang-ayon sa naunang appraisal o classification.

📦 Halimbawa
May isang importer sa Port of Zamboanga na hindi sang-ayon sa final na appraisal ng kanyang shipment — sa tingin niya, mas mataas ang inilagay na value kumpara sa dapat. Nag-file siya ng timely protest sa District Collector, base sa paragraph (3), para hilingin ang reappraisal ng kanyang shipment.

⭐ Bakit Mahalaga Ito?
Ito ang pangunahing remedy ng importer laban sa isang hindi tamang assessment — nagbibigay ito ng due process para sa mga negosyanteng naniniwalang mali ang ginawang appraisal o classification sa kanilang shipment.

⚠️ Dapat Tandaan
Ang "timely" ay mahalagang qualifier — kahit hindi specific na nakadetalye ang exact timeline dito sa text, dapat itong gawin sa loob ng reasonable o itinakdang panahon, malamang na nasa ibang implementing rules (CAO 02-2020 tungkol sa Dispute Settlement).

🎯 Board Exam Tip
I-compare ang paragraph (2) (District Collector requests, sa Commissioner) at paragraph (3) (interested party protests, sa District Collector) — magkaiba ang parties at ang destinasyon ng request.

❓ Madalas Malito ang Students
Tanong: "Saan dapat i-file ang protest — sa Commissioner o sa District Collector?" Sagot: Base sa paragraph (3), ang protest ng interested party (karaniwang importer) ay dapat idirekta sa DISTRICT COLLECTOR, hindi direkta sa Commissioner — magkaiba ito sa paragraph (2) kung saan ang District Collector ang nagre-request sa Commissioner.

🔗 Related Topics
Section 427 (main provision), paragraph (2) — District Collector Request, CAO 02-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 427, paragraph (3) ng CMTA (Republic Act No. 10863) tungkol sa timely protest ng interested party. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa paragraph (2), banggitin ang CAO 02-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},544:{_label:"paragraph (4) — Demand by Commissioner After Compliance Audit",title:"Section 427(4): Demand ng Commissioner Matapos ang Compliance Audit",content:`📖 Kahulugan
Maaaring baguhin ang final na appraisal, classification, o return sa pamamagitan ng demand ng Commissioner, matapos makumpleto ang compliance audit, alinsunod sa mga probisyon ng CMTA.

🔍 Breakdown
- Upon Demand by the Commissioner – ang Commissioner mismo ang naghahain ng demand para sa readjustment.
- After the Completion of Compliance Audit – dapat matapos muna ang buong proseso ng compliance audit.
- In Accordance with the Provisions of This Act – dapat sumunod sa specific na proseso ng CMTA para sa compliance audit.

💡 Simpleng Paliwanag
Kung matapos ang isang comprehensive na compliance audit ng Commissioner (na maaaring gawin kahit pagkatapos ng ilang panahon mula sa orihinal na transaksyon), may natuklasang error o discrepancy, may authority ang Commissioner na i-demand ang readjustment ng naunang appraisal, classification, o return, kahit "final" na ito dati.

📦 Halimbawa
Matapos ang isang malawakang compliance audit na isinagawa ng Bureau of Customs sa isang malaking importer sa Port of Manila, natuklasan na may systematic na pattern ng underdeclaration sa mga naunang shipment. Base sa paragraph (4), maaaring i-demand ng Commissioner ang readjustment ng mga naunang "final" na appraisal ng mga shipment na ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang malakas na enforcement tool ng Commissioner — hindi dapat maging "safe haven" ang finality ng assessment para sa mga negosyanteng systematic na gumagawa ng underdeclaration, na maaari lang matuklasan sa pamamagitan ng detalyadong audit.

⚠️ Dapat Tandaan
I-relate ito sa Section 430 (Period of Limitation) — mahalagang malaman kung paano nag-interact ang authority na ito ng Commissioner sa three-year limitation period na nakasaad doon.

🎯 Board Exam Tip
I-connect ang paragraph (4) sa Section 430 — ang compliance audit demand ay maaaring maging exception sa general finality rule, pero dapat pa ring isaalang-alang ang three-year period of limitation.

❓ Madalas Malito ang Students
Tanong: "May time limit ba ang authority ng Commissioner na mag-demand ng readjustment matapos ang compliance audit?" Sagot: Ang batas mismo sa paragraph (4) ay hindi nagbibigay ng specific na timeline — pero mahalagang i-cross-reference ito sa Section 430 (Period of Limitation) na nagsasaad ng three-year conclusive period sa absensya ng fraud, na maaaring maging relevant na limitasyon dito.

🔗 Related Topics
Section 427 (main provision), Section 430 (Period of Limitation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 427, paragraph (4) ng CMTA (Republic Act No. 10863) tungkol sa demand ng Commissioner matapos ang compliance audit. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 430, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},545:{_label:"section 428 — Assessment of Duty on Less Than Entered Value",title:"Section 428: Espesyal na Kaso ng Assessment sa Mas Mababa sa Entered Value",content:`📖 Kahulugan
Ang Section 428 ay nagsasaad na, sa general rule, hindi dapat mag-assess ng duty sa halagang mas mababa sa entered value. Pero may exception: kung direktiba ito ng Commissioner sa mga kaso kung saan sinertify ng importer na ang entered value ay mas mataas sa dutiable value, at ang goods ay in-enter nang ganito para tumbasan ang pagtaas na ginawa ng appraiser sa katulad na mga kaso na pending pa sa re-appraisement. Ang mas mababang assessment ay pahihintulutan lamang kung ang contention ng importer ay ma-sustain ng isang final decision, at kung mapatunayang ginawa ito sa good faith matapos ang due diligence at inquiry.

🔍 Breakdown
- Duty Shall Not Be Assessed Upon an Amount Less Than the Entered Value – ang general rule.
- Unless by Direction of the Commissioner – ang exception, dapat mula sa Commissioner ang direktiba.
- Importer Certifies Entered Value Higher Than Dutiable Value – espesyal na sitwasyon kung saan sinasadya ng importer na mas mataas ideklara.
- To Meet Increases Made by Appraiser in Similar Cases Pending Re-appraisement – ang dahilan kung bakit ginawa ito ng importer.
- Lower Assessment Allowed Only if Importer's Contention Sustained by Final Decision – kondisyon bago pahintulutan ang mas mababang assessment.
- Action Taken in Good Faith After Due Diligence and Inquiry – karagdagang requirement — dapat honest at may sapat na pananaliksik ang ginawa ng importer.

💡 Simpleng Paliwanag
Ito ay medyo komplikadong sitwasyon — normally, hindi dapat mas mababa sa "entered value" ang basehan ng duty assessment. Pero may special na kaso: kung sinadya ng importer na mag-declare ng MAS MATAAS na value (kaysa sa totoong dutiable value niya), dahil gusto niyang "sumunod" sa mga pagtaas na ginagawa ng appraiser sa ibang katulad na kaso na pending pa ang resolution — pwede pa ring bigyan ng mas mababang assessment, PERO kailangan munang manalo ang kanyang contention sa isang final decision, at kailangang mapatunayang ginawa niya ito nang tapat at may sapat na pananaliksik.

📦 Halimbawa
May isang importer sa Port of Cebu na, dahil sa alam niyang may ongoing na dispute tungkol sa valuation ng katulad na produkto (na nagreresulta sa mas mataas na appraised value), sinadya niyang mag-declare ng mas mataas na entered value para "sumunod" sa parating na pagbabago, habang sertipikado niyang mas mababa talaga ang totoong dutiable value. Kung sa huli ay mananalo ang kanyang contention sa isang final decision, at mapatunayang ginawa niya ito nang tapat at may sapat na pananaliksik, maaari siyang bigyan ng mas mababang assessment kaysa sa kanyang entered value.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang proteksyon para sa mga importer na proactive at tapat na sumusunod sa parating na pagbabago sa valuation standards, nang hindi sila permanenteng natatali sa isang "pinataas" na entered value na ginawa lang nila bilang precaution.

⚠️ Dapat Tandaan
Mahigpit ang mga kondisyon dito — dapat certified ng importer ang sitwasyon, dapat manalo ang kanyang contention sa final decision, AT dapat mapatunayang good faith ang buong proseso.

🎯 Board Exam Tip
Ito ay isa sa mas komplikadong probisyon ng CMTA — mahalagang maintindihan ang buong context: pending re-appraisement sa ibang similar cases ang basehan ng buong sitwasyon.

❓ Madalas Malito ang Students
Tanong: "Bakit magde-declare ang isang importer ng mas mataas na value kaysa sa totoong dutiable value?" Sagot: Base sa batas, ito ay ginagawa para "tumbasan ang mga pagtaas na ginawa ng appraiser sa similar cases na pending pa sa re-appraisement" — sa madaling salita, proactive na pagsunod ng importer sa inaasahang pagbabago sa valuation standards, habang naghihintay pa ng final resolution.

🔗 Related Topics
Section 427 (Readjustment of Appraisal), Section 425 (Tentative Assessment for Disputes).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 428 ng CMTA (Republic Act No. 10863) tungkol sa assessment of duty on less than entered value. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang mga kondisyon bago pahintulutan ang mas mababang assessment, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},546:{_label:"section 429 — Final Assessment",title:"Section 429: Kailan Nagiging Final ang Assessment?",content:`📖 Kahulugan
Ang Section 429 ay nagsasaad na ang assessment ay ituturing na final labinlimang (15) araw matapos matanggap ng importer o consignee ang notice of assessment.

🔍 Breakdown
- Assessment Shall Be Deemed Final – ang malinaw na sinasabi ng probisyon — automatic na magiging final.
- Fifteen (15) Days After Receipt – ang exact na timeline.
- Of the Notice of Assessment – ang trigger event — kailan natanggap ang opisyal na abiso.
- By the Importer or Consignee – sino ang tumatanggap ng notice.

💡 Simpleng Paliwanag
Simple lang ang rule na ito — mula sa sandaling matanggap ng importer o consignee ang notice of assessment, may 15 araw silang panahon. Kapag lumipas ang 15 araw na walang ginawang aksyon (tulad ng protest), automatic na nagiging "final" ang assessment.

📦 Halimbawa
May isang importer sa Port of Iloilo na tumanggap ng notice of assessment para sa kanyang shipment noong ika-1 ng Marso. Kung walang ginawang protest o aksyon sa loob ng 15 araw (hanggang ika-16 ng Marso), automatic nang magiging final ang assessment na ito.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa finality at predictability ng customs process — malinaw ang timeline kung kailan dapat kumilos ang importer kung gusto nilang i-question ang isang assessment, at kailan ito magiging permanente.

⚠️ Dapat Tandaan
I-relate ito sa Section 427(3) tungkol sa "timely protest" — ang 15-day window na ito ay malamang ang basehan ng "timeliness" ng isang protest, kahit hindi explicit na nakasaad ang eksaktong koneksyon.

🎯 Board Exam Tip
I-memorize ang exact na 15-day timeline mula sa receipt ng notice of assessment — madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Ano ang mangyayari kung magpo-protest ang importer pagkatapos ng 15-day period?" Sagot: Ang batas mismo sa Section 429 ay hindi direktang nagsasaad ng consequence dito — pero dahil "deemed final" na ang assessment matapos ang 15 araw, malamang na mas mahirap na o hindi na tatanggapin ang isang huling protest, base sa konsepto ng finality na itinatakda ng probisyong ito.

🔗 Related Topics
Section 427(3) — Timely Protest, Section 430 (Period of Limitation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 429 ng CMTA (Republic Act No. 10863) tungkol sa final assessment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa timely protest sa Section 427(3), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},547:{_label:"section 430 — Period of Limitation",title:"Section 430: Ang Three-Year Conclusive Period ng Assessment",content:`📖 Kahulugan
Ang Section 430 ay nagsasaad na, sa absensya ng fraud at kapag ang goods ay final na naassess at na-release na, ang assessment ay magiging "conclusive" (hindi na mababago) sa lahat ng partido tatlong (3) taon mula sa petsa ng final payment ng duties/taxes, o sa pagkumpleto ng post clearance audit.

🔍 Breakdown
- In the Absence of Fraud – mahalagang qualifier, hindi applicable kung may fraud.
- Goods Have Been Finally Assessed and Released – dalawang kondisyon bago mag-apply ang limitation.
- Conclusive Upon All Parties – malakas na termino — hindi na puwedeng baguhin ng kahit sinong partido.
- Three (3) Years from Date of Final Payment – ang exact na timeline.
- Or Upon Completion of the Post Clearance Audit – alternatibong trigger event.

💡 Simpleng Paliwanag
Kung walang fraud, at final na naassess at na-release na ang isang shipment, may tatlong taon na "expiration date" ang assessment na ito — pagkatapos ng tatlong taon mula sa final payment (o pagkumpleto ng post clearance audit), hindi na ito mababago pa ng kahit sino, kahit ng gobyerno mismo.

📦 Halimbawa
May isang shipment sa Port of Manila na na-finally assess at na-release noong 2023, at walang fraud na natukoy. Base sa Section 430, tatlong taon mula sa petsa ng final payment (ibig sabihin, hanggang 2026), pagkatapos ay magiging conclusive na ang assessment na ito, at hindi na ito puwedeng baguhin pa, maliban na lang kung may fraud na matutuklasan.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa legal certainty ng mga negosyante — hindi sila dapat manatiling "exposed" sa panganib ng pagbabago ng assessment nang walang katapusan, basta't tapat naman sila at walang fraud na nangyari.

⚠️ Dapat Tandaan
Mahalagang exception ang "absence of fraud" — kung may fraud na natukoy, WALANG applicable na three-year limitation, ibig sabihin maaari pa ring baguhin ang assessment kahit lumipas na ang tatlong taon.

🎯 Board Exam Tip
I-relate ito sa Section 427(4) tungkol sa demand ng Commissioner matapos ang compliance audit — ang three-year period dito ay maaaring maging relevant na limitasyon sa authority na iyon, maliban kung may fraud.

❓ Madalas Malito ang Students
Tanong: "Applicable pa rin ba ang three-year limitation kung may fraud na natuklasan?" Sagot: Hindi — malinaw sa batas na ang limitation na ito ay "in the absence of fraud" lamang; kung may fraud, walang applicable na three-year conclusive period, at maaaring baguhin pa rin ang assessment kahit anong panahon na ang lumipas.

🔗 Related Topics
Section 429 (Final Assessment), Section 427(4) — Demand After Compliance Audit.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 430 ng CMTA (Republic Act No. 10863) tungkol sa period of limitation ng assessment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang exception para sa fraud, banggitin ang koneksyon nito sa Section 427(4), at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},548:{_label:"section 431 — Release of Goods after Payment of Duties and Taxes",title:"Section 431: Kailan Puwedeng I-release ang Goods?",content:`📖 Kahulugan
Ang Section 431 ay nagsasaad na ire-release ang mga na-declare na goods kapag ang duties, taxes, at ibang lawful charges ay nabayaran na o na-secure na, at nasunod na ang lahat ng pertinent laws, rules, at regulations. Kung kailangan ng laboratory analysis, detalyadong technical documents, o expert advice, maaari pa ring i-release ang goods bago pa man malaman ang resulta, basta't may sapat na security na naka-post ng declarant.

🔍 Breakdown
- Goods Declared Shall Be Released – ang general rule.
- When Duties and Taxes and Other Lawful Charges Have Been Paid or Secured – kondisyon #1 — bayad o naka-secure.
- All Pertinent Laws, Rules and Regulations Have Been Complied With – kondisyon #2 — compliant sa lahat ng requirements.
- Laboratory Analysis, Detailed Technical Documents, or Expert Advice – mga sitwasyon kung saan maaaring matagal pa ang proseso.
- May Release Goods Before Results Known – special exception para sa mga ganitong sitwasyon.
- After Posting of Sufficient Security – kondisyon para sa early release.

💡 Simpleng Paliwanag
Karaniwan, ire-release lang ang iyong goods kung nabayaran na ang lahat ng duties/taxes/charges, at compliant ka na sa lahat ng requirements. Pero kung matagal pa ang proseso ng laboratory testing o expert analysis (halimbawa, para sa specialized na produkto), pwede pa ring ma-release ang goods habang hinihintay ang resulta, basta't mag-post ka ng sapat na security.

📦 Halimbawa
May isang importer ng chemical products sa Port of Batangas na nangangailangan ng laboratory analysis para matukoy ang tamang classification. Sa halip na hintayin pa ang buong resulta ng lab test (na maaaring tumagal ng ilang linggo), pinahintulutan ang release ng goods matapos mag-post ang importer ng sufficient security, base sa Section 431.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa trade facilitation — hindi dapat "nakabara" ang isang shipment nang matagal kung ang delay ay dahil lang sa proseso ng testing o analysis, basta't protektado pa rin ang interes ng gobyerno sa pamamagitan ng security.

⚠️ Dapat Tandaan
Ang "paid or secured" ay nagbibigay ng dalawang opsyon — hindi laging kailangang aktwal na bayad, maaari ring "secured" (halimbawa, sa pamamagitan ng bond) bilang alternative.

🎯 Board Exam Tip
I-memorize ang dalawang pangkalahatang kondisyon (payment/security + compliance) at ang special exception para sa mga naghihintay pa ng laboratory/technical results.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang hintayin ang buong resulta ng laboratory analysis bago ma-release ang goods?" Sagot: Hindi kailangan — malinaw sa batas na maaaring i-release ang goods BAGO pa man malaman ang resulta ng laboratory analysis, technical documents, o expert advice, basta't mag-post ng sufficient security ang declarant.

🔗 Related Topics
Section 424 (Duty of Customs Officer to Assess), Section 405 (Liability of Importer), Section 432 (Release to Holder of Bill of Lading).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 431 ng CMTA (Republic Act No. 10863) tungkol sa release of goods after payment of duties and taxes. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang exception para sa laboratory analysis, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},549:{_label:"section 432 — Release of Goods to the Holder of Bill of Lading or Airway Bill",title:"Section 432: Proteksyon ng Customs Officer sa Pag-release Base sa Bill of Lading",content:`📖 Kahulugan
Ang Section 432 ay nagbibigay-proteksyon sa kahit sinong customs officer na nag-release ng goods sa consignee o lawful holder ng bill of lading o airway bill — hindi sila mananagot para sa anumang depekto o irregularidad sa negotiation nito, MALIBAN kung may notice sila ng ganitong depekto o irregularidad.

🔍 Breakdown
- Any Customs Officer Who Releases Goods – ang subject ng proteksyon.
- To the Consignee or Lawful Holder of the Bill of Lading or Airway Bill – ang tatanggap ng goods.
- Shall Not Be Liable for Any Defect or Irregularity in Its Negotiation – ang proteksyon — hindi mananagot ang officer.
- Unless the Customs Officer Has Notice of the Defect or Irregularity – ang exception — kung alam niya talaga ang problema.

💡 Simpleng Paliwanag
Kung nag-release ang isang customs officer ng goods sa taong may hawak ng bill of lading o airway bill (na mukhang legitimate), hindi siya mananagot kung sakaling may problema pala sa transfer o negotiation ng dokumentong ito — maliban na lang kung alam na niya talaga ang problema bago pa niya i-release ang goods.

📦 Halimbawa
May customs officer sa Port of Cebu na nag-release ng goods sa isang taong nagpakita ng bill of lading na tila legitimate. Nalaman lang mamaya na may irregularidad pala sa pagbenta o pag-transfer ng bill of lading na ito. Dahil hindi alam ng customs officer ang problemang ito noong nag-release siya, hindi siya mananagot base sa Section 432.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang proteksyon sa mga customs officer na tapat na gumaganap ng kanilang trabaho — hindi sila dapat managot para sa mga bagay na hindi naman nila alam o hindi nila kontrolado, basta't ginawa nila ang kanilang trabaho nang tapat.

⚠️ Dapat Tandaan
Ang proteksyon na ito ay hindi absolute — kung may "notice" ang customs officer ng defect o irregularity, mawawalan ito ng proteksyon.

🎯 Board Exam Tip
I-relate ito sa Section 433 — pareho itong tumatalakay sa release ng goods base sa bill of lading, pero ang Section 433 ay tumutukoy sa sitwasyon kung WALANG bill of lading na naipakita.

❓ Madalas Malito ang Students
Tanong: "Palaging protektado ba ang customs officer basta't may bill of lading na ipinakita sa kanya?" Sagot: Hindi absolute — malinaw sa batas na ang proteksyon ay applicable lamang "unless the customs officer has notice of the defect or irregularity," ibig sabihin kung alam niya talaga ang problema, hindi siya protektado.

🔗 Related Topics
Section 431 (Release of Goods after Payment), Section 433 (Release Without Production of Bill of Lading), Section 404 (Owner of Imported Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 432 ng CMTA (Republic Act No. 10863) tungkol sa release of goods sa holder ng bill of lading o airway bill. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 433, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},550:{_label:"section 433 — Release of Goods Without Production of Bill of Lading or Airway Bill",title:"Section 433: Espesyal na Proseso Kung Walang Bill of Lading na Ipinakita",content:`📖 Kahulugan
Ang Section 433 ay nagbabawal sa customs officer na mag-release ng goods sa kahit sino nang walang naisumiteng bill of lading o airway bill, MALIBAN kung may written order mula sa carrier o agent ng barko o eroplano. Kung ginamit ang ganitong written order bilang basehan ng release, hindi mananagot ang gobyerno o ang customs officer sa anumang pinsala na maaaring magmula sa maling pag-release. Dapat ding mag-require ang customs officer ng kopya ng bill kahit gumamit ng written order.

🔍 Breakdown
- No Customs Officer Shall Release Goods Without Submission of Bill of Lading or Airway Bill – ang general rule.
- Except on Written Order of the Carrier or Agent – ang exception, dapat may nakasulat na utos.
- Neither Government nor Customs Officer Liable for Damage from Wrongful Release – proteksyon kung ginamit ang written order.
- Customs Officer Shall Require Submission of a Copy of the Bill – karagdagang requirement kahit gumamit ng written order.

💡 Simpleng Paliwanag
Karaniwan, kailangan munang ipakita ang bill of lading o airway bill bago ma-release ang goods. Pero may exception — kung may nakasulat na utos ang carrier o agent, pwede pa ring i-release ang goods kahit wala pang aktwal na bill of lading na naipakita. Kung ginawa ito, hindi mananagot ang gobyerno o customs officer para sa anumang pinsalang maaaring mangyari, PERO dapat pa ring mag-require ng kopya ng bill.

📦 Halimbawa
May isang shipping agent sa Port of Manila na nagbigay ng written order para sa release ng isang cargo, dahil hindi pa naidedeliver ang aktwal na bill of lading sa consignee (nangyayari ito minsan sa mabilis na shipments). Kung susundin ng customs officer ang written order na ito at i-release ang goods, hindi na siya mananagot para sa anumang irregularidad na maaaring lumitaw mula sa transaksyong ito, basta't hiningi niya ang kopya ng bill.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang practical na solusyon sa mga sitwasyon kung saan hindi pa physically available ang bill of lading, pero legitimate naman ang transaksyon base sa written order ng carrier — nagbibigay ito ng flexibility habang may proteksyon pa rin para sa gobyerno.

⚠️ Dapat Tandaan
Kahit may exception para sa written order, HINDI ito nangangahulugang "walang requirement na kopya ng bill" — dapat pa ring i-require ng customs officer ang submission ng kopya ng bill.

🎯 Board Exam Tip
I-memorize ang kondisyon: written order mula sa carrier/agent, kasama ang requirement na kailangan pa ring mag-submit ng kopya ng bill — hindi ito "walang bill" scenario, kundi "walang orihinal na bill" scenario.

❓ Madalas Malito ang Students
Tanong: "Kung may written order, hindi na ba kailangan ng kahit anong bill of lading?" Sagot: Hindi tama — malinaw sa batas na kahit gumamit ng written order bilang basehan ng release, "the customs officer shall require the submission of a copy of the bill," kaya kailangan pa rin ng kopya ng bill kahit paano.

🔗 Related Topics
Section 432 (Release to Holder of Bill of Lading), Section 434 (Release of Goods Upon Order of Importer).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 433 ng CMTA (Republic Act No. 10863) tungkol sa release of goods without production of bill of lading o airway bill. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang requirement na kopya ng bill kahit may written order, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},551:{_label:"section 434 — Release of Goods Upon Order of Importer",title:"Section 434: Pag-authorize ng Importer na I-release ang Goods sa Ibang Tao",content:`📖 Kahulugan
Ang Section 434 ay nagpapahintulot sa isang importer na mag-isyu ng written authorization para sa release ng goods na naka-imbak sa isang bonded warehouse papunta sa ibang tao. Ang ganitong authorization ay hindi automatic na nag-aalis sa importer ng liability para sa duties, taxes, at ibang charges na dapat bayaran sa goods, MALIBAN kung ang taong binigyan ng authorization ang mag-assume ng liability na ito.

🔍 Breakdown
- Importer May Issue a Written Authorization – ang importer mismo ang nagbibigay ng pahintulot.
- For the Release of Goods Stored in a Bonded Warehouse – ang konteksto — specific sa bonded warehouse goods.
- To Another Person – ang tatanggap ng authorization, hindi na kailangang ang importer mismo.
- Shall Not Relieve the Importer from Liability – ang general rule — hindi awtomatikong nawawala ang responsibilidad ng importer.
- Unless the Person to Whom Release Was Authorized Assumes Such Liability – ang exception — kung ang bagong tao ang kusang tumatanggap ng liability.

💡 Simpleng Paliwanag
Kung ikaw ang importer at may goods na naka-imbak sa bonded warehouse, pwede mong bigyan ng written authorization ang ibang tao para kunin ang goods na iyon sa iyong ngalan. Pero mag-ingat — kahit binigyan mo na sila ng authorization, IKAW pa rin ang may pananagutan sa duties/taxes, MALIBAN na lang kung ang taong iyon mismo ang kusang-loob na tumanggap ng ganitong liability.

📦 Halimbawa
May isang importer na may goods na naka-imbak sa isang customs bonded warehouse sa Clark. Dahil siya ay nasa ibang bansa, nag-isyu siya ng written authorization sa kanyang business partner para kunin ang goods sa kanyang ngalan. Kung hindi kusang tinanggap ng business partner ang liability para sa duties/taxes, ang importer pa rin ang mananagot para dito, kahit siya na ang tumanggap ng authorization na kumuha ng goods.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para malinaw ang accountability — hindi puwedeng basta "maiwasan" ng importer ang kanilang liability sa duties/taxes sa pamamagitan lang ng pag-authorize ng ibang tao na kumuha ng goods sa kanilang ngalan.

⚠️ Dapat Tandaan
Mahalagang i-highlight na ang "assumption of liability" ng bagong tao ay dapat malinaw at explicit — hindi ito basta ipagpalagay lang, dapat itong aktwal na tinanggap ng taong iyon.

🎯 Board Exam Tip
I-relate ito sa Section 405 (Liability of Importer for Duties and Taxes) — parehong nag-eemphasize sa personal na responsibilidad ng importer para sa duties/taxes.

❓ Madalas Malito ang Students
Tanong: "Kung binigyan ko ng authorization ang ibang tao para kunin ang aking goods, ako pa rin ba ang may utang sa duties/taxes?" Sagot: Oo, sa general rule — malinaw sa batas na ang authorization ay "hindi relieve the importer from liability," MALIBAN kung ang taong binigyan mo ng authorization ay kusang-loob na tumanggap (assumes) ng ganitong liability.

🔗 Related Topics
Section 405 (Liability of Importer for Duties and Taxes), Section 433 (Release Without Production of Bill of Lading).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 434 ng CMTA (Republic Act No. 10863) tungkol sa release of goods upon order of importer. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 405 tungkol sa liability, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},552:{_label:"section 435 — Withholding Release Pending Satisfaction of Lien",title:"Section 435: Pag-hold ng Release Habang May Hindi Pa Nababayarang Lien",content:`📖 Kahulugan
Ang Section 435 ay nag-oobliga sa District Collector na i-withhold ang release ng imported goods kapag siya ay duly notified sa pamamagitan ng lawful order ng isang competent court, tungkol sa isang lien para sa freight, lighterage, o general average — MALIBAN kung nabayaran na o na-secure na ang claim. Sa kaso ng disagreement, maaaring i-release ng District Collector ang goods matapos bayaran ang freight at lighterage na dapat bayaran base sa quantity o weight na aktwal na na-landed at natukoy.

🔍 Breakdown
- District Collector Duly Notified Through Lawful Order of Competent Court – ang trigger event — dapat may formal na court order.
- Lien for Freight, Lighterage or General Average – tatlong klase ng lien na covered dito.
- Shall Withhold the Release – obligasyon ng District Collector, hindi discretionary.
- Unless the Claim Has Been Paid or Secured – ang exception para i-release.
- In Case of Disagreement, May Release After Payment of Freight/Lighterage on Actually Determined Quantity/Weight – proseso kung may hindi pagkakasundo.

💡 Simpleng Paliwanag
Kung ang District Collector ay opisyal na na-notify ng korte tungkol sa isang legal na claim (lien) para sa freight, lighterage, o general average sa isang shipment, obligado siyang i-hold ang release ng goods hangga't hindi ito nababayaran o na-securesecure. Kung may hindi pagkakasundo tungkol sa exact na halaga, maaari pa ring i-release ng District Collector ang goods matapos bayaran ang halaga base sa aktwal na quantity o weight na na-verify.

📦 Halimbawa
May isang shipping company na naghain ng kaso sa korte laban sa isang importer sa Port of Manila dahil sa hindi pa nababayarang freight charges. Nag-isyu ang korte ng order na nag-notify sa District Collector tungkol sa lien na ito. Base sa Section 435, kinailangan ng District Collector na i-withhold ang release ng goods hanggang hindi nababayaran o na-secure ang freight claim.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para maprotektahan ang mga legitimate na claim ng shipping companies o katulad na entities laban sa mga importer na hindi nagbabayad ng kanilang freight o related charges — ang Bureau of Customs ay naging "enforcement mechanism" para dito.

⚠️ Dapat Tandaan
Mahalagang tandaan ang "disagreement" provision — kahit may lien, may paraan pa rin para ma-release ang goods sa pamamagitan ng pagbayad base sa aktwal na natukoy na quantity/weight, hindi kailangang hintayin ang buong resolution ng dispute.

🎯 Board Exam Tip
I-memorize ang tatlong klase ng lien na covered: freight, lighterage, at general average — madalas itong specific na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang laging court order muna bago mag-withhold ang District Collector ng release dahil sa lien?" Sagot: Oo — malinaw sa batas na ang trigger ay "duly notified through a lawful order of a competent court," kaya kailangan talaga ng formal na court order bago mag-apply ang obligasyon na ito ng District Collector.

🔗 Related Topics
Section 431 (Release of Goods after Payment), Section 405 (Liability of Importer — lien concept).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 435 ng CMTA (Republic Act No. 10863) tungkol sa withholding release pending satisfaction of lien. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang tatlong klase ng lien, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},553:{_label:"section 436 — Fine or Surcharge on Goods",title:"Section 436: Kailangan Munang Bayaran ang Fine o Surcharge Bago Ma-release",content:`📖 Kahulugan
Ang Section 436 ay nagsasaad na ang goods na subject sa anumang fine o surcharge ay ire-release lamang matapos mabayaran ang fine o surcharge na iyon.

🔍 Breakdown
- Goods Subject to Any Fine or Surcharge – ang konteksto — may kaugnay na penalty ang goods.
- Shall Be Released Only After Payment – malinaw na kondisyon bago pa man mangyari ang release.

💡 Simpleng Paliwanag
Simple at diretso ang probisyong ito — kung may fine o surcharge na naka-attach sa iyong goods (halimbawa, dahil sa violation o penalty), hindi ito ire-release hangga't hindi mo binabayaran ang fine o surcharge na iyon.

📦 Halimbawa
May isang importer sa Port of Davao na na-penalize ng surcharge dahil sa late filing ng kanyang goods declaration. Hindi niya makukuha ang kanyang goods hangga't hindi niya binabayaran ang surcharge na ito, base sa Section 436.

⭐ Bakit Mahalaga Ito?
Mahalaga ito bilang enforcement mechanism ng Bureau of Customs — tinitiyak nito na hindi basta na lang "maiiwasan" ng isang importer ang pagbabayad ng fine o surcharge sa pamamagitan lang ng pagkuha ng kanilang goods.

⚠️ Dapat Tandaan
Malinaw at simple ang probisyong ito — walang exception o alternative na nakasaad, dapat talaga bayaran muna ang fine/surcharge bago ma-release ang goods.

🎯 Board Exam Tip
Simple pero mahalagang tandaan na ito ay isang direktang requirement — ang bayad ng fine/surcharge ay precondition sa release, hindi optional.

❓ Madalas Malito ang Students
Tanong: "Pwede bang i-release muna ang goods at saka na lang bayaran ang fine o surcharge?" Sagot: Hindi — malinaw sa batas na ang goods ay "shall be released only after the payment of the fine or surcharge," kaya dapat munang bayaran ang penalty bago pa man mangyari ang release.

🔗 Related Topics
Section 431 (Release of Goods after Payment of Duties and Taxes), Section 422 (Customs Expenses Constituting Charges on Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 436 ng CMTA (Republic Act No. 10863) tungkol sa fine or surcharge on goods. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 431, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},555:{_label:"section 437 — Traveler and Passenger Baggage",title:"Section 437: Simplified Procedure para sa Traveler at Passenger Baggage",content:`📖 Kahulugan
Ang Section 437 ay nag-oobliga sa Bureau na magbigay ng simplified customs procedure para sa processing ng traveler at kanilang baggage, base sa international agreements at customs best practices. Pinapayagan din ang mga traveler na mag-export ng goods para sa commercial purposes, basta't sumunod sa export formalities at bayaran ang export duties, taxes, at charges kung meron.

🔍 Breakdown
- Simplified Customs Procedure – hindi ito ang buong formal entry process, kundi mas mabilis at mas madali.
- Based on International Agreements and Customs Best Practices – hindi "gawa lang" na proseso, kundi may basehan sa global standards.
- Travelers Permitted to Export Goods for Commercial Purposes – karagdagang authority para sa mga traveler na hindi lang personal use ang layunin.
- Subject to Compliance with Export Formalities – may requirements pa rin, hindi basta libre-libre.
- Payment of Export Duties, Taxes and Charges, If Any – posibleng may bayad, depende sa klase ng goods.

💡 Simpleng Paliwanag
Ang mga pasaherong papasok o palabas ng bansa ay may special at mas simple na proseso sa customs — hindi katulad ng buong formal entry na dinadaanan ng malalaking commercial shipment. Kahit personal traveler ka lang, pwede ka pang mag-export ng goods para sa commercial purposes, basta't sundin mo ang tamang proseso at bayaran ang kaukulang duties/taxes kung meron.

📦 Halimbawa
May isang balikbayan na dumaan sa NAIA na may dalang personal effects sa kanyang bagahe — dumaan siya sa simplified na proseso ng customs, hindi katulad ng formal entry na ginagamit para sa malalaking commercial shipment. Sa kabilang banda, may isa pang pasaherong nagdadala ng mga handmade products para ibenta sa ibang bansa (commercial purpose) — pinapayagan siyang gawin ito, basta't sumunod siya sa export requirements at magbayad ng kaukulang duties/taxes.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa convenience ng mga ordinaryong Pilipinong naglalakbay — hindi dapat sila kailangang dumaan sa parehong komplikadong proseso na ginagamit para sa malalaking commercial cargo.

⚠️ Dapat Tandaan
Ang "commercial purpose" export ng traveler ay hindi "exempted" sa lahat ng requirements — dapat pa rin sundin ang export formalities at bayaran ang duties/taxes kung applicable.

🎯 Board Exam Tip
I-relate ito sa Section 402(b) (Personal at Household Effects) — pareho itong tumatalakay sa mga pasahero, pero ang Section 402(b) ay para sa IMPORTATION habang ang Section 437 ay mas malawak — kasama ang exportation ng goods.

❓ Madalas Malito ang Students
Tanong: "Pwede bang mag-export ng goods ang isang ordinaryong traveler para sa commercial purposes, hindi lang personal?" Sagot: Oo — malinaw sa batas na pinapayagan ang mga traveler na mag-export ng goods para sa commercial purposes, basta't sumunod sa necessary export formalities at magbayad ng export duties, taxes, at charges kung meron.

🔗 Related Topics
Section 402(b) — Personal and Household Effects, CAO 06-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 437 ng CMTA (Republic Act No. 10863) tungkol sa traveler and passenger baggage. I-explain nang simple, magbigay ng practical na halimbawa tungkol sa commercial export ng traveler, banggitin ang CAO 06-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},556:{_label:"section 438 — Postal Item or Mail",title:"Section 438: Simplified Procedure para sa Postal Item o Mail",content:`📖 Kahulugan
Ang Section 438 ay naglalarawan sa saklaw ng "postal item o mail" — kasama ang letter-post at parcels, base sa international practices tulad ng Acts of the Universal Postal Union (AUPU). Ginagamit ang simplified procedure para sa clearance ng postal items, at kung kumpleto ang impormasyon sa special declaration form (base sa AUPU), ito na mismo ang magsisilbing goods declaration — MALIBAN sa apat na specific na sitwasyon (paragraphs a-d) na nangangailangan pa rin ng separate goods declaration.

🔍 Breakdown
- Postal Item or Mail Includes Letter-Post and Parcels – malawak na depinisyon, base sa international standards.
- As Described in International Practices, e.g. AUPU – ang legal basis ng depinisyon.
- Simplified Procedure for Clearance – katulad ng ibang special categories (relief consignment, traveler baggage).
- Special Declaration Form as Goods Declaration – malaking simplification — hindi na kailangan ng separate goods declaration kung kumpleto ang special form.
- Except for Four Specific Cases (Paragraphs a-d) – may exception kung kailan kailangan pa rin ng separate declaration.

💡 Simpleng Paliwanag
Ang mga sulat at parcel na dumarating sa Pilipinas mula sa ibang bansa ay may sariling simplified na proseso — hindi na kailangan ng full-blown goods declaration kung ang special postal form (na sinusunod ang international standards) ay kumpleto na ang impormasyon. Pero may apat na exception kung kailan kailangan pa rin ng separate at full na goods declaration.

📦 Halimbawa
May isang parcel na dumating sa Pilipinas mula sa isang online shopping platform sa ibang bansa. Dahil kumpleto ang impormasyon sa special postal declaration form (base sa AUPU standards), hindi na kailangan pang mag-file ng separate goods declaration — ang special form mismo na ang magsisilbing goods declaration.

⭐ Bakit Mahalaga Ito?
Mahalaga ito lalo na ngayon sa panahon ng e-commerce at online shopping — malaking bilang ng parcel ang dumarating sa bansa araw-araw, kaya kailangan ng efficient at simplified na proseso para hindi ma-overwhelm ang sistema ng customs.

⚠️ Dapat Tandaan
Hindi lahat ng postal item ay automatic na dadaan sa simplified process lang — may apat na specific na exception (paragraphs a-d) kung kailan kailangan pa rin ng separate goods declaration.

🎯 Board Exam Tip
I-memorize ang apat na exception sa paragraphs (a-d) — madalas itong hiwa-hiwalay na itinatanong sa exam.

❓ Madalas Malito ang Students
Tanong: "Palagi bang sapat na ang special postal declaration form bilang goods declaration para sa lahat ng parcel?" Sagot: Hindi — malinaw sa batas na may apat na specific na sitwasyon (paragraphs a-d) kung saan kailangan pa rin ng separate goods declaration, kahit kumpleto ang impormasyon sa special postal form.

🔗 Related Topics
Paragraphs (a) hanggang (d) ng Section 438, Section 402(b) — Informal Entry for Personal Effects, CAO 09-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 438 ng CMTA (Republic Act No. 10863) tungkol sa postal item o mail. I-explain nang simple ang overview ng simplified procedure at ang special declaration form, magbigay ng practical na halimbawa, banggitin ang CAO 09-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},557:{_label:"paragraph (a) — Taxable Value Level",title:"Section 438(a): Separate Declaration Kung Sobra sa Taxable Value Level",content:`📖 Kahulugan
Kailangan ng separate goods declaration kung ang value ng postal item ay nasa loob ng level na itinakda ng Commissioner bilang taxable, kaya dapat itong ma-cover ng isang buong goods declaration.

🔍 Breakdown
- Goods Whose Value Fall Within the Level – may specific na value threshold.
- Determined to Be Taxable by the Commissioner – ang Commissioner ang nagtatakda ng exact na value level.
- Must Be Covered by a Goods Declaration – ang consequence — kailangan ng full declaration, hindi na sapat ang special postal form lang.

💡 Simpleng Paliwanag
Kung ang value ng iyong parcel ay sapat na para maging taxable (base sa threshold na itinakda ng Commissioner), hindi na sapat ang basic postal declaration form lang — kailangan mo nang mag-file ng buong goods declaration, katulad ng regular na importation.

📦 Halimbawa
May isang parcel na dumating mula sa ibang bansa na may value na sapat para ma-considered taxable base sa threshold na itinakda ng Commissioner. Dahil dito, hindi na sapat ang special postal declaration form lang — kinailangan pa ng recipient na mag-file ng separate at kumpletong goods declaration.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na ang mga mas malaking-value na parcel ay dumadaan pa rin sa mas detalyadong proseso ng goods declaration, hindi lang basic simplified na postal form, para sa tamang revenue collection.

⚠️ Dapat Tandaan
Ang exact na value threshold ay hindi nakadetalye dito sa batas mismo — ito ay "determined by the Commissioner," kaya kailangang balikan ang specific na implementing rules (tulad ng CAO 09-2020) para sa eksaktong halaga.

🎯 Board Exam Tip
I-relate ito sa de minimis value sa Section 423 (P10,000) — posibleng konektado ang parehong konsepto, pero mahalagang tandaan na ito ay specific na para sa postal items at itinatakda ng Commissioner.

❓ Madalas Malito ang Students
Tanong: "Ano ang exact na value threshold na tinutukoy dito?" Sagot: Ang batas mismo ay hindi nagbibigay ng specific na halaga — ito ay "determined by the Commissioner," kaya kailangang balikan ang implementing rules tulad ng CAO 09-2020 para sa detalyadong halaga.

🔗 Related Topics
Section 438 (main provision), Section 423 (De Minimis Value), CAO 09-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 438, paragraph (a) ng CMTA (Republic Act No. 10863) tungkol sa separate goods declaration kung sobra sa taxable value level para sa postal items. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 423 tungkol sa de minimis value, banggitin ang CAO 09-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},558:{_label:"paragraph (b) — Prohibited/Regulated Goods",title:"Section 438(b): Separate Declaration para sa Prohibited at Regulated Goods",content:`📖 Kahulugan
Kailangan ng separate goods declaration kung ang postal item ay kwalipikadong prohibited o regulated goods.

🔍 Breakdown
- Prohibited Goods – konektado sa Section 118, ang mga ganap na bawal na goods.
- Regulated Goods – konektado sa Section 117, ang mga goods na kailangan ng special clearance/permit.

💡 Simpleng Paliwanag
Kung ang laman ng parcel mo ay prohibited (talagang bawal, tulad ng nakita natin sa Section 118) o regulated (kailangan ng special permit, base sa Section 117), hindi na sapat ang simplified postal declaration form — kailangan ng buong goods declaration, para sa mas detalyadong scrutiny.

📦 Halimbawa
May isang parcel na dumating mula sa ibang bansa na naglalaman ng regulated na gamot (na kailangan ng FDA clearance). Dahil regulated goods ito, hindi na sapat ang basic postal declaration lang — kinailangan ng separate at buong goods declaration, kasama ang mga karagdagang requirements para sa regulated goods.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na ang mga sensitibong produkto — prohibited man o regulated — ay dumadaan pa rin sa proper na scrutiny, kahit ito ay dumarating lang sa pamamagitan ng mail o parcel.

⚠️ Dapat Tandaan
Huwag isipin na ang postal/mail channel ay "loophole" para makaiwas sa mga requirements ng prohibited o regulated goods — mas mahigpit pa nga ang proseso dito dahil kailangan ng separate declaration.

🎯 Board Exam Tip
I-relate ito nang direkta sa Sections 117 (Regulated) at 118 (Prohibited) — mahalagang balikan ang mga sectiong ito para malaman kung anong klase ng goods ang covered.

❓ Madalas Malito ang Students
Tanong: "Kung prohibited goods ang laman ng isang parcel, sapat na ba ang paggawa ng separate goods declaration para ito ay pumasok?" Sagot: Hindi — ang separate goods declaration ay requirement lang para sa proper na documentation, pero hindi nito nire-remove ang katotohanan na prohibited goods pa rin ito, na, base sa Section 118, ay talagang bawal na ipasok sa bansa kahit anong klase ng declaration ang gawin.

🔗 Related Topics
Section 438 (main provision), Section 117 (Regulated Importation), Section 118 (Prohibited Importation).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 438, paragraph (b) ng CMTA (Republic Act No. 10863) tungkol sa separate goods declaration para sa prohibited at regulated goods sa postal items. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Sections 117 at 118, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},559:{_label:"paragraph (c) — Goods Requiring Export Certification",title:"Section 438(c): Separate Declaration para sa Goods na Kailangan ng Export Certification",content:`📖 Kahulugan
Kailangan ng separate goods declaration kung ang exportation ng goods ay dapat sertipikado.

🔍 Breakdown
- Goods the Exportation of Which Must Be Certified – malawak na termino, tumutukoy sa mga goods na may specific na certification requirement bago pwedeng i-export.

💡 Simpleng Paliwanag
Kung ang goods na ipapadala mo palabas ng bansa sa pamamagitan ng mail ay kabilang sa klase na kailangan ng certification bago ito ma-export (halimbawa, cultural artifacts, endangered species products, atbp.), hindi na sapat ang basic postal declaration form — kailangan ng buong goods declaration para ma-verify ang certification.

📦 Halimbawa
May isang collector na nagpapadala ng antique item sa ibang bansa sa pamamagitan ng mail, kung saan kailangan ng certification mula sa National Museum bago ito pwedeng i-export bilang cultural heritage item. Dahil dito, hindi na sapat ang basic postal form lang — kinailangan ng separate goods declaration.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na ang mga goods na may special export certification requirement — halimbawa para sa cultural preservation o environmental protection — ay dumadaan pa rin sa proper na scrutiny kahit ito ay ipinadala lang sa pamamagitan ng mail.

⚠️ Dapat Tandaan
Ang batas mismo ay hindi nagbibigay ng specific na listahan kung anong klase ng goods ang "must be certified" — malamang na nasa ibang batas o regulasyon ito nakadetalye (halimbawa, cultural heritage laws, wildlife protection laws).

🎯 Board Exam Tip
Tandaan na ang paragraph na ito ay tungkol sa EXPORT certification, hindi import — mahalagang pagkakaiba ito sa direksyon ng transaksyon.

❓ Madalas Malito ang Students
Tanong: "Anong klase ng goods ang kailangan ng export certification?" Sagot: Ang batas mismo sa Section 438(c) ay hindi nagbibigay ng specific na listahan — ito ay malamang na nakadetalye sa ibang batas o regulasyon depende sa klase ng produkto (halimbawa, cultural artifacts, endangered species, atbp.).

🔗 Related Topics
Section 438 (main provision), Section 437 (Traveler Export of Commercial Goods).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 438, paragraph (c) ng CMTA (Republic Act No. 10863) tungkol sa separate goods declaration para sa goods na kailangan ng export certification. I-explain nang simple, magbigay ng practical na halimbawa, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},560:{_label:"paragraph (d) — Non-Consumption Customs Procedure",title:"Section 438(d): Separate Declaration para sa Goods na Hindi para sa Consumption",content:`📖 Kahulugan
Kailangan ng separate goods declaration kung ang imported goods ay nasa ilalim ng ibang klase ng customs procedure na hindi para sa consumption.

🔍 Breakdown
- Imported Goods Under a Customs Procedure Other Than for Consumption – konektado sa Section 401, na naglilista ng iba't ibang klase ng goods declaration (consumption, warehousing, admission, conditional importation, transit).

💡 Simpleng Paliwanag
Alalahanin natin ang Section 401 — may limang klase ng goods declaration: consumption, warehousing, admission, conditional importation, at transit. Kung ang layunin ng iyong postal item ay HINDI para sa consumption (halimbawa, para lang sa warehousing o transit), hindi na sapat ang basic postal form — kailangan ng separate at full goods declaration na angkop sa specific na klase ng procedure na iyon.

📦 Halimbawa
May isang parcel na dumating sa Pilipinas na naka-address sa isang bonded warehouse operator, na ang layunin ay i-store muna ang goods (warehousing) bago ito i-release para sa consumption. Dahil ito ay para sa warehousing procedure, hindi consumption, hindi na sapat ang basic postal declaration form — kailangan ng separate goods declaration na angkop sa warehousing procedure.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para matiyak na ang tamang klase ng goods declaration ang ginagamit base sa aktwal na layunin ng importation, hindi basta "one-size-fits-all" na simplified postal form para sa lahat ng klase ng procedure.

⚠️ Dapat Tandaan
I-relate ito nang direkta sa Section 401 — kailangang maintindihan ang limang klase ng goods declaration doon para lubos na maintindihan ang exception na ito.

🎯 Board Exam Tip
I-connect ang paragraph (d) sa Section 401 — ang default assumption ng simplified postal procedure ay para sa CONSUMPTION; kung iba ang layunin, kailangan ng separate declaration.

❓ Madalas Malito ang Students
Tanong: "Bakit hindi sapat ang simplified postal form kung hindi consumption ang layunin ng goods?" Sagot: Dahil ang bawat klase ng customs procedure (warehousing, admission, conditional importation, transit) ay may sariling specific na requirements at proseso, base sa Section 401 — kaya't kailangan ng separate at angkop na goods declaration, hindi basta ang generic na simplified postal form.

🔗 Related Topics
Section 438 (main provision), Section 401 (Importations Subject to Goods Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 438, paragraph (d) ng CMTA (Republic Act No. 10863) tungkol sa separate goods declaration para sa goods na hindi para sa consumption. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 401, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},561:{_label:"section 439 — Express Shipment",title:"Section 439: Simplified Procedure para sa Time-Sensitive na Express Shipments",content:`📖 Kahulugan
Ang Section 439 ay nag-oobliga sa Bureau na magbigay ng simplified customs procedures, base sa international standards at best practices, para sa air shipments na itinuturing na time-sensitive at nangangailangan ng pre-arrival clearance. Ang express shipments ng accredited air express cargo operators ay maaaring ma-release bago pa man mabayaran ang duty, tax, at ibang charges, basta't may sapat na security na naka-post.

🔍 Breakdown
- Simplified Customs Procedures Based on International Standards – katulad ng ibang special categories, may basehan sa global practices.
- Air Shipments Considered Time-Sensitive – ang specific na klase ng shipment na covered.
- Requiring Pre-Arrival Clearance – konektado sa Section 409 (Advance Lodgement).
- Express Shipments of Accredited Air Express Cargo Operators – dapat accredited ang operator, hindi kahit sino.
- May Be Released Prior to Payment – special na benefit — hindi na kailangang hintayin ang payment bago ma-release.
- Upon Posting of Sufficient Security – kondisyon para sa early release.

💡 Simpleng Paliwanag
Kung ikaw ay isang accredited air express cargo operator (tulad ng mga kilalang courier companies), may special at mas mabilis na proseso ang iyong shipments dahil sa urgency nito. Pwede pa itong ma-release BAGO pa man aktwal na bayaran ang duties/taxes, basta't mag-post ka ng sapat na security.

📦 Halimbawa
May isang accredited air express cargo operator na nagdadala ng urgent na medical supplies sa Ninoy Aquino International Airport. Dahil time-sensitive ito at ang operator ay accredited, na-release ang shipment bago pa man aktwal na mabayaran ang duties/taxes, matapos mag-post ng sufficient security ang operator.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa modernong e-commerce at logistics industry — maraming urgent shipments ang nangangailangan ng mabilis na proseso, at hindi dapat maantala ang mga ito ng masyadong mahabang customs procedure.

⚠️ Dapat Tandaan
Ang benefit na ito ay LIMITADO sa "accredited" air express cargo operators — hindi ito automatic na entitlement ng lahat ng shipment o operator.

🎯 Board Exam Tip
I-relate ito sa Section 409 (Advance Lodgement and Clearance) — parehong tumatalakay sa pre-arrival processing, pero ang Section 439 ay specific na sa air express shipments.

❓ Madalas Malito ang Students
Tanong: "Kahit hindi accredited ang isang courier company, pwede pa rin bang gamitin ang benefits na ito ng express shipment?" Sagot: Hindi — malinaw sa batas na ang special benefit na release bago ang payment ay limitado sa "express shipments of accredited air express cargo operators," kaya kailangan munang maging accredited operator para ma-enjoy ang benefit na ito.

🔗 Related Topics
Section 409 (Advance Lodgement and Clearance), CAO 05-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 439 ng CMTA (Republic Act No. 10863) tungkol sa express shipment. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 409, banggitin ang CAO 05-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},562:{_label:"section 440 — Establishment of Advance Customs Clearance and Control Program",title:"Section 440: Voluntary Program para sa Advance Clearance ng Containerized Cargoes",content:`📖 Kahulugan
Ang Section 440 ay nagbibigay sa Bureau ng authority na mag-establish at mag-implement ng isang voluntary program tungkol sa advance customs clearance at control para sa containerized cargoes. Ang mga detalye ng ganitong voluntary program ay subject sa rules and regulations na ii-issue ng Bureau, matapos magsagawa ng necessary public hearings at consultations sa mga concerned sectors.

🔍 Breakdown
- Bureau May Establish and Implement – discretionary power ng Bureau, hindi mandatory.
- Voluntary Program – hindi ito compulsory, importer/exporter ang magdedesisyon kung sasali o hindi.
- Advance Customs Clearance and Control – ang layunin ng program — pabilisin ang proseso sa pamamagitan ng advance processing.
- On Containerized Cargoes – specific na saklaw — para sa mga cargo na naka-container.
- Subject to Rules and Regulations – dapat may implementing rules.
- After Public Hearings and Consultations with Concerned Sectors – dapat may proper consultation bago i-finalize ang mga detalye.

💡 Simpleng Paliwanag
May authority ang Bureau of Customs na mag-establish ng isang "opt-in" na program para sa mga importer/exporter na gustong gamitin ang advance clearance system para sa kanilang containerized cargoes — hindi ito mandatory, sila mismo ang magdedesisyon kung sasali. Pero bago ma-finalize ang detalye ng program na ito, dapat munang magkaroon ng public hearings at consultation sa mga stakeholders.

📦 Halimbawa
May isang malaking logistics company na regular na nag-i-import ng containerized cargo sa Port of Manila. Kung sasali sila sa voluntary advance customs clearance program, maaari nilang ma-proseso ang kanilang mga shipment nang mas mabilis, base sa implementing rules na ginawa ng Bureau matapos ang public consultation sa mga stakeholder tulad nila.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para bigyan ng option ang mga malalaking importer/exporter na gustong mag-invest sa mas efficient na proseso, habang hindi naman ito ipinipilit sa lahat ng negosyante na hindi handa o hindi kailangan ng ganitong klase ng program.

⚠️ Dapat Tandaan
Ang "voluntary" na katangian ng program ay mahalagang tandaan — hindi ito mandatory requirement para sa lahat ng containerized cargo shipment.

🎯 Board Exam Tip
I-relate ito sa Section 409 (Advance Lodgement and Clearance) — magkatulad ang konsepto ng "advance processing," pero ang Section 440 ay specific na tungkol sa isang FORMAL VOLUNTARY PROGRAM para sa containerized cargoes, hindi general provision.

❓ Madalas Malito ang Students
Tanong: "Mandatory ba ang advance customs clearance program na ito para sa lahat ng containerized cargo?" Sagot: Hindi — malinaw sa batas na ito ay "voluntary program," kaya opsyonal lang ito para sa mga importer/exporter na gustong sumali, hindi ito mandatory requirement.

🔗 Related Topics
Section 409 (Advance Lodgement and Clearance), Section 439 (Express Shipment).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 440 ng CMTA (Republic Act No. 10863) tungkol sa establishment ng Advance Customs Clearance and Control Program. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang koneksyon nito sa Section 409, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},565:{_label:"section 500 — Export Declaration",title:"Section 500: Ang Export Declaration para sa Lahat ng Exported Goods",content:`📖 Kahulugan
Ang Section 500 ay nag-oobliga na LAHAT ng goods na ini-export mula sa Pilipinas — may export duty man o wala — ay dapat i-declare sa pamamagitan ng isang export declaration, na dapat na-sign nang electronic o iba pang paraan ng partido na gumagawa ng declaration, sa isang competent customs office. Dapat ding sapat at specific ang description ng goods sa export declaration para sa statistical purposes at para sa tamang valuation at classification.

🔍 Breakdown
- All Goods Exported from the Philippines – walang exception sa saklaw.
- Whether Subject to Export Duty or Not – kahit hindi dutiable, dapat pa rin ma-declare.
- Declared Through a Competent Customs Office – dapat sa tamang opisina.
- Export Declaration, Duly Signed Electronically or Otherwise – dapat may proper na signature, electronic man o iba.
- Sufficient and Specific Information for Statistical Purposes, Valuation, and Classification – katulad ng requirement sa import declarations, dapat detalyado ang description.

💡 Simpleng Paliwanag
Hindi lang ang mga papasok na goods (imports) ang kailangang i-declare — lahat ng lalabas na goods (exports) ay kailangan ding dumaan sa proseso ng export declaration, kahit hindi ito dutiable. Dapat detalyado ang description, katulad ng nakita natin sa mga import provisions.

📦 Halimbawa
May isang manufacturer sa Cebu na nag-e-export ng furniture papuntang Estados Unidos. Kahit walang export duty ang furniture na ito, dapat pa rin siyang mag-file ng export declaration sa competent customs office, na may sapat at detalyadong description para sa proper na statistical record at classification.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa comprehensive na tracking ng trade activities ng Pilipinas — hindi lang imports ang kailangang ma-monitor, kundi pati na rin ang exports, para sa tamang statistical data at economic planning.

⚠️ Dapat Tandaan
Huwag isipin na kung walang export duty ang isang produkto, hindi na kailangan pang mag-file ng export declaration — malinaw sa batas na "whether subject to export duty or not," dapat pa ring ma-declare.

🎯 Board Exam Tip
I-relate ito sa Sections 411-414 tungkol sa contents ng import goods declaration — magkatulad ang konsepto ng detailed description requirement, pero ito ay para sa EXPORT.

❓ Madalas Malito ang Students
Tanong: "Kung walang export duty ang isang produkto, kailangan pa rin bang mag-file ng export declaration?" Sagot: Oo — malinaw sa batas na lahat ng goods na ini-export ay dapat ma-declare "whether subject to export duty or not," kaya kahit walang duty, kailangan pa ring mag-file ng export declaration.

🔗 Related Topics
Section 501 (Export Product to Conform to Standard Grades), Section 502 (Lodgement and Processing), CAO 08-2020.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 500 ng CMTA (Republic Act No. 10863) tungkol sa export declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag kung bakit kailangan pa rin ng declaration kahit walang export duty, banggitin ang CAO 08-2020, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},566:{_label:"section 501 — Export Product to Conform to Standard Grades",title:"Section 501: Dapat Sumunod ang Export Products sa Standard Grades",content:`📖 Kahulugan
Ang Section 501 ay nag-oobliga na, kung applicable, ang mga export products ay dapat sumunod sa export standard grades na itinakda ng gobyerno. Ang packaging ng mga goods na ito ay dapat ding labeled at marked base sa kaugnay na batas at regulasyon. Hindi bibigyan ng export declaration ang mga goods na lumalabag sa mga requirement na ito.

🔍 Breakdown
- Products Shall Conform to Export Standard Grades – dapat sumunod sa itinakdang quality standards ng gobyerno.
- If Applicable – hindi lahat ng produkto ay may standard grade, conditional lang ito.
- Packaging Labeled and Marked in Accordance with Related Laws – karagdagang requirement para sa packaging.
- Export Declaration May Not Be Granted for Violating Goods – ang consequence — bawal mag-export kung hindi compliant.

💡 Simpleng Paliwanag
Hindi basta kahit anong kalidad ng produkto ang pwedeng i-export — kung may itinakdang standard grade ang gobyerno para sa iyong produkto (halimbawa, para sa agricultural exports), dapat itong sundin. Dapat din tamang naka-label at naka-marka ang packaging. Kung hindi ka sumunod sa mga requirement na ito, hindi ka bibigyan ng export declaration — ibig sabihin, hindi mo maaaring i-export ang produkto.

📦 Halimbawa
May isang agricultural exporter na nagpaplanong mag-export ng mangoes papuntang Japan. Dahil may itinakdang export standard grade ang gobyerno para sa mangoes (para sa quality assurance), kinailangan niyang tiyakin na ang kanyang produkto ay sumusunod dito, at tamang naka-label ang packaging, bago siya makapag-file ng valid na export declaration.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para maprotektahan ang reputasyon ng Philippine products sa international market — kung hindi consistent ang kalidad ng mga inieksport na produkto, maaaring masira ang tiwala ng foreign buyers sa Philippine exports sa kabuuan.

⚠️ Dapat Tandaan
Ang requirement na ito ay "if applicable" lang — hindi lahat ng produkto ay may itinakdang export standard grade, depende ito sa klase ng produkto at kung may specific na regulasyon para dito.

🎯 Board Exam Tip
I-note ang consequence ng non-compliance: "export declaration may not be granted" — malinaw na hindi lang "warning" ito, kundi maaaring hadlang sa aktwal na pag-export.

❓ Madalas Malito ang Students
Tanong: "Lahat ba ng export products ay may itinakdang standard grade na dapat sundin?" Sagot: Hindi — malinaw sa batas na ito ay "if applicable," kaya depende ito sa klase ng produkto kung may itinakdang export standard grade na dapat sundin o wala.

🔗 Related Topics
Section 500 (Export Declaration), Section 502 (Lodgement and Processing of Export Declaration).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 501 ng CMTA (Republic Act No. 10863) tungkol sa export product conforming sa standard grades. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang consequence ng non-compliance, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},567:{_label:"section 502 — Lodgement and Processing of Export Declaration",title:"Section 502: Manual at Electronic na Pag-lodge ng Export Declaration",content:`📖 Kahulugan
Ang Section 502 ay nag-oobliga sa Bureau na mag-promulgate ng rules and regulations para payagan ang parehong manual at electronic na paraan ng pag-lodge at pagproseso ng export declaration.

🔍 Breakdown
- The Bureau Shall Promulgate Rules and Regulations – obligasyon ng Bureau na gumawa ng implementing rules.
- Allow Manual and Electronic Lodgement – kaiba ito sa import goods declaration (na dapat electronic base sa Section 407), dito ay pinapayagan ang PAREHONG manual AT electronic.

💡 Simpleng Paliwanag
Kaiba sa import declarations na dapat electronic (base sa Section 407), ang export declaration naman ay may flexibility — pinapayagan ang parehong manual at electronic na paraan ng pag-file, base sa implementing rules na gagawin ng Bureau.

📦 Halimbawa
May isang maliit na exporter ng local handicrafts sa isang probinsya na hindi pa masyadong pamilyar sa electronic filing systems. Base sa Section 502, mayroon siyang option na mag-file ng export declaration nang manual, hindi kailangang electronic lang, kahit paano naman ay pinapayagan din ang electronic para sa mas efficient na proseso.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa accessibility — hindi lahat ng exporter, lalo na ang mga maliliit na negosyante, ay may access o kasanayan sa electronic systems, kaya binibigyan sila ng flexibility na gamitin ang manual na paraan kung kinakailangan.

⚠️ Dapat Tandaan
I-contrast ito sa Section 407 (Goods Declaration for IMPORTS) — doon, MANDATORY ang electronic lodgement; dito naman sa exports, PAYAGAN ang parehong manual at electronic.

🎯 Board Exam Tip
I-highlight ang pagkakaiba sa pagitan ng import (mandatory electronic, Section 407) at export (parehong manual at electronic pinapayagan, Section 502) — madalas itong ginagawang trap sa exam.

❓ Madalas Malito ang Students
Tanong: "Kailangan bang electronic lang ang export declaration, katulad ng import declaration?" Sagot: Hindi — malinaw na naiiba ito sa import declaration; para sa export, malinaw sa batas na dapat payagan ng Bureau ang PAREHONG manual at electronic na paraan ng pag-lodge, hindi mandatory na electronic lang.

🔗 Related Topics
Section 500 (Export Declaration), Section 407 (Goods Declaration and Period of Filing — para sa imports), CMO 09-2026 (AEDS PLUS), CMO 54-2010.`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 502 ng CMTA (Republic Act No. 10863) tungkol sa lodgement and processing ng export declaration. I-explain nang simple, magbigay ng practical na halimbawa, ipaliwanag ang pagkakaiba nito sa Section 407 para sa import declarations, banggitin ang CMO 09-2026 at CMO 54-2010, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},568:{_label:"section 503 — Rules of Origin",title:"Section 503: Pagtukoy sa Origin ng Export Goods at Self-Certification",content:`📖 Kahulugan
Ang Section 503 ay nagbibigay sa Bureau o ibang designated government agency ng authority na tukuyin ang origin ng goods para sa export, alinsunod sa applicable rules of origin, at kung angkop, mag-isyu ng kaukulang certificates of origin. Maaari ring gumamit ang exporter ng self-certification system, basta't ito ay duly accredited ng Bureau o ibang authorized government agencies.

🔍 Breakdown
- Pursuant to the Applicable Rules of Origin – may specific na batayan na sinusunod, hindi arbitrary.
- Bureau or Any Other Designated Government Agency – hindi lang Bureau of Customs ang pwedeng gumawa nito, may ibang authorized agencies din.
- Determine the Origin of Goods for Export – ang core function — tukuyin kung saan talaga "nagmula" ang goods.
- Issue Corresponding Certificates of Origin – ang formal na output kung applicable.
- Exporter May Adopt a Self-Certification System – alternatibong option para sa exporter.
- Provided That It Is Duly Accredited – kondisyon bago pwedeng gamitin ang self-certification.

💡 Simpleng Paliwanag
Kung kailangan mong patunayan kung saan talaga "gawa" o "nagmula" ang iyong export product (para sa trade agreement benefits, halimbawa), maaaring ang Bureau of Customs o ibang authorized agency ang mag-isyu ng certificate of origin para dito. Pero may alternative din — kung ikaw ay isang accredited exporter, pwede mo mismong i-certify ang origin ng iyong produkto (self-certification), hindi na kailangang umasa pa sa ibang ahensya.

📦 Halimbawa
May isang exporter ng processed food products sa Pilipinas na nagpaplanong mag-export papuntang isang bansang may free trade agreement sa Pilipinas. Para ma-avail ng preferential tariff rates base sa trade agreement, kailangan niyang patunayan ang Philippine origin ng kanyang produkto. Dahil siya ay isang accredited exporter, ginamit niya ang self-certification system sa halip na umasa pa sa ibang ahensya para sa certificate of origin.

⭐ Bakit Mahalaga Ito?
Mahalaga ito para sa international trade — ang rules of origin ay kritikal para sa pag-avail ng mga benepisyo mula sa trade agreements, at ang self-certification option ay nagbibigay ng efficiency para sa mga trusted na exporter.

⚠️ Dapat Tandaan
Ang self-certification ay hindi automatic entitlement ng lahat ng exporter — kailangan munang "duly accredited" ng Bureau o ibang authorized government agencies bago magamit ito.

🎯 Board Exam Tip
I-relate ito sa konsepto ng Authorized Economic Operator (AEO) na nakita natin sa Section 420 — parehong nagbibigay ng special privileges sa mga "trusted" o accredited na negosyante.

❓ Madalas Malito ang Students
Tanong: "Kahit hindi accredited, pwede bang mag-self-certify ang isang exporter ng origin ng kanyang produkto?" Sagot: Hindi — malinaw sa batas na ang self-certification system ay applicable lang "Provided, That it is duly accredited by the Bureau or any other authorized government agencies," kaya kailangan munang maging accredited bago magamit ang option na ito.

🔗 Related Topics
Section 500 (Export Declaration), Section 420 (Conditions for Examination — AEO concept).`,prompt:"Ipaliwanag mo nang mas detalyado ang Section 503 ng CMTA (Republic Act No. 10863) tungkol sa Rules of Origin at self-certification system. I-explain nang simple, magbigay ng practical na halimbawa tungkol sa trade agreements, ipaliwanag ang accreditation requirement, at magbigay ng tips para sa Customs Broker board exam kasama ang karaniwang maling akala ng mga estudyante."},571:{_label:"section 600 — Customs Transit in the Customs Territory",title:"Section 600 — Customs Transit sa Customs Territory",content:`📖 Kahulugan
Ang Section 600 ay tumutukoy sa customs transit — ang paglipat ng mga imported goods mula sa isang lugar patungo sa iba pang lugar sa loob mismo ng Pilipinas, habang nasa ilalim pa rin ng customs control at hindi pa cleared para sa consumption. Halimbawa, dumating ang cargo sa Maynila pero ang tunay na destinasyon ay sa Cebu o sa isang inland customs office — puwede itong idaan sa customs transit kung susundin ang mga kondisyon dito.

🔍 Breakdown
- Customs Transit: paglipat ng goods sa ilalim ng customs supervision, hindi pa cleared para sa consumption.
- Goods Intended for Consumption: hindi kasama dito; para lamang ito sa goods na dadaan lang, hindi direktang ibebenta o gagamitin agad sa bansa.
- Transit Permit: dokumentong kailangan bago i-move ang goods.
- Customs Seal/Fastening: tatak ng Customs sa container o truck para masigurong walang tampering.
- Customs Office of Destination: opisina kung saan dapat dalhin ang goods, kailangan buo at nasa tamang oras.
- Prescribed Itinerary/Period: inaprubahang ruta at oras ng biyahe; kung hindi sinunod, puwedeng ma-penalize.

💡 Simpleng Paliwanag
Parang check-in lang ang goods, hindi pa final stop — dumaan lang sila sa Pilipinas papunta sa ibang lugar. Basta may permit, hindi nasira ang seal, at dumating na buo at on-time, okay lang. Pero may nawala o nasira ang seal nang walang authorization, puwede nang singilin agad ng buong duties, taxes, at penalties.

📦 Halimbawa
May cargo na dumating sa Port of Manila pero ang aktwal na destinasyon ay isang inland Customs Bonded Warehouse sa Clark. Kukuha ang broker ng Transit Permit, isesealed ang truck, at bibiyahe papuntang Clark. Pagdating doon, titignan ng customs officer kung buo pa ang seal — kung okay, doon na tuloy ang assessment at duty computation.

⭐ Bakit Mahalaga Ito
Nagpapadali ito sa daloy ng kalakalan dahil hindi na kailangang bayaran agad ang duties sa unang daungan kung hindi naman doon talaga tutungo ang goods, habang pinoprotektahan pa rin ang revenue ng gobyerno sa pamamagitan ng mahigpit na kondisyon.

⚠️ Dapat Tandaan
- Hindi applicable sa goods na intended for consumption.
- Kailangan ng Transit Permit bago mag-move.
- Puwedeng lumipat ng means of transport basta hindi nasira ang seal.
- Responsibilidad ng carrier/broker/importer ang kumpleto at on-time na delivery.
- Failure to comply ay agad na masisingil ng duties, taxes, fines, at penalties.

🎯 Board Exam Tip
Madalas ipagkamali ang customs transit sa transhipment — ang transit ay galaw sa loob ng Pilipinas, habang transhipment ay kadalasang international-to-international. I-tie mo rin sa isip ang apat na klase ng ruta (a-d), dahil madalas itanong kung alin ang applicable sa isang given na scenario.

❓ Madalas Malito ang Students
Tanong: Bakit hindi covered ang consumption goods dito? Sagot: Dahil ang customs transit ay para lamang sa goods na dadaan pa lang papunta sa panghuling destinasyon, hindi pa tapos sa buong customs process. Ang consumption goods ay dapat dumaan muna sa buong regular na entry at duty payment.

🔗 Related Topics
Section 601, Section 602, CAO 12-2019 (Transhipment of Goods), CMO 27-2019, OCOM 35-2020, CMO 54-2010, paragraphs (a)-(d) ng Section 600.`,prompt:"Ipaliwanag mo sa akin nang simple ang Section 600 ng CMTA (Customs Transit sa Customs Territory), kasama ang praktikal na halimbawa sa Pilipinas tulad ng airport, seaport, warehouse, at Free Zones gaya ng Clark at Subic. Ipaliwanag din kung bakit umiiral ang batas na ito, ano ang related na Sections o CAO/CMO, karaniwang pagkakamali ng mga estudyante, at magbigay ng board exam tips."},572:{_label:"paragraph (a) — ",title:"Section 600(a) — Port of Entry papunta sa Ibang Port of Entry bilang Exit Point para sa Outright Exportation",content:`📖 Kahulugan
Unang klase ng ruta sa ilalim ng customs transit: mula sa isang port of entry papunta sa ibang port of entry, kung saan ang huling port ang gagamitin bilang exit point para sa outright exportation — hindi na para sa Pilipinas kundi ipapadala pa palabas ng bansa.

🔍 Breakdown
- Port of Entry: opisyal na daungan/paliparan kung saan pumapasok ang goods.
- Exit Point: huling daungan kung saan lalabas ang goods papuntang ibang bansa.
- Outright Exportation: direktang pag-export, walang karagdagang proseso habang nasa Pilipinas.

💡 Simpleng Paliwanag
Parang layover lang ang Pilipinas — pumasok ang goods sa isang daungan, dadaan lang papunta sa ibang daungan para doon ilabas patungo sa ibang bansa.

📦 Halimbawa
May cargo na dumaong sa Port of Manila mula Korea, pero ang plano ay ipasa ito papuntang Port of Cebu para doon ideklarang for export patungong Australia. Sa ilalim ng transit, puwede itong ilipat nang hindi muna binabayaran ang duties sa Manila.

⭐ Bakit Mahalaga Ito
Nagbibigay ito ng flexibility sa logistics operations — hindi kailangang i-unload at bayaran agad ang duties sa unang pasukan kung ang totoong plano ay i-export ito sa ibang daungan.

⚠️ Dapat Tandaan
Kailangan pa ring sumunod sa general requirements ng Section 600 — transit permit, hindi nasirang seal, at pagdating na buo at on-time bago ma-export.

🎯 Board Exam Tip
I-memorize ang pattern: (a) ay port-to-port papuntang export. Laging tanungin ang saan nagsimula at saan patungo.

❓ Madalas Malito ang Students
Tanong: Ano ang pagkakaiba ng (a) sa (b)? Sagot: Ang (a) ay dapat may layuning outright exportation sa huling port. Ang (b) ay hindi kinakailangang for export.

🔗 Related Topics
Section 600 (main provision), paragraph (b), (c), (d), CAO 12-2019.`,prompt:"Ipaliwanag mo ang Section 600(a) ng CMTA tungkol sa customs transit mula port of entry papunta sa ibang port of entry bilang exit point para sa outright exportation. Magbigay ng praktikal na Pilipinas-based na halimbawa at ipaliwanag kung paano ito naiiba sa paragraphs (b), (c), (d)."},573:{_label:"paragraph (b) — ",title:"Section 600(b) — Port of Entry papunta sa Ibang Port of Entry o Inland Customs Office",content:`📖 Kahulugan
Pangalawang klase ng ruta: mula sa isang port of entry papunta sa ibang port of entry, o kaya papunta sa isang inland customs office — walang requirement na dapat i-export ito.

🔍 Breakdown
- Port of Entry to Port of Entry: parehong daungan lang ang route.
- Port of Entry to Inland Customs Office: mula daungan papunta sa opisina ng customs na nasa loob ng bansa, gaya ng isang inland container depot o CFZ.

💡 Simpleng Paliwanag
Ito ang pinaka-general na klase ng transit — basta galing sa isang port of entry, puwede itong dalhin sa ibang port o sa isang inland office, kahit hindi para i-export pa.

📦 Halimbawa
Dumaong ang cargo sa Manila pero ang aktwal na assessment ay gagawin sa isang Inland Customs Office sa Laguna o Clark dahil doon naka-base ang importer. Sa ilalim ng transit, puwedeng ilipat ang goods doon nang hindi muna sinisingil sa Manila.

⭐ Bakit Mahalaga Ito
Malaking tulong ito sa mga negosyong may pasilidad na malayo sa seaport o airport — hindi na kailangang i-clear muna sa daungan.

⚠️ Dapat Tandaan
Kahit walang export requirement dito, dapat pa ring sundin ang general conditions ng Section 600.

🎯 Board Exam Tip
Ito ang pinaka-default na klase — kapag walang binanggit na export sa scenario, malamang ito ang applicable na paragraph.

❓ Madalas Malito ang Students
Tanong: Kailangan bang i-export ang goods sa ilalim ng paragraph (b)? Sagot: Hindi. Puwedeng manatili ang goods sa Pilipinas, doon lang mag-aassess sa destination.

🔗 Related Topics
Section 600, paragraph (a), (c), (d).`,prompt:"Ipaliwanag mo ang Section 600(b) ng CMTA tungkol sa customs transit mula port of entry papunta sa ibang port of entry o inland customs office, kasama ang halimbawa mula sa Pilipinas at pagkakaiba nito sa ibang paragraphs."},574:{_label:"paragraph (c) — ",title:"Section 600(c) — Inland Customs Office papunta sa Port of Entry bilang Exit Point para sa Outright Exportation",content:`📖 Kahulugan
Kabaligtaran ng (a) — nagsisimula ang biyahe sa isang inland customs office, at ang destinasyon ay isang port of entry na gagamitin bilang exit point para sa outright exportation.

🔍 Breakdown
- Inland Customs Office: pinagmulan ng biyahe, malapit sa pabrika, warehouse, o free zone.
- Port of Entry as Exit Point: daungan kung saan lalabas ang goods papuntang ibang bansa.

💡 Simpleng Paliwanag
Galing sa loob ng bansa ang goods, dadalhin lang sa daungan para doon i-export — parang papunta na sa labasan.

📦 Halimbawa
Isang factory sa loob ng isang Ecozone sa Cavite ang gumagawa ng produkto para sa exportation. Dadalhin ito papunta sa Port of Manila bilang exit point sa ilalim ng customs transit, bago ideklarang export.

⭐ Bakit Mahalaga Ito
Nakakatulong ito sa mga manufacturer o exporter na nasa loob ng bansa dahil direktang mai-move ang goods papunta sa exit port sa ilalim ng transit rules.

⚠️ Dapat Tandaan
Dapat talagang export ang destinasyon dito; kung para sa domestic consumption pala, hindi na ito babagay.

🎯 Board Exam Tip
Tandaan ang direksyon: (a) ay port-to-port export, (c) ay inland-to-port export. Parehong may export intent, magkaiba ang pinagmulan.

❓ Madalas Malito ang Students
Tanong: Ano ang pagkakaiba ng (a) at (c)? Sagot: Pareho silang may layuning i-export, pero (a) nagsisimula sa isang port, habang (c) nagsisimula sa isang inland office.

🔗 Related Topics
Section 600, paragraph (a), (b), (d).`,prompt:"Ipaliwanag mo ang Section 600(c) ng CMTA tungkol sa customs transit mula inland customs office papunta sa port of entry bilang exit point para sa outright exportation, kasama ang halimbawa mula sa isang Philippine Ecozone at pagkakaiba nito sa paragraph (a)."},575:{_label:"paragraph (d) — ",title:"Section 600(d) — Port of Entry o Inland Customs Office papunta sa Iba Pang Port of Entry o Inland Customs Office",content:`📖 Kahulugan
Pinaka-flexible o catch-all na klase ng ruta: mula sa alinman sa isang port of entry o inland customs office, papunta sa iba pang port of entry o inland customs office.

🔍 Breakdown
- Flexible na pinagmulan: puwedeng magsimula sa port o inland office.
- Flexible na destinasyon: puwede ring magtapos sa port o inland office.

💡 Simpleng Paliwanag
Any combination na klase — port-to-inland, inland-to-port, inland-to-inland, basta hindi na covered sa mas specific na (a), (b), o (c).

📦 Halimbawa
May goods sa isang Inland Customs Office sa Batangas na kailangang ilipat papunta sa ibang Inland Customs Office sa Cebu para sa karagdagang proseso — hindi ito para sa exportation, kaya dito na sa (d) covered.

⭐ Bakit Mahalaga Ito
Sinasakop nito ang lahat ng ibang posibleng ruta na hindi na covered sa mas specific na paragraphs, kaya kumpleto ang batas sa lahat ng posibleng senaryo.

⚠️ Dapat Tandaan
Kahit flexible ang ruta, dapat pa ring sundin ang general requirements ng Section 600.

🎯 Board Exam Tip
Kapag ang scenario ay hindi umaayon sa (a), (b), o (c), malamang na (d) na ang sagot dahil ito ang general o catch-all na paragraph.

❓ Madalas Malito ang Students
Tanong: Bakit kailangan pa ng (d) kung meron nang (a), (b), (c)? Sagot: Dahil sinasakop ng (d) ang mga kombinasyon na hindi pa covered sa unang tatlo, tulad ng inland-to-inland na walang export intent.

🔗 Related Topics
Section 600, paragraph (a), (b), (c).`,prompt:"Ipaliwanag mo ang Section 600(d) ng CMTA tungkol sa customs transit mula sa isang port of entry o inland customs office papunta sa iba pang port of entry o inland customs office, kasama ang halimbawa at kung paano ito naiiba sa mas specific na paragraphs (a), (b), (c)."},576:{_label:"section 601 — Duty and Tax on Goods Intended for Transit",title:"Section 601 — Duty and Tax on Goods Intended for Transit",content:`📖 Kahulugan
Sinasabi dito ng batas kung kailan hindi muna babayaran ang duties at taxes sa unang daungan, at kailan naman dapat na agad bayaran ito.

🔍 Breakdown
- Customs Bonded Warehouse: pasilidad na pinapayagang mag-imbak ng goods nang walang bayad na duties/taxes muna.
- Outright Exportation: direktang pag-export sa destination.
- RA 10668: batas na nagpapahintulot sa foreign vessels na mag-transport/co-load ng foreign cargo para sa domestic transshipment.
- Goods for Consumption: hindi covered sa exemption; dapat magbayad agad sa port of discharge.

💡 Simpleng Paliwanag
Kung ang goods ay para lang i-store sa bonded warehouse, i-export pa sa destination, o covered sa RA 10668, hindi muna sila babayaran ng duties/taxes sa unang pasukan, basta may security na sinunod. Pero kung consumption goods na hindi covered dito, dapat agad bayaran sa unang daungan.

📦 Halimbawa
May goods na dadalhin papunta sa isang Customs Bonded Warehouse sa Cavite mula Port of Manila — hindi muna ito babayaran ng duties sa Manila, basta may security na nai-post. Pero kung ibang goods naman na diretsong ibebenta sa Metro Manila, dapat bayaran na agad ang duties sa Manila mismo.

⭐ Bakit Mahalaga Ito
Nililinaw nito kung sino ang dapat magbayad kailan, para maiwasan ang double taxation sa legitimate transit goods, habang tinitiyak na hindi ito magiging paraan para makaiwas sa buwis ang goods na talagang para sa domestic consumption.

⚠️ Dapat Tandaan
Ang exemption sa unang paragraph ay may kondisyon — kailangan may security at nasunod ang requirements ng Bureau. Ang goods for consumption at hindi covered sa unang paragraph ay dapat magbayad sa port of discharge, walang exemption.

🎯 Board Exam Tip
I-tandaan ang tatlong exempted na sitwasyon: papunta sa customs bonded warehouse, para sa outright exportation, o covered sa RA 10668. Lahat ng iba pa, lalo na consumption goods, ay dapat magbayad agad.

❓ Madalas Malito ang Students
Tanong: Ibig sabihin ba nito, walang babayarang duties/taxes ang transit goods? Sagot: Hindi. Hindi lang muna babayaran sa unang pasukan — babayaran pa rin ito sa tamang panahon o lugar, maliban kung talagang exempted sa ibang batas.

🔗 Related Topics
Section 600, Section 602, RA 10668, AOCG Memo 168-2020.`,prompt:"Ipaliwanag mo ang Section 601 ng CMTA tungkol sa duty and tax treatment ng goods na intended for customs transit, kasama ang exemptions tulad ng customs bonded warehouse, outright exportation, at RA 10668, gamit ang praktikal na halimbawa mula sa Pilipinas."},577:{_label:"section 602 — Carrier's Security",title:"Section 602 — Carrier's Security",content:`📖 Kahulugan
Ang Section 602 ay tungkol sa requirement na dapat mag-post ng security bond ang mga carrier bago sila payagang mag-transport ng imported goods sa ilalim ng customs transit mula sa isang port of entry papunta sa ibang daungan.

🔍 Breakdown
- Carrier: ang kumpanya o taong nagdadala ng goods.
- General Transportation Security: security bond na dapat i-post, minimum na Fifty Thousand Pesos (P50,000.00).
- Purpose of Security: sigurado ang kumpletong at agarang delivery ng goods sa customs officer sa destination, pati ang pagbayad ng customs charges at transfer costs.
- Adjustment by Commissioner: ang halaga ay puwedeng baguhin ng Commissioner, kailangan may approval ng Secretary of Finance.

💡 Simpleng Paliwanag
Bago pahintulutan ang isang carrier na magdala ng goods sa ilalim ng customs transit, kailangan muna silang mag-post ng security bond na hindi bababa sa P50,000, para sigurado na may pondong masisingil kung may mangyaring problema sa delivery.

📦 Halimbawa
Isang trucking company na nagdadala ng imported cargo mula Port of Manila papunta sa isang inland customs office ay dapat munang mag-post ng general transportation security na hindi bababa sa P50,000 bago sila payagang gumawa ng ganitong delivery.

⭐ Bakit Mahalaga Ito
Ito ang proteksyon ng gobyerno kung sakaling magkaproblema sa delivery ng goods habang nasa transit, na sigurado na may pananagutan ang carrier at may pondong pwedeng magamit para sa pagbayad ng kaukulang bayarin.

⚠️ Dapat Tandaan
Ang P50,000 ay minimum lang — puwede itong i-adjust ng Commissioner of Customs, pero kailangan may approval ng Secretary of Finance bago ito magbago.

🎯 Board Exam Tip
Tandaan ang eksaktong halaga, Fifty Thousand Pesos (P50,000.00) bilang minimum, at kung sino ang may kapangyarihang mag-adjust nito — madalas itanong ito nang direkta sa exams.

❓ Madalas Malito ang Students
Tanong: Bakit kailangan pang mag-post ng security ang carrier, hindi ba ang importer o broker ang responsable? Sagot: Dahil ang carrier mismo ang direktang responsable sa fisikal na paghahatid ng goods habang nasa transit.

🔗 Related Topics
Section 600, Section 601.`,prompt:"Ipaliwanag mo ang Section 602 ng CMTA tungkol sa Carrier's Security requirement para sa customs transit, kasama ang halaga ng security, layunin nito, at kung sino ang may kapangyarihang mag-adjust ng halagang ito."}},Uy="customsLaw_aiContextImports";function Ap(){return{batches:{},entries:{}}}function Vy(){try{const a=localStorage.getItem(Uy);if(!a)return Ap();const n=JSON.parse(a);return{batches:n.batches||{},entries:n.entries||{}}}catch{return Ap()}}function $y(a){return Vy().entries[String(a)]||null}const Nr=!1;function Pg(a){const n=String(a),i=$y(n);return i||Wy[n]||null}const Tp=[{id:"meta",label:"Meta AI",icon:"💬",url:"https://m.me/MetaAI"},{id:"chatgpt",label:"ChatGPT",icon:"🟢",url:"https://chatgpt.com/"},{id:"gemini",label:"Gemini",icon:"✨",url:"https://gemini.google.com/app"}];async function Qy(a,n){try{await navigator.clipboard.writeText(a)}catch{}window.open(n,"_blank","noopener,noreferrer")}const Mp="customsLaw_mode",Pp="customsLaw_fontScale",Bp="customsLaw_darkMode",Qu=D.createContext(null);function Zy(){return D.useContext(Qu)}function Zu(a,n){const[i,e]=D.useState([]),[t,s]=D.useState(!1);D.useEffect(()=>{if(!n||!a||t)return;const d=Ry(a);e(d),s(!0)},[n,a,t]);const g=D.useCallback(async(d,m)=>{const C=Oy(a,d,m);e(f=>[...f,C])},[a]),u=D.useCallback(async d=>{_y(d),e(m=>m.filter(C=>C.id!==d))},[]);return{highlights:i,addHighlight:g,removeHighlight:u}}function Yu(a,n){const[i,e]=D.useState([]),[t,s]=D.useState(!1);D.useEffect(()=>{!a||t||(e(jy(a)),s(!0))},[n,a,t]);const g=D.useCallback(m=>{const C=Hy(a,m);return e(f=>[...f,C]),C},[a]),u=D.useCallback((m,C)=>{const f=Ky(a,m,C);e(S=>S.map(P=>P.id===m?f:P))},[a]),d=D.useCallback(m=>{Fy(a,m),e(C=>C.filter(f=>f.id!==m))},[a]);return{notes:i,createNote:g,editNote:u,removeNote:d}}function Ip(a){try{const n=new Date(a);return n.toLocaleDateString(void 0,{month:"short",day:"numeric"})+" · "+n.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}catch{return""}}function Yy(a,n){if(!n||n.length===0)return[{text:a,highlightId:null}];const i=[...n].sort((s,g)=>s.start_offset-g.start_offset),e=[];let t=0;for(const s of i)s.start_offset>t&&e.push({text:a.slice(t,s.start_offset),highlightId:null}),e.push({text:a.slice(s.start_offset,s.end_offset),highlightId:s.id,color:s.color}),t=s.end_offset;return t<a.length&&e.push({text:a.slice(t),highlightId:null}),e}function Jy({x:a,y:n,kind:i,onSave:e,onCancel:t,onDelete:s}){return c.jsx("div",{style:{position:"fixed",left:a,top:n,zIndex:100},className:"flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/40",children:i==="existing"?c.jsxs(c.Fragment,{children:[c.jsx("button",{onClick:s,className:"flex items-center gap-1 rounded-lg px-3 py-2 min-h-[40px] text-sm font-medium text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/40",children:"🗑 Remove highlight"}),c.jsx("button",{onClick:t,className:"rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700",children:"Close"})]}):c.jsxs(c.Fragment,{children:[c.jsx("button",{onClick:e,className:"flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 min-h-[40px] text-sm font-semibold text-amber-800 active:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:active:bg-amber-900/70",children:"🖍 Highlight"}),c.jsx("button",{onClick:t,className:"rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700",children:"Cancel"})]})})}function Ju({nodeId:a,content:n,highlights:i,addHighlight:e,removeHighlight:t,className:s,armed:g}){const u=D.useRef(null),[d,m]=D.useState(null),[C,f]=D.useState(null);D.useEffect(()=>{if(!g){m(null),f(h=>h&&h.kind==="existing"?h:null);return}const k=()=>{const h=window.getSelection();if(!h||h.isCollapsed||!u.current||!u.current.contains(h.anchorNode)){m(null),f(j=>j&&j.kind==="existing"?j:null);return}const b=h.getRangeAt(0),v=document.createRange();v.selectNodeContents(u.current),v.setEnd(b.startContainer,b.startOffset);const E=v.toString().length,O=E+b.toString().length;if(E>=O)return;m({start:E,end:O});const _=b.getBoundingClientRect();f({x:Math.max(8,Math.min(_.left,window.innerWidth-200)),y:_.bottom+8,kind:"selection"})};return document.addEventListener("selectionchange",k),()=>document.removeEventListener("selectionchange",k)},[g]);const S=(k,h)=>{k.stopPropagation();const b=k.target.getBoundingClientRect();f({x:Math.max(8,Math.min(b.left,window.innerWidth-200)),y:b.bottom+8,kind:"existing",hlId:h}),m(null)},P=()=>{var k;f(null),m(null),(k=window.getSelection())==null||k.removeAllRanges()},T=async()=>{d&&(await e(d.start,d.end),P())},A=async()=>{C!=null&&C.hlId&&(await t(C.hlId),P())},L=Yy(n,i);return c.jsxs("div",{className:"relative",children:[c.jsx("div",{ref:u,className:`${s} ${g?"rounded-lg bg-amber-50/70 ring-1 ring-amber-300 dark:bg-amber-950/30 dark:ring-amber-700":""}`,children:L.map((k,h)=>k.highlightId?c.jsx("mark",{style:{backgroundColor:k.color},className:"cursor-pointer rounded-sm px-0.5",onClick:b=>S(b,k.highlightId),children:k.text},h):c.jsx("span",{children:k.text},h))}),C&&c.jsx(Jy,{x:C.x,y:C.y,kind:C.kind,onSave:T,onDelete:A,onCancel:P})]})}function Xu({notes:a,onCreate:n,onEdit:i,onDelete:e,onClose:t}){const[s,g]=D.useState(null),[u,d]=D.useState(""),[m,C]=D.useState(a.length===0),f=A=>{g(A.id),d(A.content),C(!1)},S=()=>{C(!0),g(null),d("")},P=()=>{g(null),C(a.length===0),d("")},T=()=>{const A=u.trim();A&&(s?(i(s,A),g(null)):(n(A),C(!1)),d(""))};return c.jsxs("div",{onClick:A=>A.stopPropagation(),className:"mt-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3 dark:border-sky-800 dark:bg-sky-950/30",children:[c.jsxs("div",{className:"mb-2 flex items-center justify-between",children:[c.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400",children:"📝 My Notes"}),c.jsx("button",{onClick:t,className:"rounded-lg px-2 py-1 text-xs font-medium text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700",children:"Close"})]}),a.length>0&&!m&&!s&&c.jsx("div",{className:"mb-2 space-y-2",children:a.map(A=>c.jsxs("div",{className:"rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800",children:[c.jsx("p",{className:"whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200",children:A.content}),c.jsxs("div",{className:"mt-1.5 flex items-center justify-between",children:[c.jsx("span",{className:"text-[11px] text-slate-400 dark:text-slate-500",children:A.updated_at!==A.created_at?`Edited ${Ip(A.updated_at)}`:`Added ${Ip(A.created_at)}`}),c.jsxs("div",{className:"flex gap-3",children:[c.jsx("button",{onClick:()=>f(A),className:"text-xs font-semibold text-sky-700 dark:text-sky-400",children:"Edit"}),c.jsx("button",{onClick:()=>e(A.id),className:"text-xs font-semibold text-red-600 dark:text-red-400",children:"Delete"})]})]})]},A.id))}),m||s?c.jsxs("div",{children:[c.jsx("textarea",{autoFocus:!0,value:u,onChange:A=>d(A.target.value),placeholder:"Write your own explanation or reminder…",rows:3,style:{fontSize:"16px"},className:"w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"}),c.jsxs("div",{className:"mt-2 flex justify-end gap-2",children:[c.jsx("button",{onClick:P,className:"rounded-lg px-3 py-1.5 text-sm text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700",children:"Cancel"}),c.jsx("button",{onClick:T,disabled:!u.trim(),className:"rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-40 dark:bg-sky-600",children:s?"Save":"Add Note"})]})]}):c.jsx("button",{onClick:S,className:"w-full rounded-lg border border-dashed border-sky-300 py-2 text-sm font-medium text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:text-sky-400 dark:active:bg-sky-900/40",children:"+ Add Note"})]})}function ad({node:a,onClose:n}){var P;const[i,e]=D.useState(()=>Pg(a.id)),[t,s]=D.useState(null),[g,u]=D.useState(!1),[d,m]=D.useState(()=>"{}"),[C,f]=D.useState(null),S=async T=>{var L;const A=((L=i==null?void 0:i.prompt)==null?void 0:L.trim())||`Explain "${a.title||a.node_number}" (${a.node_type} ${a.node_number||""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms with an example.`;await Qy(A,T.url),s(T.id),setTimeout(()=>s(null),2500)};return c.jsx("div",{className:"fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center",onClick:n,children:c.jsxs("div",{onClick:T=>T.stopPropagation(),className:"max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl",children:[c.jsxs("div",{className:"mb-3 flex items-start justify-between gap-2",children:[c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("span",{className:"flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-navy-700 text-lg",children:"🤖"}),c.jsxs("div",{children:[c.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"Osias 6.7"}),c.jsx("p",{className:"text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-50",children:(i==null?void 0:i.title)||`About ${a.node_type} ${a.node_number||""}`})]})]}),c.jsx("button",{onClick:n,className:"flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-800",children:"✕"})]}),i!=null&&i.content?c.jsx("p",{className:"whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-base leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200",children:i.content}):c.jsx("p",{className:"rounded-2xl bg-slate-50 p-3 text-sm italic text-slate-400 dark:bg-slate-800/60 dark:text-slate-500",children:"Osias 6.7 hasn't explained this part yet."}),c.jsxs("div",{className:"mt-4 border-t border-slate-100 pt-3 dark:border-slate-800",children:[c.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"Still confused? Ask another AI"}),c.jsx("div",{className:"flex flex-wrap gap-2",children:Tp.map(T=>c.jsxs("button",{onClick:()=>S(T),className:"flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:active:bg-slate-700",children:[c.jsx("span",{"aria-hidden":!0,children:T.icon})," ",T.label]},T.id))}),t&&c.jsxs("p",{className:"mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400",children:["✓ Prompt copied — paste it in ",(P=Tp.find(T=>T.id===t))==null?void 0:P.label," and send."]})]}),Nr]})})}const Xy={chapter:"text-xl sm:text-2xl font-bold text-navy-900 dark:text-slate-50",section:"text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200",paragraph:"text-base sm:text-lg text-slate-700 dark:text-slate-300",subparagraph:"text-base text-slate-600 dark:text-slate-400",item:"text-sm text-slate-500 dark:text-slate-500"},Ep=["border-slate-200 dark:border-slate-700","border-amber-200 dark:border-amber-800","border-emerald-200 dark:border-emerald-800","border-purple-200 dark:border-purple-800","border-sky-200 dark:border-sky-800"];function nd({node:a,level:n=0,expandedSet:i=new Set,scrollToId:e=null,collapseSignal:t=0}){var na;const s=D.useRef(null),[g,u]=D.useState(!1),[d,m]=D.useState(!1),[C,f]=D.useState(!1),S=D.useMemo(()=>Pg(a.id),[a.id]),{activeHighlightNodeId:P,setActiveHighlightNodeId:T}=Zy(),A=P===a.id,L=a.children&&a.children.length>0,k=L||!!a.content,{highlights:h,addHighlight:b,removeHighlight:v}=Zu(a.id,g),{notes:E,createNote:O,editNote:_,removeNote:j}=Yu(a.id,!0),X=D.useRef(t);D.useEffect(()=>{i.has(a.id)&&u(!0)},[i,a.id]),D.useEffect(()=>{t!==X.current&&(X.current=t,u(!1))},[t]),D.useEffect(()=>{e===a.id&&s.current&&setTimeout(()=>{s.current.scrollIntoView({behavior:"smooth",block:"center"}),s.current.classList.add("ring-2","ring-amber-400","bg-amber-50","dark:bg-amber-900/40"),setTimeout(()=>{var Q;return(Q=s.current)==null?void 0:Q.classList.remove("ring-2","ring-amber-400","bg-amber-50","dark:bg-amber-900/40")},2200)},120)},[e,a.id]);const K=Q=>{Q.stopPropagation(),k&&u(aa=>!aa)};return c.jsxs("div",{ref:s,style:{marginLeft:`${Math.min(n,6)*.9}rem`},className:"my-1 rounded-xl transition-colors",children:[c.jsxs("div",{onClick:K,role:"button",tabIndex:0,"aria-expanded":k?g:void 0,className:"flex items-start gap-2 rounded-xl px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer touch-manipulation dark:hover:bg-slate-800/60 dark:active:bg-slate-800",children:[c.jsx("span",{className:`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center select-none text-slate-400 transition-transform duration-200 dark:text-slate-600 ${g?"rotate-90":""}`,children:k?"▸":""}),c.jsxs("div",{className:"min-w-0 flex-1",children:[c.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[a.node_type==="chapter"&&c.jsxs("span",{className:"inline-block rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-navy-700",children:["Chapter ",a.node_number]}),a.node_type==="section"&&c.jsxs("span",{className:"inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",children:["Sec. ",a.node_number]}),c.jsx("span",{className:Xy[a.node_type]||"text-sm text-slate-700 dark:text-slate-300",children:a.title||a.node_number}),!g&&E.length>0&&c.jsx("span",{className:"text-xs",title:"Has notes",children:"📝"}),!g&&S&&c.jsx("span",{className:"text-xs",title:"AI explanation available",children:"🤖"})]}),g&&a.content&&c.jsxs("div",{onClick:Q=>Q.stopPropagation(),className:"mt-2",children:[c.jsx(Ju,{nodeId:a.id,content:a.content,highlights:h,addHighlight:b,removeHighlight:v,armed:A,className:"select-text rounded-lg p-2 text-base leading-relaxed text-slate-700 dark:text-slate-300"}),c.jsxs("div",{className:"mt-1 flex flex-wrap items-center gap-2",children:[c.jsx("button",{onClick:()=>T(A?null:a.id),className:`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${A?"border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-300":"border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:active:bg-emerald-950/50"}`,children:A?"Select text to highlight…":"🖍 Highlight"}),c.jsxs("button",{onClick:()=>m(Q=>!Q),className:`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${d?"border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300":"border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"}`,children:["📝 ",E.length>0?`Notes (${E.length})`:"Add Note"]}),c.jsx("button",{onClick:()=>f(!0),className:"min-h-[38px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50",children:"🤖 Ask AI"})]}),d&&c.jsx(Xu,{notes:E,onCreate:O,onEdit:_,onDelete:j,onClose:()=>m(!1)}),C&&c.jsx(ad,{node:a,onClose:()=>f(!1)}),a.cross_references&&a.cross_references.length>0&&c.jsxs("div",{className:"mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60",onClick:Q=>Q.stopPropagation(),children:[c.jsx("span",{className:"font-medium text-slate-700 dark:text-slate-300",children:"See Also"}),c.jsx("ul",{className:"mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400",children:a.cross_references.map((Q,aa)=>c.jsx("li",{children:Q.url?c.jsx("a",{href:Q.url,target:"_blank",rel:"noopener noreferrer",className:"text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700",children:Q.text}):c.jsx("span",{children:Q.text})},aa))})]})]}),g&&((na=a.keywords)==null?void 0:na.length)>0&&c.jsx("div",{className:"mt-2 flex flex-wrap gap-1",onClick:Q=>Q.stopPropagation(),children:a.keywords.map(Q=>c.jsx("span",{className:"rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400",children:Q},Q))})]})]}),g&&L&&c.jsx("div",{className:`ml-4 border-l-2 ${Ep[(n+1)%Ep.length]}`,children:a.children.map(Q=>c.jsx(nd,{node:Q,level:n+1,expandedSet:i,scrollToId:e,collapseSignal:t},Q.id))})]})}const ak={chapter:"font-bold text-navy-900 dark:text-slate-50 mb-2",section:"font-semibold text-slate-900 dark:text-slate-100 mb-1",paragraph:"text-slate-800 dark:text-slate-300",subparagraph:"text-slate-800 dark:text-slate-300",item:"text-slate-700 dark:text-slate-400"};function id({node:a,level:n=0,fontScale:i,expandedSet:e=new Set,scrollToId:t=null}){const s=D.useRef(null),[g,u]=D.useState(!1),[d,m]=D.useState(!1),C=D.useMemo(()=>Pg(a.id),[a.id]),f=a.children&&a.children.length>0,{highlights:S,addHighlight:P,removeHighlight:T}=Zu(a.id,!!a.content),{notes:A,createNote:L,editNote:k,removeNote:h}=Yu(a.id,!0);D.useEffect(()=>{t===a.id&&s.current&&setTimeout(()=>{s.current.scrollIntoView({behavior:"smooth",block:"center"}),s.current.classList.add("bg-amber-50","dark:bg-amber-900/40"),setTimeout(()=>{var v;return(v=s.current)==null?void 0:v.classList.remove("bg-amber-50","dark:bg-amber-900/40")},2200)},120)},[t,a.id]);const b=a.node_type==="chapter"?1.6:a.node_type==="section"?1.3:1;return c.jsxs("div",{ref:s,style:{marginLeft:`${Math.min(n,4)*.6}rem`},className:"my-5 rounded-lg transition-colors",children:[c.jsxs("div",{className:`font-serif ${ak[a.node_type]||"text-slate-800 dark:text-slate-200"}`,style:{fontSize:`${b*i}rem`},children:[a.node_type==="section"&&`Section ${a.node_number}. `,a.node_type==="chapter"&&`Chapter ${a.node_number}. `,a.title||a.node_number,A.length>0&&c.jsx("span",{className:"ml-1 align-middle text-sm",title:"Has notes",children:"📝"}),C&&c.jsx("span",{className:"ml-1 align-middle text-sm",title:"AI explanation available",children:"🤖"})]}),a.content&&c.jsx(Ju,{nodeId:a.id,content:a.content,highlights:S,addHighlight:P,removeHighlight:T,armed:!0,className:"select-text font-serif leading-loose text-slate-800 dark:text-slate-300"}),a.content&&c.jsxs("div",{className:"mt-2 flex flex-wrap items-center gap-2 font-sans",children:[c.jsxs("button",{onClick:()=>u(v=>!v),className:`min-h-[36px] rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${g?"border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300":"border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"}`,children:["📝 ",A.length>0?`Notes (${A.length})`:"Add Note"]}),c.jsx("button",{onClick:()=>m(!0),className:"min-h-[36px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50",children:"🤖 Ask AI"})]}),g&&c.jsx("div",{className:"font-sans",children:c.jsx(Xu,{notes:A,onCreate:L,onEdit:k,onDelete:h,onClose:()=>u(!1)})}),d&&c.jsx(ad,{node:a,onClose:()=>m(!1)}),a.cross_references&&a.cross_references.length>0&&c.jsxs("div",{className:"mt-2 rounded-lg bg-slate-50 p-3 font-sans text-sm dark:bg-slate-800/60",children:[c.jsx("span",{className:"font-medium text-slate-700 dark:text-slate-300",children:"See Also"}),c.jsx("ul",{className:"mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400",children:a.cross_references.map((v,E)=>c.jsx("li",{children:v.url?c.jsx("a",{href:v.url,target:"_blank",rel:"noopener noreferrer",className:"text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700",children:v.text}):c.jsx("span",{children:v.text})},E))})]}),f&&c.jsx("div",{children:a.children.map(v=>c.jsx(id,{node:v,level:n+1,fontScale:i,expandedSet:e,scrollToId:t},v.id))})]})}function nk({mode:a,setMode:n}){return c.jsxs("div",{className:"inline-flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800",role:"tablist","aria-label":"View mode",children:[c.jsxs("button",{role:"tab","aria-selected":a==="study",onClick:()=>n("study"),className:`min-h-[34px] rounded-full px-2.5 py-1 transition-colors ${a==="study"?"bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700":"text-slate-500 dark:text-slate-400"}`,children:[c.jsx("span",{"aria-hidden":!0,children:"📘"}),c.jsx("span",{className:"hidden sm:inline ml-1",children:"Study"})]}),c.jsxs("button",{role:"tab","aria-selected":a==="reading",onClick:()=>n("reading"),className:`min-h-[34px] rounded-full px-2.5 py-1 transition-colors ${a==="reading"?"bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700":"text-slate-500 dark:text-slate-400"}`,children:[c.jsx("span",{"aria-hidden":!0,children:"📖"}),c.jsx("span",{className:"hidden sm:inline ml-1",children:"Reading"})]})]})}function ik({fontScale:a,setFontScale:n}){const i=e=>Math.min(1.6,Math.max(.85,e));return c.jsxs("div",{className:"flex items-center gap-1.5 text-sm",children:[c.jsx("button",{onClick:()=>n(e=>i(e-.1)),className:"flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700","aria-label":"Decrease font size",children:"A-"}),c.jsxs("span",{className:"w-10 text-center text-xs text-slate-400 dark:text-slate-500",children:[Math.round(a*100),"%"]}),c.jsx("button",{onClick:()=>n(e=>i(e+.1)),className:"flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700","aria-label":"Increase font size",children:"A+"})]})}function ek({containerRef:a}){const[n,i]=D.useState(0);return D.useEffect(()=>{const e=a.current;if(!e)return;const t=()=>{const s=e.scrollHeight-e.clientHeight;i(s>0?Math.min(100,e.scrollTop/s*100):0)};return e.addEventListener("scroll",t,{passive:!0}),t(),()=>e.removeEventListener("scroll",t)},[a]),c.jsx("div",{className:"h-1 w-full bg-slate-100 dark:bg-slate-800",children:c.jsx("div",{className:"h-1 bg-gradient-to-r from-amber-400 to-navy-700 transition-all dark:from-amber-500 dark:to-navy-400",style:{width:`${n}%`}})})}function $t({label:a,value:n,active:i,onClick:e}){return c.jsx("button",{onClick:()=>e(n),className:`min-h-[38px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${i?"border-navy-900 bg-navy-900 text-white dark:border-navy-600 dark:bg-navy-700":"border-slate-200 bg-white text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"}`,children:a})}function Dp({item:a,onClick:n}){const i=()=>{const t=[];return a.title_number&&t.push(`TITLE ${a.title_number}`),a.chapter_number&&t.push(`Ch. ${a.chapter_number}`),a.node_type==="section"&&t.push(`Sec. ${a.node_number}`),t.join(" · ")||a.node_type.toUpperCase()},e={title:"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",chapter:"bg-navy-900 text-white dark:bg-navy-700",section:"bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",paragraph:"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",subparagraph:"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",item:"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"};return c.jsxs("button",{onClick:n,className:`block w-full rounded-2xl border bg-white p-4 text-left shadow-card transition active:scale-[0.99] active:bg-slate-50 dark:bg-slate-800 dark:active:bg-slate-700/70 ${a.exact_match?"border-amber-400 ring-1 ring-amber-300 dark:border-amber-600 dark:ring-amber-700":"border-slate-200 dark:border-slate-700"}`,children:[c.jsxs("div",{className:"flex items-center justify-between gap-2",children:[c.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 text-xs",children:[c.jsx("span",{className:`rounded-md px-1.5 py-0.5 font-semibold uppercase tracking-wide ${e[a.node_type]||"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`,children:a.node_type}),c.jsx("span",{className:"text-slate-400 dark:text-slate-500",children:i()})]}),a.exact_match&&c.jsx("span",{className:"flex-shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950 dark:bg-amber-500 dark:text-amber-950",children:"✓ Exact match"})]}),c.jsx("div",{className:"mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100",children:a.title||a.node_number}),a.excerpt&&c.jsx("div",{className:"mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400",dangerouslySetInnerHTML:{__html:a.excerpt.replace(/\[/g,"<mark>").replace(/\]/g,"</mark>")}}),c.jsxs("div",{className:"mt-2 flex items-center gap-1 text-xs font-medium text-navy-700 dark:text-amber-400",children:["Open ",c.jsx("span",{"aria-hidden":!0,children:"→"})]})]})}function tk({onNavigateChapter:a}){const[n,i]=D.useState(""),[e,t]=D.useState("all"),[s,g]=D.useState([]),[u,d]=D.useState(!1),[m,C]=D.useState(null),[f,S]=D.useState(!1),P=D.useRef(null),T=D.useCallback(async()=>{if(n.trim()){d(!0),C(null),S(!0);try{const v=await Ny(n.trim(),e);g(v)}catch(v){C(v.message),g([])}finally{d(!1)}}},[n,e]),A=v=>{v.key==="Enter"&&T()},L=()=>{var v;i(""),g([]),S(!1),(v=P.current)==null||v.focus()},k=v=>{a(v.chapter_number,v.title_number,v.node_number)},h=s.filter(v=>v.exact_match),b=s.filter(v=>!v.exact_match);return c.jsxs("div",{className:"mx-auto max-w-3xl p-4",children:[c.jsxs("div",{className:"rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800",children:[c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("span",{className:"pl-1 text-lg text-slate-400 dark:text-slate-500","aria-hidden":!0,children:"🔍"}),c.jsx("input",{ref:P,type:"text",value:n,onChange:v=>i(v.target.value),onKeyDown:A,placeholder:'Search e.g. "Section 102" or "smuggling"',className:"min-w-0 flex-1 border-none bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500",style:{fontSize:"16px"}}),n&&c.jsx("button",{onClick:L,className:"flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-700","aria-label":"Clear search",children:"✕"})]}),c.jsxs("div",{className:"mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-700",children:[c.jsxs("div",{className:"flex flex-wrap gap-1.5",children:[c.jsx($t,{label:"All",value:"all",active:e==="all",onClick:t}),c.jsx($t,{label:"Title",value:"title",active:e==="title",onClick:t}),c.jsx($t,{label:"Chapter",value:"chapter",active:e==="chapter",onClick:t}),c.jsx($t,{label:"Section",value:"section",active:e==="section",onClick:t})]}),c.jsx("button",{onClick:T,disabled:u||!n.trim(),className:"min-h-[38px] flex-shrink-0 rounded-full bg-navy-900 px-5 py-1.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 disabled:opacity-40 dark:bg-navy-700 dark:active:bg-navy-600",children:u?"Searching…":"Search"})]})]}),m&&c.jsx("p",{className:"mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400",children:m}),u&&c.jsx("div",{className:"mt-4 space-y-3",children:[0,1,2].map(v=>c.jsxs("div",{className:"animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800",children:[c.jsx("div",{className:"h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700"}),c.jsx("div",{className:"mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"}),c.jsx("div",{className:"mt-2 h-3 w-full rounded bg-slate-100 dark:bg-slate-700/60"})]},v))}),!u&&h.length>0&&c.jsx("div",{className:"mt-5 space-y-2",children:h.map((v,E)=>c.jsx(Dp,{item:v,onClick:()=>k(v)},`exact-${E}`))}),!u&&b.length>0&&c.jsxs("div",{className:"mt-5",children:[h.length>0&&c.jsx("p",{className:"mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"Related mentions"}),c.jsx("div",{className:"space-y-2",children:b.map((v,E)=>c.jsx(Dp,{item:v,onClick:()=>k(v)},`other-${E}`))})]}),!u&&f&&s.length===0&&!m&&c.jsxs("div",{className:"mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600",children:[c.jsx("span",{className:"text-3xl",children:"🔎"}),c.jsxs("p",{className:"text-base font-medium text-slate-500 dark:text-slate-400",children:['No results for "',n,'"']}),c.jsx("p",{className:"text-sm",children:"Try a section number (e.g. 102), a keyword, or a shorter phrase."})]}),!f&&!u&&c.jsxs("div",{className:"mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600",children:[c.jsx("span",{className:"text-3xl",children:"📚"}),c.jsx("p",{className:"text-sm",children:"Search the full text of RA 10863 — titles, chapters, sections, and definitions."})]})]})}function ok({enabled:a,onChange:n}){return c.jsx("button",{type:"button",role:"switch","aria-checked":a,onClick:()=>n(!a),className:`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${a?"bg-navy-700":"bg-slate-300"}`,children:c.jsx("span",{className:`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${a?"translate-x-7":"translate-x-1"}`})})}const Hs=[{icon:"⚖️",title:"Welcome to RA 10863",body:"Your complete offline companion for the Customs Modernization and Tariff Act. Let's take a 60-second tour of what you can do."},{icon:"📚",title:"Browse the Law",body:"Tap the menu button (☰) to open the sidebar. Every Title, Chapter, and Section is organized in the correct legal order."},{icon:"📘",title:"Study Mode",body:"Expand one section at a time to focus on details. Use Expand All or Collapse All at the top to move through a whole chapter faster."},{icon:"📖",title:"Reading Mode",body:"A clean, book-style view for long reading sessions. Tap 🎯 Focus to hide the toolbar and read distraction-free."},{icon:"🖍️",title:"Highlights",body:"Select any text to highlight it. Works in both Study and Reading mode, and is saved automatically — even offline."},{icon:"📝",title:"Notes",body:'Tap "Add Note" under any section to write your own explanation. Edit or delete your notes anytime.'},{icon:"🤖",title:"Ask AI",body:"Tap Ask AI under any section for an instant offline explanation from Osias 6.7 — or hand off to Meta AI, ChatGPT, or Gemini with one tap."},{icon:"🔍",title:"Search",body:'Find anything instantly. Try a section number like "102", or a keyword like "smuggling".'},{icon:"⏱️",title:"Resume Reading",body:'Close the app anytime — a "Continue where you left off" card will bring you right back to your spot.'},{icon:"⚙️",title:"Settings",body:"Switch Dark Mode on or off, and replay this tour anytime from the Settings screen."}];function sk({onFinish:a}){const[n,i]=D.useState(0),e=Hs.length,t=n===e-1,s=Hs[n],g=()=>{t?a():i(d=>d+1)},u=()=>i(d=>Math.max(0,d-1));return c.jsx("div",{className:"fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm sm:items-center sm:justify-center",children:c.jsxs("div",{className:"w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-3xl",children:[c.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[c.jsx("div",{className:"flex gap-1.5",children:Hs.map((d,m)=>c.jsx("span",{className:`h-1.5 rounded-full transition-all duration-300 ${m===n?"w-6 bg-navy-900 dark:bg-slate-100":"w-1.5 bg-slate-200 dark:bg-slate-700"}`},m))}),c.jsx("button",{onClick:a,className:"text-sm font-medium text-slate-400 active:text-slate-600 dark:text-slate-500 dark:active:text-slate-300",children:"Skip"})]}),c.jsxs("div",{className:"mb-6 flex flex-col items-center text-center",children:[c.jsx("span",{className:"mb-3 text-5xl","aria-hidden":!0,children:s.icon}),c.jsx("h2",{className:"mb-2 text-xl font-bold text-slate-900 dark:text-slate-50",children:s.title}),c.jsx("p",{className:"text-sm leading-relaxed text-slate-600 dark:text-slate-300",children:s.body})]}),c.jsxs("div",{className:"flex items-center gap-2",children:[n>0&&c.jsx("button",{onClick:u,className:"flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-800",children:"Back"}),c.jsx("button",{onClick:g,className:"flex h-12 flex-[2] items-center justify-center rounded-xl bg-navy-900 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600",children:t?"Start Exploring":"Next"})]})]})})}function rk({darkMode:a,setDarkMode:n,onReplayTutorial:i}){return c.jsxs("div",{className:"mx-auto max-w-2xl pb-10",children:[c.jsx("h1",{className:"mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50",children:"Settings"}),c.jsx("p",{className:"mb-6 text-sm text-slate-500 dark:text-slate-400",children:"Customize your reading experience."}),c.jsxs("section",{className:"mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800",children:[c.jsx("h2",{className:"mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"Appearance"}),c.jsxs("div",{className:"flex items-center justify-between gap-4 rounded-xl py-1",children:[c.jsxs("div",{className:"min-w-0",children:[c.jsx("p",{className:"font-medium text-slate-800 dark:text-slate-100",children:"🌙 Dark Mode"}),c.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400",children:"Easier on the eyes in low light."})]}),c.jsx(ok,{enabled:a,onChange:n})]})]}),c.jsxs("section",{className:"mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800",children:[c.jsx("h2",{className:"mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"Help"}),c.jsx("button",{onClick:i,className:"flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-700",children:"🔄 Replay Tutorial"})]}),c.jsxs("section",{className:"mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800",children:[c.jsx("h2",{className:"mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"About this App"}),c.jsx("p",{className:"text-sm leading-relaxed text-slate-600 dark:text-slate-300",children:"RA 10863 — Customs Modernization and Tariff Act. A study & reading companion with search and highlights. Works fully offline."}),c.jsx("p",{className:"mt-2 text-xs text-slate-400 dark:text-slate-500",children:"Version 1.0.0 (Offline)"})]}),c.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800",children:[c.jsx("h2",{className:"mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500",children:"Developer"}),c.jsxs("div",{className:"flex items-center gap-3",children:[c.jsx("div",{className:"flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-white dark:bg-navy-700",children:"O"}),c.jsxs("div",{className:"min-w-0",children:[c.jsx("p",{className:"font-semibold text-slate-800 dark:text-slate-100",children:"Osias"}),c.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400",children:"App developer & maintainer"})]})]}),c.jsx("a",{href:"https://osiasnalaunan68-star.github.io/osias-personal-portfolio",target:"_blank",rel:"noopener noreferrer",className:"mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600",children:"🌐 View Developer Portfolio"})]})]})}function ed(a,n,i=[]){if(a.node_number===n)return{found:!0,ancestors:i};if(a.children)for(const e of a.children){const t=ed(e,n,[...i,a.id]);if(t.found)return t}return{found:!1}}function td(a,n=[]){if(a.children&&a.children.length>0){n.push(a.id);for(const i of a.children)td(i,n)}else a.content&&n.push(a.id);return n}function gk(){const[a,n]=D.useState("browse"),[i,e]=D.useState([]),[t,s]=D.useState(null),[g,u]=D.useState(null),[d,m]=D.useState(null),[C,f]=D.useState(!1),[S,P]=D.useState(null),[T,A]=D.useState(()=>window.innerWidth>=768),[L,k]=D.useState(()=>localStorage.getItem(Mp)||"study"),[h,b]=D.useState(()=>{const q=parseFloat(localStorage.getItem(Pp));return isNaN(q)?1:q}),[v,E]=D.useState(()=>localStorage.getItem(Bp)==="true"),[O,_]=D.useState(null),[j,X]=D.useState(new Set),[K,na]=D.useState(null),[Q,aa]=D.useState({}),[ea,yi]=D.useState(0),[Va,Ca]=D.useState(!1),[N,G]=D.useState(null),[U,ga]=D.useState(!1),ra=D.useRef(null),dn=D.useRef(null),Ma=D.useRef(null);D.useEffect(()=>localStorage.setItem(Mp,L),[L]),D.useEffect(()=>localStorage.setItem(Pp,String(h)),[h]),D.useEffect(()=>{localStorage.setItem(Bp,String(v)),document.documentElement.classList.toggle("dark",v)},[v]),D.useEffect(()=>{Ey().then(e).catch(wa=>{console.error("Failed to load titles:",wa),P(wa.message)});const q=Ly();q&&q.chapter_number&&G(q),Gy()||ga(!0)},[]);const qn=D.useCallback(()=>{qy(),ga(!1)},[]),nn=D.useCallback(()=>{ga(!0)},[]),en=D.useCallback(async(q,wa=null,tn=null)=>{f(!0),P(null);try{const J=await Dy(q,wa);if(!J)throw new Error("Chapter not found");if(m(J),s(q),u(wa),n("browse"),A(window.innerWidth>=768),tn&&J){const{found:Dn,ancestors:we}=ed(J,tn);if(Dn){X(new Set(we));let Se=null;const bi=fi=>{if(fi.node_number===tn&&fi.node_type==="section")return Se=fi.id,!0;if(fi.children){for(const yt of fi.children)if(bi(yt))return!0}return!1};bi(J),na(Se)}}else X(new Set),na(null);if(dn.current!=null){const Dn=dn.current;dn.current=null,setTimeout(()=>{ra.current&&(ra.current.scrollTop=Dn)},180)}else ra.current&&(ra.current.scrollTop=0)}catch(J){P(J.message),m(null)}finally{f(!1)}},[]),$o=D.useCallback(()=>{N&&(N.mode&&k(N.mode),dn.current=N.scrollTop||0,en(N.chapter_number,N.title_number||null))},[N,en]);D.useEffect(()=>{if(!d||a!=="browse")return;const q=ra.current;if(!q)return;const wa=()=>{zy({title_number:g,chapter_number:t,mode:L,scrollTop:q.scrollTop})},tn=()=>{Ma.current&&clearTimeout(Ma.current),Ma.current=setTimeout(wa,500)};return wa(),q.addEventListener("scroll",tn,{passive:!0}),()=>{q.removeEventListener("scroll",tn),Ma.current&&clearTimeout(Ma.current)}},[d,t,g,L,a]);const En=q=>{aa(wa=>({...wa,[q]:!wa[q]}))},ki=()=>{if(!d)return;const q=[];for(const wa of d.children)td(wa,q);X(new Set(q))},cn=()=>{X(new Set),yi(q=>q+1)},Fi=D.useMemo(()=>({activeHighlightNodeId:O,setActiveHighlightNodeId:_}),[O]);return c.jsx(Qu.Provider,{value:Fi,children:c.jsxs("div",{className:"relative flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950",style:{height:"100dvh"},children:[T&&a==="browse"&&c.jsx("div",{className:"fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden",onClick:()=>A(!1)}),a==="browse"&&c.jsxs("aside",{className:`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:w-80 md:max-w-none md:translate-x-0 ${T?"translate-x-0":"-translate-x-full"}`,children:[c.jsx("div",{className:"sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95",children:c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx("span",{className:"text-xl","aria-hidden":!0,children:"⚖️"}),c.jsxs("div",{children:[c.jsx("h2",{className:"text-base font-bold leading-tight text-navy-900 dark:text-slate-50",children:"RA 10863"}),c.jsx("p",{className:"text-xs text-slate-400 dark:text-slate-500",children:"Customs Modernization & Tariff Act"})]})]})}),c.jsxs("div",{className:"p-3",children:[S&&c.jsx("p",{className:"mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400",children:S}),i.map(q=>{const wa=q.title_number||"root",tn=Q[wa];return c.jsxs("div",{className:"mb-2",children:[c.jsxs("button",{onClick:()=>En(wa),className:"flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-50 dark:active:bg-slate-800",children:[c.jsx("span",{className:"text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300",children:q.title_number?`Title ${q.title_number}`:q.title_title}),c.jsx("span",{className:"flex-shrink-0 text-xs text-slate-400 dark:text-slate-500",children:tn?"▸":"▾"})]}),!tn&&c.jsx("ul",{className:"ml-1 space-y-0.5 border-l border-slate-100 pl-2 dark:border-slate-800",children:q.chapters.map(J=>{const Dn=t===J.node_number&&g===q.title_number;return c.jsx("li",{children:c.jsxs("button",{onClick:()=>en(J.node_number,q.title_number),className:`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${Dn?"bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700":"text-slate-600 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"}`,children:[c.jsxs("span",{className:"block truncate",children:["Ch. ",J.node_number,": ",J.title]}),c.jsxs("span",{className:`text-xs ${Dn?"text-slate-300":"text-slate-400 dark:text-slate-500"}`,children:[J.section_count," section",J.section_count!==1?"s":""]})]})},J.id)})})]},wa)})]})]}),c.jsxs("div",{className:"flex min-w-0 flex-1 flex-col",children:[c.jsxs("div",{className:"safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90",children:[c.jsxs("div",{className:`flex items-center gap-1.5 px-2 transition-all duration-300 ${Va&&L==="reading"?"max-h-0 overflow-hidden opacity-0 py-0":"max-h-16 py-2 opacity-100"}`,children:[a==="browse"&&c.jsx("button",{onClick:()=>A(q=>!q),className:"flex h-9 w-9 flex-shrink-0 touch-manipulation items-center justify-center rounded-full text-lg text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800","aria-label":"Toggle chapter list",children:T?"✕":"☰"}),c.jsxs("div",{className:"flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800",children:[c.jsxs("button",{onClick:()=>n("browse"),"aria-label":"Browse",className:`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${a==="browse"?"bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50":"text-slate-500 dark:text-slate-400"}`,children:[c.jsx("span",{"aria-hidden":!0,children:"📚"}),c.jsx("span",{className:"hidden sm:inline ml-1",children:"Browse"})]}),c.jsxs("button",{onClick:()=>n("search"),"aria-label":"Search",className:`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${a==="search"?"bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50":"text-slate-500 dark:text-slate-400"}`,children:[c.jsx("span",{"aria-hidden":!0,children:"🔍"}),c.jsx("span",{className:"hidden sm:inline ml-1",children:"Search"})]}),c.jsx("button",{onClick:()=>n("settings"),"aria-label":"Settings",className:`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${a==="settings"?"bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50":"text-slate-500 dark:text-slate-400"}`,children:"⚙️"}),Nr]}),c.jsx("span",{className:"flex-1"}),a==="browse"&&c.jsx(nk,{mode:L,setMode:k})]}),a==="browse"&&!(Va&&L==="reading")&&c.jsx("div",{className:"px-3 pb-2",children:c.jsx("span",{className:"block truncate text-sm font-semibold text-slate-800 dark:text-slate-200",children:d?d.title||`Chapter ${d.node_number}`:"Select a chapter"})}),a==="browse"&&L==="reading"&&c.jsxs("div",{className:"flex items-center justify-end gap-2 px-3 pb-2",children:[c.jsxs("button",{onClick:()=>Ca(q=>!q),className:`flex h-9 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors ${Va?"border-navy-900 bg-navy-900 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-navy-900":"border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700"}`,children:["🎯 ",c.jsx("span",{className:"hidden sm:inline",children:"Focus"})]}),c.jsx(ik,{fontScale:h,setFontScale:b})]}),a==="browse"&&L==="reading"&&d&&c.jsx(ek,{containerRef:ra})]}),c.jsxs("main",{ref:ra,className:"safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6",children:[S&&c.jsxs("div",{className:"mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200",children:[c.jsx("p",{className:"font-bold",children:"⚠️ Error"}),c.jsx("p",{className:"text-sm",children:S})]}),a==="search"?c.jsx(tk,{onNavigateChapter:en}):a==="settings"?c.jsx(rk,{darkMode:v,setDarkMode:E,onReplayTutorial:nn}):c.jsxs(c.Fragment,{children:[C&&c.jsx("div",{className:"mx-auto max-w-3xl space-y-3",children:[0,1,2].map(q=>c.jsxs("div",{className:"animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",children:[c.jsx("div",{className:"h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"}),c.jsx("div",{className:"mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800"}),c.jsx("div",{className:"mt-2 h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800"})]},q))}),!C&&!d&&!S&&c.jsxs("div",{className:"flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-400 dark:text-slate-600",children:[N&&c.jsxs("button",{onClick:$o,className:"mb-2 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-navy-200 bg-white p-4 text-left shadow-card active:bg-slate-50 dark:border-navy-700 dark:bg-slate-900 dark:active:bg-slate-800",children:[c.jsx("span",{className:"text-2xl","aria-hidden":!0,children:"⏱️"}),c.jsxs("span",{className:"min-w-0",children:[c.jsx("span",{className:"block text-sm font-semibold text-navy-900 dark:text-slate-100",children:"Continue where you left off"}),c.jsxs("span",{className:"block truncate text-xs text-slate-500 dark:text-slate-400",children:[N.title_number?`Title ${N.title_number} · `:"","Chapter ",N.chapter_number]})]})]}),c.jsx("span",{className:"text-4xl",children:"📖"}),c.jsxs("p",{className:"text-lg font-medium text-slate-500 dark:text-slate-400",children:["Select a chapter to start ",L==="reading"?"reading":"studying"]}),c.jsx("p",{className:"text-sm",children:"Use the menu button or Search to find what you need."})]}),d&&L==="study"&&c.jsxs("div",{className:"mx-auto max-w-3xl",children:[d.content&&c.jsx("p",{className:"mb-4 rounded-xl bg-white p-4 text-base text-slate-600 shadow-card dark:bg-slate-900 dark:text-slate-300",children:d.content}),c.jsxs("div",{className:"mb-3 flex flex-wrap items-center justify-end gap-2",children:[Nr,c.jsxs("button",{onClick:ki,className:"flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700",children:[c.jsx("span",{"aria-hidden":!0,children:"⤢"})," Expand All"]}),c.jsxs("button",{onClick:cn,className:"flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700",children:[c.jsx("span",{"aria-hidden":!0,children:"⤡"})," Collapse All"]})]}),c.jsx("div",{className:"space-y-1",children:d.children.map(q=>c.jsx(nd,{node:q,level:0,expandedSet:j,scrollToId:K,collapseSignal:ea},q.id))})]}),d&&L==="reading"&&c.jsxs("div",{className:`mx-auto transition-all duration-300 ${Va?"max-w-[62ch]":"max-w-[70ch]"}`,children:[d.content&&c.jsx("p",{className:"mb-4 font-serif text-slate-700 dark:text-slate-300",style:{fontSize:`${1.05*h}rem`},children:d.content}),d.children.map(q=>c.jsx(id,{node:q,level:0,fontScale:h,expandedSet:j,scrollToId:K},q.id))]})]})]})]}),Va&&L==="reading"&&d&&c.jsxs("button",{onClick:()=>Ca(!1),className:"fixed bottom-6 right-4 z-30 flex items-center gap-1.5 rounded-full bg-navy-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur active:bg-navy-800 dark:bg-slate-100/90 dark:text-navy-900",children:[c.jsx("span",{"aria-hidden":!0,children:"✕"})," Exit Focus"]}),U&&c.jsx(sk,{onFinish:qn})]})})}class lk extends qp.Component{constructor(n){super(n),this.state={error:null}}static getDerivedStateFromError(n){return{error:n}}componentDidCatch(n,i){console.error(n,i)}render(){return this.state.error?c.jsxs("div",{style:{padding:20,background:"#1e1e1e",color:"#ff6b6b",fontFamily:"monospace",whiteSpace:"pre-wrap",minHeight:"100vh"},children:[c.jsx("h1",{children:"⚠️ App Error"}),c.jsx("pre",{children:this.state.error.toString()})]}):this.props.children}}window.addEventListener("unhandledrejection",a=>{var i;const n=((i=a.reason)==null?void 0:i.message)||String(a.reason);document.body.innerHTML=`<div style="padding:20px;background:#1e1e1e;color:#ff6b6b;font-family:monospace;white-space:pre-wrap;">⚠️ ${n}</div>`});Ks.createRoot(document.getElementById("root")).render(c.jsx(qp.StrictMode,{children:c.jsx(lk,{children:c.jsx(gk,{})})}));"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(a=>{console.warn("Service worker registration failed:",a)})});
