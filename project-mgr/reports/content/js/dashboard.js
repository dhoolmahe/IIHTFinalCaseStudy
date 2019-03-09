/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.8, "KoPercent": 0.2};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.998, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get - All Users Registration Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get - Task By Project"], "isController": false}, {"data": [0.98, 500, 1500, "Get - All Task Request "], "isController": false}, {"data": [1.0, 500, 1500, "Get - User By Task"], "isController": false}, {"data": [1.0, 500, 1500, "Get - Task Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get - All Projects Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get - User By Project"], "isController": false}, {"data": [1.0, 500, 1500, "Get - Per Project"], "isController": false}, {"data": [1.0, 500, 1500, "Get - Per User Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get - All Projects with Task"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 2, 0.2, 9.876999999999997, 2, 1382, 14.0, 22.0, 83.85000000000014, 17.012010479398455, 13.15108153856623, 2.2029224507502296], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Get - All Users Registration Request", 100, 0, 0.0, 12.85, 6, 172, 21.900000000000006, 33.74999999999994, 170.8199999999994, 1.744104925352309, 3.977036133493791, 0.20949697833821684], "isController": false}, {"data": ["Get - Task By Project", 100, 0, 0.0, 5.560000000000001, 2, 60, 11.0, 15.899999999999977, 59.6099999999998, 1.7505164023386899, 0.7966217221580366, 0.22907148233728952], "isController": false}, {"data": ["Get - All Task Request ", 100, 2, 2.0, 31.290000000000006, 7, 1382, 26.900000000000006, 39.849999999999966, 1371.3999999999946, 1.7023015116437423, 2.412147942768623, 0.27928384175405147], "isController": false}, {"data": ["Get - User By Task", 100, 0, 0.0, 5.880000000000001, 2, 42, 10.800000000000011, 16.0, 41.909999999999954, 1.7501181329739757, 1.1690242216349602, 0.22389206583944415], "isController": false}, {"data": ["Get - Task Id", 100, 0, 0.0, 6.839999999999998, 2, 84, 11.900000000000006, 19.849999999999966, 83.57999999999979, 1.7433143893169694, 0.7899393326592518, 0.2128069322896691], "isController": false}, {"data": ["Get - All Projects Request", 100, 0, 0.0, 5.3500000000000005, 2, 57, 7.0, 10.899999999999977, 56.639999999999816, 1.751068151572459, 1.277390536352175, 0.21546346396301747], "isController": false}, {"data": ["Get - User By Project", 100, 0, 0.0, 8.069999999999999, 2, 100, 13.0, 18.899999999999977, 99.83999999999992, 1.7476406850751485, 1.1673693638587908, 0.22869516777350576], "isController": false}, {"data": ["Get - Per Project", 100, 0, 0.0, 6.309999999999999, 2, 86, 9.800000000000011, 15.899999999999977, 85.5999999999998, 1.7554330653372188, 0.49542983972896115, 0.21942913316715235], "isController": false}, {"data": ["Get - Per User Request", 100, 0, 0.0, 5.63, 2, 50, 10.0, 14.949999999999989, 49.81999999999991, 1.74727425216662, 0.12456154336734694, 0.2132903139851831], "isController": false}, {"data": ["Get - All Projects with Task", 100, 0, 0.0, 10.99, 5, 115, 17.700000000000017, 23.94999999999999, 114.77999999999989, 1.7522648022569172, 1.237194777374757, 0.2258778846659307], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 322 milliseconds, but should not have lasted longer than 200 milliseconds.", 1, 50.0, 0.1], "isController": false}, {"data": ["The operation lasted too long: It took 1,382 milliseconds, but should not have lasted longer than 200 milliseconds.", 1, 50.0, 0.1], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 2, "The operation lasted too long: It took 322 milliseconds, but should not have lasted longer than 200 milliseconds.", 1, "The operation lasted too long: It took 1,382 milliseconds, but should not have lasted longer than 200 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get - All Task Request ", 100, 2, "The operation lasted too long: It took 322 milliseconds, but should not have lasted longer than 200 milliseconds.", 1, "The operation lasted too long: It took 1,382 milliseconds, but should not have lasted longer than 200 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
