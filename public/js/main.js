var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["iPhone", "iPad", "Android", "Web Client", "IFTTT", "Other"];
  //chart colors
  $scope.colors = ['#6c6a6c','#000000','#7FFD1F','#EC872A', '#990000', '#9527C2'];
  //intial data values
  $scope.trumpData = [0,0,0,0,0,0];
  $scope.clintonData = [0,0,0,0,0,0];
  $scope.tTotal = 0;
  $scope.cTotal = 0;


  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text
    $scope.user = tweet.user.screen_name
    $scope.source = tweet.source;

    var source = '';
    var rawSource = tweet.source.toLowerCase();
    //console.log('RAWSOURCE',rawSource);
    if(rawSource.indexOf('ifttt') !== -1){
      source = 'IFTTT';
    } else {
      source = tweet.source.split('>')[1].split('<')[0].split(' ')[2];
    }



    //parse source from payload
    // var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2]
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase()
    })
    // console.log(tweet)
    //check source and increment for #trump tweets
    if (hashtags.includes('trump') ) {
      switch (source) {
        case 'iPhone': $scope.trumpData[0]++
        break;
        case 'iPad': $scope.trumpData[1]++
        break;
        case 'Android': $scope.trumpData[2]++
        break;
        case 'Web': $scope.trumpData[3]++
        break;
        case 'IFTTT': $scope.trumpData[4]++
        break;
        default: $scope.trumpData[5]++
      }
    }

    //check source and increment for #strongertogether tweets
    else if (hashtags.includes('strongertogether')) {
      switch (source) {
        case 'iPhone': $scope.clintonData[0]++
        break;
        case 'iPad': $scope.clintonData[1]++
        break;
        case 'Android': $scope.clintonData[2]++
        break;
        case 'Web': $scope.clintonData[3]++
        break;
        case 'IFTTT': $scope.clintonData[4]++
        break;
        default: $scope.clintonData[5]++
      }
    }



    $scope.gettTotal = function(){
      $scope.trumpData.reduce(function(prev,cur){
        console.log('TT',prev)
        return prev += cur;
      },0);
    }
    $scope.getcTotal = function(){
      $scope.clintonData.reduce(function(prev,cur){
        return prev += cur;
      },0);
    }


  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
