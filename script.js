$(() => {
    hideErrors();
    // If you are reading this, it is cheating.  I'm not mad, just disappointed...
    const doorData = [{
      number: 1,
      password: 'happy hour',
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

    function unlock(element) {
      element.classList.toggle("fa-lock");
      element.classList.toggle("fa-unlock-alt");

      element.classList.toggle("large-locked");
      element.classList.toggle("large-unlocked");
    }

    for (let door of doorData) {
      $(`#door${door.number}-form`).click((event) => {
        console.log('Clicked');
        openDoor(door);
      });
    }

    function openDoor(door) {
      console.log('open door');
      let password = $(`#door${door.number}-code`).first().val().toLowerCase();

      if (password === door.password) {
        door.solved = true;
        const finalSolve = checkAll();
        if (finalSolve) {
          $('#myModal').modal();
        }
        unlock(document.querySelector(`#lock${door.number}`));  
        hideError(door.number);
      } else {
        door.solved = false;
        showError(door.number);
      }
    }

    function checkAll() {
      for (let door of doorData) {
        if (!door.solved) {
          return false;
        }
      }
      return true;
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