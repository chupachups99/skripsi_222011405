 
function firstSection(url, kode) {
  var barYearWisnus = echarts.init(document.getElementById("barYearWisnus")); //function firstSection
  var lineYearWisnus = echarts.init(document.getElementById("lineYearWisnus")); //function firstSection
  barYearWisnus.showLoading();
  lineYearWisnus.showLoading();
  let labelYear = []; //menyimpan xAxis barChart yaitu tahun
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
    kode = kode.split(";"); //untuk iterasi satu atau lebih wilayah (pulau)
    
    for (let i = 0; i < (Wisnus.tahun.length); i++) { //iterasi per tahun
      labelYear.push(Wisnus.tahun[i].label.toString()); //push tahun (barchart)
      let temp = []; //temporary array for series tahun
      let temp2 = []; //temporary array for series bulan
      let keyData; //key untuk akses value datacontent API
      let keyData2; //key untuk akses value datacontent API
      let sum =0; //variabel untuk increment nilai wisnus tahunan per wilayah
      
      let isYearData=true; //boolean apakah data tahunan tersedia
       
        for (let j = 0; j < 12; j++) { // iterasi per bulan 
          let sum2 =0; //variabel untuk increment nilai wisnus bulanan per wilayah
          labelMonths.push(months[j]+'-'+Wisnus.tahun[i].label.toString()) //push bulan (linechart)
          for(let p = 0;p<kode.length;p++){ //iterasi wilayah 
            if(j==0){ 
              //key untuk nilai wisnus tahunan
              keyData = kode[p] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[12].val.toString();
              if(Wisnus.datacontent[keyData]){ //check apakah data tersedia pada key tertentu
                sum = sum + parseInt(Wisnus.datacontent[keyData]); //add nilai wisnus bulanan per wilayah to var sum2
              }
              else{
                isYearData=false;
              }
            }
            //key untuk nilai wisnus bulanan
            keyData2 = kode[p] + Wisnus.var[0].val.toString() + Wisnus.turvar[0].val.toString() + Wisnus.tahun[i].val.toString() + Wisnus.turtahun[j].val.toString();
            if(Wisnus.datacontent[keyData2]){
              sum2= sum2+parseInt(Wisnus.datacontent[keyData2]); //add nilai wisnus bulanan per wilayah to var sum2
            }
        }
        if(sum2>0){
          contentMonths.push(sum2) //push nilai akumulasi bulanan 
        }
        else{
          contentMonths.push('-');
        }
      }
      if(isYearData){
        contentYear.push(sum);
      }
      else{
        let modBulan = len(contentMonths)%12;
        let upVal = len(contentMonths);
        let lowVal = upVal-modBulan;
        let sliceMonths =contentMonths.slice(lowVal,upVal); 
        contentYear.push(sliceMonths.reduce((accumulator,currentValue)=>{ 
          if(typeof(accumulator)=="number" && typeof(currentValue)=="number")
            {
              return accumulator+currentValue
            }
          else{return accumulator}
        },0)
          )
      }
      
      
    }
    let units=[];
    let unitLabel =[];
    
    if(contentYear[0]>=1000000){
      units.push(1000000);
      unitLabel.push('(Juta)')
    }
    else if(contentYear[0]>=1000){
      units.push(1000);
      unitLabel.push('(Ribu)');
    }
    else{
      units.push(1);
      unitLabel.push('');
    }
    if(contentMonths[0]>=1000000){
      units.push(1000000);
      unitLabel.push('(Juta)')
    }
    else if(contentMonths[0]>=1000){
      units.push(1000);
      unitLabel.push('(Ribu)')
    }
    else{
      units.push(1);
      unitLabel.push('');
    }

    var optionBar = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Nusantara ' + wilayah + '\nBerdasarkan Tahun '+unitLabel[0],
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
        left: '40',
        right: '6%',
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
          name:'Wisatawan Nusantara '+unitLabel[0],
          nameLocation:'middle',
          nameGap:30,
          show:true,
          splitLine:{
            show:true
          },
          axisLine:{
            show:false
          },
          axisLabel:{
            show:true,
            formatter:function(params){
                return params/units[0].toFixed(0);
            }
          },
          nameTextStyle:{
            fontFamily:'sans-serif',
            fontWeight:'bold',
            fontSize:14,
          }
          
        }
      ],
      //color:'rgb(55 48 163)',
      series: [
        {
          name: 'Wisatawan Nusantara',
          type: 'bar',
          barWidth: '70%',
          label: {
            show: true,
            formatter:function(params){
              return (params.value/units[0]).toFixed(2);
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
        text: 'Jumlah Perjalanan Wisatawan Nusantara ' + wilayah + '\nBerdasarkan Bulan dan Tahun '+unitLabel[1],
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
        left: '40',
        right: '5%',
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
            return (value/units[1]).toFixed(0);
        }
        },
        name:'Wisatawan Nusantara '+unitLabel[1],
        nameLocation:'middle',
        nameGap:30,
        splitLine:{show:true},
        axisLine:{
          show:false
        },
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
      },
      series: {
        name: "Wisatawan Nusantara",
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
            let monYoy = contentMonths.length%12;
            if((params.dataIndex+1)%12==monYoy){
              return (params.data/units[1]).toFixed(2);
            }
            else{
              return '';
            }

        

          }
        },
        // labelLayout:{hideOverlap:true}
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
    let a = -1;
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
    text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan '+'('+timeline[0]+
    ' — '+timeline[timeline.length-1]+")";
    }else if(endVal=="Pilih Rentang Waktu Akhir"){timeline=labelMonths[beginVal];
      text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan '+timeline;

      // console.log(beginVal);
    }
    else{
     timeline = labelMonths.slice(beginVal,parseInt(endVal)+1);
     text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Tujuan '+'('+timeline[0]+'-'+timeline[timeline.length-1]+")";
    
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
          fontFamily:"sans-serif",
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
        textStyle: {
          fontSize: 15,
          fontWeight:'normal',
          fontFamily:'sans-serif',
          color:'black'
        },
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
        
          
        },
        axisLine:{show:true},
        splitLine:{show:false}
       },
      yAxis: {
        axisLabel:{
          show :true,
          fontFamily:'sans-serif',
          fontSize:'8',
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
          barWidth:'70%',
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
            fontSize:'12px'
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
            fontSize: '10'
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
     text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal '+'('+timeline[0]+
     ' — '+timeline[timeline.length-1]+")";
     }else if(endVal=="Pilih Rentang Waktu Akhir"){timeline=labelMonths[beginVal];
       text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal '+timeline;
 
       // console.log(beginVal);
     }
     else{
      timeline = labelMonths.slice(beginVal,parseInt(endVal)+1);
      text='Persebaran Jumlah Perjalanan Wisatawan Nusantara' + '\n' + 'Menurut Provinsi Asal '+'('+timeline[0]+'-'+timeline[timeline.length-1]+")";
     
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
          fontFamily:"sans-serif",
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
            '#D8F3DC',
            
            '#95D5B2',
            '#52B788',
            '#2D6A4F',
            '#1B4332',
            
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
    color:'#2D6A4F',
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
          fontSize:'8',
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
          barWidth:'70%',
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
            fontSize:'12px'
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
            fontSize: '10'
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
  var bool=false;
  var reqUrl = url+APIkey;
  $.get(reqUrl,function(data,status){
    let tpkData = JSON.parse(JSON.stringify(data));
    if(wilayah.length>0){
      if($('#singleTPK').is(':checked')){
        bool=true;
      for(let k=0;k<wilayah.length;k++){
        let temp =[];
        for(let i=tpkData.tahun[0].val;i<=tpkData.tahun[tpkData.tahun.length-1].val;i++){
          for(let j=1;j<13;j++){
            
            let key = wilayah[k]+tpkData.var[0].val+tpkData.turvar[0].val+i+j;
            if(tpkData.datacontent[key]){
              temp.push(tpkData.datacontent[key]);
              if(k==0){
                labelTpkLine.push(months[j-1]+'-'+parseInt(parseInt(i)+1900));
              }
            }
            else{
              temp.push('-')
            }
          }
          
  
        }
        
          let seriesOption = {
          name: kdProvJSON[0][wilayah[k]],
          type: "line",
          data:temp,
          seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
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
          // labelLayout:{hideOverlap:true},
          endLabel:{
            show:true,
            formatter:function(params){
              return params.seriesName;
            },
            fontFamily:'sans-serif',
            fontWeight:'bold',
            fontSize:10,
          }
          }
          console.log(temp);
          if(wilayah.length==1){
            seriesOption["label"]= {
              show:true,
              position:'top',
              formatter :function(params){
                let monYoy = temp.length%12;
                  if((params.dataIndex+1)%12==monYoy){
                    return params.data.toFixed(2);
                  }
                  else{
                    return '';
                  }

              },
              fontFamily:'sans-serif',
              fontWeight:'bold',
              fontSize:10,
              distance:3,            
            }
          }

          contentTpkLine.push(seriesOption)
      }
      
      }
      else{
        bool=false;
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
            seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
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
        left: '40',
        right: '100',
        bottom: '9%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          
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
          show:false
        },
        name:"TPK (%)",
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
    if(bool){
      tpkLineOption.dataZoom=[{bottom:'1%'},{type:"inside"}];
    }
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
        text: 'Tingkat Penghunian Kamar Hotel Bintang dan Nonbintang'+'\ndan Akomdasi Lainnya di '+kdProvJSON[0][wilayah] +' (%)',
        left: '2%',
        top:'0',
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
        left: '40',
        right: '100',
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
        splitLine:{show:true},
        axisLine:{
          show:false
        },
        name:"TPK (%)",
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
        name: "Hotel\n Bintang",
        type: "line",
        data:seriesBintang,
        // contentTpkLine,
        symbolSize:1,
        label:{
          show:false,
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
        name: "Hotel \nNonbintang\ndan Akomodasi\nLainnya",
        type: "line",
        data:seriesNonBintang,
        // contentTpkLine,
        symbolSize:1,
        label:{
          show:false,
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
    let index=0;
    for(let i=TPK.tahun.length-1;i>-1;i--){
      // var optionDd = document.createElement("option");
      // optionDd.value = TPK.tahun[i].val;
      // optionDd.text = TPK.tahun[i].label;
      // minYearTPK.appendChild(optionDd);
      // var optionDd2 = document.createElement("option");
      // optionDd2.value = TPK.tahun[i].val;
      // optionDd2.text = TPK.tahun[i].label;
      // maxYearTPK.appendChild(optionDd2);
      
      var optionBox = document.createElement("input");
      optionBox.type="checkbox";
      optionBox.value = TPK.tahun[i].val;
      optionBox.disabled = true;
      optionBox.classList.add("cbTPK");
      yearTPK.appendChild(optionBox);
      var labelBox = document.createElement("label");
      if(index%4==3){
        labelBox.innerHTML=" "+TPK.tahun[i].label;
        yearTPK.appendChild(labelBox);
        yearTPK.appendChild(document.createElement("br"));
      }else{
        labelBox.innerHTML=" "+TPK.tahun[i].label+"&nbsp;&nbsp;&nbsp;";
        yearTPK.appendChild(labelBox);
      }
      index++;
    }
    $('.cbTPK').change(function(){
      tpkLine.clear();
      tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
    });
    // minYearTPK.value = TPK.tahun[0].val;
    // maxYearTPK.value = TPK.tahun[TPK.tahun.length-1].val;
  })
}

function wismanDoor(){
$.get('https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1150/vervar/26;18;1;33/key/cf78d9c72e168bfe677972ba792787af',function(data,status){
  let wisman = JSON.parse(JSON.stringify(data));
  var instanceBar = echarts.init(document.getElementById('barPintuMasuk'));
  var instanceLine = echarts.init(document.getElementById('linePintuMasuk'));
  instanceBar.showLoading();
  instanceLine.showLoading();
  let barSeries=[];
  let lineSeries =[];
  barSeries.push(["Tahun","Pintu Udara","Pintu Laut","Pintu Darat","Total"]);
  lineSeries.push(["Waktu","Pintu Udara","Pintu Laut","Pintu Darat","Total"]);
  // let totalSeries=[];
  for(let i=0;i<wisman.tahun.length;i++){
    let seriesTahun=[];
    seriesTahun.push(wisman.tahun[i].label);
    for(let j=0;j<wisman.turtahun.length;j++){
      let seriesBulan=[];
      let temp=0;
      seriesBulan.push(wisman.turtahun[j].label.slice(0,3)+"-"+wisman.tahun[i].label);
      for(let k=0;k<wisman.vervar.length;k++){
        let key = wisman.vervar[k].val.toString()+wisman.var[0].val.toString()+wisman.turvar[0].val.toString()+wisman.tahun[i].val+wisman.turtahun[j].val;
        if(wisman.datacontent[key]){
          if(j==12){
            seriesTahun.push(wisman.datacontent[key])
          }
          else{
            temp+=
            seriesBulan.push(wisman.datacontent[key])
          }
          
          
        }
        else if(!wisman.datacontent[key] & j==12){
          let countData= lineSeries.slice(lineSeries.length-12,lineSeries.length);
          let udara=0;
          let darat=0;
          let laut=0;
          let total =0;
          
            for(let x=0;x<12;x++){
              udara+=parseInt(countData[x][1]);
              laut+=parseInt(countData[x][2]);
              darat+=parseInt(countData[x][3]);
              total+=parseInt(countData[x][4])
            }
            seriesTahun.push(udara);
            seriesTahun.push(laut);
            seriesTahun.push(darat);
            seriesTahun.push(total);
          


        }
        else{
          seriesBulan.push('-')
        }
      }
      if(j!=12){
        lineSeries.push(seriesBulan);
      }
      
    }
    
      barSeries.push(seriesTahun);
    
    
  }
  

  let lineOption = {
    title: {
      text: 'Total Kunjungan Wisatawan Mancanegara ke Indonesia\nMenurut Pintu Masuk (Juta)' ,
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
      right: '7%',
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
    },
    dataZoom: [{bottom:'1%'},{type:"inside"}],
    dataset:{
      source:lineSeries
    },
    yAxis: {
      show:true,
      type: 'value',
      axisLabel:{
        formatter:function (value) {
          return (value/1000000).toFixed(1);
      }
      },
      name:"Wisatawan Mancanegara (Juta)",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:25,

      splitLine:{show:true},
      axisLine:{
        show:false
      }
    },
    series: [{
      
      type: "line",
      
      symbolSize:1,
      label:{
        show:false,
        position:'top',
        fontFamily:'sans-serif',
        fontWeight:'bold',
        fontSize:10,
        distance:10,
        formatter:function(params){
          return (params.data[1]/1000).toFixed(1) ;

        },
        
      },
      endLabel:{
        show:true,
        formatter: function(params){
          return params.seriesName
        }
      },
      labelLayout: { hideOverlap: true}
    },
    {
      
      type: "line",
      
      symbolSize:1,
      label:{
        show:false,
        position:'top',
        fontFamily:'sans-serif',
        fontWeight:'bold',
        fontSize:10,
        distance:10,
        formatter:function(params){
          return (params.data[2]/1000).toFixed(1) ;

        },
        
        
      },
      endLabel:{
        show:true,
        formatter: function(params){
          return params.seriesName
        }
      },
      labelLayout: { hideOverlap: true}
    },
    {
      
      type: "line",
      
      symbolSize:1,
      label:{
        show:false,
        position:'top',
        fontFamily:'sans-serif',
        fontWeight:'bold',
        fontSize:10,
        distance:10,
        formatter:function(params){
          return (params.data[3]/1000).toFixed(1) ;

        },
        
      },
      endLabel:{
        show:true,
        formatter: function(params){
          return params.seriesName
        }
      },
      labelLayout: { hideOverlap: true}
    },
  ]
  };
  instanceLine.setOption(lineOption);
  instanceLine.hideLoading();


  let barOption = {
    title: {
      text: 'Jumlah Kunjungan Wisatawan Mancanegara \nMenurut Pintu Masuk (Juta)',
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
      orient:'horizontal',
      top:'40'

    },
    tooltip: {
      trigger: 'axis',
      axisPointer:{
        type:'none'
      }

    },
    grid: {
      left: '5%',
      right: '2%',
      bottom: '2%',
      top:'60',
      // containLabel:true
    },
    dataset:{source:barSeries},
    // color: '#0284C7',
    xAxis: [
      {
        type: 'category',
        
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
          show:false
        },
        name:'Wistatawan Mancanegara (Juta)',
        // name:"TPK (%)",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:25,
        axisLabel:{
          show:true,
          formatter:function(params){
            return (params/1000000).toFixed(0);
          }
        }
        
      }
    ],
    // color:pallete,
    series: [{type:'bar'},{type:'bar'},{type:'bar'}, {type:'line',symbolSize:1,itemStyle: {color: 'black'},}]
  };
  instanceBar.setOption(barOption);
  instanceBar.hideLoading();
  
  
  
})
}


function wisnasDoor(){
  $.get('https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2195/vervar/2;19;26/key/cf78d9c72e168bfe677972ba792787af',function(data,status){
    let wisman = JSON.parse(JSON.stringify(data));
    var instanceBar = echarts.init(document.getElementById('barNasPintuMasuk'));
    var instanceLine = echarts.init(document.getElementById('lineNasPintuMasuk'));
    instanceBar.showLoading();
    instanceLine.showLoading();
    let barSeries=[];
    let lineSeries =[];
    barSeries.push(["Tahun","Pintu Udara","Pintu Laut","Pintu Darat"]);
    lineSeries.push(["Waktu","Pintu Udara","Pintu Laut","Pintu Darat"]);
    for(let i=0;i<wisman.tahun.length;i++){
      let seriesTahun=[];
      seriesTahun.push(wisman.tahun[i].label);
      for(let j=0;j<wisman.turtahun.length;j++){
        let seriesBulan=[];
        let temp=0;
        seriesBulan.push(wisman.turtahun[j].label.slice(0,3)+"-"+wisman.tahun[i].label);
        for(let k=0;k<wisman.vervar.length;k++){
          let key = wisman.vervar[k].val.toString()+wisman.var[0].val.toString()+wisman.turvar[0].val.toString()+wisman.tahun[i].val+wisman.turtahun[j].val;
          if(wisman.datacontent[key]){
            if(j==12){
              seriesTahun.push(wisman.datacontent[key])
            }
            else{
              temp+=
              seriesBulan.push(wisman.datacontent[key])
            }
            
            
          }
          else if(!wisman.datacontent[key] & j==12){
            let countData= lineSeries.slice(lineSeries.length-12,lineSeries.length);
            let udara=0;
            let darat=0;
            let laut=0;
            
              for(let x=0;x<12;x++){
                udara+=parseInt(countData[x][1]);
                laut+=parseInt(countData[x][2]);
                darat+=parseInt(countData[x][3]);
  
              }
              seriesTahun.push(udara);
              seriesTahun.push(laut);
              seriesTahun.push(darat);
            
  
  
          }
          else{
            seriesBulan.push('-')
          }
        }
        if(j!=12){
          lineSeries.push(seriesBulan);
        }
        
      }
      
        barSeries.push(seriesTahun);
      
      
    }
    let lineOption = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Nasional\nMenurut Pintu Masuk (Ribu)' ,
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
        left: '40',
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
      // color: '#0284C7',
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
      dataZoom: [{bottom:'1%'},{type:"inside"}],
      dataset:{
        source:lineSeries
      },
      yAxis: {
        show:true,
        type: 'value',
        axisLabel:{
          formatter:function (value) {
            return (value/1000).toFixed(0);
        }
        },
        splitLine:{show:true},
        axisLine:{
          show:true
        }
      },
      series: [{
        
        type: "line",
        
        symbolSize:2,
        label:{
          show:false,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:10,
          formatter:function(params){
            return (params.data[1]/1000).toFixed(1) ;
  
          },
          
        },
        endLabel:{
          show:true,
          formatter: function(params){
            return params.seriesName
          }
        },
        labelLayout: { hideOverlap: true}
      },
      {
        
        type: "line",
        
        symbolSize:2,
        label:{
          show:false,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:10,
          formatter:function(params){
            return (params.data[2]/1000).toFixed(1) ;
  
          },
          
          
        },
        endLabel:{
          show:true,
          formatter: function(params){
            return params.seriesName
          }
        },
        labelLayout: { hideOverlap: true}
      },
      {
        
        type: "line",
        
        symbolSize:2,
        label:{
          show:false,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:10,
          formatter:function(params){
            return (params.data[3]/1000).toFixed(1) ;
  
          },
          
        },
        endLabel:{
          show:true,
          formatter: function(params){
            return params.seriesName
          }
        },
        labelLayout: { hideOverlap: true}
      },
    ]
    };
    instanceLine.setOption(lineOption);
    instanceLine.hideLoading();
  
  
    let barOption = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Nasional\nMenurut Pintu Masuk (Ribu)',
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
        orient:'horizontal',
        top:'40'
  
      },
      tooltip: {
        trigger: 'axis',
        axisPointer:{
          type:'none'
        }
  
      },
      grid: {
        left: '40',
        right: '4%',
        bottom: '7%',
        top:'60'
        // containLabel:true
      },
      dataset:{source:barSeries},
      // color: '#0284C7',
      xAxis: [
        {
          type: 'category',
          
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
      // color:pallete,
      series: [{type:'bar'},{type:'bar'},{type:'bar'}]
    };
    instanceBar.setOption(barOption);
    instanceBar.hideLoading();
    
    
    
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

    let units=[];
    let unitLabel =[];
    
    if(contentWisman[0]["data"][0]>=1000000){
      units.push(1000000);
      unitLabel.push('(Juta)')
    }
    else if(contentWisman[0]["data"][0]=1000){
      units.push(1000);
      unitLabel.push('(Ribu)');
    }
    else{
      units.push(1);
      unitLabel.push('');
    }
    if(contentLineWisman[0]>=1000000){
      units.push(1000000);
      unitLabel.push('(Juta)')
    }
    else if(contentLineWisman[0]>=1000){
      units.push(1000);
      unitLabel.push('(Ribu)')
    }
    else{
      units.push(1);
      unitLabel.push('');
    }

    let lineOption = {
      title: {
        text: 'Jumlah Kunjungan Wisatawan Mancanegara \nGrand Total '+unitLabel[1] ,
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
        left: '40',
        right: '3%',
        bottom: '20',
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
            return (value/units[1]).toFixed(1);
        }
        },
        splitLine:{show:true},
        axisLine:{
          show:false
        },
        name:"Wisatawan Mancanegara (Juta)",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:30
      },
      series: {
        name: "Kunjungan Wisatawan Mancanegara",
        type: "line",
        data:contentLineWisman,
        symbolSize:1,
        label:{
          show:false,
          position:'top',
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:10,
          distance:10,
          formatter:function(params){
            return (params.data/units[1]).toFixed(1) ;

          },
          
        },
        labelLayout: { hideOverlap: true}
      }
    };


    let barOption = {
      title: {
        text: 'Jumlah Perjalanan Wisatawan Mancanegara' +'\n Berdasarkan Tahun '+unitLabel[0],
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
        orient:'horizontal',
        left:'1%',
        bottom:'2%',
        textStyle:{
          fontSize : 8,
          fontFamily:'sans-serif',
          fontWeight:'bold'
        }
        
        

      },
      tooltip: {
        trigger: 'axis',
        axisPointer:{
          type:'none'
        }
  
      },
      grid: {
        left: '9%',
        right: '3%',
        bottom: '12%',
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
            show:false
          },
          axisLabel:{
            show:true,
            formatter:function(params){
              return (params/units[0]).toFixed(0);
            }
          },
          name:"Wisatawan Nusantara (Juta)",
        nameLocation:"center",
        nameTextStyle:{
          fontFamily:'sans-serif',
          fontWeight:'bold',
          fontSize:14,
        },
        nameGap:30
          
        }
      ],
      // color:pallete,
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
        grid: {
          left: '7%',
          right: '6%',
          top:'60',
          bottom: '3%',
          // containLabel:true
        },
        legend:{
          top:'40',
          left:'left',
          width:'30%',
          height:'20%',
          
          data: [{
            name: 'Rata-rata Biaya per Kunjungan',
            // compulsorily set icon as a circle
            icon: 'image://https://www.pngall.com/wp-content/uploads/2016/07/Dollar-PNG.png',
            // set up the text in red
            textStyle: {
                color: 'black',
                fontWeight:'semibold'
            }
        }]
        },
        visualMap:{
          right: 'right',
          bottom: '15%',
          seriesIndex:0,
          min: 0,
          max: 100000,
        inRange: {
          color: [
            // '#ffbaba',
            // '#ff5252',
            // '#ff0000',
            // '#a70000'
            
            '#FEFFD2',
'#FFEEA9',
'#FFBF78',
'#FF7D29',

            
            
            
            
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
              var n = val[2]/100;
              return n;
              
            },
            encode:{value:2},
            coordinateSystem:'geo',
            geoIndex:0,
            symbol:'image://https://www.pngall.com/wp-content/uploads/2016/07/Dollar-PNG.png',
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
// var minYearTPK = document.getElementById("minYear");
// var maxYearTPK = document.getElementById("maxYear");
var yearTPK = document.getElementById("yearBoxTPK");
var tpkLine = echarts.init(document.getElementById("tpkBintang"));


///event handlers///


$("#provWisnus").change (function () {
  let value = $(this).val();
  firstSection(url,value);
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
      // $('#minYear,#maxYear').prop('disabled',false);
      $('#multiTPK').prop('checked',false);
      tpkLine.clear();
      tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
      break;
    case '1':
      $('.cbTPK').prop('disabled',false);
      // $('#minYear,#maxYear').prop('disabled',true);
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


 function generateDatatable(url,id){
  $.get(url,function(data,status){
    const parsedData = JSON.parse(JSON.stringify(data));
    let jId = '#'+id;
    $(jId).empty();
    var table = $('<table class="createdTable display nowrap bg-white" style="width:100%"></table>');
    var thead = $('<thead></thead>');
    
    let rowspan=2;
    let header = [];
    if(parsedData.turvar.length>1){
      rowspan+=1
      let tr = $('<tr></tr>');
      for(let i = 0;i<parsedData.turvar.length;i++){
        let a  = parsedData.turtahun.length;
        tr.append('<th colspan="'+a+'" style="text-align:center">'+parsedData.turvar[i].label+'</th>');
      }
      header.push(tr);
    }
    if(parsedData.turtahun.length>1){
      rowspan+=1
      let tr = $('<tr></tr>');
      for(let i = 0;i<parsedData.turtahun.length;i++){
        tr.append('<th>'+parsedData.turtahun[i].label+'</th>');
      }
      header.push(tr);
    }
    let colspan = parsedData.turtahun.length*parsedData.turvar.length;
    
    
    thead.append(`<tr>
                    <th style="text-align:center" rowspan="`+rowspan+`">`+parsedData.labelvervar+`</th>
                    <th  style="text-align:center" colspan="`+colspan+`">`+parsedData.var[0].label+` (`+parsedData.var[0].unit+`) `+`</th>
                  </tr>`);
    thead.append('<tr><th style="text-align:center" colspan="'+colspan+'">'+parsedData.tahun[0].label+'</th></tr>');
    for(let i=0;i<header.length;i++){
      thead.append(header[i]);
    }
    table.append(thead);
    

    
    var tbody = $('<tbody></tbody>');
    for(let i=0;i<parsedData.vervar.length;i++){
      var row = $('<tr></tr>');
      row.append('<td>'+parsedData.vervar[i].label+'</td>');
      for(let j=0;j<parsedData.turvar.length;j++){
        for(let k=0;k<parsedData.turtahun.length;k++){
          let key = parsedData.vervar[i].val.toString()+parsedData.var[0].val.toString()+parsedData.turvar[j].val.toString()+parsedData.tahun[0].val.toString()+parsedData.turtahun[k].val.toString();
          let cellData = parsedData.datacontent[key]
          if(cellData){
            row.append('<td>'+cellData+'</td>');
          }
          else{
            row.append('<td>-</td>');
          }
        }
        
      }
      tbody.append(row);
    }
    table.append(tbody);
    $(jId).append(table);

    let str = jId+' .createdTable'
    var newTab = new DataTable(str,{
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
            title:parsedData.var[0].label+' - '+parsedData.tahun[0].label,
    
          }]
        }
      }
      ,
      scrollY:'12rem',
      scrollX:'92dvw',
      paging:false,
      info:false
    });
    // newTab.columns.adjust().draw();


    

  })

 }


 $('#varWisnus').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisnus').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  $.get(url,function(data,status){
    $('#tahunWisnus').empty();
    
    let wisnus = JSON.parse(JSON.stringify(data))
    for(let i=0;i<wisnus.tahun.length;i++){
      let listTahun = $('<option value="'+wisnus.tahun[i].val+'">'+wisnus.tahun[i].label+'</option>');
      $('#tahunWisnus').append(listTahun);
    }
    $('#tahunWisnus').val(wisnus.tahun[wisnus.tahun.length-1].val);
    
  let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisnus').val()+'/th/'+$('#tahunWisnus').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  generateDatatable(newUrl,'tabCont');
  })
 })

 $('#tahunWisnus').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisnus').val()+'/th/'+$(this).val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  generateDatatable(url,'tabCont');
 })

 $('#varTPK').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varTPK').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  $.get(url,function(data,status){
    $('#tahunTPK').empty();
    
    let TPK = JSON.parse(JSON.stringify(data))
    for(let i=0;i<TPK.tahun.length;i++){
      let listTahun = $('<option value="'+TPK.tahun[i].val+'">'+TPK.tahun[i].label+'</option>');
      $('#tahunTPK').append(listTahun);
    }
    $('#tahunTPK').val(TPK.tahun[TPK.tahun.length-1].val);
    let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varTPK').val()+'/th/'+$('#tahunTPK').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
    generateDatatable(newUrl,'tabContTPK');
  })
  
 })

 $('#tahunTPK').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varTPK').val()+'/th/'+$(this).val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  generateDatatable(url,'tabContTPK');
 })

 $('#varWisman').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisman').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  $.get(url,function(data,status){
    $('#tahunWisman').empty();
    
    let Wisman = JSON.parse(JSON.stringify(data))
    for(let i=0;i<Wisman.tahun.length;i++){
      let listTahun = $('<option value="'+Wisman.tahun[i].val+'">'+Wisman.tahun[i].label+'</option>');
      $('#tahunWisman').append(listTahun);
    }
    $('#tahunWisman').val(Wisman.tahun[Wisman.tahun.length-1].val);
    let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisman').val()+'/th/'+$('#tahunWisman').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
    generateDatatable(newUrl,'tabContWisman');
  })
  
 })

 $('#tahunWisman').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisman').val()+'/th/'+$(this).val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  generateDatatable(url,'tabContWisman');
 })

 $('#tahunWisnas').change(function(){
  let url = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2195/th/'+$(this).val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  generateDatatable(url,'tabContWisnas');
 })





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

    

    
  }
  let strUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisnus').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  $.get(strUrl,function(data,status){
    $('#tahunWisnus').empty();
    let wisnus = JSON.parse(JSON.stringify(data))
    for(let i=0;i<wisnus.tahun.length;i++){
      let listTahun = $('<option value="'+wisnus.tahun[i].val+'">'+wisnus.tahun[i].label+'</option>');
      $('#tahunWisnus').append(listTahun);
    }
    $('#tahunWisnus').val(wisnus.tahun[wisnus.tahun.length-1].val);
    let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisnus').val()+'/th/'+$('#tahunWisnus').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
    generateDatatable(newUrl,'tabCont');
  })

  let strUrlTPK = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varTPK').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
  $.get(strUrlTPK,function(data,status){
    $('#tahunTPK').empty();
    let TPK = JSON.parse(JSON.stringify(data))
    for(let i=0;i<TPK.tahun.length;i++){
      let listTahun = $('<option value="'+TPK.tahun[i].val+'">'+TPK.tahun[i].label+'</option>');
      $('#tahunTPK').append(listTahun);
    }
    $('#tahunTPK').val(TPK.tahun[TPK.tahun.length-1].val);
    let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varTPK').val()+'/th/'+$('#tahunTPK').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
    generateDatatable(newUrl,'tabContTPK');
  })

  let strUrlWisman = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisman').val()+'/vervar/1/key/cf78d9c72e168bfe677972ba792787af/';
  $.get(strUrlWisman,function(data,status){
    $('#tahunWisman').empty();
    let Wisman = JSON.parse(JSON.stringify(data))
    for(let i=0;i<Wisman.tahun.length;i++){
      let listTahun = $('<option value="'+Wisman.tahun[i].val+'">'+Wisman.tahun[i].label+'</option>');
      $('#tahunWisman').append(listTahun);
    }
    $('#tahunWisman').val(Wisman.tahun[Wisman.tahun.length-1].val);
    let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/'+$('#varWisman').val()+'/th/'+$('#tahunWisman').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
    generateDatatable(newUrl,'tabContWisman');
  })

  let strUrlWisnas = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2195/key/cf78d9c72e168bfe677972ba792787af';
  $.get(strUrlWisnas,function(data,status){
    $('#tahunWisnas').empty();
    let Wisnas = JSON.parse(JSON.stringify(data))
    for(let i=0;i<Wisnas.tahun.length;i++){
      let listTahun = $('<option value="'+Wisnas.tahun[i].val+'">'+Wisnas.tahun[i].label+'</option>');
      $('#tahunWisnas').append(listTahun);
    }
    $('#tahunWisnas').val(Wisnas.tahun[Wisnas.tahun.length-1].val);
    let newUrl = 'https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2195/th/'+$('#tahunWisnas').val()+'/key/cf78d9c72e168bfe677972ba792787af/';
    generateDatatable(newUrl,'tabContWisnas');
  })

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
  
  firstSection(url, '9999');
  sectionTwo(url+APIkey);
  sectionTwoAsal(urlAsal);
  //reloadData(url+APIkey);
  //reloadDataAsal(urlAsal);  
  // tabulasiWisnus(url+APIkey,1,['119','120','121','122','123']);
  // mapStory();
  tpkCreateFilter();
  
  $('#singleTPK').prop('checked',true);
  tpkSectionOne("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/");
  // generateDatatable('https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2201/th/123/key/cf78d9c72e168bfe677972ba792787af/','tabCont');
  // generateDatatable('https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/122/th/123/key/cf78d9c72e168bfe677972ba792787af/','tabContTPK');
  
  tpkCombineSeries("9999");
  wismanBar("https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1470/");
  wismanDoor();
  wisnasDoor();
  geoScatterWisman();
  $('#tes1').hover(function(){
    $('#menuLink1').toggleClass('hidden');
  })
  $('#btnMenu').click(function(){
    $('#menuShortcut').toggleClass('hidden');
  })

  
}


// $(document).ready(function(){
//   //alert('hi');
  
// });
