    $(document).ready(function () {
        GetPivot();
            });

    function GetPivot() {
        $.ajax({
            type: "GET",
            cache: false,
            url: "/Pivot/GetPivot",
            success: function (result) {
                if (result && result.dtPivot) {
                    FillPivot(result.dtPivot);
                } else {
                    alert("No pivot data returned.");
                }
            },
            error: function (xhr, status, err) {
                console.error("GetPivot failed:", xhr.status, err);
                alert("Failed to load pivot data. Check console for details.");
            }
        });
            }

    function FillPivot(Pivot) {

                var nrecoPivotExt = new NRecoPivotTableExtensions({
        fixedHeaders: true
                });

    var stdRendererNames = ["Table", "Table Barchart", "Heatmap", "Row Heatmap", "Col Heatmap"];
    var wrappedRenderers = $.extend({ }, $.pivotUtilities.renderers, $.pivotUtilities.c3_renderers);
    $.each(stdRendererNames, function () {
                    var rName = this;
    wrappedRenderers[rName] = nrecoPivotExt.wrapTableRenderer(wrappedRenderers[rName]);
                });

    $('#output').pivotUI(Pivot, {
        renderers: wrappedRenderers,
    rendererOptions: { },
        vals: ["AMOUNT"],
        rows: ["TRANS_TYPE"],
        cols: ["PROVIDER_TEXT"],
    aggregatorName: "Sum"
                });

    $("#save").on("click", function () {
                    var config = $("#output").data("pivotUIOptions");
    var config_copy = JSON.parse(JSON.stringify(config));
    delete config_copy["aggregators"];

    $.ajax({
        type: "POST",
    url: "/Pivot/Save",
    data: JSON.stringify({value: {"Object": JSON.stringify(config_copy) } }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        alert("Saved successfully.");
                        },
    error: function (xhr, status, err) {
        console.error("Save failed:", err);
    alert("Save failed.");
                        }
                    });
                });

    $("#restore").on("click", function () {
        $.ajax({
            type: "GET",
            cache: false,
            url: "/Pivot/Restore",
            success: function (result) {
                var obj = JSON.parse(result.dtPivot);

                var nrecoPivotExt2 = new NRecoPivotTableExtensions({ fixedHeaders: true });
                var stdRendererNames2 = ["Table", "Table Barchart", "Heatmap", "Row Heatmap", "Col Heatmap"];
                var wrappedRenderers2 = $.extend({}, $.pivotUtilities.renderers, $.pivotUtilities.c3_renderers);
                $.each(stdRendererNames2, function () {
                    wrappedRenderers2[this] = nrecoPivotExt2.wrapTableRenderer(wrappedRenderers2[this]);
                });

                obj.renderers = wrappedRenderers2;
                $("#output").pivotUI(Pivot, obj, true);
            },
            error: function (xhr, status, err) {
                console.error("Restore failed:", err);
                alert("Restore failed.");
            }
        });
                });
            }

