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

    $('#insertBtn').click(function() {
        var fileInput = $('#fileInput')[0];
        if (fileInput.files.length === 0) {
          alert('Please select a file.');
          return;
        }
        else{
            
        var formData = new FormData();
        formData.append('file', fileInput.files[0])
        $.ajax({
            url: './tabulasi/uploadData', // Replace with your server upload URL
            type: 'POST',
            data: formData,
            processData: false, // Prevent jQuery from automatically transforming the data into a query string
            contentType: false, // Prevent jQuery from overriding the default Content-Type header
            success: function(data,response) {
              alert('File uploaded successfully!');
              if(data.message.length>1){
                $('#statusContainer').html(data.message.join("<br>"));
              }
              else{
                $('#statusContainer').html(data.message);
              }
              
              // Handle success response
            },
            error: function(jqXHR, textStatus, errorThrown) {
              alert('File upload failed!');
              // Handle error response
            }
          });

        }

    })


    $('#previewBtn').click(function () {
        $('#tabCont').empty();
        $('#tabCont').append('<table id="example" class="display nowrap bg-white"></table>');
        let tahunList = [];
        let groupList = [];
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
            }, function (data) {
                // console.log(data.matrix);
                // console.log(data.columns);
                var listHeader = [];
                var header = $('<tr></tr>');
                var kode = levelWil.split(',');
                var grouping = groupList.length + 1;
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
                        listHeader[groupList.length].append('<th>MKTS</th>');
                        listHeader[groupList.length].append('<th>MKTJ</th>');
                        listHeader[groupList.length].append('<th>TPK</th>');
                        listHeader[groupList.length].append('<th>MTNUS</th>');
                        listHeader[groupList.length].append('<th>TNUS</th>');
                        listHeader[groupList.length].append('<th>RLMTNUS</th>');
                        listHeader[groupList.length].append('<th>MTA</th>');
                        listHeader[groupList.length].append('<th>TA</th>');
                        listHeader[groupList.length].append('<th>RLMTA</th>');
                        listHeader[groupList.length].append('<th>RLMTGAB</th>');

                    }
                    else {
                        listHeader[groupList.length].append('<th>MKTS</th>');
                        listHeader[groupList.length].append('<th>MKTJ</th>');
                        listHeader[groupList.length].append('<th>TPK</th>');
                        listHeader[groupList.length].append('<th>MTNUS</th>');
                        listHeader[groupList.length].append('<th>TNUS</th>');
                        listHeader[groupList.length].append('<th>RLMTNUS</th>');
                        listHeader[groupList.length].append('<th>MTA</th>');
                        listHeader[groupList.length].append('<th>TA</th>');
                        listHeader[groupList.length].append('<th>RLMTA</th>');
                        listHeader[groupList.length].append('<th>RLMTGAB</th>');

                    }


                }


                var thead = $('<thead></thead>');
                for (let m = 0; m < listHeader.length; m++) {
                    thead.append(listHeader[m]);
                    console.log(listHeader[m]);
                }
                $('#example').append(thead);

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
