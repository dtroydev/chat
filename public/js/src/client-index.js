'use strict';

$(() => {
  $.ajax('rooms')
    .done((source) => {
      $('#rooms').autocomplete({
        source,
        minLength: 0,
      })
        .focus(() => {
          $('#rooms').autocomplete('search');
        });
    })
    .fail((error) => {
      console.log(`error: ${JSON.stringify(error)}`);
    });
});
