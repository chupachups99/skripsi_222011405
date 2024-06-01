// import { text } from 'express';
// import INAGeoJSON from './Indonesia38.json' assert { type: 'json' };
// import CityINAJSON from './all_kabkota_ind.json' assert { type: 'json' };
// import kdProvJSON from './kodeProv.json' assert { type: 'json' };
// import CountryID from './centroids.json' assert {type:'json'};
// import CountryJSON from './worldGeoJSON.json' assert {type:'json'};




function exportAllChart1(jsonObject) {
  var myFile = jsonObject.var[0].label+" (All).xlsx";
  var valueColumn = jsonObject.var[0].unit;
  let modifiedJson = [];
  for (let n = 0; n<jsonObject.vervar.length;n++){
    for (let i = 0; i < (jsonObject.tahun.length); i++) {
      let keyData = jsonObject.vervar[n].val + jsonObject.var[0].val.toString() + jsonObject.turvar[0].val.toString() + jsonObject.tahun[i].val.toString() + jsonObject.turtahun[12].val.toString();
      let temp = {};
      temp.provinsi = jsonObject.vervar[n].label;
      temp.tahun = jsonObject.tahun[i].label;
      temp[valueColumn] = jsonObject.datacontent[keyData];
      //console.log(temp)
      modifiedJson.push(temp);
    }
  }
  // console.log(modifiedJson);
  var myWorkSheet = XLSX.utils.json_to_sheet(modifiedJson);
  var myWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "myWorkSheet");
  XLSX.writeFile(myWorkBook, myFile);
}
 
function firstSection(url, id, kode) {
  var barYearWisnus = echarts.init(document.getElementById("barYearWisnus")); //function firstSection
  var lineYearWisnus = echarts.init(document.getElementById("lineYearWisnus")); //function firstSection
  barYearWisnus.showLoading();
  lineYearWisnus.showLoading();
  let labelYear = [];
  let wilayah;
  if (kode == '9999') {
      wilayah = kdProvJSON[0][kode];
  }
  
  else if(kode=="1"){
    kode="1100;1200;1300;1400;1500;1600;1700;1800;1900;2100";
    wilayah = "Pulau Sumatera*"
  }
  else if(kode=="2"){
    kode="3100;3200;3300;3400;3500;3600";
    wilayah = "Pulau Jawa*"

  }
  
  else if(kode=="3"){
    kode="5100;5200;5300";
    wilayah = "Pulau Bali Nusra*"

  }
  else if(kode=="4"){
    kode="6100;6200;6300;6400;6500";
    wilayah = "Pulau Kalimantan*"
  }
  else if(kode=="5"){
    kode="7100;7200;7300;7400;7500;7600";
    wilayah = "Pulau Sulawesi*"

  }
  else if(kode=="6"){
    kode="8100;8200";
    wilayah = "Pulau Maluku*"
  }
  else if(kode=="7"){
    kode="9100;9200;9300;9400;9700";
    wilayah = "Pulau Papua*"
  }
  else {
    wilayah = 'Provinsi ' + kdProvJSON[0][kode]
  }
  let modifiedURL = url+"vervar/"+kode+"/"+APIkey;
  $.get(modifiedURL, function (data, status) {

    let Wisnus = JSON.parse(JSON.stringify(data));
    let labelMonths = [];
    let contentYear = [];
    let contentMonths = [];
    let seriesLine = [];
    kode = kode.split(";");
    
    for (let i = 0; i < (Wisnus.tahun.length); i++) {
      labelYear.push(Wisnus.tahun[i].label.toString());
      let temp = [];
      let temp2 = [];
      let sum =0;
      let keyData;
       
        for (let j = 0; j < 12; j++) {
          let sum2 =0; 
          labelMonths.push(months[j]+'-'+Wisnus.tahun[i].label.toString())
          for(let p = 0;p<kode.length;p++){
            if(j==0){
              keyData = kode[p] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[12].val.toString();
              if(Wisnus.datacontent[keyData]){
                sum= sum + parseInt(Wisnus.datacontent[keyData]);
              }
            }
            
          //labelMonths.push(Wisnus.turtahun[j].label.toString());
          let keyData2 = kode[p] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[j].val.toString();
          if(Wisnus.datacontent[keyData2]){
            sum2= sum2+parseInt(Wisnus.datacontent[keyData2]);
          }
        }
        if(sum2>0){contentMonths.push(sum2)}
      }
    
      contentYear.push(sum);
      
    }
    let satuan2 = ["",1];
    var textSum = contentYear.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    },0);
    
    if((textSum/1000000000<1000) & (textSum/1000000000>0.99) ){
      satuan2 = [" Milyar",1000000000];
    }
    else if(textSum/100000000<1000 & (textSum/100000000>0.99)){
      satuan2 = ["Ratus Juta",100000000];
    }
    else if(textSum/1000000<1000 & (textSum/1000000>0.99)){
      satuan2 = ["Juta",1000000];
    }
    $('#textWilayah').text("Total Perjalanan Wisatawan Nusantara "+wilayah+" :");
    $('#textIndicator').text((textSum/satuan2[1]).toFixed(2)+" "+satuan2[0]);
    // $('#textIndicator').append("3.34 Miliar");
    let min = Math.min(...contentMonths);
    // console.log(min);
    let satuan = ["",1];
    
    if((min/1000000<1000) & (min/1000000>0.99) ){
      satuan = ["(Juta)",1000000];
    }
    else if(min/100000<1000 & (min/100000>0.99)){
      satuan = ["(Ratus Ribu)",100000];
    }
    else if(min/1000<1000 & (min/1000>0.99)){
      satuan = ["(Ribu)",1000];
    }
    
    // console.log(satuan);

    var optionBar = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Nusantara ' + wilayah + '\nBerdasarkan Tahun (juta)',
        left: '3%',
        top:'0%',
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer:{
          type:'none'
        }
  
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '7%',
        containLabel:true
      },
      color: '#0284C7',
      xAxis: [
        {
          type: 'category',
          data: labelYear,
          axisTick: {
            show:false,
            alignWithLabel: true
          },
          axisLabel:{
            fontFamily:'sans-serif',
            fontSize:'15'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          show:true,
          splitLine:{
            show:false
          },
          axisLine:{
            show:true
          },
          axisLabel:{
            show:true,
            formatter:function(params){
              return (params/1000000).toFixed(0);
            }
          }
          
        }
      ],
      //color:'rgb(55 48 163)',
      series: [
        {
          type: 'bar',
          barWidth: '70%',
          label: {
            show: true,
            formatter:function(params){
              return (params.value/1000000).toFixed(2);
            },
            position: 'top',
            fontFamily: 'sans-serif',
            fontWeight:'bold',
            fontSize: '18'
        },
          data: contentYear,
          itemStyle: {
            emphasis: {
              barBorderRadius: [3, 3]
            },
            normal: {
              barBorderRadius: [3, 3, 0, 0]
            }
          },
        }
      ]
    };

    var optionLine = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Nusantara ' + wilayah + '\nBerdasarkan Bulan dan Tahun '+satuan[0],
        left: '3%',
        top:'0%',
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%%',
        right: '3%',
        bottom: '9%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          restore:{}
        }
      },
      color: '#0284C7',
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labelMonths,
      },
      dataZoom: [{bottom:'1%'},{type:"inside"}],
      yAxis: {
        show:true,
        type: 'value',
        axisLabel:{
          formatter:function (value) {
            return (value/satuan[1]).toFixed(0);
        }
        },
        splitLine:{show:false},
        axisLine:{
          show:true
        }
      },
      series: {
        name: "Wisnus",
        type: "line",
        data:contentMonths,
        symbolSize:1,
        label:{
          show:true,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          distance:10,
          formatter:function(params){
            return (params.data/satuan[1]).toFixed(1) ;

          }
        },
        labelLayout:{hideOverlap:true}
      }
    };


    optionLine && lineYearWisnus.setOption(optionLine);
    optionBar && barYearWisnus.setOption(optionBar);

    lineYearWisnus.hideLoading();
    barYearWisnus.hideLoading();
    // barYearWisnus.on('mouseover', function (params) {
    //   var tahun = params.name;
    //   lineYearWisnus.dispatchAction({
    //     type: "legendUnSelect",
    //     name: tahun
    //   });
    //   lineYearWisnus.dispatchAction({
    //     type: "legendInverseSelect"
    //   });
    // });
  
    // barYearWisnus.on('mouseout', function (params) {
    //   var tahun = params.name;
    //   lineYearWisnus.dispatchAction({
    //     type: "legendAllSelect"
    //   });
    // });
  });
  

};


function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// function make_charts(url, id, year) {
//   $.get(url, function (data, status) {
//     var myChart2 = echarts.init(document.getElementById(id));
//     let resp = JSON.parse(JSON.stringify(data));
//     let label = [];
//     let content = [];

//     for (let i = 1; i < resp.vervar.length; i++) {
//       label.push(capitalizeWords(resp.vervar[i].label));
//       let key_data = resp.vervar[i].val.toString() + resp.var[0].val.toString() + resp.turvar[0].val.toString() + year.toString() + resp.turtahun[0].val.toString();
//       content.push(resp.datacontent[key_data]);
//       //combine.push({name:capitalizeWords(resp.vervar[i].label),value:resp.datacontent[key_data]})
//     }
//     var option;
//     option = {
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'shadow'
//         }
//       },
//       grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//       },
//       xAxis: [
//         {
//           type: 'category',
//           data: label,
//           axisTick: {
//             alignWithLabel: true
//           },
//           axisLabel: {
//             rotate: 30
//           }
//         }
//       ],
//       yAxis: [
//         {
//           type: 'value'
//         }
//       ], toolbox: {
//         show: true,
//         orient: 'horizontal',
//         left: 'left',
//         top: 'top',
//         feature: {
//           dataView: { readOnly: false },
//           restore: {},
//           saveAsImage: {}
//         }
//       },



//       series: [
//         {
//           type: 'bar',
//           barWidth: '60%',
//           data: content
//         }
//       ]
//     };

//     option && myChart2.setOption(option);


//   });

// }


// function getTemp(zoom, center) {
//   var storyPage = echarts.init(document.getElementById('chart'));
//   $.get('http://localhost:4000/dataTujuan', function (data, status) {
//     echarts.registerMap('Ind', INAGeoJSON);
//     var option = {
//       tooltip: {
//         trigger: 'item',
//         formatter: function (params) {
//           var value = params.seriesName + "\n" + params.name + ' : ' + (params.value / 1000000).toFixed(2) + ' juta';
//           return value
//         }
//       },
//       toolbox: {
//         show: true,
//         orient: 'horizontal',
//         left: 'left',
//         top: 'top',
//         feature: {
//           dataView: { readOnly: false },
          
//           restore: {},
//           saveAsImage: { title: 'Save' }
//         }

//       }, visualMap: {
//         left: 'right',
//         orient: 'vertical',
//         min: 0,
//         max: 900000000,
//         inRange: {
//           color: [
//             '#EEF5FF',
//             '#B4D4FF',
//             '#86B6F6',
//             '#176B87'
//           ]
//         },
//         text: ['High', 'Low'],
//         calculable: false,
//         orient: 'horizontal',
//       },
//       center: center,
//       grid: {
//         top: 10,
//         left: '2%',
//         right: '2%',
//         bottom: '3%',
//         containLabel: true
//       },
//       animation: true,
//       series: [{
//         name: 'Provinsi Tujuan',
//         type: 'map',
//         map: "Ind",
//         zoom: zoom,
//         roam: false,
//         data: data,
//       }]
//     };
//     storyPage.setOption(option);
//   });
// }

// function getTemp_(id) {
//   let tempData_;
//   fetch('http://localhost:4000/dataAsal')
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       tempData_ = data;
//       //console.log(tempData);
//       map_(id, tempData_, [
//         '#DBE7C9',
//         '#789461',
//         '#50623A',
//         '#294B29',
//       ]);
//     });
// }

