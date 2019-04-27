// //读取当前用户
// var context = SP.ClientContext.get_current(); //读取当前网页的xxx
// var web = context.get_web();
// var user = web.get_currentUser(); //读取当前用户
// context.load(user); //加载当前用户

// context.executeQueryAsync(
//     function (data) {
//         console.log(user.get_title());
//         console.log("id:" + user.get_id());
//         console.log("ok");
//     },
//     function (data) {
//         console.log("error");
//     }
// )

// // 直接读取试图
// var v;
// var context = SP.ClientContext.get_current();
// var caml = new CamlXmlBuilder();
// caml.GroupBy("TRUE", "30", "User").Aggregations("Points", "SUM").End()
// var groupByData = context.get_web().get_lists().getByTitle("PointsHistoryTest").renderListData(caml.ToString());
// context.executeQueryAsync(function (data) {
//     console.log("ok");
//     v = JSON.parse(groupByData.m_value);
// }, function (sender, args) {
//     console.log("error" + args.get_message())
// });




// //网页直接获取
// var it;
// var item;
// var value;
// var context = SP.ClientContext.get_current(); //读取当前网页的xxx
// // context = new SP.ClientContext(site);
// var web = context.get_web();
// var olist = web.get_lists().getByTitle('AuthorizeList');
// var caml = new CamlXmlBuilder();
// caml.End();

// var camlQuery = new SP.CamlQuery();
// camlQuery.set_viewXml(caml.ToString());
// camlQuery.set_viewXml(`
// <View  Scope='Recursive' >
// <Query>
// <Where>
// <And>
// <And>
// <And>
// <And><Or><Eq><FieldRef Name='Area' LookupId='True' /><Value Type='LookupId'>9</Value></Eq><Eq><FieldRef Name='Area' /><Value Type='LookupValue'>All</Value></Eq></Or><Eq><FieldRef Name='ClientUser' LookupId='True' /><Value Type='LookupId'>17</Value></Eq></And><Eq><FieldRef Name='ProductCategory' LookupId='True' /><Value Type='LookupId'>1</Value></Eq></And><Eq><FieldRef Name='ProductFamily' LookupId='True' /><Value Type='LookupId'>1</Value></Eq></And><Eq><FieldRef Name='DocumentType' LookupId='True' /><Value Type='LookupId'>15</Value></Eq></And></Where></Query></View>`);
// var collListItem = olist.getItems(camlQuery);
// context.load(collListItem);
// context.executeQueryAsync(function (data) {
//     console.log(collListItem.get_count())
//     it = collListItem.getEnumerator();
//     it.moveNext();
//     item = it.get_current();
//     value = item.get_fieldValues();
// }, function (sender, args) {
//     console.log("error" + args.get_message())
// });

// //网页直接更新
// // var context = new SP.ClientContext("http...");   //获取指定网站的
// var context = SP.ClientContext.get_current(); //读取当前网页的xxx
// var web = context.get_web();
// var olist = web.get_lists().getByTitle('SealApplicationLibrary');
// var oListItem = olist.getItemById("90");

// // 查阅项更新
// // var lookUp = new SP.FieldLookupValue();
// // lookUp.set_lookupId(value);   // 查阅项id值
// // oListItem.set_item(key, lkfieldsomthing);

// // 普通项更新
// oListItem.set_item("ApplicationUser", "");
// oListItem.update();
// context.executeQueryAsync(function (data) {
//     console.log("ok")
// }, function (sender, args) {
//     console.log(args)

// });
// //  设置为空 "",  查阅项设置为空 { value: "", type: "Text"}

// // 直接删除
// var context = SP.ClientContext.get_current(); //读取当前网页的xxx
// var web = context.get_web();
// var list = web.get_lists().getByTitle("listTitle");
// var listItem = list.getItemById(id);
// listItem.deleteObject();
// context.executeQueryAsync((sender, args) => {
//     console.log("ok")
// }, (sender, args) => {
//     console.log(args)
// });

