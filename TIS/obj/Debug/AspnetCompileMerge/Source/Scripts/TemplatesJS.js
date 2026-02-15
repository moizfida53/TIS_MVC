$(document).ready(function () {
    LoadTemplates();
});

function setDataSource(result) {
    console.log(result);

    var deptsource =
    {
    

        localdata: result,
        datafields:
        [
             { name: 'Id', type: 'number' },
            { name: 'TemplateId', type: 'number' },
             { name: 'TemplateName', type: 'string' },
            { name: 'TemplateText', type: 'string' },
            { name: 'CountryId', type: 'number' },
            { name: 'CountryName', type: 'string' },
             { name: 'EmailFrom', type: 'string' },
              { name: 'EmailBCC', type: 'string' },
        ],
        datatype: "json"
    };

    var dataAdapterCustomer = new $.jqx.dataAdapter(deptsource);

    $("#grdTemplates").jqxGrid({
        width: '100%',
        source: dataAdapterCustomer,
        theme: 'arctic',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        theme: 'dark-blue',

        columns: [
             { dataField: 'Id', text: 'Id', hidden: true },
            { dataField: 'TemplateId', text: 'TemplateId', hidden: true },
             { dataField: 'TemplateName', text: 'Template Type' },
            { dataField: 'TemplateText', text: 'Template Text' },
            { dataField: 'CountryId', text: 'CountryId', hidden: true },
            { dataField: 'CountryName', text: 'Country' },
            { dataField: 'EmailFrom', text: 'From' },
            { dataField: 'EmailBCC', text: 'BCC' },
        ]
    });
    $("#grdTemplates").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdTemplates").jqxGrid('getrowdata', args.rowindex);
        $('#lblId').val(row['Id']);
        $('#txtTemplate').val(row['TemplateText']);
        $('#txtEmailFrom').val(row['EmailFrom']);
        $('#txtEmailBCC').val(row['EmailBCC']);
        $("#cmbTemplate").jqxDropDownList('val', row['TemplateId']);
        $("#cmbCountry").jqxDropDownList('val', row['CountryId']);

        //UpdateButton();
    });
}
function LoadTemplates()
{
    $.ajax({
        type: "GET",
        url: "../../Ajax/LoadTemplates",
        contentType: 'application/json',
        success: function (result) {
            console.log(result.tmvm.TemplateTypes);
            setDataSourceTemplateCombo(result.tmvm.TemplateTypes);
            setDataSourceCountry(result.tmvm.Countries);
            setDataSource(result.tmvm.Templates)
            //ClearButton();
        }
    });
}
function TemplateSave()
{
    //alert($('#lblId').val());
    var tId = $("#cmbTemplate").jqxDropDownList('val', 'c');
    var cId = $("#cmbCountry").jqxDropDownList('val', 'c');

    if (tId > 0) {
    } else {
        alert('please enter Template');
        return;
    }
    if (cId > 0) {
    } else {
        alert('please enter Country');
        return;
    }
    var TemplateObj = {
        Id: $('#lblId').val(),
        TemplateId: tId,
        TemplateText: $('#txtTemplate').val(),
        EmailFrom: $('#txtEmailFrom').val(),
        EmailBCC: $('#txtEmailBCC').val(),
        CountryId: cId,
    };

    $.ajax({
        type: "POST",
        url: "../../Ajax/UpdateTemplates",
        contentType: 'application/json',
        data: JSON.stringify(TemplateObj),
        success: function (result) {
            setDataSource(result.Templates)
            
            alert('Saved Successfully');
        }
    });
}
// Populate Template dropdown
function setDataSourceTemplateCombo(templateTypes) {
    const cmbTemplate = $("#cmbTemplate");
    cmbTemplate.empty(); // Clear existing options
    cmbTemplate.append('<option value="">Select Template</option>'); // Default placeholder
    templateTypes.forEach(template => {
        cmbTemplate.append(`<option value="${template.Id}">${template.TemplateName}</option>`);
    });
}

// Populate Country dropdown
function setDataSourceCountry(countries) {
    const cmbCountry = $("#cmbCountry");
    cmbCountry.empty(); // Clear existing options
    cmbCountry.append('<option value="">Select Country</option>'); // Default placeholder
    countries.forEach(country => {
        cmbCountry.append(`<option value="${country.COUNTRYID}">${country.COUNTRYNAME}</option>`);
    });
}