// function getPie(id) {
//   let tempData_;
//   fetch('http://localhost:4000/dataTujuan')
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       tempData_ = data;
//       //console.log(tempData);
//       //   tempData_.sort(function(a, b){
//       //     return a.value - b.value;
//       // });
//       make_pie(id, tempData_);
//     });
// }
// function getDonut(id) {
//   let tempData_;
//   fetch('http://localhost:4000/dataTujuan')
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       tempData_ = data;
//       //   //console.log(tempData);
//       //   tempData_.sort(function(a, b){
//       //     return a.value - b.value;
//       // });
//       make_donut(id, tempData_);
//     });
// }
// function map_(id, tempData, pallete) {
//   echarts.registerMap('Ind', INAGeoJSON);
//   var myChart = echarts.init(document.getElementById(id));
//   var option = {
//     tooltip: {
//       trigger: 'item',
//       formatter: function (params) {
//         var value = params.seriesName + "\n" + params.name + ' : ' + (params.value / 1000000).toFixed(2) + ' juta';
//         return value
//       }
//     },
//     toolbox: {
//       show: true,
//       orient: 'horizontal',
//       left: 'left',
//       top: 'top',
//       feature: {
//         dataView: { readOnly: false },
//         restore: {},
//         saveAsImage: { title: 'Save' }
//       }

//     }, visualMap: {
//       left: 'left',
//       min: 0,
//       max: 900000000,
//       inRange: {
//         color: pallete
//       },
//       text: ['High', 'Low'],
//       calculable: false,
//       orient: 'horizontal',
//     },

//     grid: {
//       top: 10,
//       left: '2%',
//       right: '2%',
//       bottom: '3%',
//       containLabel: true
//     },
//     animation: true,
//     series: [{
//       name: 'Provinsi Tujuan',
//       type: 'map',
//       map: "Ind",
//       roam: false,
//       data: tempData,
//     }]
//   };
//   myChart.setOption(option);

// }

// function make_pie(id, tempData) {
//   var chartDom = document.getElementById(id);
//   var myChart = echarts.init(chartDom);
//   var option;

//   option = {
//     toolbox: {
//       show: true,
//       feature: {
//         mark: { show: true },
//         dataView: { show: true, readOnly: false },
//         restore: { show: true },
//         saveAsImage: { show: true }
//       }
//     },
//     series: [
//       {
//         name: 'Nightingale Chart',
//         type: 'pie',
//         radius: [50, 250],
//         center: ['50%', '50%'],
//         roseType: 'area',
//         itemStyle: {
//           borderRadius: 8
//         },
//         data: tempData
//       }
//     ]
//   };

//   option && myChart.setOption(option);

// }

// function make_donut(id, tempData) {
//   var chartDom = document.getElementById(id);
//   var myChart = echarts.init(chartDom);
//   var option;

//   option = {
//     tooltip: {
//       trigger: 'item'
//     },
//     // visualMap: {
//     //   show: false,
//     //   min: 0,
//     //   max: 1000000000,
//     //   inRange: {
//     //     colorLightness: [0, 1]
//     //   }
//     // },
//     series: [
//       {
//         name: 'Access From',
//         type: 'pie',
//         radius: ['40%', '70%'],
//         avoidLabelOverlap: true,
//         // itemStyle: {
//         //   color: '#c23532',
//         //   shadowBlur: 200,
//         //   shadowColor: 'rgba(0, 0, 0, 0.5)'
//         // },
//         label: {
//           show: true
//         },
//         emphasis: {
//           label: {
//             show: true,
//             fontSize: 40,
//             fontWeight: 'bold'
//           }
//         },
//         labelLine: {
//           show: true
//         },

//         data: tempData
//       }
//     ]
//   };

//   option && myChart.setOption(option);

// };

// function setRaceBarAsal(url) {
//   $.get(url, function (content, status) {
//     var raceBarAsal = echarts.init(document.getElementById("raceBarAsal2"));
//     const years = [];
//     var dataRace = [];
//     const kode  = Object.keys(kdProvJSON[0]);
//     var Wisnus = JSON.parse(JSON.stringify(content));
//     for (let m = 0; m < kode.length-1; m++) {
//       for (let i = 0; i < (Wisnus.tahun.length); i++) {
//         //labelYear.push(Wisnus.tahun[i].label.toString());
//         //let keyData = kdProvJSON[] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[12].val.toString();
//         //contentYear.push(Wisnus.datacontent[keyData]);
//         //let temp = [];
//         //let temp2 = [];
//         for (let j = 0; j < 12; j++) {
//           let a = Wisnus.turtahun[j].label.toString() + Wisnus.tahun[i].label.toString();
//           years.push(a);
//           let keyData2 =kode[m] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[j].val.toString();
//           //console.log(Wisnus.datacontent[keyData2]);
//           let temp= [kdProvJSON[0][kode[m]],a,Wisnus.datacontent[keyData2]];
//           dataRace.push(temp);

//         };
        
//       }
//     }
//     //console.log(dataRace);
//     // const rows = content.toString().split('\n');
    
//     // for (let i = 1; i < rows.length; i++) {
//     //   dataRace.push(rows[i].split(';'))
//     // }

//     const updateFrequency = 2000;
//     // for (let i = 2019; i < 2023; i++) {
//     //   for (let j = 0; j < 12; j++) {
//     //     let temp = months[j] + " " + i.toString();
//     //     years.push(temp);

//     //   }
//     // }

//     var optionRace = {
//       title: {
//         text: 'Peringkat Provinsi Perjalanan Wisatawan Nusantara Bulanan',
//         left: 'center',
//         textStyle: {
//           fontSize: 15
//         }
//       },
//       grid: {
//         // top: 10,
//         // bottom: 30,
//         // left: 150,
//         // right: 80
//       },
//       xAxis: {
//         max: 'dataMax',
//         axisLabel: {
//           formatter: function (n) {
//             return Math.round(n) + '';
//           }
//         }
//       },
//       dataset: {
//         source: dataRace.filter(function (d) {
//           return d[1] === years[0];
//         }).sort(function (a, b) { return parseInt(b[2]) - parseInt(a[2]) })
//       },
//       yAxis: {
//         type: 'category',
//         inverse: true,
//         max: 30,
//         axisLabel: {
//           show: true,
//           fontSize: 14,
//           formatter: function (value) {
//             return value;
//           },
//         },
//         axisLabel: {
//           fontSize: 12,
//           fontFamily: 'serif',
//           fontWeight:'bold'
//         },
//         animationDuration: 300,
//         animationDurationUpdate: 300
//       },
//       series: [
//         {
//           realtimeSort: true,
//           seriesLayoutBy: 'column',
//           type: 'bar',
//           encode: {
//             x: 2,
//             y: 0
//           },
//           label: {
//             show: true,
//             precision: 1,
//             position: 'right',
//             valueAnimation: true,
//             fontFamily: 'serif'
//           }
//         }
//       ],
//       // Disable init animation.
//       animationDuration: 0,
//       animationDurationUpdate: updateFrequency,
//       animationEasing: 'linear',
//       animationEasingUpdate: 'linear',
//       graphic: {
//         elements: [
//           {
//             type: 'text',
//             right: 0,
//             bottom: 60,
//             style: {
//               text: years[0],
//               font: 'bolder 80px monospace',
//               fill: 'rgba(100, 100, 100, 0.25)'
//             },
//             z: 100
//           }
//         ]
//       }
//     };
//     // console.log(option);
//     raceBarAsal.setOption(optionRace);
//     for (let i = 0; i < years.length - 1; ++i) {
//       (function (i) {
//         setTimeout(function () {
//           updateYear(years[i + 1]);
//         }, (i) * updateFrequency);
//       })(i);
//     }
//     function updateYear(year) {
//       let source = dataRace.filter(function (d) {
//         return d[1] === year;
//       }).sort(function (a, b) { return parseInt(b[2]) - parseInt(a[2]) });
//       optionRace.series[0].data = source;
//       optionRace.graphic.elements[0].style.text = year;
//       raceBarAsal.setOption(optionRace);
//     }
//   });

// }



// function setRaceBar(url) {
//   $.get(url, function (content, status) {
//     var raceBarTujuan = echarts.init(document.getElementById("raceBarTujuan2"));
//     const years = [];
//     var dataRace = [];
//     const kode  = Object.keys(kdProvJSON[0]);
//     var Wisnus = JSON.parse(JSON.stringify(content));
//     for (let m = 0; m < kode.length-1; m++) {
//       for (let i = 0; i < (Wisnus.tahun.length); i++) {
//         //labelYear.push(Wisnus.tahun[i].label.toString());
//         //let keyData = kdProvJSON[] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[12].val.toString();
//         //contentYear.push(Wisnus.datacontent[keyData]);
//         //let temp = [];
//         //let temp2 = [];
//         for (let j = 0; j < 12; j++) {
//           let a = Wisnus.turtahun[j].label.toString() + Wisnus.tahun[i].label.toString();
//           years.push(a);
//           let keyData2 =kode[m] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[j].val.toString();
//           //console.log(Wisnus.datacontent[keyData2]);
//           let temp= [kdProvJSON[0][kode[m]],a,Wisnus.datacontent[keyData2]];
//           dataRace.push(temp);

//         };
        
//       }
//     }
//     //console.log(dataRace);
//     // const rows = content.toString().split('\n');
    
//     // for (let i = 1; i < rows.length; i++) {
//     //   dataRace.push(rows[i].split(';'))
//     // }

//     const updateFrequency = 2000;
//     // for (let i = 2019; i < 2023; i++) {
//     //   for (let j = 0; j < 12; j++) {
//     //     let temp = months[j] + " " + i.toString();
//     //     years.push(temp);

//     //   }
//     // }

//     var optionRace = {
//       title: {
//         text: 'Peringkat Provinsi Perjalanan Wisatawan Nusantara Bulanan',
//         left: 'center',
//         textStyle: {
//           fontSize: 15
//         },
//         top:0,
//       },
//       grid: {
//         // top: 10,
//         // bottom: 30,
//         // left: 150,
//         // right: 80
//       },
//       xAxis: {
//         max: 'dataMax',
//         axisLabel: {
//           formatter: function (n) {
//             return Math.round(n) + '';
//           }
//         }
//       },
//       dataset: {
//         source: dataRace.filter(function (d) {
//           return d[1] === years[0];
//         }).sort(function (a, b) { return parseInt(b[2]) - parseInt(a[2]) })
//       },
//       yAxis: {
//         type: 'category',
//         inverse: true,
//         max: 30,
//         axisLabel: {
//           show: true,
//           fontSize: 14,
//           formatter: function (value) {
//             return value;
//           },
//         },
//         axisLabel: {
//           fontSize: 12,
//           fontFamily: 'serif',
//           fontWeight:'bold'
//         },
//         animationDuration: 300,
//         animationDurationUpdate: 300
//       },
//       series: [
//         {
//           realtimeSort: true,
//           seriesLayoutBy: 'column',
//           type: 'bar',
//           encode: {
//             x: 2,
//             y: 0
//           },
//           label: {
//             show: true,
//             precision: 1,
//             position: 'right',
//             valueAnimation: true,
//             fontFamily: 'serif'
//           }
//         }
//       ],
//       // Disable init animation.
//       animationDuration: 0,
//       animationDurationUpdate: updateFrequency,
//       animationEasing: 'linear',
//       animationEasingUpdate: 'linear',
//       graphic: {
//         elements: [
//           {
//             type: 'text',
//             right: 0,
//             bottom: 60,
//             style: {
//               text: years[0],
//               font: 'bolder 80px monospace',
//               fill: 'rgba(100, 100, 100, 0.25)'
//             },
//             z: 100
//           }
//         ]
//       }
//     };
//     // console.log(option);
//     raceBarTujuan.setOption(optionRace);
//     for (let i = 0; i < years.length - 1; ++i) {
//       (function (i) {
//         setTimeout(function () {
//           updateYear(years[i + 1]);
//         }, (i) * updateFrequency);
//       })(i);
//     }
//     function updateYear(year) {
//       let source = dataRace.filter(function (d) {
//         return d[1] === year;
//       }).sort(function (a, b) { return parseInt(b[2]) - parseInt(a[2]) });
//       optionRace.series[0].data = source;
//       optionRace.graphic.elements[0].style.text = year;
//       raceBarTujuan.setOption(optionRace);
//     }
//   });

// }



// function rearrangeArray(arr) {
//   let n = arr.length;
//   // Sorting the array elements
//   let sortArr = arr.sort((a, b) => {
//     if (a.value > b.value) {
//       return -1;
//     }
//   });