// // 直接获取用户组用户
// var userList
// var context = SP.ClientContext.get_current(); //读取当前网页的xxx
// var web = context.get_web();
// var allGroups = web.get_siteGroups();
// context.load(allGroups);
// var group = allGroups.getByName(groupName);
// context.load(group);
// var groupUsers = group.get_users();
// context.load(groupUsers);
// context.executeQueryAsync((sender, args) => {
//     userList = new Array();
//     var groupUserEnumerator = groupUsers.getEnumerator();
//     while (groupUserEnumerator.moveNext()) {
//         var groupUser = groupUserEnumerator.get_current();
//         userList.push({
//             id: groupUser.get_id(),
//             title: groupUser.get_title()
//         })
//     }
//     console.log("ok");

// }, (sender, args) => {
//     console.log(args.get_message())
// });




// /*
// getobjectdata()
// var d =group.get_objectData()
// d.get_properties()  //得到全部的
// */


// //表更新
// var clientContext = new SP.ClientContext('http://dev-sps16full01:8081/Workspace/'); //到指定地址取到xxx
// var oList = clientContext.get_web().get_lists().getByTitle('Userinformation'); //读取表
// var oListItem = oList.getItemById(3); //根据ID字段搜索表内容，唯一？						
// oListItem.set_item('PersonalPic', img); //设置数据
// oListItem.update(); //设置数据更新

// clientContext.executeQueryAsync( //异步执行更新
//     Function.createDelegate(this, this.onQuerySucceeded),
//     Function.createDelegate(this, this.onQueryFailed)
// );

// function onQuerySucceeded() {
//     alert('Item updated!');
// }

// function onQueryFailed(sender, args) {
//     alert('Request failed. ' + args.get_message() +
//         '\n' + args.get_stackTrace());
// }


// //FieldRef LookupId='True'

// // ID: data.user.get_id(),
// // Title: data.user.get_title(),
// // Email: data.user.get_email(),

// //SP自带caml
// var camlQuery = new SP.CamlQuery();
// camlQuery.set_viewXml("<View Scope='Recursive' ><Query><Where><Eq><FieldRef Name='Title' /><Value Type='Text'>" + userName + "</Value></Eq></Where></Query></View>");

// //camljs的builder
// var camlQuery = new CamlBuilder().View().Query().Where().UserField("Employee").Id().EqualTo(user.ID);
// "<View><Query><Where><Eq><FieldRef Name="
// Employee " LookupId="
// True " /><Value Type="
// Integer ">1073741823</Value></Eq></Where></Query></View>"

// var collListItem = oList.getItems(camlQuery);

// //orderby  在 false是降序   在query内where外
// //rowlimit   在query外，view内



// //根据条件读取表
// //site = '/xxx/xxx/xxx';
// //var context = new SP.ClientContext(site);
// var context = SP.ClientContext.get_current(); //读取当前网页的xxx
// var web = context.get_web();
// var olist = web.get_lists().getByTitle('SocialInfoApply');
// var camlQuery = new SP.CamlQuery();
// camlQuery.set_viewXml("<View Scope='Recursive'><Query><Where><Gt><FieldRef Name='StartDate' /><Value Type='DateTime'>2018-5-24 00:00:00Z</Value></Gt></Where></Query></View>");
// var collListItem = olist.getItems(camlQuery);
// context.load(collListItem);
// context.executeQueryAsync(function (data) {
//     var it = collListItem.getEnumerator()
//     while (it.moveNext()) {
//         var item = it.get_current();
//         var data = item.get_item('title');
//     }
// }, function () {

// });


// /*
// 读取文档库
// item.get_objectData()
// id.get_methodReturnObjects()
// i.$m_dict.xxxxx

// //以对象形式读取所有属性,返回{xx:xx,xx:xx}
// item.get_fieldValues()  
// */


// //弹框  两种方式
// //Using the DialogOptions class.
// var options = SP.UI.$create_DialogOptions();

// options.title = "My Dialog Title";
// options.width = 1080;
// options.height = 650;
// options.url = "/_layouts/DialogPage.aspx";

// SP.UI.ModalDialog.showModalDialog(options);

// //Using a generic object.
// var options = {
//     title: Title,
//     width: 1080,
//     height: 650,
//     url: "/Workflow/ITWorkflow/Lists/SocialInfoApply/DispForm.aspx?ID=" + ID + "&IsDlg=1"
// };

