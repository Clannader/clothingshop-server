(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-55cd08d6"],{"01cd":function(t,e,a){"use strict";a("81f9")},"626f":function(t,e,a){"use strict";a.r(e),a("7db0"),a("d3b7");var i=a("5530"),n=a("b775"),s={name:"SettingsUsers",mixins:[a("f29d").a],data:function(){var t={cond:void 0};return{queryParams:t,queryParamsCopy:t}},methods:{doSearch:function(){var t,e=this;this.loading=!0,this.publicMethods.compareObjects(this.queryParamsCopy,this.queryParams)||(this.offset=1),(t=Object(i.a)(Object(i.a)({},this.queryParams),{},{offset:this.offset,pageSize:this.pageSize}),n.a.post("/api/user/search",t)).then((function(t){e.tableData=t.users,e.tableTotal=t.total})).catch((function(){e.tableData=[],e.tableTotal=0})).finally((function(){e.loading=!1,e.tableData.find((function(t){return e.isSelect._id===t._id}))||(e.isSelect={}),e.queryParamsCopy=Object.assign({},e.queryParams)}))},openCreate:function(){},openDelete:function(t){},openModify:function(t){},getAdminTypeLabel:function(t){switch(t){case"3RD":return this.$t("users.RD_Type");case"SYSTEM":return this.$t("users.SYSTEM_Type");case"NORMAL":return this.$t("users.NORMAL_Type")}}},computed:{tableColumns:{get:function(){return[{title:"".concat(this.$t("users.shopId")),width:150,dataIndex:"shopId"},{title:"".concat(this.$t("users.adminId")),width:150,dataIndex:"adminId"},{title:"".concat(this.$t("users.adminName")),width:150,dataIndex:"adminName"},{title:"".concat(this.$t("users.rights")),ellipsis:!0,dataIndex:"rights",width:200},{title:"".concat(this.$t("users.adminType")),width:100,dataIndex:"adminType",scopedSlots:{customRender:"adminType"}},{title:"".concat(this.$t("users.email")),dataIndex:"email",width:250},{title:"".concat(this.$t("users.supplierCode")),ellipsis:!0,dataIndex:"supplierCode"},{title:"".concat(this.$t("homePage.operation")),dataIndex:"",key:"action",fixed:"right",scopedSlots:{customRender:"action"},width:60,align:"center"}]}}}},o=(a("01cd"),a("2877")),c=Object(o.a)(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-card",{staticClass:"card-title"},[a("v-container",{staticClass:"card-container",attrs:{fluid:""}},[a("div",{staticClass:"form-group"},[a("div",{staticClass:"group-item"},[a("app-text-field",{attrs:{"update-value":t.queryParams.cond,label:t.$t("users.searchCond")},on:{"update:updateValue":function(e){return t.$set(t.queryParams,"cond",e)},"update:update-value":function(e){return t.$set(t.queryParams,"cond",e)},changeValue:t.doSearch}})],1),a("v-spacer"),a("div",{staticClass:"card-search-btn"},[a("v-btn",{attrs:{rounded:"",dark:""},on:{click:function(e){return t.doSearch()}}},[t._v(" "+t._s(t.$t("homePage.search"))+" ")])],1)],1)])],1),a("v-card",{directives:[{name:"resize",rawName:"v-resize",value:t.onResize,expression:"onResize"}],staticClass:"card-body"},[a("app-table",{attrs:{columns:t.tableColumns,dataSource:t.tableData,rowKey:function(t){return t._id},loading:t.loading,total:t.tableTotal,scroll:{x:1e3,y:t.tableY},rowClassName:t.rowClass,customRow:t.rowClick,offset:t.offset,pageSize:t.pageSize},on:{doSearch:t.doSearch,"update:offset":function(e){t.offset=e},"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e}},scopedSlots:t._u([{key:"adminType",fn:function(e){var i=e.text;return[a("div",{staticClass:"text-ellipsis"},[t._v(" "+t._s(t.getAdminTypeLabel(i))+" ")])]}},{key:"action",fn:function(e){var i=e.record;return[a("v-menu",{attrs:{bottom:"",left:"",transition:"slide-y-transition"},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[a("v-btn",t._g({attrs:{icon:"",small:""},on:{click:function(e){return t.selectedRow(i)}}},n),[a("v-icon",{staticStyle:{color:"#0055b8"}},[t._v(" more_vert ")])],1)]}}],null,!0)},[a("v-list",{staticClass:"option-menu-list"},[a("v-list-item",{on:{click:function(e){return t.openModify(i)}}},[a("i",{staticClass:"material-icons create"}),a("v-list-item-title",[t._v(" "+t._s(t.$t("homePage.modify"))+" ")])],1),a("v-list-item",{directives:[{name:"rights",rawName:"v-rights",value:["DeleteSYSUser"],expression:"['DeleteSYSUser']"}],on:{click:function(e){return t.openDelete(i)}}},[a("i",{staticClass:"material-icons highlight_off"}),a("v-list-item-title",[t._v(" "+t._s(t.$t("homePage.delete"))+" ")])],1)],1)],1)]}}])})],1),a("div",{staticClass:"card-bottom card-round-btn"},[a("v-btn",{attrs:{rounded:""},on:{click:function(e){return t.openCreate()}}},[t._v(t._s(t.$t("homePage.create")))]),a("v-btn",{attrs:{rounded:""},on:{click:function(e){return t.goBack()}}},[t._v(t._s(t.$t("homePage.goback")))])],1)],1)}),[],!1,null,"4bfd5b00",null);e.default=c.exports},"81f9":function(t,e,a){},f29d:function(t,e,a){"use strict";e.a={name:"table-init",created:function(){var t=this;this.$nextTick((function(){t.doSearch()}))},methods:{onResize:function(){this.tableY=window.innerHeight-427},closeDialog:function(){this.children="",this.doSearch()},rowClass:function(t){if(t._id===this.isSelect._id)return"rowSelected"},goBack:function(){this.$router.back(-1)},selectedRow:function(t){this.isSelect=t},rowClick:function(t){var e=this;return{on:{click:function(){e.selectedRow(t)},dblclick:function(){e.openModify(t)}}}},openModify:function(){},doSearch:function(){}},data:function(){return{tableData:[],tableY:230,loading:!1,tableTotal:0,children:"",recordScheam:void 0,offset:1,pageSize:10,isSelect:{}}}}}}]);