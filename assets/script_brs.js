$('#brsTable').DataTable( {
    // ajax: {
    //     url: 'http://localhost:4000/brs',
    //     dataSrc: 'data'
    // },
    // columns: [
    //     {"data":"Tahun"},
    //     {"data":"Bulan"},
    //     {"data":"Link"}]
} );

$(".saveBrs").click(function() {
    // alert($(this).attr("id"));
    let idrow = $(this).attr("id").split("_");
    idrow= parseInt(idrow[1])+1;
    let linkid = "#brs_"+idrow;
    let linkval = $(linkid).val();
    console.log(linkval,idrow);
    $.post( "http://localhost:4000/brs", {link: linkval, id: idrow });
    alert('Saved');
})