// SP.UI.ModalDialog.showModalDialog(options);


// //权限判断
// //权限控制
// function IsCurrentUserHasContribPerms() {

//     IsCurrentUserMemberOfGroup("test", function (isCurrentUserInGroups) {
//         usPermission = isCurrentUserInGroups;
//     });

// }

// function IsCurrentUserMemberOfGroup(groupName, OnComplete) {
//     var currentContext = new SP.ClientContext();
//     var currentWeb = currentContext.get_web();
//     var currentUser = currentWeb.get_currentUser();
//     currentContext.load(currentUser);
//     var allGroups = currentWeb.get_siteGroups();
//     currentContext.load(allGroups);
//     var group = allGroups.getByName(groupName);
//     currentContext.load(group);
//     var groupUsers = group.get_users();
//     currentContext.load(groupUsers);
//     currentContext.executeQueryAsync(OnSuccess, OnFailure);

//     function OnSuccess(sender, args) {
//         var userInGroup = false;
//         var groupUserEnumerator = groupUsers.getEnumerator();
//         while (groupUserEnumerator.moveNext()) {
//             var groupUser = groupUserEnumerator.get_current();
//             if (groupUser.get_id() == currentUser.get_id()) {
//                 userInGroup = true;
//                 break;
//             }
//         }
//         OnComplete(userInGroup);
//     }

//     function OnFailure(sender, args) {
//         OnComplete(false);
//     }
// }

// setTimeout()

// /*lookupvalue
// get_lookupValue()
// get_lookupId()
// */

// /*
// 日期
// Wed Jun 20 2018 00:00:00 GMT+0800 (中国标准时间)   一般结果
// format("dd/MM/yyyy")  ---  xx/xx/xxxx

// */

// /*
// 使用sharepoint需要的文件
// <script type="text/javascript" src="_layouts/15/init.js"></script>
// <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
// <script type="text/javascript" src="_layouts/15/sp.runtime.js"></script>
// <script type="text/javascript" src="_layouts/15/sp.js"></script>

// SP.SOD.executeFunc()   在init.js

// 延迟加载
// SharePoint 2010 中的ExecuteOrDelayUntilScriptLoaded，在2013 中使用时没有效果的问题。

// Example:

// SharePoint 2013 Code:

// SP.SOD.executeFunc('sp.js', 'SP.ClientContext', sharePointReady);

// function sharePointReady() {    alert("Ready"); }

// SharePoint 2010 Code:

// ExecuteOrDelayUntilScriptLoaded(sharePointReady, "sp.js");

// function sharePointReady() {    alert("Ready"); }
// */

// //只拿部分字段
// // context.load(collListItem,"Include(PersonalPic, Gender)");

// //时间2018-5-24 00:00:00Z
// //DateTime

// // 元素 说明 
// // And 并且 
// // BeginsWith 以某字符串开始的 
// // Contains 包含某字符串 
// // Eq 等于 
// // FieldRef 一个字段的引用 (在GroupBy 中使用) 
// // Geq 大于等于 
// // GroupBy 分组 
// // Gt 大于 
// // IsNotNull 非空 
// // IsNull 空 
// // Leq 小于等于 
// // Lt 小于 
// // Neq 不等于 
// // Now 当前时间 
// // Or 或 
// // OrderBy 排序 
// // Today 今天的日期 
// // TodayIso 今天的日期（ISO格式） 
// // Where Where子句


// //文件夹查询    
// //<View Scope='RecursiveAll'>(包含文件夹)  /<View Scope='Recursive'> (不包含文件夹)
// // Default -- 显示当前文件夹下的:文件和文件夹
// // FilesOnly--显示当前文件夹下的:文件

// // Recursive --显示当前文件夹下的:所有文件,包括子文件夹中的文件

// // RecursiveAll --显示当前文件夹下的:所有子文件夹和文件

// //通过设置url上传文件？
// function uploadFile(arrayBuffer, folderPath, fileName) {
//     //Create FileCreationInformation object using the read file data  
//     var createInfo = new SP.FileCreationInformation();
//     createInfo.set_content(base64);
//     createInfo.set_url("https://sitecollectionurl/DocumentList/" + folderPath + "/" + fileName);


