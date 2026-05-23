var Year = [];
$(document).ready(function () {
    $("#cmbMonth").jqxDropDownList({ placeHolder: 'Select Month', selectedIndex: -1, width: '170px', height: '25px' });
    $("#cmbMonth").jqxDropDownList('loadFromSelect', 'Select');
    $("#Select").hide();
    $("#cmbYear").jqxDropDownList({ placeHolder: 'Select Year', selectedIndex: -1, width: '170px', height: '25' });
    $("#cmbProvider").jqxDropDownList({ placeHolder: 'Select Provider', selectedIndex: -1, width: 170, height: 25 });
    $("#cmbStatus").jqxDropDownList({ placeHolder: 'Select Status', selectedIndex: -1, width: 170, height: 25 });
    $("#cmbStatus").jqxDropDownList('loadFromSelect', 'Select1');
    $("#Select1").hide();
    $("#btnSearch").jqxButton({ template: 'primary' });
    $('#btnSearch').on('click', function () {
        Search();

    });
    $("#btnCancel").jqxButton({ template: 'primary' });
    $('#btnCancel').on('click', function () {
        Clear();
    });
    FillYear();
    GetData();
})

function GetData() {
    $.ajax({
        type: "GET",
        url: "../../Report/GetReport",
        data: { "IsStatus": "true" },
        success: function (result) {

            var Provider = result.ProviderList;
            //                    var Status = result.dtStatus;
            FillProvider(Provider);
            //                    FillStatus(Status);

        }
    })
}

function FillProvider(Provider) {
    var source =
    {
        dataType: "json",
        dataFields: [
            { name: 'ID', type: 'string' },
            { name: 'Name', type: 'string' }
        ],
        id: 'ID',
        localdata: Provider
    };
    var dataAdapterPr = new $.jqx.dataAdapter(source);
    // Create a jqxComboBox
    $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "Name", valueMember: "ID" });

}
function Search() {
    var Provider = 0; var Month = 0; var Year = 0; var Status = 0;

    if ($("#cmbProvider").jqxDropDownList('getSelectedItem') != null) {
        Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
    }
    if ($("#cmbMonth").val() != null) {
        Month = $("#cmbMonth").val();
    }

    if ($("#cmbYear").jqxDropDownList('getSelectedItem') != null) {
        Year = $("#cmbYear").jqxDropDownList('getSelectedItem');
    }

    if ($("#cmbStatus").jqxDropDownList('getSelectedItem') != null) {
        Status = $("#cmbStatus").jqxDropDownList('getSelectedItem');
    }

    var Search = {
        "Month": Month,
        "Year": Year.label,
        "Provider": Provider.value,
        "Status": Status.value

    };
    var obji = { Search: Search }
    $.ajax({
        type: "POST",
        url: "../../Report/Search",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            FillGrid(result.dtData);
            $("#grdData").show();

        }
    })
}

function FillGrid(dtData) {

    var deptsource =
    {
        localdata: dtData,
        datafields:
            [
                { name: 'BILL_ID', type: 'number' },


                { name: 'EMPLOYEENAME', type: 'string' },

                { name: 'SUB_NO', type: 'number' },
                { name: 'BILLDATE', type: 'date' },
                { name: 'TOTALAMOUNT', type: 'number' },
                { name: 'LMEmail', type: 'string' }

            ],
        id: 'BILL_ID',
        datatype: "json"
    };

    var dataAdapGrid = new $.jqx.dataAdapter(deptsource);

    $("#grdData").jqxGrid({
        width: '100%',
        source: dataAdapGrid,
        columnsresize: true,
        theme: 'arctic',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        theme: 'ui-redmond',
        selectionmode: 'singlecell',
        editable: true,
        editmode: 'selectedcell',
        columns: [
            { dataField: 'BILL_ID', text: 'Id' },


            { dataField: 'EMPLOYEENAME', text: 'Employee Name', width: '150px' },

            { dataField: 'SUB_NO', text: 'Sub No.' },
            { dataField: 'BILLDATE', text: 'Bill Date.', cellsformat: 'dd-MM-yyyy' },
            { dataField: 'TOTALAMOUNT', text: 'Total Amount' },
            { dataField: 'LMEmail', text: 'Email Address' }


        ]
    });
}

function FillYear() {
    for (var i = 2013; i <= 2018; i++) {
        Year.push(i);
    }
    $("#cmbYear").jqxDropDownList({ source: Year });
}

function Clear() {
    $("#cmbMonth").jqxDropDownList({ selectedIndex: -1 });
    $("#cmbYear").jqxDropDownList({ selectedIndex: -1 });
    $("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
    $("#hidEmp").val('');
    $("#grdData").jqxGrid('clearselection');
    $("#grdData").hide();

}