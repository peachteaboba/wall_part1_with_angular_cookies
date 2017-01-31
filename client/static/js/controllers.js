/**
 * Created by andyf on 1/22/17.
 */

app.controller('loginController', function($scope, loginFactory, $location, $cookies){
  $scope.test = "hello world";


  // Looks for existing cookie and will do stuff depending on if the cookie exists.
  function checkCookie(){

    var cookie = $cookies.get('cookie');
    if(!cookie){
      // cookie is undefined
      console.log("No cookie found!");

    } else {
      console.log("Cookie found -----> " + cookie );
      console.log(cookie);


      // Set user data in the factory and then redirect.
      loginFactory.setUser(JSON.parse(cookie), function(){
        $location.url('/wall');
      });


    }

  };
  checkCookie();


  //logout user
  $scope.clearCookie = function(){
    $cookies.remove('cookie');
    checkCookie();
  };
  //end user logout




  $scope.regUser = function(){
    console.log($scope.reg);
    $scope.error = "";
    $scope.user = {};

    if($scope.reg.password == $scope.reg.password_confirm && $scope.reg.name && $scope.reg.email && $scope.reg.password){
      // call factory method to register user
      loginFactory.register($scope.reg, function(output){
        console.log(output);
        console.log("back from the factory ----> finished");
        $scope.user = output.data;

        if(output.data.error){
          $scope.error = output.data.error;
        } else {
          loginFactory.setUser(output.data, function(){

            // set cookie and then redirect
            $cookies.put('cookie', JSON.stringify(output.data));


            $location.url('/wall');
          });
        }

      });
    } else {
      $scope.error = "passwords do no match!";
    }


    // clear input
    $scope.reg = {};
  }

  $scope.loginUser = function(){
    console.log($scope.login);

    // call factory method to log in user
    loginFactory.login($scope.login, function(output){
      console.log(output);
      console.log("back from the factory ----> finished login");

      if(output.data.error){
        $scope.error = output.data.error;
      } else {
        loginFactory.setUser(output.data, function(){

          // set cookie and then redirect



          $cookies.put('cookie', JSON.stringify(output.data));



          $location.url('/wall');
        });
      }


    });

    // clear input
    $scope.login = {};
  }


});


app.controller('wallController', function($scope, loginFactory, $location, $cookies){
  console.log("in the wall controller");
  $scope.user = {};


  loginFactory.getUser(function(data){
    $scope.user = data;
    console.log($scope.user);

    if(!data._id){
      console.log("no data");
      $location.url('/');
    }


  });


  //logout user
  $scope.clearCookie = function(){
    $cookies.remove('cookie');
    $location.url('/');
  };
  //end user logout

});
