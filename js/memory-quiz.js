var memoryQuiz;

(function($) {
   "use strict";

   var options = {
      audio: {
         correct: null,
         correct2: null,
         wrong2: null,
         wrong: null,
         wait: null,
         wait2: null,
         selection: null,
         loggedInStart: null,
         loggedInLoop: null,
      },
      hideAnswerButton: false,
      teams: ['Team A', 'Team B'],
      questions: []
   };

   var currentTeam = 0,
      currentAudio,
      timerInterval,
      questions = [];

   function playAudio(name, loop) {
      var audio = options.audio;

      stopAudio();

      if (audio[name] && Audio && audio[name] instanceof Audio) {
         audio[name].loop = loop || false;
         audio[name].play();

         currentAudio = audio[name];
      } else {
         console.warn('Unknown audio:', name);
      }
   }

   function stopAudio() {
      if (currentAudio) {
         currentAudio.pause();
      }
   }

   function getCardsSize(number) {
      var screen = {
         width: $(window).width(),
         height: $(window).height() - 60
      };

      var size, scrollHeight, i, s;

      for (i = number; i > 0; i--) {
         size = screen.width / i;

         scrollHeight = Math.ceil(number / i) * size;

         if (scrollHeight > screen.height) {
            for (s = screen.width / (i + 1); s < size; s++) {
               scrollHeight = Math.ceil(number / Math.floor(screen.width / s)) * s;

               if (scrollHeight > screen.height) {
                  return s - 1;
               }
            }

            size = screen.width / (i + 1);
            break;
         }
      }

      return size;
   }

   function sizeCards() {
      var number = $('.card').length;
      var size = getCardsSize(number);
      var row = Math.floor($(window).width() / size);

      $('.card').each(function(index, card) {
         $(card).css({
            width: size + 'px',
            height: size + 'px',
            'margin-left': '0px'
         });

         if (index % row === 0) {
            var space = $(window).width() - (row * size);

            $(card).css('margin-left', Math.round(Math.random() * space / 2) + (space / 4) + 'px');

            if (Math.floor(number / row) * row === index) {
               space = $(window).width() - ((number - index) * size);

               $(card).css('margin-left', space / 2 + 'px');
            }
         }
      });
   }

   function nextTeam() {
      currentTeam = (currentTeam + 1) % options.teams.length;

      $('#mq-teams div').removeClass('current');
      $('#mq-teams div:eq(' + currentTeam + ')').addClass('current');

      if ($('#mq-container .card.active').length <= 0) {
         memoryQuiz.stop();
      }

      startTimer(30);
      playAudio('wait', true);
   }

   function addToCurrentTeamScore(points) {
      var score = $('#mq-teams div:eq(' + currentTeam + ')').attr('data-score');
      $('#mq-teams div:eq(' + currentTeam + ')').attr('data-score', parseInt(score) + parseInt(points));
   }

   function transferImg(obj) {
      obj.find('[data-img]').each(function() {
         var img = $('<div>');
         img.addClass('img');
         img.css('background-image', 'url(assets/' + $(this).attr('data-img') + ')');

         var caption = $('<div>');
         caption.text($(this).attr('data-caption'));
         caption.addClass('caption');

         $(this).append(img);
         $(this).append(caption);
      });
   }

   function showQuestion(data) {
      playAudio('wait2', true);
      startTimer(60);

      function showAnswer() {
         var answer = $('<div class="answer">' + data.answer + '</div>');
         transferImg(answer);

         $('#mq-popup').append(answer);

         $('#mq-popup').add(answer);
      }

      $.magnificPopup.open({
         items: {
            src: '<div id="mq-popup"><div>' + data.question + '</div></div>'
         },
         type: 'inline',
         modal: true,
         callbacks: {
            open: function() {
               transferImg($('#mq-popup'));

               $('#mq-popup').attr('data-points', data.points);

               if (!options.hideAnswerButton) {
                  var button = $('<a>');
                  button.attr('id', 'show-answer');
                  button.text('Zeige Antwort');
                  button.click(function() {
                     button.remove();
                     clearInterval(timerInterval);
                     $('body').off('keypress');

                     showAnswer();

                     var div = $('<div>');

                     var correct = $('<a>');
                     correct.text('Richtig');
                     correct.addClass('correct');
                     correct.click(function() {
                        addToCurrentTeamScore(data.points);

                        playAudio('correct2');

                        $.magnificPopup.close();
                        nextTeam();
                     });
                     correct.appendTo(div);

                     var wrong = $('<a>');
                     wrong.text('Falsch');
                     wrong.addClass('wrong');
                     wrong.click(function() {
                        playAudio('wrong2');

                        $.magnificPopup.close();
                        nextTeam();
                     });
                     wrong.appendTo(div);

                     div.appendTo('#mq-popup');

                     return false;
                  });

                  $('#mq-popup').append($('<div>').append(button));
               }
            }
         }
      });

      $('body').keypress(function(ev) {
         if (ev.keyCode !== 114 && ev.keyCode !== 102) {
            return;
         }

         $('#show-answer').hide();

         clearInterval(timerInterval);

         if (options.audio.loggedInStart) {
            options.audio.loggedInStart.play();
         }
         playAudio('loggedInLoop', true);

         setTimeout(function() {
            showAnswer();

            $('#mq-popup').click(function() {
               $.magnificPopup.close();
               nextTeam();
            });

            if (ev.key === 'r' || ev.keyCode === 114) {
               addToCurrentTeamScore(data.points);
               $('#mq-popup .answer').addClass('correct');

               playAudio('correct2');
            } else if (ev.key === 'f' || ev.keyCode === 102) {
               $('#mq-popup .answer').addClass('wrong');

               playAudio('wrong2');
            }
         }, 8000);

         $('body').off('keypress');
      });
   }

   function correctPair(card) {
      var data = $(card).data('data');

      //addToCurrentTeamScore(data.points);
      clearInterval(timerInterval);
      playAudio('correct');

      setTimeout(function() {
         $('.card.flip').removeClass('flip active').find('.flip-container').remove();

         showQuestion(data);
      }, 3000);
   }

   function wrongPair() {
      clearInterval(timerInterval);
      playAudio('wrong');

      setTimeout(function() {
         $('.card').removeClass('flip');
         nextTeam();
      }, 3000);
   }

   function timeIsOver() {
      stopAudio();
   }

   function startTimer(time) {
      var el = $('#mq-timer');
      var startTime = time;

      el.css('background-position', '0 -100%');
      el.text(time);
      clearInterval(timerInterval);

      timerInterval = setInterval(function() {
         time = parseInt(el.text()) - 1;

         el.text(time);
         el.css('background-position', '0 -' + Math.round(time / startTime * 100) + '%');

         if (time <= 0) {
            clearInterval(timerInterval);
            timeIsOver();
         }
      }, 1000);
   }

   function start() { // jshint ignore:line
      startTimer(30);

      playAudio('wait', true);
   }

   memoryQuiz = function(o) {
      var div, i, data, no = 0;

      options = $.extend(options, o || {});

      questions = options.questions;

      if (questions.length <= 0) {
         console.log('No questions available');
         return;
      }

      questions.map(function(obj, index) {
         obj.id = index;
         obj.altColor = 'rgb(' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ', ' + parseInt(Math.random() * 255) + ')';
         return obj;
      });

      // duplicate questions
      var cardData = $.merge(questions, questions);

      // initiate container
      $('#mq-container').remove();
      var container = $('<div id="mq-container"/>').appendTo('body');

      // initiate memory cards
      while (cardData.length > 0) {
         i = Math.round(Math.random() * (cardData.length - 1));
         data = cardData.splice(i, 1)[0];

         div = $('<div><div class="flip-container"><div class="flipper"><div class="front"><div/></div><div class="back"/></div></div></div>');
         div.addClass('card active');
         div.css({
            'transform': 'rotate(' + (Math.ceil(Math.random() * 16) - 8) + 'deg)',
            'position': 'relative',
            'top': ((Math.random() * 16) - 8) + 'px',
            'left': ((Math.random() * 16) - 8) + 'px'
         });
         div.data('id', data.id);
         div.data('points', data.points);
         div.data('data', data);

         div.find('.front div').text(no++);
         div.find('.back').css('background-color', data.altColor);
         div.find('.back').css('background-image', 'url(assets/card-' + data.id + '.jpg)');
         //div.find('.front').css('background-image', 'url(assets/card-'+data.id+'.jpg)');
         //div.find('.front div').text(data.answer);

         $(container).append(div);
      }

      $('.card').click(function() {
         if ($(this).find('.flip-container').length === 0) {
            return;
         }

         if ($('.card.flip').length === 1) {
            if ($('.card.flip')[0] === $(this)[0]) {
               return;
            }
            if ($('.card.flip').data('id') === $(this).data('id')) {
               correctPair($(this));
            } else {
               wrongPair();
            }
         } else if ($('.card.flip').length > 1) {
            return;
         }

         $(this).toggleClass('flip');
      });

      sizeCards();
      $(window).resize(function() {
         sizeCards();
      });

      // Initiate teams
      $('#mq-teams').remove();
      $('body').append('<div id="mq-teams"/>');

      var team,
         teams = options.teams;
      for (team in teams) {
         div = $('<div>');
         div.text(teams[team]);
         div.attr('data-score', 0);
         $('#mq-teams').append(div);
      }

      $('#mq-teams div:eq(0)').addClass('current');

      // Initiate timer
      $('#mq-timer').remove();
      $('body').append('<div id="mq-timer"/>');

      $('#mq-timer').click(function() {
         nextTeam();
      });
   };

   memoryQuiz.stop = function() {
      clearInterval(timerInterval);
      stopAudio();

      $.magnificPopup.close();

      $('#mq-teams, #mq-timer, #mq-container').remove();
   };
}(jQuery));