//   // To store modified array
//   let tempArr;
//   let tempArr1 = [];
//   let tempArr2 = [];
//   let n1 = tempArr1.length;
//   let n2 = tempArr2.length;
//   let temp1 = 0;
//   let temp2 = 0;
//   let temp;
//   let delta1 = 0;
//   let delta2 = 0;

//   for (let i = 0; i < n; i++) {
//     let turn = i % 2 + 1;
//     delta1 = temp1 - temp2;
//     delta2 = temp2 - temp1
//     if (turn == 1) {
//       if (delta1 < 0) {
//         temp = sortArr.shift();
//         temp1 = temp1 + temp.value;
//         tempArr1.push(temp);
//       }
//       else {
//         temp = sortArr.pop();
//         temp1 = temp1 + temp.value;
//         tempArr1.push(temp);
//       }

//     }
//     else {
//       if (delta2 < 0) {
//         temp = sortArr.shift();
//         temp2 = temp2 + temp.value;
//         tempArr2.push(temp);
//       }
//       else {
//         temp = sortArr.pop();
//         temp2 = temp2 + temp.value;
//         tempArr2.push(temp);
//       }
//     }
//   }
//   tempArr = tempArr1.concat(tempArr2);
//   // Adding numbers from sorted array  
//   // to new array accordingly
//   //let ArrIndex = 0;
//   //let splitVal = parseInt(n/2); 

//   // Traverse from begin and end simultaneously 

//   return tempArr;
// }

function sectionTwo(url) {
  $.get(url, function (data, status) {
    let Wisnus = JSON.parse(JSON.stringify(data));
    let kdNew = ["9200", "9500", "9600", "9700"];
    let sumAll=0;
    let contentWilayah=[];
    let contentBar = [];
    let labelMonths = [];
    let beginVal = $("#sAwalTujuan").val();
    let endVal = $("#sAkhirTujuan").val();
    let kdWil = Object.keys(kdProvJSON[0]);
    // console.log(beginVal);
    // console.log(endVal);
    let a = -1;
    // for (let n = 0; n < Wisnus.tahun.length; n++) {
    //   var optionHTML = document.createElement("option");
    //   optionHTML.value = Wisnus.tahun[n].val.toString();
    //   optionHTML.text = Wisnus.tahun[n].label.toString();
    //   selectTahun.add(optionHTML);
    // }
    let boolAdd = $("#sAwalTujuan").children('option').length<2;
    for (let i = 0; i < (kdWil.length - 1); i++) {
      if (!kdNew.includes(kdWil[i])) {
        //let cumVal = 0;
        for (let k = 0; k < Wisnus.tahun.length; k++) {
          for (let m = 0;m<Wisnus.turtahun.length-1;m++){
            
            let keyData = kdWil[i] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[k].val.toString() + Wisnus.turtahun[m].val.toString();
            if(Wisnus.datacontent[keyData]){
              if(i==0){
                labelMonths.push(Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label);
            a++;
            if(boolAdd){
              
            var newOption = $("<option></option>").attr("value", a).text(Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label);
            var newOption2 =  $("<option></option>").attr("value", a).text(Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label);
            $("#sAwalTujuan").append(newOption);
            $("#sAkhirTujuan").append(newOption2);
            }
              }
              contentWilayah.push(
                {
                  name: kdProvJSON[0][kdWil[i]].toUpperCase(),
                  value: Wisnus.datacontent[keyData],
                  waktu: Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label
                })
            }
            
          }
          
        }
        
      }
    }
    let timeline;
    let text;
    if(endVal=="Pilih Rentang Waktu Akhir" & !beginVal){
     timeline = labelMonths.slice();
    text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan (Kumulatif)'+'\n('+timeline[0]+
    ' — '+timeline[timeline.length-1]+")";
    }else if(endVal=="Pilih Rentang Waktu Akhir"){timeline=labelMonths[beginVal];
      text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan (Kumulatif)'+'\n('+timeline+")";

      // console.log(beginVal);
    }
    else{
     timeline = labelMonths.slice(beginVal,parseInt(endVal)+1);
     text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan (Kumulatif)'+'\n('+timeline[0]+'-'+timeline[timeline.length-1]+")";
    
    //  console.log(beginVal);
    }
    // console.log(timeline);
    
    
    contentWilayah = contentWilayah.filter(a=> timeline.includes(a.waktu));
    let groupObj = contentWilayah.reduce((r,{name,value}) => 
                  (r[name] = (r[name]||0) + value, r), {});
    sumAll = Object.values(groupObj).reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    },0);
    let group = Object.keys(groupObj).map(key => ({name:key, value: groupObj[key]}));
    // console.log(group);
    


    let area=0;
    let idx;
    let sorted = group.sort(function(a, b) {
      return b.value - a.value;
  })
    for(let i = 0; i<sorted.length;i++){
      //  console.log(area);
        if(area<50){
          area=area+sorted[i].value/sumAll*100
          // console.log(area);
          if(area>50){
            idx=i;
          }
        }
      contentBar.push({
        name: sorted[i].name,
        value:sorted[i].value/sumAll*100,
        number: sorted[i].value
      })
    }


    echarts.registerMap('Ind', INAGeoJSON);
    var cPlethTujuan = echarts.init(document.getElementById("cPlethTujuan"));
    var donutTujuan = echarts.init(document.getElementById("donutTujuan"));

    var optionCPleth = {
      title: {
        text: text,
        left: '2%',
        top:'0%',
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }

      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          var value = params.seriesName + "<br>" + params.name + ' : <span style="font-weight:bold">' + (params.value / 1000000).toFixed(2) + '</span> juta';
          return value
        },
        textStyle:{
          fontFamily:"serif",
          fontSize:15
        }
      },
      toolbox: {
        show: true,
        dataView:{show:true},
        top: '15%',
        right: '10%',
        feature: {
          restore: { title: 'Restore' },
          saveAsImage: { title: 'Save' }
        }

      }, visualMap: {
        right: 'center',
        bottom: '15%',
        min: 0,
        max: Math.max.apply(Math, group.map(function (event) {
          return event.value;
        })),
        inRange: {
          color: [
            '#EEF5FF',
            '#B4D4FF',
            '#86B6F6',
            '#176B87'
          ]
        },
        text: ['Tinggi', 'Rendah'],
        textStyle:{
          fontSize: 12,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        
        },
        calculable: false,
        orient: 'horizontal',
      },

      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      animation: true,
      series: [{
        name: 'Provinsi Tujuan',
        type: 'map',
        zoom: '1.2',
        map: "Ind",
        roam: true,
        data: group,
        emphasis:{
          label:{show:false}
        }
      }]
    };
    optionCPleth && cPlethTujuan.setOption(optionCPleth);
    var optionDonut = {
      title:{
        text: 'Persentase Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan (Kumulatif)',
        left: '2%',
        top:'0',
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }

    },
    grid:{

      left:'3%',
      containLabel:true
    },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
          return `<span style="font-weight: bold;">${params.name}</span> : ${(params.data.number/1000000).toFixed(2)} juta`;
          ;
        }
      },
      xAxis: { show: true, 
        type: 'value', 
        max: 'dataMax',
        axisLabel:{
          show :false,
          fontFamily:'sans-serif',
          fontSize:'15',
          
        },
        axisLine:{show:true},
        splitLine:{show:false}
       },
      yAxis: {
        axisLabel:{
          show :true,
          fontFamily:'sans-serif',
          fontSize:'10',
          fontWeight:'bold',
          color:'black'
          
        },
        type: 'category',
        inverse:true
      },
      graphic: {
        type: 'text',
        bottom: '7%',
        right: '9%',
        style: {
          fill: '#333',
          width: 120,
          overflow: 'break',
          text: 'Total : 100%',
          fontFamily: 'san-serif',
          fontSize:15,
          fontWeight:'bolder'
        }
      },
      dataset: {
        source: contentBar
    },
      series: [
        {
          name: 'Hati',
          encode: {
            x: 'value',
            y: 'name'
          },
          type: 'bar',
          markArea: {
            silent:true,
            data: [
              [
                {
                    name: 'Kontribusi gabungan \nmencapai ' + area.toFixed(2)+' %',
                    
                    yAxis: 0
                },
                {
                  x:'98%',
                    yAxis: idx
                }
            ], 
          ],
          label:{
            show:true,
            position:['65%','100%'],
            color:'black',
            fontFamily:'sans-serif',
            fontSize:'14px'
            // verticalAlign:'bottom'
          }
       },
          label: {
            show: true,
            formatter: function (params) {
              return (params.data.value).toFixed(2) + ' %';
            },
            position: 'right',
            fontFamily: 'sans-serif',
            fontWeight:'bold',
            fontSize: '12'
          },
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          emphasis:{
            itemStyle:{
              color:"yellow"
              
            },
            label:{
              show: true,
              color:'red'
            }
          }
        }
      ]
    }

    optionDonut && donutTujuan.setOption(optionDonut);
    // donutTujuan.dispatchAction({
    //   type:'highlight',
    //   seriesIndex:0,
    //   name:"BANTEN"
    // }
    // )
    cPlethTujuan.on("mouseover",function(params){
      donutTujuan.dispatchAction({
        type:'highlight',
        seriesIndex:0,
        name: params.name
      })
    })
    cPlethTujuan.on("mouseout",function(params){
      donutTujuan.dispatchAction({
        type:'downplay',
        seriesIndex:0,
        name: params.name
      })
    })
    donutTujuan.on("mouseover",function(params){
      cPlethTujuan.dispatchAction({
        type:'highlight',
        seriesIndex:0,
        name:params.name
      })
    })
    donutTujuan.on("mouseout",function(params){
      cPlethTujuan.dispatchAction({
        type:'downplay',
        seriesIndex:0,
        name:params.name
      })
    })
    // donutTujuan.dispatchAction({
    //   type:'showTip',
    //   name:"JAWA TIMUR",
    //   position: [10,10]
    // })


  });

}

