const answer1 = new SlotMachine(document.querySelector('#clue1'), {
  active: 0,
  auto: false
});
const answer2 = new SlotMachine(document.querySelector('#clue2'), {
  active: 0,
  auto: false
});
const answer3 = new SlotMachine(document.querySelector('#clue3'), {
  active: 0,
  auto: false
});

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:687b1ef2-20a7-4a7b-908a-e23815ac0c87'
})
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
   
const params = {
  TableName: "mystery-results",
  Item: event
};
const sessionKey = 'girlScoutMystery';

$(() => {
   //$('#puzzle1-container').hide();
   let sessionData = getSessionData();
   initializeCryptex();
   if (!sessionData) {
     $('#sessionSubmit').click((event) => {
       const email = $('#emailInput').val();
       const optInInput = $('#optInInput').prop('checked');

       sessionData = {email: email, company: '', optIn: optInInput};
       console.log(sessionData);
       saveToSession(sessionData);
       saveData('start');
       $('#emailModal').modal('hide');
     });

     $('#emailModal').modal({backdrop: 'static', keyboard: false});
   }

   $('#puzzle2-container').hide();
   $('#puzzle3-container').hide();
   $('#final-container').hide();
   $('#dancing-wizard').hide();
    hideErrors();
    // If you are reading this, it is cheating.  I'm not mad, just disappointed...
    const doorData = [{
      number: 1,
      passwords: ['thinmints','thinmint'],
      solved: false
    },
    {
      number: 2,
      passwords: ['smores','smore'],
      solved: false
    },
    {
      number: 3,
      passwords: ['samoa','samoas'],
      solved: false
    }];

    $('#door1-form').click(e => {
      const solved = openDoor(doorData[0]);
      if (solved) {
        saveData('Door 1 open');
        $('#puzzle1-container').hide();
        $('#puzzle2-container').show();
      }
    });

    $('#door2-form').click(e => {
      const solved = openDoor(doorData[1]);
      if (solved) {
        saveData('Puzzle 2 Solved');
        $('#puzzle2-container').hide();
        $('#puzzle3-container').show();
      }
    });

    $('#door3-form').click(e => {
      const solved = openDoor(doorData[2]);
      if (solved) {
        saveData('Puzzle 3 Solved');
        $('#puzzle3-container').hide();
        $('#final-container').show();
      }
    });

    let initialCode = [0,0,0];
    // $('#final-form').click(e => {
    //  // const solved = openDoor(doorData[3]);
    //   if (solved) {
    //     saveData('stop');
    //     $('#final-container').hide();
    //     $('#dancing-wizard').show();
    //   }
    // });

    function initializeCryptex() {
      $('#clue1').click((event) => {
        const answer = answer1.prev();
        isFinalSolved(0, answer);
      });
      $('#clue2').click((event) => {
        const answer = answer2.prev();
        isFinalSolved(1, answer);
      });
      $('#clue3').click((event) => {
        const answer = answer3.prev();
        isFinalSolved(2, answer);
      });
    }

    
    function isFinalSolved(portal, number) {
      console.log(portal);
      console.log(number);
      const correctAnswer = JSON.stringify([2,0,4]);
      initialCode[portal] = number;
      const stringMe = JSON.stringify(initialCode);
      if (correctAnswer === stringMe) {
        saveData('stop');
         $('#timeContainer').show();
         $('#final-container').hide();
         $('#dancing-wizard').show();
        $('#fireworks').css('display','block');
      }
    }

    function openDoor(door) {
      let lower = $(`#door${door.number}-code`).first().val().toLowerCase().replace("'","");
      let password = lower.split(' ').join('');
      if (door.passwords.includes(password)) {
        door.solved = true;
        hideError(door.number);
      } else {
        saveData(`Incorrect entry: ${password}`);
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

    function saveData(event) {
      const payload = `{
        "puzzle": "${sessionKey}",
        "email": "${sessionData.email}",
        "company": "${sessionData.company}",
        "optIn": ${sessionData.optIn},
        "eventName": "${event}",
        "time": ${Date.now()}
      }`;
      
      var params = {
        FunctionName: 'mystery-results-v2-put', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        Payload: payload
      };
      lambda.invoke(params, function(err, data) {
        if (err) {
          console.error(err);
        } else {
          const json = JSON.parse(data.Payload);
          if (json && json.data && json.data.events) {
            let allEvents = json.data.events;
            let startTime = 0;
            let endTime = 0;
        
            for (let event of allEvents) {
              if (event.name === 'start' && startTime === 0) { // First one
                startTime = event.time;
              }
              if (event.name === 'stop' && endTime === 0) {
                endTime = event.time;
              }
            }
            const totalTime = endTime - startTime;
            if (totalTime > 0) {
              $('#totalTime').text(msToTime(totalTime));
            }
          }
        }
      })
    }

    // Session data
    function getSessionData() {
      let result = window.sessionStorage.getItem(sessionKey); 
      if (!result) { return null; }
      return JSON.parse(result);
    }

    function saveToSession(sessionData) {
      removeFromSession();
      window.sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
    }

    function removeFromSession() {
      window.sessionStorage.removeItem(sessionKey);
    }

    //Time function
    function msToTime(duration) {
      var milliseconds = parseInt((duration%1000)/100)
          , seconds = parseInt((duration/1000)%60)
          , minutes = parseInt((duration/(1000*60))%60)
          , hours = parseInt((duration/(1000*60*60))%24);
  
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
  
      return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }
})