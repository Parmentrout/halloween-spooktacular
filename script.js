$(() => {
   //$('#puzzle1-container').hide();
   $('#puzzle2-container').hide();
   $('#puzzle3-container').hide();
   $('#final-container').hide();
   $('#dancing-wizard').hide();
    hideErrors();
    // If you are reading this, it is cheating.  I'm not mad, just disappointed... 6159443664
    const doorData = [{
      number: 1,
      password: 'ghostbusters',
      solved: false
    },
    {
      number: 2,
      password: 'beetlejuice',
      solved: false
    },
    {
      number: 3,
      password: 'ghost in the graveyard',
      solved: false
    }, 
    {
      number: 4,
      password: 'ghost',
      solved: false
    }];

    $('#door1-form').click(e => {
      const solved = openDoor(doorData[0]);
      if (solved) {
        $('#puzzle1-container').hide();
        $('#puzzle2-container').show();
      }
    });

    $('#door2-form').click(e => {
      const solved = openDoor(doorData[1]);
      if (solved) {
        $('#puzzle2-container').hide();
        $('#puzzle3-container').show();
      }
    });

    $('#door3-form').click(e => {
      const solved = openDoor(doorData[2]);
      if (solved) {
        $('#puzzle3-container').hide();
        $('#final-container').show();
      }
    });

    $('#final-form').click(e => {
      const solved = openDoor(doorData[3]);
      if (solved) {
        $('#final-container').hide();
        $('#dancing-wizard').show();
      }
    });

    function openDoor(door) {
      console.log('open door');
      let password = $(`#door${door.number}-code`).first().val().toLowerCase();

      if (password === door.password) {
        door.solved = true;
        hideError(door.number);
      } else {
        door.solved = false;
        showError(door.number);
      }
      return door.solved;
    }

    function showError(door) {
      $(`#door${door}Error`).show();
    }

    function hideError(door) {
      $(`#door${door}Error`).hide();
    }

    function hideErrors() {
      $('#door1Error').hide();
      $('#door2Error').hide();
      $('#door3Error').hide();
      $('#finalError').hide();
    }
})