function sectionTwoAsal(url) {
  $.get(url, function (data, status) {
    let Wisnus = JSON.parse(JSON.stringify(data));
    let kdNew = ["9200", "9500", "9600", "9700"];
    let sumAll=0;
    let contentWilayah=[];
    let contentBar = [];
    let labelMonths = [];
    let beginVal = $("#sAwalAsal").val();
    let endVal = $("#sAkhirAsal").val();
    let kdWil = Object.keys(kdProvJSON[0]);
    let a = -1;
    // for (let n = 0; n < Wisnus.tahun.length; n++) {
    //   var optionHTML = document.createElement("option");
    //   optionHTML.value = Wisnus.tahun[n].val.toString();
    //   optionHTML.text = Wisnus.tahun[n].label.toString();
    //   selectTahun.add(optionHTML);
    // }
    let boolAdd = $("#sAwalAsal").children('option').length<2;
    for (let i = 0; i < (kdWil.length - 1); i++) {
      if (!kdNew.includes(kdWil[i])) {
        //let cumVal = 0;
        for (let k = 0; k < Wisnus.tahun.length; k++) {
          for (let m = 0;m<Wisnus.turtahun.length-1;m++){
            
            let keyData = kdWil[i] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[k].val.toString() + Wisnus.turtahun[m].val.toString();
            if(Wisnus.datacontent[keyData]){
              if(i==0){
              labelMonths.push(Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label);
              a++;
              if(boolAdd){
                var newOption = $("<option></option>").attr("value", a).text(Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label);
              var newOption2 =  $("<option></option>").attr("value", a).text(Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label);
              $("#sAwalAsal").append(newOption);
              $("#sAkhirAsal").append(newOption2);

              }
              
              }
              contentWilayah.push(
                {
                  name: kdProvJSON[0][kdWil[i]].toUpperCase(),
                  value: Wisnus.datacontent[keyData],
                  waktu: Wisnus.turtahun[m].label.toString()+'-'+Wisnus.tahun[k].label
                })
            }
            
          }
          
        }
        
      }
    }
    let timeline;
    let text;
    if(endVal=="Pilih Rentang Waktu Akhir" & !beginVal){
      timeline = labelMonths.slice();
     text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal (Kumulatif)'+'\n('+timeline[0]+
     ' — '+timeline[timeline.length-1]+")";
     }else if(endVal=="Pilih Rentang Waktu Akhir"){timeline=labelMonths[beginVal];
       text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal (Kumulatif)'+'\n('+timeline+")";
 
       // console.log(beginVal);
     }
     else{
      timeline = labelMonths.slice(beginVal,parseInt(endVal)+1);
      text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal (Kumulatif)'+'\n('+timeline[0]+'-'+timeline[timeline.length-1]+")";
     
     //  console.log(beginVal);
     }
    
    
    contentWilayah = contentWilayah.filter(a=> timeline.includes(a.waktu));
    let groupObj = contentWilayah.reduce((r,{name,value}) => 
                  (r[name] = (r[name]||0) + value, r), {});
    sumAll = Object.values(groupObj).reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    },0);
    let group = Object.keys(groupObj).map(key => ({name:key, value: groupObj[key]}));


    let area=0;
    let idx;
    let sorted = group.sort(function(a, b) {
      return b.value - a.value;
  })
    for(let i = 0; i<sorted.length;i++){
      //  console.log(area);
        if(area<50){
          area=area+sorted[i].value/sumAll*100
          // console.log(area);
          if(area>50){
            idx=i;
          }
        }
      contentBar.push({
        name: sorted[i].name,
        value:sorted[i].value/sumAll*100,
        number: sorted[i].value
      })
    }


    echarts.registerMap('Ind', INAGeoJSON);
    var cPlethTujuan = echarts.init(document.getElementById("cPlethAsal"));
    var donutTujuan = echarts.init(document.getElementById("donutAsal"));

    var optionCPleth = {
      title: {
        text: text,
        left: '2%',
        top :'0%',
        textStyle: {
          fontSize: 15,
          fontFamily:'sans-serif',
          fontWeight:'normal',
          color:'black'
        }

      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          var value = params.seriesName + "<br>" + params.name + ' : <span style="font-weight:bold">' + (params.value / 1000000).toFixed(2) + '</span> juta';
          return value
        },
        textStyle:{
          fontFamily:"serif",
          fontSize:15
        }
      },
      toolbox: {
        show: true,
        dataView:{show:true},
        top: '15%',
        right: '10%',
        feature: {
          restore: { title: 'Restore' },
          saveAsImage: { title: 'Save' }
        }

      }, visualMap: {
        right: 'center',
        bottom: '15%',
        min: 0,
        max: Math.max.apply(Math, group.map(function (event) {
          return event.value;
        })),
        inRange: {
          color: [
            '#EEF5FF',
            '#B4D4FF',
            '#86B6F6',
            '#176B87'
          ]
        },
        text: ['Tinggi', 'Rendah'],
        textStyle:{fontFamily:'sans-serif'},
        calculable: false,
        orient: 'horizontal',
      },

      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      animation: true,
      series: [{
        name: 'Provinsi Asal',
        type: 'map',
        zoom: '1.2',
        map: "Ind",
        roam: 'scale',
        data: group,
        emphasis:{
          label:{show:false}
        }
      }]
    };
    optionCPleth && cPlethTujuan.setOption(optionCPleth);
    var optionDonut = {
      title:{
        text: 'Persentase Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal (Kumulatif)',
        left: '2%',
        top:'0',
        textStyle: {
          fontSize: 15,
          fontFamily:'sans-serif',
          fontWeight:'normal',
          color:'black'
        }

    },
    grid:{

      left:'3%',
      containLabel:true
    },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
          return `<span style="font-weight: bold;">${params.name}</span> : ${(params.data.number/1000000).toFixed(2)} juta`;
          ;
        }
      },
      xAxis: { show: true, 
        type: 'value', 
        max: 'dataMax',
        axisLabel:{
          show :false,
          fontFamily:'sans-serif',
          fontSize:'15',
          
        },
        axisLine:{show:true},
        splitLine:{show:false}
       },
      yAxis: {
        axisLabel:{
          show :true,
          fontFamily:'sans-serif',
          fontSize:'10',
          fontWeight:'bold',
          color:'black'
          
        },
        type: 'category',
        inverse:true
      },
      graphic: {
        type: 'text',
        bottom: '7%',
        right: '9%',
        style: {
          fill: '#333',
          width: 120,
          overflow: 'break',
          text: 'Total : 100%',
          fontFamily: 'san-serif',
          fontSize:15,
          fontWeight:'bolder'
        }
      },
      dataset: {
        source: contentBar
    },
      series: [
        {
          name: 'Hati',
          encode: {
            x: 'value',
            y: 'name'
          },
          type: 'bar',
          markArea: {
            silent:true,
            data: [
              [
                {
                    name: 'Kontribusi gabungan \nmencapai ' + area.toFixed(2)+' %',
                    
                    yAxis: 0
                },
                {
                  x:'98%',
                    yAxis: idx
                }
            ], 
          ],
          label:{
            show:true,
            position:['65%','100%'],
            color:'black',
            fontFamily:'sans-serif',
            fontSize:'14px'
            // verticalAlign:'bottom'
          }
       },
          label: {
            show: true,
            formatter: function (params) {
              return (params.data.value).toFixed(2) + ' %';
            },
            position: 'right',
            fontFamily: 'sans-serif',
            fontWeight:'bold',
            fontSize: '12'
          },
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          emphasis:{
            itemStyle:{
              color:"yellow"
              
            },
            label:{
              show: true,
              color:'red'
            }
          }
        }
      ]
    }

    optionDonut && donutTujuan.setOption(optionDonut);
    // donutTujuan.dispatchAction({
    //   type:'highlight',
    //   seriesIndex:0,
    //   name:"BANTEN"
    // }
    // )
    cPlethTujuan.on("mouseover",function(params){
      donutTujuan.dispatchAction({
        type:'highlight',
        seriesIndex:0,
        name: params.name
      })
    })
    cPlethTujuan.on("mouseout",function(params){
      donutTujuan.dispatchAction({
        type:'downplay',
        seriesIndex:0,
        name: params.name
      })
    })
    donutTujuan.on("mouseover",function(params){
      cPlethTujuan.dispatchAction({
        type:'highlight',
        seriesIndex:0,
        name:params.name
      })
    })
    donutTujuan.on("mouseout",function(params){
      cPlethTujuan.dispatchAction({
        type:'downplay',
        seriesIndex:0,
        name:params.name
      })
    })
    // donutTujuan.dispatchAction({
    //   type:'showTip',
    //   name:"JAWA TIMUR",
    //   position: [10,10]
    // })


  });

}
function ExportToExcel(type, fn, dl) {
  var elt = document.getElementById('tWisnus');
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
    XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));
}



