(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2d0e5e97"],{9703:function(t,e,o){"use strict";o.r(e);var s={name:"NotFound",mixins:[o("43e0").a],methods:{gotoHome:function(){var t=this;this.$store.dispatch("tagsView/clearViews").then((function(){sessionStorage.setItem("addViews",JSON.stringify([])),t.$router.push({path:"/home"})}))}}},a=o("2877"),n=Object(a.a)(s,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-container",{staticClass:"text-center",staticStyle:{height:"calc(100vh - 58px)"},attrs:{"fill-height":""}},[o("v-row",{attrs:{align:"center"}},[o("v-col",[o("h1",{staticClass:"display-2 primary--text"},[t._v(t._s(t.$t("homePage.notWhoops"))+", 404")]),o("p",[t._v(t._s(t.$t("homePage.notPage")))]),o("v-btn",{attrs:{color:"primary",outlined:""},on:{click:t.gotoHome}},[t._v(" "+t._s(t.$t("homePage.notHere"))+" ")])],1)],1)],1)}),[],!1,null,"c65af3ac",null);e.default=n.exports}}]);