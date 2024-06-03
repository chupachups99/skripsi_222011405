$(document).ready(function () {
    $('#levelProv').prop('checked', true);
    $('#levelBtn').change(function () {
        let value = $(this).val();
        if (value == "jenis_akomodasi") {
            $('#option1').remove();
            $('#levelList').append('<li><button id="btnOption1" class="groupings text-black bg-white border-2 border-neutral-400 text-sm rounded-lg p-2 border-neutral-400" value="jenis_akomodasi">Jenis Akomodasi x</button></li>');
            $('#levelBtn').val("none");
            $('#btnOption1').click(function () {
                $(this).remove();
                $('#levelBtn').val("none");
                $('#levelBtn').append('<option id="option1" value="jenis_akomodasi">Jenis Akomodasi</option>')
            })
        }
        if (value == 'kelas_akomodasi') {
            $('#option2').remove();
            $('#levelList').append('<li><button id="btnOption2" class="groupings rounded-lg p-2 text-black bg-white border-2 border-neutral-400 text-sm" value="kelas_akomodasi">Kelas Akomodasi x</button></li>');
            $('#levelBtn').val("none");
            $('#btnOption2').click(function () {
                $(this).remove();
                $('#levelBtn').val("none");
                $('#levelBtn').append('<option id="option2" value="kelas_akomodasi">Kelas Akomodasi</option>')
            })
        }
    });

    $('#insertBtn').click(function () {
        var fileInput = $('#fileInput')[0];
        if (fileInput.files.length === 0) {
            alert('Please select a file.');
            return;
        }
        else {

            var formData = new FormData();
            formData.append('file', fileInput.files[0])
            $.ajax({
                url: './tabulasi/uploadData', // Replace with your server upload URL
                type: 'POST',
                data: formData,
                processData: false, // Prevent jQuery from automatically transforming the data into a query string
                contentType: false, // Prevent jQuery from overriding the default Content-Type header
                success: function (data, response) {
                    alert('File uploaded successfully!');
                    if (data.message.length > 1) {
                        $('#statusContainer').html(data.message.join("<br>"));
                    }
                    else {
                        $('#statusContainer').html(data.message);
                    }

                    // Handle success response
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('File upload failed!');
                    // Handle error response
                }
            });

        }

    })


    $('#previewBtn').click(function () {
        
        $('#tabCont').empty();
        $('#tabCont').append(`<div id="loadAnimationCrossTab" class="flex items-center justify-center">
        <button type="button" class="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white" disabled>
          <svg class="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="font-medium"> Processing... </span>
        </button>
      </div>`)
        
        let tahunList = [];
        let groupList = [];
        let periode = $("input[name='periode']:checked").val();
        // let kodeGroup={'jenis_akomodasi':['Hotel Bintang','Hotel Non Bintang'],'kelas_akomodasi':'bintang/kelas'};
        let levelWil = $('input[name="level"]:checked').val();
        $('.tahunCheckbox').each(function () {
            if ($(this).prop('checked')) {
                tahunList.push($(this).val());
            }
        })
        $('.groupings').each(function () {
            groupList.push($(this).val())
        })
        // console.log(levelWil);
        // console.log(groupList);
        // console.log(tahunList);
        $.post('./tabulasi/crosstab',
            {
                tahun: tahunList.join(','),
                level: levelWil,
                group: groupList.join(','),
                periode: periode
            }, function (data) {
                // console.log(data.matrix);
                // console.log(data.columns);
                
                $('#tabCont').append('<table id="example" class="display nowrap bg-white"></table>');
                var listHeader = [];
                var header = $('<tr></tr>');
                var kode = levelWil.split(',');
                var grouping = groupList.length + 1;
                var spanPeriode = 12 / periode;
                var judulPeriode = '';
                const namaBulan = [
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Agustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember"
                ];
                const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI'];
                if (periode < 12) {
                    grouping += 1;
                    if (periode == 2) { judulPeriode = 'DW-' }
                    if (periode == 3) { judulPeriode = 'TW-' }
                    if (periode == 4) { judulPeriode = 'CW-' }
                    if (periode == 6) { judulPeriode = 'SM-' }
                }
                let i = 0;

                while (i < kode.length) {

                    let str = "kode_" + kode[i].split('_')[1];
                    console.log(str);
                    header.append('<th rowspan="' + grouping + '">' + str + '</th>');
                    i++;
                }
                header.append('<th rowspan="' + grouping + '">' + data.columns[i].data + '</th>');
                // console.log(data.columns[i].data);
                console.log(data.data);
                listHeader[0] = header;
                var temp = groupList.slice();
                var listTitle = data.matrix;

                var thead = $('<thead></thead>');
                if (listTitle.length > 0) {
                    for (let j = 0; j < listTitle.length; j++) {
                        let tmp = [];
                        for (let k = 0; k < groupList.length; k++) {

                            if (k == 0 & listTitle[j][groupList[k]] != temp[k]) {
                                var str = "span_" + groupList[k];
                                var strname = "nama_" + groupList[k];
                                var len = 10 * listTitle[j][str];
                                listHeader[0].append('<th colspan="' + len + '">' + listTitle[j][strname] + '</th>')
                            }
                            else if (listTitle[j][groupList[k]] != temp[k]) {
                                if (j == 0) { listHeader[k] = $('<tr></tr>') }
                                var str = "span_" + groupList[k];
                                var strname = "nama_" + groupList[k];
                                var len = 10 * listTitle[j][str];
                                listHeader[k].append('<th colspan="' + len + '">' + listTitle[j][strname] + '</th>');
                            }

                            tmp.push(listTitle[j][groupList[k]]);

                        }
                        temp = tmp.slice();

                        if (j == 0) {
                            listHeader[groupList.length] = $('<tr></tr>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MKTS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MKTJ</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>TPK</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MTNUS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>TNUS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>RLMTNUS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MTA</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>TA</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>RLMTA</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>RLMTGAB</th>');

                        }
                        else {
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MKTS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MKTJ</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>TPK</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MTNUS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>TNUS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>RLMTNUS</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>MTA</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>TA</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>RLMTA</th>');
                            listHeader[groupList.length].append('<th colspan=' + spanPeriode + '>RLMTGAB</th>');

                        }


                    }

                    for (let m = 0; m < listHeader.length; m++) {
                        thead.append(listHeader[m]);
                        // console.log(listHeader[m]);
                    }

                }
                else {
                    listHeader[0].append('<th colspan=' + spanPeriode + '>MKTS</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>MKTJ</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>TPK</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>MTNUS</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>TNUS</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>RLMTNUS</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>MTA</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>TA</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>RLMTA</th>');
                    listHeader[0].append('<th colspan=' + spanPeriode + '>RLMTGAB</th>');
                    thead.append(listHeader[0]);
                }
                if (periode < 12) {
                    let judulArr=romawi;
                    var periodeTr = $('<tr></tr>');
                    if(periode==1){judulArr=namaBulan}
                    for(let y=0;y<10;y++){
                        for (let x = 0; x < spanPeriode; x++) {
                            periodeTr.append('<th>'+judulPeriode+judulArr[x]+'</th>')
                        }
                    }
                    thead.append(periodeTr);
                }
                

                $('#example').append(thead);
                $('#loadAnimationCrossTab').remove();

                if ($('#example')) {
                    $('#example').DataTable({
                        dom: "Bt",
                        fixedColumns: {
                            start: 2

                        },
                        data: data["data"],

                        scrollX: '63dvw',
                        scrollY: '10rem',
                        // scrollCollapse: 'true',
                        columns: data["columns"],
                        paging: false,
                        buttons: [
                            {

                                text: 'Export',
                                action: function () {
                                    $("#example").table2excel({
                                        name: "Backup file for HTML content",

                                        //  include extension also 
                                        filename: "Dashboard_CrossTable.xls",

                                        // 'True' is set if background and font colors preserved 
                                        preserveColors: false
                                    });
                                }
                            }
                        ],
                        // initComplete: function () {
                        //     $('table.dataTable').hide();
                        // }
                    });

                }
            })
    })


});
