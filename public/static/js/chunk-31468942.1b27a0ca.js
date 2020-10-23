(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-31468942"],{"4e9f":function(t,e,i){},"7d33":function(t,e,i){},8503:function(t,e,i){"use strict";i.r(e),i("7db0"),i("d3b7");var o=i("b775");i("b64b");var a={name:"RightsDetails",data:function(){return{title:"",isNew:!1,rightsSchema:{groupName:void 0,desc:void 0,rightsCode:void 0},visible:!0}},props:{recordScheam:{type:Object,default:function(){return{}}}},created:function(){this.isNew=0===Object.keys(this.recordScheam).length,this.isNew?this.title=this.$t("rights.createGroup"):(this.rightsSchema=this.recordScheam,this.title=this.$t("rights.modifyGroup",{name:this.rightsSchema.groupName}))},methods:{close:function(){this.$emit("closeDialog")},action:function(){}}},n=i("2877"),s=Object(n.a)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("app-dialog",{attrs:{visible:t.visible,title:t.title}},[i("template",{slot:"dialogContent"},[i("v-text-field",{attrs:{label:t.$t("rights.groupName")},model:{value:t.rightsSchema.groupName,callback:function(e){t.$set(t.rightsSchema,"groupName",e)},expression:"rightsSchema.groupName"}}),i("v-text-field",{attrs:{label:t.$t("rights.groupDesc")},model:{value:t.rightsSchema.desc,callback:function(e){t.$set(t.rightsSchema,"desc",e)},expression:"rightsSchema.desc"}}),i("v-text-field",{attrs:{label:t.$t("rights.rightsCodes")},model:{value:t.rightsSchema.rightsCode,callback:function(e){t.$set(t.rightsSchema,"rightsCode",e)},expression:"rightsSchema.rightsCode"}})],1),i("template",{slot:"dialogBtn"},[i("v-btn",{attrs:{depressed:""},on:{click:function(e){return t.action()}}},[t._v(t._s(t.$t("homePage.confirm")))]),i("v-btn",{attrs:{depressed:""},on:{click:function(e){return t.close()}}},[t._v(t._s(t.$t("homePage.colse")))])],1)],2)}),[],!1,null,"2bedac38",null).exports,c={name:"RightsDeleteDialog",data:function(){return{rightsSchema:{groupName:void 0}}},props:{recordScheam:{type:Object,default:function(){return{}}}},created:function(){this.rightsSchema=this.recordScheam},methods:{close:function(){this.$emit("closeDialog")},action:function(){var t,e=this;(t={id:this.rightsSchema._id},o.a.post("/api/rights/deleteRights",t)).then((function(){e.$toast.success(e.$t("homePage.deleteSuccess"))})).finally((function(){e.close()}))}}},r=(i("c6d0"),Object(n.a)(c,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("app-dialog",{attrs:{visible:!0,title:t.$t("rights.deleteGroup"),width:400}},[i("template",{slot:"dialogContent"},[i("div",{staticClass:"dialog-text"},[t._v(" "+t._s(t.$t("rights.confirmDelete",{name:t.rightsSchema.groupName}))+" ")])]),i("template",{slot:"dialogBtn"},[i("v-btn",{attrs:{depressed:""},on:{click:function(e){return t.action()}}},[t._v(t._s(t.$t("homePage.confirm")))]),i("v-btn",{attrs:{depressed:""},on:{click:function(e){return t.close()}}},[t._v(t._s(t.$t("homePage.colse")))])],1)],2)}),[],!1,null,"0618ff30",null).exports),l={name:"SettingsRights",created:function(){this.doSearch()},mounted:function(){},methods:{doSearch:function(){var t=this;this.loading=!0;var e=this.$refs.rightsTable,i=10,a=1;e&&(i=e.showPages,a=e.pageIndex),function(t){return o.a.post("/api/rights/getRightsList",t)}({groupName:this.groupName,offset:a,pageSize:i}).then((function(e){t.tableData=e.rights,t.tableTotal=t.tableData.length})).catch((function(){t.tableData=[],t.tableTotal=0})).finally((function(){t.loading=!1,t.tableData.find((function(e){return t.isSelect.groupName===e.groupName}))||(t.isSelect={})}))},openModify:function(t){var e,i=this;(e={id:t._id},o.a.post("/api/rights/findRightsById",e)).then((function(t){i.children=s,i.recordScheam=t.rights}))},initDoSearh:function(){this.pageIndex=1,this.doSearch()},rowClass:function(t){if(t.groupName===this.isSelect.groupName)return"rowSelected"},rowClick:function(t){var e=this;return{on:{click:function(){e.selectedRow(t)},dblclick:function(){e.openModify(t)}}}},selectedRow:function(t){this.isSelect=t},openDelete:function(t){this.children=r,this.recordScheam={_id:t._id,groupName:t.groupName}},goBack:function(){this.$router.back(-1)},openCreate:function(){this.children=s,this.recordScheam={}},closeDialog:function(){this.children="",this.doSearch()}},data:function(){return{tableData:[],loading:!1,groupName:void 0,tableTotal:0,children:"",recordScheam:void 0,isSelect:{}}},computed:{tableColumns:{get:function(){return[{title:"".concat(this.$t("rights.groupName")),width:150,fixed:"left",dataIndex:"groupName",isSelect:!1},{title:"".concat(this.$t("rights.groupDesc")),width:250,dataIndex:"desc",ellipsis:!0,scopedSlots:{customRender:"groupDesc"}},{title:"".concat(this.$t("rights.rightsCodes")),ellipsis:!0,dataIndex:"rightsCode"},{title:"".concat(this.$t("homePage.operation")),dataIndex:"",key:"action",fixed:"right",scopedSlots:{customRender:"action"},width:60,align:"center"}]}}}},d=(i("e48c"),Object(n.a)(l,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("v-card",{staticClass:"card-title"},[i("v-container",{staticClass:"card-container",attrs:{fluid:""}},[i("div",{staticClass:"form-group"},[i("div",{staticClass:"group-item"},[i("v-text-field",{attrs:{label:t.$t("rights.searchName")},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.initDoSearh(e)}},model:{value:t.groupName,callback:function(e){t.groupName=e},expression:"groupName"}})],1),i("v-spacer"),i("div",{staticClass:"card-search-btn"},[i("v-btn",{attrs:{rounded:"",dark:""},on:{click:function(e){return t.doSearch()}}},[t._v(" "+t._s(t.$t("homePage.search"))+" ")])],1)],1)])],1),i("v-card",{staticClass:"card-body"},[i("app-table",{ref:"rightsTable",attrs:{columns:t.tableColumns,dataSource:t.tableData,rowKey:function(t){return t._id},loading:t.loading,total:t.tableTotal,scroll:{x:1e3,y:400},rowClassName:t.rowClass,customRow:t.rowClick},on:{change:t.doSearch},scopedSlots:t._u([{key:"groupDesc",fn:function(e){var o=e.record;return[i("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[i("div",t._g({staticClass:"text-ellipsis"},a),[t._v(" "+t._s(o)+" ")])]}}],null,!0)},[i("div",[t._v(t._s(o))])])]}},{key:"action",fn:function(e){var o=e.record;return[i("v-menu",{attrs:{bottom:"",left:"",transition:"slide-y-transition"},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on;return[i("v-btn",t._g({attrs:{icon:"",small:""},on:{click:function(e){return t.selectedRow(o)}}},a),[i("v-icon",{staticStyle:{color:"#0055b8"}},[t._v(" more_vert ")])],1)]}}],null,!0)},[i("v-list",{staticClass:"option-menu-list"},[i("v-list-item",{on:{click:function(e){return t.openModify(o)}}},[i("i",{staticClass:"material-icons create"}),i("v-list-item-title",[t._v(" "+t._s(t.$t("homePage.modify"))+" ")])],1),i("v-list-item",{on:{click:function(e){return t.openDelete(o)}}},[i("i",{staticClass:"material-icons highlight_off"}),i("v-list-item-title",[t._v(" "+t._s(t.$t("homePage.delete"))+" ")])],1)],1)],1)]}}])})],1),i("div",{staticClass:"card-bottom card-round-btn"},[i("v-btn",{attrs:{rounded:""},on:{click:function(e){return t.openCreate()}}},[t._v(t._s(t.$t("homePage.create")))]),i("v-btn",{attrs:{rounded:""},on:{click:function(e){return t.goBack()}}},[t._v(t._s(t.$t("homePage.goback")))])],1),i(t.children,{tag:"component",attrs:{recordScheam:t.recordScheam},on:{closeDialog:t.closeDialog}})],1)}),[],!1,null,"cdd533e2",null));e.default=d.exports},c6d0:function(t,e,i){"use strict";var o=i("4e9f");i.n(o).a},e48c:function(t,e,i){"use strict";var o=i("7d33");i.n(o).a}}]);