function tabulasiWisnus(url,sumFunction,tahun){
  $.get(url,function(data,status){
    let wisnus = JSON.parse(JSON.stringify(data));
    let roman = ["I","II","III","IV","V","VI"] ;
    let dom =$('#tabCont');
    
    if(sumFunction==0){

      // $("#tabulasiWisnus").DataTable({
      //   order:[],
      // });
      // Create table headers
      
      
      // var column = [];
      // dom.append('<table id="tabulasiWisnus"></table>');
      var table = $("<table id='tabulasiWisnus' class='display nowrap bg-white' style='font-family:Poppins;'></table");
      table.append("<caption class='text-left italic font-semibold'>Tabel 1: Perjalan Wisatawan Nusantara Tahunan Berdasarkan Provinsi Tujuan.</caption>");
      var thead = $("<thead></thead>");
      var headers = $('<tr></tr>');
      headers.append('<th class="font-semibold">Provinsi Tujuan</th>');
      // column.push("Provinsi Tujuan");
      
  
      for(let k = 0;k<tahun.length;k++){
        let temp = parseInt(tahun[k])+1900;
          headers.append("<th class='font-semibold'>"+temp.toString()+"</th>");
          // column.push("Tahun "+temp.toString());
      }
      headers.append('<th class="font-semibold" align="right">Total</th>');
      thead.append(headers);
      table.append(thead);
      let tbody = $("<tbody></tbody>");
      //loop rows
      for(let i=0;i<wisnus.vervar.length;i++){
        // var temp={};
        var row = $("<tr></tr>");
        row.append("<td>" + wisnus.vervar[i].label + '</td>');
        // temp[column[0]]= wisnus.vervar[i].label;
        let total = 0;
        //loop columns in rows
        for(let j=0; j<tahun.length;j++){
          let keyData = wisnus.vervar[i].val + wisnus.var[0].val.toString() + wisnus.turvar[0].val.toString() + tahun[j] + 13;
          
          if(wisnus.datacontent[keyData]){
            total = total + parseInt(wisnus.datacontent[keyData]);
            row.append('<td align="right">' + new Intl.NumberFormat().format(wisnus.datacontent[keyData]) + '</td>');
            // temp[column[j+1]]= wisnus.datacontent[keyData];

          }
                      
        }
        row.append('<td align="right">' + new Intl.NumberFormat().format(total) + '</td>');

        tbody.append(row);
        // modifiedJson.push(temp);
      }
      table.append(tbody);
      dom.append(table);
      new DataTable('#tabulasiWisnus',{
        order:[],
        layout:{
          topStart:'search',
          topEnd:{
            buttons:[ {
              extend: 'excel',
              text: 'Export to Excel',
              title:'Jumlah Perjalanan Wisatawan Nusantara Tahunan Berdasarkan Provinsi Tujuan',
      
            }]
          }
        }
        ,
        scrollY:'16.5rem',
        // scrollCollapse: true,
        paging:false,
        info:false
      });
      
      
    
    }
    else if(sumFunction==1){
      // Create table headers
      var table = $("<table id='tabulasiWisnus' class='display nowrap bg-white' style='font-family:Poppins;'></table");
      table.append("<caption class='text-left italic font-semibold'>Tabel 1: Perjalan Wisatawan Nusantara Bulanan Berdasarkan Provinsi Tujuan.</caption>");
      var thead = $('<thead></thead>');
      var headers = $('<tr></tr>');
      headers.append('<th class="font-semibold">Provinsi Tujuan</th>');
      // let text = '<th colspan="'+tahun.length+'">Tahun</th>';
      // headers.append(text);
      

      //subheaders
      //var subhead = $('<tr></tr>');
         
            for(let k = 0;k<tahun.length;k++){
              for(let m = 0;m<12;m++){
              let temp = parseInt(tahun[k])+1900;
                headers.append('<th class="font-semibold">'+months[m]+' '+temp+'</th>');
              }
          }
      headers.append('<th class="font-semibold" align="right">Total</th>');
      thead.append(headers);
      table.append(thead);
      // table.append(headers);
      //table.append(subhead);
      let tbody = $('<tbody></tbody>');

      //loop rows
      for(let i=0;i<wisnus.vervar.length;i++){
        var row = $('<tr></tr>');
        row.append('<td>' + wisnus.vervar[i].label + '</td>');
        let total = 0;
        //loop columns in rows
        for(let j=0; j<tahun.length;j++){
          for (let k =0;k<wisnus.turtahun.length-1;k++){
            
          let keyData = wisnus.vervar[i].val + wisnus.var[0].val.toString() + wisnus.turvar[0].val.toString() + tahun[j] + wisnus.turtahun[k].val;
          if(wisnus.datacontent[keyData]){
            total = total + parseInt(wisnus.datacontent[keyData]);
            row.append('<td>' + new Intl.NumberFormat().format(wisnus.datacontent[keyData])+ '</td>');
          
          }
          else{
            row.append("<td>-</td>")
          }
          }
          }
        row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
        tbody.append(row);
      }
      table.append(tbody);
      dom.append(table);
      new DataTable('#tabulasiWisnus',{
        order:[],
        fixedColumns: {
          start: 1
    
      },
        layout:{
          topStart:'search',
          topEnd:{
            buttons:[ {
              extend: 'excel',
              text: 'Export to Excel',
              title:'Jumlah Perjalanan Wisatawan Nusantara Periode Bulanan Berdasarkan Provinsi Tujuan',
      
            }]
          }
        }
        ,
        scrollY:'16.5rem',
        scrollX:'92dvw',
        paging:false,
        info:false
      });
      // $(".tr").css({"width":"9000px"});
      // $('#tabulasiWisnus').append(table);
      
      // $("#btnExportTab").click(function(){ExportToExcel()});
    }
    else if(sumFunction==2){
      // Create table headers
      var table = $("<table id='tabulasiWisnus' class='display nowrap bg-white' style='font-family:Poppins;'></table");
      table.append("<caption class='text-left italic font-semibold'>Tabel 1: Perjalan Wisatawan Nusantara Dwiwulanan Berdasarkan Provinsi Tujuan.</caption>");
      var thead = $("<thead></thead>");
      var headers = $('<tr></tr>');
      headers.append('<th class="font-semibold">Provinsi Tujuan</th>');
         
            for(let k = 0;k<tahun.length;k++){
              for(let m = 0;m<6;m++){
              let temp = parseInt(tahun[k])+1900;
                headers.append('<th class="font-semibold">DW '+roman[m] +'-'+temp+'</th>');
              }
          }
      headers.append('<th class="font-semibold">Total</th>');
      thead.append(headers);
      table.append(thead);
      
      //table.append(subhead);

      //loop rows
      var tbody = $("<tbody></tbody>");
      for(let i=0;i<wisnus.vervar.length;i++){
        var row = $('<tr></tr>');
        row.append('<td>' + wisnus.vervar[i].label + '</td>');
        let total = 0;
        let sumDwi = 0
        //loop columns in rows
        for(let j=0; j<tahun.length;j++){
          for (let k =0;k<wisnus.turtahun.length-1;k++){
            let keyData = wisnus.vervar[i].val + wisnus.var[0].val.toString() + wisnus.turvar[0].val.toString() + tahun[j] + wisnus.turtahun[k].val;
            if(wisnus.datacontent[keyData]){
              if(k%2 ==0){
                total = 0
                total = total + parseInt(wisnus.datacontent[keyData]);
              }
              else{
                  total = total + parseInt(wisnus.datacontent[keyData]);
                  
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                  
                }
                sumDwi = sumDwi +parseInt(wisnus.datacontent[keyData]);
              }
              else{
                if(k%2==1){
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                }
                else{
                  total=0;
                }
              }
              
                
            
          }
        }
        row.append('<td>' + new Intl.NumberFormat().format(sumDwi) + '</td>');
        tbody.append(row);
      }
      table.append(tbody);
      dom.append(table);
      new DataTable('#tabulasiWisnus',{
        order:[],
        fixedColumns: {
          start: 1
    
      },
        layout:{
          topStart:'search',
          topEnd:{
            buttons:[ {
              extend: 'excel',
              text: 'Export to Excel',
              title:'Jumlah Perjalanan Wisatawan Nusantara Periode Dwiwulanan Berdasarkan Provinsi Tujuan',
      
            }]
          }
        }
        ,
        scrollY:'16.5rem',
        scrollX:'92dvw',
        paging:false,
        info:false
      });

      // $("#btnExportTab").click(function(){ExportToExcel()});


    }
    else if(sumFunction==3){
      var table = $("<table id='tabulasiWisnus' class='display nowrap bg-white' style='font-family:Poppins;'></table");
    
      table.append("<caption class='text-left italic font-semibold'>Tabel 1: Perjalan Wisatawan Nusantara Triwulanan Berdasarkan Provinsi Tujuan.</caption>");

      var thead = $("<thead></thead>");
      var headers = $('<tr></tr>');
      headers.append('<th class="font-semibold">Provinsi Tujuan</th>');
         
            for(let k = 0;k<tahun.length;k++){
              for(let m = 0;m<4;m++){
              let temp = parseInt(tahun[k])+1900;
                headers.append('<th class="font-semibold">TW '+roman[m] +'-'+temp+'</th>');
              }
          }
      headers.append('<th class="font-semibold">Total</th>');
      thead.append(headers);
      table.append(thead);
      
      //table.append(subhead);

      //loop rows
      var tbody = $("<tbody></tbody>");
      for(let i=0;i<wisnus.vervar.length;i++){
        var row = $('<tr></tr>');
        row.append('<td>' + wisnus.vervar[i].label + '</td>');
        let total = 0;
        let sumDwi = 0
        //loop columns in rows
        for(let j=0; j<tahun.length;j++){
          for (let k =0;k<wisnus.turtahun.length-1;k++){
            let keyData = wisnus.vervar[i].val + wisnus.var[0].val.toString() + wisnus.turvar[0].val.toString() + tahun[j] + wisnus.turtahun[k].val;
            if(wisnus.datacontent[keyData]){
              if(k%3 ==0){
                total = 0
                total = total + parseInt(wisnus.datacontent[keyData]);
              }
              else if(k%3==2){
                  total = total + parseInt(wisnus.datacontent[keyData]);
                  
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                  
                  
                }
                else{
                  total = total+parseInt(wisnus.datacontent[keyData]);
                }
                sumDwi = sumDwi +parseInt(wisnus.datacontent[keyData]);
              }
              else{
                if(k%3==2){
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                }
                else if(k%3==0){
                  total=0;
                }
              }
              
                
            
          }
        }
        row.append('<td>' + new Intl.NumberFormat().format(sumDwi) + '</td>');
        tbody.append(row);
      }
      table.append(tbody);
      dom.append(table);
      new DataTable('#tabulasiWisnus',{
        order:[],
        fixedColumns: {
          start: 1
    
      },
        layout:{
          topStart:'search',
          topEnd:{
            buttons:[ {
              extend: 'excel',
              text: 'Export to Excel',
              title:'Jumlah Perjalanan Wisatawan Nusantara Periode Triwulanan Berdasarkan Provinsi Tujuan',
      
            }]
          }
        }
        ,
        scrollY:'16.5rem',
        scrollX:'92dvw',
        paging:false,
        info:false
      });

      // $("#btnExportTab").click(function(){ExportToExcel()});



    }
    
    else if(sumFunction==4){
      var table = $("<table id='tabulasiWisnus' class='display nowrap bg-white' style='font-family:Poppins;'></table");
      table.append("<caption class='text-left italic font-semibold'>Tabel 1: Perjalan Wisatawan Nusantara CaturWulanan Berdasarkan Provinsi Tujuan.</caption>");

      var thead = $("<thead></thead>");
      var headers = $('<tr></tr>');
      headers.append('<th class="font-semibold">Provinsi Tujuan</th>');
         
            for(let k = 0;k<tahun.length;k++){
              for(let m = 0;m<3;m++){
              let temp = parseInt(tahun[k])+1900;
                headers.append('<th class="font-semibold">CW '+roman[m] +'-'+temp+'</th>');
              }
          }
      headers.append('<th class="font-semibold">Total</th>');
      thead.append(headers);
      table.append(thead);
      
      var tbody = $("<tbody></tbody>");
      for(let i=0;i<wisnus.vervar.length;i++){
        var row = $('<tr></tr>');
        row.append('<td>' + wisnus.vervar[i].label + '</td>');
        let total = 0;
        let sumDwi = 0
        //loop columns in rows
        for(let j=0; j<tahun.length;j++){
          for (let k =0;k<wisnus.turtahun.length-1;k++){
            let keyData = wisnus.vervar[i].val + wisnus.var[0].val.toString() + wisnus.turvar[0].val.toString() + tahun[j] + wisnus.turtahun[k].val;
            if(wisnus.datacontent[keyData]){
              if(k%4 ==0){
                total = 0
                total = total + parseInt(wisnus.datacontent[keyData]);
              }
              else if(k%4==3){
                  total = total + parseInt(wisnus.datacontent[keyData]);
                  
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                  
                }
                else{
                  total = total+parseInt(wisnus.datacontent[keyData]);
                }
                sumDwi = sumDwi +parseInt(wisnus.datacontent[keyData]);
              }
              else{
                if(k%4==3){
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                }
                else if(k%4==0){
                  total=0;
                }
              }
              
                
            
          }
        }
        row.append('<td>' + new Intl.NumberFormat().format(sumDwi) + '</td>');
        tbody.append(row);
      }
      table.append(tbody);
      dom.append(table);
      new DataTable('#tabulasiWisnus',{
        order:[],
        fixedColumns: {
          start: 1
    
      },
        layout:{
          topStart:'search',
          topEnd:{
            buttons:[ {
              extend: 'excel',
              text: 'Export to Excel',
              title:'Jumlah Perjalanan Wisatawan Nusantara Periode Caturwulan Berdasarkan Provinsi Tujuan',
      
            }]
          }
        }
        ,
        scrollY:'16.5rem',
        scrollX:'92dvw',
        paging:false,
        info:false
      });


    }
    else if(sumFunction==5){
      var table = $("<table id='tabulasiWisnus' class='display nowrap bg-white' style='font-family:Poppins;'></table");
    
      table.append("<caption class='text-left italic font-semibold'>Tabel 1: Perjalan Wisatawan Nusantara Tahunan Berdasarkan Provinsi Tujuan.</caption>");

      var thead = $("<thead></thead>");
      var headers = $('<tr></tr>');
      headers.append('<th class="font-semibold">Provinsi Tujuan</th>');
         
            for(let k = 0;k<tahun.length;k++){
              for(let m = 0;m<2;m++){
              let temp = parseInt(tahun[k])+1900;
                headers.append('<th class="font-semibold">Sem '+roman[m] +'-'+temp+'</th>');
              }
          }
      headers.append('<th class="font-semibold">Total</th>');
      thead.append(headers);
      table.append(thead);
      
      //table.append(subhead);

      //loop rows
      var tbody = $("<tbody></tbody>");
      for(let i=0;i<wisnus.vervar.length;i++){
        var row = $('<tr></tr>');
        row.append('<td>' + wisnus.vervar[i].label + '</td>');
        let total = 0;
        let sumDwi = 0
        //loop columns in rows
        for(let j=0; j<tahun.length;j++){
          for (let k =0;k<wisnus.turtahun.length-1;k++){
            let keyData = wisnus.vervar[i].val + wisnus.var[0].val.toString() + wisnus.turvar[0].val.toString() + tahun[j] + wisnus.turtahun[k].val;
            if(wisnus.datacontent[keyData]){
              if(k%6 ==0){
                total = 0
                total = total + parseInt(wisnus.datacontent[keyData]);
              }
              else if(k%6==5){
                  total = total + parseInt(wisnus.datacontent[keyData]);
                  
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                  
                }
                else{
                  total = total+parseInt(wisnus.datacontent[keyData]);
                }
                sumDwi = sumDwi +parseInt(wisnus.datacontent[keyData]);
              }
              else{
                if(k%6==5){
                    row.append('<td>' + new Intl.NumberFormat().format(total) + '</td>');
                }
                else if(k%6==0){
                  total=0;
                }
              }
              
                
            
          }
        }
        row.append('<td>' + new Intl.NumberFormat().format(sumDwi) + '</td>');
        tbody.append(row);
      }
      table.append(tbody);
      dom.append(table);
      new DataTable('#tabulasiWisnus',{
        order:[],
        fixedColumns: {
          start: 1
    
      },
        layout:{
          topStart:'search',
          topEnd:{
            buttons:[ {
              extend: 'excel',
              text: 'Export to Excel',
              title:'Jumlah Perjalanan Wisatawan Nusantara Periode Caturwulanan Berdasarkan Provinsi Tujuan',
      
            }]
          }
        }
        ,
        scrollY:'16.5rem',
        scrollX:'92dvw',
        paging:false,
        info:false
      });

      
      // $("#btnExportTab").click(function(){ExportToExcel()});



    
    }
    

  })

}