//     //Add the file to the library  
//     var uploadedDocument = oList.get_rootFolder().get_files().add(createInfo)
//     //Load client context and execcute the batch  
//     clientContext.load(uploadedDocument);
//     clientContext.executeQueryAsync(QuerySuccess, QueryFailure);
// }


// function getFiles(listTitle, folderUrl, success, failed) {
//     var context = SP.ClientContext.get_current();
//     var web = context.get_web();
//     var list = web.get_lists().getByTitle(listTitle);
//     var createItemsQuery = function (folderUrl) {
//         var qry = new SP.CamlQuery();
//         qry.set_viewXml('<View><Query><Where><Eq><FieldRef Name="FSObjType" /><Value Type="Integer">0</Value></Eq></Where><OrderBy><FieldRef Name="Modified" Ascending="FALSE" /></OrderBy></Query></View>');
//         qry.set_folderServerRelativeUrl(folderUrl);
//         return qry;
//     };
//     var items = list.getItems(createItemsQuery(folderUrl));
//     context.load(items, 'Include(File.ServerRelativeUrl)');
//     context.executeQueryAsync(
//         function () {
//             success(items)
//         },
//         failed);
// }

// var listTitle = 'OperationManualLibrary';
// var folderUrl = '/DocLibrary/NF1/Communications'; //format: /[site]/[library]/[folder]
// getFiles(listTitle, folderUrl,
//     function (items) {
//         var fileUrls = [];
//         items.get_data().forEach(function (item) {
//             var file = item.get_file();
//             fileUrls.push(file.get_serverRelativeUrl());
//         });
//         var result = fileUrls.join(',');
//         console.log(result);
//     },
//     function (sender, args) {
//         console.log('Message:' + args.get_message());
//     });








// //批量更新
// var collListItemToBeUpdated = "";
// var listItemToBeUpdated = "";

// function getItemsToBeUpdated() // this function called on button click to get ID's
// {
//     var clientContext = new SP.ClientContext.get_current();
//     var oList = clientContext.get_web().get_lists().getByTitle('rohit_list1');
//     var camlQuery = new SP.CamlQuery();
//     camlQuery.set_viewXml('<View><Query><Where><Geq>' +
//         '<FieldRef Name=\'ID\'/><Value Type=\'Number\'>15</Value>' +
//         '</Geq></Where></Query></View>');
//     collListItemToBeUpdated = oList.getItems(camlQuery);
//     clientContext.load(collListItemToBeUpdated);
//     clientContext.executeQueryAsync(getItemsToBeUpdatedSuccess, getItemsToBeUpdatedFailed);
// }

// function getItemsToBeUpdatedSuccess() {
//     ListItemToBeUpdated = collListItemToBeUpdated.getEnumerator();
//     updateMultipleListItems();
// }

// function getItemsToBeUpdatedFailed(sender, args) {
//     alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
// }

// function updateMultipleListItems() //this function called on successfully getting ID's
// {
//     var itemArray = [];
//     var clientContext = SP.ClientContext.get_current();
//     var oList = clientContext.get_web().get_lists().getByTitle('rohit_list1');

//     while (ListItemToBeUpdated.moveNext()) {
//         var oItem = ListItemToBeUpdated.get_current();
//         var oListItem = oList.getItemById(oItem.get_id());
//         oListItem.set_item('Title', 'Updated ...!');
//         oListItem.update();
//         itemArray.push(oListItem);
//         clientContext.load(itemArray[itemArray.length - 1]);
//     }
//     clientContext.executeQueryAsync(updateMultipleListItemsSuccess, updateMultipleListItemsFailed);
// }

// function updateMultipleListItemsSuccess() {
//     alert('Items Updated');
// }

// function updateMultipleListItemsFailed(sender, args) {
//     alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
// }

// //单独上传文件
// function uploadFile(arrayBuffer, fileName) {
//     //Get Client Context,Web and List object.  
//     var clientContext = new SP.ClientContext();
//     var oWeb = clientContext.get_web();
//     var oList = oWeb.get_lists().getByTitle('DocumentList');

