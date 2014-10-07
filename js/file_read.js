$(document).ready(function() {
 $.ajax({
        url: "https://s3.amazonaws.com/permit-tracker-9000/one_to_forty.csv",
        type: "GET",
        dataType: 'text',
        success: function(csvAsString){
        csvAsArray=csvAsString.csvToArray();
    }
 });
})