var page = 1;
function mapStory(){
  var mapCanvas = echarts.init(document.getElementById("mapStory"));
  mapCanvas.showLoading()
  $.get("./indicator",function(data,status){
    echarts.registerMap('CInd', CityINAJSON);
    let storyData = data.database;
    let idx = data.index;
    
    var option = {
      // title: {
      //   text: 'Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan (Kumulatif)',
      //   left: 'center',
      //   textStyle: {
      //     fontSize: 18,
      //     fontFamily:'serif',
      //     fontWeight:'bold',
      //     color:'black'
      //   },

      // },
      tooltip: {
        trigger: 'item',
        // formatter: function (params) {
        //   var value = params.seriesName + "<br>" + params.name + ' : ' + (params.value / 1000000).toFixed(2) + ' juta';
        //   return value
        // }
      },
       
      // visualMap: {
      //   right: 'center',
      //   bottom: '15%',
      //   min: 0,
      //   max: Math.max.apply(Math, group.map(function (event) {
      //     return event.value;
      //   })),
      //   inRange: {
      //     color: [
      //       '#EEF5FF',
      //       '#B4D4FF',
      //       '#86B6F6',
      //       '#176B87'
      //     ]
      //   },
      //   text: ['Tinggi', 'Rendah'],
      //   calculable: false,
      //   orient: 'horizontal',
      // },

      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      geo:[{map:"CInd",
      zoom:1
    }],

      series: [{
        name: 'TPK',
        type: 'scatter',
        coordinateSystem:'geo',
        data:storyData,
        encode:{value:3},
        symbolSize:function(val){
          return val[3]/2
        },
        itemStyle:{
          borderColor:"blue",
          borderWidth:2,
          color:"white"
        }
        
      }]
    };
    option && mapCanvas.setOption(option);
    mapCanvas.hideLoading();
    $('#nextBtnStory').click(function(){
      let row = storyData[idx[1]];
      if(page==1){
        option.geo[0].zoom =30;
        //console.log(storyData);
        
        //console.log(row);
        option.geo[0].center = [row.value[0],row.value[1]];
        //console.log(option.geo.center);
        mapCanvas.setOption(option);
        setTimeout(()=>mapCanvas.dispatchAction({
          type: 'highlight',
          geoIndex:0,
          name: row.name
        }),700);
        setTimeout(()=>mapCanvas.dispatchAction({
          type: 'showTip',
          seriesIndex:0,
          dataIndex:idx[1]
        }),1000);
        page=page+1
        //alert('Hi');
      }
      else if(page==2){
        let mapCanvas = echarts.init(document.getElementById("mapStory"));
        
        mapCanvas.dispatchAction({
          type: 'downplay',
          geoIndex:0,
          name: row.name
        });
        mapCanvas.dispatchAction({
          type: 'hideTip',
        });
        option.geo[0].zoom =1;
        option.geo[0].center ="";
        
        option.series = [{
          name: 'Tamu Nusantara',
          type: 'scatter',
          coordinateSystem:'geo',
          data:storyData,
          encode:{value:2},
          symbolSize:function(val){
            return val[2]/100000
          },
          itemStyle:{
            borderColor:"purple",
            borderWidth:2,
            color:"white"
          }
          
        }];
        option.tooltip={trigger:'item',
          formatter: function (params) {
            // console.log(params);
             var value = params.seriesName + "<br>" + params.name + ' : ' + (params.data.value[2] / 100000).toFixed(2) + ' ratus ribu';
          return value
        }};
        mapCanvas.setOption(option);
        page=page+1;


      }
    })


  })
} 

function passExSur(){

}

function tpkSectionOne(url){
  
  tpkLine.showLoading();
  var optSeries = $('input[type=radio][name=seriesTPK]').val();
  var wilayah = [];
  var tahun=[];
  $('.checkBoxWilayahTPK').each(function(){
    if($(this).is(':checked')){
      wilayah.push($(this).val())
    }
  });
  // console.log(optSeries);
  // console.log(wilayah);

  // var tahun = [];
  
  
  var labelTpkLine = [];
  var contentTpkLine=[];
  var reqUrl = url+APIkey;
  $.get(reqUrl,function(data,status){
    let tpkData = JSON.parse(JSON.stringify(data));
    if(wilayah.length>0){
      if($('#singleTPK').is(':checked')){
      for(let k=0;k<wilayah.length;k++){
        let temp =[];
        for(let i=minYearTPK.value;i<=maxYearTPK.value;i++){
          for(let j=1;j<13;j++){
            
            let key = wilayah[k]+tpkData.var[0].val+tpkData.turvar[0].val+i+j;
            if(tpkData.datacontent[key]){
              temp.push(tpkData.datacontent[key]);
              if(k==0){
                labelTpkLine.push(months[j-1]+parseInt(parseInt(i)+1900));
              }
            }
            else{
              temp.push('-')
            }
          }
          
  
        }
        contentTpkLine.push({
          name: kdProvJSON[0][wilayah[k]],
          type: "line",
          data:temp,
      // contentTpkLine,
          symbolSize:1,
          colorBy:'series',
          label:{
            show:false,
            position:'top',
            fontFamily:'sans-serif',
            fontWeight:'bold',
            fontSize:10,
            distance:5,            
          },
          labelLayout:{hideOverlap:true},
          endLabel:{
            show:true,
            formatter:function(params){
              return params.seriesName;
            },
            fontFamily:'sans-serif',
            fontWeight:'bold',
            fontSize:10,
          }
          })
      }
      
      }
      else{
      $('.cbTPK').each(function(){
        if($(this).is(':checked')){
          tahun.push($(this).val())
        }
      })
      // console.log(tahun);
      for(let k=0;k<wilayah.length;k++){
        for(let i=0;i<tahun.length;i++){
          let temp =[];
          for(let j=1;j<13;j++){
            let key = wilayah[k]+tpkData.var[0].val+tpkData.turvar[0].val+tahun[i]+j;
            if(tpkData.datacontent[key]){
              temp.push(tpkData.datacontent[key]);
              // if(k==0){
              //   labelTpkLine.push(months[j-1]+parseInt(parseInt(i)+1900));
              // }
            }
            else{
              temp.push('-')
            }
          }
          contentTpkLine.push({
            name: kdProvJSON[0][wilayah[k]] +"\n"+ parseInt(parseInt(tahun[i])+1900),
            type: "line",
            data:temp,
            symbolSize:1,
            colorBy:'series',
            label:{
              show:true,
              position:'top',
              fontFamily:'sans-serif',
              fontWeight:'bold',
              fontSize:10,
              distance:5,            
            },
            labelLayout:{hideOverlap:true},
            endLabel:{
              show:true,
              formatter:function(params){
                return params.seriesName;
              },
              fontFamily:'sans-serif',
              fontWeight:'bold',
              fontSize:10,
            }
            })
  
        }
        
      }
      labelTpkLine=months;
      // console.log(contentTpkLine);

  
    }
  }
    else{
      contentTpkLine=[];
      labelTpkLine=months;
    }
      
    let tpkLineOption = {
      title: {
        text: 'Tingkat Penghunian Kamar Hotel Bintang'+ '\nBerdasarkan Bulan dan Tahun ',
        left: '2%',
        top:'0',
        textStyle: {
          fontSize: 16,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%%',
        right: '8%',
        bottom: '9%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          restore:{}
        }
      },
      // color: '#0284C7',
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labelTpkLine,
        splitLine:{show:false},
        name:"Waktu",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:30

      },
      // dataZoom: [{bottom:'1%'},{type:"inside"}],
      yAxis: {
        show:true,
        type: 'value',
        splitLine:{show:true},
        axisLine:{
          show:true
        },
        name:"TPK",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:30

      },
      series:contentTpkLine
    };
    tpkLine.setOption(tpkLineOption);
    tpkLine.hideLoading();
    
  })

}

function tpkCombineSeries(wilayah){
  let url = "https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/282/"+"vervar/"+wilayah+"/"+APIkey;
  var elementId = echarts.init(document.getElementById("tpkCombine"));
  elementId.showLoading();
  $.get(url,function(data,status){
    let seriesBintang = [];
    let seriesNonBintang=[];
    let tahun = [];
    let tpk = JSON.parse(JSON.stringify(data));
    // console.log(tpk);
    // console.log(tpk.tahun.length);
    for(let i=0;i<tpk.tahun.length;i++){
      let keyData1 = wilayah + tpk.var[0].val+tpk.turvar[0].val+tpk.tahun[i].val+0;
      let keyData2 = wilayah + tpk.var[0].val+tpk.turvar[1].val+tpk.tahun[i].val+0;
      if(data.datacontent[keyData1]){
        seriesBintang.push(data.datacontent[keyData1]);
      }
      if(data.datacontent[keyData2]){
        seriesNonBintang.push(data.datacontent[keyData2]);
      }
      tahun.push(tpk.tahun[i].label);

    }
    let tpkOption = {
      title: {
        text: 'Tingkat Penghunian Kamar Hotel Bintang dan Nonbintang'+'\ndan Akomdasi Lainnya di '+kdProvJSON[0][wilayah],
        left: '1%',
        top:'0',
        textStyle: {
          fontSize: 16,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%%',
        right: '8%',
        bottom: '9%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        }
      },
      color: ['#0284C7','#fc9803'],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: tahun,
        name:"Tahun",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:30
      },
      // dataZoom: [{bottom:'1%'},{type:"inside"}],
      yAxis: {
        show:true,
        type: 'value',
        splitLine:{show:false},
        axisLine:{
          show:true
        },
        name:"TPK",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:30
      },
      series: [
        {
        name: "Hotel Bintang",
        type: "line",
        data:seriesBintang,
        // contentTpkLine,
        symbolSize:1,
        label:{
          show:true,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:5,
          // formatter:function(params){
          //   return (params.data/satuan[1]).toFixed(1) ;

          // }
        },
        endLabel:{
          show:true,
          formatter:function(params){
            return params.seriesName;
          },
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
        },

        
      },
      {
        name: "Hotel Nonbintang\ndan Akomodasi\nLainnya",
        type: "line",
        data:seriesNonBintang,
        // contentTpkLine,
        symbolSize:1,
        label:{
          show:true,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:5,
          // formatter:function(params){
          //   return (params.data/satuan[1]).toFixed(1) ;

          // }
        },
        labelLayout:{hideOverlap:true},
        endLabel:{
          show:true,
          formatter:function(params){
            return params.seriesName;
          },
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
        },
      }
    ]
    };
    elementId.setOption(tpkOption);
    elementId.hideLoading();
    

  })
  
  

}

function tpkCreateFilter(){
  
  $.get("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/"+APIkey,function(data,status){
    var TPK = JSON.parse(JSON.stringify(data));
    for(let i=0;i<TPK.tahun.length;i++){
      var optionDd = document.createElement("option");
      optionDd.value = TPK.tahun[i].val;
      optionDd.text = TPK.tahun[i].label;
      minYearTPK.appendChild(optionDd);
      var optionDd2 = document.createElement("option");
      optionDd2.value = TPK.tahun[i].val;
      optionDd2.text = TPK.tahun[i].label;
      maxYearTPK.appendChild(optionDd2);
      var optionBox = document.createElement("input");
      optionBox.type="checkbox";
      optionBox.value = TPK.tahun[i].val;
      optionBox.disabled = true;
      optionBox.classList.add("cbTPK");
      yearTPK.appendChild(optionBox);
      var labelBox = document.createElement("label");
      if(i%4==3){
        labelBox.innerHTML=" "+TPK.tahun[i].label+"&nbsp;&nbsp;&nbsp";
        yearTPK.appendChild(labelBox);
        yearTPK.appendChild(document.createElement("br"));
      }else{
        labelBox.innerHTML=" "+TPK.tahun[i].label+"&nbsp;&nbsp;&nbsp;";
        yearTPK.appendChild(labelBox);
      }
    }
    $('.cbTPK').change(function(){
      tpkLine.clear();
      tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
    });
    minYearTPK.value = TPK.tahun[0].val;
    maxYearTPK.value = TPK.tahun[TPK.tahun.length-1].val;
  })
}