//     //Convert the file contents into base64 data  
//     var bytes = new Uint8Array(arrayBuffer);
//     var i, length, out = '';
//     for (i = 0, length = bytes.length; i < length; i += 1) {
//         out += String.fromCharCode(bytes[i]);
//     }
//     var base64 = btoa(out);
//     //Create FileCreationInformation object using the read file data  
//     var createInfo = new SP.FileCreationInformation();
//     createInfo.set_content(base64);
//     createInfo.set_url(fileName);


//     //Add the file to the library  
//     var uploadedDocument = oList.get_rootFolder().get_files().add(createInfo)
//     //Load client context and execcute the batch  
//     clientContext.load(uploadedDocument);
//     clientContext.executeQueryAsync(QuerySuccess, QueryFailure);
// }

// //文件上传+字段项，文件使用内容
// //upload file to document library
// var clientContext = SP.ClientContext.get_current();
// var oWebsite = clientContext.get_web();
// var oList = oWebsite.get_lists().getByTitle("Documents");

// var fileCreateInfo = new SP.FileCreationInformation();
// fileCreateInfo.set_url("my new file.txt");
// fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
// var fileContent = "The content of my new file";

// for (var i = 0; i < fileContent.length; i++) {
//     fileCreateInfo.get_content().append(fileContent.charCodeAt(i));
// }

// var newFile = oList.get_rootFolder().get_files().add(fileCreateInfo);
// var myListItem = newFile.get_listItemAllFields();
// myListItem.set_item("Note", "NewValue")

// myListItem.update();
// clientContext.executeQueryAsync(function (sender, args) {
//     // success on setting item values
//     console.log("Item updated");
// }, genericFailHandler);

// function genericFailHandler(sender, args) {
//     console.log(args.get_message());
// }



// //将文件读取为readAsArrayBuffer 上传，附带字段，文档库创建新项目
// var arrayBuffer;
// var fileName;
// var clientContext = SP.ClientContext.get_current();
// var oWebsite = clientContext.get_web();
// var oList = oWebsite.get_lists().getByTitle("Documents");

// //Convert the file contents into base64 data  
// var bytes = new Uint8Array(arrayBuffer);
// var i, length, out = '';
// for (i = 0, length = bytes.length; i < length; i += 1) {
//     out += String.fromCharCode(bytes[i]);
// }
// var base64 = btoa(out);
// //Create FileCreationInformation object using the read file data  
// var createInfo = new SP.FileCreationInformation();
// createInfo.set_content(base64);
// createInfo.set_url(fileName);

// var newFile = oList.get_rootFolder().get_files().add(createInfo);
// var myListItem = newFile.get_listItemAllFields();
// myListItem.set_item("Note", "NewValue")

// myListItem.update();
// clientContext.executeQueryAsync(function (sender, args) {
//     // success on setting item values
//     console.log("Item updated");
// }, genericFailHandler);

// function genericFailHandler(sender, args) {
//     console.log(args.get_message());
// }

// // create  folder
// function createFolder(resultpanel) {
//     var clientContext;
//     var oWebsite;
//     var oList;
//     var itemCreateInfo;

//     clientContext = new SP.ClientContext.get_current();
//     oWebsite = clientContext.get_web();
//     oList = oWebsite.get_lists().getByTitle("Shared Documents");

//     itemCreateInfo = new SP.ListItemCreationInformation();
//     itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
//     //设置文件夹名
//     itemCreateInfo.set_leafName("My new folder!");
//     this.oListItem = oList.addItem(itemCreateInfo);
//     //设置文件夹的字段信息
//     this.oListItem.set_item("Title", "My new folder!");
//     this.oListItem.update();

//     clientContext.load(this.oListItem);
//     clientContext.executeQueryAsync(
//         Function.createDelegate(this, successHandler),
//         Function.createDelegate(this, errorHandler)
//     );

//     function successHandler() {
//         resultpanel.innerHTML = "Go to the " +
//             "<a href='../Lists/Shared Documents'>document library</a> " +
//             "to see your new folder.";
//     }

//     function errorHandler() {
//         resultpanel.innerHTML =
//             "Request failed: " + arguments[1].get_message();
//     }
// }

