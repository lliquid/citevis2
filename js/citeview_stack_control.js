
$(function() {

    var stack_functions = [stacked_layout3, stacked_layout2 , stacked_layout],
        curr = 0;

    $('#mode').click(function(){
        curr = (curr + 1) % stack_functions.length;
        stack_functions[curr].call(null);
    })

})

