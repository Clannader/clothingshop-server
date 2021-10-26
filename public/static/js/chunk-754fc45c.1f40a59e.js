(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-754fc45c"],{"16fa":function(t,e,i){"use strict";i("7741")},"5c08":function(t,e,i){"use strict";i.r(e),i("7db0"),i("d3b7");var n=i("5530"),o=i("b775");i("caad"),i("b64b");var a={name:"ConfigDetails",props:{recordScheam:{type:Object,default:function(){return{}}},type:{type:String,required:!0,default:"ONE",validator:function(t){return["ONE","TWO"].includes(t)}}},data:function(){var t=this;return{title:"",isNew:!1,configSchema:{shopId:void 0,key:void 0,value:void 0,desc:void 0,id:void 0},visible:!0,valid:!0,children:"",shopIdRules:[function(e){return!!e||"".concat(t.$t("systemConfig.inputShopId"))}],configKeyRules:[function(e){return!!e||"".concat(t.$t("systemConfig.inputConfigKey"))}],configValueRules:[function(e){return"ONE"===t.type||!!e||"".concat(t.$t("systemConfig.inputConfigValue"))}]}},created:function(){this.isNew=0===Object.keys(this.recordScheam).length,this.isNew?this.title=this.$t("systemConfig.createConfig"):(this.configSchema=this.recordScheam,this.title=this.$t("systemConfig.modifyConfig",{name:this.configSchema.key}))},methods:{close:function(){this.$emit("closeDialog")},action:function(){}}},s=i("2877"),c=Object(s.a)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("app-dialog",{attrs:{visible:t.visible,title:t.title}},[i("template",{slot:"dialogContent"},[i("v-form",{ref:"form",model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[i("app-shop-text-field",{attrs:{shopId:t.configSchema.shopId,label:t.$t("systemConfig.shopId"),rules:t.shopIdRules,"init-shop":!0},on:{"update:shopId":function(e){return t.$set(t.configSchema,"shopId",e)},"update:shop-id":function(e){return t.$set(t.configSchema,"shopId",e)}}}),i("v-text-field",{attrs:{label:t.$t("systemConfig.key"),rules:t.configKeyRules},model:{value:t.configSchema.key,callback:function(e){t.$set(t.configSchema,"key",e)},expression:"configSchema.key"}}),i("v-text-field",{attrs:{label:t.$t("systemConfig.value"),rules:t.configValueRules},model:{value:t.configSchema.value,callback:function(e){t.$set(t.configSchema,"value",e)},expression:"configSchema.value"}}),i("v-text-field",{attrs:{label:t.$t("systemConfig.desc")},model:{value:t.configSchema.desc,callback:function(e){t.$set(t.configSchema,"desc",e)},expression:"configSchema.desc"}})],1)],1),i("template",{slot:"dialogBtn"},[i("v-btn",{attrs:{depressed:""},on:{click:function(e){return t.action()}}},[t._v(t._s(t.$t("homePage.confirm")))]),i("v-btn",{attrs:{depressed:""},on:{click:function(e){return t.close()}}},[t._v(t._s(t.$t("homePage.colse")))])],1)],2)}),[],!1,null,"dbbe6666",null).exports,r={name:"SystemConfig",mixins:[i("f29d").a],data:function(){var t={cond:void 0,shopId:void 0,type:"ONE"};return{queryParams:t,queryParamsCopy:t}},methods:{doSearch:function(){var t,e=this;this.loading=!0,this.publicMethods.compareObjects(this.queryParamsCopy,this.queryParams)||(this.offset=1),(t=Object(n.a)(Object(n.a)({},this.queryParams),{},{offset:this.offset,pageSize:this.pageSize}),o.a.post("/api/system/group/search",t)).then((function(t){e.tableData=t.group,e.tableTotal=t.total})).catch((function(){e.tableData=[],e.tableTotal=0})).finally((function(){e.loading=!1,e.tableData.find((function(t){return e.isSelect._id===t._id}))||(e.isSelect={}),e.queryParamsCopy=Object.assign({},e.queryParams)}))},openCreate:function(){this.children=c,this.recordScheam={}},openModify:function(t){var e;(e={id:t._id},o.a.get("/api/system/group/details",{params:e})).then((function(t){})).catch((function(){}))},openDelete:function(){},openChildren:function(){}},computed:{tableColumns:{get:function(){return[{title:"".concat(this.$t("systemConfig.shopId")),width:150,dataIndex:"shopId"},{title:"".concat(this.$t("systemConfig.key")),width:200,dataIndex:"key"},{title:"".concat(this.$t("systemConfig.value")),width:250,ellipsis:!0,dataIndex:"value"},{title:"".concat(this.$t("systemConfig.desc")),ellipsis:!0,dataIndex:"desc"},{title:"".concat(this.$t("homePage.operation")),dataIndex:"",key:"action",fixed:"right",scopedSlots:{customRender:"action"},width:60,align:"center"}]}}}},l=(i("16fa"),Object(s.a)(r,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("v-card",{staticClass:"card-title"},[i("v-container",{staticClass:"card-container",attrs:{fluid:""}},[i("div",{staticClass:"form-group"},[i("div",{staticClass:"group-item"},[i("app-shop-text-field",{attrs:{shopId:t.queryParams.shopId},on:{"update:shopId":function(e){return t.$set(t.queryParams,"shopId",e)},"update:shop-id":function(e){return t.$set(t.queryParams,"shopId",e)},searchShopId:t.doSearch}})],1),i("div",{staticClass:"group-item"},[i("app-text-field",{attrs:{"update-value":t.queryParams.cond,label:t.$t("users.searchCond")},on:{"update:updateValue":function(e){return t.$set(t.queryParams,"cond",e)},"update:update-value":function(e){return t.$set(t.queryParams,"cond",e)},changeValue:t.doSearch}})],1),i("v-spacer"),i("div",{staticClass:"card-search-btn"},[i("v-btn",{attrs:{rounded:"",dark:""},on:{click:function(e){return t.doSearch()}}},[t._v(" "+t._s(t.$t("homePage.search"))+" ")])],1)],1)])],1),i("v-card",{directives:[{name:"resize",rawName:"v-resize",value:t.onResize,expression:"onResize"}],staticClass:"card-body"},[i("app-table",{attrs:{columns:t.tableColumns,dataSource:t.tableData,rowKey:function(t){return t._id},loading:t.loading,total:t.tableTotal,scroll:{x:1e3,y:t.tableY},rowClassName:t.rowClass,customRow:t.rowClick,offset:t.offset,pageSize:t.pageSize},on:{doSearch:t.doSearch,"update:offset":function(e){t.offset=e},"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e}},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.record;return[i("v-menu",{attrs:{bottom:"",left:"",transition:"slide-y-transition"},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[i("v-btn",t._g({attrs:{icon:"",small:""},on:{click:function(e){return t.selectedRow(n)}}},o),[i("v-icon",{staticStyle:{color:"#0055b8"}},[t._v(" more_vert ")])],1)]}}],null,!0)},[i("v-list",{staticClass:"option-menu-list"},[i("v-list-item",{on:{click:function(e){return t.openModify(n)}}},[i("i",{staticClass:"material-icons create"}),i("v-list-item-title",[t._v(" "+t._s(t.$t("homePage.modify"))+" ")])],1),i("v-list-item",{on:{click:function(e){return t.openDelete(n)}}},[i("i",{staticClass:"material-icons highlight_off"}),i("v-list-item-title",[t._v(" "+t._s(t.$t("homePage.delete"))+" ")])],1),i("v-list-item",{on:{click:function(e){return t.openChildren(n)}}},[i("i",{staticClass:"material-icons list"}),i("v-list-item-title",[t._v(" "+t._s(t.$t("systemConfig.subset"))+" ")])],1)],1)],1)]}}])})],1),i("div",{staticClass:"card-bottom card-round-btn"},[i("v-btn",{attrs:{rounded:""},on:{click:function(e){return t.openCreate()}}},[t._v(t._s(t.$t("homePage.create")))]),i("v-btn",{attrs:{rounded:""},on:{click:function(e){return t.goBack()}}},[t._v(t._s(t.$t("homePage.goback")))])],1),i(t.children,{tag:"component",attrs:{type:"ONE",recordScheam:t.recordScheam},on:{closeDialog:t.closeDialog}})],1)}),[],!1,null,"1f5f980b",null));e.default=l.exports},7741:function(t,e,i){},f29d:function(t,e,i){"use strict";e.a={name:"table-init",created:function(){var t=this;this.$nextTick((function(){t.doSearch()}))},methods:{onResize:function(){this.tableY=window.innerHeight-427},closeDialog:function(){this.children="",this.doSearch()},rowClass:function(t){if(t._id===this.isSelect._id)return"rowSelected"},goBack:function(){this.$router.back(-1)},selectedRow:function(t){this.isSelect=t},rowClick:function(t){var e=this;return{on:{click:function(){e.selectedRow(t)},dblclick:function(){e.openModify(t)}}}},openModify:function(){},doSearch:function(){}},data:function(){return{tableData:[],tableY:230,loading:!1,tableTotal:0,children:"",recordScheam:void 0,offset:1,pageSize:10,isSelect:{}}}}}}]);