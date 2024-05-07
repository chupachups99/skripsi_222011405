$('#brsTable').DataTable( {} );

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