// context.load(xxx) // 在异步操作后可以返回信息


//     // join
//     <
//     View >
//     <
//     ViewFields >
//     <
//     FieldRef Name = "Title" / >
//     <
//     FieldRef Name = "Country" / >
//     <
//     FieldRef Name = "Population" / >
//     <
//     /ViewFields> <
// Joins >
//     <
//     Join Type = "LEFT"
// ListAlias = "Country" >
//     <
//     Eq >
//     <
//     FieldRef Name = "Country"
// RefType = "ID" / >
//     <
//     FieldRef Name = "ID"
// List = "Country" / >
//     <
//     /Eq> < /
// Join > <
//     /Joins> <
// ProjectedFields >
//     <
//     Field ShowField = "People"
// Type = "Lookup"
// Name = "Population"
// List = "Country" / >
//     <
//     /ProjectedFields> <
// Query >
//     <
//     Where >
//     <
//     Lt >
//     <
//     FieldRef Name = "Population" / >
//     <
//     Value Type = "Number" > 10 < /Value> < /
// Lt > <
//     /Where> < /
// Query > <
//     /View>


//     <
//     View >
//     <
//     Query >
//     <
//     Where >
//     <
//     Eq >
//     <
//     FieldRef Name = 'PartLookup'
// LookupId = 'TRUE' / >
//     <
//     Value Type = 'Lookup' > " + currentItem.Part.Id + @" < /Value> < /
// Eq > <
//     /Where> < /
// Query > <
//     ViewFields >
//     <
//     FieldRef Name = 'SupplierLookupTitle' / >
//     <
//     FieldRef Name = 'SupplierLookupDUNS' / >
//     <
//     FieldRef Name = 'SupplierLookupRating' / >
//     <
//     /ViewFields> <
// ProjectedFields >
//     <
//     Field Name = 'SupplierLookupTitle'
// Type = 'Lookup'
// List = 'SupplierLookup'
// ShowField = 'Title' / >
//     <
//     Field Name = 'SupplierLookupDUNS'
// Type = 'Lookup'
// List = 'SupplierLookup'
// ShowField = 'DUNS' / >
//     <
//     Field Name = 'SupplierLookupRating'
// Type = 'Lookup'
// List = 'SupplierLookup'
// ShowField = 'Rating' / >
//     <
//     /ProjectedFields> <
// Joins >
//     <
//     Join Type = 'LEFT'
// ListAlias = 'SupplierLookup' >
//     <!--List Name: Suppliers-->
//     <
//     Eq >
//     <
//     FieldRef Name = 'SupplierLookup'
// RefType = 'ID' / >
//     <
//     FieldRef List = 'SupplierLookup'
// Name = 'ID' / >
//     <
//     /Eq> < /
// Join > <
//     /Joins> < /
// View >


//     <
//     View >
//     <
//     Query >
//     <
//     Where >
//     <
//     Eq >
//     <
//     FieldRef Name = 'PenndingApprovers'
// LookupId = 'TRUE' / >
//     <
//     Value Type = 'Lookup' > 1 < /Value> < /
// Eq > <
//     /Where> < /
// Query > <
//     ViewFields >
//     <
//     FieldRef Name = 'ID' / >
//     <
//     FieldRef Name = 'ApplicationType' / >
//     <
//     /ViewFields> <
// ProjectedFields >
//     <
//     Field Name = 'SalerField'
// Type = 'Lookup'
// List = 'Sales'
// ShowField = 'Field' / >
//     <
//     /ProjectedFields> <
// Joins >
//     <
//     Join Type = 'LEFT'
// ListAlias = 'PaymentApplicationLibrary' >
//     <
//     Eq >
//     <
//     FieldRef Name = 'ID'
// RefType = 'ID' / >
//     <
//     FieldRef List = 'PaymentApplicationLibrary'
// Name = 'ID' / >
//     <
//     /Eq> < /
// Join > <
//     /Joins> < /
// View >

//     // Joins对应的join的表，ProjectedFields 对应的Join的表的字段
//     // 不过Joins 和ProjectedFields 对于字段有很多限制，join的表不支持多行文本，不支持用户或用户组