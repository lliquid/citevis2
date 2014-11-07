
$(function() {

    var stack_functions = [stacked_layout3, stacked_layout2 , stacked_layout];

    $('input[name=mode]').on('change', function() {
        var i = parseInt($('input[name=mode]:checked').val());
        stack_functions[i].call(null);
    })

    // $('#mode').click(function(){
    //     curr = (curr + 1) % stack_functions.length;
    //     stack_functions[curr].call(null);
    // })

})

