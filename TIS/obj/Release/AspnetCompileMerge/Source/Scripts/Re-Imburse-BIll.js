
      var Employees;
      var Provider;
      var Year = [];
      $(document).ready(function () {
          $("#cmbMonth").jqxDropDownList({ placeHolder: 'Select Month', selectedIndex: -1, width: '170px', height: '25px' });
          $("#cmbMonth").jqxDropDownList('loadFromSelect', 'Select');
          $("#Select").hide();
          $("#cmbYear").jqxDropDownList({ placeHolder: 'Select Year', selectedIndex: -1, width: '170px', height: '25' });
          $("#cmbProvider").jqxDropDownList({ placeHolder: 'Select Provider', selectedIndex: -1, width: 170, height: 25 });
          $("#btnEmployee").jqxDropDownButton({ width: 150, height: 25 });
          $("#btnEmployee").jqxDropDownButton('setContent', 'Select Employee');
          $('#btnEmployee').on('open', function () { FillEmployee(); });
          $("#btnSearch").jqxButton({ template: '' });
          $('#btnSearch').on('click', function () {
              Search();
          });
          $("#btnSave").jqxButton({ template: '' });
          $('#btnSave').on('click', function () {
              SaveChanges();
          });
          $("#btnSave").hide();
          $("#btnCancel").jqxButton({ template: '' });
          $('#btnCancel').on('click', function () {
              Clear();
          });
          FillYear();
          GetData();
      })
      function GetData() {
          $.ajax({
              type: "GET",
              url: "../../Bill/GetSearchData",
              data: { "IsStatus": "false" },
              success: function (result) {
                  Employees = result.EmpList;
                  Provider = result.ProviderList;
                  FillProvider();
                  FillEmployee();
              }
          })
      }
      function FillEmployee() {

          var sourceEmp =
          {
              dataType: "json",
              dataFields: [
                  { name: 'EmpId', type: 'string' },
                  { name: 'EmpName', type: 'string' },
                  { name: 'EmpNo', type: 'string' }
              ],
              id: 'EmpId',
              localdata: Employees
          };
          var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
          $("#grdEmployee").jqxGrid({
              width: '100%',
              source: dataAdapterEmp,
              columnsresize: true,
              theme: 'dark-blue',
              pageSize: 10,
              sortable: true,
              filterable: true,
              showfilterrow: true,
              pageable: true,
              columns: [
                  { dataField: 'EmpId', text: 'EID' },
                  { dataField: 'EmpName', text: 'Emp Name' },
                  { dataField: 'EmpNo', text: 'Emp No' }]
          });

          $("#grdEmployee").on('rowselect', function (event) {
              var args = event.args;
              var row = $("#grdEmployee").jqxGrid('getrowdata', args.rowindex);
              var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + ' - ' + row['EmpNo'] + '</div>';
              $('#hidEmp').val(row['EmpId']);
              $("#btnEmployee").jqxDropDownButton('setContent', dropDownct);
              $('#btnEmployee').jqxDropDownButton('close');
          });
      }
      function FillYear() {
          for (var i = 2024; i <= 2030; i++) {
              Year.push(i);
          }
          $("#cmbYear").jqxDropDownList({ source: Year });
      }
      function FillProvider() {
          var source =
          {
              dataType: "json",
              dataFields: [
                  { name: 'ID', type: 'string' },
                  { name: 'NAME', type: 'string' }
              ],
              id: 'ID',
              localdata: Provider
          };
          var dataAdapterPr = new $.jqx.dataAdapter(source);
          // Create a jqxComboBox
          $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });

      }
      function Search() {
          var Provider = 0; var Month = 0; var Year = 0; var UID = 0;

          if ($("#cmbProvider").jqxDropDownList('getSelectedItem') != null) {
              Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
          }
          if ($("#cmbMonth").val() != null) {
              Month = $("#cmbMonth").val();
          }

          if ($("#cmbYear").jqxDropDownList('getSelectedItem') != null) {
              Year = $("#cmbYear").jqxDropDownList('getSelectedItem');
          }

          if ($("#hidEmp").val() != '') {
              UID = $("#hidEmp").val();
          }


          var Search = {
              "Month": Month,
              "Year": Year.label,
              "Provider": Provider.value,
              "UID": UID
          };
          var obji = { Search: Search }
          $.ajax({
              type: "POST",
              url: "../../Bill/SearchCloseBill",
              data: JSON.stringify(obji),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  FillGrid(result.dtData);
                  $("#grdData").show();
                  $("#btnSave").show();
              }
          })
      }
      function FillGrid(dtData) {
          var deptsource =
          {
              localdata: dtData,
              datafields:
                  [
                      { name: 'Id', type: 'number' },
                      { name: 'BillDate', type: 'date' },
                      { name: 'Mobile', type: 'string' },
                      { name: 'EmpName', type: 'string' },
                      { name: 'ManagerName', type: 'string' },
                      { name: 'TotalAmount', type: 'number' },

                  ],
              datatype: "json"
          };

          var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);

          $("#grdData").jqxGrid({
              width: '100%',
              source: dataAdapterCategory,
              columnsresize: true,
              theme: 'dark-blue',
              pageSize: 10,
              sortable: true,
              filterable: true,
              showfilterrow: true,
              pageable: true,

              selectionmode: 'checkbox',
              columns: [
                  { dataField: 'Id', text: 'Id' },
                  { dataField: 'BillDate', text: 'Bill Date', cellsformat: 'dd-MM-yyyy' },
                  { dataField: 'Mobile', text: 'Mobile' },
                  { dataField: 'EmpName', text: 'Employee Name', width: '150px' },
                  { dataField: 'ManagerName', text: 'Manager Name' },
                  { dataField: 'TotalAmount', text: 'Amount' }
              ]
          });
      }
      function SaveChanges() {
          var BillID = [];
          var Indexes = $('#grdData').jqxGrid('getselectedrowindexes');

          if (Indexes.length > 0) {
              for (var i = 0; i < Indexes.length; i++) {
                  var RowData = $('#grdData').jqxGrid('getrowdata', Indexes[i]);
                  var ID = RowData.Id;
                  BillID.push(ID);
              }
          }
          else {
              alert('Select Atleast One Record');
              return;
          }

          var Force = {
              "BillID": BillID
          };
          var obji = { Bill: Force }
          $.ajax({
              type: "POST",
              url: "../../Bill/ReimbursingBill",
              data: JSON.stringify(obji),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  alert(result.Message);
                  Clear();
              }
          });
      }
      function Clear() {
          $("#cmbMonth").jqxDropDownList({ selectedIndex: -1 });
          $("#cmbYear").jqxDropDownList({ selectedIndex: -1 });
          $("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
          $("#hidEmp").val('');
          $("#grdData").jqxGrid('clearselection');
          $("#grdData").hide();
          $("#btnSave").hide();
      }
