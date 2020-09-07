$(() => {
   $('#puzzle2-container').hide();
   $('#puzzle3-container').hide();
   $('#final-puzzle').hide();
    hideErrors();
    // If you are reading this, it is cheating.  I'm not mad, just disappointed...
    const doorData = [{
      number: 1,
      password: 'test1',
      solved: false
    },
    {
      number: 2,
      password: 'test2',
      solved: false
    },
    {
      number: 3,
      password: 'test3',
      solved: false
    }];

    // function unlock(element) {
    //   element.classList.toggle("fa-lock");
    //   element.classList.toggle("fa-unlock-alt");

    //   element.classList.toggle("large-locked");
    //   element.classList.toggle("large-unlocked");
    // }

    // for (let door of doorData) {
    //   $(`#door${door.number}-form`).click((event) => {
    //     console.log('Clicked');
    //     openDoor(door);
    //   });
    // }

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
      const solved = openDoor(doorData[1]);
      if (solved) {
        $('#puzzle3-container').hide();
        $('#final-puzzle').show();
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
    }
})