$(document).ready(function(){
  $('#update_form').hide();
  $('#update').on('click', function(){
      $('#update_form').toggle();
  })
  $('#UL').hide();
  $('.nav').on('click', function(){
      $('#UL').toggle();
  })
})
console.log("dddddd");
