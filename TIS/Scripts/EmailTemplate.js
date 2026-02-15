$(document).ready(function () {
    $(document).ajaxStart($.blockUI({
        css: {
            border: 'none',
            padding: '10px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .3,
            color: '#fff'
        }
    })).ajaxStop($.unblockUI);

    $("#jqxMenu").jqxMenu({ width: '100%', height: '30px' });
    LoadTemplates();
});

$(document).on('click', '#btnSaveEmailTemplate', function (e) {
    e.preventDefault();
    if (typeof TemplateSave === 'function') {
        TemplateSave();
    }
});