function wismanBar(url){
  var contEl = echarts.init(document.getElementById('barWisman'));
  var contLineEl = echarts.init(document.getElementById('lineWisman'));
  contEl.showLoading();
  contLineEl.showLoading();
  var wilayah = ["11","40","57","116","164","187","248"];
  let str="";
  for(let a=0;a<wilayah.length;a++){
    str+=wilayah[a];
    if(a<(wilayah.length-1)){str+=";";}
  }
  let reqUrl = url+"vervar/"+str+";249/"+APIkey;
  // console.log(reqUrl);
  var contentWisman=[];
  var contentLineWisman=[];
  var axisCat = [];
  var axisCatLine=[];
  var temp=[];
  $.get(reqUrl,function(data,status){
    var wisman = JSON.parse(JSON.stringify(data));
    for(let i=0;i<wilayah.length;i++){
      temp=[];
      for(let j=0;j<wisman.tahun.length;j++){
        let key = wilayah[i]+wisman.var[0].val+wisman.turvar[0].val+wisman.tahun[j].val+"13";
        // console.log(key);
        if(wisman.datacontent[key]){
          temp.push(wisman.datacontent[key])
          if(i==0){
            axisCat.push(wisman.tahun[j].label);
          }
        }
      }
      let txt ;
      
        txt = wisman.vervar[i].label.replace("&lt;b&gt;","");
        txt = txt.replace("&lt;/b&gt;","");
      
      
        contentWisman.push({
          name:txt,
          type:'bar',
          stack:'Total',
          data: temp,
        //   label: {
        //     show: true,
        //     formatter:function(params){
        //       return (params.value/1000).toFixed(1);
        //     },
        //     position: 'top',
        //     fontFamily: 'sans-serif',
        //     fontWeight:'bold',
        //     fontSize: '18'
        // },

        })
      
      
      
    }
    // console.log(contentWisman);
    for(let m=0;m<wisman.tahun.length;m++){
      for(let l=1;l<13;l++){
        let keyLine = "249"+wisman.var[0].val+wisman.turvar[0].val+wisman.tahun[m].val+l;
        if(wisman.datacontent[keyLine]){
          contentLineWisman.push(wisman.datacontent[keyLine])
          axisCatLine.push(months[l-1]+"-"+wisman.tahun[m].label)
        }
      }
    }
    let lineOption = {
      title: {
        text: 'Jumlah Kunjungan Wisatawan Mancanegara \n(Grand Total) (Juta)' ,
        left: 'left',
        top:'2%',
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%%',
        right: '3%',
        bottom: '9%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          restore:{}
        }
      },
      color: '#0284C7',
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: axisCatLine,
      },
      dataZoom: [{bottom:'1%'},{type:"inside"}],
      yAxis: {
        show:true,
        type: 'value',
        axisLabel:{
          formatter:function (value) {
            return (value/1000000).toFixed(1);
        }
        },
        splitLine:{show:true},
        axisLine:{
          show:true
        }
      },
      series: {
        name: "Kunjungan Wisatawan Mancanegara",
        type: "line",
        data:contentLineWisman,
        symbolSize:1,
        label:{
          show:true,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:10,
          formatter:function(params){
            return (params.data/1000000).toFixed(1) ;

          },
          
        },
        labelLayout: { hideOverlap: true}
      }
    };


    let barOption = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Mancanegara' +'\n Berdasarkan Tahun (Ribu)',
        left: '2%',
        top:'0%',
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        }
      },
      
      legend:{
        show:true,
        orient:'vertical',
        left:'11%',
        top:'10%',
        

      },
      tooltip: {
        trigger: 'axis',
        axisPointer:{
          type:'none'
        }
  
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '7%',
        containLabel:true
      },
      // color: '#0284C7',
      xAxis: [
        {
          type: 'category',
          data: axisCat,
          axisTick: {
            show:false,
            alignWithLabel: true
          },
          axisLabel:{
            fontFamily:'sans-serif',
            fontSize:'15'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          show:true,
          splitLine:{
            show:true
          },
          axisLine:{
            show:true
          },
          axisLabel:{
            show:true,
            formatter:function(params){
              return (params/1000).toFixed(0);
            }
          }
          
        }
      ],
      color:pallete,
      series: contentWisman
    };
    contEl.setOption(barOption);
    contEl.hideLoading();
    contLineEl.setOption(lineOption);
    contLineEl.hideLoading();

  }) 

}


function geoScatterWisman(){
  $.get('../indicator/dataWisman',function(data,status){
    let contData = JSON.parse(JSON.stringify(data));
    let kunjungan = contData.kunjungan;
    let biaya = contData.biaya;
    let id = contData.id;
    let isoName = contData.iso;
    let option=[];
    let label=[];
    for(let i=0;i<kunjungan.tahun.length;i++){
      let tahunVal = kunjungan.tahun[i].val;
      let biayaLen = biaya.tahun.length -1;
      // console.log(biaya.tahun[biayaLen].val);
      // console.log(tahunVal);
      if(parseInt(biaya.tahun[biayaLen].val)>=parseInt(tahunVal)){
        let yearSeries=[]; //object in array
        let tempKunjungan=[]; //object in array
        let tempBiaya=[]; //array in array
        for(let j=0;j<kunjungan.vervar.length;j++){
          let newName=kunjungan.vervar[j].label;
          let keyData = kunjungan.vervar[j].val.toString()+kunjungan.var[0].val.toString()+kunjungan.turvar[0].val.toString()+tahunVal.toString()+"13";
          // console.log(kunjungan.datacontent[keyData]);
          if(kunjungan.datacontent[keyData]){
            
            if(isoName[kunjungan.vervar[j].val.toString()]){
             newName=isoName[kunjungan.vervar[j].val.toString()]; 
            }
            tempKunjungan.push({
              name:newName,
              value:kunjungan.datacontent[keyData]
            })
            // console.log(tempKunjungan);
          }
          else{
            let total=0;
            for(let m=1;m<13;m++){
              let keyData = kunjungan.vervar[j].val.toString()+kunjungan.var[0].val.toString()+kunjungan.turvar[0].val.toString()+tahunVal.toString()+m;
              if(kunjungan.datacontent[keyData]){
                total+=kunjungan.datacontent[keyData]
              }
            }
            if(isoName[kunjungan.vervar[j].val.toString()]){
             newName=isoName[kunjungan.vervar[j].val.toString()]; 
            }

            tempKunjungan.push({
              name:newName,
              value:total
            })
          }

        }
        for(let k=0;k<biaya.vervar.length;k++){
          let keyData2 = biaya.vervar[k].val.toString()+biaya.var[0].val.toString()+biaya.turvar[0].val.toString()+tahunVal.toString()+"0"; 
          // console.log(biaya.datacontent[keyData2]);
          // console.log(id[biaya.vervar[k].val]);
          if(biaya.datacontent[keyData2]){
            if(id[biaya.vervar[k].val]){
              let prop = CountryID.filter(function (d) {
                        return d.alpha3 === id[biaya.vervar[k].val];
                      });
              tempBiaya.push(
                {name:prop[0].name,
                  value:[prop[0].longitude,prop[0].latitude,biaya.datacontent[keyData2]]});
              // console.log(tempBiaya);
    
            }
            
          }          
        }

        label.push(parseInt(tahunVal)+1900);
        yearSeries.push({data:tempKunjungan});
        yearSeries.push({data:tempBiaya});
        option.push({
          title:{
            text:'Wisatawan Mancanegara Berdasarkan Kebangasaan dan \nRata-Rata Biaya yang Dikeluarkan per Kunjungan (US$)',
            textStyle:{
              fontSize:15,
              fontFamily:'sans-serif',
              fontWeight:'normal'
            }
          },
          series:yearSeries
        })

      }
      
    }
    // console.log(option);
    echarts.registerMap('world',CountryJSON );
    

    let geoWisman = echarts.init(document.getElementById('geoWisman'));
    let optionGeoScatter = {
      baseOption:{
        timeline:{
          axisType:"category",
          autoPlay:"false",
          data:label,
          controlStyle: {
            shadowOffsetX: 0
          }

        },
        toolbox: {
          feature: {
            saveAsImage: {},
            restore:{}
          }
        },
        title:{
          text:'Wisatawan Mancanegara Berdasarkan Kebangasaan dan \nRata-Rata Biaya yang Dikeluarkan per Kunjungan (US$)',
          textStyle:{
            fontSize:15,
            fontFamily:'sans-serif',
            fontWeight:'normal'
          }
        },
        tooltip:{
          show:true
        },
        legend:{},
        visualMap:{
          right: 'center',
          bottom: '15%',
          seriesIndex:0,
          min: 0,
          max: 100000,
        inRange: {
          color: [
            '#ffbaba',
            '#ff5252',
            '#ff0000',
            '#a70000'
            
            
            
            
          ]
        },
        text: ['Tinggi', 'Rendah'],
        textStyle:{
          fontSize: 12,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        
        },
        calculable: true,
        orient: 'horizontal',
        },
        geo:{
          map:'world',
          roam:true
        },
        series:[
          {
            name:"Kunjungan Wisman Berdasarkan Kebangsaan",
            type:'map',
            map:'world',
            roam:true,
            geoIndex:0
          },
          {
            name:'Rata-rata Biaya per Kunjungan',
            type:'scatter',
            symbolSize:function(val){
              var n = 10+val[2]/300;
              return n;
              
            },
            encode:{value:2},
            coordinateSystem:'geo',
            geoIndex:0,
            symbol:'image://https://cdn-icons-png.freepik.com/256/893/893097.png?semt=ais_hybrid',
            itemStyle:{
              opacity:0.9
            },
            
          }
        ]

      },
      options:option
    }
    geoWisman.setOption(optionGeoScatter);

  });
}
///list variables///
//constant//
const url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2201/';
const APIkey = 'key/cf78d9c72e168bfe677972ba792787af/';
const urlAsal = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1189/key/cf78d9c72e168bfe677972ba792787af/';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// const pallete = [
//   '#0A1D56', '#492E87', '#37B5B6', '#F2F597', '#FF9843', '#FFDD95',
//   '#86A7FC', '#3468C0', '#5F8670', '#FF9800', '#B80000', '#820300', '#607274', '#FAEED1',
//   '#DED0B6', '#B2A59B', '#610C9F', '#940B92', '#DA0C81',
//   '#E95793', '#900C3F', '#C70039', '#F94C10',
//   '#F8DE22', '#1DB9C3', '#7027A0', '#C32BAD', '#F56FAD', '#00EAD3', '#FFF5B7', '#FF449F', '#005F99', '#1B1A55', '#535C91', '#9290C3'
// ];
const pallete=['#E69F00',
'#56B4E9',
'#009E73',
'#F0E442',
'#0072B2',
'#D55E00',
'#CC79A7',
'#000000'];
//element variables//
var selectProvWisnus = document.getElementById("provWisnus");
var selectProvTPK = document.getElementById("provTPK");
var checkBoxWilayahTujuan = document.getElementById("listCheckBoxWilayahTujuan");
var checkBoxWilayahAsal = document.getElementById("listCheckBoxWilayahAsal");
var checkBoxWilayahTPK = document.getElementById("divWilayahTPK");
var minYearTPK = document.getElementById("minYear");
var maxYearTPK = document.getElementById("maxYear");
var yearTPK = document.getElementById("yearBoxTPK");
var tpkLine = echarts.init(document.getElementById("tpkBintang"));


///event handlers///
$('#exportChart1').click(function(){
  let modifiedURL = url+APIkey;
  $.get(modifiedURL,function(data,status){
    exportAllChart1(data);
  })
});

$("#provWisnus").change (function () {
  let value = $(this).val();
  firstSection(url, ["barYearWisnus", "lineYearWisnus"], value);
});
$("#provTPK").change (function () {
  let value = $(this).val();
  tpkCombineSeries(value);
  // firstSection(url, ["barYearWisnus", "lineYearWisnus"], value);
});
$('input[type=radio][name=seriesTPK]').on('change', function() {
  switch ($(this).val()) {
    case '0':
      $('.cbTPK').prop('disabled',true);
      $('#minYear,#maxYear').prop('disabled',false);
      $('#multiTPK').prop('checked',false);
      tpkLine.clear();
      tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
      break;
    case '1':
      $('.cbTPK').prop('disabled',false);
      $('#minYear,#maxYear').prop('disabled',true);
      $('#singleTPK').prop('checked',false);
      tpkLine.clear();
      tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
      break;
  }
});
// $("#dropdownCheckboxButtonWilayahAsal").click(() => {
//   $("#listCheckBoxWilayahAsal").toggleClass("hidden");
// });
// $("#dropdownCheckboxButtonWilayah").click(function() {
//   $("#listCheckBoxWilayahTujuan").toggleClass("hidden");
// });
// $('#closeCheckBox').click(function(){
//   $('#listCheckBoxWilayahTujuan').addClass("hidden");
// });
// $('#closeCheckBoxAsal').click(function(){
//   $('#listCheckBoxWilayahAsal').addClass("hidden");
// });
// $('#selectAllWilTujuan').click(function () {
//   $('.checkBoxWilayah').prop('checked',this.checked);
//   reloadData(url+APIkey);
// });
// $('#selectAllWilAsal').click(function () {
//   $('.checkBoxWilayahAsal').prop('checked',this.checked);
//   reloadDataAsal(urlAsal);
// });

