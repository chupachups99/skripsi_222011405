

$('#brsTable').DataTable( {
    paging:false,
    scrollY:'80dvh',
    layout:{
        topStart:'search',
        topEnd:{
            buttons:[ 
            {
              text: 'Save All',
              action: function ( ) {
                  // let n = $('#brsTable >tbody >tr').length;
                  $('.editing').each(function(){
                      let id = $(this).attr('id').split('_')[1];
                      let linkval = $(this).val();
                      let reg=/https:\/\/[A-Za-z0-9.;,\/?:@&=+$-_.!~*'()#]*/g;
                      if(linkval.match(reg)){
                          if($(this).hasClass('nodata')){
                              let reg = /\w{3,}/g;
                              let tahun = "#tahun_"+id;
                              let bulan = "#bulan_"+id;
                              let tahunval_ = $(tahun).text();
                              let tahunval = tahunval_.match(reg)[0];
                              let bulanVal_ = $(bulan).text();
                              let bulanVal = bulanVal_.match(reg)[0];
                              $.post( "http://localhost:4000/brs/insert", {link: linkval,tahun:tahunval,bulan:bulanVal, id: id });
                          }
                          else{        
                              $.post( "http://localhost:4000/brs", {link: linkval, id: id });
                          }
                      }
                      else{
                          alert('URL tidak valid pada baris '+ (n-i+1));
                      }
                      
                      
  
                  });
             
                  alert('Changes Saved');
                  // window.location.reload();
                  
              }
          }
          ]
          }
        
      }
} );

$(".saveBrs").click(function() {
    // alert($(this).attr("id"));
    let idrow = $(this).attr("id").split("_");
    idrow= parseInt(idrow[1]);
    let linkid = "#brs_"+idrow;
    let linkval = $(linkid).val();
    console.log(linkval,idrow);
    $.post( "http://localhost:4000/brs", {link: linkval, id: idrow });
    alert('Saved');
})

$(".saveBrs2").click(function() {
    // alert($(this).attr("id"));
    let idrow = $(this).attr("id").split("_");
    idrow= parseInt(idrow[1]);
    let tahun = "#tahun_"+idrow;
    let bulan = "#bulan_"+idrow;
    let linkid = "#brs_"+idrow;
    let reg = /\w{3,}/g;
    let linkval = $(linkid).val();
    let tahunval_ = $(tahun).text();
    let tahunval = tahunval_.match(reg)[0];
    let bulanVal_ = $(bulan).text();
    let bulanVal = bulanVal_.match(reg)[0];
    console.log(linkval,bulanVal,tahunval,idrow);
    $.post( "http://localhost:4000/brs/insert", {link: linkval,tahun:tahunval,bulan:bulanVal, id: idrow });
    alert('Saved');
})

$(".editBtn").click(function(){
    let idEl = $(this).attr('id');
    let id = idEl.split('_')[1];
    let idTag = "#container_"+ id;
    let linkvalue =$("#brs_"+id).attr('href'); 
    if(linkvalue==''){
        $(idTag).html("<input type='text' id='brs_"+id+"' class='rounded-xl w-full shadow editing nodata' value='"+linkvalue+"'/>");
    }
    else{
        $(idTag).html("<input type='text' id='brs_"+id+"' class='rounded-xl w-full shadow editing' value='"+linkvalue+"'/>");
    }
    
    $('#btnCancel_'+id).click(function(){
        if(linkvalue==''){
            $(idTag).html("<a id='brs_"+id+"' class='no-underline whitespace-nowrap nodata' href=''>-</a>");
        }
        else{
            $(idTag).html("<a id='brs_"+id+"' class='underline whitespace-nowrap' target='_blank' href='"+linkvalue+"'>"+linkvalue+"</a>");

        }
        $(this).prop('disabled',true);
    })
    $('#btnCancel_'+id).prop('disabled',false);


})