// $("#selectTahunTujuan,#selectBulanTujuan").change(function() {
//   reloadData(url+APIkey);
// });
// $("#selectTahunAsal,#selectBulanAsal").change(function() {
//   reloadDataAsal(urlAsal)});
$("#btnInterval").click(function(){
  if(parseInt($('#sAkhirTujuan').val())<parseInt($('#sAwalTujuan').val())){
    alert('Range not Valid !');
  }
  else if(!$('#sAwalTujuan').val()){
    alert('Range not Valid !');

  }
  else{
    sectionTwo(url+APIkey);
  }
  
})
$("#btnIntervalAsal").click(function(){
  if(parseInt($('#sAkhirAsal').val())<parseInt($('#sAwalAsal').val())){
    alert('Range not Valid !');
  }
  else if(!$('#sAwalAsal').val()){
    alert('Range not Valid !');

  }
  else{
    sectionTwoAsal(urlAsal);
  }
  
})
$("#sTabJumlah").change(function(){
  $('#tabCont').empty();
  $('#tabulasiWisnus_wrapper').DataTable().destroy();
  // alert('tes');
  tabulasiWisnus(url+APIkey,parseInt($(this).val()),['119','120','121','122','123']);
})

var buttonWilayah = document.getElementById("dropdownCheckboxButtonWilayah");
var buttonWilayahAsal = document.getElementById("dropdownCheckboxButtonWilayahAsal");

var closeButton = document.getElementById("closeCheckBox");
var closeButtonAsal = document.getElementById("closeCheckBoxAsal");


var selectTahun = document.getElementById('selectTahunTujuan');
var selectBulan = document.getElementById('selectBulanTujuan');

var selectTahunAsal = document.getElementById('selectTahunAsal');
var selectBulanAsal = document.getElementById('selectBulanAsal');
var classWilayah = document.getElementsByClassName("checkBoxWilayah");
var classWilayahAsal = document.getElementsByClassName("checkBoxWilayahAsal");
var slctAllWilayah = document.getElementById("selectAllWilTujuan");
var slctAllWilayahAsal = document.getElementById("selectAllWilAsal");


function reloadDataAsal(url) {
  $.get(url, function(data, status) {
    let tahun = $('#selectTahunAsal').val();
    let bulan = $('#selectBulanAsal').val();
    let nameBulan = $('#selectBulanAsal option:selected').text();
    let nameTahun = $('#selectTahunAsal option:selected').text();
    let Wisnus = JSON.parse(JSON.stringify(data));
    let temp = ['provinsi', 'wisnus'];
    let dataWil = [temp];
    
    $('.checkBoxWilayahAsal').each(function() {
        if ($(this).is(":checked")) {
            let keyData = $(this).val() + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + tahun + bulan;
            temp = [];
            if (Wisnus.datacontent[keyData]) {
                temp.push(kdProvJSON[0][$(this).val()]);
                temp.push(Wisnus.datacontent[keyData]);
                dataWil.push(temp);
            }
        }
    });

    // console.log(dataWil);
    var raceBarAsal = echarts.init(document.getElementById("raceBarAsal"));
    var optionRace = {
        title: {
            text: 'Peringkat Provinsi Berdasarkan Jumlah Perjalanan Wisatawan Nusantara (Asal) ' + nameBulan + ' ' + nameTahun,
            left: 'center',
            textStyle: {
                fontSize: 15
            }
        },
        grid: {
            containLabel: true
        },
        xAxis: {},
        yAxis: {
            type: 'category',
            inverse: 'true',
            axisLabel: {
                fontWeight: 'bold'
            }
        },
        series: [{
            type: 'bar',
            encode: {
                x: 'wisnus',
                y: 'provinsi'
            },
            label: {
                show: true,
                precision: 1,
                position: 'right',
                fontFamily: 'serif'
            }
        }],
        dataset: {
            source: dataWil.sort(function(a, b) {
                return parseInt(b[1]) - parseInt(a[1]);
            })
        }
    };

    raceBarAsal.setOption(optionRace);
});
}

function reloadData(url) {
  $.get(url, function(data, status) {
    let tahun = $('#selectTahunTujuan').val();
    let bulan = $('#selectBulanTujuan').val();
    let nameBulan = $('#selectBulanTujuan option:selected').text();
    let nameTahun = $('#selectTahunTujuan option:selected').text();
    let Wisnus = JSON.parse(JSON.stringify(data));
    let temp = ['provinsi', 'wisnus'];
    let dataWil = [temp];
    // console.log(tahun,bulan,nameBulan,nameTahun);
    
    $('.checkBoxWilayah').each(function() {
        if ($(this).is(":checked")) {
            let keyData = $(this).val() + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + tahun + bulan;
            temp = [];
            if (Wisnus.datacontent[keyData]) {
                temp.push(kdProvJSON[0][$(this).val()]);
                temp.push(Wisnus.datacontent[keyData]);
                dataWil.push(temp);
            }
        }
    });

    //console.log(dataWil);
    var raceBarAsal = echarts.init(document.getElementById("raceBarTujuan"));
    var optionRace = {
        title: {
            text: 'Peringkat Provinsi Berdasarkan Jumlah Perjalanan Wisatawan Nusantara (Tujuan) ' + nameBulan + ' ' + nameTahun,
            left: 'center',
            textStyle: {
                fontSize: 15
            }
        },
        grid: {
            containLabel: true
        },
        xAxis: {},
        yAxis: {
            type: 'category',
            inverse: 'true',
            axisLabel: {
                fontWeight: 'bold'
            }
        },
        series: [{
            type: 'bar',
            encode: {
                x: 'wisnus',
                y: 'provinsi'
            },
            label: {
                show: true,
                precision: 1,
                position: 'right',
                fontFamily: 'serif'
            }
        }],
        dataset: {
            source: dataWil.sort(function(a, b) {
                return parseInt(b[1]) - parseInt(a[1]);
            })
        }
    };

    raceBarAsal.setOption(optionRace);
});
  
}

function reloadTPK(url) {
  
  $.get(url, function(data, status) {
    let tahun = $('#selectTahunTPK').val();
    // let bulan = $('#selectBulanTujuan').val();
    // let nameBulan = $('#selectBulanTujuan option:selected').text();
    // let nameTahun = $('#selectTahunTujuan option:selected').text();
    let TPK = JSON.parse(JSON.stringify(data));
    let seriesTPK=[];
    // let temp = ['provinsi', 'wisnus'];
    // let dataWil = [temp];
    // console.log(tahun,bulan,nameBulan,nameTahun);
    
    $('.checkBoxWilayahTPK').each(function() {
        if ($(this).is(":checked")) {
          // console.log("checked");
          let temp =[];
          let kode = $(this).val();
            for(let i=0;i<13;i++){
              let keyData = $(this).val() + TPK.var[0].val.toString() + TPK.turvar[0].val.toString() + 123 +i ;
              if(TPK.datacontent[keyData]){
                temp.push(TPK.datacontent[keyData]);
              }
            }
            seriesTPK.push({
              name:kdProvJSON[0][parseInt(kode)],
              type:'line',
              data:temp,
              label:{
                show:true,
                position:'top',
                fontFamily:'sans-serif',
                fontWeight:'bold',
                fontSize:8,
                distance:10,
                // formatter:function(params){
                //   return (params.data/satuan[1]).toFixed(1) ;
      
                // }
              },
              endLabel:{
                show:true,
                formatter: function(params){
                  return params.seriesName
                }
              }
            })
            }
        })
        // console.log(seriesTPK);
        var tpkLine = echarts.init(document.getElementById("tpkBintang"));
        tpkLine.showLoading();
        
    let tpkLineOption = {
      title: {
        text: 'Tingkat Penghunian Kamar '+ '\nTahun 2023',
        left: 'center',
        top:'0%',
        textStyle: {
          fontSize: 18,
          fontWeight:'bold',
          fontFamily:'serif',
          color:'black'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%%',
        right: '3%',
        bottom: '9%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          restore:{}
        }
      },
      color: '#0284C7',
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months,
      },
      // dataZoom: [{bottom:'1%'},{type:"inside"}],
      yAxis: {
        show:true,
        type: 'value',
        splitLine:{show:false},
        axisLine:{
          show:true
        }
      },
      series: []
    };
    tpkLine.setOption(tpkLineOption);
    tpkLine.hideLoading();
  // })

    });
    
  }

    //console.log(dataWil);
  

  $('#link1_1,#link1_2,#link1_3,#link1_4').click(function(){
    let a = $(this).attr('id').split("_")[1];
    let str = "section"+a;
    // console.log(a);
    // console.log(str);
    document.getElementById(str).scrollIntoView();
  });


 




window.onload = function () {
  var currentPage = window.location.href.split("//")[1].split("/")[1];
  if(currentPage=="index"){
    document.getElementById('link1').classList.add('text-white');
  }
  else if(currentPage=="brs"){
    document.getElementById('link3').classList.add('text-white');
  }
  else if(currentPage=="tabulasi"){
    document.getElementById('link2').classList.add('text-white');
  }

  let options = Object.entries(kdProvJSON[0]);
  for (let i = 0; i < 38; i++) {
    //section one
    var optionHTML = document.createElement("option");
    optionHTML.value = options[i][0];
    optionHTML.text = options[i][1];
    selectProvWisnus.add(optionHTML);
    var optionHTML = document.createElement("option");
    optionHTML.value = options[i][0];
    optionHTML.text = options[i][1];
    selectProvTPK.add(optionHTML);
    
    var element = document.createElement("input");
    element.type = "checkbox";
    element.value = options[i][0];
    element.classList.add("checkBoxWilayahTPK");
    // element.checked = false;
    checkBoxWilayahTPK.appendChild(element);
    var label = document.createElement("label");
    label.innerHTML=  " " + options[i][1];
    checkBoxWilayahTPK.appendChild(label);
    checkBoxWilayahTPK.appendChild(document.createElement("br"));

    

    //section two
    // var element = document.createElement("input");
    // element.type = "checkbox";
    // element.value = options[i][0];
    // element.classList.add("checkBoxWilayah");
    // element.checked = true;
    // //element.innerHTML = options[i][1];
    // checkBoxWilayahTujuan.appendChild(element);
    // var elementAsal = document.createElement("input");
    // elementAsal.type = "checkbox";
    // elementAsal.value = options[i][0];
    // elementAsal.classList.add("checkBoxWilayahAsal");
    // elementAsal.checked = true;
    // checkBoxWilayahAsal.appendChild(elementAsal);
    // var element2 = document.createElement("label");
    // element2.innerHTML = options[i][1];
    // var element3 = document.createElement("label");
    // element3.innerHTML = options[i][1];
    // checkBoxWilayahTujuan.appendChild(element2);
    // checkBoxWilayahAsal.appendChild(element3);
    // checkBoxWilayahTujuan.appendChild(document.createElement("br"));
    // checkBoxWilayahAsal.appendChild(document.createElement("br"));
  }
  $(".checkBoxWilayahTPK").change(function(){
    tpkLine.clear();
    tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
  });
  // $('.checkBoxWilayah').change(function () {
  //   if ($('.checkBoxWilayah:checked').length == $('.checkBoxWilayah').length){
  //   $('#selectAllWilTujuan').prop('checked',true);
  //   reloadData(url+APIkey);
  //   }
  //   else {
  //   $('#selectAllWilTujuan').prop('checked',false);
  //   reloadData(url+APIkey);
  //   }
  //   });
 
  //   $('.checkBoxWilayahAsal').change(function () {
  //     if ($('.checkBoxWilayahAsal:checked').length == $('.checkBoxWilayahAsal').length){
  //     $('#selectAllWilAsal').prop('checked',true);
  //     reloadDataAsal(urlAsal);
  //     }
  //     else {
  //     $('#selectAllWilAsal').prop('checked',false);
  //     reloadDataAsal(urlAsal);
  //     }
  //     });
  firstSection(url, ["barYearWisnus", "lineYearWisnus"], '9999');
  sectionTwo(url+APIkey);
  sectionTwoAsal(urlAsal);
  //reloadData(url+APIkey);
  //reloadDataAsal(urlAsal);  
  tabulasiWisnus(url+APIkey,1,['119','120','121','122','123']);
  // mapStory();
  tpkCreateFilter();
  $('#singleTPK').prop('checked',true);
  tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
  tpkCombineSeries("9999");
  wismanBar("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1470/");
  geoScatterWisman();
  $('#tes1').hover(function(){
    $('#menuLink1').toggleClass('hidden');
  })

  
}


// $(document).ready(function(){
//   //alert('hi');
  
// });
